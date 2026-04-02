// ═══════════════════════════════════════════════════════
// Revenue Engine — TypeScript Types
// All entities for the 10 sub-systems
// ═══════════════════════════════════════════════════════

// ─── Common ──────────────────────────────────────────
export type ClientType = 'investor' | 'merchant' | 'sponsor'
export type Priority = 'hot' | 'warm' | 'cold'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type LeadSource = 'website' | 'cold_call' | 'referral' | 'campaign' | 'exhibition'
export type Sector = 'real_estate' | 'food' | 'tech' | 'retail' | 'fashion' | 'other'
export type FollowUpType = 'call' | 'meeting' | 'email' | 'whatsapp' | 'site_visit'
export type FollowUpOutcome = 'interested' | 'not_interested' | 'no_answer' | 'callback_requested' | 'converted'
export type WarningLevel = 1 | 2 | 3
export type ZatcaStatus = 'not_sent' | 'sent' | 'pending' | 'accepted' | 'rejected'
export type PaymentMethod = 'sadad' | 'mada' | 'bank_transfer' | 'stc_pay'
export type ContractStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'active' | 'expired' | 'cancelled'

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// ─── Sub-System 1: Lead Generation ──────────────────
export interface Lead {
  id: number
  full_name: string
  company: string
  phone: string
  phone_whatsapp: boolean
  email: string
  city: string
  sector: Sector
  lead_type: ClientType
  source: LeadSource
  priority: Priority
  assigned_to: number | null
  assigned_user?: Employee
  ai_score: number
  status: LeadStatus
  next_action: string | null
  next_action_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
  last_contacted_at: string | null
  activities?: DealActivity[]
}

export interface LeadFormData {
  full_name: string
  company: string
  phone: string
  phone_whatsapp: boolean
  email: string
  city: string
  sector: Sector
  lead_type: ClientType
  source: LeadSource
  priority: Priority
  assigned_to?: number | null
  notes?: string
}

// ─── Sub-System 2: CRM Pipeline ─────────────────────
export interface PipelineStage {
  id: number
  name_ar: string
  name_en: string
  order: number
  sla_hours: number
  color: string
  deals_count: number
  deals_value: number
}

export interface PipelineDeal {
  id: number
  lead_id: number
  lead?: Lead
  stage_id: number
  stage?: PipelineStage
  value: number
  close_probability: number
  assigned_to: number
  assigned_user?: Employee
  days_in_stage: number
  last_activity: string | null
  next_action: string | null
  next_action_date: string | null
  is_overdue: boolean
  is_at_risk: boolean
  created_at: string
  updated_at: string
}

export interface DealActivity {
  id: number
  deal_id: number
  type: FollowUpType | 'note' | 'stage_change' | 'proposal' | 'contract'
  outcome?: FollowUpOutcome
  notes: string
  duration?: number
  next_action?: string
  next_action_date?: string
  created_by: number
  created_at: string
}

// ─── Sub-System 3: Follow-Up Engine ─────────────────
export interface FollowUp {
  id: number
  lead_id: number
  lead?: Lead
  deal_id: number | null
  deal?: PipelineDeal
  due_date: string
  type: FollowUpType
  status: 'pending' | 'completed' | 'overdue' | 'cancelled'
  outcome?: FollowUpOutcome
  notes?: string
  duration?: number
  assigned_to: number
  assigned_user?: Employee
  completed_at?: string
  created_at: string
}

// ─── Sub-System 4: Opportunity Management ───────────
export interface Opportunity {
  id: number
  lead_id: number
  lead?: Lead
  event_id: number | null
  event_name?: string
  space_package: string | null
  budget_min: number
  budget_max: number
  decision_maker: boolean
  competition: string | null
  close_probability: number
  expected_close_date: string
  deal_value: number
  stage: string
  documents: string[]
  meeting_notes: string | null
  created_at: string
  updated_at: string
}

// ─── Sub-System 5: Contract Conversion ──────────────
export interface Contract {
  id: number
  opportunity_id?: number
  client_type: ClientType
  client_name: string
  client_company: string
  event_name: string
  space_package: string
  value: number
  terms: string
  status: ContractStatus
  sent_at?: string
  viewed_at?: string
  signed_at?: string
  invoice_id?: number
  created_at: string
  expires_at: string
}

// ─── Sub-System 6: Payment & Revenue ────────────────
export interface Payment {
  id: number
  amount: number
  payer_name: string
  payer_type: ClientType
  method: PaymentMethod
  invoice_number: string
  zatca_status: ZatcaStatus
  due_date: string
  paid_date?: string
  days_overdue: number
  contract_id?: number
  created_at: string
}

export interface RevenueStats {
  today: number
  this_month: number
  this_quarter: number
  this_year: number
  monthly_target: number
  by_type: {
    investor: { amount: number; percentage: number }
    merchant: { amount: number; percentage: number }
    sponsor: { amount: number; percentage: number }
  }
  pipeline_value: number
  forecast_30d: number
  forecast_90d: number
}

// ─── Sub-System 7: Sales Performance ────────────────
export interface EmployeeKPI {
  id: number
  user_id: number
  user?: Employee
  date: string
  leads_assigned: number
  leads_contacted: number
  followups_completed: number
  followups_scheduled: number
  meetings_held: number
  proposals_sent: number
  deals_closed: number
  revenue_generated: number
  conversion_rate: number
  avg_deal_value: number
  response_time_hours: number
  daily_score: number
}

