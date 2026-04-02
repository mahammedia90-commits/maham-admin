/*
 * Payment Reminders — نظام تذكيرات الدفع والتحصيل
 * Route: /finance/reminders
 * Features: Overdue payments, auto-reminders, escalation, aging report
 */
import { useState, useMemo } from 'react'
import {
  DollarSign, AlertTriangle, Clock, CheckCircle2, Send, Phone,
  Mail, MessageSquare, Calendar, Filter, Search, TrendingUp,
  ArrowUp, ArrowDown, Eye, MoreHorizontal, Zap, XCircle, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial' | 'disputed'
type AgingBucket = '0-30' | '31-60' | '61-90' | '90+'

interface PaymentReminder {
  id: number
  client_name: string
  company: string
  client_type: 'investor' | 'merchant' | 'sponsor'
  invoice_number: string
  amount: number
  amount_paid: number
  due_date: string
  status: PaymentStatus
  aging_days: number
  reminders_sent: number
  last_reminder_date: string | null
  escalation_level: 0 | 1 | 2 | 3
  contact_phone: string
  contact_email: string
  notes: string
}

const MOCK_PAYMENTS: PaymentReminder[] = [
  { id: 1, client_name: 'عبدالله المنصور', company: 'شركة المنصور للعقارات', client_type: 'investor', invoice_number: 'INV-2026-0041', amount: 500000, amount_paid: 0, due_date: '2026-03-15', status: 'overdue', aging_days: 18, reminders_sent: 3, last_reminder_date: '2026-03-30', escalation_level: 2, contact_phone: '+966535001001', contact_email: 'abdullah@mansour.sa', notes: 'وعد بالسداد قبل نهاية أبريل' },
  { id: 2, client_name: 'فهد العتيبي', company: 'مجموعة فهد التجارية', client_type: 'merchant', invoice_number: 'INV-2026-0038', amount: 250000, amount_paid: 125000, due_date: '2026-03-20', status: 'partial', aging_days: 13, reminders_sent: 2, last_reminder_date: '2026-03-28', escalation_level: 1, contact_phone: '+966545002002', contact_email: 'fahad@fahad-group.sa', notes: 'دفع 50% والباقي خلال أسبوعين' },
  { id: 3, client_name: 'نورة الدوسري', company: 'بنك الاستثمار السعودي', client_type: 'sponsor', invoice_number: 'INV-2026-0045', amount: 800000, amount_paid: 0, due_date: '2026-04-05', status: 'pending', aging_days: 0, reminders_sent: 0, last_reminder_date: null, escalation_level: 0, contact_phone: '+966555003003', contact_email: 'noura@sib.sa', notes: 'عقد رعاية ذهبية — الدفع مجدول' },
  { id: 4, client_name: 'خالد الزهراني', company: 'الزهراني للأغذية', client_type: 'merchant', invoice_number: 'INV-2026-0032', amount: 150000, amount_paid: 0, due_date: '2026-02-28', status: 'overdue', aging_days: 33, reminders_sent: 5, last_reminder_date: '2026-03-29', escalation_level: 3, contact_phone: '+966565004004', contact_email: 'khaled@zahrani.sa', notes: 'تم تصعيد للقسم القانوني' },
  { id: 5, client_name: 'ريم السبيعي', company: 'ريم تك', client_type: 'sponsor', invoice_number: 'INV-2026-0044', amount: 350000, amount_paid: 350000, due_date: '2026-03-25', status: 'paid', aging_days: 0, reminders_sent: 0, last_reminder_date: null, escalation_level: 0, contact_phone: '+966575005005', contact_email: 'reem@reemtech.sa', notes: 'تم السداد بالكامل' },
  { id: 6, client_name: 'سلطان الغامدي', company: 'الغامدي للتجزئة', client_type: 'merchant', invoice_number: 'INV-2026-0040', amount: 180000, amount_paid: 0, due_date: '2026-03-10', status: 'disputed', aging_days: 23, reminders_sent: 2, last_reminder_date: '2026-03-25', escalation_level: 2, contact_phone: '+966585006006', contact_email: 'sultan@ghamdi.sa', notes: 'يعترض على بند في الفاتورة — بانتظار مراجعة' },
]

function formatSAR(amount: number) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
  return amount.toLocaleString('ar-SA')
}

