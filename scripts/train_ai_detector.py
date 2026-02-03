import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
import joblib

# 1. Load Data (Optimized)
print("Loading dataset (sampling top 50k Human + 50k AI)...")
try:
    # Load chunks to be memory safe, but for now just reading subset
    # Since csv is mixed, we read all but take a random sample
    df = pd.read_csv('/Users/bernard/Downloads/Main_Thesis-2/AI_Human.csv')
    df['text'] = df['text'].astype(str)
    df['generated'] = pd.to_numeric(df['generated'], errors='coerce')
    df = df.dropna()
    
    # Balanced sampling: 50k of each class (or max available)
    df_ai = df[df['generated'] == 1.0]
    df_human = df[df['generated'] == 0.0]
    
    n_sample = 50000
    df_ai = df_ai.sample(min(n_sample, len(df_ai)), random_state=42)
    df_human = df_human.sample(min(n_sample, len(df_human)), random_state=42)
    
    df = pd.concat([df_ai, df_human])
    print(f"Working with {len(df)} balanced rows.")
    
except Exception as e:
    print(f"Error loading CSV: {e}")
    exit(1)

# 2. Split Data
X_train, X_test, y_train, y_test = train_test_split(
    df['text'], df['generated'], test_size=0.2, random_state=42
)
print(f"Training on {len(X_train)} samples...")

# 3. Build Pipeline (Optimized for Speed)
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 2),  # Reduced from (1,3) for speed
        min_df=10,           # Ignore very rare words
        max_features=10000,  # Cap features
        stop_words='english'
    )),
    ('clf', SGDClassifier(loss='modified_huber', max_iter=1000, random_state=42, n_jobs=-1)) # Parallel training
])

# 4. Train
print("Training model...")
pipeline.fit(X_train, y_train)

# 5. Evaluate
print("Evaluating...")
preds = pipeline.predict(X_test)
acc = accuracy_score(y_test, preds)

print(f"\n=== MODEL ACCURACY: {acc*100:.2f}% ===")
print(classification_report(y_test, preds, target_names=['Human', 'AI']))

# 6. Save Model
model_path = 'scripts/ai_detector_model.pkl'
joblib.dump(pipeline, model_path)
print(f"Model saved to {model_path}")

# 7. Test
print("\n--- SANITY CHECK ---")
examples = [
    "I literally think it's kinda cool how rain smells, like when I was a kid.", 
    "It is significant to note that atmospheric conditions play a role in petrichor formation."
]
for ex in examples:
    prob = pipeline.predict_proba([ex])[0][1]
    label = "AI" if prob > 0.5 else "HUMAN"
    print(f"Text: '{ex[:50]}...'\n  -> Prediction: {label} ({prob*100:.1f}% AI)\n")
