/* ═══════════════════════════════════════════════════════════════
   نظام العقود المعمق — Contracts Management System
   Nour Theme · Liquid Gold Executive
   7 تابات: نظرة عامة | العقود | إنشاء عقد | التوقيع الإلكتروني | ZATCA | مراحل الموافقة | الأرشيف
   ═══════════════════════════════════════════════════════════════ */
import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  FileText, FileCheck, FilePen, FileSignature, Shield, ShieldCheck,
  Download, Filter, Search, Calendar, CheckCircle2, Clock, AlertTriangle,
  BarChart3, Zap, TrendingUp, DollarSign, ChevronLeft, Plus, Eye,
  Send, Stamp, Lock, Unlock, Archive, RotateCcw, XCircle, Printer,
  Building2, User, Hash, CreditCard, Receipt, ArrowUpDown, Pen,
  ChevronDown, ChevronUp, Layers, CircleDot, ArrowRight
} from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tabs = ['نظرة عامة', 'العقود', 'إنشاء عقد', 'التوقيع الإلكتروني', 'ZATCA', 'مراحل الموافقة', 'الأرشيف'] as const
type TabType = typeof tabs[number]

/* ── بيانات تجريبية ── */
const contractsTrend = [
  { month: 'يناير', عقود: 12, قيمة: 4500000 },
  { month: 'فبراير', عقود: 18, قيمة: 6200000 },
  { month: 'مارس', عقود: 24, قيمة: 8900000 },
  { month: 'أبريل', عقود: 20, قيمة: 7800000 },
  { month: 'مايو', عقود: 30, قيمة: 12400000 },
  { month: 'يونيو', عقود: 35, قيمة: 15600000 },
]

const contractsByType = [
  { name: 'رعاية', value: 35, color: '#C9A84C' },
  { name: 'تأجير مساحة', value: 30, color: '#DAA520' },
  { name: 'خدمات', value: 20, color: '#A8A8A8' },
  { name: 'استثمار', value: 15, color: '#CD7F32' },
]

