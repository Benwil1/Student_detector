/**
 * API Route: /api/detect
 * Hybrid AI Detection endpoint using ML + Heuristics
 */

import { detectAIHybrid } from '@/lib/hybrid-detector';
import { NextRequest, NextResponse } from 'next/server';

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

    // Run hybrid detection
    const result = await detectAIHybrid(text, forceML);

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
