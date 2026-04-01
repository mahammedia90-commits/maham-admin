/*
 * CitiesPage — إدارة المدن المتاحة للفعاليات
 * Matches Laravel Dashboard /dashboard/cities
 */
import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface City {
  id: number; name: string; nameAr: string; region: string; regionAr: string;
  eventsCount: number; spacesCount: number; lat: number; lng: number;
  isActive: boolean; createdAt: string;
}

const mockCities: City[] = [
  { id: 1, name: 'Riyadh', nameAr: 'الرياض', region: 'Central', regionAr: 'المنطقة الوسطى', eventsCount: 25, spacesCount: 120, lat: 24.7136, lng: 46.6753, isActive: true, createdAt: '2025-01-01' },
  { id: 2, name: 'Jeddah', nameAr: 'جدة', region: 'Western', regionAr: 'المنطقة الغربية', eventsCount: 18, spacesCount: 85, lat: 21.4858, lng: 39.1925, isActive: true, createdAt: '2025-01-01' },
  { id: 3, name: 'Dammam', nameAr: 'الدمام', region: 'Eastern', regionAr: 'المنطقة الشرقية', eventsCount: 12, spacesCount: 55, lat: 26.4207, lng: 50.0888, isActive: true, createdAt: '2025-01-05' },
  { id: 4, name: 'Makkah', nameAr: 'مكة المكرمة', region: 'Western', regionAr: 'المنطقة الغربية', eventsCount: 8, spacesCount: 30, lat: 21.3891, lng: 39.8579, isActive: true, createdAt: '2025-01-10' },
  { id: 5, name: 'Madinah', nameAr: 'المدينة المنورة', region: 'Western', regionAr: 'المنطقة الغربية', eventsCount: 6, spacesCount: 22, lat: 24.5247, lng: 39.5692, isActive: true, createdAt: '2025-01-15' },
  { id: 6, name: 'Tabuk', nameAr: 'تبوك', region: 'Northern', regionAr: 'المنطقة الشمالية', eventsCount: 3, spacesCount: 10, lat: 28.3835, lng: 36.5662, isActive: false, createdAt: '2025-02-01' },
  { id: 7, name: 'Abha', nameAr: 'أبها', region: 'Southern', regionAr: 'المنطقة الجنوبية', eventsCount: 4, spacesCount: 15, lat: 18.2164, lng: 42.5053, isActive: true, createdAt: '2025-02-10' },
  { id: 8, name: 'NEOM', nameAr: 'نيوم', region: 'Northern', regionAr: 'المنطقة الشمالية', eventsCount: 2, spacesCount: 8, lat: 27.9500, lng: 35.3000, isActive: true, createdAt: '2025-03-01' },
];

