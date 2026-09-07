import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  HelpCircle,
  ChevronDown,
  Award,
  CheckCircle2,
  FileText,
  Percent,
  Layers,
  GraduationCap,
  Sliders,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: 'How do I calculate percentage from scored marks?',
    answer:
      'To calculate your marks percentage, divide your total scored (obtained) marks by the total maximum possible marks, then multiply the result by 100. Formula: Percentage (%) = (Scored Marks ÷ Total Marks) × 100. For example, if you scored 435 out of 500: (435 ÷ 500) × 100 = 87.0%.',
  },
  {
    question: 'What is the formula to calculate 10th board exam percentage?',
    answer:
      'For 10th board exams (CBSE, ICSE, or State Boards), sum the marks obtained across all compulsory subjects and divide by the total maximum marks of those subjects. If your board considers the "Best of 5" rule, sum the top 5 highest-scoring academic subjects (500 marks total) and divide by 5.',
  },
  {
    question: 'How do I calculate 12th standard marks percentage for Science, Commerce, and Arts?',
    answer:
      'To calculate 12th percentage, add your marks across all 5 core subjects (typically 100 marks each for a total of 500). Divide the total scored marks by 500 and multiply by 100. For engineering and medical college cutoffs, calculate the PCM (Physics, Chemistry, Maths) or PCB aggregate percentage by summing marks scored in those 3 subjects and dividing by 300.',
  },
  {
    question: 'What percentage is required for 1st Division, 2nd Division, and 3rd Division?',
    answer:
      'Under standard academic board guidelines: Distinction / Honors is awarded for 75% and above; First Division (1st Div) is awarded for 60.0% to 74.99%; Second Division (2nd Div) is awarded for 45.0% to 59.99%; Third Division (3rd Div) is awarded for 33.0% to 44.99%. Less than 33% is considered below the standard passing cutoff.',
  },
  {
    question: 'How do I convert CGPA into percentage?',
    answer:
      'For CBSE 10th and 12th standards, multiply your Cumulative Grade Point Average (CGPA) by 9.5. Formula: Percentage (%) = CGPA × 9.5. For example, a CGPA of 8.6 equals 8.6 × 9.5 = 81.7%. For universities using a 10-point scale or international 4.0 scale, multiply GPA by 25 or follow your university specific conversion table.',
  },
  {
    question: 'Can I set a custom subject pass threshold percentage?',
    answer:
      'Yes. SmartMarks Calculator allows you to set any custom passing percentage (such as 33% for CBSE/ICSE, 35% for State boards, or 40%–50% for college degrees) directly using an input box or slider. The calculator dynamically identifies passed, failed, and compartment subjects based on your chosen threshold.',
  },
  {
    question: 'Can I download an official PDF marksheet report of my calculation?',
    answer:
      'Yes! After entering your marks, click the "Download PDF Performance Report" button. The calculator generates an official, print-ready PDF transcript complete with student details, roll number, subject-wise breakdown, percentage, division, and an official verification seal directly in your browser without any server upload.',
  },
  {
    question: 'Are my exam marks and personal details stored on any server?',
    answer:
      'No. SmartMarks Calculator operates 100% locally on your browser. No personal data, roll numbers, or academic marks are transmitted to or stored on external cloud databases, ensuring complete student privacy.',
  },
];

export function PercentageCalculatorSeoContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeMatrixTab, setActiveMatrixTab] = useState<'500' | '600'>('500');

  const matrix500 = [
    { score: 475, pct: '95.0%', div: 'Distinction / Honors', grade: 'A+' },
    { score: 450, pct: '90.0%', div: 'Distinction / Honors', grade: 'A+' },
    { score: 425, pct: '85.0%', div: 'Distinction / Honors', grade: 'A' },
    { score: 400, pct: '80.0%', div: 'Distinction / Honors', grade: 'A' },
    { score: 375, pct: '75.0%', div: 'Distinction / Honors', grade: 'B+' },
    { score: 350, pct: '70.0%', div: 'First Division (1st Div)', grade: 'B' },
    { score: 300, pct: '60.0%', div: 'First Division (1st Div)', grade: 'B' },
    { score: 250, pct: '50.0%', div: 'Second Division (2nd Div)', grade: 'C' },
    { score: 225, pct: '45.0%', div: 'Second Division (2nd Div)', grade: 'C' },
    { score: 165, pct: '33.0%', div: 'Third Division (3rd Div)', grade: 'D' },
  ];

  const matrix600 = [
    { score: 570, pct: '95.0%', div: 'Distinction / Honors', grade: 'A+' },
    { score: 540, pct: '90.0%', div: 'Distinction / Honors', grade: 'A+' },
    { score: 510, pct: '85.0%', div: 'Distinction / Honors', grade: 'A' },
    { score: 480, pct: '80.0%', div: 'Distinction / Honors', grade: 'A' },
    { score: 450, pct: '75.0%', div: 'Distinction / Honors', grade: 'B+' },
    { score: 420, pct: '70.0%', div: 'First Division (1st Div)', grade: 'B' },
    { score: 360, pct: '60.0%', div: 'First Division (1st Div)', grade: 'B' },
    { score: 300, pct: '50.0%', div: 'Second Division (2nd Div)', grade: 'C' },
    { score: 270, pct: '45.0%', div: 'Second Division (2nd Div)', grade: 'C' },
    { score: 210, pct: '35.0%', div: 'Third Division (3rd Div - State)', grade: 'D' },
  ];

  return (
    <section
      aria-label="Percentage Calculation Educational Guide and FAQs"
      className="mt-12 space-y-10 border-t border-slate-200 pt-10"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          Complete Educational Guide
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          How to Calculate Marks to Percentage (Formula &amp; Examples)
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Everything students, parents, and educators need to know about calculating percentage with our online <strong>percentage calculator</strong> and <strong>marks calculator</strong> for board exams, semester tests, and college GPA.
        </p>
      </div>

      {/* Grid: Formula & Step-by-step Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Mathematical Formula */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-100 space-y-4">
          <div className="flex items-center gap-2.5 text-indigo-600">
            <Calculator className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900">Standard Marks Percentage Formula</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The percentage represents the fraction of total marks secured expressed as a proportion out of 100.
          </p>

          <div className="bg-slate-900 text-white rounded-xl p-4 text-center space-y-2">
            <div className="text-[11px] uppercase tracking-widest text-indigo-300 font-bold">
              Core Percentage Calculator Formula
            </div>
            <div className="text-sm sm:text-base font-mono font-bold text-amber-300 py-1">
              Percentage (%) = (Marks Obtained &divide; Total Maximum Marks) &times; 100
            </div>
            <div className="text-[11px] text-slate-400">
              Where Total Marks = Sum of maximum marks for all evaluated subjects
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Marks Scored (Obtained):</strong> Total raw score earned across all exams/papers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Total Maximum Marks:</strong> Benchmark total possible marks (e.g., 500 for 5 subjects of 100 each).</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Practical Step-by-Step Example */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-100 space-y-4">
          <div className="flex items-center gap-2.5 text-indigo-600">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900">Step-by-Step Practical Example</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Suppose a student appears for 5 board papers (English, Mathematics, Science, Social Science, Hindi) with 100 marks per paper:
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Marks Scored:</span>
              <span className="font-bold text-slate-900">85 + 92 + 88 + 78 + 87 = 430</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Total Out of Marks:</span>
              <span className="font-bold text-slate-900">100 &times; 5 = 500 Marks</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Calculation:</span>
              <span className="font-bold font-mono text-indigo-700">(430 &divide; 500) &times; 100</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold pt-1">
              <span>Final Percentage &amp; Division:</span>
              <span className="text-sm">86.0% (1st Division with Distinction)</span>
            </div>
          </div>

          <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>You can calculate this in 1 second using our instant marks calculator at the top of this page!</span>
          </div>
        </div>
      </div>

      {/* Popular Search Reference Matrix: Out of 500 and Out of 600 */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Percent className="w-4 h-4" />
              <span>Quick Lookup Tables</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1">
              Marks to Percentage Quick Reference Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Common scores for 5-subject (500 marks) and 6-subject (600 marks) board exams.
            </p>
          </div>

          {/* Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMatrixTab('500')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                activeMatrixTab === '500'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Out of 500 (5 Subjects)
            </button>
            <button
              type="button"
              onClick={() => setActiveMatrixTab('600')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                activeMatrixTab === '600'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Out of 600 (6 Subjects)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-4 font-bold">Marks Scored</th>
                <th className="py-2.5 px-4 font-bold">Total Marks</th>
                <th className="py-2.5 px-4 font-bold">Calculated Percentage</th>
                <th className="py-2.5 px-4 font-bold">Division Awarded</th>
                <th className="py-2.5 px-4 font-bold">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(activeMatrixTab === '500' ? matrix500 : matrix600).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{row.score}</td>
                  <td className="py-2.5 px-4 text-slate-500">{activeMatrixTab}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">{row.pct}</td>
                  <td className="py-2.5 px-4 text-slate-800">{row.div}</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-700">{row.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Board & University Standards: 10th, 12th, and CGPA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-100 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">10th Board Percentage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Most national boards (CBSE &amp; ICSE) calculate aggregate based on 5 subjects. If an additional 6th skill subject is taken, the Best-of-5 rule replaces the lowest-scoring non-language subject.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-100 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">12th Stream Cutoffs</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            For Science (PCM / PCB), Arts, and Commerce, entrance exams (JEE, NEET, CUET) require minimum stream aggregate percentages calculated out of 300 or 500 marks.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-100 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">CGPA to % Conversion</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard CBSE formula is <strong>Percentage (%) = CGPA &times; 9.5</strong>. For college 10-point GPA or 4.0 GPA scales, follow your university conversion index directly supported in our tool.
          </p>
        </div>
      </div>

      {/* Division & Performance Grading Standards Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Academic Passing Division Classification Reference</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          National educational boards and state universities use standardized percentage ranges to determine academic honors and eligibility:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-4 font-bold">Percentage Range</th>
                <th className="py-2.5 px-4 font-bold">Division / Grade Status</th>
                <th className="py-2.5 px-4 font-bold">Academic Performance</th>
                <th className="py-2.5 px-4 font-bold">College Admission Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">&ge; 75.0%</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">Distinction / Honors</td>
                <td className="py-2.5 px-4 text-emerald-600 font-semibold">Outstanding</td>
                <td className="py-2.5 px-4 text-slate-600">Eligible for top engineering, medical &amp; honors programs</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">60.0% &ndash; 74.99%</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">First Division (1st Div)</td>
                <td className="py-2.5 px-4 text-indigo-600 font-semibold">Very Good</td>
                <td className="py-2.5 px-4 text-slate-600">Qualifies for competitive university degree courses</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-4 font-mono font-bold text-blue-700">45.0% &ndash; 59.99%</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">Second Division (2nd Div)</td>
                <td className="py-2.5 px-4 text-blue-600 font-semibold">Good / Average</td>
                <td className="py-2.5 px-4 text-slate-600">Meets standard admission cutoff for general streams</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 px-4 font-mono font-bold text-amber-700">33.0% &ndash; 44.99%</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">Third Division (3rd Div)</td>
                <td className="py-2.5 px-4 text-amber-600 font-semibold">Satisfactory / Pass</td>
                <td className="py-2.5 px-4 text-slate-600">Satisfies secondary pass certificate requirements</td>
              </tr>
              <tr className="hover:bg-slate-50/80 bg-rose-50/30">
                <td className="py-2.5 px-4 font-mono font-bold text-rose-700">&lt; 33.0%</td>
                <td className="py-2.5 px-4 font-bold text-rose-800">Essential Repeat / Compartment</td>
                <td className="py-2.5 px-4 text-rose-600 font-semibold">Needs Improvement</td>
                <td className="py-2.5 px-4 text-slate-600">Must appear for improvement or supplementary exams</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion (Matches JSON-LD FAQPage Schema) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Search FAQs &amp; Help</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions About Percentage &amp; Marks Calculation
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Quick answers to common questions about calculating marks percentage, board rules, and grading conversions.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-100/80 transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

