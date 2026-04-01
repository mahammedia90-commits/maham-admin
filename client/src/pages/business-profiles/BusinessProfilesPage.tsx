/*
 * BusinessProfilesPage — إدارة الملفات التجارية
 * Matches Laravel Dashboard /dashboard/business-profiles
 */
import { useState } from 'react';
import { Building2, Eye, CheckCircle, XCircle, Globe, Phone, Mail, MapPin, FileText, Star } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDate, formatCurrency } from '@/lib/utils';

interface BusinessProfile {
  id: number; companyName: string; companyNameAr: string; ownerName: string;
  userType: 'investor' | 'merchant' | 'sponsor'; crNumber: string;
  email: string; phone: string; website: string; city: string;
  sector: string; employeeCount: number; annualRevenue: number;
  kycStatus: 'verified' | 'pending' | 'rejected'; rating: number;
  eventsParticipated: number; totalSpending: number;
  status: 'active' | 'pending' | 'draft'; createdAt: string;
}

const mockProfiles: BusinessProfile[] = [
  { id: 1, companyName: 'Al Shamri Trading', companyNameAr: 'شركة الشمري للتجارة', ownerName: 'أحمد الشمري', userType: 'merchant', crNumber: '1010123456', email: 'info@shamri.sa', phone: '+966501234567', website: 'shamri.sa', city: 'الرياض', sector: 'تجارة عامة', employeeCount: 45, annualRevenue: 5200000, kycStatus: 'verified', rating: 4.5, eventsParticipated: 8, totalSpending: 185000, status: 'active', createdAt: '2025-06-15' },
  { id: 2, companyName: 'Dosari Investments', companyNameAr: 'استثمارات الدوسري', ownerName: 'فهد الدوسري', userType: 'investor', crNumber: '1010234567', email: 'info@dosari.sa', phone: '+966502345678', website: 'dosari-inv.sa', city: 'جدة', sector: 'استثمار', employeeCount: 120, annualRevenue: 25000000, kycStatus: 'verified', rating: 4.8, eventsParticipated: 12, totalSpending: 520000, status: 'active', createdAt: '2025-03-01' },
  { id: 3, companyName: 'Otaibi Group', companyNameAr: 'مجموعة العتيبي', ownerName: 'سارة العتيبي', userType: 'sponsor', crNumber: '1010345678', email: 'info@otaibi.sa', phone: '+966503456789', website: 'otaibi-group.sa', city: 'الرياض', sector: 'تقنية', employeeCount: 200, annualRevenue: 45000000, kycStatus: 'verified', rating: 4.9, eventsParticipated: 15, totalSpending: 850000, status: 'active', createdAt: '2025-01-10' },
  { id: 4, companyName: 'Mutairi Trading', companyNameAr: 'تجارة المطيري', ownerName: 'خالد المطيري', userType: 'merchant', crNumber: '1010456789', email: 'info@mutairi.sa', phone: '+966504567890', website: '', city: 'الدمام', sector: 'أغذية', employeeCount: 15, annualRevenue: 1800000, kycStatus: 'rejected', rating: 3.2, eventsParticipated: 2, totalSpending: 35000, status: 'pending', createdAt: '2026-01-20' },
  { id: 5, companyName: 'Zahrani Capital', companyNameAr: 'زهراني كابيتال', ownerName: 'ريم الزهراني', userType: 'investor', crNumber: '1010567890', email: 'info@zahrani.sa', phone: '+966505678901', website: 'zahrani.sa', city: 'الرياض', sector: 'مالية', employeeCount: 30, annualRevenue: 15000000, kycStatus: 'pending', rating: 0, eventsParticipated: 0, totalSpending: 0, status: 'pending', createdAt: '2026-03-25' },
  { id: 6, companyName: 'Tech Vision', companyNameAr: 'رؤية التقنية', ownerName: 'محمد القحطاني', userType: 'sponsor', crNumber: '1010678901', email: 'info@techvision.sa', phone: '+966506789012', website: 'techvision.sa', city: 'الرياض', sector: 'تقنية معلومات', employeeCount: 85, annualRevenue: 12000000, kycStatus: 'verified', rating: 4.6, eventsParticipated: 6, totalSpending: 320000, status: 'active', createdAt: '2025-08-10' },
];

const userTypeLabels: Record<string, string> = { investor: 'مستثمر', merchant: 'تاجر', sponsor: 'راعي' };
const userTypeColors: Record<string, string> = { investor: 'bg-info/15 text-info border-info/20', merchant: 'bg-accent/15 text-accent border-accent/20', sponsor: 'bg-success/15 text-success border-success/20' };

