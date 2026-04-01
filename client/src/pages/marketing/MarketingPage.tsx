/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — التسويق والعلاقات العامة (Marketing & PR)
 * Design: Dark/Light glassmorphism, Gold accents, RTL-first
 * Features: حملات تسويقية، أداء، محتوى، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Megaphone, BarChart3, Eye, TrendingUp, Globe, Mail, Share2,
  Plus, Target, Zap, MousePointer, Users, ArrowUpRight,
  Instagram, Play, Pause, Edit, Trash2, X, AlertTriangle,
  Calendar, DollarSign, ExternalLink
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatNumber, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface Campaign {
  id: number; name: string; channel: string; status: string; budget: number; spent: number
  roi: string; impressions: string; clicks: string; conversions: number; startDate: string; endDate: string
}

const performanceData = [
  { week: 'الأسبوع 1', impressions: 45000, clicks: 3200, conversions: 180 },
  { week: 'الأسبوع 2', impressions: 52000, clicks: 4100, conversions: 220 },
  { week: 'الأسبوع 3', impressions: 68000, clicks: 5500, conversions: 310 },
  { week: 'الأسبوع 4', impressions: 75000, clicks: 6200, conversions: 380 },
]

const channelData = [
  { channel: 'Google Ads', spend: 32400, leads: 245, cpl: 132 },
  { channel: 'Instagram', spend: 18000, leads: 180, cpl: 100 },
  { channel: 'Email', spend: 3200, leads: 95, cpl: 34 },
  { channel: 'LinkedIn', spend: 12000, leads: 65, cpl: 185 },
  { channel: 'Twitter/X', spend: 8500, leads: 42, cpl: 202 },
]

const demoCampaigns: Campaign[] = [
  { id: 1, name: 'حملة معرض الرياض 2026', channel: 'Google Ads', status: 'active', budget: 50000, spent: 32400, roi: '+245%', impressions: '1.2M', clicks: '45K', conversions: 380, startDate: '2026-02-01', endDate: '2026-04-30' },
  { id: 2, name: 'حملة البريد — دعوات VIP', channel: 'Email', status: 'active', budget: 5000, spent: 3200, roi: '+180%', impressions: '25K', clicks: '8.5K', conversions: 95, startDate: '2026-03-01', endDate: '2026-03-31' },
  { id: 3, name: 'حملة السوشال ميديا', channel: 'Instagram', status: 'paused', budget: 30000, spent: 18000, roi: '+120%', impressions: '850K', clicks: '32K', conversions: 180, startDate: '2026-01-15', endDate: '2026-04-15' },
  { id: 4, name: 'حملة إعادة الاستهداف', channel: 'Facebook', status: 'draft', budget: 20000, spent: 0, roi: '—', impressions: '0', clicks: '0', conversions: 0, startDate: '2026-04-01', endDate: '2026-05-31' },
  { id: 5, name: 'حملة LinkedIn — B2B', channel: 'LinkedIn', status: 'active', budget: 15000, spent: 12000, roi: '+95%', impressions: '320K', clicks: '12K', conversions: 65, startDate: '2026-02-15', endDate: '2026-04-30' },
  { id: 6, name: 'حملة Twitter — الوعي', channel: 'Twitter/X', status: 'completed', budget: 10000, spent: 8500, roi: '+78%', impressions: '450K', clicks: '18K', conversions: 42, startDate: '2026-01-01', endDate: '2026-02-28' },
]

