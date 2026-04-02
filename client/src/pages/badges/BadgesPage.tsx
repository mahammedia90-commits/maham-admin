import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, Plus, Edit, Trash2, Eye, Users, Star, Shield,
  Crown, Gem, Medal, Trophy, Target, Zap, Search, X,
  ChevronDown, ChevronUp
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate } from '@/lib/utils'

interface Badge {
  id: number
  name: string
  name_en: string
  description: string
  icon: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  criteria: string
  holders_count: number
  auto_grant: boolean
  active: boolean
  created_at: string
}

const TIER_CONFIG = {
  bronze: { label: 'برونزي', color: 'text-[#cd7f32]', bg: 'bg-[#cd7f32]/10 border-[#cd7f32]/20' },
  silver: { label: 'فضي', color: 'text-[#c0c0c0]', bg: 'bg-[#c0c0c0]/10 border-[#c0c0c0]/20' },
  gold: { label: 'ذهبي', color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
  platinum: { label: 'بلاتيني', color: 'text-[#e5e4e2]', bg: 'bg-[#e5e4e2]/10 border-[#e5e4e2]/20' },
  diamond: { label: 'ماسي', color: 'text-[#b9f2ff]', bg: 'bg-[#b9f2ff]/10 border-[#b9f2ff]/20' },
}

const MOCK_BADGES: Badge[] = [
  { id: 1, name: 'مستثمر مميز', name_en: 'Premium Investor', description: 'يُمنح للمستثمرين الذين استثمروا أكثر من 500,000 ر.س', icon: 'crown', tier: 'gold', criteria: 'investment >= 500000', holders_count: 12, auto_grant: true, active: true, created_at: '2026-01-15' },
  { id: 2, name: 'تاجر العام', name_en: 'Merchant of the Year', description: 'أفضل تاجر أداءً خلال العام', icon: 'trophy', tier: 'diamond', criteria: 'manual_grant', holders_count: 3, auto_grant: false, active: true, created_at: '2026-01-10' },
  { id: 3, name: 'راعي ذهبي', name_en: 'Gold Sponsor', description: 'رعاة الحزمة الذهبية وما فوق', icon: 'gem', tier: 'gold', criteria: 'sponsorship_tier >= gold', holders_count: 8, auto_grant: true, active: true, created_at: '2026-01-05' },
  { id: 4, name: 'مشارك متميز', name_en: 'Outstanding Participant', description: 'شارك في 5 فعاليات أو أكثر', icon: 'medal', tier: 'silver', criteria: 'events_participated >= 5', holders_count: 25, auto_grant: true, active: true, created_at: '2025-12-20' },
  { id: 5, name: 'رائد أعمال', name_en: 'Entrepreneur', description: 'مستثمر في 3 قطاعات مختلفة أو أكثر', icon: 'target', tier: 'platinum', criteria: 'sectors_invested >= 3', holders_count: 6, auto_grant: true, active: true, created_at: '2025-12-15' },
  { id: 6, name: 'عضو مؤسس', name_en: 'Founding Member', description: 'من أوائل المسجلين في المنصة', icon: 'star', criteria: 'registration_order <= 100', tier: 'bronze', holders_count: 45, auto_grant: true, active: true, created_at: '2025-11-01' },
  { id: 7, name: 'مبتكر', name_en: 'Innovator', description: 'قدّم فكرة مبتكرة تم تبنيها', icon: 'zap', tier: 'platinum', criteria: 'manual_grant', holders_count: 2, auto_grant: false, active: false, created_at: '2025-10-15' },
]

export default function BadgesPage() {
  const [badges, setBadges] = useState(MOCK_BADGES)
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState<string>('')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = badges.filter(b => {
    if (search && !b.name.includes(search) && !b.name_en.toLowerCase().includes(search.toLowerCase())) return false
    if (filterTier && b.tier !== filterTier) return false
    return true
  })

  const totalHolders = badges.reduce((sum, b) => sum + b.holders_count, 0)

  const getBadgeIcon = (icon: string, size: number = 24) => {
    switch (icon) {
      case 'crown': return <Crown size={size} />
      case 'trophy': return <Trophy size={size} />
      case 'gem': return <Gem size={size} />
      case 'medal': return <Medal size={size} />
      case 'target': return <Target size={size} />
      case 'star': return <Star size={size} />
      case 'zap': return <Zap size={size} />
      default: return <Award size={size} />
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة الشارات"
        subtitle="نظام الشارات والتصنيفات للمستثمرين والتجار والرعاة"
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className="h-9 px-4 rounded-lg bg-gold/10 border border-gold/25 text-sm text-gold hover:bg-gold/20 transition-all flex items-center gap-2"
          >
            <Plus size={14} />
            شارة جديدة
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الشارات" value={badges.length} icon={Award} delay={0} />
        <StatsCard title="حاملو الشارات" value={totalHolders} icon={Users} delay={0.1} />
        <StatsCard title="شارات نشطة" value={badges.filter(b => b.active).length} icon={Shield} delay={0.2} />
        <StatsCard title="منح تلقائي" value={badges.filter(b => b.auto_grant).length} icon={Zap} delay={0.3} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث في الشارات..."
            className="w-full h-9 pr-9 pl-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-all"
          />
        </div>
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل المستويات</option>
          {Object.entries(TIER_CONFIG).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-0.5">
          <button onClick={() => setViewMode('grid')} className={cn('px-3 py-1.5 rounded-md text-xs transition-all', viewMode === 'grid' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>شبكة</button>
          <button onClick={() => setViewMode('list')} className={cn('px-3 py-1.5 rounded-md text-xs transition-all', viewMode === 'list' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>قائمة</button>
        </div>
      </div>

      {/* Badges Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((badge, idx) => {
              const tier = TIER_CONFIG[badge.tier]
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="glass-card p-5 group hover:border-gold/20 transition-all cursor-pointer"
                  onClick={() => setSelectedBadge(badge)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('w-14 h-14 rounded-2xl border flex items-center justify-center', tier.bg, tier.color)}>
                      {getBadgeIcon(badge.icon, 28)}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => { e.stopPropagation(); toast.info('تعديل الشارة — قريباً') }} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors">
                        <Edit size={13} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); toast.info('حذف الشارة — قريباً') }} className="p-1.5 rounded-md hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">{badge.name}</h3>
                  <p className="text-[10px] text-muted-foreground/60 font-mono mb-2">{badge.name_en}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{badge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', tier.bg, tier.color)}>
                      {tier.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users size={11} />
                      <span>{badge.holders_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                    {badge.auto_grant ? (
                      <span className="text-[10px] text-success flex items-center gap-1"><Zap size={10} /> تلقائي</span>
                    ) : (
                      <span className="text-[10px] text-warning flex items-center gap-1"><Shield size={10} /> يدوي</span>
                    )}
                    {!badge.active && (
                      <span className="text-[10px] text-danger">غير نشط</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الشارة</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">المستوى</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الحاملون</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">المنح</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الحالة</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-[100px]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(badge => {
                const tier = TIER_CONFIG[badge.tier]
                return (
                  <tr key={badge.id} className="border-b border-border/30 hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center', tier.bg, tier.color)}>
                          {getBadgeIcon(badge.icon, 16)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{badge.name}</p>
                          <p className="text-[10px] text-muted-foreground">{badge.name_en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border', tier.bg, tier.color)}>{tier.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{badge.holders_count}</td>
                    <td className="px-4 py-3 text-xs">{badge.auto_grant ? <span className="text-success">تلقائي</span> : <span className="text-warning">يدوي</span>}</td>
                    <td className="px-4 py-3"><StatusBadge status={badge.active ? 'active' : 'draft'} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedBadge(badge)} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Eye size={13} /></button>
                        <button onClick={() => toast.info('تعديل — قريباً')} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Edit size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedBadge(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">تفاصيل الشارة</h3>
                <button onClick={() => setSelectedBadge(null)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 text-center">
                <div className={cn('w-20 h-20 rounded-2xl border mx-auto mb-4 flex items-center justify-center', TIER_CONFIG[selectedBadge.tier].bg, TIER_CONFIG[selectedBadge.tier].color)}>
                  {getBadgeIcon(selectedBadge.icon, 36)}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">{selectedBadge.name}</h4>
                <p className="text-xs text-muted-foreground/60 font-mono mb-3">{selectedBadge.name_en}</p>
                <p className="text-sm text-muted-foreground mb-4">{selectedBadge.description}</p>
                <div className="grid grid-cols-2 gap-3 text-right">
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">المستوى</p><p className={cn('text-sm font-medium', TIER_CONFIG[selectedBadge.tier].color)}>{TIER_CONFIG[selectedBadge.tier].label}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الحاملون</p><p className="text-sm font-medium text-foreground">{selectedBadge.holders_count}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">المنح</p><p className="text-sm font-medium text-foreground">{selectedBadge.auto_grant ? 'تلقائي' : 'يدوي'}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الشرط</p><p className="text-xs font-mono text-foreground">{selectedBadge.criteria}</p></div>
                </div>
                <button onClick={() => { toast.info('منح الشارة — قريباً'); setSelectedBadge(null) }} className="mt-4 w-full h-10 rounded-lg bg-gold/10 border border-gold/25 text-sm font-medium text-gold hover:bg-gold/20 transition-all flex items-center justify-center gap-2">
                  <Award size={14} />
                  منح الشارة لمستخدم
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Badge Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">إنشاء شارة جديدة</h3>
                <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">الاسم (عربي)</label><input type="text" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all" placeholder="مثال: مستثمر مميز" /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">الاسم (إنجليزي)</label><input type="text" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all" placeholder="e.g. Premium Investor" dir="ltr" /></div>
                </div>
                <div><label className="block text-sm font-medium text-foreground mb-1.5">الوصف</label><textarea className="w-full h-20 px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all resize-none" placeholder="وصف الشارة ومعايير الحصول عليها" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">المستوى</label>
                    <select className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all">
                      {Object.entries(TIER_CONFIG).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">طريقة المنح</label>
                    <select className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all">
                      <option value="auto">تلقائي</option>
                      <option value="manual">يدوي</option>
                    </select>
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-foreground mb-1.5">شرط المنح التلقائي</label><input type="text" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all font-mono" placeholder="مثال: investment >= 500000" dir="ltr" /></div>
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => { toast.info('سيتم الإنشاء عند ربط الباك إند'); setShowCreate(false) }} className="flex-1 h-10 rounded-lg bg-gold/10 border border-gold/25 text-sm font-medium text-gold hover:bg-gold/20 transition-all">إنشاء الشارة</button>
                  <button onClick={() => setShowCreate(false)} className="h-10 px-6 rounded-lg bg-surface border border-border text-sm text-muted-foreground hover:text-foreground transition-all">إلغاء</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
