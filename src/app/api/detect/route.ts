/**
 * API Route: /api/detect
 * Hybrid AI Detection endpoint using ML + Heuristics
 */

import { detectAIHybrid } from '@/lib/hybrid-detector';
import { spawn } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Helper to run python script
async function getPythonPrediction(text: string): Promise<any | null> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'api', 'predict.py');
    const python = spawn('python3', [scriptPath, text]);
    
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => output += data.toString());
    python.stderr.on('data', (data) => error += data.toString());

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', error);
        resolve(null);
        return;
      }
      
      try {
        let jsonStr = output.trim();
        jsonStr = jsonStr.replace(/'/g, '"')
                         .replace(/\bNone\b/g, 'null')
                         .replace(/\bTrue\b/g, 'true')
                         .replace(/\bFalse\b/g, 'false');
        
        const res = JSON.parse(jsonStr);
        if (res && res.human_score !== undefined) {
           resolve(res);
        } else {
           resolve(null);
        }
      } catch (e) {
        console.error('Failed to parse python output:', e, output);
        resolve(null);
      }
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { text, forceML = false, mode = 'heuristic' } = body;

    // Legacy support / Interop
    if (forceML && mode === 'heuristic') mode = 'ml';
    if (mode === 'hybrid') forceML = true; 
    if (mode === 'ml') forceML = true; // Fix: Enable ML for 'ml' mode 

    // Validate input
    if (!text || typeof text !== 'string') {
        return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }
    if (text.trim().length < 10) return NextResponse.json({ error: 'Text too short' }, { status: 400 });

    // Run heuristic detection (Baseline)
    let result = await detectAIHybrid(text, forceML);

    // If forceML is true (includes 'ml' and 'hybrid' modes), run the Python ML model
    if (forceML) {
      try {
          const mlData = await getPythonPrediction(text);
          
          if (mlData) {
            const mlProb = mlData.ai_score; // 0.0 to 1.0
            console.log(`ML Prediction: ${mlProb}`);
            
            // Python returns Human Probability (0.0 = AI, 1.0 = Human)
            const mlHumanScore = Math.round(mlProb * 100);
            
            let finalHumanScore = mlHumanScore;
            let fusionReason = null;

            // VETO SYSTEM (Active in 'ml' mode)
            if (mode === 'ml' && result.humanScore < 35 && mlHumanScore > 75) {
                console.log("🛡️ Hybrid Fusion Triggered: Heuristic Veto applied.");
                finalHumanScore = Math.round((mlHumanScore * 0.4) + (result.humanScore * 0.6));
                fusionReason = "Structural logic mismatch (Penalty applied)";
            }

            // EXPLICIT HYBRID MODE (Active in 'hybrid' mode)
            // Always averages the scores for a balanced view.
            if (mode === 'hybrid') {
                console.log("🛡️ Explicit Hybrid Mode: Averaging scores.");
                // STRICT 50/50 as requested
                finalHumanScore = Math.round((mlHumanScore * 0.5) + (result.humanScore * 0.5));
                fusionReason = "Hybrid Ensemble (50/50 Average)";
            }

            // Update the result with Final Hybrid data
            result.humanScore = finalHumanScore;
            result.aiScore = 100 - finalHumanScore;
            result.confidence = mlData.confidence === 'HIGH' ? 95 : (mlData.confidence === 'MEDIUM' ? 85 : 50);
            (result as any).method = 'hybrid'; 
            
            // Set label based on Final Score
            if (finalHumanScore > 90) result.label = "Human";
            else if (finalHumanScore > 50) result.label = "Likely Human";
            else if (finalHumanScore > 10) result.label = "Likely AI";
            else result.label = "AI";

            // KEY: Overwrite Heuristic Signals with Trained Model Signals so Dashboard updates!
            if (mlData.mlDetails) {
                result.surfaceSignals = {
                    perplexity: mlData.mlDetails.perplexity || 0,
                    burstiness: mlData.mlDetails.burstiness || 0,
                    entropy: mlData.mlDetails.entropy || 0
                };
                result.structuralSignals = {
                    ...result.structuralSignals, 
                    symmetry: mlData.mlDetails.symmetry || 80,
                    planning: mlData.mlDetails.planning || 0.8,
                    complexitySlope: mlData.mlDetails.complexitySlope || result.structuralSignals.complexitySlope,
                    semanticDrift: mlData.mlDetails.semanticDrift || result.structuralSignals.semanticDrift,
                    genre: mlData.mlDetails.genre || result.structuralSignals.genre
                };
                (result as any).mlDetails = {
                    ...mlData.mlDetails,
                    fusionReason: fusionReason
                };
            }
          }
      } catch (mlErr) {
          console.error("❌ ML Prediction Failed:", mlErr);
          // Fallback is automatic (result remains Heuristic)
          (result as any).mlError = "Trained model unavailable (using Fast Mode)";
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Detection API Handler error:', error);
    // Return a safe fallback instead of 500 HTML
    return NextResponse.json({ 
        success: false, 
        error: "Detection Failed",
        fallback: true 
    }, { status: 200 }); // Return 200 with error data to prevent parser crash
  }
}

// Optional: GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'AI Detection API',
    version: '1.0.0',
    methods: ['POST'],
    usage: {
      endpoint: '/api/detect',
      method: 'POST',
      body: {
        text: 'string (required)',
        forceML: 'boolean (optional, default: false)'
      }
    }
  });
}
