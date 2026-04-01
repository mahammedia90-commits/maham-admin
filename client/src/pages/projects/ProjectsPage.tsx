// Design: Nour Theme — Projects Module
// 4 tabs: Projects, Milestones, Resources, Budget
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban, Target, Users, DollarSign, Plus,
  Clock, CheckCircle, AlertTriangle, Calendar, TrendingUp,
  Briefcase, BarChart3
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'projects', label: 'المشاريع', icon: FolderKanban },
  { id: 'milestones', label: 'المعالم', icon: Target },
  { id: 'resources', label: 'الموارد', icon: Users },
  { id: 'budget', label: 'الميزانية', icon: DollarSign },
]

const projects = [
  { id: 'PRJ-001', name: 'معرض الرياض التقني 2026', manager: 'أحمد الراشد', status: 'active', progress: 65, budget: 2500000, spent: 1625000, startDate: '2026-01-15', endDate: '2026-06-30', team: 12, tasks: { total: 48, done: 31 } },
  { id: 'PRJ-002', name: 'معرض جدة للأغذية', manager: 'سارة العلي', status: 'planning', progress: 20, budget: 1800000, spent: 360000, startDate: '2026-03-01', endDate: '2026-09-15', team: 8, tasks: { total: 35, done: 7 } },
  { id: 'PRJ-003', name: 'مؤتمر الذكاء الاصطناعي', manager: 'خالد الحربي', status: 'active', progress: 45, budget: 3200000, spent: 1440000, startDate: '2026-02-01', endDate: '2026-08-20', team: 15, tasks: { total: 62, done: 28 } },
  { id: 'PRJ-004', name: 'معرض الطاقة المتجددة', manager: 'فاطمة أحمد', status: 'completed', progress: 100, budget: 1200000, spent: 1150000, startDate: '2025-10-01', endDate: '2026-02-28', team: 6, tasks: { total: 30, done: 30 } },
]

const milestones = [
  { id: 1, project: 'معرض الرياض التقني 2026', name: 'إتمام التعاقدات مع الرعاة', dueDate: '2026-04-15', status: 'on_track', progress: 80 },
  { id: 2, project: 'معرض الرياض التقني 2026', name: 'تجهيز القاعات', dueDate: '2026-05-01', status: 'on_track', progress: 40 },
  { id: 3, project: 'معرض جدة للأغذية', name: 'إطلاق الحملة التسويقية', dueDate: '2026-04-20', status: 'at_risk', progress: 15 },
  { id: 4, project: 'مؤتمر الذكاء الاصطناعي', name: 'تأكيد المتحدثين', dueDate: '2026-04-10', status: 'delayed', progress: 60 },
  { id: 5, project: 'مؤتمر الذكاء الاصطناعي', name: 'فتح باب التسجيل', dueDate: '2026-05-15', status: 'on_track', progress: 25 },
]

const resources = [
  { id: 1, name: 'أحمد الراشد', role: 'مدير مشروع', projects: ['PRJ-001'], utilization: 90, availability: 'مشغول' },
  { id: 2, name: 'سارة العلي', role: 'مدير مشروع', projects: ['PRJ-002'], utilization: 70, availability: 'متاح جزئياً' },
  { id: 3, name: 'خالد الحربي', role: 'مدير مشروع', projects: ['PRJ-003'], utilization: 85, availability: 'مشغول' },
  { id: 4, name: 'فاطمة أحمد', role: 'مدير مشروع', projects: ['PRJ-004'], utilization: 30, availability: 'متاح' },
  { id: 5, name: 'عبدالله السعيد', role: 'مهندس لوجستيات', projects: ['PRJ-001', 'PRJ-003'], utilization: 95, availability: 'مشغول' },
  { id: 6, name: 'نورة القحطاني', role: 'مسؤولة تسويق', projects: ['PRJ-001', 'PRJ-002'], utilization: 80, availability: 'مشغول' },
]

