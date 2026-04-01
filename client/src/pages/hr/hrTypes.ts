// ===== Maham Expo — HR System Types =====
export type EmployeeStatus = 'active' | 'probation' | 'on_leave' | 'suspended' | 'terminated' | 'resigned';
export type Gender = 'male' | 'female';
export type ContractType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
export type LeaveType = 'annual' | 'sick' | 'emergency' | 'maternity' | 'paternity' | 'hajj' | 'unpaid' | 'bereavement' | 'marriage';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type RecruitmentStage = 'new' | 'screening' | 'interview' | 'technical_test' | 'offer' | 'hired' | 'rejected';
export type PerformanceRating = 1 | 2 | 3 | 4 | 5;
export type DocumentType = 'national_id' | 'passport' | 'iqama' | 'contract' | 'certificate' | 'medical' | 'visa' | 'license' | 'other';
export type ComplianceStatus = 'compliant' | 'warning' | 'violation' | 'pending';
export type OnboardingStep = 'accounts' | 'documents' | 'policies' | 'roles' | 'systems' | 'orientation';
export type PayrollStatus = 'draft' | 'processing' | 'approved' | 'paid' | 'failed' | 'pending';
export type AttendanceMethod = 'fingerprint' | 'face_id' | 'card' | 'manual' | 'gps';
export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated' | 'renewed' | 'pending_renewal';
export type AIInsightPriority = 'critical' | 'high' | 'medium' | 'low';
export type AIInsightCategory = 'retention' | 'performance' | 'compliance' | 'cost' | 'hiring' | 'training';

export interface Employee {
  id: string; employee_number: string; name_ar: string; name_en: string;
  email: string; phone: string; gender: Gender; nationality: string;
  national_id: string; iqama_number?: string; iqama_expiry?: string;
  passport_number?: string; passport_expiry?: string; date_of_birth: string;
  department: string; position: string; job_title_ar: string;
  manager_id?: string; manager_name?: string; status: EmployeeStatus;
  contract_type: ContractType; join_date: string; probation_end?: string;
  termination_date?: string; salary: number; housing_allowance: number;
  transport_allowance: number; gosi_number?: string; bank_name?: string;
  iban?: string; photo?: string; is_saudi: boolean; performance_score?: number;
  leave_balance: number; skills: string[]; certifications: string[];
  emergency_contact_name?: string; emergency_contact_phone?: string;
}

export interface LeaveRequest {
  id: string; employee_id: string; employee_name: string; department: string;
  type: LeaveType; start_date: string; end_date: string; days: number;
  status: LeaveStatus; reason: string; approved_by?: string; created_at: string;
}

export interface AttendanceRecord {
  id: string; employee_id: string; employee_name: string; department: string;
  date: string; check_in?: string; check_out?: string; working_hours: number;
  overtime_hours: number; status: 'present' | 'absent' | 'late' | 'early_leave' | 'holiday' | 'weekend';
  method: AttendanceMethod; location?: string;
}

export interface PayrollRecord {
  id: string; employee_id: string; employee_name: string; department: string;
  month: string; basic_salary: number; housing_allowance: number;
  transport_allowance: number; other_allowances: number; overtime_pay: number;
  gosi_deduction: number; tax_deduction: number; other_deductions: number;
  net_salary: number; status: PayrollStatus;
  wps_status: 'pending' | 'submitted' | 'confirmed' | 'rejected';
  payment_date?: string;
}

export interface JobOpening {
  id: string; title: string; department: string; location: string;
  type: ContractType; salary_range: string; description: string;
  requirements: string[]; status: 'open' | 'closed' | 'on_hold';
  applicants_count: number; created_at: string; deadline: string;
}

export interface Candidate {
  id: string; name: string; email: string; phone: string;
  job_id: string; job_title: string; stage: RecruitmentStage;
  ai_score: number; experience_years: number; skills: string[];
  resume_url?: string; applied_at: string; notes?: string;
}

