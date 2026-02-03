
import { exec } from 'child_process';
import util from 'util';
import { calculateHumanScore } from '../src/lib/detector';

const execAsync = util.promisify(exec);

const THESIS_TEXT = `In this thesis, I develop a software framework for the proactive obstacle avoidance on Universal Robots UR10 robot which is based on Deep Reinforcement Learning (DRL). I decided to focus on this problem because navigation of robots in dynamic environments is very hard, especially where humans and robots work together in same space. Therefore, for my methodology, I implemented a Soft Actor-Critic (SAC) agent. I trained this agent in high-fidelity simulation environment in CoppeliaSim (V-REP). I found that this DRL approach is good because it teaches direct mapping from raw sensor inputs to joint velocities, and this enables real-time evasion.

In addition, I developed custom "Sim-to-Real" training pipeline that integrates physics-based capacitive sensor modeling. At first I worried about noise, so domain randomization is used to ensure that learned policy is robust to noise and latency. However, I also introduced hybrid control architecture where commands are filtered through safety shield because it needs to be compliant with ISO 15066. The simulation results show that this system reduces collision rates, and on the other hand it maintains higher operational speeds than traditional methods. So I think the system provides effective obstacle avoidance that is actually more responsive`;

async function runDoubleShield() {
    console.log("=== DOUBLE SHIELD ANALYSIS ===\n");
    console.log("Analyzing Text:\n" + THESIS_TEXT.substring(0, 100) + "...\n");

    // 1. Linguistic Detector (TypeScript)
    console.log("--> Running Structural/Linguistic Scan...");
    const lingRes = calculateHumanScore(THESIS_TEXT);
    console.log(`    Linguistic Score: ${lingRes.finalScore}% Human`);
    console.log(`    Signals: Burstiness=${lingRes.burstiness.toFixed(1)}, Uniformity=${lingRes.structure.toFixed(1)}%, Slope=${lingRes.complexitySlope}`);

    // 2. ML Detector (Python)
    console.log("--> Running ML Vocabulary Scan...");
    try {
        // Escape quotes for command line
        const escapedText = THESIS_TEXT.replace(/"/g, '\\"');
        const { stdout } = await execAsync(`python3 scripts/predict_single.py "${escapedText}"`);
        const aiProb = parseFloat(stdout.trim());
        const humanConf = (1 - aiProb) * 100;
        
        console.log(`    ML Score:         ${humanConf.toFixed(1)}% Human`);
        console.log(`    (AI Confidence:   ${(aiProb * 100).toFixed(1)}%)`);

        // 3. Combined Verdict
        console.log("\n=== FINAL VERDICT ===");
        const avgScore = (lingRes.finalScore + humanConf) / 2;
        
        let verdict = "UNCERTAIN";
        if (avgScore > 60) verdict = "HUMAN";
        else if (avgScore < 40) verdict = "AI";
        else verdict = "MIXED/SKEWED";

        console.log(`Combined Score: ${avgScore.toFixed(1)}%`);
        console.log(`Classification: [ ${verdict} ]`);

        if (Math.abs(lingRes.finalScore - humanConf) > 30) {
            console.log("\n⚠️ WARNING: Large divergence between detectors.");
            if (lingRes.finalScore > humanConf) {
                console.log("   - Structure looks Human, but Vocabulary looks AI.");
                console.log("   - Recommendation: Use synonyms for formal words (e.g., 'Therefore', 'However').");
            } else {
                console.log("   - Vocabulary looks Human, but Structure looks AI.");
                console.log("   - Recommendation: Vary sentence lengths and types.");
            }
        }

    } catch (e) {
        console.error("Error running ML model:", e);
    }
}

runDoubleShield().catch(console.error);
