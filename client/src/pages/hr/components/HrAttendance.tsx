import { useState } from 'react';
import { Clock, Search } from 'lucide-react';
import type { AttendanceRecord, Employee } from '../hrTypes';
import { MiniStat, Badge } from './HrShared';

interface Props { attendance: AttendanceRecord[]; employees: Employee[]; }

export default function HrAttendance({ attendance, employees }: Props) {
  const [date, setDate] = useState('2026-04-01');
  const [search, setSearch] = useState('');
  const dd = attendance.filter(a => a.date === date);
  const f = dd.filter(a => { const emp = employees.find(e => e.id === a.employee_id); return !search || (emp && (emp.name_ar.includes(search) || emp.name_en.toLowerCase().includes(search.toLowerCase()))); });
  const present = dd.filter(a => a.status === 'present').length;
  const pct = employees.length > 0 ? Math.round((present / employees.length) * 100) : 0;
  const sL: Record<string, string> = { present: 'حاضر', absent: 'غائب', late: 'متأخر', on_leave: 'إجازة', remote: 'عن بعد' };
  const sV = (s: string) => s === 'present' ? 'success' as const : s === 'absent' ? 'danger' as const : s === 'late' ? 'warning' as const : s === 'remote' ? 'info' as const : 'default' as const;

  return (<div className="space-y-4 sm:space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      <MiniStat label="نسبة الحضور" value={`${pct}%`} color={pct>=90?'text-success':'text-warning'} />
      <MiniStat label="حاضرون" value={present} color="text-success" />
      <MiniStat label="غائبون" value={dd.filter(a=>a.status==='absent').length} color="text-destructive" />
      <MiniStat label="متأخرون" value={dd.filter(a=>a.status==='late').length} color="text-warning" />
      <MiniStat label="إجازة/عطلة" value={dd.filter(a=>a.status==='holiday'||a.status==='weekend').length} />
    </div>
    <div className="flex flex-col sm:flex-row gap-2">
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground focus:border-gold/30 focus:outline-none" />
      <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="w-full pr-10 pl-4 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" /></div>
    </div>
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-gold/10 text-chrome text-xs"><th className="text-right py-3 px-2">الموظف</th><th className="text-right py-3 px-2">الحضور</th><th className="text-right py-3 px-2 hidden sm:table-cell">الانصراف</th><th className="text-right py-3 px-2 hidden md:table-cell">الساعات</th><th className="text-right py-3 px-2">الحالة</th></tr></thead>
    <tbody>{f.map(a => { const emp = employees.find(e => e.id === a.employee_id); return (
      <tr key={a.id} className="border-b border-gold/5 hover:bg-card/30"><td className="py-3 px-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs">{emp?.name_ar.charAt(0)||'?'}</div><div><p className="font-medium text-foreground text-sm">{emp?.name_ar||'—'}</p><p className="text-xs text-chrome">{emp?.department||''}</p></div></div></td><td className="py-3 px-2 text-foreground">{a.check_in||'—'}</td><td className="py-3 px-2 text-foreground hidden sm:table-cell">{a.check_out||'—'}</td><td className="py-3 px-2 text-foreground hidden md:table-cell">{a.working_hours?`${a.working_hours}h`:'—'}</td><td className="py-3 px-2"><Badge variant={sV(a.status)}>{sL[a.status]||a.status}</Badge></td></tr>);})}</tbody></table></div>
    {f.length===0 && <div className="text-center py-8"><Clock className="w-12 h-12 text-chrome/30 mx-auto mb-3" /><p className="text-sm text-chrome">لا توجد بيانات حضور لهذا التاريخ</p></div>}
  </div>);
}