const STATUS_CONFIG: Record<PaymentStatus, { label: string; bg: string; text: string }> = {
  paid: { label: 'مدفوع', bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  pending: { label: 'قادم', bg: 'bg-blue-500/15', text: 'text-blue-400' },
  overdue: { label: 'متأخر', bg: 'bg-red-500/15', text: 'text-red-400' },
  partial: { label: 'جزئي', bg: 'bg-amber-500/15', text: 'text-amber-400' },
  disputed: { label: 'معترض', bg: 'bg-purple-500/15', text: 'text-purple-400' },
}

export default function PaymentRemindersPage() {
  const [payments] = useState(MOCK_PAYMENTS)
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = [...payments]
    if (search) { const s = search.toLowerCase(); result = result.filter(p => p.client_name.toLowerCase().includes(s) || p.company.toLowerCase().includes(s) || p.invoice_number.toLowerCase().includes(s)) }
    if (filterStatus !== 'all') result = result.filter(p => p.status === filterStatus)
    result.sort((a, b) => b.aging_days - a.aging_days)
    return result
  }, [payments, search, filterStatus])

  const stats = useMemo(() => {
    const overdue = payments.filter(p => p.status === 'overdue')
    const partial = payments.filter(p => p.status === 'partial')
    return {
      totalOutstanding: payments.filter(p => p.status !== 'paid').reduce((s, p) => s + (p.amount - p.amount_paid), 0),
      overdueAmount: overdue.reduce((s, p) => s + (p.amount - p.amount_paid), 0),
      overdueCount: overdue.length,
      partialAmount: partial.reduce((s, p) => s + (p.amount - p.amount_paid), 0),
      paidThisMonth: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
      disputedCount: payments.filter(p => p.status === 'disputed').length,
      aging: {
        '0-30': payments.filter(p => p.aging_days > 0 && p.aging_days <= 30 && p.status !== 'paid').reduce((s, p) => s + (p.amount - p.amount_paid), 0),
        '31-60': payments.filter(p => p.aging_days > 30 && p.aging_days <= 60 && p.status !== 'paid').reduce((s, p) => s + (p.amount - p.amount_paid), 0),
        '61-90': payments.filter(p => p.aging_days > 60 && p.aging_days <= 90 && p.status !== 'paid').reduce((s, p) => s + (p.amount - p.amount_paid), 0),
        '90+': payments.filter(p => p.aging_days > 90 && p.status !== 'paid').reduce((s, p) => s + (p.amount - p.amount_paid), 0),
      }
    }
  }, [payments])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2f0]">تذكيرات الدفع والتحصيل</h1>
          <p className="text-[#5a5a78] text-sm mt-1">متابعة المدفوعات المتأخرة — تذكيرات تلقائية — تصعيد ذكي</p>
        </div>
        <Button className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-sm"><Send className="w-4 h-4 ml-2" />إرسال تذكيرات جماعية</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'إجمالي المستحق', value: `${formatSAR(stats.totalOutstanding)} ر.س`, icon: DollarSign, color: 'text-[#c9a84c]' },
          { label: 'متأخر', value: `${formatSAR(stats.overdueAmount)} ر.س`, sub: `${stats.overdueCount} فاتورة`, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'مدفوع جزئياً', value: `${formatSAR(stats.partialAmount)} ر.س`, icon: Clock, color: 'text-amber-400' },
          { label: 'تم تحصيله', value: `${formatSAR(stats.paidThisMonth)} ر.س`, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'نزاعات', value: stats.disputedCount, icon: XCircle, color: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1"><s.icon className={`w-4 h-4 ${s.color}`} /><span className="text-xs text-[#5a5a78]">{s.label}</span></div>
            <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
            {'sub' in s && s.sub && <div className="text-xs text-[#5a5a78]">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Aging Report */}
      <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5">
        <h3 className="text-sm font-bold text-[#e2e2f0] mb-4">تقرير أعمار الديون</h3>
        <div className="grid grid-cols-4 gap-3">
          {([['0-30', 'أقل من 30 يوم', 'text-emerald-400', 'bg-emerald-500'], ['31-60', '31-60 يوم', 'text-amber-400', 'bg-amber-500'], ['61-90', '61-90 يوم', 'text-orange-400', 'bg-orange-500'], ['90+', 'أكثر من 90 يوم', 'text-red-400', 'bg-red-500']] as const).map(([key, label, textColor, bgColor]) => (
            <div key={key} className="text-center">
              <div className="text-xs text-[#5a5a78] mb-1">{label}</div>
              <div className={`text-lg font-bold font-mono ${textColor}`}>{formatSAR(stats.aging[key])} ر.س</div>
              <div className={`h-2 ${bgColor}/20 rounded-full mt-2 overflow-hidden`}>
                <div className={`h-full ${bgColor} rounded-full`} style={{ width: `${stats.totalOutstanding > 0 ? Math.round(stats.aging[key] / stats.totalOutstanding * 100) : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a78]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو رقم الفاتورة..." className="w-full bg-[#171724] border border-[#252535] rounded-lg pr-10 pl-4 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none placeholder:text-[#5a5a78]" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-[#171724] border border-[#252535] rounded-lg px-3 py-2 text-[#e2e2f0] text-sm focus:border-[#c9a84c] focus:outline-none">
          <option value="all">كل الحالات</option>
          {(Object.entries(STATUS_CONFIG) as [PaymentStatus, any][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#e2e2f0]">لا توجد مدفوعات مطابقة</h3>
          </div>
        ) : (
          filtered.map(p => {
            const sc = STATUS_CONFIG[p.status]
            const remaining = p.amount - p.amount_paid
            return (
              <div key={p.id} className={`bg-[#0f0f1a] border rounded-lg p-4 ${p.status === 'overdue' ? 'border-red-500/40' : p.status === 'disputed' ? 'border-purple-500/30' : 'border-[#252535]'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${p.client_type === 'investor' ? 'bg-[#60a5fa]/15 text-[#60a5fa]' : p.client_type === 'sponsor' ? 'bg-[#f59e0b]/15 text-[#f59e0b]' : 'bg-[#34d399]/15 text-[#34d399]'}`}>
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#e2e2f0]">{p.client_name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>{sc.label}</span>
                        {p.escalation_level >= 2 && <span className="text-xs bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" />تصعيد {p.escalation_level}</span>}
                      </div>
                      <div className="text-xs text-[#5a5a78]">{p.company} · {p.invoice_number}</div>
                      <div className="text-xs text-[#5a5a78] mt-1">{p.notes}</div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#5a5a78]">
                        <span>استحقاق: {new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric' }).format(new Date(p.due_date))}</span>
                        {p.aging_days > 0 && <span className="text-red-400">{p.aging_days} يوم تأخير</span>}
                        {p.reminders_sent > 0 && <span className="flex items-center gap-0.5"><Bell className="w-3 h-3" />{p.reminders_sent} تذكير</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <div className="text-lg font-bold font-mono text-[#c9a84c]">{formatSAR(remaining)} ر.س</div>
                    {p.amount_paid > 0 && <div className="text-xs text-emerald-400">مدفوع: {formatSAR(p.amount_paid)} ر.س</div>}
                    <div className="text-xs text-[#5a5a78]">من {formatSAR(p.amount)} ر.س</div>
                    {p.status !== 'paid' && (
                      <div className="flex gap-1 mt-2">
                        <button className="p-1.5 bg-[#171724] rounded hover:bg-[#252535] text-[#5a5a78] hover:text-[#e2e2f0]"><Phone className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 bg-[#171724] rounded hover:bg-[#252535] text-[#5a5a78] hover:text-[#e2e2f0]"><Mail className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 bg-[#171724] rounded hover:bg-[#252535] text-[#25D366]"><MessageSquare className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
