import React, { useState } from 'react';
import { BookOpen, Calculator, Check, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export function GradingGuidesPage({ onLaunchCalculator }: { onLaunchCalculator: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do you calculate CBSE Class 10 percentage from marks?',
      a: 'To calculate CBSE Class 10 percentage, sum the marks obtained in the five main subjects (English, Mathematics, Science, Social Science, and Language II). Divide this sum by the maximum possible marks (usually 500) and multiply by 100. Formula: (Total Marks Obtained / 500) × 100.',
    },
    {
      q: 'How do I quickly calculate my percentage if I only have total marks?',
      a: 'Use our instant Quick Percentage Generator located right on the calculator dashboard. Simply enter your total obtained marks and the full/maximum marks (e.g. 435 out of 500). It immediately computes your exact percentage (87.00%), letter grade, division, and marks lost without needing to enter each subject individually.',
    },
    {
      q: 'Why does CBSE multiply CGPA by 9.5 to get percentage?',
      a: 'CBSE analyzed student performance over multiple board exam years and observed that the average percentage scored by candidates scoring a 10 Grade Point was approximately 95%. Dividing 95 by 10 gives 9.5. Therefore, CBSE officially prescribed: Approximate Percentage = CGPA × 9.5.',
    },
    {
      q: 'How is ICSE Class 10 &quot;Best of 5&quot; percentage calculated?',
      a: 'For ICSE (Class X), English is a compulsory subject. Out of the remaining 5 subjects/groups (Second Language, HCG, Science, Mathematics, and Group III Elective), students take the scores of their highest four subjects plus English to compute the best-of-5 aggregate percentage out of 500.',
    },
    {
      q: 'How do you calculate 12th Board Engineering cutoff out of 200?',
      a: 'In many state engineering admissions (such as Tamil Nadu TNEA, etc.), the cutoff out of 200 is computed as: Cutoff = Mathematics + (Physics / 2) + (Chemistry / 2). For example, if you scored 90 in Maths, 80 in Physics, and 86 in Chemistry: Cutoff = 90 + 40 + 43 = 173 / 200.',
    },
    {
      q: 'What is the difference between SGPA, CGPA, and GPA?',
      a: 'SGPA (Semester Grade Point Average) is the credit-weighted average for a single semester: Sum(Credits × Grade Point) / Sum(Credits). CGPA (Cumulative Grade Point Average) is the cumulative average across all semesters completed to date. GPA is a general term, commonly used on a 4.0 scale in North America and 10.0 scale in India, Europe, and Asia.',
    },
    {
      q: 'How does this website protect student data?',
      a: 'This website operates 100% client-side in your web browser. No marksheets, student names, or grades are sent to any API or stored on any server. You can even use this calculator completely offline once loaded.',
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          Educational Guidelines &amp; Board Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How to Calculate Marks, Percentage &amp; GPA
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          Official formulas and grading scales for CBSE, ICSE, State Boards, and University Degree examinations.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: 10th CBSE */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              Class 10th Formula
            </span>
            <span className="text-xs text-slate-400">CBSE &amp; State Boards</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">CBSE 10th Percentage &amp; CGPA</h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong>Overall Percentage:</strong>
            </p>
            <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-indigo-700 border border-slate-200">
              Percentage (%) = (Sum of Marks in 5 Core Subjects / 500) × 100
            </div>
            <p>
              <strong>CGPA to Percentage Conversion:</strong>
            </p>
            <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-indigo-700 border border-slate-200">
              Percentage (%) = CGPA × 9.5
            </div>
            <p className="text-[11px] text-slate-500">
              Example: A CGPA of 9.2 yields: 9.2 × 9.5 = <strong>87.4%</strong>.
            </p>
          </div>
        </section>

        {/* Card 2: 12th Cutoff */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-purple-50 text-purple-700 border border-purple-100">
              Class 12th Cutoff
            </span>
            <span className="text-xs text-slate-400">Engineering &amp; Science</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Engineering PCM Cutoff (Out of 200)</h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong>Standard Formula:</strong>
            </p>
            <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-purple-700 border border-slate-200">
              Cutoff = Mathematics + (Physics ÷ 2) + (Chemistry ÷ 2)
            </div>
            <p className="text-[11px] text-slate-500">
              Where Maths is evaluated out of 100, Physics out of 100 (50 marks weight), and Chemistry out of 100 (50 marks weight). Total = 200 marks.
            </p>
          </div>
        </section>

        {/* Card 3: College SGPA */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
              University Degree
            </span>
            <span className="text-xs text-slate-400">Semester SGPA / CGPA</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Weighted SGPA Calculation</h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong>Weighted Credit Formula:</strong>
            </p>
            <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-emerald-700 border border-slate-200">
              SGPA = ∑ (Course Credits × Grade Points) / ∑ (Total Credits)
            </div>
            <p className="text-[11px] text-slate-500">
              Courses with higher credit weights (e.g. 4 credits) have a proportionally greater impact on your cumulative grade point average.
            </p>
          </div>
        </section>

        {/* Card 4: Division Criteria */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-100">
              Academic Divisions
            </span>
            <span className="text-xs text-slate-400">Award Criteria</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Passing Classifications</h2>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span className="font-semibold text-indigo-700">First Class with Distinction:</span>
              <span>≥ 75.0%</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span className="font-semibold text-indigo-600">First Class (Division 1):</span>
              <span>60.0% – 74.9%</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1">
              <span className="font-semibold text-teal-700">Second Class (Division 2):</span>
              <span>50.0% – 59.9%</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-emerald-700">Third Class / Pass:</span>
              <span>33.0% – 49.9%</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Grade Conversion Matrix Table */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Universal Grade &amp; Point Conversion Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 border border-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-2.5 border-b border-r border-slate-200">Percentage Range (%)</th>
                <th className="px-4 py-2.5 border-b border-r border-slate-200">Letter Grade</th>
                <th className="px-4 py-2.5 border-b border-r border-slate-200">10-Point Scale (CGPA)</th>
                <th className="px-4 py-2.5 border-b border-r border-slate-200">4-Point Scale (US GPA)</th>
                <th className="px-4 py-2.5 border-b border-slate-200">Academic Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-2 font-semibold text-slate-900 border-r border-slate-200">91 – 100</td>
                <td className="px-4 py-2 font-bold text-indigo-700 border-r border-slate-200">O / A1</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">10.0</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">4.0</td>
                <td className="px-4 py-2 text-emerald-700 font-medium">Outstanding</td>
              </tr>
              <tr className="bg-slate-50/60">
                <td className="px-4 py-2 font-semibold text-slate-900 border-r border-slate-200">81 – 90</td>
                <td className="px-4 py-2 font-bold text-indigo-600 border-r border-slate-200">A+ / A2</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">9.0</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">3.7</td>
                <td className="px-4 py-2 text-emerald-700 font-medium">Excellent</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-slate-900 border-r border-slate-200">71 – 80</td>
                <td className="px-4 py-2 font-bold text-teal-700 border-r border-slate-200">A / B1</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">8.0</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">3.3</td>
                <td className="px-4 py-2 text-blue-700 font-medium">Very Good</td>
              </tr>
              <tr className="bg-slate-50/60">
                <td className="px-4 py-2 font-semibold text-slate-900 border-r border-slate-200">61 – 70</td>
                <td className="px-4 py-2 font-bold text-slate-700 border-r border-slate-200">B+ / B2</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">7.0</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">3.0</td>
                <td className="px-4 py-2 text-slate-700 font-medium">Good</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-slate-900 border-r border-slate-200">51 – 60</td>
                <td className="px-4 py-2 font-bold text-amber-700 border-r border-slate-200">B / C1</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">6.0</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">2.5</td>
                <td className="px-4 py-2 text-amber-700 font-medium">Above Average</td>
              </tr>
              <tr className="bg-slate-50/60">
                <td className="px-4 py-2 font-semibold text-slate-900 border-r border-slate-200">41 – 50</td>
                <td className="px-4 py-2 font-bold text-amber-700 border-r border-slate-200">C / C2</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">5.0</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">2.0</td>
                <td className="px-4 py-2 text-amber-700 font-medium">Average</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-slate-900 border-r border-slate-200">33 – 40</td>
                <td className="px-4 py-2 font-bold text-slate-700 border-r border-slate-200">P / D</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">4.0</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">1.0</td>
                <td className="px-4 py-2 text-slate-600 font-medium">Pass</td>
              </tr>
              <tr className="bg-rose-50/50">
                <td className="px-4 py-2 font-semibold text-rose-900 border-r border-slate-200">Below 33</td>
                <td className="px-4 py-2 font-bold text-rose-700 border-r border-slate-200">F / E</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">0.0</td>
                <td className="px-4 py-2 font-mono border-r border-slate-200">0.0</td>
                <td className="px-4 py-2 text-rose-700 font-medium">Essential Repeat / Fail</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SEO Frequently Asked Questions Accordion */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions by Students
          </h2>
        </div>

        <div className="space-y-3 divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="pt-3 first:pt-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left py-2 focus:outline-hidden group"
                >
                  <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-1 pb-2 text-xs text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action to Launch Calculator */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onLaunchCalculator}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-indigo-600/30 active:scale-95"
        >
          <span>Calculate Your Marks &amp; Export PDF Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
