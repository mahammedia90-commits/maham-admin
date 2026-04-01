import { Users, UserCheck, Clock, AlertTriangle, TrendingUp, Shield, Brain, Calendar, DollarSign, FileText, Award } from 'lucide-react';
import type { Employee, LeaveRequest, ComplianceItem, AIHRInsight } from '../hrTypes';
import { statusLabels, statusColors } from '../hrTypes';
import { SectionCard, MiniStat, ProgressBar, Badge } from './HrShared';

interface Props { employees: Employee[]; leaves: LeaveRequest[]; compliance: ComplianceItem[]; aiInsights: AIHRInsight[]; onTabChange: (t: string) => void; }

export default function HrOverview({ employees, leaves, compliance, aiInsights, onTabChange }: Props) {
  const active = employees.filter(e => e.status === 'active').length;
  const saudiCount = employees.filter(e => e.is_saudi).length;
  const saudiPct = Math.round((saudiCount / employees.length) * 100);
  const totalPayroll = employees.reduce((s, e) => s + e.salary + e.housing_allowance + e.transport_allowance, 0);
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const compWarnings = compliance.filter(c => c.status === 'warning' || c.status === 'violation').length;
  const criticalAI = aiInsights.filter(i => i.priority === 'critical' || i.priority === 'high').length;
  const avgPerf = Math.round(employees.reduce((s, e) => s + (e.performance_score || 0), 0) / employees.length);
  const deptCounts: Record<string, number> = {};
  employees.forEach(e => { deptCounts[e.department] = (deptCounts[e.department] || 0) + 1; });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <MiniStat label="إجمالي الموظفين" value={employees.length} sub={`${active} نشط`} />
        <MiniStat label="نسبة السعودة" value={`${saudiPct}%`} sub={`${saudiCount}/${employees.length}`} color={saudiPct >= 85 ? 'text-success' : 'text-warning'} />
        <MiniStat label="إجمالي الرواتب" value={`${(totalPayroll / 1000).toFixed(0)}K`} sub="ريال/شهر" />
        <MiniStat label="متوسط الأداء" value={`${avgPerf}%`} color={avgPerf >= 90 ? 'text-success' : 'text-gold'} />
        <MiniStat label="إجازات معلقة" value={pendingLeaves} color={pendingLeaves > 0 ? 'text-warning' : 'text-success'} />
        <MiniStat label="تنبيهات AI" value={criticalAI} color={criticalAI > 0 ? 'text-destructive' : 'text-success'} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="توزيع الأقسام" icon={<Users className="w-5 h-5" />}>
          <div className="space-y-3">
            {Object.entries(deptCounts).sort((a, b) => b[1] - a[1]).map(([dept, count]) => (
              <div key={dept}><div className="flex justify-between text-sm mb-1"><span className="text-foreground">{dept}</span><span className="text-chrome">{count}</span></div><ProgressBar value={count} max={Math.max(...Object.values(deptCounts))} /></div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="حالة الموظفين" icon={<UserCheck className="w-5 h-5" />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(statusLabels) as [string, string][]).map(([key, label]) => {
              const count = employees.filter(e => e.status === key).length;
              return count > 0 ? <div key={key} className={`p-3 rounded-lg border text-center ${statusColors[key as keyof typeof statusColors]}`}><p className="text-lg font-bold">{count}</p><p className="text-xs">{label}</p></div> : null;
            })}
          </div>
        </SectionCard>
        <SectionCard title="تنبيهات الامتثال" icon={<Shield className="w-5 h-5" />} action={<button onClick={() => onTabChange('compliance')} className="text-xs text-gold hover:underline">عرض الكل</button>}>
          <div className="space-y-2">
            {compliance.filter(c => c.status !== 'compliant').slice(0, 4).map(c => (
              <div key={c.id} className="flex items-start gap-2 p-2 rounded-lg bg-card/30">
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${c.status === 'violation' ? 'text-destructive' : 'text-warning'}`} />
                <div className="min-w-0"><p className="text-sm text-foreground truncate">{c.description}</p><p className="text-xs text-chrome">{c.system}</p></div>
              </div>
            ))}
            {compWarnings === 0 && <p className="text-sm text-success text-center py-4">جميع الأنظمة متوافقة</p>}
          </div>
        </SectionCard>
        <SectionCard title="رؤى الذكاء الاصطناعي" icon={<Brain className="w-5 h-5" />} action={<button onClick={() => onTabChange('ai')} className="text-xs text-gold hover:underline">عرض الكل</button>}>
          <div className="space-y-2">
            {aiInsights.filter(i => i.status === 'new').slice(0, 4).map(ins => (
              <div key={ins.id} className="flex items-start gap-2 p-2 rounded-lg bg-card/30">
                <Brain className={`w-4 h-4 mt-0.5 shrink-0 ${ins.priority === 'critical' ? 'text-destructive' : ins.priority === 'high' ? 'text-warning' : 'text-info'}`} />
                <div className="min-w-0"><p className="text-sm text-foreground truncate">{ins.title}</p><div className="flex items-center gap-2 mt-1"><Badge variant={ins.priority === 'critical' ? 'danger' : ins.priority === 'high' ? 'warning' : 'info'}>{ins.priority}</Badge><span className="text-xs text-chrome">ثقة {ins.confidence}%</span></div></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard title="إجراءات سريعة" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[{ icon: <Users className="w-5 h-5" />, label: 'الموظفون', tab: 'employees' }, { icon: <Calendar className="w-5 h-5" />, label: 'التوظيف', tab: 'recruitment' }, { icon: <Clock className="w-5 h-5" />, label: 'الحضور', tab: 'attendance' }, { icon: <DollarSign className="w-5 h-5" />, label: 'الرواتب', tab: 'payroll' }, { icon: <Award className="w-5 h-5" />, label: 'الأداء', tab: 'performance' }, { icon: <FileText className="w-5 h-5" />, label: 'المستندات', tab: 'documents' }].map(item => (
            <button key={item.tab} onClick={() => onTabChange(item.tab)} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card/30 hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all"><span className="text-gold">{item.icon}</span><span className="text-xs text-foreground">{item.label}</span></button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
