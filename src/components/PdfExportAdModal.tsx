import React, { useState } from 'react';
import { Download, X, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { StudentInfo } from '../types';

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
  const [downloaded, setDownloaded] = useState(false);

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
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 px-4 py-3 text-white flex items-center justify-between shrink-0">
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Transcript Summary Pill */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0">
                {studentInfo.studentName?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="truncate">
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {studentInfo.studentName || 'Student Performance Report'}
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  {totalObtained !== undefined && totalMax !== undefined ? `${totalObtained}/${totalMax} Marks` : studentInfo.standard || 'All Subjects'} &bull; {studentInfo.institutionName || 'Academic Marksheet'}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-black text-indigo-600">{percentage.toFixed(1)}%</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase">{division}</div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              Ready for Instant Offline Export
            </p>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Your formal PDF performance report is rendered client-side. No personal data is saved to remote servers.
            </p>
          </div>
        </div>

        {/* Bottom Action Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2 shrink-0">
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
                <span>Download PDF Report Now</span>
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
