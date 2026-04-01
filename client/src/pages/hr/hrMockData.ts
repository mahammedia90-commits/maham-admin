/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — Enterprise HR System Mock Data
 * ═══════════════════════════════════════════════════════════════════════════
 * Production-realistic data for Saudi market context
 * ═══════════════════════════════════════════════════════════════════════════
 */
import type {
  Employee, Department, HRDocument, LeaveRequest, AttendanceRecord,
  JobPosting, Candidate, PerformanceReview, EmploymentContract,
  PayrollRecord, ComplianceAlert, OnboardingTask, AIHRInsight
} from './hrTypes'

// ─── Departments ────────────────────────────────────────────────────────────

export const departments: Department[] = [
  { id: 'D001', name_ar: 'الإدارة التنفيذية', name_en: 'Executive Management', head_id: 'E001', head_name: 'نور كرم', employee_count: 4, budget: 450000, saudization_rate: 100, performance_avg: 95, color: '#C9A84C' },
  { id: 'D002', name_ar: 'تقنية المعلومات', name_en: 'Information Technology', head_id: 'E005', head_name: 'عمر الزهراني', employee_count: 8, budget: 380000, saudization_rate: 62, performance_avg: 91, color: '#3B82F6' },
  { id: 'D003', name_ar: 'المبيعات', name_en: 'Sales', head_id: 'E002', head_name: 'أحمد محمد الشهري', employee_count: 12, budget: 520000, saudization_rate: 75, performance_avg: 88, color: '#10B981' },
  { id: 'D004', name_ar: 'التسويق', name_en: 'Marketing', head_id: 'E003', head_name: 'سارة العلي', employee_count: 6, budget: 290000, saudization_rate: 83, performance_avg: 92, color: '#F59E0B' },
  { id: 'D005', name_ar: 'العمليات', name_en: 'Operations', head_id: 'E004', head_name: 'خالد الحربي', employee_count: 15, budget: 680000, saudization_rate: 53, performance_avg: 85, color: '#8B5CF6' },
  { id: 'D006', name_ar: 'المالية', name_en: 'Finance', head_id: 'E007', head_name: 'نورة السبيعي', employee_count: 5, budget: 240000, saudization_rate: 80, performance_avg: 93, color: '#EF4444' },
  { id: 'D007', name_ar: 'الموارد البشرية', name_en: 'Human Resources', head_id: 'E009', head_name: 'ريم الغامدي', employee_count: 4, budget: 180000, saudization_rate: 100, performance_avg: 90, color: '#EC4899' },
  { id: 'D008', name_ar: 'الشؤون القانونية', name_en: 'Legal Affairs', head_id: 'E008', head_name: 'ماجد القحطاني', employee_count: 3, budget: 200000, saudization_rate: 100, performance_avg: 89, color: '#6366F1' },
  { id: 'D009', name_ar: 'خدمة العملاء', name_en: 'Customer Service', head_id: 'E006', head_name: 'فاطمة أحمد', employee_count: 8, budget: 310000, saudization_rate: 62, performance_avg: 86, color: '#14B8A6' },
  { id: 'D010', name_ar: 'إدارة الفعاليات', name_en: 'Events Management', head_id: null, head_name: 'عبدالله الدوسري', employee_count: 10, budget: 450000, saudization_rate: 70, performance_avg: 87, color: '#F97316' },
]

// ─── Employees ──────────────────────────────────────────────────────────────

