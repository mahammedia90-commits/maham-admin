/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Onboarding System
 * ═══════════════════════════════════════════════════════════════════════════
 * Employee onboarding: task tracking, document collection, system access,
 * orientation scheduling, buddy assignment, progress monitoring
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  UserPlus, Search, CheckCircle2, Circle, Clock, ArrowRight,
  FileText, Key, Users, BookOpen, Shield, Laptop, Building2,
  Sparkles, Zap
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { EmployeeAvatar, MiniProgress, MetricBox, SectionCard } from './HrShared'
import type { OnboardingTask, Employee } from '../hrTypes'

interface HrOnboardingProps {
  tasks: OnboardingTask[]
  employees: Employee[]
}

export default function HrOnboarding({ tasks, employees }: HrOnboardingProps) {
  const [search, setSearch] = useState('')

  // Group by employee
  const grouped = useMemo(() => {
    const map = new Map<string, OnboardingTask[]>()
    tasks.forEach(t => {
      const list = map.get(t.employee_id) || []
      list.push(t)
      map.set(t.employee_id, list)
    })
    return map
  }, [tasks])

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const stepIcons: Record<string, any> = {
    account: Key, documents: FileText, policies: Shield, role_assignment: Users,
    system_access: Laptop, orientation: BookOpen
  }

  // Onboarding workflow steps
  const workflowSteps = [
    { step: 'account', label: 'إنشاء الحسابات', desc: 'بريد إلكتروني، أنظمة داخلية، Active Directory' },
    { step: 'documents', label: 'جمع المستندات', desc: 'هوية، سيرة ذاتية، شهادات، فحص طبي' },
    { step: 'policies', label: 'توقيع السياسات', desc: 'NDA، لائحة العمل، سياسة الخصوصية PDPL' },
    { step: 'role_assignment', label: 'تعيين الدور', desc: 'الهيكل التنظيمي، الصلاحيات، RBAC' },
    { step: 'system_access', label: 'الوصول للأنظمة', desc: 'ERP، CRM، أدوات التعاون، VPN' },
    { step: 'orientation', label: 'التوجيه والتعريف', desc: 'جولة المكتب، تعريف الفريق، ثقافة الشركة' },
  ]

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">موظفون جدد</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{grouped.size}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">مهام مكتملة</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{completedCount}/{totalCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-warning" />
            <span className="text-[10px] text-muted-foreground">مهام متبقية</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{totalCount - completedCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-info" />
            <span className="text-[10px] text-muted-foreground">نسبة الإنجاز</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{overallProgress}%</p>
        </div>
      </div>

      {/* ─── Onboarding Workflow ───────────────────────────────────────── */}
      <SectionCard title="سير عمل التأهيل — Onboarding Workflow" icon={ArrowRight}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {workflowSteps.map((ws, i) => {
            const Icon = stepIcons[ws.step] || Circle
            return (
              <div key={ws.step} className="p-3 rounded-xl bg-surface2/30 border border-border/20 text-center relative">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mx-auto mb-2">
                  <Icon size={16} className="text-gold" />
                </div>
                <h5 className="text-[10px] font-bold text-foreground mb-0.5">{ws.label}</h5>
                <p className="text-[8px] text-muted-foreground">{ws.desc}</p>
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 hidden lg:block">
                  {i < workflowSteps.length - 1 && <ArrowRight size={12} className="text-gold/30" />}
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* ─── Employee Onboarding Cards ─────────────────────────────────── */}
      {Array.from(grouped.entries()).map(([empId, empTasks]) => {
        const emp = employees.find(e => e.id === empId)
        const completed = empTasks.filter(t => t.completed).length
        const total = empTasks.length
        const progress = Math.round((completed / total) * 100)
        const sorted = [...empTasks].sort((a, b) => a.order - b.order)

        return (
          <motion.div key={empId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-4">
              <EmployeeAvatar name={empTasks[0].employee_name} size="md" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground">{empTasks[0].employee_name}</h4>
                <p className="text-[10px] text-muted-foreground">{emp?.job_title_ar || ''} • {emp?.department_name || ''}</p>
              </div>
              <div className="text-left shrink-0">
                <p className="text-sm font-bold font-mono text-gold">{progress}%</p>
                <p className="text-[9px] text-muted-foreground">{completed}/{total} مهام</p>
              </div>
            </div>

            <MiniProgress value={progress} color={progress === 100 ? 'success' : progress >= 50 ? 'gold' : 'warning'} size="sm" />

            <div className="mt-3 space-y-2">
              {sorted.map(task => {
                const Icon = stepIcons[task.step] || Circle
                return (
                  <div key={task.id} className={cn('flex items-start gap-3 p-2 rounded-lg transition-all',
                    task.completed ? 'bg-success/5' : 'bg-surface2/20')}>
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      task.completed ? 'bg-success/20' : 'bg-surface2/50')}>
                      {task.completed ? <CheckCircle2 size={14} className="text-success" /> : <Circle size={14} className="text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('text-[11px] font-medium', task.completed ? 'text-muted-foreground line-through' : 'text-foreground')}>
                          {task.title}
                        </span>
                        <Icon size={10} className="text-gold" />
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{task.description}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-[8px] text-muted-foreground">المسؤول: {task.assigned_to}</span>
                        <span className="text-[8px] text-muted-foreground">الموعد: {formatDate(task.due_date)}</span>
                        {task.completed_at && <span className="text-[8px] text-success">اكتمل: {formatDate(task.completed_at)}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )
      })}

      {/* ─── AI Onboarding Suggestions ─────────────────────────────────── */}
      <SectionCard title="اقتراحات الذكاء الاصطناعي للتأهيل" icon={Sparkles}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { title: 'تخصيص مسار التأهيل', desc: 'تعديل خطوات التأهيل تلقائياً بناءً على الدور الوظيفي والقسم والخبرة السابقة' },
            { title: 'تعيين Buddy تلقائي', desc: 'اقتراح زميل مرشد من نفس القسم بناءً على التوافق الشخصي والمهني' },
            { title: 'جدولة ذكية', desc: 'ترتيب جلسات التعريف والتدريب تلقائياً بناءً على توفر الفريق والأولويات' },
            { title: 'تنبيهات استباقية', desc: 'إشعار المدير والموظف الجديد بالمهام المتأخرة مع اقتراح حلول بديلة' },
          ].map(item => (
            <div key={item.title} className="p-3 rounded-xl bg-gold/5 border border-gold/10">
              <h5 className="text-[10px] font-bold text-foreground mb-0.5">{item.title}</h5>
              <p className="text-[9px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
