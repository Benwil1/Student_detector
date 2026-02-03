import pandas as pd
import numpy as np
import os
import joblib
import sys

# Add scripts to path to import local modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, PowerTransformer
from sklearn.isotonic import IsotonicRegression
from sklearn.metrics import r2_score

# Import Modular Features
from scripts.features.stylometry import StylometryExtractor

# Configuration
BASE_PATH = '/Users/bernard/Downloads/Main_Thesis-2'
HUMAN_TEXT_DIR = os.path.join(BASE_PATH, 'student-humanizer-plus/Human_text')
AI_HUMAN_CSV = os.path.join(BASE_PATH, 'AI_Human.csv')
MAX_ROWS_LARGE = 150000



# --- DATA LOADING ---
def load_ai_human():
    print("Loading AI_Human.csv (AI samples)... This may take 60 seconds.")
    try:
        chunk_size = 100000
        chunks = []
        for i, chunk in enumerate(pd.read_csv(AI_HUMAN_CSV, chunksize=chunk_size)):
            chunk['text'] = chunk['text'].astype(str)
            chunk['generated'] = pd.to_numeric(chunk['generated'], errors='coerce')
            chunk = chunk.dropna()
            chunks.append(chunk)
            print(f" -> Loaded chunk {i+1} ({len(chunk)} rows)...")

        print("Merging chunks...")
        df = pd.concat(chunks, ignore_index=True)
        return df
    except Exception as e:
        print(f"Skipping AI_Human.csv: {e}")
        return pd.DataFrame()

def load_csv_dataset(filename, source_name, label, max_rows=None):
    path = os.path.join(HUMAN_TEXT_DIR, filename)
    print(f"Loading {source_name} from {path}...")
    try:
        if not os.path.exists(path):
            print(f"File not found: {path}")
            return pd.DataFrame()
            
        df = pd.read_csv(path, nrows=max_rows)
        
        text_col = None
        for col in ['Text', 'text', 'article', 'content']:
            if col in df.columns:
                text_col = col
                break
        
        if text_col:
            df = df[[text_col]].rename(columns={text_col: 'text'})
            df['generated'] = float(label)
            print(f"-> Loaded {len(df)} rows from {source_name}")
            return df
        else:
            print(f"Could not find text column in {source_name}.")
            return pd.DataFrame()
            
    except Exception as e:
        print(f"Skipping {source_name}: {e}")
        return pd.DataFrame()

# --- MAIN EXECUTION ---
# 1. Load Data
df_main = load_ai_human()
ai_data = df_main[df_main['generated'] == 1.0].copy()
human_from_main = df_main[df_main['generated'] == 0.0].copy()

df_wiki = load_csv_dataset('Wikipedia.csv', 'Wikipedia', 0.0)
df_cnn = load_csv_dataset('CNN_DailyMail.csv', 'CNN', 0.0)
df_human_large = load_csv_dataset('Human.csv', 'Human (Large)', 0.0, max_rows=MAX_ROWS_LARGE)
df_gutenberg = load_csv_dataset('Gutenberg.csv', 'Gutenberg', 0.0, max_rows=MAX_ROWS_LARGE)

# 2. Consolidate & Balance
human_data = pd.concat([human_from_main, df_wiki, df_cnn, df_human_large, df_gutenberg], ignore_index=True)
human_data = human_data.dropna()
ai_data = ai_data.dropna()

print(f"\nTotal AI Samples: {len(ai_data)}")
print(f"Total Human Samples: {len(human_data)}")

MAX_TRAIN_SAMPLES = 25000 
n_balance = min(len(ai_data), len(human_data), MAX_TRAIN_SAMPLES)

print(f"Balancing to {n_balance} samples per class (Fast Mode)...")
ai_subset = ai_data.sample(n_balance, random_state=42)
human_subset = human_data.sample(n_balance, random_state=42)
df_final = pd.concat([ai_subset, human_subset])


# 3. REGRESSION PIPELINE CONFIGURATION
print("Configuring commercial-grade pipeline...")

# Explicit Signal Renaming
y_signal = 1.0 - df_final['generated'] # 1.0 = Human, 0.0 = AI
y_signal.name = "human_likelihood"

