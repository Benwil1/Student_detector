
// SHARED HUMANIZER LOGIC (Extracted for Training Support)

export interface HumanizerConfig {
    name?: string;
    intensity: number;
    vocab: boolean;
    grammar: boolean;
    structure: boolean;
    burst: boolean;
    fluff: boolean;
    typo: boolean;
    simplify: boolean;
}

const VOCAB_MAP: Record<string, string> = {
  "delve": "dig", "leverage": "use", "utilize": "use", "showcase": "show",
  "pivotal": "key", "testament": "proof", "landscape": "scene", "crucial": "important",
  "facilitate": "help", "opt": "choose", "employ": "use", "orchestrate": "set up",
  "demonstrate": "show", "illustrate": "show", "subsequently": "later", "consequently": "so",
  "furthermore": "also", "moreover": "plus", "regarding": "about", "robust": "strong",
  "meticulous": "careful", "scrutinize": "check", "ascertain": "find out", "endeavor": "try",
  "proficient": "good", "adequate": "enough", "foster": "help", "augment": "add to",
  "commence": "start", "terminate": "end", "initiate": "start", "necessitate": "need",
  "manifest": "show", "signifies": "means", "depict": "show", "exemplify": "show",
  "comprise": "have", "constitute": "make up", "diminish": "drop", "yield": "give",
  "elucidate": "explain", "expedite": "speed up", "fabricate": "make", "fluctuate": "change",
  "generate": "make", "implement": "do", "objective": "goal", "perceive": "see",
  "predominantly": "mostly", "prevalent": "common", "procedure": "step", "prohibit": "stop"
};

const RARE_VOCAB_CONTEXTS: Record<string, { options: string[], forbiddenFollowers?: string[] }> = {
    "significant": { 
        options: ["huge", "big", "main"], 
        forbiddenFollowers: ["growth", "increase", "difference"] 
    },
    "increase": { options: ["bump", "jump", "spike"] },
    "decrease": { options: ["drop", "dip", "crash"] },
    "important": { options: ["key", "big", "main"] },
    "very": { options: ["pretty", "kinda"] },
    "good": { options: ["solid", "decent", "okay"] },
    "bad": { options: ["rough", "messy", "janky"] },
    "difficult": { options: ["tough", "hard", "tricky"] },
    "interesting": { options: ["cool", "weird", "wild"] }
};

