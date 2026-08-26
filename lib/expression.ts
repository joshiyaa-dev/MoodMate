// MoodMate — on-device expression estimation.
// Maps MediaPipe FaceLandmarker blendshape scores (52 real-valued 0..1 outputs)
// to a small set of everyday expressions. Pure geometry-free scoring: each
// expression is a weighted sum of blendshapes, normalized to 0..100 confidence.
//
// Honest positioning: this estimates an OBSERVED EXPRESSION from facial muscle
// signals. It is NOT a diagnosis and NOT a measurement of someone's feelings.

export interface Blendshapes {
  [categoryName: string]: number;
}

export type ExpressionKey =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'fearful'
  | 'disgusted';

export interface ExpressionReading {
  key: ExpressionKey;
  label: string;
  confidence: number; // 0-100 for the winning expression
  scores: Record<ExpressionKey, number>; // all raw scores 0-100
}

export const EXPRESSION_LABELS: Record<ExpressionKey, string> = {
  neutral: 'Neutral',
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Angry',
  surprised: 'Surprised',
  fearful: 'Fearful',
  disgusted: 'Disgusted',
};

const W = (
  happy: number,
  sad: number,
  angry: number,
  surprised: number,
  fearful: number,
  disgusted: number,
) => ({ happy, sad, angry, surprised, fearful, disgusted });

// Weight tables derived from standard facial-action coding intuition:
// smile -> mouthSmileUpper/Lower + mouthCornerPull; frown -> mouthFrown +
// browLower; surprise -> jawOpen + browInnerUp + eyeWide; etc.
const WEIGHTS: Record<Exclude<ExpressionKey, 'neutral'>, ReturnType<typeof W>> = {
  happy: W(1.0, -0.2, -0.1, 0, 0, 0),
  sad: W(-0.3, 1.0, -0.1, -0.2, 0.1, 0),
  angry: W(-0.2, -0.2, 1.0, -0.2, 0.1, 0.1),
  surprised: W(0, -0.3, -0.2, 1.0, 0.3, -0.1),
  fearful: W(-0.2, 0.1, -0.1, 0.4, 1.0, 0),
  disgusted: W(-0.2, 0, 0.1, -0.2, 0, 1.0),
};

function scoreFor(key: Exclude<ExpressionKey, 'neutral'>, b: Blendshapes): number {
  const w = WEIGHTS[key];
  const val =
    w.happy * (b.mouthSmileLeft ?? b.mouthSmile ?? 0) * 0.5 +
    w.happy * (b.mouthSmileRight ?? b.mouthSmile ?? 0) * 0.5 +
    w.sad * (b.mouthFrownLeft ?? 0) * 0.5 +
    w.sad * (b.mouthFrownRight ?? 0) * 0.5 +
    w.sad * (b.browDownLeft ?? 0) * 0.25 +
    w.sad * (b.browDownRight ?? 0) * 0.25 +
    w.angry * (b.browDownLeft ?? 0) * 0.5 +
    w.angry * (b.browDownRight ?? 0) * 0.5 +
    w.angry * (b.noseSneerLeft ?? 0) * 0.25 +
    w.angry * (b.noseSneerRight ?? 0) * 0.25 +
    w.surprised * (b.jawOpen ?? 0) * 0.5 +
    w.surprised * (b.browInnerUp ?? 0) * 0.4 +
    w.surprised * (b.eyeBlinkLeft ?? 0) * -0.05 +
    w.fearful * (b.eyeLookUpLeft ?? 0) * 0.2 +
    w.fearful * (b.eyeLookUpRight ?? 0) * 0.2 +
    w.fearful * (b.jawOpen ?? 0) * 0.2 +
    w.fearful * (b.browOuterUpLeft ?? 0) * 0.2 +
    w.fearful * (b.browOuterUpRight ?? 0) * 0.2 +
    w.disgusted * (b.noseSneerLeft ?? 0) * 0.5 +
    w.disgusted * (b.noseSneerRight ?? 0) * 0.5 +
    w.disgusted * (b.mouthUpperUpLeft ?? 0) * 0.25 +
    w.disgusted * (b.mouthUpperUpRight ?? 0) * 0.25;

  // Map the signed sum into 0..1 with a soft knee.
  const positive = Math.max(0, val);
  return Math.min(1, positive);
}

