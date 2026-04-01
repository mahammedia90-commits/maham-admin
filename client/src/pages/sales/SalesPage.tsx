// Design: Nour Theme — Sales Module
// 5 tabs: Overview, Deals, Pipeline, Team, Reports
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, TrendingUp, DollarSign, Target, Users, Plus,
  ArrowUpRight, BarChart3, Briefcase, Award, Clock, Eye,
  Phone, Mail, CheckCircle, Star, PieChart, Handshake
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'overview', label: 'نظرة عامة', icon: PieChart },
  { id: 'deals', label: 'الصفقات', icon: Handshake },
  { id: 'pipeline', label: 'خط الأنابيب', icon: Target },
  { id: 'team', label: 'فريق المبيعات', icon: Users },
  { id: 'reports', label: 'التقارير', icon: BarChart3 },
]

const salesData = [
  { month: 'يناير', booths: 420000, sponsorships: 280000, services: 140000 },
  { month: 'فبراير', booths: 550000, sponsorships: 350000, services: 185000 },
  { month: 'مارس', booths: 720000, sponsorships: 480000, services: 245000 },
]

const deals = [
  { id: 'DEAL-001', title: 'رعاية بلاتينية — أرامكو', contact: 'عبدالله الشمري', value: 1500000, stage: 'won', probability: 100, rep: 'أحمد محمد', closeDate: '2026-03-15', source: 'إحالة' },
  { id: 'DEAL-002', title: 'استثمار 5 أجنحة — الراشد', contact: 'أحمد الراشد', value: 2500000, stage: 'negotiation', probability: 75, rep: 'سارة العلي', closeDate: '2026-04-10', source: 'موقع' },
  { id: 'DEAL-003', title: 'حزمة ذهبية — STC', contact: 'خالد العتيبي', value: 500000, stage: 'proposal', probability: 60, rep: 'خالد الحربي', closeDate: '2026-04-20', source: 'معرض سابق' },
  { id: 'DEAL-004', title: '10 أجنحة — نيوم', contact: 'نورة القحطاني', value: 3200000, stage: 'qualification', probability: 40, rep: 'فاطمة أحمد', closeDate: '2026-05-01', source: 'سوشيال' },
  { id: 'DEAL-005', title: '3 أجنحة — الفطيم', contact: 'فهد الدوسري', value: 450000, stage: 'lead', probability: 20, rep: 'أحمد محمد', closeDate: '2026-05-15', source: 'بريد' },
  { id: 'DEAL-006', title: 'رعاية فضية — المراعي', contact: 'ريم الحربي', value: 250000, stage: 'proposal', probability: 55, rep: 'سارة العلي', closeDate: '2026-04-25', source: 'إحالة' },
  { id: 'DEAL-007', title: 'خدمات لوجستية — DHL', contact: 'محمد العنزي', value: 180000, stage: 'negotiation', probability: 70, rep: 'خالد الحربي', closeDate: '2026-04-15', source: 'موقع' },
]

const pipelineStages = [
  { id: 'lead', label: 'عميل محتمل', color: 'bg-chrome/50', textColor: 'text-chrome' },
  { id: 'qualification', label: 'تأهيل', color: 'bg-info', textColor: 'text-info' },
  { id: 'proposal', label: 'عرض سعر', color: 'bg-warning', textColor: 'text-warning' },
  { id: 'negotiation', label: 'تفاوض', color: 'bg-gold', textColor: 'text-gold' },
  { id: 'won', label: 'مكسوبة', color: 'bg-success', textColor: 'text-success' },
]

