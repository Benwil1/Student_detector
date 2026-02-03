import joblib
import pandas as pd

model_path = 'scripts/ai_detector_model.pkl'
pipeline = joblib.load(model_path)

print("Classes:", pipeline.classes_)

examples = [
    "I went to the store.",
    "The neural network optimizes the loss function.",
    "In conclusion, the results are significant."
]

for text in examples:
    probs = pipeline.predict_proba([text])[0]
    print(f"Text: '{text}' -> Probs: {probs}")
