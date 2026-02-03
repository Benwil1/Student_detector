export interface DetectionMetrics {
  // Layer 1: Surface Signals (Statistical Distance)
  finalScore: number;
  lexicalComplexity: number; 
  burstiness: number;
  entropy: number;
  
  // Layer 2: Structural Fingerprints (Patterning)
  symmetry: number;
  planning: number;
  consistency: number;
  complexitySlope: number; 
  semanticDrift: number;   
  
  // Contextual Signals (Genre-Aware)
  genre: 'formal_admin' | 'academic' | 'narrative' | 'technical';
  accountability: number; 
  
  // Metadata
  structure: number;
  transitions: number;
  passiveVoice: number;
  contractions: number;
  sentenceStarters: number;
  punctuation: number;
  perfectionPoint: number; 
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

const sentenceRegex = /[^.!?]+(?:[.!?](?!\s|$)|(?<=\b(?:Dr|Mr|Ms|Prof|Sr|Jr|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z)\.)|[^.!?])+[.!?]?/g;

/**
 * DEEP SCAN LAYER: Complexity Slope
 */
function calculateComplexitySlope(sentences: string[]): number {
    if (sentences.length < 3) return 0;
    const complexities = sentences.map(s => {
        const words = s.split(/\s+/).length;
        const subclauses = s.split(/,|;|:|—|–|and|but|because/i).length;
        if (words > 45 && subclauses < 2) return 1; 
        return subclauses;
    });
    
    let totalChange = 0;
    for (let i = 1; i < complexities.length; i++) {
        totalChange += Math.abs(complexities[i] - complexities[i-1]);
    }
    const avgChange = totalChange / (complexities.length - 1);
    
    // Scale: Human avgChange is usually 2-5. AI is 0.5-2.
    return Math.min(100, Math.round(avgChange * 20)); 
}

/**
 * DEEP SCAN LAYER: Semantic Drift
 */
function calculateSemanticDrift(words: string[]): number {
    if (words.length < 50) return 0;
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
    return Math.min(Math.sqrt(variance) * 800, 100);
}

/**
 * MTLD (Measure of Textual Lexical Diversity)
 */
function calculateMTLD(words: string[]): number {
    if (words.length < 50) return 0;
    const computeMTLD = (tokens: string[]) => {
        const threshold = 0.72;
        let sums = 0;
        let counts = 0;
        let currentWords = new Set<string>();
        let currentCount = 0;
        for (let i = 0; i < tokens.length; i++) {
            currentWords.add(tokens[i]);
            currentCount++;
            let ttr = currentWords.size / currentCount;
            if (ttr < threshold) {
                sums += currentCount;
                counts++;
                currentWords = new Set<string>();
                currentCount = 0;
            }
        }
        if (currentCount > 0) {
            sums += currentCount;
            counts++;
        }
        return counts === 0 ? 0 : sums / counts;
    };
    return (computeMTLD(words) + computeMTLD([...words].reverse())) / 2;
}

/**
 * Shannon Entropy calculation
 */
function calculateEntropy(values: number[]): number {
    if (values.length === 0) return 0;
    const freq: Record<number, number> = {};
    values.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const len = values.length;
    return Object.values(freq).reduce((sum, f) => {
        const p = f / len;
        return sum - (p * Math.log2(p));
    }, 0);
}

/**
 * Lightweight POS Tagger Proxy
 */
function getPOSTags(words: string[]): string[] {
    const commonTags: Record<string, string> = {
        "the": "DET", "a": "DET", "an": "DET", "this": "DET", "that": "DET",
        "of": "PREP", "in": "PREP", "to": "PREP", "for": "PREP", "on": "PREP", "with": "PREP",
        "and": "CONJ", "but": "CONJ", "or": "CONJ", "because": "CONJ", "although": "CONJ",
        "is": "VERB", "are": "VERB", "was": "VERB", "were": "VERB", "be": "VERB", "been": "VERB",
        "i": "PRON", "you": "PRON", "he": "PRON", "she": "PRON", "it": "PRON", "we": "PRON", "they": "PRON"
    };

    return words.map(w => {
        const low = w.toLowerCase();
        if (commonTags[low]) return commonTags[low];
        if (low.endsWith("ly")) return "ADV";
        if (low.endsWith("ing") || low.endsWith("ed")) return "VERB";
        if (low.endsWith("tion") || low.endsWith("ness") || low.endsWith("ment")) return "NOUN";
        if (low.length <= 3) return "PART";
        return "NOUN"; 
    });
}

/**
 * POS Transition Entropy
 */
function calculatePOSTransitionEntropy(words: string[]): number {
    if (words.length < 30) return 0;
    const tags = getPOSTags(words);
    const transitions: Record<string, Record<string, number>> = {};
    const totals: Record<string, number> = {};

    for (let i = 0; i < tags.length - 1; i++) {
        const t1 = tags[i];
        const t2 = tags[i+1];
        if (!transitions[t1]) transitions[t1] = {};
        transitions[t1][t2] = (transitions[t1][t2] || 0) + 1;
        totals[t1] = (totals[t1] || 0) + 1;
    }

    let totalEntropy = 0;
    let tagCount = 0;
    Object.keys(transitions).forEach(t1 => {
        let entropy = 0;
        const total = totals[t1];
        Object.keys(transitions[t1]).forEach(t2 => {
            const p = transitions[t1][t2] / total;
            entropy -= p * Math.log2(p);
        });
        totalEntropy += entropy;
        tagCount++;
    });
    return tagCount === 0 ? 0 : totalEntropy / tagCount;
}

/**
 * Mahalanobis Distance
 */
function calculateMahalanobis(features: number[], mu: number[], invCov: number[][]): number {
    if (!invCov || invCov.length < features.length) return 0;
    const diff = features.map((f, i) => f - mu[i]);
    let result = 0;
    for (let i = 0; i < diff.length; i++) {
        let intermediate = 0;
        for (let j = 0; j < diff.length; j++) {
            intermediate += diff[j] * invCov[j][i];
        }
        result += intermediate * diff[i];
    }
    return Math.sqrt(Math.max(0, result));
}

/**
 * Sentence Planning Entropy
 */
function calculatePlanningEntropy(sentences: string[]): { entropy: number, clauseVar: number } {
    if (sentences.length < 4) return { entropy: 0, clauseVar: 0 };
    const bins = sentences.map(s => {
        const len = s.split(/\s+/).length;
        if (len <= 10) return 1;
        if (len <= 20) return 2;
        if (len <= 30) return 3;
        if (len <= 45) return 4;
        return 5;
    });
    const lengthEntropy = calculateEntropy(bins);
    const clauseCounts = sentences.map(s => s.split(/,|;|:|—|–|and|but|because|although|while|if|when|that|which|who/i).length);
    const avgClauses = clauseCounts.reduce((a,b)=>a+b, 0) / clauseCounts.length;
    const clauseVar = clauseCounts.reduce((a,n) => a + Math.pow(n - avgClauses, 2), 0) / clauseCounts.length;
    return { entropy: lengthEntropy, clauseVar: Math.sqrt(clauseVar) };
}

/**
 * Section-Level Drift Analysis
 */
function calculateSectionDrift(words: string[], sentences: string[]): { driftVar: number, driftSlope: number } {
    const windowSize = 250; // words
    const windows: string[][] = [];
    for (let i = 0; i < words.length; i += windowSize) {
        windows.push(words.slice(i, i + windowSize));
    }
    if (windows.length < 2) return { driftVar: 0, driftSlope: 0 };

    const mtlds = windows.map(win => calculateMTLD(win));
    const mean = mtlds.reduce((a,b)=>a+b,0) / mtlds.length;
    const variance = mtlds.reduce((a,n) => a + Math.pow(n - mean, 2), 0) / mtlds.length;
    
    // Simple slope calculation
    let slopeSum = 0;
    for (let i = 1; i < mtlds.length; i++) {
        slopeSum += (mtlds[i] - mtlds[i-1]);
    }
    const avgSlope = slopeSum / (mtlds.length - 1);

    return { driftVar: Math.sqrt(variance), driftSlope: Math.abs(avgSlope) };
}

/**
 * Temporal Coherence Decay
 */
function calculateCoherenceDecay(words: string[]): { decayVar: number, decaySlope: number } {
    const stopWords = new Set(["the","and","is","of","in","to","a","that","it","for","on","with","as","are","this","but","be","by","not","what","all","at","from","or","your","have","new","more","an","was","we","will"]);
    const windowSize = 200;
    const chunks: string[][] = [];
    for (let i = 0; i < words.length; i += windowSize) {
        chunks.push(words.slice(i, i + windowSize).filter(w => !stopWords.has(w) && w.length > 4));
    }
    if (chunks.length < 3) return { decayVar: 0, decaySlope: 0 };

    const overlaps: number[] = [];
    for (let i = 1; i < chunks.length; i++) {
        const prevSet = new Set(chunks[i-1]);
        const current = chunks[i];
        const overlap = current.filter(w => prevSet.has(w)).length;
        overlaps.push(overlap / (current.length || 1));
    }

    const mean = overlaps.reduce((a,b)=>a+b,0) / overlaps.length;
    const variance = overlaps.reduce((a,n) => a + Math.pow(n - mean, 2), 0) / overlaps.length;
    
    let slopeSum = 0;
    for (let i = 1; i < overlaps.length; i++) {
        slopeSum += (overlaps[i] - overlaps[i-1]);
    }
    const avgSlope = slopeSum / (overlaps.length - 1);
    return { decayVar: Math.sqrt(variance), decaySlope: Math.abs(avgSlope) };
}

/**
 * DEEP SCAN LAYER: Stylistic Surcharge (Detects over-humanization)
 */
export function calculateStylisticSurcharge(text: string): number {
    const s = text.toLowerCase();
    // Clean list: Removed valid academic words
    const fillers = [
        "actually", "honestly", "literally", "you know", "kind of", "sort of", 
        "basically", "essentially", "anyway", "regardless", "to be fair", "i mean",
        "in a sense", "arguably", "looking at this", "i think", "at least i think so",
        "strangely", "weirdly"
    ];
    
    let totalMarkers = 0;
    fillers.forEach(f => {
        const parts = s.split(f);
        if (parts.length > 1) {
            totalMarkers += (parts.length - 1);
        }
    });

    const sentences = text.match(/[^.!?]+[.!?]+/g)?.length || 1;
    return totalMarkers / sentences; // Return RAW DENSITY
}

/**
 * Revision Marker Analysis
 */
function calculateRevisionSkew(text: string): { markerVar: number, skew: number } {
    const chunks = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
    if (chunks.length < 2) return { markerVar: 0, skew: 0 };

    const markerRegex = /\(|\)|—|--|\b(that is|in other words|specifically|more precisely|basically|namely)\b/gi;
    const densities = chunks.map(c => {
        const matches = (c.match(markerRegex) || []).length;
        return matches / (c.split(/\s+/).length || 1);
    });

    const mean = densities.reduce((a,b)=>a+b,0) / densities.length;
    const variance = densities.reduce((a,n) => a + Math.pow(n - mean, 2), 0) / densities.length;
    
    // Skew calculation (weighted towards the end)
    let weightedSum = 0;
    densities.forEach((d, i) => {
        weightedSum += d * (i / (densities.length - 1));
    });
    const skew = weightedSum / (densities.reduce((a,b)=>a+b,0) || 1);

    return { markerVar: Math.sqrt(variance), skew };
}

const DISTRIBUTIONS = {
    academic: {
        mtld: { mu: 74.08, sigma: 13.15, aiMu: 94.88 },
        burstiness: { mu: 9.96, sigma: 8.60, aiMu: 4.16 },
        planningEntropy: { mu: 0.93, sigma: 0.83, aiMu: 0.82 }, 
        clauseVar: { mu: 1.63, sigma: 2.03, aiMu: 1.57 },
        posEntropy: { mu: 2.2, sigma: 0.4, aiMu: 1.8 },
        driftVar: { mu: 12, sigma: 6, aiMu: 4 },
        decayVar: { mu: 0.08, sigma: 0.04, aiMu: 0.02 },
        revisionSkew: { mu: 0.6, sigma: 0.2, aiMu: 0.95 },
        mu: [74.08, 9.96, 0.93, 1.63, 2.2, 12, 0.08, 0.6], 
        aiMu_vec: [94.88, 4.16, 0.82, 1.57, 1.8, 4, 0.02, 0.95],
        weights: { mtld: 0.20, burstiness: 0.15, planning: 0.35, pos: 0.20, secondary: 0.10 },
        invCov: Array(8).fill(0).map((_, i) => Array(8).fill(0).map((_, j) => i === j ? (i < 5 ? 2 : 1) : 0))
    },
    technical: {
        mtld: { mu: 95.33, sigma: 41.30, aiMu: 84.00 },
        burstiness: { mu: 6.73, sigma: 4.02, aiMu: 2.41 },
        planningEntropy: { mu: 0.81, sigma: 0.42, aiMu: 0.10 }, 
        clauseVar: { mu: 1.10, sigma: 0.91, aiMu: 0.37 },
        posEntropy: { mu: 2.0, sigma: 0.5, aiMu: 1.5 },
        driftVar: { mu: 8, sigma: 4, aiMu: 2 },
        decayVar: { mu: 0.05, sigma: 0.03, aiMu: 0.01 },
        revisionSkew: { mu: 0.7, sigma: 0.2, aiMu: 0.98 },
        mu: [95.33, 6.73, 0.81, 1.10, 2.0, 8, 0.05, 0.7], 
        aiMu_vec: [84.00, 2.41, 0.10, 0.37, 1.5, 2, 0.01, 0.98],
        weights: { mtld: 0.25, burstiness: 0.10, planning: 0.30, pos: 0.25, secondary: 0.10 },
        invCov: Array(8).fill(0).map((_, i) => Array(8).fill(0).map((_, j) => i === j ? (i < 5 ? 2 : 1) : 0))
    },
    narrative: {
        mtld: { mu: 87.00, sigma: 25.11, aiMu: 54.00 },
        burstiness: { mu: 13.27, sigma: 8.46, aiMu: 2.54 },
        planningEntropy: { mu: 1.33, sigma: 0.84, aiMu: 0.92 }, 
        clauseVar: { mu: 2.38, sigma: 2.07, aiMu: 0.82 },
        posEntropy: { mu: 2.4, sigma: 0.6, aiMu: 1.6 },
        driftVar: { mu: 15, sigma: 8, aiMu: 3 },
        decayVar: { mu: 0.12, sigma: 0.06, aiMu: 0.02 },
        revisionSkew: { mu: 0.5, sigma: 0.3, aiMu: 0.90 },
        mu: [87.00, 13.27, 1.33, 2.38, 2.4, 15, 0.12, 0.5], 
        aiMu_vec: [54.00, 2.54, 0.92, 0.82, 1.6, 3, 0.02, 0.90],
        weights: { mtld: 0.15, burstiness: 0.25, planning: 0.30, pos: 0.20, secondary: 0.10 },
        invCov: Array(8).fill(0).map((_, i) => Array(8).fill(0).map((_, j) => i === j ? (i < 5 ? 2 : 1) : 0))
    },
    formal_admin: {
        mtld: { mu: 64.88, sigma: 39.18, aiMu: 89.00 },
        burstiness: { mu: 6.70, sigma: 7.01, aiMu: 2.33 },
        planningEntropy: { mu: 0.65, sigma: 0.75, aiMu: 0.97 }, 
        clauseVar: { mu: 1.09, sigma: 1.68, aiMu: 0.40 },
        posEntropy: { mu: 2.1, sigma: 0.4, aiMu: 1.4 },
        driftVar: { mu: 10, sigma: 5, aiMu: 3 },
        decayVar: { mu: 0.07, sigma: 0.04, aiMu: 0.01 },
        revisionSkew: { mu: 0.8, sigma: 0.2, aiMu: 0.95 },
        mu: [64.88, 6.70, 0.65, 1.09, 2.1, 10, 0.07, 0.8], 
        aiMu_vec: [89.00, 2.33, 0.97, 0.40, 1.4, 3, 0.01, 0.95],
        weights: { mtld: 0.30, burstiness: 0.10, planning: 0.25, pos: 0.20, secondary: 0.15 },
        invCov: Array(8).fill(0).map((_, i) => Array(8).fill(0).map((_, j) => i === j ? (i < 5 ? 2 : 1) : 0))
    }
};

function calculateZPenalty(value: number, dist: { mu: number, sigma: number }, directional: boolean = false): number {
    const rawZ = (value - dist.mu) / dist.sigma;
    // If directional is true, we only penalize if value is LOWER than mu (machine-like)
    // If value is HIGHER than mu, it's 'Complex Human' (negative penalty)
    if (directional) {
        return Math.max(-0.2, Math.min(1, -rawZ / 2)); 
    }
    return Math.min(1, Math.abs(rawZ) / 3);
}

function identifyGenre(text: string): 'formal_admin' | 'academic' | 'narrative' | 'technical' {
    const s = text.toLowerCase();
    const adminSignals = ["supervisor", "neptun", "code", "id", "submission", "grade", "complaint", "appeal", "to whom it may concern", "sincerely", "regards"];
    const techSignals = ["data", "system", "performance", "optimization", "parameter", "software", "implementation", "hardware", "latency"];
    const narrativeSignals = ["i felt", "walked", "thought", "happened", "suddenly", "because i was", "decided"];
    const count = (arr: string[]) => arr.filter(word => s.includes(word)).length;
    const adminCount = count(adminSignals);
    const techCount = count(techSignals);
    const narrCount = count(narrativeSignals);
    if (adminCount >= 2 || s.match(/\b(neptun|id|code):\s*[a_z0-9]+\b/i)) return 'formal_admin';
    if (techCount > narrCount && techCount > 2) return 'technical';
    if (narrCount > 2) return 'narrative';
    return 'academic'; 
}

function calculateAccountability(text: string): number {
    const s = text.toLowerCase();
    const markers = ["my supervisor", "professor", "doctor", "the department", "my id", "neptun", "reference number", "reviewer", "complaint", "grade"];
    let score = 0;
    markers.forEach(m => { if (s.includes(m)) score += 10; }); // Reduced from 15
    if (s.match(/\b(name|neptun|id|supervisor|reviewer):\s*[a-z0-9]/i)) score += 40; // Reduced from 60
    const grades = (s.match(/\d{1,2}\/\d{1,2}/g) || []).length;
    if (grades > 0) score += (grades * 10);
    if (s.match(/\d+\s+(?:vs|and|compared to)\s+\d+/i)) score += 15;
    
    // AI ANTI-DOPING: Penalize if accountability keywords are used but the structure is too stable
    const sentences = text.split(/[.!?]+/);
    if (sentences.length > 5) {
        const avgLen = sentences.join(" ").split(/\s+/).length / sentences.length;
        const variances = sentences.map(s => Math.abs(s.split(/\s+/).length - avgLen));
        const stableStructure = variances.filter(v => v < 3).length / sentences.length;
        if (stableStructure > 0.7) score *= 0.5; // Half the bonus if structure is too "perfect"
    }

    return Math.min(score, 100); 
}

export function calculateMetrics(text: string): DetectionMetrics {
    if (!text || text.length < 50) {
        return { 
            finalScore: 0, lexicalComplexity: 0, burstiness: 0, entropy: 0, 
            symmetry: 0, planning: 0, consistency: 0, complexitySlope: 0, semanticDrift: 0,
            genre: 'academic', accountability: 0,
            structure: 0, transitions: 0, passiveVoice: 0, contractions: 0,
            sentenceStarters: 0, punctuation: 0, perfectionPoint: 0
        };
    }
    
    let normalizedText = text.replace(/[\u200B-\u200D\uFEFF]/g, ''); 
    normalizedText = normalizedText.replace(/\s+/g, ' ').trim(); 
    const lowerText = normalizedText.toLowerCase();
    const sentences = normalizedText.match(sentenceRegex) || [normalizedText];
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    const words = lowerText.split(/\s+/).filter(w => w.length > 0);
    const genre = identifyGenre(text);
    const accountability = calculateAccountability(text);
    const genreKey = genre === 'formal_admin' ? 'academic' : genre;
    const dist = (DISTRIBUTIONS as any)[genreKey] || DISTRIBUTIONS.academic;

    const mtld = calculateMTLD(words);
    const mtldPenalty = calculateZPenalty(mtld, dist.mtld, true); // Directional
    
    let burstValue = 0;
    if (sentences.length >= 3) {
        const lengths = sentences.map(s => s.trim().split(/\s+/).length);
        const avg = lengths.reduce((a, b) => a + b) / lengths.length;
        const variance = lengths.reduce((a, n) => a + Math.pow(n - avg, 2), 0) / lengths.length;
        burstValue = Math.sqrt(variance);
    }
    const burstPenalty = calculateZPenalty(burstValue, dist.burstiness, true); // Directional

    const planning = calculatePlanningEntropy(sentences);
    const planningPenalty = Math.max(
        calculateZPenalty(planning.entropy, dist.planningEntropy, true), // Directional
        calculateZPenalty(planning.clauseVar, dist.clauseVar, true) // Directional
    );

    const posEntropy = calculatePOSTransitionEntropy(words);
    const posPenalty = calculateZPenalty(posEntropy, dist.posEntropy, true); // Directional

    // --- NEW SECONDARY COGNITIVE SIGNALS ---
    const drift = calculateSectionDrift(words, sentences);
    const driftPenalty = (calculateZPenalty(drift.driftVar, dist.driftVar, true) + calculateZPenalty(drift.driftSlope, {mu: 0.1, sigma: 0.1})) / 2;

    const coherence = calculateCoherenceDecay(words);
    const coherencePenalty = (calculateZPenalty(coherence.decayVar, dist.decayVar, true) + calculateZPenalty(coherence.decaySlope, {mu: 0.05, sigma: 0.05})) / 2;

    const revision = calculateRevisionSkew(text);
    const revisionPenalty = (calculateZPenalty(revision.skew, dist.revisionSkew, true) + calculateZPenalty(revision.markerVar, {mu: 0.01, sigma: 0.01})) / 2;

    // --- COVARIANCE MULTIPLIER ---
    const features = [mtld, burstValue, planning.entropy, planning.clauseVar, posEntropy, drift.driftVar, coherence.decayVar, revision.skew];
    const mahalanobis = calculateMahalanobis(features, dist.mu, dist.invCov);
    const covMultiplier = 1 + (Math.min(mahalanobis, 5) * 0.15); 

    let symmetry = 0;
    if (paragraphs.length >= 3) {
        const pLengths = paragraphs.map(p => p.split(/\s+/).length);
        const pAvg = pLengths.reduce((a,b) => a+b) / pLengths.length;
        const pVar = pLengths.reduce((a,n) => a + Math.pow(n - pAvg, 2), 0) / pLengths.length;
        symmetry = Math.max(0, 100 - (Math.sqrt(pVar) * 4)); 
    }

    const complexitySlope = calculateComplexitySlope(sentences);
    const semanticDrift = calculateSemanticDrift(words);

    const starters = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase());
    const commonSet = new Set(["the", "this", "it", "furthermore", "moreover", "additionally", "in", "however"]);
    const uniformity = (starters.filter(s => commonSet.has(s)).length / sentences.length) * 100;

    let perfectionPoint = 0;
    const hasContractions = /[\w]['|’][\w]/.test(normalizedText);
    const hasInformal = /\b(nice|good|bad|cool|maybe|actually|just|it's|don't|unfair|deserve|believe|feel)\b/gi.test(normalizedText);
    if (!hasContractions && !hasInformal) perfectionPoint += 35;
    
    const passiveMarkers = (normalizedText.match(/\b(is|are|was|were|be|been)\s+[a-z]+ed\b/gi) || []).length;
    const passiveDensity = (passiveMarkers / sentences.length) * 100;
    if (passiveDensity > 40) perfectionPoint += 25;

    // --- PRODUCTION WEIGHTED AGGREGATION (PROBALISTIC CLASSIFIER) ---
    const w = dist.weights || { mtld: 0.35, burstiness: 0.20, planning: 0.25, pos: 0.15, secondary: 0.05 };
    
    // MTLD U-Curve:
    // AI is typically 85-95.
    // Humans: < 75 (Simple Narrative) OR > 110 (Complex Academic).
    let mtldScore = 1.0;
    if (mtld > 85 && mtld < 105) mtldScore = 0.4; // AI Danger Zone
    else mtldScore = 0.95; // Safe Zone

    // Standard Probabilities
    const calculateProb = (val: number, hMu: number, aMu: number, sigmaH: number) => {
         const zH = Math.abs(val - hMu) / sigmaH;
         const distH = Math.abs(val - hMu);
         const distA = Math.abs(val - aMu);
         return distH < distA ? 0.9 : 0.2; 
    };

    const burstProb = calculateProb(burstValue, dist.burstiness.mu, dist.burstiness.aiMu, dist.burstiness.sigma);
    const planningProb = calculateProb(planning.entropy, dist.planningEntropy.mu, dist.planningEntropy.aiMu, dist.planningEntropy.sigma);
    const posProb = calculateProb(posEntropy, dist.posEntropy.mu, dist.posEntropy.aiMu, dist.posEntropy.sigma);

    let cognitiveScore = (mtldScore * 0.40) + 
                         (burstProb * 0.30) + 
                         (planningProb * 0.20) + 
                         (posProb * 0.10);

    // --- STRUCTURAL PENALTIES ---
    
    // 1. Uniformity Penalty (Base threshold 35% for Narrative, 32% for others)
    const uniThreshold = genre === 'narrative' ? 42 : 32;
    let uniformityPenalty = Math.max(0, (uniformity - uniThreshold) / 10); 
    
    // 2. LOW VARIANCE PENALTY (The "Robot" Trap)
    // AI has low variance (Burst < 5). If Uniformity is even mid-range (> 32), penalize.
    if (burstValue < 4.5 && uniformity > 32) {
         uniformityPenalty += 0.5; 
    }

    // 3. VARIANCE PROTECTION (The "Messiness" Shield)
    // If the text is messy (Burstiness > 6), it is likely human.
    if (burstValue > 6) {
        uniformityPenalty *= 0.1; 
    }

    // 4. COMPLEXITY SHIELD
    if (complexitySlope > 55) {
        uniformityPenalty *= 0.3; 
    }

    // Passive Voice Penalty (Academic threshold is higher)
    const passivePenalty = Math.max(0, (passiveDensity - 42) / 40);
    
    // Surcharge (Conversation Fillers)
    const surchargeDensity = calculateStylisticSurcharge(text);
    const surchargePenalty = surchargeDensity > 0.18 ? Math.min(0.99, (surchargeDensity - 0.18) * 8) : 0; 

    let finalScore = cognitiveScore;
    
    // 5. SOPHISTICATED AI TRAP
    // If Vocab is huge (MTLD > 115) but either length variance (Burst < 6) or structure variance (Slope < 50) is low -> AI.
    if (mtld > 115 && (complexitySlope < 50 || burstValue < 6)) {
        finalScore *= 0.6; 
    } else if (complexitySlope < 25 && burstValue < 4) {
        finalScore *= 0.8; 
    }

    // SHORT TEXT AI TRAP:
    if (text.length < 500 && uniformity > 40 && burstValue < 4) {
        finalScore *= 0.3; 
    }

    // Apply Penalties (Multiplicative)
    finalScore = finalScore * (1 - Math.min(0.9, uniformityPenalty));
    finalScore = finalScore * (1 - Math.min(0.9, passivePenalty));
    finalScore = finalScore * (1 - Math.min(0.99, surchargePenalty)); 

    // Scaling
    finalScore = (finalScore * 0.8) + (Math.min(1, (covMultiplier - 1) / 1.0) * 0.2);
    finalScore *= 100;
    
    // Accountability: Small bonus
    finalScore += Math.min(accountability, 20); 
    
    return {
        finalScore: Math.max(0, Math.min(99.9, Math.round(finalScore))),
        lexicalComplexity: mtld, burstiness: burstValue, entropy: planning.entropy,
        symmetry, planning: planning.entropy, consistency: 0, complexitySlope, semanticDrift,
        genre, accountability,
        structure: Math.round(uniformity), transitions: 0, passiveVoice: passiveDensity, contractions: hasContractions ? 0 : 100,
        sentenceStarters: uniformity, punctuation: 0, perfectionPoint
    };
}

export function identifyAiSentences(text: string): string[] {
    if (!text) return [];
    const sentences = text.match(sentenceRegex) || [];
    const aiSentences: string[] = [];
    const words = text.toLowerCase().split(/\s+/);
    const globalDrift = calculateSemanticDrift(words);
    const isLinearFlow = globalDrift < 45;

    sentences.forEach(s => {
        const lower = s.toLowerCase();
        let score = 0;
        if (Object.keys(VOCAB_MAP).some(w => lower.includes(w))) score += 30;
        if (lower.includes("it is important to note") || lower.includes("in conclusion") || lower.includes("furthermore")) score += 40;
        if (isLinearFlow) {
            const connectors = (lower.match(/\b(and|but|or|that|which|however|therefore|moreover)\b/g) || []).length;
            if (connectors > 2) score += 25; 
        }
        // Passive Voice detection in sentence
        if (/\b(is|are|was|were|be|been)\s+[a-z]+ed\b/i.test(lower)) score += 15;
        
        if (score >= 40) aiSentences.push(s.trim());
    });
    return aiSentences;
}

export function calculateHumanScore(text: string): DetectionMetrics & { aiSentences: string[] } {
    const metrics = calculateMetrics(text);
    // CRITICAL FIX: calculateMetrics returns the Human Probability Score (0-100).
    // Do NOT invert it.
    const humanScore = metrics.finalScore; 
    return {
        ...metrics,
        finalScore: humanScore,
        aiSentences: humanScore >= 90 ? [] : identifyAiSentences(text)
    };
}
