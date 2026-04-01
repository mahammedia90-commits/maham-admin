/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — الإدارة المالية (Finance Management)
 * Design: Dark/Light glassmorphism, Gold accents, RTL-first
 * Features: فواتير، مدفوعات، مرتجعات، رسوم بيانية، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard,
  Download, Eye, Filter, ArrowDownRight, Wallet,
  Plus, Search, X, Check, AlertTriangle, Calendar,
  Building2, FileText, Printer, RefreshCw, Send, Ban
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface Invoice {
  id: number; number: string; client: string; amount: number; vat: number; total: number
  status: string; dueDate: string; issueDate: string; type: string; paymentMethod: string; notes: string
}

interface Payment {
  id: number; invoiceNum: string; client: string; amount: number; date: string; method: string; reference: string; status: string
}

interface Refund {
  id: number; invoiceNum: string; client: string; amount: number; reason: string; date: string; status: string
}

// ── بيانات تجريبية ──────────────────────────────────
const cashflowData = [
  { month: 'يناير', income: 280000, expenses: 180000 },
  { month: 'فبراير', income: 320000, expenses: 200000 },
  { month: 'مارس', income: 450000, expenses: 220000 },
  { month: 'أبريل', income: 380000, expenses: 250000 },
  { month: 'مايو', income: 520000, expenses: 280000 },
  { month: 'يونيو', income: 680000, expenses: 310000 },
]

const pieData = [
  { name: 'حجز أجنحة', value: 1450000, color: '#C9A84C' },
  { name: 'رعايات', value: 680000, color: '#3B82F6' },
  { name: 'خدمات إضافية', value: 320000, color: '#A0A0A0' },
  { name: 'تذاكر', value: 180000, color: '#10B981' },
]

const demoInvoices: Invoice[] = [
  { id: 1, number: 'INV-2026-001', client: 'شركة الفارس للتجارة', amount: 75000, vat: 11250, total: 86250, status: 'paid', dueDate: '2026-03-15', issueDate: '2026-02-15', type: 'booth', paymentMethod: 'bank_transfer', notes: 'جناح مميز - معرض الرياض' },
  { id: 2, number: 'INV-2026-002', client: 'مجموعة النخبة الاستثمارية', amount: 120000, vat: 18000, total: 138000, status: 'paid', dueDate: '2026-03-20', issueDate: '2026-02-20', type: 'sponsorship', paymentMethod: 'bank_transfer', notes: 'راعي ذهبي - معرض جدة' },
  { id: 3, number: 'INV-2026-003', client: 'شركة المعالم للمقاولات', amount: 45000, vat: 6750, total: 51750, status: 'pending', dueDate: '2026-04-10', issueDate: '2026-03-10', type: 'booth', paymentMethod: '', notes: 'جناح عادي - معرض الدمام' },
  { id: 4, number: 'INV-2026-004', client: 'مؤسسة الوطن للتقنية', amount: 25000, vat: 3750, total: 28750, status: 'overdue', dueDate: '2026-03-01', issueDate: '2026-02-01', type: 'service', paymentMethod: '', notes: 'خدمات تصميم وتركيب' },
  { id: 5, number: 'INV-2026-005', client: 'شركة الأفق للاستشارات', amount: 200000, vat: 30000, total: 230000, status: 'paid', dueDate: '2026-03-25', issueDate: '2026-02-25', type: 'sponsorship', paymentMethod: 'credit_card', notes: 'راعي بلاتيني - معرض الرياض' },
  { id: 6, number: 'INV-2026-006', client: 'شركة السلام للتوريدات', amount: 35000, vat: 5250, total: 40250, status: 'pending', dueDate: '2026-04-15', issueDate: '2026-03-15', type: 'booth', paymentMethod: '', notes: 'جناح متوسط - معرض الرياض' },
  { id: 7, number: 'INV-2026-007', client: 'مجموعة الرائد التجارية', amount: 18000, vat: 2700, total: 20700, status: 'draft', dueDate: '2026-04-20', issueDate: '2026-03-20', type: 'service', paymentMethod: '', notes: 'خدمات كهرباء وإنترنت' },
  { id: 8, number: 'INV-2026-008', client: 'شركة البناء الحديث', amount: 95000, vat: 14250, total: 109250, status: 'paid', dueDate: '2026-03-30', issueDate: '2026-02-28', type: 'booth', paymentMethod: 'bank_transfer', notes: 'جناح كبير مميز - معرض جدة' },
  { id: 9, number: 'INV-2026-009', client: 'مؤسسة الإبداع للدعاية', amount: 55000, vat: 8250, total: 63250, status: 'cancelled', dueDate: '2026-03-10', issueDate: '2026-02-10', type: 'sponsorship', paymentMethod: '', notes: 'راعي فضي - ملغي' },
  { id: 10, number: 'INV-2026-010', client: 'شركة التميز للأغذية', amount: 42000, vat: 6300, total: 48300, status: 'pending', dueDate: '2026-04-25', issueDate: '2026-03-25', type: 'booth', paymentMethod: '', notes: 'جناح F&B - معرض الرياض' },
]

