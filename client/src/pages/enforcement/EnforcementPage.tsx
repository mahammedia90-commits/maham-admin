/*
 * Employee Enforcement System — نظام متابعة أداء الموظفين
 * Route: /hr/enforcement
 * Features: Daily reports, warning system, KPI tracking, SLA compliance
 */
import { useState, useMemo } from 'react'
import {
  Users, AlertTriangle, CheckCircle2, Clock, TrendingUp, TrendingDown,
  Shield, Star, Target, Flame, Calendar, FileText, Eye, MoreHorizontal,
  ChevronDown, Phone, DollarSign, Zap, Award, XCircle, MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type WarningLevel = 'green' | 'yellow' | 'orange' | 'red'
type EmployeeStatus = 'active' | 'probation' | 'warning' | 'suspended'

interface EmployeePerformance {
  id: number
  name: string
  role: string
  department: string
  avatar_initial: string
  status: EmployeeStatus
  warning_level: WarningLevel
  warnings_count: number
  kpis: {
    leads_contacted_today: number
    leads_target_daily: number
    followups_completed: number
    followups_overdue: number
    deals_closed_month: number
    deals_target_month: number
    revenue_month: number
    revenue_target_month: number
    avg_response_time_hours: number
    sla_compliance_pct: number
    conversion_rate: number
  }
  daily_report_submitted: boolean
  last_activity: string
  streak_days: number
}

interface Warning {
  id: number
  employee_id: number
  employee_name: string
  type: 'verbal' | 'written' | 'final' | 'suspension'
  reason: string
  issued_date: string
  issued_by: string
  status: 'active' | 'resolved' | 'expired'
}

const MOCK_EMPLOYEES: EmployeePerformance[] = [
  { id: 1, name: 'أحمد الشمري', role: 'مندوب مبيعات أول', department: 'المبيعات', avatar_initial: 'أ', status: 'active', warning_level: 'green', warnings_count: 0, kpis: { leads_contacted_today: 8, leads_target_daily: 10, followups_completed: 5, followups_overdue: 0, deals_closed_month: 4, deals_target_month: 5, revenue_month: 1200000, revenue_target_month: 1500000, avg_response_time_hours: 1.5, sla_compliance_pct: 95, conversion_rate: 32 }, daily_report_submitted: true, last_activity: '2026-04-02T08:30:00Z', streak_days: 12 },
  { id: 2, name: 'سارة القحطاني', role: 'مندوبة مبيعات', department: 'المبيعات', avatar_initial: 'س', status: 'active', warning_level: 'yellow', warnings_count: 1, kpis: { leads_contacted_today: 5, leads_target_daily: 10, followups_completed: 3, followups_overdue: 2, deals_closed_month: 2, deals_target_month: 5, revenue_month: 395000, revenue_target_month: 1000000, avg_response_time_hours: 3.2, sla_compliance_pct: 72, conversion_rate: 18 }, daily_report_submitted: false, last_activity: '2026-04-01T16:00:00Z', streak_days: 0 },
  { id: 3, name: 'محمد العنزي', role: 'مندوب مبيعات', department: 'المبيعات', avatar_initial: 'م', status: 'warning', warning_level: 'orange', warnings_count: 2, kpis: { leads_contacted_today: 2, leads_target_daily: 10, followups_completed: 1, followups_overdue: 4, deals_closed_month: 1, deals_target_month: 5, revenue_month: 95000, revenue_target_month: 1000000, avg_response_time_hours: 8.5, sla_compliance_pct: 45, conversion_rate: 8 }, daily_report_submitted: false, last_activity: '2026-04-01T11:00:00Z', streak_days: 0 },
  { id: 4, name: 'ليلى الحربي', role: 'مندوبة مبيعات', department: 'المبيعات', avatar_initial: 'ل', status: 'active', warning_level: 'green', warnings_count: 0, kpis: { leads_contacted_today: 12, leads_target_daily: 10, followups_completed: 7, followups_overdue: 0, deals_closed_month: 6, deals_target_month: 5, revenue_month: 1800000, revenue_target_month: 1500000, avg_response_time_hours: 0.8, sla_compliance_pct: 98, conversion_rate: 38 }, daily_report_submitted: true, last_activity: '2026-04-02T09:15:00Z', streak_days: 28 },
]

const MOCK_WARNINGS: Warning[] = [
  { id: 1, employee_id: 2, employee_name: 'سارة القحطاني', type: 'verbal', reason: 'تأخر في تقديم التقرير اليومي 3 أيام متتالية', issued_date: '2026-03-28', issued_by: 'نور كرم', status: 'active' },
  { id: 2, employee_id: 3, employee_name: 'محمد العنزي', type: 'verbal', reason: 'عدم الالتزام بـ SLA — 4 متابعات متأخرة', issued_date: '2026-03-20', issued_by: 'نور كرم', status: 'active' },
  { id: 3, employee_id: 3, employee_name: 'محمد العنزي', type: 'written', reason: 'معدل تحويل أقل من 10% لمدة شهرين متتاليين', issued_date: '2026-03-30', issued_by: 'نور كرم', status: 'active' },
]

function formatSAR(amount: number) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
  return amount.toLocaleString('ar-SA')
}

