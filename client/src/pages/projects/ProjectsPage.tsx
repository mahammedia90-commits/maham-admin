import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FolderKanban, Plus, Calendar, Users, Clock, CheckCircle,
  AlertTriangle, BarChart3, Target, ArrowUpRight
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const projects = [
  { id: 1, name: 'معرض الرياض الدولي 2026', status: 'in_progress', progress: 72, team: 12, deadline: '2026-05-15', budget: '2.5M', tasks: { total: 48, done: 35 } },
  { id: 2, name: 'مؤتمر التقنية المالية', status: 'planning', progress: 25, team: 8, deadline: '2026-07-20', budget: '1.2M', tasks: { total: 32, done: 8 } },
  { id: 3, name: 'معرض بوليفارد وورلد', status: 'in_progress', progress: 55, team: 15, deadline: '2026-06-01', budget: '3.8M', tasks: { total: 65, done: 36 } },
  { id: 4, name: 'فعالية الشركاء السنوية', status: 'completed', progress: 100, team: 6, deadline: '2026-03-10', budget: '500K', tasks: { total: 20, done: 20 } },
]

export default function ProjectsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="إدارة المشاريع"
        subtitle="تتبع المشاريع والمهام والفرق"
        actions={
          <button onClick={() => toast.info('إنشاء مشروع — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            مشروع جديد
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="المشاريع النشطة" value="3" icon={FolderKanban} trend={0} trendLabel="حالياً" delay={0} />
        <StatsCard title="المهام المكتملة" value="99" icon={CheckCircle} trend={18} trendLabel="هذا الشهر" delay={0.1} />
        <StatsCard title="الفرق العاملة" value="4" icon={Users} trend={0} trendLabel="فريق" delay={0.2} />
        <StatsCard title="نسبة الإنجاز" value="63%" icon={Target} trend={8} trendLabel="تحسن" delay={0.3} />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="glass-card p-5 hover:border-gold/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <FolderKanban size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={project.status} />
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {project.deadline}</span>
                  </div>
                </div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors opacity-0 group-hover:opacity-100">
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">التقدم</span>
                <span className="font-mono font-bold text-gold">{project.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className={cn('h-full rounded-full', project.progress === 100 ? 'bg-success' : 'bg-gradient-to-l from-gold to-gold-light')}
                />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={12} /> {project.team} عضو</span>
                <span className="flex items-center gap-1"><CheckCircle size={12} /> {project.tasks.done}/{project.tasks.total}</span>
              </div>
              <span className="text-xs font-mono text-gold">{project.budget} ر.س</span>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  )
}
