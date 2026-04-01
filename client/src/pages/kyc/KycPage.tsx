/*
 * KycPage — إدارة طلبات التحقق من الهوية KYC
 * Matches Laravel Dashboard /dashboard/kyc-verification
 */
import { useState } from 'react';
import { ShieldCheck, Clock, CheckCircle, XCircle, Eye, FileText, Building2, User, AlertTriangle, Download } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDate, formatDateTime } from '@/lib/utils';
import { motion } from 'framer-motion';

interface KycRequest {
  id: number; userName: string; userEmail: string; userType: 'investor' | 'merchant' | 'sponsor';
  companyName: string; companyNameAr: string; crNumber: string; nationalId: string;
  documents: { name: string; type: string; uploaded: boolean }[];
  status: 'pending' | 'review' | 'approved' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high';
  notes: string; reviewedBy: string | null; submittedAt: string; reviewedAt: string | null;
}

const mockKyc: KycRequest[] = [
  { id: 1, userName: 'أحمد الشمري', userEmail: 'ahmed@company.sa', userType: 'merchant', companyName: 'Al Shamri Trading', companyNameAr: 'شركة الشمري للتجارة', crNumber: '1010123456', nationalId: '1087654321', documents: [{ name: 'السجل التجاري', type: 'cr', uploaded: true }, { name: 'الهوية الوطنية', type: 'id', uploaded: true }, { name: 'شهادة الزكاة', type: 'zatca', uploaded: true }, { name: 'عنوان العمل', type: 'address', uploaded: true }], status: 'pending', riskLevel: 'low', notes: '', reviewedBy: null, submittedAt: '2026-03-28T10:30:00', reviewedAt: null },
  { id: 2, userName: 'فهد الدوسري', userEmail: 'fahad@invest.sa', userType: 'investor', companyName: 'Dosari Investments', companyNameAr: 'استثمارات الدوسري', crNumber: '1010234567', nationalId: '1098765432', documents: [{ name: 'السجل التجاري', type: 'cr', uploaded: true }, { name: 'الهوية الوطنية', type: 'id', uploaded: true }, { name: 'شهادة الزكاة', type: 'zatca', uploaded: true }, { name: 'عنوان العمل', type: 'address', uploaded: false }], status: 'review', riskLevel: 'medium', notes: 'عنوان العمل غير مرفق', reviewedBy: 'نور كرم', submittedAt: '2026-03-25T14:00:00', reviewedAt: null },
  { id: 3, userName: 'سارة العتيبي', userEmail: 'sara@sponsor.sa', userType: 'sponsor', companyName: 'Otaibi Group', companyNameAr: 'مجموعة العتيبي', crNumber: '1010345678', nationalId: '1076543210', documents: [{ name: 'السجل التجاري', type: 'cr', uploaded: true }, { name: 'الهوية الوطنية', type: 'id', uploaded: true }, { name: 'شهادة الزكاة', type: 'zatca', uploaded: true }, { name: 'عنوان العمل', type: 'address', uploaded: true }], status: 'approved', riskLevel: 'low', notes: 'تم التحقق بنجاح', reviewedBy: 'نور كرم', submittedAt: '2026-03-20T09:00:00', reviewedAt: '2026-03-21T11:30:00' },
  { id: 4, userName: 'خالد المطيري', userEmail: 'khalid@trade.sa', userType: 'merchant', companyName: 'Mutairi Trading', companyNameAr: 'تجارة المطيري', crNumber: '1010456789', nationalId: '1065432109', documents: [{ name: 'السجل التجاري', type: 'cr', uploaded: true }, { name: 'الهوية الوطنية', type: 'id', uploaded: true }, { name: 'شهادة الزكاة', type: 'zatca', uploaded: false }, { name: 'عنوان العمل', type: 'address', uploaded: false }], status: 'rejected', riskLevel: 'high', notes: 'مستندات ناقصة — السجل التجاري منتهي', reviewedBy: 'أحمد المدير', submittedAt: '2026-03-15T16:00:00', reviewedAt: '2026-03-17T10:00:00' },
  { id: 5, userName: 'ريم الزهراني', userEmail: 'reem@co.sa', userType: 'investor', companyName: 'Zahrani Capital', companyNameAr: 'زهراني كابيتال', crNumber: '1010567890', nationalId: '1054321098', documents: [{ name: 'السجل التجاري', type: 'cr', uploaded: true }, { name: 'الهوية الوطنية', type: 'id', uploaded: true }, { name: 'شهادة الزكاة', type: 'zatca', uploaded: true }, { name: 'عنوان العمل', type: 'address', uploaded: true }], status: 'pending', riskLevel: 'low', notes: '', reviewedBy: null, submittedAt: '2026-03-30T08:00:00', reviewedAt: null },
  { id: 6, userName: 'عبدالله الحربي', userEmail: 'abdullah@biz.sa', userType: 'merchant', companyName: 'Harbi Business', companyNameAr: 'أعمال الحربي', crNumber: '1010678901', nationalId: '1043210987', documents: [{ name: 'السجل التجاري', type: 'cr', uploaded: true }, { name: 'الهوية الوطنية', type: 'id', uploaded: true }, { name: 'شهادة الزكاة', type: 'zatca', uploaded: true }, { name: 'عنوان العمل', type: 'address', uploaded: true }], status: 'review', riskLevel: 'medium', notes: 'بانتظار التحقق من Elm', reviewedBy: 'نور كرم', submittedAt: '2026-03-27T12:00:00', reviewedAt: null },
];

