// Design: Nour Theme — Sales Module (Deepened)
// 5 tabs: Overview, Deals, Pipeline, Team, Reports
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, DollarSign, Target, Users, Plus,
  BarChart3, Award, Clock, CheckCircle, PieChart, Handshake, Search,
  Download, Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area, PieChart as RPieChart, Pie, Cell } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'overview', label: 'نظرة عامة', icon: PieChart },
  { id: 'deals', label: 'الصفقات', icon: Handshake },
  { id: 'pipeline', label: 'خط الأنابيب', icon: Target },
  { id: 'team', label: 'فريق المبيعات', icon: Users },
  { id: 'reports', label: 'التقارير', icon: BarChart3 },
]

const salesData = [
  { month: 'يناير', booths: 420000, sponsorships: 280000, services: 140000, total: 840000 },
  { month: 'فبراير', booths: 550000, sponsorships: 350000, services: 185000, total: 1085000 },
  { month: 'مارس', booths: 720000, sponsorships: 480000, services: 245000, total: 1445000 },
  { month: 'أبريل', booths: 680000, sponsorships: 420000, services: 210000, total: 1310000 },
  { month: 'مايو', booths: 890000, sponsorships: 560000, services: 290000, total: 1740000 },
  { month: 'يونيو', booths: 950000, sponsorships: 620000, services: 320000, total: 1890000 },
]

const conversionData = [
  { month: 'يناير', leads: 85, qualified: 52, proposals: 34, won: 18 },
  { month: 'فبراير', leads: 92, qualified: 58, proposals: 40, won: 22 },
  { month: 'مارس', leads: 110, qualified: 72, proposals: 48, won: 28 },
  { month: 'أبريل', leads: 98, qualified: 65, proposals: 42, won: 25 },
  { month: 'مايو', leads: 125, qualified: 82, proposals: 55, won: 32 },
  { month: 'يونيو', leads: 135, qualified: 90, proposals: 62, won: 38 },
]

const dealsBySource = [
  { name: 'إحالات', value: 35, color: '#C9A84C' },
  { name: 'الموقع', value: 25, color: '#3b82f6' },
  { name: 'معارض سابقة', value: 20, color: '#22c55e' },
  { name: 'سوشيال', value: 12, color: '#f59e0b' },
  { name: 'بريد', value: 8, color: '#8b5cf6' },
]

const deals = [
  { id: 'DEAL-001', title: 'رعاية بلاتينية — أرامكو', contact: 'عبدالله الشمري', company: 'أرامكو', value: 1500000, stage: 'won', probability: 100, rep: 'أحمد محمد', closeDate: '2026-03-15', source: 'إحالة', lastActivity: 'تم توقيع العقد' },
  { id: 'DEAL-002', title: 'استثمار 5 أجنحة — الراشد', contact: 'أحمد الراشد', company: 'مجموعة الراشد', value: 2500000, stage: 'negotiation', probability: 75, rep: 'سارة العلي', closeDate: '2026-04-10', source: 'موقع', lastActivity: 'اجتماع تفاوض' },
  { id: 'DEAL-003', title: 'حزمة ذهبية — STC', contact: 'خالد العتيبي', company: 'STC', value: 500000, stage: 'proposal', probability: 60, rep: 'خالد الحربي', closeDate: '2026-04-20', source: 'معرض سابق', lastActivity: 'إرسال العرض' },
  { id: 'DEAL-004', title: '10 أجنحة — نيوم', contact: 'نورة القحطاني', company: 'نيوم', value: 3200000, stage: 'qualification', probability: 40, rep: 'فاطمة أحمد', closeDate: '2026-05-01', source: 'سوشيال', lastActivity: 'مكالمة تأهيل' },
  { id: 'DEAL-005', title: '3 أجنحة — الفطيم', contact: 'فهد الدوسري', company: 'مجموعة الفطيم', value: 450000, stage: 'lead', probability: 20, rep: 'أحمد محمد', closeDate: '2026-05-15', source: 'بريد', lastActivity: 'استفسار أولي' },
  { id: 'DEAL-006', title: 'رعاية فضية — المراعي', contact: 'ريم الحربي', company: 'المراعي', value: 250000, stage: 'proposal', probability: 55, rep: 'سارة العلي', closeDate: '2026-04-25', source: 'إحالة', lastActivity: 'مراجعة العرض' },
  { id: 'DEAL-007', title: 'خدمات لوجستية — DHL', contact: 'محمد العنزي', company: 'DHL', value: 180000, stage: 'negotiation', probability: 70, rep: 'خالد الحربي', closeDate: '2026-04-15', source: 'موقع', lastActivity: 'تعديل الشروط' },
  { id: 'DEAL-008', title: 'رعاية برونزية — زين', contact: 'سلمان الغامدي', company: 'زين', value: 150000, stage: 'won', probability: 100, rep: 'فاطمة أحمد', closeDate: '2026-03-20', source: 'إحالة', lastActivity: 'تم الدفع' },
  { id: 'DEAL-009', title: '8 أجنحة — سابك', contact: 'عمر المطيري', company: 'سابك', value: 1800000, stage: 'proposal', probability: 50, rep: 'أحمد محمد', closeDate: '2026-05-10', source: 'معرض سابق', lastActivity: 'تقديم العرض' },
  { id: 'DEAL-010', title: 'حزمة VIP — البنك الأهلي', contact: 'هند السبيعي', company: 'البنك الأهلي', value: 750000, stage: 'negotiation', probability: 65, rep: 'سارة العلي', closeDate: '2026-04-30', source: 'موقع', lastActivity: 'مناقشة التفاصيل' },
]

