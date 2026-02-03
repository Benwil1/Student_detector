
import { calculateHumanScore } from '../src/lib/detector';

const UNSEEN_HUMAN_HISTORY = `
The industrial revolution wasn't just about machines, it was fundamentally a shift in how people lived their daily lives. Before this, most families worked the land, but the enclose acts changed everything. People found themselves forced into cities, which were often dirty and overcrowded, just to survive. It is interesting to look at the diaries from this period because they show a mix of hope and despair. While production soared, the average worker didn't see the benefits for decades. Historians often debate the standard of living, but if you look at the height data from military records, people actually got shorter during the early 19th century, which suggests nutrition got worse, not better.
`;

const UNSEEN_AI_BIOLOGY = `
Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a byproduct. The process is crucial for life on Earth because it provides the primary energy source for nearly all organisms. Additionally, it is responsible for maintaining the oxygen levels in the atmosphere. The overall chemical equation for photosynthesis is 6CO2 + 6H2O + light energy yields C6H12O6 + 6O2. Therefore, understanding this mechanism is vital for agricultural advancements.
`;

const UNSEEN_OVER_HUMANIZED = `
Basically, the Roman Empire was, like, huge. Honestly, if you think about it, their roads were technically the internet of the ancient world. In a sense, they connected everyone. Curiously, Julius Caesar wasn't actually the emperor, which is kind of a common misconception. I mean, he was a dictator, but Augustus was the first real emperor. Arguably, the fall of Rome wasn't just one event. It was, arguably, a slow decline. At least I think so. Fundamentally, corruption was a big part of it.
`;

console.log("=== BLIND GENERALIZATION TEST (UNSEEN SAMPLES) ===\n");

const humanRes = calculateHumanScore(UNSEEN_HUMAN_HISTORY);
console.log(`1. UNSEEN HUMAN (History): ${humanRes.finalScore}%  [Expect > 50%]`);
console.log(`   - Deviation: ${humanRes.lexicalComplexity.toFixed(2)}`);

const aiRes = calculateHumanScore(UNSEEN_AI_BIOLOGY);
console.log(`2. UNSEEN AI (Biology):    ${aiRes.finalScore}%   [Expect < 20%]`);
console.log(`   - Uniformity: ${aiRes.sentenceStarters.toFixed(2)}%`);

const badRes = calculateHumanScore(UNSEEN_OVER_HUMANIZED);
console.log(`3. UNSEEN OVER-HUMANIZED:  ${badRes.finalScore}%   [Expect < 20%]`);
console.log(`   - Stylistic Surcharge Penalty Applied? ${badRes.finalScore < 30 ? "YES" : "NO"}`);

console.log("\nVerdict:");
if (humanRes.finalScore > 50 && aiRes.finalScore < 30 && badRes.finalScore < 30) {
    console.log("✅ PASSED: Logic generalizes to new topics/styles.");
} else {
    console.log("❌ FAILED: Algorithm may be over-fitted.");
}
