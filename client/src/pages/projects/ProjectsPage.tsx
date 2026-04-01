/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — إدارة المشاريع (Projects Management)
 * Features: مشاريع، مراحل، تتبع تقدم، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban, Plus, Eye, Trash2, AlertTriangle, Search,
  Calendar, Users, TrendingUp, Clock, CheckCircle, X,
  Target, Layers, MapPin, DollarSign, BarChart3
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface Project {
  id: number; name: string; description: string; status: string; progress: number
  budget: number; spent: number; startDate: string; endDate: string
  manager: string; team: number; location: string; category: string
  milestones: { name: string; done: boolean }[]
}

const demoProjects: Project[] = [
  { id: 1, name: 'معرض الرياض الدولي 2026', description: 'المعرض الرئيسي لـ Maham Expo — 500+ عارض', status: 'active', progress: 65, budget: 5000000, spent: 3250000, startDate: '2026-01-15', endDate: '2026-06-30', manager: 'نور كرم', team: 25, location: 'الرياض — مركز المعارض', category: 'معارض',
    milestones: [{ name: 'تأمين الموقع', done: true }, { name: 'عقود الرعاة', done: true }, { name: 'تسويق وحملات', done: true }, { name: 'تجهيز الأجنحة', done: false }, { name: 'الافتتاح', done: false }] },
  { id: 2, name: 'بوليفارد وورلد — موسم الرياض', description: 'تشغيل وتأجير مساحات تجارية — Retail & F&B', status: 'active', progress: 45, budget: 8000000, spent: 3600000, startDate: '2026-02-01', endDate: '2026-12-31', manager: 'نور كرم', team: 40, location: 'بوليفارد وورلد — الرياض', category: 'تشغيل',
    milestones: [{ name: 'توقيع العقود', done: true }, { name: 'تجهيز المواقع', done: true }, { name: 'إطلاق التسويق', done: false }, { name: 'بدء التشغيل', done: false }] },
  { id: 3, name: 'منصة Maham AI', description: 'منصة ذكاء اصطناعي تنفيذية — ERP + CRM + AI Brain', status: 'active', progress: 30, budget: 3000000, spent: 900000, startDate: '2026-01-01', endDate: '2027-06-30', manager: 'عمر الزهراني', team: 12, location: 'الرياض — المقر الرئيسي', category: 'تقنية',
    milestones: [{ name: 'تصميم البنية', done: true }, { name: 'تطوير النواة', done: false }, { name: 'اختبار بيتا', done: false }, { name: 'إطلاق رسمي', done: false }] },
  { id: 4, name: 'معرض جدة للأغذية', description: 'معرض متخصص في الأغذية والمشروبات — 200 عارض', status: 'planning', progress: 15, budget: 2500000, spent: 375000, startDate: '2026-07-01', endDate: '2026-09-30', manager: 'سارة العلي', team: 15, location: 'جدة — مركز المؤتمرات', category: 'معارض',
    milestones: [{ name: 'دراسة الجدوى', done: true }, { name: 'تأمين الموقع', done: false }, { name: 'استقطاب العارضين', done: false }] },
  { id: 5, name: 'نادي Taurus Gym', description: 'إدارة وتشغيل النادي الرياضي', status: 'active', progress: 80, budget: 1500000, spent: 1200000, startDate: '2025-06-01', endDate: '2026-05-31', manager: 'خالد الحربي', team: 8, location: 'الرياض — حي النخيل', category: 'رياضة',
    milestones: [{ name: 'تجهيز المرافق', done: true }, { name: 'توظيف المدربين', done: true }, { name: 'إطلاق العضويات', done: true }, { name: 'توسعة المرافق', done: false }] },
  { id: 6, name: 'On His Steps — مشروع اجتماعي', description: 'مبادرة مجتمعية للشباب', status: 'completed', progress: 100, budget: 500000, spent: 480000, startDate: '2025-01-01', endDate: '2025-12-31', manager: 'ريم الغامدي', team: 6, location: 'الرياض', category: 'اجتماعي',
    milestones: [{ name: 'التخطيط', done: true }, { name: 'التنفيذ', done: true }, { name: 'التقييم', done: true }] },
]

