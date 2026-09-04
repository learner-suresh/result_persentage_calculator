import React from 'react';
import { GraduationCap, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'calculator' | 'guides' | 'about' | 'privacy' | 'contact') => void;
}

export function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Student Marks &amp; GPA Calculator
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              A high-precision, zero-API educational portal designed for secondary (10th), higher secondary (12th), and university degree students. Calculate aggregate percentages, SGPA/CGPA, evaluate passing divisions, and download formal PDF performance transcripts directly from your browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-800 bg-indigo-50/80 px-3 py-2 rounded-xl border border-indigo-100 w-fit font-medium">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>100% Private: All calculations happen locally on your device. Zero external API calls.</span>
            </div>
          </div>

          {/* Quick Calculators */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Calculators &amp; Boards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('calculator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition"
                >
                  10th Board Marks to Percentage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('calculator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition"
                >
                  12th Science (PCM/PCB) Aggregate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('calculator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition"
                >
                  12th Commerce &amp; Arts Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('calculator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition"
                >
                  University Semester GPA &amp; CGPA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('guides');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition font-bold text-indigo-600"
                >
                  CBSE 9.5 Formula &amp; Grading Rules &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Trust &amp; Information
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition"
                >
                  About Our Mission
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition"
                >
                  Privacy Policy &amp; GDPR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-600 transition"
                >
                  Contact &amp; Student Support
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Google AdSense Approved Structure
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Student Marks &amp; GPA Calculator. Free educational resource.
          </p>
          <p className="flex items-center gap-1">
            <span>Built with care for students worldwide</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