const demoPayments: Payment[] = [
  { id: 1, invoiceNum: 'INV-2026-001', client: 'شركة الفارس للتجارة', amount: 86250, date: '2026-03-14', method: 'تحويل بنكي', reference: 'TXN-98765', status: 'completed' },
  { id: 2, invoiceNum: 'INV-2026-002', client: 'مجموعة النخبة الاستثمارية', amount: 138000, date: '2026-03-18', method: 'تحويل بنكي', reference: 'TXN-98766', status: 'completed' },
  { id: 3, invoiceNum: 'INV-2026-005', client: 'شركة الأفق للاستشارات', amount: 230000, date: '2026-03-24', method: 'بطاقة ائتمان', reference: 'TXN-98767', status: 'completed' },
  { id: 4, invoiceNum: 'INV-2026-008', client: 'شركة البناء الحديث', amount: 109250, date: '2026-03-28', method: 'تحويل بنكي', reference: 'TXN-98768', status: 'completed' },
  { id: 5, invoiceNum: 'INV-2026-003', client: 'شركة المعالم للمقاولات', amount: 25000, date: '2026-04-01', method: 'تحويل بنكي', reference: 'TXN-98769', status: 'pending' },
]

const demoRefunds: Refund[] = [
  { id: 1, invoiceNum: 'INV-2026-009', client: 'مؤسسة الإبداع للدعاية', amount: 63250, reason: 'إلغاء المشاركة', date: '2026-03-12', status: 'approved' },
  { id: 2, invoiceNum: 'INV-2026-001', client: 'شركة الفارس للتجارة', amount: 15000, reason: 'تخفيض مساحة الجناح', date: '2026-03-20', status: 'pending' },
]

const typeLabels: Record<string, string> = { booth: 'حجز جناح', sponsorship: 'رعاية', service: 'خدمة' }
const typeColors: Record<string, string> = { booth: 'bg-gold/10 text-gold', sponsorship: 'bg-info/10 text-info', service: 'bg-chrome/10 text-chrome' }