export interface PerformanceReview {
  id: string; employee_id: string; employee_name: string; department: string;
  period: string; self_rating: PerformanceRating; manager_rating: PerformanceRating;
  final_rating: PerformanceRating;
  kpis: { name: string; target: number; actual: number; weight: number }[];
  strengths: string[]; improvements: string[]; goals: string[];
  status: 'draft' | 'self_review' | 'manager_review' | 'completed';
  reviewed_at?: string;
}

export interface Contract {
  id: string; employee_id: string; employee_name: string; type: ContractType;
  start_date: string; end_date: string; salary: number; status: ContractStatus;
  template: string; signed_date?: string; renewal_count: number; terms: string[];
}

export interface ComplianceItem {
  id: string; system: string; category: string; description: string;
  status: ComplianceStatus; due_date?: string; responsible: string;
  impact: 'high' | 'medium' | 'low'; last_checked: string;
}

export interface HRDocument {
  id: string; name: string; type: DocumentType; employee_id?: string;
  employee_name?: string; file_url: string; file_size: string;
  uploaded_at: string; expiry_date?: string;
  status: 'valid' | 'expired' | 'expiring_soon' | 'pending_review';
  ai_classified: boolean;
}

export interface OnboardingTask {
  id: string; employee_id: string; employee_name: string; step: OnboardingStep;
  task: string; description: string; status: 'pending' | 'in_progress' | 'completed';
  assigned_to: string; due_date: string; completed_at?: string;
}

export interface AIHRInsight {
  id: string; title: string; description: string; priority: AIInsightPriority;
  category: AIInsightCategory; impact: string; recommendation: string;
  confidence: number; created_at: string; status: 'new' | 'acknowledged' | 'resolved';
}

// Labels
export const statusLabels: Record<EmployeeStatus, string> = {
  active: 'نشط', probation: 'فترة تجربة', on_leave: 'في إجازة',
  suspended: 'موقوف', terminated: 'منتهي', resigned: 'مستقيل'
};
export const statusColors: Record<EmployeeStatus, string> = {
  active: 'bg-success/10 text-success border-success/20',
  probation: 'bg-warning/10 text-warning border-warning/20',
  on_leave: 'bg-info/10 text-info border-info/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
  terminated: 'bg-chrome/10 text-chrome border-chrome/20',
  resigned: 'bg-chrome/10 text-chrome border-chrome/20'
};
export const leaveTypeLabels: Record<LeaveType, string> = {
  annual: 'سنوية', sick: 'مرضية', emergency: 'طارئة', maternity: 'أمومة',
  paternity: 'أبوة', hajj: 'حج', unpaid: 'بدون راتب', bereavement: 'عزاء', marriage: 'زواج'
};
export const leaveStatusLabels: Record<LeaveStatus, string> = {
  pending: 'معلقة', approved: 'موافق عليها', rejected: 'مرفوضة', cancelled: 'ملغاة'
};
export const recruitmentStageLabels: Record<RecruitmentStage, string> = {
  new: 'جديد', screening: 'فرز', interview: 'مقابلة', technical_test: 'اختبار تقني',
  offer: 'عرض وظيفي', hired: 'تم التوظيف', rejected: 'مرفوض'
};
export const contractTypeLabels: Record<ContractType, string> = {
  full_time: 'دوام كامل', part_time: 'دوام جزئي', contract: 'عقد مؤقت',
  freelance: 'عمل حر', internship: 'تدريب'
};
export const documentTypeLabels: Record<DocumentType, string> = {
  national_id: 'هوية وطنية', passport: 'جواز سفر', iqama: 'إقامة',
  contract: 'عقد عمل', certificate: 'شهادة', medical: 'تقرير طبي',
  visa: 'تأشيرة', license: 'رخصة', other: 'أخرى'
};
export const onboardingStepLabels: Record<OnboardingStep, string> = {
  accounts: 'إنشاء الحسابات', documents: 'جمع المستندات', policies: 'توقيع السياسات',
  roles: 'تعيين الأدوار', systems: 'منح الوصول للأنظمة', orientation: 'جلسة التعريف'
};
