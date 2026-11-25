import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

interface RubricScores {
  deadlineExcuse: number;
  humor: number;
  singleLineCraft: number;
  humanVoice: number;
  freshness: number;
}

type RubricKey = keyof RubricScores;

interface CandidateSeed {
  id: string;
  angle: string;
  line: string;
  craft: RubricScores;
  rationale: string;
}

interface ComplianceChecks {
  isSingleLine: boolean;
  within200Chars: boolean;
  noUrlOrLink: boolean;
  noHtmlMarkup: boolean;
  explicitDeadlineExcuse: boolean;
  asciiClean: boolean;
  passed: boolean;
}

interface EvaluatedCandidate {
  id: string;
  angle: string;
  line: string;
  chars: number;
  checks: ComplianceChecks;
  rubric: RubricScores;
  weightedScore: number;
  wins: number;
  losses: number;
  draws: number;
  matches: number;
  winRate: number;
  rationale: string;
}

interface Matchup {
  leftId: string;
  rightId: string;
  winnerId: string;
  margin: number;
  decidingFactor: RubricKey;
}

const BOUNTY_ID = "u-markk-st-one-line-no-deadline-met-6adc00ce";
const CHAR_LIMIT = 200;

const RUBRIC_KEYS: readonly RubricKey[] = [
  "deadlineExcuse",
  "humor",
  "singleLineCraft",
  "humanVoice",
  "freshness",
];

const RUBRIC_WEIGHTS: Readonly<RubricScores> = {
  deadlineExcuse: 0.3,
  humor: 0.25,
  singleLineCraft: 0.18,
  humanVoice: 0.15,
  freshness: 0.12,
};

const CLICHE_PATTERNS: readonly RegExp[] = [
  /\bdog ate\b/i,
  /\btime is a flat circle\b/i,
  /\bquantum\b/i,
  /\btime ?zone\b/i,
  /\bwhooshing\b/i,
  /\bprocrastinat/i,
  /\bmercury\b/i,
];

const EXCUSE_SIGNALS: readonly RegExp[] = [
  /\bmissed the deadline\b/i,
  /\bsorry (this|it'?s|i'?m) late\b/i,
  /\bsorry i missed\b/i,
  /\boverdue\b/i,
];

