import React, { useState, useMemo, useRef } from 'react';
import {
  Calculator,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowDown,
  Percent,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { calculateQuickPercentage } from '../utils/calculator';

interface FirstPlacePercentageCalculatorProps {
  onScrollToDetailed?: () => void;
  onPopulateDetailed?: (obtained: number, max: number) => void;
  className?: string;
}

const COMMON_PRESETS = [100, 500, 600, 700, 800, 1000, 1200];

export function FirstPlacePercentageCalculator({
  onScrollToDetailed,
  onPopulateDetailed,
  className = '',
}: FirstPlacePercentageCalculatorProps) {
  const [scoredInput, setScoredInput] = useState<string>('425');
  const [outOfInput, setOutOfInput] = useState<string>('500');
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showScoredTooltip, setShowScoredTooltip] = useState<boolean>(false);
  const [showOutOfTooltip, setShowOutOfTooltip] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const scoredNum = Math.max(0, parseFloat(scoredInput) || 0);
  const outOfNum = Math.max(1, parseFloat(outOfInput) || 100);

  const result = useMemo(() => {
    return calculateQuickPercentage(scoredNum, outOfNum, 2);
  }, [scoredNum, outOfNum]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleCopy = () => {
    const text = `Scored: ${result.obtained} / ${result.max} marks | Percentage: ${result.formattedPercentage} | Division: ${result.division} | Grade: ${result.grade.letterGrade}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setScoredInput('');
    setOutOfInput('500');
    setHasCalculated(false);
  };

  const handlePreset = (val: number) => {
    setOutOfInput(val.toString());
    if (scoredNum > val) {
      setScoredInput(Math.round(val * 0.85).toString());
    }
    setHasCalculated(true);
  };

  return (
    <section
      id="first-place-percentage-calculator"
      aria-label="Instant Percentage Calculator"
      className={`relative w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-100/90 transition-all ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Instant Calculator
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Quick Percentage Generator</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Marks Percentage Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Free online percentage calculator. Enter your scored marks and total out of marks to calculate your percentage, division, and performance summary instantly.
          </p>
        </div>

        {onScrollToDetailed && (
          <button
            type="button"
            onClick={onScrollToDetailed}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition shrink-0"
          >
            <span>Subject Marksheet</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Interactive Form with Scored, Out of & Calculate Button */}
      <form onSubmit={handleCalculate} className="mt-6 space-y-5">
        <div className="max-w-2xl space-y-4">
          {/* Row 1: Scored Field */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="sm:col-span-3 flex items-center gap-1.5 sm:justify-end">
              <label
                htmlFor="input-scored-marks"
                className="text-sm font-bold text-slate-800 cursor-pointer"
              >
                Scored
              </label>
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowScoredTooltip(!showScoredTooltip)}
                  onMouseEnter={() => setShowScoredTooltip(true)}
                  onMouseLeave={() => setShowScoredTooltip(false)}
                  aria-label="Help about scored marks"
                  className="w-4 h-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black flex items-center justify-center transition leading-none select-none shadow-2xs"
                >
                  ?
                </button>
                {showScoredTooltip && (
                  <div className="absolute z-20 left-0 sm:left-1/2 sm:-translate-x-1/2 top-6 w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl leading-relaxed">
                    Total marks you obtained/scored in your exam or across all papers.
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-9">
              <div className="flex rounded-lg shadow-xs border border-sky-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200 bg-white overflow-hidden transition">
                <input
                  id="input-scored-marks"
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={scoredInput}
                  onChange={(e) => {
                    setScoredInput(e.target.value);
                    setHasCalculated(true);
                  }}
                  placeholder="Enter marks scored"
                  className="w-full px-4 py-2.5 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:outline-hidden"
                />
                <div className="flex items-center justify-center px-4 bg-slate-50 border-l border-sky-200 text-sm font-semibold text-slate-600 select-none">
                  marks
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Out of Field */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="sm:col-span-3 flex items-center gap-1.5 sm:justify-end">
              <label
                htmlFor="input-outof-marks"
                className="text-sm font-bold text-slate-800 cursor-pointer"
              >
                Out of
              </label>
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowOutOfTooltip(!showOutOfTooltip)}
                  onMouseEnter={() => setShowOutOfTooltip(true)}
                  onMouseLeave={() => setShowOutOfTooltip(false)}
                  aria-label="Help about maximum marks"
                  className="w-4 h-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black flex items-center justify-center transition leading-none select-none shadow-2xs"
                >
                  ?
                </button>
                {showOutOfTooltip && (
                  <div className="absolute z-20 left-0 sm:left-1/2 sm:-translate-x-1/2 top-6 w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl leading-relaxed">
                    Maximum possible total marks for this examination (e.g. 500, 600, 100).
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-9 space-y-1.5">
              <div className="flex rounded-lg shadow-xs border border-sky-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200 bg-white overflow-hidden transition">
                <input
                  id="input-outof-marks"
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={outOfInput}
                  onChange={(e) => {
                    setOutOfInput(e.target.value);
                    setHasCalculated(true);
                  }}
                  placeholder="Enter total marks"
                  className="w-full px-4 py-2.5 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:outline-hidden"
                />
                <div className="flex items-center justify-center px-4 bg-slate-50 border-l border-sky-200 text-sm font-semibold text-slate-600 select-none">
                  marks
                </div>
              </div>

              {/* Common Board Total Chips */}
              <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-semibold mr-1 shrink-0 text-[10px] uppercase tracking-wider">
                  Presets:
                </span>
                {COMMON_PRESETS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePreset(val)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition border shrink-0 ${
                      outOfNum === val
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 hover:bg-indigo-50 text-slate-600 border-slate-200/70'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Large Prominent Calculate Button matching screenshot design */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            id="btn-calculate-percentage-main"
            className="w-full sm:w-auto min-w-[300px] flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-bold text-white bg-[#c25e00] hover:bg-[#a84f00] active:scale-98 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate Percentage</span>
          </button>

          {scoredInput && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </form>

      {/* Calculated Result Display */}
      {hasCalculated && (
        <div
          ref={resultRef}
          className="mt-8 pt-6 border-t border-slate-100 space-y-5 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-600" />
              Result Overview
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Result</span>
                </>
              )}
            </button>
          </div>

          {/* Cards Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Primary Hero Score Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-amber-50/50 via-white to-slate-50 p-6 rounded-2xl border border-amber-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Percentage Obtained
                </span>
                <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono mt-1">
                  {result.formattedPercentage}
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Scored <strong className="text-slate-900">{result.obtained}</strong> out of{' '}
                  <strong className="text-slate-900">{result.max}</strong> total marks.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="pt-4 space-y-1.5">
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      result.percentage >= 75
                        ? 'bg-emerald-500'
                        : result.percentage >= 60
                        ? 'bg-indigo-600'
                        : result.percentage >= 50
                        ? 'bg-teal-500'
                        : result.percentage >= 33
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, result.percentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>0%</span>
                  <span>Pass 33%</span>
                  <span>1st Div 60%</span>
                  <span>Distinction 75%+</span>
                </div>
              </div>
            </div>

            {/* Academic Division & Conversion Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Division Standing */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Division Standing
                  </span>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                    {result.division}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 mt-2">
                  {result.percentage >= 33 ? 'Passed Successfully' : 'Below Passing Criteria'}
                </span>
              </div>

              {/* Letter Grade */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Letter Grade
                  </span>
                  <div className="text-sm sm:text-base font-extrabold text-indigo-700 mt-1">
                    {result.grade.letterGrade}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 mt-2">
                  {result.grade.remark}
                </span>
              </div>

              {/* GPA Equivalents */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  GPA Equivalents
                </span>
                <div className="text-sm font-bold text-slate-800 mt-1">
                  10.0 Scale: <span className="font-mono text-indigo-600 font-bold">{result.gpa10}</span>
                </div>
                <div className="text-xs text-slate-500">
                  4.0 Scale: <span className="font-mono font-bold text-slate-700">{result.gpa4}</span>
                </div>
              </div>

              {/* Mathematical Formula */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
                  Formula Applied
                </span>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  ({result.obtained} ÷ {result.max}) × 100
                </div>
                <div className="text-[11px] text-amber-700 font-bold mt-0.5">
                  = {result.formattedPercentage}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Bridge to Subject Marksheet */}
          {onPopulateDetailed && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="text-slate-700">
                <strong className="text-slate-900">Need a full subject-by-subject marksheet or formal PDF report?</strong>{' '}
                Populate your scores into the detailed multi-subject marksheet below.
              </div>
              <button
                type="button"
                onClick={() => onPopulateDetailed(result.obtained, result.max)}
                className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition active:scale-95 cursor-pointer"
              >
                Populate Marksheet Below &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
