import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, CheckCircle, XCircle, ArrowUpDown, Users, Building2,
  Briefcase, Handshake, Search, Filter, Eye, MessageSquare,
  ChevronUp, ChevronDown, AlertTriangle, TrendingUp, Calendar
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate, formatDateTime } from '@/lib/utils'

interface WaitlistEntry {
  id: number
  name: string
  email: string
  phone: string
  user_type: 'investor' | 'merchant' | 'sponsor'
  event_name: string
  requested_zone: string
  priority: 'high' | 'medium' | 'low'
  position: number
  status: 'waiting' | 'approved' | 'rejected' | 'expired'
  notes: string
  created_at: string
  estimated_date?: string
}

const MOCK_WAITLIST: WaitlistEntry[] = [
  { id: 1, name: 'عبدالرحمن السعيد', email: 'abd@example.com', phone: '0551234567', user_type: 'merchant', event_name: 'معرض التقنية 2026', requested_zone: 'المنطقة A - بوث مميز', priority: 'high', position: 1, status: 'waiting', notes: 'تاجر VIP — يفضل بوث زاوية', created_at: '2026-03-28T10:00:00', estimated_date: '2026-04-05' },
  { id: 2, name: 'منى الحربي', email: 'mona@example.com', phone: '0559876543', user_type: 'merchant', event_name: 'معرض التقنية 2026', requested_zone: 'المنطقة B - بوث عادي', priority: 'medium', position: 2, status: 'waiting', notes: '', created_at: '2026-03-28T11:30:00', estimated_date: '2026-04-07' },
  { id: 3, name: 'فيصل الدوسري', email: 'faisal@example.com', phone: '0553456789', user_type: 'investor', event_name: 'معرض الابتكار 2026', requested_zone: 'جناح المستثمرين', priority: 'high', position: 3, status: 'waiting', notes: 'مستثمر استراتيجي — أولوية عالية', created_at: '2026-03-27T09:00:00' },
  { id: 4, name: 'هند الشمري', email: 'hind@example.com', phone: '0557654321', user_type: 'sponsor', event_name: 'معرض التقنية 2026', requested_zone: 'منطقة الرعاة البلاتينية', priority: 'high', position: 4, status: 'waiting', notes: 'ترغب في رعاية بلاتينية', created_at: '2026-03-26T14:00:00' },
  { id: 5, name: 'سعود المطيري', email: 'saud@example.com', phone: '0552345678', user_type: 'merchant', event_name: 'معرض التقنية 2026', requested_zone: 'المنطقة C - بوث صغير', priority: 'low', position: 5, status: 'waiting', notes: '', created_at: '2026-03-25T16:00:00', estimated_date: '2026-04-10' },
  { id: 6, name: 'نوف القحطاني', email: 'nouf@example.com', phone: '0558765432', user_type: 'merchant', event_name: 'معرض الابتكار 2026', requested_zone: 'المنطقة A - بوث مميز', priority: 'medium', position: 6, status: 'approved', notes: 'تمت الموافقة بعد إلغاء حجز سابق', created_at: '2026-03-24T10:00:00' },
  { id: 7, name: 'طارق العنزي', email: 'tariq@example.com', phone: '0554567890', user_type: 'investor', event_name: 'معرض التقنية 2026', requested_zone: 'جناح المستثمرين', priority: 'low', position: 7, status: 'rejected', notes: 'لم يستوفِ شروط KYC', created_at: '2026-03-23T08:00:00' },
  { id: 8, name: 'لمى الزهراني', email: 'lama@example.com', phone: '0556789012', user_type: 'sponsor', event_name: 'معرض التقنية 2026', requested_zone: 'منطقة الرعاة الذهبية', priority: 'medium', position: 8, status: 'expired', notes: 'انتهت مدة الانتظار', created_at: '2026-03-20T12:00:00' },
]

