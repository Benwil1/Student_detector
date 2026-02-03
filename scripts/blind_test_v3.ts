
import { calculateHumanScore } from '../src/lib/detector';

const UNSEEN_HUMAN_NEWS = `
Local officials announced yesterday that the city's new recycling program will officially launch next month. "We know residents have been waiting for this," said Mayor Johnson during a press conference at City Hall. The program involves blue bins for glass and plastic, while paper gets its own yellow bag. Residents I spoke to seemed generally positive, although some were confused about the pickup schedule. One neighbor told me, "I just hope they actually come on time." The city promises to distribute flyers explaining the details by Friday.
`;

const UNSEEN_AI_CODING_TUTORIAL = `
In this tutorial, we will explore how to build a React component. React is a popular JavaScript library for building user interfaces. First, we need to set up our environment using Create React App. This tool configures everything for us. Next, we will create a simple button component. The button will accept a label prop and an onClick handler. It is important to remember that props are read-only in React. By following these steps, you can create reusable UI elements easily.
`;

const UNSEEN_HUMAN_EMAIL = `
Hey Sarah,
Just wanted to check in about the project. I've finished the draft, but honestly, it's a bit of a mess right now. I was hoping you could take a quick look? Also, are we still meeting on Tuesday, or did that get moved? Let me know when you have a sec. Thanks!
`;

console.log("=== BLIND TEST V3 (NEWS, TECHNICAL, EMAIL) ===\n");

const newsRes = calculateHumanScore(UNSEEN_HUMAN_NEWS);
console.log(`1. UNSEEN HUMAN (News):    ${newsRes.finalScore}%  [Expect > 50%]`);

const codeRes = calculateHumanScore(UNSEEN_AI_CODING_TUTORIAL);
console.log(`2. UNSEEN AI (Tutorial):   ${codeRes.finalScore}%   [Expect < 25%]`);

const emailRes = calculateHumanScore(UNSEEN_HUMAN_EMAIL);
console.log(`3. UNSEEN HUMAN (Email):   ${emailRes.finalScore}%   [Expect > 60%]`);

console.log("\nVerdict:");
const passed = newsRes.finalScore > 50 && codeRes.finalScore < 25 && emailRes.finalScore > 60;
console.log(passed ? "✅ PASSED all checks." : "❌ FAILED one or more checks.");
