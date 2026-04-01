// Design: Nour Theme — CRM Module
// 6 tabs: Overview, Contacts, Deals, Pipeline, Activities, Reports
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UserPlus, Handshake, TrendingUp, Phone, Mail,
  Calendar, Search, Eye, Edit, Target, Clock, CheckCircle,
  MessageSquare, Star, BarChart3, PieChart, Activity, Plus,
  DollarSign, Building2, ArrowUpRight, Filter, UserCheck
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
  { id: 'contacts', label: 'جهات الاتصال', icon: Users },
  { id: 'deals', label: 'الصفقات', icon: Handshake },
  { id: 'pipeline', label: 'خط الأنابيب', icon: Target },
  { id: 'activities', label: 'الأنشطة', icon: Activity },
  { id: 'reports', label: 'التقارير', icon: BarChart3 },
]

const contacts = [
  { id: 1, name: 'أحمد الراشد', company: 'شركة الرياض للاستثمار', role: 'مستثمر', email: 'ahmed@riyadhinvest.sa', phone: '+966 55 123 4567', status: 'active', score: 95, lastContact: '2026-03-28', deals: 3 },
  { id: 2, name: 'سارة المطيري', company: 'مؤسسة النخبة التجارية', role: 'تاجر', email: 'sara@elite.sa', phone: '+966 55 234 5678', status: 'active', score: 82, lastContact: '2026-03-25', deals: 2 },
  { id: 3, name: 'خالد العتيبي', company: 'شركة STC', role: 'راعي', email: 'khalid@stc.sa', phone: '+966 55 345 6789', status: 'active', score: 98, lastContact: '2026-03-29', deals: 1 },
  { id: 4, name: 'فهد الدوسري', company: 'مجموعة الفطيم', role: 'مستثمر', email: 'fahd@futtaim.ae', phone: '+966 55 456 7890', status: 'lead', score: 75, lastContact: '2026-03-20', deals: 0 },
  { id: 5, name: 'نورة القحطاني', company: 'شركة نيوم', role: 'مستثمر', email: 'noura@neom.sa', phone: '+966 55 567 8901', status: 'active', score: 92, lastContact: '2026-03-27', deals: 2 },
  { id: 6, name: 'عبدالله الشمري', company: 'شركة أرامكو', role: 'راعي', email: 'abdullah@aramco.sa', phone: '+966 55 678 9012', status: 'active', score: 99, lastContact: '2026-03-30', deals: 4 },
  { id: 7, name: 'ريم الحربي', company: 'شركة الأغذية المتحدة', role: 'تاجر', email: 'reem@unitedfood.sa', phone: '+966 55 789 0123', status: 'active', score: 78, lastContact: '2026-03-22', deals: 1 },
  { id: 8, name: 'محمد العنزي', company: 'شركة البناء الحديث', role: 'مستثمر', email: 'mohammed@modern.sa', phone: '+966 55 890 1234', status: 'lead', score: 65, lastContact: '2026-03-18', deals: 0 },
]

const deals = [
  { id: 'DEAL-001', title: 'رعاية بلاتينية — معرض الرياض التقني', contact: 'عبدالله الشمري', value: 1500000, stage: 'won', probability: 100, closeDate: '2026-03-15' },
  { id: 'DEAL-002', title: 'استثمار 5 أجنحة — معرض الرياض التقني', contact: 'أحمد الراشد', value: 2500000, stage: 'negotiation', probability: 75, closeDate: '2026-04-10' },
  { id: 'DEAL-003', title: 'حزمة رعاية ذهبية — معرض جدة', contact: 'خالد العتيبي', value: 500000, stage: 'proposal', probability: 60, closeDate: '2026-04-20' },
  { id: 'DEAL-004', title: 'حجز 10 أجنحة — معرض الدمام', contact: 'نورة القحطاني', value: 3200000, stage: 'qualification', probability: 40, closeDate: '2026-05-01' },
  { id: 'DEAL-005', title: 'حجز 3 أجنحة — معرض الرياض', contact: 'فهد الدوسري', value: 450000, stage: 'lead', probability: 20, closeDate: '2026-05-15' },
  { id: 'DEAL-006', title: 'رعاية فضية — معرض المدينة', contact: 'ريم الحربي', value: 250000, stage: 'proposal', probability: 55, closeDate: '2026-04-25' },
]

