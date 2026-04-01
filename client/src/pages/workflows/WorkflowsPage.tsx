/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — سير العمل والأتمتة (Workflows & Automation)
 * Features: سير عمل، قواعد أتمتة، حالات، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Workflow, Plus, Eye, Trash2, AlertTriangle, Search,
  Zap, Clock, CheckCircle, Play, Pause, Settings,
  ArrowRight, GitBranch, X, ToggleLeft, ToggleRight
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface WorkflowItem {
  id: number; name: string; description: string; status: string; trigger: string
  steps: { name: string; type: string }[]; runs: number; lastRun: string; category: string
}

const demoWorkflows: WorkflowItem[] = [
  { id: 1, name: 'اعتماد طلبات الحجز', description: 'سير عمل تلقائي لاعتماد طلبات حجز الأجنحة — يمر عبر المشرف ثم المدير المالي', status: 'active', trigger: 'طلب حجز جديد', steps: [{ name: 'استلام الطلب', type: 'trigger' }, { name: 'مراجعة المشرف', type: 'approval' }, { name: 'اعتماد مالي', type: 'approval' }, { name: 'إرسال التأكيد', type: 'action' }], runs: 156, lastRun: '2026-04-01 09:30', category: 'حجوزات' },
  { id: 2, name: 'إشعار انتهاء العقود', description: 'إرسال تنبيهات تلقائية قبل 30 و 15 و 7 أيام من انتهاء العقد', status: 'active', trigger: 'جدول زمني', steps: [{ name: 'فحص العقود', type: 'trigger' }, { name: 'تحديد المنتهية', type: 'condition' }, { name: 'إرسال إشعار', type: 'action' }, { name: 'تحديث السجل', type: 'action' }], runs: 45, lastRun: '2026-04-01 06:00', category: 'عقود' },
  { id: 3, name: 'معالجة الفواتير', description: 'أتمتة إنشاء وإرسال الفواتير الإلكترونية عبر ZATCA', status: 'active', trigger: 'إنشاء فاتورة', steps: [{ name: 'إنشاء الفاتورة', type: 'trigger' }, { name: 'التحقق من البيانات', type: 'condition' }, { name: 'إرسال ZATCA', type: 'action' }, { name: 'إرسال للعميل', type: 'action' }], runs: 234, lastRun: '2026-04-01 08:45', category: 'مالية' },
  { id: 4, name: 'تصعيد تذاكر الدعم', description: 'تصعيد تلقائي للتذاكر غير المعالجة خلال 24 ساعة', status: 'active', trigger: 'مرور 24 ساعة', steps: [{ name: 'فحص التذاكر', type: 'trigger' }, { name: 'تحديد المتأخرة', type: 'condition' }, { name: 'تصعيد للمشرف', type: 'action' }, { name: 'إشعار العميل', type: 'action' }], runs: 28, lastRun: '2026-03-31 18:00', category: 'دعم' },
  { id: 5, name: 'تقرير يومي تلقائي', description: 'إنشاء وإرسال تقرير يومي للإدارة التنفيذية', status: 'active', trigger: 'يومياً 8:00 صباحاً', steps: [{ name: 'جمع البيانات', type: 'trigger' }, { name: 'إنشاء التقرير', type: 'action' }, { name: 'إرسال بالبريد', type: 'action' }], runs: 89, lastRun: '2026-04-01 08:00', category: 'تقارير' },
  { id: 6, name: 'ترحيب العملاء الجدد', description: 'إرسال رسالة ترحيب وحزمة معلومات للعملاء الجدد', status: 'paused', trigger: 'عميل جديد', steps: [{ name: 'تسجيل العميل', type: 'trigger' }, { name: 'إرسال ترحيب', type: 'action' }, { name: 'تعيين مسؤول', type: 'action' }], runs: 67, lastRun: '2026-03-28 14:00', category: 'CRM' },
  { id: 7, name: 'مراجعة أداء الحملات', description: 'تحليل أسبوعي لأداء الحملات التسويقية وإرسال ملخص', status: 'draft', trigger: 'أسبوعياً', steps: [{ name: 'جمع بيانات الحملات', type: 'trigger' }, { name: 'تحليل الأداء', type: 'action' }, { name: 'إنشاء ملخص', type: 'action' }, { name: 'إرسال للفريق', type: 'action' }], runs: 0, lastRun: '', category: 'تسويق' },
]