export const employees: Employee[] = [
  {
    id: 'E001', employee_number: 'MHM-2023-001', full_name_ar: 'نور كرم', full_name_en: 'Nour Karam',
    national_id: '1089XXXXXX', gender: 'male', nationality: 'saudi', nationality_name: 'سعودي',
    date_of_birth: '1990-03-15', phone: '+966501234567', email: 'nour@mahamexpo.sa',
    personal_email: 'nour.karam@gmail.com', address: 'حي الملقا، الرياض', city: 'الرياض',
    emergency_contact: 'محمد كرم', emergency_phone: '+966509876543', photo_url: '',
    department_id: 'D001', department_name: 'الإدارة التنفيذية', job_title_ar: 'المدير التنفيذي',
    job_title_en: 'Chief Executive Officer', manager_id: null, manager_name: '-',
    employment_status: 'active', contract_type: 'full_time', join_date: '2023-01-01',
    probation_end_date: null, termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 45000, housing_allowance: 11250, transport_allowance: 4500, food_allowance: 2000,
    other_allowances: 5000, total_salary: 67750, gosi_deduction: 4275, bank_name: 'البنك الأهلي السعودي',
    iban: 'SA44 2000 0001 2345 6789 0123',
    performance_score: 97, last_review_date: '2026-01-15', performance_rating: 'exceptional',
    attendance_rate: 98, leaves_taken: 5, leaves_balance: 25,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 4275,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2023-001',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'platinum'
    },
    ai_risk_score: 5, ai_promotion_readiness: 100, ai_training_needs: ['قيادة استراتيجية متقدمة'],
    ai_sentiment: 'positive', created_at: '2023-01-01', updated_at: '2026-03-28', created_by: 'system'
  },
  {
    id: 'E002', employee_number: 'MHM-2024-002', full_name_ar: 'أحمد محمد الشهري', full_name_en: 'Ahmed Al-Shahri',
    national_id: '1095XXXXXX', gender: 'male', nationality: 'saudi', nationality_name: 'سعودي',
    date_of_birth: '1992-07-22', phone: '+966502345678', email: 'ahmed@mahamexpo.sa',
    personal_email: 'ahmed.shahri@gmail.com', address: 'حي النرجس، الرياض', city: 'الرياض',
    emergency_contact: 'محمد الشهري', emergency_phone: '+966508765432', photo_url: '',
    department_id: 'D003', department_name: 'المبيعات', job_title_ar: 'مدير المبيعات',
    job_title_en: 'Sales Director', manager_id: 'E001', manager_name: 'نور كرم',
    employment_status: 'active', contract_type: 'full_time', join_date: '2024-03-15',
    probation_end_date: '2024-06-15', termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 18000, housing_allowance: 4500, transport_allowance: 1800, food_allowance: 1000,
    other_allowances: 2000, total_salary: 27300, gosi_deduction: 1710, bank_name: 'مصرف الراجحي',
    iban: 'SA55 8000 0001 2345 6789 0234',
    performance_score: 92, last_review_date: '2026-01-15', performance_rating: 'exceeds',
    attendance_rate: 96, leaves_taken: 8, leaves_balance: 22,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 1710,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2024-002',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'platinum'
    },
    ai_risk_score: 12, ai_promotion_readiness: 78, ai_training_needs: ['إدارة فرق كبيرة', 'تحليل بيانات المبيعات'],
    ai_sentiment: 'positive', created_at: '2024-03-15', updated_at: '2026-03-28', created_by: 'E009'
  },
  {
    id: 'E003', employee_number: 'MHM-2024-003', full_name_ar: 'سارة العلي', full_name_en: 'Sara Al-Ali',
    national_id: '1098XXXXXX', gender: 'female', nationality: 'saudi', nationality_name: 'سعودية',
    date_of_birth: '1994-11-08', phone: '+966503456789', email: 'sara@mahamexpo.sa',
    personal_email: 'sara.alali@gmail.com', address: 'حي الياسمين، الرياض', city: 'الرياض',
    emergency_contact: 'فهد العلي', emergency_phone: '+966507654321', photo_url: '',
    department_id: 'D004', department_name: 'التسويق', job_title_ar: 'مديرة التسويق',
    job_title_en: 'Marketing Director', manager_id: 'E001', manager_name: 'نور كرم',
    employment_status: 'active', contract_type: 'full_time', join_date: '2024-06-01',
    probation_end_date: '2024-09-01', termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 16000, housing_allowance: 4000, transport_allowance: 1600, food_allowance: 1000,
    other_allowances: 1500, total_salary: 24100, gosi_deduction: 1520, bank_name: 'بنك الرياض',
    iban: 'SA66 1000 0001 2345 6789 0345',
    performance_score: 95, last_review_date: '2026-01-15', performance_rating: 'exceptional',
    attendance_rate: 98, leaves_taken: 4, leaves_balance: 26,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 1520,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2024-003',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'platinum'
    },
    ai_risk_score: 8, ai_promotion_readiness: 85, ai_training_needs: ['تسويق رقمي متقدم'],
    ai_sentiment: 'positive', created_at: '2024-06-01', updated_at: '2026-03-28', created_by: 'E009'
  },
  {
    id: 'E004', employee_number: 'MHM-2025-004', full_name_ar: 'خالد الحربي', full_name_en: 'Khalid Al-Harbi',
    national_id: '1091XXXXXX', gender: 'male', nationality: 'saudi', nationality_name: 'سعودي',
    date_of_birth: '1988-04-12', phone: '+966504567890', email: 'khalid@mahamexpo.sa',
    personal_email: 'khalid.harbi@gmail.com', address: 'حي العليا، الرياض', city: 'الرياض',
    emergency_contact: 'سعد الحربي', emergency_phone: '+966506543210', photo_url: '',
    department_id: 'D005', department_name: 'العمليات', job_title_ar: 'مدير العمليات',
    job_title_en: 'Operations Manager', manager_id: 'E001', manager_name: 'نور كرم',
    employment_status: 'active', contract_type: 'full_time', join_date: '2025-01-10',
    probation_end_date: '2025-04-10', termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 14000, housing_allowance: 3500, transport_allowance: 1400, food_allowance: 1000,
    other_allowances: 1200, total_salary: 21100, gosi_deduction: 1330, bank_name: 'البنك السعودي الفرنسي',
    iban: 'SA77 5500 0001 2345 6789 0456',
    performance_score: 88, last_review_date: '2026-01-15', performance_rating: 'meets',
    attendance_rate: 94, leaves_taken: 6, leaves_balance: 24,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 1330,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2025-004',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'green_high'
    },
    ai_risk_score: 22, ai_promotion_readiness: 65, ai_training_needs: ['إدارة سلسلة الإمداد', 'Six Sigma'],
    ai_sentiment: 'neutral', created_at: '2025-01-10', updated_at: '2026-03-28', created_by: 'E009'
  },
  {
    id: 'E005', employee_number: 'MHM-2024-005', full_name_ar: 'عمر الزهراني', full_name_en: 'Omar Al-Zahrani',
    national_id: '1093XXXXXX', gender: 'male', nationality: 'saudi', nationality_name: 'سعودي',
    date_of_birth: '1991-09-03', phone: '+966505678901', email: 'omar@mahamexpo.sa',
    personal_email: 'omar.zahrani@gmail.com', address: 'حي الصحافة، الرياض', city: 'الرياض',
    emergency_contact: 'يوسف الزهراني', emergency_phone: '+966505432109', photo_url: '',
    department_id: 'D002', department_name: 'تقنية المعلومات', job_title_ar: 'مدير تقنية المعلومات',
    job_title_en: 'IT Director', manager_id: 'E001', manager_name: 'نور كرم',
    employment_status: 'active', contract_type: 'full_time', join_date: '2024-01-05',
    probation_end_date: null, termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 20000, housing_allowance: 5000, transport_allowance: 2000, food_allowance: 1000,
    other_allowances: 3000, total_salary: 31000, gosi_deduction: 1900, bank_name: 'البنك الأهلي السعودي',
    iban: 'SA88 2000 0001 2345 6789 0567',
    performance_score: 94, last_review_date: '2026-01-15', performance_rating: 'exceeds',
    attendance_rate: 97, leaves_taken: 3, leaves_balance: 27,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 1900,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2024-005',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'platinum'
    },
    ai_risk_score: 10, ai_promotion_readiness: 90, ai_training_needs: ['هندسة الذكاء الاصطناعي', 'أمن سيبراني'],
    ai_sentiment: 'positive', created_at: '2024-01-05', updated_at: '2026-03-28', created_by: 'E009'
  },
  {
    id: 'E006', employee_number: 'MHM-2025-006', full_name_ar: 'فاطمة أحمد', full_name_en: 'Fatima Ahmed',
    national_id: '2XXXXXXXXX', gender: 'female', nationality: 'non_saudi', nationality_name: 'مصرية',
    date_of_birth: '1995-02-18', phone: '+966506789012', email: 'fatima@mahamexpo.sa',
    personal_email: 'fatima.ahmed@gmail.com', address: 'حي الورود، جدة', city: 'جدة',
    emergency_contact: 'أحمد محمود', emergency_phone: '+966504321098', photo_url: '',
    department_id: 'D009', department_name: 'خدمة العملاء', job_title_ar: 'مديرة خدمة العملاء',
    job_title_en: 'Customer Service Manager', manager_id: 'E001', manager_name: 'نور كرم',
    employment_status: 'active', contract_type: 'full_time', join_date: '2025-04-20',
    probation_end_date: '2025-07-20', termination_date: null, work_location: 'فرع جدة',
    basic_salary: 12000, housing_allowance: 3000, transport_allowance: 1200, food_allowance: 800,
    other_allowances: 1000, total_salary: 18000, gosi_deduction: 1140, bank_name: 'مصرف الراجحي',
    iban: 'SA99 8000 0001 2345 6789 0678',
    performance_score: 85, last_review_date: '2026-01-15', performance_rating: 'meets',
    attendance_rate: 92, leaves_taken: 7, leaves_balance: 23,
    government: {
      iqama_number: '2456789012', iqama_expiry: '2026-08-15', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 1140,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2025-006',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'green_high'
    },
    ai_risk_score: 18, ai_promotion_readiness: 55, ai_training_needs: ['إدارة شكاوى متقدمة', 'اللغة الإنجليزية'],
    ai_sentiment: 'neutral', created_at: '2025-04-20', updated_at: '2026-03-28', created_by: 'E009'
  },
  {
    id: 'E007', employee_number: 'MHM-2025-007', full_name_ar: 'نورة السبيعي', full_name_en: 'Noura Al-Subaie',
    national_id: '1097XXXXXX', gender: 'female', nationality: 'saudi', nationality_name: 'سعودية',
    date_of_birth: '1993-06-25', phone: '+966507890123', email: 'noura@mahamexpo.sa',
    personal_email: 'noura.subaie@gmail.com', address: 'حي الربيع، الرياض', city: 'الرياض',
    emergency_contact: 'عبدالله السبيعي', emergency_phone: '+966503210987', photo_url: '',
    department_id: 'D006', department_name: 'المالية', job_title_ar: 'المديرة المالية',
    job_title_en: 'Finance Director', manager_id: 'E001', manager_name: 'نور كرم',
    employment_status: 'active', contract_type: 'full_time', join_date: '2025-02-15',
    probation_end_date: '2025-05-15', termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 13000, housing_allowance: 3250, transport_allowance: 1300, food_allowance: 800,
    other_allowances: 1500, total_salary: 19850, gosi_deduction: 1235, bank_name: 'بنك الرياض',
    iban: 'SA11 1000 0001 2345 6789 0789',
    performance_score: 91, last_review_date: '2026-01-15', performance_rating: 'exceeds',
    attendance_rate: 99, leaves_taken: 2, leaves_balance: 28,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 1235,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2025-007',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'platinum'
    },
    ai_risk_score: 7, ai_promotion_readiness: 72, ai_training_needs: ['IFRS المتقدم', 'تحليل مالي'],
    ai_sentiment: 'positive', created_at: '2025-02-15', updated_at: '2026-03-28', created_by: 'E009'
  },
  {
    id: 'E008', employee_number: 'MHM-2023-008', full_name_ar: 'ماجد القحطاني', full_name_en: 'Majed Al-Qahtani',
    national_id: '1087XXXXXX', gender: 'male', nationality: 'saudi', nationality_name: 'سعودي',
    date_of_birth: '1985-12-10', phone: '+966508901234', email: 'majed@mahamexpo.sa',
    personal_email: 'majed.qahtani@gmail.com', address: 'حي السفارات، الرياض', city: 'الرياض',
    emergency_contact: 'سلطان القحطاني', emergency_phone: '+966502109876', photo_url: '',
    department_id: 'D008', department_name: 'الشؤون القانونية', job_title_ar: 'المستشار القانوني',
    job_title_en: 'Legal Counsel', manager_id: 'E001', manager_name: 'نور كرم',
    employment_status: 'on_leave', contract_type: 'full_time', join_date: '2023-11-01',
    probation_end_date: null, termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 22000, housing_allowance: 5500, transport_allowance: 2200, food_allowance: 1000,
    other_allowances: 3000, total_salary: 33700, gosi_deduction: 2090, bank_name: 'البنك السعودي البريطاني',
    iban: 'SA22 4500 0001 2345 6789 0890',
    performance_score: 87, last_review_date: '2025-12-15', performance_rating: 'meets',
    attendance_rate: 90, leaves_taken: 12, leaves_balance: 18,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 2090,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2023-008',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'platinum'
    },
    ai_risk_score: 35, ai_promotion_readiness: 60, ai_training_needs: ['نظام العمل السعودي الجديد'],
    ai_sentiment: 'neutral', created_at: '2023-11-01', updated_at: '2026-03-28', created_by: 'system'
  },
  {
    id: 'E009', employee_number: 'MHM-2024-009', full_name_ar: 'ريم الغامدي', full_name_en: 'Reem Al-Ghamdi',
    national_id: '1096XXXXXX', gender: 'female', nationality: 'saudi', nationality_name: 'سعودية',
    date_of_birth: '1993-08-14', phone: '+966509012345', email: 'reem@mahamexpo.sa',
    personal_email: 'reem.ghamdi@gmail.com', address: 'حي الملقا، الرياض', city: 'الرياض',
    emergency_contact: 'عائشة الغامدي', emergency_phone: '+966501098765', photo_url: '',
    department_id: 'D007', department_name: 'الموارد البشرية', job_title_ar: 'مديرة الموارد البشرية',
    job_title_en: 'HR Director', manager_id: 'E001', manager_name: 'نور كرم',
    employment_status: 'active', contract_type: 'full_time', join_date: '2024-08-10',
    probation_end_date: '2024-11-10', termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 17000, housing_allowance: 4250, transport_allowance: 1700, food_allowance: 1000,
    other_allowances: 2000, total_salary: 25950, gosi_deduction: 1615, bank_name: 'البنك الأهلي السعودي',
    iban: 'SA33 2000 0001 2345 6789 0901',
    performance_score: 93, last_review_date: '2026-01-15', performance_rating: 'exceeds',
    attendance_rate: 95, leaves_taken: 5, leaves_balance: 25,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 1615,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2024-009',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'platinum'
    },
    ai_risk_score: 9, ai_promotion_readiness: 82, ai_training_needs: ['SHRM-SCP', 'تحليلات الموارد البشرية'],
    ai_sentiment: 'positive', created_at: '2024-08-10', updated_at: '2026-03-28', created_by: 'E001'
  },
  {
    id: 'E010', employee_number: 'MHM-2025-010', full_name_ar: 'تركي الشمري', full_name_en: 'Turki Al-Shammari',
    national_id: '1099XXXXXX', gender: 'male', nationality: 'saudi', nationality_name: 'سعودي',
    date_of_birth: '1997-01-20', phone: '+966510123456', email: 'turki@mahamexpo.sa',
    personal_email: 'turki.shammari@gmail.com', address: 'حي الملز، الرياض', city: 'الدمام',
    emergency_contact: 'فيصل الشمري', emergency_phone: '+966500987654', photo_url: '',
    department_id: 'D003', department_name: 'المبيعات', job_title_ar: 'مندوب مبيعات',
    job_title_en: 'Sales Representative', manager_id: 'E002', manager_name: 'أحمد محمد الشهري',
    employment_status: 'active', contract_type: 'full_time', join_date: '2025-06-01',
    probation_end_date: '2025-09-01', termination_date: null, work_location: 'فرع الدمام',
    basic_salary: 10000, housing_allowance: 2500, transport_allowance: 1000, food_allowance: 500,
    other_allowances: 800, total_salary: 14800, gosi_deduction: 950, bank_name: 'مصرف الراجحي',
    iban: 'SA44 8000 0001 2345 6789 1012',
    performance_score: 78, last_review_date: '2026-01-15', performance_rating: 'meets',
    attendance_rate: 88, leaves_taken: 8, leaves_balance: 22,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 950,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2025-010',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'green_high'
    },
    ai_risk_score: 42, ai_promotion_readiness: 35, ai_training_needs: ['مهارات التفاوض', 'إدارة الوقت', 'CRM متقدم'],
    ai_sentiment: 'negative', created_at: '2025-06-01', updated_at: '2026-03-28', created_by: 'E009'
  },
  {
    id: 'E011', employee_number: 'MHM-2026-011', full_name_ar: 'هند المطيري', full_name_en: 'Hind Al-Mutairi',
    national_id: '1100XXXXXX', gender: 'female', nationality: 'saudi', nationality_name: 'سعودية',
    date_of_birth: '1998-05-30', phone: '+966511234567', email: 'hind@mahamexpo.sa',
    personal_email: 'hind.mutairi@gmail.com', address: 'حي الروضة، الرياض', city: 'الرياض',
    emergency_contact: 'منيرة المطيري', emergency_phone: '+966500876543', photo_url: '',
    department_id: 'D004', department_name: 'التسويق', job_title_ar: 'مصممة جرافيك',
    job_title_en: 'Graphic Designer', manager_id: 'E003', manager_name: 'سارة العلي',
    employment_status: 'probation', contract_type: 'full_time', join_date: '2026-01-15',
    probation_end_date: '2026-04-15', termination_date: null, work_location: 'المقر الرئيسي — الرياض',
    basic_salary: 11000, housing_allowance: 2750, transport_allowance: 1100, food_allowance: 500,
    other_allowances: 800, total_salary: 16150, gosi_deduction: 1045, bank_name: 'بنك الرياض',
    iban: 'SA55 1000 0001 2345 6789 1123',
    performance_score: 82, last_review_date: null, performance_rating: 'meets',
    attendance_rate: 100, leaves_taken: 0, leaves_balance: 30,
    government: {
      iqama_number: '-', iqama_expiry: '-', iqama_status: 'valid',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 1045,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2026-011',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'platinum'
    },
    ai_risk_score: 15, ai_promotion_readiness: 30, ai_training_needs: ['Adobe Creative Suite', 'UI/UX Design'],
    ai_sentiment: 'positive', created_at: '2026-01-15', updated_at: '2026-03-28', created_by: 'E009'
  },
  {
    id: 'E012', employee_number: 'MHM-2024-012', full_name_ar: 'راشد الدوسري', full_name_en: 'Rashed Al-Dosari',
    national_id: '2XXXXXXXXX', gender: 'male', nationality: 'non_saudi', nationality_name: 'أردني',
    date_of_birth: '1990-10-05', phone: '+966512345678', email: 'rashed@mahamexpo.sa',
    personal_email: 'rashed.dosari@gmail.com', address: 'حي السلامة، جدة', city: 'جدة',
    emergency_contact: 'أحمد الدوسري', emergency_phone: '+966500765432', photo_url: '',
    department_id: 'D005', department_name: 'العمليات', job_title_ar: 'مشرف لوجستي',
    job_title_en: 'Logistics Supervisor', manager_id: 'E004', manager_name: 'خالد الحربي',
    employment_status: 'active', contract_type: 'full_time', join_date: '2024-09-01',
    probation_end_date: '2024-12-01', termination_date: null, work_location: 'فرع جدة',
    basic_salary: 9000, housing_allowance: 2250, transport_allowance: 900, food_allowance: 500,
    other_allowances: 600, total_salary: 13250, gosi_deduction: 855, bank_name: 'البنك الأهلي السعودي',
    iban: 'SA66 2000 0001 2345 6789 1234',
    performance_score: 84, last_review_date: '2026-01-15', performance_rating: 'meets',
    attendance_rate: 93, leaves_taken: 6, leaves_balance: 24,
    government: {
      iqama_number: '2567890123', iqama_expiry: '2026-06-30', iqama_status: 'expiring',
      absher_status: 'verified', gosi_status: 'registered', gosi_subscription: 855,
      qiwa_contract_status: 'active', qiwa_contract_id: 'QW-2024-012',
      muqeem_status: 'valid', wps_status: 'active', nitaqat_category: 'green_mid'
    },
    ai_risk_score: 28, ai_promotion_readiness: 50, ai_training_needs: ['إدارة المخازن', 'السلامة المهنية'],
    ai_sentiment: 'neutral', created_at: '2024-09-01', updated_at: '2026-03-28', created_by: 'E009'
  },
]

