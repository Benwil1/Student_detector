export interface DetectionMetrics {
  finalScore: number;
  perplexity: number;
  burstiness: number;
  entropy: number;
  structure: number;
}

const VOCAB_MAP: Record<string, string> = {
  "delve": "dig", "leverage": "use", "utilize": "use", "showcase": "show",
  "pivotal": "key", "testament": "proof", "landscape": "scene", "crucial": "important",
  "facilitate": "help", "opt": "choose", "employ": "use", "orchestrate": "set up",
  "demonstrate": "show", "illustrate": "show", "subsequently": "later", "consequently": "so",
  "furthermore": "also", "moreover": "plus", "regarding": "about", "robust": "strong",
  "meticulous": "careful", "scrutinize": "check", "ascertain": "find out", "endeavor": "try",
  "proficient": "good", "adequate": "enough", "foster": "help", "augment": "add to",
  "commence": "start", "terminate": "end", "initiate": "start", "necessitate": "need",
  "manifest": "show", "signifies": "means", "depict": "show", "exemplify": "show",
  "comprise": "have", "constitute": "make up", "diminish": "drop", "yield": "give",
  "elucidate": "explain", "expedite": "speed up", "fabricate": "make", "fluctuate": "change",
  "generate": "make", "implement": "do", "objective": "goal", "perceive": "see",
  "predominantly": "mostly", "prevalent": "common", "procedure": "step", "prohibit": "stop"
};

function calculateMetrics(text: string): DetectionMetrics {
    if (!text || text.length < 50) return { finalScore: 0, perplexity: 0, burstiness: 0, entropy: 0, structure: 0 };
    const lowerText = text.toLowerCase();
    
    // 1. PERPLEXITY (Vocab predictability)
    let vocabHits = 0;
    Object.keys(VOCAB_MAP).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        vocabHits += (text.match(regex) || []).length;
    });
    const perplexity = Math.min(vocabHits * 15, 100);

    // 2. BURSTINESS (Sentence Variance)
    let burstiness = 0;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length > 3) {
        const lengths = sentences.map(s => s.trim().split(/\s+/).length);
        const avg = lengths.reduce((a,b) => a+b) / lengths.length;
        const variance = lengths.reduce((a,n) => a + Math.pow(n-avg,2), 0) / lengths.length;
        const stdDev = Math.sqrt(variance);
        
        // AI is typically < 6. Humans are > 10.
        if (stdDev < 5) burstiness = 95;
        else if (stdDev < 8) burstiness = 70;
        else if (stdDev < 12) burstiness = 40;
        else burstiness = 10;
    }

    // 3. ENTROPY (Repetition & N-Grams)
    // Turnitin checks for repetitive patterns.
    let entropy = 0;
    // Check for repeated phrases (3-grams)
    const words = lowerText.split(/\s+/);
    const trigrams: Record<string, boolean> = {};
    let repeats = 0;
    for(let i=0; i < words.length-2; i++) {
        const tri = words[i]+" "+words[i+1]+" "+words[i+2];
        if (trigrams[tri]) repeats++;
        trigrams[tri] = true;
    }
    if (repeats > 3) entropy += 40; // High repetition = Low Entropy = AI
    if (words.length > 100 && repeats > 10) entropy += 40;
    
    // 4. STRUCTURE (Grammar Rigidity)
    let structure = 0;
    if (text.includes("—")) structure += 20; // Em-dashes
    if (text.match(/^\s*[-*•]\s+/m)) structure += 30; // Bullets
    // Check for "Subjective Fluff" (Human markers)
    const subjectives = ["basically", "honestly", "i feel", "i think", "actually", "kinda", "sort of"];
    let humanBonus = 0;
    subjectives.forEach(sub => { if (lowerText.includes(sub)) humanBonus += 10; });
    structure = Math.max(0, structure - humanBonus);

    // Calculate final score
    // Weighted Aggregator (Undetectable.ai / Turnitin style)
    let score = Math.max(perplexity, burstiness, entropy) * 0.8 + structure * 0.2;
    const finalScore = Math.min(Math.round(score), 99);

    // Return in the format expected, but note finalScore here is AI Score
    // We will return it as such, or valid metrics
    return { 
        finalScore: finalScore, // This is AI Likelihood
        perplexity, 
        burstiness, 
        entropy, 
        structure 
    };
}

export function identifyAiSentences(text: string): string[] {
    if (!text) return [];
    // Split into sentences (simple regex)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    const aiSentences: string[] = [];
    const lowerText = text.toLowerCase();

    sentences.forEach(sentence => {
        const lowerSent = sentence.toLowerCase();
        // Heuristic 1: Contains Banned Vocab
        const hasVocab = Object.keys(VOCAB_MAP).some(word => {
             const regex = new RegExp(`\\b${word}\\b`, 'i');
             return regex.test(lowerSent);
        });

        // Heuristic 2: Length > 15 words AND very low complexity (simulated check)
        const wordCount = sentence.trim().split(/\s+/).length;
        
        if (hasVocab || (wordCount > 15 && wordCount < 30)) {
            aiSentences.push(sentence.trim());
        }
    });

    return aiSentences;
}

// Wrapper to match previous hook usage that expects "Human Score"
export function calculateHumanScore(text: string): DetectionMetrics & { aiSentences: string[] } {
    const aiMetrics = calculateMetrics(text);
    const aiSentences = identifyAiSentences(text);
    
    return {
        ...aiMetrics,
        // Convert AI score to Human score (100 - AI Score)
        finalScore: 100 - aiMetrics.finalScore,
        aiSentences
    };
}