export default function BusinessProfilesPage() {
  const [profiles] = useState(mockProfiles);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(null);

  const filtered = profiles.filter(p => {
    const matchSearch = p.companyNameAr.includes(search) || p.ownerName.includes(search) || p.crNumber.includes(search);
    const matchType = filterType === 'all' || p.userType === filterType;
    return matchSearch && matchType;
  });

  const columns: Column<BusinessProfile>[] = [
    { key: 'companyNameAr', label: 'الشركة', render: (_, r) => (
      <div><p className="font-semibold text-foreground text-sm">{r.companyNameAr}</p><p className="text-xs text-muted-foreground">{r.ownerName}</p></div>
    )},
    { key: 'userType', label: 'النوع', render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${userTypeColors[v]}`}>{userTypeLabels[v]}</span> },
    { key: 'city', label: 'المدينة' },
    { key: 'sector', label: 'القطاع' },
    { key: 'kycStatus', label: 'KYC', render: (_, r) => <StatusBadge status={r.kycStatus === 'verified' ? 'approved' : r.kycStatus} /> },
    { key: 'rating', label: 'التقييم', sortable: true, render: (v) => v > 0 ? <span className="flex items-center gap-1 text-sm"><Star className="w-3 h-3 text-accent fill-accent" /> {v}</span> : <span className="text-xs text-muted-foreground">—</span> },
    { key: 'totalSpending', label: 'الإنفاق', sortable: true, render: (v) => <span className="text-sm font-mono">{formatCurrency(v)}</span> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: (_, r) => (
      <button onClick={(e) => { e.stopPropagation(); setSelectedProfile(r); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"><Eye className="w-4 h-4 text-accent" /></button>
    )},
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="الملفات التجارية" subtitle={`${profiles.length} ملف تجاري`} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="إجمالي الملفات" value={profiles.length} icon={Building2} />
          <StatsCard title="تجار" value={profiles.filter(p => p.userType === 'merchant').length} icon={Building2} delay={0.1} />
          <StatsCard title="مستثمرون" value={profiles.filter(p => p.userType === 'investor').length} icon={Building2} delay={0.2} />
          <StatsCard title="رعاة" value={profiles.filter(p => p.userType === 'sponsor').length} icon={Building2} delay={0.3} />
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'merchant', 'investor', 'sponsor'].map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterType === t ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card'}`}>
              {t === 'all' ? 'الكل' : userTypeLabels[t]} ({t === 'all' ? profiles.length : profiles.filter(p => p.userType === t).length})
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث بالاسم أو السجل التجاري..." emptyMessage="لا توجد ملفات تجارية" onRowClick={setSelectedProfile} />

        <Dialog open={!!selectedProfile} onOpenChange={(v) => { if (!v) setSelectedProfile(null); }}>
          <DialogContent className="glass-card border-border/50 max-w-2xl" dir="rtl">
            <DialogHeader><DialogTitle>الملف التجاري — {selectedProfile?.companyNameAr}</DialogTitle></DialogHeader>
            {selectedProfile && (
              <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-3 space-y-2">
                    <p className="text-xs text-muted-foreground">معلومات الشركة</p>
                    <p className="font-semibold text-lg">{selectedProfile.companyNameAr}</p>
                    <p className="text-sm text-muted-foreground">{selectedProfile.companyName}</p>
                    <p className="text-xs font-mono">سجل: {selectedProfile.crNumber}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${userTypeColors[selectedProfile.userType]}`}>{userTypeLabels[selectedProfile.userType]}</span>
                  </div>
                  <div className="glass-card p-3 space-y-2">
                    <p className="text-xs text-muted-foreground">معلومات التواصل</p>
                    <p className="text-sm flex items-center gap-2"><Mail className="w-3 h-3" /> {selectedProfile.email}</p>
                    <p className="text-sm flex items-center gap-2"><Phone className="w-3 h-3" /> {selectedProfile.phone}</p>
                    {selectedProfile.website && <p className="text-sm flex items-center gap-2"><Globe className="w-3 h-3" /> {selectedProfile.website}</p>}
                    <p className="text-sm flex items-center gap-2"><MapPin className="w-3 h-3" /> {selectedProfile.city}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">القطاع</p><p className="font-semibold text-sm mt-1">{selectedProfile.sector}</p></div>
                  <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">الموظفون</p><p className="font-semibold text-sm mt-1">{selectedProfile.employeeCount}</p></div>
                  <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">الإيراد السنوي</p><p className="font-semibold text-sm mt-1">{formatCurrency(selectedProfile.annualRevenue)}</p></div>
                  <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">التقييم</p><p className="font-semibold text-sm mt-1 flex items-center justify-center gap-1">{selectedProfile.rating > 0 ? <><Star className="w-3 h-3 text-accent fill-accent" /> {selectedProfile.rating}</> : '—'}</p></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">KYC</p><div className="mt-1"><StatusBadge status={selectedProfile.kycStatus === 'verified' ? 'approved' : selectedProfile.kycStatus} /></div></div>
                  <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">الفعاليات</p><p className="font-semibold text-lg mt-1 text-accent">{selectedProfile.eventsParticipated}</p></div>
                  <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">إجمالي الإنفاق</p><p className="font-semibold text-sm mt-1">{formatCurrency(selectedProfile.totalSpending)}</p></div>
                </div>
                <p className="text-xs text-muted-foreground">تاريخ التسجيل: {formatDate(selectedProfile.createdAt)}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
