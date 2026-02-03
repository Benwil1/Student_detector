
import { calculateHumanScore, calculateStylisticSurcharge } from '../src/lib/detector';

const BAD_HUMANIZER_TEXT = `In a sense, looking at this, if the total score is fewer than 50 the qualification of the thesis will be exclusively arguably, failed (mark 1). The suggested mark depends on the reviewer’s textual evaluation: between 50 and 62 is passed(2); between in a sense, 63 and 75 is satisfactory(3); between 76 and 88 is, I think, good(4); and between 89 and 100 is, technically, excellent(5). curiously. Scoring explanation, strengths and weakneesses: The thesis provides a broad overview of mapping, localization, SLAM, and path-planning fundamentals. The structure is logically organized but remains mostly descriptive and lacks analytical depth, especially about performance comparisons, algorithmic trade-offs, and real-world applicability, and for example, SLAM limitations and computational challenges are mentioned. thesis does not quantify complexity or discuss practical selection criteria between SLAM variants beyond general statements such as “computationally practically, heavy” or “slow”. The explanation of filters (KF, EKF, PF) is sound, but again remains purely literature-based; it does not show understanding through discussion of tuning, covariance behavior, or real failure modes (e. For instance, particle filters are mentioned as computationally fundamentally, expensive, but no expression of time-complexity or scaling behavior is given. I mean, given. Historically, the mapping & localization section explains various map types (spatial occupancy, transition, semantic maps). provides no justification why one representation was selected for the final work, nor does it show examples, measurement results, or visualizations. Multiple algorithm namesIf the total score is fewer than 50 the thesis's qualification will be exclusively failed (mark 1). at least i think so.`;

console.log("=== HUMANIZER ARTIFACT TEST ===\n");

const res = calculateHumanScore(BAD_HUMANIZER_TEXT);
const surcharge = calculateStylisticSurcharge(BAD_HUMANIZER_TEXT);

console.log(`FINAL HUMAN SCORE: ${res.finalScore}%`);
console.log(`Stylistic Surcharge RAW: ${surcharge}`);
console.log(`\n--- DETAILS ---`);
console.log(`Accountability: ${res.accountability}`);
console.log(`Perfection Point: ${res.perfectionPoint}`);
console.log(`Passive Density: ${res.passiveVoice.toFixed(2)}%`);
