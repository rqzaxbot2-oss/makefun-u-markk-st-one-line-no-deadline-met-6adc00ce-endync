export const MAX_EXCUSE_LENGTH = 200;
export const MIN_EXCUSE_LENGTH = 24;

export interface ExcuseCandidate {
  readonly id: string;
  readonly text: string;
  readonly angle: string;
  readonly voice: "deadpan" | "self-aware" | "conversational" | "workplace";
  readonly tags: readonly string[];
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly length: number;
  readonly errors: readonly string[];
}

export interface ExcuseFeatures {
  readonly charCount: number;
  readonly byteLength: number;
  readonly wordCount: number;
  readonly avgWordLength: number;
  readonly sentenceCount: number;
  readonly clauseCount: number;
  readonly hasPivot: boolean;
  readonly pivotPosition: number;
  readonly contractionCount: number;
  readonly firstPersonCount: number;
  readonly deadlineAnchorCount: number;
  readonly excuseFrameCount: number;
  readonly concreteDetailCount: number;
  readonly clicheCount: number;
  readonly exclamationCount: number;
  readonly allCapsCount: number;
  readonly lexicalDiversity: number;
  readonly readabilityCadence: number;
  readonly voiceNaturalness: number;
  readonly freshnessSignal: number;
}

export const EXCUSES: readonly ExcuseCandidate[] = [
  {
    id: "sync-head",
    text: "Sorry it's late—I finished on time in my head and forgot that version doesn't sync to the shared drive.",
    angle: "mental-completion",
    voice: "deadpan",
    tags: ["cloud", "memory", "workplace"],
  },
  {
    id: "rename-final",
    text: "I missed the deadline because I spent two hours renaming the file from 'final' to something I could look in the eye.",
    angle: "file-naming-guilt",
    voice: "self-aware",
    tags: ["files", "perfectionism", "workplace"],
  },
  {
    id: "harpsichord-break",
    text: "Sorry this is late, I took a quick five-minute break to clear my head and accidentally learned how to tune a harpsichord.",
    angle: "absurd-rabbit-hole",
    voice: "conversational",
    tags: ["distraction", "specific", "hobby"],
  },
  {
    id: "rug-recovery",
    text: "My draft was ready an hour ago, then I reread the first sentence and had to go lie face-down on the rug for forty minutes.",
    angle: "editorial-despair",
    voice: "self-aware",
    tags: ["writing", "dramatic", "relatable"],
  },
  {
    id: "calendar-rounding",
    text: "Sorry for the delay—my calendar reminded me fifteen minutes early, which my brain generously rounded up to tomorrow.",
    angle: "optimistic-math",
    voice: "deadpan",
    tags: ["calendar", "time", "procrastination"],
  },
  {
    id: "loose-thread-typo",
    text: "I missed the cutoff because I fixed one tiny typo and somehow pulled a loose thread that unraveled the whole deck.",
    angle: "last-minute-collapse",
    voice: "workplace",
    tags: ["slides", "editing", "cascade"],
  },
  {
    id: "late-panic",
    text: "Apologies for the late delivery; I was waiting for the panic to kick in, and it showed up twenty minutes after the deadline.",
    angle: "delayed-adrenaline",
    voice: "deadpan",
    tags: ["procrastination", "panic", "timing"],
  },
  {
    id: "sticky-note-table",
    text: "Sorry this slipped—I put the deadline on a sticky note, then used that sticky note to level a wobbly coffee table.",
    angle: "physical-misuse",
    voice: "conversational",
    tags: ["home-office", "furniture", "reminder"],
  },
  {
    id: "confidence-zeros",
    text: "I missed the window because I was double-checking my math, and it turns out my confidence was carrying a lot of zeros.",
    angle: "hubris-audit",
    voice: "deadpan",
    tags: ["numbers", "humility", "workplace"],
  },
  {
    id: "last-ten-percent",
    text: "Sorry I'm late with this—I got ninety percent done by noon and spent the last six hours negotiating with the remaining ten.",
    angle: "ninety-ten-trap",
    voice: "workplace",
    tags: ["progress", "negotiation", "time"],
  },
  {
    id: "closed-wrong-tab",
    text: "Apologies for missing the deadline; I closed the tab to focus and accidentally closed the only tab that had the work.",
    angle: "focus-backfire",
    voice: "self-aware",
    tags: ["browser", "irony", "focus"],
  },
  {
    id: "early-start-hubris",
    text: "Sorry it's overdue—I started early to beat the rush, got cocky, and rewarded myself with a three-day head start on procrastinating.",
    angle: "premature-reward",
    voice: "self-aware",
    tags: ["planning", "hubris", "procrastination"],
  },
  {
    id: "shade-of-blue",
    text: "I missed the deadline because I made a color-coded schedule to stay on track and ran out of time choosing the shade of blue.",
    angle: "productive-procrastination",
    voice: "conversational",
    tags: ["planning", "design", "irony"],
  },
  {
    id: "six-pm-lunch",
    text: "Sorry this is late; I told myself I'd send it right after lunch, and then I forgot to eat lunch until 6 p.m.",
    angle: "meal-loophole",
    voice: "conversational",
    tags: ["schedule", "food", "relatable"],
  },
  {
    id: "circular-reference",
    text: "My deliverable missed the cutoff because I tried to make the spreadsheet 'a little cleaner' and accidentally summoned a circular reference.",
    angle: "spreadsheet-occult",
    voice: "workplace",
    tags: ["excel", "cleanup", "backfire"],
  },
  {
    id: "cloud-weather",
    text: "Sorry for the late handoff—I saved it to the cloud, and apparently it drifted over into next Tuesday's weather system.",
    angle: "literal-cloud",
    voice: "deadpan",
    tags: ["cloud", "wordplay", "handoff"],
  },
  {
    id: "restart-later",
    text: "I missed the deadline because my laptop asked to restart later, and I didn't realize 'later' meant mid-sentence at 4:58.",
    angle: "os-betrayal",
    voice: "conversational",
    tags: ["laptop", "updates", "timing"],
  },
  {
    id: "pixel-vengeance",
    text: "Apologies it's late; I had a great work rhythm going until I noticed one pixel was off and lost the afternoon to vengeance.",
    angle: "tiny-obsession",
    voice: "self-aware",
    tags: ["design", "perfectionism", "focus"],
  },
  {
    id: "tuesday-self",
    text: "Sorry for missing the cutoff—I underestimated the task by two hours and overestimated my Tuesday self by about four.",
    angle: "forecast-error",
    voice: "deadpan",
    tags: ["estimation", "self-knowledge", "workplace"],
  },
  {
    id: "polite-alarms",
    text: "I'm late with this because I set three backup alarms and my brain treated the first two as polite suggestions.",
    angle: "alarm-diplomacy",
    voice: "conversational",
    tags: ["reminders", "habits", "relatable"],
  },
  {
    id: "automation-detour",
    text: "Sorry it missed the deadline—I paused to write a quick automated script to save ten minutes and lost half the workday.",
    angle: "over-engineering",
    voice: "workplace",
    tags: ["engineering", "irony", "automation"],
  },
  {
    id: "daydream-send",
    text: "Apologies for the delay; I hit 'send' in a very realistic daydream and didn't notice the email was still in Drafts.",
    angle: "phantom-delivery",
    voice: "deadpan",
    tags: ["email", "drafts", "memory"],
  },
  {
    id: "quick-question-slack",
    text: "Sorry this missed the cutoff—I was right on schedule until I opened one 'quick question' Slack thread at 2:15.",
    angle: "meeting-ambush",
    voice: "workplace",
    tags: ["slack", "interruption", "relatable"],
  },
  {
    id: "suspiciously-easy",
    text: "I missed the deadline because I finished early, got suspicious that it was too easy, and broke it trying to prove myself right.",
    angle: "imposter-sabotage",
    voice: "self-aware",
    tags: ["debugging", "doubt", "irony"],
  },
  {
    id: "spotless-desk",
    text: "Sorry I'm past the deadline; I cleaned my desk so I could focus, and now I have a spotless desk and zero deliverables.",
    angle: "chore-substitution",
    voice: "deadpan",
    tags: ["cleaning", "focus", "workplace"],
  },
  {
    id: "midnight-quiet-hour",
    text: "Apologies for the late turn-in—I kept waiting for a quiet hour to finish it, and the quiet hour turned out to be midnight.",
    angle: "elusive-focus",
    voice: "conversational",
    tags: ["schedule", "quiet", "time"],
  },
  {
    id: "wish-list-merge",
    text: "Sorry this is overdue; I merged my to-do list with my wish list and accidentally gave your deadline the same priority as learning Italian.",
    angle: "priority-collision",
    voice: "self-aware",
    tags: ["lists", "priorities", "absurd"],
  },
  {
    id: "rehearsing-chill",
    text: "I missed the cutoff because I spent my buffer time rehearsing how chill I'd sound when I turned it in early.",
    angle: "premature-victory",
    voice: "self-aware",
    tags: ["buffer", "ego", "timing"],
  },
  {
    id: "glasses-memory",
    text: "Sorry it's late—I trusted my memory instead of a reminder, which was a bold vote of confidence in a guy who loses his glasses on his face.",
    angle: "misplaced-trust",
    voice: "conversational",
    tags: ["memory", "self-deprecation", "relatable"],
  },
  {
    id: "ninety-second-idea",
    text: "Apologies for missing the deadline; I was ninety seconds from hitting submit when I had a 'better idea' that ruined everything.",
    angle: "last-second-ambition",
    voice: "self-aware",
    tags: ["scope-creep", "timing", "relatable"],
  },
];

