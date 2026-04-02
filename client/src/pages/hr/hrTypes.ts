/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — Enterprise HR System Types & Mock Data
 * ═══════════════════════════════════════════════════════════════════════════
 * Sovereign HR System — Saudi-compliant, AI-powered, Enterprise-grade
 * Compliant with: MHRSD, GOSI, Qiwa, Absher, Muqeem, WPS, ZATCA, PDPL
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── Core Enums ──────────────────────────────────────────────────────────────

export type EmploymentStatus = 'active' | 'probation' | 'on_leave' | 'suspended' | 'terminated' | 'resigned'
export type ContractType = 'full_time' | 'part_time' | 'seasonal' | 'freelancer' | 'internship'
export type Gender = 'male' | 'female'
export type Nationality = 'saudi' | 'non_saudi'
export type LeaveType = 'annual' | 'sick' | 'emergency' | 'maternity' | 'paternity' | 'hajj' | 'unpaid' | 'compassionate'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'early_leave' | 'remote' | 'holiday' | 'on_leave'

export const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  present: 'حاضر', absent: 'غائب', late: 'متأخر', early_leave: 'خروج مبكر',
  remote: 'عن بُعد', holiday: 'إجازة رسمية', on_leave: 'إجازة'
}
export type DocumentType = 'id_copy' | 'passport' | 'contract' | 'cv' | 'certificate' | 'nda' | 'policy' | 'medical' | 'iqama' | 'license' | 'other'
export type DocumentStatus = 'valid' | 'expiring_soon' | 'expired' | 'pending_review'
export type RecruitmentStage = 'job_request' | 'approval' | 'posting' | 'screening' | 'interview' | 'evaluation' | 'offer' | 'contract' | 'hired' | 'rejected'
export type PerformanceRating = 'exceptional' | 'exceeds' | 'meets' | 'below' | 'unsatisfactory'
export type ComplianceStatus = 'compliant' | 'warning' | 'violation' | 'pending'
export type OnboardingStep = 'account' | 'documents' | 'policies' | 'role_assignment' | 'system_access' | 'orientation' | 'completed'
export type PayrollStatus = 'draft' | 'processing' | 'approved' | 'paid' | 'failed'

// ─── Government Integration Status ──────────────────────────────────────────

export interface GovernmentData {
  iqama_number: string
  iqama_expiry: string
  iqama_status: 'valid' | 'expiring' | 'expired'
  absher_status: 'verified' | 'pending' | 'blocked'
  gosi_status: 'registered' | 'pending' | 'unregistered'
  gosi_subscription: number // monthly SAR
  qiwa_contract_status: 'active' | 'pending' | 'expired'
  qiwa_contract_id: string
  muqeem_status: 'valid' | 'expired' | 'pending' // for non-Saudi
  wps_status: 'active' | 'inactive'
  nitaqat_category: 'platinum' | 'green_high' | 'green_mid' | 'green_low' | 'yellow' | 'red'
}

// ─── Employee Master Profile ────────────────────────────────────────────────

export interface Employee {
  id: string
  employee_number: string
  full_name_ar: string
  full_name_en: string
  national_id: string
  gender: Gender
  nationality: Nationality
  nationality_name: string
  date_of_birth: string
  phone: string
  email: string
  personal_email: string
  address: string
  city: string
  emergency_contact: string
  emergency_phone: string
  photo_url: string

  // Employment
  department_id: string
  department_name: string
  job_title_ar: string
  job_title_en: string
  manager_id: string | null
  manager_name: string
  employment_status: EmploymentStatus
  contract_type: ContractType
  join_date: string
  probation_end_date: string | null
  termination_date: string | null
  work_location: string

  // Salary
  basic_salary: number
  housing_allowance: number
  transport_allowance: number
  food_allowance: number
  other_allowances: number
  total_salary: number
  gosi_deduction: number
  bank_name: string
  iban: string

  // Performance
  performance_score: number
  last_review_date: string | null
  performance_rating: PerformanceRating

  // Attendance
  attendance_rate: number
  leaves_taken: number
  leaves_balance: number

  // Government
  government: GovernmentData

  // AI Insights
  ai_risk_score: number // 0-100, higher = more risk of leaving
  ai_promotion_readiness: number // 0-100
  ai_training_needs: string[]
  ai_sentiment: 'positive' | 'neutral' | 'negative'

  // Metadata
  created_at: string
  updated_at: string
  created_by: string
}

// ─── Department ─────────────────────────────────────────────────────────────

export interface Department {
  id: string
  name_ar: string
  name_en: string
  head_id: string | null
  head_name: string
  employee_count: number
  budget: number
  saudization_rate: number
  performance_avg: number
  color: string
}

