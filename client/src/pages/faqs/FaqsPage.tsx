/*
 * FaqsPage — إدارة الأسئلة الشائعة
 * Matches Laravel Dashboard /dashboard/faqs
 */
import { useState } from 'react';
import { HelpCircle, Plus, Pencil, Trash2, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, ThumbsUp } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatNumber } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Faq {
  id: number; question: string; questionEn: string; answer: string; answerEn: string;
  category: string; order: number; helpfulCount: number; isActive: boolean;
}

const mockFaqs: Faq[] = [
  { id: 1, question: 'كيف أسجل كمستثمر؟', questionEn: 'How to register as investor?', answer: 'يمكنك التسجيل من خلال صفحة التسجيل واختيار نوع الحساب "مستثمر"، ثم إكمال عملية التحقق من الهوية KYC.', answerEn: 'Register through the signup page, select "Investor" account type, then complete KYC verification.', category: 'التسجيل', order: 1, helpfulCount: 245, isActive: true },
  { id: 2, question: 'ما هي طرق الدفع المتاحة؟', questionEn: 'What payment methods are available?', answer: 'نقبل الدفع عبر بطاقات الائتمان (Visa/Mastercard)، مدى، Apple Pay، وسداد.', answerEn: 'We accept Visa/Mastercard, Mada, Apple Pay, and SADAD.', category: 'المدفوعات', order: 2, helpfulCount: 189, isActive: true },
  { id: 3, question: 'كيف أحجز مساحة في المعرض؟', questionEn: 'How to book exhibition space?', answer: 'بعد تسجيل الدخول كتاجر، اختر الفعالية المناسبة، ثم تصفح المساحات المتاحة وقدم طلب حجز.', answerEn: 'After logging in as merchant, select an event, browse available spaces, and submit a booking request.', category: 'الحجوزات', order: 3, helpfulCount: 312, isActive: true },
  { id: 4, question: 'ما هي شروط الرعاية؟', questionEn: 'What are sponsorship requirements?', answer: 'يمكنك الاطلاع على حزم الرعاية المتاحة من خلال صفحة "للرعاة" واختيار الحزمة المناسبة لميزانيتك.', answerEn: 'View available sponsorship packages on the "For Sponsors" page and choose the package that fits your budget.', category: 'الرعاية', order: 4, helpfulCount: 156, isActive: true },
  { id: 5, question: 'هل يمكنني إلغاء الحجز؟', questionEn: 'Can I cancel my booking?', answer: 'نعم، يمكنك إلغاء الحجز قبل 30 يوماً من تاريخ الفعالية مع استرداد كامل. بعد ذلك تطبق سياسة الإلغاء.', answerEn: 'Yes, you can cancel 30 days before the event for a full refund. After that, cancellation policy applies.', category: 'الحجوزات', order: 5, helpfulCount: 98, isActive: true },
  { id: 6, question: 'كيف أتواصل مع الدعم الفني؟', questionEn: 'How to contact support?', answer: 'يمكنك التواصل عبر نظام التذاكر في لوحة التحكم، أو عبر البريد الإلكتروني support@mahamexpo.sa', answerEn: 'Contact us through the ticketing system in your dashboard, or email support@mahamexpo.sa', category: 'الدعم', order: 6, helpfulCount: 67, isActive: true },
  { id: 7, question: 'ما هي متطلبات التحقق KYC؟', questionEn: 'What are KYC requirements?', answer: 'تحتاج إلى: السجل التجاري، الهوية الوطنية أو الإقامة، شهادة الزكاة والدخل، وعنوان العمل.', answerEn: 'You need: Commercial Registration, National ID/Iqama, ZATCA certificate, and business address.', category: 'التسجيل', order: 7, helpfulCount: 201, isActive: true },
  { id: 8, question: 'هل يوجد تطبيق جوال؟', questionEn: 'Is there a mobile app?', answer: 'نعم، تطبيق مهام إكسبو متاح على App Store و Google Play.', answerEn: 'Yes, Maham Expo app is available on App Store and Google Play.', category: 'عام', order: 8, helpfulCount: 134, isActive: false },
];

const categories = ['الكل', 'التسجيل', 'المدفوعات', 'الحجوزات', 'الرعاية', 'الدعم', 'عام'];

