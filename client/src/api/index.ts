import client from './client'

// ═══════════════════════════════════════════════════════
// Auth API — المصادقة
// ═══════════════════════════════════════════════════════
export const authApi = {
  login: (data: { phone: string; password: string }) =>
    client.post('/auth/login', data).then(r => r.data),
  verifyOTP: (data: { code: string }) =>
    client.post('/auth/verify-otp', data).then(r => r.data),
  me: () =>
    client.get('/auth/me').then(r => r.data),
  logout: () =>
    client.post('/auth/logout').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Dashboard API — لوحة التحكم
// ═══════════════════════════════════════════════════════
export const dashboardApi = {
  stats: () =>
    client.get('/admin/dashboard/stats').then(r => r.data),
  recentActivity: () =>
    client.get('/admin/dashboard/recent-activity').then(r => r.data),
  charts: () =>
    client.get('/admin/dashboard/charts').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Events API — الفعاليات
// ═══════════════════════════════════════════════════════
export const eventsApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/events', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/events/${id}`).then(r => r.data),
  create: (data: any) =>
    client.post('/admin/events', data).then(r => r.data),
  update: (id: number, data: any) =>
    client.put(`/admin/events/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    client.delete(`/admin/events/${id}`).then(r => r.data),
  publish: (id: number) =>
    client.post(`/admin/events/${id}/publish`).then(r => r.data),
  crowd: (id: number) =>
    client.get(`/admin/events/${id}/crowd`).then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Requests API — الطلبات
// ═══════════════════════════════════════════════════════
export const requestsApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/requests', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/requests/${id}`).then(r => r.data),
  approve: (id: number) =>
    client.post(`/admin/requests/${id}/approve`).then(r => r.data),
  reject: (id: number, data: { reason: string }) =>
    client.post(`/admin/requests/${id}/reject`, data).then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Users API — المستخدمون
// ═══════════════════════════════════════════════════════
export const usersApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/users', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/users/${id}`).then(r => r.data),
  create: (data: any) =>
    client.post('/admin/users', data).then(r => r.data),
  update: (id: number, data: any) =>
    client.put(`/admin/users/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    client.delete(`/admin/users/${id}`).then(r => r.data),
  roles: () =>
    client.get('/admin/roles').then(r => r.data),
  permissions: () =>
    client.get('/admin/permissions').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Finance API — المالية
// ═══════════════════════════════════════════════════════
export const financeApi = {
  invoices: (params?: Record<string, any>) =>
    client.get('/admin/finance/invoices', { params }).then(r => r.data),
  payments: (params?: Record<string, any>) =>
    client.get('/admin/finance/payments', { params }).then(r => r.data),
  sendToZATCA: (id: number) =>
    client.post(`/admin/finance/invoices/${id}/zatca`).then(r => r.data),
  refund: (id: number) =>
    client.post(`/admin/finance/payments/${id}/refund`).then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// CRM API — إدارة العلاقات
// ═══════════════════════════════════════════════════════
export const crmApi = {
  leads: (params?: Record<string, any>) =>
    client.get('/admin/crm/leads', { params }).then(r => r.data),
  createLead: (data: any) =>
    client.post('/admin/crm/leads', data).then(r => r.data),
  updateLead: (id: number, data: any) =>
    client.put(`/admin/crm/leads/${id}`, data).then(r => r.data),
  pipeline: () =>
    client.get('/admin/crm/pipeline').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// AI API — الذكاء الاصطناعي
// ═══════════════════════════════════════════════════════
export const aiApi = {
  executiveBrain: (data: { query: string }) =>
    client.post('/admin/ai/executive-brain', data).then(r => r.data),
  leadScoring: (leadId: number) =>
    client.get(`/admin/ai/lead-scoring/${leadId}`).then(r => r.data),
  revenueForecast: () =>
    client.get('/admin/ai/revenue-forecast').then(r => r.data),
  anomalyDetection: () =>
    client.get('/admin/ai/anomaly-detection').then(r => r.data),
  sentimentAnalysis: (data: { text: string }) =>
    client.post('/admin/ai/sentiment', data).then(r => r.data),
  recommendations: (type: string) =>
    client.get(`/admin/ai/recommendations/${type}`).then(r => r.data),
  riskAssessment: (eventId: number) =>
    client.get(`/admin/ai/risk-assessment/${eventId}`).then(r => r.data),
  customerSegmentation: () =>
    client.get('/admin/ai/customer-segmentation').then(r => r.data),
  chatbot: (data: { message: string }) =>
    client.post('/admin/ai/chatbot', data).then(r => r.data),
  autoSchedule: (eventId: number) =>
    client.post(`/admin/ai/auto-schedule/${eventId}`).then(r => r.data),
  contentGeneration: (data: { type: string; context: string }) =>
    client.post('/admin/ai/content-generation', data).then(r => r.data),
  performanceOptimization: () =>
    client.get('/admin/ai/performance-optimization').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Reports API — التقارير
// ═══════════════════════════════════════════════════════
export const reportsApi = {
  financial: (params?: Record<string, any>) =>
    client.get('/admin/reports/financial', { params }).then(r => r.data),
  events: (params?: Record<string, any>) =>
    client.get('/admin/reports/events', { params }).then(r => r.data),
  users: (params?: Record<string, any>) =>
    client.get('/admin/reports/users', { params }).then(r => r.data),
  auditLogs: (params?: Record<string, any>) =>
    client.get('/admin/reports/audit-logs', { params }).then(r => r.data),
  export: (type: string, params?: Record<string, any>) =>
    client.get(`/admin/reports/export/${type}`, { params, responseType: 'blob' }).then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Settings API — الإعدادات
// ═══════════════════════════════════════════════════════
export const settingsApi = {
  general: () =>
    client.get('/admin/settings/general').then(r => r.data),
  updateGeneral: (data: any) =>
    client.put('/admin/settings/general', data).then(r => r.data),
  notifications: () =>
    client.get('/admin/settings/notifications').then(r => r.data),
  updateNotifications: (data: any) =>
    client.put('/admin/settings/notifications', data).then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Notifications API — الإشعارات
// ═══════════════════════════════════════════════════════
export const notificationsApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/notifications', { params }).then(r => r.data),
  markRead: (id: number) =>
    client.post(`/admin/notifications/${id}/read`).then(r => r.data),
  markAllRead: () =>
    client.post('/admin/notifications/read-all').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Documents Vault API — المستندات
// ═══════════════════════════════════════════════════════
export const documentsApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/documents', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/documents/${id}`).then(r => r.data),
  upload: (data: FormData) =>
    client.post('/admin/documents', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  updateStatus: (id: number, data: { status: string; reason?: string }) =>
    client.patch(`/admin/documents/${id}/status`, data).then(r => r.data),
  delete: (id: number) =>
    client.delete(`/admin/documents/${id}`).then(r => r.data),
  export: (params?: Record<string, any>) =>
    client.get('/admin/documents/export', { params, responseType: 'blob' }).then(r => r.data),
  stats: () =>
    client.get('/admin/documents/stats').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Messages API — الرسائل
// ═══════════════════════════════════════════════════════
export const messagesApi = {
  conversations: (params?: Record<string, any>) =>
    client.get('/admin/messages/conversations', { params }).then(r => r.data),
  messages: (conversationId: number, params?: Record<string, any>) =>
    client.get(`/admin/messages/conversations/${conversationId}`, { params }).then(r => r.data),
  send: (data: { recipient_id: number; content: string; recipient_type: string }) =>
    client.post('/admin/messages/send', data).then(r => r.data),
  markRead: (conversationId: number) =>
    client.post(`/admin/messages/conversations/${conversationId}/read`).then(r => r.data),
  unreadCount: () =>
    client.get('/admin/messages/unread-count').then(r => r.data),
  search: (params: { q: string }) =>
    client.get('/admin/messages/search', { params }).then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Badges API — الشارات
// ═══════════════════════════════════════════════════════
export const badgesApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/badges', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/badges/${id}`).then(r => r.data),
  create: (data: any) =>
    client.post('/admin/badges', data).then(r => r.data),
  update: (id: number, data: any) =>
    client.put(`/admin/badges/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    client.delete(`/admin/badges/${id}`).then(r => r.data),
  grant: (data: { badge_id: number; investor_id: number }) =>
    client.post('/admin/badges/grant', data).then(r => r.data),
  holders: (id: number, params?: Record<string, any>) =>
    client.get(`/admin/badges/${id}/holders`, { params }).then(r => r.data),
  stats: () =>
    client.get('/admin/badges/stats').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Waitlist API — قائمة الانتظار
// ═══════════════════════════════════════════════════════
export const waitlistApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/waitlist', { params }).then(r => r.data),
  approve: (id: number) =>
    client.post(`/admin/waitlist/${id}/approve`).then(r => r.data),
  reject: (id: number, data: { reason: string }) =>
    client.post(`/admin/waitlist/${id}/reject`, data).then(r => r.data),
  reorder: (data: { items: { id: number; position: number }[] }) =>
    client.post('/admin/waitlist/reorder', data).then(r => r.data),
  stats: () =>
    client.get('/admin/waitlist/stats').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Sponsor Assets API — أصول الرعاة
// ═══════════════════════════════════════════════════════
export const sponsorAssetsApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/sponsor-assets', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/sponsor-assets/${id}`).then(r => r.data),
  approve: (id: number) =>
    client.post(`/admin/sponsor-assets/${id}/approve`).then(r => r.data),
  reject: (id: number, data: { reason: string }) =>
    client.post(`/admin/sponsor-assets/${id}/reject`, data).then(r => r.data),
  stats: () =>
    client.get('/admin/sponsor-assets/stats').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Packages API — الحزم والقطاعات
// ═══════════════════════════════════════════════════════
export const packagesApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/packages', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/packages/${id}`).then(r => r.data),
  create: (data: any) =>
    client.post('/admin/packages', data).then(r => r.data),
  update: (id: number, data: any) =>
    client.put(`/admin/packages/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    client.delete(`/admin/packages/${id}`).then(r => r.data),
  sectors: () =>
    client.get('/admin/packages/sectors').then(r => r.data),
  stats: () =>
    client.get('/admin/packages/stats').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Exhibition Map API — خريطة المعرض
// ═══════════════════════════════════════════════════════
export const exhibitionMapApi = {
  layout: (eventId: number) =>
    client.get(`/admin/exhibition-map/${eventId}`).then(r => r.data),
  updateSpace: (spaceId: number, data: any) =>
    client.put(`/admin/exhibition-map/spaces/${spaceId}`, data).then(r => r.data),
  stats: (eventId: number) =>
    client.get(`/admin/exhibition-map/${eventId}/stats`).then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Exhibitor Services API — خدمات العارضين
// ═══════════════════════════════════════════════════════
export const exhibitorServicesApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/exhibitor-services', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/exhibitor-services/${id}`).then(r => r.data),
  create: (data: any) =>
    client.post('/admin/exhibitor-services', data).then(r => r.data),
  update: (id: number, data: any) =>
    client.put(`/admin/exhibitor-services/${id}`, data).then(r => r.data),
  requests: (params?: Record<string, any>) =>
    client.get('/admin/exhibitor-services/requests', { params }).then(r => r.data),
  approveRequest: (id: number) =>
    client.post(`/admin/exhibitor-services/requests/${id}/approve`).then(r => r.data),
  stats: () =>
    client.get('/admin/exhibitor-services/stats').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Teams API — إدارة الفرق
// ═══════════════════════════════════════════════════════
export const teamsApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/teams', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/teams/${id}`).then(r => r.data),
  create: (data: any) =>
    client.post('/admin/teams', data).then(r => r.data),
  update: (id: number, data: any) =>
    client.put(`/admin/teams/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    client.delete(`/admin/teams/${id}`).then(r => r.data),
  members: (id: number) =>
    client.get(`/admin/teams/${id}/members`).then(r => r.data),
  addMember: (id: number, data: { user_id: number; role: string }) =>
    client.post(`/admin/teams/${id}/members`, data).then(r => r.data),
  removeMember: (id: number, userId: number) =>
    client.delete(`/admin/teams/${id}/members/${userId}`).then(r => r.data),
  stats: () =>
    client.get('/admin/teams/stats').then(r => r.data),
}

// ═══════════════════════════════════════════════════════
// Opportunities API — فرص الاستثمار
// ═══════════════════════════════════════════════════════
export const opportunitiesApi = {
  list: (params?: Record<string, any>) =>
    client.get('/admin/opportunities', { params }).then(r => r.data),
  show: (id: number) =>
    client.get(`/admin/opportunities/${id}`).then(r => r.data),
  create: (data: any) =>
    client.post('/admin/opportunities', data).then(r => r.data),
  update: (id: number, data: any) =>
    client.put(`/admin/opportunities/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    client.delete(`/admin/opportunities/${id}`).then(r => r.data),
  stats: () =>
    client.get('/admin/opportunities/stats').then(r => r.data),
}