const CANDIDATES: readonly CandidateSeed[] = [
  {
    id: "panic-sick-day",
    angle: "Burned-out adrenaline coworker",
    line: "I missed the deadline because I've been relying on last-minute panic for ten years and today it finally called in sick.",
    craft: { deadlineExcuse: 98, humor: 97, singleLineCraft: 97, humanVoice: 96, freshness: 97 },
    rationale:
      "Opens unambiguously as a missed-deadline excuse, speaks in effortless everyday voice, and lands a sharp workplace twist in the final three words.",
  },
  {
    id: "inbox-cancel",
    angle: "Wishful corporate inertia",
    line: "I missed the deadline because I kept refreshing my inbox hoping someone would cancel the project before I had to finish it.",
    craft: { deadlineExcuse: 96, humor: 92, singleLineCraft: 93, humanVoice: 95, freshness: 91 },
    rationale:
      "Painfully honest workplace confession with clear deadline framing and strong conversational cadence.",
  },
  {
    id: "well-rested-self",
    angle: "Delegation to imaginary future self",
    line: "Sorry this is late, I kept delegating it to a well-rested version of myself who still hasn't shown up to work.",
    craft: { deadlineExcuse: 93, humor: 91, singleLineCraft: 92, humanVoice: 94, freshness: 90 },
    rationale:
      "Natural Slack tone and clever workplace framing around putting off work for a more capable version of yourself.",
  },
  {
    id: "password-pressure",
    angle: "Self-inflicted security sabotage",
    line: "Sorry I missed the deadline, I locked myself out of the file with a password I swore I'd remember under pressure.",
    craft: { deadlineExcuse: 95, humor: 89, singleLineCraft: 91, humanVoice: 93, freshness: 92 },
    rationale: "Plausibly real excuse with a tight ironic reversal at the end.",
  },
  {
    id: "too-easy-audit",
    angle: "Paranoid over-verification",
    line: "Sorry it's late, I finished on time, got suspicious that it was too easy, and spent two days hunting for a bug I hadn't written.",
    craft: { deadlineExcuse: 92, humor: 88, singleLineCraft: 88, humanVoice: 91, freshness: 90 },
    rationale: "Relatable engineering psychology with a crisp payoff, though slightly longer rhythm.",
  },
  {
    id: "read-friday",
    angle: "Emotional calendar translation",
    line: "Sorry I missed the deadline, my calendar said due Friday and I emotionally translated that as start Friday.",
    craft: { deadlineExcuse: 95, humor: 87, singleLineCraft: 94, humanVoice: 92, freshness: 86 },
    rationale: "Punchy and deadpan, with immediate clarity in 107 characters.",
  },
  {
    id: "blinking-cursor",
    angle: "Creative-block time distortion",
    line: "I missed the deadline because I underestimated how long you can stare at a blinking cursor and still call it drafting.",
    craft: { deadlineExcuse: 94, humor: 86, singleLineCraft: 91, humanVoice: 90, freshness: 88 },
    rationale: "Vivid image with dry self-awareness and clean single-sentence pacing.",
  },
  {
    id: "tracker-trap",
    angle: "Meta-productivity spiral",
    line: "I missed the deadline because I spent three hours building a color-coded tracker so I wouldn't miss the deadline.",
    craft: { deadlineExcuse: 95, humor: 85, singleLineCraft: 92, humanVoice: 91, freshness: 82 },
    rationale: "Tight circular irony that everyone recognizes, slightly more familiar angle.",
  },
  {
    id: "soft-opening",
    angle: "Hospitality euphemism",
    line: "Sorry I missed the deadline, I treated Thursday at five more like a soft opening than a hard cutoff.",
    craft: { deadlineExcuse: 94, humor: 84, singleLineCraft: 95, humanVoice: 92, freshness: 89 },
    rationale: "Ultra-concise and natural, leaning understated rather than big punchline.",
  },
  {
    id: "deadline-meetings",
    angle: "Recursive meeting culture",
    line: "Sorry I missed the deadline, I was stuck in three back-to-back meetings about how we can stop missing deadlines.",
    craft: { deadlineExcuse: 94, humor: 83, singleLineCraft: 91, humanVoice: 90, freshness: 78 },
    rationale: "Classic corporate satire with clean setup-payoff, docked slightly for familiarity.",
  },
];

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function compareAscii(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function validateConfig(seeds: readonly CandidateSeed[]): void {
  if (seeds.length === 0) {
    throw new Error("No candidate excuses configured.");
  }
  const weightSum = RUBRIC_KEYS.reduce((acc, key) => acc + RUBRIC_WEIGHTS[key], 0);
  if (Math.abs(weightSum - 1) > 1e-6) {
    throw new Error(`Rubric weights must sum to 1 (got ${weightSum}).`);
  }
  const seenIds = new Set<string>();
  for (const seed of seeds) {
    if (!seed.id || seenIds.has(seed.id)) {
      throw new Error(`Invalid or duplicate candidate id: "${seed.id}".`);
    }
    seenIds.add(seed.id);
    for (const key of RUBRIC_KEYS) {
      const value = seed.craft[key];
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        throw new Error(`Invalid rubric score ${key}=${value} for "${seed.id}".`);
      }
    }
  }
}

