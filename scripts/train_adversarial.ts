
import fs from 'fs';
import path from 'path';
import { calculateHumanScore } from '../src/lib/detector';
import { HumanizerConfig, humanizeText, sanityPass } from '../src/lib/humanizer_service';

/**
 * ADVERSARIAL TRAINER
 * 
 * Goals:
 * 1. Takes AI text.
 * 2. Mutates Humanizer Config parameters.
 * 3. Checks Score.
 * 4. Saves the CONFIG that beats the Detector.
 */

const TRAINING_SAMPLES = [
    `The integration of renewable energy sources into existing power grids presents a multifaceted challenge requiring both technical and policy-driven solutions. While solar and wind power offer significant decarbonization potential, their inherent intermittency necessitates robust storage mechanisms and smart grid technologies to maintain stability. Furthermore, the transition is often hampered by aging infrastructure and complex regulatory frameworks that vary significantly across jurisdictions.`,
    
    `Artificial Intelligence (AI) has revolutionized the way we approach complex problem-solving. By leveraging advanced machine learning algorithms, systems can now process vast amounts of data at unprecedented speeds. However, this rapid advancement raises ethical concerns regarding privacy, bias, and the potential displacement of jobs. It is crucial that we establish robust regulatory frameworks to govern the development and deployment of these powerful technologies.`,
    
    `In conclusion, the results of this study demonstrate a clear correlation between sleep quality and cognitive performance. The data indicates that individuals who consistently achieve seven to eight hours of sleep per night exhibit superior memory retention and problem-solving abilities compared to those with irregular sleep patterns. Therefore, it is recommended that public health initiatives prioritize sleep education as a fundamental component of overall well-being.`
];

function runTraining() {
    console.log("⚔️ STARTING ADVERSARIAL TRAINING LOOP...\n");

    let bestConfig: HumanizerConfig = {
        name: "optimized_standard",
        intensity: 50,
        vocab: true,
        grammar: true,
        structure: true,
        burst: true,
        fluff: false,
        typo: false,
        simplify: false
    };

    let bestAvgScore = 0;

    // GENERATION 1: Brute Force Random Search (100 iterations)
    // We vary intensity (40-100) and toggle flags.
    
    for (let i = 0; i < 50; i++) {
        // Mutate Config
        const currentConfig = { ...bestConfig };
        
        // Random Mutations
        if (Math.random() > 0.3) currentConfig.intensity = Math.floor(Math.random() * 60) + 40; // 40-100
        if (Math.random() > 0.5) currentConfig.burst = !currentConfig.burst;
        if (Math.random() > 0.5) currentConfig.vocab = !currentConfig.vocab;
        if (Math.random() > 0.5) currentConfig.structure = !currentConfig.structure;
        // Keep typo false for quality!

        // Evaluate on all samples
        let totalScore = 0;
        
        TRAINING_SAMPLES.forEach(text => {
            const humanized = humanizeText(text, currentConfig);
            const clean = sanityPass(humanized);
            const score = calculateHumanScore(clean).finalScore;
            totalScore += score;
        });

        const avgScore = totalScore / TRAINING_SAMPLES.length;

        // Log Progress
        if (avgScore > bestAvgScore) {
            console.log(`[GEN ${i}] 🚀 NEW RECORD: ${avgScore.toFixed(1)}% Human Score`);
            console.log(`   Params: Intensity=${currentConfig.intensity}, Burst=${currentConfig.burst}, Structure=${currentConfig.structure}`);
            bestAvgScore = avgScore;
            bestConfig = currentConfig;
        }
    }

    console.log("\n🏆 TRAINING COMPLETE. BEST STRATEGY FOUND:");
    console.log(JSON.stringify(bestConfig, null, 2));

    // Save to file
    const outputPath = path.join(process.cwd(), 'src/lib/humanizer_config.json');
    fs.writeFileSync(outputPath, JSON.stringify(bestConfig, null, 2));
    console.log(`\n💾 Saved optimized configuration to ${outputPath}`);
}

runTraining();