export interface Commission {
  id: number
  user_id: number
  user?: Employee
  deal_id: number
  amount: number
  rate: number
  calculated_at: string
  approved: boolean
  approved_by?: number
  paid: boolean
}

// ─── Sub-System 8: Employee Enforcement ─────────────
export interface Employee {
  id: number
  name: string
  avatar?: string
  role: string
  department: string
  is_online: boolean
  last_activity?: string
}

export interface DailyReport {
  id: number
  user_id: number
  user?: Employee
  date: string
  leads_contacted: number
  calls_made: number
  meetings: number
  proposals_sent: number
  blockers: string
  plan_tomorrow: string
  submitted_at: string
}

export interface Warning {
  id: number
  user_id: number
  user?: Employee
  level: WarningLevel
  reason: string
  issued_by: number
  issued_at: string
  cleared_at?: string
  is_active: boolean
}

export interface TaskQueue {
  leads_to_contact: number
  followups_due: number
  proposals_to_send: number
  meetings_to_prepare: number
  daily_report_due: boolean
  items: TaskQueueItem[]
}

export interface TaskQueueItem {
  id: number
  type: 'lead_contact' | 'followup' | 'proposal' | 'meeting' | 'report'
  title: string
  description: string
  due_time?: string
  priority: Priority
  entity_id: number
  entity_type: string
}

// ─── Sub-System 9: AI Sales Intelligence ────────────
export interface AIPriorityLead {
  lead: Lead
  rank: number
  reason: string
  suggested_script: string
  best_call_time: string
  close_probability: number
}

export interface AIAtRiskDeal {
  deal: PipelineDeal
  risk_factors: string[]
  recommended_actions: string[]
  days_since_activity: number
  probability_change: number
}

export interface AIWeakEmployee {
  employee: Employee
  issues: string[]
  leads_going_cold: number
  conversion_rate: number
  team_avg_conversion: number
  missed_deadlines: number
}

export interface AIRecommendation {
  lead_id: number
  recommendation: string
  suggested_package: string
  best_call_time: string
  match_reason: string
}

// ─── Sub-System 10: Workflow Automation ──────────────
export interface WorkflowDefinition {
  id: number
  name: string
  trigger_type: 'lead_created' | 'proposal_sent' | 'contract_signed' | 'payment_overdue' | 'employee_idle' | 'contract_expiring'
  trigger_condition: Record<string, any>
  steps: WorkflowStep[]
  is_active: boolean
  created_at: string
}

export interface WorkflowStep {
  name: string
  action: string
  delay_hours?: number
  condition?: string
  params: Record<string, any>
}

export interface WorkflowExecution {
  id: number
  workflow_id: number
  workflow?: WorkflowDefinition
  entity_type: string
  entity_id: number
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  started_at: string
  completed_at?: string
  current_step: number
  logs: WorkflowStepLog[]
}

export interface WorkflowStepLog {
  id: number
  execution_id: number
  step_name: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  executed_at?: string
  result?: string
}

// ─── Saudi Cities ───────────────────────────────────
export const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
  'الخبر', 'الظهران', 'تبوك', 'أبها', 'الطائف', 'بريدة',
  'نجران', 'جازان', 'ينبع', 'حائل', 'الجبيل', 'خميس مشيط',
  'الأحساء', 'القطيف', 'سكاكا',
] as const

export const SECTORS: Record<Sector, string> = {
  real_estate: 'عقارات',
  food: 'أغذية ومشروبات',
  tech: 'تقنية',
  retail: 'تجزئة',
  fashion: 'أزياء',
  other: 'أخرى',
}

export const LEAD_SOURCES: Record<LeadSource, string> = {
  website: 'الموقع الإلكتروني',
  cold_call: 'اتصال بارد',
  referral: 'إحالة',
  campaign: 'حملة تسويقية',
  exhibition: 'معرض',
}

export const CLIENT_TYPES: Record<ClientType, string> = {
  investor: 'مستثمر',
  merchant: 'تاجر',
  sponsor: 'راعٍ',
}

export const PRIORITIES: Record<Priority, { label: string; color: string }> = {
  hot: { label: 'ساخن', color: 'danger' },
  warm: { label: 'دافئ', color: 'warning' },
  cold: { label: 'بارد', color: 'info' },
}

export const LEAD_STATUSES: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'جديد', color: 'gold' },
  contacted: { label: 'تم التواصل', color: 'info' },
  qualified: { label: 'مؤهل', color: 'success' },
  converted: { label: 'محوّل', color: 'success' },
  lost: { label: 'خسارة', color: 'danger' },
}

export const PIPELINE_STAGES_DEFAULT = [
  { name_ar: 'جديد', name_en: 'New', sla_hours: 24, color: '#6b7280' },
  { name_ar: 'تواصل', name_en: 'Contacted', sla_hours: 72, color: '#3b82f6' },
  { name_ar: 'مهتم', name_en: 'Interested', sla_hours: 120, color: '#8b5cf6' },
  { name_ar: 'مؤهل', name_en: 'Qualified', sla_hours: 120, color: '#06b6d4' },
  { name_ar: 'اجتماع', name_en: 'Meeting', sla_hours: 48, color: '#f59e0b' },
  { name_ar: 'عرض', name_en: 'Offer', sla_hours: 168, color: '#f97316' },
  { name_ar: 'تفاوض', name_en: 'Negotiation', sla_hours: 72, color: '#ef4444' },
  { name_ar: 'عقد', name_en: 'Contract', sla_hours: 48, color: '#10b981' },
  { name_ar: 'مكتمل', name_en: 'Complete', sla_hours: 0, color: '#22c55e' },
] as const
