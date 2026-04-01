import { useState } from 'react';
import { UserPlus, CheckCircle, Clock, ArrowRight, Users, FileText, Shield, Laptop, Eye } from 'lucide-react';
import type { OnboardingTask, Employee } from '../hrTypes';
import { SectionCard, MiniStat, Badge, ProgressBar, HrModal } from './HrShared';

interface Props { tasks: OnboardingTask[]; employees: Employee[]; }

export default function HrOnboarding({ tasks, employees }: Props) {
  const [selectedTask, setSelectedTask] = useState<OnboardingTask | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  const newEmployees = employees.filter(e => e.status === 'probation');
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const overdueTasks = 0; // placeholder
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const filtered = filterStatus ? tasks.filter(t => t.status === filterStatus) : tasks;

  const phases = [
    { name: 'ما قبل الانضمام', icon: <FileText className="w-5 h-5" />, desc: 'إعداد العقود والمستندات', color: 'text-info', items: ['إعداد العقد', 'فتح ملف GOSI', 'تسجيل في قوى', 'إعداد البريد'] },
    { name: 'اليوم الأول', icon: <UserPlus className="w-5 h-5" />, desc: 'الاستقبال والتعريف', color: 'text-gold', items: ['جولة في المكتب', 'تسليم الأجهزة', 'تعريف بالفريق', 'شرح السياسات'] },
    { name: 'الأسبوع الأول', icon: <Laptop className="w-5 h-5" />, desc: 'التدريب الأساسي', color: 'text-warning', items: ['تدريب الأنظمة', 'تدريب الأمان', 'تدريب PDPL', 'اجتماع المدير'] },
    { name: 'الشهر الأول', icon: <Shield className="w-5 h-5" />, desc: 'التقييم والمتابعة', color: 'text-success', items: ['تقييم أولي', 'خطة التطوير', 'تغذية راجعة', 'تأكيد التجربة'] },
  ];

  const statusBadge = (s: string) => {
    if (s === 'completed') return <Badge variant="success">مكتمل</Badge>;
    if (s === 'in_progress') return <Badge variant="warning">قيد التنفيذ</Badge>;
    if (s === 'overdue') return <Badge variant="danger">متأخر</Badge>;
    return <Badge variant="info">معلق</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        <MiniStat label="موظفون جدد" value={newEmployees.length} color="text-gold" />
        <MiniStat label="مكتملة" value={completedTasks} color="text-success" />
        <MiniStat label="قيد التنفيذ" value={inProgressTasks} color="text-warning" />
        <MiniStat label="معلقة" value={pendingTasks} color="text-info" />
        <MiniStat label="متأخرة" value={overdueTasks} color="text-destructive" />
      </div>

      <SectionCard title="تقدم التأهيل" icon={<UserPlus className="w-5 h-5" />}>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gold" strokeDasharray={`${completionRate * 2.51} 251`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-lg font-bold text-gold">{completionRate}%</span></div>
          </div>
          <div className="flex-1"><p className="text-sm font-bold text-foreground mb-2">نسبة الإنجاز</p><ProgressBar value={completedTasks} max={tasks.length || 1} /><p className="text-xs text-chrome mt-1">{completedTasks} من {tasks.length} مهمة</p></div>
        </div>
      </SectionCard>

      <SectionCard title="مراحل التأهيل" icon={<ArrowRight className="w-5 h-5" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {phases.map((phase, idx) => (
            <div key={phase.name} className="glass-card p-4 rounded-lg border border-border/50 hover:border-gold/20 transition-all">
              <div className="flex items-center gap-2 mb-3"><div className={`p-2 rounded-lg bg-card/50 ${phase.color}`}>{phase.icon}</div><div><p className="text-xs font-bold text-foreground">{phase.name}</p><p className="text-[10px] text-chrome">{phase.desc}</p></div></div>
              <div className="space-y-2">
                {phase.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs"><CheckCircle className={`w-3.5 h-3.5 shrink-0 ${i < 2 ? 'text-success' : 'text-muted'}`} /><span className={i < 2 ? 'text-foreground line-through' : 'text-chrome'}>{item}</span></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="الموظفون الجدد" icon={<Users className="w-5 h-5" />}>
        {newEmployees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {newEmployees.map(emp => {
              const empTasks = tasks.filter(t => t.employee_id === emp.id);
              const empDone = empTasks.filter(t => t.status === 'completed').length;
              const empPct = empTasks.length > 0 ? Math.round((empDone / empTasks.length) * 100) : 0;
              return (
                <div key={emp.id} className="glass-card p-3 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">{emp.name_ar.charAt(0)}</div><div><p className="text-xs font-bold text-foreground">{emp.name_ar}</p><p className="text-[10px] text-chrome">{emp.position}</p></div></div>
                  <ProgressBar value={empDone} max={empTasks.length || 1} /><p className="text-[10px] text-chrome mt-1">{empPct}% — {empDone}/{empTasks.length}</p>
                  <div className="flex justify-between text-[10px] mt-2"><span className="text-chrome">الانضمام</span><span className="text-foreground">{emp.join_date}</span></div>
                </div>
              );
            })}
          </div>
        ) : <p className="text-sm text-chrome text-center py-6">لا يوجد موظفون في فترة التجربة</p>}
      </SectionCard>

      <SectionCard title="مهام التأهيل" icon={<CheckCircle className="w-5 h-5" />}>
        <div className="flex gap-1 flex-wrap mb-4">
          {[{ v: '', l: 'الكل' }, { v: 'completed', l: 'مكتمل' }, { v: 'in_progress', l: 'قيد التنفيذ' }, { v: 'pending', l: 'معلق' }, ].map(s => (
            <button key={s.v} onClick={() => setFilterStatus(s.v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s.v ? 'bg-gold/10 text-gold border border-gold/30' : 'text-chrome hover:bg-muted'}`}>{s.l}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border">
              <th className="text-right py-2 px-2 text-chrome font-medium">المهمة</th>
              <th className="text-right py-2 px-2 text-chrome font-medium hidden sm:table-cell">الموظف</th>
              <th className="text-right py-2 px-2 text-chrome font-medium hidden md:table-cell">المسؤول</th>
              <th className="text-right py-2 px-2 text-chrome font-medium">الحالة</th>
              <th className="text-right py-2 px-2 text-chrome font-medium hidden lg:table-cell">الاستحقاق</th>
              <th className="text-center py-2 px-2 text-chrome font-medium">عرض</th>
            </tr></thead>
            <tbody>
              {filtered.map(task => (
                <tr key={task.id} className="border-b border-border/50 hover:bg-card/30">
                  <td className="py-2 px-2"><p className="font-medium text-foreground">{task.task}</p><p className="text-[10px] text-chrome">{task.step}</p></td>
                  <td className="py-2 px-2 text-chrome hidden sm:table-cell">{task.employee_name}</td>
                  <td className="py-2 px-2 text-chrome hidden md:table-cell">{task.assigned_to}</td>
                  <td className="py-2 px-2">{statusBadge(task.status)}</td>
                  <td className="py-2 px-2 text-chrome hidden lg:table-cell">{task.due_date}</td>
                  <td className="py-2 px-2 text-center"><button onClick={() => setSelectedTask(task)} className="p-1 rounded hover:bg-gold/10 text-gold"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <HrModal open={!!selectedTask} onClose={() => setSelectedTask(null)} title="تفاصيل مهمة التأهيل" size="md">
        {selectedTask && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-chrome mb-1">المهمة</p><p className="text-sm font-bold text-foreground">{selectedTask.task}</p></div>
              <div><p className="text-xs text-chrome mb-1">الحالة</p>{statusBadge(selectedTask.status)}</div>
              <div><p className="text-xs text-chrome mb-1">الموظف</p><p className="text-sm text-foreground">{selectedTask.employee_name}</p></div>
              <div><p className="text-xs text-chrome mb-1">المسؤول</p><p className="text-sm text-foreground">{selectedTask.assigned_to}</p></div>
              <div><p className="text-xs text-chrome mb-1">المرحلة</p><p className="text-sm text-foreground">{selectedTask.step}</p></div>
              <div><p className="text-xs text-chrome mb-1">الاستحقاق</p><p className="text-sm text-foreground">{selectedTask.due_date}</p></div>
            </div>
            {selectedTask.description && <div><p className="text-xs text-chrome mb-1">الوصف</p><p className="text-sm text-foreground">{selectedTask.description}</p></div>}
            <div className="flex gap-2">
              {selectedTask.status !== 'completed' && <button className="px-4 py-2 bg-success/10 text-success rounded-lg text-xs font-medium hover:bg-success/20">تحديد كمكتمل</button>}
              <button className="px-4 py-2 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/80">إعادة تعيين</button>
            </div>
          </div>
        )}
      </HrModal>
    </div>
  );
}
