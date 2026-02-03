
import { calculateHumanScore } from '../src/lib/detector';

const TEXT = `There’s something strangely comforting about the smell of rain on asphalt. It’s one of those little things that makes you pause, even if just for a second, in the middle of a busy day. Life rarely lets you stop, but when it does, it gives you moments like that—tiny pauses where the world feels softer. Maybe it’s the sound of footsteps splashing through puddles, or the quiet hum of cars driving past, or even the way people suddenly seem a little more aware, a little more human.

I’ve always been fascinated by mornings. Not the pristine, Instagram-worthy kind with golden sunlight spilling over a perfectly made bed. No, the real mornings—the ones where you wake up before your alarm, a little groggy, with a tangled sheet around your leg, thinking about the things you didn’t get done yesterday. That’s when the world feels honest. You’re alone with your thoughts, with your coffee slowly cooling on the counter, and for a moment, it’s just you and the quiet possibilities of the day.

People say life is full of moments, but it’s funny how the small ones—the ones that don’t make the highlight reels—often stick the longest. A shared laugh with a stranger, a dog running across the street and looking at you like you’re part of the adventure, a song on the radio that somehow knows exactly what you’re feeling. Those are the things that linger, tucked into corners of memory, ready to appear when you least expect them.

Sometimes, I think the best part of being human is being allowed to feel so much, so deeply, for no reason at all. Sadness, joy, excitement, boredom—they all swirl together in this messy, unpredictable way. And even when life doesn’t make sense, there’s comfort in the chaos, in knowing that tomorrow will come with its own set of small wonders.

In the end, life isn’t about grand achievements or perfect days. It’s about noticing, really noticing, the little things. A cup of tea that’s just a bit too hot, the way sunlight hits your window in the afternoon, the smile of someone who doesn’t even kn`;

console.log("=== EVALUATING USER TEXT ===");
const res = calculateHumanScore(TEXT);
console.log(`FINAL SCORE: ${res.finalScore}%`);
console.log(res);
