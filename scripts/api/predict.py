
import os
import joblib
import sys
import numpy as np
import pandas as pd

# Add standard import path for shared modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

# Import StylometryExtractor to ensure unpickling works
from scripts.features.stylometry import StylometryExtractor

class CommercialDetector:
    """
    Production-grade inference wrapper for the AI Detector.
    Handles artifact loading, probability calibration, and signal explanation.
    """
    def __init__(self, artifacts_dir='scripts/artifacts'):
        self.artifacts_dir = artifacts_dir
        self.pipeline = None
        self.calibrator = None
        self.metadata = None
        self._load_artifacts()

    def _load_artifacts(self):
        try:
            model_path = os.path.join(self.artifacts_dir, 'model.joblib')
            calib_path = os.path.join(self.artifacts_dir, 'calibrator.joblib')
            meta_path = os.path.join(self.artifacts_dir, 'metadata.pkl')
            
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model not found at {model_path}")

            self.pipeline = joblib.load(model_path)
            self.calibrator = joblib.load(calib_path)
            self.metadata = joblib.load(meta_path)
            print(f"Loaded Detector v{self.metadata.get('model_version', 'Unknown')}")
            
        except Exception as e:
            print(f"CRITICAL: Failed to load detector artifacts: {e}")
            self.pipeline = None

    def _compute_confidence(self, features, raw_score):
        """
        Commercial Confidence Logic:
        Low Confidence if: 
        - Text is short
        - Stylometry disagrees with Surface
        - Score is ambiguous (0.45 - 0.55)
        """
        # Feature Unpacking (This relies on the fact that we can't easily extract features from the full pipeline)
        # So we use heuristics on the input text instead for speed and reliability
        
        # 1. Ambiguity Penalty
        ambiguity_penalty = 0
        if 0.40 <= raw_score <= 0.60:
            ambiguity_penalty = 0.5 # Huge penalty for gray zone

        # 2. Length Penalty is handled in predict, but let's reinforce it
        # (Passed as an argument context usually, but we keep it simple)
        
        # 3. Score Extremity Reward
        # If score is > 0.9 or < 0.1, confidence increases
        extremity_bonus = 0
        if raw_score > 0.85 or raw_score < 0.15:
            extremity_bonus = 0.3

        # Final Calculation (Simplified for this architecture)
        # We start at 0.5 (Medium)
        base_conf = 0.5
        base_conf -= ambiguity_penalty
        base_conf += extremity_bonus
        
        if base_conf > 0.7: return "HIGH"
        if base_conf < 0.3: return "LOW"
        return "MEDIUM"

    def predict(self, text, domain=None):
        """
        Production Inference.
        domain: 'esl', 'academic', 'general' (optional hint)
        """
        if not self.pipeline:
            return {'error': 'Model not loaded'}

        # 1. Edge Case Handling (Short Text)
        if not text or len(text.strip()) < 15:
             return {
                 'human_score': 0.5, 
                 'classification': 'Cannot Determine',
                 'confidence': 'LOW', 
                 'reason': 'Text too short'
             }

        try:
            # 2. Raw Prediction
            raw_val = self.pipeline.predict([text])[0]
            
            # 3. Calibration
            prob_score = self.calibrator.transform([raw_val])[0]
            
            # 4. Domain-Adaptive Thresholding & Ambiguity
            # Map Probs to Classes using Domain Logic
            thresholds = {
                'esl': 0.55,      # Stricter for ESL (needs more evidence to be called Human)
                'academic': 0.50, # Neutral
                'general': 0.60,  # High bar for "Human" tag
                'ai': 0.45
            }
            thresh = thresholds.get(domain, 0.50) # Default to 0.50 neutral
            
            # Gray Zone Logic (Ambiguity)
            # Commercial Safety: If it's 0.45-0.55, just say we don't know.
            if 0.45 < prob_score < 0.55:
                classification = "Cannot Determine"
            else:
                classification = "Likely Human" if prob_score >= thresh else "Likely AI"
            
            # 5. Confidence Modeling
            confidence = self._compute_confidence(None, prob_score)
            
            # 6. Length Override for Confidence
            word_count = len(text.split())
            if word_count < 50:
                confidence = "LOW"
            elif word_count < 100 and confidence == "HIGH":
                confidence = "MEDIUM"

            # 7. Legal/Product Safe Output
            return {
                'human_score': float(prob_score),
                'ai_score': 1.0 - float(prob_score),
                'classification': classification,
                'confidence': confidence,
                'meta': {
                    'version': self.metadata.get('model_version'),
                    'domain_bias': domain,
                    'raw_score': float(raw_val)
                },
                'message': self._get_legal_message(classification, confidence)
            }
            
        except Exception as e:
            return {'error': str(e)}

    def _get_legal_message(self, label, conf):
        if label == "Cannot Determine":
            return "The text structure is ambiguous or too short for definitive analysis."
        
        prefix = "This text exhibits patterns"
        if label == "Likely Human":
            return f"{prefix} consistent with human writing. ({conf} Confidence)"
        else:
            return f"{prefix} often found in AI-generated content. ({conf} Confidence)"

# CLI Test Interface
if __name__ == "__main__":
    detector = CommercialDetector()
    if len(sys.argv) > 1:
        text = sys.argv[1]
        print(detector.predict(text))
    else:
        print("Usage: python3 predict.py 'Your text here'")