// ─── Leave Requests ─────────────────────────────────────────────────────────

export const leaveRequests: LeaveRequest[] = [
  { id: 'LR001', employee_id: 'E008', employee_name: 'ماجد القحطاني', department: 'الشؤون القانونية', type: 'annual', start_date: '2026-03-25', end_date: '2026-04-05', days: 10, reason: 'إجازة سنوية — سفر عائلي', status: 'approved', approved_by: 'نور كرم', substitute_id: 'E009', substitute_name: 'ريم الغامدي', created_at: '2026-03-20' },
  { id: 'LR002', employee_id: 'E010', employee_name: 'تركي الشمري', department: 'المبيعات', type: 'sick', start_date: '2026-03-28', end_date: '2026-03-30', days: 3, reason: 'تقرير طبي — إنفلونزا', status: 'approved', approved_by: 'أحمد محمد الشهري', substitute_id: null, substitute_name: null, created_at: '2026-03-28' },
  { id: 'LR003', employee_id: 'E003', employee_name: 'سارة العلي', department: 'التسويق', type: 'annual', start_date: '2026-04-10', end_date: '2026-04-14', days: 5, reason: 'إجازة شخصية', status: 'pending', approved_by: null, substitute_id: 'E011', substitute_name: 'هند المطيري', created_at: '2026-03-30' },
  { id: 'LR004', employee_id: 'E012', employee_name: 'راشد الدوسري', department: 'العمليات', type: 'hajj', start_date: '2026-06-01', end_date: '2026-06-15', days: 15, reason: 'إجازة حج', status: 'pending', approved_by: null, substitute_id: null, substitute_name: null, created_at: '2026-03-29' },
  { id: 'LR005', employee_id: 'E006', employee_name: 'فاطمة أحمد', department: 'خدمة العملاء', type: 'emergency', start_date: '2026-03-15', end_date: '2026-03-17', days: 3, reason: 'ظرف عائلي طارئ', status: 'approved', approved_by: 'نور كرم', substitute_id: null, substitute_name: null, created_at: '2026-03-15' },
  { id: 'LR006', employee_id: 'E002', employee_name: 'أحمد محمد الشهري', department: 'المبيعات', type: 'annual', start_date: '2026-04-20', end_date: '2026-04-25', days: 5, reason: 'إجازة عيد الفطر', status: 'pending', approved_by: null, substitute_id: 'E010', substitute_name: 'تركي الشمري', created_at: '2026-03-31' },
]

