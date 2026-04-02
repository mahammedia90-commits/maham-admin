import { useState } from 'react';
import { FileText, CheckCircle, Clock, PenTool, Download, Printer, ArrowRight, CreditCard, Shield, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Contract, Invoice, Payment } from '../legalTypes';
import { contractTypeLabels, contractStatusLabels, contractStatusColors, invoiceStatusLabels, invoiceStatusColors, paymentMethodLabels, paymentStatusLabels, paymentStatusColors, lifecycleSteps } from '../legalTypes';

interface Props {
  contract: Contract;
  invoices: Invoice[];
  payments: Payment[];
  onClose: () => void;
}

type Tab = 'timeline' | 'details' | 'invoices' | 'payments' | 'signature';

const sigLabel: Record<string, string> = { not_required: 'غير مطلوب', pending_party_a: 'بانتظار الطرف الأول', pending_party_b: 'بانتظار الطرف الثاني', fully_signed: 'موقّع بالكامل' };

export default function ContractDetail({ contract: c, invoices, payments, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('details');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'timeline', label: 'المراحل' },
    { id: 'details', label: 'التفاصيل' },
    { id: 'invoices', label: `الفواتير (${invoices.length})` },
    { id: 'payments', label: `المدفوعات (${payments.length})` },
    { id: 'signature', label: 'التوقيع' },
  ];

  const currentStep = c.status === 'draft' ? 1 : c.status === 'pending_sign' ? 2 : c.status === 'active' || c.status === 'expiring_soon' ? 3 : c.status === 'expired' || c.status === 'cancelled' ? 6 : 3;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mr-auto w-full max-w-2xl bg-background border-r border-gold/10 overflow-y-auto animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-gold/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{c.title}</p>
                <p className="text-xs text-chrome">{c.contractNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs border ${contractStatusColors[c.status]}`}>{contractStatusLabels[c.status]}</span>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-card/50 text-chrome"><X className="w-5 h-5" /></button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-3 overflow-x-auto scrollbar-hide">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${tab === t.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-chrome hover:text-foreground hover:bg-card/50'}`}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Timeline Tab */}
          {tab === 'timeline' && (
            <div className="space-y-4">
              <div className="relative">
                {lifecycleSteps.map((step, i) => {
                  const isActive = i < currentStep;
                  const isCurrent = i === currentStep - 1;
                  return (
                    <div key={step.id} className="flex items-start gap-3 mb-4 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCurrent ? 'border-gold bg-gold/20 text-gold' : isActive ? 'border-success bg-success/10 text-success' : 'border-muted bg-card/30 text-chrome'}`}>
                          {isActive && !isCurrent ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        {i < lifecycleSteps.length - 1 && <div className={`w-0.5 h-8 ${isActive ? 'bg-success/30' : 'bg-muted/30'}`} />}
                      </div>
                      <div className={`pt-1 ${isCurrent ? 'text-gold' : isActive ? 'text-foreground' : 'text-chrome/50'}`}>
                        <p className="text-sm font-medium">{step.label}</p>
                        {isCurrent && <p className="text-xs text-chrome mt-0.5">المرحلة الحالية</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Version History */}
              {c.versions.length > 0 && (
                <div className="glass-card p-4 rounded-xl border border-gold/10">
                  <p className="text-sm font-semibold text-foreground mb-3">سجل الإصدارات</p>
                  {c.versions.map(v => (
                    <div key={v.id} className="flex items-center justify-between p-2 bg-card/30 rounded-lg mb-1 last:mb-0">
                      <div><p className="text-xs font-medium text-foreground">الإصدار {v.version}</p><p className="text-[10px] text-chrome">{v.changes}</p></div>
                      <div className="text-left"><p className="text-[10px] text-chrome">{v.changedBy}</p><p className="text-[10px] text-chrome">{v.changedAt}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {tab === 'details' && (
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl border border-gold/10">
                <p className="text-sm font-semibold text-foreground mb-3">معلومات العقد</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['رقم العقد', c.contractNumber],
                    ['نوع العقد', contractTypeLabels[c.type]],
                    ['الحالة', contractStatusLabels[c.status]],
                    ['تاريخ البداية', c.startDate],
                    ['تاريخ النهاية', c.endDate],
                    ['نوع الدفع', c.paymentType === 'full' ? 'دفعة واحدة' : c.paymentType === 'installments' ? 'أقساط' : 'مراحل'],
                    ['المبلغ', `${c.totalAmount.toLocaleString()} ر.س`],
                    ['الضريبة (15%)', `${c.vatAmount.toLocaleString()} ر.س`],
                    ['الإجمالي', `${c.grandTotal.toLocaleString()} ر.س`],
                    ['أنشئ بواسطة', c.createdBy],
                    ['اعتمد بواسطة', c.approvedBy || '—'],
                    ['تاريخ الإنشاء', c.createdAt],
                  ].map(([l, v]) => (
                    <div key={l} className="p-2 bg-card/30 rounded-lg">
                      <p className="text-[10px] text-chrome mb-0.5">{l}</p>
                      <p className="text-xs font-medium text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Party A */}
              <div className="glass-card p-4 rounded-xl border border-gold/10">
                <p className="text-sm font-semibold text-foreground mb-3">الطرف الأول (ماهم)</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[['الاسم', c.partyA.nameAr], ['الرقم الضريبي', c.partyA.vatNumber], ['السجل التجاري', c.partyA.crNumber || '—'], ['البريد', c.partyA.email], ['الهاتف', c.partyA.phone], ['العنوان', c.partyA.address]].map(([l, v]) => (
                    <div key={l}><p className="text-chrome text-[10px]">{l}</p><p className="text-foreground">{v}</p></div>
                  ))}
                </div>
              </div>

              {/* Party B */}
              <div className="glass-card p-4 rounded-xl border border-gold/10">
                <p className="text-sm font-semibold text-foreground mb-3">الطرف الثاني</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[['الاسم', c.partyB.nameAr], ['الاسم EN', c.partyB.name], ['الرقم الضريبي', c.partyB.vatNumber], ['السجل التجاري', c.partyB.crNumber || '—'], ['البريد', c.partyB.email], ['الهاتف', c.partyB.phone], ['العنوان', c.partyB.address]].map(([l, v]) => (
                    <div key={l}><p className="text-chrome text-[10px]">{l}</p><p className="text-foreground">{v}</p></div>
                  ))}
                </div>
              </div>

              {/* Payment Schedule */}
              {c.paymentSchedule.length > 0 && (
                <div className="glass-card p-4 rounded-xl border border-gold/10">
                  <p className="text-sm font-semibold text-foreground mb-3">جدول الدفعات</p>
                  <div className="space-y-2">
                    {c.paymentSchedule.map((ps, i) => (
                      <div key={ps.id} className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ps.status === 'paid' ? 'bg-success/10 text-success' : ps.status === 'overdue' ? 'bg-destructive/10 text-destructive' : 'bg-card/50 text-chrome'}`}>
                            {ps.status === 'paid' ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">الدفعة {i + 1}</p>
                            <p className="text-[10px] text-chrome">استحقاق: {ps.dueDate}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-foreground">{ps.total.toLocaleString()} ر.س</p>
                          <p className={`text-[10px] ${ps.status === 'paid' ? 'text-success' : ps.status === 'overdue' ? 'text-destructive' : 'text-chrome'}`}>
                            {ps.status === 'paid' ? `مدفوع ${ps.paidAt}` : ps.status === 'overdue' ? 'متأخر' : 'معلق'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Flags */}
              {c.aiFlags && c.aiFlags.length > 0 && (
                <div className="glass-card p-4 rounded-xl border border-warning/20 bg-warning/5">
                  <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-warning" /><p className="text-sm font-semibold text-warning">تنبيهات AI</p></div>
                  {c.aiFlags.map((f, i) => <p key={i} className="text-xs text-chrome">• {f}</p>)}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button className="bg-gold hover:bg-gold/90 text-black"><Download className="w-4 h-4 ml-1" />تحميل PDF</Button>
                <Button variant="outline"><Printer className="w-4 h-4 ml-1" />طباعة</Button>
                {c.status === 'draft' && <Button variant="outline" className="border-gold/20 text-gold"><PenTool className="w-4 h-4 ml-1" />إرسال للتوقيع</Button>}
                {c.status === 'expiring_soon' && <Button className="bg-success hover:bg-success/90 text-white">تجديد العقد</Button>}
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {tab === 'invoices' && (
            <div className="space-y-3">
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-chrome"><CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>لا توجد فواتير</p></div>
              ) : invoices.map(inv => (
                <div key={inv.id} className="glass-card p-4 rounded-xl border border-gold/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{inv.invoiceNumber}</p>
                      <p className="text-xs text-chrome">صدرت: {inv.issueDate} — استحقاق: {inv.dueDate}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs border ${invoiceStatusColors[inv.status]}`}>{invoiceStatusLabels[inv.status]}</span>
                  </div>
                  <div className="space-y-1">
                    {inv.items.map(item => (
                      <div key={item.id} className="flex justify-between text-xs p-2 bg-card/30 rounded">
                        <span className="text-foreground">{item.descriptionAr}</span>
                        <span className="text-foreground font-medium">{item.total.toLocaleString()} ر.س</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-gold/5">
                    <div className="space-y-1 text-xs">
                      <p className="text-chrome">المبلغ: {inv.subtotal.toLocaleString()} ر.س</p>
                      <p className="text-chrome">الضريبة: {inv.vatAmount.toLocaleString()} ر.س</p>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-gold">{inv.total.toLocaleString()} ر.س</p>
                      {inv.zatcaStatus && (
                        <div className="flex items-center gap-1 mt-1">
                          <Shield className={`w-3 h-3 ${inv.zatcaStatus === 'cleared' ? 'text-success' : 'text-warning'}`} />
                          <span className="text-[10px] text-chrome">ZATCA: {inv.zatcaStatus === 'cleared' ? 'معتمد' : inv.zatcaStatus === 'submitted' ? 'مقدّم' : 'معلق'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20"><Plus className="w-4 h-4 ml-1" />إنشاء فاتورة جديدة</Button>
            </div>
          )}

          {/* Payments Tab */}
          {tab === 'payments' && (
            <div className="space-y-3">
              {payments.length === 0 ? (
                <div className="text-center py-8 text-chrome"><CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>لا توجد مدفوعات</p></div>
              ) : payments.map(pay => (
                <div key={pay.id} className="glass-card p-4 rounded-xl border border-gold/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pay.status === 'completed' ? 'bg-success/10' : 'bg-warning/10'}`}>
                        <CreditCard className={`w-5 h-5 ${pay.status === 'completed' ? 'text-success' : 'text-warning'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{pay.paymentNumber}</p>
                        <p className="text-xs text-chrome">{paymentMethodLabels[pay.method]} — {pay.initiatedAt}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-foreground">{pay.amount.toLocaleString()} ر.س</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${paymentStatusColors[pay.status]}`}>{paymentStatusLabels[pay.status]}</span>
                    </div>
                  </div>
                  {pay.gatewayRef && <p className="text-[10px] text-chrome mt-2">المرجع: {pay.gatewayRef}</p>}
                  {pay.sadadBillNumber && <p className="text-[10px] text-chrome mt-1">رقم سداد: {pay.sadadBillNumber}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Signature Tab */}
          {tab === 'signature' && (
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl border border-gold/10">
                <p className="text-sm font-semibold text-foreground mb-3">حالة التوقيع</p>
                <div className={`p-4 rounded-lg text-center ${c.signatureStatus === 'fully_signed' ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'}`}>
                  {c.signatureStatus === 'fully_signed' ? <CheckCircle className="w-10 h-10 text-success mx-auto mb-2" /> : <PenTool className="w-10 h-10 text-warning mx-auto mb-2" />}
                  <p className={`text-sm font-bold ${c.signatureStatus === 'fully_signed' ? 'text-success' : 'text-warning'}`}>{sigLabel[c.signatureStatus]}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="glass-card p-4 rounded-xl border border-gold/10">
                  <p className="text-xs text-chrome mb-2">الطرف الأول (ماهم)</p>
                  {c.partyASignedAt ? (
                    <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-success" /><div><p className="text-sm text-success font-medium">تم التوقيع</p><p className="text-[10px] text-chrome">{c.partyASignedAt}</p></div></div>
                  ) : (
                    <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-warning" /><p className="text-sm text-warning">بانتظار التوقيع</p></div>
                  )}
                </div>
                <div className="glass-card p-4 rounded-xl border border-gold/10">
                  <p className="text-xs text-chrome mb-2">الطرف الثاني ({c.partyB.nameAr})</p>
                  {c.partyBSignedAt ? (
                    <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-success" /><div><p className="text-sm text-success font-medium">تم التوقيع</p><p className="text-[10px] text-chrome">{c.partyBSignedAt}</p></div></div>
                  ) : (
                    <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-warning" /><p className="text-sm text-warning">بانتظار التوقيع</p></div>
                  )}
                </div>
              </div>

              {c.signatureStatus !== 'fully_signed' && c.signatureStatus !== 'not_required' && (
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gold hover:bg-gold/90 text-black"><PenTool className="w-4 h-4 ml-1" />توقيع إلكتروني</Button>
                  <Button variant="outline" className="flex-1">إرسال رابط التوقيع</Button>
                </div>
              )}

              {c.signedAt && (
                <div className="glass-card p-4 rounded-xl border border-success/20 bg-success/5">
                  <p className="text-xs text-chrome">تاريخ التوقيع النهائي</p>
                  <p className="text-sm font-bold text-success">{c.signedAt}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}
