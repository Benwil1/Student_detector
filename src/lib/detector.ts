export interface DetectionMetrics {
  // Layer 1: Surface Signals (Logic)
  finalScore: number;
  perplexity: number;
  burstiness: number;
  entropy: number;
  
  // Layer 2: Structural Fingerprints (Patterning)
  symmetry: number;
  planning: number;
  consistency: number;
  complexitySlope: number; // NEW: Re-added for aggressive syntax checking
  semanticDrift: number;   // NEW: The "Vector Proxy" (Topic Drift)
  
  // Contextual Signals (Genre-Aware)
  genre: 'formal_admin' | 'academic' | 'narrative' | 'technical';
  accountability: number; // Presence of Names/IDs/References
  
  // Metadata
  structure: number;
  transitions: number;
  passiveVoice: number;
  contractions: number;
  sentenceStarters: number;
  punctuation: number;
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

// Sentence Splitter Logic (Keeping the nice fix for Dr./Mr.)
const sentenceRegex = /[^.!?]+(?:[.!?](?!\s|$)|(?<=\b(?:Dr|Mr|Ms|Prof|Sr|Jr|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z)\.)|[^.!?])+[.!?]?/g;

/**
 * DEEP SCAN LAYER: Complexity Slope
 * Measures if sentence complexity is "too consistent" (AI) or "spiky" (Human).
 */
function calculateComplexitySlope(sentences: string[]): number {
    if (sentences.length < 3) return 0;
    const complexities = sentences.map(s => s.split(/,|and|or|but|because/i).length);
    let totalChange = 0;
    for (let i = 1; i < complexities.length; i++) {
        totalChange += Math.abs(complexities[i] - complexities[i-1]);
    }
    const avgChange = totalChange / (complexities.length - 1);
    // Low change = Machine-level consistency = High AI Score
    // We penalize "Flatlines"
    return Math.max(0, 100 - (avgChange * 40));
}

/**
 * DEEP SCAN LAYER: Semantic Drift (Vector Proxy)
 * Measures if the topic flows "logically" (AI) or "wanders" (Human).
 */
function calculateSemanticDrift(words: string[]): number {
    if (words.length < 50) return 0;
    
    // Filter generic stopwords to focus on "Topic Words"
    const stopWords = new Set(["the","and","is","of","in","to","a","that","it","for","on","with","as","are","this","but","be","by","not","what","all","at","from","or","your","have","new","more","an","was","we","will"]);
    const contentWords = words.filter(w => !stopWords.has(w) && w.length > 3);
    
    if (contentWords.length < 20) return 0;

    const chunkSize = 20;
    const uniquePerChunk: number[] = [];
    const globalSeen = new Set<string>();
    
    for (let i = 0; i < contentWords.length; i += chunkSize) {
        const chunk = contentWords.slice(i, i + chunkSize);
        let newConcepts = 0;
        chunk.forEach(w => {
            if (!globalSeen.has(w)) {
                newConcepts++;
                globalSeen.add(w);
            }
        });
        uniquePerChunk.push(newConcepts / chunk.length);
    }
    
    if (uniquePerChunk.length < 2) return 0;
    
    const avg = uniquePerChunk.reduce((a,b)=>a+b)/uniquePerChunk.length;
    const variance = uniquePerChunk.reduce((a,n) => a + Math.pow(n - avg, 2), 0) / uniquePerChunk.length;
    
    // Higher multiplier = More aggressive on "Linear Flow"
    // QuillBot hates linear flow. We punish it hard.
    return Math.min(Math.sqrt(variance) * 800, 100);
}

/**
 * Detect writing genre based on keyword clusters
 */
function identifyGenre(text: string): 'formal_admin' | 'academic' | 'narrative' | 'technical' {
    const s = text.toLowerCase();
    
    // Administrative / Academic Appeal signals
    const adminSignals = ["supervisor", "neptun", "code", "id", "submission", "grade", "complaint", "appeal", "to whom it may concern", "sincerely", "regards"];
    const techSignals = ["data", "system", "performance", "optimization", "parameter", "software", "implementation", "hardware", "latency"];
    const narrativeSignals = ["i felt", "walked", "thought", "happened", "suddenly", "because i was", "decided"];

    const count = (arr: string[]) => arr.filter(word => s.includes(word)).length;
    
    const adminCount = count(adminSignals);
    const techCount = count(techSignals);
    const narrCount = count(narrativeSignals);

    if (adminCount >= 2 || s.match(/\b(neptun|id|code):\s*[a_z0_9]+\b/i)) return 'formal_admin';
    if (techCount > narrCount && techCount > 2) return 'technical';
    if (narrCount > 2) return 'narrative';
    return 'academic'; // Default fallback
}

/**
 * Detect "Accountability References" (Names, IDs, specific roles)
 * These are strong human indicators in formal contexts.
 */
function calculateAccountability(text: string): number {
    const s = text.toLowerCase();
    const markers = ["my supervisor", "professor", "doctor", "the department", "my ID", "neptun", "reference number"];
    let score = 0;
    markers.forEach(m => { if (s.includes(m)) score += 20; });
    
    // Check for "Formal Self-Reference" (e.g. "I, [Name]")
    if (s.match(/i,\s*[a-z\s]+,\s*(?:would|am|hereby)/i)) score += 50;
    
    return Math.min(score, 100);
}

function calculateMetrics(text: string): DetectionMetrics {
    if (!text || text.length < 50) {
        return { 
            finalScore: 0, perplexity: 0, burstiness: 0, entropy: 0, 
            symmetry: 0, planning: 0, consistency: 0, complexitySlope: 0, semanticDrift: 0,
            genre: 'academic', accountability: 0,
            structure: 0, transitions: 0, passiveVoice: 0, contractions: 0,
            sentenceStarters: 0, punctuation: 0
        };
    }
    
    // NORMALIZE: Keep the aggressive space cleaning (it was useful)
    let normalizedText = text.replace(/[\u200B-\u200D\uFEFF]/g, ''); 
    normalizedText = normalizedText.replace(/\s+/g, ' ').trim(); 

    const lowerText = normalizedText.toLowerCase();
    const sentences = normalizedText.match(sentenceRegex) || [normalizedText];
    // Use original text for paragraphs to preserve newline structure
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    const words = lowerText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    const genre = identifyGenre(text);
    const accountability = calculateAccountability(text);

    // --- LAYER 1: SURFACE SIGNALS ---
    let vocabHits = 0;
    Object.keys(VOCAB_MAP).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        vocabHits += (normalizedText.match(regex) || []).length;
    });
    const perplexity = Math.min(vocabHits * 15, 100);

    let burstiness = 0;
    if (sentences.length > 3) {
        const lengths = sentences.map(s => s.trim().split(/\s+/).length);
        const avg = lengths.reduce((a, b) => a + b) / lengths.length;
        const variance = lengths.reduce((a, n) => a + Math.pow(n - avg, 2), 0) / lengths.length;
        const stdDev = Math.sqrt(variance);
        if (stdDev < 5) burstiness = 95;
        else if (stdDev < 8) burstiness = 70;
        else if (stdDev < 12) burstiness = 40;
        else burstiness = 10;
    }

    let entropy = 0;
    const trigrams: Record<string, boolean> = {};
    let repeats = 0;
    for (let i = 0; i < words.length - 2; i++) {
        const tri = words[i] + " " + words[i+1] + " " + words[i+2];
        if (trigrams[tri]) repeats++;
        trigrams[tri] = true;
    }
    if (repeats > 3) entropy += 40;

    // --- LAYER 2: STRUCTURAL FINGERPRINTS ---
    // (Reverting to purely length-based symmetry, removing deep Deep Scan)
    let symmetry = 0;
    if (paragraphs.length >= 3) {
        const pLengths = paragraphs.map(p => p.split(/\s+/).length);
        const pAvg = pLengths.reduce((a,b) => a+b) / pLengths.length;
        const pVar = pLengths.reduce((a,n) => a + Math.pow(n - pAvg, 2), 0) / pLengths.length;
        symmetry = Math.max(0, 100 - (Math.sqrt(pVar) * 4)); 
    }

    let planning = 0;
    if (paragraphs.length >= 4) {
        const intro = paragraphs[0].toLowerCase();
        const conclusion = paragraphs[paragraphs.length-1].toLowerCase();
        const introWords = new Set(intro.split(/\s+/).filter(w => w.length > 4));
        const concWords = conclusion.split(/\s+/).filter(w => w.length > 4);
        const overlap = concWords.filter(w => introWords.has(w)).length;
        planning = Math.min((overlap / (concWords.length || 1)) * 300, 100);
    }

    // --- LAYER 3: DEEP SCAN AGGREGATION ---
    const complexitySlope = calculateComplexitySlope(sentences);
    const semanticDrift = calculateSemanticDrift(words);

    // Aggressive Scoring Formula (Tuned for QuillBot Parity)
    // 1. Surface Score (Vocabulary/Burstiness/Entropy)
    let finalScore = Math.max(perplexity, burstiness, entropy) * 0.6;
    
    // 2. Deep Structural Penalties (The "Vector Proxy")
    // If Semantic Drift is low (linear flow), we add HUGE points.
    // If Complexity Slope is low (monotone syntax), we add HUGE points.
    if (semanticDrift < 45) finalScore += 50; // Increased threshold and penalty
    if (complexitySlope < 35) finalScore += 40; // Increased threshold and penalty

    // 3. HUMAN ARTIFACT FORGIVENESS - REMOVED.
    // We cannot let typos excuse AI structure. The structure must change.
    
    // Add finer gradients

    // Add finer gradients
    finalScore += (symmetry * 0.1) + (planning * 0.1) + (100 - semanticDrift) * 0.2 + (100 - complexitySlope) * 0.15;

    // Apply Contextual Normalization
    if (genre === 'formal_admin') {
        // Formal documents have "Justified Symmetry"
        // We reduce the penalty for symmetry and planning significantly
        finalScore *= 0.6; 
        // Penalize the "Surface Predictability" less because it's expected in admin work
        if (perplexity > 50) finalScore -= 10;
    }

    // Accountability "Human Bonus"
    finalScore -= (accountability * 0.5);

    // General Human Fluff Bonus
    const subjectives = ["basically", "honestly", "i feel", "i think", "actually", "kinda", "sort of"];
    subjectives.forEach(sub => { if (lowerText.includes(sub)) finalScore -= 10; });

    return {
        finalScore: Math.max(0, Math.min(99, Math.round(finalScore))),
        perplexity, burstiness, entropy,
        symmetry, planning, consistency: 0, complexitySlope, semanticDrift,
        genre, accountability,
        structure: 0, transitions: 0, passiveVoice: 0, contractions: 0,
        sentenceStarters: 0, punctuation: 0
    };
}

