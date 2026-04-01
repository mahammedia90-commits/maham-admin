/*
 * BannersPage — إدارة البانرات الإعلانية
 * Matches Laravel Dashboard /dashboard/banners
 */
import { useState } from 'react';
import { Image as ImageIcon, Plus, Pencil, Trash2, Eye, MousePointerClick, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDate, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Banner {
  id: number; title: string; titleAr: string; imageUrl: string; linkUrl: string;
  position: 'hero' | 'sidebar' | 'footer' | 'popup'; views: number; clicks: number;
  startDate: string; endDate: string; isActive: boolean; order: number; createdAt: string;
}

const mockBanners: Banner[] = [
  { id: 1, title: 'Maham Expo 2026', titleAr: 'معرض مهام إكسبو 2026', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', linkUrl: '/events/1', position: 'hero', views: 45200, clicks: 3200, startDate: '2026-01-01', endDate: '2026-06-30', isActive: true, order: 1, createdAt: '2025-12-15' },
  { id: 2, title: 'Investor Summit', titleAr: 'قمة المستثمرين', imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400', linkUrl: '/events/2', position: 'hero', views: 32100, clicks: 2100, startDate: '2026-02-01', endDate: '2026-04-30', isActive: true, order: 2, createdAt: '2026-01-10' },
  { id: 3, title: 'Sponsor CTA', titleAr: 'كن راعياً', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400', linkUrl: '/for-sponsors', position: 'sidebar', views: 18500, clicks: 950, startDate: '2026-01-01', endDate: '2026-12-31', isActive: true, order: 1, createdAt: '2025-12-20' },
  { id: 4, title: 'Early Bird Offer', titleAr: 'عرض الحجز المبكر', imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400', linkUrl: '/offers', position: 'popup', views: 8900, clicks: 1200, startDate: '2026-03-01', endDate: '2026-03-31', isActive: false, order: 1, createdAt: '2026-02-25' },
  { id: 5, title: 'Footer Partner', titleAr: 'شريك استراتيجي', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', linkUrl: 'https://partner.com', position: 'footer', views: 12300, clicks: 450, startDate: '2026-01-01', endDate: '2026-12-31', isActive: true, order: 1, createdAt: '2025-12-01' },
];

const positionLabels: Record<string, string> = { hero: 'الرئيسية', sidebar: 'الشريط الجانبي', footer: 'التذييل', popup: 'نافذة منبثقة' };
const positionColors: Record<string, string> = { hero: 'bg-accent/15 text-accent border-accent/20', sidebar: 'bg-info/15 text-info border-info/20', footer: 'bg-muted/50 text-muted-foreground border-border', popup: 'bg-warning/15 text-warning border-warning/20' };

export default function BannersPage() {
  const [banners, setBanners] = useState(mockBanners);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Banner | null>(null);
  const [search, setSearch] = useState('');
  const [filterPos, setFilterPos] = useState<string>('all');
  const [nf, setNf] = useState({ title: '', titleAr: '', imageUrl: '', linkUrl: '', position: 'hero' as Banner['position'], startDate: '', endDate: '', isActive: true });

  const filtered = banners.filter(b => {
    const matchSearch = b.titleAr.includes(search) || b.title.toLowerCase().includes(search.toLowerCase());
    const matchPos = filterPos === 'all' || b.position === filterPos;
    return matchSearch && matchPos;
  });

  const handleSave = () => {
    if (!nf.titleAr || !nf.title) { toast.error('يرجى ملء الحقول المطلوبة'); return; }
    if (editItem) {
      setBanners(prev => prev.map(b => b.id === editItem.id ? { ...b, ...nf } : b));
      toast.success('تم تحديث البانر');
    } else {
      setBanners(prev => [...prev, { id: Date.now(), ...nf, views: 0, clicks: 0, order: banners.length + 1, createdAt: new Date().toISOString() }]);
      toast.success('تم إضافة البانر');
    }
    setShowAdd(false); setEditItem(null);
  };

  const handleDelete = (id: number) => { setBanners(prev => prev.filter(b => b.id !== id)); toast.success('تم حذف البانر'); };
  const handleToggle = (id: number) => { setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b)); toast.success('تم تحديث الحالة'); };

  const totalViews = banners.reduce((s, b) => s + b.views, 0);
  const totalClicks = banners.reduce((s, b) => s + b.clicks, 0);
  const avgCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة البانرات" subtitle={`${banners.length} بانر إعلاني`} actions={
          <Button onClick={() => { setEditItem(null); setNf({ title: '', titleAr: '', imageUrl: '', linkUrl: '', position: 'hero', startDate: '', endDate: '', isActive: true }); setShowAdd(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> إضافة بانر</Button>
        } />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="إجمالي البانرات" value={banners.length} icon={ImageIcon} />
          <StatsCard title="إجمالي المشاهدات" value={formatNumber(totalViews)} icon={Eye} delay={0.1} />
          <StatsCard title="إجمالي النقرات" value={formatNumber(totalClicks)} icon={MousePointerClick} delay={0.2} />
          <StatsCard title="معدل النقر CTR" value={`${avgCTR}%`} icon={MousePointerClick} trend={Number(avgCTR) > 5 ? 12 : -5} delay={0.3} />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'hero', 'sidebar', 'footer', 'popup'].map(pos => (
            <button key={pos} onClick={() => setFilterPos(pos)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterPos === pos ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card'}`}>
              {pos === 'all' ? 'الكل' : positionLabels[pos]} ({pos === 'all' ? banners.length : banners.filter(b => b.position === pos).length})
            </button>
          ))}
        </div>

        {/* Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((banner, i) => (
            <motion.div key={banner.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden group">
              <div className="relative h-40 bg-card/50">
                {banner.imageUrl ? <img src={banner.imageUrl} alt={banner.titleAr} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-12 h-12 text-muted-foreground/30" /></div>}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${positionColors[banner.position]}`}>{positionLabels[banner.position]}</span>
                </div>
                <div className="absolute top-2 left-2"><StatusBadge status={banner.isActive ? 'active' : 'draft'} /></div>
              </div>
              <div className="p-4 space-y-3">
                <div><h3 className="font-semibold text-foreground">{banner.titleAr}</h3><p className="text-xs text-muted-foreground">{banner.title}</p></div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(banner.views)}</span>
                  <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> {formatNumber(banner.clicks)}</span>
                  <span>CTR: {banner.views > 0 ? ((banner.clicks / banner.views) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="text-xs text-muted-foreground">{formatDate(banner.startDate)} — {formatDate(banner.endDate)}</div>
                <div className="flex gap-1 pt-1">
                  <button onClick={() => handleToggle(banner.id)} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors">{banner.isActive ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}</button>
                  <button onClick={() => { setEditItem(banner); setNf({ title: banner.title, titleAr: banner.titleAr, imageUrl: banner.imageUrl, linkUrl: banner.linkUrl, position: banner.position, startDate: banner.startDate, endDate: banner.endDate, isActive: banner.isActive }); setShowAdd(true); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"><Pencil className="w-4 h-4 text-accent" /></button>
                  <button onClick={() => handleDelete(banner.id)} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4 text-danger" /></button>
                  {banner.linkUrl && <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-info/10 transition-colors mr-auto"><ExternalLink className="w-4 h-4 text-info" /></a>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog open={showAdd} onOpenChange={(v) => { setShowAdd(v); if (!v) setEditItem(null); }}>
          <DialogContent className="glass-card border-border/50 max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle>{editItem ? 'تعديل البانر' : 'إضافة بانر جديد'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">العنوان بالعربية *</label><input value={nf.titleAr} onChange={e => setNf(p => ({ ...p, titleAr: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">العنوان بالإنجليزية *</label><input value={nf.title} onChange={e => setNf(p => ({ ...p, title: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              </div>
              <div><label className="text-sm text-muted-foreground mb-1 block">رابط الصورة</label><input value={nf.imageUrl} onChange={e => setNf(p => ({ ...p, imageUrl: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="https://..." /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">رابط الوجهة</label><input value={nf.linkUrl} onChange={e => setNf(p => ({ ...p, linkUrl: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">الموضع</label>
                <select value={nf.position} onChange={e => setNf(p => ({ ...p, position: e.target.value as Banner['position'] }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                  <option value="hero">الرئيسية</option><option value="sidebar">الشريط الجانبي</option><option value="footer">التذييل</option><option value="popup">نافذة منبثقة</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">تاريخ البداية</label><input type="date" value={nf.startDate} onChange={e => setNf(p => ({ ...p, startDate: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">تاريخ النهاية</label><input type="date" value={nf.endDate} onChange={e => setNf(p => ({ ...p, endDate: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
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
