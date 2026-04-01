/*
 * RatingsPage — إدارة التقييمات والمراجعات
 * Matches Laravel Dashboard /dashboard/ratings
 */
import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Eye, Trash2, Flag, MessageSquare, Filter } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDate, formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Rating {
  id: number; userName: string; userType: 'investor' | 'merchant' | 'sponsor' | 'visitor';
  targetType: 'event' | 'space' | 'service' | 'platform'; targetName: string;
  score: number; comment: string; status: 'approved' | 'pending' | 'rejected' | 'flagged';
  helpfulCount: number; reportCount: number; createdAt: string;
}

const mockRatings: Rating[] = [
  { id: 1, userName: 'أحمد الشمري', userType: 'merchant', targetType: 'event', targetName: 'معرض التقنية 2026', score: 5, comment: 'تجربة ممتازة! التنظيم كان رائعاً والموقع مميز.', status: 'approved', helpfulCount: 45, reportCount: 0, createdAt: '2026-03-20' },
  { id: 2, userName: 'سارة العتيبي', userType: 'investor', targetType: 'platform', targetName: 'منصة مهام إكسبو', score: 4, comment: 'منصة سهلة الاستخدام، لكن تحتاج تحسين في سرعة التحميل.', status: 'approved', helpfulCount: 32, reportCount: 0, createdAt: '2026-03-18' },
  { id: 3, userName: 'محمد القحطاني', userType: 'merchant', targetType: 'space', targetName: 'جناح A-12', score: 3, comment: 'المساحة جيدة لكن الإضاءة تحتاج تحسين.', status: 'approved', helpfulCount: 18, reportCount: 1, createdAt: '2026-03-15' },
  { id: 4, userName: 'فهد الدوسري', userType: 'sponsor', targetType: 'service', targetName: 'خدمة التصميم', score: 5, comment: 'خدمة احترافية وسريعة. أنصح بها بشدة.', status: 'approved', helpfulCount: 28, reportCount: 0, createdAt: '2026-03-12' },
  { id: 5, userName: 'خالد المطيري', userType: 'merchant', targetType: 'event', targetName: 'معرض الأغذية', score: 2, comment: 'التنظيم كان ضعيفاً والحضور قليل.', status: 'pending', helpfulCount: 5, reportCount: 3, createdAt: '2026-03-10' },
  { id: 6, userName: 'نورة السبيعي', userType: 'visitor', targetType: 'event', targetName: 'معرض التقنية 2026', score: 4, comment: 'معرض جميل ومتنوع. أتمنى زيادة الأنشطة التفاعلية.', status: 'approved', helpfulCount: 22, reportCount: 0, createdAt: '2026-03-08' },
  { id: 7, userName: 'عبدالله الحربي', userType: 'merchant', targetType: 'space', targetName: 'جناح B-05', score: 1, comment: 'سيء جداً. محتوى غير لائق.', status: 'flagged', helpfulCount: 0, reportCount: 8, createdAt: '2026-03-05' },
  { id: 8, userName: 'ريم الزهراني', userType: 'investor', targetType: 'service', targetName: 'خدمة الاستشارات', score: 5, comment: 'استشارة قيمة ساعدتني في اتخاذ قرار الاستثمار.', status: 'approved', helpfulCount: 38, reportCount: 0, createdAt: '2026-03-01' },
];

const userTypeLabels: Record<string, string> = { investor: 'مستثمر', merchant: 'تاجر', sponsor: 'راعي', visitor: 'زائر' };
const targetTypeLabels: Record<string, string> = { event: 'فعالية', space: 'مساحة', service: 'خدمة', platform: 'المنصة' };

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= score ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  );
}

