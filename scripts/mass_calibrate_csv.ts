
import fs from 'fs';
import readline from 'readline';
import { calculateHumanScore } from '../src/lib/detector';

// Helper to parse a very simple CSV row (handles quotes roughly)
function parseCsvLine(line: string) {
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if (parts.length < 2) return null;
    let text = parts[0].replace(/^"|"$/g, '').replace(/""/g, '"');
    let generated = parts[1].trim();
    // Some lines might not have the 0.0/1.0 correctly if they were split weirdly
    return { text, generated: parseFloat(generated) };
}

async function massCalibrate() {
    const filePath = '/Users/bernard/Downloads/Main_Thesis-2/AI_Human.csv';
    
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let results = {
        human: { correct: 0, total: 0, scores: [] as number[] },
        ai: { correct: 0, total: 0, scores: [] as number[] }
    };

    console.log("=== MASS CALIBRATION (AI_Human.csv) - DEBUGGING LOW SCORES ===\n");

    let count = 0;
    const sampleLimit = 30;

    for await (const line of rl) {
        if (count === 0) { count++; continue; } 
        // Let's pick 15 human and 15 AI samples specifically
        const data = parseCsvLine(line);
        if (!data || isNaN(data.generated)) continue;

        const isAI = data.generated === 1.0;
        
        if (isAI && results.ai.total >= 15) continue;
        if (!isAI && results.human.total >= 15) continue;

        const scoreRes = calculateHumanScore(data.text);
        const finalScore = scoreRes.finalScore;

        if (isAI) {
            results.ai.total++;
            results.ai.scores.push(finalScore);
            if (finalScore < 50) results.ai.correct++;
        } else {
            results.human.total++;
            results.human.scores.push(finalScore);
            console.log(`HUMAN Sample ${results.human.total}: Score=${finalScore}% | MTLD=${scoreRes.lexicalComplexity.toFixed(0)} | Burst=${scoreRes.burstiness.toFixed(1)} | Slope=${scoreRes.complexitySlope.toFixed(0)} | Uniform=${scoreRes.structure.toFixed(0)}%`);
            if (finalScore >= 50) results.human.correct++;
        }

        if (results.human.total >= 15 && results.ai.total >= 15) break;
    }

    console.log(`\nAI Detection:    ${results.ai.correct}/${results.ai.total}`);
    console.log(`Human Detection: ${results.human.correct}/${results.human.total}`);
}

massCalibrate().catch(console.error);
