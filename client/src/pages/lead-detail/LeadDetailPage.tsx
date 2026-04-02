/*
 * Lead Detail Page — ملف العميل 360°
 * Route: /leads/:id
 * Features: Profile, Activity Log, Follow-ups, AI Recommendations, Deal History
 */
import { useState, useMemo } from 'react'
import { useLocation, useParams } from 'wouter'
import {
  ArrowRight, Phone, Mail, Building2, MapPin, Globe, MessageSquare,
  Calendar, Clock, Zap, Star, TrendingUp, AlertTriangle, CheckCircle2,
  Plus, Edit, FileText, DollarSign, Users, Activity, Send,
  PhoneCall, Video, Eye, MoreHorizontal, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Lead, DealActivity, FollowUp, FollowUpType, FollowUpOutcome } from '@/types/revenue-engine'
import { CLIENT_TYPES, SECTORS, LEAD_SOURCES, LEAD_STATUSES, PRIORITIES, PIPELINE_STAGES_DEFAULT } from '@/types/revenue-engine'

// ─── Mock Data ──────────────────────────────────────
const MOCK_LEAD: Lead = {
  id: 1, full_name: 'عبدالله المنصور', company: 'شركة المنصور للعقارات', phone: '+966535001001', phone_whatsapp: true, email: 'abdullah@mansour.sa', city: 'الرياض', sector: 'real_estate', lead_type: 'investor', source: 'website', priority: 'hot', assigned_to: 1, ai_score: 92, status: 'qualified', next_action: 'اجتماع عرض المساحات', next_action_date: '2026-04-03', notes: 'مهتم بمساحة 200م² في بوليفارد وورلد. ميزانية تقديرية 400-500 ألف ريال. يفضل الموقع القريب من البوابة الرئيسية.', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-04-01T08:00:00Z', last_contacted_at: '2026-04-01T08:00:00Z',
  assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true },
}

const MOCK_ACTIVITIES: DealActivity[] = [
  { id: 1, deal_id: 1, type: 'call', outcome: 'interested', notes: 'تم الاتصال — مهتم جداً بمساحة 200م². طلب عرض أسعار مفصل.', duration: 15, next_action: 'إرسال عرض سعر', next_action_date: '2026-04-01', created_by: 1, created_at: '2026-04-01T08:00:00Z' },
  { id: 2, deal_id: 1, type: 'email', notes: 'تم إرسال عرض سعر مفصل مع خريطة الموقع وصور المساحات المتاحة.', created_by: 1, created_at: '2026-04-01T10:30:00Z' },
  { id: 3, deal_id: 1, type: 'meeting', outcome: 'interested', notes: 'اجتماع أولي عبر Zoom. عرض المساحات المتاحة. العميل يفضل الموقع A3 بالقرب من البوابة.', duration: 45, next_action: 'زيارة موقع', next_action_date: '2026-04-03', created_by: 1, created_at: '2026-03-30T14:00:00Z' },
  { id: 4, deal_id: 1, type: 'note', notes: 'العميل ذكر أنه يعرف فهد العتيبي (Lead #2) — فرصة إحالة.', created_by: 1, created_at: '2026-03-30T15:00:00Z' },
  { id: 5, deal_id: 1, type: 'stage_change', notes: 'نقل من "تواصل" إلى "مؤهل" — العميل أكد اهتمامه وميزانيته.', created_by: 1, created_at: '2026-03-29T09:00:00Z' },
  { id: 6, deal_id: 1, type: 'call', outcome: 'callback_requested', notes: 'اتصال أولي — العميل في اجتماع، طلب معاودة الاتصال بعد الظهر.', duration: 3, created_by: 1, created_at: '2026-03-28T10:30:00Z' },
]

