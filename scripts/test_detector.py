
import joblib
import os
import sys

# Color codes
GREEN = '\033[92m'
RED = '\033[91m'
RESET = '\033[0m'

def test_model():
    model_path = 'scripts/ai_detector_model.pkl'
    if not os.path.exists(model_path):
        print(f"{RED}Model file not found at {model_path}{RESET}")
        return

    print("Loading model...")
    try:
        pipeline = joblib.load(model_path)
    except Exception as e:
        print(f"{RED}Failed to load model: {e}{RESET}")
        return

    examples = [
        ("Human (Simple)", "I went to the store and bought some milk because I was out."),
        ("Human (Academic)", "The nuances of the socio-economic factors cannot be overstated when analyzing the impact of the policy."),
        ("AI (Typical)", "Furthermore, it is important to consider the various implications of this decision in the broader context."),
        ("AI (Robotic)", "In conclusion, the results demonstrate a improved efficiency. Therefore, we should proceed with the plan."),
    ]

    print("\n" + "="*40)
    print("      CURRENT MODEL PREDICTIONS")
    print("="*40)
    
    for label, text in examples:
        prob_ai = pipeline.predict_proba([text])[0][1]
        percent = prob_ai * 100
        
        color = RED if percent > 50 else GREEN
        prediction = "AI" if percent > 50 else "HUMAN"
        
        print(f"\nType: {label}")
        print(f"Text: {text[:60]}...")
        print(f"Score: {color}{percent:.2f}% AI ({prediction}){RESET}")

if __name__ == "__main__":
    test_model()
