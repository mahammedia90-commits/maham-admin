/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Overview Dashboard
 * ═══════════════════════════════════════════════════════════════════════════
 * Executive dashboard: KPIs, department analytics, compliance alerts,
 * AI insights preview, government integration status, workforce analytics
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { motion } from 'framer-motion'
import {
  Users, UserCheck, Shield, Target, DollarSign, Briefcase, Building2,
  ShieldAlert, Brain, CalendarDays, Landmark, ShieldCheck, BadgeCheck,
  Globe, Fingerprint, CreditCard, Star, CheckCircle2, XCircle,
  TrendingUp, TrendingDown, Activity, Sparkles, Clock, AlertTriangle,
  ArrowUpRight, BarChart3, PieChart, Layers, UserPlus
} from 'lucide-react'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { MiniProgress, SeverityBadge, SectionCard, MetricBox, IntegrationCard, EmployeeAvatar } from './HrShared'
import type { Employee, LeaveRequest, ComplianceAlert, AIHRInsight } from '../hrTypes'
import { leaveTypeLabels, leaveTypeColors, employmentStatusLabels } from '../hrTypes'
import type { Department } from '../hrTypes'

interface HrOverviewProps {
  employees: Employee[]
  departments: Department[]
  leaves: LeaveRequest[]
  alerts: ComplianceAlert[]
  aiInsights: AIHRInsight[]
  stats: {
    total: number; active: number; saudis: number; saudizationRate: number
    totalPayroll: number; avgPerf: number; avgAttendance: number
    pendingLeaves: number; criticalAlerts: number; openPositions: number; gosiTotal: number
  }
  onTabChange: (tab: string) => void
  onLeaveAction: (id: string, action: 'approved' | 'rejected') => void
}