const contracts = [
  { id: 'CTR-2026-001', title: 'عقد رعاية بلاتينية — STC', party: 'STC', type: 'رعاية', value: 2500000, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', signStatus: 'signed', zatcaStatus: 'compliant', approvalStage: 'completed', createdAt: '2025-12-15' },
  { id: 'CTR-2026-002', title: 'عقد تأجير جناح A12 — مجموعة الفيصل', party: 'مجموعة الفيصل', type: 'تأجير مساحة', value: 850000, startDate: '2026-02-01', endDate: '2026-08-31', status: 'active', signStatus: 'signed', zatcaStatus: 'compliant', approvalStage: 'completed', createdAt: '2026-01-10' },
  { id: 'CTR-2026-003', title: 'عقد خدمات تقنية — أرامكو', party: 'أرامكو', type: 'خدمات', value: 3200000, startDate: '2026-03-01', endDate: '2027-02-28', status: 'active', signStatus: 'signed', zatcaStatus: 'compliant', approvalStage: 'completed', createdAt: '2026-02-20' },
  { id: 'CTR-2026-004', title: 'عقد استثمار — صندوق الرياض', party: 'صندوق الرياض', type: 'استثمار', value: 5000000, startDate: '2026-04-01', endDate: '2028-03-31', status: 'pending_signature', signStatus: 'awaiting', zatcaStatus: 'pending', approvalStage: 'legal_review', createdAt: '2026-03-25' },
  { id: 'CTR-2026-005', title: 'عقد رعاية ذهبية — موبايلي', party: 'موبايلي', type: 'رعاية', value: 1500000, startDate: '2026-05-01', endDate: '2026-12-31', status: 'draft', signStatus: 'not_started', zatcaStatus: 'not_submitted', approvalStage: 'draft', createdAt: '2026-03-28' },
  { id: 'CTR-2026-006', title: 'عقد تأجير مساحة B5 — شركة النخبة', party: 'شركة النخبة', type: 'تأجير مساحة', value: 420000, startDate: '2026-06-01', endDate: '2026-11-30', status: 'pending_approval', signStatus: 'not_started', zatcaStatus: 'not_submitted', approvalStage: 'supervisor_review', createdAt: '2026-03-30' },
  { id: 'CTR-2026-007', title: 'عقد رعاية فضية — زين', party: 'زين', type: 'رعاية', value: 800000, startDate: '2026-04-15', endDate: '2026-12-31', status: 'expired', signStatus: 'signed', zatcaStatus: 'compliant', approvalStage: 'completed', createdAt: '2025-11-01' },
]

const approvalPipeline = [
  { stage: 'مسودة', icon: FilePen, count: 2, color: '#6B6560' },
  { stage: 'مراجعة المشرف', icon: Eye, count: 1, color: '#DAA520' },
  { stage: 'مراجعة قانونية', icon: Shield, count: 1, color: '#C9A84C' },
  { stage: 'موافقة المدير', icon: Stamp, count: 0, color: '#CD7F32' },
  { stage: 'التوقيع', icon: FileSignature, count: 1, color: '#A8A8A8' },
  { stage: 'مكتمل', icon: CheckCircle2, count: 3, color: '#22C55E' },
]

const signatureRequests = [
  { id: 'SIG-001', contract: 'CTR-2026-004', party: 'صندوق الرياض', signer: 'محمد العتيبي', role: 'المدير التنفيذي', sentAt: '2026-03-26 10:00', status: 'pending', method: 'OTP + بصمة', expiresAt: '2026-04-05' },
  { id: 'SIG-002', contract: 'CTR-2026-004', party: 'ماهم إكسبو', signer: 'نور كرم', role: 'المدير العام', sentAt: '2026-03-26 10:00', status: 'signed', method: 'OTP + بصمة', expiresAt: '2026-04-05' },
  { id: 'SIG-003', contract: 'CTR-2026-005', party: 'موبايلي', signer: 'أحمد الشهري', role: 'مدير الشراكات', sentAt: '—', status: 'not_sent', method: '—', expiresAt: '—' },
]

const zatcaRecords = [
  { id: 'ZAT-001', contract: 'CTR-2026-001', invoiceNo: 'INV-2026-0001', amount: 2500000, vat: 375000, total: 2875000, qrCode: true, status: 'compliant', submittedAt: '2026-01-02' },
  { id: 'ZAT-002', contract: 'CTR-2026-002', invoiceNo: 'INV-2026-0015', amount: 850000, vat: 127500, total: 977500, qrCode: true, status: 'compliant', submittedAt: '2026-02-03' },
  { id: 'ZAT-003', contract: 'CTR-2026-003', invoiceNo: 'INV-2026-0028', amount: 3200000, vat: 480000, total: 3680000, qrCode: true, status: 'compliant', submittedAt: '2026-03-02' },
  { id: 'ZAT-004', contract: 'CTR-2026-004', invoiceNo: '—', amount: 5000000, vat: 750000, total: 5750000, qrCode: false, status: 'pending', submittedAt: '—' },
]

const archivedContracts = [
  { id: 'CTR-2025-042', title: 'عقد رعاية — الاتصالات السعودية 2025', party: 'STC', value: 2000000, endDate: '2025-12-31', archivedAt: '2026-01-05', reason: 'انتهاء المدة' },
  { id: 'CTR-2025-038', title: 'عقد تأجير مساحة — معرض الرياض 2025', party: 'مجموعة العليان', value: 650000, endDate: '2025-11-30', archivedAt: '2025-12-05', reason: 'انتهاء المدة' },
  { id: 'CTR-2025-029', title: 'عقد خدمات — شركة البيانات', party: 'شركة البيانات', value: 180000, endDate: '2025-09-30', archivedAt: '2025-10-02', reason: 'إلغاء بالتراضي' },
]

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedContract, setExpandedContract] = useState<string | null>(null)

  const statusColor = (status: string) => {
    switch(status) {
      case 'active': case 'signed': case 'compliant': case 'completed': return 'text-emerald-400'
      case 'pending_signature': case 'awaiting': case 'pending': case 'pending_approval': case 'supervisor_review': case 'legal_review': return 'text-amber-400'
      case 'draft': case 'not_started': case 'not_submitted': case 'not_sent': return 'text-muted-foreground'
      case 'expired': case 'rejected': return 'text-red-400'
      default: return 'text-muted-foreground'
    }
  }

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      active: 'نشط', signed: 'موقّع', compliant: 'متوافق', completed: 'مكتمل',
      pending_signature: 'بانتظار التوقيع', awaiting: 'بانتظار', pending: 'معلق', pending_approval: 'بانتظار الموافقة',
      draft: 'مسودة', not_started: 'لم يبدأ', not_submitted: 'لم يُرسل', not_sent: 'لم يُرسل',
      expired: 'منتهي', rejected: 'مرفوض', supervisor_review: 'مراجعة المشرف', legal_review: 'مراجعة قانونية',
    }
    return map[status] || status
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="إدارة العقود"
          subtitle="نظام شامل لإنشاء وتوقيع ومتابعة العقود مع توافق ZATCA"
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => toast.info('تصدير — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5"><Download size={14} /> تصدير</button>
              <button onClick={() => setActiveTab('إنشاء عقد')} className="nour-btn-gold text-xs flex items-center gap-1.5"><Plus size={14} /> عقد جديد</button>
            </div>
          }
        />

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-thin" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
              'px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all duration-300',
              activeTab === tab ? 'bg-gradient-to-l from-[rgba(201,168,76,0.15)] to-[rgba(201,168,76,0.08)] text-[#C9A84C] border border-[rgba(201,168,76,0.2)] shadow-[0_0_12px_rgba(201,168,76,0.08)]' : 'text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.05)]'
            )}>{tab}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {/* ═══ نظرة عامة ═══ */}
            {activeTab === 'نظرة عامة' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="إجمالي العقود" value={contracts.length.toString()} icon={FileText} delay={0} />
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(contracts.reduce((s, c) => s + c.value, 0))} icon={DollarSign} trend={32} trendLabel="نمو" delay={0.1} />
                  <StatsCard title="عقود نشطة" value={contracts.filter(c => c.status === 'active').length.toString()} icon={FileCheck} delay={0.2} />
                  <StatsCard title="بانتظار التوقيع" value={contracts.filter(c => c.signStatus === 'awaiting' || c.signStatus === 'not_started').length.toString()} icon={FileSignature} delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">اتجاه العقود والإيرادات</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={contractsTrend}>
                        <defs><linearGradient id="goldGradCtr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                        <XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000000).toFixed(0)}M`} />
                        <Tooltip contentStyle={{ background: 'rgba(26,25,23,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} />
                        <Area type="monotone" dataKey="قيمة" stroke="#C9A84C" fill="url(#goldGradCtr)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">توزيع العقود حسب النوع</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <RechartsPie>
                        <Pie data={contractsByType} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                          {contractsByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'rgba(26,25,23,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 11 }} />
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {contractsByType.map((t) => (
                        <div key={t.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} /><span className="text-muted-foreground">{t.name}</span></div>
                          <span className="font-bold text-foreground">{t.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Approval Pipeline Visual */}
                <div className="glass-card p-4 sm:p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Layers size={16} className="text-[#C9A84C]" /> خط أنابيب الموافقات</h3>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {approvalPipeline.map((stage, i) => (
                      <div key={stage.stage} className="flex items-center gap-2 shrink-0">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl min-w-[100px]" style={{ background: `${stage.color}08`, border: `1px solid ${stage.color}20` }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${stage.color}15`, border: `1px solid ${stage.color}30` }}>
                            <stage.icon size={18} style={{ color: stage.color }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground text-center">{stage.stage}</span>
                          <span className="text-lg font-bold" style={{ color: stage.color }}>{stage.count}</span>
                        </motion.div>
                        {i < approvalPipeline.length - 1 && <ArrowRight size={16} className="text-muted-foreground/30 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights */}
                <div className="glass-card p-4 sm:p-6 border-[rgba(201,168,76,0.15)]">
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Zap size={16} className="text-[#C9A84C]" /> رؤى العقود الذكية</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: AlertTriangle, text: 'عقد CTR-2026-004 بانتظار التوقيع منذ 7 أيام — يُنصح بالمتابعة الفورية', type: 'warning' },
                      { icon: TrendingUp, text: 'قيمة العقود نمت 32% مقارنة بالربع السابق — أداء ممتاز', type: 'success' },
                      { icon: Shield, text: 'جميع العقود النشطة متوافقة مع ZATCA — لا مخالفات', type: 'success' },
                      { icon: Clock, text: 'عقد CTR-2026-007 منتهي — يُنصح بالتجديد أو الأرشفة', type: 'info' },
                    ].map((insight, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn(
                        'p-3 rounded-lg flex items-start gap-3 text-xs',
                        insight.type === 'success' && 'bg-emerald-500/5 border border-emerald-500/10',
                        insight.type === 'warning' && 'bg-amber-500/5 border border-amber-500/10',
                        insight.type === 'info' && 'bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)]',
                      )}>
                        <insight.icon size={14} className={cn('shrink-0 mt-0.5', insight.type === 'success' && 'text-emerald-400', insight.type === 'warning' && 'text-amber-400', insight.type === 'info' && 'text-[#C9A84C]')} />
                        <span className="text-muted-foreground leading-relaxed">{insight.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث بالرقم أو الطرف..." className="w-full h-10 pr-9 pl-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                  </div>
                  <button onClick={() => toast.info('تصفية — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5 justify-center"><Filter size={14} /> تصفية</button>
                </div>

                <div className="space-y-3">
                  {contracts.filter(c => !searchQuery || c.id.includes(searchQuery) || c.party.includes(searchQuery) || c.title.includes(searchQuery)).map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden">
                      <div className="p-4 cursor-pointer hover:bg-[rgba(201,168,76,0.02)] transition-colors" onClick={() => setExpandedContract(expandedContract === c.id ? null : c.id)}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center shrink-0">
                              <FileText size={18} className="text-[#C9A84C]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono text-[#C9A84C]">{c.id}</span>
                                <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full font-medium', statusColor(c.status))} style={{ background: 'rgba(201,168,76,0.08)' }}>{statusLabel(c.status)}</span>
                              </div>
                              <h4 className="text-xs font-bold text-foreground mt-1">{c.title}</h4>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{c.party} · {c.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-left sm:text-right">
                              <p className="text-sm font-bold text-[#C9A84C]">{formatCurrency(c.value)}</p>
                              <p className="text-[10px] text-muted-foreground">{formatDate(c.startDate)} — {formatDate(c.endDate)}</p>
                            </div>
                            {expandedContract === c.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedContract === c.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="px-4 pb-4 pt-2 border-t border-border/30">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-[rgba(201,168,76,0.03)]">
                                  <p className="text-[10px] text-muted-foreground">التوقيع</p>
                                  <p className={cn('text-xs font-bold mt-0.5', statusColor(c.signStatus))}>{statusLabel(c.signStatus)}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-[rgba(201,168,76,0.03)]">
                                  <p className="text-[10px] text-muted-foreground">ZATCA</p>
                                  <p className={cn('text-xs font-bold mt-0.5', statusColor(c.zatcaStatus))}>{statusLabel(c.zatcaStatus)}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-[rgba(201,168,76,0.03)]">
                                  <p className="text-[10px] text-muted-foreground">مرحلة الموافقة</p>
                                  <p className={cn('text-xs font-bold mt-0.5', statusColor(c.approvalStage))}>{statusLabel(c.approvalStage)}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-[rgba(201,168,76,0.03)]">
                                  <p className="text-[10px] text-muted-foreground">تاريخ الإنشاء</p>
                                  <p className="text-xs font-bold text-foreground mt-0.5">{formatDate(c.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <button onClick={() => toast.info('عرض العقد — قريباً')} className="nour-btn-outline text-[10px] flex items-center gap-1"><Eye size={10} /> عرض</button>
                                <button onClick={() => toast.info('طباعة — قريباً')} className="nour-btn-outline text-[10px] flex items-center gap-1"><Printer size={10} /> طباعة</button>
                                <button onClick={() => toast.info('تحميل PDF — قريباً')} className="nour-btn-outline text-[10px] flex items-center gap-1"><Download size={10} /> PDF</button>
                                {c.signStatus !== 'signed' && <button onClick={() => toast.info('إرسال للتوقيع — قريباً')} className="nour-btn-gold text-[10px] flex items-center gap-1"><Send size={10} /> إرسال للتوقيع</button>}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ إنشاء عقد ═══ */}
            {activeTab === 'إنشاء عقد' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="glass-card p-4 sm:p-6">
                  <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2"><FilePen size={16} className="text-[#C9A84C]" /> إنشاء عقد جديد</h3>

                  <div className="space-y-5">
                    {/* Contract Type */}
                    <div>
                      <label className="text-xs font-medium text-foreground mb-2 block">نوع العقد</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['رعاية', 'تأجير مساحة', 'خدمات', 'استثمار'].map((type) => (
                          <button key={type} className="p-3 rounded-xl text-xs text-center border border-border hover:border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.05)] transition-all">{type}</button>
                        ))}
                      </div>
                    </div>

                    {/* Party Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block flex items-center gap-1"><Building2 size={12} /> الطرف الثاني</label>
                        <input type="text" placeholder="اسم الشركة أو الجهة" className="w-full h-10 px-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block flex items-center gap-1"><User size={12} /> ممثل الطرف الثاني</label>
                        <input type="text" placeholder="الاسم الكامل" className="w-full h-10 px-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block flex items-center gap-1"><Hash size={12} /> السجل التجاري</label>
                        <input type="text" placeholder="رقم السجل التجاري" className="w-full h-10 px-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block flex items-center gap-1"><CreditCard size={12} /> الرقم الضريبي</label>
                        <input type="text" placeholder="رقم التسجيل الضريبي" className="w-full h-10 px-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">عنوان العقد</label>
                      <input type="text" placeholder="عنوان وصفي للعقد" className="w-full h-10 px-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block flex items-center gap-1"><DollarSign size={12} /> القيمة (ر.س)</label>
                        <input type="number" placeholder="0.00" className="w-full h-10 px-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block flex items-center gap-1"><Calendar size={12} /> تاريخ البدء</label>
                        <input type="date" className="w-full h-10 px-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block flex items-center gap-1"><Calendar size={12} /> تاريخ الانتهاء</label>
                        <input type="date" className="w-full h-10 px-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">بنود العقد</label>
                      <textarea placeholder="أدخل بنود وشروط العقد..." className="w-full h-32 p-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none resize-none transition-all" />
                    </div>

                    {/* Template Selection */}
                    <div>
                      <label className="text-xs font-medium text-foreground mb-2 block">أو اختر قالب جاهز</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['قالب رعاية بلاتينية', 'قالب تأجير مساحة', 'قالب خدمات تقنية'].map((tmpl) => (
                          <button key={tmpl} onClick={() => toast.info('تحميل القالب — قريباً')} className="p-3 rounded-xl text-xs text-center border border-dashed border-border hover:border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.05)] transition-all flex items-center gap-2 justify-center">
                            <FileText size={14} className="text-[#C9A84C]" />{tmpl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                      <button onClick={() => toast.success('تم حفظ المسودة')} className="nour-btn-outline text-xs flex items-center gap-1.5"><FilePen size={14} /> حفظ كمسودة</button>
                      <button onClick={() => toast.success('تم إرسال العقد للمراجعة')} className="nour-btn-gold text-xs flex items-center gap-1.5"><Send size={14} /> إرسال للمراجعة</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ التوقيع الإلكتروني ═══ */}
            {activeTab === 'التوقيع الإلكتروني' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="طلبات التوقيع" value={signatureRequests.length.toString()} icon={FileSignature} delay={0} />
                  <StatsCard title="موقّعة" value={signatureRequests.filter(s => s.status === 'signed').length.toString()} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="بانتظار" value={signatureRequests.filter(s => s.status === 'pending').length.toString()} icon={Clock} delay={0.2} />
                  <StatsCard title="لم تُرسل" value={signatureRequests.filter(s => s.status === 'not_sent').length.toString()} icon={Send} delay={0.3} />
                </div>

                {/* E-Signature Info */}
                <div className="glass-card p-4 sm:p-5 border-[rgba(201,168,76,0.15)]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center shrink-0"><Lock size={18} className="text-[#C9A84C]" /></div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">التوقيع الإلكتروني المعتمد</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">نظام التوقيع الإلكتروني متوافق مع نظام المعاملات الإلكترونية السعودي. يدعم التوقيع عبر OTP + التحقق البيومتري (بصمة). جميع التوقيعات مشفرة ومؤرخة بطابع زمني موثق.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="p-4 border-b border-border/50">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Pen size={16} className="text-[#C9A84C]" /> طلبات التوقيع</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead><tr className="border-b border-border/50">
                        {['الرقم', 'العقد', 'الموقّع', 'الدور', 'الطريقة', 'أُرسل في', 'ينتهي في', 'الحالة', ''].map(h => <th key={h} className="text-right p-3 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {signatureRequests.map((sig) => (
                          <tr key={sig.id} className="border-b border-border/30 hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                            <td className="p-3 text-[10px] font-mono text-[#C9A84C]">{sig.id}</td>
                            <td className="p-3 text-[10px] font-mono text-muted-foreground">{sig.contract}</td>
                            <td className="p-3 text-xs font-medium text-foreground">{sig.signer}</td>
                            <td className="p-3 text-[10px] text-muted-foreground">{sig.role}</td>
                            <td className="p-3 text-[10px] text-muted-foreground">{sig.method}</td>
                            <td className="p-3 text-[10px] text-muted-foreground">{sig.sentAt}</td>
                            <td className="p-3 text-[10px] text-muted-foreground">{sig.expiresAt}</td>
                            <td className="p-3"><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', statusColor(sig.status))} style={{ background: 'rgba(201,168,76,0.08)' }}>{statusLabel(sig.status)}</span></td>
                            <td className="p-3">
                              {sig.status === 'not_sent' && <button onClick={() => toast.info('إرسال طلب التوقيع — قريباً')} className="nour-btn-gold text-[10px] px-2 py-1"><Send size={10} /></button>}
                              {sig.status === 'pending' && <button onClick={() => toast.info('تذكير — قريباً')} className="nour-btn-outline text-[10px] px-2 py-1">تذكير</button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ ZATCA ═══ */}
            {activeTab === 'ZATCA' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="فواتير متوافقة" value={zatcaRecords.filter(z => z.status === 'compliant').length.toString()} icon={ShieldCheck} delay={0} />
                  <StatsCard title="إجمالي الضريبة" value={formatCurrency(zatcaRecords.filter(z => z.status === 'compliant').reduce((s, z) => s + z.vat, 0))} icon={Receipt} delay={0.1} />
                  <StatsCard title="بانتظار الإرسال" value={zatcaRecords.filter(z => z.status === 'pending').length.toString()} icon={Clock} delay={0.2} />
                  <StatsCard title="نسبة التوافق" value={`${Math.round((zatcaRecords.filter(z => z.status === 'compliant').length / zatcaRecords.length) * 100)}%`} icon={Shield} delay={0.3} />
                </div>

                {/* ZATCA Compliance Banner */}
                <div className="glass-card p-4 sm:p-5 border-emerald-500/15 bg-emerald-500/[0.02]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0"><ShieldCheck size={18} className="text-emerald-400" /></div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">توافق ZATCA (الفوترة الإلكترونية)</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">النظام متوافق مع متطلبات هيئة الزكاة والضريبة والجمارك — المرحلة الثانية (الربط والتكامل). جميع الفواتير تتضمن رمز QR وتُرسل تلقائياً عبر API.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="p-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Receipt size={16} className="text-[#C9A84C]" /> سجل الفواتير الضريبية</h3>
                    <button onClick={() => toast.info('إرسال دفعة — قريباً')} className="nour-btn-outline text-[10px] flex items-center gap-1"><Send size={10} /> إرسال المعلقة</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                      <thead><tr className="border-b border-border/50">
                        {['الرقم', 'العقد', 'رقم الفاتورة', 'المبلغ', 'الضريبة 15%', 'الإجمالي', 'QR', 'الحالة', 'تاريخ الإرسال'].map(h => <th key={h} className="text-right p-3 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {zatcaRecords.map((z) => (
                          <tr key={z.id} className="border-b border-border/30 hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                            <td className="p-3 text-[10px] font-mono text-[#C9A84C]">{z.id}</td>
                            <td className="p-3 text-[10px] font-mono text-muted-foreground">{z.contract}</td>
                            <td className="p-3 text-[10px] font-mono text-foreground">{z.invoiceNo}</td>
                            <td className="p-3 text-xs font-bold text-foreground">{formatCurrency(z.amount)}</td>
                            <td className="p-3 text-xs text-amber-400">{formatCurrency(z.vat)}</td>
                            <td className="p-3 text-xs font-bold text-[#C9A84C]">{formatCurrency(z.total)}</td>
                            <td className="p-3">{z.qrCode ? <CheckCircle2 size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-muted-foreground" />}</td>
                            <td className="p-3"><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', statusColor(z.status))} style={{ background: z.status === 'compliant' ? 'rgba(34,197,94,0.1)' : 'rgba(201,168,76,0.08)' }}>{statusLabel(z.status)}</span></td>
                            <td className="p-3 text-[10px] text-muted-foreground">{z.submittedAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ مراحل الموافقة ═══ */}
            {activeTab === 'مراحل الموافقة' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Pipeline Visual */}
                <div className="glass-card p-4 sm:p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">خط أنابيب الموافقات</h3>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {approvalPipeline.map((stage, i) => (
                      <div key={stage.stage} className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl min-w-[110px]" style={{ background: `${stage.color}08`, border: `1px solid ${stage.color}20` }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${stage.color}15`, border: `1px solid ${stage.color}30` }}>
                            <stage.icon size={18} style={{ color: stage.color }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground text-center">{stage.stage}</span>
                          <span className="text-lg font-bold" style={{ color: stage.color }}>{stage.count}</span>
                        </div>
                        {i < approvalPipeline.length - 1 && <ArrowRight size={16} className="text-muted-foreground/30 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contracts in each stage */}
                <div className="space-y-3">
                  {contracts.filter(c => c.approvalStage !== 'completed').map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center shrink-0">
                            <CircleDot size={18} className="text-amber-400" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-[#C9A84C]">{c.id}</span>
                            <h4 className="text-xs font-bold text-foreground mt-0.5">{c.title}</h4>
                            <p className="text-[10px] text-muted-foreground">{c.party} · {formatCurrency(c.value)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/15 font-medium">{statusLabel(c.approvalStage)}</span>
                          <button onClick={() => toast.success('تمت الموافقة')} className="nour-btn-gold text-[10px] flex items-center gap-1"><CheckCircle2 size={10} /> موافقة</button>
                          <button onClick={() => toast.error('تم الرفض')} className="nour-btn-outline text-[10px] flex items-center gap-1 text-red-400 border-red-400/20 hover:bg-red-400/10"><XCircle size={10} /> رفض</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {contracts.filter(c => c.approvalStage !== 'completed').length === 0 && (
                    <div className="glass-card p-12 text-center">
                      <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-foreground">لا توجد عقود بانتظار الموافقة</p>
                      <p className="text-xs text-muted-foreground mt-1">جميع العقود تمت الموافقة عليها</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ الأرشيف ═══ */}
            {activeTab === 'الأرشيف' && (
              <div className="space-y-4">
                <div className="glass-card p-4 sm:p-5 border-[rgba(201,168,76,0.1)]">
                  <div className="flex items-start gap-3">
                    <Archive size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">أرشيف العقود</h3>
                      <p className="text-xs text-muted-foreground mt-1">العقود المنتهية أو الملغاة. يمكن استعادتها أو تجديدها عند الحاجة.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {archivedContracts.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4 sm:p-5 opacity-80 hover:opacity-100 transition-opacity">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[rgba(107,101,96,0.1)] border border-[rgba(107,101,96,0.15)] flex items-center justify-center shrink-0">
                            <Archive size={18} className="text-muted-foreground" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                            <h4 className="text-xs font-bold text-foreground mt-0.5">{c.title}</h4>
                            <p className="text-[10px] text-muted-foreground">{c.party} · {formatCurrency(c.value)} · انتهى {formatDate(c.endDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(107,101,96,0.1)] text-muted-foreground">{c.reason}</span>
                          <button onClick={() => toast.info('استعادة — قريباً')} className="nour-btn-outline text-[10px] flex items-center gap-1"><RotateCcw size={10} /> استعادة</button>
                          <button onClick={() => toast.info('تجديد — قريباً')} className="nour-btn-gold text-[10px] flex items-center gap-1"><Plus size={10} /> تجديد</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
