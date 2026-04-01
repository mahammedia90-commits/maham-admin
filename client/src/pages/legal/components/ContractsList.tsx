import { useState } from 'react';
import { FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2, PenTool, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Contract } from '../legalTypes';
import { contractTypeLabels, contractStatusLabels, contractStatusColors, contractTypeColors } from '../legalTypes';

interface Props {
  contracts: Contract[];
  onViewContract: (id: string) => void;
  onAddContract: () => void;
}

const sigIcon = (s: string) => s === 'fully_signed' ? <CheckCircle className="w-4 h-4 text-success" /> : s === 'not_required' ? null : <Clock className="w-4 h-4 text-warning" />;

export default function ContractsList({ contracts, onViewContract, onAddContract }: Props) {
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('all');
  const [statusF, setStatusF] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [delId, setDelId] = useState<string | null>(null);

  const filtered = contracts.filter(c => {
    const matchSearch = !search || c.title.includes(search) || c.contractNumber.includes(search) || c.partyB.nameAr.includes(search) || c.partyB.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeF === 'all' || c.type === typeF;
    const matchStatus = statusF === 'all' || c.status === statusF;
    return matchSearch && matchType && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'amount') return b.grandTotal - a.grandTotal;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalValue = filtered.reduce((s, c) => s + c.grandTotal, 0);

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="flex flex-wrap gap-3 text-xs text-chrome">
        <span>إجمالي: <strong className="text-foreground">{filtered.length}</strong> عقد</span>
        <span>القيمة: <strong className="text-gold">{totalValue.toLocaleString()} ر.س</strong></span>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو رقم العقد..." className="w-full pr-10 pl-4 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
        </div>
        <select value={typeF} onChange={e => setTypeF(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground">
          <option value="all">كل الأنواع</option>
          {Object.entries(contractTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground">
          <option value="all">كل الحالات</option>
          {Object.entries(contractStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground">
          <option value="date">الأحدث</option>
          <option value="amount">الأعلى قيمة</option>
          <option value="status">الحالة</option>
        </select>
        <Button onClick={onAddContract} className="bg-gold hover:bg-gold/90 text-black">
          <Plus className="w-4 h-4 ml-1" />عقد جديد
        </Button>
      </div>

      {/* Contracts List */}
      <div className="space-y-2">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-chrome">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد عقود مطابقة</p>
          </div>
        ) : sorted.map(c => (
          <div key={c.id} className="glass-card p-4 rounded-xl border border-gold/10 hover:border-gold/20 transition-all cursor-pointer group" onClick={() => onViewContract(c.id)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Right Side */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    {sigIcon(c.signatureStatus)}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-chrome">{c.contractNumber}</span>
                    <span className="text-xs text-chrome">•</span>
                    <span className="text-xs text-chrome">{c.partyB.nameAr}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${contractTypeColors[c.type]}`}>
                      {contractTypeLabels[c.type]}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${contractStatusColors[c.status]}`}>
                      {contractStatusLabels[c.status]}
                    </span>
                    {c.riskScore && c.riskScore > 30 && (
                      <span className="px-2 py-0.5 rounded text-[10px] border bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />خطر {c.riskScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Left Side */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-lg font-bold text-gold">{c.grandTotal.toLocaleString()} <span className="text-xs text-chrome">ر.س</span></p>
                <p className="text-xs text-chrome">{c.startDate} → {c.endDate}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); onViewContract(c.id); }} className="p-1.5 rounded-lg hover:bg-gold/10 text-chrome hover:text-gold transition-colors" title="عرض">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); }} className="p-1.5 rounded-lg hover:bg-gold/10 text-chrome hover:text-gold transition-colors" title="تعديل">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); }} className="p-1.5 rounded-lg hover:bg-gold/10 text-chrome hover:text-gold transition-colors" title="تحميل PDF">
                    <Download className="w-4 h-4" />
                  </button>
                  {c.status === 'draft' && (
                    <button onClick={e => { e.stopPropagation(); setDelId(c.id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 text-chrome hover:text-destructive transition-colors" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Progress */}
            {c.paymentSchedule.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gold/5">
                <div className="flex items-center justify-between text-xs text-chrome mb-1">
                  <span>تقدم الدفعات</span>
                  <span>{c.paymentSchedule.filter(p => p.status === 'paid').length}/{c.paymentSchedule.length}</span>
                </div>
                <div className="flex gap-1">
                  {c.paymentSchedule.map(ps => (
                    <div key={ps.id} className={`h-2 flex-1 rounded-full ${ps.status === 'paid' ? 'bg-success' : ps.status === 'overdue' ? 'bg-destructive' : 'bg-card/50'}`} title={`${ps.dueDate} — ${ps.total.toLocaleString()} ر.س — ${ps.status === 'paid' ? 'مدفوع' : ps.status === 'overdue' ? 'متأخر' : 'معلق'}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <Dialog open={!!delId} onOpenChange={() => setDelId(null)}>
        <DialogContent className="max-w-sm bg-background border-gold/20">
          <DialogHeader><DialogTitle>تأكيد الحذف</DialogTitle></DialogHeader>
          <p className="text-sm text-chrome">هل أنت متأكد من حذف هذا العقد؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="flex gap-2 mt-4">
            <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-white" onClick={() => setDelId(null)}>حذف</Button>
            <Button variant="outline" className="flex-1" onClick={() => setDelId(null)}>إلغاء</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
