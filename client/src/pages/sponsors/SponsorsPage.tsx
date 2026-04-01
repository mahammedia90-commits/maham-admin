/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — إدارة الرعاة (Sponsors Management)
 * Features: رعاة، باقات، عقود رعاية، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, Plus, Eye, Trash2, AlertTriangle, Search,
  Star, Crown, Diamond, Medal, DollarSign, TrendingUp,
  X, Building2, Calendar, CheckCircle, Globe
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface Sponsor {
  id: number; name: string; tier: string; value: number; status: string
  contact: string; email: string; industry: string; logo: string
  startDate: string; endDate: string; benefits: string[]
}

const tierIcons: Record<string, typeof Star> = { platinum: Crown, gold: Star, silver: Medal, bronze: Award }
const tierColors: Record<string, string> = { platinum: 'bg-chrome/10 text-chrome border-chrome/20', gold: 'bg-gold/10 text-gold border-gold/20', silver: 'bg-info/10 text-info border-info/20', bronze: 'bg-warning/10 text-warning border-warning/20' }
const tierLabels: Record<string, string> = { platinum: 'بلاتيني', gold: 'ذهبي', silver: 'فضي', bronze: 'برونزي' }
const statusLabels: Record<string, string> = { active: 'نشط', pending: 'قيد التفاوض', expired: 'منتهي' }
const statusColors: Record<string, string> = { active: 'bg-success/10 text-success', pending: 'bg-warning/10 text-warning', expired: 'bg-danger/10 text-danger' }

