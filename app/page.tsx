'use client';

import { useRef, useState } from 'react';
import RoastTicket, { RoastData } from '@/components/RoastTicket';

type Status = 'idle' | 'loading' | 'done' | 'error';

const LOADING_LINES = [
  'Checking the walk-in for spaghetti...',
  'Tasting the sauce (it\'s undercooked)...',
  'Reading your commit history...',
  'Sniffing for hardcoded secrets...',
  'Judging your variable names...',
  'Firing the ticket...',
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<RoastData | null>(null);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
  const ticketRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || status === 'loading') return;

    setStatus('loading');
    setError('');
    setResult(null);

    let lineIndex = 0;
    const lineTimer = setInterval(() => {
      lineIndex = (lineIndex + 1) % LOADING_LINES.length;
      setLoadingLine(LOADING_LINES[lineIndex]);
    }, 1400);

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong in the kitchen.');
      }

      setResult({ repo: data.repo, ...data.roast });
      setStatus('done');
    } catch (err: any) {
      setError(err.message || 'Something went wrong in the kitchen.');
      setStatus('error');
    } finally {
      clearInterval(lineTimer);
    }
  }

  async function handleDownload() {
    if (!ticketRef.current) return;
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(ticketRef.current, { pixelRatio: 2, backgroundColor: '#0B0B0C' });
    const link = document.createElement('a');
    link.download = `roast-${result?.repo.replace('/', '-')}.png`;
    link.href = dataUrl;
    link.click();
  }

  function handleShareTwitter() {
    if (!result) return;
    const text = `My code just got roasted: "${result.headline}" ${result.stars}/3 stars 🔥\n\nGet yours:`;
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  }

  function reset() {
    setStatus('idle');
    setResult(null);
    setError('');
    setUrl('');
  }

  return (
    <main className="min-h-screen px-4 py-16 sm:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        {/* Hero */}
        {status === 'idle' || status === 'error' ? (
          <>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-scorch/40 bg-scorch/10 px-3 py-1 text-[11px] tracking-widest text-scorch">
              <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-scorch" />
              KITCHEN IS OPEN
            </div>
            <h1 className="text-center font-display text-5xl leading-[0.95] tracking-wide text-ticket sm:text-7xl">
              ROAST MY
              <br />
              <span className="text-scorch">CODE</span>
            </h1>
            <p className="mt-5 max-w-md text-center text-[15px] leading-relaxed text-ticket/60">
              Paste a public GitHub repo. An AI head chef with zero patience will inspect it,
              rate it 0–3 stars, and tell you exactly where it went wrong.
            </p>

            <form onSubmit={handleSubmit} className="mt-9 w-full max-w-lg">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="github.com/you/your-repo"
                  className="flex-1 rounded-md border border-ticket/15 bg-steel px-4 py-3.5 font-mono text-sm text-ticket placeholder:text-ticket/30 outline-none focus:border-scorch focus:ring-2 focus:ring-scorch/30"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-md bg-scorch px-6 py-3.5 font-display text-lg tracking-wide text-char transition hover:bg-scorch/90 active:scale-[0.98]"
                >
                  SEND IT IN
                </button>
              </div>
              {status === 'error' && (
                <p className="mt-3 text-sm text-scorch">{error}</p>
              )}
            </form>

            <p className="mt-6 text-xs text-ticket/30">
              Public repos only · Reviews actual code, not vibes
            </p>
          </>
        ) : null}

        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-ticket/20 border-t-scorch" />
            <p className="mt-6 font-mono text-sm text-ticket/60">{loadingLine}</p>
          </div>
        )}

        {/* Result */}
        {status === 'done' && result && (
          <div className="flex w-full flex-col items-center">
            <div className="animate-print overflow-hidden">
              <RoastTicket ref={ticketRef} data={result} />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleShareTwitter}
                className="rounded-md bg-ticket px-5 py-2.5 text-sm font-semibold text-char transition hover:bg-ticket/90"
              >
                Share on X
              </button>
              <button
                onClick={handleDownload}
                className="rounded-md border border-ticket/20 px-5 py-2.5 text-sm font-semibold text-ticket transition hover:border-ticket/40"
              >
                Download ticket
              </button>
              <button
                onClick={reset}
                className="rounded-md px-5 py-2.5 text-sm text-ticket/50 transition hover:text-ticket"
              >
                Roast another repo
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
