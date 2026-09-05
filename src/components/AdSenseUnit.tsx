import React, { useEffect } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdSenseUnitProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'responsive-banner';
  className?: string;
}

const PUBLISHER_ID = 'ca-pub-3199860809392813';

export function AdSenseUnit({
  slotId = '1234567890',
  format = 'responsive-banner',
  className = '',
}: AdSenseUnitProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // @ts-expect-error Google adsbygoogle push
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Handled silently if ad blocker or script pending
      }
    }
  }, [slotId]);

  return (
    <aside
      aria-label="Advertisement"
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xl shadow-slate-100 transition-all ${className || 'my-6'}`}
    >
      {/* Ad Label Bar - Clean without any exposed settings or publisher ID */}
      <div className="flex items-center justify-between pb-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 mb-3">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Advertisement
        </span>
        <span className="text-[10px] text-slate-400 font-medium lowercase tracking-normal">
          sponsored
        </span>
      </div>

      {/* Official AdSense ins container */}
      <div className={`flex items-center justify-center ${format === 'rectangle' ? 'min-h-[250px]' : 'min-h-[90px]'}`}>
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            minWidth: '250px',
            minHeight: format === 'rectangle' ? '250px' : '90px',
          }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={slotId}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>

      {/* Graceful Fallback Academic Announcement (visible only when ad blocker is active or until Google fills ad slot) */}
      <noscript>
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200 text-left ${
            format === 'rectangle' ? 'max-w-sm mx-auto flex-col' : ''
          }`}
        >
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
              Academic Partner
            </span>
            <p className="text-sm font-bold text-slate-900">
              Exam Preparation &amp; Scholarship Guides 2025–26
            </p>
            <p className="text-xs text-slate-500">
              Access free practice questions, board syllabus breakdowns &amp; college admission cutoff guides.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="#calculator"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition active:scale-95"
            >
              <span>Explore Guides</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </noscript>
    </aside>
  );
}
