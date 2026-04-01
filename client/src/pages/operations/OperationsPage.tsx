import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings2, Truck, Package, CheckCircle, AlertTriangle, Clock,
  MapPin, Users, Wrench, ClipboardList, Activity, Zap
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const tasks = [
  { id: 1, title: 'تجهيز القاعة الرئيسية', event: 'معرض الرياض 2026', assignee: 'فريق اللوجستيات', status: 'in_progress', priority: 'high', progress: 65 },
  { id: 2, title: 'تركيب أنظمة الصوت', event: 'معرض الرياض 2026', assignee: 'فريق التقنية', status: 'pending', priority: 'high', progress: 0 },
  { id: 3, title: 'طباعة المواد الدعائية', event: 'معرض الرياض 2026', assignee: 'فريق التسويق', status: 'completed', priority: 'medium', progress: 100 },
  { id: 4, title: 'تنسيق الأمن والسلامة', event: 'معرض الرياض 2026', assignee: 'فريق الأمن', status: 'in_progress', priority: 'high', progress: 40 },
  { id: 5, title: 'إعداد منطقة الطعام', event: 'معرض الرياض 2026', assignee: 'فريق الضيافة', status: 'pending', priority: 'medium', progress: 0 },
  { id: 6, title: 'اختبار شبكة الإنترنت', event: 'معرض الرياض 2026', assignee: 'فريق IT', status: 'completed', priority: 'low', progress: 100 },
]

const logistics = [
  { id: 1, item: 'شحنة أجهزة العرض', vendor: 'Samsung', status: 'shipped', eta: '2 أيام', tracking: 'SA-2026-4521' },
  { id: 2, item: 'أثاث الأجنحة', vendor: 'IKEA Business', status: 'delivered', eta: 'تم التسليم', tracking: 'SA-2026-4522' },
  { id: 3, item: 'مواد الطباعة', vendor: 'Al-Jazirah Print', status: 'processing', eta: '5 أيام', tracking: 'SA-2026-4523' },
]

export default function OperationsPage() {
  const [view, setView] = useState<'tasks' | 'logistics'>('tasks')

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة العمليات"
        subtitle="تتبع المهام التشغيلية واللوجستيات"
        actions={
          <div className="flex items-center bg-surface2 rounded-xl p-0.5">
            <button onClick={() => setView('tasks')} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1', view === 'tasks' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
              <ClipboardList size={12} /> المهام
            </button>
            <button onClick={() => setView('logistics')} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1', view === 'logistics' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
              <Truck size={12} /> اللوجستيات
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="المهام النشطة" value="18" icon={ClipboardList} trend={0} trendLabel="هذا الأسبوع" delay={0} />
        <StatsCard title="مكتملة" value="42" icon={CheckCircle} trend={15} trendLabel="هذا الشهر" delay={0.1} />
        <StatsCard title="متأخرة" value="3" icon={AlertTriangle} trend={-2} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="الكفاءة التشغيلية" value="87%" icon={Activity} trend={5} trendLabel="تحسن" delay={0.3} />
      </div>

      {view === 'tasks' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">المهام التشغيلية</h3>
            <button onClick={() => toast.info('إضافة مهمة — قريباً')} className="h-8 px-3 rounded-lg bg-gold/10 border border-gold/20 text-xs font-medium text-gold hover:bg-gold/20 transition-all">+ مهمة جديدة</button>
          </div>
          <div className="divide-y divide-border/30">
            {tasks.map((task, i) => (
              <motion.div key={task.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="p-4 hover:bg-surface2/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center',
                      task.status === 'completed' ? 'bg-success/10 text-success' : task.status === 'in_progress' ? 'bg-gold/10 text-gold' : 'bg-surface2 text-muted-foreground'
                    )}>
                      {task.status === 'completed' ? <CheckCircle size={16} /> : task.status === 'in_progress' ? <Wrench size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{task.assignee}</span>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', task.priority === 'high' ? 'bg-danger/15 text-danger' : task.priority === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info')}>
                          {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span>التقدم</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface3">
                        <div className={cn('h-full rounded-full transition-all', task.progress === 100 ? 'bg-success' : 'bg-gold')} style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-sm font-bold text-foreground">تتبع الشحنات</h3>
          </div>
          <div className="divide-y divide-border/30">
            {logistics.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="p-4 hover:bg-surface2/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Package size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.item}</p>
                      <p className="text-[11px] text-muted-foreground">{item.vendor} — {item.tracking}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{item.eta}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AdminLayout>
  )
}
