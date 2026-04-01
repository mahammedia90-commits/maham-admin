import { useState } from 'react';
import { DollarSign, Download, Send, CheckCircle, Clock, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Employee, PayrollRecord } from '../hrTypes';
import { SectionCard, MiniStat, Badge } from './HrShared';

interface Props { employees: Employee[]; payroll: PayrollRecord[]; }

export default function HrPayroll({ employees, payroll }: Props) {
  const [month, setMonth] = useState('2026-03');
  const [search, setSearch] = useState('');
  const md = payroll.filter(p => p.month === month);
  const f = md.filter(p => p.employee_name.includes(search));
  const tNet = md.reduce((s,p) => s + p.net_salary, 0);
  const tBasic = md.reduce((s,p) => s + p.basic_salary, 0);
  const tHousing = md.reduce((s,p) => s + p.housing_allowance, 0);
  const tTransport = md.reduce((s,p) => s + p.transport_allowance, 0);
  const tOvertime = md.reduce((s,p) => s + p.overtime_pay, 0);
  const tGosi = md.reduce((s,p) => s + p.gosi_deduction, 0);
  const tDed = md.reduce((s,p) => s + p.other_deductions + p.tax_deduction, 0);
  const tGross = tBasic + tHousing + tTransport + tOvertime;

  return (<div className="space-y-4 sm:space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      <MiniStat label="صافي الرواتب" value={`${(tNet/1000).toFixed(0)}K`} sub="ريال" />
      <MiniStat label="إجمالي الرواتب" value={`${(tGross/1000).toFixed(0)}K`} sub="ريال" />
      <MiniStat label="GOSI" value={`${(tGosi/1000).toFixed(1)}K`} sub="موظف+صاحب عمل" />
      <MiniStat label="الخصومات" value={`${(tDed/1000).toFixed(1)}K`} color="text-destructive" />
      <MiniStat label="تم الدفع" value={md.filter(p=>p.status==='paid').length} color="text-success" />
      <MiniStat label="معلق" value={md.filter(p=>p.status==='pending').length} color="text-warning" />
    </div>
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground focus:border-gold/30 focus:outline-none" />
      <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="w-full pr-10 pl-4 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" /></div>
      <Button className="bg-gold hover:bg-gold/90 text-black"><Send className="w-4 h-4 ml-1" />إرسال WPS</Button>
      <Button variant="outline"><Download className="w-4 h-4 ml-1" />تصدير</Button>
    </div>
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-gold/10 text-chrome text-xs"><th className="text-right py-3 px-2">الموظف</th><th className="text-right py-3 px-2">الأساسي</th><th className="text-right py-3 px-2 hidden sm:table-cell">السكن</th><th className="text-right py-3 px-2 hidden sm:table-cell">النقل</th><th className="text-right py-3 px-2 hidden md:table-cell">إضافي</th><th className="text-right py-3 px-2 hidden md:table-cell">خصومات</th><th className="text-right py-3 px-2 hidden lg:table-cell">GOSI</th><th className="text-right py-3 px-2">الصافي</th><th className="text-right py-3 px-2">الحالة</th></tr></thead>
    <tbody>{f.map(p => (<tr key={p.id} className="border-b border-gold/5 hover:bg-card/30"><td className="py-3 px-2 font-medium text-foreground">{p.employee_name}</td><td className="py-3 px-2 text-foreground">{p.basic_salary.toLocaleString()}</td><td className="py-3 px-2 text-foreground hidden sm:table-cell">{p.housing_allowance.toLocaleString()}</td><td className="py-3 px-2 text-foreground hidden sm:table-cell">{p.transport_allowance.toLocaleString()}</td><td className="py-3 px-2 text-success hidden md:table-cell">+{p.overtime_pay.toLocaleString()}</td><td className="py-3 px-2 text-destructive hidden md:table-cell">-{(p.other_deductions+p.tax_deduction).toLocaleString()}</td><td className="py-3 px-2 text-chrome hidden lg:table-cell">{p.gosi_deduction.toLocaleString()}</td><td className="py-3 px-2 font-bold text-gold">{p.net_salary.toLocaleString()}</td><td className="py-3 px-2"><Badge variant={p.status==='paid'?'success':p.status==='processing'?'info':'warning'}>{p.status==='paid'?'مدفوع':p.status==='processing'?'جاري':'معلق'}</Badge></td></tr>))}</tbody>
    <tfoot><tr className="border-t-2 border-gold/20 font-bold"><td className="py-3 px-2 text-foreground">الإجمالي</td><td className="py-3 px-2 text-foreground">{tBasic.toLocaleString()}</td><td className="py-3 px-2 hidden sm:table-cell">{tHousing.toLocaleString()}</td><td className="py-3 px-2 hidden sm:table-cell">{tTransport.toLocaleString()}</td><td className="py-3 px-2 text-success hidden md:table-cell">+{tOvertime.toLocaleString()}</td><td className="py-3 px-2 text-destructive hidden md:table-cell">-{tDed.toLocaleString()}</td><td className="py-3 px-2 hidden lg:table-cell">{tGosi.toLocaleString()}</td><td className="py-3 px-2 text-gold">{tNet.toLocaleString()}</td><td className="py-3 px-2"></td></tr></tfoot></table></div>
    <SectionCard title="ملخص GOSI الشهري" icon={<DollarSign className="w-5 h-5" />}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-card/30 rounded-lg text-center"><p className="text-xs text-chrome mb-1">حصة الموظف (9.75%)</p><p className="text-lg font-bold text-foreground">{Math.round(tGosi * 0.45).toLocaleString()} ر.س</p></div>
        <div className="p-3 bg-card/30 rounded-lg text-center"><p className="text-xs text-chrome mb-1">حصة صاحب العمل (11.75%)</p><p className="text-lg font-bold text-foreground">{Math.round(tGosi * 0.55).toLocaleString()} ر.س</p></div>
        <div className="p-3 bg-card/30 rounded-lg text-center"><p className="text-xs text-chrome mb-1">الإجمالي</p><p className="text-lg font-bold text-gold">{tGosi.toLocaleString()} ر.س</p></div>
      </div>
    </SectionCard>
  </div>);
}
