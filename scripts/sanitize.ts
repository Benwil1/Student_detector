import fs from 'fs';
import path from 'path';

/**
 * COMMON CRAWL SANITIZER
 * 
 * This tool filters raw web text to remove obvious AI-generated content.
 * It uses the detector's cognitive metrics (Burstiness, Planning Entropy)
 * as high-pass filters.
 */

// Filter Settings
const FILTERS = {
    minWords: 100,
    maxRepetitionRatio: 0.15, // Max ratio of repeated 3-word chunks
    minBurstiness: 5,        // Typical human burstiness floor
    minPlanningEntropy: 1.0   // Typical human planning floor
};

function calculateBurstiness(sentences: string[]): number {
    if (sentences.length < 3) return 0;
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b) / lengths.length;
    const variance = lengths.reduce((a, n) => a + Math.pow(n - avg, 2), 0) / lengths.length;
    return Math.sqrt(variance);
}

function calculateRepetition(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    if (words.length < 30) return 0;
    const trigrams: string[] = [];
    for (let i = 0; i < words.length - 2; i++) {
        trigrams.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
    const unique = new Set(trigrams).size;
    return 1 - (unique / trigrams.length);
}

async function sanitize() {
    const rawDir = path.join(process.cwd(), 'data/raw');
    const cleanDir = path.join(process.cwd(), 'data/human');
    
    if (!fs.existsSync(rawDir)) {
        console.log('No raw data found in data/raw. Create this folder and add .txt files to sanitize.');
        return;
    }

    const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.txt'));
    console.log(`Analyzing ${files.length} files from Common Crawl / The Pile...`);

    let passed = 0;
    for (const file of files) {
        const text = fs.readFileSync(path.join(rawDir, file), 'utf8');
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const words = text.split(/\s+/);

        if (words.length < FILTERS.minWords) continue;

        const burst = calculateBurstiness(sentences);
        const rep = calculateRepetition(text);
        
        // Logical Gate: If text is too "clean" (low repetition) but "monotone" (low burstiness), it's likely AI.
        const isSuspicious = (burst < FILTERS.minBurstiness) && (rep < 0.05);

        if (!isSuspicious && rep < FILTERS.maxRepetitionRatio) {
            fs.writeFileSync(path.join(cleanDir, `clean_${file}`), text);
            passed++;
        }
    }

    console.log(`Sanitization complete. ${passed}/${files.length} files passed the 'Cognitive Spontaneity' filter.`);
}

sanitize();
