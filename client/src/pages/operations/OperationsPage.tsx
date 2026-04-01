/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — إدارة العمليات التشغيلية
 * Features: مهام، تتبع تقدم، فرق، Kanban، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings2, Truck, Package, CheckCircle, AlertTriangle, Clock,
  MapPin, Users, Wrench, ClipboardList, Activity, Zap, Plus,
  Eye, Edit, Trash2, X, ArrowRight, Filter
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Task {
  id: number; title: string; event: string; assignee: string; status: string
  priority: string; progress: number; dueDate: string; notes: string
}

const priorityColors: Record<string, string> = { high: 'bg-danger/10 text-danger', medium: 'bg-warning/10 text-warning', low: 'bg-info/10 text-info' }
const priorityLabels: Record<string, string> = { high: 'عالية', medium: 'متوسطة', low: 'منخفضة' }
const statusLabels: Record<string, string> = { pending: 'معلقة', in_progress: 'قيد التنفيذ', completed: 'مكتملة', delayed: 'متأخرة' }
const statusColors: Record<string, string> = { pending: 'bg-chrome/10 text-chrome', in_progress: 'bg-gold/10 text-gold', completed: 'bg-success/10 text-success', delayed: 'bg-danger/10 text-danger' }

const demoTasks: Task[] = [
  { id: 1, title: 'تجهيز القاعة الرئيسية', event: 'معرض الرياض 2026', assignee: 'فريق اللوجستيات', status: 'in_progress', priority: 'high', progress: 65, dueDate: '2026-04-10', notes: 'تركيب الأرضيات والإضاءة' },
  { id: 2, title: 'تركيب أنظمة الصوت', event: 'معرض الرياض 2026', assignee: 'فريق التقنية', status: 'pending', priority: 'high', progress: 0, dueDate: '2026-04-12', notes: 'انتظار وصول المعدات' },
  { id: 3, title: 'طباعة المواد الدعائية', event: 'معرض الرياض 2026', assignee: 'فريق التسويق', status: 'completed', priority: 'medium', progress: 100, dueDate: '2026-03-28', notes: 'تم التسليم' },
  { id: 4, title: 'تنسيق الأمن والسلامة', event: 'معرض الرياض 2026', assignee: 'فريق الأمن', status: 'in_progress', priority: 'high', progress: 40, dueDate: '2026-04-08', notes: 'تدريب الفريق جاري' },
  { id: 5, title: 'إعداد منطقة الطعام', event: 'معرض الرياض 2026', assignee: 'فريق الضيافة', status: 'pending', priority: 'medium', progress: 0, dueDate: '2026-04-14', notes: 'تنسيق مع الموردين' },
  { id: 6, title: 'اختبار شبكة الإنترنت', event: 'معرض الرياض 2026', assignee: 'فريق IT', status: 'completed', priority: 'low', progress: 100, dueDate: '2026-03-25', notes: 'سرعة ممتازة' },
  { id: 7, title: 'تجهيز مواقف السيارات', event: 'معرض الرياض 2026', assignee: 'فريق اللوجستيات', status: 'delayed', priority: 'high', progress: 20, dueDate: '2026-04-05', notes: 'تأخر بسبب الأمطار' },
  { id: 8, title: 'تركيب اللافتات الإرشادية', event: 'معرض الرياض 2026', assignee: 'فريق التسويق', status: 'in_progress', priority: 'medium', progress: 50, dueDate: '2026-04-09', notes: 'تم تركيب 50% من اللافتات' },
  { id: 9, title: 'فحص أنظمة الإطفاء', event: 'معرض الرياض 2026', assignee: 'فريق الأمن', status: 'completed', priority: 'high', progress: 100, dueDate: '2026-03-30', notes: 'اجتاز الفحص بنجاح' },
  { id: 10, title: 'تجهيز غرف VIP', event: 'معرض الرياض 2026', assignee: 'فريق الضيافة', status: 'in_progress', priority: 'high', progress: 75, dueDate: '2026-04-11', notes: 'تأثيث وتجهيز' },
]