const budgetItems = [
  { category: 'تجهيز القاعات', allocated: 3200000, spent: 1850000, remaining: 1350000 },
  { category: 'التسويق والإعلان', allocated: 1500000, spent: 720000, remaining: 780000 },
  { category: 'اللوجستيات والنقل', allocated: 800000, spent: 450000, remaining: 350000 },
  { category: 'التقنية والأنظمة', allocated: 1200000, spent: 680000, remaining: 520000 },
  { category: 'الموارد البشرية', allocated: 2000000, spent: 875000, remaining: 1125000 },
]

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('projects')

  return (
    <AdminLayout>
      <PageHeader title="إدارة المشاريع" subtitle="تتبع المشاريع والمعالم والموارد والميزانيات" actions={
        <button onClick={() => toast.info('مشروع جديد — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> مشروع جديد</button>
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

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="مشاريع نشطة" value="3" icon={FolderKanban} delay={0} />
                <StatsCard title="مكتملة" value="1" icon={CheckCircle} delay={0.1} />
                <StatsCard title="إجمالي الميزانية" value="8.7M" icon={DollarSign} delay={0.2} />
                <StatsCard title="فرق العمل" value="41" icon={Users} delay={0.3} />
              </div>
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', p.status === 'completed' ? 'bg-success/10 text-success' : p.status === 'active' ? 'bg-gold/10 text-gold' : 'bg-info/10 text-info')}><FolderKanban size={18} /></div>
                        <div><h4 className="text-sm font-bold text-foreground">{p.name}</h4><p className="text-[10px] text-muted-foreground">{p.id} • {p.manager} • {p.team} أعضاء</p></div>
                      </div>
                      <StatusBadge status={p.status === 'completed' ? 'approved' : p.status === 'active' ? 'pending' : 'draft'} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-surface2/30"><p className="text-[10px] text-muted-foreground">الميزانية</p><p className="text-sm font-bold text-foreground">{formatCurrency(p.budget)}</p></div>
                      <div className="p-3 rounded-xl bg-surface2/30"><p className="text-[10px] text-muted-foreground">المصروف</p><p className="text-sm font-bold text-warning">{formatCurrency(p.spent)}</p></div>
                      <div className="p-3 rounded-xl bg-surface2/30"><p className="text-[10px] text-muted-foreground">المهام</p><p className="text-sm font-bold text-foreground">{p.tasks.done}/{p.tasks.total}</p></div>
                      <div className="p-3 rounded-xl bg-surface2/30"><p className="text-[10px] text-muted-foreground">الفترة</p><p className="text-[10px] font-bold text-foreground">{formatDate(p.startDate)} — {formatDate(p.endDate)}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-surface3"><div className={cn('h-full rounded-full transition-all', p.progress === 100 ? 'bg-success' : p.progress > 50 ? 'bg-gold' : 'bg-warning')} style={{ width: `${p.progress}%` }} /></div>
                      <span className="text-xs font-mono text-gold">{p.progress}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="على المسار" value="3" icon={CheckCircle} delay={0} />
                <StatsCard title="في خطر" value="1" icon={AlertTriangle} delay={0.1} />
                <StatsCard title="متأخرة" value="1" icon={Clock} delay={0.2} />
              </div>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Target size={16} className={cn(m.status === 'on_track' ? 'text-success' : m.status === 'at_risk' ? 'text-warning' : 'text-danger')} />
                        <div><p className="text-sm font-bold text-foreground">{m.name}</p><p className="text-[10px] text-muted-foreground">{m.project}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {formatDate(m.dueDate)}</span>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', m.status === 'on_track' ? 'bg-success/15 text-success' : m.status === 'at_risk' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger')}>{m.status === 'on_track' ? 'على المسار' : m.status === 'at_risk' ? 'في خطر' : 'متأخر'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', m.status === 'on_track' ? 'bg-success' : m.status === 'at_risk' ? 'bg-warning' : 'bg-danger')} style={{ width: `${m.progress}%` }} /></div>
                      <span className="text-xs font-mono text-muted-foreground">{m.progress}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="إجمالي الموارد" value="6" icon={Users} delay={0} />
                <StatsCard title="متوسط الاستغلال" value="75%" icon={TrendingUp} delay={0.1} />
                <StatsCard title="متاحون" value="2" icon={Briefcase} delay={0.2} />
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['الاسم', 'الدور', 'المشاريع', 'الاستغلال', 'التوفر'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {resources.map((r, i) => (
                      <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                        <td className="p-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs">{r.name[0]}</div><span className="text-sm font-bold text-foreground">{r.name}</span></div></td>
                        <td className="p-4 text-sm text-muted-foreground">{r.role}</td>
                        <td className="p-4 text-xs font-mono text-muted-foreground">{r.projects.join(', ')}</td>
                        <td className="p-4"><div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', r.utilization > 85 ? 'bg-danger' : r.utilization > 60 ? 'bg-gold' : 'bg-success')} style={{ width: `${r.utilization}%` }} /></div><span className="text-xs font-mono">{r.utilization}%</span></div></td>
                        <td className="p-4"><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', r.availability === 'متاح' ? 'bg-success/15 text-success' : r.availability === 'متاح جزئياً' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger')}>{r.availability}</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="إجمالي المخصص" value="8.7M" icon={DollarSign} delay={0} />
                <StatsCard title="المصروف" value="4.6M" icon={BarChart3} delay={0.1} />
                <StatsCard title="المتبقي" value="4.1M" icon={TrendingUp} delay={0.2} />
                <StatsCard title="نسبة الصرف" value="53%" icon={Target} delay={0.3} />
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['الفئة', 'المخصص', 'المصروف', 'المتبقي', 'نسبة الصرف'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {budgetItems.map((b, i) => (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                        <td className="p-4 text-sm font-bold text-foreground">{b.category}</td>
                        <td className="p-4 text-sm text-foreground font-mono">{formatCurrency(b.allocated)}</td>
                        <td className="p-4 text-sm text-warning font-mono">{formatCurrency(b.spent)}</td>
                        <td className="p-4 text-sm text-success font-mono">{formatCurrency(b.remaining)}</td>
                        <td className="p-4"><div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full bg-surface3"><div className="h-full rounded-full bg-gold" style={{ width: `${Math.round(b.spent / b.allocated * 100)}%` }} /></div><span className="text-xs font-mono">{Math.round(b.spent / b.allocated * 100)}%</span></div></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
