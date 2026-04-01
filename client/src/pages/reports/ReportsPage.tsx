/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — التقارير والتحليلات (Reports & Analytics)
 * Features: تقارير مالية، تشغيلية، تسويقية، تصدير
 * ═══════════════════════════════════════════════════════
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, FileText, Download, Calendar, TrendingUp,
  DollarSign, Users, Eye, Printer, PieChart, Activity,
  ShoppingCart, Shield, Building2, Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const revenueData = [
  { month: 'يناير', revenue: 240000, expenses: 180000, profit: 60000 },
  { month: 'فبراير', revenue: 300000, expenses: 200000, profit: 100000 },
  { month: 'مارس', revenue: 390000, expenses: 250000, profit: 140000 },
  { month: 'أبريل', revenue: 355000, expenses: 230000, profit: 125000 },
  { month: 'مايو', revenue: 485000, expenses: 280000, profit: 205000 },
  { month: 'يونيو', revenue: 595000, expenses: 320000, profit: 275000 },
]

const kpiData = [
  { month: 'يناير', customers: 120, deals: 15, events: 2 },
  { month: 'فبراير', customers: 145, deals: 18, events: 1 },
  { month: 'مارس', customers: 180, deals: 22, events: 3 },
  { month: 'أبريل', customers: 165, deals: 20, events: 2 },
  { month: 'مايو', customers: 210, deals: 28, events: 4 },
  { month: 'يونيو', customers: 250, deals: 35, events: 3 },
]