export default function HrOverview({
  employees, departments, leaves, alerts, aiInsights, stats, onTabChange, onLeaveAction
}: HrOverviewProps) {
  const pendingLeaves = leaves.filter(l => l.status === 'pending')
  const unacknowledgedAI = aiInsights.filter(i => !i.acknowledged)
  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length

  // Workforce distribution
  const statusDistribution = [
    { label: 'نشط', count: employees.filter(e => e.employment_status === 'active').length, color: 'success' },
    { label: 'تجربة', count: employees.filter(e => e.employment_status === 'probation').length, color: 'info' },
    { label: 'إجازة', count: employees.filter(e => e.employment_status === 'on_leave').length, color: 'warning' },
    { label: 'موقوف', count: employees.filter(e => e.employment_status === 'suspended').length, color: 'orange-500' },
  ]

  // Gender distribution
  const maleCount = employees.filter(e => e.gender === 'male').length
  const femaleCount = employees.filter(e => e.gender === 'female').length

  // Top performers
  const topPerformers = [...employees].sort((a, b) => b.performance_score - a.performance_score).slice(0, 5)

  // At-risk employees
  const atRiskEmployees = [...employees].sort((a, b) => b.ai_risk_score - a.ai_risk_score).filter(e => e.ai_risk_score > 15).slice(0, 5)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-5">
      {/* ─── KPI Stats Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <StatsCard title="إجمالي الموظفين" value={String(stats.total)} icon={Users} delay={0} />
        <StatsCard title="موظفون نشطون" value={String(stats.active)} icon={UserCheck} delay={0.05} />
        <StatsCard title="نسبة السعودة" value={`${stats.saudizationRate}%`} icon={Shield} trend={5} trendLabel="تحسن" delay={0.1} />
        <StatsCard title="متوسط الأداء" value={`${stats.avgPerf}%`} icon={Target} trend={3} trendLabel="تحسن" delay={0.15} />
        <StatsCard title="إجمالي الرواتب" value={formatCurrency(stats.totalPayroll)} icon={DollarSign} delay={0.2} />
        <StatsCard title="وظائف شاغرة" value={String(stats.openPositions)} icon={Briefcase} delay={0.25} />
      </div>

      {/* ─── Workforce Analytics Row ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Workforce Status */}
        <div className="glass-card p-3 sm:p-4">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
            <Activity size={14} className="text-gold" /> توزيع القوى العاملة
          </h4>
          <div className="space-y-2">
            {statusDistribution.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-12 shrink-0">{s.label}</span>
                <div className="flex-1"><MiniProgress value={(s.count / stats.total) * 100} color={s.color} /></div>
                <span className="text-[10px] font-mono text-foreground w-6 text-left">{s.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground">ذكور: {maleCount}</span>
              <span className="text-[9px] text-muted-foreground">إناث: {femaleCount}</span>
            </div>
            <span className="text-[9px] text-gold font-medium">{Math.round((femaleCount / stats.total) * 100)}% نساء</span>
          </div>
        </div>

        {/* Saudization Gauge */}
        <div className="glass-card p-3 sm:p-4">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
            <Shield size={14} className="text-gold" /> السعودة ونطاقات
          </h4>
          <div className="flex items-center justify-center mb-3">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface3" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                  className={stats.saudizationRate >= 70 ? 'text-success' : stats.saudizationRate >= 50 ? 'text-warning' : 'text-danger'}
                  strokeDasharray={`${stats.saudizationRate * 2.64} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold font-mono text-gold">{stats.saudizationRate}%</span>
                <span className="text-[8px] text-muted-foreground">سعودة</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MetricBox label="سعوديون" value={stats.saudis} color="success" />
            <MetricBox label="غير سعوديين" value={stats.total - stats.saudis} color="info" />
          </div>
          <div className="mt-2 p-2 rounded-lg bg-gold/5 border border-gold/10 text-center">
            <p className="text-[9px] text-gold font-bold flex items-center justify-center gap-1">
              <Star size={10} /> نطاق بلاتيني
            </p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="glass-card p-3 sm:p-4">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-success" /> أعلى أداءً
          </h4>
          <div className="space-y-2">
            {topPerformers.map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-gold w-4">{i + 1}</span>
                <EmployeeAvatar name={emp.full_name_ar} size="xs" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-foreground truncate">{emp.full_name_ar}</p>
                  <p className="text-[8px] text-muted-foreground truncate">{emp.department_name}</p>
                </div>
                <span className={cn('text-[10px] font-bold font-mono', emp.performance_score >= 90 ? 'text-success' : 'text-gold')}>
                  {emp.performance_score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Employees */}
        <div className="glass-card p-3 sm:p-4">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-danger" /> خطر المغادرة (AI)
          </h4>
          {atRiskEmployees.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">لا يوجد موظفون معرضون للمغادرة</p>
          ) : (
            <div className="space-y-2">
              {atRiskEmployees.map(emp => (
                <div key={emp.id} className="flex items-center gap-2">
                  <EmployeeAvatar name={emp.full_name_ar} size="xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-foreground truncate">{emp.full_name_ar}</p>
                    <p className="text-[8px] text-muted-foreground truncate">{emp.job_title_ar}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <MiniProgress value={emp.ai_risk_score} color={emp.ai_risk_score > 30 ? 'danger' : 'warning'} size="xs" />
                    <span className={cn('text-[10px] font-bold font-mono w-8 text-left', emp.ai_risk_score > 30 ? 'text-danger' : 'text-warning')}>
                      {emp.ai_risk_score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Departments + Compliance + AI ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Departments Overview */}
        <div className="lg:col-span-2 glass-card p-3 sm:p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Building2 size={16} className="text-gold" /> الأقسام والسعودة والأداء
            </h3>
            <span className="text-[10px] text-muted-foreground">{departments.length} قسم</span>
          </div>
          <div className="space-y-2.5">
            {departments.map(dept => (
              <div key={dept.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface2/30 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${dept.color}15`, border: `1px solid ${dept.color}30` }}>
                  <Building2 size={14} style={{ color: dept.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground truncate">{dept.name_ar}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground">{dept.employee_count} موظف</span>
                      <span className="text-[10px] text-muted-foreground hidden sm:inline">ميزانية: {formatCurrency(dept.budget)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <MiniProgress value={dept.saudization_rate}
                        color={dept.saudization_rate >= 70 ? 'success' : dept.saudization_rate >= 50 ? 'warning' : 'danger'} />
                    </div>
                    <span className={cn('text-[10px] font-mono shrink-0',
                      dept.saudization_rate >= 70 ? 'text-success' : dept.saudization_rate >= 50 ? 'text-warning' : 'text-danger')}>
                      {dept.saudization_rate}% سعودة
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">{dept.performance_avg}% أداء</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Alerts + AI */}
        <div className="space-y-3 sm:space-y-4">
          {/* Compliance Alerts */}
          <div className="glass-card p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldAlert size={16} className="text-danger" /> تنبيهات الامتثال
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger/10 text-danger">{criticalAlertsCount} عاجل</span>
            </div>
            <div className="space-y-2">
              {alerts.slice(0, 4).map(alert => (
                <div key={alert.id} className="p-2 rounded-lg bg-surface2/30 border border-border/20">
                  <div className="flex items-start gap-2">
                    <SeverityBadge severity={alert.severity} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-foreground truncate">{alert.title}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{alert.regulation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onTabChange('compliance')}
              className="w-full mt-2 h-8 rounded-lg bg-surface2/50 text-xs text-muted-foreground hover:text-foreground transition-all">
              عرض كل التنبيهات ←
            </button>
          </div>

          {/* AI Insights Preview */}
          <div className="glass-card p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Brain size={16} className="text-gold" /> رؤى الذكاء الاصطناعي
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold">{unacknowledgedAI.length} جديد</span>
            </div>
            <div className="space-y-2">
              {unacknowledgedAI.slice(0, 3).map(insight => (
                <div key={insight.id} className="p-2 rounded-lg bg-surface2/30 border border-border/20">
                  <div className="flex items-start gap-2">
                    <SeverityBadge severity={insight.severity} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-foreground truncate">{insight.title}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">ثقة: {insight.confidence}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onTabChange('ai_insights')}
              className="w-full mt-2 h-8 rounded-lg bg-surface2/50 text-xs text-muted-foreground hover:text-foreground transition-all">
              عرض كل الرؤى ←
            </button>
          </div>
        </div>
      </div>

      {/* ─── Pending Leaves + Government Integration ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Pending Leaves */}
        <div className="glass-card p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <CalendarDays size={16} className="text-warning" /> طلبات إجازة معلقة
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning">{pendingLeaves.length} معلق</span>
          </div>
          {pendingLeaves.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">لا توجد طلبات معلقة</p>
          ) : (
            <div className="space-y-2">
              {pendingLeaves.map(leave => (
                <div key={leave.id} className="p-2.5 rounded-lg bg-surface2/30 border border-border/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <EmployeeAvatar name={leave.employee_name} size="sm" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{leave.employee_name}</p>
                        <p className="text-[9px] text-muted-foreground">{leave.department}</p>
                      </div>
                    </div>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full', leaveTypeColors[leave.type])}>
                      {leaveTypeLabels[leave.type]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(leave.start_date)} → {formatDate(leave.end_date)} ({leave.days} يوم)
                    </p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onLeaveAction(leave.id, 'approved')}
                        className="p-1 rounded bg-success/10 text-success hover:bg-success/20 transition-all">
                        <CheckCircle2 size={14} />
                      </button>
                      <button onClick={() => onLeaveAction(leave.id, 'rejected')}
                        className="p-1 rounded bg-danger/10 text-danger hover:bg-danger/20 transition-all">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Government Integration Status */}
        <div className="glass-card p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Landmark size={16} className="text-gold" /> التكامل الحكومي
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success">7/8 متصل</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <IntegrationCard name="GOSI" label="التأمينات الاجتماعية" status="متصل" icon={ShieldCheck} color="success" />
            <IntegrationCard name="Qiwa" label="منصة قوى" status="متصل" icon={BadgeCheck} color="success" />
            <IntegrationCard name="Muqeem" label="منصة مقيم" status="متصل" icon={Globe} color="success" />
            <IntegrationCard name="Absher" label="أبشر" status="متصل" icon={Fingerprint} color="success" />
            <IntegrationCard name="WPS" label="حماية الأجور" status="نشط" icon={CreditCard} color="success" />
            <IntegrationCard name="MHRSD" label="وزارة الموارد" status="متوافق" icon={Landmark} color="success" />
            <IntegrationCard name="Nitaqat" label="نطاقات" status="بلاتيني" icon={Star} color="gold" />
            <IntegrationCard name="PDPL" label="حماية البيانات" status="تحديث مطلوب" icon={ShieldAlert} color="warning" />
          </div>
        </div>
      </div>

      {/* ─── Cross-Module Integration Status ───────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers size={16} className="text-gold" /> تكامل HR مع الأقسام الأخرى
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { name: 'المالية', status: 'مرتبط', desc: 'الرواتب، المصاريف', color: 'success' },
            { name: 'CRM', status: 'مرتبط', desc: 'بيانات الفريق', color: 'success' },
            { name: 'العمليات', status: 'مرتبط', desc: 'المهام، الجدولة', color: 'success' },
            { name: 'القانونية', status: 'مرتبط', desc: 'العقود، الامتثال', color: 'success' },
            { name: 'المشاريع', status: 'مرتبط', desc: 'تخصيص الموارد', color: 'success' },
            { name: 'الذكاء AI', status: 'نشط', desc: 'تحليلات، تنبؤات', color: 'gold' },
          ].map(mod => (
            <div key={mod.name} className="p-2.5 rounded-lg bg-surface2/30 border border-border/20 text-center">
              <p className="text-[10px] font-bold text-foreground">{mod.name}</p>
              <p className="text-[8px] text-muted-foreground mb-1">{mod.desc}</p>
              <span className={cn('text-[9px] px-2 py-0.5 rounded-full', `bg-${mod.color}/10 text-${mod.color}`)}>{mod.status}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
