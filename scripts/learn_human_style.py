import os
import json
import re
import glob
import numpy as np
from collections import Counter

# CONFIG
DATA_DIR = os.path.join(os.getcwd(), 'data/human_mass')
OUTPUT_FILE = os.path.join(os.getcwd(), 'src/lib/human_style_profile.json')

def analyze_text(text):
    # Basic cleaning
    text = text.strip()
    if not text: return None
    
    # Sentence Tokenization (Simple)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 1]
    
    if not sentences: return None
    
    # 1. Sentence Lengths (Words)
    sent_lengths = [len(s.split()) for s in sentences]
    
    # 2. Sentence Openers (First word)
    openers = [s.split()[0].lower() for s in sentences if s]
    
    # 3. Punctuation (Commas per sentence)
    commas = [s.count(',') for s in sentences]
    
    # 4. Paragraph Analysis (Approximate by newlines)
    paragraphs = text.split('\n\n')
    para_lengths = [len(p.split('.')) for p in paragraphs if len(p) > 10]
    
    return {
        'lengths': sent_lengths,
        'openers': openers,
        'commas': commas,
        'para_lengths': para_lengths
    }

def main():
    print(f"📖 Reading Human Data from: {DATA_DIR}")
    
    all_lengths = []
    all_openers = []
    all_commas = []
    all_para_lengths = []
    
    # specific structure: data/human_mass/genre/*.txt
    files = glob.glob(os.path.join(DATA_DIR, '**/*.txt'), recursive=True)
    
    if not files:
        print("❌ No files found in data/human_mass")
        return

    print(f"Found {len(files)} files. Analyzing...")
    
    for f_path in files:
        try:
            with open(f_path, 'r', encoding='utf-8') as f:
                text = f.read()
                data = analyze_text(text)
                if data:
                    all_lengths.extend(data['lengths'])
                    all_openers.extend(data['openers'])
                    all_commas.extend(data['commas'])
                    all_para_lengths.extend(data['para_lengths'])
        except Exception as e:
            print(f"Skipping {f_path}: {e}")

    # Stat aggregation
    if not all_lengths:
        print("❌ No valid text data extracted.")
        return

    # Top 50 Openers
    opener_counts = Counter(all_openers)
    common_openers = opener_counts.most_common(50)
    
    profile = {
        "sentence_length": {
            "mean": float(np.mean(all_lengths)),
            "std": float(np.std(all_lengths)),
            "min": int(np.min(all_lengths)),
            "max": int(np.max(all_lengths))
        },
        "punctuation_density": {
            "commas_per_sentence_mean": float(np.mean(all_commas))
        },
        "paragraph_structure": {
             "sentences_per_para_mean": float(np.mean(all_para_lengths))
        },
        "common_openers": {k: v for k, v in common_openers}
    }
    
    print("\n✅ Human Style Profile Generated:")
    print(json.dumps(profile, indent=2))
    
    # Save
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(profile, f, indent=2)
    print(f"\nSaved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