export function identifyAiSentences(text: string): string[] {
    if (!text) return [];
    // Using the improved regex that protects titles/names
    const sentences = text.match(sentenceRegex) || [];
    const aiSentences: string[] = [];
    // 5. DEEP SCAN HIGHLIGHTING
    // We can't calculate "Drift" on a single sentence, but we can check "Machine Balance"
    // If the whole text has low drift, we become MORE aggressive on individual sentences.
    const globalDrift = calculateSemanticDrift(text.toLowerCase().split(/\s+/));
    const isLinearFlow = globalDrift < 40;

    sentences.forEach(s => {
        const lower = s.toLowerCase();
        let score = 0;
        
        // Base penalties
        if (Object.keys(VOCAB_MAP).some(w => lower.includes(w))) score += 30;
        if (lower.includes("it is important to note") || lower.includes("in conclusion")) score += 40;
        
        // Contextual Penalties (If the document is Linear, we flags "connectors" heavily)
        if (isLinearFlow) {
            const connectors = (lower.match(/\b(and|but|or|that|which|however|therefore)\b/g) || []).length;
            if (connectors > 2) score += 25; // Flag "smooth" sentences in a linear text
        }
        
        // Only flag if fairly certain
        if (score >= 40) aiSentences.push(s.trim());
    });
    return aiSentences;
}

export function calculateHumanScore(text: string): DetectionMetrics & { aiSentences: string[] } {
    const metrics = calculateMetrics(text);
    const humanScore = 100 - metrics.finalScore;
    
    return {
        ...metrics,
        finalScore: humanScore,
        // Suppress highlights if the document is safely "Human" (>= 70%)
        aiSentences: humanScore >= 70 ? [] : identifyAiSentences(text)
    };
}
