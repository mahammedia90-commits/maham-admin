/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — إدارة الطلبات (Requests Management)
 * Design: Dark/Light glassmorphism, Gold accents, RTL-first
 * Features: بيانات تجريبية، CRUD كامل، تصفية متقدمة، 
 *   موافقة جماعية، تفاصيل الطلب، أولوية AI، إحصائيات
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Check, X, Eye, Clock, Filter, CheckCheck,
  AlertTriangle, ArrowUpRight, ArrowDownRight, Inbox,
  Building2, User, Calendar, MapPin, CreditCard,
  Sparkles, BarChart3, RefreshCw, Download, Search,
  ChevronDown, MessageSquare, Star, Tag, Layers
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate, formatCurrency, formatNumber } from '@/lib/utils'
import { requestsApi } from '@/api'
import { toast } from 'sonner'

// ── أنواع الطلبات ──────────────────────────────────
type RequestType = 'booth_booking' | 'sponsorship' | 'service' | 'modification' | 'cancellation' | 'kyc_review'

interface RequestItem {
  id: number
  ref: string
  type: RequestType
  requester: string
  requesterRole: 'merchant' | 'investor' | 'sponsor'
  company: string
  event: string
  eventId: number
  status: 'pending' | 'approved' | 'rejected' | 'review' | 'cancelled'
  priority: 'critical' | 'high' | 'medium' | 'low'
  aiScore: number
  amount: number
  created_at: string
  updated_at: string
  notes: string
  assignedTo: string
  attachments: number
}

