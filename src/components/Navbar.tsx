import React, { useState } from 'react';
import {
  GraduationCap,
  Calculator,
  BookOpen,
  Info,
  ShieldCheck,
  Mail,
  Menu,
  X,
  FileDown,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'calculator' | 'guides' | 'about' | 'privacy' | 'contact';
  setActiveTab: (tab: 'calculator' | 'guides' | 'about' | 'privacy' | 'contact') => void;
  onExportPdf?: () => void;
}

export function Navbar({ activeTab, setActiveTab, onExportPdf }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'calculator', label: 'Marks & GPA', icon: Calculator },
    { id: 'guides', label: 'Grading Guides & SEO', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'contact', label: 'Contact', icon: Mail },
  ] as const;

  const handleNav = (id: 'calculator' | 'guides' | 'about' | 'privacy' | 'contact') => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('calculator')}
          className="flex items-center gap-3 text-left focus:outline-hidden group"
          aria-label="Student Marks and GPA Calculator Home"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs transition group-hover:bg-indigo-700 select-none">
            Σ
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-bold tracking-tight text-slate-800 underline decoration-indigo-500 decoration-2 underline-offset-4 leading-tight">
              SmartMarks Calculator
            </span>
            <span className="block text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-tight">
              10th • 12th • College • Reports
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-1.5 py-1 text-sm font-medium transition ${
                  isActive
                    ? 'font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-1'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {onExportPdf && activeTab === 'calculator' && (
            <button
              type="button"
              onClick={onExportPdf}
              className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              title="Download academic performance report in PDF"
            >
              <FileDown className="w-4 h-4 text-indigo-200" />
              <span>Export PDF</span>
            </button>
          )}

          {/* Mobile menu hamburger button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {onExportPdf && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onExportPdf();
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
              >
                <FileDown className="w-4 h-4 text-indigo-200" />
                <span>Download PDF Report</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
