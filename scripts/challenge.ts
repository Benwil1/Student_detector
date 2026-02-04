import { calculateHumanScore, calculateMetrics } from '../src/lib/detector';

/**
 * ADVERSARIAL CHALLENGE & WEIGHT OPTIMIZATION SUITE
 */

const ADVERSARIAL_SAMPLES = [
    {
        name: "Human Ground Truth (Thesis)",
        text: "The integration of renewable energy sources into existing power grids presents a multifaceted challenge requiring both technical and policy-driven solutions. While solar and wind power offer significant decarbonization potential, their inherent intermittency necessitates robust storage mechanisms and smart grid technologies to maintain stability. Furthermore, the transition is often hampered by aging infrastructure and complex regulatory frameworks that vary significantly across jurisdictions.",
        label: "human"
    },
    {
        name: "Standard AI (GPT-4)",
        text: "AI models have revolutionized the way we approach data analysis. By leveraging complex algorithms, these systems can process vast amounts of info quickly. There are many benefits to this technology including efficiency and accuracy. However, there are also some concerns regarding ethics and privacy. It is important to consider these factors when implementing AI solutions in various industries to ensure responsible use.",
        label: "ai"
    },
    {
        name: "Adversarial: The 'Perfect Humanizer' Prompt",
        text: "Honestly, I was thinking about how we use technology today and it's kind of a mess, right? Like, delve into it (oops, hate that word), but if you really check the data, the complexity slope isn't just flat; it's all over the place. My supervisor once told me that the system performance is key, but honestly? I feel like we just use words to overcomplicate simple stuff. Not everything needs to be optimized to death, you know? Sometimes the older, slower implementation is just more... human.",
        label: "ai" 
    }
];

function runChallenge() {
    console.log("=== ADVERSARIAL STRESS TEST ===\n");

    const results = ADVERSARIAL_SAMPLES.map(sample => {
        const result = calculateHumanScore(sample.text);
        const prediction = result.finalScore < 50 ? "AI" : "Human";
        const success = (sample.label === "human" && prediction === "Human") || (sample.label === "ai" && prediction === "AI");
        
        return {
            name: sample.name.padEnd(40),
            score: (result.finalScore + "%").padEnd(10),
            prediction: prediction.padEnd(10),
            status: success ? "✅ PASS" : "❌ FAIL"
        };
    });

    results.forEach(r => console.log(`${r.name} | Score: ${r.score} | Pred: ${r.prediction} | ${r.status}`));

    console.log("\n=== VETO POWER OPTIMIZATION ===\n");
    console.log("1. PLANNING ENTROPY (30%) -> Primary Veto on 'monotone' structure.");
    console.log("2. MAHALANOBIS MULTIPLIER -> The 'Logic Veto'—detects inconsistent feature clouds.");
}

runChallenge();