const pipelineStages = [
  { id: 'lead', label: 'عميل محتمل', color: 'bg-chrome/50', count: 1, value: 450000 },
  { id: 'qualification', label: 'تأهيل', color: 'bg-info', count: 1, value: 3200000 },
  { id: 'proposal', label: 'عرض سعر', color: 'bg-warning', count: 2, value: 750000 },
  { id: 'negotiation', label: 'تفاوض', color: 'bg-gold', count: 1, value: 2500000 },
  { id: 'won', label: 'مكسوبة', color: 'bg-success', count: 1, value: 1500000 },
]

const activities = [
  { id: 1, type: 'call', contact: 'أحمد الراشد', desc: 'مكالمة متابعة — مناقشة شروط العقد', date: '2026-03-30 10:30', status: 'completed' },
  { id: 2, type: 'email', contact: 'خالد العتيبي', desc: 'إرسال عرض الرعاية الذهبية المحدث', date: '2026-03-30 14:00', status: 'completed' },
  { id: 3, type: 'meeting', contact: 'نورة القحطاني', desc: 'اجتماع تقديمي — عرض فرص الاستثمار', date: '2026-03-31 09:00', status: 'scheduled' },
  { id: 4, type: 'call', contact: 'فهد الدوسري', desc: 'مكالمة تعريفية — تقديم المنصة', date: '2026-03-31 11:30', status: 'scheduled' },
  { id: 5, type: 'email', contact: 'عبدالله الشمري', desc: 'إرسال تقرير ROI الربع الأول', date: '2026-04-01 08:00', status: 'scheduled' },
  { id: 6, type: 'meeting', contact: 'ريم الحربي', desc: 'عرض تقديمي لخدمات المعرض', date: '2026-04-01 14:00', status: 'scheduled' },
  { id: 7, type: 'call', contact: 'محمد العنزي', desc: 'متابعة بعد العرض التقديمي', date: '2026-04-02 10:00', status: 'scheduled' },
]