const MOCK_FOLLOWUPS: FollowUp[] = [
  { id: 1, lead_id: 1, deal_id: 1, due_date: '2026-04-03T10:00:00Z', type: 'site_visit', status: 'pending', assigned_to: 1, created_at: '2026-04-01T08:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب', department: 'المبيعات', is_online: true } },
  { id: 2, lead_id: 1, deal_id: 1, due_date: '2026-04-01T10:00:00Z', type: 'email', status: 'completed', outcome: 'interested', notes: 'تم إرسال العرض', assigned_to: 1, completed_at: '2026-04-01T10:30:00Z', created_at: '2026-03-31T16:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب', department: 'المبيعات', is_online: true } },
  { id: 3, lead_id: 1, deal_id: 1, due_date: '2026-03-30T14:00:00Z', type: 'meeting', status: 'completed', outcome: 'interested', notes: 'اجتماع Zoom ناجح', duration: 45, assigned_to: 1, completed_at: '2026-03-30T15:00:00Z', created_at: '2026-03-29T09:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب', department: 'المبيعات', is_online: true } },
]

const activityIcons: Record<string, any> = {
  call: PhoneCall, meeting: Video, email: Mail, whatsapp: MessageSquare,
  site_visit: MapPin, note: FileText, stage_change: TrendingUp, proposal: FileText, contract: FileText,
}

const activityLabels: Record<string, string> = {
  call: 'مكالمة', meeting: 'اجتماع', email: 'بريد إلكتروني', whatsapp: 'واتساب',
  site_visit: 'زيارة موقع', note: 'ملاحظة', stage_change: 'تغيير مرحلة', proposal: 'عرض سعر', contract: 'عقد',
}

const outcomeLabels: Record<string, { label: string; color: string }> = {
  interested: { label: 'مهتم', color: 'text-emerald-400' },
  not_interested: { label: 'غير مهتم', color: 'text-red-400' },
  no_answer: { label: 'لم يرد', color: 'text-[#5a5a78]' },
  callback_requested: { label: 'طلب معاودة', color: 'text-amber-400' },
  converted: { label: 'تم التحويل', color: 'text-[#c9a84c]' },
}

const followupTypeLabels: Record<FollowUpType, string> = {
  call: 'مكالمة', meeting: 'اجتماع', email: 'بريد', whatsapp: 'واتساب', site_visit: 'زيارة',
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date))
}

