import { CalculationResult, StandardType, SubjectItem } from '../types';

export function getGradeDetails(percentage: number): { letterGrade: string; gradePoint10: number; gradePoint4: number; remark: string } {
  if (percentage >= 91) {
    return { letterGrade: 'O (Outstanding / A1)', gradePoint10: 10, gradePoint4: 4.0, remark: 'Exceptional Performance' };
  } else if (percentage >= 81) {
    return { letterGrade: 'A+ (Excellent / A2)', gradePoint10: 9, gradePoint4: 3.7, remark: 'Excellent Mastery' };
  } else if (percentage >= 71) {
    return { letterGrade: 'A (Very Good / B1)', gradePoint10: 8, gradePoint4: 3.3, remark: 'Very Good Understanding' };
  } else if (percentage >= 61) {
    return { letterGrade: 'B+ (Good / B2)', gradePoint10: 7, gradePoint4: 3.0, remark: 'Good Competency' };
  } else if (percentage >= 51) {
    return { letterGrade: 'B (Above Average / C1)', gradePoint10: 6, gradePoint4: 2.5, remark: 'Above Average' };
  } else if (percentage >= 41) {
    return { letterGrade: 'C (Average / C2)', gradePoint10: 5, gradePoint4: 2.0, remark: 'Average Standing' };
  } else if (percentage >= 33) {
    return { letterGrade: 'P (Pass / D)', gradePoint10: 4, gradePoint4: 1.0, remark: 'Satisfactory Pass' };
  } else {
    return { letterGrade: 'F (Essential Repeat / Fail)', gradePoint10: 0, gradePoint4: 0.0, remark: 'Needs Immediate Attention' };
  }
}