/** Classify one frame of blendshapes. */
export function classifyExpression(b: Blendshapes): ExpressionReading {
  const raw: Partial<Record<ExpressionKey, number>> = {};
  let bestKey: ExpressionKey = 'neutral';
  let bestVal = -Infinity;

  for (const key of Object.keys(WEIGHTS) as Array<Exclude<ExpressionKey, 'neutral'>>) {
    const v = scoreFor(key, b);
    raw[key] = v;
    if (v > bestVal) {
      bestVal = v;
      bestKey = key;
    }
  }

  const smile =
    ((b.mouthSmileLeft ?? b.mouthSmile ?? 0) + (b.mouthSmileRight ?? b.mouthSmile ?? 0)) / 2;
  const motion = Math.max(
    smile,
    b.jawOpen ?? 0,
    b.browInnerUp ?? 0,
    b.browDownLeft ?? 0,
    b.browDownRight ?? 0,
    b.mouthFrownLeft ?? 0,
    b.mouthFrownRight ?? 0,
  );

  // Low facial activity => neutral dominates.
  if (motion < 0.18 || (raw[bestKey] ?? 0) < 0.12) {
    return { key: 'neutral', label: EXPRESSION_LABELS.neutral, confidence: 60, scores: finalize(raw) };
  }

  const confidence = Math.round(50 + Math.min(50, (raw[bestKey] ?? 0) * 55));
  return { key: bestKey, label: EXPRESSION_LABELS[bestKey], confidence, scores: finalize(raw) };
}

function finalize(raw: Partial<Record<ExpressionKey, number>>): Record<ExpressionKey, number> {
  return {
    neutral: 0,
    happy: Math.round((raw.happy ?? 0) * 100),
    sad: Math.round((raw.sad ?? 0) * 100),
    angry: Math.round((raw.angry ?? 0) * 100),
    surprised: Math.round((raw.surprised ?? 0) * 100),
    fearful: Math.round((raw.fearful ?? 0) * 100),
    disgusted: Math.round((raw.disgusted ?? 0) * 100),
  };
}

/**
 * Temporal smoothing over consecutive readings (EMA per expression).
 * Prevents flicker from blinks/noise; requires ~stable signal before switching.
 */
export class ExpressionStabilizer {
  private ema: Record<ExpressionKey, number>;
  private alpha: number;

  constructor(alpha = 0.15) {
    this.alpha = alpha;
    this.ema = {
      neutral: 1, happy: 0, sad: 0, angry: 0, surprised: 0, fearful: 0, disgusted: 0,
    };
  }

  update(reading: ExpressionReading): ExpressionReading {
    for (const key of Object.keys(this.ema) as ExpressionKey[]) {
      const incoming = key === reading.key ? reading.confidence / 100 : (reading.scores[key] ?? 0) / 100;
      this.ema[key] = this.alpha * incoming + (1 - this.alpha) * this.ema[key];
    }
    let stableKey: ExpressionKey = 'neutral';
    let best = -Infinity;
    for (const key of Object.keys(this.ema) as ExpressionKey[]) {
      if (key === 'neutral') continue;
      if (this.ema[key] > best) {
        best = this.ema[key];
        stableKey = key;
      }
    }
    if (best < 0.25) stableKey = 'neutral';
    return {
      key: stableKey,
      label: EXPRESSION_LABELS[stableKey],
      confidence: Math.round(Math.min(99, best * 120)),
      scores: reading.scores,
    };
  }
}
