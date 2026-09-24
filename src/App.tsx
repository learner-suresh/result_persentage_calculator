/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { GradingGuidesPage } from './pages/GradingGuidesPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ContactPage } from './pages/ContactPage';

import { TermsOfServicePage } from './pages/TermsOfServicePage';

type TabType = 'calculator' | 'guides' | 'about' | 'privacy' | 'contact' | 'terms';

function getTabFromPath(path: string): TabType {
  const cleanPath = path.toLowerCase().replace(/\/+$/, '');
  if (cleanPath === '/grading-guides' || cleanPath === '/guides') return 'guides';
  if (cleanPath === '/about') return 'about';
  if (cleanPath === '/privacy') return 'privacy';
  if (cleanPath === '/contact') return 'contact';
  if (cleanPath === '/terms' || cleanPath === '/disclaimer') return 'terms';
  return 'calculator';
}

function getPathFromTab(tab: TabType): string {
  switch (tab) {
    case 'guides': return '/grading-guides';
    case 'about': return '/about';
    case 'privacy': return '/privacy';
    case 'contact': return '/contact';
    case 'terms': return '/terms';
    default: return '/';
  }
}

export default function App() {
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'calculator';
  });

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const newPath = getPathFromTab(tab);
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  };

  // Sync on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync document title, meta description, canonical link, and social tags dynamically based on tab
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smartmarkscalculator.netlify.app';
    const canonicalUrl = `${origin}${getPathFromTab(activeTab)}`;

    // 1. Update Canonical Link tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);

    // 2. Update OG and Twitter URL tags
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
    const twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl) twUrl.setAttribute('content', canonicalUrl);

    let title = 'Percentage Calculator - Marks Calculator & Exam Marks to % Online';
    let description = 'Free online Percentage Calculator and Marks Calculator. Easily calculate marks to percentage for 10th, 12th board exams, semester tests & CGPA. Includes passing division, formula guides, and instant PDF report download.';

    switch (activeTab) {
      case 'calculator':
        title = 'Percentage Calculator - Marks Calculator & Exam Marks to % Online';
        description = 'Free online Percentage Calculator and Marks Calculator. Easily calculate marks to percentage for 10th, 12th board exams, semester tests & CGPA. Includes passing division, formula guides, and instant PDF report download.';
        break;
      case 'guides':
        title = 'CBSE 10th, 12th & GPA Grading Formulas - SmartMarks Calculator';
        description = 'Comprehensive grading formulas and board guidelines for CBSE 10th, 12th PCM/PCB cutoffs, ICSE best-of-5 rule, and CGPA to percentage multipliers.';
        break;
      case 'about':
        title = 'About SmartMarks Calculator - Zero-API Student Privacy';
        description = 'Learn about SmartMarks Calculator, our zero-server privacy architecture, and our mission to provide fast, reliable academic calculation tools for students.';
        break;
      case 'privacy':
        title = 'Privacy Policy & Student Data Protection - SmartMarks Calculator';
        description = 'Our strict zero-server student data protection policy. All exam marks, roll numbers, and PDF reports are processed 100% locally in your browser.';
        break;
      case 'contact':
        title = 'Contact Support & Feedback - SmartMarks Calculator';
        description = 'Get in touch with the SmartMarks Calculator team for mathematical formula inquiries, bug reports, and academic calculation feedback.';
        break;
      case 'terms':
        title = 'Terms of Service & Academic Disclaimer - SmartMarks Calculator';
        description = 'Terms of Service, acceptable use policy, and educational disclaimer for SmartMarks Percentage Calculator.';
        break;
    }

    document.title = title;

    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', description);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
  }, [activeTab]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Skip to Content Accessibility Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg shadow-md"
      >
        Skip to main content
      </a>

      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Area */}
      <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
        {activeTab === 'calculator' && <Dashboard />}
        {activeTab === 'guides' && (
          <GradingGuidesPage onLaunchCalculator={() => setActiveTab('calculator')} />
        )}
        {activeTab === 'about' && (
          <AboutPage onBackToCalc={() => setActiveTab('calculator')} />
        )}
        {activeTab === 'privacy' && <PrivacyPolicyPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'terms' && (
          <TermsOfServicePage onBackToCalc={() => setActiveTab('calculator')} />
        )}
      </main>

      {/* Site Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