export function calculateAcademicStanding(
  subjects: SubjectItem[],
  standard: StandardType,
  gpaScale: 10 | 4 = 10,
  passThresholdPercent: number = 33
): CalculationResult {
  const activeSubjects = subjects.filter((s) => s.included !== false);

  if (activeSubjects.length === 0) {
    return {
      totalObtained: 0,
      totalMax: 0,
      percentage: 0,
      gpa: 0,
      gpaScale,
      letterGrade: 'N/A',
      division: 'No Data',
      divisionColor: 'text-slate-500 bg-slate-100',
      resultStatus: 'Passed',
      passedCount: 0,
      failedCount: 0,
      highestSubject: null,
      lowestSubject: null,
      averageMarks: 0,
      feedbackRemarks: 'Please enter your subject marks to calculate results.',
    };
  }

  const hasEnteredAnyMarks = activeSubjects.some(
    (s) => s.obtainedMarks !== '' && s.obtainedMarks !== undefined
  );

  if (!hasEnteredAnyMarks) {
    const totalMaxPossible = activeSubjects.reduce((acc, s) => acc + (Number(s.maxMarks) || 100), 0);
    return {
      totalObtained: 0,
      totalMax: totalMaxPossible,
      percentage: 0,
      gpa: 0,
      gpaScale,
      letterGrade: '—',
      division: 'Awaiting Marks',
      divisionColor: 'text-slate-500 bg-slate-100 border-slate-200',
      resultStatus: 'Passed',
      passedCount: 0,
      failedCount: 0,
      highestSubject: null,
      lowestSubject: null,
      averageMarks: 0,
      feedbackRemarks: 'Enter your subject scores in the input boxes to calculate your percentage, division, and GPA.',
    };
  }

  let totalObtained = 0;
  let totalMax = 0;
  let totalWeightedGP = 0;
  let totalCredits = 0;
  let failedCount = 0;
  let passedCount = 0;

  let highestSub: { name: string; marks: number; maxMarks: number; percentage: number } | null = null;
  let lowestSub: { name: string; marks: number; maxMarks: number; percentage: number } | null = null;

  activeSubjects.forEach((sub) => {
    const obtained = Math.max(0, Number(sub.obtainedMarks) || 0);
    const max = Math.max(1, Number(sub.maxMarks) || 100);
    const subPercentage = (obtained / max) * 100;
    const credits = Number(sub.credits) || 1;

    totalObtained += obtained;
    totalMax += max;

    const gradeInfo = getGradeDetails(subPercentage);
    const gp = gpaScale === 4 ? gradeInfo.gradePoint4 : gradeInfo.gradePoint10;

    totalWeightedGP += gp * credits;
    totalCredits += credits;

    if (subPercentage >= passThresholdPercent) {
      passedCount++;
    } else {
      failedCount++;
    }

    if (!highestSub || subPercentage > highestSub.percentage) {
      highestSub = { name: sub.name, marks: obtained, maxMarks: max, percentage: subPercentage };
    }

    if (!lowestSub || subPercentage < lowestSub.percentage) {
      lowestSub = { name: sub.name, marks: obtained, maxMarks: max, percentage: subPercentage };
    }
  });

  const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const averageMarks = activeSubjects.length > 0 ? totalObtained / activeSubjects.length : 0;

  // Calculate GPA
  let gpa = 0;
  if (standard === 'college' && totalCredits > 0) {
    gpa = totalWeightedGP / totalCredits;
  } else {
    // For 10th/12th/custom standard
    if (gpaScale === 10) {
      // Standard 10 point CGPA: either average of grade points or percentage / 9.5 for CBSE
      const sumGradePoints = activeSubjects.reduce((acc, sub) => {
        const pct = ((Number(sub.obtainedMarks) || 0) / (Number(sub.maxMarks) || 100)) * 100;
        return acc + getGradeDetails(pct).gradePoint10;
      }, 0);
      gpa = sumGradePoints / activeSubjects.length;
    } else {
      const sumGradePoints4 = activeSubjects.reduce((acc, sub) => {
        const pct = ((Number(sub.obtainedMarks) || 0) / (Number(sub.maxMarks) || 100)) * 100;
        return acc + getGradeDetails(pct).gradePoint4;
      }, 0);
      gpa = sumGradePoints4 / activeSubjects.length;
    }
  }

  // Determine Division / Class
  let division = 'Pass Class';
  let divisionColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (failedCount > 1) {
    division = 'Essential Repeat / Failed';
    divisionColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (failedCount === 1) {
    division = 'Eligible for Compartment / ATKT';
    divisionColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (overallPercentage >= 75) {
    division = 'First Class with Distinction';
    divisionColor = 'text-indigo-700 bg-indigo-50 border-indigo-200';
  } else if (overallPercentage >= 60) {
    division = 'First Class';
    divisionColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (overallPercentage >= 50) {
    division = 'Second Class';
    divisionColor = 'text-teal-700 bg-teal-50 border-teal-200';
  } else if (overallPercentage >= passThresholdPercent) {
    division = 'Third Class / Pass';
    divisionColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else {
    division = 'Failed';
    divisionColor = 'text-rose-700 bg-rose-50 border-rose-200';
  }

  // Result Status
  let resultStatus: 'Passed' | 'Compartment / ATKT' | 'Failed' = 'Passed';
  if (failedCount >= 2) {
    resultStatus = 'Failed';
  } else if (failedCount === 1) {
    resultStatus = 'Compartment / ATKT';
  }

  const { letterGrade } = getGradeDetails(overallPercentage);

  // Personalized remarks
  let feedbackRemarks = '';
  if (overallPercentage >= 90) {
    feedbackRemarks = 'Outstanding academic performance! Consistent excellence shown across curriculum subjects.';
  } else if (overallPercentage >= 75) {
    feedbackRemarks = 'Commendable First Division standing with distinction. Strong conceptual grasp evident.';
  } else if (overallPercentage >= 60) {
    feedbackRemarks = 'Good First Division achievement. Regular practice in weaker subjects can push this into Distinction.';
  } else if (overallPercentage >= 50) {
    feedbackRemarks = 'Clear pass with Second Division. Focus on revision and problem-solving to strengthen core marks.';
  } else if (overallPercentage >= passThresholdPercent) {
    feedbackRemarks = 'Satisfactory overall pass. Targeted academic support recommended for foundational subjects.';
  } else {
    feedbackRemarks = 'Did not meet minimum passing threshold. Structured remedial preparation required.';
  }

  return {
    totalObtained: Math.round(totalObtained * 100) / 100,
    totalMax: Math.round(totalMax * 100) / 100,
    percentage: Math.round(overallPercentage * 100) / 100,
    gpa: Math.round(gpa * 100) / 100,
    gpaScale,
    letterGrade,
    division,
    divisionColor,
    resultStatus,
    passedCount,
    failedCount,
    highestSubject: highestSub,
    lowestSubject: lowestSub,
    averageMarks: Math.round(averageMarks * 100) / 100,
    feedbackRemarks,
  };
}

export interface QuickPercentageResult {
  obtained: number;
  max: number;
  percentage: number;
  formattedPercentage: string;
  grade: { letterGrade: string; gradePoint10: number; gradePoint4: number; remark: string };
  division: string;
  divisionColor: string;
  marksLost: number;
  lostPercentage: number;
  nextMilestone: { targetPercent: number; label: string; neededMarks: number } | null;
  fraction: string;
  formulaText: string;
  gpa10: number;
  gpa4: number;
}

export function calculateQuickPercentage(
  obtainedMarks: number,
  maxMarks: number,
  decimals: number = 2
): QuickPercentageResult {
  const obtained = Math.max(0, Number(obtainedMarks) || 0);
  const max = Math.max(1, Number(maxMarks) || 100);
  const rawPercentage = (obtained / max) * 100;
  const clampedPercentage = Math.min(100, rawPercentage);
  const grade = getGradeDetails(clampedPercentage);

  let division = 'Pass';
  let divisionColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (clampedPercentage >= 75) {
    division = 'First Class with Distinction';
    divisionColor = 'text-indigo-700 bg-indigo-50 border-indigo-200';
  } else if (clampedPercentage >= 60) {
    division = 'First Class';
    divisionColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (clampedPercentage >= 50) {
    division = 'Second Class';
    divisionColor = 'text-teal-700 bg-teal-50 border-teal-200';
  } else if (clampedPercentage >= 33) {
    division = 'Third Class / Pass';
    divisionColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else {
    division = 'Failed / Below Passing';
    divisionColor = 'text-rose-700 bg-rose-50 border-rose-200';
  }

  const marksLost = Math.max(0, max - obtained);
  const lostPercentage = (marksLost / max) * 100;

  // Next milestone
  let nextMilestone = null;
  if (clampedPercentage < 33) {
    const needed = Math.ceil(max * 0.33) - obtained;
    nextMilestone = { targetPercent: 33, label: 'Passing (33%)', neededMarks: Math.max(1, needed) };
  } else if (clampedPercentage < 50) {
    const needed = Math.ceil(max * 0.50) - obtained;
    nextMilestone = { targetPercent: 50, label: 'Second Class (50%)', neededMarks: Math.max(1, needed) };
  } else if (clampedPercentage < 60) {
    const needed = Math.ceil(max * 0.60) - obtained;
    nextMilestone = { targetPercent: 60, label: 'First Class (60%)', neededMarks: Math.max(1, needed) };
  } else if (clampedPercentage < 75) {
    const needed = Math.ceil(max * 0.75) - obtained;
    nextMilestone = { targetPercent: 75, label: 'Distinction (75%)', neededMarks: Math.max(1, needed) };
  } else if (clampedPercentage < 90) {
    const needed = Math.ceil(max * 0.90) - obtained;
    nextMilestone = { targetPercent: 90, label: 'Outstanding A1 (90%)', neededMarks: Math.max(1, needed) };
  } else if (clampedPercentage < 100) {
    const needed = max - obtained;
    nextMilestone = { targetPercent: 100, label: 'Centum 100%', neededMarks: Math.max(1, needed) };
  }

  const roundedPercentage = Number(clampedPercentage.toFixed(decimals));
  const roundedLost = Number(lostPercentage.toFixed(decimals));

  return {
    obtained,
    max,
    percentage: roundedPercentage,
    formattedPercentage: `${roundedPercentage.toFixed(decimals)}%`,
    grade,
    division,
    divisionColor,
    marksLost,
    lostPercentage: roundedLost,
    nextMilestone,
    fraction: `${obtained} / ${max}`,
    formulaText: `(${obtained} ÷ ${max}) × 100 = ${roundedPercentage.toFixed(decimals)}%`,
    gpa10: grade.gradePoint10,
    gpa4: grade.gradePoint4,
  };
}