export default function CitiesPage() {
  const [cities, setCities] = useState(mockCities);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<City | null>(null);
  const [search, setSearch] = useState('');
  const [nf, setNf] = useState({ name: '', nameAr: '', region: '', regionAr: '', lat: '', lng: '', isActive: true });

  const filtered = cities.filter(c => c.nameAr.includes(search) || c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!nf.nameAr || !nf.name) { toast.error('يرجى ملء الحقول المطلوبة'); return; }
    if (editItem) {
      setCities(prev => prev.map(c => c.id === editItem.id ? { ...c, name: nf.name, nameAr: nf.nameAr, region: nf.region, regionAr: nf.regionAr, lat: Number(nf.lat), lng: Number(nf.lng), isActive: nf.isActive } : c));
      toast.success('تم تحديث المدينة');
    } else {
      setCities(prev => [...prev, { id: Date.now(), name: nf.name, nameAr: nf.nameAr, region: nf.region, regionAr: nf.regionAr, eventsCount: 0, spacesCount: 0, lat: Number(nf.lat) || 0, lng: Number(nf.lng) || 0, isActive: nf.isActive, createdAt: new Date().toISOString() }]);
      toast.success('تم إضافة المدينة');
    }
    setShowAdd(false); setEditItem(null); setNf({ name: '', nameAr: '', region: '', regionAr: '', lat: '', lng: '', isActive: true });
  };

  const handleDelete = (id: number) => { setCities(prev => prev.filter(c => c.id !== id)); toast.success('تم حذف المدينة'); };
  const handleToggle = (id: number) => { setCities(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)); toast.success('تم تحديث الحالة'); };
  const openEdit = (city: City) => { setEditItem(city); setNf({ name: city.name, nameAr: city.nameAr, region: city.region, regionAr: city.regionAr, lat: city.lat.toString(), lng: city.lng.toString(), isActive: city.isActive }); setShowAdd(true); };

  const columns: Column<City>[] = [
    { key: 'nameAr', label: 'المدينة', render: (_, r) => (<div><p className="font-semibold text-foreground">{r.nameAr}</p><p className="text-xs text-muted-foreground">{r.name}</p></div>) },
    { key: 'regionAr', label: 'المنطقة', render: (v) => <span className="text-sm text-accent">{v}</span> },
    { key: 'eventsCount', label: 'الفعاليات', sortable: true, render: (v) => <span className="font-mono text-sm">{v}</span> },
    { key: 'spacesCount', label: 'المساحات', sortable: true, render: (v) => <span className="font-mono text-sm">{v}</span> },
    { key: 'isActive', label: 'الحالة', render: (_, r) => <StatusBadge status={r.isActive ? 'active' : 'draft'} /> },
    { key: 'createdAt', label: 'تاريخ الإنشاء', render: (v) => <span className="text-sm">{formatDate(v)}</span> },
    { key: 'actions', label: 'إجراءات', render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); handleToggle(r.id); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors">{r.isActive ? <ToggleRight className="w-4 h-4 text-success" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}</button>
        <button onClick={(e) => { e.stopPropagation(); openEdit(r); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"><Pencil className="w-4 h-4 text-accent" /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4 text-danger" /></button>
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة المدن" subtitle={`${cities.length} مدينة`} actions={
          <Button onClick={() => { setEditItem(null); setNf({ name: '', nameAr: '', region: '', regionAr: '', lat: '', lng: '', isActive: true }); setShowAdd(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> إضافة مدينة</Button>
        } />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="إجمالي المدن" value={cities.length} icon={MapPin} trend={8} trendLabel="هذا الشهر" />
          <StatsCard title="مدن نشطة" value={cities.filter(c => c.isActive).length} icon={Globe} delay={0.1} />
          <StatsCard title="إجمالي الفعاليات" value={cities.reduce((s, c) => s + c.eventsCount, 0)} icon={MapPin} delay={0.2} />
          <StatsCard title="إجمالي المساحات" value={cities.reduce((s, c) => s + c.spacesCount, 0)} icon={MapPin} delay={0.3} />
        </div>
        <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في المدن..." emptyMessage="لا توجد مدن" />
        <Dialog open={showAdd} onOpenChange={(v) => { setShowAdd(v); if (!v) setEditItem(null); }}>
          <DialogContent className="glass-card border-border/50 max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle>{editItem ? 'تعديل المدينة' : 'إضافة مدينة جديدة'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">الاسم بالعربية *</label><input value={nf.nameAr} onChange={e => setNf(p => ({ ...p, nameAr: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">الاسم بالإنجليزية *</label><input value={nf.name} onChange={e => setNf(p => ({ ...p, name: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">المنطقة بالعربية</label><input value={nf.regionAr} onChange={e => setNf(p => ({ ...p, regionAr: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">المنطقة بالإنجليزية</label><input value={nf.region} onChange={e => setNf(p => ({ ...p, region: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-muted-foreground mb-1 block">خط العرض</label><input type="number" step="any" value={nf.lat} onChange={e => setNf(p => ({ ...p, lat: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
                <div><label className="text-sm text-muted-foreground mb-1 block">خط الطول</label><input type="number" step="any" value={nf.lng} onChange={e => setNf(p => ({ ...p, lng: e.target.value }))} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
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
