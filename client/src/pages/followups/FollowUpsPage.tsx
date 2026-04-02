/*
 * Follow-Up Engine — محرك المتابعات
 * Route: /sales/followups
 * Features: Calendar view, overdue alerts, SLA tracking, daily task list, bulk actions
 */
import { useState, useMemo } from 'react'
import {
  Calendar, Clock, AlertTriangle, CheckCircle2, Phone, Mail,
  MessageSquare, MapPin, Video, Filter, Search, Plus, Users,
  TrendingUp, Flame, ChevronLeft, ChevronRight, Eye, X, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FollowUp, FollowUpType, FollowUpOutcome } from '@/types/revenue-engine'

const FOLLOW_UP_TYPES: Record<FollowUpType, { label: string; icon: any; color: string }> = {
  call: { label: 'مكالمة', icon: Phone, color: 'text-emerald-400' },
  meeting: { label: 'اجتماع', icon: Video, color: 'text-blue-400' },
  email: { label: 'بريد', icon: Mail, color: 'text-purple-400' },
  whatsapp: { label: 'واتساب', icon: MessageSquare, color: 'text-[#25D366]' },
  site_visit: { label: 'زيارة موقع', icon: MapPin, color: 'text-amber-400' },
}

const MOCK_FOLLOWUPS: FollowUp[] = [
  { id: 1, lead_id: 1, deal_id: 1, due_date: '2026-04-02T10:00:00Z', type: 'call', status: 'overdue', assigned_to: 1, notes: 'متابعة عرض السعر مع عبدالله المنصور', created_at: '2026-03-31T08:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true }, lead: { full_name: 'عبدالله المنصور', company: 'شركة المنصور للعقارات', lead_type: 'investor', priority: 'hot', ai_score: 92 } as any },
  { id: 2, lead_id: 2, deal_id: 2, due_date: '2026-04-02T14:00:00Z', type: 'email', status: 'pending', assigned_to: 2, notes: 'إرسال عرض سعر مفصل لفهد العتيبي', created_at: '2026-04-01T16:00:00Z', assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', is_online: true }, lead: { full_name: 'فهد العتيبي', company: 'مجموعة فهد التجارية', lead_type: 'merchant', priority: 'hot', ai_score: 87 } as any },
  { id: 3, lead_id: 6, deal_id: 3, due_date: '2026-04-03T11:00:00Z', type: 'meeting', status: 'pending', assigned_to: 1, notes: 'اجتماع توقيع عقد رعاية مع ريم السبيعي', created_at: '2026-04-01T10:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true }, lead: { full_name: 'ريم السبيعي', company: 'ريم تك', lead_type: 'sponsor', priority: 'hot', ai_score: 91 } as any },
  { id: 4, lead_id: 8, deal_id: 4, due_date: '2026-04-03T09:00:00Z', type: 'site_visit', status: 'pending', assigned_to: 2, notes: 'زيارة موقع بوليفارد مع هند القرني', created_at: '2026-04-01T11:00:00Z', assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', is_online: true }, lead: { full_name: 'هند القرني', company: 'هند للأزياء', lead_type: 'merchant', priority: 'hot', ai_score: 85 } as any },
  { id: 5, lead_id: 5, deal_id: 5, due_date: '2026-04-04T10:00:00Z', type: 'whatsapp', status: 'pending', assigned_to: 2, notes: 'متابعة سلطان الغامدي بعد العرض', created_at: '2026-03-30T14:00:00Z', assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', is_online: true }, lead: { full_name: 'سلطان الغامدي', company: 'الغامدي للتجزئة', lead_type: 'merchant', priority: 'warm', ai_score: 68 } as any },
  { id: 6, lead_id: 3, deal_id: 6, due_date: '2026-04-02T09:00:00Z', type: 'call', status: 'overdue', assigned_to: 1, notes: 'اتصال تعريفي مع نورة الدوسري', created_at: '2026-04-01T09:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true }, lead: { full_name: 'نورة الدوسري', company: 'بنك الاستثمار السعودي', lead_type: 'sponsor', priority: 'warm', ai_score: 78 } as any },
  { id: 7, lead_id: 1, deal_id: 1, due_date: '2026-04-01T10:00:00Z', type: 'email', status: 'completed', outcome: 'interested', notes: 'تم إرسال العرض بنجاح', assigned_to: 1, completed_at: '2026-04-01T10:30:00Z', created_at: '2026-03-31T16:00:00Z', assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات', department: 'المبيعات', is_online: true }, lead: { full_name: 'عبدالله المنصور', company: 'شركة المنصور للعقارات', lead_type: 'investor', priority: 'hot', ai_score: 92 } as any },
  { id: 8, lead_id: 2, deal_id: 2, due_date: '2026-03-31T14:00:00Z', type: 'call', status: 'completed', outcome: 'callback_requested', notes: 'العميل في اجتماع، طلب معاودة الاتصال', duration: 3, assigned_to: 2, completed_at: '2026-03-31T14:05:00Z', created_at: '2026-03-31T08:00:00Z', assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', is_online: true }, lead: { full_name: 'فهد العتيبي', company: 'مجموعة فهد التجارية', lead_type: 'merchant', priority: 'hot', ai_score: 87 } as any },
]

const EMPLOYEES = [
  { id: 1, name: 'أحمد الشمري' },
  { id: 2, name: 'سارة القحطاني' },
  { id: 3, name: 'محمد العنزي' },
]

function formatTime(date: string) { return new Intl.DateTimeFormat('ar-SA', { hour: '2-digit', minute: '2-digit' }).format(new Date(date)) }
function formatDate(date: string) { return new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric' }).format(new Date(date)) }
function formatFull(date: string) { return new Intl.DateTimeFormat('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(date)) }

export default function FollowUpsPage() {
  const [followups, setFollowups] = useState(MOCK_FOLLOWUPS)
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'pending' | 'completed'>('all')
  const [filterType, setFilterType] = useState<FollowUpType | 'all'>('all')
  const [filterEmployee, setFilterEmployee] = useState<number | 'all'>('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const filtered = useMemo(() => {
    let result = [...followups]
    if (search) { const s = search.toLowerCase(); result = result.filter(f => (f as any).lead?.full_name?.toLowerCase().includes(s) || f.notes?.toLowerCase().includes(s)) }
    if (filterStatus !== 'all') result = result.filter(f => f.status === filterStatus)
    if (filterType !== 'all') result = result.filter(f => f.type === filterType)
    if (filterEmployee !== 'all') result = result.filter(f => f.assigned_to === filterEmployee)
    result.sort((a, b) => { if (a.status === 'overdue' && b.status !== 'overdue') return -1; if (b.status === 'overdue' && a.status !== 'overdue') return 1; return new Date(a.due_date).getTime() - new Date(b.due_date).getTime() })
    return result
  }, [followups, search, filterStatus, filterType, filterEmployee])

  const stats = useMemo(() => ({
    total: followups.length,
    overdue: followups.filter(f => f.status === 'overdue').length,
    pending: followups.filter(f => f.status === 'pending').length,
    completed: followups.filter(f => f.status === 'completed').length,
    todayPending: followups.filter(f => f.status === 'pending' && new Date(f.due_date).toDateString() === new Date().toDateString()).length,
  }), [followups])

  const markComplete = (id: number) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, status: 'completed' as const, completed_at: new Date().toISOString(), outcome: 'interested' as FollowUpOutcome } : f))
  }

  // Group by date for list view
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {}
    filtered.forEach(f => {
      const key = new Date(f.due_date).toDateString()
      if (!groups[key]) groups[key] = []
      groups[key].push(f)
    })
    return Object.entries(groups).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
  }, [filtered])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2f0]">محرك المتابعات</h1>
          <p className="text-[#5a5a78] text-sm mt-1">تتبع جميع المتابعات المجدولة — لا يفلت أي عميل محتمل</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-[#171724] rounded-lg p-0.5">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${view === 'list' ? 'bg-[#c9a84c] text-black' : 'text-[#5a5a78]'}`}>قائمة</button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${view === 'calendar' ? 'bg-[#c9a84c] text-black' : 'text-[#5a5a78]'}`}>تقويم</button>
          </div>
          <Button className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-sm"><Plus className="w-4 h-4 ml-2" />متابعة جديدة</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'إجمالي المتابعات', value: stats.total, icon: Calendar, color: 'text-[#c9a84c]', onClick: () => setFilterStatus('all') },
          { label: 'متأخرة', value: stats.overdue, icon: AlertTriangle, color: stats.overdue > 0 ? 'text-red-400' : 'text-emerald-400', onClick: () => setFilterStatus('overdue') },
          { label: 'قادمة', value: stats.pending, icon: Clock, color: 'text-amber-400', onClick: () => setFilterStatus('pending') },
          { label: 'اليوم', value: stats.todayPending, icon: Flame, color: 'text-[#c9a84c]', onClick: () => setFilterStatus('pending') },
          { label: 'مكتملة', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-400', onClick: () => setFilterStatus('completed') },
        ].map((s, i) => (
          <button key={i} onClick={s.onClick} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-3 flex items-center gap-3 hover:border-[#c9a84c]/30 transition-colors text-right">
            <div className={`w-10 h-10 rounded-lg bg-[#171724] flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-[#5a5a78]">{s.label}</div>
              <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a78]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الملاحظات..." className="w-full bg-[#171724] border border-[#252535] rounded-lg pr-10 pl-4 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none placeholder:text-[#5a5a78]" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
            <option value="all">كل الحالات</option>
            <option value="overdue">متأخرة</option>
            <option value="pending">قادمة</option>
            <option value="completed">مكتملة</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
            <option value="all">كل الأنواع</option>
            {(Object.entries(FOLLOW_UP_TYPES) as [FollowUpType, any][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filterEmployee === 'all' ? 'all' : String(filterEmployee)} onChange={e => setFilterEmployee(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
            <option value="all">كل الموظفين</option>
            {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-6">
          {grouped.length === 0 ? (
            <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#e2e2f0] mb-2">لا توجد متابعات</h3>
              <p className="text-[#5a5a78]">جميع المتابعات مكتملة أو لا توجد نتائج للفلتر المحدد</p>
            </div>
          ) : (
            grouped.map(([dateKey, items]) => {
              const isToday = new Date(dateKey).toDateString() === new Date().toDateString()
              const isPast = new Date(dateKey) < new Date() && !isToday
              return (
                <div key={dateKey}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className={`text-sm font-bold ${isToday ? 'text-[#c9a84c]' : isPast ? 'text-red-400' : 'text-[#e2e2f0]'}`}>
                      {isToday ? 'اليوم' : formatFull(items[0].due_date)}
                    </h3>
                    <span className="text-xs text-[#5a5a78] bg-[#171724] px-2 py-0.5 rounded-full">{items.length}</span>
                    <div className="flex-1 h-px bg-[#252535]" />
                  </div>
                  <div className="space-y-2">
                    {items.map(fu => {
                      const typeConfig = FOLLOW_UP_TYPES[fu.type]
                      const TypeIcon = typeConfig.icon
                      return (
                        <div key={fu.id} className={`bg-[#0f0f1a] border rounded-lg p-4 flex items-center gap-4 transition-all hover:border-[#c9a84c]/30 ${fu.status === 'overdue' ? 'border-red-500/50 bg-red-500/5' : fu.status === 'completed' ? 'border-emerald-500/20 opacity-60' : 'border-[#252535]'}`}>
                          {/* Type Icon */}
                          <div className={`w-10 h-10 rounded-lg bg-[#171724] flex items-center justify-center flex-shrink-0 ${typeConfig.color}`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-[#e2e2f0]">{(fu as any).lead?.full_name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${(fu as any).lead?.lead_type === 'investor' ? 'bg-[#60a5fa]/15 text-[#60a5fa]' : (fu as any).lead?.lead_type === 'sponsor' ? 'bg-[#f59e0b]/15 text-[#f59e0b]' : 'bg-[#34d399]/15 text-[#34d399]'}`}>
                                {(fu as any).lead?.lead_type === 'investor' ? 'مستثمر' : (fu as any).lead?.lead_type === 'sponsor' ? 'راعي' : 'تاجر'}
                              </span>
                              {(fu as any).lead?.ai_score >= 80 && <span className="text-xs bg-[#c9a84c]/15 text-[#c9a84c] px-1.5 py-0.5 rounded flex items-center gap-0.5"><Zap className="w-3 h-3" />{(fu as any).lead?.ai_score}%</span>}
                            </div>
                            <p className="text-xs text-[#5a5a78] truncate">{fu.notes}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-[#5a5a78]">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(fu.due_date)}</span>
                              <span>{typeConfig.label}</span>
                              {fu.assigned_user && <span>{fu.assigned_user.name}</span>}
                            </div>
                          </div>

                          {/* Status + Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {fu.status === 'overdue' && (
                              <span className="text-xs bg-red-500/15 text-red-400 px-2 py-1 rounded font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" />متأخر</span>
                            )}
                            {fu.status === 'completed' && (
                              <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />مكتمل</span>
                            )}
                            {(fu.status === 'pending' || fu.status === 'overdue') && (
                              <Button size="sm" onClick={() => markComplete(fu.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"><CheckCircle2 className="w-3 h-3 ml-1" />إكمال</Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-[#e2e2f0]">أبريل 2026</h3>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#5a5a78] mb-2">
            {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(d => <div key={d} className="py-2 font-medium">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before April 1 (Wednesday) */}
            {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} className="h-20 rounded-lg bg-[#171724]/30" />)}
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
              const dayDate = new Date(2026, 3, day)
              const dayFollowups = followups.filter(f => new Date(f.due_date).getDate() === day && new Date(f.due_date).getMonth() === 3)
              const hasOverdue = dayFollowups.some(f => f.status === 'overdue')
              const isToday = day === 2 // April 2, 2026
              return (
                <div key={day} className={`h-20 rounded-lg p-1.5 border transition-colors ${isToday ? 'border-[#c9a84c] bg-[#c9a84c]/5' : hasOverdue ? 'border-red-500/30 bg-red-500/5' : 'border-[#252535]/50 bg-[#171724]/30'} hover:border-[#c9a84c]/50`}>
                  <div className={`text-xs font-mono mb-1 ${isToday ? 'text-[#c9a84c] font-bold' : 'text-[#5a5a78]'}`}>{day}</div>
                  <div className="space-y-0.5">
                    {dayFollowups.slice(0, 2).map(f => (
                      <div key={f.id} className={`text-[9px] px-1 py-0.5 rounded truncate ${f.status === 'overdue' ? 'bg-red-500/20 text-red-400' : f.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#c9a84c]/15 text-[#c9a84c]'}`}>
                        {(f as any).lead?.full_name?.split(' ')[0]}
                      </div>
                    ))}
                    {dayFollowups.length > 2 && <div className="text-[9px] text-[#5a5a78]">+{dayFollowups.length - 2}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Employee Performance Strip */}
      <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5">
        <h3 className="text-sm font-bold text-[#e2e2f0] mb-4">أداء المتابعات حسب الموظف</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EMPLOYEES.map(emp => {
            const empFollowups = followups.filter(f => f.assigned_to === emp.id)
            const completed = empFollowups.filter(f => f.status === 'completed').length
            const overdue = empFollowups.filter(f => f.status === 'overdue').length
            const total = empFollowups.length
            const rate = total > 0 ? Math.round(completed / total * 100) : 0
            return (
              <div key={emp.id} className="bg-[#171724] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-sm font-bold">{emp.name[0]}</div>
                    <span className="text-sm text-[#e2e2f0] font-medium">{emp.name}</span>
                  </div>
                  <span className={`text-lg font-bold font-mono ${rate >= 70 ? 'text-emerald-400' : rate >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{rate}%</span>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="text-[#5a5a78]">إجمالي: <span className="text-[#e2e2f0] font-mono">{total}</span></span>
                  <span className="text-emerald-400">مكتمل: <span className="font-mono">{completed}</span></span>
                  {overdue > 0 && <span className="text-red-400">متأخر: <span className="font-mono">{overdue}</span></span>}
                </div>
                <div className="mt-2 h-1.5 bg-[#252535] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${rate}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