// ─── Document ───────────────────────────────────────────────────────────────

export interface HRDocument {
  id: string
  employee_id: string
  employee_name: string
  type: DocumentType
  title: string
  file_url: string
  file_size: string
  expiry_date: string | null
  status: DocumentStatus
  uploaded_at: string
  verified_by: string | null
  tags: string[]
}

// ─── Leave Request ──────────────────────────────────────────────────────────

export interface LeaveRequest {
  id: string
  employee_id: string
  employee_name: string
  department: string
  type: LeaveType
  start_date: string
  end_date: string
  days: number
  reason: string
  status: LeaveStatus
  approved_by: string | null
  substitute_id: string | null
  substitute_name: string | null
  created_at: string
}

// ─── Attendance Record ──────────────────────────────────────────────────────

export interface AttendanceRecord {
  id: string
  employee_id: string
  employee_name: string
  department: string
  date: string
  check_in: string | null
  check_out: string | null
  status: AttendanceStatus
  working_hours: number
  overtime_hours: number
  location: string
  is_remote: boolean
  method: 'biometric' | 'mobile' | 'web' | 'manual'
}

// ─── Recruitment ────────────────────────────────────────────────────────────

export interface JobPosting {
  id: string
  title_ar: string
  title_en: string
  department_id: string
  department_name: string
  description: string
  requirements: string[]
  salary_range: { min: number; max: number }
  contract_type: ContractType
  location: string
  stage: RecruitmentStage
  applicants_count: number
  posted_date: string
  closing_date: string
  hiring_manager: string
  status: 'open' | 'closed' | 'on_hold' | 'filled'
  ai_match_score: number
}

export interface Candidate {
  id: string
  job_id: string
  name: string
  email: string
  phone: string
  cv_url: string
  stage: RecruitmentStage
  ai_score: number
  interview_date: string | null
  evaluation_score: number | null
  notes: string
  applied_date: string
}

// ─── Performance Review ─────────────────────────────────────────────────────

export interface PerformanceReview {
  id: string
  employee_id: string
  employee_name: string
  reviewer_id: string
  reviewer_name: string
  period: string
  kpis: { name: string; target: number; actual: number; weight: number }[]
  self_score: number
  manager_score: number
  final_score: number
  rating: PerformanceRating
  strengths: string[]
  improvements: string[]
  ai_recommendations: string[]
  status: 'draft' | 'submitted' | 'reviewed' | 'approved'
  created_at: string
}

// ─── Contract ───────────────────────────────────────────────────────────────

export interface EmploymentContract {
  id: string
  employee_id: string
  employee_name: string
  contract_type: ContractType
  start_date: string
  end_date: string | null
  salary: number
  probation_months: number
  notice_period_days: number
  status: 'active' | 'expired' | 'terminated' | 'pending_renewal'
  signed_date: string | null
  qiwa_registered: boolean
  template_id: string
}

// ─── Payroll ────────────────────────────────────────────────────────────────

export interface PayrollRecord {
  id: string
  employee_id: string
  employee_name: string
  department: string
  month: string
  basic_salary: number
  housing: number
  transport: number
  food: number
  other_allowances: number
  overtime_pay: number
  bonus: number
  gross_salary: number
  gosi_employee: number
  gosi_employer: number
  absence_deduction: number
  loan_deduction: number
  other_deductions: number
  total_deductions: number
  net_salary: number
  status: PayrollStatus
  wps_reference: string | null
  paid_date: string | null
}

// ─── Compliance Alert ───────────────────────────────────────────────────────

export interface ComplianceAlert {
  id: string
  type: 'iqama_expiry' | 'contract_expiry' | 'gosi_issue' | 'qiwa_violation' | 'nitaqat_warning' | 'medical_expiry' | 'license_expiry' | 'pdpl_violation'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  employee_id: string | null
  employee_name: string | null
  due_date: string | null
  status: ComplianceStatus
  regulation: string
  action_required: string
  created_at: string
}

// ─── Onboarding ─────────────────────────────────────────────────────────────

export interface OnboardingTask {
  id: string
  employee_id: string
  employee_name: string
  step: OnboardingStep
  title: string
  description: string
  assigned_to: string
  completed: boolean
  completed_at: string | null
  due_date: string
  order: number
}

// ─── AI HR Insights ─────────────────────────────────────────────────────────

export interface AIHRInsight {
  id: string
  type: 'attrition_risk' | 'promotion_ready' | 'performance_anomaly' | 'training_need' | 'salary_benchmark' | 'workload_imbalance' | 'sentiment_alert'
  severity: 'critical' | 'high' | 'medium' | 'low'
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: string
  title: string
  description: string
  affected_employees: string[]
  recommendation: string
  impact: string
  confidence: number
  created_at: string
  acknowledged: boolean
}

