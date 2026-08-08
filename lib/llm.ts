import Groq from 'groq-sdk';
import type { RepoBundle } from './github';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Groq deprecated llama-3.3-70b-versatile in mid-2026 — openai/gpt-oss-120b
// is their current recommended replacement for this tier of quality/speed.
const MODEL = 'openai/gpt-oss-120b';

export interface RoastResult {
  stars: 0 | 1 | 2 | 3;
  stamp: string; // short rubber-stamp verdict, e.g. "IT'S RAW"
  headline: string; // one-line verdict, in voice
  complaints: string[]; // 3-5 specific, technical complaints, in voice
  compliment: string; // one grudging backhanded compliment
  closing: string; // final mic-drop line
}

const SYSTEM_PROMPT = `You are a world-renowned, foul-mouthed-but-broadcast-safe head chef reviewing a stranger's codebase as if it were a dish sent back from your kitchen pass. Full Gordon Ramsay energy: theatrical fury, kitchen metaphors (raw, overcooked, bland, reheated, soggy bottom, spaghetti — literally applicable here — cross-contamination, health-code violations), short punchy sentences, ALL CAPS for emphasis on occasion, but every complaint must be a REAL, SPECIFIC, TECHNICALLY ACCURATE observation about the actual code you were given. Never invent problems that aren't there. If the code is genuinely solid, admit it — grudgingly, still in character, but honestly.

Keep it clever, not cruel for cruelty's sake. No slurs, no personal attacks on the author as a human being, no harassment — roast the CODE, not the person. Keep language broadcast-safe (no profanity beyond mild exclamations like "bloody" or "hell").

Respond with ONLY a JSON object, no markdown fences, no preamble, matching exactly this shape:
{
  "stars": 0 | 1 | 2 | 3,
  "stamp": "3-5 word rubber-stamp verdict in all caps, e.g. IT'S RAW or FINALLY, SOMEONE WHO CAN COOK",
  "headline": "one punchy sentence verdict in voice",
  "complaints": ["3 to 5 specific technical complaints, each 1-2 sentences, each citing something concrete from the code (a pattern, a file, a missing practice)"],
  "compliment": "one grudging, specific backhanded compliment about something genuinely done well",
  "closing": "one final mic-drop line, in voice"
}

Star rating guide: 0 = send it back to the kitchen, unusable. 1 = edible if you're desperate. 2 = solid, a few things need fixing. 3 = genuinely impressive, rare.`;

function buildUserPrompt(bundle: RepoBundle): string {
  const fileBlocks = bundle.files
    .map((f) => `--- FILE: ${f.path} ---\n${f.content}`)
    .join('\n\n');

  return `Repo: ${bundle.owner}/${bundle.repo}
Description: ${bundle.description || '(none provided)'}
Primary language: ${bundle.language || 'unknown'}
Stars: ${bundle.stars}
Files included in this review (sample of ${bundle.fileCountTotal} total): ${bundle.files.length}

${fileBlocks}

Review this codebase now. Respond with only the JSON object.`;
}

function extractJson(text: string): any {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in model response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function roastRepo(bundle: RepoBundle): Promise<RoastResult> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 1200,
    temperature: 0.9, // Ramsay should have some theatrical variance
    response_format: { type: 'json_object' }, // Groq's JSON mode — keeps output parseable
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(bundle) },
    ],
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) {
    throw new Error('Model returned no text content');
  }

  const parsed = extractJson(text);

  const stars = Math.max(0, Math.min(3, Number(parsed.stars) || 0)) as 0 | 1 | 2 | 3;

  return {
    stars,
    stamp: String(parsed.stamp || 'INSPECTION FAILED').slice(0, 60),
    headline: String(parsed.headline || '').slice(0, 240),
    complaints: Array.isArray(parsed.complaints)
      ? parsed.complaints.slice(0, 5).map((c: unknown) => String(c).slice(0, 400))
      : [],
    compliment: String(parsed.compliment || '').slice(0, 300),
    closing: String(parsed.closing || '').slice(0, 200),
  };
}
