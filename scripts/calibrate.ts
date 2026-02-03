import fs from 'fs';
import path from 'path';

/**
 * CALIBRATION TOOL
 * 
 * This script processes human text samples and outputs the statistical distributions
 * needed for the detector's Z-score model.
 */

// Implementation of stylometric features (cloned from detector.ts for standalone use)
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
        if (currentCount > 0) sums += currentCount, counts++;
        return counts === 0 ? 0 : sums / counts;
    };
    return (computeMTLD(words) + computeMTLD([...words].reverse())) / 2;
}

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
    const clauseCounts = sentences.map(s => s.split(/,|and|but|because|although|while|if|when|that|which|who/i).length);
    const avgClauses = clauseCounts.reduce((a,b)=>a+b, 0) / clauseCounts.length;
    const clauseVar = clauseCounts.reduce((a,n) => a + Math.pow(n - avgClauses, 2), 0) / clauseCounts.length;
    return { entropy: lengthEntropy, clauseVar: Math.sqrt(clauseVar) };
}

async function calibrate() {
    const dataDir = path.join(process.cwd(), 'data/human');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.txt'));
    
    console.log(`Calibrating from ${files.length} files...`);
    
    const results = {
        mtld: [] as number[],
        burstiness: [] as number[],
        planningEntropy: [] as number[],
        clauseVar: [] as number[]
    };

    for (const file of files) {
        const text = fs.readFileSync(path.join(dataDir, file), 'utf8');
        const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        results.mtld.push(calculateMTLD(words));
        
        if (sentences.length >= 3) {
            const lengths = sentences.map(s => s.trim().split(/\s+/).length);
            const avg = lengths.reduce((a, b) => a + b) / lengths.length;
            const variance = lengths.reduce((a, n) => a + Math.pow(n - avg, 2), 0) / lengths.length;
            results.burstiness.push(Math.sqrt(variance));
        }

        const planning = calculatePlanningEntropy(sentences);
        results.planningEntropy.push(planning.entropy);
        results.clauseVar.push(planning.clauseVar);
    }

    const computeDist = (values: number[]) => {
        const mu = values.reduce((a,b)=>a+b, 0) / values.length;
        const sigma = Math.sqrt(values.reduce((a,n) => a + Math.pow(n - mu, 2), 0) / values.length);
        return { mu: parseFloat(mu.toFixed(2)), sigma: parseFloat(sigma.toFixed(2)) };
    };

    console.log('\n--- CALCULATED CALIBRATION ---');
    console.log(JSON.stringify({
        mtld: computeDist(results.mtld),
        burstiness: computeDist(results.burstiness),
        planningEntropy: computeDist(results.planningEntropy),
        clauseVar: computeDist(results.clauseVar)
    }, null, 2));
}

calibrate();
