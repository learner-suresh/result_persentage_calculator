import React from 'react';
import { ShieldCheck, Lock, EyeOff, Cookie, FileText, CheckCircle2 } from 'lucide-react';

export function PrivacyPolicyPage() {
  const effectiveDate = 'January 1, 2025';
  const updatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          Strict Zero-Server Data Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy Policy &amp; Student Data Protection
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: {effectiveDate} • Last Updated: {updatedDate}
        </p>
      </div>

      {/* Summary Highlight Box */}
      <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-3">
        <h2 className="text-base font-bold text-indigo-950 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          Core Student Privacy Summary
        </h2>
        <ul className="space-y-2.5 text-xs text-indigo-900/80">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>No External API Transmissions:</strong> All marks, subject names, student identities, roll numbers, and grades you input remain entirely on your local browser. No data is ever transmitted to or stored on external servers.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>Client-Side PDF Generation:</strong> PDF reports and transcripts are compiled locally on your device via JavaScript. No PDF document is uploaded to the cloud.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>Optional Local Storage:</strong> Saved marksheet history is stored solely in your web browser&apos;s HTML5 LocalStorage, controllable and wipeable by you at any time.</span>
          </li>
        </ul>
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-indigo-600" />
          1. Information We Do Not Collect
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          Student Marks &amp; GPA Calculator is fundamentally architected as a serverless, client-side utility. We do not require account registration, login credentials, phone numbers, or credit card numbers. When using our calculators, the subject scores, student roll numbers, and institutional affiliations you enter are processed strictly within your device&apos;s memory.
        </p>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Cookie className="w-4 h-4 text-indigo-600" />
          2. Cookies &amp; Third-Party Advertising (Google AdSense)
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          To keep this educational portal 100% free for students and schools worldwide, we utilize advertising partners including Google AdSense. 
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-500">
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
          </li>
          <li>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
          </li>
          <li>
            Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold hover:text-indigo-700">Google Ads Settings</a> or through the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold hover:text-indigo-700">aboutads.info choices portal</a>.
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          3. LocalStorage &amp; Data Erasure
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          If you use the &quot;Save to History&quot; feature, your report card snapshots are stored inside your browser&apos;s LocalStorage. This data is not synchronized with any cloud database. You can permanently erase this data at any point by clicking &quot;Clear All Saved History&quot; within the dashboard or clearing your browser cache.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          4. Children&apos;s Online Privacy Protection (COPPA &amp; GDPR)
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          Because our tools perform mathematical computations locally without collecting, storing, or transmitting personal student data, our platform complies with the Children&apos;s Online Privacy Protection Act (COPPA) and the General Data Protection Regulation (GDPR). We never collect personal records from children under the age of 13.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">5. Contact &amp; Inquiries</h2>
        <p className="text-slate-600 text-xs sm:text-sm">
          If you have any questions or concerns regarding our privacy standards or data protection practices, please reach out via our contact page.
        </p>
      </section>
    </article>
  );
}
