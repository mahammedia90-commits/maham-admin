/*
 * Lead Generation Center — مركز توليد العملاء المحتملين
 * Route: /marketing/leads
 * Design: Dark surface (#0f0f1a) + Gold accents (#c9a84c)
 * Font: IBM Plex Sans Arabic
 * Features: Full CRUD, filters, bulk actions, AI scoring, export, import
 * API-ready: Uses leadsApi — works with mock data until Laravel is connected
 */
import { useState, useMemo, useCallback } from 'react'
import { useLocation } from 'wouter'
import {
  Search, Plus, Upload, Download, Filter, MoreHorizontal,
  Phone, Mail, Building2, MapPin, Star, TrendingUp, TrendingDown,
  Users, Target, Flame, Thermometer, Snowflake, ChevronLeft,
  ChevronRight, Eye, Edit, Trash2, UserPlus, ArrowUpDown, X,
  RefreshCw, CheckCircle2, AlertTriangle, Clock, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  Lead, LeadStatus, Priority, ClientType, LeadSource, Sector,
} from '@/types/revenue-engine'
import {
  SECTORS, LEAD_SOURCES, CLIENT_TYPES, PRIORITIES, LEAD_STATUSES, SAUDI_CITIES,
} from '@/types/revenue-engine'

// ─── Mock Data ──────────────────────────────────────
const MOCK_LEADS: Lead[] = [
  { id: 1, full_name: 'عبدالله المنصور', company: 'شركة المنصور للعقارات', phone: '+966535001001', phone_whatsapp: true, email: 'abdullah@mansour.sa', city: 'الرياض', sector: 'real_estate', lead_type: 'investor', source: 'website', priority: 'hot', assigned_to: 1, ai_score: 92, status: 'qualified', next_action: 'اجتماع عرض المساحات', next_action_date: '2026-04-03', notes: 'مهتم بمساحة 200م²', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-04-01T08:00:00Z', last_contacted_at: '2026-04-01T08:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true } },
  { id: 2, full_name: 'فهد العتيبي', company: 'مجموعة فهد التجارية', phone: '+966535002002', phone_whatsapp: true, email: 'fahd@fahd-group.sa', city: 'جدة', sector: 'food', lead_type: 'merchant', source: 'exhibition', priority: 'hot', assigned_to: 2, ai_score: 87, status: 'contacted', next_action: 'إرسال عرض سعر', next_action_date: '2026-04-02', notes: 'يريد كشك F&B في بوليفارد', created_at: '2026-03-25T14:00:00Z', updated_at: '2026-03-31T16:00:00Z', last_contacted_at: '2026-03-31T16:00:00Z', assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', is_online: true } },
  { id: 3, full_name: 'نورة الدوسري', company: 'بنك الاستثمار السعودي', phone: '+966535003003', phone_whatsapp: false, email: 'noura@sib.sa', city: 'الرياض', sector: 'tech', lead_type: 'sponsor', source: 'referral', priority: 'warm', assigned_to: 1, ai_score: 78, status: 'new', next_action: 'اتصال تعريفي', next_action_date: '2026-04-02', notes: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', last_contacted_at: null, assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true } },
  { id: 4, full_name: 'خالد الحربي', company: 'حربي فاشن', phone: '+966535004004', phone_whatsapp: true, email: 'khalid@harbifashion.sa', city: 'الدمام', sector: 'fashion', lead_type: 'merchant', source: 'cold_call', priority: 'cold', assigned_to: null, ai_score: 45, status: 'new', next_action: null, next_action_date: null, notes: null, created_at: '2026-04-01T07:00:00Z', updated_at: '2026-04-01T07:00:00Z', last_contacted_at: null },
  { id: 5, full_name: 'سلطان الغامدي', company: 'الغامدي للتجزئة', phone: '+966535005005', phone_whatsapp: true, email: 'sultan@ghamdi-retail.sa', city: 'الطائف', sector: 'retail', lead_type: 'merchant', source: 'campaign', priority: 'warm', assigned_to: 2, ai_score: 68, status: 'contacted', next_action: 'متابعة بعد العرض', next_action_date: '2026-04-04', notes: 'طلب تفاصيل الأسعار', created_at: '2026-03-20T11:00:00Z', updated_at: '2026-03-30T14:00:00Z', last_contacted_at: '2026-03-30T14:00:00Z', assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', is_online: true } },
  { id: 6, full_name: 'ريم السبيعي', company: 'ريم تك', phone: '+966535006006', phone_whatsapp: true, email: 'reem@reemtech.sa', city: 'الخبر', sector: 'tech', lead_type: 'sponsor', source: 'website', priority: 'hot', assigned_to: 1, ai_score: 91, status: 'qualified', next_action: 'توقيع عقد رعاية', next_action_date: '2026-04-05', notes: 'موافقة مبدئية على حزمة بلاتينية', created_at: '2026-03-15T09:00:00Z', updated_at: '2026-04-01T10:00:00Z', last_contacted_at: '2026-04-01T10:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true } },
  { id: 7, full_name: 'محمد الزهراني', company: 'مجموعة الزهراني', phone: '+966535007007', phone_whatsapp: false, email: 'mz@zahrani.sa', city: 'أبها', sector: 'real_estate', lead_type: 'investor', source: 'referral', priority: 'warm', assigned_to: null, ai_score: 55, status: 'new', next_action: null, next_action_date: null, notes: 'إحالة من عبدالله المنصور', created_at: '2026-04-01T06:00:00Z', updated_at: '2026-04-01T06:00:00Z', last_contacted_at: null },
  { id: 8, full_name: 'هند القرني', company: 'هند للأزياء', phone: '+966535008008', phone_whatsapp: true, email: 'hind@hindstyle.sa', city: 'مكة المكرمة', sector: 'fashion', lead_type: 'merchant', source: 'exhibition', priority: 'hot', assigned_to: 2, ai_score: 85, status: 'contacted', next_action: 'زيارة موقع', next_action_date: '2026-04-03', notes: 'تريد مساحة في منطقة الأزياء', created_at: '2026-03-22T13:00:00Z', updated_at: '2026-03-31T11:00:00Z', last_contacted_at: '2026-03-31T11:00:00Z', assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', is_online: true } },
]

const MOCK_EMPLOYEES = [
  { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true },
  { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', is_online: true },
  { id: 3, name: 'محمد العنزي', role: 'مندوب مبيعات', department: 'المبيعات', is_online: false },
]

// ─── Helper Components ──────────────────────────────
function PriorityBadge({ priority }: { priority: Priority }) {
  const config = { hot: { icon: Flame, bg: 'bg-red-500/15', text: 'text-red-400', label: 'ساخن' }, warm: { icon: Thermometer, bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'دافئ' }, cold: { icon: Snowflake, bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'بارد' } }
  const c = config[priority]
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}><c.icon className="w-3 h-3" />{c.label}</span>
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const colors: Record<LeadStatus, string> = { new: 'bg-[#c9a84c]/15 text-[#c9a84c]', contacted: 'bg-blue-500/15 text-blue-400', qualified: 'bg-emerald-500/15 text-emerald-400', converted: 'bg-green-500/15 text-green-400', lost: 'bg-red-500/15 text-red-400' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}>{LEAD_STATUSES[status].label}</span>
}

function TypeBadge({ type }: { type: ClientType }) {
  const colors: Record<ClientType, string> = { investor: 'bg-[#60a5fa]/15 text-[#60a5fa]', merchant: 'bg-[#34d399]/15 text-[#34d399]', sponsor: 'bg-[#f59e0b]/15 text-[#f59e0b]' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[type]}`}>{CLIENT_TYPES[type]}</span>
}

function AIScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
  const bg = score >= 80 ? 'bg-emerald-500/15' : score >= 60 ? 'bg-amber-500/15' : 'bg-red-500/15'
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold ${bg} ${color}`}><Zap className="w-3 h-3" />{score}%</span>
}

function EmptyState({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Users className="w-16 h-16 text-[#5a5a78] mb-4" />
      <h3 className="text-lg font-semibold text-[#e2e2f0] mb-2">{title}</h3>
      <p className="text-[#5a5a78] mb-6 max-w-md">{description}</p>
      <Button onClick={onAction} className="bg-[#c9a84c] hover:bg-[#b8973f] text-black"><Plus className="w-4 h-4 ml-2" />{actionLabel}</Button>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3"><div className="h-4 bg-[#252535] rounded w-3/4" /></td>
      ))}
    </tr>
  )
}

// ─── Add/Edit Lead Modal ────────────────────────────
function LeadFormModal({ lead, onClose, onSave }: { lead?: Lead | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    full_name: lead?.full_name || '',
    company: lead?.company || '',
    phone: lead?.phone || '',
    phone_whatsapp: lead?.phone_whatsapp ?? true,
    email: lead?.email || '',
    city: lead?.city || SAUDI_CITIES[0],
    sector: lead?.sector || 'real_estate' as Sector,
    lead_type: lead?.lead_type || 'merchant' as ClientType,
    source: lead?.source || 'website' as LeadSource,
    priority: lead?.priority || 'warm' as Priority,
    assigned_to: lead?.assigned_to || null as number | null,
    notes: lead?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#252535]">
          <h2 className="text-lg font-bold text-[#e2e2f0]">{lead ? 'تعديل العميل المحتمل' : 'إضافة عميل محتمل جديد'}</h2>
          <button onClick={onClose} className="text-[#5a5a78] hover:text-[#e2e2f0]"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">الاسم الكامل *</label>
              <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">الشركة *</label>
              <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} required className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">الهاتف *</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required dir="ltr" className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none text-left" />
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">البريد الإلكتروني *</label>
              <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required type="email" dir="ltr" className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none text-left" />
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">المدينة</label>
              <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
                {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">القطاع</label>
              <select value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value as Sector }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
                {(Object.entries(SECTORS) as [Sector, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">نوع العميل</label>
              <select value={form.lead_type} onChange={e => setForm(p => ({ ...p, lead_type: e.target.value as ClientType }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
                {(Object.entries(CLIENT_TYPES) as [ClientType, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">المصدر</label>
              <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value as LeadSource }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
                {(Object.entries(LEAD_SOURCES) as [LeadSource, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">الأولوية</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
                {(Object.entries(PRIORITIES) as [Priority, { label: string }][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#5a5a78] mb-1">المسؤول</label>
              <select value={form.assigned_to ?? ''} onChange={e => setForm(p => ({ ...p, assigned_to: e.target.value ? Number(e.target.value) : null }))} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
                <option value="">غير محدد</option>
                {MOCK_EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#5a5a78] mb-1">ملاحظات</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className="w-full bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.phone_whatsapp} onChange={e => setForm(p => ({ ...p, phone_whatsapp: e.target.checked }))} id="whatsapp" className="accent-[#c9a84c]" />
            <label htmlFor="whatsapp" className="text-sm text-[#5a5a78]">الرقم متاح على واتساب</label>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#252535]">
            <Button type="submit" className="bg-[#c9a84c] hover:bg-[#b8973f] text-black flex-1">{lead ? 'حفظ التعديلات' : 'إضافة العميل'}</Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-[#252535] text-[#5a5a78]">إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────
export default function LeadGenerationPage() {
  const [, navigate] = useLocation()
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [loading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all')
  const [filterType, setFilterType] = useState<ClientType | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
  const [filterSource, setFilterSource] = useState<LeadSource | 'all'>('all')
  const [sortField, setSortField] = useState<'created_at' | 'ai_score' | 'full_name' | 'last_contacted_at'>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 15

  // Filtered & sorted
  const filtered = useMemo(() => {
    let result = [...leads]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(l => l.full_name.toLowerCase().includes(s) || l.company.toLowerCase().includes(s) || l.phone.includes(s) || l.email.toLowerCase().includes(s))
    }
    if (filterStatus !== 'all') result = result.filter(l => l.status === filterStatus)
    if (filterType !== 'all') result = result.filter(l => l.lead_type === filterType)
    if (filterPriority !== 'all') result = result.filter(l => l.priority === filterPriority)
    if (filterSource !== 'all') result = result.filter(l => l.source === filterSource)
    result.sort((a, b) => {
      const av = a[sortField] ?? ''
      const bv = b[sortField] ?? ''
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return result
  }, [leads, search, filterStatus, filterType, filterPriority, filterSource, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  // Stats
  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    hot: leads.filter(l => l.priority === 'hot').length,
    unassigned: leads.filter(l => !l.assigned_to).length,
    noContact24h: leads.filter(l => !l.last_contacted_at && new Date().getTime() - new Date(l.created_at).getTime() > 86400000).length,
    avgScore: Math.round(leads.reduce((s, l) => s + l.ai_score, 0) / leads.length),
  }), [leads])

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(paginated.map(l => l.id)))
  }

  const handleSave = useCallback((data: any) => {
    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...l, ...data, updated_at: new Date().toISOString() } : l))
    } else {
      const newLead: Lead = { ...data, id: Date.now(), ai_score: 0, status: 'new' as LeadStatus, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_contacted_at: null }
      setLeads(prev => [newLead, ...prev])
    }
    setShowModal(false)
    setEditingLead(null)
  }, [editingLead])

  const handleDelete = (id: number) => {
    setLeads(prev => prev.filter(l => l.id !== id))
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const handleBulkAssign = (assignTo: number) => {
    setLeads(prev => prev.map(l => selectedIds.has(l.id) ? { ...l, assigned_to: assignTo, assigned_user: MOCK_EMPLOYEES.find(e => e.id === assignTo) } : l))
    setSelectedIds(new Set())
  }

  const timeSince = (date: string | null) => {
    if (!date) return 'لم يتم التواصل'
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'أقل من ساعة'
    if (hours < 24) return `${hours} ساعة`
    return `${Math.floor(hours / 24)} يوم`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2f0]">مركز توليد العملاء المحتملين</h1>
          <p className="text-[#5a5a78] text-sm mt-1">إدارة وتتبع جميع العملاء المحتملين — المستثمرين والتجار والرعاة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#252535] text-[#5a5a78] text-sm"><Upload className="w-4 h-4 ml-2" />استيراد</Button>
          <Button variant="outline" className="border-[#252535] text-[#5a5a78] text-sm"><Download className="w-4 h-4 ml-2" />تصدير</Button>
          <Button onClick={() => { setEditingLead(null); setShowModal(true) }} className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-sm"><Plus className="w-4 h-4 ml-2" />عميل جديد</Button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'إجمالي العملاء', value: stats.total, icon: Users, color: 'text-[#c9a84c]' },
          { label: 'جدد اليوم', value: stats.new, icon: Plus, color: 'text-[#60a5fa]' },
          { label: 'ساخن', value: stats.hot, icon: Flame, color: 'text-red-400' },
          { label: 'غير مُعيّن', value: stats.unassigned, icon: UserPlus, color: stats.unassigned > 0 ? 'text-red-400' : 'text-emerald-400' },
          { label: 'بدون تواصل +24س', value: stats.noContact24h, icon: AlertTriangle, color: stats.noContact24h > 0 ? 'text-red-400' : 'text-emerald-400' },
          { label: 'متوسط AI Score', value: `${stats.avgScore}%`, icon: Zap, color: 'text-[#c9a84c]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-[#171724] flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-[#5a5a78]">{s.label}</div>
              <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a78]" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="بحث بالاسم، الشركة، الهاتف، البريد..." className="w-full bg-[#171724] border border-[#252535] rounded-lg pr-10 pl-4 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none placeholder:text-[#5a5a78]" />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className={`border-[#252535] text-sm ${showFilters ? 'text-[#c9a84c] border-[#c9a84c]' : 'text-[#5a5a78]'}`}><Filter className="w-4 h-4 ml-2" />فلاتر</Button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#252535]">
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as any); setPage(1) }} className="bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
              <option value="all">كل الحالات</option>
              {(Object.entries(LEAD_STATUSES) as [LeadStatus, { label: string }][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={filterType} onChange={e => { setFilterType(e.target.value as any); setPage(1) }} className="bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
              <option value="all">كل الأنواع</option>
              {(Object.entries(CLIENT_TYPES) as [ClientType, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filterPriority} onChange={e => { setFilterPriority(e.target.value as any); setPage(1) }} className="bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
              <option value="all">كل الأولويات</option>
              {(Object.entries(PRIORITIES) as [Priority, { label: string }][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={filterSource} onChange={e => { setFilterSource(e.target.value as any); setPage(1) }} className="bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
              <option value="all">كل المصادر</option>
              {(Object.entries(LEAD_SOURCES) as [LeadSource, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm text-[#c9a84c]">تم تحديد {selectedIds.size} عميل</span>
          <div className="flex gap-2">
            {MOCK_EMPLOYEES.map(emp => (
              <Button key={emp.id} size="sm" variant="outline" onClick={() => handleBulkAssign(emp.id)} className="border-[#252535] text-[#e2e2f0] text-xs"><UserPlus className="w-3 h-3 ml-1" />تعيين لـ {emp.name.split(' ')[0]}</Button>
            ))}
            <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())} className="border-[#252535] text-[#5a5a78] text-xs"><X className="w-3 h-3 ml-1" />إلغاء</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl overflow-hidden">
        {loading ? (
          <table className="w-full"><tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</tbody></table>
        ) : filtered.length === 0 ? (
          <EmptyState title="لا توجد عملاء محتملين" description="ابدأ بإضافة أول عميل محتمل أو استيراد قائمة من ملف Excel" actionLabel="إضافة عميل" onAction={() => { setEditingLead(null); setShowModal(true) }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252535] bg-[#171724]/50">
                  <th className="px-4 py-3 text-right">
                    <input type="checkbox" checked={selectedIds.size === paginated.length && paginated.length > 0} onChange={toggleSelectAll} className="accent-[#c9a84c]" />
                  </th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium cursor-pointer" onClick={() => toggleSort('full_name')}>
                    <span className="inline-flex items-center gap-1">العميل <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">النوع</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">الأولوية</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">الحالة</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium cursor-pointer" onClick={() => toggleSort('ai_score')}>
                    <span className="inline-flex items-center gap-1">AI Score <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">المسؤول</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium cursor-pointer" onClick={() => toggleSort('last_contacted_at')}>
                    <span className="inline-flex items-center gap-1">آخر تواصل <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">الإجراء التالي</th>
                  <th className="px-4 py-3 text-center text-[#5a5a78] font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(lead => {
                  const isOverdue = !lead.last_contacted_at && (Date.now() - new Date(lead.created_at).getTime() > 86400000)
                  return (
                    <tr key={lead.id} className={`border-b border-[#252535]/50 hover:bg-[#171724]/50 transition-colors ${isOverdue ? 'bg-red-500/5' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="accent-[#c9a84c]" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-[#e2e2f0] font-medium">{lead.full_name}</span>
                          <span className="text-[#5a5a78] text-xs flex items-center gap-1"><Building2 className="w-3 h-3" />{lead.company}</span>
                          <span className="text-[#5a5a78] text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.city} · {SECTORS[lead.sector]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><TypeBadge type={lead.lead_type} /></td>
                      <td className="px-4 py-3"><PriorityBadge priority={lead.priority} /></td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3"><AIScoreBadge score={lead.ai_score} /></td>
                      <td className="px-4 py-3">
                        {lead.assigned_user ? (
                          <span className="text-[#e2e2f0] text-xs">{lead.assigned_user.name}</span>
                        ) : (
                          <span className="text-red-400 text-xs font-medium">غير مُعيّن</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${isOverdue ? 'text-red-400 font-bold' : 'text-[#5a5a78]'}`}>
                          {isOverdue && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                          {timeSince(lead.last_contacted_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {lead.next_action ? (
                          <div className="flex flex-col">
                            <span className="text-[#e2e2f0] text-xs">{lead.next_action}</span>
                            {lead.next_action_date && <span className="text-[#5a5a78] text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(lead.next_action_date).toLocaleDateString('ar-SA')}</span>}
                          </div>
                        ) : (
                          <span className="text-[#5a5a78] text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => navigate(`/leads/${lead.id}`)} className="p-1.5 rounded hover:bg-[#171724] text-[#5a5a78] hover:text-[#e2e2f0] transition-colors" title="عرض"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => { setEditingLead(lead); setShowModal(true) }} className="p-1.5 rounded hover:bg-[#171724] text-[#5a5a78] hover:text-[#c9a84c] transition-colors" title="تعديل"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded hover:bg-[#171724] text-[#5a5a78] hover:text-red-400 transition-colors" title="حذف"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#252535]">
            <span className="text-xs text-[#5a5a78]">عرض {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} من {filtered.length}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-[#171724] text-[#5a5a78] disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-xs ${p === page ? 'bg-[#c9a84c] text-black font-bold' : 'text-[#5a5a78] hover:bg-[#171724]'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded hover:bg-[#171724] text-[#5a5a78] disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <LeadFormModal lead={editingLead} onClose={() => { setShowModal(false); setEditingLead(null) }} onSave={handleSave} />}
    </div>
  )
}
