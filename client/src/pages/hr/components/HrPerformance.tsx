import { useState } from 'react';
import { TrendingUp, Star, Search } from 'lucide-react';
import type { Employee } from '../hrTypes';
import { SectionCard, MiniStat, Badge, ProgressBar } from './HrShared';

interface Props { employees: Employee[]; }

export default function HrPerformance({ employees }: Props) {
  const [search, setSearch] = useState('');
  const [deptF, setDeptF] = useState('all');
  const depts = Array.from(new Set(employees.map(e => e.department)));
  const filtered = employees.filter(e => (deptF==='all'||e.department===deptF) && (!search||e.name_ar.includes(search)||e.name_en.toLowerCase().includes(search.toLowerCase())));
  const avg = Math.round(employees.reduce((s,e) => s+(e.performance_score||0), 0)/employees.length);
  const sorted = [...filtered].sort((a,b) => (b.performance_score||0)-(a.performance_score||0));
  const pC = (s:number) => s>=90?'text-success':s>=70?'text-gold':s>=50?'text-warning':'text-destructive';
  const pB = (s:number) => s>=90?'bg-success':s>=70?'bg-gold':s>=50?'bg-warning':'bg-destructive';
  const pL = (s:number) => s>=90?'متميز':s>=80?'جيد جداً':s>=70?'جيد':s>=60?'مقبول':'يحتاج تحسين';
  const dA: Record<string,number> = {};
  depts.forEach(d => { const de=employees.filter(e=>e.department===d); dA[d]=Math.round(de.reduce((s,e)=>s+(e.performance_score||0),0)/de.length); });

  return (<div className="space-y-4 sm:space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"><MiniStat label="متوسط الأداء" value={`${avg}%`} color={pC(avg)} /><MiniStat label="متميزون (90%+)" value={employees.filter(e=>(e.performance_score||0)>=90).length} color="text-success" /><MiniStat label="يحتاجون تحسين" value={employees.filter(e=>(e.performance_score||0)<60).length} color="text-destructive" /><MiniStat label="الإجمالي" value={employees.length} /></div>
    <SectionCard title="أداء الأقسام" icon={<TrendingUp className="w-5 h-5" />}><div className="space-y-3">{Object.entries(dA).sort((a,b)=>b[1]-a[1]).map(([d,s])=>(<div key={d}><div className="flex justify-between text-sm mb-1"><span className="text-foreground">{d}</span><span className={pC(s)}>{s}% — {pL(s)}</span></div><ProgressBar value={s} max={100} color={pB(s)} /></div>))}</div></SectionCard>
    <div className="flex flex-col sm:flex-row gap-2"><div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." className="w-full pr-10 pl-4 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" /></div><select value={deptF} onChange={e=>setDeptF(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground"><option value="all">كل الأقسام</option>{depts.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{sorted.map((emp,i)=>(<div key={emp.id} className="glass-card p-4 rounded-xl border border-gold/10"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="relative"><div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">{emp.name_ar.charAt(0)}</div>{i<3&&<div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold flex items-center justify-center"><Star className="w-3 h-3 text-black" /></div>}</div><div><p className="font-semibold text-foreground text-sm">{emp.name_ar}</p><p className="text-xs text-chrome">{emp.department}</p></div></div><p className={`text-xl font-bold ${pC(emp.performance_score||0)}`}>{emp.performance_score||0}%</p></div><ProgressBar value={emp.performance_score||0} max={100} color={pB(emp.performance_score||0)} /><div className="flex justify-between mt-2 text-xs"><span className="text-chrome">{pL(emp.performance_score||0)}</span><Badge variant={(emp.performance_score||0)>=90?'success':(emp.performance_score||0)>=70?'info':'warning'}>{emp.position}</Badge></div></div>))}</div>
  </div>);
}
