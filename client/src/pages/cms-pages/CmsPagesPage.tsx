/*
 * CmsPagesPage — إدارة صفحات المحتوى CMS
 * Matches Laravel Dashboard /dashboard/pages
 */
import { useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Eye, Globe, ToggleLeft, ToggleRight, Code } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDate, formatNumber } from '@/lib/utils';

interface CmsPage {
  id: number; title: string; titleAr: string; slug: string; content: string;
  metaTitle: string; metaDescription: string; status: 'published' | 'draft';
  views: number; template: string; order: number; createdAt: string; updatedAt: string;
}

const mockPages: CmsPage[] = [
  { id: 1, title: 'About Us', titleAr: 'من نحن', slug: 'about-us', content: '<h1>عن مهام إكسبو</h1><p>منصة رائدة لتنظيم المعارض...</p>', metaTitle: 'من نحن — مهام إكسبو', metaDescription: 'تعرف على مهام إكسبو', status: 'published', views: 12500, template: 'default', order: 1, createdAt: '2025-01-01', updatedAt: '2026-03-15' },
  { id: 2, title: 'Privacy Policy', titleAr: 'سياسة الخصوصية', slug: 'privacy-policy', content: '<h1>سياسة الخصوصية</h1>', metaTitle: 'سياسة الخصوصية', metaDescription: '', status: 'published', views: 3200, template: 'legal', order: 2, createdAt: '2025-01-01', updatedAt: '2025-12-01' },
  { id: 3, title: 'Terms of Service', titleAr: 'شروط الاستخدام', slug: 'terms-of-service', content: '<h1>شروط الاستخدام</h1>', metaTitle: 'شروط الاستخدام', metaDescription: '', status: 'published', views: 2800, template: 'legal', order: 3, createdAt: '2025-01-01', updatedAt: '2025-12-01' },
  { id: 4, title: 'For Investors', titleAr: 'للمستثمرين', slug: 'for-investors', content: '<h1>فرص الاستثمار</h1>', metaTitle: 'للمستثمرين', metaDescription: 'اكتشف فرص الاستثمار', status: 'published', views: 8900, template: 'landing', order: 4, createdAt: '2025-02-01', updatedAt: '2026-03-20' },
  { id: 5, title: 'For Merchants', titleAr: 'للتجار', slug: 'for-merchants', content: '<h1>احجز مساحتك</h1>', metaTitle: 'للتجار', metaDescription: 'احجز مساحتك في المعرض', status: 'published', views: 7600, template: 'landing', order: 5, createdAt: '2025-02-01', updatedAt: '2026-03-20' },
  { id: 6, title: 'Contact Us', titleAr: 'اتصل بنا', slug: 'contact-us', content: '<h1>تواصل معنا</h1>', metaTitle: 'اتصل بنا', metaDescription: '', status: 'draft', views: 0, template: 'contact', order: 6, createdAt: '2026-03-01', updatedAt: '2026-03-01' },
  { id: 7, title: 'Blog', titleAr: 'المدونة', slug: 'blog', content: '', metaTitle: 'مدونة مهام إكسبو', metaDescription: '', status: 'draft', views: 0, template: 'blog', order: 7, createdAt: '2026-03-15', updatedAt: '2026-03-15' },
];

const templateLabels: Record<string, string> = { default: 'افتراضي', legal: 'قانوني', landing: 'هبوط', contact: 'تواصل', blog: 'مدونة' };

