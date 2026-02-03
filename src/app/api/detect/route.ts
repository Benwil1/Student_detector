/**
 * API Route: /api/detect
 * Hybrid AI Detection endpoint using ML + Heuristics
 */

import { detectAIHybrid } from '@/lib/hybrid-detector';
import { spawn } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Helper to run python script
async function getPythonPrediction(text: string): Promise<number | null> {
  return new Promise((resolve, reject) => {
    // Determine path. Assuming process.cwd() is project root.
    const scriptPath = path.join(process.cwd(), 'scripts', 'predict_single.py');
    
    // Check if script exists
    // fs.access throws if not exists, but let's trust it's there based on workspace
    
    const python = spawn('python3', [scriptPath]);
    
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', error);
        resolve(null);
        return;
      }
      
      try {
        // Output should be a float close to 0-1, e.g. "0.9500\n"
        const prob = parseFloat(output.trim());
        if (!isNaN(prob)) {
          resolve(prob);
        } else {
          resolve(null);
        }
      } catch (e) {
        console.error('Failed to parse python output:', e);
        resolve(null);
      }
    });
    
    // Write text to stdin
    python.stdin.write(text);
    python.stdin.end();
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, forceML = false } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Run heuristic detection (Baseline)
    let result = await detectAIHybrid(text, forceML);

    // If forceML is true, run the Python ML model
    if (forceML) {
      const mlProb = await getPythonPrediction(text);
      
      if (mlProb !== null) {
        console.log(`ML Prediction: ${mlProb}`);
        
        // Convert to percentage
        const mlAiScore = Math.round(mlProb * 100);
        const mlHumanScore = 100 - mlAiScore;
        
        // Update the result with ML data
        result.humanScore = mlHumanScore;
        result.aiScore = mlAiScore;
        result.confidence = 95; // ML is treated as high confidence
        result.method = 'ml'; // Indicate ML was used
        
        // Set label based on ML
        if (mlHumanScore > 90) result.label = "Human";
        else if (mlHumanScore > 50) result.label = "Likely Human";
        else if (mlHumanScore > 10) result.label = "Likely AI";
        else result.label = "AI";

        // Add extra details
        (result as any).mlDetails = {
           aiProbability: mlProb,
           model: 'super_detector'
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Detection API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Detection failed', 
        message: error.message,
        success: false 
      },
      { status: 500 }
    );
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