// ─── Job Postings ───────────────────────────────────────────────────────────

export const jobPostings: JobPosting[] = [
  { id: 'JP001', title_ar: 'مهندس برمجيات أول', title_en: 'Senior Software Engineer', department_id: 'D002', department_name: 'تقنية المعلومات', description: 'تطوير وصيانة منصة Maham Expo الرقمية', requirements: ['خبرة 5+ سنوات في React/TypeScript', 'خبرة في Node.js و PostgreSQL', 'معرفة بـ AWS/GCP', 'خبرة في CI/CD'], salary_range: { min: 18000, max: 25000 }, contract_type: 'full_time', location: 'الرياض', stage: 'interview', applicants_count: 45, posted_date: '2026-03-01', closing_date: '2026-04-15', hiring_manager: 'عمر الزهراني', status: 'open', ai_match_score: 82 },
  { id: 'JP002', title_ar: 'مدير فعاليات', title_en: 'Events Manager', department_id: 'D010', department_name: 'إدارة الفعاليات', description: 'إدارة وتنسيق المعارض والفعاليات الكبرى', requirements: ['خبرة 3+ سنوات في إدارة الفعاليات', 'مهارات تواصل ممتازة', 'خبرة في إدارة الميزانيات', 'رخصة قيادة'], salary_range: { min: 14000, max: 20000 }, contract_type: 'full_time', location: 'الرياض', stage: 'screening', applicants_count: 78, posted_date: '2026-03-10', closing_date: '2026-04-30', hiring_manager: 'عبدالله الدوسري', status: 'open', ai_match_score: 75 },
  { id: 'JP003', title_ar: 'محلل بيانات', title_en: 'Data Analyst', department_id: 'D006', department_name: 'المالية', description: 'تحليل البيانات المالية وإعداد التقارير', requirements: ['خبرة في Python/SQL', 'معرفة بـ Power BI/Tableau', 'خلفية مالية', 'شهادة بكالوريوس'], salary_range: { min: 12000, max: 16000 }, contract_type: 'full_time', location: 'الرياض', stage: 'posting', applicants_count: 23, posted_date: '2026-03-20', closing_date: '2026-05-01', hiring_manager: 'نورة السبيعي', status: 'open', ai_match_score: 68 },
  { id: 'JP004', title_ar: 'مصمم UX/UI', title_en: 'UX/UI Designer', department_id: 'D004', department_name: 'التسويق', description: 'تصميم واجهات المستخدم لمنصات Maham', requirements: ['خبرة في Figma/Sketch', 'فهم عميق لـ UX Research', 'خبرة 2+ سنوات', 'بورتفوليو قوي'], salary_range: { min: 10000, max: 15000 }, contract_type: 'full_time', location: 'الرياض', stage: 'evaluation', applicants_count: 56, posted_date: '2026-02-15', closing_date: '2026-04-01', hiring_manager: 'سارة العلي', status: 'open', ai_match_score: 88 },
]

