/*
 * SponsorBenefitsPage — إدارة مزايا الرعاية
 * Matches Laravel Dashboard /dashboard/sponsor-benefits
 */
import { useState } from 'react';
import { Gift, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Crown, Gem, Award, Star, CheckCircle } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface SponsorBenefit {
  id: number; name: string; nameAr: string; description: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  category: 'branding' | 'access' | 'digital' | 'physical' | 'networking';
  isActive: boolean; order: number;
}

const mockBenefits: SponsorBenefit[] = [
  { id: 1, name: 'Main Stage Logo', nameAr: 'شعار على المسرح الرئيسي', description: 'عرض شعار الراعي على شاشة المسرح الرئيسي طوال الفعالية', tier: 'platinum', category: 'branding', isActive: true, order: 1 },
  { id: 2, name: 'VIP Lounge Access', nameAr: 'دخول صالة VIP', description: '10 بطاقات دخول لصالة كبار الشخصيات', tier: 'platinum', category: 'access', isActive: true, order: 2 },
  { id: 3, name: 'Social Media Feature', nameAr: 'تغطية على وسائل التواصل', description: '5 منشورات مخصصة على حسابات المعرض الرسمية', tier: 'gold', category: 'digital', isActive: true, order: 3 },
  { id: 4, name: 'Exhibition Booth', nameAr: 'جناح عرض مميز', description: 'جناح عرض بمساحة 20 متر مربع في موقع مميز', tier: 'gold', category: 'physical', isActive: true, order: 4 },
  { id: 5, name: 'Networking Dinner', nameAr: 'عشاء تواصل حصري', description: 'دعوة لحضور عشاء التواصل مع كبار المستثمرين', tier: 'platinum', category: 'networking', isActive: true, order: 5 },
  { id: 6, name: 'Banner Placement', nameAr: 'لافتة إعلانية', description: 'لافتة إعلانية في مدخل المعرض', tier: 'silver', category: 'branding', isActive: true, order: 6 },
  { id: 7, name: 'Email Newsletter', nameAr: 'ذكر في النشرة البريدية', description: 'ذكر الراعي في النشرة البريدية الأسبوعية', tier: 'silver', category: 'digital', isActive: true, order: 7 },
  { id: 8, name: 'Branded Lanyard', nameAr: 'حبل بطاقة بالشعار', description: 'طباعة شعار الراعي على حبال البطاقات', tier: 'bronze', category: 'physical', isActive: true, order: 8 },
  { id: 9, name: 'Website Logo', nameAr: 'شعار على الموقع', description: 'عرض الشعار على الموقع الرسمي للمعرض', tier: 'bronze', category: 'digital', isActive: true, order: 9 },
  { id: 10, name: 'Speaker Slot', nameAr: 'فرصة كلمة على المسرح', description: 'فرصة لإلقاء كلمة 15 دقيقة على المسرح الرئيسي', tier: 'platinum', category: 'access', isActive: false, order: 10 },
];

const tierConfig: Record<string, { label: string; color: string; icon: typeof Crown }> = {
  platinum: { label: 'بلاتيني', color: 'bg-purple-500/15 text-purple-400 border-purple-500/20', icon: Crown },
  gold: { label: 'ذهبي', color: 'bg-accent/15 text-accent border-accent/20', icon: Gem },
  silver: { label: 'فضي', color: 'bg-slate-400/15 text-slate-300 border-slate-400/20', icon: Award },
  bronze: { label: 'برونزي', color: 'bg-orange-500/15 text-orange-400 border-orange-500/20', icon: Star },
};

const categoryLabels: Record<string, string> = { branding: 'علامة تجارية', access: 'وصول', digital: 'رقمي', physical: 'مادي', networking: 'تواصل' };

