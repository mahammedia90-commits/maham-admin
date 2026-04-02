/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — القانونية والامتثال (Legal & Compliance)
 * Features: عقود، تراخيص، امتثال، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scale, FileText, Shield, AlertTriangle, CheckCircle, Clock,
  Download, Eye, Plus, Gavel, BookOpen, Lock, X, Trash2,
  Calendar, Building2, Search, ExternalLink
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface Contract {
  id: number; title: string; party: string; type: string; status: string
  value: number; startDate: string; endDate: string; notes: string; signedBy: string
}

interface ComplianceItem {
  id: number; title: string; category: string; status: string; dueDate: string; assignee: string; priority: string
}

const typeLabels: Record<string, string> = { service: 'خدمات', sponsorship: 'رعاية', rental: 'تأجير', partnership: 'شراكة', employment: 'توظيف', vendor: 'مورد' }
const statusLabels: Record<string, string> = { active: 'ساري', expired: 'منتهي', draft: 'مسودة', pending: 'قيد المراجعة', terminated: 'ملغي' }
const statusColors: Record<string, string> = { active: 'bg-success/10 text-success', expired: 'bg-danger/10 text-danger', draft: 'bg-chrome/10 text-chrome', pending: 'bg-warning/10 text-warning', terminated: 'bg-danger/10 text-danger' }
const compStatusColors: Record<string, string> = { compliant: 'bg-success/10 text-success', 'in_progress': 'bg-gold/10 text-gold', 'non_compliant': 'bg-danger/10 text-danger', pending: 'bg-warning/10 text-warning' }
const compStatusLabels: Record<string, string> = { compliant: 'ممتثل', 'in_progress': 'قيد التنفيذ', 'non_compliant': 'غير ممتثل', pending: 'معلق' }

const demoContracts: Contract[] = [
  { id: 1, title: 'عقد رعاية بلاتينية — بنك الأهلي', party: 'بنك الأهلي السعودي', type: 'sponsorship', status: 'active', value: 800000, startDate: '2026-01-01', endDate: '2026-12-31', notes: 'رعاية حصرية للقطاع المصرفي', signedBy: 'نور كرم' },
  { id: 2, title: 'عقد تأجير أجنحة — المراعي', party: 'مجموعة المراعي', type: 'rental', status: 'active', value: 320000, startDate: '2026-03-01', endDate: '2026-06-30', notes: '4 أجنحة في المعرض الرئيسي', signedBy: 'نور كرم' },
  { id: 3, title: 'عقد خدمات لوجستية — DHL', party: 'DHL السعودية', type: 'service', status: 'pending', value: 180000, startDate: '2026-04-01', endDate: '2026-05-31', notes: 'خدمات نقل وتخزين', signedBy: '' },
  { id: 4, title: 'عقد شراكة استراتيجية — STC', party: 'شركة الاتصالات STC', type: 'partnership', status: 'draft', value: 500000, startDate: '2026-04-15', endDate: '2027-04-14', notes: 'شراكة رقمية شاملة', signedBy: '' },
  { id: 5, title: 'عقد خدمات أمنية — فالكون', party: 'شركة فالكون للحراسات', type: 'service', status: 'active', value: 120000, startDate: '2026-02-01', endDate: '2026-07-31', notes: 'تأمين المعارض والفعاليات', signedBy: 'نور كرم' },
  { id: 6, title: 'عقد توريد — شركة الكهرباء', party: 'الشركة السعودية للكهرباء', type: 'vendor', status: 'active', value: 95000, startDate: '2026-01-15', endDate: '2026-12-31', notes: 'توريد وتركيب أنظمة كهربائية', signedBy: 'نور كرم' },
  { id: 7, title: 'عقد رعاية ذهبية — أرامكو', party: 'شركة أرامكو', type: 'sponsorship', status: 'expired', value: 1200000, startDate: '2025-01-01', endDate: '2025-12-31', notes: 'انتهت الصلاحية — قيد التجديد', signedBy: 'نور كرم' },
]

