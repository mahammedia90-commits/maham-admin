/*
 * CategoriesPage — إدارة فئات الفعاليات والخدمات
 * Design: Maham Admin Dark Theme — Gold accents, glass-card, RTL
 * Matches Laravel Dashboard /dashboard/categories
 */
import { useState } from 'react';
import { Tags, Plus, Pencil, Trash2, FolderTree, ToggleLeft, ToggleRight, GripVertical, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  parentId: number | null;
  parentName: string | null;
  eventsCount: number;
  spacesCount: number;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const mockCategories: Category[] = [
  { id: 1, name: 'Technology', nameAr: 'التقنية', slug: 'technology', description: 'معارض التقنية والابتكار', icon: '💻', image: '', parentId: null, parentName: null, eventsCount: 12, spacesCount: 45, order: 1, isActive: true, createdAt: '2025-01-15' },
  { id: 2, name: 'Food & Beverage', nameAr: 'الأغذية والمشروبات', slug: 'food-beverage', description: 'معارض الأغذية والمشروبات', icon: '🍽️', image: '', parentId: null, parentName: null, eventsCount: 8, spacesCount: 32, order: 2, isActive: true, createdAt: '2025-01-20' },
  { id: 3, name: 'Fashion', nameAr: 'الأزياء', slug: 'fashion', description: 'معارض الأزياء والموضة', icon: '👗', image: '', parentId: null, parentName: null, eventsCount: 5, spacesCount: 18, order: 3, isActive: true, createdAt: '2025-02-01' },
  { id: 4, name: 'Real Estate', nameAr: 'العقارات', slug: 'real-estate', description: 'معارض العقارات والاستثمار', icon: '🏢', image: '', parentId: null, parentName: null, eventsCount: 7, spacesCount: 28, order: 4, isActive: true, createdAt: '2025-02-10' },
  { id: 5, name: 'Health', nameAr: 'الصحة', slug: 'health', description: 'معارض الصحة والعافية', icon: '🏥', image: '', parentId: null, parentName: null, eventsCount: 4, spacesCount: 15, order: 5, isActive: true, createdAt: '2025-02-15' },
  { id: 6, name: 'AI & Robotics', nameAr: 'الذكاء الاصطناعي', slug: 'ai-robotics', description: 'معارض الذكاء الاصطناعي والروبوتات', icon: '🤖', image: '', parentId: 1, parentName: 'التقنية', eventsCount: 3, spacesCount: 12, order: 1, isActive: true, createdAt: '2025-03-01' },
  { id: 7, name: 'Automotive', nameAr: 'السيارات', slug: 'automotive', description: 'معارض السيارات', icon: '🚗', image: '', parentId: null, parentName: null, eventsCount: 6, spacesCount: 22, order: 6, isActive: false, createdAt: '2025-03-10' },
  { id: 8, name: 'Education', nameAr: 'التعليم', slug: 'education', description: 'معارض التعليم والتدريب', icon: '📚', image: '', parentId: null, parentName: null, eventsCount: 9, spacesCount: 35, order: 7, isActive: true, createdAt: '2025-03-15' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [nf, setNf] = useState({ name: '', nameAr: '', slug: '', description: '', icon: '', parentId: '' as string, isActive: true });

  const filtered = categories.filter(c =>
    c.nameAr.includes(search) || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!nf.nameAr || !nf.name) { toast.error('يرجى ملء الحقول المطلوبة'); return; }
    if (editItem) {
      setCategories(prev => prev.map(c => c.id === editItem.id ? { ...c, name: nf.name, nameAr: nf.nameAr, slug: nf.slug, description: nf.description, icon: nf.icon, parentId: nf.parentId ? Number(nf.parentId) : null, isActive: nf.isActive } : c));
      toast.success('تم تحديث الفئة بنجاح');
    } else {
      const newCat: Category = { id: Date.now(), name: nf.name, nameAr: nf.nameAr, slug: nf.slug || nf.name.toLowerCase().replace(/\s+/g, '-'), description: nf.description, icon: nf.icon || '📁', image: '', parentId: nf.parentId ? Number(nf.parentId) : null, parentName: nf.parentId ? categories.find(c => c.id === Number(nf.parentId))?.nameAr || null : null, eventsCount: 0, spacesCount: 0, order: categories.length + 1, isActive: nf.isActive, createdAt: new Date().toISOString() };
      setCategories(prev => [...prev, newCat]);
      toast.success('تم إضافة الفئة بنجاح');
    }
    setShowAdd(false); setEditItem(null); setNf({ name: '', nameAr: '', slug: '', description: '', icon: '', parentId: '', isActive: true });
  };

  const handleDelete = (id: number) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success('تم حذف الفئة');
  };

  const handleToggle = (id: number) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    toast.success('تم تحديث الحالة');
  };

  const openEdit = (cat: Category) => {
    setEditItem(cat);
    setNf({ name: cat.name, nameAr: cat.nameAr, slug: cat.slug, description: cat.description, icon: cat.icon, parentId: cat.parentId?.toString() || '', isActive: cat.isActive });
    setShowAdd(true);
  };

  const columns: Column<Category>[] = [
    { key: 'icon', label: '', width: '50px', render: (_, r) => <span className="text-2xl">{r.icon}</span> },
    { key: 'nameAr', label: 'الاسم', render: (_, r) => (
      <div><p className="font-semibold text-foreground">{r.nameAr}</p><p className="text-xs text-muted-foreground">{r.name}</p></div>
    )},
    { key: 'parentName', label: 'الفئة الأب', render: (v) => v ? <span className="text-sm text-accent">{v}</span> : <span className="text-muted-foreground text-xs">رئيسية</span> },
    { key: 'eventsCount', label: 'الفعاليات', sortable: true, render: (v) => <span className="font-mono text-sm">{v}</span> },
    { key: 'spacesCount', label: 'المساحات', sortable: true, render: (v) => <span className="font-mono text-sm">{v}</span> },
    { key: 'isActive', label: 'الحالة', render: (_, r) => <StatusBadge status={r.isActive ? 'active' : 'draft'} /> },
    { key: 'createdAt', label: 'تاريخ الإنشاء', render: (v) => <span className="text-sm">{formatDate(v)}</span> },
    { key: 'actions', label: 'إجراءات', render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); handleToggle(r.id); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors">
          {r.isActive ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); openEdit(r); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors">
          <Pencil className="w-4 h-4 text-accent" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors">
          <Trash2 className="w-4 h-4 text-danger" />
        </button>
      </div>
    )},
  ];

  const rootCats = categories.filter(c => !c.parentId);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة الفئات" subtitle={`${categories.length} فئة — ${rootCats.length} رئيسية`} actions={
          <Button onClick={() => { setEditItem(null); setNf({ name: '', nameAr: '', slug: '', description: '', icon: '', parentId: '', isActive: true }); setShowAdd(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
            <Plus className="w-4 h-4" /> إضافة فئة
          </Button>
        } />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="إجمالي الفئات" value={categories.length} icon={Tags} trend={12} trendLabel="هذا الشهر" />
          <StatsCard title="فئات رئيسية" value={rootCats.length} icon={FolderTree} delay={0.1} />
          <StatsCard title="فئات فرعية" value={categories.length - rootCats.length} icon={Tags} delay={0.2} />
          <StatsCard title="فئات نشطة" value={categories.filter(c => c.isActive).length} icon={Tags} trend={100} delay={0.3} />
        </div>

        <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في الفئات..." emptyMessage="لا توجد فئات" />

        <Dialog open={showAdd} onOpenChange={(v) => { setShowAdd(v); if (!v) setEditItem(null); }}>
          <DialogContent className="glass-card border-border/50 max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle>{editItem ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">الاسم بالعربية *</label><input value={nf.nameAr} onChange={e => setNf(p => ({ ...p, nameAr: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">الاسم بالإنجليزية *</label><input value={nf.name} onChange={e => setNf(p => ({ ...p, name: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              </div>
              <div><label className="text-sm text-muted-foreground mb-1 block">Slug</label><input value={nf.slug} onChange={e => setNf(p => ({ ...p, slug: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" placeholder="auto-generated" /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">الوصف</label><textarea value={nf.description} onChange={e => setNf(p => ({ ...p, description: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm h-20 resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">الأيقونة (Emoji)</label><input value={nf.icon} onChange={e => setNf(p => ({ ...p, icon: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-center text-xl" placeholder="📁" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">الفئة الأب</label>
                  <select value={nf.parentId} onChange={e => setNf(p => ({ ...p, parentId: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                    <option value="">بدون (رئيسية)</option>
                    {rootCats.filter(c => c.id !== editItem?.id).map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
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