const PRIORITY_CONFIG = {
  high: { label: 'عالية', color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
  medium: { label: 'متوسطة', color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
  low: { label: 'منخفضة', color: 'text-info', bg: 'bg-info/10 border-info/20' },
}

const STATUS_CONFIG = {
  waiting: { label: 'بانتظار', color: 'text-warning' },
  approved: { label: 'تمت الموافقة', color: 'text-success' },
  rejected: { label: 'مرفوض', color: 'text-danger' },
  expired: { label: 'منتهي', color: 'text-muted-foreground' },
}

export default function WaitlistPage() {
  const [entries, setEntries] = useState(MOCK_WAITLIST)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterPriority, setFilterPriority] = useState<string>('')
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null)

  const filtered = entries.filter(e => {
    if (search && !e.name.includes(search) && !e.event_name.includes(search)) return false
    if (filterStatus && e.status !== filterStatus) return false
    if (filterType && e.user_type !== filterType) return false
    if (filterPriority && e.priority !== filterPriority) return false
    return true
  })

  const waitingCount = entries.filter(e => e.status === 'waiting').length
  const approvedCount = entries.filter(e => e.status === 'approved').length

  const handleApprove = (id: number) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' as const } : e))
    toast.success('تمت الموافقة على الطلب')
  }

  const handleReject = (id: number) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' as const } : e))
    toast.success('تم رفض الطلب')
  }

  const handleMoveUp = (id: number) => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === id)
      if (idx <= 0) return prev
      const arr = [...prev]
      ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
      return arr.map((e, i) => ({ ...e, position: i + 1 }))
    })
    toast.success('تم تغيير الترتيب')
  }

  const handleMoveDown = (id: number) => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === id)
      if (idx >= prev.length - 1) return prev
      const arr = [...prev]
      ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
      return arr.map((e, i) => ({ ...e, position: i + 1 }))
    })
    toast.success('تم تغيير الترتيب')
  }

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'investor': return <Building2 size={14} className="text-[#00d4ff]" />
      case 'merchant': return <Briefcase size={14} className="text-[#00e5a0]" />
      case 'sponsor': return <Handshake size={14} className="text-[#f59e0b]" />
      default: return null
    }
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'investor': return 'مستثمر'
      case 'merchant': return 'تاجر'
      case 'sponsor': return 'راعي'
      default: return type
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="قائمة الانتظار"
        subtitle="إدارة طلبات الانتظار للبوثات والأجنحة والمساحات"
        actions={
          <button onClick={() => toast.info('إعادة ترتيب تلقائي — قريباً')} className="h-9 px-4 rounded-lg bg-gold/10 border border-gold/25 text-sm text-gold hover:bg-gold/20 transition-all flex items-center gap-2">
            <ArrowUpDown size={14} />
            إعادة ترتيب
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الطلبات" value={entries.length} icon={Users} delay={0} />
        <StatsCard title="بانتظار" value={waitingCount} icon={Clock} delay={0.1} />
        <StatsCard title="تمت الموافقة" value={approvedCount} icon={CheckCircle} delay={0.2} />
        <StatsCard title="أولوية عالية" value={entries.filter(e => e.priority === 'high' && e.status === 'waiting').length} icon={AlertTriangle} delay={0.3} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الفعالية..." className="w-full h-9 pr-9 pl-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-all" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل الحالات</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل الأنواع</option>
          <option value="investor">مستثمر</option>
          <option value="merchant">تاجر</option>
          <option value="sponsor">راعي</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل الأولويات</option>
          {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Waitlist Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-12">#</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الاسم</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">النوع</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الفعالية</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">المنطقة المطلوبة</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الأولوية</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الحالة</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-[180px]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">لا توجد طلبات مطابقة</td></tr>
                ) : (
                  filtered.map((entry, idx) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      transition={{ duration: 0.2 }}
                      className={cn('border-b border-border/30 hover:bg-surface/50 transition-colors', entry.status === 'waiting' && entry.priority === 'high' && 'bg-danger/[0.02]')}
                    >
                      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{entry.position}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{entry.name}</p>
                          <p className="text-[10px] text-muted-foreground">{entry.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {getUserTypeIcon(entry.user_type)}
                          <span className="text-xs text-muted-foreground">{getUserTypeLabel(entry.user_type)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">{entry.event_name}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{entry.requested_zone}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', PRIORITY_CONFIG[entry.priority].bg, PRIORITY_CONFIG[entry.priority].color)}>
                          {PRIORITY_CONFIG[entry.priority].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs font-medium', STATUS_CONFIG[entry.status].color)}>
                          {STATUS_CONFIG[entry.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {entry.status === 'waiting' && (
                            <>
                              <button onClick={() => handleApprove(entry.id)} className="p-1.5 rounded-md hover:bg-success/10 text-muted-foreground hover:text-success transition-colors" title="موافقة"><CheckCircle size={13} /></button>
                              <button onClick={() => handleReject(entry.id)} className="p-1.5 rounded-md hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors" title="رفض"><XCircle size={13} /></button>
                              <button onClick={() => handleMoveUp(entry.id)} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors" title="رفع"><ChevronUp size={13} /></button>
                              <button onClick={() => handleMoveDown(entry.id)} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors" title="خفض"><ChevronDown size={13} /></button>
                            </>
                          )}
                          <button onClick={() => setSelectedEntry(entry)} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-info transition-colors" title="تفاصيل"><Eye size={13} /></button>
                          <button onClick={() => toast.info('إرسال رسالة — قريباً')} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors" title="رسالة"><MessageSquare size={13} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedEntry(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">تفاصيل الطلب #{selectedEntry.position}</h3>
                <button onClick={() => setSelectedEntry(null)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><XCircle size={18} /></button>
              </div>
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الاسم</p><p className="text-sm font-medium text-foreground">{selectedEntry.name}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">النوع</p><p className="text-sm text-foreground">{getUserTypeLabel(selectedEntry.user_type)}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الهاتف</p><p className="text-sm text-foreground font-mono" dir="ltr">{selectedEntry.phone}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">البريد</p><p className="text-xs text-foreground font-mono" dir="ltr">{selectedEntry.email}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الفعالية</p><p className="text-sm text-foreground">{selectedEntry.event_name}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">المنطقة</p><p className="text-sm text-foreground">{selectedEntry.requested_zone}</p></div>
                </div>
                {selectedEntry.notes && (
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground mb-1">ملاحظات</p><p className="text-sm text-foreground">{selectedEntry.notes}</p></div>
                )}
                {selectedEntry.estimated_date && (
                  <div className="glass-card p-3 flex items-center gap-2">
                    <Calendar size={14} className="text-gold" />
                    <div><p className="text-[10px] text-muted-foreground">التاريخ المتوقع</p><p className="text-sm text-foreground">{formatDate(selectedEntry.estimated_date)}</p></div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