const channelIcons: Record<string, typeof Globe> = {
  'Google Ads': Globe, 'Email': Mail, 'Instagram': Instagram, 'Facebook': Share2, 'LinkedIn': ExternalLink, 'Twitter/X': Zap,
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState(demoCampaigns)
  const [showAddModal, setShowAddModal] = useState(false)
  const [detailCampaign, setDetailCampaign] = useState<Campaign | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newCamp, setNewCamp] = useState({ name: '', channel: 'Google Ads', budget: '', startDate: '', endDate: '' })

  const stats = useMemo(() => ({
    totalBudget: campaigns.reduce((s, c) => s + c.budget, 0),
    totalSpent: campaigns.reduce((s, c) => s + c.spent, 0),
    totalConversions: campaigns.reduce((s, c) => s + c.conversions, 0),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
  }), [campaigns])

  const handleAdd = () => {
    if (!newCamp.name || !newCamp.budget) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    const c: Campaign = {
      id: Math.max(...campaigns.map(c => c.id)) + 1, name: newCamp.name, channel: newCamp.channel,
      status: 'draft', budget: parseFloat(newCamp.budget), spent: 0, roi: '—', impressions: '0', clicks: '0',
      conversions: 0, startDate: newCamp.startDate || '2026-04-01', endDate: newCamp.endDate || '2026-05-31',
    }
    setCampaigns(prev => [c, ...prev])
    toast.success(`تم إنشاء الحملة: ${c.name}`)
    setShowAddModal(false)
    setNewCamp({ name: '', channel: 'Google Ads', budget: '', startDate: '', endDate: '' })
  }

  const toggleCampaignStatus = (id: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c
      const newStatus = c.status === 'active' ? 'paused' : 'active'
      toast.info(`تم ${newStatus === 'active' ? 'تفعيل' : 'إيقاف'} الحملة: ${c.name}`)
      return { ...c, status: newStatus }
    }))
  }

  const handleDelete = (id: number) => {
    const c = campaigns.find(c => c.id === id)
    setCampaigns(prev => prev.filter(c => c.id !== id))
    toast.success(`تم حذف الحملة: ${c?.name}`)
    setDeleteConfirm(null)
  }

  return (
    <AdminLayout>
      <PageHeader
        title="التسويق والعلاقات العامة"
        subtitle={`${campaigns.length} حملة — ${stats.activeCampaigns} نشطة — إجمالي الإنفاق: ${formatCurrency(stats.totalSpent)}`}
        actions={
          <button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} /> حملة جديدة
          </button>
        }
      />

      {/* إحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatsCard title="إجمالي الميزانية" value={formatCurrency(stats.totalBudget)} icon={DollarSign} delay={0} />
        <StatsCard title="الإنفاق الفعلي" value={formatCurrency(stats.totalSpent)} icon={TrendingUp} trend={12} trendLabel="هذا الشهر" delay={0.05} />
        <StatsCard title="التحويلات" value={formatNumber(stats.totalConversions)} icon={Target} trend={28} trendLabel="هذا الشهر" delay={0.1} />
        <StatsCard title="الحملات النشطة" value={String(stats.activeCampaigns)} icon={Megaphone} delay={0.15} />
      </div>

      {/* تبويبات */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { key: 'campaigns', label: 'الحملات', icon: Megaphone },
          { key: 'performance', label: 'الأداء', icon: BarChart3 },
          { key: 'channels', label: 'القنوات', icon: Share2 },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', activeTab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* الحملات */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {campaigns.map((camp, i) => {
            const CIcon = channelIcons[camp.channel] || Globe
            const spentPct = camp.budget > 0 ? Math.round((camp.spent / camp.budget) * 100) : 0
            return (
              <motion.div key={camp.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="glass-card p-5 hover:border-gold/20 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><CIcon size={18} className="text-gold" /></div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{camp.name}</h3>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1"><CIcon size={9} />{camp.channel}</p>
                    </div>
                  </div>
                  <StatusBadge status={camp.status} />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div><p className="text-[10px] text-muted-foreground">الظهور</p><p className="text-sm font-bold font-mono text-foreground">{camp.impressions}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">النقرات</p><p className="text-sm font-bold font-mono text-foreground">{camp.clicks}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">ROI</p><p className={cn('text-sm font-bold font-mono', camp.roi.startsWith('+') ? 'text-success' : 'text-muted-foreground')}>{camp.roi}</p></div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>الإنفاق: {formatCurrency(camp.spent)}</span>
                    <span>الميزانية: {formatCurrency(camp.budget)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface3">
                    <div className={cn('h-full rounded-full transition-all', spentPct > 90 ? 'bg-danger' : spentPct > 70 ? 'bg-warning' : 'bg-gold')} style={{ width: `${Math.min(spentPct, 100)}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="text-[10px] text-muted-foreground">{camp.conversions} تحويل</span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setDetailCampaign(camp)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={13} /></button>
                    {(camp.status === 'active' || camp.status === 'paused') && (
                      <button onClick={() => toggleCampaignStatus(camp.id)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors">
                        {camp.status === 'active' ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    )}
                    <button onClick={() => setDeleteConfirm(camp.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* الأداء */}
      {activeTab === 'performance' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">أداء الحملات — آخر 4 أسابيع</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient>
                <linearGradient id="clkGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="impressions" stroke="#C9A84C" fill="url(#impGrad)" strokeWidth={2} name="الظهور" />
              <Area type="monotone" dataKey="clicks" stroke="#3B82F6" fill="url(#clkGrad)" strokeWidth={2} name="النقرات" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* القنوات */}
      {activeTab === 'channels' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50"><h3 className="text-sm font-bold text-foreground">أداء القنوات التسويقية</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">القناة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الإنفاق</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">العملاء المحتملون</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">تكلفة العميل</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الكفاءة</th>
              </tr></thead>
              <tbody>
                {channelData.map((ch, idx) => {
                  const CIcon = channelIcons[ch.channel] || Globe
                  const efficiency = ch.cpl < 100 ? 'ممتاز' : ch.cpl < 150 ? 'جيد' : 'متوسط'
                  return (
                    <motion.tr key={ch.channel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                      <td className="px-4 py-3"><span className="flex items-center gap-2 text-sm text-foreground"><CIcon size={14} className="text-gold" />{ch.channel}</span></td>
                      <td className="px-3 py-3"><span className="font-mono text-sm text-foreground">{formatCurrency(ch.spend)}</span></td>
                      <td className="px-3 py-3"><span className="font-mono text-sm font-bold text-foreground">{ch.leads}</span></td>
                      <td className="px-3 py-3"><span className="font-mono text-sm text-muted-foreground">{formatCurrency(ch.cpl)}</span></td>
                      <td className="px-3 py-3 text-center">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', efficiency === 'ممتاز' ? 'bg-success/10 text-success' : efficiency === 'جيد' ? 'bg-gold/10 text-gold' : 'bg-warning/10 text-warning')}>{efficiency}</span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* نافذة تفاصيل الحملة */}
      <AnimatePresence>
        {detailCampaign && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailCampaign(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div><h2 className="text-lg font-bold text-foreground">{detailCampaign.name}</h2><p className="text-xs text-muted-foreground">{detailCampaign.channel}</p></div>
                <button onClick={() => setDetailCampaign(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الميزانية</p><p className="text-sm font-bold font-mono text-foreground">{formatCurrency(detailCampaign.budget)}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الإنفاق</p><p className="text-sm font-bold font-mono text-foreground">{formatCurrency(detailCampaign.spent)}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الظهور</p><p className="text-sm font-bold font-mono text-foreground">{detailCampaign.impressions}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">النقرات</p><p className="text-sm font-bold font-mono text-foreground">{detailCampaign.clicks}</p></div>
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/20"><p className="text-[10px] text-muted-foreground">ROI</p><p className={cn('text-lg font-bold font-mono', detailCampaign.roi.startsWith('+') ? 'text-success' : 'text-muted-foreground')}>{detailCampaign.roi}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">التحويلات</p><p className="text-sm font-bold font-mono text-foreground">{detailCampaign.conversions}</p></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface2/50 border border-border/30 mb-3">
                <span className="text-xs text-muted-foreground">الفترة: {detailCampaign.startDate} — {detailCampaign.endDate}</span>
                <StatusBadge status={detailCampaign.status} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة حملة جديدة */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Megaphone size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">حملة تسويقية جديدة</h3><p className="text-xs text-muted-foreground">إنشاء حملة تسويقية جديدة</p></div>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم الحملة <span className="text-danger">*</span></label><input type="text" value={newCamp.name} onChange={(e) => setNewCamp(p => ({ ...p, name: e.target.value }))} placeholder="اسم الحملة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القناة</label><select value={newCamp.channel} onChange={(e) => setNewCamp(p => ({ ...p, channel: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option>Google Ads</option><option>Instagram</option><option>Facebook</option><option>Email</option><option>LinkedIn</option><option>Twitter/X</option></select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الميزانية (ر.س) <span className="text-danger">*</span></label><input type="number" value={newCamp.budget} onChange={(e) => setNewCamp(p => ({ ...p, budget: e.target.value }))} placeholder="0" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">تاريخ البدء</label><input type="date" value={newCamp.startDate} onChange={(e) => setNewCamp(p => ({ ...p, startDate: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">تاريخ الانتهاء</label><input type="date" value={newCamp.endDate} onChange={(e) => setNewCamp(p => ({ ...p, endDate: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إنشاء الحملة</button>
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
              <h3 className="text-base font-bold text-foreground mb-2">حذف الحملة</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{campaigns.find(c => c.id === deleteConfirm)?.name}</span>؟</p>
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
