
import { calculateHumanScore } from '../src/lib/detector';

const SAMPLES = [
    {
        name: "HUMAN: Thesis Original",
        text: "The integration of renewable energy sources into existing power grids presents a multifaceted challenge requiring both technical and policy-driven solutions. While solar and wind power offer significant decarbonization potential, their inherent intermittency necessitates robust storage mechanisms and smart grid technologies to maintain stability. Furthermore, the transition is often hampered by aging infrastructure and complex regulatory frameworks.",
        label: "human"
    },
    {
        name: "AI: GPT-4 Physics",
        text: "The phenomenon of quantum entanglement represents one of the most intriguing aspects of modern physics. In this paper, we delve into the theoretical framework that governs the behavior of entangled particles. It is important to note that the correlation between these particles persists regardless of the distance separating them.",
        label: "ai"
    },
    {
        name: "AI: 'The Perfect Humanizer'",
        text: "Honestly, I was thinking about how we use technology today and it's kind of a mess, right? Like, delve into it (oops, hate that word), but if you really check the data, the complexity slope isn't just flat; it's all over the place. My supervisor once told me that the system performance is key, but honestly? I feel like we just use words to overcomplicate simple stuff. Not everything needs to be optimized to death, you know?",
        label: "ai"
    },
    {
        name: "HUMAN: Thesis Appeal Letter",
        text: "I Samuel Appiah and would like to formally file a complaint regarding my thesis review as I believe I deserve a better grade. The number of pages stated on my review paper is 57 and my actual submitted thesis has 68 pages. With regards to editing as my supervisor can attest, it was in accordance with the provided template and detailed attention was given to table and figure label including numbering of equations.",
        label: "human"
    }
];

console.log("=== 2-SIDED CLASSIFIER TEST (META-50 vs AI-GEN) ===\n");

SAMPLES.forEach(s => {
    const res = calculateHumanScore(s.text);
    const correctness = (s.label === "human" && res.finalScore > 50) || (s.label === "ai" && res.finalScore <= 50);
    console.log(`${s.name.padEnd(30)} | Human Score: ${res.finalScore}% | ${correctness ? "✅ PASS" : "❌ FAIL"}`);
});
