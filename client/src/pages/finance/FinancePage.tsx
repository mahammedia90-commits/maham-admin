// Design: Nour Theme — Dark glassmorphism + gold accents
// Finance Module: 8 tabs — Overview, Invoices, Payments, Revenue, Expenses, CashFlow, ZATCA, Reports
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard,
  Download, Eye, ArrowDownRight, Wallet, PieChart, ArrowUpDown,
  BarChart3, Plus, Search, CheckCircle, Clock, Building2,
  ArrowUp, ArrowDown, RefreshCw, AlertTriangle, FileText, Filter
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const allTabs = [
  { id: 'overview', label: 'نظرة عامة', icon: PieChart },
  { id: 'invoices', label: 'الفواتير', icon: FileText },
  { id: 'payments', label: 'المدفوعات', icon: CreditCard },
  { id: 'revenue', label: 'الإيرادات', icon: TrendingUp },
  { id: 'expenses', label: 'المصروفات', icon: TrendingDown },
  { id: 'cashflow', label: 'التدفق النقدي', icon: ArrowUpDown },
  { id: 'zatca', label: 'ZATCA', icon: Receipt },
  { id: 'reports', label: 'التقارير المالية', icon: BarChart3 },
]

const cashflowData = [
  { month: 'يناير', income: 2450000, expenses: 780000, net: 1670000 },
  { month: 'فبراير', income: 2920000, expenses: 850000, net: 2070000 },
  { month: 'مارس', income: 3580000, expenses: 895000, net: 2685000 },
  { month: 'أبريل', income: 3200000, expenses: 920000, net: 2280000 },
  { month: 'مايو', income: 4100000, expenses: 980000, net: 3120000 },
  { month: 'يونيو', income: 4800000, expenses: 1050000, net: 3750000 },
]

const invoices = [
  { id: 'INV-2026-001', client: 'شركة الرياض للاستثمار', type: 'investor', amount: 450000, vat: 67500, total: 517500, status: 'paid', date: '2026-03-15', dueDate: '2026-04-15', zatcaStatus: 'reported' },
  { id: 'INV-2026-002', client: 'مؤسسة النخبة التجارية', type: 'merchant', amount: 85000, vat: 12750, total: 97750, status: 'pending', date: '2026-03-20', dueDate: '2026-04-20', zatcaStatus: 'pending' },
  { id: 'INV-2026-003', client: 'شركة STC', type: 'sponsor', amount: 250000, vat: 37500, total: 287500, status: 'paid', date: '2026-03-10', dueDate: '2026-04-10', zatcaStatus: 'reported' },
  { id: 'INV-2026-004', client: 'مجموعة الفطيم', type: 'investor', amount: 320000, vat: 48000, total: 368000, status: 'overdue', date: '2026-02-28', dueDate: '2026-03-28', zatcaStatus: 'reported' },
  { id: 'INV-2026-005', client: 'شركة أرامكو', type: 'sponsor', amount: 500000, vat: 75000, total: 575000, status: 'paid', date: '2026-03-01', dueDate: '2026-04-01', zatcaStatus: 'reported' },
  { id: 'INV-2026-006', client: 'مؤسسة الحرمين', type: 'merchant', amount: 65000, vat: 9750, total: 74750, status: 'sent', date: '2026-03-25', dueDate: '2026-04-25', zatcaStatus: 'pending' },
  { id: 'INV-2026-007', client: 'شركة نيوم', type: 'investor', amount: 780000, vat: 117000, total: 897000, status: 'draft', date: '2026-03-28', dueDate: '2026-04-28', zatcaStatus: 'not_sent' },
  { id: 'INV-2026-008', client: 'شركة الراجحي', type: 'sponsor', amount: 350000, vat: 52500, total: 402500, status: 'paid', date: '2026-02-15', dueDate: '2026-03-15', zatcaStatus: 'reported' },
]

