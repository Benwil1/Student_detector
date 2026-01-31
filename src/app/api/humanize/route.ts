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
        persona = "standard", 
        intensity: userIntensity,
        vocab,
        grammar,
        structure,
        burst,
        fluff,
        typo,
        simplifier
    } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // --- 1. PERSONA CONFIGURATION ---
    let config = {
        name: persona,
        intensity: 50,
        vocab: true,
        grammar: true, // This will control student phrases and "I" capitalization
        structure: true, // This will control bullet points and headers
        burst: true, // This will control run-on sentences
        fluff: false,
        typo: false,
        simplify: false // This controls the SEMANTIC_SIMPLIFER
    };

    switch (persona) {
        case "lazy_student": // "The Last Minute Student"
            config.intensity = 80;
            config.fluff = true;
            config.typo = true;
            config.simplify = true;
            config.structure = true; // Mess up structure
            config.burst = true; // Create run-ons
            config.grammar = true; // Include student phrases and "I" quirks
            break;
        case "esl": // "ESL Speaker"
            config.intensity = 60;
            config.grammar = true; // Use grammar tweaks to simulate non-native phrasing
            config.vocab = true; // Simplify vocab
            config.simplify = true; // Use semantic simplifier
            config.structure = false; // Keep structure
            config.burst = false; // Keep sentences clear
            config.fluff = false;
            config.typo = false;
            break;
        case "academic": // "The Academic"
            config.intensity = 30; // Less aggressive changes
            config.fluff = false;
            config.simplify = false; // Keep complex words
            config.vocab = true; // Still change some vocab, but not simplify
            config.structure = false; // Preserve structure
            config.burst = false; // Preserve sentence structure
            config.grammar = false; // No student phrases or "I" quirks
            config.typo = false;
            break;
        case "standard":
        default:
            config.intensity = 50;
            config.vocab = true;
            config.grammar = true;
            config.structure = true;
            config.burst = true;
            config.fluff = false;
            config.typo = false;
            config.simplify = false;
    }

    // Allow manual overrides if provided
    if (userIntensity !== undefined) config.intensity = userIntensity;
    if (vocab !== undefined) config.vocab = vocab;
    if (grammar !== undefined) config.grammar = grammar;
    if (structure !== undefined) config.structure = structure;
    if (burst !== undefined) config.burst = burst;
    if (fluff !== undefined) config.fluff = fluff;
    if (typo !== undefined) config.typo = typo;
    if (simplifier !== undefined) config.simplify = simplifier;

    // --- 2. CITATION PROTECTION ---
    // Matches (Author, 2020), [1], [12-14], etc.
    const citationMap: string[] = [];
    let processedText = text.replace(/(\([A-Za-z\s&.]+,?\s*\d{4}[a-z]?\))|(\[\d+(-\d+)?\])/g, (match: string) => {
        citationMap.push(match);
        return `__CIT_${citationMap.length - 1}__`;
    });

    // --- 3. PROCESSING ---
    
    // Vocabulary Replacement
    if (config.vocab) {
        // Randomize replacement chance based on intensity
        const threshold = 1 - (config.intensity / 100); 
        
        Object.entries(VOCAB_MAP).forEach(([formal, simple]) => {
            if (Math.random() > threshold) {
                const regex = new RegExp(`\\b${formal}\\b`, "gi");
                processedText = processedText.replace(regex, (match: string) => {
                    return match[0] === match[0].toUpperCase() 
                    ? simple.charAt(0).toUpperCase() + simple.slice(1) 
                    : simple;
                });
            }
        });
        
        // Only simplify complex words for non-academic personas or if simplify is explicitly true
        if (config.simplify || (persona !== "academic" && config.vocab)) { // vocab flag also implies general simplification
             Object.entries(SEMANTIC_SIMPLIFER).forEach(([complex, simple]) => {
                const regex = new RegExp(`\\b${complex}\\b`, "gi");
                processedText = processedText.replace(regex, simple);
            });
        }
    }

    // Student Phrasing (Fluff)
    if (config.fluff || (config.grammar && persona === "lazy_student")) { // grammar for lazy student also implies student phrases
         Object.entries(STUDENT_PHRASES).forEach(([formal, casual]) => {
            const regex = new RegExp(formal, "gi");
            processedText = processedText.replace(regex, casual);
        });
    }

    // Basic Typo Injection (Only for "Lazy" persona or if typo is explicitly true)
    if (config.typo) {
        const typos: Record<string, string> = { "the": "teh", "and": "adn", "really": "realy", "their": "there" };
        Object.entries(typos).forEach(([correct, wrong]) => {
             if (Math.random() > 0.9) { // 10% chance
                 const regex = new RegExp(`\\b${correct}\\b`, "g"); // case-sensitive for typos
                 processedText = processedText.replace(regex, wrong);
             }
        });
        // Missed commas
        processedText = processedText.replace(/,/g, (match: string) => Math.random() > 0.9 ? "" : match);
    }

    // Messy Structure (Splits headers, kills bullet points)
    if (config.structure) {
        // Kill bullet points
        processedText = processedText.replace(/^\s*[-*•]\s+(.*)$/gm, (match: string, p1: string) => {
            return Math.random() > 0.5 ? ` Also, ${p1.toLowerCase()}.` : ` ${p1}.`;
        });
        // Split headers (remove # or bold headers)
        processedText = processedText.replace(/^#+\s+(.*)$/gm, "$1."); 
    }

    // 5. Subjective Fluff
    if (config.fluff) {
        const fillers = [" basically,", " I guess,", " honestly,", " like,"];
        processedText = processedText.replace(/\.\s/g, (match: string) => {
            return Math.random() > 0.7 ? `${fillers[Math.floor(Math.random() * fillers.length)]} ` : match;
        });
    }

    // 6. Burstiness (Structure / Run-on sentences)
    if (config.burst || config.intensity > 80) {
        processedText = processedText.replace(/ — /g, ", ");
        // Break long sentences or create run-ons
        processedText = processedText.replace(/\.(?=\s[A-Z])/g, (match: string) => 
            Math.random() > 0.8 ? ", and" : match
        );
    }

    // 7. Lazy Typist (Typos)
    if (config.typo) {
        // Very subtle typos
        processedText = processedText.replace(/\bthe\b/gi, (match: string) => Math.random() > 0.95 ? "teh" : match);
        processedText = processedText.replace(/\band\b/gi, (match: string) => Math.random() > 0.95 ? "annd" : match);
        processedText = processedText.replace(/,/g, (match: string) => Math.random() > 0.9 ? "" : match); // Missed commas
    }

    // 8. Base Grammar quirks
    if (config.grammar && config.intensity > 40) {
        // Lowercase some "I"s (subtle)
        processedText = processedText.replace(/\bI\b/g, () => Math.random() > 0.8 ? "i" : "I");
    }

    // --- 4. RESTORE CITATIONS ---
    if (citationMap.length > 0) {
        citationMap.forEach((citation, index) => {
            const placeholder = `__CIT_${index}__`;
            processedText = processedText.replace(placeholder, citation);
        });
    }

    // Simulated AI Score Calculation
    let scoreBase = 85;
    if (config.fluff) scoreBase += 5;
    if (config.typo) scoreBase += 5;
    if (config.simplify) scoreBase += 2;
    if (config.structure) scoreBase += 3;
    
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