const statusLabels: Record<string, string> = { active: 'نشط', planning: 'تخطيط', completed: 'مكتمل', paused: 'متوقف' }
const statusColors: Record<string, string> = { active: 'bg-success/10 text-success', planning: 'bg-gold/10 text-gold', completed: 'bg-info/10 text-info', paused: 'bg-warning/10 text-warning' }

export default function ProjectsPage() {
  const [projects, setProjects] = useState(demoProjects)
  const [search, setSearch] = useState('')
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newProject, setNewProject] = useState({ name: '', description: '', category: 'معارض', budget: '', manager: '', location: '' })

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    totalBudget: projects.reduce((s, p) => s + p.budget, 0),
    totalSpent: projects.reduce((s, p) => s + p.spent, 0),
  }), [projects])

  const filtered = useMemo(() => {
    if (!search) return projects
    const s = search.toLowerCase()
    return projects.filter(p => p.name.includes(s) || p.category.includes(s) || p.manager.includes(s))
  }, [projects, search])

  const handleAdd = () => {
    if (!newProject.name) { toast.error('يرجى إدخال اسم المشروع'); return }
    const p: Project = {
      id: Math.max(...projects.map(p => p.id)) + 1, name: newProject.name, description: newProject.description,
      status: 'planning', progress: 0, budget: parseFloat(newProject.budget) || 0, spent: 0,
      startDate: new Date().toISOString().split('T')[0], endDate: '2027-12-31',
      manager: newProject.manager || 'غير محدد', team: 0, location: newProject.location || 'الرياض',
      category: newProject.category, milestones: [{ name: 'التخطيط', done: false }],
    }
    setProjects(prev => [p, ...prev])
    toast.success(`تم إنشاء المشروع: ${p.name}`)
    setShowAddModal(false)
    setNewProject({ name: '', description: '', category: 'معارض', budget: '', manager: '', location: '' })
  }

  const handleDelete = (id: number) => {
    const p = projects.find(p => p.id === id)
    setProjects(prev => prev.filter(p => p.id !== id))
    toast.success(`تم حذف المشروع: ${p?.name}`)
    setDeleteConfirm(null)
  }

  return (
    <AdminLayout>
      <PageHeader title="إدارة المشاريع" subtitle={`${stats.total} مشروع — ${stats.active} نشط — الميزانية: ${formatCurrency(stats.totalBudget)}`}
        actions={<button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> مشروع جديد</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="المشاريع النشطة" value={String(stats.active)} icon={FolderKanban} delay={0} />
        <StatsCard title="إجمالي الميزانية" value={formatCurrency(stats.totalBudget)} icon={DollarSign} delay={0.05} />
        <StatsCard title="المصروف" value={formatCurrency(stats.totalSpent)} icon={BarChart3} delay={0.1} />
        <StatsCard title="فرق الميزانية" value={formatCurrency(stats.totalBudget - stats.totalSpent)} icon={TrendingUp} delay={0.15} />
      </div>

      <div className="mb-4"><div className="relative w-64"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في المشاريع..." className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((project, i) => {
          const budgetUsed = Math.round((project.spent / project.budget) * 100)
          const doneCount = project.milestones.filter(m => m.done).length
          return (
            <motion.div key={project.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-3 sm:p-4 lg:p-5 hover:border-gold/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><FolderKanban size={18} className="text-gold" /></div>
                  <div><h3 className="text-sm font-bold text-foreground">{project.name}</h3><p className="text-[10px] text-muted-foreground">{project.category} — {project.location}</p></div>
                </div>
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full', statusColors[project.status])}>{statusLabels[project.status]}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] mb-1"><span className="text-muted-foreground">التقدم</span><span className="text-foreground font-mono">{project.progress}%</span></div>
                <div className="w-full h-2 rounded-full bg-surface3"><div className={cn('h-full rounded-full transition-all', project.progress >= 80 ? 'bg-success' : project.progress >= 50 ? 'bg-gold' : 'bg-warning')} style={{ width: `${project.progress}%` }} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                <div className="p-2 rounded-lg bg-surface2/50 text-center"><p className="text-[8px] text-muted-foreground">الميزانية</p><p className="text-[10px] font-bold font-mono text-foreground">{formatCurrency(project.budget)}</p></div>
                <div className="p-2 rounded-lg bg-surface2/50 text-center"><p className="text-[8px] text-muted-foreground">المصروف</p><p className={cn('text-[10px] font-bold font-mono', budgetUsed > 90 ? 'text-danger' : 'text-foreground')}>{budgetUsed}%</p></div>
                <div className="p-2 rounded-lg bg-surface2/50 text-center"><p className="text-[8px] text-muted-foreground">المراحل</p><p className="text-[10px] font-bold font-mono text-foreground">{doneCount}/{project.milestones.length}</p></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground"><Users size={10} />{project.team} فرد — {project.manager}</div>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => setDetailProject(project)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                  <button onClick={() => setDeleteConfirm(project.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* نافذة تفاصيل المشروع */}
      <AnimatePresence>
        {detailProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailProject(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-4 sm:p-6 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div><h2 className="text-base font-bold text-foreground">{detailProject.name}</h2><p className="text-xs text-muted-foreground">{detailProject.category} — {detailProject.location}</p></div>
                <button onClick={() => setDetailProject(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{detailProject.description}</p>
              <div className="mb-4"><div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">التقدم الكلي</span><span className="text-gold font-bold font-mono">{detailProject.progress}%</span></div><div className="w-full h-3 rounded-full bg-surface3"><div className="h-full rounded-full bg-gradient-to-l from-gold to-gold-light transition-all" style={{ width: `${detailProject.progress}%` }} /></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 sm:mb-4">
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/20"><p className="text-[10px] text-muted-foreground">الميزانية</p><p className="text-sm font-bold font-mono text-gold">{formatCurrency(detailProject.budget)}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">المصروف</p><p className="text-sm font-bold font-mono text-foreground">{formatCurrency(detailProject.spent)}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">البداية</p><p className="text-xs text-foreground">{detailProject.startDate}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">النهاية</p><p className="text-xs text-foreground">{detailProject.endDate}</p></div>
              </div>
              <h4 className="text-xs font-bold text-foreground mb-2">المراحل</h4>
              <div className="space-y-2 mb-4">
                {detailProject.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface2/30">
                    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center', m.done ? 'bg-success/20' : 'bg-surface3')}>
                      {m.done ? <CheckCircle size={12} className="text-success" /> : <Clock size={12} className="text-muted-foreground" />}
                    </div>
                    <span className={cn('text-xs', m.done ? 'text-foreground' : 'text-muted-foreground')}>{m.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>المدير: <span className="text-foreground">{detailProject.manager}</span></span>
                <span>{detailProject.team} فرد</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة مشروع جديد */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5"><div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><FolderKanban size={18} className="text-gold" /></div><div><h3 className="text-base font-bold text-foreground">مشروع جديد</h3><p className="text-xs text-muted-foreground">إنشاء مشروع</p></div></div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم المشروع <span className="text-danger">*</span></label><input type="text" value={newProject.name} onChange={(e) => setNewProject(p => ({ ...p, name: e.target.value }))} placeholder="اسم المشروع" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الوصف</label><textarea value={newProject.description} onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder="وصف المشروع..." rows={2} className="w-full p-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">التصنيف</label><select value={newProject.category} onChange={(e) => setNewProject(p => ({ ...p, category: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option>معارض</option><option>تشغيل</option><option>تقنية</option><option>رياضة</option><option>اجتماعي</option></select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الميزانية (ر.س)</label><input type="number" value={newProject.budget} onChange={(e) => setNewProject(p => ({ ...p, budget: e.target.value }))} placeholder="0" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المدير</label><input type="text" value={newProject.manager} onChange={(e) => setNewProject(p => ({ ...p, manager: e.target.value }))} placeholder="مدير المشروع" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الموقع</label><input type="text" value={newProject.location} onChange={(e) => setNewProject(p => ({ ...p, location: e.target.value }))} placeholder="الموقع" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إنشاء المشروع</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-4 sm:p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف المشروع</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{projects.find(p => p.id === deleteConfirm)?.name}</span>؟</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