const conversionData = [
  { month: 'يناير', leads: 45, qualified: 28, proposals: 18, won: 8 },
  { month: 'فبراير', leads: 52, qualified: 35, proposals: 22, won: 12 },
  { month: 'مارس', leads: 68, qualified: 42, proposals: 28, won: 15 },
]

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts.filter(c => c.name.includes(searchTerm) || c.company.includes(searchTerm))
  const totalPipelineValue = deals.reduce((s, d) => s + d.value, 0)
  const wonValue = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0)

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة علاقات العملاء — CRM"
        subtitle="إدارة جهات الاتصال والصفقات وخط الأنابيب والأنشطة"
        actions={
          <button onClick={() => toast.info('إضافة جهة اتصال — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <UserPlus size={16} /> جهة اتصال جديدة
          </button>
        }
      />

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
                <StatsCard title="إجمالي جهات الاتصال" value="268" icon={Users} trend={12} delay={0} />
                <StatsCard title="صفقات نشطة" value="6" icon={Handshake} trend={25} delay={0.1} />
                <StatsCard title="قيمة خط الأنابيب" value={formatCurrency(totalPipelineValue)} icon={DollarSign} trend={18} delay={0.2} />
                <StatsCard title="معدل التحويل" value="22%" icon={Target} trend={5} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">قمع التحويل — Q1 2026</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Bar dataKey="leads" fill="#A0A0A0" name="عملاء محتملون" radius={[4,4,0,0]} />
                      <Bar dataKey="qualified" fill="#3b82f6" name="مؤهلون" radius={[4,4,0,0]} />
                      <Bar dataKey="proposals" fill="#f59e0b" name="عروض" radius={[4,4,0,0]} />
                      <Bar dataKey="won" fill="#C9A84C" name="مكسوبة" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">أحدث الأنشطة</h3>
                  <div className="space-y-3">
                    {activities.slice(0, 5).map(act => (
                      <div key={act.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface2/30">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', act.type === 'call' ? 'bg-success/10 text-success' : act.type === 'email' ? 'bg-info/10 text-info' : 'bg-gold/10 text-gold')}>
                          {act.type === 'call' ? <Phone size={14} /> : act.type === 'email' ? <Mail size={14} /> : <Calendar size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{act.desc}</p>
                          <p className="text-[10px] text-muted-foreground">{act.contact} — {act.date}</p>
                        </div>
                        <StatusBadge status={act.status === 'completed' ? 'approved' : 'pending'} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">أعلى جهات الاتصال تقييماً</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {contacts.filter(c => c.score >= 90).map(c => (
                    <div key={c.id} className="p-4 rounded-xl bg-surface2/30 border border-border/30 hover:border-gold/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">{c.name.charAt(0)}</div>
                        <div><p className="text-sm font-bold text-foreground">{c.name}</p><p className="text-[10px] text-muted-foreground">{c.company}</p></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', c.role === 'مستثمر' ? 'bg-gold/10 text-gold' : c.role === 'تاجر' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning')}>{c.role}</span>
                        <span className="text-sm font-bold text-gold">{c.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input type="text" placeholder="بحث بالاسم أو الشركة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50" />
                </div>
                <button className="h-10 px-3 rounded-xl bg-surface2 border border-border/50 text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"><Filter size={14} /> فلترة</button>
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['الاسم','الشركة','الدور','التقييم','آخر تواصل','الصفقات','الحالة','إجراءات'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filteredContacts.map((c, i) => (
                      <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                        <td className="p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">{c.name.charAt(0)}</div><div><p className="text-sm font-bold text-foreground">{c.name}</p><p className="text-[10px] text-muted-foreground">{c.email}</p></div></div></td>
                        <td className="p-4 text-sm text-foreground">{c.company}</td>
                        <td className="p-4"><span className={cn('text-xs px-2 py-0.5 rounded-full', c.role === 'مستثمر' ? 'bg-gold/10 text-gold' : c.role === 'تاجر' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning')}>{c.role}</span></td>
                        <td className="p-4"><div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', c.score >= 90 ? 'bg-gold' : c.score >= 70 ? 'bg-info' : 'bg-chrome')} style={{ width: `${c.score}%` }} /></div><span className="text-xs font-mono font-bold">{c.score}</span></div></td>
                        <td className="p-4 text-sm text-muted-foreground">{formatDate(c.lastContact)}</td>
                        <td className="p-4 text-sm text-foreground font-bold">{c.deals}</td>
                        <td className="p-4"><StatusBadge status={c.status === 'active' ? 'approved' : 'pending'} /></td>
                        <td className="p-4"><div className="flex gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold"><Eye size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info"><Phone size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-success"><Mail size={14} /></button>
                        </div></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="قيمة الصفقات" value={formatCurrency(totalPipelineValue)} icon={DollarSign} delay={0} />
                <StatsCard title="مكسوبة" value={formatCurrency(wonValue)} icon={CheckCircle} trend={100} delay={0.1} />
                <StatsCard title="متوسط الاحتمالية" value="59%" icon={Target} delay={0.2} />
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['الصفقة','جهة الاتصال','القيمة','المرحلة','الاحتمالية','تاريخ الإغلاق'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {deals.map((d, i) => (
                      <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                        <td className="p-4"><div><p className="text-sm font-bold text-foreground">{d.title}</p><p className="text-[10px] font-mono text-muted-foreground">{d.id}</p></div></td>
                        <td className="p-4 text-sm text-foreground">{d.contact}</td>
                        <td className="p-4 text-sm font-mono font-bold text-gold">{formatCurrency(d.value)}</td>
                        <td className="p-4"><span className={cn('text-xs px-2 py-0.5 rounded-full font-bold', d.stage === 'won' ? 'bg-success/15 text-success' : d.stage === 'negotiation' ? 'bg-gold/15 text-gold' : d.stage === 'proposal' ? 'bg-warning/15 text-warning' : 'bg-chrome/15 text-chrome')}>{pipelineStages.find(s => s.id === d.stage)?.label}</span></td>
                        <td className="p-4"><div className="flex items-center gap-2"><div className="w-12 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', d.probability >= 80 ? 'bg-success' : d.probability >= 50 ? 'bg-gold' : 'bg-chrome')} style={{ width: `${d.probability}%` }} /></div><span className="text-xs font-mono">{d.probability}%</span></div></td>
                        <td className="p-4 text-sm text-muted-foreground">{formatDate(d.closeDate)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatsCard title="إجمالي خط الأنابيب" value={formatCurrency(totalPipelineValue)} icon={DollarSign} delay={0} />
                <StatsCard title="صفقات نشطة" value="6" icon={Handshake} delay={0.1} />
                <StatsCard title="معدل الإغلاق" value="17%" icon={Target} delay={0.2} />
                <StatsCard title="متوسط دورة البيع" value="18 يوم" icon={Clock} delay={0.3} />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4">
                {pipelineStages.map((stage, i) => (
                  <motion.div key={stage.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="min-w-[240px] glass-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn('w-3 h-3 rounded-full', stage.color)} />
                      <h4 className="text-sm font-bold text-foreground">{stage.label}</h4>
                      <span className="text-[10px] bg-surface2 px-1.5 py-0.5 rounded text-muted-foreground">{stage.count}</span>
                    </div>
                    <p className="text-lg font-mono font-bold text-gold mb-3">{formatCurrency(stage.value)}</p>
                    {deals.filter(d => d.stage === stage.id).map(d => (
                      <div key={d.id} className="p-3 rounded-xl bg-surface2/30 border border-border/20 hover:border-gold/20 transition-colors mb-2">
                        <p className="text-xs font-bold text-foreground mb-1">{d.title}</p>
                        <p className="text-[10px] text-muted-foreground">{d.contact}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs font-mono text-gold">{formatCurrency(d.value)}</p>
                          <span className="text-[10px] text-muted-foreground">{d.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => toast.info('إضافة نشاط — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
                  <Plus size={16} /> نشاط جديد
                </button>
              </div>
              {activities.map((act, i) => (
                <motion.div key={act.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', act.type === 'call' ? 'bg-success/10 text-success border border-success/20' : act.type === 'email' ? 'bg-info/10 text-info border border-info/20' : 'bg-gold/10 text-gold border border-gold/20')}>
                      {act.type === 'call' ? <Phone size={18} /> : act.type === 'email' ? <Mail size={18} /> : <Calendar size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{act.desc}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{act.contact}</span>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{act.date}</span>
                      </div>
                    </div>
                    <StatusBadge status={act.status === 'completed' ? 'approved' : 'pending'} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="معدل التحويل" value="22%" icon={Target} trend={5} delay={0} />
                <StatsCard title="متوسط دورة البيع" value="18 يوم" icon={Clock} trend={-3} delay={0.1} />
                <StatsCard title="قيمة الصفقة المتوسطة" value={formatCurrency(1400000)} icon={DollarSign} trend={12} delay={0.2} />
                <StatsCard title="رضا العملاء" value="4.6/5" icon={Star} trend={8} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">قمع المبيعات — Q1 2026</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Bar dataKey="leads" fill="#A0A0A0" name="عملاء محتملون" radius={[4,4,0,0]} />
                      <Bar dataKey="qualified" fill="#3b82f6" name="مؤهلون" radius={[4,4,0,0]} />
                      <Bar dataKey="proposals" fill="#f59e0b" name="عروض" radius={[4,4,0,0]} />
                      <Bar dataKey="won" fill="#C9A84C" name="مكسوبة" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">مصادر العملاء</h3>
                  <div className="space-y-3">
                    {[
                      { source: 'الموقع الإلكتروني', count: 85, pct: 32, color: 'bg-gold' },
                      { source: 'الإحالات', count: 62, pct: 23, color: 'bg-info' },
                      { source: 'المعارض السابقة', count: 55, pct: 21, color: 'bg-success' },
                      { source: 'وسائل التواصل', count: 38, pct: 14, color: 'bg-warning' },
                      { source: 'اتصال مباشر', count: 28, pct: 10, color: 'bg-chrome' },
                    ].map(s => (
                      <div key={s.source} className="flex items-center gap-3">
                        <span className={cn('w-2 h-2 rounded-full', s.color)} />
                        <span className="text-sm text-foreground flex-1">{s.source}</span>
                        <span className="text-xs font-mono text-muted-foreground">{s.count}</span>
                        <div className="w-20 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', s.color)} style={{ width: `${s.pct}%` }} /></div>
                        <span className="text-xs font-mono text-gold w-8 text-left">{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
