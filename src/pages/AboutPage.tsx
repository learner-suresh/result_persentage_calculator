import React from 'react';
import { ShieldCheck, Cpu, Award, Users, BookCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function AboutPage({ onBackToCalc }: { onBackToCalc: () => void }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <BookCheck className="w-3.5 h-3.5 text-indigo-600" />
          About Our Educational Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Empowering Students with Transparent Marks &amp; GPA Calculation
        </h1>
        <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          A modern, privacy-first academic assessment utility engineered specifically for 10th standard, 12th board candidates, and university degree scholars worldwide.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">100% Zero-API Privacy</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Unlike many online converters, our calculator requires zero backend APIs or cloud databases. Every computation is processed purely in your web browser. Your marks, roll numbers, and personal academic records never touch any remote server.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Instant Real-Time Math</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Calculates your percentage, weighted semester GPA/CGPA, passing division, and subject-level performance metrics instantly as you type. Includes presets for CBSE, ICSE, State Boards, and international GPA systems.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Formal PDF Reports</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generates polished academic performance reports and transcripts complete with institution titles, student credentials, subject-wise breakdown, and verification stamps ready for printing or submission.
          </p>
        </div>
      </div>

      {/* Supported Standards Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Who Can Use This Calculator?
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">10th Standard / Matriculation / Secondary Board Students</h3>
              <p className="text-xs text-slate-500">
                CBSE, ICSE, and State Board Class 10 students can quickly calculate their overall percentage, test the &quot;Best of 5&quot; rule, and determine their CGPA with the official 9.5 multiplier formula.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">12th Standard / Higher Secondary / Intermediate (Science, Commerce, Arts)</h3>
              <p className="text-xs text-slate-500">
                Class 12 candidates can evaluate their aggregate scores across theory and practical assessments, and determine competitive cutoffs for engineering and medical admissions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">Undergraduate &amp; Postgraduate Degree Scholars</h3>
              <p className="text-xs text-slate-500">
                College students across engineering, sciences, commerce, and humanities can enter course credits and letter grades to calculate weighted SGPA and Cumulative CGPA on both 10.0 and 4.0 scales.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Commitment */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 border border-slate-800 shadow-2xl shadow-indigo-900/20">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs tracking-widest uppercase">
          <Sparkles className="w-4 h-4" />
          Accessibility &amp; Universal Access
        </div>
        <h2 className="text-xl font-bold">Engineered for Inclusion and Usability</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          We believe high-quality academic tools should be accessible to all students. This platform is built adhering to WCAG 2.1 AA accessibility standards, featuring high-contrast color palettes, clear font hierarchy, full keyboard navigability, and screen-reader announcements for live calculation updates.
        </p>
        <div>
          <button
            type="button"
            onClick={onBackToCalc}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white transition shadow-md hover:shadow-indigo-600/30 active:scale-95"
          >
            Launch Marks &amp; GPA Calculator &rarr;
          </button>
        </div>
      </div>
    </article>
  );
}
