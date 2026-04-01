import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw, FileText, TrendingUp, Eye } from 'lucide-react';
import type { ComplianceItem, Employee } from '../hrTypes';
import { SectionCard, MiniStat, Badge, SearchBar, HrModal } from './HrShared';

interface Props { compliance: ComplianceItem[]; employees: Employee[]; }

export default function HrCompliance({ compliance, employees }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  const saudiCount = employees.filter(e => e.is_saudi).length;
  const saudiPct = Math.round((saudiCount / employees.length) * 100);
  const compliantCount = compliance.filter(c => c.status === 'compliant').length;
  const warningCount = compliance.filter(c => c.status === 'warning').length;
  const violationCount = compliance.filter(c => c.status === 'violation').length;
  const complianceRate = Math.round((compliantCount / compliance.length) * 100);

  const filtered = compliance.filter(c => {
    if (search && !c.description.includes(search) && !c.system.includes(search)) return false;
    if (filterStatus && c.status !== filterStatus) return false;
    return true;
  });

  const systems = [
    { name: 'نطاقات (Nitaqat)', desc: 'نظام توطين الوظائف', status: saudiPct >= 85 ? 'compliant' as const : 'warning' as const, detail: `نسبة السعودة: ${saudiPct}%`, icon: '🏛️' },
    { name: 'GOSI', desc: 'التأمينات الاجتماعية', status: 'compliant' as const, detail: `${employees.length} موظف مسجل`, icon: '🛡️' },
    { name: 'WPS', desc: 'حماية الأجور', status: 'compliant' as const, detail: 'رواتب مارس مؤكدة', icon: '💰' },
    { name: 'قوى (Qiwa)', desc: 'منصة العمل', status: 'compliant' as const, detail: `${employees.length} عقد موثق`, icon: '📋' },
    { name: 'مُدد (Mudad)', desc: 'نظام الرواتب', status: 'compliant' as const, detail: 'متصل ومحدث', icon: '🔗' },
    { name: 'PDPL', desc: 'حماية البيانات', status: 'compliant' as const, detail: 'سياسة محدثة', icon: '🔒' },
    { name: 'أبشر (Absher)', desc: 'الجوازات', status: warningCount > 0 ? 'warning' as const : 'compliant' as const, detail: 'إقامة تنتهي قريباً', icon: '🛂' },
    { name: 'ZATCA', desc: 'الزكاة والضريبة', status: 'compliant' as const, detail: 'Q1 2026 مقدم', icon: '📊' },
  ];

  const statusBadge = (s: string) => {
    if (s === 'compliant') return <Badge variant="success">ملتزم</Badge>;
    if (s === 'warning') return <Badge variant="warning">تحذير</Badge>;
    if (s === 'violation') return <Badge variant="danger">مخالفة</Badge>;
    return <Badge variant="info">معلق</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <MiniStat label="نسبة الامتثال" value={`${complianceRate}%`} color={complianceRate >= 80 ? 'text-success' : 'text-warning'} />
        <MiniStat label="ملتزم" value={compliantCount} color="text-success" />
        <MiniStat label="تحذيرات" value={warningCount} color="text-warning" />
        <MiniStat label="مخالفات" value={violationCount} color="text-destructive" />
      </div>

      <SectionCard title="حالة الأنظمة السعودية" icon={<Shield className="w-5 h-5" />}
        action={<button className="flex items-center gap-1 text-xs text-gold hover:underline"><RefreshCw className="w-3 h-3" /> تحديث</button>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {systems.map(sys => (
            <div key={sys.name} className={`p-3 rounded-lg border transition-all hover:scale-[1.02] ${
              sys.status === 'compliant' ? 'border-success/20 bg-success/5' : 'border-warning/20 bg-warning/5'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{sys.icon}</span>
                {sys.status === 'compliant' ? <CheckCircle className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
              </div>
              <p className="text-xs font-bold text-foreground">{sys.name}</p>
              <p className="text-[10px] text-chrome mt-0.5">{sys.desc}</p>
              <p className="text-[10px] text-chrome/70 mt-1">{sys.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="عناصر الامتثال" icon={<FileText className="w-5 h-5" />}>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="بحث..." />
          <div className="flex gap-1 flex-wrap">
            {[{ v: '', l: 'الكل' }, { v: 'compliant', l: 'ملتزم' }, { v: 'warning', l: 'تحذير' }, { v: 'violation', l: 'مخالفة' }, { v: 'pending', l: 'معلق' }].map(s => (
              <button key={s.v} onClick={() => setFilterStatus(s.v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s.v ? 'bg-gold/10 text-gold border border-gold/30' : 'text-chrome hover:bg-muted'}`}>{s.l}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border">
              <th className="text-right py-2 px-2 text-chrome font-medium">النظام</th>
              <th className="text-right py-2 px-2 text-chrome font-medium hidden sm:table-cell">الفئة</th>
              <th className="text-right py-2 px-2 text-chrome font-medium">الوصف</th>
              <th className="text-right py-2 px-2 text-chrome font-medium">الحالة</th>
              <th className="text-right py-2 px-2 text-chrome font-medium hidden md:table-cell">الأثر</th>
              <th className="text-right py-2 px-2 text-chrome font-medium hidden lg:table-cell">المسؤول</th>
              <th className="text-center py-2 px-2 text-chrome font-medium">عرض</th>
            </tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-card/30">
                  <td className="py-2 px-2 font-medium text-foreground">{item.system}</td>
                  <td className="py-2 px-2 text-chrome hidden sm:table-cell">{item.category}</td>
                  <td className="py-2 px-2 text-chrome max-w-[200px] truncate">{item.description}</td>
                  <td className="py-2 px-2">{statusBadge(item.status)}</td>
                  <td className="py-2 px-2 hidden md:table-cell"><Badge variant={item.impact === 'high' ? 'danger' : item.impact === 'medium' ? 'warning' : 'info'}>{item.impact === 'high' ? 'عالي' : item.impact === 'medium' ? 'متوسط' : 'منخفض'}</Badge></td>
                  <td className="py-2 px-2 text-chrome hidden lg:table-cell">{item.responsible}</td>
                  <td className="py-2 px-2 text-center"><button onClick={() => setSelectedItem(item)} className="p-1 rounded hover:bg-gold/10 text-gold"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="تقدم السعودة" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className={saudiPct >= 85 ? 'text-success' : 'text-warning'}
                  strokeDasharray={`${saudiPct * 2.51} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className={`text-lg font-bold ${saudiPct >= 85 ? 'text-success' : 'text-warning'}`}>{saudiPct}%</span></div>
            </div>
            <p className="text-xs text-chrome">النسبة الحالية</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs"><span className="text-chrome">سعوديون</span><span className="text-foreground font-bold">{saudiCount}</span></div>
            <div className="flex justify-between text-xs"><span className="text-chrome">غير سعوديين</span><span className="text-foreground font-bold">{employees.length - saudiCount}</span></div>
            <div className="flex justify-between text-xs"><span className="text-chrome">الحد الأدنى</span><span className="text-foreground font-bold">85%</span></div>
            <div className="flex justify-between text-xs"><span className="text-chrome">النطاق</span><span className={`font-bold ${saudiPct >= 85 ? 'text-success' : 'text-warning'}`}>{saudiPct >= 85 ? 'بلاتيني' : 'أخضر مرتفع'}</span></div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-foreground mb-2">التوصيات:</p>
            {saudiPct < 85 ? (
              <div className="flex items-start gap-2 text-xs"><AlertTriangle className="w-3 h-3 text-warning mt-0.5 shrink-0" /><span className="text-chrome">توظيف {Math.ceil(0.85 * employees.length - saudiCount)} سعودي إضافي</span></div>
            ) : (
              <div className="flex items-start gap-2 text-xs"><CheckCircle className="w-3 h-3 text-success mt-0.5 shrink-0" /><span className="text-chrome">النسبة ضمن الحد المطلوب</span></div>
            )}
          </div>
        </div>
      </SectionCard>

      <HrModal open={!!selectedItem} onClose={() => setSelectedItem(null)} title="تفاصيل عنصر الامتثال" size="md">
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-chrome mb-1">النظام</p><p className="text-sm font-bold text-foreground">{selectedItem.system}</p></div>
              <div><p className="text-xs text-chrome mb-1">الفئة</p><p className="text-sm text-foreground">{selectedItem.category}</p></div>
              <div><p className="text-xs text-chrome mb-1">الحالة</p>{statusBadge(selectedItem.status)}</div>
              <div><p className="text-xs text-chrome mb-1">المسؤول</p><p className="text-sm text-foreground">{selectedItem.responsible}</p></div>
              {selectedItem.due_date && <div><p className="text-xs text-chrome mb-1">الاستحقاق</p><p className="text-sm text-foreground">{selectedItem.due_date}</p></div>}
              <div><p className="text-xs text-chrome mb-1">آخر فحص</p><p className="text-sm text-foreground">{selectedItem.last_checked}</p></div>
            </div>
            <div><p className="text-xs text-chrome mb-1">الوصف</p><p className="text-sm text-foreground">{selectedItem.description}</p></div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gold/10 text-gold rounded-lg text-xs font-medium hover:bg-gold/20">تحديث الحالة</button>
              <button className="px-4 py-2 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/80">إنشاء تقرير</button>
            </div>
          </div>
        )}
      </HrModal>
    </div>
  );
}