const reportCategories = [
  { title: 'التقارير المالية', icon: DollarSign, color: 'text-gold', reports: [
    { name: 'تقرير الإيرادات الشهري', type: 'PDF', date: '2026-03-31', size: '2.4 MB' },
    { name: 'كشف حساب الأرباح والخسائر', type: 'Excel', date: '2026-03-31', size: '1.8 MB' },
    { name: 'تقرير التدفقات النقدية', type: 'PDF', date: '2026-03-31', size: '1.2 MB' },
    { name: 'تقرير الفواتير المستحقة', type: 'Excel', date: '2026-03-30', size: '890 KB' },
  ]},
  { title: 'تقارير المبيعات', icon: ShoppingCart, color: 'text-success', reports: [
    { name: 'تقرير أداء المبيعات', type: 'PDF', date: '2026-03-31', size: '3.1 MB' },
    { name: 'تقرير خط المبيعات', type: 'Excel', date: '2026-03-31', size: '1.5 MB' },
    { name: 'تقرير أداء المندوبين', type: 'PDF', date: '2026-03-31', size: '2.0 MB' },
  ]},
  { title: 'تقارير التسويق', icon: TrendingUp, color: 'text-info', reports: [
    { name: 'تقرير أداء الحملات', type: 'PDF', date: '2026-03-31', size: '4.2 MB' },
    { name: 'تقرير ROI التسويقي', type: 'Excel', date: '2026-03-31', size: '1.1 MB' },
    { name: 'تقرير تحليل القنوات', type: 'PDF', date: '2026-03-31', size: '2.8 MB' },
  ]},
  { title: 'تقارير العمليات', icon: Activity, color: 'text-warning', reports: [
    { name: 'تقرير تقدم المهام', type: 'PDF', date: '2026-03-31', size: '1.9 MB' },
    { name: 'تقرير الكفاءة التشغيلية', type: 'Excel', date: '2026-03-31', size: '1.3 MB' },
  ]},
  { title: 'تقارير الموارد البشرية', icon: Users, color: 'text-chrome', reports: [
    { name: 'تقرير الحضور والغياب', type: 'Excel', date: '2026-03-31', size: '980 KB' },
    { name: 'تقرير أداء الموظفين', type: 'PDF', date: '2026-03-31', size: '2.5 MB' },
    { name: 'تقرير الرواتب', type: 'Excel', date: '2026-03-31', size: '1.7 MB' },
  ]},
  { title: 'تقارير الامتثال', icon: Shield, color: 'text-danger', reports: [
    { name: 'تقرير الامتثال القانوني', type: 'PDF', date: '2026-03-31', size: '3.5 MB' },
    { name: 'تقرير التراخيص والتصاريح', type: 'PDF', date: '2026-03-31', size: '1.4 MB' },
  ]},
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('monthly')

  return (
    <AdminLayout>
      <PageHeader
        title="التقارير والتحليلات"
        subtitle="لوحة تحليلات شاملة وتقارير قابلة للتصدير"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface2 rounded-xl p-0.5">
              {['monthly', 'quarterly', 'yearly'].map(r => (
                <button key={r} onClick={() => setDateRange(r)} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', dateRange === r ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
                  {r === 'monthly' ? 'شهري' : r === 'quarterly' ? 'ربعي' : 'سنوي'}
                </button>
              ))}
            </div>
            <button onClick={() => toast.info('تصدير التقرير الشامل — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
              <Download size={16} /> تصدير
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatsCard title="إجمالي الإيرادات" value={formatCurrency(2365000)} icon={DollarSign} trend={18} trendLabel="هذا الربع" delay={0} />
        <StatsCard title="صافي الربح" value={formatCurrency(905000)} icon={TrendingUp} trend={25} trendLabel="هذا الربع" delay={0.05} />
        <StatsCard title="العملاء الجدد" value="1,070" icon={Users} trend={32} trendLabel="هذا الربع" delay={0.1} />
        <StatsCard title="الصفقات المغلقة" value="138" icon={ShoppingCart} trend={15} trendLabel="هذا الربع" delay={0.15} />
      </div>

      {/* تبويبات */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
          { key: 'financial', label: 'مالي', icon: DollarSign },
          { key: 'reports', label: 'التقارير', icon: FileText },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', activeTab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* نظرة عامة */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">الإيرادات والمصروفات</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
                <Bar dataKey="revenue" name="الإيرادات" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="المصروفات" fill="#A0A0A0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">صافي الربح</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs><linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
                <Area type="monotone" dataKey="profit" name="الربح" stroke="#10B981" fill="url(#profitGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 lg:col-span-2">
            <h3 className="text-sm font-bold text-foreground mb-4">مؤشرات الأداء الرئيسية (KPIs)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                <Line type="monotone" dataKey="customers" name="العملاء" stroke="#C9A84C" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="deals" name="الصفقات" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="events" name="الفعاليات" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* مالي */}
      {activeTab === 'financial' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50"><h3 className="text-sm font-bold text-foreground">الملخص المالي — آخر 6 أشهر</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الشهر</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الإيرادات</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المصروفات</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">صافي الربح</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">هامش الربح</th>
              </tr></thead>
              <tbody>
                {revenueData.map((row, idx) => {
                  const margin = Math.round((row.profit / row.revenue) * 100)
                  return (
                    <motion.tr key={row.month} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{row.month}</td>
                      <td className="px-3 py-3 font-mono text-sm text-foreground">{formatCurrency(row.revenue)}</td>
                      <td className="px-3 py-3 font-mono text-sm text-muted-foreground">{formatCurrency(row.expenses)}</td>
                      <td className="px-3 py-3 font-mono text-sm font-bold text-success">{formatCurrency(row.profit)}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', margin >= 40 ? 'bg-success/10 text-success' : margin >= 25 ? 'bg-gold/10 text-gold' : 'bg-warning/10 text-warning')}>{margin}%</span>
                      </td>
                    </motion.tr>
                  )
                })}
                <tr className="bg-gold/5 border-t-2 border-gold/20">
                  <td className="px-4 py-3 text-sm font-bold text-gold">الإجمالي</td>
                  <td className="px-3 py-3 font-mono text-sm font-bold text-gold">{formatCurrency(revenueData.reduce((s, r) => s + r.revenue, 0))}</td>
                  <td className="px-3 py-3 font-mono text-sm font-bold text-muted-foreground">{formatCurrency(revenueData.reduce((s, r) => s + r.expenses, 0))}</td>
                  <td className="px-3 py-3 font-mono text-sm font-bold text-success">{formatCurrency(revenueData.reduce((s, r) => s + r.profit, 0))}</td>
                  <td className="px-3 py-3 text-center"><span className="text-xs font-bold text-gold">{Math.round((revenueData.reduce((s, r) => s + r.profit, 0) / revenueData.reduce((s, r) => s + r.revenue, 0)) * 100)}%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* التقارير */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reportCategories.map((cat, ci) => (
            <motion.div key={cat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.05 }} className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center"><cat.icon size={16} className={cat.color} /></div>
                <h3 className="text-sm font-bold text-foreground">{cat.title}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground">{cat.reports.length}</span>
              </div>
              <div className="divide-y divide-border/30">
                {cat.reports.map((report, ri) => (
                  <div key={ri} className="px-4 py-3 flex items-center justify-between hover:bg-surface2/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-muted-foreground" />
                      <div><p className="text-sm text-foreground">{report.name}</p><p className="text-[10px] text-muted-foreground">{report.date} — {report.size}</p></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface2 text-muted-foreground">{report.type}</span>
                      <button onClick={() => toast.info(`جاري تحميل: ${report.name}`)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Download size={13} /></button>
                      <button onClick={() => toast.info(`جاري عرض: ${report.name}`)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Eye size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