export default function FinancePage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<'invoices' | 'payments' | 'refunds'>('invoices')
  const [invoices, setInvoices] = useState(demoInvoices)
  const [payments] = useState(demoPayments)
  const [refunds] = useState(demoRefunds)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const perPage = 6

  // ── إحصائيات ──────────────────────────────────
  const stats = useMemo(() => {
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
    const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.total, 0)
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0)
    const totalRefunds = refunds.reduce((s, r) => s + r.amount, 0)
    return { totalRevenue, totalPending, totalOverdue, totalRefunds }
  }, [invoices, refunds])

  // ── تصفية الفواتير ──────────────────────────────
  const filteredInvoices = useMemo(() => {
    let result = [...invoices]
    if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter)
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(i => i.number.toLowerCase().includes(s) || i.client.toLowerCase().includes(s))
    }
    return result
  }, [invoices, statusFilter, search])

  const totalPages = Math.ceil(filteredInvoices.length / perPage)
  const pagedInvoices = filteredInvoices.slice((page - 1) * perPage, page * perPage)

  // ── نموذج فاتورة جديدة ──────────────────────────
  const [newInv, setNewInv] = useState({ client: '', amount: '', type: 'booth', notes: '' })

  const handleCreateInvoice = () => {
    if (!newInv.client || !newInv.amount) { toast.error('يرجى ملء جميع الحقول المطلوبة'); return }
    const amount = parseFloat(newInv.amount)
    const vat = amount * 0.15
    const inv: Invoice = {
      id: Math.max(...invoices.map(i => i.id)) + 1,
      number: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      client: newInv.client, amount, vat, total: amount + vat,
      status: 'draft', dueDate: '2026-05-01', issueDate: new Date().toISOString().split('T')[0],
      type: newInv.type, paymentMethod: '', notes: newInv.notes,
    }
    setInvoices(prev => [inv, ...prev])
    toast.success(`تم إنشاء الفاتورة: ${inv.number}`)
    setShowInvoiceModal(false)
    setNewInv({ client: '', amount: '', type: 'booth', notes: '' })
  }

  const tabs = [
    { key: 'invoices' as const, label: 'الفواتير', icon: Receipt, count: invoices.length },
    { key: 'payments' as const, label: 'المدفوعات', icon: CreditCard, count: payments.length },
    { key: 'refunds' as const, label: 'المرتجعات', icon: ArrowDownRight, count: refunds.length },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="الإدارة المالية"
        subtitle="إدارة الفواتير والمدفوعات والتقارير المالية — متوافق مع ZATCA"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => toast.info('جاري تصدير التقرير المالي...')} className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all flex items-center gap-2">
              <Download size={14} /> تصدير
            </button>
            <button onClick={() => setShowInvoiceModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
              <Receipt size={16} /> فاتورة جديدة
            </button>
          </div>
        }
      />

      {/* ── إحصائيات ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="إجمالي الإيرادات" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} trend={18} trendLabel="هذا الربع" delay={0} />
        <StatsCard title="المبالغ المعلقة" value={formatCurrency(stats.totalPending)} icon={Wallet} delay={0.05} />
        <StatsCard title="متأخرة السداد" value={formatCurrency(stats.totalOverdue)} icon={TrendingUp} trend={-8} trendLabel="عن الشهر الماضي" delay={0.1} />
        <StatsCard title="المرتجعات" value={formatCurrency(stats.totalRefunds)} icon={TrendingDown} delay={0.15} />
      </div>

      {/* ── الرسوم البيانية ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-3 sm:p-4 lg:p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground">التدفق النقدي</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold" /> الدخل</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-chrome" /> المصروفات</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cashflowData}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#A0A0A0" stopOpacity={0.2} /><stop offset="95%" stopColor="#A0A0A0" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
              <Area type="monotone" dataKey="income" stroke="#C9A84C" fill="url(#incGrad)" strokeWidth={2} name="الدخل" />
              <Area type="monotone" dataKey="expenses" stroke="#A0A0A0" fill="url(#expGrad)" strokeWidth={2} name="المصروفات" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-3 sm:p-4 lg:p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">توزيع الإيرادات</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}</span>
                <span className="text-muted-foreground font-mono">{formatCurrency(d.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── تبويبات ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => { setTab(t.key); setPage(1); setSearch(''); setStatusFilter('all') }}
            className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', tab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', tab === t.key ? 'bg-gold/20' : 'bg-surface3')}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── جدول الفواتير ──────────────────────────── */}
      {tab === 'invoices' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50 flex-wrap gap-3">
            <div className="relative w-64">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="بحث بالرقم أو العميل..."
                className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
            </div>
            <div className="flex items-center gap-1.5">
              {['all', 'paid', 'pending', 'overdue', 'draft', 'cancelled'].map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
                  className={cn('h-7 px-2.5 rounded-lg text-[11px] font-medium transition-all', statusFilter === s ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
                  {s === 'all' ? 'الكل' : s === 'paid' ? 'مدفوعة' : s === 'pending' ? 'معلقة' : s === 'overdue' ? 'متأخرة' : s === 'draft' ? 'مسودة' : 'ملغاة'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">رقم الفاتورة</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">العميل</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">النوع</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المبلغ</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الضريبة</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الإجمالي</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الاستحقاق</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الحالة</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pagedInvoices.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-16 text-center"><Receipt size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground text-sm">لا توجد فواتير مطابقة</p></td></tr>
                ) : pagedInvoices.map((inv, idx) => (
                  <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-xs text-gold">#{inv.number}</span></td>
                    <td className="px-3 py-3"><span className="text-sm text-foreground">{inv.client}</span></td>
                    <td className="px-3 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', typeColors[inv.type])}>{typeLabels[inv.type]}</span></td>
                    <td className="px-3 py-3"><span className="font-mono text-xs text-muted-foreground">{formatCurrency(inv.amount)}</span></td>
                    <td className="px-3 py-3"><span className="font-mono text-xs text-muted-foreground">{formatCurrency(inv.vat)}</span></td>
                    <td className="px-3 py-3"><span className="font-mono text-sm font-bold text-foreground">{formatCurrency(inv.total)}</span></td>
                    <td className="px-3 py-3"><span className="text-xs text-muted-foreground">{formatDate(inv.dueDate)}</span></td>
                    <td className="px-3 py-3 text-center"><StatusBadge status={inv.status} /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button onClick={() => setDetailInvoice(inv)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors" title="عرض"><Eye size={14} /></button>
                        <button onClick={() => toast.info('جاري طباعة الفاتورة...')} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors" title="طباعة"><Printer size={14} /></button>
                        {inv.status === 'draft' && (
                          <button onClick={() => { setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'pending' } : i)); toast.success('تم إرسال الفاتورة') }} className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-colors" title="إرسال"><Send size={14} /></button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground">صفحة {page} من {totalPages}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={cn('w-8 h-8 rounded-lg text-sm font-medium transition-all', p === page ? 'bg-gold text-black' : 'hover:bg-surface2 text-muted-foreground')}>{p}</button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── جدول المدفوعات ──────────────────────────── */}
      {tab === 'payments' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-sm font-bold text-foreground">سجل المدفوعات</h3>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">رقم الفاتورة</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">العميل</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المبلغ</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">التاريخ</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">طريقة الدفع</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المرجع</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-xs text-gold">#{p.invoiceNum}</span></td>
                    <td className="px-3 py-3 text-sm text-foreground">{p.client}</td>
                    <td className="px-3 py-3"><span className="font-mono text-sm font-bold text-foreground">{formatCurrency(p.amount)}</span></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{formatDate(p.date)}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{p.method}</td>
                    <td className="px-3 py-3"><span className="font-mono text-xs text-muted-foreground">{p.reference}</span></td>
                    <td className="px-3 py-3 text-center"><StatusBadge status={p.status === 'completed' ? 'active' : 'pending'} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ── جدول المرتجعات ──────────────────────────── */}
      {tab === 'refunds' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-sm font-bold text-foreground">طلبات الاسترداد</h3>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">رقم الفاتورة</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">العميل</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المبلغ</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">السبب</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">التاريخ</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((r, idx) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-xs text-gold">#{r.invoiceNum}</span></td>
                    <td className="px-3 py-3 text-sm text-foreground">{r.client}</td>
                    <td className="px-3 py-3"><span className="font-mono text-sm font-bold text-danger">{formatCurrency(r.amount)}</span></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.reason}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{formatDate(r.date)}</td>
                    <td className="px-3 py-3 text-center"><StatusBadge status={r.status === 'approved' ? 'active' : 'pending'} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ── نافذة تفاصيل الفاتورة ──────────────────── */}
      <AnimatePresence>
        {detailInvoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailInvoice(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-card w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">فاتورة {detailInvoice.number}</h2>
                    <p className="text-xs text-muted-foreground">تاريخ الإصدار: {formatDate(detailInvoice.issueDate)}</p>
                  </div>
                  <button onClick={() => setDetailInvoice(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <span className="text-xs text-muted-foreground">العميل</span>
                    <span className="text-sm font-medium text-foreground">{detailInvoice.client}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <span className="text-xs text-muted-foreground">النوع</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', typeColors[detailInvoice.type])}>{typeLabels[detailInvoice.type]}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <span className="text-xs text-muted-foreground">المبلغ قبل الضريبة</span>
                    <span className="font-mono text-sm text-foreground">{formatCurrency(detailInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <span className="text-xs text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                    <span className="font-mono text-sm text-muted-foreground">{formatCurrency(detailInvoice.vat)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gold/5 border border-gold/20">
                    <span className="text-xs font-bold text-gold">الإجمالي شامل الضريبة</span>
                    <span className="font-mono text-lg font-bold text-gold">{formatCurrency(detailInvoice.total)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <span className="text-xs text-muted-foreground">تاريخ الاستحقاق</span>
                    <span className="text-sm text-foreground">{formatDate(detailInvoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <span className="text-xs text-muted-foreground">الحالة</span>
                    <StatusBadge status={detailInvoice.status} />
                  </div>
                  {detailInvoice.notes && (
                    <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                      <span className="text-xs text-muted-foreground block mb-1">ملاحظات</span>
                      <p className="text-sm text-foreground">{detailInvoice.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => { toast.info('جاري طباعة الفاتورة...'); setDetailInvoice(null) }} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all flex items-center justify-center gap-2">
                    <Printer size={14} /> طباعة
                  </button>
                  <button onClick={() => { toast.info('جاري تحميل PDF...'); setDetailInvoice(null) }} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center justify-center gap-2">
                    <Download size={14} /> تحميل PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── نافذة فاتورة جديدة ──────────────────────── */}
      <AnimatePresence>
        {showInvoiceModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowInvoiceModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-card w-full max-w-md p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Receipt size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">فاتورة جديدة</h3><p className="text-xs text-muted-foreground">إنشاء فاتورة جديدة — سيتم احتساب الضريبة تلقائياً</p></div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم العميل <span className="text-danger">*</span></label>
                  <input type="text" value={newInv.client} onChange={(e) => setNewInv(p => ({ ...p, client: e.target.value }))} placeholder="أدخل اسم العميل" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">المبلغ (ر.س) <span className="text-danger">*</span></label>
                    <input type="number" value={newInv.amount} onChange={(e) => setNewInv(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">النوع</label>
                    <select value={newInv.type} onChange={(e) => setNewInv(p => ({ ...p, type: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50">
                      <option value="booth">حجز جناح</option>
                      <option value="sponsorship">رعاية</option>
                      <option value="service">خدمة</option>
                    </select>
                  </div>
                </div>
                {newInv.amount && (
                  <div className="p-3 rounded-xl bg-gold/5 border border-gold/20">
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">المبلغ</span><span className="font-mono text-foreground">{formatCurrency(parseFloat(newInv.amount) || 0)}</span></div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">ضريبة 15%</span><span className="font-mono text-foreground">{formatCurrency((parseFloat(newInv.amount) || 0) * 0.15)}</span></div>
                    <div className="flex justify-between text-sm font-bold border-t border-gold/20 pt-1 mt-1"><span className="text-gold">الإجمالي</span><span className="font-mono text-gold">{formatCurrency((parseFloat(newInv.amount) || 0) * 1.15)}</span></div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ملاحظات</label>
                  <textarea value={newInv.notes} onChange={(e) => setNewInv(p => ({ ...p, notes: e.target.value }))} placeholder="ملاحظات إضافية..." rows={2} className="w-full p-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleCreateInvoice} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إنشاء الفاتورة</button>
                <button onClick={() => setShowInvoiceModal(false)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
