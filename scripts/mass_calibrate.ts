import fs from 'fs';
import path from 'path';

/**
 * MASS CALIBRATION ENGINE
 * 
 * This script processes the expanded 'Meta-50' dataset across 5 genres.
 */

interface Dist { mu: number; sigma: number; }

function calculateMTLD(words: string[]): number {
    if (words.length < 50) return 0;
    const computeMTLD = (tokens: string[]) => {
        const threshold = 0.72;
        let sums = 0; let counts = 0; let currentWords = new Set<string>(); let currentCount = 0;
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

function calculatePlanningEntropy(sentences: string[]): { entropy: number, clauseVar: number } {
    if (sentences.length < 4) return { entropy: 0, clauseVar: 0 };
    const bins = sentences.map(s => {
        const len = s.split(/\s+/).length;
        if (len <= 10) return 1; if (len <= 20) return 2; if (len <= 30) return 3; if (len <= 45) return 4; return 5;
    });
    const counts: Record<number, number> = {};
    bins.forEach(b => counts[b] = (counts[b] || 0) + 1);
    const len = bins.length;
    const entropy = Object.values(counts).reduce((s, f) => s - ((f/len) * Math.log2(f/len)), 0);
    
    const clauseCounts = sentences.map(s => s.split(/,|and|but|because|although|while|if|when|that|which|who/i).length);
    const avg = clauseCounts.reduce((a,b)=>a+b, 0) / clauseCounts.length;
    const variance = clauseCounts.reduce((a,n) => a + Math.pow(n - avg, 2), 0) / clauseCounts.length;
    return { entropy, clauseVar: Math.sqrt(variance) };
}

async function runMassCalibration() {
    const genres = ['academic', 'technical', 'narrative', 'formal_admin'];
    const finalDist: Record<string, any> = {};

    for (const genre of genres) {
        const dir = path.join(process.cwd(), `data/human_mass/${genre}`);
        if (!fs.existsSync(dir)) continue;
        
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt'));
        if (files.length === 0) continue;

        console.log(`Processing Genre: ${genre} (${files.length} sources)`);
        
        const metrics = { mtld: [], burstiness: [], planningEntropy: [], clauseVar: [] };

        for (const file of files) {
            const text = fs.readFileSync(path.join(dir, file), 'utf8');
            const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            
            metrics.mtld.push(calculateMTLD(words));
            const planning = calculatePlanningEntropy(sentences);
            metrics.planningEntropy.push(planning.entropy);
            metrics.clauseVar.push(planning.clauseVar);
            
            if (sentences.length >= 3) {
                const lengths = sentences.map(s => s.split(/\s+/).length);
                const avg = lengths.reduce((a,b)=>a+b)/lengths.length;
                metrics.burstiness.push(Math.sqrt(lengths.reduce((a,n)=>a+Math.pow(n-avg,2),0)/lengths.length));
            }
        }

        const stats = (arr: number[]) => {
            const mu = arr.reduce((a,b)=>a+b,0)/arr.length;
            const sigma = Math.sqrt(arr.reduce((a,n)=>a+Math.pow(n-mu,2),0)/arr.length);
            return { mu: parseFloat(mu.toFixed(2)), sigma: parseFloat(sigma.toFixed(3)) || 1.0 };
        };

        finalDist[genre] = {
            mtld: stats(metrics.mtld),
            burstiness: stats(metrics.burstiness),
            planningEntropy: stats(metrics.planningEntropy),
            clauseVar: stats(metrics.clauseVar),
            mu: [stats(metrics.mtld).mu, stats(metrics.burstiness).mu, stats(metrics.planningEntropy).mu, stats(metrics.clauseVar).mu]
        };
    }

    console.log("\n--- META-50 DISTRIBUTIONS ---");
    console.log(JSON.stringify(finalDist, null, 2));
}

runMassCalibration();
