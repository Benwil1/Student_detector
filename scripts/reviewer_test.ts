
import { calculateHumanScore } from '../src/lib/detector';

const REVIEWER_TEXT = `
If the total score is fewer than 50 the qualification of the thesis will be exclusively failed (mark 1). The
suggested mark depends on the reviewer’s textual evaluation: between 50 and 62 is passed(2); between 63
and 75 is satisfactory(3); between 76 and 88 is good(4); and between 89 and 100 is excellent(5).
Scoring explanation, strengths and weakneesses:
The thesis provides a broad overview of mapping, localization, SLAM, and path-planning fundamentals. The
structure is logically organized but remains mostly descriptive and lacks analytical depth, especially
regarding performance comparisons, algorithmic trade-offs, and real-world applicability. For example,
SLAM limitations and computational challenges are mentioned, but the thesis does not quantify complexity
or discuss practical selection criteria between SLAM variants beyond general statements such as
“computationally heavy” or “slow”. The explanation of filters (KF, EKF, PF) is technically sound, but again
remains purely literature-based; it does not demonstrate understanding through discussion of tuning,
covariance behavior, or real failure modes (e.g. linearization error growth in highly nonlinear systems). For
instance, particle filters are mentioned as computationally expensive, but no expression of time-complexity
or scaling behavior is given. The mapping & localization section explains various map types (spatial
occupancy, transition, semantic maps) but provides no justification why one representation was selected for
the final work, nor does it show examples, measurement results, or visualizations. Multiple algorithm names
If the total score is fewer than 50 the qualification of the thesis will be exclusively failed (mark 1). The
suggested mark depends on the reviewer’s textual evaluation: between 50 and 62 is passed(2); between 63
and 75 is satisfactory(3); between 76 and 88 is good(4); and between 89 and 100 is excellent(5).
`;

console.log("=== HARD TEST: REVIEWER TEXT ANALYSIS ===\n");

const res = calculateHumanScore(REVIEWER_TEXT);

console.log(`FINAL HUMAN SCORE: ${res.finalScore}%`);
console.log(`GENRE DETECTED: ${res.genre}`);
console.log(`\n--- COGNITIVE FINGERPRINT ---`);
console.log(`Lexical Diversity (MTLD): ${res.lexicalComplexity.toFixed(2)}`);
console.log(`Planning Entropy: ${res.planning.toFixed(2)}`);
console.log(`Semantic Drift: ${res.semanticDrift.toFixed(2)}`);
console.log(`Uniformity (Starters): ${res.sentenceStarters.toFixed(2)}%`);
console.log(`Passive Voice Density: ${res.passiveVoice.toFixed(2)}%`);
console.log(`Perfection Points: ${res.perfectionPoint}`);
console.log(`Accountability Bonus: ${res.accountability}%`);

if (res.finalScore > 50) {
    console.log("\nVERDICT: [ HUMAN ] - Professional reviewer pattern detected.");
} else {
    console.log("\nVERDICT: [ AI / SUSPICIOUS ] - Pattern matches AI structure centers.");
}
