import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Navbar } from '../src/components/Navbar';
import { Footer } from '../src/components/Footer';
import { GradingGuidesPage } from '../src/pages/GradingGuidesPage';
import { AboutPage } from '../src/pages/AboutPage';
import { PrivacyPolicyPage } from '../src/pages/PrivacyPolicyPage';
import { ContactPage } from '../src/pages/ContactPage';
import { TermsOfServicePage } from '../src/pages/TermsOfServicePage';

interface RouteConfig {
  slug: string; // e.g. 'terms' or ''
  canonicalUrl: string;
  title: string;
  description: string;
  tab: 'calculator' | 'guides' | 'about' | 'privacy' | 'contact' | 'terms';
  breadcrumbName?: string;
  component?: React.ReactNode;
}

const BASE_URL = 'https://smartmarkscalculator.netlify.app';

const routes: RouteConfig[] = [
  {
    slug: '',
    canonicalUrl: `${BASE_URL}/`,
    title: 'Percentage Calculator - Marks Calculator & Exam Marks to % Online',
    description: 'Free online Percentage Calculator and Marks Calculator. Easily calculate marks to percentage for 10th, 12th board exams, semester tests & CGPA. Includes passing division, formula guides, and instant PDF report download.',
    tab: 'calculator',
  },
  {
    slug: 'grading-guides',
    canonicalUrl: `${BASE_URL}/grading-guides`,
    title: 'CBSE 10th, 12th & GPA Grading Formulas - SmartMarks Calculator',
    description: 'Comprehensive grading formulas and board guidelines for CBSE 10th, 12th PCM/PCB cutoffs, ICSE best-of-5 rule, and CGPA to percentage multipliers.',
    tab: 'guides',
    breadcrumbName: 'Grading Formulas & Guides',
    component: <GradingGuidesPage onLaunchCalculator={() => {}} />,
  },
  {
    slug: 'about',
    canonicalUrl: `${BASE_URL}/about`,
    title: 'About SmartMarks Calculator - Zero-API Student Privacy',
    description: 'Learn about SmartMarks Calculator, our zero-server privacy architecture, and our mission to provide fast, reliable academic calculation tools for students.',
    tab: 'about',
    breadcrumbName: 'About Us',
    component: <AboutPage onBackToCalc={() => {}} />,
  },
  {
    slug: 'privacy',
    canonicalUrl: `${BASE_URL}/privacy`,
    title: 'Privacy Policy & Student Data Protection - SmartMarks Calculator',
    description: 'Our strict zero-server student data protection policy. All exam marks, roll numbers, and PDF reports are processed 100% locally in your browser.',
    tab: 'privacy',
    breadcrumbName: 'Privacy Policy',
    component: <PrivacyPolicyPage />,
  },
  {
    slug: 'contact',
    canonicalUrl: `${BASE_URL}/contact`,
    title: 'Contact Support & Feedback - SmartMarks Calculator',
    description: 'Get in touch with the SmartMarks Calculator team for mathematical formula inquiries, bug reports, and academic calculation feedback.',
    tab: 'contact',
    breadcrumbName: 'Contact Support',
    component: <ContactPage />,
  },
  {
    slug: 'terms',
    canonicalUrl: `${BASE_URL}/terms`,
    title: 'Terms of Service & Academic Disclaimer - SmartMarks Calculator',
    description: 'Terms of Service, acceptable use policy, and educational disclaimer for SmartMarks Percentage Calculator.',
    tab: 'terms',
    breadcrumbName: 'Terms of Service & Academic Disclaimer',
    component: <TermsOfServicePage onBackToCalc={() => {}} />,
  },
];

function prerender() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error(`Base template not found at ${templatePath}. Run vite build first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf8');

  for (const route of routes) {
    let html = baseHtml;

    // 1. Replace Canonical Tag
    html = html.replace(
      /<link rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="${route.canonicalUrl}" />`
    );

    // 2. Replace Title Tag
    html = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${route.title}</title>`
    );

    // 3. Replace Meta Description
    html = html.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${route.description}" />`
    );

    // 4. Replace OpenGraph & Twitter tags
    html = html.replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${route.canonicalUrl}" />`
    );
    html = html.replace(
      /<meta name="twitter:url" content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:url" content="${route.canonicalUrl}" />`
    );
    html = html.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${route.title}" />`
    );
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${route.title}" />`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${route.description}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${route.description}" />`
    );

    // 5. Update BreadcrumbList schema if subpage
    if (route.breadcrumbName) {
      const breadcrumbJson = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: route.breadcrumbName,
            item: route.canonicalUrl,
          },
        ],
      }, null, 2);

      html = html.replace(
        /<!-- Structured Data 3: BreadcrumbList Schema[\s\S]*?<\/script>/i,
        `<!-- Structured Data 3: BreadcrumbList Schema for Google Breadcrumbs -->\n    <script type="application/ld+json">\n${breadcrumbJson}\n    </script>`
      );
    }

    // 6. If route has component, pre-render it inside <div id="root">
    if (route.component) {
      const renderedContent = renderToString(
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
          <Navbar activeTab={route.tab} setActiveTab={() => {}} />
          <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
            {route.component}
          </main>
          <Footer setActiveTab={() => {}} />
        </div>
      );

      // Replace the root div inner contents
      html = html.replace(
        /<div id="root">[\s\S]*?<\/div>\s*<script/i,
        `<div id="root">${renderedContent}</div>\n    <script`
      );
    }

    if (route.slug === '') {
      // Overwrite dist/index.html with verified canonical
      fs.writeFileSync(templatePath, html, 'utf8');
      console.log(`[SEO Prerender] Generated root: dist/index.html (${route.canonicalUrl})`);
    } else {
      const routeDir = path.join(distDir, route.slug);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      const outPath = path.join(routeDir, 'index.html');
      fs.writeFileSync(outPath, html, 'utf8');
      console.log(`[SEO Prerender] Generated route: dist/${route.slug}/index.html (${route.canonicalUrl})`);
    }
  }

  console.log('[SEO Prerender] Successfully generated all static route HTML files with self-referencing canonicals.');
}

prerender();
