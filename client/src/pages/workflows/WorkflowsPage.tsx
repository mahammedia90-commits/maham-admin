/*
 * Workflow Engine — محرك سير العمل والأتمتة
 * Route: /automation/workflows
 * Features: Visual workflow builder, automation rules, triggers, action logs
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Workflow, Zap, Play, Pause, CheckCircle, XCircle, Clock,
  AlertTriangle, Settings, Plus, ArrowRight, Mail, MessageSquare,
  Phone, Bell, Users, DollarSign, FileText, Shield, Activity,
  ToggleLeft, ToggleRight, Eye, Edit
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type WorkflowStatus = 'active' | 'paused' | 'draft' | 'error'
type TriggerType = 'lead_created' | 'deal_stage_changed' | 'payment_overdue' | 'followup_missed' | 'score_changed' | 'contract_signed' | 'time_based'
type ActionType = 'send_email' | 'send_whatsapp' | 'send_sms' | 'create_task' | 'assign_lead' | 'update_status' | 'notify_manager' | 'escalate' | 'create_followup'

interface WorkflowRule {
  id: number; name: string; description: string; status: WorkflowStatus
  trigger: { type: TriggerType; label: string; config: string }
  conditions: string[]
  actions: { type: ActionType; label: string; config: string }[]
  runs_total: number; runs_today: number; last_run: string | null
  success_rate: number; created_by: string
}

const TRIGGER_LABELS: Record<TriggerType, { label: string; icon: any; color: string }> = {
  lead_created: { label: 'عميل جديد', icon: Users, color: 'text-emerald-400' },
  deal_stage_changed: { label: 'تغيير مرحلة', icon: ArrowRight, color: 'text-blue-400' },
  payment_overdue: { label: 'تأخر دفع', icon: DollarSign, color: 'text-red-400' },
  followup_missed: { label: 'متابعة فائتة', icon: Clock, color: 'text-amber-400' },
  score_changed: { label: 'تغيير التقييم', icon: Zap, color: 'text-gold' },
  contract_signed: { label: 'توقيع عقد', icon: FileText, color: 'text-emerald-400' },
  time_based: { label: 'مجدول', icon: Clock, color: 'text-purple-400' },
}

const ACTION_ICONS: Record<ActionType, any> = {
  send_email: Mail, send_whatsapp: MessageSquare, send_sms: Phone,
  create_task: CheckCircle, assign_lead: Users, update_status: Settings,
  notify_manager: Bell, escalate: AlertTriangle, create_followup: Clock,
}

const MOCK_WORKFLOWS: WorkflowRule[] = [
  { id: 1, name: 'ترحيب عميل جديد', description: 'إرسال رسالة ترحيب تلقائية + تعيين مندوب + جدولة متابعة', status: 'active', trigger: { type: 'lead_created', label: 'عند إنشاء عميل جديد', config: 'جميع المصادر' }, conditions: ['نوع العميل: مستثمر أو تاجر', 'المدينة: الرياض أو جدة'], actions: [{ type: 'send_whatsapp', label: 'إرسال رسالة ترحيب واتساب', config: 'قالب: welcome_investor' }, { type: 'assign_lead', label: 'تعيين لأقل مندوب حمولة', config: 'Round Robin' }, { type: 'create_followup', label: 'جدولة متابعة بعد 24 ساعة', config: 'مكالمة هاتفية' }], runs_total: 156, runs_today: 3, last_run: '2026-04-02T08:15:00Z', success_rate: 98, created_by: 'نور كرم' },
  { id: 2, name: 'تصعيد الدفع المتأخر', description: 'تذكيرات تلقائية متدرجة + تصعيد للمدير + إشعار قانوني', status: 'active', trigger: { type: 'payment_overdue', label: 'عند تأخر الدفع', config: 'أكثر من 7 أيام' }, conditions: ['المبلغ المستحق > 50,000 ر.س', 'لم يتم الدفع الجزئي'], actions: [{ type: 'send_email', label: 'إرسال تذكير دفع', config: 'قالب: payment_reminder_1' }, { type: 'send_whatsapp', label: 'تذكير واتساب بعد 3 أيام', config: 'قالب: payment_reminder_wa' }, { type: 'notify_manager', label: 'إشعار المدير بعد 14 يوم', config: 'نور كرم' }, { type: 'escalate', label: 'تصعيد للقانوني بعد 30 يوم', config: 'القسم القانوني' }], runs_total: 42, runs_today: 1, last_run: '2026-04-02T07:00:00Z', success_rate: 95, created_by: 'نور كرم' },
  { id: 3, name: 'متابعة فائتة — إنذار', description: 'تنبيه الموظف + إشعار المدير + تسجيل في سجل الأداء', status: 'active', trigger: { type: 'followup_missed', label: 'عند تفويت متابعة', config: 'أكثر من 4 ساعات' }, conditions: ['حالة المتابعة: متأخرة', 'أولوية العميل: hot أو warm'], actions: [{ type: 'send_whatsapp', label: 'تنبيه الموظف فوراً', config: 'رسالة تحذيرية' }, { type: 'notify_manager', label: 'إشعار المدير بعد 8 ساعات', config: 'نور كرم' }, { type: 'update_status', label: 'تسجيل في سجل الأداء', config: 'warning_log' }], runs_total: 28, runs_today: 2, last_run: '2026-04-02T06:30:00Z', success_rate: 100, created_by: 'نور كرم' },
  { id: 4, name: 'ترقية العميل الذهبي', description: 'عند وصول AI Score > 85 — إشعار فوري + تعيين مندوب أول', status: 'active', trigger: { type: 'score_changed', label: 'عند تغيير AI Score', config: 'Score > 85' }, conditions: ['AI Score الجديد > 85', 'AI Score السابق < 85'], actions: [{ type: 'notify_manager', label: 'إشعار فوري للمدير', config: 'نور كرم + أحمد الشمري' }, { type: 'assign_lead', label: 'تعيين لمندوب أول', config: 'أحمد الشمري' }, { type: 'create_task', label: 'إنشاء مهمة: عرض VIP', config: 'أولوية عالية' }], runs_total: 12, runs_today: 0, last_run: '2026-04-01T14:00:00Z', success_rate: 100, created_by: 'نور كرم' },
  { id: 5, name: 'تقرير يومي تلقائي', description: 'إرسال ملخص يومي للمدير التنفيذي عند 8 مساءً', status: 'active', trigger: { type: 'time_based', label: 'يومياً الساعة 8:00 مساءً', config: 'cron: 0 20 * * *' }, conditions: [], actions: [{ type: 'send_email', label: 'إرسال التقرير اليومي', config: 'قالب: daily_report' }], runs_total: 45, runs_today: 0, last_run: '2026-04-01T20:00:00Z', success_rate: 100, created_by: 'نور كرم' },
  { id: 6, name: 'تأكيد توقيع العقد', description: 'عند توقيع عقد — إشعار المالية + إنشاء فاتورة + ترحيب', status: 'paused', trigger: { type: 'contract_signed', label: 'عند توقيع عقد', config: 'جميع أنواع العقود' }, conditions: ['حالة العقد: موقع'], actions: [{ type: 'send_email', label: 'ترحيب بالعميل الجديد', config: 'قالب: contract_welcome' }, { type: 'create_task', label: 'إنشاء فاتورة', config: 'القسم المالي' }, { type: 'notify_manager', label: 'إشعار المدير', config: 'نور كرم' }], runs_total: 8, runs_today: 0, last_run: '2026-03-28T12:00:00Z', success_rate: 87, created_by: 'نور كرم' },
]

const STATUS_MAP: Record<WorkflowStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'نشط', bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  paused: { label: 'متوقف', bg: 'bg-amber-500/15', text: 'text-amber-400' },
  draft: { label: 'مسودة', bg: 'bg-surface2', text: 'text-muted-foreground' },
  error: { label: 'خطأ', bg: 'bg-red-500/15', text: 'text-red-400' },
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(MOCK_WORKFLOWS)
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'paused'>('all')

  const filtered = useMemo(() => {
    if (activeTab === 'all') return workflows
    return workflows.filter(w => w.status === activeTab)
  }, [workflows, activeTab])

  const stats = useMemo(() => ({
    active: workflows.filter(w => w.status === 'active').length,
    totalRuns: workflows.reduce((s, w) => s + w.runs_today, 0),
    avgSuccess: Math.round(workflows.reduce((s, w) => s + w.success_rate, 0) / workflows.length),
    timeSaved: '45 ساعة',
  }), [workflows])

  const toggleStatus = (id: number) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: (w.status === 'active' ? 'paused' : 'active') as WorkflowStatus } : w))
    toast.success('تم تحديث حالة سير العمل')
  }

  return (
    <AdminLayout>
      <PageHeader
        title="محرك سير العمل"
        subtitle="أتمتة العمليات التجارية — تذكيرات — تصعيد — إشعارات ذكية"
        actions={
          <button onClick={() => toast.info('إنشاء سير عمل — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            سير عمل جديد
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="سير العمل النشطة" value={String(stats.active)} icon={Workflow} trend={0} trendLabel="حالياً" delay={0} />
        <StatsCard title="التشغيلات اليوم" value={String(stats.totalRuns)} icon={Play} trend={12} trendLabel="هذا اليوم" delay={0.1} />
        <StatsCard title="نسبة النجاح" value={`${stats.avgSuccess}%`} icon={CheckCircle} trend={2} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="الوقت الموفّر" value={stats.timeSaved} icon={Clock} trend={15} trendLabel="هذا الشهر" delay={0.3} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'paused'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === tab ? 'bg-gold/10 text-gold border border-gold/30' : 'glass-card text-muted-foreground hover:text-foreground'
          )}>
            {tab === 'all' ? `الكل (${workflows.length})` : tab === 'active' ? `نشط (${stats.active})` : `متوقف (${workflows.filter(w => w.status === 'paused').length})`}
          </button>
        ))}
      </div>

      {/* Workflow Cards */}
      <div className="space-y-4">
        {filtered.map((wf, i) => {
          const sc = STATUS_MAP[wf.status]
          const triggerConfig = TRIGGER_LABELS[wf.trigger.type]
          const TriggerIcon = triggerConfig.icon
          return (
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'glass-card p-5 transition-all',
                wf.status === 'active' ? 'hover:border-emerald-500/30' : 'hover:border-gold/30'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStatus(wf.id)} className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    wf.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-surface2 text-muted-foreground hover:text-foreground'
                  )}>
                    {wf.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{wf.name}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded', sc.bg, sc.text)}>{sc.label}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{wf.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="font-mono">{wf.runs_total} تشغيل</span>
                  <span className={cn('font-mono', wf.success_rate >= 95 ? 'text-emerald-400' : 'text-amber-400')}>{wf.success_rate}% نجاح</span>
                  <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Edit size={14} /></button>
                </div>
              </div>

              {/* Visual Flow */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {/* Trigger */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface2 border border-border flex-shrink-0">
                  <TriggerIcon className={cn('w-4 h-4', triggerConfig.color)} />
                  <div>
                    <div className="text-[10px] text-muted-foreground">المحفز</div>
                    <div className="text-[11px] text-foreground font-medium">{wf.trigger.label}</div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                {/* Conditions */}
                {wf.conditions.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface2 border border-amber-500/20 flex-shrink-0">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-[10px] text-muted-foreground">شروط</div>
                        <div className="text-[11px] text-amber-400 font-medium">{wf.conditions.length} شرط</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </>
                )}

                {/* Actions */}
                {wf.actions.map((action, j) => {
                  const ActionIcon = ACTION_ICONS[action.type] || Zap
                  return (
                    <div key={j} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/5 border border-gold/20 flex-shrink-0">
                        <ActionIcon className="w-4 h-4 text-gold" />
                        <div className="text-[11px] text-gold font-medium max-w-[120px] truncate">{action.label}</div>
                      </div>
                      {j < wf.actions.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                    </div>
                  )
                })}
              </div>

              {/* Conditions detail */}
              {wf.conditions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {wf.conditions.map((c, j) => (
                    <span key={j} className="text-[10px] bg-surface2 text-muted-foreground px-2 py-1 rounded">{c}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </AdminLayout>
  )
}
