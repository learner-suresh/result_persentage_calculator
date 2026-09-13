import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface AdSenseUnitProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'responsive-banner';
  className?: string;
}

const PUBLISHER_ID = 'ca-pub-3199860809392813';

export function AdSenseUnit({
  slotId,
  format = 'responsive-banner',
  className = '',
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && adRef.current && !pushedRef.current) {
      // Check if ad was already requested for this ins element
      if (!adRef.current.getAttribute('data-adsbygoogle-status')) {
        try {
          // @ts-expect-error Google adsbygoogle global
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        } catch {
          // Handled gracefully
        }
      }
    }
  }, [slotId]);

  return (
    <aside
      aria-label="Advertisement"
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-md shadow-slate-100/60 transition-all ${
        className || 'my-6'
      }`}
    >
      {/* Official AdSense compliant label */}
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
      <div
        className={`flex items-center justify-center overflow-hidden ${
          format === 'rectangle' ? 'min-h-[250px]' : 'min-h-[90px]'
        }`}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            minWidth: '250px',
            minHeight: format === 'rectangle' ? '250px' : '90px',
          }}
          data-ad-client={PUBLISHER_ID}
          {...(slotId ? { 'data-ad-slot': slotId } : {})}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