export const candidates: Candidate[] = [
  { id: 'C001', job_id: 'JP001', name: 'محمد الراشد', email: 'mrashed@gmail.com', phone: '+966551234567', cv_url: '#', stage: 'interview', ai_score: 92, interview_date: '2026-04-02', evaluation_score: null, notes: 'خبرة ممتازة في React — AI يوصي بشدة', applied_date: '2026-03-05' },
  { id: 'C002', job_id: 'JP001', name: 'عبدالرحمن السالم', email: 'arsalem@gmail.com', phone: '+966552345678', cv_url: '#', stage: 'interview', ai_score: 85, interview_date: '2026-04-03', evaluation_score: null, notes: 'خلفية قوية في backend', applied_date: '2026-03-08' },
  { id: 'C003', job_id: 'JP001', name: 'لينا الخالدي', email: 'lkhalidi@gmail.com', phone: '+966553456789', cv_url: '#', stage: 'screening', ai_score: 78, interview_date: null, evaluation_score: null, notes: 'خبرة 3 سنوات — تحتاج تقييم إضافي', applied_date: '2026-03-12' },
  { id: 'C004', job_id: 'JP004', name: 'دانا العتيبي', email: 'dotaibi@gmail.com', phone: '+966554567890', cv_url: '#', stage: 'evaluation', ai_score: 95, interview_date: '2026-03-28', evaluation_score: 88, notes: 'بورتفوليو استثنائي — AI يوصي بالتوظيف', applied_date: '2026-02-20' },
  { id: 'C005', job_id: 'JP002', name: 'فهد المالكي', email: 'fmalki@gmail.com', phone: '+966555678901', cv_url: '#', stage: 'screening', ai_score: 72, interview_date: null, evaluation_score: null, notes: 'خبرة في إدارة الفعاليات الرياضية', applied_date: '2026-03-15' },
]

// ─── Compliance Alerts ──────────────────────────────────────────────────────

