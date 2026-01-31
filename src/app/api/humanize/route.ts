import { NextResponse } from "next/server";

const VOCAB_MAP: Record<string, string> = {
  "delve": "dig", "leverage": "use", "utilize": "use", "showcase": "show",
  "pivotal": "key", "testament": "proof", "landscape": "scene", "crucial": "important",
  "facilitate": "help", "opt": "choose", "employ": "use", "orchestrate": "set up",
  "demonstrate": "show", "illustrate": "show", "subsequently": "later", "consequently": "so",
  "furthermore": "also", "moreover": "plus"
};

const STUDENT_PHRASES: Record<string, string> = {
  "according to": "as I checked in",
  "due to the fact that": "because",
  "in conclusion": "so, basically,",
  "it is important to note that": "I think it's important that",
  "on the other hand": "but then again,",
};

const SEMANTIC_SIMPLIFER: Record<string, string> = {
  "high-conductivity": "strong signal",
  "fundamental shift": "big change",
  "paradigm": "way of thinking",
  "implementation": "setup",
  "infrastructure": "base system",
  "methodology": "way of doing it",
};

export async function POST(req: Request) {
  try {
    const { 
        text, 
        intensity = 70, 
        vocab = true, 
        grammar = true, 
        structure = true,
        burst = true, 
        fluff = false, 
        typo = false, 
        simplifier = false 
    } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    let processedText = text;

    // 1. Vocabulary Replacement
    if (vocab) {
        Object.entries(VOCAB_MAP).forEach(([formal, simple]) => {
        const regex = new RegExp(`\\b${formal}\\b`, "gi");
        processedText = processedText.replace(regex, (match: string) => {
            return match[0] === match[0].toUpperCase() 
            ? simple.charAt(0).toUpperCase() + simple.slice(1) 
            : simple;
        });
        });
    }

    // 2. Student Phrases
    if (grammar) {
        Object.entries(STUDENT_PHRASES).forEach(([formal, casual]) => {
        const regex = new RegExp(formal, "gi");
        processedText = processedText.replace(regex, casual);
        });
    }

    // 3. Smart Simplifier
    if (simplifier) {
        Object.entries(SEMANTIC_SIMPLIFER).forEach(([complex, simple]) => {
            const regex = new RegExp(complex, "gi");
            processedText = processedText.replace(regex, simple);
        });
    }

    // 4. Messy Structure (Splits headers, kills bullet points)
    if (structure) {
        // Kill bullet points
        processedText = processedText.replace(/^\s*[-*•]\s+(.*)$/gm, (match: string, p1: string) => {
            return Math.random() > 0.5 ? ` Also, ${p1.toLowerCase()}.` : ` ${p1}.`;
        });
        // Split headers (remove # or bold headers)
        processedText = processedText.replace(/^#+\s+(.*)$/gm, "$1."); 
    }

    // 5. Subjective Fluff
    if (fluff) {
        const fillers = [" basically,", " I guess,", " honestly,", " like,"];
        processedText = processedText.replace(/\.\s/g, (match: string) => {
            return Math.random() > 0.7 ? `${fillers[Math.floor(Math.random() * fillers.length)]} ` : match;
        });
    }

    // 6. Burstiness (Structure / Run-on sentences)
    if (burst || intensity > 80) {
        processedText = processedText.replace(/ — /g, ", ");
        // Break long sentences or create run-ons
        processedText = processedText.replace(/\.(?=\s[A-Z])/g, (match: string) => 
            Math.random() > 0.8 ? ", and" : match
        );
    }

    // 7. Lazy Typist (Typos)
    if (typo) {
        // Very subtle typos
        processedText = processedText.replace(/\bthe\b/gi, (match: string) => Math.random() > 0.95 ? "teh" : match);
        processedText = processedText.replace(/\band\b/gi, (match: string) => Math.random() > 0.95 ? "annd" : match);
        processedText = processedText.replace(/,/g, (match: string) => Math.random() > 0.9 ? "" : match); // Missed commas
    }

    // 8. Base Grammar quirks
    if (grammar && intensity > 40) {
        // Lowercase some "I"s (subtle)
        processedText = processedText.replace(/\bI\b/g, () => Math.random() > 0.8 ? "i" : "I");
    }

    // Simulated AI Score Calculation
    let scoreBase = 85;
    if (fluff) scoreBase += 5;
    if (typo) scoreBase += 5;
    if (simplifier) scoreBase += 2;
    if (structure) scoreBase += 3;
    
    const humanScore = Math.min(99.9, scoreBase + Math.random() * (100 - scoreBase));

    return NextResponse.json({
      text: processedText,
      humanScore: humanScore.toFixed(1),
      stats: {
        swappedWords: Math.floor(Math.random() * 10) + 5,
        structuralChanges: Math.floor(Math.random() * 5) + 2
      }
    });

  } catch (error) {
    console.error("Humanization error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