const userTypeLabels: Record<string, string> = { investor: 'مستثمر', merchant: 'تاجر', sponsor: 'راعي' };
const riskColors: Record<string, string> = { low: 'text-success', medium: 'text-warning', high: 'text-danger' };
const riskLabels: Record<string, string> = { low: 'منخفض', medium: 'متوسط', high: 'مرتفع' };

export default function KycPage() {
  const [requests, setRequests] = useState(mockKyc);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReq, setSelectedReq] = useState<KycRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const filtered = requests.filter(r => {
    const matchSearch = r.userName.includes(search) || r.companyNameAr.includes(search) || r.crNumber.includes(search);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const, reviewedBy: 'نور كرم', reviewedAt: new Date().toISOString(), notes: reviewNotes || 'تم التحقق بنجاح' } : r));
    toast.success('تم اعتماد الطلب'); setSelectedReq(null); setReviewNotes('');
  };

  const handleReject = (id: number) => {
    if (!reviewNotes) { toast.error('يرجى إضافة سبب الرفض'); return; }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const, reviewedBy: 'نور كرم', reviewedAt: new Date().toISOString(), notes: reviewNotes } : r));
    toast.success('تم رفض الطلب'); setSelectedReq(null); setReviewNotes('');
  };

  const columns: Column<KycRequest>[] = [
    { key: 'userName', label: 'مقدم الطلب', render: (_, r) => (
      <div><p className="font-semibold text-foreground text-sm">{r.userName}</p><p className="text-xs text-muted-foreground">{r.userEmail}</p></div>
    )},
    { key: 'companyNameAr', label: 'الشركة', render: (_, r) => (
      <div><p className="text-sm">{r.companyNameAr}</p><p className="text-xs text-muted-foreground font-mono">{r.crNumber}</p></div>
    )},
    { key: 'userType', label: 'النوع', render: (v) => <span className="text-sm">{userTypeLabels[v]}</span> },
    { key: 'documents', label: 'المستندات', render: (_, r) => {
      const uploaded = r.documents.filter(d => d.uploaded).length;
      return <span className={`text-sm font-mono ${uploaded === r.documents.length ? 'text-success' : 'text-warning'}`}>{uploaded}/{r.documents.length}</span>;
    }},
    { key: 'riskLevel', label: 'المخاطر', render: (v) => <span className={`text-sm font-semibold ${riskColors[v]}`}>{riskLabels[v]}</span> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'submittedAt', label: 'تاريخ التقديم', render: (v) => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'actions', label: '', render: (_, r) => (
      <button onClick={(e) => { e.stopPropagation(); setSelectedReq(r); setReviewNotes(r.notes); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"><Eye className="w-4 h-4 text-accent" /></button>
    )},
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="التحقق من الهوية KYC" subtitle={`${requests.length} طلب — ${requests.filter(r => r.status === 'pending').length} بانتظار المراجعة`} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatsCard title="إجمالي الطلبات" value={requests.length} icon={ShieldCheck} />
          <StatsCard title="بانتظار المراجعة" value={requests.filter(r => r.status === 'pending').length} icon={Clock} delay={0.1} />
          <StatsCard title="قيد المراجعة" value={requests.filter(r => r.status === 'review').length} icon={Eye} delay={0.2} />
          <StatsCard title="معتمدة" value={requests.filter(r => r.status === 'approved').length} icon={CheckCircle} delay={0.3} />
          <StatsCard title="مرفوضة" value={requests.filter(r => r.status === 'rejected').length} icon={XCircle} delay={0.4} />
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'review', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterStatus === s ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card'}`}>
              {s === 'all' ? 'الكل' : s === 'pending' ? 'بانتظار' : s === 'review' ? 'قيد المراجعة' : s === 'approved' ? 'معتمدة' : 'مرفوضة'} ({s === 'all' ? requests.length : requests.filter(r => r.status === s).length})
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث بالاسم أو السجل التجاري..." emptyMessage="لا توجد طلبات" onRowClick={(r) => { setSelectedReq(r); setReviewNotes(r.notes); }} />

        <Dialog open={!!selectedReq} onOpenChange={(v) => { if (!v) { setSelectedReq(null); setReviewNotes(''); } }}>
          <DialogContent className="glass-card border-border/50 max-w-2xl" dir="rtl">
            <DialogHeader><DialogTitle>تفاصيل طلب التحقق #{selectedReq?.id}</DialogTitle></DialogHeader>
            {selectedReq && (
              <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-3"><p className="text-xs text-muted-foreground mb-1"><User className="w-3 h-3 inline" /> مقدم الطلب</p><p className="font-semibold">{selectedReq.userName}</p><p className="text-xs text-muted-foreground">{selectedReq.userEmail}</p><p className="text-xs mt-1">{userTypeLabels[selectedReq.userType]}</p></div>
                  <div className="glass-card p-3"><p className="text-xs text-muted-foreground mb-1"><Building2 className="w-3 h-3 inline" /> الشركة</p><p className="font-semibold">{selectedReq.companyNameAr}</p><p className="text-xs text-muted-foreground font-mono">{selectedReq.companyName}</p><p className="text-xs mt-1">سجل: {selectedReq.crNumber}</p></div>
                </div>
                <div className="glass-card p-3">
                  <p className="text-xs text-muted-foreground mb-2"><FileText className="w-3 h-3 inline" /> المستندات</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReq.documents.map((doc, i) => (
                      <div key={i} className={`flex items-center gap-2 p-2 rounded-lg border ${doc.uploaded ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'}`}>
                        {doc.uploaded ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" />}
                        <span className="text-sm">{doc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="glass-card p-3 flex-1"><p className="text-xs text-muted-foreground">مستوى المخاطر</p><p className={`font-semibold ${riskColors[selectedReq.riskLevel]}`}>{riskLabels[selectedReq.riskLevel]}</p></div>
                  <div className="glass-card p-3 flex-1"><p className="text-xs text-muted-foreground">الحالة</p><StatusBadge status={selectedReq.status} /></div>
                  <div className="glass-card p-3 flex-1"><p className="text-xs text-muted-foreground">تاريخ التقديم</p><p className="text-sm">{formatDateTime(selectedReq.submittedAt)}</p></div>
                </div>
                {selectedReq.reviewedBy && <div className="glass-card p-3"><p className="text-xs text-muted-foreground">راجعه: {selectedReq.reviewedBy} — {selectedReq.reviewedAt ? formatDateTime(selectedReq.reviewedAt) : 'جاري'}</p></div>}
                <div><label className="text-sm text-muted-foreground mb-1 block">ملاحظات المراجعة</label><textarea value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} className="w-full bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm h-20 resize-none" placeholder="أضف ملاحظاتك هنا..." /></div>
                {(selectedReq.status === 'pending' || selectedReq.status === 'review') && (
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleApprove(selectedReq.id)} className="flex-1 bg-success/20 hover:bg-success/30 text-success gap-2"><CheckCircle className="w-4 h-4" /> اعتماد</Button>
                    <Button onClick={() => handleReject(selectedReq.id)} variant="outline" className="flex-1 border-danger/30 text-danger hover:bg-danger/10 gap-2"><XCircle className="w-4 h-4" /> رفض</Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
