import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Mail, Building, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Employee } from '../hrTypes';
import { statusLabels, statusColors, contractTypeLabels } from '../hrTypes';
import { Badge, ProgressBar } from './HrShared';

interface Props { employees: Employee[]; onAdd: (e: Partial<Employee>) => void; onDelete: (id: string) => void; }

export default function HrEmployees({ employees, onAdd, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sel, setSel] = useState<Employee | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [pTab, setPTab] = useState('info');
  const [nE, setNE] = useState({ name_ar: '', name_en: '', email: '', phone: '', department: '', position: '', salary: '' });
  const depts = Array.from(new Set(employees.map(e => e.department)));
  const filtered = employees.filter(e => {
    const s = e.name_ar.includes(search) || e.name_en.toLowerCase().includes(search.toLowerCase()) || e.email.includes(search) || e.employee_number.includes(search);
    return s && (deptFilter === 'all' || e.department === deptFilter) && (statusFilter === 'all' || e.status === statusFilter);
  });
  const doAdd = () => { onAdd({ ...nE, salary: Number(nE.salary), id: `E${Date.now()}`, employee_number: `MHM-${employees.length+1}`, status: 'probation', contract_type: 'full_time', join_date: new Date().toISOString().split('T')[0], housing_allowance: 0, transport_allowance: 0, is_saudi: true, leave_balance: 0, skills: [], certifications: [], gender: 'male', nationality: 'سعودي', national_id: '', date_of_birth: '1990-01-01', job_title_ar: nE.position } as Employee); setShowAdd(false); setNE({ name_ar: '', name_en: '', email: '', phone: '', department: '', position: '', salary: '' }); };

  return (<div className="space-y-4">
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم، الرقم، البريد..." className="w-full pr-10 pl-4 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" /></div>
      <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground"><option value="all">كل الأقسام</option>{depts.map(d => <option key={d} value={d}>{d}</option>)}</select>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground"><option value="all">كل الحالات</option>{Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <Button onClick={() => setShowAdd(true)} className="bg-gold hover:bg-gold/90 text-black"><Plus className="w-4 h-4 ml-1" />إضافة موظف</Button>
    </div>
    <p className="text-sm text-chrome">{filtered.length} موظف من {employees.length}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {filtered.map(emp => (
        <div key={emp.id} className="glass-card p-4 rounded-xl border border-gold/10 hover:border-gold/30 transition-all cursor-pointer group" onClick={() => { setSel(emp); setPTab('info'); }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">{emp.name_ar.charAt(0)}</div><div><p className="font-semibold text-foreground text-sm">{emp.name_ar}</p><p className="text-xs text-chrome">{emp.employee_number}</p></div></div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] border ${statusColors[emp.status]}`}>{statusLabels[emp.status]}</span>
          </div>
          <div className="space-y-1 text-xs text-chrome"><div className="flex items-center gap-1"><Building className="w-3 h-3" />{emp.department} — {emp.position}</div><div className="flex items-center gap-1"><Mail className="w-3 h-3" />{emp.email}</div><div className="flex items-center gap-1"><Calendar className="w-3 h-3" />انضم: {emp.join_date}</div></div>
          {emp.performance_score && (<div className="mt-3"><div className="flex justify-between text-xs mb-1"><span className="text-chrome">الأداء</span><span className="text-gold">{emp.performance_score}%</span></div><ProgressBar value={emp.performance_score} max={100} color={emp.performance_score >= 90 ? 'bg-success' : emp.performance_score >= 70 ? 'bg-gold' : 'bg-warning'} /></div>)}
          <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={e => { e.stopPropagation(); setSel(emp); setPTab('info'); }} className="p-1.5 rounded bg-gold/10 text-gold hover:bg-gold/20"><Eye className="w-3 h-3" /></button>
            <button onClick={e => { e.stopPropagation(); }} className="p-1.5 rounded bg-info/10 text-info hover:bg-info/20"><Edit className="w-3 h-3" /></button>
            <button onClick={e => { e.stopPropagation(); onDelete(emp.id); }} className="p-1.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 className="w-3 h-3" /></button>
          </div>
        </div>
      ))}
    </div>
    {/* Profile Modal */}
    <Dialog open={!!sel} onOpenChange={() => setSel(null)}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-background border-gold/20">
        {sel && (<>
          <DialogHeader><DialogTitle className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">{sel.name_ar.charAt(0)}</div><div><p className="text-lg">{sel.name_ar}</p><p className="text-sm text-chrome font-normal">{sel.name_en} — {sel.employee_number}</p></div></DialogTitle></DialogHeader>
          <div className="flex flex-wrap gap-1 mb-4">{['info','financial','government','performance','documents'].map(t => (<button key={t} onClick={() => setPTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${pTab === t ? 'bg-gold text-black' : 'bg-card/50 text-chrome hover:bg-card'}`}>{t === 'info' ? 'شخصية' : t === 'financial' ? 'مالية' : t === 'government' ? 'حكومية' : t === 'performance' ? 'أداء' : 'مستندات'}</button>))}</div>
          {pTab === 'info' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[['الاسم العربي', sel.name_ar],['الاسم الإنجليزي', sel.name_en],['البريد', sel.email],['الهاتف', sel.phone],['القسم', sel.department],['المنصب', sel.position],['الجنسية', sel.nationality],['تاريخ الميلاد', sel.date_of_birth],['تاريخ الانضمام', sel.join_date],['نوع العقد', contractTypeLabels[sel.contract_type]],['الحالة', statusLabels[sel.status]],['المدير', sel.manager_name || '—'],['جهة الطوارئ', sel.emergency_contact_name || '—'],['هاتف الطوارئ', sel.emergency_contact_phone || '—']].map(([l, v]) => <div key={l} className="p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-1">{l}</p><p className="text-sm text-foreground font-medium">{v}</p></div>)}<div className="sm:col-span-2 p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-2">المهارات</p><div className="flex flex-wrap gap-1">{sel.skills.map(s => <Badge key={s}>{s}</Badge>)}</div></div><div className="sm:col-span-2 p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-2">الشهادات</p><div className="flex flex-wrap gap-1">{sel.certifications.length > 0 ? sel.certifications.map(c => <Badge key={c} variant="success">{c}</Badge>) : <span className="text-xs text-chrome">لا توجد</span>}</div></div></div>}
          {pTab === 'financial' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[['الراتب الأساسي', `${sel.salary.toLocaleString()} ر.س`],['بدل السكن', `${sel.housing_allowance.toLocaleString()} ر.س`],['بدل النقل', `${sel.transport_allowance.toLocaleString()} ر.س`],['الإجمالي', `${(sel.salary+sel.housing_allowance+sel.transport_allowance).toLocaleString()} ر.س`],['البنك', sel.bank_name || '—'],['IBAN', sel.iban || '—']].map(([l, v]) => <div key={l} className="p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-1">{l}</p><p className="text-sm text-foreground font-medium">{v}</p></div>)}</div>}
          {pTab === 'government' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[['الهوية الوطنية', sel.national_id || '—'],['رقم الإقامة', sel.iqama_number || '—'],['انتهاء الإقامة', sel.iqama_expiry || '—'],['رقم الجواز', sel.passport_number || '—'],['انتهاء الجواز', sel.passport_expiry || '—'],['رقم GOSI', sel.gosi_number || '—'],['سعودي', sel.is_saudi ? 'نعم' : 'لا']].map(([l, v]) => <div key={l} className="p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-1">{l}</p><p className="text-sm text-foreground font-medium">{v}</p></div>)}</div>}
          {pTab === 'performance' && <div className="space-y-3"><div className="p-4 bg-card/30 rounded-lg text-center"><p className="text-xs text-chrome mb-1">تقييم الأداء</p><p className="text-3xl font-bold text-gold">{sel.performance_score || 0}%</p><ProgressBar value={sel.performance_score || 0} max={100} /></div><div className="grid grid-cols-2 gap-3"><div className="p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-1">رصيد الإجازات</p><p className="text-lg font-bold text-foreground">{sel.leave_balance} يوم</p></div><div className="p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-1">فترة التجربة</p><p className="text-lg font-bold text-foreground">{sel.probation_end || 'انتهت'}</p></div></div></div>}
          {pTab === 'documents' && <div className="text-center py-8"><FileText className="w-12 h-12 text-chrome/30 mx-auto mb-3" /><p className="text-sm text-chrome">المستندات مرتبطة بتبويب المستندات الرئيسي</p></div>}
        </>)}
      </DialogContent>
    </Dialog>
    {/* Add Modal */}
    <Dialog open={showAdd} onOpenChange={setShowAdd}>
      <DialogContent className="max-w-lg bg-background border-gold/20">
        <DialogHeader><DialogTitle>إضافة موظف جديد</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {[['name_ar','الاسم بالعربي','text'],['name_en','الاسم بالإنجليزي','text'],['email','البريد','email'],['phone','الهاتف','tel'],['department','القسم','text'],['position','المنصب','text'],['salary','الراتب','number']].map(([k,l,t]) => <div key={k}><label className="text-xs text-chrome mb-1 block">{l}</label><input type={t} value={(nE as any)[k]} onChange={e => setNE(p => ({...p,[k]:e.target.value}))} className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground focus:border-gold/30 focus:outline-none" /></div>)}
          <div className="flex gap-2 pt-2"><Button onClick={doAdd} className="flex-1 bg-gold hover:bg-gold/90 text-black">إضافة</Button><Button onClick={() => setShowAdd(false)} variant="outline" className="flex-1">إلغاء</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  </div>);
}