export default function CmsPagesPage() {
  const [pages, setPages] = useState(mockPages);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<CmsPage | null>(null);
  const [search, setSearch] = useState('');
  const [nf, setNf] = useState({ title: '', titleAr: '', slug: '', content: '', metaTitle: '', metaDescription: '', template: 'default', status: 'draft' as CmsPage['status'] });

  const filtered = pages.filter(p => p.titleAr.includes(search) || p.title.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!nf.titleAr || !nf.title) { toast.error('يرجى ملء الحقول المطلوبة'); return; }
    if (editItem) {
      setPages(prev => prev.map(p => p.id === editItem.id ? { ...p, ...nf, updatedAt: new Date().toISOString() } : p));
      toast.success('تم تحديث الصفحة');
    } else {
      setPages(prev => [...prev, { id: Date.now(), ...nf, slug: nf.slug || nf.title.toLowerCase().replace(/\s+/g, '-'), views: 0, order: pages.length + 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
      toast.success('تم إضافة الصفحة');
    }
    setShowAdd(false); setEditItem(null);
  };

  const handleDelete = (id: number) => { setPages(prev => prev.filter(p => p.id !== id)); toast.success('تم حذف الصفحة'); };

  const columns: Column<CmsPage>[] = [
    { key: 'titleAr', label: 'العنوان', render: (_, r) => (<div><p className="font-semibold text-foreground">{r.titleAr}</p><p className="text-xs text-muted-foreground font-mono">/{r.slug}</p></div>) },
    { key: 'template', label: 'القالب', render: (v) => <span className="text-sm px-2 py-0.5 rounded bg-card/50 border border-border/50">{templateLabels[v] || v}</span> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'views', label: 'المشاهدات', sortable: true, render: (v) => <span className="font-mono text-sm">{formatNumber(v)}</span> },
    { key: 'updatedAt', label: 'آخر تحديث', render: (v) => <span className="text-sm">{formatDate(v)}</span> },
    { key: 'actions', label: 'إجراءات', render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditItem(r); setNf({ title: r.title, titleAr: r.titleAr, slug: r.slug, content: r.content, metaTitle: r.metaTitle, metaDescription: r.metaDescription, template: r.template, status: r.status }); setShowAdd(true); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"><Pencil className="w-4 h-4 text-accent" /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4 text-danger" /></button>
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة صفحات المحتوى" subtitle={`${pages.length} صفحة`} actions={
          <Button onClick={() => { setEditItem(null); setNf({ title: '', titleAr: '', slug: '', content: '', metaTitle: '', metaDescription: '', template: 'default', status: 'draft' }); setShowAdd(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> إضافة صفحة</Button>
        } />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="إجمالي الصفحات" value={pages.length} icon={FileText} />
          <StatsCard title="منشورة" value={pages.filter(p => p.status === 'published').length} icon={Globe} delay={0.1} />
          <StatsCard title="مسودات" value={pages.filter(p => p.status === 'draft').length} icon={FileText} delay={0.2} />
          <StatsCard title="إجمالي المشاهدات" value={formatNumber(pages.reduce((s, p) => s + p.views, 0))} icon={Eye} delay={0.3} />
        </div>
        <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في الصفحات..." emptyMessage="لا توجد صفحات" />
        <Dialog open={showAdd} onOpenChange={(v) => { setShowAdd(v); if (!v) setEditItem(null); }}>
          <DialogContent className="glass-card border-border/50 max-w-2xl" dir="rtl">
            <DialogHeader><DialogTitle>{editItem ? 'تعديل الصفحة' : 'إضافة صفحة جديدة'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">العنوان بالعربية *</label><input value={nf.titleAr} onChange={e => setNf(p => ({ ...p, titleAr: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">العنوان بالإنجليزية *</label><input value={nf.title} onChange={e => setNf(p => ({ ...p, title: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">Slug</label><input value={nf.slug} onChange={e => setNf(p => ({ ...p, slug: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">القالب</label>
                  <select value={nf.template} onChange={e => setNf(p => ({ ...p, template: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                    <option value="default">افتراضي</option><option value="legal">قانوني</option><option value="landing">هبوط</option><option value="contact">تواصل</option><option value="blog">مدونة</option>
                  </select>
                </div>
              </div>
              <div><label className="text-sm text-muted-foreground mb-1 block">المحتوى (HTML)</label><textarea value={nf.content} onChange={e => setNf(p => ({ ...p, content: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm h-40 resize-none font-mono text-xs" dir="ltr" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">Meta Title</label><input value={nf.metaTitle} onChange={e => setNf(p => ({ ...p, metaTitle: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">Meta Description</label><textarea value={nf.metaDescription} onChange={e => setNf(p => ({ ...p, metaDescription: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm h-16 resize-none" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">الحالة</label>
                <select value={nf.status} onChange={e => setNf(p => ({ ...p, status: e.target.value as CmsPage['status'] }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                  <option value="draft">مسودة</option><option value="published">منشورة</option>
                </select>
              </div>
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
