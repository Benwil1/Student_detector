
import numpy as np
import re
from collections import Counter
from sklearn.base import BaseEstimator, TransformerMixin

class StylometryExtractor(BaseEstimator, TransformerMixin):
    """
    Version: 1.0.0
    Extracts commercial-grade stylometric features from text.
    Handles short text robustly and captures flow dynamics.
    """
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def _get_metrics(self, text):
        # 0. Edge Case Safety
        if not isinstance(text, str) or not text.strip():
            return [0.0] * 5
            
        # Basic Tokenization (Regex for speed, widely compatible)
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        words = re.findall(r'\b\w+\b', text.lower())
        
        n_words = len(words)
        n_sentences = len(sentences)
        
        # Abort on extremely short text to prevent noise
        if n_words < 5:
            return [0.0] * 5

        # 1. Sentence Length Variance (Rhythm)
        # LLMs are suspiciously consistent. Humans drift.
        # Log-transform reduces impact of one crazy outlier.
        sent_lens = [len(re.findall(r'\b\w+\b', s)) for s in sentences]
        sent_len_var = np.var(sent_lens) if sent_lens else 0.0
        feat_rhythm = np.log1p(sent_len_var)
        
        # 2. Stopword Ratio (Unconscious Function Word Usage)
        # Humans leak function words naturally. AI optimizes informational content.
        stopwords = set(['the', 'and', 'of', 'to', 'a', 'in', 'is', 'that', 'for', 'it', 'as', 'was', 'with', 'on', 'at', 'by', 'an', 'be', 'this', 'which', 'or', 'from'])
        stop_count = sum(1 for w in words if w in stopwords)
        feat_stop_ratio = stop_count / n_words
        
        # 3. Local Entropy Variance (The "Flow" Metric)
        # Global entropy is weak. Local entropy variance captures changing information density.
        # Chunk size 50 is standard for this analysis.
        chunk_size = 50
        chunks = [words[i:i + chunk_size] for i in range(0, n_words, chunk_size)]
        chunk_entropies = []
        for chunk in chunks:
            if not chunk: continue
            c = Counter(chunk)
            probs = [cnt / len(chunk) for cnt in c.values()]
            e = -sum(p * np.log(p) for p in probs)
            chunk_entropies.append(e)
            
        feat_entropy_var = np.var(chunk_entropies) if chunk_entropies else 0.0
        
        # 4. Segmented Type-Token Ratio (TTR)
        # Standard TTR is length-dependent. Average of chunk TTRs is robust.
        ttrs = []
        for chunk in chunks:
            if not chunk: continue
            ttrs.append(len(set(chunk)) / len(chunk))
        feat_ttr = np.mean(ttrs) if ttrs else 0.0
        
        # 5. Sentence Start Variance (Coherence/Fatigue Trace)
        # Measures diversity of how sentences begin (by first word length).
        # Humans vary; AI often defaults to "The", "In", "It" (short) or transition words (long).
        first_words = [s.split()[0] for s in sentences if s]
        first_word_lens = [len(w) for w in first_words]
        feat_start_var = np.var(first_word_lens) if first_word_lens else 0.0

        return [feat_rhythm, feat_stop_ratio, feat_entropy_var, feat_ttr, feat_start_var]

    def transform(self, X):
        print("Extracting Stylometric Features (v1.0.0)...")
        # Ensure strict float return type for pipeline safety
        return np.array([self._get_metrics(text) for text in X], dtype=np.float64)
