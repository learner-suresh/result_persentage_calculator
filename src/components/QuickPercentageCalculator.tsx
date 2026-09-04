import React, { useState, useMemo } from 'react';
import {
  Zap,
  Copy,
  Check,
  RotateCcw,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Info,
  Percent,
  Calculator,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { calculateQuickPercentage } from '../utils/calculator';

interface QuickPercentageCalculatorProps {
  onTransferToDetailed?: (obtained: number, max: number) => void;
  className?: string;
}

const COMMON_FULL_MARKS = [50, 100, 200, 300, 500, 600, 700, 800, 1000, 1200];

export function QuickPercentageCalculator({
  onTransferToDetailed,
  className = '',
}: QuickPercentageCalculatorProps) {
  // Mode: 'marksToPercent' or 'percentToMarks'
  const [calcMode, setCalcMode] = useState<'marksToPercent' | 'percentToMarks'>('marksToPercent');

  // Values for marksToPercent
  const [obtainedInput, setObtainedInput] = useState<string>('425');
  const [maxInput, setMaxInput] = useState<string>('500');
  const [decimals, setDecimals] = useState<number>(2);

  // Values for percentToMarks
  const [targetPercentInput, setTargetPercentInput] = useState<string>('85');
  const [totalMarksInput, setTotalMarksInput] = useState<string>('500');

  // Copy feedback state
  const [copied, setCopied] = useState<boolean>(false);

  // Marks to Percentage calculation
  const obtainedNum = Math.max(0, parseFloat(obtainedInput) || 0);
  const maxNum = Math.max(1, parseFloat(maxInput) || 100);

  const result = useMemo(() => {
    return calculateQuickPercentage(obtainedNum, maxNum, decimals);
  }, [obtainedNum, maxNum, decimals]);

  // Percentage to Marks reverse calculation
  const reverseResult = useMemo(() => {
    const pct = Math.max(0, Math.min(100, parseFloat(targetPercentInput) || 0));
    const total = Math.max(1, parseFloat(totalMarksInput) || 100);
    const marks = (pct / 100) * total;
    const roundedMarks = Number(marks.toFixed(decimals));
    const quickRes = calculateQuickPercentage(roundedMarks, total, decimals);
    return {
      marks: roundedMarks,
      percentage: pct,
      total,
      details: quickRes,
      formula: `(${pct}% ÷ 100) × ${total} = ${roundedMarks} marks`,
    };
  }, [targetPercentInput, totalMarksInput, decimals]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickPreset = (val: number) => {
    if (calcMode === 'marksToPercent') {
      setMaxInput(val.toString());
      // Adjust obtained if it exceeds new max
      if (obtainedNum > val) {
        setObtainedInput(Math.round(val * 0.8).toString());
      }
    } else {
      setTotalMarksInput(val.toString());
    }
  };

  const handleQuickAdjust = (delta: number) => {
    if (calcMode === 'marksToPercent') {
      const next = Math.max(0, Math.min(maxNum, Math.round(obtainedNum + delta)));
      setObtainedInput(next.toString());
    } else {
      const currentPct = parseFloat(targetPercentInput) || 0;
      const next = Math.max(0, Math.min(100, Math.round(currentPct + delta)));
      setTargetPercentInput(next.toString());
    }
  };

  const handleReset = () => {
    if (calcMode === 'marksToPercent') {
      setObtainedInput('425');
      setMaxInput('500');
    } else {
      setTargetPercentInput('85');
      setTotalMarksInput('500');
    }
  };

  return (
    <div
      id="quick-percentage-calculator-card"
      className={`bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-6 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Quick Percentage Generator
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Instant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your obtained marks out of full marks to get instantaneous percentage, grade &amp; division.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setCalcMode('marksToPercent')}
            className={`px-3 py-1.5 rounded-lg transition ${
              calcMode === 'marksToPercent'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Marks &rarr; Percentage
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('percentToMarks')}
            className={`px-3 py-1.5 rounded-lg transition ${
              calcMode === 'percentToMarks'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Percentage &rarr; Marks
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Realtime Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Direct Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {calcMode === 'marksToPercent' ? (
            /* Mode 1: Marks to Percentage */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Obtained Marks Input */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="quick-obtained-marks"
                      className="block text-xs font-bold text-slate-800"
                    >
                      Marks Obtained (Your Score)
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">Scored</span>
                  </div>
                  <div className="relative">
                    <input
                      id="quick-obtained-marks"
                      type="number"
                      min="0"
                      max={maxNum}
                      step="any"
                      value={obtainedInput}
                      onChange={(e) => setObtainedInput(e.target.value)}
                      placeholder="e.g. 425"
                      className="w-full px-3.5 py-2.5 text-lg font-black text-indigo-700 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                    <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">
                      Marks
                    </span>
                  </div>
                  {/* Quick Adjust Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Adjust:</span>
                    {[-10, -5, +5, +10].map((adj) => (
                      <button
                        key={adj}
                        type="button"
                        onClick={() => handleQuickAdjust(adj)}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-[10px] font-bold text-slate-600 transition"
                      >
                        {adj > 0 ? `+${adj}` : adj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Marks Input */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="quick-max-marks"
                      className="block text-xs font-bold text-slate-800"
                    >
                      Full Marks (Total / Out of)
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">Maximum</span>
                  </div>
                  <div className="relative">
                    <input
                      id="quick-max-marks"
                      type="number"
                      min="1"
                      step="any"
                      value={maxInput}
                      onChange={(e) => setMaxInput(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full px-3.5 py-2.5 text-lg font-black text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                    <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">
                      Total
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Total aggregate marks across all papers.
                  </p>
                </div>
              </div>

              {/* Quick Preset Buttons for Full Marks */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Common Board Full Marks:
                  </span>
                  <span className="text-slate-400">Tap to select total</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_FULL_MARKS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickPreset(val)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                        maxNum === val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: Percentage to Marks (Reverse) */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Percentage Input */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="quick-target-pct"
                      className="block text-xs font-bold text-slate-800"
                    >
                      Percentage (%)
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">Target</span>
                  </div>
                  <div className="relative">
                    <input
                      id="quick-target-pct"
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={targetPercentInput}
                      onChange={(e) => setTargetPercentInput(e.target.value)}
                      placeholder="e.g. 85"
                      className="w-full px-3.5 py-2.5 text-lg font-black text-indigo-700 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                    <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">
                      %
                    </span>
                  </div>
                  {/* Quick Adjust Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Adjust:</span>
                    {[-5, -1, +1, +5].map((adj) => (
                      <button
                        key={adj}
                        type="button"
                        onClick={() => handleQuickAdjust(adj)}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-[10px] font-bold text-slate-600 transition"
                      >
                        {adj > 0 ? `+${adj}%` : `${adj}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Marks Input */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="quick-total-marks-rev"
                      className="block text-xs font-bold text-slate-800"
                    >
                      Full Marks (Out of)
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">Total</span>
                  </div>
                  <div className="relative">
                    <input
                      id="quick-total-marks-rev"
                      type="number"
                      min="1"
                      step="any"
                      value={totalMarksInput}
                      onChange={(e) => setTotalMarksInput(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full px-3.5 py-2.5 text-lg font-black text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                    <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">
                      Marks
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Calculate marks needed to score {targetPercentInput || '0'}%.
                  </p>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Common Board Full Marks:
                  </span>
                  <span className="text-slate-400">Tap to select total</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_FULL_MARKS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickPreset(val)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                        parseFloat(totalMarksInput) === val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar: Decimals & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Decimals:</span>
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                {[0, 1, 2, 3].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDecimals(d)}
                    className={`px-2 py-0.5 text-xs font-bold rounded-md transition ${
                      decimals === d
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Values</span>
            </button>
          </div>
        </div>

        {/* Right Column: Instant Live Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-indigo-50/60 to-white rounded-2xl border border-indigo-100 p-6 shadow-md shadow-indigo-100/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-600" />
              Calculated Result
            </span>
            <button
              type="button"
              onClick={() => {
                const textToCopy =
                  calcMode === 'marksToPercent'
                    ? `Marks: ${result.obtained}/${result.max} | Percentage: ${result.formattedPercentage} | Grade: ${result.grade.letterGrade} | Division: ${result.division}`
                    : `${reverseResult.percentage}% of ${reverseResult.total} marks = ${reverseResult.marks} marks`;
                handleCopy(textToCopy);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-2xs transition"
              title="Copy percentage and grade to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Metric Display */}
          {calcMode === 'marksToPercent' ? (
            <div className="text-center py-2 space-y-1">
              <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none font-mono">
                {result.formattedPercentage}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Scored <strong className="text-slate-800">{result.obtained}</strong> out of{' '}
                <strong className="text-slate-800">{result.max}</strong> full marks
              </p>
            </div>
          ) : (
            <div className="text-center py-2 space-y-1">
              <div className="text-5xl sm:text-6xl font-black text-indigo-600 tracking-tight leading-none font-mono">
                {reverseResult.marks}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Marks required out of <strong className="text-slate-800">{reverseResult.total}</strong>{' '}
                for <strong className="text-indigo-600">{reverseResult.percentage}%</strong>
              </p>
            </div>
          )}

          {/* Color-coded Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  (calcMode === 'marksToPercent' ? result.percentage : reverseResult.percentage) >= 75
                    ? 'bg-emerald-500'
                    : (calcMode === 'marksToPercent' ? result.percentage : reverseResult.percentage) >= 60
                    ? 'bg-indigo-600'
                    : (calcMode === 'marksToPercent' ? result.percentage : reverseResult.percentage) >= 50
                    ? 'bg-teal-500'
                    : (calcMode === 'marksToPercent' ? result.percentage : reverseResult.percentage) >= 33
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    calcMode === 'marksToPercent' ? result.percentage : reverseResult.percentage
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>0% (Fail)</span>
              <span>33% (Pass)</span>
              <span>60% (1st Div)</span>
              <span>75%+ (Dist.)</span>
            </div>
          </div>

          {/* Division & Grade Badges */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Division Status
              </span>
              <span className="block text-xs font-extrabold text-slate-800 mt-0.5 truncate">
                {calcMode === 'marksToPercent' ? result.division : reverseResult.details.division}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Letter Grade
              </span>
              <span className="block text-xs font-extrabold text-indigo-700 mt-0.5 truncate">
                {calcMode === 'marksToPercent'
                  ? result.grade.letterGrade.split(' (')[0]
                  : reverseResult.details.grade.letterGrade.split(' (')[0]}
              </span>
            </div>
          </div>

          {/* Formula Breakdown Card */}
          <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-xs text-slate-700 space-y-1">
            <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">
              Calculation Formula:
            </div>
            <div className="text-xs font-bold text-slate-900">
              {calcMode === 'marksToPercent' ? result.formulaText : reverseResult.formula}
            </div>
          </div>

          {/* Performance Insights */}
          {calcMode === 'marksToPercent' && (
            <div className="space-y-1.5 text-xs text-slate-600 bg-white/80 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span>Marks Deducted / Lost:</span>
                <span className="font-bold text-rose-600">
                  {result.marksLost} marks ({result.lostPercentage}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span>GPA Equivalent (10.0 / 4.0):</span>
                <span className="font-bold text-slate-900">
                  {result.gpa10} / 10 • {result.gpa4} / 4.0
                </span>
              </div>
              {result.nextMilestone && (
                <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
                  <span className="text-indigo-700 font-medium">Next Milestone:</span>
                  <span className="font-bold text-indigo-900">
                    +{result.nextMilestone.neededMarks} marks for {result.nextMilestone.label}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Transfer to Detailed Marksheet Button */}
          {onTransferToDetailed && calcMode === 'marksToPercent' && (
            <button
              type="button"
              onClick={() => onTransferToDetailed(result.obtained, result.max)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm active:scale-98"
            >
              <span>Create Full Marksheet &amp; PDF Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Educational Quick Reference Footnote */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Quick Percentage Guide for Students</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          <strong>Formula:</strong>{' '}
          <code className="px-1 py-0.5 rounded bg-white border border-slate-200 text-indigo-700 font-mono">
            Percentage (%) = (Marks Scored ÷ Full Marks) × 100
          </code>
          . For example, scoring 435 marks out of 500 total marks yields (435 ÷ 500) × 100 = 87.00%.
          For CBSE Class 10 CGPA to Percentage, multiply your CGPA by <strong>9.5</strong>.
        </p>
      </div>
    </div>
  );
}