const demoSponsors: Sponsor[] = [
  { id: 1, name: 'شركة أرامكو السعودية', tier: 'platinum', value: 1200000, status: 'active', contact: 'محمد الدوسري', email: 'sponsor@aramco.com', industry: 'طاقة', logo: 'أ', startDate: '2026-01-01', endDate: '2026-12-31', benefits: ['شعار رئيسي', 'جناح VIP', 'كلمة افتتاحية', 'تغطية إعلامية حصرية'] },
  { id: 2, name: 'بنك الأهلي السعودي', tier: 'platinum', value: 800000, status: 'active', contact: 'فهد العتيبي', email: 'sponsor@alahli.com', industry: 'مصرفي', logo: 'ب', startDate: '2026-01-01', endDate: '2026-12-31', benefits: ['شعار رئيسي', 'جناح مميز', 'ورشة عمل', 'تغطية إعلامية'] },
  { id: 3, name: 'شركة الاتصالات STC', tier: 'gold', value: 500000, status: 'pending', contact: 'سلطان الشهري', email: 'sponsor@stc.sa', industry: 'اتصالات', logo: 'S', startDate: '2026-04-15', endDate: '2027-04-14', benefits: ['شعار ذهبي', 'جناح', 'شبكة WiFi حصرية'] },
  { id: 4, name: 'شركة سابك', tier: 'gold', value: 450000, status: 'active', contact: 'عبدالله الحربي', email: 'sponsor@sabic.com', industry: 'صناعة', logo: 'س', startDate: '2026-02-01', endDate: '2026-08-31', benefits: ['شعار ذهبي', 'جناح', 'عرض تقديمي'] },
  { id: 5, name: 'مجموعة المراعي', tier: 'silver', value: 250000, status: 'active', contact: 'خالد المالكي', email: 'sponsor@almarai.com', industry: 'أغذية', logo: 'م', startDate: '2026-03-01', endDate: '2026-06-30', benefits: ['شعار فضي', 'جناح صغير', 'توزيع منتجات'] },
  { id: 6, name: 'شركة نسما القابضة', tier: 'silver', value: 200000, status: 'active', contact: 'طارق النمر', email: 'sponsor@nesma.com', industry: 'إنشاءات', logo: 'ن', startDate: '2026-01-15', endDate: '2026-07-15', benefits: ['شعار فضي', 'مساحة عرض'] },
  { id: 7, name: 'شركة DHL السعودية', tier: 'bronze', value: 120000, status: 'active', contact: 'أحمد الفهد', email: 'sponsor@dhl.sa', industry: 'لوجستيات', logo: 'D', startDate: '2026-04-01', endDate: '2026-05-31', benefits: ['شعار برونزي', 'خدمات لوجستية'] },
  { id: 8, name: 'بنك الراجحي', tier: 'gold', value: 600000, status: 'pending', contact: 'ماجد الراجحي', email: 'sponsor@rajhi.com', industry: 'مصرفي', logo: 'ر', startDate: '2026-05-01', endDate: '2027-04-30', benefits: ['شعار ذهبي', 'جناح VIP', 'ورشة عمل'] },
]

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState(demoSponsors)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [detailSponsor, setDetailSponsor] = useState<Sponsor | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newSponsor, setNewSponsor] = useState({ name: '', tier: 'gold', value: '', contact: '', email: '', industry: '' })

  const stats = useMemo(() => ({
    total: sponsors.length,
    active: sponsors.filter(s => s.status === 'active').length,
    totalValue: sponsors.filter(s => s.status === 'active').reduce((s, sp) => s + sp.value, 0),
    pending: sponsors.filter(s => s.status === 'pending').length,
  }), [sponsors])

  const filtered = useMemo(() => {
    let result = [...sponsors]
    if (tierFilter !== 'all') result = result.filter(s => s.tier === tierFilter)
    if (search) { const s = search.toLowerCase(); result = result.filter(sp => sp.name.includes(s) || sp.industry.includes(s)) }
    return result
  }, [sponsors, tierFilter, search])

  const handleAdd = () => {
    if (!newSponsor.name) { toast.error('يرجى إدخال اسم الراعي'); return }
    const s: Sponsor = {
      id: Math.max(...sponsors.map(s => s.id)) + 1, name: newSponsor.name, tier: newSponsor.tier,
      value: parseFloat(newSponsor.value) || 0, status: 'pending', contact: newSponsor.contact,
      email: newSponsor.email, industry: newSponsor.industry, logo: newSponsor.name.charAt(0),
      startDate: new Date().toISOString().split('T')[0], endDate: '2027-12-31', benefits: [],
    }
    setSponsors(prev => [s, ...prev])
    toast.success(`تمت إضافة الراعي: ${s.name}`)
    setShowAddModal(false)
    setNewSponsor({ name: '', tier: 'gold', value: '', contact: '', email: '', industry: '' })
  }

  const handleDelete = (id: number) => {
    const s = sponsors.find(s => s.id === id)
    setSponsors(prev => prev.filter(s => s.id !== id))
    toast.success(`تم حذف الراعي: ${s?.name}`)
    setDeleteConfirm(null)
  }

  return (
    <AdminLayout>
      <PageHeader title="إدارة الرعاة" subtitle={`${stats.total} راعٍ — ${stats.active} نشط — القيمة: ${formatCurrency(stats.totalValue)}`}
        actions={<button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> راعٍ جديد</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatsCard title="الرعاة النشطون" value={String(stats.active)} icon={Award} delay={0} />
        <StatsCard title="قيمة الرعايات" value={formatCurrency(stats.totalValue)} icon={DollarSign} delay={0.05} />
        <StatsCard title="قيد التفاوض" value={String(stats.pending)} icon={TrendingUp} delay={0.1} />
        <StatsCard title="البلاتيني" value={String(sponsors.filter(s => s.tier === 'platinum').length)} icon={Crown} delay={0.15} />
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="relative w-64"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في الرعاة..." className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
        <div className="flex items-center gap-1.5">
          {[{ key: 'all', label: 'الكل' }, { key: 'platinum', label: 'بلاتيني' }, { key: 'gold', label: 'ذهبي' }, { key: 'silver', label: 'فضي' }, { key: 'bronze', label: 'برونزي' }].map(t => (
            <button key={t.key} onClick={() => setTierFilter(t.key)} className={cn('h-7 px-2.5 rounded-lg text-[11px] font-medium transition-all', tierFilter === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((sponsor, i) => {
          const TIcon = tierIcons[sponsor.tier] || Award
          return (
            <motion.div key={sponsor.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={cn('glass-card p-5 hover:border-gold/20 transition-all', sponsor.tier === 'platinum' ? 'border-chrome/20' : '')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border', tierColors[sponsor.tier])}>{sponsor.logo}</div>
                  <div><h3 className="text-sm font-bold text-foreground">{sponsor.name}</h3><p className="text-[10px] text-muted-foreground">{sponsor.industry} — {sponsor.contact}</p></div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1', tierColors[sponsor.tier])}><TIcon size={10} />{tierLabels[sponsor.tier]}</span>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full', statusColors[sponsor.status])}>{statusLabels[sponsor.status]}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded-lg bg-gold/5 border border-gold/15 text-center"><p className="text-[8px] text-muted-foreground">قيمة الرعاية</p><p className="text-xs font-bold font-mono text-gold">{formatCurrency(sponsor.value)}</p></div>
                <div className="p-2 rounded-lg bg-surface2/50 text-center"><p className="text-[8px] text-muted-foreground">الفترة</p><p className="text-[10px] text-foreground">{sponsor.startDate} → {sponsor.endDate}</p></div>
              </div>
              {sponsor.benefits.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mb-3">
                  {sponsor.benefits.slice(0, 3).map(b => (
                    <span key={b} className="text-[9px] px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground">{b}</span>
                  ))}
                  {sponsor.benefits.length > 3 && <span className="text-[9px] text-muted-foreground">+{sponsor.benefits.length - 3}</span>}
                </div>
              )}
              <div className="flex items-center justify-end gap-0.5">
                <button onClick={() => setDetailSponsor(sponsor)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                <button onClick={() => setDeleteConfirm(sponsor.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* نافذة التفاصيل */}
      <AnimatePresence>
        {detailSponsor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailSponsor(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl border', tierColors[detailSponsor.tier])}>{detailSponsor.logo}</div>
                  <div><h2 className="text-base font-bold text-foreground">{detailSponsor.name}</h2><p className="text-xs text-muted-foreground">{detailSponsor.industry} — {tierLabels[detailSponsor.tier]}</p></div>
                </div>
                <button onClick={() => setDetailSponsor(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/20"><p className="text-[10px] text-muted-foreground">قيمة الرعاية</p><p className="text-lg font-bold font-mono text-gold">{formatCurrency(detailSponsor.value)}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">جهة الاتصال</p><p className="text-xs text-foreground">{detailSponsor.contact}</p><p className="text-[10px] text-muted-foreground">{detailSponsor.email}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">البداية</p><p className="text-xs text-foreground">{detailSponsor.startDate}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">النهاية</p><p className="text-xs text-foreground">{detailSponsor.endDate}</p></div>
              </div>
              {detailSponsor.benefits.length > 0 && (
                <div><h4 className="text-xs font-bold text-foreground mb-2">المزايا</h4><div className="space-y-1.5">{detailSponsor.benefits.map(b => (<div key={b} className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle size={12} className="text-success" />{b}</div>))}</div></div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة إضافة */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Award size={18} className="text-gold" /></div><div><h3 className="text-base font-bold text-foreground">راعٍ جديد</h3><p className="text-xs text-muted-foreground">إضافة راعٍ للمعرض</p></div></div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم الراعي <span className="text-danger">*</span></label><input type="text" value={newSponsor.name} onChange={(e) => setNewSponsor(p => ({ ...p, name: e.target.value }))} placeholder="اسم الشركة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الباقة</label><select value={newSponsor.tier} onChange={(e) => setNewSponsor(p => ({ ...p, tier: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option value="platinum">بلاتيني</option><option value="gold">ذهبي</option><option value="silver">فضي</option><option value="bronze">برونزي</option></select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القيمة (ر.س)</label><input type="number" value={newSponsor.value} onChange={(e) => setNewSponsor(p => ({ ...p, value: e.target.value }))} placeholder="0" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">جهة الاتصال</label><input type="text" value={newSponsor.contact} onChange={(e) => setNewSponsor(p => ({ ...p, contact: e.target.value }))} placeholder="الاسم" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القطاع</label><input type="text" value={newSponsor.industry} onChange={(e) => setNewSponsor(p => ({ ...p, industry: e.target.value }))} placeholder="القطاع" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إضافة الراعي</button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف الراعي</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{sponsors.find(s => s.id === deleteConfirm)?.name}</span>؟</p>
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
