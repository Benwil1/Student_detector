
import os
import joblib
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score

# Add root path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from scripts.features.stylometry import StylometryExtractor

STRESS_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'stress_tests')
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'artifacts')

class StressTester:
    def __init__(self):
        self.pipeline = None
        self.calibrator = None
        self._load_artifacts()

    def _load_artifacts(self):
        try:
            model_path = os.path.join(ARTIFACTS_DIR, 'model.joblib')
            calib_path = os.path.join(ARTIFACTS_DIR, 'calibrator.joblib')
            
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model not found at {model_path}")
            
            self.pipeline = joblib.load(model_path)
            self.calibrator = joblib.load(calib_path)
            print("Loaded production artifacts for stress testing.")
        except Exception as e:
            print(f"CRITICAL: Failed to load artifacts: {e}")
            sys.exit(1)

    def evaluate_threat(self, threat_name, texts, expected_label):
        """
        Evaluates a specific threat category.
        expected_label: 'Human' (should be > 0.5) or 'AI' (should be < 0.5)
        """
        print(f"\nEvaluating Threat: {threat_name} (N={len(texts)})")
        
        # 1. Raw Prediction
        raw_scores = self.pipeline.predict(texts)
        
        # 2. Calibration
        probs = self.calibrator.transform(raw_scores)
        
        # 3. Stats
        mean_prob = np.mean(probs)
        std_prob = np.std(probs)
        
        # 4. Violation Check
        if expected_label == 'Human':
            # False Positive check: How many < 0.4?
            failures = sum(1 for p in probs if p < 0.4)
            fail_rate = failures / len(texts)
            print(f"  -> Mean Score: {mean_prob:.3f} (±{std_prob:.3f})")
            print(f"  -> False Positive Rate (< 0.4): {fail_rate*100:.1f}%")
            if fail_rate > 0.10:
                print("  -> CRIMSON FLAG: High FP rate on humans!")
        else:
            # False Negative check: How many > 0.6?
            failures = sum(1 for p in probs if p > 0.6)
            fail_rate = failures / len(texts)
            print(f"  -> Mean Score: {mean_prob:.3f} (±{std_prob:.3f})")
            print(f"  -> False Negative Rate (> 0.6): {fail_rate*100:.1f}%")
            
        return probs

    def generate_synthetic_stress_data(self):
        """
        Since we don't have the external CSVs yet, we generate synthetic 
        stress cases to sanity check the logic.
        """
        print("\n--- Generating Synthetic Stress Data ---")
        
        # 1. Synthetic "ESL Human" (Simple, repetitive, but human logic)
        esl_texts = [
            "I go to the shop. It is nice day. I like buy apple. The apple is red.",
            "My friend name is John. He is good boy. We play football every day.",
            "Homework is hard. But I try my best. Teacher is good.",
            "The weather is hot. I drink water. Water is good for health.",
            "I want to be doctor. Doctor help people. It is good job."
        ] * 10 
        
        # 2. Synthetic "Academic" (Formal, complex, specific starts)
        academic_texts = [
            "In conclusion, the data suggests a significant correlation between the variables.",
            "Moreover, the socio-economic impact cannot be overstated in this context.",
            "However, previous studies fail to account for the stochastic nature of the system.",
            "Furthermore, the methodology employed requires rigorous validation.",
            "Thus, the hypothesis is supported by the empirical evidence presented."
        ] * 10

        # 3. Synthetic "AI" (Robotic, perfect grammar, transition heavy)
        ai_texts = [
            "Furthermore, it is important to consider the various implications of this decision. Additionally, the results are promising.",
            "In summary, the benefits of exercise are numerous. First, it improves health. Second, it boosts mood.",
            "To begin with, renewable energy is crucial for the future. It reduces carbon emissions and saves money.",
            "On one hand, technology is good. On the other hand, it has drawbacks. Therefore we must be careful.",
            "Ultimately, success depends on hard work and dedication. Without these, failure is likely."
        ] * 10
        
        return {
            'ESL Human': (esl_texts, 'Human'),
            'Academic Human': (academic_texts, 'Human'),
            'Standard AI': (ai_texts, 'AI')
        }

    def run(self):
        data = self.generate_synthetic_stress_data()
        
        for threat, (texts, label) in data.items():
            self.evaluate_threat(threat, texts, label)

if __name__ == "__main__":
    tester = StressTester()
    tester.run()