function checkCompliance(line: string): ComplianceChecks {
  const isSingleLine =
    line.length > 0 && line === line.trim() && !/[\r\n\t\v\f\u2028\u2029]/.test(line);
  const within200Chars = line.length <= CHAR_LIMIT && [...line].length <= CHAR_LIMIT;
  const noUrlOrLink = !/(https?:\/\/|mailto:|www\.|!?\[[^\]]+\]\([^)]+\))/i.test(line);
  const noHtmlMarkup = !/<\/?[a-z][^>]*>|<!--/i.test(line);
  const explicitDeadlineExcuse = EXCUSE_SIGNALS.some((re) => re.test(line));
  const asciiClean = /^[\x20-\x7E]+$/.test(line);
  const passed =
    isSingleLine &&
    within200Chars &&
    noUrlOrLink &&
    noHtmlMarkup &&
    explicitDeadlineExcuse &&
    asciiClean;
  return {
    isSingleLine,
    within200Chars,
    noUrlOrLink,
    noHtmlMarkup,
    explicitDeadlineExcuse,
    asciiClean,
    passed,
  };
}

function scoreCandidate(seed: CandidateSeed): EvaluatedCandidate {
  const checks = checkCompliance(seed.line);
  const chars = [...seed.line].length;
  const clicheHits = CLICHE_PATTERNS.filter((re) => re.test(seed.line)).length;
  const sweetSpotBonus = chars >= 85 && chars <= 140 ? 1.5 : chars <= CHAR_LIMIT ? 0 : -15;
  const excuseBonus = checks.explicitDeadlineExcuse ? 1.0 : -25;

  const rubric: RubricScores = {
    deadlineExcuse: round2(clamp(seed.craft.deadlineExcuse + excuseBonus, 0, 100)),
    humor: round2(clamp(seed.craft.humor, 0, 100)),
    singleLineCraft: round2(clamp(seed.craft.singleLineCraft + sweetSpotBonus, 0, 100)),
    humanVoice: round2(clamp(seed.craft.humanVoice, 0, 100)),
    freshness: round2(clamp(seed.craft.freshness - clicheHits * 12, 0, 100)),
  };

  const weightedScore = round2(
    RUBRIC_KEYS.reduce((sum, key) => sum + rubric[key] * RUBRIC_WEIGHTS[key], 0),
  );

  return {
    id: seed.id,
    angle: seed.angle,
    line: seed.line,
    chars,
    checks,
    rubric,
    weightedScore,
    wins: 0,
    losses: 0,
    draws: 0,
    matches: 0,
    winRate: 0,
    rationale: seed.rationale,
  };
}

function findDecidingFactor(a: EvaluatedCandidate, b: EvaluatedCandidate): RubricKey {
  let bestKey: RubricKey = RUBRIC_KEYS[0];
  let bestWeightedDiff = -1;
  for (const key of RUBRIC_KEYS) {
    const diff = Math.abs(a.rubric[key] - b.rubric[key]) * RUBRIC_WEIGHTS[key];
    if (diff > bestWeightedDiff) {
      bestWeightedDiff = diff;
      bestKey = key;
    }
  }
  return bestKey;
}

function runTournament(candidates: EvaluatedCandidate[]): Matchup[] {
  const matchups: Matchup[] = [];
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const left = candidates[i];
      const right = candidates[j];
      const margin = round2(left.weightedScore - right.weightedScore);
      left.matches += 1;
      right.matches += 1;
      let winnerId = "draw";
      if (left.checks.passed !== right.checks.passed) {
        const winner = left.checks.passed ? left : right;
        const loser = left.checks.passed ? right : left;
        winner.wins += 1;
        loser.losses += 1;
        winnerId = winner.id;
      } else if (margin > 0) {
        left.wins += 1;
        right.losses += 1;
        winnerId = left.id;
      } else if (margin < 0) {
        right.wins += 1;
        left.losses += 1;
        winnerId = right.id;
      } else {
        left.draws += 1;
        right.draws += 1;
      }
      matchups.push({
        leftId: left.id,
        rightId: right.id,
        winnerId,
        margin: Math.abs(margin),
        decidingFactor: findDecidingFactor(left, right),
      });
    }
  }
  for (const c of candidates) {
    c.winRate = c.matches > 0 ? round2((c.wins + c.draws * 0.5) / c.matches) : 0;
  }
  candidates.sort((a, b) => {
    if (a.checks.passed !== b.checks.passed) return a.checks.passed ? -1 : 1;
    const pointsDiff = b.wins * 2 + b.draws - (a.wins * 2 + a.draws);
    if (pointsDiff !== 0) return pointsDiff;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.weightedScore !== a.weightedScore) return b.weightedScore - a.weightedScore;
    return compareAscii(a.id, b.id);
  });
  return matchups;
}

function buildDashboardHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>One Line, No Deadline Met — Excuse Board</title>
  <style>
    :root { color-scheme: dark; --bg:#0d1117; --card:#161b22; --line:#30363d; --text:#e6edf3; --muted:#8b949e; --accent:#58a6ff; --ok:#3fb950; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background:var(--bg); color:var(--text); line-height:1.5; }
    main { max-width:960px; margin:0 auto; padding:32px 20px 64px; }
    .tag { display:inline-block; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--accent); margin-bottom:10px; }
    .hero { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:28px; margin-bottom:24px; }
    .quote { font-size:26px; font-weight:650; margin:8px 0 18px; letter-spacing:-.01em; }
    .pills { display:flex; flex-wrap:wrap; gap:8px; }
    .pill { font-size:12px; padding:4px 10px; border-radius:999px; border:1px solid var(--line); color:var(--muted); }
    .pill.ok { border-color:#238636; color:var(--ok); }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin-top:20px; }
    .metric { background:#0d1117; border:1px solid var(--line); border-radius:10px; padding:12px; }
    .metric .label { font-size:12px; color:var(--muted); }
    .metric .val { font-size:22px; font-weight:700; margin-top:4px; }
    h2 { font-size:18px; margin:28px 0 12px; }
    table { width:100%; border-collapse:collapse; background:var(--card); border:1px solid var(--line); border-radius:12px; overflow:hidden; }
    th, td { text-align:left; padding:12px 14px; border-bottom:1px solid var(--line); vertical-align:top; font-size:14px; }
    th { color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.05em; }
    tr:last-child td { border-bottom:none; }
    .muted { color:var(--muted); font-size:12px; }
  </style>
</head>
<body>
  <main>
    <div class="tag">One Line, No Deadline Met</div>
    <section class="hero">
      <div class="muted">Selected Single-Line Excuse</div>
      <div id="winner-line" class="quote"></div>
      <div id="winner-pills" class="pills"></div>
      <div id="winner-metrics" class="grid"></div>
    </section>
    <h2>Pairwise Tournament Leaderboard</h2>
    <table>
      <thead>
        <tr><th>#</th><th>Excuse &amp; Angle</th><th>Chars</th><th>Record</th><th>Score</th></tr>
      </thead>
      <tbody id="rows"></tbody>
    </table>
  </main>
  <script src="./data.js"></script>
  <script>
    (() => {
      const data = window.EXCUSE_BOARD;
      if (!data || !data.board || !data.board.winner) return;
      const w = data.board.winner;
      const rec = w.wins + "-" + w.losses + (w.draws ? "-" + w.draws : "");
      document.getElementById("winner-line").textContent = w.line;
      const pills = [
        [w.chars + " / " + data.board.charLimit + " chars", w.checks.within200Chars],
        ["Single line", w.checks.isSingleLine],
        ["Missed-deadline excuse", w.checks.explicitDeadlineExcuse],
        ["No links or markup", w.checks.noUrlOrLink && w.checks.noHtmlMarkup],
        ["Record " + rec, true],
      ];
      const pillEl = document.getElementById("winner-pills");
      for (const [text, ok] of pills) {
        const s = document.createElement("span");
        s.className = "pill" + (ok ? " ok" : "");
        s.textContent = text;
        pillEl.appendChild(s);
      }
      const labels = [
        ["Deadline Excuse", w.rubric.deadlineExcuse],
        ["Humor", w.rubric.humor],
        ["Single-Line Craft", w.rubric.singleLineCraft],
        ["Human Voice", w.rubric.humanVoice],
        ["Freshness", w.rubric.freshness],
      ];
      const metricEl = document.getElementById("winner-metrics");
      for (const [label, val] of labels) {
        const box = document.createElement("div");
        box.className = "metric";
        const l = document.createElement("div");
        l.className = "label";
        l.textContent = label;
        const v = document.createElement("div");
        v.className = "val";
        v.textContent = val.toFixed(1);
        box.append(l, v);
        metricEl.appendChild(box);
      }
      const tbody = document.getElementById("rows");
      data.board.candidates.forEach((c, idx) => {
        const tr = document.createElement("tr");
        const rankTd = document.createElement("td");
        rankTd.textContent = String(idx + 1);
        const lineTd = document.createElement("td");
        const mainDiv = document.createElement("div");
        mainDiv.textContent = c.line;
        const subDiv = document.createElement("div");
        subDiv.className = "muted";
        subDiv.textContent = c.angle + " — " + c.rationale;
        lineTd.append(mainDiv, subDiv);
        const charTd = document.createElement("td");
        charTd.textContent = String(c.chars);
        const recTd = document.createElement("td");
        recTd.textContent = c.wins + "-" + c.losses + (c.draws ? "-" + c.draws : "");
        const scoreTd = document.createElement("td");
        scoreTd.textContent = c.weightedScore.toFixed(2);
        tr.append(rankTd, lineTd, charTd, recTd, scoreTd);
        tbody.appendChild(tr);
      });
    })();
  </script>
</body>
</html>
`;
}

function writeArtifact(dir: string, filename: string, content: string): void {
  writeFileSync(join(dir, filename), content, "utf8");
}

function main(): void {
  validateConfig(CANDIDATES);

  const rawOutDir = process.env.MAKEFUN_OUTPUT_DIR?.trim() || join(".", "output");
  const outDir = resolve(rawOutDir);
  mkdirSync(outDir, { recursive: true });

  const candidates = CANDIDATES.map(scoreCandidate);
  const matchups = runTournament(candidates);
  const winner = candidates[0];
  const runnerUp = candidates[1] ?? null;

  if (!winner || !winner.checks.passed) {
    throw new Error("Top candidate failed strict one-line deadline-excuse compliance checks.");
  }

  const digest = createHash("sha256")
    .update(JSON.stringify({ bounty: BOUNTY_ID, candidates, matchups }))
    .digest("hex");

  const board = {
    bounty: BOUNTY_ID,
    format: "one-line-excuse-board/1",
    charLimit: CHAR_LIMIT,
    rubricWeights: RUBRIC_WEIGHTS,
    digest,
    winner,
    candidates,
    matchups,
  };

  const dossier = {
    bounty: BOUNTY_ID,
    format: "one-line-excuse-dossier/1",
    digest,
    entry: winner.line,
    chars: winner.chars,
    charLimit: CHAR_LIMIT,
    compliance: winner.checks,
    rubricWeights: RUBRIC_WEIGHTS,
    winnerRubric: winner.rubric,
    pairwiseSummary: {
      totalCandidates: candidates.length,
      totalMatchups: matchups.length,
      winnerRecord: `${winner.wins}-${winner.losses}-${winner.draws}`,
      winRate: winner.winRate,
      marginOverRunnerUp: runnerUp ? round2(winner.weightedScore - runnerUp.weightedScore) : 0,
      runnerUpId: runnerUp ? runnerUp.id : null,
      runnerUpLine: runnerUp ? runnerUp.line : null,
    },
    selectionRationale: winner.rationale,
  };

  const boardJson = `${JSON.stringify(board, null, 2)}\n`;
  const dossierJson = `${JSON.stringify(dossier, null, 2)}\n`;
  const dataJsPayload = JSON.stringify({ board, dossier }, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  writeArtifact(outDir, "excuse.txt", winner.line);
  writeArtifact(outDir, "board.json", boardJson);
  writeArtifact(outDir, "dossier.json", dossierJson);
  writeArtifact(outDir, "data.js", `window.EXCUSE_BOARD = ${dataJsPayload};\n`);
  writeArtifact(outDir, "index.html", buildDashboardHtml());

  process.stdout.write(`${winner.line}\n`);
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
}