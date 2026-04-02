/*
 * FinancePage — النظام المالي الشامل
 * تابات: نظرة عامة | الفواتير | المدفوعات | المرتجعات | الميزانية | التقارير المالية | ZATCA | الحسابات
 * Design: Nour Theme — Gold/Dark glassmorphism
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, CreditCard, Download, Eye,
  ArrowDownRight, Wallet, PieChart, FileText, CheckCircle, XCircle, Clock,
  Plus, Pencil, Trash2, Send, QrCode, Building2, Calculator, BarChart3,
  AlertTriangle, ArrowUpRight, Banknote, Target, ShieldCheck, Landmark
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

// ========== MOCK DATA ==========
const cashflowData = [
  { month: 'يناير', income: 280000, expenses: 180000, profit: 100000 },
  { month: 'فبراير', income: 320000, expenses: 200000, profit: 120000 },
  { month: 'مارس', income: 450000, expenses: 220000, profit: 230000 },
  { month: 'أبريل', income: 380000, expenses: 250000, profit: 130000 },
  { month: 'مايو', income: 520000, expenses: 280000, profit: 240000 },
  { month: 'يونيو', income: 680000, expenses: 310000, profit: 370000 },
];

const revenueBySource = [
  { name: 'حجوزات أجنحة', value: 1200000, color: '#C9A84C' },
  { name: 'رعايات', value: 850000, color: '#3B82F6' },
  { name: 'خدمات عارضين', value: 320000, color: '#10B981' },
  { name: 'تذاكر', value: 180000, color: '#F59E0B' },
  { name: 'أخرى', value: 80000, color: '#8B5CF6' },
];

interface Invoice {
  id: number; number: string; client: string; clientType: 'merchant' | 'sponsor' | 'investor';
  amount: number; vat: number; total: number; status: 'paid' | 'unpaid' | 'overdue' | 'draft';
  dueDate: string; issuedDate: string; type: 'booth' | 'sponsorship' | 'service' | 'ticket';
  zatcaCompliant: boolean; qrCode: boolean; paymentMethod: string;
}

const mockInvoices: Invoice[] = [
  { id: 1, number: 'INV-2026-001', client: 'شركة الشمري للتجارة', clientType: 'merchant', amount: 45000, vat: 6750, total: 51750, status: 'paid', dueDate: '2026-04-15', issuedDate: '2026-03-01', type: 'booth', zatcaCompliant: true, qrCode: true, paymentMethod: 'تحويل بنكي' },
  { id: 2, number: 'INV-2026-002', client: 'مجموعة العتيبي', clientType: 'sponsor', amount: 120000, vat: 18000, total: 138000, status: 'paid', dueDate: '2026-04-20', issuedDate: '2026-03-05', type: 'sponsorship', zatcaCompliant: true, qrCode: true, paymentMethod: 'سداد' },
  { id: 3, number: 'INV-2026-003', client: 'استثمارات الدوسري', clientType: 'investor', amount: 85000, vat: 12750, total: 97750, status: 'unpaid', dueDate: '2026-04-25', issuedDate: '2026-03-10', type: 'booth', zatcaCompliant: true, qrCode: true, paymentMethod: '' },
  { id: 4, number: 'INV-2026-004', client: 'تجارة المطيري', clientType: 'merchant', amount: 25000, vat: 3750, total: 28750, status: 'overdue', dueDate: '2026-03-20', issuedDate: '2026-02-20', type: 'service', zatcaCompliant: true, qrCode: true, paymentMethod: '' },
  { id: 5, number: 'INV-2026-005', client: 'رؤية التقنية', clientType: 'sponsor', amount: 200000, vat: 30000, total: 230000, status: 'paid', dueDate: '2026-05-01', issuedDate: '2026-03-15', type: 'sponsorship', zatcaCompliant: true, qrCode: true, paymentMethod: 'مدى' },
  { id: 6, number: 'INV-2026-006', client: 'زهراني كابيتال', clientType: 'investor', amount: 65000, vat: 9750, total: 74750, status: 'draft', dueDate: '2026-05-10', issuedDate: '2026-03-28', type: 'booth', zatcaCompliant: false, qrCode: false, paymentMethod: '' },
  { id: 7, number: 'INV-2026-007', client: 'شركة الحربي', clientType: 'merchant', amount: 18000, vat: 2700, total: 20700, status: 'paid', dueDate: '2026-04-10', issuedDate: '2026-03-01', type: 'service', zatcaCompliant: true, qrCode: true, paymentMethod: 'STC Pay' },
  { id: 8, number: 'INV-2026-008', client: 'مؤسسة النجم', clientType: 'merchant', amount: 35000, vat: 5250, total: 40250, status: 'unpaid', dueDate: '2026-05-15', issuedDate: '2026-03-25', type: 'booth', zatcaCompliant: true, qrCode: true, paymentMethod: '' },
];

interface Payment {
  id: number; invoiceNumber: string; client: string; amount: number;
  method: 'bank_transfer' | 'sadad' | 'mada' | 'stc_pay' | 'cash';
  status: 'completed' | 'pending' | 'failed'; date: string; reference: string;
}

const mockPayments: Payment[] = [
  { id: 1, invoiceNumber: 'INV-2026-001', client: 'شركة الشمري للتجارة', amount: 51750, method: 'bank_transfer', status: 'completed', date: '2026-03-15T10:30:00', reference: 'TRX-001234' },
  { id: 2, invoiceNumber: 'INV-2026-002', client: 'مجموعة العتيبي', amount: 138000, method: 'sadad', status: 'completed', date: '2026-03-18T14:00:00', reference: 'SAD-005678' },
  { id: 3, invoiceNumber: 'INV-2026-005', client: 'رؤية التقنية', amount: 230000, method: 'mada', status: 'completed', date: '2026-03-20T09:15:00', reference: 'MDA-009012' },
  { id: 4, invoiceNumber: 'INV-2026-007', client: 'شركة الحربي', amount: 20700, method: 'stc_pay', status: 'completed', date: '2026-03-22T16:45:00', reference: 'STC-003456' },
  { id: 5, invoiceNumber: 'INV-2026-003', client: 'استثمارات الدوسري', amount: 97750, method: 'bank_transfer', status: 'pending', date: '2026-03-28T11:00:00', reference: 'TRX-007890' },
  { id: 6, invoiceNumber: 'INV-2026-004', client: 'تجارة المطيري', amount: 28750, method: 'sadad', status: 'failed', date: '2026-03-25T13:30:00', reference: 'SAD-004321' },
];

interface Refund {
  id: number; invoiceNumber: string; client: string; originalAmount: number;
  refundAmount: number; reason: string; status: 'approved' | 'pending' | 'rejected';
  requestDate: string; processDate: string | null;
}

const mockRefunds: Refund[] = [
  { id: 1, invoiceNumber: 'INV-2025-045', client: 'شركة المنصور', originalAmount: 35000, refundAmount: 35000, reason: 'إلغاء حجز جناح بسبب ظروف قاهرة', status: 'approved', requestDate: '2026-03-10', processDate: '2026-03-15' },
  { id: 2, invoiceNumber: 'INV-2025-067', client: 'مؤسسة الفجر', originalAmount: 18000, refundAmount: 9000, reason: 'تخفيض مساحة الجناح', status: 'approved', requestDate: '2026-03-12', processDate: '2026-03-18' },
  { id: 3, invoiceNumber: 'INV-2026-003', client: 'استثمارات الدوسري', originalAmount: 97750, refundAmount: 97750, reason: 'طلب إلغاء كامل', status: 'pending', requestDate: '2026-03-28', processDate: null },
  { id: 4, invoiceNumber: 'INV-2025-089', client: 'شركة الأمل', originalAmount: 22000, refundAmount: 22000, reason: 'خدمة لم تُقدم', status: 'rejected', requestDate: '2026-02-20', processDate: '2026-03-01' },
];

const budgetData = [
  { category: 'إيجار المواقع', budget: 500000, spent: 420000, remaining: 80000 },
  { category: 'التسويق والإعلان', budget: 300000, spent: 185000, remaining: 115000 },
  { category: 'البنية التحتية', budget: 250000, spent: 230000, remaining: 20000 },
  { category: 'الرواتب والموظفين', budget: 400000, spent: 350000, remaining: 50000 },
  { category: 'الخدمات اللوجستية', budget: 200000, spent: 120000, remaining: 80000 },
  { category: 'التقنية والأنظمة', budget: 150000, spent: 95000, remaining: 55000 },
  { category: 'الضيافة والفعاليات', budget: 100000, spent: 78000, remaining: 22000 },
  { category: 'احتياطي طوارئ', budget: 100000, spent: 15000, remaining: 85000 },
];

const accountsData = [
  { name: 'الحساب الجاري الرئيسي', bank: 'البنك الأهلي', number: '****4521', balance: 1850000, currency: 'SAR' },
  { name: 'حساب الرعايات', bank: 'بنك الراجحي', number: '****7832', balance: 920000, currency: 'SAR' },
  { name: 'حساب التشغيل', bank: 'بنك الرياض', number: '****1245', balance: 340000, currency: 'SAR' },
  { name: 'حساب الضمانات', bank: 'البنك السعودي الفرنسي', number: '****9087', balance: 500000, currency: 'SAR' },
];

const methodLabels: Record<string, string> = { bank_transfer: 'تحويل بنكي', sadad: 'سداد', mada: 'مدى', stc_pay: 'STC Pay', cash: 'نقدي' };
const typeLabels: Record<string, string> = { booth: 'حجز جناح', sponsorship: 'رعاية', service: 'خدمة', ticket: 'تذكرة' };

// ========== TABS ==========
type TabKey = 'overview' | 'invoices' | 'payments' | 'refunds' | 'budget' | 'reports' | 'zatca' | 'accounts';
const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: PieChart },
  { key: 'invoices', label: 'الفواتير', icon: Receipt },
  { key: 'payments', label: 'المدفوعات', icon: CreditCard },
  { key: 'refunds', label: 'المرتجعات', icon: ArrowDownRight },
  { key: 'budget', label: 'الميزانية', icon: Target },
  { key: 'reports', label: 'التقارير المالية', icon: BarChart3 },
  { key: 'zatca', label: 'ZATCA', icon: ShieldCheck },
  { key: 'accounts', label: 'الحسابات', icon: Landmark },
];

// ========== OVERVIEW TAB ==========
function OverviewTab() {
  const totalRevenue = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalPending = mockInvoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + i.total, 0);
  const totalOverdue = mockInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  const totalBudget = budgetData.reduce((s, b) => s + b.budget, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} icon={DollarSign} trend={18} trendLabel="هذا الربع" />
        <StatsCard title="المبالغ المعلقة" value={formatCurrency(totalPending)} icon={Clock} trend={-5} trendLabel="عن الشهر الماضي" delay={0.1} />
        <StatsCard title="المتأخرة" value={formatCurrency(totalOverdue)} icon={AlertTriangle} delay={0.2} />
        <StatsCard title="نسبة التحصيل" value={`${Math.round((totalRevenue / (totalRevenue + totalPending + totalOverdue)) * 100)}%`} icon={Target} trend={8} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-foreground mb-4">التدفق النقدي</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={cashflowData}>
              <defs>
                <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient>
                <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
              <Area type="monotone" dataKey="income" stroke="#C9A84C" fill="url(#incG)" strokeWidth={2} name="الدخل" />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="url(#expG)" strokeWidth={2} name="المصروفات" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">مصادر الإيرادات</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RPieChart>
              <Pie data={revenueBySource} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {revenueBySource.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
            </RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {revenueBySource.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name}</span>
                <span className="font-mono text-muted-foreground">{formatCurrency(s.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">استهلاك الميزانية</h3>
        <div className="space-y-3">
          {budgetData.slice(0, 5).map(b => {
            const pct = Math.round((b.spent / b.budget) * 100);
            return (
              <div key={b.category} className="space-y-1">
                <div className="flex justify-between text-xs"><span>{b.category}</span><span className="font-mono">{pct}% — {formatCurrency(b.spent)}/{formatCurrency(b.budget)}</span></div>
                <div className="h-2 rounded-full bg-card/80 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-danger' : pct > 70 ? 'bg-warning' : 'bg-accent'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ========== INVOICES TAB ==========
function InvoicesTab() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);

  const filtered = invoices.filter(i => {
    const ms = i.client.includes(search) || i.number.includes(search);
    const mf = filterStatus === 'all' || i.status === filterStatus;
    return ms && mf;
  });

  const columns: Column<Invoice>[] = [
    { key: 'number', label: 'رقم الفاتورة', render: (v) => <span className="font-mono text-xs text-accent">#{v}</span> },
    { key: 'client', label: 'العميل', render: (_, r) => <div><p className="text-sm font-medium">{r.client}</p><p className="text-xs text-muted-foreground">{typeLabels[r.type]}</p></div> },
    { key: 'amount', label: 'المبلغ', sortable: true, render: (_, r) => <div><p className="font-mono font-bold text-sm">{formatCurrency(r.total)}</p><p className="text-[10px] text-muted-foreground">شامل VAT {formatCurrency(r.vat)}</p></div> },
    { key: 'issuedDate', label: 'تاريخ الإصدار', render: v => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'dueDate', label: 'الاستحقاق', sortable: true, render: v => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'zatcaCompliant', label: 'ZATCA', render: v => v ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" /> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: (_, r) => (
      <div className="flex gap-1">
        <button onClick={e => { e.stopPropagation(); setSelectedInv(r); }} className="p-1.5 rounded-lg hover:bg-accent/10"><Eye className="w-4 h-4 text-accent" /></button>
        <button onClick={e => { e.stopPropagation(); toast.info('تحميل PDF — قريباً'); }} className="p-1.5 rounded-lg hover:bg-info/10"><Download className="w-4 h-4 text-info" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الفواتير" value={invoices.length} icon={Receipt} />
        <StatsCard title="مدفوعة" value={invoices.filter(i => i.status === 'paid').length} icon={CheckCircle} delay={0.1} />
        <StatsCard title="غير مدفوعة" value={invoices.filter(i => i.status === 'unpaid').length} icon={Clock} delay={0.2} />
        <StatsCard title="متأخرة" value={invoices.filter(i => i.status === 'overdue').length} icon={AlertTriangle} delay={0.3} />
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all', 'paid', 'unpaid', 'overdue', 'draft'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterStatus === s ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card'}`}>
            {s === 'all' ? 'الكل' : s === 'paid' ? 'مدفوعة' : s === 'unpaid' ? 'غير مدفوعة' : s === 'overdue' ? 'متأخرة' : 'مسودة'} ({s === 'all' ? invoices.length : invoices.filter(i => i.status === s).length})
          </button>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في الفواتير..." emptyMessage="لا توجد فواتير" onRowClick={setSelectedInv} />

      <Dialog open={!!selectedInv} onOpenChange={v => { if (!v) setSelectedInv(null); }}>
        <DialogContent className="glass-card border-border/50 max-w-2xl" dir="rtl">
          <DialogHeader><DialogTitle>فاتورة {selectedInv?.number}</DialogTitle></DialogHeader>
          {selectedInv && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground">العميل</p><p className="font-semibold">{selectedInv.client}</p><p className="text-xs text-muted-foreground">{typeLabels[selectedInv.type]}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground">المبلغ</p><p className="font-bold text-lg text-accent">{formatCurrency(selectedInv.total)}</p><p className="text-xs text-muted-foreground">المبلغ: {formatCurrency(selectedInv.amount)} + VAT: {formatCurrency(selectedInv.vat)}</p></div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">الإصدار</p><p className="text-sm mt-1">{formatDate(selectedInv.issuedDate)}</p></div>
                <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">الاستحقاق</p><p className="text-sm mt-1">{formatDate(selectedInv.dueDate)}</p></div>
                <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">ZATCA</p><div className="mt-1">{selectedInv.zatcaCompliant ? <CheckCircle className="w-5 h-5 text-success mx-auto" /> : <XCircle className="w-5 h-5 text-danger mx-auto" />}</div></div>
                <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">الحالة</p><div className="mt-1"><StatusBadge status={selectedInv.status} /></div></div>
              </div>
              {selectedInv.paymentMethod && <div className="glass-card p-3"><p className="text-xs text-muted-foreground">طريقة الدفع</p><p className="text-sm">{selectedInv.paymentMethod}</p></div>}
              <div className="flex gap-2">
                <Button onClick={() => toast.info('تحميل PDF — قريباً')} variant="outline" className="flex-1 gap-2"><Download className="w-4 h-4" /> تحميل PDF</Button>
                <Button onClick={() => toast.info('إرسال للعميل — قريباً')} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Send className="w-4 h-4" /> إرسال</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ========== PAYMENTS TAB ==========
function PaymentsTab() {
  const [search, setSearch] = useState('');
  const columns: Column<Payment>[] = [
    { key: 'reference', label: 'المرجع', render: v => <span className="font-mono text-xs text-accent">{v}</span> },
    { key: 'invoiceNumber', label: 'الفاتورة', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'client', label: 'العميل' },
    { key: 'amount', label: 'المبلغ', sortable: true, render: v => <span className="font-mono font-bold">{formatCurrency(v)}</span> },
    { key: 'method', label: 'الطريقة', render: v => <span className="text-xs bg-card/80 px-2 py-0.5 rounded border border-border/50">{methodLabels[v]}</span> },
    { key: 'date', label: 'التاريخ', render: v => <span className="text-xs">{formatDateTime(v)}</span> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="إجمالي المدفوعات" value={mockPayments.length} icon={CreditCard} />
        <StatsCard title="مكتملة" value={mockPayments.filter(p => p.status === 'completed').length} icon={CheckCircle} delay={0.1} />
        <StatsCard title="معلقة" value={mockPayments.filter(p => p.status === 'pending').length} icon={Clock} delay={0.2} />
        <StatsCard title="فاشلة" value={mockPayments.filter(p => p.status === 'failed').length} icon={XCircle} delay={0.3} />
      </div>
      <DataTable columns={columns} data={mockPayments.filter(p => p.client.includes(search) || p.reference.includes(search))} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في المدفوعات..." emptyMessage="لا توجد مدفوعات" />
    </div>
  );
}

// ========== REFUNDS TAB ==========
function RefundsTab() {
  const [refunds, setRefunds] = useState(mockRefunds);
  const [search, setSearch] = useState('');
  const columns: Column<Refund>[] = [
    { key: 'invoiceNumber', label: 'الفاتورة', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'client', label: 'العميل' },
    { key: 'originalAmount', label: 'المبلغ الأصلي', render: v => <span className="font-mono text-sm">{formatCurrency(v)}</span> },
    { key: 'refundAmount', label: 'مبلغ الاسترداد', render: v => <span className="font-mono font-bold text-danger">{formatCurrency(v)}</span> },
    { key: 'reason', label: 'السبب', render: v => <p className="text-sm truncate max-w-[200px]">{v}</p> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'requestDate', label: 'التاريخ', render: v => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'actions', label: '', render: (_, r) => r.status === 'pending' ? (
      <div className="flex gap-1">
        <button onClick={e => { e.stopPropagation(); setRefunds(prev => prev.map(x => x.id === r.id ? { ...x, status: 'approved' as const, processDate: new Date().toISOString() } : x)); toast.success('تم اعتماد الاسترداد'); }} className="p-1.5 rounded-lg hover:bg-success/10"><CheckCircle className="w-4 h-4 text-success" /></button>
        <button onClick={e => { e.stopPropagation(); setRefunds(prev => prev.map(x => x.id === r.id ? { ...x, status: 'rejected' as const, processDate: new Date().toISOString() } : x)); toast.success('تم رفض الاسترداد'); }} className="p-1.5 rounded-lg hover:bg-danger/10"><XCircle className="w-4 h-4 text-danger" /></button>
      </div>
    ) : null },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="إجمالي المرتجعات" value={refunds.length} icon={ArrowDownRight} />
        <StatsCard title="معتمدة" value={refunds.filter(r => r.status === 'approved').length} icon={CheckCircle} delay={0.1} />
        <StatsCard title="بانتظار" value={refunds.filter(r => r.status === 'pending').length} icon={Clock} delay={0.2} />
      </div>
      <DataTable columns={columns} data={refunds.filter(r => r.client.includes(search))} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث..." emptyMessage="لا توجد مرتجعات" />
    </div>
  );
}

// ========== BUDGET TAB ==========
function BudgetTab() {
  const totalBudget = budgetData.reduce((s, b) => s + b.budget, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="إجمالي الميزانية" value={formatCurrency(totalBudget)} icon={Target} />
        <StatsCard title="المصروف" value={formatCurrency(totalSpent)} icon={Wallet} delay={0.1} />
        <StatsCard title="المتبقي" value={formatCurrency(totalBudget - totalSpent)} icon={Banknote} delay={0.2} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">توزيع الميزانية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000}k`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#888' }} width={120} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
              <Bar dataKey="budget" fill="rgba(201,168,76,0.2)" name="الميزانية" radius={[0, 4, 4, 0]} />
              <Bar dataKey="spent" fill="#C9A84C" name="المصروف" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">تفاصيل الميزانية</h3>
          <div className="space-y-3">
            {budgetData.map(b => {
              const pct = Math.round((b.spent / b.budget) * 100);
              return (
                <div key={b.category} className="glass-card p-3">
                  <div className="flex justify-between mb-1"><span className="text-sm font-medium">{b.category}</span><span className={`text-xs font-mono ${pct > 90 ? 'text-danger' : pct > 70 ? 'text-warning' : 'text-success'}`}>{pct}%</span></div>
                  <div className="h-1.5 rounded-full bg-card/80 overflow-hidden mb-1"><div className={`h-full rounded-full ${pct > 90 ? 'bg-danger' : pct > 70 ? 'bg-warning' : 'bg-accent'}`} style={{ width: `${pct}%` }} /></div>
                  <div className="flex justify-between text-[10px] text-muted-foreground"><span>المصروف: {formatCurrency(b.spent)}</span><span>المتبقي: {formatCurrency(b.remaining)}</span></div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ========== REPORTS TAB ==========
function ReportsTab() {
  const monthlyPL = cashflowData.map(d => ({ ...d, profit: d.income - d.expenses }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="صافي الربح (6 أشهر)" value={formatCurrency(monthlyPL.reduce((s, d) => s + d.profit, 0))} icon={TrendingUp} trend={22} />
        <StatsCard title="هامش الربح" value="42%" icon={PieChart} delay={0.1} />
        <StatsCard title="معدل التحصيل" value="83%" icon={Target} delay={0.2} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">الأرباح والخسائر الشهرية</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyPL}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
            <Line type="monotone" dataKey="income" stroke="#C9A84C" strokeWidth={2} name="الدخل" dot={{ fill: '#C9A84C', r: 4 }} />
            <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="المصروفات" dot={{ fill: '#EF4444', r: 4 }} />
            <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="صافي الربح" dot={{ fill: '#10B981', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['تقرير الأرباح والخسائر', 'تقرير التدفق النقدي', 'تقرير الميزانية العمومية', 'تقرير ضريبة القيمة المضافة'].map((name, i) => (
          <motion.div key={name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-all">
            <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-accent" /><div><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">آخر تحديث: مارس 2026</p></div></div>
            <Button variant="outline" size="sm" onClick={() => toast.info('تحميل التقرير — قريباً')} className="gap-1"><Download className="w-3 h-3" /> تحميل</Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ========== ZATCA TAB ==========
function ZatcaTab() {
  const compliant = mockInvoices.filter(i => i.zatcaCompliant).length;
  const total = mockInvoices.length;
  const pct = Math.round((compliant / total) * 100);
  const totalVat = mockInvoices.reduce((s, i) => s + i.vat, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="نسبة الامتثال" value={`${pct}%`} icon={ShieldCheck} />
        <StatsCard title="فواتير متوافقة" value={`${compliant}/${total}`} icon={CheckCircle} delay={0.1} />
        <StatsCard title="إجمالي VAT" value={formatCurrency(totalVat)} icon={Calculator} delay={0.2} />
        <StatsCard title="QR Code" value={`${mockInvoices.filter(i => i.qrCode).length} فاتورة`} icon={QrCode} delay={0.3} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">حالة الامتثال — ZATCA Phase 2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'الفوترة الإلكترونية (Phase 2)', status: true, desc: 'جميع الفواتير تُصدر إلكترونياً بصيغة XML/PDF-A3' },
            { label: 'رمز QR على الفواتير', status: true, desc: 'رمز QR يحتوي على بيانات البائع والمشتري والمبلغ والضريبة' },
            { label: 'التكامل مع ZATCA API', status: true, desc: 'ربط مباشر مع منصة فاتورة لإرسال الفواتير والإشعارات' },
            { label: 'ضريبة القيمة المضافة 15%', status: true, desc: 'احتساب تلقائي لـ VAT على جميع الفواتير' },
            { label: 'الأرشفة الإلكترونية', status: true, desc: 'حفظ جميع الفواتير لمدة 6 سنوات كحد أدنى' },
            { label: 'إشعارات دائنة/مدينة', status: false, desc: 'إصدار إشعارات عند التعديل أو الإلغاء — قيد التطوير' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className={`glass-card p-3 flex items-start gap-3 ${item.status ? 'border-success/20' : 'border-warning/20'}`}>
              {item.status ? <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />}
              <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ========== ACCOUNTS TAB ==========
function AccountsTab() {
  const totalBalance = accountsData.reduce((s, a) => s + a.balance, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard title="إجمالي الأرصدة" value={formatCurrency(totalBalance)} icon={Landmark} />
        <StatsCard title="عدد الحسابات" value={accountsData.length} icon={Building2} delay={0.1} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountsData.map((acc, i) => (
          <motion.div key={acc.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Landmark className="w-5 h-5 text-accent" /><div><p className="font-semibold">{acc.name}</p><p className="text-xs text-muted-foreground">{acc.bank}</p></div></div>
              <span className="font-mono text-xs text-muted-foreground">{acc.number}</span>
            </div>
            <div className="glass-card p-3 text-center"><p className="text-xs text-muted-foreground">الرصيد الحالي</p><p className="text-2xl font-bold text-accent font-mono">{formatCurrency(acc.balance)}</p></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ========== MAIN PAGE ==========
export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="الإدارة المالية" subtitle="إدارة الفواتير والمدفوعات والميزانية والتقارير المالية" actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast.info('تصدير التقرير المالي — قريباً')} className="gap-2"><Download className="w-4 h-4" /> تصدير</Button>
            <Button onClick={() => toast.info('إنشاء فاتورة — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> فاتورة جديدة</Button>
          </div>
        } />

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'invoices' && <InvoicesTab />}
            {activeTab === 'payments' && <PaymentsTab />}
            {activeTab === 'refunds' && <RefundsTab />}
            {activeTab === 'budget' && <BudgetTab />}
            {activeTab === 'reports' && <ReportsTab />}
            {activeTab === 'zatca' && <ZatcaTab />}
            {activeTab === 'accounts' && <AccountsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