// ─── HR Module Tab ──────────────────────────────────────────────────────────

export type HRTab = 'overview' | 'employees' | 'recruitment' | 'attendance' | 'leaves' | 'payroll' | 'performance' | 'contracts' | 'compliance' | 'documents' | 'onboarding' | 'ai_insights'

// ─── Labels & Colors ────────────────────────────────────────────────────────

export const employmentStatusLabels: Record<EmploymentStatus, string> = {
  active: 'نشط', probation: 'فترة تجربة', on_leave: 'إجازة',
  suspended: 'موقوف', terminated: 'منتهي الخدمة', resigned: 'مستقيل'
}
export const employmentStatusColors: Record<EmploymentStatus, string> = {
  active: 'bg-success/10 text-success border-success/20',
  probation: 'bg-info/10 text-info border-info/20',
  on_leave: 'bg-warning/10 text-warning border-warning/20',
  suspended: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  terminated: 'bg-danger/10 text-danger border-danger/20',
  resigned: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20'
}

export const contractTypeLabels: Record<ContractType, string> = {
  full_time: 'دوام كامل', part_time: 'دوام جزئي', seasonal: 'موسمي',
  freelancer: 'مستقل', internship: 'تدريب تعاوني'
}

export const leaveTypeLabels: Record<LeaveType, string> = {
  annual: 'سنوية', sick: 'مرضية', emergency: 'طارئة', maternity: 'أمومة',
  paternity: 'أبوة', hajj: 'حج', unpaid: 'بدون راتب', compassionate: 'عزاء'
}
export const leaveTypeColors: Record<LeaveType, string> = {
  annual: 'bg-blue-500/10 text-blue-500', sick: 'bg-red-500/10 text-red-500',
  emergency: 'bg-orange-500/10 text-orange-500', maternity: 'bg-pink-500/10 text-pink-500',
  paternity: 'bg-cyan-500/10 text-cyan-500', hajj: 'bg-emerald-500/10 text-emerald-500',
  unpaid: 'bg-gray-500/10 text-gray-500', compassionate: 'bg-purple-500/10 text-purple-500'
}

export const leaveStatusLabels: Record<LeaveStatus, string> = {
  pending: 'معلق', approved: 'موافق', rejected: 'مرفوض', cancelled: 'ملغى'
}

export const documentTypeLabels: Record<DocumentType, string> = {
  id_copy: 'صورة الهوية', passport: 'جواز السفر', contract: 'العقد',
  cv: 'السيرة الذاتية', certificate: 'شهادة', nda: 'اتفاقية سرية',
  policy: 'سياسة', medical: 'تقرير طبي', iqama: 'إقامة', license: 'رخصة', other: 'أخرى'
}

export const performanceRatingLabels: Record<PerformanceRating, string> = {
  exceptional: 'استثنائي', exceeds: 'يفوق التوقعات', meets: 'يحقق التوقعات',
  below: 'أقل من التوقعات', unsatisfactory: 'غير مرضٍ'
}
export const performanceRatingColors: Record<PerformanceRating, string> = {
  exceptional: 'text-emerald-400 bg-emerald-500/10',
  exceeds: 'text-success bg-success/10',
  meets: 'text-gold bg-gold/10',
  below: 'text-warning bg-warning/10',
  unsatisfactory: 'text-danger bg-danger/10'
}

export const recruitmentStageLabels: Record<RecruitmentStage, string> = {
  job_request: 'طلب وظيفة', approval: 'موافقة', posting: 'نشر',
  screening: 'فرز', interview: 'مقابلة', evaluation: 'تقييم',
  offer: 'عرض', contract: 'عقد', hired: 'تم التوظيف', rejected: 'مرفوض'
}

export const complianceAlertTypeLabels: Record<ComplianceAlert['type'], string> = {
  iqama_expiry: 'انتهاء إقامة', contract_expiry: 'انتهاء عقد',
  gosi_issue: 'مشكلة GOSI', qiwa_violation: 'مخالفة قوى',
  nitaqat_warning: 'تحذير نطاقات', medical_expiry: 'انتهاء فحص طبي',
  license_expiry: 'انتهاء رخصة', pdpl_violation: 'مخالفة حماية بيانات'
}

export const payrollStatusLabels: Record<PayrollStatus, string> = {
  draft: 'مسودة', processing: 'قيد المعالجة', approved: 'معتمد', paid: 'مدفوع', failed: 'فشل'
}