export const complianceAlerts: ComplianceAlert[] = [
  { id: 'CA001', type: 'iqama_expiry', severity: 'high', title: 'إقامة راشد الدوسري تنتهي خلال 90 يوم', description: 'يجب تجديد إقامة الموظف قبل 30/06/2026', employee_id: 'E012', employee_name: 'راشد الدوسري', due_date: '2026-06-30', status: 'warning', regulation: 'نظام الإقامة — وزارة الداخلية', action_required: 'تقديم طلب تجديد عبر منصة مقيم', created_at: '2026-03-28' },
  { id: 'CA002', type: 'contract_expiry', severity: 'medium', title: 'عقد فاطمة أحمد ينتهي خلال 120 يوم', description: 'يجب تجديد أو إنهاء العقد قبل انتهائه', employee_id: 'E006', employee_name: 'فاطمة أحمد', due_date: '2026-07-20', status: 'pending', regulation: 'نظام العمل — المادة 55', action_required: 'مراجعة العقد وتقديم عرض تجديد', created_at: '2026-03-25' },
  { id: 'CA003', type: 'nitaqat_warning', severity: 'medium', title: 'نسبة السعودة في قسم العمليات أقل من المطلوب', description: 'نسبة السعودة الحالية 53% — المطلوب 60% حسب نطاقات', employee_id: null, employee_name: null, due_date: '2026-06-01', status: 'warning', regulation: 'برنامج نطاقات — وزارة الموارد البشرية', action_required: 'توظيف 2 سعوديين إضافيين في قسم العمليات', created_at: '2026-03-20' },
  { id: 'CA004', type: 'gosi_issue', severity: 'low', title: 'تحديث بيانات GOSI للموظفين الجدد', description: 'يجب تسجيل هند المطيري في التأمينات الاجتماعية', employee_id: 'E011', employee_name: 'هند المطيري', due_date: '2026-04-15', status: 'pending', regulation: 'نظام التأمينات الاجتماعية', action_required: 'تسجيل الموظفة عبر بوابة GOSI', created_at: '2026-03-15' },
  { id: 'CA005', type: 'pdpl_violation', severity: 'critical', title: 'تحديث سياسة حماية البيانات الشخصية', description: 'يجب تحديث سياسة PDPL وتوقيع جميع الموظفين عليها', employee_id: null, employee_name: null, due_date: '2026-04-30', status: 'violation', regulation: 'نظام حماية البيانات الشخصية (PDPL) — SDAIA', action_required: 'تحديث السياسة وإرسالها لجميع الموظفين للتوقيع', created_at: '2026-03-10' },
  { id: 'CA006', type: 'medical_expiry', severity: 'medium', title: 'انتهاء الفحص الطبي لـ 3 موظفين', description: 'يجب تجديد الفحوصات الطبية السنوية', employee_id: null, employee_name: null, due_date: '2026-05-15', status: 'warning', regulation: 'اشتراطات الصحة المهنية — وزارة الصحة', action_required: 'جدولة مواعيد فحص طبي للموظفين المعنيين', created_at: '2026-03-22' },
]

// ─── AI HR Insights ─────────────────────────────────────────────────────────

export const aiInsights: AIHRInsight[] = [
  { id: 'AI001', type: 'attrition_risk', severity: 'high', priority: 'high', category: 'الاحتفاظ بالمواهب', title: 'خطر استقالة تركي الشمري', description: 'AI يكتشف انخفاض في الأداء (78%) مع ارتفاع الغياب. احتمال الاستقالة خلال 90 يوم: 42%', affected_employees: ['E010'], recommendation: 'جلسة تطوير مهني + مراجعة الراتب + تحديد مسار وظيفي واضح', impact: 'فقدان موظف بخبرة 2+ سنة — تكلفة استبدال تقديرية: 45,000 ر.س', confidence: 85, created_at: '2026-03-28', acknowledged: false },
  { id: 'AI002', type: 'promotion_ready', severity: 'low', priority: 'medium', category: 'التطوير الوظيفي', title: 'سارة العلي جاهزة للترقية', description: 'أداء استثنائي (95%) لمدة 18 شهر متواصل مع مهارات قيادية واضحة', affected_employees: ['E003'], recommendation: 'ترقية إلى نائب الرئيس التنفيذي للتسويق مع زيادة 15%', impact: 'تحسين الإنتاجية 20% + تقليل خطر الاستقالة', confidence: 92, created_at: '2026-03-27', acknowledged: false },
  { id: 'AI003', type: 'salary_benchmark', severity: 'medium', priority: 'high', category: 'التعويضات', title: 'رواتب قسم IT أقل من السوق بـ 12%', description: 'مقارنة مع بيانات السوق السعودي، رواتب قسم تقنية المعلومات أقل من المتوسط', affected_employees: ['E005'], recommendation: 'مراجعة هيكل الرواتب لقسم IT لتجنب فقدان الكفاءات', impact: 'خطر فقدان 3 مطورين خلال 6 أشهر — تكلفة تقديرية: 180,000 ر.س', confidence: 78, created_at: '2026-03-26', acknowledged: true },
  { id: 'AI004', type: 'workload_imbalance', severity: 'medium', priority: 'medium', category: 'الإنتاجية', title: 'عدم توازن في توزيع العمل — قسم العمليات', description: 'خالد الحربي يتحمل 40% من مهام القسم بينما 3 موظفين آخرين بنسبة أقل من 15%', affected_employees: ['E004'], recommendation: 'إعادة توزيع المهام وتعيين مشرف إضافي', impact: 'خطر إرهاق وظيفي + انخفاض جودة العمل 15%', confidence: 88, created_at: '2026-03-25', acknowledged: false },
  { id: 'AI005', type: 'training_need', severity: 'low', priority: 'low', category: 'التدريب والتطوير', title: 'فجوة مهارات في التحول الرقمي', description: '35% من الموظفين يحتاجون تدريب على أدوات الذكاء الاصطناعي والأتمتة', affected_employees: ['E004', 'E006', 'E010', 'E012'], recommendation: 'برنامج تدريبي شامل على AI Tools + Automation — مدة 3 أشهر', impact: 'زيادة الإنتاجية 25% + تقليل الأخطاء اليدوية 40%', confidence: 90, created_at: '2026-03-24', acknowledged: false },
  { id: 'AI006', type: 'sentiment_alert', severity: 'high', priority: 'high', category: 'رضا الموظفين', title: 'انخفاض رضا الموظفين في فرع جدة', description: 'تحليل المشاعر يظهر انخفاض الرضا بنسبة 18% في فرع جدة خلال الشهرين الماضيين', affected_employees: ['E006', 'E012'], recommendation: 'زيارة ميدانية + استبيان رضا + جلسات استماع مع الموظفين', impact: 'خطر استقالة جماعية + انخفاض الإنتاجية 30%', confidence: 82, created_at: '2026-03-23', acknowledged: false },
]