const teamMembers = [
  { id: 1, name: 'أحمد محمد', role: 'مدير مبيعات', deals: 12, won: 8, revenue: 4200000, target: 5000000, avatar: 'أ' },
  { id: 2, name: 'سارة العلي', role: 'أخصائي مبيعات', deals: 9, won: 6, revenue: 3100000, target: 3500000, avatar: 'س' },
  { id: 3, name: 'خالد الحربي', role: 'أخصائي مبيعات', deals: 7, won: 5, revenue: 2800000, target: 3000000, avatar: 'خ' },
  { id: 4, name: 'فاطمة أحمد', role: 'مندوب مبيعات', deals: 5, won: 3, revenue: 1500000, target: 2000000, avatar: 'ف' },
]

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const totalPipeline = deals.reduce((s, d) => s + d.value, 0)
  const wonValue = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0)

  return (
    <AdminLayout>
      <PageHeader title="المبيعات" subtitle="إدارة الصفقات وخط الأنابيب وفريق المبيعات" actions={
        <button onClick={() => toast.info('صفقة جديدة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> صفقة جديدة</button>
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

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="إجمالي الإيرادات" value={formatCurrency(totalPipeline)} icon={DollarSign} trend={32} delay={0} />
                <StatsCard title="صفقات مكسوبة" value={formatCurrency(wonValue)} icon={CheckCircle} delay={0.1} />
                <StatsCard title="معدل الإغلاق" value="67%" icon={Target} trend={8} delay={0.2} />
                <StatsCard title="متوسط دورة البيع" value="18 يوم" icon={Clock} trend={-5} delay={0.3} />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">الإيرادات حسب المصدر — Q1 2026</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v/1000}K`} />
                    <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="booths" fill="#C9A84C" name="أجنحة" radius={[4,4,0,0]} />
                    <Bar dataKey="sponsorships" fill="#3b82f6" name="رعايات" radius={[4,4,0,0]} />
                    <Bar dataKey="services" fill="#10b981" name="خدمات" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-border/50">
                  {['الصفقة','جهة الاتصال','القيمة','المرحلة','الاحتمالية','المندوب','الإغلاق','المصدر'].map(h => (
                    <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {deals.map((d, i) => (
                    <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                      <td className="p-4"><div><p className="text-sm font-bold text-foreground">{d.title}</p><p className="text-[10px] font-mono text-muted-foreground">{d.id}</p></div></td>
                      <td className="p-4 text-sm text-foreground">{d.contact}</td>
                      <td className="p-4 text-sm font-mono font-bold text-gold">{formatCurrency(d.value)}</td>
                      <td className="p-4"><span className={cn('text-xs px-2 py-0.5 rounded-full font-bold', d.stage === 'won' ? 'bg-success/15 text-success' : d.stage === 'negotiation' ? 'bg-gold/15 text-gold' : d.stage === 'proposal' ? 'bg-warning/15 text-warning' : d.stage === 'qualification' ? 'bg-info/15 text-info' : 'bg-chrome/15 text-chrome')}>{pipelineStages.find(s => s.id === d.stage)?.label}</span></td>
                      <td className="p-4"><div className="flex items-center gap-2"><div className="w-12 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', d.probability >= 80 ? 'bg-success' : d.probability >= 50 ? 'bg-gold' : 'bg-chrome')} style={{ width: `${d.probability}%` }} /></div><span className="text-xs font-mono">{d.probability}%</span></div></td>
                      <td className="p-4 text-sm text-foreground">{d.rep}</td>
                      <td className="p-4 text-sm text-muted-foreground">{formatDate(d.closeDate)}</td>
                      <td className="p-4 text-xs text-muted-foreground">{d.source}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {pipelineStages.map((stage, i) => {
                const stageDeals = deals.filter(d => d.stage === stage.id)
                const stageValue = stageDeals.reduce((s, d) => s + d.value, 0)
                return (
                  <motion.div key={stage.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="min-w-[260px] glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn('w-3 h-3 rounded-full', stage.color)} />
                      <h4 className="text-sm font-bold text-foreground">{stage.label}</h4>
                      <span className="text-[10px] bg-surface2 px-1.5 py-0.5 rounded text-muted-foreground">{stageDeals.length}</span>
                    </div>
                    <p className="text-lg font-mono font-bold text-gold mb-3">{formatCurrency(stageValue)}</p>
                    {stageDeals.map(d => (
                      <div key={d.id} className="p-3 rounded-xl bg-surface2/30 border border-border/20 hover:border-gold/20 transition-colors mb-2">
                        <p className="text-xs font-bold text-foreground mb-1">{d.title}</p>
                        <p className="text-[10px] text-muted-foreground">{d.contact} — {d.rep}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs font-mono text-gold">{formatCurrency(d.value)}</p>
                          <span className="text-[10px] text-muted-foreground">{d.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )
              })}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map((m, i) => {
                const pct = Math.round((m.revenue / m.target) * 100)
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-lg">{m.avatar}</div>
                      <div><h4 className="text-sm font-bold text-foreground">{m.name}</h4><p className="text-[10px] text-muted-foreground">{m.role}</p></div>
                      <div className="mr-auto text-left"><p className="text-lg font-mono font-bold text-gold">{pct}%</p><p className="text-[10px] text-muted-foreground">من الهدف</p></div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface3 mb-4"><div className={cn('h-full rounded-full transition-all', pct >= 90 ? 'bg-success' : pct >= 70 ? 'bg-gold' : 'bg-warning')} style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">صفقات</p><p className="text-sm font-bold text-foreground">{m.deals}</p></div>
                      <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">مكسوبة</p><p className="text-sm font-bold text-success">{m.won}</p></div>
                      <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">الإيرادات</p><p className="text-sm font-bold text-gold">{(m.revenue/1000000).toFixed(1)}M</p></div>
                      <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">الهدف</p><p className="text-sm font-bold text-foreground">{(m.target/1000000).toFixed(1)}M</p></div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="إجمالي الإيرادات Q1" value={formatCurrency(3370000)} icon={DollarSign} trend={42} delay={0} />
                <StatsCard title="عدد الصفقات" value="22" icon={Handshake} trend={18} delay={0.1} />
                <StatsCard title="متوسط حجم الصفقة" value={formatCurrency(1230000)} icon={Briefcase} trend={15} delay={0.2} />
                <StatsCard title="أفضل مندوب" value="أحمد محمد" icon={Award} delay={0.3} />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">مقارنة الإيرادات الشهرية</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v/1000}K`} />
                    <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="booths" fill="#C9A84C" name="أجنحة" radius={[4,4,0,0]} />
                    <Bar dataKey="sponsorships" fill="#3b82f6" name="رعايات" radius={[4,4,0,0]} />
                    <Bar dataKey="services" fill="#10b981" name="خدمات" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
