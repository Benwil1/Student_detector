/**
 * Logic-Based Decision Engine 
 * Uses Structural Fingerprints + Multi-Layered Heuristics
 * (ML Integration Removed - Strictly Logic Driven)
 */

import { calculateHumanScore, DetectionMetrics } from './detector';

export interface HybridDetectionResult {
  humanScore: number;
  aiScore: number;
  confidence: number;
  label: string;
  category: 'human' | 'ai' | 'mixed';
  method: 'logic';
  
  surfaceSignals: {
    perplexity: number;
    burstiness: number;
    entropy: number;
  };
  structuralSignals: {
    symmetry: number;
    planning: number;
    complexitySlope: number;
    semanticDrift: number;
    genre: string;
    accountability: number;
  };
  
  metrics: DetectionMetrics;
  aiSentences: string[];
}

/**
 * Main detection entry point
 * Now strictly uses logical heuristics (formerly hybrid)
 */
export async function detectAIHybrid(
  text: string, 
  forceML: boolean = false 
): Promise<HybridDetectionResult> {
  const heuristic = calculateHumanScore(text);
  
  const finalScore = heuristic.finalScore;
  let label = finalScore > 75 ? 'Human' : (finalScore < 35 ? 'AI' : 'Mixed');
  
  // Context-specific labeling
  if (heuristic.genre === 'formal_admin' && finalScore > 50) {
    label = 'Likely Human (Formal Context)';
  } else if (heuristic.genre === 'formal_admin' && finalScore <= 50) {
    label = 'Mixed Evidence (Administrative Style)';
  }

  return {
    humanScore: finalScore,
    aiScore: 100 - finalScore,
    confidence: 85, // Reasoning-based detection is high confidence
    label,
    category: finalScore > 65 ? 'human' : (finalScore < 35 ? 'ai' : 'mixed'),
    method: 'logic',
    surfaceSignals: { 
      perplexity: heuristic.lexicalComplexity, 
      burstiness: heuristic.burstiness, 
      entropy: heuristic.entropy 
    },
    structuralSignals: {
      symmetry: heuristic.symmetry,
      planning: heuristic.planning,
      complexitySlope: heuristic.complexitySlope,
      semanticDrift: heuristic.semanticDrift,
      genre: heuristic.genre,
      accountability: heuristic.accountability
    },
    metrics: heuristic,
    aiSentences: heuristic.aiSentences
  };
}
