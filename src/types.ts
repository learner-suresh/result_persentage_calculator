export type StandardType = '10th' | '12th' | 'college' | 'custom' | 'quick';

export type GradingScaleType = 'cbse10' | 'percentage' | 'gpa10' | 'gpa4';

export interface SubjectItem {
  id: string;
  name: string;
  maxMarks: number;
  obtainedMarks: number | '';
  credits?: number; // For college GPA
  gradePoint?: number; // 0 - 10 or 0 - 4
  letterGrade?: string;
  isElective?: boolean;
  included?: boolean;
}

export interface StudentInfo {
  studentName: string;
  rollNumber: string;
  standard: string;
  streamOrMajor: string;
  institutionName: string;
  academicYear: string;
  examTitle: string;
  institutionLogo?: string; // Optional Base64 data URL for school/college/university logo
}

export interface CalculationResult {
  totalObtained: number;
  totalMax: number;
  percentage: number;
  gpa: number;
  gpaScale: number;
  letterGrade: string;
  division: string;
  divisionColor: string;
  resultStatus: 'Passed' | 'Compartment / ATKT' | 'Failed';
  passedCount: number;
  failedCount: number;
  highestSubject: { name: string; marks: number; maxMarks: number; percentage: number } | null;
  lowestSubject: { name: string; marks: number; maxMarks: number; percentage: number } | null;
  averageMarks: number;
  feedbackRemarks: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  standard: StandardType;
  description: string;
  defaultExamTitle: string;
  defaultStream: string;
  subjects: Array<{
    name: string;
    maxMarks: number;
    obtainedMarks?: number | '';
    credits?: number;
    included?: boolean;
  }>;
}

export interface SavedReport {
  id: string;
  timestamp: number;
  studentInfo: StudentInfo;
  standard: StandardType;
  subjects: SubjectItem[];
  result: CalculationResult;
}
