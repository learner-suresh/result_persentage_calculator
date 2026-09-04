import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { StudentInfo } from '../types';
import { AdSenseUnit } from './AdSenseUnit';

interface PdfExportAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  studentInfo: StudentInfo;
  percentage: number;
  division: string;
  totalObtained: number;
  totalMax: number;
}

export function PdfExportAdModal({
  isOpen,
  onClose,
  onDownload,
  studentInfo,
  percentage,
  division,
  totalObtained,
  totalMax,
}: PdfExportAdModalProps) {
  const [countdown, setCountdown] = useState<number>(4);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  // Reset countdown whenever modal opens
  useEffect(() => {
    if (!isOpen) {
      setCountdown(4);
      setDownloaded(false);
      return;
    }

    setCountdown(4);
    setDownloaded(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExecuteDownload = () => {
    setDownloaded(true);
    onDownload();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-ad-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 id="pdf-ad-modal-title" className="font-bold text-sm sm:text-base leading-tight">
                Export Academic Performance Report
              </h3>
              <p className="text-[11px] text-indigo-100 font-medium">
                Official verified transcript format
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Transcript Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              {studentInfo.institutionLogo ? (
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={studentInfo.institutionLogo}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0">
                  {studentInfo.studentName?.charAt(0) || 'S'}
                </div>
              )}
              <div className="truncate">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {studentInfo.studentName || 'Candidate Transcript'}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {studentInfo.standard} &bull; {studentInfo.institutionName || 'Institution'}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-black text-indigo-600">{percentage.toFixed(1)}%</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">{division}</div>
            </div>
          </div>

          {/* SPONSORED AD POPUP SECTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-slate-400">
              <span className="flex items-center gap-1 text-slate-500">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Sponsored Educational Announcement
              </span>
              <span>Advertisement</span>
            </div>

            {/* Ad Container Box */}
            <div className="border border-slate-200 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-indigo-50/40 p-4 relative overflow-hidden shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    AD &bull; Career &amp; College Admissions 2025
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    Compare 500+ Top Colleges &amp; Scholarships
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Find universities accepting your percentage ({percentage.toFixed(1)}%). Calculate eligibility cutoffs, scholarship grants, and entrance deadlines.
                  </p>
                </div>
              </div>

              {/* Interactive Ad Action */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2 text-xs">
                <span className="text-[11px] text-slate-400">Free Counseling Guide</span>
                <span className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 text-xs cursor-pointer">
                  <span>Explore Programs</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Embedded AdSense slot */}
            <div className="my-1">
              <AdSenseUnit slotId="9988776655" format="responsive-banner" className="my-2 py-3" />
            </div>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Sponsors keep our high-precision marksheet PDF generator completely free.
            </p>
          </div>

          {/* Action Download Button & Timer */}
          <div className="pt-1 space-y-2">
            <button
              type="button"
              onClick={handleExecuteDownload}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/25 active:scale-[0.99] cursor-pointer"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>PDF Downloaded! Click to Download Again</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-indigo-200" />
                  <span>
                    Download PDF Performance Report Now
                    {countdown > 0 ? ` (${countdown}s)` : ''}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