const paymentsData = [
  { id: 'PAY-001', invoice: 'INV-2026-001', client: 'شركة الرياض للاستثمار', amount: 517500, method: 'تحويل بنكي', ref: 'TRF-98234', date: '2026-03-16', status: 'completed' },
  { id: 'PAY-002', invoice: 'INV-2026-003', client: 'شركة STC', amount: 287500, method: 'سداد', ref: 'SAD-45231', date: '2026-03-12', status: 'completed' },
  { id: 'PAY-003', invoice: 'INV-2026-005', client: 'شركة أرامكو', amount: 575000, method: 'مدى', ref: 'MADA-78123', date: '2026-03-05', status: 'completed' },
  { id: 'PAY-004', invoice: 'INV-2026-002', client: 'مؤسسة النخبة التجارية', amount: 48875, method: 'STC Pay', ref: 'STC-12345', date: '2026-03-22', status: 'partial' },
  { id: 'PAY-005', invoice: 'INV-2026-008', client: 'شركة الراجحي', amount: 402500, method: 'تحويل بنكي', ref: 'TRF-67890', date: '2026-02-20', status: 'completed' },
]

const expensesData = [
  { id: 1, category: 'رواتب وأجور', amount: 450000, budget: 500000, pct: 90 },
  { id: 2, category: 'إيجارات ومرافق', amount: 120000, budget: 120000, pct: 100 },
  { id: 3, category: 'تسويق وإعلان', amount: 85000, budget: 150000, pct: 57 },
  { id: 4, category: 'تقنية معلومات', amount: 65000, budget: 80000, pct: 81 },
  { id: 5, category: 'لوجستيات وتشغيل', amount: 95000, budget: 100000, pct: 95 },
  { id: 6, category: 'خدمات مهنية واستشارية', amount: 45000, budget: 60000, pct: 75 },
  { id: 7, category: 'مصاريف إدارية عامة', amount: 35000, budget: 40000, pct: 88 },
]