# SPLIT STRATEGY: Train / Test / Calibration
# 1. Main Split (80% Train, 20% Held-out)
X_temp, X_test, y_temp, y_test = train_test_split(
    df_final['text'], 
    y_signal, 
    test_size=0.2, 
    random_state=42
)

# 2. Calibration Split (From the 80% chunk, hold out 10% for pure calibration)
# This ensures calibration data is NEVER seen by the regressor
X_train, X_calib, y_train, y_calib = train_test_split(
    X_temp, 
    y_temp, 
    test_size=0.1, # 10% of 80% = 8% total data for calibration
    random_state=42
)

print(f"Split Sizes: Train={len(X_train)}, Calibration={len(X_calib)}, Test={len(X_test)}")

pipeline = Pipeline([
    ('features', FeatureUnion([
        # Surface Model (Word n-grams)
        ('word_tfidf', TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=5,
            max_features=8000,
            sublinear_tf=True,
            stop_words='english'
        )),
        
        # Subword Model (Char n-grams)
        ('char_tfidf', TfidfVectorizer(
            analyzer='char',
            ngram_range=(3, 5),
            min_df=5,
            max_features=6000,
            sublinear_tf=True
        )),
        
        # Stylometry Model (Stats) - UPWEIGHTED 2.5x
        ('stylometry', Pipeline([
            ('extractor', StylometryExtractor()),
            ('scaler', StandardScaler()), 
            ('normalizer', PowerTransformer(method='yeo-johnson')) 
        ]))
    ], transformer_weights={
        'word_tfidf': 1.0,
        'char_tfidf': 1.0,
        'stylometry': 2.5 
    })),
    
    # Regression Output
    ('regressor', SGDRegressor(
        loss='huber', 
        max_iter=1000, 
        alpha=0.001, 
        epsilon=0.1,
        learning_rate='adaptive',
        eta0=0.01,
        random_state=42
    ))
])

# 4. Train Main Model (Regressor)
print(f"Training Regressor on {len(X_train)} rows...")
pipeline.fit(X_train, y_train)

# 5. Pipeline Calibration (The "Trust" Layer)
print(f"Calibrating on {len(X_calib)} held-out rows...")
# Get raw uncalibrated scores from the calibration set
raw_calib_preds = pipeline.predict(X_calib)

# Fit Isotonic Regression to map Raw Scores -> True Probabilities
calibrator = IsotonicRegression(out_of_bounds='clip', y_min=0.0, y_max=1.0)
calibrator.fit(raw_calib_preds, y_calib)

# 6. Evaluate on Test Set (Unseen by both)
print(f"Evaluating on {len(X_test)} test rows...")
raw_test_preds = pipeline.predict(X_test)
final_probs = calibrator.transform(raw_test_preds)

# R2 Score (Regressor Quality)
r2 = pipeline.score(X_test, y_test)
print(f"\nEvaluation (Regressor R2): {r2:.4f}")

# Classification Metrics (at 0.5 threshold)
from sklearn.metrics import classification_report
binary_preds = [1 if p > 0.5 else 0 for p in final_probs]
binary_targets = [1 if t > 0.5 else 0 for t in y_test]
print(classification_report(binary_targets, binary_preds, target_names=['AI', 'Human']))

# 7. Save Artifacts
output_dir = os.path.join(os.path.dirname(__file__), 'artifacts')
os.makedirs(output_dir, exist_ok=True)

# Save main model
joblib.dump(pipeline, os.path.join(output_dir, 'model.joblib'))
# Save calibrator separately (Modular design)
joblib.dump(calibrator, os.path.join(output_dir, 'calibrator.joblib'))

# Save Metadata (Version Lock)
metadata = {
    "model_version": "1.0.0",
    "stylometry_version": "1.0.0",
    "trained_at": pd.Timestamp.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
    "fast_mode": True,
    "n_samples": n_balance * 2,
    "r2_score": r2
}
joblib.dump(metadata, os.path.join(output_dir, 'metadata.pkl'))

print(f"Artifacts saved to {output_dir}/")