const pipelineStages = [
  { id: 'lead', label: 'عميل محتمل', color: 'bg-chrome/50', textColor: 'text-chrome' },
  { id: 'qualification', label: 'تأهيل', color: 'bg-info', textColor: 'text-info' },
  { id: 'proposal', label: 'عرض سعر', color: 'bg-warning', textColor: 'text-warning' },
  { id: 'negotiation', label: 'تفاوض', color: 'bg-gold', textColor: 'text-gold' },
  { id: 'won', label: 'مكسوبة', color: 'bg-success', textColor: 'text-success' },
]

const teamMembers = [
  { id: 1, name: 'أحمد محمد', role: 'مدير مبيعات', deals: 15, won: 10, revenue: 5200000, target: 6000000, avatar: 'أ', calls: 145, meetings: 32, emails: 280 },
  { id: 2, name: 'سارة العلي', role: 'أخصائي مبيعات', deals: 11, won: 7, revenue: 3800000, target: 4000000, avatar: 'س', calls: 120, meetings: 28, emails: 210 },
  { id: 3, name: 'خالد الحربي', role: 'أخصائي مبيعات', deals: 9, won: 6, revenue: 3100000, target: 3500000, avatar: 'خ', calls: 98, meetings: 22, emails: 175 },
  { id: 4, name: 'فاطمة أحمد', role: 'مندوب مبيعات', deals: 7, won: 4, revenue: 2100000, target: 2500000, avatar: 'ف', calls: 85, meetings: 18, emails: 150 },
]

const monthlyTargets = [
  { month: 'يناير', actual: 840000, target: 900000 },
  { month: 'فبراير', actual: 1085000, target: 1000000 },
  { month: 'مارس', actual: 1445000, target: 1200000 },
  { month: 'أبريل', actual: 1310000, target: 1300000 },
  { month: 'مايو', actual: 1740000, target: 1500000 },
  { month: 'يونيو', actual: 1890000, target: 1700000 },
]

