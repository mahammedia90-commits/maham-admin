import { useState } from 'react';
import { CreditCard, Search, Plus, CheckCircle, Clock, AlertTriangle, ArrowUpDown, Banknote, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Payment } from '../legalTypes';
import { paymentMethodLabels, paymentStatusLabels, paymentStatusColors } from '../legalTypes';

interface Props {
  payments: Payment[];
}

const methodIcons: Record<string, React.ReactNode> = {
  bank_transfer: <Building2 className="w-4 h-4" />,
  sadad: <Banknote className="w-4 h-4" />,
  credit_card: <CreditCard className="w-4 h-4" />,
  cash: <Banknote className="w-4 h-4" />,
  cheque: <CreditCard className="w-4 h-4" />,
};

export default function PaymentsList({ payments }: Props) {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [methodF, setMethodF] = useState('all');

  const filtered = payments.filter(p => {
    const matchSearch = !search || p.paymentNumber.includes(search) || (p.invoiceNumber || '').includes(search) || p.contractId.includes(search);
    const matchStatus = statusF === 'all' || p.status === statusF;
    const matchMethod = methodF === 'all' || p.method === methodF;
    return matchSearch && matchStatus && matchMethod;
  });

  const totalCompleted = filtered.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPending = filtered.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalFailed = filtered.filter(p => p.status === 'failed').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-3 rounded-xl border border-gold/10">
          <p className="text-xs text-chrome">إجمالي المدفوعات</p>
          <p className="text-lg font-bold text-foreground">{filtered.length}</p>
        </div>
        <div className="glass-card p-3 rounded-xl border border-success/20">
          <p className="text-xs text-chrome">مكتمل</p>
          <p className="text-lg font-bold text-success">{totalCompleted.toLocaleString()} <span className="text-xs">ر.س</span></p>
        </div>
        <div className="glass-card p-3 rounded-xl border border-warning/20">
          <p className="text-xs text-chrome">معلق</p>
          <p className="text-lg font-bold text-warning">{totalPending.toLocaleString()} <span className="text-xs">ر.س</span></p>
        </div>
        <div className="glass-card p-3 rounded-xl border border-destructive/20">
          <p className="text-xs text-chrome">فشل</p>
          <p className="text-lg font-bold text-destructive">{totalFailed.toLocaleString()} <span className="text-xs">ر.س</span></p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث برقم الدفعة أو الفاتورة..." className="w-full pr-10 pl-4 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground">
          <option value="all">كل الحالات</option>
          {Object.entries(paymentStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={methodF} onChange={e => setMethodF(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground">
          <option value="all">كل الطرق</option>
          {Object.entries(paymentMethodLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Button className="bg-gold hover:bg-gold/90 text-black"><Plus className="w-4 h-4 ml-1" />تسجيل دفعة</Button>
      </div>

      {/* Payments List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-chrome"><CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>لا توجد مدفوعات</p></div>
        ) : filtered.map(pay => (
          <div key={pay.id} className="glass-card p-4 rounded-xl border border-gold/10 hover:border-gold/20 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${pay.status === 'completed' ? 'bg-success/10 border-success/20 text-success' : pay.status === 'pending' ? 'bg-warning/10 border-warning/20 text-warning' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                  {pay.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : pay.status === 'pending' ? <Clock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{pay.paymentNumber}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-chrome">فاتورة: {pay.invoiceNumber}</span>
                    <span className="text-xs text-chrome">•</span>
                    <span className="text-xs text-chrome">عقد: {pay.contractId}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${paymentStatusColors[pay.status]}`}>{paymentStatusLabels[pay.status]}</span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-card/50 border border-gold/10 text-chrome">
                      {methodIcons[pay.method]}{paymentMethodLabels[pay.method]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-lg font-bold text-gold">{pay.amount.toLocaleString()} <span className="text-xs text-chrome">ر.س</span></p>
                <p className="text-xs text-chrome">{pay.initiatedAt}</p>
                {pay.completedAt && <p className="text-[10px] text-success">اكتمل: {pay.completedAt}</p>}
              </div>
            </div>
            {/* Details */}
            <div className="mt-3 pt-3 border-t border-gold/5 flex flex-wrap gap-3 text-xs text-chrome">
              {pay.gatewayRef && <span>مرجع البوابة: <strong className="text-foreground">{pay.gatewayRef}</strong></span>}
              {pay.sadadBillNumber && <span>رقم سداد: <strong className="text-foreground">{pay.sadadBillNumber}</strong></span>}
              {pay.notes && <span>ملاحظات: <strong className="text-foreground">{pay.notes}</strong></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