export default function SponsorBenefitsPage() {
  const [benefits, setBenefits] = useState(mockBenefits);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<SponsorBenefit | null>(null);
  const [filterTier, setFilterTier] = useState('all');
  const [nf, setNf] = useState({ name: '', nameAr: '', description: '', tier: 'gold' as SponsorBenefit['tier'], category: 'branding' as SponsorBenefit['category'], isActive: true });

  const filtered = benefits.filter(b => filterTier === 'all' || b.tier === filterTier);

  const handleSave = () => {
    if (!nf.nameAr || !nf.name) { toast.error('يرجى ملء الحقول المطلوبة'); return; }
    if (editItem) {
      setBenefits(prev => prev.map(b => b.id === editItem.id ? { ...b, ...nf } : b));
      toast.success('تم تحديث الميزة');
    } else {
      setBenefits(prev => [...prev, { id: Date.now(), ...nf, order: benefits.length + 1 }]);
      toast.success('تم إضافة الميزة');
    }
    setShowAdd(false); setEditItem(null);
  };

  const handleDelete = (id: number) => { setBenefits(prev => prev.filter(b => b.id !== id)); toast.success('تم حذف الميزة'); };
  const handleToggle = (id: number) => { setBenefits(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b)); toast.success('تم تحديث الحالة'); };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="مزايا الرعاية" subtitle={`${benefits.length} ميزة`} actions={
          <Button onClick={() => { setEditItem(null); setNf({ name: '', nameAr: '', description: '', tier: 'gold', category: 'branding', isActive: true }); setShowAdd(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> إضافة ميزة</Button>
        } />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatsCard title="إجمالي المزايا" value={benefits.length} icon={Gift} />
          {Object.entries(tierConfig).map(([key, cfg], i) => (
            <StatsCard key={key} title={cfg.label} value={benefits.filter(b => b.tier === key).length} icon={cfg.icon} delay={(i + 1) * 0.1} />
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterTier('all')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterTier === 'all' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card'}`}>الكل ({benefits.length})</button>
          {Object.entries(tierConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilterTier(key)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterTier === key ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card'}`}>
              {cfg.label} ({benefits.filter(b => b.tier === key).length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((benefit, i) => {
            const cfg = tierConfig[benefit.tier];
            return (
              <motion.div key={benefit.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className={`glass-card p-4 space-y-3 ${!benefit.isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs text-muted-foreground bg-card/50 px-2 py-0.5 rounded border border-border/50">{categoryLabels[benefit.category]}</span>
                  </div>
                  <StatusBadge status={benefit.isActive ? 'active' : 'draft'} />
                </div>
                <div><h3 className="font-semibold text-foreground">{benefit.nameAr}</h3><p className="text-xs text-muted-foreground">{benefit.name}</p></div>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                <div className="flex gap-1 pt-1 border-t border-border/30">
                  <button onClick={() => handleToggle(benefit.id)} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors">{benefit.isActive ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}</button>
                  <button onClick={() => { setEditItem(benefit); setNf({ name: benefit.name, nameAr: benefit.nameAr, description: benefit.description, tier: benefit.tier, category: benefit.category, isActive: benefit.isActive }); setShowAdd(true); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"><Pencil className="w-4 h-4 text-accent" /></button>
                  <button onClick={() => handleDelete(benefit.id)} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4 text-danger" /></button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Dialog open={showAdd} onOpenChange={(v) => { setShowAdd(v); if (!v) setEditItem(null); }}>
          <DialogContent className="glass-card border-border/50 max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle>{editItem ? 'تعديل الميزة' : 'إضافة ميزة جديدة'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">الاسم بالعربية *</label><input value={nf.nameAr} onChange={e => setNf(p => ({ ...p, nameAr: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">الاسم بالإنجليزية *</label><input value={nf.name} onChange={e => setNf(p => ({ ...p, name: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              </div>
              <div><label className="text-sm text-muted-foreground mb-1 block">الوصف</label><textarea value={nf.description} onChange={e => setNf(p => ({ ...p, description: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm h-20 resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">المستوى</label>
                  <select value={nf.tier} onChange={e => setNf(p => ({ ...p, tier: e.target.value as SponsorBenefit['tier'] }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                    <option value="platinum">بلاتيني</option><option value="gold">ذهبي</option><option value="silver">فضي</option><option value="bronze">برونزي</option>
                  </select>
                </div>
                <div><label className="text-sm text-muted-foreground mb-1 block">الفئة</label>
                  <select value={nf.category} onChange={e => setNf(p => ({ ...p, category: e.target.value as SponsorBenefit['category'] }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                    <option value="branding">علامة تجارية</option><option value="access">وصول</option><option value="digital">رقمي</option><option value="physical">مادي</option><option value="networking">تواصل</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={nf.isActive} onChange={e => setNf(p => ({ ...p, isActive: e.target.checked }))} className="rounded" /><span className="text-sm">نشطة</span></label>
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
