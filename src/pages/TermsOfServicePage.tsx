import React from 'react';
import { Scale, FileCheck, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export function TermsOfServicePage({ onBackToCalc }: { onBackToCalc: () => void }) {
  const effectiveDate = 'January 1, 2025';
  const updatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Scale className="w-3.5 h-3.5 text-indigo-600" />
          Terms of Use &amp; Academic Disclaimer
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms of Service &amp; Educational Disclaimer
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: {effectiveDate} &bull; Last Updated: {updatedDate}
        </p>
      </div>

      {/* Summary Highlight Box */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-3">
        <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          Academic &amp; Legal Notice
        </h2>
        <p className="text-xs text-amber-900/90 leading-relaxed">
          SmartMarks Calculator is an independent, free educational utility designed for computational assistance and personal academic assessment. We are not officially affiliated with, endorsed by, or representing the Central Board of Secondary Education (CBSE), Council for the Indian School Certificate Examinations (CISCE / ICSE), any State Education Board, or any University. Always cross-reference your marksheet with your official educational institution.
        </p>
      </div>

      {/* Section 1: Acceptance of Terms */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-indigo-600" />
          1. Acceptance of Terms
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          By accessing or using the SmartMarks Percentage Calculator website, services, and online calculation utilities, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
        </p>
      </section>

      {/* Section 2: Educational Purpose Only */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          2. Educational &amp; Informational Purpose
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          All calculation algorithms, formulas (including the CBSE 9.5 multiplier, ICSE best-of-5 guidelines, and GPA conversion indexes), and grade estimation matrices provided on this platform are for informational and planning purposes only. While every effort is made to maintain mathematical accuracy according to published board circulars, official results issued directly by your examination authority take absolute precedence.
        </p>
      </section>

      {/* Section 3: Intellectual Property & Permitted Use */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          3. Permitted Use &amp; PDF Report Generation
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          Users are granted a free, revocable license to access our calculator, evaluate grades, and generate individual PDF marksheet summary transcripts for personal, educational, or classroom use. You agree not to scrape, reverse engineer, or deploy automated bots to overload our infrastructure or republish our materials without written authorization.
        </p>
      </section>

      {/* Section 4: Limitation of Liability */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          4. Limitation of Liability
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          Under no circumstances shall SmartMarks Calculator, its authors, contributors, or maintainers be liable for any academic admissions decisions, scholarship determinations, or financial losses arising from the use of our calculators or reliance on estimated percentages. Users are encouraged to consult their official university registrar or school counselor for authoritative evaluations.
        </p>
      </section>

      {/* Section 5: Governing Law & Contact */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          5. Modifications &amp; Inquiries
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          We reserve the right to revise these Terms of Service at any time without prior notice. Questions regarding these terms may be directed to our academic support team via the Contact page.
        </p>
      </section>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onBackToCalc}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white transition shadow-md hover:shadow-indigo-600/30 active:scale-95 cursor-pointer"
        >
          Return to Percentage Calculator &rarr;
        </button>
      </div>
    </article>
  );
}
