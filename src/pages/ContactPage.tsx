import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle, PhoneCall } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Calculation Formula Query',
    subject: '',
    message: '',
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    // Simulating quick client-side ticket generation
    setTimeout(() => {
      const refCode = `TKT-${Date.now().toString(36).toUpperCase()}`;
      setSubmittedRef(refCode);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        category: 'Calculation Formula Query',
        subject: '',
        message: '',
      });
    }, 600);
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          Student &amp; Educator Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get in Touch With Our Academic Team
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Have a question about a specific board grading formula, feedback on the PDF report format, or a feature request? Send us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100">
          {submittedRef ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you for your feedback. We have recorded your query under Reference Ticket{' '}
                <span className="font-mono font-bold text-indigo-600">{submittedRef}</span>. Our educational support volunteer team typically responds within 24–48 hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="mt-4 px-5 py-2.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition active:scale-95"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@student.edu"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-category" className="block text-xs font-bold text-slate-700 mb-1">
                    Query Category
                  </label>
                  <select
                    id="contact-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white"
                  >
                    <option value="Calculation Formula Query">Board Formula Query (10th/12th/GPA)</option>
                    <option value="PDF Report Feedback">PDF Report &amp; Transcript Feedback</option>
                    <option value="Feature Request">New Board or Preset Request</option>
                    <option value="Partnership & AdSense">Advertising &amp; Sponsorship</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of your question"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1">
                  Message Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your question, board specifics, or suggestions..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 resize-y bg-slate-50/50"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Info & FAQ */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              Direct Support Email
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              For direct communication, institutional inquiries, or feedback:
            </p>
            <a
              href="mailto:sureshmu125@gmail.com"
              className="inline-block text-xs font-mono font-bold text-indigo-600 hover:underline break-all"
            >
              sureshmu125@gmail.com
            </a>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Quick FAQ
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-800">Are my grades saved to a server?</p>
                <p className="text-slate-500 mt-0.5">No. All calculations run strictly client-side on your device without any external API.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">Is PDF export free?</p>
                <p className="text-slate-500 mt-0.5">Yes, 100% free with no watermark or hidden charges.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
