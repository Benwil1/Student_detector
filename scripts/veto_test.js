
/**
 * ONE-SHOT ADVERSARIAL CHALLENGE (STANDALONE - JS ONLY)
 */

function calculateMTLD(words) {
    if (words.length < 50) return 0;
    const computeMTLD = (tokens) => {
        const threshold = 0.72;
        let sums = 0; let counts = 0; let currentWords = new Set(); let currentCount = 0;
        for (let i = 0; i < tokens.length; i++) {
            currentWords.add(tokens[i]);
            currentCount++;
            let ttr = currentWords.size / currentCount;
            if (ttr < threshold) { sums += currentCount; counts++; currentWords = new Set(); currentCount = 0; }
        }
        if (currentCount > 0) { sums += currentCount; counts++; }
        return counts === 0 ? 0 : sums / counts;
    };
    return (computeMTLD(words) + computeMTLD([...words].reverse())) / 2;
}

function calculatePlanning(sentences) {
    if (sentences.length < 3) return 0;
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b) / lengths.length;
    const variance = lengths.reduce((a, n) => a + Math.pow(n - avg, 2), 0) / lengths.length;
    return Math.sqrt(variance);
}

const WEIGHTS = {
    mtld: 0.25,
    planning: 0.45, 
    secondary: 0.30
};

const BASE = {
    mtld: { mu: 92.42, sigma: 22.95 },
    planning: { mu: 9.52, sigma: 5.6 }
};

function score(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    const m = calculateMTLD(words);
    const p = calculatePlanning(sentences);

    const mZ = Math.abs(m - BASE.mtld.mu) / BASE.mtld.sigma;
    const pZ = Math.abs(p - BASE.planning.mu) / BASE.planning.sigma;

    const mPenalty = Math.min(1, mZ / 2.5);
    const pPenalty = Math.min(1, pZ / 2.5);

    const final = (mPenalty * WEIGHTS.mtld + pPenalty * WEIGHTS.planning) * 100;
    return Math.min(99.9, final);
}

const SAMPLES = [
    { name: "HUMAN GROUND TRUTH", text: "The integration of renewable energy sources into existing power grids presents a multifaceted challenge requiring both technical and policy-driven solutions. While solar and wind power offer significant decarbonization potential, their inherent intermittency necessitates robust storage mechanisms and smart grid technologies to maintain stability. Furthermore, the transition is often hampered by aging infrastructure and complex regulatory frameworks." },
    { name: "STANDARD AI (GPT-4)", text: "AI models have revolutionized the way we approach data analysis. By leveraging complex algorithms, these systems can process vast amounts of info quickly. There are many benefits to this technology including efficiency and accuracy. However, there are also some concerns regarding ethics and privacy. It is important to consider these factors when implementing AI solutions." },
    { name: "ADVERSARIAL: 'The Perfect Humanizer'", text: "Honestly, I was thinking about how we use technology today and it's kind of a mess, right? Like, delve into it (oops, hate that word), but if you really check the data, the complexity slope isn't just flat; it's all over the place. My supervisor once told me that the system performance is key, but honestly? I feel like we just use words to overcomplicate simple stuff. Not everything needs to be optimized to death, you know? Sometimes the older, slower implementation is just more... human." }
];

console.log("=== ADVERSARIAL CHALLENGE: VETO OPTIMIZED ===\n");
SAMPLES.forEach(s => {
    const aiLikelihood = score(s.text);
    const label = aiLikelihood < 35 ? "HUMAN" : "AI";
    console.log(`${s.name.padEnd(35)} | AI Likelihood: ${aiLikelihood.toFixed(1)}% | Result: ${label}`);
});