const topClients = [
  { name: 'نيوم', value: 3200000, deals: 2 },
  { name: 'أرامكو', value: 1500000, deals: 1 },
  { name: 'سابك', value: 1800000, deals: 1 },
  { name: 'البنك الأهلي', value: 750000, deals: 1 },
  { name: 'STC', value: 500000, deals: 1 },
]

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const totalPipeline = deals.reduce((s, d) => s + d.value, 0)
  const wonValue = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0)
  const activeDeals = deals.filter(d => d.stage !== 'won').length
  const avgDealSize = Math.round(totalPipeline / deals.length)

  const filteredDeals = deals.filter(d => {
    const matchSearch = d.title.includes(searchTerm) || d.company.includes(searchTerm) || d.contact.includes(searchTerm)
    const matchStage = stageFilter === 'all' || d.stage === stageFilter
    return matchSearch && matchStage
  })

  return (
    <AdminLayout>
      <PageHeader title="المبيعات" subtitle="إدارة الصفقات وخط الأنابيب وفريق المبيعات" actions={
        <div className="flex gap-2">
          <button onClick={() => toast.success('جاري تصدير تقرير المبيعات')} className="h-9 px-4 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"><Download size={14} /> تصدير</button>
          <button onClick={() => toast.info('صفقة جديدة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> صفقة جديدة</button>
        </div>
      } />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي خط الأنابيب" value={formatCurrency(totalPipeline)} icon={DollarSign} trend={32} trendLabel="نمو" delay={0} />
        <StatsCard title="صفقات مكسوبة" value={formatCurrency(wonValue)} icon={CheckCircle} trend={28} trendLabel="زيادة" delay={0.1} />
        <StatsCard title="صفقات نشطة" value={activeDeals} icon={Activity} trend={15} trendLabel="جديدة" delay={0.2} />
        <StatsCard title="متوسط حجم الصفقة" value={formatCurrency(avgDealSize)} icon={Target} trend={12} trendLabel="نمو" delay={0.3} />
      </div>

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">الإيرادات حسب المصدر — 6 أشهر</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="booths" fill="#C9A84C" name="أجنحة" radius={[4,4,0,0]} />
                      <Bar dataKey="sponsorships" fill="#3b82f6" name="رعايات" radius={[4,4,0,0]} />
                      <Bar dataKey="services" fill="#10b981" name="خدمات" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">مسار التحويل — Funnel</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area type="monotone" dataKey="leads" stroke="#94a3b8" fill="rgba(148,163,184,0.1)" name="عملاء محتملون" />
                      <Area type="monotone" dataKey="qualified" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" name="مؤهلون" />
                      <Area type="monotone" dataKey="proposals" stroke="#C9A84C" fill="rgba(201,168,76,0.1)" name="عروض" />
                      <Area type="monotone" dataKey="won" stroke="#22c55e" fill="rgba(34,197,94,0.1)" name="مكسوبة" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">مصادر الصفقات</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RPieChart>
                      <Pie data={dealsBySource} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {dealsBySource.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">أكبر العملاء</h3>
                  <div className="space-y-3">
                    {topClients.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface2/30">
                        <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">{i + 1}</span>
                        <div className="flex-1"><p className="text-sm font-bold text-foreground">{c.name}</p><p className="text-[10px] text-muted-foreground">{c.deals} صفقة</p></div>
                        <p className="text-sm font-mono font-bold text-gold">{formatCurrency(c.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="text" placeholder="بحث بالصفقة أو الشركة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50" />
                </div>
                <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm text-foreground">
                  <option value="all">جميع المراحل</option>
                  {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-border/50 bg-surface2/20">
                      {['الصفقة','الشركة','القيمة','المرحلة','الاحتمالية','المندوب','الإغلاق','المصدر','آخر نشاط'].map(h => (
                        <th key={h} className="text-right p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredDeals.map((d, i) => (
                        <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/20 hover:bg-surface2/30 transition-colors">
                          <td className="p-3"><div><p className="text-sm font-bold text-foreground">{d.title}</p><p className="text-[10px] font-mono text-muted-foreground">{d.id}</p></div></td>
                          <td className="p-3 text-sm text-foreground">{d.company}</td>
                          <td className="p-3 text-sm font-mono font-bold text-gold">{formatCurrency(d.value)}</td>
                          <td className="p-3"><span className={cn('text-xs px-2 py-0.5 rounded-full font-bold', d.stage === 'won' ? 'bg-success/15 text-success' : d.stage === 'negotiation' ? 'bg-gold/15 text-gold' : d.stage === 'proposal' ? 'bg-warning/15 text-warning' : d.stage === 'qualification' ? 'bg-info/15 text-info' : 'bg-chrome/15 text-chrome')}>{pipelineStages.find(s => s.id === d.stage)?.label}</span></td>
                          <td className="p-3"><div className="flex items-center gap-2"><div className="w-14 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', d.probability >= 80 ? 'bg-success' : d.probability >= 50 ? 'bg-gold' : 'bg-chrome')} style={{ width: `${d.probability}%` }} /></div><span className="text-xs font-mono">{d.probability}%</span></div></td>
                          <td className="p-3 text-sm text-foreground">{d.rep}</td>
                          <td className="p-3 text-xs text-muted-foreground">{d.closeDate}</td>
                          <td className="p-3 text-xs text-muted-foreground">{d.source}</td>
                          <td className="p-3 text-xs text-muted-foreground">{d.lastActivity}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-3">
                {pipelineStages.map((stage) => {
                  const stageDeals = deals.filter(d => d.stage === stage.id)
                  const stageValue = stageDeals.reduce((s, d) => s + d.value, 0)
                  return (
                    <div key={stage.id} className="glass-card p-3 text-center">
                      <span className={cn('w-3 h-3 rounded-full inline-block mb-1', stage.color)} />
                      <p className="text-xs font-bold text-foreground">{stage.label}</p>
                      <p className="text-lg font-mono font-bold text-gold">{stageDeals.length}</p>
                      <p className="text-[10px] text-muted-foreground">{formatCurrency(stageValue)}</p>
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4">
                {pipelineStages.map((stage, i) => {
                  const stageDeals = deals.filter(d => d.stage === stage.id)
                  const stageValue = stageDeals.reduce((s, d) => s + d.value, 0)
                  return (
                    <motion.div key={stage.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="min-w-[280px] glass-card p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn('w-3 h-3 rounded-full', stage.color)} />
                        <h4 className="text-sm font-bold text-foreground">{stage.label}</h4>
                        <span className="text-[10px] bg-surface2 px-1.5 py-0.5 rounded text-muted-foreground">{stageDeals.length}</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-gold mb-3">{formatCurrency(stageValue)}</p>
                      {stageDeals.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">لا توجد صفقات</p>}
                      {stageDeals.map(d => (
                        <div key={d.id} className="p-3 rounded-xl bg-surface2/30 border border-border/20 hover:border-gold/20 transition-colors mb-2">
                          <p className="text-xs font-bold text-foreground mb-1">{d.title}</p>
                          <p className="text-[10px] text-muted-foreground">{d.company} — {d.rep}</p>
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
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
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
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">صفقات</p><p className="text-sm font-bold text-foreground">{m.deals}</p></div>
                        <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">مكسوبة</p><p className="text-sm font-bold text-success">{m.won}</p></div>
                        <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">الإيرادات</p><p className="text-sm font-bold text-gold">{(m.revenue/1000000).toFixed(1)}M</p></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">مكالمات</p><p className="text-sm font-bold text-foreground">{m.calls}</p></div>
                        <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">اجتماعات</p><p className="text-sm font-bold text-foreground">{m.meetings}</p></div>
                        <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">إيميلات</p><p className="text-sm font-bold text-foreground">{m.emails}</p></div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="إجمالي الإيرادات H1" value={formatCurrency(salesData.reduce((s, d) => s + d.total, 0))} icon={DollarSign} trend={42} trendLabel="نمو" delay={0} />
                <StatsCard title="عدد الصفقات" value={deals.length} icon={Handshake} trend={18} trendLabel="زيادة" delay={0.1} />
                <StatsCard title="معدل الإغلاق" value="67%" icon={Target} trend={8} trendLabel="تحسن" delay={0.2} />
                <StatsCard title="أفضل مندوب" value="أحمد محمد" icon={Award} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">الفعلي vs الهدف — شهري</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthlyTargets}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="actual" fill="#C9A84C" name="الفعلي" radius={[4,4,0,0]} />
                      <Bar dataKey="target" fill="rgba(201,168,76,0.25)" name="الهدف" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">نمو الإيرادات الشهري</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} />
                      <Line type="monotone" dataKey="total" stroke="#C9A84C" strokeWidth={3} dot={{ fill: '#C9A84C', r: 5 }} name="الإجمالي" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