// ── بيانات تجريبية ──────────────────────────────────
const demoRequests: RequestItem[] = [
  { id: 1, ref: 'REQ-2026-001', type: 'booth_booking', requester: 'أحمد محمد العتيبي', requesterRole: 'merchant', company: 'شركة النخبة التجارية', event: 'معرض الرياض الدولي للتقنية 2026', eventId: 1, status: 'pending', priority: 'critical', aiScore: 95, amount: 45000, created_at: '2026-03-28T10:30:00', updated_at: '2026-03-28T10:30:00', notes: 'طلب جناح VIP بمساحة 50م² في الجناح الرئيسي', assignedTo: 'سارة أحمد', attachments: 3 },
  { id: 2, ref: 'REQ-2026-002', type: 'sponsorship', requester: 'خالد عبدالله السعود', requesterRole: 'sponsor', company: 'مجموعة السعود القابضة', event: 'معرض الرياض الدولي للتقنية 2026', eventId: 1, status: 'review', priority: 'high', aiScore: 88, amount: 250000, created_at: '2026-03-27T14:15:00', updated_at: '2026-03-28T09:00:00', notes: 'رعاية بلاتينية — يشمل الشعار على جميع المطبوعات', assignedTo: 'محمد علي', attachments: 5 },
  { id: 3, ref: 'REQ-2026-003', type: 'booth_booking', requester: 'فاطمة حسن الشمري', requesterRole: 'merchant', company: 'مؤسسة الإبداع للتصميم', event: 'معرض جدة للأزياء والموضة', eventId: 2, status: 'approved', priority: 'medium', aiScore: 72, amount: 18000, created_at: '2026-03-26T08:45:00', updated_at: '2026-03-27T16:30:00', notes: 'جناح صغير 3×3 في قسم المصممين الناشئين', assignedTo: 'سارة أحمد', attachments: 2 },
  { id: 4, ref: 'REQ-2026-004', type: 'service', requester: 'عبدالرحمن يوسف', requesterRole: 'merchant', company: 'شركة التقنية المتقدمة', event: 'معرض الرياض الدولي للتقنية 2026', eventId: 1, status: 'pending', priority: 'medium', aiScore: 65, amount: 8500, created_at: '2026-03-25T11:20:00', updated_at: '2026-03-25T11:20:00', notes: 'طلب خدمات كهرباء إضافية وإنترنت سريع', assignedTo: 'أحمد خالد', attachments: 1 },
  { id: 5, ref: 'REQ-2026-005', type: 'modification', requester: 'نورة سعد القحطاني', requesterRole: 'merchant', company: 'دار نورة للعطور', event: 'معرض جدة للأزياء والموضة', eventId: 2, status: 'pending', priority: 'low', aiScore: 45, amount: 0, created_at: '2026-03-24T16:00:00', updated_at: '2026-03-24T16:00:00', notes: 'تعديل موقع الجناح من A12 إلى B05', assignedTo: 'محمد علي', attachments: 0 },
  { id: 6, ref: 'REQ-2026-006', type: 'cancellation', requester: 'سلطان فهد العنزي', requesterRole: 'merchant', company: 'مؤسسة سلطان للتجارة', event: 'معرض الرياض الدولي للتقنية 2026', eventId: 1, status: 'rejected', priority: 'high', aiScore: 30, amount: 22000, created_at: '2026-03-23T09:10:00', updated_at: '2026-03-24T14:00:00', notes: 'طلب إلغاء الحجز واسترداد المبلغ — تجاوز المهلة', assignedTo: 'سارة أحمد', attachments: 2 },
  { id: 7, ref: 'REQ-2026-007', type: 'kyc_review', requester: 'ماجد عبدالعزيز', requesterRole: 'investor', company: 'صندوق الاستثمار الخليجي', event: 'معرض الرياض الدولي للتقنية 2026', eventId: 1, status: 'review', priority: 'critical', aiScore: 92, amount: 500000, created_at: '2026-03-22T13:45:00', updated_at: '2026-03-28T08:00:00', notes: 'مراجعة وثائق KYC لمستثمر رئيسي — مبلغ كبير', assignedTo: 'أحمد خالد', attachments: 8 },
  { id: 8, ref: 'REQ-2026-008', type: 'booth_booking', requester: 'هند محمد الدوسري', requesterRole: 'merchant', company: 'شركة هند للمجوهرات', event: 'معرض جدة للأزياء والموضة', eventId: 2, status: 'approved', priority: 'medium', aiScore: 78, amount: 35000, created_at: '2026-03-21T10:00:00', updated_at: '2026-03-22T11:30:00', notes: 'جناح مميز في قسم المجوهرات الفاخرة', assignedTo: 'محمد علي', attachments: 4 },
  { id: 9, ref: 'REQ-2026-009', type: 'sponsorship', requester: 'تركي ناصر الحربي', requesterRole: 'sponsor', company: 'شركة الحربي للاتصالات', event: 'معرض الرياض الدولي للتقنية 2026', eventId: 1, status: 'pending', priority: 'high', aiScore: 85, amount: 150000, created_at: '2026-03-20T15:30:00', updated_at: '2026-03-20T15:30:00', notes: 'رعاية ذهبية مع حقوق البث المباشر', assignedTo: 'سارة أحمد', attachments: 3 },
  { id: 10, ref: 'REQ-2026-010', type: 'service', requester: 'ريم عبدالله الغامدي', requesterRole: 'merchant', company: 'مؤسسة ريم للتصوير', event: 'معرض جدة للأزياء والموضة', eventId: 2, status: 'approved', priority: 'low', aiScore: 55, amount: 3500, created_at: '2026-03-19T09:15:00', updated_at: '2026-03-20T10:00:00', notes: 'طلب خدمة تصوير احترافي للجناح', assignedTo: 'أحمد خالد', attachments: 1 },
  { id: 11, ref: 'REQ-2026-011', type: 'booth_booking', requester: 'عمر سعيد المطيري', requesterRole: 'merchant', company: 'شركة المطيري للإلكترونيات', event: 'معرض الرياض الدولي للتقنية 2026', eventId: 1, status: 'pending', priority: 'medium', aiScore: 68, amount: 28000, created_at: '2026-03-18T12:00:00', updated_at: '2026-03-18T12:00:00', notes: 'حجز جناح متوسط في قسم الإلكترونيات', assignedTo: 'محمد علي', attachments: 2 },
  { id: 12, ref: 'REQ-2026-012', type: 'modification', requester: 'لمياء خالد الزهراني', requesterRole: 'merchant', company: 'دار لمياء للأزياء', event: 'معرض جدة للأزياء والموضة', eventId: 2, status: 'cancelled', priority: 'low', aiScore: 20, amount: 0, created_at: '2026-03-17T14:30:00', updated_at: '2026-03-18T09:00:00', notes: 'تعديل تصميم الجناح — تم الإلغاء من قبل العميل', assignedTo: 'سارة أحمد', attachments: 0 },
]

// ── خريطة الأنواع ──────────────────────────────────
const typeLabels: Record<RequestType, string> = {
  booth_booking: 'حجز جناح',
  sponsorship: 'طلب رعاية',
  service: 'خدمة إضافية',
  modification: 'تعديل',
  cancellation: 'إلغاء',
  kyc_review: 'مراجعة KYC',
}

const typeIcons: Record<RequestType, typeof FileText> = {
  booth_booking: MapPin,
  sponsorship: Star,
  service: Layers,
  modification: RefreshCw,
  cancellation: X,
  kyc_review: Eye,
}