function ProgressBar({ value, max, color = 'bg-[#c9a84c]' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round(value / max * 100))
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#252535] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? color : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-[#5a5a78] w-8 text-left">{pct}%</span>
    </div>
  )
}

function WarningBadge({ level }: { level: WarningLevel }) {
  const config = { green: { label: 'أخضر', bg: 'bg-emerald-500/15', text: 'text-emerald-400' }, yellow: { label: 'تحذير', bg: 'bg-amber-500/15', text: 'text-amber-400' }, orange: { label: 'خطر', bg: 'bg-orange-500/15', text: 'text-orange-400' }, red: { label: 'حرج', bg: 'bg-red-500/15', text: 'text-red-400' } }
  const c = config[level]
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}><Shield className="w-3 h-3" />{c.label}</span>
}

export default function EnforcementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'warnings' | 'daily'>('overview')
  const [employees] = useState(MOCK_EMPLOYEES)
  const [warnings] = useState(MOCK_WARNINGS)

  const teamStats = useMemo(() => ({
    totalEmployees: employees.length,
    reportsSubmitted: employees.filter(e => e.daily_report_submitted).length,
    overdueFollowups: employees.reduce((s, e) => s + e.kpis.followups_overdue, 0),
    avgSLA: Math.round(employees.reduce((s, e) => s + e.kpis.sla_compliance_pct, 0) / employees.length),
    totalRevenue: employees.reduce((s, e) => s + e.kpis.revenue_month, 0),
    totalTarget: employees.reduce((s, e) => s + e.kpis.revenue_target_month, 0),
    activeWarnings: warnings.filter(w => w.status === 'active').length,
  }), [employees, warnings])

  const tabs = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: Users },
    { id: 'warnings' as const, label: 'الإنذارات', icon: AlertTriangle, count: teamStats.activeWarnings },
    { id: 'daily' as const, label: 'التقارير اليومية', icon: FileText, count: employees.length - teamStats.reportsSubmitted },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2f0]">نظام متابعة الأداء</h1>
          <p className="text-[#5a5a78] text-sm mt-1">مراقبة أداء فريق المبيعات — KPIs، SLA، تقارير يومية، إنذارات</p>
        </div>
        <Button className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-sm"><FileText className="w-4 h-4 ml-2" />تقرير شامل</Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'الفريق', value: teamStats.totalEmployees, icon: Users, color: 'text-[#c9a84c]' },
          { label: 'تقارير اليوم', value: `${teamStats.reportsSubmitted}/${employees.length}`, icon: FileText, color: teamStats.reportsSubmitted === employees.length ? 'text-emerald-400' : 'text-red-400' },
          { label: 'متابعات متأخرة', value: teamStats.overdueFollowups, icon: AlertTriangle, color: teamStats.overdueFollowups > 0 ? 'text-red-400' : 'text-emerald-400' },
          { label: 'متوسط SLA', value: `${teamStats.avgSLA}%`, icon: Target, color: teamStats.avgSLA >= 80 ? 'text-emerald-400' : 'text-amber-400' },
          { label: 'إيرادات الشهر', value: `${formatSAR(teamStats.totalRevenue)} ر.س`, icon: DollarSign, color: 'text-[#c9a84c]' },
          { label: 'الهدف', value: `${Math.round(teamStats.totalRevenue / teamStats.totalTarget * 100)}%`, icon: TrendingUp, color: teamStats.totalRevenue >= teamStats.totalTarget ? 'text-emerald-400' : 'text-amber-400' },
          { label: 'إنذارات نشطة', value: teamStats.activeWarnings, icon: Shield, color: teamStats.activeWarnings > 0 ? 'text-red-400' : 'text-emerald-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-[#5a5a78]">{s.label}</span>
            </div>
            <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#252535]">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-[#5a5a78] hover:text-[#e2e2f0]'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
              {tab.count !== undefined && tab.count > 0 && <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full font-mono">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {employees.sort((a, b) => b.kpis.revenue_month - a.kpis.revenue_month).map((emp, rank) => (
            <div key={emp.id} className={`bg-[#0f0f1a] border rounded-xl p-5 ${emp.warning_level === 'red' ? 'border-red-500/50' : emp.warning_level === 'orange' ? 'border-orange-500/30' : emp.warning_level === 'yellow' ? 'border-amber-500/20' : 'border-[#252535]'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-lg font-bold">{emp.avatar_initial}</div>
                    {rank === 0 && <Award className="w-5 h-5 text-[#c9a84c] absolute -top-1 -right-1" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#e2e2f0] font-bold">{emp.name}</span>
                      <WarningBadge level={emp.warning_level} />
                      {emp.streak_days >= 7 && <span className="text-xs bg-[#c9a84c]/15 text-[#c9a84c] px-1.5 py-0.5 rounded flex items-center gap-0.5"><Flame className="w-3 h-3" />{emp.streak_days}d</span>}
                    </div>
                    <span className="text-sm text-[#5a5a78]">{emp.role}</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-[#5a5a78]">إيرادات الشهر</div>
                  <div className="text-lg font-bold font-mono text-[#c9a84c]">{formatSAR(emp.kpis.revenue_month)} ر.س</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div>
                  <div className="text-xs text-[#5a5a78] mb-1">تواصل اليوم</div>
                  <div className="text-sm text-[#e2e2f0] font-mono">{emp.kpis.leads_contacted_today}/{emp.kpis.leads_target_daily}</div>
                  <ProgressBar value={emp.kpis.leads_contacted_today} max={emp.kpis.leads_target_daily} />
                </div>
                <div>
                  <div className="text-xs text-[#5a5a78] mb-1">متابعات مكتملة</div>
                  <div className="text-sm text-[#e2e2f0] font-mono">{emp.kpis.followups_completed}</div>
                  {emp.kpis.followups_overdue > 0 && <span className="text-xs text-red-400">{emp.kpis.followups_overdue} متأخرة</span>}
                </div>
                <div>
                  <div className="text-xs text-[#5a5a78] mb-1">صفقات الشهر</div>
                  <div className="text-sm text-[#e2e2f0] font-mono">{emp.kpis.deals_closed_month}/{emp.kpis.deals_target_month}</div>
                  <ProgressBar value={emp.kpis.deals_closed_month} max={emp.kpis.deals_target_month} />
                </div>
                <div>
                  <div className="text-xs text-[#5a5a78] mb-1">SLA</div>
                  <div className={`text-sm font-mono font-bold ${emp.kpis.sla_compliance_pct >= 80 ? 'text-emerald-400' : emp.kpis.sla_compliance_pct >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{emp.kpis.sla_compliance_pct}%</div>
                  <ProgressBar value={emp.kpis.sla_compliance_pct} max={100} />
                </div>
                <div>
                  <div className="text-xs text-[#5a5a78] mb-1">معدل التحويل</div>
                  <div className={`text-sm font-mono font-bold ${emp.kpis.conversion_rate >= 25 ? 'text-emerald-400' : emp.kpis.conversion_rate >= 15 ? 'text-amber-400' : 'text-red-400'}`}>{emp.kpis.conversion_rate}%</div>
                </div>
                <div>
                  <div className="text-xs text-[#5a5a78] mb-1">وقت الاستجابة</div>
                  <div className={`text-sm font-mono ${emp.kpis.avg_response_time_hours <= 2 ? 'text-emerald-400' : emp.kpis.avg_response_time_hours <= 4 ? 'text-amber-400' : 'text-red-400'}`}>{emp.kpis.avg_response_time_hours}h</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warnings Tab */}
      {activeTab === 'warnings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#e2e2f0]">سجل الإنذارات</h3>
            <Button className="bg-red-600 hover:bg-red-700 text-white text-sm"><AlertTriangle className="w-4 h-4 ml-2" />إصدار إنذار</Button>
          </div>
          {warnings.length === 0 ? (
            <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#e2e2f0]">لا توجد إنذارات نشطة</h3>
            </div>
          ) : (
            <div className="space-y-3">
              {warnings.map(w => (
                <div key={w.id} className={`bg-[#0f0f1a] border rounded-lg p-4 flex items-center justify-between ${w.type === 'final' || w.type === 'suspension' ? 'border-red-500/50' : w.type === 'written' ? 'border-orange-500/30' : 'border-amber-500/20'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${w.type === 'final' || w.type === 'suspension' ? 'bg-red-500/15 text-red-400' : w.type === 'written' ? 'bg-orange-500/15 text-orange-400' : 'bg-amber-500/15 text-amber-400'}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#e2e2f0]">{w.employee_name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${w.type === 'verbal' ? 'bg-amber-500/15 text-amber-400' : w.type === 'written' ? 'bg-orange-500/15 text-orange-400' : 'bg-red-500/15 text-red-400'}`}>
                          {w.type === 'verbal' ? 'شفهي' : w.type === 'written' ? 'كتابي' : w.type === 'final' ? 'نهائي' : 'إيقاف'}
                        </span>
                      </div>
                      <p className="text-xs text-[#5a5a78]">{w.reason}</p>
                      <div className="text-xs text-[#5a5a78] mt-1">بواسطة {w.issued_by} · {new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric' }).format(new Date(w.issued_date))}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${w.status === 'active' ? 'bg-red-500/15 text-red-400' : w.status === 'resolved' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#252535] text-[#5a5a78]'}`}>
                    {w.status === 'active' ? 'نشط' : w.status === 'resolved' ? 'تم الحل' : 'منتهي'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Daily Reports Tab */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#e2e2f0]">التقارير اليومية — {new Intl.DateTimeFormat('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</h3>
          <div className="space-y-3">
            {employees.map(emp => (
              <div key={emp.id} className={`bg-[#0f0f1a] border rounded-lg p-4 flex items-center justify-between ${emp.daily_report_submitted ? 'border-emerald-500/20' : 'border-red-500/30 bg-red-500/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${emp.daily_report_submitted ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                    {emp.daily_report_submitted ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#e2e2f0]">{emp.name}</span>
                    <div className="text-xs text-[#5a5a78]">{emp.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {emp.daily_report_submitted ? (
                    <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded">تم التسليم</span>
                  ) : (
                    <>
                      <span className="text-xs bg-red-500/15 text-red-400 px-2 py-1 rounded font-bold">لم يُسلّم</span>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs"><MessageSquare className="w-3 h-3 ml-1" />تذكير</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
