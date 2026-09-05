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

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'guides' | 'about' | 'privacy' | 'contact'>('calculator');

  // Sync document title and meta description dynamically based on tab
  useEffect(() => {
    switch (activeTab) {
      case 'calculator':
        document.title = 'Marks Percentage Calculator - SmartMarks | Calculate Marks to Percentage Online';
        break;
      case 'guides':
        document.title = 'CBSE 10th, 12th & GPA Grading Formulas - SmartMarks Calculator';
        break;
      case 'about':
        document.title = 'About SmartMarks Calculator - Zero-API Student Privacy';
        break;
      case 'privacy':
        document.title = 'Privacy Policy & Student Data Protection - SmartMarks Calculator';
        break;
      case 'contact':
        document.title = 'Contact Support & Feedback - SmartMarks Calculator';
        break;
    }
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
      </main>

      {/* Site Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