const typeColors: Record<RequestType, string> = {
  booth_booking: 'bg-gold/10 text-gold border-gold/20',
  sponsorship: 'bg-info/10 text-info border-info/20',
  service: 'bg-success/10 text-success border-success/20',
  modification: 'bg-warning/10 text-warning border-warning/20',
  cancellation: 'bg-danger/10 text-danger border-danger/20',
  kyc_review: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
}

const priorityConfig: Record<string, { label: string; color: string; icon: typeof AlertTriangle }> = {
  critical: { label: 'حرجة', color: 'bg-danger/15 text-danger border border-danger/20 animate-pulse', icon: AlertTriangle },
  high: { label: 'عالية', color: 'bg-danger/10 text-danger border border-danger/15', icon: ArrowUpRight },
  medium: { label: 'متوسطة', color: 'bg-warning/10 text-warning border border-warning/15', icon: BarChart3 },
  low: { label: 'منخفضة', color: 'bg-info/10 text-info border border-info/15', icon: ArrowDownRight },
}

const roleIcons: Record<string, { label: string; color: string }> = {
  merchant: { label: 'تاجر', color: 'text-gold' },
  investor: { label: 'مستثمر', color: 'text-info' },
  sponsor: { label: 'راعي', color: 'text-success' },
}

export default function RequestsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [detailId, setDetailId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [requests, setRequests] = useState<RequestItem[]>(demoRequests)
  const [sortKey, setSortKey] = useState<string>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null)

  const perPage = 8

  // ── إحصائيات ──────────────────────────────────
  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    review: requests.filter(r => r.status === 'review').length,
    totalAmount: requests.filter(r => r.status === 'approved').reduce((s, r) => s + r.amount, 0),
    criticalCount: requests.filter(r => r.priority === 'critical' && r.status === 'pending').length,
    avgAiScore: Math.round(requests.reduce((s, r) => s + r.aiScore, 0) / requests.length),
  }), [requests])

  // ── تصفية وترتيب ──────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...requests]
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter)
    if (typeFilter !== 'all') result = result.filter(r => r.type === typeFilter)
    if (priorityFilter !== 'all') result = result.filter(r => r.priority === priorityFilter)
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(r =>
        r.ref.toLowerCase().includes(s) ||
        r.requester.toLowerCase().includes(s) ||
        r.company.toLowerCase().includes(s) ||
        r.event.toLowerCase().includes(s)
      )
    }
    result.sort((a, b) => {
      const aVal = a[sortKey as keyof RequestItem]
      const bVal = b[sortKey as keyof RequestItem]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
    return result
  }, [requests, statusFilter, typeFilter, priorityFilter, search, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  // ── إجراءات ──────────────────────────────────
  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const, updated_at: new Date().toISOString() } : r))
    toast.success(`تمت الموافقة على الطلب #${id}`)
    setDetailId(null)
  }

  const handleReject = (id: number) => {
    if (!rejectReason.trim()) {
      toast.error('يرجى كتابة سبب الرفض')
      return
    }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const, updated_at: new Date().toISOString(), notes: r.notes + ` — سبب الرفض: ${rejectReason}` } : r))
    toast.error(`تم رفض الطلب #${id}`)
    setShowRejectModal(null)
    setRejectReason('')
    setDetailId(null)
  }

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      toast.warning('يرجى تحديد طلبات أولاً')
      return
    }
    const pendingSelected = selectedIds.filter(id => requests.find(r => r.id === id)?.status === 'pending')
    if (pendingSelected.length === 0) {
      toast.warning('لا توجد طلبات معلقة في التحديد')
      return
    }
    setRequests(prev => prev.map(r =>
      pendingSelected.includes(r.id) ? { ...r, status: 'approved' as const, updated_at: new Date().toISOString() } : r
    ))
    toast.success(`تمت الموافقة على ${pendingSelected.length} طلب`)
    setSelectedIds([])
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === paged.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paged.map(r => r.id))
    }
  }

  const detailRequest = detailId ? requests.find(r => r.id === detailId) : null

  const statusFilters = [
    { key: 'all', label: 'الكل', count: stats.total },
    { key: 'pending', label: 'معلق', count: stats.pending },
    { key: 'review', label: 'قيد المراجعة', count: stats.review },
    { key: 'approved', label: 'موافق', count: stats.approved },
    { key: 'rejected', label: 'مرفوض', count: stats.rejected },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة الطلبات"
        subtitle={`${stats.total} طلب — ${stats.pending} معلق — ${stats.criticalCount} حرج`}
        actions={
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => toast.info('جاري تصدير الطلبات...')}
              className="h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl border border-border/50 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all flex items-center gap-1.5"
            >
              <Download size={14} />
              <span className="hidden sm:inline">تصدير</span>
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkApprove}
                className="h-8 sm:h-9 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-success/10 border border-success/20 text-xs sm:text-sm font-medium text-success hover:bg-success/20 transition-all flex items-center gap-1.5"
              >
                <CheckCheck size={14} />
                <span className="hidden sm:inline">موافقة جماعية</span> ({selectedIds.length})
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-1.5',
                showFilters ? 'border-gold/30 bg-gold/10 text-gold' : 'border-border/50 text-muted-foreground hover:text-foreground'
              )}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">فلاتر</span>
            </button>
          </div>
        }
      />

      {/* ── إحصائيات ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="إجمالي الطلبات" value={formatNumber(stats.total)} icon={Inbox} delay={0} />
        <StatsCard title="طلبات معلقة" value={formatNumber(stats.pending)} icon={Clock} trend={stats.criticalCount > 0 ? -stats.criticalCount : undefined} trendLabel="حرج" delay={0.05} />
        <StatsCard title="تمت الموافقة" value={formatNumber(stats.approved)} icon={Check} trend={25} trendLabel="هذا الشهر" delay={0.1} />
        <StatsCard title="قيمة الموافقات" value={formatCurrency(stats.totalAmount)} icon={CreditCard} trend={18} trendLabel="هذا الربع" delay={0.15} />
      </div>

      {/* ── فلاتر الحالة ──────────────────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap overflow-x-auto pb-1">
        {statusFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => { setStatusFilter(f.key); setPage(1) }}
            className={cn(
              'h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
              statusFilter === f.key
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            {f.label}
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full',
              statusFilter === f.key ? 'bg-gold/20 text-gold' : 'bg-surface3 text-muted-foreground'
            )}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* ── فلاتر متقدمة ──────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 mb-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">نوع الطلب</label>
                <select
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
                  className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"
                >
                  <option value="all">جميع الأنواع</option>
                  {Object.entries(typeLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">الأولوية</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => { setPriorityFilter(e.target.value); setPage(1) }}
                  className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"
                >
                  <option value="all">جميع الأولويات</option>
                  {Object.entries(priorityConfig).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ترتيب حسب</label>
                <select
                  value={`${sortKey}-${sortDir}`}
                  onChange={(e) => {
                    const [k, d] = e.target.value.split('-')
                    setSortKey(k)
                    setSortDir(d as 'asc' | 'desc')
                  }}
                  className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"
                >
                  <option value="created_at-desc">الأحدث أولاً</option>
                  <option value="created_at-asc">الأقدم أولاً</option>
                  <option value="aiScore-desc">أعلى تقييم AI</option>
                  <option value="amount-desc">أعلى مبلغ</option>
                  <option value="priority-asc">الأولوية الأعلى</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── جدول الطلبات ──────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 border-b border-border/50">
          <div className="relative w-full sm:w-56 md:w-64 lg:w-72">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="بحث بالمرجع أو الاسم أو الشركة..."
              className="w-full h-9 sm:h-10 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
            />
          </div>
          <span className="text-[11px] sm:text-xs text-muted-foreground">
            عرض {paged.length} من {filtered.length} طلب
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-3 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paged.length && paged.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border accent-gold"
                  />
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المرجع</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">النوع</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">مقدم الطلب</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الفعالية</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الأولوية</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">AI</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المبلغ</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الحالة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">التاريخ</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center">
                    <Inbox size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm">لا توجد طلبات مطابقة للفلاتر المحددة</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {paged.map((req, idx) => {
                    const TypeIcon = typeIcons[req.type]
                    const pCfg = priorityConfig[req.priority]
                    const rCfg = roleIcons[req.requesterRole]
                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className={cn(
                          'border-b border-border/30 transition-colors hover:bg-surface2/50',
                          selectedIds.includes(req.id) && 'bg-gold/5'
                        )}
                      >
                        <td className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(req.id)}
                            onChange={() => toggleSelect(req.id)}
                            className="w-4 h-4 rounded border-border accent-gold"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-mono text-xs text-gold">{req.ref}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={cn('inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border', typeColors[req.type])}>
                            <TypeIcon size={12} />
                            {typeLabels[req.type]}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">
                              {req.requester.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground leading-tight">{req.requester}</p>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Building2 size={9} />
                                {req.company}
                                <span className={cn('mr-1', rCfg.color)}>({rCfg.label})</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-muted-foreground">{req.event.length > 30 ? req.event.slice(0, 30) + '...' : req.event}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn('inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium', pCfg.color)}>
                            <pCfg.icon size={10} />
                            {pCfg.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Sparkles size={10} className="text-gold" />
                            <span className={cn(
                              'text-xs font-mono font-bold',
                              req.aiScore >= 80 ? 'text-success' : req.aiScore >= 50 ? 'text-warning' : 'text-danger'
                            )}>
                              {req.aiScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {req.amount > 0 ? formatCurrency(req.amount) : '—'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-[11px] text-muted-foreground">{formatDate(req.created_at)}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              onClick={() => setDetailId(req.id)}
                              className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"
                              title="عرض التفاصيل"
                            >
                              <Eye size={14} />
                            </button>
                            {(req.status === 'pending' || req.status === 'review') && (
                              <>
                                <button
                                  onClick={() => handleApprove(req.id)}
                                  className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"
                                  title="موافقة"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => setShowRejectModal(req.id)}
                                  className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                                  title="رفض"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 sm:p-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground">صفحة {page} من {totalPages}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                    p === page ? 'bg-gold text-black' : 'hover:bg-surface2 text-muted-foreground'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── نافذة تفاصيل الطلب ──────────────────────── */}
      <AnimatePresence>
        {detailRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setDetailId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] sm:max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <FileText size={22} className="text-gold" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{detailRequest.ref}</h2>
                    <p className="text-xs text-muted-foreground">{typeLabels[detailRequest.type]}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailId(null)}
                  className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 space-y-4 sm:space-y-3 sm:space-y-4 lg:space-y-5">
                {/* Status + Priority */}
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={detailRequest.status} />
                  <span className={cn('inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium', priorityConfig[detailRequest.priority].color)}>
                    {priorityConfig[detailRequest.priority].label}
                  </span>
                  <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
                    <Sparkles size={10} />
                    تقييم AI: {detailRequest.aiScore}%
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">مقدم الطلب</p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <User size={13} className="text-gold" />
                        {detailRequest.requester}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">الشركة</p>
                      <p className="text-sm text-foreground flex items-center gap-1.5">
                        <Building2 size={13} className="text-gold" />
                        {detailRequest.company}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">الدور</p>
                      <p className={cn('text-sm font-medium', roleIcons[detailRequest.requesterRole].color)}>
                        {roleIcons[detailRequest.requesterRole].label}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">الفعالية</p>
                      <p className="text-sm text-foreground flex items-center gap-1.5">
                        <Calendar size={13} className="text-gold" />
                        {detailRequest.event}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">المبلغ</p>
                      <p className="text-lg font-bold font-mono text-gold">
                        {detailRequest.amount > 0 ? formatCurrency(detailRequest.amount) : 'بدون مبلغ'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">المسؤول</p>
                      <p className="text-sm text-foreground">{detailRequest.assignedTo}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">الملاحظات</p>
                  <p className="text-sm text-foreground leading-relaxed">{detailRequest.notes}</p>
                </div>

                {/* Meta */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-muted-foreground pt-2 border-t border-border/30">
                  <span>تاريخ الإنشاء: {formatDate(detailRequest.created_at)}</span>
                  <span>آخر تحديث: {formatDate(detailRequest.updated_at)}</span>
                  <span>{detailRequest.attachments} مرفق</span>
                </div>

                {/* Actions */}
                {(detailRequest.status === 'pending' || detailRequest.status === 'review') && (
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      onClick={() => handleApprove(detailRequest.id)}
                      className="flex-1 h-11 rounded-xl bg-success/10 border border-success/20 text-success font-bold text-sm hover:bg-success/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      موافقة
                    </button>
                    <button
                      onClick={() => { setDetailId(null); setShowRejectModal(detailRequest.id) }}
                      className="flex-1 h-11 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      رفض
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── نافذة الرفض ──────────────────────────────── */}
      <AnimatePresence>
        {showRejectModal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => { setShowRejectModal(null); setRejectReason('') }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center">
                  <X size={18} className="text-danger" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">رفض الطلب</h3>
                  <p className="text-xs text-muted-foreground">يرجى كتابة سبب الرفض</p>
                </div>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="سبب الرفض..."
                rows={4}
                className="w-full p-3 rounded-xl bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-danger/50 focus:ring-1 focus:ring-danger/20 resize-none transition-all mb-4"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleReject(showRejectModal)}
                  className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all"
                >
                  تأكيد الرفض
                </button>
                <button
                  onClick={() => { setShowRejectModal(null); setRejectReason('') }}
                  className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