// ─── Payroll Records (March 2026) ───────────────────────────────────────────

export const payrollRecords: PayrollRecord[] = employees.map(emp => ({
  id: `PR-${emp.id}-2026-03`,
  employee_id: emp.id,
  employee_name: emp.full_name_ar,
  department: emp.department_name,
  month: '2026-03',
  basic_salary: emp.basic_salary,
  housing: emp.housing_allowance,
  transport: emp.transport_allowance,
  food: emp.food_allowance,
  other_allowances: emp.other_allowances,
  overtime_pay: Math.random() > 0.6 ? Math.round(Math.random() * 3000) : 0,
  bonus: Math.random() > 0.8 ? Math.round(Math.random() * 5000) : 0,
  gross_salary: emp.total_salary,
  gosi_employee: emp.gosi_deduction,
  gosi_employer: Math.round(emp.basic_salary * 0.1175),
  absence_deduction: emp.attendance_rate < 95 ? Math.round((100 - emp.attendance_rate) * emp.basic_salary / 100 * 0.3) : 0,
  loan_deduction: 0,
  other_deductions: 0,
  total_deductions: emp.gosi_deduction,
  net_salary: emp.total_salary - emp.gosi_deduction,
  status: emp.id === 'E001' ? 'paid' as const : Math.random() > 0.3 ? 'paid' as const : 'approved' as const,
  wps_reference: `WPS-2026-03-${emp.employee_number}`,
  paid_date: '2026-03-28',
}))

// ─── Performance Reviews ────────────────────────────────────────────────────

export const performanceReviews: PerformanceReview[] = [
  {
    id: 'PR001', employee_id: 'E002', employee_name: 'أحمد محمد الشهري', reviewer_id: 'E001', reviewer_name: 'نور كرم',
    period: 'Q4 2025', kpis: [
      { name: 'تحقيق هدف المبيعات', target: 100, actual: 112, weight: 40 },
      { name: 'رضا العملاء', target: 90, actual: 88, weight: 25 },
      { name: 'تطوير الفريق', target: 85, actual: 90, weight: 20 },
      { name: 'الالتزام بالمواعيد', target: 95, actual: 96, weight: 15 },
    ],
    self_score: 88, manager_score: 92, final_score: 92, rating: 'exceeds',
    strengths: ['قيادة فريق المبيعات بفعالية', 'تجاوز الأهداف الربعية', 'علاقات عملاء ممتازة'],
    improvements: ['تحسين التوثيق', 'تطوير مهارات التحليل'],
    ai_recommendations: ['دورة تحليل بيانات المبيعات', 'برنامج قيادة متقدم', 'تفويض أكثر للمهام الروتينية'],
    status: 'approved', created_at: '2026-01-15'
  },
  {
    id: 'PR002', employee_id: 'E003', employee_name: 'سارة العلي', reviewer_id: 'E001', reviewer_name: 'نور كرم',
    period: 'Q4 2025', kpis: [
      { name: 'حملات تسويقية ناجحة', target: 8, actual: 11, weight: 35 },
      { name: 'ROI التسويقي', target: 300, actual: 380, weight: 30 },
      { name: 'نمو المتابعين', target: 25, actual: 32, weight: 20 },
      { name: 'جودة المحتوى', target: 90, actual: 95, weight: 15 },
    ],
    self_score: 92, manager_score: 95, final_score: 95, rating: 'exceptional',
    strengths: ['إبداع استثنائي في الحملات', 'تحقيق ROI عالي', 'قيادة فريق التسويق'],
    improvements: ['توسيع نطاق التسويق الدولي'],
    ai_recommendations: ['ترقية إلى VP Marketing', 'زيادة ميزانية القسم 20%', 'برنامج MBA مسائي'],
    status: 'approved', created_at: '2026-01-15'
  },
]

// ─── Documents ──────────────────────────────────────────────────────────────

export const hrDocuments: HRDocument[] = [
  { id: 'DOC001', employee_id: 'E001', employee_name: 'نور كرم', type: 'contract', title: 'عقد عمل — المدير التنفيذي', file_url: '#', file_size: '2.4 MB', expiry_date: null, status: 'valid', uploaded_at: '2023-01-01', verified_by: 'النظام', tags: ['عقد', 'تنفيذي'] },
  { id: 'DOC002', employee_id: 'E001', employee_name: 'نور كرم', type: 'id_copy', title: 'صورة الهوية الوطنية', file_url: '#', file_size: '1.1 MB', expiry_date: '2028-03-15', status: 'valid', uploaded_at: '2023-01-01', verified_by: 'النظام', tags: ['هوية', 'حكومي'] },
  { id: 'DOC003', employee_id: 'E006', employee_name: 'فاطمة أحمد', type: 'iqama', title: 'صورة الإقامة', file_url: '#', file_size: '0.9 MB', expiry_date: '2026-08-15', status: 'valid', uploaded_at: '2025-04-20', verified_by: 'ريم الغامدي', tags: ['إقامة', 'حكومي'] },
  { id: 'DOC004', employee_id: 'E012', employee_name: 'راشد الدوسري', type: 'iqama', title: 'صورة الإقامة', file_url: '#', file_size: '0.8 MB', expiry_date: '2026-06-30', status: 'expiring_soon', uploaded_at: '2024-09-01', verified_by: 'ريم الغامدي', tags: ['إقامة', 'حكومي', 'تجديد'] },
  { id: 'DOC005', employee_id: 'E011', employee_name: 'هند المطيري', type: 'cv', title: 'السيرة الذاتية', file_url: '#', file_size: '0.5 MB', expiry_date: null, status: 'valid', uploaded_at: '2026-01-10', verified_by: 'ريم الغامدي', tags: ['سيرة ذاتية', 'توظيف'] },
  { id: 'DOC006', employee_id: 'E011', employee_name: 'هند المطيري', type: 'nda', title: 'اتفاقية السرية وعدم الإفصاح', file_url: '#', file_size: '0.3 MB', expiry_date: null, status: 'valid', uploaded_at: '2026-01-15', verified_by: 'ماجد القحطاني', tags: ['سرية', 'قانوني'] },
  { id: 'DOC007', employee_id: 'E005', employee_name: 'عمر الزهراني', type: 'certificate', title: 'شهادة AWS Solutions Architect', file_url: '#', file_size: '1.2 MB', expiry_date: '2027-06-01', status: 'valid', uploaded_at: '2025-06-15', verified_by: 'ريم الغامدي', tags: ['شهادة', 'تقنية'] },
  { id: 'DOC008', employee_id: 'E009', employee_name: 'ريم الغامدي', type: 'certificate', title: 'شهادة SHRM-CP', file_url: '#', file_size: '0.7 MB', expiry_date: '2027-08-10', status: 'valid', uploaded_at: '2025-08-10', verified_by: 'نور كرم', tags: ['شهادة', 'موارد بشرية'] },
  { id: 'DOC009', employee_id: 'E002', employee_name: 'أحمد محمد الشهري', type: 'policy', title: 'سياسة استخدام الأجهزة — موقّعة', file_url: '#', file_size: '0.4 MB', expiry_date: null, status: 'valid', uploaded_at: '2024-04-01', verified_by: 'ريم الغامدي', tags: ['سياسة', 'أمن معلومات'] },
]

