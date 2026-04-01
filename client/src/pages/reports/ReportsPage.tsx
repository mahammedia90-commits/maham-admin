// Design: Nour Theme — Reports Module
// 4 tabs: Financial, Operational, Marketing, Custom
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, DollarSign, Settings, Megaphone, Plus,
  Download, Calendar, TrendingUp, BarChart3, PieChart,
  Eye, Clock, Printer
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'financial', label: 'التقارير المالية', icon: DollarSign },
  { id: 'operational', label: 'التقارير التشغيلية', icon: Settings },
  { id: 'marketing', label: 'التقارير التسويقية', icon: Megaphone },
  { id: 'custom', label: 'تقارير مخصصة', icon: FileText },
]

const financialReports = [
  { id: 1, name: 'تقرير الإيرادات الشهري', period: 'مارس 2026', generated: '2026-04-01', status: 'ready', size: '2.4 MB', type: 'PDF', revenue: 4250000, growth: 18 },
  { id: 2, name: 'تقرير المصروفات', period: 'مارس 2026', generated: '2026-04-01', status: 'ready', size: '1.8 MB', type: 'Excel', revenue: 2100000, growth: -5 },
  { id: 3, name: 'تقرير التدفق النقدي', period: 'Q1 2026', generated: '2026-04-01', status: 'processing', size: '—', type: 'PDF', revenue: 12500000, growth: 22 },
  { id: 4, name: 'تقرير الفواتير المستحقة', period: 'أبريل 2026', generated: '2026-04-01', status: 'ready', size: '890 KB', type: 'PDF', revenue: 1850000, growth: 0 },
  { id: 5, name: 'تقرير ZATCA الضريبي', period: 'Q1 2026', generated: '2026-03-31', status: 'ready', size: '3.1 MB', type: 'XML', revenue: 0, growth: 0 },
]

const operationalReports = [
  { id: 1, name: 'تقرير إشغال المعارض', metric: '78%', trend: 12, period: 'أبريل 2026' },
  { id: 2, name: 'تقرير أداء الفرق', metric: '92%', trend: 5, period: 'مارس 2026' },
  { id: 3, name: 'تقرير الصيانة والتجهيزات', metric: '15 طلب', trend: -8, period: 'مارس 2026' },
  { id: 4, name: 'تقرير الأمن والسلامة', metric: '0 حوادث', trend: 0, period: 'مارس 2026' },
  { id: 5, name: 'تقرير رضا العملاء', metric: '4.3/5', trend: 3, period: 'مارس 2026' },
]

const marketingReports = [
  { id: 1, name: 'تقرير أداء الحملات', campaigns: 8, impressions: '2.5M', clicks: '125K', conversions: '3.2%', spend: 450000 },
  { id: 2, name: 'تقرير السوشيال ميديا', campaigns: 12, impressions: '5.8M', clicks: '320K', conversions: '1.8%', spend: 180000 },
  { id: 3, name: 'تقرير البريد الإلكتروني', campaigns: 6, impressions: '45K', clicks: '8.5K', conversions: '12%', spend: 25000 },
]

const customReports = [
  { id: 1, name: 'تقرير ROI المستثمرين', creator: 'أحمد الراشد', created: '2026-03-28', schedule: 'أسبوعي', lastRun: '2026-04-01' },
  { id: 2, name: 'تقرير KYC التجار', creator: 'سارة العلي', created: '2026-03-15', schedule: 'يومي', lastRun: '2026-04-01' },
  { id: 3, name: 'تقرير تسليمات الرعاة', creator: 'خالد الحربي', created: '2026-03-20', schedule: 'شهري', lastRun: '2026-04-01' },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('financial')

  return (
    <AdminLayout>
      <PageHeader title="التقارير" subtitle="التقارير المالية والتشغيلية والتسويقية والمخصصة" actions={
        <button onClick={() => toast.info('تقرير مخصص — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> تقرير مخصص</button>
      } />

      <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border/50 overflow-x-auto mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-surface2/50')}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="إجمالي الإيرادات" value="12.5M" icon={DollarSign} trend={22} delay={0} />
                <StatsCard title="صافي الربح" value="4.8M" icon={TrendingUp} trend={15} delay={0.1} />
                <StatsCard title="تقارير جاهزة" value="4" icon={FileText} delay={0.2} />
                <StatsCard title="قيد المعالجة" value="1" icon={Clock} delay={0.3} />
              </div>
              <div className="space-y-3">
                {financialReports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', r.status === 'ready' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}><FileText size={18} /></div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{r.name}</h4>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {r.period}</span>
                            <span className="text-[10px] text-muted-foreground">{r.type} • {r.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {r.revenue > 0 && <span className="text-sm font-mono font-bold text-foreground">{formatCurrency(r.revenue)}</span>}
                        {r.growth !== 0 && <span className={cn('text-[10px] font-bold', r.growth > 0 ? 'text-success' : 'text-danger')}>{r.growth > 0 ? '+' : ''}{r.growth}%</span>}
                        <button onClick={() => toast.info('تحميل التقرير — قريباً')} className={cn('h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1 transition-all', r.status === 'ready' ? 'bg-gold/10 text-gold hover:bg-gold/20' : 'bg-surface2 text-muted-foreground cursor-not-allowed')}>
                          <Download size={12} /> {r.status === 'ready' ? 'تحميل' : 'جاري...'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'operational' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {operationalReports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 hover:border-gold/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 size={18} className="text-gold" />
                      <span className="text-[10px] text-muted-foreground">{r.period}</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-2">{r.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gold">{r.metric}</span>
                      {r.trend !== 0 && <span className={cn('text-xs font-bold flex items-center gap-1', r.trend > 0 ? 'text-success' : 'text-danger')}><TrendingUp size={12} className={r.trend < 0 ? 'rotate-180' : ''} /> {r.trend > 0 ? '+' : ''}{r.trend}%</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-4">
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['التقرير', 'الحملات', 'المشاهدات', 'النقرات', 'التحويل', 'الإنفاق'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {marketingReports.map((r, i) => (
                      <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors cursor-pointer">
                        <td className="p-4 text-sm font-bold text-foreground">{r.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{r.campaigns}</td>
                        <td className="p-4 text-sm font-mono text-foreground">{r.impressions}</td>
                        <td className="p-4 text-sm font-mono text-foreground">{r.clicks}</td>
                        <td className="p-4"><span className="text-sm font-bold text-gold">{r.conversions}</span></td>
                        <td className="p-4 text-sm font-mono text-warning">{formatCurrency(r.spend)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {customReports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center"><PieChart size={18} className="text-gold" /></div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{r.name}</h4>
                          <p className="text-[10px] text-muted-foreground">أنشأه: {r.creator} • {formatDate(r.created)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-[10px] text-muted-foreground">الجدولة</p>
                          <p className="text-xs font-bold text-foreground">{r.schedule}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-muted-foreground">آخر تشغيل</p>
                          <p className="text-xs font-mono text-foreground">{formatDate(r.lastRun)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toast.info('عرض التقرير — قريباً')} className="h-8 px-3 rounded-lg bg-surface2/50 text-xs font-medium text-foreground hover:bg-surface2 transition-all flex items-center gap-1"><Eye size={12} /> عرض</button>
                          <button onClick={() => toast.info('تحميل — قريباً')} className="h-8 px-3 rounded-lg bg-gold/10 text-xs font-medium text-gold hover:bg-gold/20 transition-all flex items-center gap-1"><Download size={12} /> تحميل</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