export default function RatingsPage() {
  const [ratings, setRatings] = useState(mockRatings);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);

  const filtered = ratings.filter(r => {
    const matchSearch = r.userName.includes(search) || r.comment.includes(search) || r.targetName.includes(search);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = (id: number) => { setRatings(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r)); toast.success('تم اعتماد التقييم'); };
  const handleReject = (id: number) => { setRatings(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r)); toast.success('تم رفض التقييم'); };
  const handleDelete = (id: number) => { setRatings(prev => prev.filter(r => r.id !== id)); toast.success('تم حذف التقييم'); };

  const avgScore = ratings.length > 0 ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1) : '0';

  const columns: Column<Rating>[] = [
    { key: 'userName', label: 'المستخدم', render: (_, r) => (
      <div><p className="font-semibold text-foreground text-sm">{r.userName}</p><p className="text-xs text-muted-foreground">{userTypeLabels[r.userType]}</p></div>
    )},
    { key: 'targetName', label: 'الهدف', render: (_, r) => (
      <div><p className="text-sm">{r.targetName}</p><p className="text-xs text-muted-foreground">{targetTypeLabels[r.targetType]}</p></div>
    )},
    { key: 'score', label: 'التقييم', sortable: true, render: (v) => <StarRating score={v} /> },
    { key: 'comment', label: 'التعليق', render: (v) => <p className="text-sm text-muted-foreground truncate max-w-[200px]">{v}</p> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'helpfulCount', label: 'مفيد', render: (v) => <span className="text-xs font-mono">{v}</span> },
    { key: 'createdAt', label: 'التاريخ', render: (v) => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'actions', label: 'إجراءات', render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setSelectedRating(r); }} className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"><Eye className="w-4 h-4 text-accent" /></button>
        {r.status === 'pending' && <button onClick={(e) => { e.stopPropagation(); handleApprove(r.id); }} className="p-1.5 rounded-lg hover:bg-success/10 transition-colors"><ThumbsUp className="w-4 h-4 text-success" /></button>}
        {r.status === 'pending' && <button onClick={(e) => { e.stopPropagation(); handleReject(r.id); }} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"><ThumbsDown className="w-4 h-4 text-danger" /></button>}
        <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4 text-danger" /></button>
      </div>
    )},
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة التقييمات والمراجعات" subtitle={`${ratings.length} تقييم`} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatsCard title="إجمالي التقييمات" value={ratings.length} icon={Star} />
          <StatsCard title="المعدل العام" value={`${avgScore}/5`} icon={Star} delay={0.1} />
          <StatsCard title="بانتظار المراجعة" value={ratings.filter(r => r.status === 'pending').length} icon={MessageSquare} delay={0.2} />
          <StatsCard title="مبلّغ عنها" value={ratings.filter(r => r.status === 'flagged').length} icon={Flag} delay={0.3} />
          <StatsCard title="معتمدة" value={ratings.filter(r => r.status === 'approved').length} icon={ThumbsUp} delay={0.4} />
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'approved', 'pending', 'rejected', 'flagged'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterStatus === s ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card'}`}>
              {s === 'all' ? 'الكل' : s === 'approved' ? 'معتمدة' : s === 'pending' ? 'بانتظار' : s === 'rejected' ? 'مرفوضة' : 'مبلّغ عنها'} ({s === 'all' ? ratings.length : ratings.filter(r => r.status === s).length})
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في التقييمات..." emptyMessage="لا توجد تقييمات" onRowClick={setSelectedRating} />

        <Dialog open={!!selectedRating} onOpenChange={(v) => { if (!v) setSelectedRating(null); }}>
          <DialogContent className="glass-card border-border/50 max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle>تفاصيل التقييم</DialogTitle></DialogHeader>
            {selectedRating && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-semibold">{selectedRating.userName}</p><p className="text-xs text-muted-foreground">{userTypeLabels[selectedRating.userType]}</p></div>
                  <StarRating score={selectedRating.score} />
                </div>
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground mb-1">{targetTypeLabels[selectedRating.targetType]}</p><p className="font-medium">{selectedRating.targetName}</p></div>
                <div className="glass-card p-3"><p className="text-sm leading-relaxed">{selectedRating.comment}</p></div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span><ThumbsUp className="w-3 h-3 inline" /> {selectedRating.helpfulCount} مفيد</span>
                  <span><Flag className="w-3 h-3 inline" /> {selectedRating.reportCount} بلاغ</span>
                  <span>{formatDate(selectedRating.createdAt)}</span>
                </div>
                <StatusBadge status={selectedRating.status} />
                <div className="flex gap-2 pt-2">
                  {selectedRating.status !== 'approved' && <Button onClick={() => { handleApprove(selectedRating.id); setSelectedRating(null); }} className="flex-1 bg-success/20 hover:bg-success/30 text-success">اعتماد</Button>}
                  {selectedRating.status !== 'rejected' && <Button onClick={() => { handleReject(selectedRating.id); setSelectedRating(null); }} variant="outline" className="flex-1 border-danger/30 text-danger hover:bg-danger/10">رفض</Button>}
                  <Button onClick={() => { handleDelete(selectedRating.id); setSelectedRating(null); }} variant="outline" className="border-danger/30 text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