// ─── Onboarding Tasks ───────────────────────────────────────────────────────

export const onboardingTasks: OnboardingTask[] = [
  { id: 'OB001', employee_id: 'E011', employee_name: 'هند المطيري', step: 'account', title: 'إنشاء حساب النظام', description: 'إنشاء حساب بريد إلكتروني وحسابات الأنظمة الداخلية', assigned_to: 'عمر الزهراني', completed: true, completed_at: '2026-01-15', due_date: '2026-01-16', order: 1 },
  { id: 'OB002', employee_id: 'E011', employee_name: 'هند المطيري', step: 'documents', title: 'رفع المستندات المطلوبة', description: 'صورة الهوية، السيرة الذاتية، الشهادات', assigned_to: 'ريم الغامدي', completed: true, completed_at: '2026-01-16', due_date: '2026-01-18', order: 2 },
  { id: 'OB003', employee_id: 'E011', employee_name: 'هند المطيري', step: 'policies', title: 'توقيع السياسات والاتفاقيات', description: 'NDA، سياسة الخصوصية، لائحة العمل الداخلية', assigned_to: 'ماجد القحطاني', completed: true, completed_at: '2026-01-17', due_date: '2026-01-20', order: 3 },
  { id: 'OB004', employee_id: 'E011', employee_name: 'هند المطيري', step: 'role_assignment', title: 'تعيين الدور والصلاحيات', description: 'تحديد الدور في النظام ومنح الصلاحيات المناسبة', assigned_to: 'ريم الغامدي', completed: true, completed_at: '2026-01-18', due_date: '2026-01-20', order: 4 },
  { id: 'OB005', employee_id: 'E011', employee_name: 'هند المطيري', step: 'system_access', title: 'منح الوصول للأنظمة', description: 'Figma، Slack، Jira، Google Workspace', assigned_to: 'عمر الزهراني', completed: true, completed_at: '2026-01-18', due_date: '2026-01-22', order: 5 },
  { id: 'OB006', employee_id: 'E011', employee_name: 'هند المطيري', step: 'orientation', title: 'جلسة التعريف والتوجيه', description: 'جولة في المكتب + تعريف بالفريق + شرح ثقافة الشركة', assigned_to: 'سارة العلي', completed: false, completed_at: null, due_date: '2026-04-15', order: 6 },
]

// ─── Attendance Records ───────────────────────────────────────────────────

const methods: ('biometric' | 'mobile' | 'web' | 'manual')[] = ['biometric', 'mobile', 'web', 'manual']
const locations = ['المقر الرئيسي — الرياض', 'فرع جدة', 'عن بُعد', 'موقع الفعالية']

export const attendanceRecords: AttendanceRecord[] = employees.flatMap(emp => {
  const records: AttendanceRecord[] = []
  for (let d = 1; d <= 25; d++) {
    const day = d.toString().padStart(2, '0')
    const isWeekend = d % 7 === 5 || d % 7 === 6
    if (isWeekend) continue
    const rand = Math.random()
    const status: AttendanceRecord['status'] = rand > 0.92 ? 'absent' : rand > 0.85 ? 'late' : rand > 0.80 ? 'remote' : 'present'
    const checkIn = status === 'absent' ? null : status === 'late' ? `0${8 + Math.floor(Math.random() * 2)}:${(15 + Math.floor(Math.random() * 45)).toString().padStart(2, '0')}` : `08:0${Math.floor(Math.random() * 9)}`
    const checkOut = status === 'absent' ? null : `${16 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    const wh = status === 'absent' ? 0 : status === 'late' ? 6 + Math.random() * 2 : 8 + Math.random() * 2
    const ot = wh > 9 ? Math.round((wh - 8) * 10) / 10 : 0
    records.push({
      id: `ATT-${emp.id}-${day}`,
      employee_id: emp.id,
      employee_name: emp.full_name_ar,
      department: emp.department_name,
      date: `2026-03-${day}`,
      check_in: checkIn,
      check_out: checkOut,
      status,
      working_hours: Math.round(wh * 10) / 10,
      overtime_hours: ot,
      location: status === 'remote' ? 'عن بُعد' : locations[0],
      is_remote: status === 'remote',
      method: methods[Math.floor(Math.random() * methods.length)]
    })
  }
  return records
})

// ─── Employment Contracts ─────────────────────────────────────────────────

export const employmentContracts: EmploymentContract[] = employees.map(emp => ({
  id: `CON-${emp.id}`,
  employee_id: emp.id,
  employee_name: emp.full_name_ar,
  contract_type: emp.contract_type,
  start_date: emp.join_date,
  end_date: emp.contract_type === 'full_time' ? `${parseInt(emp.join_date.split('-')[0]) + 2}-${emp.join_date.split('-')[1]}-${emp.join_date.split('-')[2]}` : null,
  salary: emp.total_salary,
  probation_months: emp.contract_type === 'internship' ? 0 : 3,
  notice_period_days: emp.contract_type === 'full_time' ? 60 : 30,
  status: emp.employment_status === 'active' ? 'active' as const : emp.employment_status === 'terminated' ? 'terminated' as const : 'active' as const,
  signed_date: emp.join_date,
  qiwa_registered: emp.government.qiwa_contract_status === 'active',
  template_id: emp.contract_type === 'full_time' ? 'ft_standard' : 'pt_standard'
}))
