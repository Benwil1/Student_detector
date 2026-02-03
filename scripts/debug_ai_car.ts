
import { calculateHumanScore } from '../src/lib/detector';

const CAR_TEXT = `Cars are more than machines made of steel, rubber, and glass. They are woven into our daily lives in ways so subtle that we often forget how deeply they shape our experiences, emotions, and memories. From the quiet comfort of a morning commute to the thrill of an open road stretching endlessly ahead, cars occupy a unique space between utility and emotion.

For many people, a car represents freedom. The first time someone sits behind the wheel alone is often unforgettable. It is not just about driving from one place to another; it is about choice—the ability to leave, to explore, to arrive on one’s own terms. A car makes distance feel smaller and the world more reachable. Suddenly, a distant town is no longer a dot on a map but a possible destination for the weekend.

Cars also carry stories. Every scratch, worn seat, or faded button tells a quiet tale. A family car might remember years of school drop-offs, long holiday trips, and late-night drives home after celebrations. An old, unreliable car might be frustrating, yet deeply loved, because it stood by its owner during an important chapter of life. These machines witness moments of joy, stress, laughter, and silence without ever speaking a word.

Beyond personal meaning, cars reflect who we are and how we live. Some people value speed and performance, drawn to the sound of a powerful engine and the precision of sharp handling. Others prioritize comfort, safety, or efficiency, choosing a car that fits their routines and responsibilities. In recent years, this relationship has begun to change as electric and autonomous vehicles enter the scene, forcing us to rethink what driving means and what the future of mobility should look like.

Despite traffic jams, rising fuel costs, and environmental concerns, cars continue to hold a strong place in human culture. They appear in films, songs, and dreams as symbols of escape, ambition, and identity. Even when we complain about them, we rely on them and, in many ways, trust them with our lives.

In the end, a car is never just a car. It is a companion on ordinary days and extraordinary journeys alike. It carries not only people and luggage, but also memories, hopes, and pieces of who we are—moving steadily forward, one road at a time.`;

console.log("=== DEBUGGING AI CAR TEXT ===");
const result = calculateHumanScore(CAR_TEXT);
console.log(`Final Score: ${result.finalScore}%`);
console.log(result);