const revenueBySource = [
  { month: 'يناير', investors: 1200000, merchants: 450000, sponsors: 800000 },
  { month: 'فبراير', investors: 1450000, merchants: 520000, sponsors: 950000 },
  { month: 'مارس', investors: 1800000, merchants: 680000, sponsors: 1100000 },
  { month: 'أبريل', investors: 1600000, merchants: 600000, sponsors: 1000000 },
  { month: 'مايو', investors: 2100000, merchants: 800000, sponsors: 1200000 },
  { month: 'يونيو', investors: 2500000, merchants: 950000, sponsors: 1350000 },
]

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const totalRevenue = 21050000
  const totalExpenses = 895000
  const netProfit = totalRevenue - totalExpenses
  const pendingCount = invoices.filter(i => i.status === 'pending' || i.status === 'sent').length
  const overdueCount = invoices.filter(i => i.status === 'overdue').length

  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = inv.client.includes(searchTerm) || inv.id.includes(searchTerm)
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <AdminLayout>
      <PageHeader
        title="النظام المالي"
        subtitle="إدارة الفواتير والمدفوعات والإيرادات — متوافق مع ZATCA"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => toast.info('تصدير التقرير المالي — قريباً')} className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all flex items-center gap-2">
              <Download size={14} /> تصدير
            </button>
            <button onClick={() => toast.info('إنشاء فاتورة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
              <Plus size={16} /> فاتورة جديدة
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border/50 overflow-x-auto mb-6">
        {allTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-surface2/50'
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

          {/* ===== OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} icon={TrendingUp} trend={18.5} trendLabel="عن الربع السابق" delay={0} />
                <StatsCard title="إجمالي المصروفات" value={formatCurrency(totalExpenses)} icon={TrendingDown} trend={-5.2} trendLabel="عن الشهر السابق" delay={0.1} />
                <StatsCard title="صافي الربح" value={formatCurrency(netProfit)} icon={DollarSign} trend={24.3} trendLabel="عن الربع السابق" delay={0.2} />
                <StatsCard title="فواتير معلقة" value={`${pendingCount} فاتورة`} icon={Clock} trend={-2} trendLabel="عن الأسبوع السابق" delay={0.3} />
              </div>

              {/* Cashflow Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground">التدفق النقدي — 6 أشهر</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold" /> الدخل</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-chrome" /> المصروفات</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={cashflowData}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A0A0A0" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#A0A0A0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v/1000000}M`} />
                    <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
                    <Area type="monotone" dataKey="income" stroke="#C9A84C" fill="url(#incomeGrad)" strokeWidth={2} name="الدخل" />
                    <Area type="monotone" dataKey="expenses" stroke="#A0A0A0" fill="url(#expenseGrad)" strokeWidth={2} name="المصروفات" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue by Source */}
                <div className="lg:col-span-2 glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">الإيرادات حسب المصدر</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={revenueBySource}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={(v) => `${v/1000000}M`} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
                      <Bar dataKey="investors" fill="#C9A84C" name="مستثمرون" radius={[4,4,0,0]} />
                      <Bar dataKey="merchants" fill="#3b82f6" name="تجار" radius={[4,4,0,0]} />
                      <Bar dataKey="sponsors" fill="#f59e0b" name="رعاة" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Invoice Status Summary */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">حالة الفواتير</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'مدفوعة', count: invoices.filter(i => i.status === 'paid').length, color: 'bg-success', total: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0) },
                      { label: 'معلقة', count: invoices.filter(i => i.status === 'pending').length, color: 'bg-warning', total: invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.total, 0) },
                      { label: 'مرسلة', count: invoices.filter(i => i.status === 'sent').length, color: 'bg-info', total: invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0) },
                      { label: 'متأخرة', count: overdueCount, color: 'bg-danger', total: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0) },
                      { label: 'مسودة', count: invoices.filter(i => i.status === 'draft').length, color: 'bg-muted-foreground', total: invoices.filter(i => i.status === 'draft').reduce((s, i) => s + i.total, 0) },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface2/50">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          <span className="text-sm text-foreground">{item.label}</span>
                          <span className="text-xs bg-surface2 px-1.5 py-0.5 rounded text-muted-foreground">{item.count}</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-foreground">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {overdueCount > 0 && (
                <div className="glass-card p-4 border-danger/30 bg-danger/5">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-danger" size={20} />
                    <div>
                      <p className="text-sm font-bold text-danger">تنبيه: {overdueCount} فاتورة متأخرة</p>
                      <p className="text-xs text-muted-foreground">يرجى متابعة الفواتير المتأخرة وإرسال تذكيرات للعملاء</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== INVOICES ===== */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="text" placeholder="بحث بالرقم أو اسم العميل..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm text-foreground">
                  <option value="all">جميع الحالات</option>
                  <option value="paid">مدفوعة</option>
                  <option value="pending">معلقة</option>
                  <option value="sent">مرسلة</option>
                  <option value="overdue">متأخرة</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-border/50">
                      {['رقم الفاتورة','العميل','النوع','المبلغ','ضريبة 15%','الإجمالي','التاريخ','الاستحقاق','الحالة','ZATCA','إجراءات'].map(h => (
                        <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredInvoices.map(inv => (
                        <tr key={inv.id} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                          <td className="p-4 text-sm font-mono font-bold text-gold">{inv.id}</td>
                          <td className="p-4 text-sm text-foreground">{inv.client}</td>
                          <td className="p-4"><span className={cn('text-xs px-2 py-0.5 rounded-full', inv.type === 'investor' ? 'bg-gold/10 text-gold' : inv.type === 'merchant' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning')}>{inv.type === 'investor' ? 'مستثمر' : inv.type === 'merchant' ? 'تاجر' : 'راعي'}</span></td>
                          <td className="p-4 text-sm font-mono text-foreground">{formatCurrency(inv.amount)}</td>
                          <td className="p-4 text-sm font-mono text-muted-foreground">{formatCurrency(inv.vat)}</td>
                          <td className="p-4 text-sm font-mono font-bold text-foreground">{formatCurrency(inv.total)}</td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(inv.date)}</td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(inv.dueDate)}</td>
                          <td className="p-4"><StatusBadge status={inv.status} /></td>
                          <td className="p-4"><StatusBadge status={inv.zatcaStatus === 'reported' ? 'approved' : inv.zatcaStatus === 'pending' ? 'pending' : 'draft'} /></td>
                          <td className="p-4"><div className="flex gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold"><Eye size={14} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info"><Download size={14} /></button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== PAYMENTS ===== */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="إجمالي المحصّل" value={formatCurrency(1831375)} icon={CheckCircle} trend={15} delay={0} />
                <StatsCard title="مدفوعات جزئية" value={formatCurrency(48875)} icon={Clock} delay={0.1} />
                <StatsCard title="متأخرات" value={formatCurrency(368000)} icon={AlertTriangle} trend={-8} delay={0.2} />
                <StatsCard title="معدل التحصيل" value="83.2%" icon={TrendingUp} trend={5.2} delay={0.3} />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-border/50">
                      {['رقم الدفعة','الفاتورة','العميل','المبلغ','طريقة الدفع','المرجع','التاريخ','الحالة'].map(h => (
                        <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {paymentsData.map(pay => (
                        <tr key={pay.id} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                          <td className="p-4 text-sm font-mono font-bold text-gold">{pay.id}</td>
                          <td className="p-4 text-sm font-mono text-info">{pay.invoice}</td>
                          <td className="p-4 text-sm text-foreground">{pay.client}</td>
                          <td className="p-4 text-sm font-mono font-bold text-foreground">{formatCurrency(pay.amount)}</td>
                          <td className="p-4 text-sm text-muted-foreground">{pay.method}</td>
                          <td className="p-4 text-sm font-mono text-muted-foreground">{pay.ref}</td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(pay.date)}</td>
                          <td className="p-4"><StatusBadge status={pay.status === 'completed' ? 'paid' : pay.status === 'partial' ? 'pending' : 'overdue'} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== REVENUE ===== */}
          {activeTab === 'revenue' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard title="إيرادات المستثمرين" value={formatCurrency(10650000)} icon={Building2} trend={22} delay={0} />
                <StatsCard title="إيرادات التجار" value={formatCurrency(4000000)} icon={Wallet} trend={15} delay={0.1} />
                <StatsCard title="إيرادات الرعاة" value={formatCurrency(6400000)} icon={TrendingUp} trend={18} delay={0.2} />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">الإيرادات الشهرية حسب المصدر</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={revenueBySource}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v/1000000}M`} />
                    <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
                    <Bar dataKey="investors" fill="#C9A84C" name="مستثمرون" radius={[4,4,0,0]} stackId="a" />
                    <Bar dataKey="merchants" fill="#3b82f6" name="تجار" radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="sponsors" fill="#f59e0b" name="رعاة" radius={[4,4,0,0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ===== EXPENSES ===== */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard title="إجمالي المصروفات" value={formatCurrency(895000)} icon={TrendingDown} trend={-5.2} delay={0} />
                <StatsCard title="الميزانية المتبقية" value={formatCurrency(155000)} icon={Wallet} delay={0.1} />
                <StatsCard title="نسبة الاستهلاك" value="85.2%" icon={PieChart} delay={0.2} />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">المصروفات حسب الفئة</h3>
                <div className="space-y-4">
                  {expensesData.map(exp => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{exp.category}</span>
                        <div className="flex gap-4">
                          <span className="font-mono text-foreground">{formatCurrency(exp.amount)}</span>
                          <span className="font-mono text-muted-foreground">/ {formatCurrency(exp.budget)}</span>
                          <span className={cn('font-mono font-bold', exp.pct > 90 ? 'text-danger' : exp.pct > 75 ? 'text-warning' : 'text-success')}>{exp.pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-surface2/50 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', exp.pct > 90 ? 'bg-danger' : exp.pct > 75 ? 'bg-warning' : 'bg-success')} style={{ width: `${exp.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== CASHFLOW ===== */}
          {activeTab === 'cashflow' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="الرصيد الحالي" value={formatCurrency(7605000)} icon={Wallet} delay={0} />
                <StatsCard title="التدفق الداخل" value={formatCurrency(4800000)} icon={ArrowDown} trend={18} delay={0.1} />
                <StatsCard title="التدفق الخارج" value={formatCurrency(1050000)} icon={ArrowUp} trend={-5} delay={0.2} />
                <StatsCard title="صافي التدفق" value={formatCurrency(3750000)} icon={RefreshCw} trend={25} delay={0.3} />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">حركة التدفق النقدي — 6 أشهر</h3>
                <div className="space-y-3">
                  {cashflowData.map((item, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-surface2/30">
                      <div><p className="text-xs text-muted-foreground">الشهر</p><p className="text-sm font-bold text-foreground">{item.month}</p></div>
                      <div><p className="text-xs text-muted-foreground">الداخل</p><p className="text-sm font-mono text-success">{formatCurrency(item.income)}</p></div>
                      <div><p className="text-xs text-muted-foreground">الخارج</p><p className="text-sm font-mono text-danger">{formatCurrency(item.expenses)}</p></div>
                      <div><p className="text-xs text-muted-foreground">الصافي</p><p className="text-sm font-mono font-bold text-gold">{formatCurrency(item.net)}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== ZATCA ===== */}
          {activeTab === 'zatca' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="فواتير مُبلّغة" value="6" icon={CheckCircle} delay={0} />
                <StatsCard title="بانتظار الإبلاغ" value="2" icon={Clock} delay={0.1} />
                <StatsCard title="نسبة الامتثال" value="96%" icon={Receipt} delay={0.2} />
                <StatsCard title="ضريبة محصّلة" value={formatCurrency(420000)} icon={DollarSign} delay={0.3} />
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground">حالة الامتثال ZATCA المرحلة 2</h3>
                  <span className="px-3 py-1 rounded-full bg-success/15 text-success text-sm font-bold">متوافق</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: 'تسجيل المنشأة في ZATCA', status: 'مكتمل', done: true },
                    { label: 'ربط نظام الفوترة الإلكترونية', status: 'مكتمل', done: true },
                    { label: 'QR Code في جميع الفواتير', status: 'مكتمل', done: true },
                    { label: 'XML Schema متوافق مع ZATCA', status: 'مكتمل', done: true },
                    { label: 'التوقيع الرقمي (Digital Signature)', status: 'مكتمل', done: true },
                    { label: 'الإبلاغ الآلي (Auto Reporting)', status: 'جاري التفعيل', done: false },
                    { label: 'أرشفة الفواتير 6 سنوات', status: 'مكتمل', done: true },
                    { label: 'تقارير ضريبية ربعية', status: 'مكتمل', done: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface2/30">
                      {item.done ? <CheckCircle size={18} className="text-success" /> : <Clock size={18} className="text-warning" />}
                      <div className="flex-1"><p className="text-sm font-medium text-foreground">{item.label}</p></div>
                      <span className={cn('text-xs font-bold', item.done ? 'text-success' : 'text-warning')}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== REPORTS ===== */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'تقرير الأرباح والخسائر', desc: 'Q1 2026 — يناير إلى مارس', icon: BarChart3 },
                { title: 'الميزانية العمومية', desc: 'حتى 31 مارس 2026', icon: PieChart },
                { title: 'تقرير التدفق النقدي', desc: 'Q1 2026', icon: ArrowUpDown },
                { title: 'تقرير ضريبة القيمة المضافة', desc: 'الربع الأول 2026 — ZATCA', icon: Receipt },
                { title: 'تقرير المدينين', desc: 'أعمار الديون — مارس 2026', icon: Clock },
                { title: 'تقرير الإيرادات حسب القطاع', desc: 'مستثمرون / تجار / رعاة', icon: TrendingUp },
                { title: 'تقرير المصروفات التشغيلية', desc: 'مقارنة بالميزانية', icon: TrendingDown },
                { title: 'تقرير العمولات والرسوم', desc: 'رسوم الخدمات والعمولات', icon: DollarSign },
                { title: 'تقرير التسويات البنكية', desc: 'مطابقة الحسابات', icon: RefreshCw },
              ].map((report, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 hover:border-gold/30 transition-all cursor-pointer group"
                  onClick={() => toast.info(`تحميل ${report.title} — قريباً`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors"><report.icon size={20} /></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-foreground">{report.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{report.desc}</p>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><Download size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