const URL_RE = /(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|org|net|io|dev|gg|ai)\b)/i;
const MARKDOWN_RE = /!\[[^\]]*\]|\][(\[]|```/;
const HTML_TAG_RE = /<\/?[a-z][a-z0-9-]*\b[^>]*>/i;
const CONTROL_CHAR_RE = /[\u0000-\u001F\u007F\u2028\u2029]/;
const CONTRACTION_RE = /\b(?:i'm|i'd|i've|i'll|it's|that's|don't|didn't|doesn't|can't|won't|wasn't|weren't|couldn't|shouldn't|wouldn't|we're|you're|they're)\b/gi;
const FIRST_PERSON_RE = /\b(?:i|me|my|mine|myself|i'm|i'd|i've|i'll)\b/gi;
const DEADLINE_ANCHOR_RE = /\b(?:deadline|late|cutoff|overdue|delay|slipped|missed|window|schedule|past|turn-in|handoff|deliverable|submit|send|finished|early)\b/gi;
const EXCUSE_FRAME_RE = /\b(?:sorry|apologies|because|missed|late|overdue|delay|slipped)\b/gi;
const CONCRETE_DETAIL_RE = /\b(?:\d{1,2}:\d{2}|\d+\s?(?:p\.m\.|a\.m\.|minutes?|hours?|seconds?|days?|percent)|harpsichord|rug|sticky note|coffee table|spreadsheet|circular reference|pixel|tuesday|slack|drafts|desk|midnight|italian|glasses|shared drive|tab|blue|lunch|noon|deck|typo|laptop|alarms?)\b/gi;
const CLICHE_RE = /\b(?:dog ate|ate my homework|stuck in traffic|wi-?fi (?:went|was) down|flat tire|mercury (?:is )?in retrograde|time is a flat circle|alarm didn't go off|my grandma)\b/gi;
const PIVOT_WORD_RE = /\b(?:until|then|and|but|which|when|only to|turns out|accidentally|apparently)\b/i;

const utf8Encoder = new TextEncoder();

export function normalizeSingleLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function tokenizeWords(text: string): string[] {
  const matches = text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g);
  return matches ? matches : [];
}

export function validateExcuse(text: string): ValidationResult {
  const errors: string[] = [];
  const length = [...text].length;

  if (length === 0) {
    errors.push("empty");
  }
  if (length > MAX_EXCUSE_LENGTH) {
    errors.push(`exceeds ${MAX_EXCUSE_LENGTH} chars (${length})`);
  }
  if (length > 0 && length < MIN_EXCUSE_LENGTH) {
    errors.push(`too short (${length} < ${MIN_EXCUSE_LENGTH})`);
  }
  if (/[\r\n\u2028\u2029]/.test(text)) {
    errors.push("contains line break");
  }
  if (CONTROL_CHAR_RE.test(text)) {
    errors.push("contains control character");
  }
  if (text !== text.trim()) {
    errors.push("leading or trailing whitespace");
  }
  if (/\s{2,}|\t/.test(text)) {
    errors.push("repeated whitespace or tab");
  }
  if (URL_RE.test(text)) {
    errors.push("contains link or domain");
  }
  if (MARKDOWN_RE.test(text)) {
    errors.push("contains markdown syntax");
  }
  if (HTML_TAG_RE.test(text)) {
    errors.push("contains html markup");
  }

  return {
    valid: errors.length === 0,
    length,
    errors,
  };
}

export function isValidExcuse(text: string): boolean {
  return validateExcuse(text).valid;
}

export function hasDeadlineExcuseSignal(text: string): boolean {
  const anchorMatches = text.match(DEADLINE_ANCHOR_RE) ?? [];
  const frameMatches = text.match(EXCUSE_FRAME_RE) ?? [];
  return anchorMatches.length >= 1 && frameMatches.length >= 1;
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function findPrimaryPivotRatio(text: string): { hasPivot: boolean; ratio: number } {
  const len = Math.max(1, text.length);
  const punctuationIndices: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "—" || ch === ";" || ch === ",") {
      punctuationIndices.push(i);
    }
  }
  if (punctuationIndices.length > 0) {
    let best = punctuationIndices[0];
    let bestDist = Math.abs(best / len - 0.48);
    for (const idx of punctuationIndices) {
      const dist = Math.abs(idx / len - 0.48);
      if (dist < bestDist) {
        best = idx;
        bestDist = dist;
      }
    }
    return { hasPivot: true, ratio: Number((best / len).toFixed(4)) };
  }
  const pivotMatch = PIVOT_WORD_RE.exec(text);
  if (pivotMatch && typeof pivotMatch.index === "number") {
    return { hasPivot: true, ratio: Number((pivotMatch.index / len).toFixed(4)) };
  }
  return { hasPivot: false, ratio: 0 };
}

export function extractFeatures(text: string): ExcuseFeatures {
  const charCount = [...text].length;
  const byteLength = utf8Encoder.encode(text).length;
  const words = tokenizeWords(text);
  const wordCount = words.length;
  const totalWordChars = words.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength = wordCount > 0 ? Number((totalWordChars / wordCount).toFixed(4)) : 0;

  const sentenceMatches = text.match(/[.!?]+(?:\s|$)/g) ?? [];
  const sentenceCount = Math.max(1, sentenceMatches.length);
  const clauseSplits = text.split(/[—;,]+/).filter((part) => part.trim().length > 0);
  const clauseCount = Math.max(1, clauseSplits.length);

  const { hasPivot, ratio: pivotPosition } = findPrimaryPivotRatio(text);
  const contractionCount = (text.match(CONTRACTION_RE) ?? []).length;
  const firstPersonCount = (text.match(FIRST_PERSON_RE) ?? []).length;
  const deadlineAnchorCount = (text.match(DEADLINE_ANCHOR_RE) ?? []).length;
  const excuseFrameCount = (text.match(EXCUSE_FRAME_RE) ?? []).length;
  const concreteDetailCount = (text.match(CONCRETE_DETAIL_RE) ?? []).length;
  const clicheCount = (text.match(CLICHE_RE) ?? []).length;
  const exclamationCount = (text.match(/!/g) ?? []).length;

  const allCapsCount = words.filter((w) => w.length >= 3 && w === w.toUpperCase() && /[A-Z]/.test(w)).length;
  const uniqueLower = new Set(words.map((w) => w.toLowerCase()));
  const lexicalDiversity = wordCount > 0 ? Number((uniqueLower.size / wordCount).toFixed(4)) : 0;

  const wordFit = clamp01(1 - Math.abs(wordCount - 21) / 14);
  const lenFit = clamp01(1 - Math.abs(avgWordLength - 4.45) / 2.2);
  const clauseFit = clauseCount >= 2 && clauseCount <= 3 ? 1 : clauseCount === 4 ? 0.7 : 0.4;
  const pivotFit = hasPivot ? clamp01(1 - Math.abs(pivotPosition - 0.45) / 0.45) : 0.2;
  const readabilityCadence = Number((0.35 * wordFit + 0.25 * lenFit + 0.2 * clauseFit + 0.2 * pivotFit).toFixed(4));

  const contractionBonus = Math.min(1, contractionCount / 2);
  const personBonus = firstPersonCount >= 1 && firstPersonCount <= 4 ? 1 : firstPersonCount > 4 ? 0.65 : 0.25;
  const tonePenalty = Math.min(0.6, exclamationCount * 0.25 + allCapsCount * 0.2);
  const singleSentenceBonus = sentenceCount === 1 ? 1 : 0.3;
  const voiceNaturalness = Number(
    clamp01(0.3 * contractionBonus + 0.35 * personBonus + 0.35 * singleSentenceBonus - tonePenalty).toFixed(4),
  );

  const detailScore = Math.min(1, concreteDetailCount / 2);
  const diversityScore = clamp01((lexicalDiversity - 0.65) / 0.3);
  const clichePenalty = Math.min(1, clicheCount * 0.75);
  const freshnessSignal = Number(clamp01(0.55 * detailScore + 0.45 * diversityScore - clichePenalty).toFixed(4));

  return {
    charCount,
    byteLength,
    wordCount,
    avgWordLength,
    sentenceCount,
    clauseCount,
    hasPivot,
    pivotPosition,
    contractionCount,
    firstPersonCount,
    deadlineAnchorCount,
    excuseFrameCount,
    concreteDetailCount,
    clicheCount,
    exclamationCount,
    allCapsCount,
    lexicalDiversity,
    readabilityCadence,
    voiceNaturalness,
    freshnessSignal,
  };
}

export function getValidatedExcuses(): readonly ExcuseCandidate[] {
  return EXCUSES.filter((item) => isValidExcuse(item.text) && hasDeadlineExcuseSignal(item.text));
}