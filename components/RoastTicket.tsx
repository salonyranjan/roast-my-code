'use client';

import { forwardRef } from 'react';

export interface RoastData {
  repo: string;
  stars: 0 | 1 | 2 | 3;
  stamp: string;
  headline: string;
  complaints: string[];
  compliment: string;
  closing: string;
}

const STAMP_COLOR: Record<number, string> = {
  0: 'text-scorch border-scorch',
  1: 'text-scorch border-scorch',
  2: 'text-brass border-brass',
  3: 'text-brass border-brass',
};

function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`${stars} out of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`text-2xl leading-none ${i < stars ? 'text-brass' : 'text-char/20'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const RoastTicket = forwardRef<HTMLDivElement, { data: RoastData }>(function RoastTicket(
  { data },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative w-full max-w-[480px] bg-ticket text-char shadow-2xl ticket-shadow"
    >
      <div className="torn-top h-4 w-full bg-ticket" />

      <div className="px-7 pb-8 pt-2 font-mono">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-dashed border-char/30 pb-3">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-char/60">KITCHEN INSPECTION</p>
            <p className="mt-1 font-display text-2xl tracking-wide">ROAST MY CODE</p>
          </div>
          <StarRow stars={data.stars} />
        </div>

        {/* Repo line */}
        <div className="mt-4 flex items-baseline justify-between text-xs">
          <span className="text-char/60">TICKET&nbsp;#{Math.floor(Math.random() * 8999) + 1000}</span>
          <span className="font-semibold">{data.repo}</span>
        </div>

        {/* Stamp */}
        <div className="my-6 flex justify-center">
          <div
            className={`rotate-[-8deg] rounded-sm border-[3px] px-4 py-2 text-center font-display text-xl tracking-wider ${STAMP_COLOR[data.stars]}`}
            style={{ opacity: 0.92 }}
          >
            {data.stamp}
          </div>
        </div>

        {/* Headline */}
        <p className="text-center text-[15px] font-medium leading-snug">&ldquo;{data.headline}&rdquo;</p>

        {/* Complaints */}
        <div className="mt-6 border-t-2 border-dashed border-char/30 pt-4">
          <p className="text-[10px] tracking-[0.3em] text-char/60">SENT BACK FOR</p>
          <ul className="mt-2 space-y-2 text-[13px] leading-snug">
            {data.complaints.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-scorch">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Compliment */}
        {data.compliment && (
          <div className="mt-5 border-t-2 border-dashed border-char/30 pt-4">
            <p className="text-[10px] tracking-[0.3em] text-char/60">ONE THING THAT DIDN&rsquo;T MAKE ME WEEP</p>
            <p className="mt-2 text-[13px] italic leading-snug">{data.compliment}</p>
          </div>
        )}

        {/* Closing */}
        <div className="mt-6 border-t-2 border-dashed border-char/30 pt-4 text-center">
          <p className="text-[13px] font-semibold">{data.closing}</p>
        </div>

        <p className="mt-6 text-center text-[10px] tracking-[0.2em] text-char/40">
          ROASTMYCODE.APP
        </p>
      </div>

      <div className="torn-top h-4 w-full rotate-180 bg-ticket" />
    </div>
  );
});

export default RoastTicket;
