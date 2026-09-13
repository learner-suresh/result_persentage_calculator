import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Plus,
  Trash2,
  Download,
  Printer,
  Bookmark,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Percent,
  Sliders,
  FileSpreadsheet,
  Target,
  ChevronDown,
  ChevronUp,
  Zap,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { CalculationResult, SavedReport, StandardType, StudentInfo, SubjectItem } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';
import { calculateAcademicStanding, getGradeDetails } from '../utils/calculator';
import { generatePerformanceReportPDF } from '../utils/pdfGenerator';
import { AdSenseUnit } from './AdSenseUnit';
import { FirstPlacePercentageCalculator } from './FirstPlacePercentageCalculator';
import { PdfExportAdModal } from './PdfExportAdModal';
import { PercentageCalculatorSeoContent } from './PercentageCalculatorSeoContent';

export function Dashboard() {
  // Hidden file input for school / college / university logo
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Current active preset tracking (prevents all 12th presets from being selected together)
  const [activePresetId, setActivePresetId] = useState<string>('class-10th');
  // State to trigger the PDF export ad popup modal
  const [showPdfAdModal, setShowPdfAdModal] = useState<boolean>(false);

  // Current active standard mode
  const [standard, setStandard] = useState<StandardType>('10th');
  const [gpaScale, setGpaScale] = useState<10 | 4>(10);
  const [passThreshold, setPassThreshold] = useState<number>(33);
  const [targetPercentage, setTargetPercentage] = useState<number>(90);
  const [showStudentDetails, setShowStudentDetails] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Student metadata
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    studentName: '',
    rollNumber: '',
    standard: '',
    streamOrMajor: '',
    institutionName: '',
    academicYear: '',
    examTitle: '',
  });

  // Subjects state
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const defaultPreset = PRESET_TEMPLATES[0];
    return defaultPreset.subjects.map((s, idx) => ({
      id: `sub-${idx}-${Date.now()}`,
      name: s.name,
      maxMarks: s.maxMarks,
      obtainedMarks: s.obtainedMarks ?? '',
      credits: s.credits || 1,
      included: true,
    }));
  });

  // Saved reports in localStorage
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    try {
      const stored = localStorage.getItem('student_saved_reports');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  // Load preset helper
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePresetId(preset.id);
    setStandard(preset.standard);
    setSubjects(
      preset.subjects.map((s, idx) => ({
        id: `sub-${idx}-${Date.now()}`,
        name: s.name,
        maxMarks: s.maxMarks,
        obtainedMarks: s.obtainedMarks ?? '',
        credits: s.credits || (preset.standard === 'college' ? 3 : 1),
        included: true,
      }))
    );
    setStudentInfo((prev) => ({
      ...prev,
      standard: preset.name,
      streamOrMajor: preset.defaultStream,
      examTitle: preset.defaultExamTitle,
    }));
  };

  // Upload school / college / university logo
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      // Optimize image resolution so PDF generation stays snappy and lightweight
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 320;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setStudentInfo((prev) => ({
            ...prev,
            institutionLogo: canvas.toDataURL('image/png'),
          }));
        } else {
          setStudentInfo((prev) => ({
            ...prev,
            institutionLogo: dataUrl,
          }));
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveLogo = () => {
    setStudentInfo((prev) => ({ ...prev, institutionLogo: undefined }));
  };

  // Switch standard mode
  const handleSwitchStandard = (newStandard: StandardType) => {
    setStandard(newStandard);
    if (newStandard === 'quick') {
      return;
    }
    const matchingPreset = PRESET_TEMPLATES.find((p) => p.standard === newStandard);
    if (matchingPreset) {
      handleLoadPreset(matchingPreset.id);
    } else {
      // Custom standard
      setActivePresetId('custom-class');
      setSubjects([
        { id: `sub-1-${Date.now()}`, name: 'Subject 1', maxMarks: 100, obtainedMarks: '', included: true },
        { id: `sub-2-${Date.now()}`, name: 'Subject 2', maxMarks: 100, obtainedMarks: '', included: true },
        { id: `sub-3-${Date.now()}`, name: 'Subject 3', maxMarks: 100, obtainedMarks: '', included: true },
        { id: `sub-4-${Date.now()}`, name: 'Subject 4', maxMarks: 100, obtainedMarks: '', included: true },
      ]);
      setStudentInfo((prev) => ({
        ...prev,
        standard: 'Custom Class',
        streamOrMajor: 'General Studies',
        examTitle: 'Annual Assessment Examination',
      }));
    }
  };

  // Transfer marks from Quick Calculator into detailed multi-subject marksheet
  const handleTransferFromQuick = (obtained: number, max: number) => {
    setStandard('custom');
    const numSubjects = max >= 500 ? 5 : max >= 400 ? 4 : max >= 300 ? 3 : 2;
    const eachMax = Math.round(max / numSubjects);
    const eachObtained = Math.round((obtained / numSubjects) * 10) / 10;

    const newSubjects: SubjectItem[] = [];
    let runningObtained = 0;
    let runningMax = 0;

    for (let i = 1; i <= numSubjects; i++) {
      const isLast = i === numSubjects;
      const subMax = isLast ? max - runningMax : eachMax;
      const subObtained = isLast
        ? Math.max(0, Math.round((obtained - runningObtained) * 10) / 10)
        : eachObtained;
      runningMax += subMax;
      runningObtained += subObtained;

      newSubjects.push({
        id: `sub-trans-${Date.now()}-${i}`,
        name: `Subject ${i}`,
        maxMarks: subMax,
        obtainedMarks: subObtained,
        included: true,
      });
    }

    setSubjects(newSubjects);
    setStudentInfo((prev) => ({
      ...prev,
      standard: 'Consolidated Marksheet',
      streamOrMajor: 'General Studies',
      examTitle: 'Annual Assessment Examination 2025',
    }));
    const el = document.getElementById('detailed-marksheet-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update subject
  const updateSubject = (id: string, field: keyof SubjectItem, value: string | number | boolean) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return { ...sub, [field]: value };
        }
        return sub;
      })
    );
  };

  // Add subject
  const addSubject = () => {
    const newSub: SubjectItem = {
      id: `sub-${Date.now()}`,
      name: `Subject ${subjects.length + 1}`,
      maxMarks: 100,
      obtainedMarks: '',
      credits: standard === 'college' ? 3 : 1,
      included: true,
    };
    setSubjects([...subjects, newSub]);
  };

  // Remove subject
  const removeSubject = (id: string) => {
    if (subjects.length <= 1) {
      alert('At least one subject is required for calculation.');
      return;
    }
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  // Clear marks
  const clearMarks = () => {
    setSubjects(
      subjects.map((s) => ({
        ...s,
        obtainedMarks: '',
      }))
    );
  };

  // Real-time calculation result
  const result: CalculationResult = useMemo(() => {
    return calculateAcademicStanding(subjects, standard, gpaScale, passThreshold);
  }, [subjects, standard, gpaScale, passThreshold]);

  // Export PDF Handler - triggers the requested ad popup modal
  const handleExportPDF = () => {
    setShowPdfAdModal(true);
  };

  // Direct download PDF function called from ad popup modal
  const handleDirectDownloadPDF = () => {
    if (result.percentage >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
      });
    }
    generatePerformanceReportPDF(studentInfo, subjects, result, passThreshold);
  };

  // Save report to history
  const saveCurrentReport = () => {
    const newReport: SavedReport = {
      id: `rep-${Date.now()}`,
      timestamp: Date.now(),
      studentInfo: { ...studentInfo },
      standard,
      subjects: JSON.parse(JSON.stringify(subjects)),
      result: { ...result },
    };

    const updated = [newReport, ...savedReports.slice(0, 19)]; // Keep latest 20
    setSavedReports(updated);
    localStorage.setItem('student_saved_reports', JSON.stringify(updated));
    alert('Report snapshot saved to local browser history!');
  };

  // Restore saved report
  const restoreReport = (rep: SavedReport) => {
    setStudentInfo(rep.studentInfo);
    setStandard(rep.standard);
    setSubjects(rep.subjects);
    setShowHistory(false);
  };

  // Delete saved report
  const deleteSavedReport = (id: string) => {
    const updated = savedReports.filter((r) => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem('student_saved_reports', JSON.stringify(updated));
  };

  // Clear all saved reports
  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all saved marksheets?')) {
      setSavedReports([]);
      localStorage.removeItem('student_saved_reports');
    }
  };

  // Trigger print
  const handlePrint = () => {
    window.print();
  };

  // Calculate target marks gap
  const targetGap = useMemo(() => {
    const activeSubs = subjects.filter((s) => s.included !== false);
    const totalMax = activeSubs.reduce((acc, s) => acc + (Number(s.maxMarks) || 100), 0);
    const requiredTotal = (targetPercentage / 100) * totalMax;
    const currentObtained = activeSubs.reduce((acc, s) => acc + (Number(s.obtainedMarks) || 0), 0);
    const diff = requiredTotal - currentObtained;
    return {
      totalMax,
      requiredTotal: Math.round(requiredTotal),
      currentObtained: Math.round(currentObtained),
      diff: Math.round(diff * 10) / 10,
      achieved: currentObtained >= requiredTotal,
    };
  }, [subjects, targetPercentage]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Top Hero Section: Instant Percentage Calculator is the primary first element users see; Ad placement positioned alongside on the right side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 xl:col-span-8 order-1">
          <FirstPlacePercentageCalculator
            onScrollToDetailed={() => {
              const el = document.getElementById('detailed-marksheet-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onPopulateDetailed={handleTransferFromQuick}
          />
        </div>

        {/* Right Side Academic Reference Card (High Value Publisher Content) */}
        <div className="lg:col-span-4 xl:col-span-4 order-2 space-y-4">
          {/* Academic Formula & Division Reference Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xl shadow-slate-100 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span>Calculation &amp; Division Standards</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">Official Standards</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Core Formula:</strong> (Scored Marks &divide; Out of Marks) &times; 100
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                <span>&ge; 60%</span>
                <div className="text-[9px] font-normal text-emerald-600">1st Div</div>
              </div>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-100">
                <span>45% - 59%</span>
                <div className="text-[9px] font-normal text-blue-600">2nd Div</div>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-100">
                <span>33% - 44%</span>
                <div className="text-[9px] font-normal text-amber-600">3rd Div</div>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>Zero-API Privacy</span>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('detailed-marksheet-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Subject Marksheet &darr;
              </button>
            </div>
          </div>

          {/* Board Rules & Quick Conversion Cheat Sheet */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Board Conversion Quick Guide</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                <span className="font-semibold text-white">CBSE 10th &amp; 12th:</span>
                <span className="font-mono text-amber-300 text-[11px]">Best 5 Subjects</span>
              </li>
              <li className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                <span className="font-semibold text-white">CGPA to % Formula:</span>
                <span className="font-mono text-amber-300 text-[11px]">CGPA &times; 9.5</span>
              </li>
              <li className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                <span className="font-semibold text-white">Honors / Distinction:</span>
                <span className="font-mono text-emerald-400 text-[11px]">&ge; 75.0%</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="font-semibold text-white">Min Passing Cutoff:</span>
                <span className="font-mono text-amber-400 text-[11px]">33% / 35%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Detailed Subject-Wise Marksheet & Comprehensive Academic Analytics Section */}
      <section id="detailed-marksheet-section" className="space-y-6 pt-2">
        {/* Section Header & Standard Switcher Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Comprehensive Marksheet
                </span>
                <span className="text-xs text-slate-400 font-semibold">Step 2: Subject-by-Subject Marksheet</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Academic Marksheet &amp; PDF Report
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Calculate total marks, GPA, stream cutoffs, and export verified PDF marksheets.
              </p>
            </div>

            {/* Standard Switcher Pills */}
            <div
              role="tablist"
              aria-label="Education Standards"
              className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto"
            >
              {[
                { id: '10th', label: '10th Standard' },
                { id: '12th', label: '12th Standard' },
                { id: 'college', label: 'College / GPA' },
                { id: 'custom', label: 'Custom' },
              ].map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={standard === item.id}
                  type="button"
                  onClick={() => handleSwitchStandard(item.id as StandardType)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    standard === item.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Board Presets */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="shrink-0 font-bold uppercase tracking-widest text-slate-400 text-[10px]">
                Quick Presets:
              </span>
              {PRESET_TEMPLATES.map((p) => {
                const isActive = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleLoadPreset(p.id)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-lg border font-semibold transition text-xs cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {p.id === 'custom-class' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* If Custom Class is active, show quick name input for a particular class */}
            {standard === 'custom' && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Particular Class Mode:</strong> Enter your specific standard / class (e.g. Class 8th, Class 9th, Class 11th, Diploma, Degree):
                  </span>
                </div>
                <input
                  type="text"
                  value={studentInfo.standard}
                  onChange={(e) => setStudentInfo((prev) => ({ ...prev, standard: e.target.value }))}
                  placeholder="e.g. Class 9th or Diploma 2nd Year"
                  className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 text-xs w-full sm:w-64"
                />
              </div>
            )}
          </div>
        </div>

        {/* Hidden input for uploading optional school / college logo */}
        <input
          type="file"
          ref={logoInputRef}
          onChange={handleLogoFileChange}
          accept="image/*"
          className="hidden"
          aria-label="Upload School or College Logo"
        />

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Inputs & Subjects (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Student Profile Information Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowStudentDetails(!showStudentDetails)}
                className="flex items-center gap-2 text-left font-bold text-sm text-slate-900 focus:outline-hidden"
              >
                <span>Student &amp; Institution Details (For PDF Report)</span>
                {showStudentDetails ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <div className="flex items-center gap-2">
                {Boolean(
                  studentInfo.studentName ||
                    studentInfo.rollNumber ||
                    studentInfo.institutionName ||
                    studentInfo.examTitle ||
                    studentInfo.standard ||
                    studentInfo.streamOrMajor ||
                    studentInfo.institutionLogo
                ) && (
                  <button
                    type="button"
                    onClick={() =>
                      setStudentInfo({
                        studentName: '',
                        rollNumber: '',
                        standard: '',
                        streamOrMajor: '',
                        institutionName: '',
                        academicYear: '',
                        examTitle: '',
                        institutionLogo: undefined,
                      })
                    }
                    className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 px-2 py-0.5 rounded transition cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  Included in PDF
                </span>
              </div>
            </div>

            {showStudentDetails && (
              <div className="space-y-4 pt-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="student-name-input" className="block font-semibold text-slate-700 mb-1">
                      Student Full Name
                    </label>
                    <input
                      id="student-name-input"
                      type="text"
                      value={studentInfo.studentName}
                      onChange={(e) => setStudentInfo({ ...studentInfo, studentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden text-slate-900 font-medium"
                      placeholder="e.g. Aarav Sharma"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-roll-input" className="block font-semibold text-slate-700 mb-1">
                      Roll / Registration No.
                    </label>
                    <input
                      id="student-roll-input"
                      type="text"
                      value={studentInfo.rollNumber}
                      onChange={(e) => setStudentInfo({ ...studentInfo, rollNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden text-slate-900 font-medium"
                      placeholder="e.g. CBSE-2025-10492"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-school-input" className="block font-semibold text-slate-700 mb-1">
                      School / College / University Name
                    </label>
                    <input
                      id="student-school-input"
                      type="text"
                      value={studentInfo.institutionName}
                      onChange={(e) => setStudentInfo({ ...studentInfo, institutionName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden text-slate-900 font-medium"
                      placeholder="e.g. Delhi Public School"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-exam-input" className="block font-semibold text-slate-700 mb-1">
                      Exam / Session Title
                    </label>
                    <input
                      id="student-exam-input"
                      type="text"
                      value={studentInfo.examTitle}
                      onChange={(e) => setStudentInfo({ ...studentInfo, examTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden text-slate-900 font-medium"
                      placeholder="e.g. Secondary School Examination 2025"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-standard-input" className="block font-semibold text-slate-700 mb-1">
                      Class / Standard / Grade
                    </label>
                    <input
                      id="student-standard-input"
                      type="text"
                      value={studentInfo.standard}
                      onChange={(e) => setStudentInfo({ ...studentInfo, standard: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden text-slate-900 font-medium"
                      placeholder="e.g. Class 10th or Class 12th"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-stream-input" className="block font-semibold text-slate-700 mb-1">
                      Stream / Major / Department
                    </label>
                    <input
                      id="student-stream-input"
                      type="text"
                      value={studentInfo.streamOrMajor}
                      onChange={(e) => setStudentInfo({ ...studentInfo, streamOrMajor: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden text-slate-900 font-medium"
                      placeholder="e.g. Science / Arts / Commerce"
                    />
                  </div>
                </div>

                {/* School / College / University Logo Upload (Optional) */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700 text-xs">
                      School / College / University Logo
                    </label>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      Optional for PDF
                    </span>
                  </div>

                  {studentInfo.institutionLogo ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
                          <img
                            src={studentInfo.institutionLogo}
                            alt="Institution Logo Preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-emerald-700">Logo Attached</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              Included in PDF
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            This logo will be displayed on the top header of the exported PDF transcript.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
                        >
                          Change Logo
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/40 text-slate-600 hover:text-indigo-700 font-medium text-xs transition cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-indigo-100 text-slate-500 group-hover:text-indigo-600 flex items-center justify-center shadow-2xs transition">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold">
                        + Add School, College, or University Logo <span className="font-normal text-slate-400">(Optional for PDF Report)</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Subjects Table & Marks Entry */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Subject Marks &amp; Grades Entry
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Enter obtained marks below for live percentage, grades, and GP calculations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearMarks}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  title="Reset all marks to zero"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  onClick={addSubject}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subject</span>
                </button>
              </div>
            </div>

            {/* Subject List */}
            <div className="space-y-2.5">
              {subjects.map((sub, index) => {
                const obt = Math.max(0, Number(sub.obtainedMarks) || 0);
                const max = Math.max(1, Number(sub.maxMarks) || 100);
                const pct = Math.round((obt / max) * 1000) / 10;
                const isOverMax = obt > max;
                const gradeInfo = getGradeDetails(pct);

                return (
                  <div
                    key={sub.id}
                    className={`group p-3 sm:p-3.5 rounded-xl border transition ${
                      sub.included === false
                        ? 'bg-slate-50/60 border-dashed border-slate-300 opacity-60'
                        : isOverMax
                        ? 'bg-rose-50/50 border-rose-300'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* Checkbox & S.No */}
                      <div className="col-span-1 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={sub.included !== false}
                          onChange={(e) => updateSubject(sub.id, 'included', e.target.checked)}
                          aria-label={`Include ${sub.name} in calculation`}
                          title="Toggle subject inclusion (useful for Best of 5 rule)"
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>

                      {/* Subject Name */}
                      <div className="col-span-11 sm:col-span-4">
                        <label htmlFor={`sub-name-${sub.id}`} className="sr-only">
                          Subject {index + 1} Name
                        </label>
                        <input
                          id={`sub-name-${sub.id}`}
                          type="text"
                          value={sub.name}
                          onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                          placeholder="Subject Name"
                          className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 rounded-md border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      {/* Max Marks */}
                      <div className="col-span-4 sm:col-span-2">
                        <label htmlFor={`sub-max-${sub.id}`} className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                          Max Marks
                        </label>
                        <input
                          id={`sub-max-${sub.id}`}
                          type="number"
                          min="1"
                          max="1000"
                          value={sub.maxMarks}
                          onChange={(e) => updateSubject(sub.id, 'maxMarks', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs text-center font-mono rounded-md bg-slate-50 border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      {/* Obtained Marks */}
                      <div className="col-span-4 sm:col-span-2">
                        <label htmlFor={`sub-obt-${sub.id}`} className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                          Obtained
                        </label>
                        <input
                          id={`sub-obt-${sub.id}`}
                          type="number"
                          min="0"
                          max="1000"
                          value={sub.obtainedMarks}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateSubject(sub.id, 'obtainedMarks', val === '' ? '' : Number(val));
                          }}
                          placeholder="0"
                          className={`w-full px-2 py-1 text-xs text-center font-bold font-mono rounded-md border focus:outline-hidden ${
                            isOverMax
                              ? 'border-rose-400 text-rose-700 bg-rose-50'
                              : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500'
                          }`}
                        />
                      </div>

                      {/* Credits (College Mode) or Percentage Preview */}
                      {standard === 'college' ? (
                        <div className="col-span-3 sm:col-span-2">
                          <label htmlFor={`sub-cred-${sub.id}`} className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Credits
                          </label>
                          <input
                            id={`sub-cred-${sub.id}`}
                            type="number"
                            min="1"
                            max="10"
                            value={sub.credits || 3}
                            onChange={(e) => updateSubject(sub.id, 'credits', Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs text-center font-mono rounded-md bg-slate-50 border border-slate-200 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 focus:outline-hidden"
                          />
                        </div>
                      ) : (
                        <div className="col-span-3 sm:col-span-2 text-center">
                          <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Score
                          </span>
                          <span
                            className={`inline-block text-xs font-bold ${
                              sub.obtainedMarks === ''
                                ? 'text-slate-400'
                                : pct >= passThreshold
                                ? 'text-indigo-600'
                                : 'text-rose-600'
                            }`}
                            title={
                              sub.obtainedMarks !== '' && pct < passThreshold
                                ? `Below pass threshold (${passThreshold}%)`
                                : undefined
                            }
                          >
                            {sub.obtainedMarks === '' ? '—' : `${pct}%`}
                          </span>
                        </div>
                      )}

                      {/* Grade pill & Delete button */}
                      <div className="col-span-1 flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => removeSubject(sub.id)}
                          aria-label={`Delete ${sub.name}`}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isOverMax && (
                      <p className="text-[10px] text-rose-600 mt-1 pl-8 font-medium">
                        Obtained marks ({obt}) exceed max marks ({max}). Please verify.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Geometric Balance "+ ADD ANOTHER SUBJECT" link */}
            <button
              type="button"
              onClick={addSubject}
              className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer"
            >
              + ADD ANOTHER SUBJECT
            </button>
          </div>

          {/* Target Gap & Calculator Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Target Score Tracker &amp; Evaluation Options
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Target Percentage */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-700">Goal Percentage Target:</span>
                  <span className="font-black text-indigo-600 font-mono text-sm">{targetPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                  aria-label="Target Percentage slider"
                />
                <div className="text-[11px] text-slate-600">
                  {targetGap.achieved ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Target achieved! Scored {result.percentage}% vs {targetPercentage}% goal.
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">
                      Need {targetGap.diff} more marks to hit {targetPercentage}% distinction.
                    </span>
                  )}
                </div>
              </div>

              {/* Passing Threshold Setting */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <label htmlFor="pass-threshold-input" className="block text-xs font-bold text-slate-800">
                      Subject Pass Threshold (%)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Minimum score required to pass each subject
                    </span>
                  </div>
                  <div className="flex items-center bg-white px-2.5 py-1 rounded-lg border border-slate-300 shadow-xs focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                    <input
                      id="pass-threshold-input"
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={passThreshold === 0 ? '' : passThreshold}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setPassThreshold(0);
                        } else {
                          const num = Number(val);
                          if (!isNaN(num)) {
                            setPassThreshold(Math.max(0, Math.min(100, Math.round(num))));
                          }
                        }
                      }}
                      onBlur={() => {
                        if (passThreshold <= 0) setPassThreshold(33);
                      }}
                      placeholder="33"
                      className="w-12 text-center text-sm font-bold font-mono text-slate-800 focus:outline-hidden"
                      aria-label="Custom subject pass threshold percentage"
                    />
                    <span className="text-xs font-bold text-indigo-600">%</span>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={passThreshold || 33}
                    onChange={(e) => setPassThreshold(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    aria-label="Pass threshold percentage slider"
                  />
                  <span className="text-xs font-mono font-bold text-indigo-700 min-w-[34px] text-right">
                    {passThreshold}%
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[11px] font-medium text-slate-500 mr-1">Presets:</span>
                  {[33, 35, 40, 50, 60].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPassThreshold(val)}
                      className={`flex-1 py-1 rounded-md text-xs font-bold transition ${
                        passThreshold === val
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">
                  CBSE/ICSE boards use 33%, State boards usually use 35%, and colleges typically require 40%–50%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Results & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* Main Performance Result Hero Card */}
          <section
            aria-live="polite"
            role="status"
            className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col gap-6 shadow-2xl shadow-indigo-900/20 border border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Performance Insight
              </span>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  {result.resultStatus === 'Passed' ? 'Honor Roll Eligible' : result.resultStatus}
                </span>

                {/* GPA Scale Toggle */}
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setGpaScale(10)}
                    className={`px-2 py-0.5 rounded font-semibold transition ${
                      gpaScale === 10 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    10.0
                  </button>
                  <button
                    type="button"
                    onClick={() => setGpaScale(4)}
                    className={`px-2 py-0.5 rounded font-semibold transition ${
                      gpaScale === 4 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    4.0
                  </button>
                </div>
              </div>
            </div>

            {/* Big Metrics Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight">{result.percentage}%</span>
                <span className="text-xs text-slate-400 font-medium">Aggregated Percentage</span>
                <span className="text-[10px] text-slate-500">
                  {result.totalObtained} / {result.totalMax} Marks
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">{result.gpa}</span>
                <span className="text-xs text-slate-400 font-medium">
                  {standard === 'college' ? 'Semester SGPA' : 'Current GPA (Est.)'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Max: {result.gpaScale}.0 Point Scale
                </span>
              </div>
            </div>

            {/* Progress Towards Goal */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Progress towards {targetPercentage}% Rank</span>
                <span>{Math.round(result.percentage)} / {targetPercentage}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((result.percentage / targetPercentage) * 100))}%` }}
                />
              </div>
            </div>

            {/* Division & Standing Banner */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Standing Division:</span>
                <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-400/20">
                  {result.division}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Result Status:</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    result.resultStatus === 'Passed'
                      ? 'text-emerald-300 bg-emerald-400/20'
                      : result.resultStatus === 'Compartment / ATKT'
                      ? 'text-amber-300 bg-amber-400/20'
                      : 'text-rose-300 bg-rose-400/20'
                  }`}
                >
                  {result.resultStatus} ({result.passedCount} Passed, {result.failedCount} Failed)
                </span>
              </div>
            </div>

            {/* Academic Feedback */}
            <div className="text-xs text-slate-300 border-t border-slate-800 pt-3 leading-relaxed">
              <span className="text-indigo-300 font-bold block mb-0.5">Faculty Assessment:</span>
              {result.feedbackRemarks}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Quick Logo Button for PDF */}
              {studentInfo.institutionLogo ? (
                <div className="flex items-center justify-between p-2 bg-slate-800/90 rounded-xl border border-slate-700 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-6 h-6 rounded bg-white p-0.5 shrink-0 flex items-center justify-center">
                      <img
                        src={studentInfo.institutionLogo}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <span className="text-slate-300 font-medium text-[11px] truncate">
                      School / College Logo included in PDF
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 underline cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-indigo-300 hover:text-indigo-100 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>+ Add School / College / University Logo (Optional)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportPDF}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-indigo-600/30 active:scale-[0.99]"
              >
                <Download className="w-4 h-4 text-indigo-200" />
                <span>Export PDF Performance Report</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Print Sheet</span>
                </button>

                <button
                  type="button"
                  onClick={saveCurrentReport}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Save Snapshot</span>
                </button>
              </div>
            </div>
          </section>

          {/* Quick Performance Audit & Subject Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-6 sm:p-8 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
              Quick Performance Audit
            </h3>

            <div className="space-y-3">
              {result.highestSubject && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-slate-900">Top Subject:</span>{' '}
                    {result.highestSubject.name} ({Math.round(result.highestSubject.percentage)}%)
                  </p>
                </div>
              )}

              {result.lowestSubject && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-slate-900">Weak Point:</span>{' '}
                    {result.lowestSubject.name} ({Math.round(result.lowestSubject.percentage)}%)
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 p-3.5 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                  {targetGap.achieved
                    ? `Great progress: Aggregated score is ${result.percentage}%, exceeding your ${targetPercentage}% distinction goal.`
                    : `Tip: Improve ${result.lowestSubject?.name || 'your lowest subject'} by ${Math.ceil(targetGap.diff / 2)} marks to reach an overall aggregate of ${targetPercentage}% and secure an A1 Grade.`}
                </p>
              </div>
            </div>

            {/* Subject Distribution Bars */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                <span>Subject Scores</span>
                <span className="text-slate-400 font-normal">Avg: {Math.round(result.percentage)}%</span>
              </div>

              {subjects
                .filter((s) => s.included !== false)
                .map((sub) => {
                  const obt = Math.max(0, Number(sub.obtainedMarks) || 0);
                  const max = Math.max(1, Number(sub.maxMarks) || 100);
                  const pct = Math.min(100, Math.round((obt / max) * 100));

                  return (
                    <div key={sub.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                          {sub.name}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {obt}/{max} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 90
                              ? 'bg-indigo-600'
                              : pct >= 75
                              ? 'bg-indigo-500'
                              : pct >= 60
                              ? 'bg-teal-500'
                              : pct >= passThreshold
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Saved History Drawer / Trigger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <span>Saved Marksheet Snapshots ({savedReports.length})</span>
              </h3>
              {savedReports.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  {showHistory ? 'Hide' : 'View'}
                </button>
              )}
            </div>

            {savedReports.length === 0 ? (
              <p className="text-xs text-slate-500">
                Click &quot;Save Snapshot&quot; above to store your marksheet history locally in your browser for future comparison.
              </p>
            ) : (
              showHistory && (
                <div className="space-y-2 pt-2 border-t border-slate-100 max-h-60 overflow-y-auto pr-1">
                  {savedReports.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{item.studentInfo.studentName || 'Student'}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.studentInfo.standard} • {item.result.percentage}% ({item.result.gpa} GPA)
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => restoreReport(item)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSavedReport(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete saved marksheet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={clearAllHistory}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      Clear All Saved History
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      </section>

      {/* AdSense Placement above Educational Guides */}
      <div className="max-w-4xl mx-auto px-4">
        <AdSenseUnit format="responsive-banner" className="my-6" />
      </div>

      {/* Complete Percentage Calculator SEO & Educational Guide */}
      <PercentageCalculatorSeoContent />

      {/* PDF Export Ad Popup Modal */}
      <PdfExportAdModal
        isOpen={showPdfAdModal}
        onClose={() => setShowPdfAdModal(false)}
        onDownload={handleDirectDownloadPDF}
        studentInfo={studentInfo}
        percentage={result.percentage}
        division={result.division}
        totalObtained={result.totalObtained}
        totalMax={result.totalMax}
      />
    </div>
  );
}
