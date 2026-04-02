import { useState } from 'react';
import { FileText, Copy, Eye, Download, Plus, Star, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Template {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  description: string;
  language: 'ar' | 'en' | 'bilingual';
  lastUpdated: string;
  usageCount: number;
  clauses: string[];
  isDefault: boolean;
  zatcaCompliant: boolean;
}

const templates: Template[] = [
  { id: '1', name: 'عقد رعاية ذهبية', nameEn: 'Gold Sponsorship Agreement', category: 'sponsorship', description: 'عقد رعاية شامل للمعارض والفعاليات — يتضمن حقوق العلامة التجارية، المساحة، الخدمات اللوجستية', language: 'bilingual', lastUpdated: '2026-03-15', usageCount: 12, clauses: ['بند الرعاية والمقابل المالي', 'حقوق العلامة التجارية', 'المساحة والموقع', 'الخدمات اللوجستية', 'الإلغاء والتعويض', 'القوة القاهرة', 'السرية', 'حل النزاعات'], isDefault: true, zatcaCompliant: true },
  { id: '2', name: 'عقد تأجير جناح', nameEn: 'Booth Rental Agreement', category: 'booth', description: 'عقد تأجير أجنحة المعارض مع شروط التشغيل والصيانة والتأمين', language: 'bilingual', lastUpdated: '2026-03-10', usageCount: 28, clauses: ['وصف الجناح والمساحة', 'مدة الإيجار', 'القيمة الإيجارية', 'التأمين والضمان', 'شروط التشغيل', 'الصيانة والنظافة', 'الإخلاء والتسليم', 'المسؤولية والتعويض'], isDefault: true, zatcaCompliant: true },
  { id: '3', name: 'عقد خدمات مقاول', nameEn: 'Contractor Services Agreement', category: 'services', description: 'عقد تقديم خدمات للمقاولين — ديكور، تركيب، صوت وإضاءة', language: 'ar', lastUpdated: '2026-02-28', usageCount: 8, clauses: ['نطاق العمل', 'الجدول الزمني', 'المقابل المالي', 'معايير الجودة', 'التأمين', 'غرامة التأخير', 'الضمان', 'فسخ العقد'], isDefault: false, zatcaCompliant: true },
  { id: '4', name: 'اتفاقية شراكة استراتيجية', nameEn: 'Strategic Partnership Agreement', category: 'partnership', description: 'اتفاقية شراكة طويلة الأمد مع مستثمرين أو شركاء استراتيجيين', language: 'bilingual', lastUpdated: '2026-03-20', usageCount: 3, clauses: ['أهداف الشراكة', 'مساهمات الأطراف', 'توزيع الأرباح', 'الحوكمة واتخاذ القرار', 'الملكية الفكرية', 'مدة الشراكة', 'الانسحاب والتصفية', 'السرية وعدم المنافسة'], isDefault: false, zatcaCompliant: true },
  { id: '5', name: 'عقد توظيف', nameEn: 'Employment Contract', category: 'employment', description: 'عقد عمل متوافق مع نظام العمل السعودي ومنصة مدد', language: 'bilingual', lastUpdated: '2026-03-25', usageCount: 15, clauses: ['بيانات الموظف', 'المسمى الوظيفي والمهام', 'الراتب والبدلات', 'ساعات العمل', 'الإجازات', 'التأمين الطبي', 'فترة التجربة', 'إنهاء العقد', 'بند عدم المنافسة'], isDefault: true, zatcaCompliant: false },
];

const categoryLabels: Record<string, string> = { sponsorship: 'رعاية', booth: 'تأجير أجنحة', services: 'خدمات', partnership: 'شراكة', employment: 'توظيف' };
const langLabels: Record<string, string> = { ar: 'عربي', en: 'إنجليزي', bilingual: 'ثنائي اللغة' };

export default function ContractTemplates() {
  const [catF, setCatF] = useState('all');
  const [selTpl, setSelTpl] = useState<Template | null>(null);
  const filtered = catF === 'all' ? templates : templates.filter(t => t.category === catF);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex flex-wrap gap-3 text-xs text-chrome">
        <span>إجمالي القوالب: <strong className="text-foreground">{templates.length}</strong></span>
        <span>افتراضي: <strong className="text-gold">{templates.filter(t => t.isDefault).length}</strong></span>
        <span>ZATCA متوافق: <strong className="text-success">{templates.filter(t => t.zatcaCompliant).length}</strong></span>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide">
          {[{ id: 'all', label: 'الكل' }, ...Object.entries(categoryLabels).map(([k, v]) => ({ id: k, label: v }))].map(f => (
            <button key={f.id} onClick={() => setCatF(f.id)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${catF === f.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-chrome hover:text-foreground hover:bg-card/50'}`}>{f.label}</button>
          ))}
        </div>
        <Button className="bg-gold hover:bg-gold/90 text-black"><Plus className="w-4 h-4 ml-1" />قالب جديد</Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(tpl => (
          <div key={tpl.id} className="glass-card p-4 rounded-xl border border-gold/10 hover:border-gold/20 transition-all cursor-pointer group" onClick={() => setSelTpl(tpl)}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{tpl.name}</p>
                  <p className="text-[10px] text-chrome">{tpl.nameEn}</p>
                </div>
              </div>
              {tpl.isDefault && <Star className="w-4 h-4 text-gold fill-gold" />}
            </div>
            <p className="text-xs text-chrome mb-3">{tpl.description}</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] bg-card/50 border border-gold/10 text-chrome">{categoryLabels[tpl.category]}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-card/50 border border-gold/10 text-chrome">{langLabels[tpl.language]}</span>
              {tpl.zatcaCompliant && <span className="px-2 py-0.5 rounded text-[10px] bg-success/10 border border-success/20 text-success">ZATCA</span>}
              <span className="px-2 py-0.5 rounded text-[10px] bg-card/50 border border-gold/10 text-chrome flex items-center gap-1"><Copy className="w-3 h-3" />{tpl.usageCount} استخدام</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-chrome">
              <Clock className="w-3 h-3" />آخر تحديث: {tpl.lastUpdated}
            </div>
          </div>
        ))}
      </div>

      {/* Template Detail */}
      <Dialog open={!!selTpl} onOpenChange={() => setSelTpl(null)}>
        <DialogContent className="max-w-lg bg-background border-gold/20 max-h-[85vh] overflow-y-auto">
          {selTpl && (
            <>
              <DialogHeader><DialogTitle>{selTpl.name}</DialogTitle></DialogHeader>
              <p className="text-xs text-chrome">{selTpl.description}</p>
              <div className="space-y-2 mt-3">
                <p className="text-sm font-semibold text-foreground">البنود ({selTpl.clauses.length})</p>
                {selTpl.clauses.map((cl, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-card/30 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-[10px] text-gold font-bold shrink-0">{i + 1}</span>
                    <p className="text-xs text-foreground">{cl}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 bg-gold hover:bg-gold/90 text-black"><Copy className="w-4 h-4 ml-1" />استخدام القالب</Button>
                <Button variant="outline" className="flex-1"><Download className="w-4 h-4 ml-1" />تحميل</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