export default function OperationsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [tasks, setTasks] = useState(demoTasks)
  const [showAddModal, setShowAddModal] = useState(false)
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [filterPriority, setFilterPriority] = useState('all')
  const [newTask, setNewTask] = useState({ title: '', assignee: '', priority: 'medium', dueDate: '', notes: '' })

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    delayed: tasks.filter(t => t.status === 'delayed').length,
    avgProgress: Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length),
  }), [tasks])

  const filtered = useMemo(() => filterPriority === 'all' ? tasks : tasks.filter(t => t.priority === filterPriority), [tasks, filterPriority])

  const kanbanColumns = [
    { key: 'pending', label: 'معلقة', icon: Clock, color: 'border-chrome/30' },
    { key: 'in_progress', label: 'قيد التنفيذ', icon: Activity, color: 'border-gold/30' },
    { key: 'delayed', label: 'متأخرة', icon: AlertTriangle, color: 'border-danger/30' },
    { key: 'completed', label: 'مكتملة', icon: CheckCircle, color: 'border-success/30' },
  ]

  const handleAdd = () => {
    if (!newTask.title) { toast.error('يرجى إدخال عنوان المهمة'); return }
    const t: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1, title: newTask.title, event: 'معرض الرياض 2026',
      assignee: newTask.assignee || 'غير محدد', status: 'pending', priority: newTask.priority,
      progress: 0, dueDate: newTask.dueDate || '2026-04-30', notes: newTask.notes,
    }
    setTasks(prev => [t, ...prev])
    toast.success(`تمت إضافة المهمة: ${t.title}`)
    setShowAddModal(false)
    setNewTask({ title: '', assignee: '', priority: 'medium', dueDate: '', notes: '' })
  }

  const handleDelete = (id: number) => {
    const t = tasks.find(t => t.id === id)
    setTasks(prev => prev.filter(t => t.id !== id))
    toast.success(`تم حذف المهمة: ${t?.title}`)
    setDeleteConfirm(null)
  }

  const moveTask = (id: number, newStatus: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const progress = newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? Math.max(t.progress, 10) : t.progress
      toast.info(`تم نقل "${t.title}" إلى: ${statusLabels[newStatus]}`)
      return { ...t, status: newStatus, progress }
    }))
  }

  const updateProgress = (id: number, delta: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const newP = Math.max(0, Math.min(100, t.progress + delta))
      const newStatus = newP === 100 ? 'completed' : newP > 0 ? 'in_progress' : t.status
      return { ...t, progress: newP, status: newStatus }
    }))
  }

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة العمليات التشغيلية"
        subtitle={`${stats.total} مهمة — ${stats.completed} مكتملة — التقدم العام: ${stats.avgProgress}%`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface2 rounded-xl p-0.5">
              <button onClick={() => setView('kanban')} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', view === 'kanban' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>Kanban</button>
              <button onClick={() => setView('list')} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', view === 'list' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>قائمة</button>
            </div>
            <button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
              <Plus size={16} /> مهمة جديدة
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatsCard title="إجمالي المهام" value={String(stats.total)} icon={ClipboardList} delay={0} />
        <StatsCard title="قيد التنفيذ" value={String(stats.inProgress)} icon={Activity} trend={3} trendLabel="هذا الأسبوع" delay={0.05} />
        <StatsCard title="مكتملة" value={String(stats.completed)} icon={CheckCircle} delay={0.1} />
        <StatsCard title="متأخرة" value={String(stats.delayed)} icon={AlertTriangle} delay={0.15} />
      </div>

      {/* شريط التقدم العام */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">التقدم العام — معرض الرياض 2026</h3>
          <span className="text-sm font-bold font-mono text-gold">{stats.avgProgress}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-surface3">
          <motion.div initial={{ width: 0 }} animate={{ width: `${stats.avgProgress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
            className={cn('h-full rounded-full', stats.avgProgress >= 80 ? 'bg-success' : stats.avgProgress >= 50 ? 'bg-gold' : 'bg-warning')} />
        </div>
      </motion.div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {kanbanColumns.map((col, ci) => {
            const colTasks = filtered.filter(t => t.status === col.key)
            return (
              <motion.div key={col.key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + ci * 0.05 }}
                className={cn('glass-card p-3 border', col.color)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-foreground"><col.icon size={13} />{col.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground">{colTasks.length}</span>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {colTasks.map(t => (
                    <div key={t.id} onClick={() => setDetailTask(t)} className="p-3 rounded-lg bg-surface2/50 border border-border/20 hover:border-gold/20 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground line-clamp-1">{t.title}</span>
                        <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full', priorityColors[t.priority])}>{priorityLabels[t.priority]}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-2">{t.assignee}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1 rounded-full bg-surface3">
                          <div className={cn('h-full rounded-full', t.progress >= 80 ? 'bg-success' : t.progress >= 40 ? 'bg-gold' : 'bg-chrome')} style={{ width: `${t.progress}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground">{t.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            {[{ key: 'all', label: 'الكل' }, { key: 'high', label: 'عالية' }, { key: 'medium', label: 'متوسطة' }, { key: 'low', label: 'منخفضة' }].map(f => (
              <button key={f.key} onClick={() => setFilterPriority(f.key)} className={cn('h-7 px-2.5 rounded-lg text-[11px] font-medium transition-all', filterPriority === f.key ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>{f.label}</button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">المهمة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المسؤول</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الحالة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الأولوية</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">التقدم</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">إجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.map((t, idx) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3"><p className="text-sm font-medium text-foreground">{t.title}</p><p className="text-[10px] text-muted-foreground">{t.event}</p></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{t.assignee}</td>
                    <td className="px-3 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', statusColors[t.status])}>{statusLabels[t.status]}</span></td>
                    <td className="px-3 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', priorityColors[t.priority])}>{priorityLabels[t.priority]}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-14 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', t.progress >= 80 ? 'bg-success' : t.progress >= 40 ? 'bg-gold' : 'bg-chrome')} style={{ width: `${t.progress}%` }} /></div>
                        <span className="text-[10px] font-mono">{t.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button onClick={() => setDetailTask(t)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                        <button onClick={() => updateProgress(t.id, 10)} className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-colors" title="+10%"><ArrowRight size={14} /></button>
                        <button onClick={() => setDeleteConfirm(t.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* نافذة تفاصيل المهمة */}
      <AnimatePresence>
        {detailTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailTask(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">{detailTask.title}</h2>
                <button onClick={() => setDetailTask(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الفعالية</p><p className="text-xs text-foreground">{detailTask.event}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">المسؤول</p><p className="text-xs text-foreground">{detailTask.assignee}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الحالة</p><span className={cn('text-xs px-2 py-0.5 rounded-full', statusColors[detailTask.status])}>{statusLabels[detailTask.status]}</span></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الأولوية</p><span className={cn('text-xs px-2 py-0.5 rounded-full', priorityColors[detailTask.priority])}>{priorityLabels[detailTask.priority]}</span></div>
              </div>
              <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 mb-3">
                <div className="flex items-center justify-between mb-1.5"><span className="text-[10px] text-muted-foreground">التقدم</span><span className="text-sm font-bold font-mono text-gold">{detailTask.progress}%</span></div>
                <div className="w-full h-2 rounded-full bg-surface3"><div className={cn('h-full rounded-full', detailTask.progress >= 80 ? 'bg-success' : detailTask.progress >= 40 ? 'bg-gold' : 'bg-chrome')} style={{ width: `${detailTask.progress}%` }} /></div>
              </div>
              {detailTask.notes && <div className="p-3 rounded-xl bg-surface2/50 border border-border/30 mb-3"><p className="text-[10px] text-muted-foreground mb-1">ملاحظات</p><p className="text-sm text-foreground">{detailTask.notes}</p></div>}
              <p className="text-[10px] text-muted-foreground mb-4">الموعد النهائي: {detailTask.dueDate}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => { updateProgress(detailTask.id, 10); setDetailTask(null) }} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">+10% تقدم</button>
                <button onClick={() => { moveTask(detailTask.id, 'completed'); setDetailTask(null) }} className="h-10 px-4 rounded-xl bg-success/10 border border-success/20 text-success font-medium text-sm hover:bg-success/20 transition-all flex items-center gap-1"><CheckCircle size={13} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة إضافة مهمة */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><ClipboardList size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">مهمة جديدة</h3><p className="text-xs text-muted-foreground">إضافة مهمة تشغيلية</p></div>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">عنوان المهمة <span className="text-danger">*</span></label><input type="text" value={newTask.title} onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="عنوان المهمة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المسؤول</label><input type="text" value={newTask.assignee} onChange={(e) => setNewTask(p => ({ ...p, assignee: e.target.value }))} placeholder="الفريق/الشخص" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الأولوية</label><select value={newTask.priority} onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option value="high">عالية</option><option value="medium">متوسطة</option><option value="low">منخفضة</option></select></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الموعد النهائي</label><input type="date" value={newTask.dueDate} onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">ملاحظات</label><textarea value={newTask.notes} onChange={(e) => setNewTask(p => ({ ...p, notes: e.target.value }))} placeholder="ملاحظات..." rows={2} className="w-full p-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" /></div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إضافة المهمة</button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف المهمة</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{tasks.find(t => t.id === deleteConfirm)?.title}</span>؟</p>
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
