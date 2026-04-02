// ═══════════════════════════════════════════════════════
// Revenue Engine API — All 10 Sub-Systems
// ═══════════════════════════════════════════════════════
import axios from 'axios'
import type {
  Lead, LeadFormData, PipelineDeal, DealActivity,
  FollowUp, RevenueStats, EmployeeKPI,
  DailyReport, Warning, TaskQueue,
  AIPriorityLead, AIAtRiskDeal, AIWeakEmployee, AIRecommendation,
  WorkflowDefinition, WorkflowExecution,
  PaginatedResponse,
} from '@/types/revenue-engine'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mahamexpo.sa/v1'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(r => r.startsWith('token='))?.split('=')[1]
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(r => r, (error) => {
  if (error.response?.status === 401) window.location.href = '/login'
  return Promise.reject(error)
})

// ─── 1. Lead Generation ─────────────────────────────
export const leadsApi = {
  list: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Lead>>('/admin/crm/leads', { params }).then(r => r.data),
  show: (id: number) =>
    api.get<{ data: Lead }>(`/admin/crm/leads/${id}`).then(r => r.data),
  create: (data: LeadFormData) =>
    api.post<{ data: Lead }>('/admin/crm/leads', data).then(r => r.data),
  update: (id: number, data: Partial<LeadFormData>) =>
    api.put<{ data: Lead }>(`/admin/crm/leads/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/admin/crm/leads/${id}`).then(r => r.data),
  triggerAIScore: (id: number) =>
    api.post<{ data: { score: number } }>(`/admin/crm/leads/${id}/score`).then(r => r.data),
  bulkImport: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/admin/crm/leads/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
  },
  bulkAssign: (ids: number[], assignTo: number) =>
    api.post('/admin/crm/leads/bulk-assign', { ids, assigned_to: assignTo }).then(r => r.data),
  bulkUpdateStatus: (ids: number[], status: string) =>
    api.post('/admin/crm/leads/bulk-status', { ids, status }).then(r => r.data),
  export: (params?: Record<string, any>) =>
    api.get('/admin/crm/leads/export', { params, responseType: 'blob' }).then(r => r.data),
}

// ─── 2. CRM Pipeline ────────────────────────────────
export const pipelineApi = {
  stages: () =>
    api.get<{ data: any[] }>('/admin/sales/pipeline').then(r => r.data),
  createDeal: (data: { lead_id: number; value: number; stage_id?: number }) =>
    api.post<{ data: PipelineDeal }>('/admin/sales/deals', data).then(r => r.data),
  moveDeal: (id: number, stageId: number) =>
    api.put(`/admin/sales/deals/${id}/stage`, { stage_id: stageId }).then(r => r.data),
  atRisk: () =>
    api.get<{ data: PipelineDeal[] }>('/admin/sales/deals/at-risk').then(r => r.data),
  logActivity: (dealId: number, data: Partial<DealActivity>) =>
    api.post(`/admin/sales/deals/${dealId}/activities`, data).then(r => r.data),
}

// ─── 3. Follow-Up Engine ────────────────────────────
export const followupsApi = {
  list: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<FollowUp>>('/admin/sales/followups', { params }).then(r => r.data),
  create: (data: Partial<FollowUp>) =>
    api.post<{ data: FollowUp }>('/admin/sales/followups', data).then(r => r.data),
  complete: (id: number, data: { outcome: string; notes?: string; duration?: number; next_action?: string; next_action_date?: string }) =>
    api.put(`/admin/sales/followups/${id}/complete`, data).then(r => r.data),
}

// ─── 4. Performance ─────────────────────────────────
export const performanceApi = {
  team: (params?: Record<string, any>) =>
    api.get<{ data: EmployeeKPI[] }>('/admin/performance/team', { params }).then(r => r.data),
  rep: (id: number, params?: Record<string, any>) =>
    api.get<{ data: EmployeeKPI }>(`/admin/performance/rep/${id}`, { params }).then(r => r.data),
  leaderboard: (params?: Record<string, any>) =>
    api.get<{ data: EmployeeKPI[] }>('/admin/performance/leaderboard', { params }).then(r => r.data),
  submitDailyReport: (data: Partial<DailyReport>) =>
    api.post<{ data: DailyReport }>('/admin/performance/daily-report', data).then(r => r.data),
}

// ─── 5. Enforcement ─────────────────────────────────
export const enforcementApi = {
  idle: () =>
    api.get<{ data: any[] }>('/admin/enforcement/idle').then(r => r.data),
  issueWarning: (userId: number, data: { level: number; reason: string }) =>
    api.post(`/admin/enforcement/warnings/${userId}`, data).then(r => r.data),
  warnings: (params?: Record<string, any>) =>
    api.get<{ data: Warning[] }>('/admin/enforcement/warnings', { params }).then(r => r.data),
  taskQueue: (userId?: number) =>
    api.get<{ data: TaskQueue }>('/admin/enforcement/task-queue', { params: { user_id: userId } }).then(r => r.data),
}

// ─── 6. Revenue ─────────────────────────────────────
export const revenueApi = {
  dashboard: () =>
    api.get<{ data: RevenueStats }>('/admin/revenue/dashboard').then(r => r.data),
  forecast: () =>
    api.get<{ data: { forecast_30d: number; forecast_90d: number } }>('/admin/revenue/forecast').then(r => r.data),
  byType: () =>
    api.get<{ data: any }>('/admin/revenue/by-type').then(r => r.data),
}

// ─── 7. AI Intelligence ─────────────────────────────
export const aiSalesApi = {
  priorityLeads: () =>
    api.get<{ data: AIPriorityLead[] }>('/admin/ai/priority-leads').then(r => r.data),
  atRiskDeals: () =>
    api.get<{ data: AIAtRiskDeal[] }>('/admin/ai/at-risk-deals').then(r => r.data),
  weakEmployees: () =>
    api.get<{ data: AIWeakEmployee[] }>('/admin/ai/weak-employees').then(r => r.data),
  recommendations: (leadId: number) =>
    api.get<{ data: AIRecommendation }>(`/admin/ai/recommendations/${leadId}`).then(r => r.data),
}

// ─── 8. Workflows ───────────────────────────────────
export const workflowsApi = {
  list: () =>
    api.get<{ data: WorkflowDefinition[] }>('/admin/workflows').then(r => r.data),
  create: (data: Partial<WorkflowDefinition>) =>
    api.post<{ data: WorkflowDefinition }>('/admin/workflows', data).then(r => r.data),
  trigger: (id: number, data?: Record<string, any>) =>
    api.post(`/admin/workflows/${id}/trigger`, data).then(r => r.data),
  logs: (id: number) =>
    api.get<{ data: WorkflowExecution[] }>(`/admin/workflows/${id}/logs`).then(r => r.data),
}

export default api