const statusLabels: Record<string, string> = { active: 'نشط', paused: 'متوقف', draft: 'مسودة' }
const statusColors: Record<string, string> = { active: 'bg-success/10 text-success', paused: 'bg-warning/10 text-warning', draft: 'bg-chrome/10 text-chrome' }
const stepTypeColors: Record<string, string> = { trigger: 'bg-gold/10 text-gold border-gold/20', approval: 'bg-warning/10 text-warning border-warning/20', condition: 'bg-info/10 text-info border-info/20', action: 'bg-success/10 text-success border-success/20' }
const stepTypeLabels: Record<string, string> = { trigger: 'مشغّل', approval: 'اعتماد', condition: 'شرط', action: 'إجراء' }

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(demoWorkflows)
  const [search, setSearch] = useState('')
  const [detailWf, setDetailWf] = useState<WorkflowItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newWf, setNewWf] = useState({ name: '', description: '', trigger: '', category: 'حجوزات' })

  const stats = useMemo(() => ({
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    totalRuns: workflows.reduce((s, w) => s + w.runs, 0),
  }), [workflows])

  const filtered = useMemo(() => {
    if (!search) return workflows
    const s = search.toLowerCase()
    return workflows.filter(w => w.name.includes(s) || w.category.includes(s))
  }, [workflows, search])

  const toggleStatus = (id: number) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w))
    const w = workflows.find(w => w.id === id)
    toast.success(`${w?.status === 'active' ? 'تم إيقاف' : 'تم تفعيل'}: ${w?.name}`)
  }

  const handleAdd = () => {
    if (!newWf.name) { toast.error('يرجى إدخال اسم سير العمل'); return }
    const w: WorkflowItem = {
      id: Math.max(...workflows.map(w => w.id)) + 1, name: newWf.name, description: newWf.description,
      status: 'draft', trigger: newWf.trigger || 'يدوي', steps: [{ name: 'مشغّل', type: 'trigger' }],
      runs: 0, lastRun: '', category: newWf.category,
    }
    setWorkflows(prev => [w, ...prev])
    toast.success(`تم إنشاء سير العمل: ${w.name}`)
    setShowAddModal(false)
    setNewWf({ name: '', description: '', trigger: '', category: 'حجوزات' })
  }

  const handleDelete = (id: number) => {
    const w = workflows.find(w => w.id === id)
    setWorkflows(prev => prev.filter(w => w.id !== id))
    toast.success(`تم حذف: ${w?.name}`)
    setDeleteConfirm(null)
  }

  return (
    <AdminLayout>
      <PageHeader title="سير العمل والأتمتة" subtitle={`${stats.total} سير عمل — ${stats.active} نشط — ${stats.totalRuns} تشغيل`}
        actions={<button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> سير عمل جديد</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="سير العمل النشط" value={String(stats.active)} icon={Workflow} delay={0} />
        <StatsCard title="إجمالي التشغيل" value={String(stats.totalRuns)} icon={Zap} delay={0.05} />
        <StatsCard title="نسبة النجاح" value="98.5%" icon={CheckCircle} trend={2} trendLabel="تحسن" delay={0.1} />
        <StatsCard title="الوقت الموفر" value="120 ساعة" icon={Clock} delay={0.15} />
      </div>

      <div className="mb-4"><div className="relative w-64"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في سير العمل..." className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div></div>

      <div className="space-y-3">
        {filtered.map((wf, i) => (
          <motion.div key={wf.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="glass-card p-3 sm:p-4 lg:p-5 hover:border-gold/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', wf.status === 'active' ? 'bg-success/10' : 'bg-surface2')}>
                  <Workflow size={18} className={wf.status === 'active' ? 'text-success' : 'text-muted-foreground'} />
                </div>
                <div><h3 className="text-sm font-bold text-foreground">{wf.name}</h3><p className="text-[10px] text-muted-foreground">{wf.category} — المشغّل: {wf.trigger}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full', statusColors[wf.status])}>{statusLabels[wf.status]}</span>
                <button onClick={() => toggleStatus(wf.id)} className="p-1 text-muted-foreground hover:text-gold transition-colors">
                  {wf.status === 'active' ? <ToggleRight size={20} className="text-success" /> : <ToggleLeft size={20} />}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{wf.description}</p>
            {/* خطوات سير العمل */}
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {wf.steps.map((step, si) => (
                <div key={si} className="flex items-center gap-1">
                  <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', stepTypeColors[step.type])}>{step.name}</span>
                  {si < wf.steps.length - 1 && <ArrowRight size={10} className="text-muted-foreground/40" />}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Zap size={10} />{wf.runs} تشغيل</span>
                {wf.lastRun && <span className="flex items-center gap-1"><Clock size={10} />آخر تشغيل: {wf.lastRun}</span>}
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setDetailWf(wf)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                <button onClick={() => setDeleteConfirm(wf.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* نافذة التفاصيل */}
      <AnimatePresence>
        {detailWf && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailWf(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5"><div><h2 className="text-base font-bold text-foreground">{detailWf.name}</h2><p className="text-xs text-muted-foreground">{detailWf.category}</p></div><button onClick={() => setDetailWf(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button></div>
              <p className="text-sm text-muted-foreground mb-4">{detailWf.description}</p>
              <h4 className="text-xs font-bold text-foreground mb-2">خطوات سير العمل</h4>
              <div className="space-y-2 mb-4">
                {detailWf.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface2/30">
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold', stepTypeColors[step.type])}>{i + 1}</div>
                    <div><p className="text-xs text-foreground">{step.name}</p><p className="text-[9px] text-muted-foreground">{stepTypeLabels[step.type]}</p></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-surface2/50 text-center"><p className="text-[9px] text-muted-foreground">التشغيل</p><p className="text-sm font-bold font-mono text-foreground">{detailWf.runs}</p></div>
                <div className="p-2 rounded-lg bg-surface2/50 text-center"><p className="text-[9px] text-muted-foreground">المشغّل</p><p className="text-[10px] font-medium text-foreground">{detailWf.trigger}</p></div>
                <div className="p-2 rounded-lg bg-surface2/50 text-center"><p className="text-[9px] text-muted-foreground">الحالة</p><span className={cn('text-[10px] px-2 py-0.5 rounded-full', statusColors[detailWf.status])}>{statusLabels[detailWf.status]}</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة إضافة */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5"><div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Workflow size={18} className="text-gold" /></div><div><h3 className="text-base font-bold text-foreground">سير عمل جديد</h3><p className="text-xs text-muted-foreground">إنشاء أتمتة</p></div></div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الاسم <span className="text-danger">*</span></label><input type="text" value={newWf.name} onChange={(e) => setNewWf(p => ({ ...p, name: e.target.value }))} placeholder="اسم سير العمل" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الوصف</label><textarea value={newWf.description} onChange={(e) => setNewWf(p => ({ ...p, description: e.target.value }))} placeholder="وصف سير العمل..." rows={2} className="w-full p-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المشغّل</label><input type="text" value={newWf.trigger} onChange={(e) => setNewWf(p => ({ ...p, trigger: e.target.value }))} placeholder="حدث التشغيل" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">التصنيف</label><select value={newWf.category} onChange={(e) => setNewWf(p => ({ ...p, category: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option>حجوزات</option><option>عقود</option><option>مالية</option><option>دعم</option><option>تقارير</option><option>CRM</option><option>تسويق</option></select></div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إنشاء</button>
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
              <h3 className="text-base font-bold text-foreground mb-2">حذف سير العمل</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{workflows.find(w => w.id === deleteConfirm)?.name}</span>؟</p>
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
