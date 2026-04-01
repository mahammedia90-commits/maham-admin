import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Workflow, Plus, Play, Pause, Eye, Edit, Trash2,
  ArrowRight, Zap, Clock, CheckCircle, Settings
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const workflows = [
  { id: 1, name: 'موافقة طلب الحجز', trigger: 'طلب جديد', steps: 4, status: 'active', runs: 156, lastRun: 'منذ ساعة' },
  { id: 2, name: 'إرسال فاتورة تلقائية', trigger: 'تأكيد الحجز', steps: 3, status: 'active', runs: 89, lastRun: 'منذ 3 ساعات' },
  { id: 3, name: 'تنبيه انتهاء العقد', trigger: 'قبل 30 يوم', steps: 2, status: 'active', runs: 12, lastRun: 'منذ يوم' },
  { id: 4, name: 'تقييم العميل AI', trigger: 'عميل جديد', steps: 5, status: 'paused', runs: 45, lastRun: 'منذ أسبوع' },
  { id: 5, name: 'إشعار فريق المبيعات', trigger: 'فرصة جديدة', steps: 2, status: 'active', runs: 234, lastRun: 'منذ 30 دقيقة' },
]

export default function WorkflowsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="سير العمل"
        subtitle="إدارة العمليات الآلية وسير العمل"
        actions={
          <button onClick={() => toast.info('إنشاء سير عمل — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            سير عمل جديد
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="سير العمل النشطة" value="4" icon={Workflow} trend={0} trendLabel="حالياً" delay={0} />
        <StatsCard title="التشغيلات اليوم" value="23" icon={Play} trend={12} trendLabel="هذا اليوم" delay={0.1} />
        <StatsCard title="نسبة النجاح" value="98.5%" icon={CheckCircle} trend={2} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="الوقت الموفّر" value="45 ساعة" icon={Clock} trend={15} trendLabel="هذا الشهر" delay={0.3} />
      </div>

      <div className="space-y-3">
        {workflows.map((wf, i) => (
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="glass-card p-4 hover:border-gold/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  wf.status === 'active' ? 'bg-gold/10 text-gold' : 'bg-surface2 text-muted-foreground'
                )}>
                  <Workflow size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{wf.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Zap size={10} className="text-gold" /> {wf.trigger}</span>
                    <span className="text-[11px] text-muted-foreground">{wf.steps} خطوات</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Play size={10} /> {wf.runs} تشغيل</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> {wf.lastRun}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={wf.status} />
                <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Edit size={14} /></button>
                <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-chrome transition-colors"><Settings size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  )
}
