
import { NextResponse } from "next/server";
// @ts-ignore
import { HumanizerConfig, humanizeText, sanityPass } from "../../../lib/humanizer_service";
// @ts-ignore
import humanizerConfig from "../../../lib/humanizer_config.json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, persona = "standard", intensity: userIntensity, ...overrides } = body;

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 1. Load Trained/Base Config
    // We cast to any first to avoid strict JSON import issues if tsconfig isn't perfect
    let config: HumanizerConfig = { ...(humanizerConfig as unknown as HumanizerConfig) };

    // 2. Apply Persona Overrides (Defaults)
    if (persona === "lazy_student") {
        config = { ...config, intensity: 80, fluff: true, typo: true, simplify: true };
    } else if (persona === "esl") {
        config = { ...config, intensity: 60, burst: false, structure: false, grammar: true };
    } else if (persona === "academic") {
        // Academic protects structure more
        config = { ...config, intensity: 45, fluff: false, typo: false, simplify: false, grammar: false };
    } else {
        // Standard uses the Trained Config directly (Intensity 85)
        config.name = "standard_optimized";
    }

    // 3. Apply User Overrides (Frontend Sliders)
    if (userIntensity !== undefined) config.intensity = userIntensity;
    
    // Merge boolean flags if provided
    Object.keys(overrides).forEach(key => {
        // Only allow recognized keys to prevent prototype pollution
        if (key in config) {
            (config as any)[key] = overrides[key];
        }
    });

    // 4. Processing Loop (Adversarial Strategy)
    // The "Optimized Config" (Intensity 85) is designed to hit hard immediately.
    // We run the Humanizer Engine.
    
    let processedText = humanizeText(text, config);
    
    // 5. Sanity Check (Cleanup)
    // Removes repetition ("I mean, I mean"), fixes punctuation artifacts.
    processedText = sanityPass(processedText);

    return NextResponse.json({ 
        original: text, 
        humanized: processedText,
        method: "adversarial_trained_v1"
    });

  } catch (error: any) {
    console.error('Humanize API error:', error);
    return NextResponse.json({ error: 'Humanization failed', details: error.message }, { status: 500 });
  }
}
