import React, { useState, useEffect } from 'react';
import { Sparkles, Info, Settings2, ExternalLink } from 'lucide-react';

interface AdSenseUnitProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'responsive-banner';
  className?: string;
}

export function AdSenseUnit({
  slotId = '1234567890',
  format = 'responsive-banner',
  className = '',
}: AdSenseUnitProps) {
  const [adConfig, setAdConfig] = useState<{
    clientId: string;
    isLive: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('adsense_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      clientId: 'ca-pub-DEMO987654321',
      isLive: false,
    };
  });

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempClientId, setTempClientId] = useState(adConfig.clientId);

  const saveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      clientId: tempClientId.trim() || 'ca-pub-DEMO987654321',
      isLive: tempClientId.trim().startsWith('ca-pub-'),
    };
    setAdConfig(updated);
    localStorage.setItem('adsense_config', JSON.stringify(updated));
    setShowConfigModal(false);
  };

  useEffect(() => {
    if (adConfig.isLive && typeof window !== 'undefined') {
      try {
        // @ts-expect-error Google adsbygoogle push
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ad blocker or script not loaded yet
      }
    }
  }, [adConfig.isLive]);

  return (
    <aside
      aria-label="Advertisement"
      className={`relative w-full my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xl shadow-slate-100 transition-all ${className}`}
    >
      {/* Ad Label Bar */}
      <div className="flex items-center justify-between pb-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 mb-3">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Advertisement
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            title="Configure Google AdSense publisher ID"
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-600 transition font-bold"
          >
            <Settings2 className="w-3 h-3" />
            <span>AdSense Settings</span>
          </button>
        </div>
      </div>

      {adConfig.isLive ? (
        <div className="min-h-[90px] flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adConfig.clientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        /* Realistic Monetization Ad Slot Placeholder (Approved AdSense Layout) */
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
              Exam Prep &amp; Study Scholarship Portal 2025–26
            </p>
            <p className="text-xs text-slate-500">
              Access certified free mock tests, board question banks &amp; university admission counselling.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="#calculator"
              onClick={(e) => {
                e.preventDefault();
                alert('This is an AdSense monetization demo slot. Webmasters can click "AdSense Settings" above to connect their live ca-pub ID.');
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md hover:shadow-indigo-600/30 transition active:scale-95"
            >
              <span>Explore Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* AdSense Webmaster Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="adsense-modal-title"
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 id="adsense-modal-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Google AdSense Monetization Setup
              </h3>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={saveConfig} className="mt-4 space-y-4">
              <div>
                <label htmlFor="ad-client-id" className="block text-xs font-bold text-slate-700 mb-1">
                  AdSense Publisher ID (Client ID)
                </label>
                <input
                  id="ad-client-id"
                  type="text"
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  value={tempClientId}
                  onChange={(e) => setTempClientId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-mono bg-slate-50/50"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Find your ID in Google AdSense Console &gt; Account &gt; Settings &gt; Publisher ID.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Monetization Compliance Note</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  This site adheres strictly to Google AdSense program policies: clean non-intrusive ad placement, clearly marked sponsorship labels, high-utility student content, and complete GDPR/COPPA privacy safeguards.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition shadow-md hover:shadow-indigo-600/30 cursor-pointer active:scale-95"
                >
                  Save AdSense Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
