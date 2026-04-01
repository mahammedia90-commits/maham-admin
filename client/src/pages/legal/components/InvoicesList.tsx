import { useState } from 'react';
import { Receipt, Search, Shield, Download, Eye, Plus, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Invoice } from '../legalTypes';
import { invoiceStatusLabels, invoiceStatusColors, zatcaStatusLabels } from '../legalTypes';

interface Props {
  invoices: Invoice[];
  onViewInvoice: (inv: Invoice) => void;
}

export default function InvoicesList({ invoices, onViewInvoice }: Props) {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [zatcaF, setZatcaF] = useState('all');
  const [selInv, setSelInv] = useState<Invoice | null>(null);

  const filtered = invoices.filter(inv => {
    const matchSearch = !search || inv.invoiceNumber.includes(search) || inv.billTo.nameAr.includes(search);
    const matchStatus = statusF === 'all' || inv.status === statusF;
    const matchZatca = zatcaF === 'all' || inv.zatcaStatus === zatcaF;
    return matchSearch && matchStatus && matchZatca;
  });

  const totalInvoiced = filtered.reduce((s, i) => s + i.total, 0);
  const totalPaid = filtered.reduce((s, i) => s + i.paidAmount, 0);
  const totalRemaining = filtered.reduce((s, i) => s + i.remainingAmount, 0);
  const zatcaCleared = filtered.filter(i => i.zatcaStatus === 'cleared').length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-3 rounded-xl border border-gold/10">
          <p className="text-xs text-chrome">إجمالي الفواتير</p>
          <p className="text-lg font-bold text-gold">{totalInvoiced.toLocaleString()} <span className="text-xs">ر.س</span></p>
        </div>
        <div className="glass-card p-3 rounded-xl border border-gold/10">
          <p className="text-xs text-chrome">المحصّل</p>
          <p className="text-lg font-bold text-success">{totalPaid.toLocaleString()} <span className="text-xs">ر.س</span></p>
        </div>
        <div className="glass-card p-3 rounded-xl border border-gold/10">
          <p className="text-xs text-chrome">المتبقي</p>
          <p className={`text-lg font-bold ${totalRemaining > 0 ? 'text-warning' : 'text-success'}`}>{totalRemaining.toLocaleString()} <span className="text-xs">ر.س</span></p>
        </div>
        <div className="glass-card p-3 rounded-xl border border-gold/10">
          <p className="text-xs text-chrome">ZATCA معتمد</p>
          <p className="text-lg font-bold text-success">{zatcaCleared}/{filtered.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث برقم الفاتورة أو اسم العميل..." className="w-full pr-10 pl-4 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground">
          <option value="all">كل الحالات</option>
          {Object.entries(invoiceStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={zatcaF} onChange={e => setZatcaF(e.target.value)} className="px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground">
          <option value="all">كل ZATCA</option>
          {Object.entries(zatcaStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Button className="bg-gold hover:bg-gold/90 text-black"><Plus className="w-4 h-4 ml-1" />فاتورة جديدة</Button>
      </div>

      {/* Invoices */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-chrome"><Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>لا توجد فواتير</p></div>
        ) : filtered.map(inv => (
          <div key={inv.id} className="glass-card p-4 rounded-xl border border-gold/10 hover:border-gold/20 transition-all cursor-pointer group" onClick={() => setSelInv(inv)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{inv.invoiceNumber}</p>
                  <p className="text-xs text-chrome">{inv.billTo.nameAr} — عقد {inv.contractNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${invoiceStatusColors[inv.status]}`}>{invoiceStatusLabels[inv.status]}</span>
                    <div className="flex items-center gap-1">
                      <Shield className={`w-3 h-3 ${inv.zatcaStatus === 'cleared' ? 'text-success' : inv.zatcaStatus === 'submitted' ? 'text-blue-500' : 'text-warning'}`} />
                      <span className="text-[10px] text-chrome">ZATCA: {zatcaStatusLabels[inv.zatcaStatus]}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-lg font-bold text-gold">{inv.total.toLocaleString()} <span className="text-xs text-chrome">ر.س</span></p>
                <p className="text-xs text-chrome">صدرت: {inv.issueDate}</p>
                <p className="text-xs text-chrome">استحقاق: {inv.dueDate}</p>
              </div>
            </div>
            {/* Items preview */}
            <div className="mt-3 pt-3 border-t border-gold/5 space-y-1">
              {inv.items.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-chrome">{item.descriptionAr}</span>
                  <span className="text-foreground">{item.total.toLocaleString()} ر.س</span>
                </div>
              ))}
              <div className="flex justify-between text-xs pt-1 border-t border-gold/5">
                <span className="text-chrome">ضريبة القيمة المضافة (15%)</span>
                <span className="text-foreground">{inv.vatAmount.toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Detail Modal */}
      <Dialog open={!!selInv} onOpenChange={() => setSelInv(null)}>
        <DialogContent className="max-w-lg bg-background border-gold/20 max-h-[85vh] overflow-y-auto">
          {selInv && (
            <>
              <DialogHeader><DialogTitle>تفاصيل الفاتورة — {selInv.invoiceNumber}</DialogTitle></DialogHeader>
              
              {/* Invoice Header */}
              <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                <span className={`px-2 py-1 rounded text-xs border ${invoiceStatusColors[selInv.status]}`}>{invoiceStatusLabels[selInv.status]}</span>
                <p className="text-xl font-bold text-gold">{selInv.total.toLocaleString()} ر.س</p>
              </div>

              {/* Bill From / To */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-card/30 rounded-lg">
                  <p className="text-[10px] text-chrome mb-1">من</p>
                  <p className="text-xs font-medium text-foreground">{selInv.billFrom.nameAr}</p>
                  <p className="text-[10px] text-chrome">ض: {selInv.billFrom.vatNumber}</p>
                </div>
                <div className="p-3 bg-card/30 rounded-lg">
                  <p className="text-[10px] text-chrome mb-1">إلى</p>
                  <p className="text-xs font-medium text-foreground">{selInv.billTo.nameAr}</p>
                  <p className="text-[10px] text-chrome">ض: {selInv.billTo.vatNumber}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <p className="text-xs text-chrome">البنود</p>
                {selInv.items.map(item => (
                  <div key={item.id} className="flex justify-between p-2 bg-card/30 rounded text-xs">
                    <div><p className="text-foreground">{item.descriptionAr}</p><p className="text-[10px] text-chrome">{item.quantity} × {item.unitPrice.toLocaleString()}</p></div>
                    <p className="text-foreground font-medium">{item.total.toLocaleString()} ر.س</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 p-3 bg-card/30 rounded-lg">
                <div className="flex justify-between text-xs"><span className="text-chrome">المبلغ</span><span className="text-foreground">{selInv.subtotal.toLocaleString()} ر.س</span></div>
                <div className="flex justify-between text-xs"><span className="text-chrome">ضريبة (15%)</span><span className="text-foreground">{selInv.vatAmount.toLocaleString()} ر.س</span></div>
                <div className="flex justify-between text-sm font-bold border-t border-gold/10 pt-1 mt-1"><span className="text-foreground">الإجمالي</span><span className="text-gold">{selInv.total.toLocaleString()} ر.س</span></div>
              </div>

              {/* ZATCA */}
              <div className={`p-3 rounded-lg border ${selInv.zatcaStatus === 'cleared' ? 'border-success/20 bg-success/5' : 'border-warning/20 bg-warning/5'}`}>
                <div className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${selInv.zatcaStatus === 'cleared' ? 'text-success' : 'text-warning'}`} />
                  <div>
                    <p className={`text-sm font-medium ${selInv.zatcaStatus === 'cleared' ? 'text-success' : 'text-warning'}`}>ZATCA: {zatcaStatusLabels[selInv.zatcaStatus]}</p>
                    {selInv.zatcaQrCode && <p className="text-[10px] text-chrome mt-1">QR: {selInv.zatcaQrCode.substring(0, 30)}...</p>}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button className="flex-1 bg-gold hover:bg-gold/90 text-black"><Download className="w-4 h-4 ml-1" />تحميل PDF</Button>
                {selInv.status === 'draft' && <Button variant="outline" className="flex-1"><Send className="w-4 h-4 ml-1" />إرسال</Button>}
                {selInv.zatcaStatus !== 'cleared' && <Button variant="outline" className="flex-1 border-success/20 text-success"><Shield className="w-4 h-4 ml-1" />إرسال ZATCA</Button>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