// ─── Add Activity Modal ─────────────────────────────
function AddActivityModal({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({ type: 'call' as string, outcome: '' as string, notes: '', duration: '', next_action: '', next_action_date: '' })

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#252535]">
          <h3 className="text-lg font-bold text-[#e2e2f0]">تسجيل نشاط جديد</h3>
          <button onClick={onClose} className="text-[#5a5a78] hover:text-[#e2e2f0]">✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">نوع النشاط</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
                {Object.entries(activityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">النتيجة</label>
              <select value={form.outcome} onChange={e => setForm(p => ({ ...p, outcome: e.target.value }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
                <option value="">— اختر —</option>
                {Object.entries(outcomeLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#5a5a78] mb-1">الملاحظات *</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} required rows={3} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">المدة (دقائق)</label>
              <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} type="number" className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">الإجراء التالي</label>
              <input value={form.next_action} onChange={e => setForm(p => ({ ...p, next_action: e.target.value }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-3 border-t border-[#252535]">
            <Button type="submit" className="bg-[#c9a84c] hover:bg-[#b8973f] text-black flex-1">حفظ النشاط</Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-[#252535] text-[#5a5a78]">إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────
export default function LeadDetailPage() {
  const [, navigate] = useLocation()
  const params = useParams<{ id: string }>()
  const [lead] = useState<Lead>(MOCK_LEAD)
  const [activities] = useState<DealActivity[]>(MOCK_ACTIVITIES)
  const [followups] = useState<FollowUp[]>(MOCK_FOLLOWUPS)
  const [activeTab, setActiveTab] = useState<'timeline' | 'followups' | 'deals' | 'ai'>('timeline')
  const [showActivityModal, setShowActivityModal] = useState(false)

  const tabs = [
    { id: 'timeline' as const, label: 'سجل النشاط', icon: Activity, count: activities.length },
    { id: 'followups' as const, label: 'المتابعات', icon: Calendar, count: followups.filter(f => f.status === 'pending').length },
    { id: 'deals' as const, label: 'الصفقات', icon: DollarSign, count: 1 },
    { id: 'ai' as const, label: 'توصيات AI', icon: Zap, count: 3 },
  ]

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/marketing/leads')} className="p-2 rounded-lg hover:bg-[#171724] text-[#5a5a78] hover:text-[#e2e2f0] transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#e2e2f0]">{lead.full_name}</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${lead.lead_type === 'investor' ? 'bg-[#60a5fa]/15 text-[#60a5fa]' : lead.lead_type === 'merchant' ? 'bg-[#34d399]/15 text-[#34d399]' : 'bg-[#f59e0b]/15 text-[#f59e0b]'}`}>{CLIENT_TYPES[lead.lead_type]}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${LEAD_STATUSES[lead.status].color === 'gold' ? 'bg-[#c9a84c]/15 text-[#c9a84c]' : LEAD_STATUSES[lead.status].color === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>{LEAD_STATUSES[lead.status].label}</span>
          </div>
          <p className="text-[#5a5a78] text-sm">{lead.company} · {lead.city} · {SECTORS[lead.sector]}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#252535] text-[#5a5a78] text-sm"><Edit className="w-4 h-4 ml-2" />تعديل</Button>
          <Button onClick={() => setShowActivityModal(true)} className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-sm"><Plus className="w-4 h-4 ml-2" />نشاط جديد</Button>
        </div>
      </div>

      {/* Profile Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contact Info */}
        <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#e2e2f0] border-b border-[#252535] pb-2">معلومات التواصل</h3>
          <div className="space-y-3">
            <a href={`tel:${lead.phone}`} className="flex items-center gap-3 text-sm text-[#e2e2f0] hover:text-[#c9a84c] transition-colors">
              <Phone className="w-4 h-4 text-[#5a5a78]" /><span dir="ltr">{lead.phone}</span>
              {lead.phone_whatsapp && <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded">WhatsApp</span>}
            </a>
            <a href={`mailto:${lead.email}`} className="flex items-center gap-3 text-sm text-[#e2e2f0] hover:text-[#c9a84c] transition-colors">
              <Mail className="w-4 h-4 text-[#5a5a78]" /><span dir="ltr">{lead.email}</span>
            </a>
            <div className="flex items-center gap-3 text-sm text-[#5a5a78]">
              <MapPin className="w-4 h-4" />{lead.city}
            </div>
            <div className="flex items-center gap-3 text-sm text-[#5a5a78]">
              <Building2 className="w-4 h-4" />{lead.company}
            </div>
          </div>
          <div className="pt-3 border-t border-[#252535] flex gap-2">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex-1"><Phone className="w-3 h-3 ml-1" />اتصال</Button>
            <Button size="sm" className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs flex-1"><MessageSquare className="w-3 h-3 ml-1" />واتساب</Button>
            <Button size="sm" variant="outline" className="border-[#252535] text-[#5a5a78] text-xs flex-1"><Mail className="w-3 h-3 ml-1" />بريد</Button>
          </div>
        </div>

        {/* AI Score + Priority */}
        <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#e2e2f0] border-b border-[#252535] pb-2">تقييم AI</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#252535" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={lead.ai_score >= 80 ? '#00e5a0' : lead.ai_score >= 60 ? '#f59e0b' : '#ff4d6d'} strokeWidth="8" strokeDasharray={`${lead.ai_score * 2.51} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-[#e2e2f0]">{lead.ai_score}</span>
                <span className="text-[10px] text-[#5a5a78]">AI Score</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#171724] rounded-lg p-2 text-center">
              <div className="text-[#5a5a78]">الأولوية</div>
              <div className={`font-bold ${lead.priority === 'hot' ? 'text-red-400' : lead.priority === 'warm' ? 'text-amber-400' : 'text-blue-400'}`}>{PRIORITIES[lead.priority].label}</div>
            </div>
            <div className="bg-[#171724] rounded-lg p-2 text-center">
              <div className="text-[#5a5a78]">المصدر</div>
              <div className="text-[#e2e2f0] font-medium">{LEAD_SOURCES[lead.source]}</div>
            </div>
            <div className="bg-[#171724] rounded-lg p-2 text-center">
              <div className="text-[#5a5a78]">تاريخ الإنشاء</div>
              <div className="text-[#e2e2f0] font-medium">{formatDate(lead.created_at)}</div>
            </div>
            <div className="bg-[#171724] rounded-lg p-2 text-center">
              <div className="text-[#5a5a78]">آخر تواصل</div>
              <div className="text-[#e2e2f0] font-medium">{lead.last_contacted_at ? formatDate(lead.last_contacted_at) : 'لم يتم'}</div>
            </div>
          </div>
        </div>

        {/* Next Action + Assignment */}
        <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#e2e2f0] border-b border-[#252535] pb-2">الإجراء التالي</h3>
          {lead.next_action ? (
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-lg p-4">
              <div className="text-[#c9a84c] font-bold text-sm mb-1">{lead.next_action}</div>
              {lead.next_action_date && (
                <div className="flex items-center gap-1 text-xs text-[#5a5a78]">
                  <Calendar className="w-3 h-3" />{formatDate(lead.next_action_date)}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1" />
              <div className="text-red-400 text-sm font-bold">لا يوجد إجراء محدد</div>
              <Button size="sm" className="mt-2 bg-[#c9a84c] hover:bg-[#b8973f] text-black text-xs"><Plus className="w-3 h-3 ml-1" />إضافة إجراء</Button>
            </div>
          )}
          <div className="pt-3 border-t border-[#252535]">
            <div className="text-xs text-[#5a5a78] mb-2">المسؤول</div>
            {lead.assigned_user ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-sm font-bold">{lead.assigned_user.name[0]}</div>
                <div>
                  <div className="text-sm text-[#e2e2f0]">{lead.assigned_user.name}</div>
                  <div className="text-xs text-[#5a5a78]">{lead.assigned_user.role}</div>
                </div>
                <span className={`w-2 h-2 rounded-full mr-auto ${lead.assigned_user.is_online ? 'bg-emerald-400' : 'bg-[#5a5a78]'}`} />
              </div>
            ) : (
              <div className="text-red-400 text-sm">غير مُعيّن</div>
            )}
          </div>
          {lead.notes && (
            <div className="pt-3 border-t border-[#252535]">
              <div className="text-xs text-[#5a5a78] mb-1">ملاحظات</div>
              <p className="text-sm text-[#e2e2f0] leading-relaxed">{lead.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#252535]">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-[#5a5a78] hover:text-[#e2e2f0]'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
              {tab.count > 0 && <span className="bg-[#171724] text-[#5a5a78] text-xs px-1.5 py-0.5 rounded-full font-mono">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#e2e2f0]">سجل النشاط</h3>
            <Button size="sm" onClick={() => setShowActivityModal(true)} className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-xs"><Plus className="w-3 h-3 ml-1" />نشاط جديد</Button>
          </div>
          <div className="relative pr-8">
            <div className="absolute right-3 top-0 bottom-0 w-px bg-[#252535]" />
            {activities.map((act, i) => {
              const Icon = activityIcons[act.type] || Activity
              return (
                <div key={act.id} className="relative mb-6 last:mb-0">
                  <div className="absolute right-0 top-1 w-7 h-7 rounded-full bg-[#171724] border border-[#252535] flex items-center justify-center z-10">
                    <Icon className="w-3.5 h-3.5 text-[#c9a84c]" />
                  </div>
                  <div className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-4 mr-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#e2e2f0]">{activityLabels[act.type]}</span>
                        {act.outcome && <span className={`text-xs ${outcomeLabels[act.outcome]?.color || 'text-[#5a5a78]'}`}>({outcomeLabels[act.outcome]?.label})</span>}
                        {act.duration && <span className="text-xs text-[#5a5a78]">{act.duration} دقيقة</span>}
                      </div>
                      <span className="text-xs text-[#5a5a78]">{formatDateTime(act.created_at)}</span>
                    </div>
                    <p className="text-sm text-[#e2e2f0]/80 leading-relaxed">{act.notes}</p>
                    {act.next_action && (
                      <div className="mt-2 pt-2 border-t border-[#252535]/50 flex items-center gap-2 text-xs text-[#c9a84c]">
                        <ArrowRight className="w-3 h-3" />التالي: {act.next_action}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'followups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#e2e2f0]">المتابعات</h3>
            <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-xs"><Plus className="w-3 h-3 ml-1" />متابعة جديدة</Button>
          </div>
          <div className="space-y-3">
            {followups.map(fu => (
              <div key={fu.id} className={`bg-[#0f0f1a] border rounded-lg p-4 flex items-center justify-between ${fu.status === 'overdue' ? 'border-red-500/50 bg-red-500/5' : fu.status === 'completed' ? 'border-emerald-500/30' : 'border-[#252535]'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fu.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : fu.status === 'overdue' ? 'bg-red-500/15 text-red-400' : 'bg-[#c9a84c]/15 text-[#c9a84c]'}`}>
                    {fu.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm text-[#e2e2f0] font-medium">{followupTypeLabels[fu.type]}</div>
                    <div className="text-xs text-[#5a5a78]">{formatDateTime(fu.due_date)}</div>
                    {fu.notes && <div className="text-xs text-[#5a5a78] mt-1">{fu.notes}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {fu.status === 'pending' && (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"><CheckCircle2 className="w-3 h-3 ml-1" />إكمال</Button>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${fu.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : fu.status === 'overdue' ? 'bg-red-500/15 text-red-400' : 'bg-[#c9a84c]/15 text-[#c9a84c]'}`}>
                    {fu.status === 'completed' ? 'مكتمل' : fu.status === 'overdue' ? 'متأخر' : 'قادم'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#e2e2f0]">الصفقات</h3>
          <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[#e2e2f0] font-bold">صفقة مساحة بوليفارد وورلد</div>
                <div className="text-[#5a5a78] text-sm">المرحلة: مؤهل · احتمال الإغلاق: 75%</div>
              </div>
              <div className="text-2xl font-bold font-mono text-[#c9a84c]">٤٥٠,٠٠٠ ر.س</div>
            </div>
            <div className="flex gap-1">
              {PIPELINE_STAGES_DEFAULT.map((stage, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i <= 3 ? 'bg-[#c9a84c]' : 'bg-[#252535]'}`} title={stage.name_ar} />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-[#5a5a78]">
              <span>جديد</span><span>مكتمل</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#e2e2f0]">توصيات الذكاء الاصطناعي</h3>
          <div className="grid gap-3">
            {[
              { title: 'أفضل وقت للاتصال', desc: 'الأحد - الخميس، 10:00 - 11:30 صباحاً (بناءً على تاريخ الردود)', icon: Phone, color: 'text-emerald-400' },
              { title: 'الحزمة المقترحة', desc: 'مساحة Premium A3 (200م²) — تطابق 87% مع متطلبات العميل', icon: Star, color: 'text-[#c9a84c]' },
              { title: 'فرصة إحالة', desc: 'العميل يعرف فهد العتيبي (Lead #2) — اقترح برنامج إحالة بخصم 5%', icon: Users, color: 'text-[#60a5fa]' },
            ].map((rec, i) => (
              <div key={i} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-[#171724] flex items-center justify-center flex-shrink-0 ${rec.color}`}><rec.icon className="w-5 h-5" /></div>
                <div>
                  <div className="text-sm font-bold text-[#e2e2f0]">{rec.title}</div>
                  <div className="text-sm text-[#5a5a78] mt-1">{rec.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {showActivityModal && <AddActivityModal onClose={() => setShowActivityModal(false)} onSave={(data) => { setShowActivityModal(false) }} />}
    </div>
  )
}