export default function FaqsPage() {
  const [faqs, setFaqs] = useState(mockFaqs);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Faq | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('الكل');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [nf, setNf] = useState({ question: '', questionEn: '', answer: '', answerEn: '', category: 'عام', isActive: true });

  const filtered = faqs.filter(f => {
    const matchSearch = f.question.includes(search) || f.questionEn.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'الكل' || f.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleSave = () => {
    if (!nf.question || !nf.answer) { toast.error('يرجى ملء السؤال والجواب'); return; }
    if (editItem) {
      setFaqs(prev => prev.map(f => f.id === editItem.id ? { ...f, ...nf } : f));
      toast.success('تم تحديث السؤال');
    } else {
      setFaqs(prev => [...prev, { id: Date.now(), ...nf, order: faqs.length + 1, helpfulCount: 0 }]);
      toast.success('تم إضافة السؤال');
    }
    setShowAdd(false); setEditItem(null);
  };

  const handleDelete = (id: number) => { setFaqs(prev => prev.filter(f => f.id !== id)); toast.success('تم حذف السؤال'); };
  const handleToggle = (id: number) => { setFaqs(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f)); toast.success('تم تحديث الحالة'); };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة الأسئلة الشائعة" subtitle={`${faqs.length} سؤال`} actions={
          <Button onClick={() => { setEditItem(null); setNf({ question: '', questionEn: '', answer: '', answerEn: '', category: 'عام', isActive: true }); setShowAdd(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> إضافة سؤال</Button>
        } />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="إجمالي الأسئلة" value={faqs.length} icon={HelpCircle} />
          <StatsCard title="نشطة" value={faqs.filter(f => f.isActive).length} icon={HelpCircle} delay={0.1} />
          <StatsCard title="الفئات" value={new Set(faqs.map(f => f.category)).size} icon={HelpCircle} delay={0.2} />
          <StatsCard title="إجمالي التقييمات" value={formatNumber(faqs.reduce((s, f) => s + f.helpfulCount, 0))} icon={ThumbsUp} delay={0.3} />
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 flex-wrap items-center">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في الأسئلة..." className="bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]" />
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterCat === cat ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2">
          {filtered.map((faq, i) => (
            <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card overflow-hidden">
              <button onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)} className="w-full flex items-center gap-3 p-4 text-right">
                <span className="text-xs font-mono text-muted-foreground w-6">#{faq.order}</span>
                <div className="flex-1">
                  <p className={`font-medium ${faq.isActive ? 'text-foreground' : 'text-muted-foreground line-through'}`}>{faq.question}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{faq.category} · <ThumbsUp className="w-3 h-3 inline" /> {faq.helpfulCount}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleToggle(faq.id); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors">{faq.isActive ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}</button>
                  <button onClick={(e) => { e.stopPropagation(); setEditItem(faq); setNf({ question: faq.question, questionEn: faq.questionEn, answer: faq.answer, answerEn: faq.answerEn, category: faq.category, isActive: faq.isActive }); setShowAdd(true); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"><Pencil className="w-4 h-4 text-accent" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4 text-danger" /></button>
                  {expandedId === faq.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>
              <AnimatePresence>
                {expandedId === faq.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-0 border-t border-border/30">
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.answer}</p>
                      {faq.answerEn && <p className="text-xs text-muted-foreground/60 mt-2 leading-relaxed" dir="ltr">{faq.answerEn}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <Dialog open={showAdd} onOpenChange={(v) => { setShowAdd(v); if (!v) setEditItem(null); }}>
          <DialogContent className="glass-card border-border/50 max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle>{editItem ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><label className="text-sm text-muted-foreground mb-1 block">السؤال بالعربية *</label><input value={nf.question} onChange={e => setNf(p => ({ ...p, question: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">السؤال بالإنجليزية</label><input value={nf.questionEn} onChange={e => setNf(p => ({ ...p, questionEn: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">الجواب بالعربية *</label><textarea value={nf.answer} onChange={e => setNf(p => ({ ...p, answer: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm h-24 resize-none" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">الجواب بالإنجليزية</label><textarea value={nf.answerEn} onChange={e => setNf(p => ({ ...p, answerEn: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm h-20 resize-none" dir="ltr" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">الفئة</label>
                <select value={nf.category} onChange={e => setNf(p => ({ ...p, category: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                  {categories.filter(c => c !== 'الكل').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={nf.isActive} onChange={e => setNf(p => ({ ...p, isActive: e.target.checked }))} className="rounded" /><span className="text-sm">نشط</span></label>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">{editItem ? 'تحديث' : 'إضافة'}</Button>
                <Button variant="outline" onClick={() => { setShowAdd(false); setEditItem(null); }} className="flex-1">إلغاء</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
