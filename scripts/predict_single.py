import sys
import joblib
import os

# Suppress warnings
import warnings
warnings.filterwarnings("ignore")

def predict(text):
    try:
        model_path = 'scripts/ai_detector_model.pkl'
        if not os.path.exists(model_path):
            print("Model file not found.")
            return

        pipeline = joblib.load(model_path)
        prob = pipeline.predict_proba([text])[0][1] # Probability of AI
        print(f"{prob:.4f}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = sys.argv[1]
        predict(text)
    else:
        # Read from stdin
        text = sys.stdin.read()
        predict(text)
