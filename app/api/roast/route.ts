import { NextRequest, NextResponse } from 'next/server';
import { fetchRepoBundle, parseRepoUrl, GithubFetchError } from '@/lib/github';
import { roastRepo } from '@/lib/llm';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Extremely small in-memory rate limit per server instance.
// Good enough to blunt casual abuse; swap for a real store (Upstash, etc.)
// before you actually need to survive a front-page spike.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_HITS;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: "Kitchen's slammed. Wait a minute before sending another dish." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const url = body?.url;
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing repo URL.' }, { status: 400 });
    }

    const { owner, repo } = parseRepoUrl(url);
    const bundle = await fetchRepoBundle(owner, repo);
    const roast = await roastRepo(bundle);

    return NextResponse.json({
      repo: `${bundle.owner}/${bundle.repo}`,
      stars: bundle.stars,
      language: bundle.language,
      filesReviewed: bundle.files.length,
      filesTotal: bundle.fileCountTotal,
      roast,
    });
  } catch (err) {
    if (err instanceof GithubFetchError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return NextResponse.json(
      { error: 'The kitchen caught fire. Try again in a moment.' },
      { status: 500 }
    );
  }
}
