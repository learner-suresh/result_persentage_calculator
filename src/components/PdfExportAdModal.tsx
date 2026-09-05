import React, { useState, useEffect } from 'react';
import { Download, X, CheckCircle2, FileText, Sparkles, ShieldCheck } from 'lucide-react';
import { StudentInfo } from '../types';
import { AdSenseUnit } from './AdSenseUnit';

interface PdfExportAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  studentInfo: StudentInfo;
  percentage: number;
  division: string;
  totalObtained?: number;
  totalMax?: number;
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
  const [countdown, setCountdown] = useState(2);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(2);
      setDownloaded(false);
      return;
    }

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-ad-modal-title"
    >
      <div className="relative w-full max-w-md max-h-[min(92vh,580px)] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 px-4 py-2.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 id="pdf-ad-modal-title" className="font-bold text-sm leading-tight">
                Export Marksheet Report
              </h3>
              <p className="text-[10px] text-indigo-100">
                Official PDF Transcript
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Modal Body with controlled height */}
        <div className="p-3.5 sm:p-4 space-y-3 overflow-y-auto flex-1">
          {/* Transcript Summary Pill */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                {studentInfo.studentName?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="truncate">
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {studentInfo.studentName || 'Student Performance Report'}
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  {totalObtained !== undefined && totalMax !== undefined ? `${totalObtained}/${totalMax} Marks` : studentInfo.standard} &bull; {studentInfo.institutionName || 'Academic Marksheet'}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs sm:text-sm font-black text-indigo-600">{percentage.toFixed(1)}%</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase">{division}</div>
            </div>
          </div>

          {/* Compact Ad Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-bold text-slate-400">
              <span className="flex items-center gap-1 text-slate-500">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                Sponsored Academic Partner
              </span>
              <span>Advertisement</span>
            </div>

            {/* Embedded Responsive Ad Unit */}
            <AdSenseUnit slotId="9988776655" format="responsive-banner" className="my-0 p-2.5 shadow-none border-slate-200" />
          </div>

          <p className="text-[9px] text-center text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Zero-API student data privacy &bull; PDF generated 100% locally
          </p>
        </div>

        {/* Fixed Bottom Action Area */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExecuteDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer"
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>PDF Downloaded! Click to Download Again</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-indigo-200" />
                <span>
                  Download PDF Report Now
                  {countdown > 0 ? ` (${countdown}s)` : ''}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1 text-center text-[11px] font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Cancel &amp; Return to Marksheet
          </button>
        </div>
      </div>
    </div>
  );
}