const EXTREME_VOCAB: Record<string, string[]> = {
    "significant": ["crazy", "wild", "massive"],
    "very": ["insanely", "super"],
    "good": ["killer", "awesome"],
    "bad": ["trash", "garbage"],
    "interesting": ["insane", "baller"]
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

export function humanizeText(text: string, config: HumanizerConfig): string {
    let processedText = text;
    const citationMap: string[] = [];
    const persona = config.name || "standard";

    // --- CITATION PROTECTION ---
    processedText = processedText.replace(/(\([A-Za-z\s&.]+,?\s*\d{4}[a-z]?\))|(\[\d+(-\d+)?\])/g, (match: string) => {
        citationMap.push(match);
        return `__CIT_${citationMap.length - 1}__`;
    });
    
    // --- 2. ESL ENGINE (The "Foreign Student" Fingerprint) ---
    // A. ARTICLE DROPPING 
    processedText = processedText.replace(/(\s|^)\b(the|a|an)\s+([a-z]+)\b/gi, (match: string, space: string, art: string, noun: string) => {
         const isStart = space === "";
         const isThe = art.toLowerCase() === "the";
         const threshold = isThe ? 0.88 : 0.95; 
         if (isStart) return match; 
         return Math.random() > threshold ? `${space}${noun}` : match; 
    });

    // B. PREPOSITION SWAPPING
    const prepMap: Record<string, string> = { " in ": " on ", " on ": " at ", " at ": " in ", " for ": " to ", " to ": " for " };
    processedText = processedText.replace(/\s(in|on|at|for|to)\s/g, (match: string) => {
         return Math.random() > 0.85 ? prepMap[match] || match : match;
    });

    // C. PLURALIZATION ERRORS 
    const uncountables = ["information", "software", "music", "advice", "knowledge", "equipment", "homework"];
    uncountables.forEach(word => {
         const regex = new RegExp(`\\b${word}\\b`, "gi");
         processedText = processedText.replace(regex, `${word}s`); 
    });

    // D. VERB TENSE SLIPS 
    processedText = processedText.replace(/\b(he|she|it)\s+([a-z]+)s\b/g, (match: string, pro: string, verb: string) => {
         return Math.random() > 0.7 ? `${pro} ${verb}` : match;
    });

    // --- 3. SMART SIMPLIFIER ---
    const simpleMap: Record<string, string> = {
        "consequently": "so", "furthermore": "also", "moreover": "plus",
        "however": "but", "therefore": "so", "utilize": "use", "utilizes": "uses",
        "demonstrate": "show", "demonstrates": "shows", "facilitate": "help",
        "implement": "do", "implementation": "doing", "methodology": "method",
        "approximately": "about", "subsequently": "then", "nevertheless": "still",
        "regarding": "about", "assistance": "help", "objective": "goal"
    };
    Object.keys(simpleMap).forEach(complex => {
        const regex = new RegExp(`\\b${complex}\\b`, "gi");
        processedText = processedText.replace(regex, simpleMap[complex]);
    });

    // --- 3.5 PREDICTABILITY KILLER (Context-Aware Rare Synonym Injection) ---
    if (config.vocab) {
        Object.keys(RARE_VOCAB_CONTEXTS).forEach(word => {
             const regex = new RegExp(`\\b(${word})\\s+([a-z]+)\\b`, "gi");
             processedText = processedText.replace(regex, (match: string, target: string, follower: string) => {
                 const configObj = RARE_VOCAB_CONTEXTS[word];
                 const isExtremePersona = config.intensity > 85 || persona === "lazy_student";
                 if (configObj.forbiddenFollowers?.includes(follower.toLowerCase())) return match;
                 if (Math.random() > 0.5) {
                     let pool = [...configObj.options];
                     if (isExtremePersona && EXTREME_VOCAB[word]) pool = [...pool, ...EXTREME_VOCAB[word]];
                     const chosen = pool[Math.floor(Math.random() * pool.length)];
                     const replacement = target[0] === target[0].toUpperCase() ? chosen.charAt(0).toUpperCase() + chosen.slice(1) : chosen;
                     return `${replacement} ${follower}`;
                 }
                 return match;
             });
        });
    }

    // Vocabulary Replacement (Legacy)
    if (config.vocab) {
        const threshold = 1 - (config.intensity / 100); 
        Object.entries(VOCAB_MAP).forEach(([formal, simple]) => {
            if (Math.random() > threshold) {
                const regex = new RegExp(`\\b${formal}\\b`, "gi");
                processedText = processedText.replace(regex, (match: string) => {
                    return match[0] === match[0].toUpperCase() ? simple.charAt(0).toUpperCase() + simple.slice(1) : simple;
                });
            }
        });
        if (config.simplify || (persona !== "academic" && config.vocab)) { 
             Object.entries(SEMANTIC_SIMPLIFER).forEach(([complex, simple]) => {
                const regex = new RegExp(`\\b${complex}\\b`, "gi");
                processedText = processedText.replace(regex, simple);
            });
        }
    }

    // Student Phrasing (Fluff)
    if (config.fluff || (config.grammar && persona === "lazy_student")) { 
         Object.entries(STUDENT_PHRASES).forEach(([formal, casual]) => {
            const regex = new RegExp(formal, "gi");
            processedText = processedText.replace(regex, casual);
        });
    }

    // Basic Typo Injection 
    if (config.typo) {
        const typos: Record<string, string> = { "the": "teh", "and": "adn", "really": "realy", "their": "there", "about": "abount" };
        Object.entries(typos).forEach(([correct, wrong]) => {
            const regex = new RegExp(`\\b${correct}\\b`, "gi");
            processedText = processedText.replace(regex, (match: string) => {
                return Math.random() > 0.92 ? wrong : match; 
            });
        });
        processedText = processedText.replace(/,/g, (match: string) => Math.random() > 0.9 ? "" : match);
    }

    // --- 4. SENTENCE SHREDDER ---
    if (config.burst || config.structure) {
        // A. PASSIVE TO ACTIVE
        processedText = processedText.replace(/\bwas\s+(\w+)\s+by\s+([\w\s]+?)\b((?=[,.])|\s)/g, (match: string, verb: string, actor: string, punct: string) => {
             return Math.random() > 0.6 ? `${actor} ${verb}${punct}` : match;
        });

        // B. VOID PHRASE INJECTION
        if (config.intensity > 70) {
            const casualFillers = ["like,", "basically,", "literally,", "actually,", "sort of", "i guess", "honestly,"];
            const academicHedging = ["essentially,", "arguably,", "technically,", "practically,", "in a sense,", "fundamentally,"];
            const voidWords = (persona === "lazy_student" || config.intensity > 90) ? casualFillers : academicHedging;
            const usedInParagraph = new Set();
            processedText = processedText.replace(/(\w+)\s/g, (match: string, word: string) => {
                const cleanWord = word.trim().toLowerCase();
                const adjectives = ["digital", "outdated", "previous", "manual", "automated", "consistent", "technical", "early", "lightweight", "original", "controlled", "consistent", "structured", "reliable"];
                const technical = ["requirements", "smells", "processes", "syntax", "documents", "traceability", "review"];
                if (word.length < 5 || adjectives.includes(cleanWord) || technical.includes(cleanWord)) return match;
                if (Math.random() > 0.96) { 
                    const available = voidWords.filter(v => !usedInParagraph.has(v));
                    if (available.length === 0) return match;
                    const picked = available[Math.floor(Math.random() * available.length)];
                    usedInParagraph.add(picked);
                    return `${word} ${picked} `;
                }
                return match;
            });
        }

        // C. "WHICH" HUNT
        processedText = processedText.replace(/,?\s*which\s+(is|are|was|were)\s+([\w\s]+),?/g, (match: string, copula: string, adj: string) => {
             return Math.random() > 0.6 ? `. It ${copula} ${adj}. ` : match;
        });
        
        // SENTENCE SPLITTING at Conjunctions
        processedText = processedText.replace(/,?\s+and\s+(we|I|they|he|she|it)\s+/g, (match: string, pronoun: string) => {
             return Math.random() > 0.7 ? `. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} ` : match;
        });

        // D. TOPIC SCRAMBLER
        processedText = processedText.replace(/([A-Z][a-z\s]+)\s+because\s+([a-z\s]+)\./g, (match: string, p1: string, p2: string) => {
             return Math.random() > 0.5 ? `Since ${p2.trim()}, ${p1.toLowerCase().trim()}.` : match;
        });
        processedText = processedText.replace(/([A-Z][a-z\s]+)\s+is better than\s+([a-z\s]+)\./g, (match: string, p1: string, p2: string) => {
             return `Compared to ${p2.trim()}, ${p1.toLowerCase().trim()}.`;
        });

        // H. MOOD INJECTOR
        const casualMoods = ["surprisingly,", "sadly,", "luckily,", "weirdly,", "thankfully,", "ironically,", "honestly,"];
        const academicMoods = ["notably,", "interestingly,", "significantly,", "crucially,", "historically,", "conversely,"];
        const moods = (persona === "lazy_student" || config.intensity > 90) ? casualMoods : academicMoods;
        const usedMoods = new Set();
        processedText = processedText.replace(/(\.)\s+([A-Z])/g, (match: string, p1: string, p2: string) => {
             if (Math.random() > 0.78) { 
                 const available = moods.filter(m => !usedMoods.has(m));
                 if (available.length === 0) return match;
                 const mood = available[Math.floor(Math.random() * available.length)];
                 const moodWithCap = mood.charAt(0).toUpperCase() + mood.slice(1);
                 usedMoods.add(mood);
                 return `${p1} ${moodWithCap} ${p2.toLowerCase()}`;
             }
             return match;
        });

        // D. SKELETON SHUFFLER
        if (config.structure || config.intensity > 40) {
            processedText = processedText.replace(/([A-Z][^.!?]+)\s+because\s+([^.!?]+)(\.|\?|!)/g, (match: string, p1: string, p2: string, punct: string) => {
                const threshold = config.intensity > 70 ? 0.3 : 0.6;
                return Math.random() > threshold ? `Because ${p2.trim()}, ${p1.charAt(0).toLowerCase() + p1.slice(1).trim()}${punct}` : match;
            });
            processedText = processedText.replace(/([^.!?]+)\s+is\s+a\s+result\s+of\s+([^.!?]+)(\.|\?|!)/gi, (match: string, p1: string, p2: string, punct: string) => {
                return Math.random() > 0.5 ? `${p2.trim().charAt(0).toUpperCase() + p2.trim().slice(1)} resulted in ${p1.trim().toLowerCase()}${punct}` : match;
            });
            processedText = processedText.replace(/By\s+([^,]+),\s+([^.!?]+)(\.|\?|!)/g, (match: string, action: string, result: string, punct: string) => {
                return Math.random() > 0.6 ? `${result.charAt(0).toUpperCase() + result.slice(1).trim()} by ${action.trim()}${punct}` : match;
            });
        }

        // --- DATA-DRIVEN RHYTHM JITTER ---
        const sentences = processedText.match(/[A-Z][^.!?]*[.!?]/g) || [];
        if (sentences.length > 3) {
            for (let i = 0; i < sentences.length - 1; i++) {
                const lenA = sentences[i].split(/\s+/).length;
                if (lenA > 30 && Math.random() > 0.4) {
                    sentences[i] = sentences[i].replace(/,?\s+(and|but|which)\s+/, ". ");
                }
                if (i < sentences.length - 1) {
                    const lenB = sentences[i+1].split(/\s+/).length;
                    if ((lenA + lenB) < 25 && Math.random() > 0.5) {
                        sentences[i] = sentences[i].replace(/[.!?]$/, ", and");
                        sentences[i+1] = sentences[i+1].trim().charAt(0).toLowerCase() + sentences[i+1].trim().slice(1);
                        i++; 
                    }
                }
            }
            processedText = sentences.join(" ");
        }

        // K. REDUNDANCY LOOPER 
        processedText = processedText.replace(/(\w+)\s+(was|is|are|were)\s+(very|really|quite)?\s?([a-z]+)\./g, (match: string, subj: string, copula: string, adv: string, adj: string) => {
             return Math.random() > 0.6 ? `${match} I mean, ${adj}.` : match; 
        });

        // I. POSSESSIVE OPTIMIZER 
        processedText = processedText.replace(/\bthe\s+([a-z]+)\s+of\s+the\s+([a-z]+)\b/g, (match: string, noun1: string, noun2: string) => {
             return Math.random() > 0.5 ? `the ${noun2}'s ${noun1}` : match;
        });
        
        // J. HEDGE STACKING 
        const interrupts = [", I think,", ", arguably,", ", technically,", ", in a sense,"];
        const chosenInterrupts = (persona === "lazy_student" || config.intensity > 90) ? [", like,", ", I guess,", ", honestly,"] : interrupts;
        processedText = processedText.replace(/(\s+)(is|are|was|were|shows|show|means|argues|argued|claims|suggests)(\s+)/g, (match: string, s1: string, verb: string, s2: string) => {
             if (Math.random() > 0.85 && (config.intensity > 80 || persona === "academic")) {
                 const h1 = chosenInterrupts[Math.floor(Math.random() * chosenInterrupts.length)];
                 const h2 = chosenInterrupts[Math.floor(Math.random() * chosenInterrupts.length)];
                 if (h1 !== h2) return `${s1}${verb}${h1} ${h2}${s2}`;
             }
             const interrupt = chosenInterrupts[Math.floor(Math.random() * chosenInterrupts.length)];
             if (verb.toLowerCase().startsWith("argu") && interrupt.includes("argu")) return match;
             if (verb.toLowerCase().startsWith("think") && interrupt.includes("think")) return match;
             return Math.random() > 0.6 ? `${s1}${verb}${interrupt}${s2}` : match;
        });

        // E. PARAGRAPH EXPLOSION 
        processedText = processedText.replace(/(\.)\s+([A-Z])/g, (match: string, p1: string, p2: string) => {
             return Math.random() > 0.65 ? `${p1}\n\n${p2}` : match;
        });

        // F. PERSONAL ANECDOTE INJECTOR 
        const casualThoughts = [" honestly it reminds me of class.", " my professor mentioned this once.", " weirdly enough.", " I was reading about this yesterday.", " strangely.", " for real though."];
        const academicThoughts = [" which is a point worth noting.", " as discussed in early lectures.", " in my view, this is key.", " something I've noted before.", " essentially.", " curiously."];
        const personalThoughts = (persona === "lazy_student" || config.intensity > 85) ? casualThoughts : academicThoughts;
        processedText = processedText.replace(/(\.)\s+([A-Z])/g, (match: string, p1: string, p2: string) => {
             if (Math.random() > 0.75) {
                 const thought = personalThoughts[Math.floor(Math.random() * personalThoughts.length)];
                 return `${p1} ${thought} ${p2}`;
             }
             return match;
        });

        // G. SENTENCE CHUNKING 
        processedText = processedText.replace(/\s+(because|but|so)\s+/g, (match: string) => Math.random() > 0.6 ? ". " : match);
        processedText = processedText.replace(/\s+and\s+(we|I|they|he|she|it|this|that|there)\s+/gi, (match: string) => Math.random() > 0.6 ? ". " : match);
        processedText = processedText.replace(/\.\s+(It|He|She|They|We)\s+(was|were|is|are)\s+/g, ". ");

        // H. FRAME INJECTION (Learned Openers)
        const allIntros = ["So, looking at this,", "Honestly,", "Basically,", "If you think about it,", "I feel like,", "In a sense, looking at this,", "Essentially,", "Broadly speaking,", "From my perspective,", "As I see it,", "Notably,", "Interestingly,", "Interestingly enough,"];
        const hasExistingIntro = allIntros.some(intro => processedText.trim().startsWith(intro));

        if (!hasExistingIntro) {
            const casualIntros = ["So, looking at this,", "Honestly,", "Basically,", "If you think about it,", "I feel like,"];
            const academicIntros = [
                "For example,", "In this case,", "It is clear that,", "If you look at,", 
                "I have found that,", "Of the many factors,", "In my view,", 
                "Essentially,", "Broadly speaking,", "From my perspective,"
            ];
            const introPool = (persona === "lazy_student" || config.intensity > 90) ? casualIntros : academicIntros;
            const intro = introPool[Math.floor(Math.random() * introPool.length)];
            const lowerStart = processedText.charAt(0).toLowerCase() + processedText.slice(1);
            processedText = `${intro} ${lowerStart}`;
        }
        
        const outros = [" I guess that's it.", " pretty much.", " at least I think so.", " hopefully that makes sense."];
        processedText += outros[Math.floor(Math.random() * outros.length)];
    }
    
    // --- 5. DEEP STRUCTURE BREAKING (OLD) ---
    if ((config.structure || config.burst) && persona !== "academic") {
        processedText = processedText.replace(/, which (is|was|are|were) ([a-z\s]+),/g, (match: string, copula: string, adj: string) => `. It ${copula} ${adj}.`);
        processedText = processedText.replace(/([a-z]+) (was|were) (done|seen|heard|made) by ([a-z]+)/g, (match: string, obj: string, copula: string, verb: string, subj: string) => `${subj} ${verb} ${obj}`);
        processedText = processedText.replace(/([A-Z][a-z\s]+)\s+because\s+([a-z\s.,]+)/g, (match: string, p1: string, p2: string) => Math.random() > 0.7 ? `Because ${p2.trim()}, ${p1.toLowerCase().trim()}` : match);
        processedText = processedText.replace(/([A-Z][a-z]+)\s+(shows|reveals|demonstrates|indicates)\s+/g, (match: string, p1: string, p2: string) => Math.random() > 0.7 ? `${p1}? It ${p2} ` : match);
    }

    // Messy Structure 
    if (config.structure) {
        processedText = processedText.replace(/^\s*[-*•]\s+(.*)$/gm, (match: string, p1: string) => Math.random() > 0.5 ? ` Also, ${p1.toLowerCase()}.` : ` ${p1}.`);
        processedText = processedText.replace(/^#+\s+(.*)$/gm, "$1."); 
    }

    // Subjective Fluff
    if (config.fluff) {
        const fillers = [" basically,", " I guess,", " honestly,", " like,"];
        processedText = processedText.replace(/\.\s/g, (match: string) => Math.random() > 0.7 ? `${fillers[Math.floor(Math.random() * fillers.length)]} ` : match);
    }

    // Burstiness 
    if (config.burst || config.intensity > 50) { 
        processedText = processedText.replace(/[—–]/g, ", ");
        processedText = processedText.replace(/,\s*,/g, ","); 
        processedText = processedText.replace(/\.\s+([A-Z])/g, (match: string, letter: string) => Math.random() > 0.8 ? `, and ${letter.toLowerCase()}` : match);
    }

    // Lazy Typist 
    if (config.typo) {
        processedText = processedText.replace(/\bthe\b/gi, (match: string) => Math.random() > 0.95 ? "teh" : match);
        processedText = processedText.replace(/\band\b/gi, (match: string) => Math.random() > 0.95 ? "annd" : match);
        processedText = processedText.replace(/,/g, (match: string) => Math.random() > 0.9 ? "" : match);
    }

    // Base Grammar quirks
    if (config.grammar && config.intensity > 40) {
        processedText = processedText.replace(/\bI\b/g, () => Math.random() > 0.8 ? "i" : "I");
    }

    // --- 6. NUCLEAR OPTION: TOTAL RE-NARRATION ---
    if (config.intensity > 85 || persona === "lazy_student") {
        processedText = processedText.replace(/(\.)\n\n([A-Z])/g, (match: string, p1: string, p2: string) => Math.random() > 0.5 ? `${p1} ${p2}` : match);
        const logicMap: Record<string, string> = { "Therefore,": "So,", "Thus,": "Anyway,", "Moreover,": "Plus,", "In conclusion,": "Basically,", "Finally,": "Lastly,", "However,": "But," };
        Object.entries(logicMap).forEach(([logic, narrative]) => {
             const regex = new RegExp(`\\b${logic}`, "g");
             processedText = processedText.replace(regex, narrative);
        });

        // "Fat Finger" Typo Injector (Only if explicitly allowed)
        if (config.typo) {
            const crucialTypos: Record<string, string> = { "the": "teh", "and": "adn", "because": "cuz", "really": "rly", "that": "taht", "with": "wth" };
            Object.entries(crucialTypos).forEach(([word, typo]) => {
                 const regex = new RegExp(`\\b${word}\\b`, "g");
                 processedText = processedText.replace(regex, (m: string) => Math.random() > 0.88 ? typo : m);
            });
        }
        
        // Subjectivity Injection 
        processedText = processedText.replace(/\.\s([A-Z])/g, (match: string, p1: string) => {
             const openers = ["Honestly, ", "I mean, ", "To be fair, ", "Actually, "];
             return Math.random() > 0.85 ? `. ${openers[Math.floor(Math.random()*openers.length)]}${p1.toLowerCase()}` : match;
        });

        // CLAUSE FUSION 
        if (config.burst || config.typo) {
            processedText = processedText.replace(/(\w+)\.\s+([A-Z][a-z]+)/g, (match: string, p1: string, p2: string) => Math.random() > 0.6 ? `${p1}, ${p2.toLowerCase()}` : match);
        }
    }
    
    // --- 4. RESTORE CITATIONS ---
    if (citationMap.length > 0) {
        processedText = processedText.replace(/__CIT_(\d+)__/g, (match: string, id: string) => citationMap[parseInt(id)] || match);
    }
    
    return processedText;
}

export function sanityPass(text: string): string {
    let cleaned = text;
    cleaned = cleaned.replace(/,\./g, ".");
    cleaned = cleaned.replace(/,,/g, ",");
    cleaned = cleaned.replace(/\.\./g, ".");
    cleaned = cleaned.replace(/\s\./g, ".");
    cleaned = cleaned.replace(/\s,/g, ",");
     cleaned = cleaned.replace(/,\s\./g, ".");
    
    const phrasesToDedupe = ["from my perspective", "i think", "arguably", "technically", "essentially", "broadly speaking", "mostly", "basically", "literally", "i mean", "weirdly enough", "honestly it reminds me of class", "actually", "in a sense"];
    phrasesToDedupe.forEach(phrase => {
        const regex = new RegExp(`(${phrase},?\\s+){2,}`, "gi");
        cleaned = cleaned.replace(regex, "$1");
    });
    
    // De-dupe Adverbs
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    const deduplicated = sentences.map(s => {
        const allFillers = ["Surprisingly", "Sadly", "Luckily", "Weirdly", "Thankfully", "Ironically", "Honestly", "Notably", "Interestingly", "Significantly", "Crucially", "Historically", "Conversely", "Essentially", "Arguably", "Technically", "Practically"];
        let count = 0;
        let processed = s;
        allFillers.forEach(f => {
            const fRegex = new RegExp(`\\b${f},?\\b`, 'gi');
            if (fRegex.test(processed)) {
                count++;
                if (count > 1) {
                    let first = true;
                    processed = processed.replace(fRegex, (match) => {
                        if (first) { first = false; return match; }
                        return "";
                    });
                }
            }
        });
        return processed;
    });

    return deduplicated.join(" ").replace(/\s+/g, " ").trim();
}
