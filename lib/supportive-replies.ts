// Emotion-aware supportive responses.
// Deterministic: estimated expression + self-reported mood + journal sentiment
// select a supportive reply and a matching in-app self-care tool.

import type { ExpressionKey } from '@/lib/expression';

export interface SupportiveReply {
  message: string;
  toolSuggestion: string; // name of an existing in-app self-care component
  tone: 'gentle' | 'celebratory' | 'calm' | 'energizing';
}

const REPLIES: Record<ExpressionKey, SupportiveReply[]> = {
  happy: [
    { message: 'You look bright today! Whatever you are doing, keep it going.', toolSuggestion: 'Gratitude Journal', tone: 'celebratory' },
    { message: 'Great energy! A good moment to log what went well.', toolSuggestion: 'Goals Tracker', tone: 'celebratory' },
  ],
  sad: [
    { message: 'I noticed you seem a little low right now. Want to talk about what happened?', toolSuggestion: 'Journal', tone: 'gentle' },
    { message: 'Low moments pass. Try a slow breathing round — I am here.', toolSuggestion: 'Breathing Bubble', tone: 'gentle' },
  ],
  angry: [
    { message: 'That looks like frustration. A stress-ball squeeze or short walk can help discharge it.', toolSuggestion: 'Stress Ball', tone: 'calm' },
    { message: 'Big feelings are valid. Let us slow everything down for one minute.', toolSuggestion: 'Box Breathing', tone: 'calm' },
  ],
  surprised: [
    { message: 'Something unexpected? Take a breath and let it settle before deciding anything.', toolSuggestion: 'Meditation Timer', tone: 'calm' },
  ],
  fearful: [
    { message: 'It looks like something is worrying you. Grounding helps: name 5 things you can see.', toolSuggestion: 'Grounding Activity', tone: 'gentle' },
    { message: 'Anxious moments ease with slow exhales. Want to try a guided breathing exercise?', toolSuggestion: 'Breathing Exercise', tone: 'gentle' },
  ],
  disgusted: [
    { message: 'Rough moment? Resetting with a short mindful pause can help clear the air.', toolSuggestion: 'Mindful Walking', tone: 'calm' },
  ],
  neutral: [
    { message: 'Thanks for checking in. How would you describe today in one word?', toolSuggestion: 'Daily Reflection', tone: 'calm' },
    { message: 'A steady day is a good day. Anything you want to remember from it?', toolSuggestion: 'Journal', tone: 'calm' },
  ],
};

/** Deterministic pick so the same state yields the same reply (stable UX). */
export function getSupportiveReply(
  expression: ExpressionKey,
  seed = Date.now(),
): SupportiveReply {
  const options = REPLIES[expression] ?? REPLIES.neutral;
  return options[seed % options.length];
}

/**
 * Escalation guard: if recent journals contain crisis language, always show
 * support resources regardless of expression. Returns null when not applicable.
 */
export function crisisCheck(recentJournalText: string): string | null {
  const patterns = /\b(kill myself|end my life|suicide|self.?harm|hurt myself|no reason to live)\b/i;
  if (!patterns.test(recentJournalText)) return null;
  return [
    'Some of your recent words suggest you may be going through something serious.',
    'Please consider reaching out to someone you trust, or a local crisis line.',
    'In India: Tele-MANAS 14416 · AASRA +91-9820466726 · Vandrevala Foundation 1860-2662-345.',
    'Mood Mate is a wellness tool, not a substitute for professional care.',
  ].join(' ');
}
