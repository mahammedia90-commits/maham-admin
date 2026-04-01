import { useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, AlertTriangle, CheckCircle, Clock, Brain, FolderOpen } from 'lucide-react';
import type { HRDocument } from '../hrTypes';
import { documentTypeLabels } from '../hrTypes';
import { SectionCard, MiniStat, Badge, SearchBar, HrModal } from './HrShared';

interface Props { documents: HRDocument[]; }

export default function HrDocuments({ documents }: Props) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<HRDocument | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const validCount = documents.filter(d => d.status === 'valid').length;
  const expiredCount = documents.filter(d => d.status === 'expired').length;
  const expiringCount = documents.filter(d => d.status === 'expiring_soon').length;
  const aiClassified = documents.filter(d => d.ai_classified).length;

  const filtered = documents.filter(d => {
    if (search && !d.name.includes(search) && !(d.employee_name || '').includes(search)) return false;
    if (filterType && d.type !== filterType) return false;
    if (filterStatus && d.status !== filterStatus) return false;
    return true;
  });

  const statusBadge = (s: string) => {
    if (s === 'valid') return <Badge variant="success">صالح</Badge>;
    if (s === 'expired') return <Badge variant="danger">منتهي</Badge>;
    if (s === 'expiring_soon') return <Badge variant="warning">ينتهي قريباً</Badge>;
    return <Badge variant="info">قيد المراجعة</Badge>;
  };

  const typeIcon = (t: string) => {
    const icons: Record<string, string> = { national_id: '🪪', passport: '🛂', iqama: '📋', contract: '📄', certificate: '🎓', medical: '🏥', visa: '✈️', license: '📜', other: '📎' };
    return icons[t] || '📎';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <MiniStat label="إجمالي المستندات" value={documents.length} color="text-gold" />
        <MiniStat label="صالحة" value={validCount} color="text-success" />
        <MiniStat label="منتهية" value={expiredCount} color="text-destructive" />
        <MiniStat label="مصنفة بالـ AI" value={aiClassified} color="text-info" sub={`${Math.round((aiClassified / documents.length) * 100)}%`} />
      </div>

      {(expiredCount > 0 || expiringCount > 0) && (
        <div className="glass-card p-3 border border-warning/20 bg-warning/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-warning" /><span className="text-xs font-bold text-warning">تنبيهات المستندات</span></div>
          <div className="space-y-1">
            {documents.filter(d => d.status === 'expired' || d.status === 'expiring_soon').map(d => (
              <div key={d.id} className="flex items-center justify-between text-xs"><span className="text-foreground">{d.name} — {d.employee_name}</span>{statusBadge(d.status)}</div>
            ))}
          </div>
        </div>
      )}

      <SectionCard title="إدارة المستندات" icon={<FolderOpen className="w-5 h-5" />}
        action={<button onClick={() => setShowUpload(true)} className="flex items-center gap-1 px-3 py-1.5 bg-gold/10 text-gold rounded-lg text-xs font-medium hover:bg-gold/20"><Upload className="w-3 h-3" /> رفع مستند</button>}>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="بحث بالاسم أو الموظف..." />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground"><option value="">كل الأنواع</option>{Object.entries(documentTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground"><option value="">كل الحالات</option><option value="valid">صالح</option><option value="expired">منتهي</option><option value="expiring_soon">ينتهي قريباً</option></select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(doc => (
            <div key={doc.id} className="glass-card p-3 rounded-lg border border-border/50 hover:border-gold/20 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2"><span className="text-lg">{typeIcon(doc.type)}</span><div><p className="text-xs font-bold text-foreground">{doc.name}</p><p className="text-[10px] text-chrome">{documentTypeLabels[doc.type]}</p></div></div>
                {statusBadge(doc.status)}
              </div>
              <div className="space-y-1 mb-3">
                {doc.employee_name && <div className="flex justify-between text-[10px]"><span className="text-chrome">الموظف</span><span className="text-foreground">{doc.employee_name}</span></div>}
                <div className="flex justify-between text-[10px]"><span className="text-chrome">الحجم</span><span className="text-foreground">{doc.file_size}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-chrome">تاريخ الرفع</span><span className="text-foreground">{doc.uploaded_at}</span></div>
                {doc.expiry_date && <div className="flex justify-between text-[10px]"><span className="text-chrome">الانتهاء</span><span className={`font-medium ${doc.status === 'expired' ? 'text-destructive' : doc.status === 'expiring_soon' ? 'text-warning' : 'text-foreground'}`}>{doc.expiry_date}</span></div>}
              </div>
              <div className="flex items-center justify-between">
                {doc.ai_classified && <div className="flex items-center gap-1 text-[10px] text-info"><Brain className="w-3 h-3" /> مصنف AI</div>}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-auto">
                  <button onClick={() => setSelectedDoc(doc)} className="p-1 rounded hover:bg-gold/10 text-gold"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="p-1 rounded hover:bg-info/10 text-info"><Download className="w-3.5 h-3.5" /></button>
                  <button className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="ذكاء المستندات (AI)" icon={<Brain className="w-5 h-5" />}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-card p-3 rounded-lg text-center"><Brain className="w-6 h-6 text-gold mx-auto mb-2" /><p className="text-xs font-bold text-foreground">التصنيف التلقائي</p><p className="text-[10px] text-chrome mt-1">تصنيف تلقائي عند الرفع</p><p className="text-lg font-bold text-gold mt-2">{Math.round((aiClassified / documents.length) * 100)}%</p></div>
          <div className="glass-card p-3 rounded-lg text-center"><Clock className="w-6 h-6 text-warning mx-auto mb-2" /><p className="text-xs font-bold text-foreground">تنبيهات الانتهاء</p><p className="text-[10px] text-chrome mt-1">تنبيه قبل 90 يوم</p><p className="text-lg font-bold text-warning mt-2">{expiringCount}</p></div>
          <div className="glass-card p-3 rounded-lg text-center"><CheckCircle className="w-6 h-6 text-success mx-auto mb-2" /><p className="text-xs font-bold text-foreground">التحقق الذكي</p><p className="text-[10px] text-chrome mt-1">OCR + تحقق</p><p className="text-lg font-bold text-success mt-2">{validCount}</p></div>
        </div>
      </SectionCard>

      <HrModal open={showUpload} onClose={() => setShowUpload(false)} title="رفع مستند جديد" size="md">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-gold/30 transition-colors cursor-pointer"><Upload className="w-8 h-8 text-chrome mx-auto mb-3" /><p className="text-sm font-medium text-foreground mb-1">اسحب الملف هنا أو اضغط للاختيار</p><p className="text-xs text-chrome">PDF, JPG, PNG — حد أقصى 10 MB</p></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-chrome mb-1 block">نوع المستند</label><select className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground">{Object.entries(documentTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label className="text-xs text-chrome mb-1 block">الموظف</label><input type="text" placeholder="اختر الموظف" className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground" /></div>
            <div><label className="text-xs text-chrome mb-1 block">تاريخ الانتهاء</label><input type="date" className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground" /></div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-info/5 border border-info/20"><Brain className="w-4 h-4 text-info shrink-0" /><p className="text-[10px] text-info">سيتم تصنيف المستند تلقائياً بالذكاء الاصطناعي واستخراج البيانات (OCR)</p></div>
          <div className="flex justify-end gap-2"><button onClick={() => setShowUpload(false)} className="px-4 py-2 text-xs text-chrome hover:text-foreground">إلغاء</button><button className="px-4 py-2 bg-gold text-black rounded-lg text-xs font-medium hover:bg-gold/90">رفع المستند</button></div>
        </div>
      </HrModal>

      <HrModal open={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="تفاصيل المستند" size="md">
        {selectedDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4"><span className="text-3xl">{typeIcon(selectedDoc.type)}</span><div><p className="text-sm font-bold text-foreground">{selectedDoc.name}</p><p className="text-xs text-chrome">{documentTypeLabels[selectedDoc.type]}</p></div></div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-chrome mb-1">الحالة</p>{statusBadge(selectedDoc.status)}</div>
              {selectedDoc.employee_name && <div><p className="text-xs text-chrome mb-1">الموظف</p><p className="text-sm text-foreground">{selectedDoc.employee_name}</p></div>}
              <div><p className="text-xs text-chrome mb-1">الحجم</p><p className="text-sm text-foreground">{selectedDoc.file_size}</p></div>
              <div><p className="text-xs text-chrome mb-1">تاريخ الرفع</p><p className="text-sm text-foreground">{selectedDoc.uploaded_at}</p></div>
              {selectedDoc.expiry_date && <div><p className="text-xs text-chrome mb-1">الانتهاء</p><p className="text-sm text-foreground">{selectedDoc.expiry_date}</p></div>}
            </div>
            <div className="flex gap-2"><button className="px-4 py-2 bg-gold/10 text-gold rounded-lg text-xs font-medium hover:bg-gold/20">تحميل</button><button className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-xs font-medium hover:bg-destructive/20">حذف</button></div>
          </div>
        )}
      </HrModal>
    </div>
  );
}