const demoCompliance: ComplianceItem[] = [
  { id: 1, title: 'تجديد السجل التجاري', category: 'تراخيص', status: 'compliant', dueDate: '2027-03-15', assignee: 'ماجد القحطاني', priority: 'high' },
  { id: 2, title: 'شهادة ZATCA — الفوترة الإلكترونية', category: 'ضريبي', status: 'compliant', dueDate: '2026-12-31', assignee: 'نورة السبيعي', priority: 'high' },
  { id: 3, title: 'تجديد رخصة الدفاع المدني', category: 'تراخيص', status: 'in_progress', dueDate: '2026-05-01', assignee: 'خالد الحربي', priority: 'high' },
  { id: 4, title: 'تحديث سياسة الخصوصية PDPL', category: 'حماية بيانات', status: 'in_progress', dueDate: '2026-06-30', assignee: 'ماجد القحطاني', priority: 'medium' },
  { id: 5, title: 'تدقيق ISO 27001', category: 'أمن معلومات', status: 'pending', dueDate: '2026-09-01', assignee: 'عمر الزهراني', priority: 'medium' },
  { id: 6, title: 'تجديد تأمين المسؤولية', category: 'تأمين', status: 'compliant', dueDate: '2027-01-15', assignee: 'ماجد القحطاني', priority: 'low' },
  { id: 7, title: 'امتثال NCA — الأمن السيبراني', category: 'أمن سيبراني', status: 'non_compliant', dueDate: '2026-04-30', assignee: 'عمر الزهراني', priority: 'high' },
]

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState('contracts')
  const [contracts, setContracts] = useState(demoContracts)
  const [compliance] = useState(demoCompliance)
  const [search, setSearch] = useState('')
  const [detailContract, setDetailContract] = useState<Contract | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newContract, setNewContract] = useState({ title: '', party: '', type: 'service', value: '', startDate: '', endDate: '', notes: '' })

  const stats = useMemo(() => ({
    totalContracts: contracts.length,
    activeContracts: contracts.filter(c => c.status === 'active').length,
    totalValue: contracts.filter(c => c.status === 'active').reduce((s, c) => s + c.value, 0),
    complianceRate: Math.round((compliance.filter(c => c.status === 'compliant').length / compliance.length) * 100),
    nonCompliant: compliance.filter(c => c.status === 'non_compliant').length,
  }), [contracts, compliance])

  const filteredContracts = useMemo(() => {
    if (!search) return contracts
    const s = search.toLowerCase()
    return contracts.filter(c => c.title.includes(s) || c.party.includes(s))
  }, [contracts, search])

  const handleAdd = () => {
    if (!newContract.title || !newContract.party) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    const c: Contract = {
      id: Math.max(...contracts.map(c => c.id)) + 1, title: newContract.title, party: newContract.party,
      type: newContract.type, status: 'draft', value: parseFloat(newContract.value) || 0,
      startDate: newContract.startDate || '2026-04-01', endDate: newContract.endDate || '2026-12-31',
      notes: newContract.notes, signedBy: '',
    }
    setContracts(prev => [c, ...prev])
    toast.success(`تم إنشاء العقد: ${c.title}`)
    setShowAddModal(false)
    setNewContract({ title: '', party: '', type: 'service', value: '', startDate: '', endDate: '', notes: '' })
  }

  const handleDelete = (id: number) => {
    const c = contracts.find(c => c.id === id)
    setContracts(prev => prev.filter(c => c.id !== id))
    toast.success(`تم حذف العقد: ${c?.title}`)
    setDeleteConfirm(null)
  }

  return (
    <AdminLayout>
      <PageHeader
        title="القانونية والامتثال"
        subtitle={`${stats.totalContracts} عقد — ${stats.activeContracts} ساري — الامتثال: ${stats.complianceRate}%`}
        actions={
          <button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} /> عقد جديد
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="العقود الفعالة" value={String(stats.activeContracts)} icon={FileText} delay={0} />
        <StatsCard title="قيمة العقود" value={formatCurrency(stats.totalValue)} icon={Scale} delay={0.05} />
        <StatsCard title="نسبة الامتثال" value={`${stats.complianceRate}%`} icon={Shield} trend={5} trendLabel="تحسن" delay={0.1} />
        <StatsCard title="غير ممتثل" value={String(stats.nonCompliant)} icon={AlertTriangle} delay={0.15} />
      </div>

      {/* تبويبات */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
        {[{ key: 'contracts', label: 'العقود', icon: FileText }, { key: 'compliance', label: 'الامتثال', icon: Shield }, { key: 'licenses', label: 'التراخيص', icon: BookOpen }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', activeTab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* العقود */}
      {activeTab === 'contracts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <div className="relative w-64">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في العقود..."
                className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead><tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">العقد</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الطرف</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">النوع</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الحالة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">القيمة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الانتهاء</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">إجراءات</th>
              </tr></thead>
              <tbody>
                {filteredContracts.map((c, idx) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3"><p className="text-sm font-medium text-foreground line-clamp-1">{c.title}</p></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.party}</td>
                    <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-surface2 text-foreground">{typeLabels[c.type]}</span></td>
                    <td className="px-3 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', statusColors[c.status])}>{statusLabels[c.status]}</span></td>
                    <td className="px-3 py-3"><span className="font-mono text-sm text-foreground">{formatCurrency(c.value)}</span></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.endDate}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button onClick={() => setDetailContract(c)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                        <button onClick={() => toast.info('تحميل العقد — قريباً')} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Download size={14} /></button>
                        <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* الامتثال */}
      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {compliance.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={cn('glass-card p-3 sm:p-4 lg:p-5', item.status === 'non_compliant' ? 'border-danger/30' : '')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.status === 'compliant' ? 'bg-success/10' : item.status === 'non_compliant' ? 'bg-danger/10' : 'bg-gold/10')}>
                    {item.status === 'compliant' ? <CheckCircle size={18} className="text-success" /> : item.status === 'non_compliant' ? <AlertTriangle size={18} className="text-danger" /> : <Clock size={18} className="text-gold" />}
                  </div>
                  <div><h3 className="text-sm font-bold text-foreground">{item.title}</h3><p className="text-[10px] text-muted-foreground">{item.category}</p></div>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', compStatusColors[item.status])}>{compStatusLabels[item.status]}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={10} />الموعد: {item.dueDate}</span>
                <span>{item.assignee}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* التراخيص */}
      {activeTab === 'licenses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'السجل التجاري', number: '1010XXXXXX', expiry: '2027-03-15', status: 'active', issuer: 'وزارة التجارة' },
            { name: 'رخصة الدفاع المدني', number: 'DC-2026-XXX', expiry: '2026-05-01', status: 'expiring', issuer: 'الدفاع المدني' },
            { name: 'شهادة الزكاة والدخل', number: 'ZATCA-XXXX', expiry: '2026-12-31', status: 'active', issuer: 'هيئة الزكاة والضريبة' },
            { name: 'رخصة البلدية', number: 'MUN-2026-XX', expiry: '2026-08-15', status: 'active', issuer: 'أمانة الرياض' },
            { name: 'شهادة ISO 9001', number: 'ISO-9001-XX', expiry: '2027-06-30', status: 'active', issuer: 'SGS' },
            { name: 'رخصة الاتصالات', number: 'CITC-XXXX', expiry: '2026-11-30', status: 'active', issuer: 'هيئة الاتصالات' },
          ].map((lic, i) => (
            <motion.div key={lic.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={cn('glass-card p-3 sm:p-4 lg:p-5', lic.status === 'expiring' ? 'border-warning/30' : '')}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', lic.status === 'active' ? 'bg-success/10' : 'bg-warning/10')}>
                  <BookOpen size={18} className={lic.status === 'active' ? 'text-success' : 'text-warning'} />
                </div>
                <div><h3 className="text-sm font-bold text-foreground">{lic.name}</h3><p className="text-[10px] text-muted-foreground">{lic.issuer}</p></div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>الرقم:</span><span className="font-mono text-foreground">{lic.number}</span></div>
                <div className="flex justify-between"><span>الانتهاء:</span><span className={lic.status === 'expiring' ? 'text-warning font-medium' : 'text-foreground'}>{lic.expiry}</span></div>
                <div className="flex justify-between"><span>الحالة:</span><span className={cn('px-2 py-0.5 rounded-full', lic.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>{lic.status === 'active' ? 'ساري' : 'قارب الانتهاء'}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* نافذة تفاصيل العقد */}
      <AnimatePresence>
        {detailContract && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailContract(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div><h2 className="text-base font-bold text-foreground">{detailContract.title}</h2><p className="text-xs text-muted-foreground">{detailContract.party}</p></div>
                <button onClick={() => setDetailContract(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 sm:mb-4">
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/20"><p className="text-[10px] text-muted-foreground">القيمة</p><p className="text-lg font-bold font-mono text-gold">{formatCurrency(detailContract.value)}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">النوع</p><p className="text-sm text-foreground">{typeLabels[detailContract.type]}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">البداية</p><p className="text-sm text-foreground">{detailContract.startDate}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">النهاية</p><p className="text-sm text-foreground">{detailContract.endDate}</p></div>
              </div>
              {detailContract.notes && <div className="p-3 rounded-xl bg-surface2/50 border border-border/30 mb-3"><p className="text-[10px] text-muted-foreground mb-1">ملاحظات</p><p className="text-sm text-foreground">{detailContract.notes}</p></div>}
              <div className="flex items-center justify-between">
                <span className={cn('text-xs px-2.5 py-1 rounded-full', statusColors[detailContract.status])}>{statusLabels[detailContract.status]}</span>
                {detailContract.signedBy && <span className="text-xs text-muted-foreground">موقع من: <span className="text-foreground">{detailContract.signedBy}</span></span>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة عقد جديد */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Scale size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">عقد جديد</h3><p className="text-xs text-muted-foreground">إنشاء عقد قانوني</p></div>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">عنوان العقد <span className="text-danger">*</span></label><input type="text" value={newContract.title} onChange={(e) => setNewContract(p => ({ ...p, title: e.target.value }))} placeholder="عنوان العقد" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الطرف الآخر <span className="text-danger">*</span></label><input type="text" value={newContract.party} onChange={(e) => setNewContract(p => ({ ...p, party: e.target.value }))} placeholder="اسم الشركة/الجهة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">النوع</label><select value={newContract.type} onChange={(e) => setNewContract(p => ({ ...p, type: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50">{Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القيمة (ر.س)</label><input type="number" value={newContract.value} onChange={(e) => setNewContract(p => ({ ...p, value: e.target.value }))} placeholder="0" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">تاريخ البدء</label><input type="date" value={newContract.startDate} onChange={(e) => setNewContract(p => ({ ...p, startDate: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">تاريخ الانتهاء</label><input type="date" value={newContract.endDate} onChange={(e) => setNewContract(p => ({ ...p, endDate: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">ملاحظات</label><textarea value={newContract.notes} onChange={(e) => setNewContract(p => ({ ...p, notes: e.target.value }))} placeholder="ملاحظات..." rows={2} className="w-full p-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" /></div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إنشاء العقد</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-4 sm:p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف العقد</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{contracts.find(c => c.id === deleteConfirm)?.title}</span>؟</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
