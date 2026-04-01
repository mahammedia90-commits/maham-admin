import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard,
  Download, Eye, Filter, ArrowUpRight, ArrowDownRight, Wallet, PieChart
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable, { Column } from '@/components/shared/DataTable'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { financeApi } from '@/api'
import { toast } from 'sonner'

const cashflowData = [
  { month: 'يناير', income: 280000, expenses: 180000 },
  { month: 'فبراير', income: 320000, expenses: 200000 },
  { month: 'مارس', income: 450000, expenses: 220000 },
  { month: 'أبريل', income: 380000, expenses: 250000 },
  { month: 'مايو', income: 520000, expenses: 280000 },
  { month: 'يونيو', income: 680000, expenses: 310000 },
]

interface Invoice {
  id: number
  number: string
  client: string
  amount: number
  status: string
  due_date: string
  type: string
}

export default function FinancePage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<'invoices' | 'payments' | 'refunds'>('invoices')

  const columns: Column<Invoice>[] = [
    {
      key: 'number',
      label: 'رقم الفاتورة',
      render: (val) => <span className="font-mono text-xs text-gold">#{val}</span>,
    },
    {
      key: 'client',
      label: 'العميل',
      sortable: true,
    },
    {
      key: 'type',
      label: 'النوع',
      render: (val) => (
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full',
          val === 'booth' && 'bg-gold/10 text-gold',
          val === 'sponsorship' && 'bg-info/10 text-info',
          val === 'service' && 'bg-chrome/10 text-chrome',
        )}>
          {val === 'booth' ? 'حجز جناح' : val === 'sponsorship' ? 'رعاية' : 'خدمة'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'المبلغ',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-foreground">{formatCurrency(val)}</span>,
    },
    {
      key: 'due_date',
      label: 'تاريخ الاستحقاق',
      sortable: true,
      render: (val) => <span className="text-xs text-muted-foreground">{formatDate(val)}</span>,
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Download size={14} /></button>
        </div>
      ),
    },
  ]

  const tabs = [
    { key: 'invoices', label: 'الفواتير', icon: Receipt },
    { key: 'payments', label: 'المدفوعات', icon: CreditCard },
    { key: 'refunds', label: 'المرتجعات', icon: ArrowDownRight },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="الإدارة المالية"
        subtitle="إدارة الفواتير والمدفوعات والتقارير المالية"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info('تصدير التقرير المالي — قريباً')}
              className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all flex items-center gap-2"
            >
              <Download size={14} />
              تصدير
            </button>
            <button
              onClick={() => toast.info('إنشاء فاتورة — قريباً')}
              className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"
            >
              <Receipt size={16} />
              فاتورة جديدة
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الإيرادات" value={formatCurrency(2630000)} icon={DollarSign} trend={18} trendLabel="هذا الربع" delay={0} />
        <StatsCard title="المدفوعات المحصلة" value={formatCurrency(2180000)} icon={Wallet} trend={12} trendLabel="هذا الشهر" delay={0.1} />
        <StatsCard title="المبالغ المعلقة" value={formatCurrency(450000)} icon={TrendingUp} trend={-8} trendLabel="عن الشهر الماضي" delay={0.2} />
        <StatsCard title="المرتجعات" value={formatCurrency(35000)} icon={TrendingDown} trend={-15} trendLabel="هذا الشهر" delay={0.3} />
      </div>

      {/* Cashflow Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">التدفق النقدي</h3>
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
            <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v/1000}k`} />
            <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
            <Area type="monotone" dataKey="income" stroke="#C9A84C" fill="url(#incomeGrad)" strokeWidth={2} name="الدخل" />
            <Area type="monotone" dataKey="expenses" stroke="#A0A0A0" fill="url(#expenseGrad)" strokeWidth={2} name="المصروفات" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={cn(
              'h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
              tab === t.key
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={[]}
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="بحث في الفواتير..."
        currentPage={page}
        totalPages={1}
        onPageChange={setPage}
        emptyMessage="لا توجد فواتير حالياً"
      />
    </AdminLayout>
  )
}
