import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Plus, Edit, Trash2, Eye, Users, DollarSign, Search,
  X, CheckCircle, Star, Layers, Grid3X3, BarChart3, TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency } from '@/lib/utils'

interface SponsorPackage {
  id: number
  name: string
  name_en: string
  tier: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze'
  price: number
  max_sponsors: number
  current_sponsors: number
  features: string[]
  active: boolean
  sector?: string
}

interface Sector {
  id: number
  name: string
  name_en: string
  spaces_total: number
  spaces_booked: number
  color: string
}

const MOCK_PACKAGES: SponsorPackage[] = [
  { id: 1, name: 'حزمة الماسية', name_en: 'Diamond Package', tier: 'diamond', price: 500000, max_sponsors: 2, current_sponsors: 1, features: ['شعار على المسرح الرئيسي', 'بوث 100م²', 'كلمة افتتاحية', 'تغطية إعلامية كاملة', '20 دعوة VIP', 'تقرير ROI مخصص'], active: true },
  { id: 2, name: 'حزمة البلاتينية', name_en: 'Platinum Package', tier: 'platinum', price: 300000, max_sponsors: 5, current_sponsors: 3, features: ['شعار على البانرات الرئيسية', 'بوث 60م²', 'عرض تقديمي 30 دقيقة', '10 دعوات VIP', 'تقرير أداء'], active: true },
  { id: 3, name: 'حزمة الذهبية', name_en: 'Gold Package', tier: 'gold', price: 150000, max_sponsors: 10, current_sponsors: 8, features: ['شعار في الكتيب', 'بوث 30م²', '5 دعوات VIP', 'ذكر في البيانات الصحفية'], active: true },
  { id: 4, name: 'حزمة الفضية', name_en: 'Silver Package', tier: 'silver', price: 75000, max_sponsors: 20, current_sponsors: 12, features: ['شعار في الموقع', 'بوث 15م²', '3 دعوات', 'ذكر في وسائل التواصل'], active: true },
  { id: 5, name: 'حزمة البرونزية', name_en: 'Bronze Package', tier: 'bronze', price: 30000, max_sponsors: 50, current_sponsors: 22, features: ['شعار في الكتيب', 'بوث 9م²', 'دعوتان'], active: true },
]

const MOCK_SECTORS: Sector[] = [
  { id: 1, name: 'التقنية والابتكار', name_en: 'Technology & Innovation', spaces_total: 40, spaces_booked: 32, color: '#00d4ff' },
  { id: 2, name: 'الصحة والطب', name_en: 'Health & Medical', spaces_total: 25, spaces_booked: 18, color: '#00e5a0' },
  { id: 3, name: 'التعليم والتدريب', name_en: 'Education & Training', spaces_total: 20, spaces_booked: 15, color: '#f59e0b' },
  { id: 4, name: 'العقارات والبناء', name_en: 'Real Estate & Construction', spaces_total: 30, spaces_booked: 22, color: '#e040fb' },
  { id: 5, name: 'الأغذية والمشروبات', name_en: 'Food & Beverage', spaces_total: 35, spaces_booked: 28, color: '#ff6b6b' },
  { id: 6, name: 'الخدمات المالية', name_en: 'Financial Services', spaces_total: 15, spaces_booked: 12, color: '#c9a84c' },
]

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  diamond: { bg: 'bg-[#b9f2ff]/10', text: 'text-[#b9f2ff]', border: 'border-[#b9f2ff]/20' },
  platinum: { bg: 'bg-[#e5e4e2]/10', text: 'text-[#e5e4e2]', border: 'border-[#e5e4e2]/20' },
  gold: { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/20' },
  silver: { bg: 'bg-[#c0c0c0]/10', text: 'text-[#c0c0c0]', border: 'border-[#c0c0c0]/20' },
  bronze: { bg: 'bg-[#cd7f32]/10', text: 'text-[#cd7f32]', border: 'border-[#cd7f32]/20' },
}

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState<'packages' | 'sectors'>('packages')
  const [showCreate, setShowCreate] = useState(false)

  const totalRevenue = MOCK_PACKAGES.reduce((sum, p) => sum + (p.price * p.current_sponsors), 0)

  return (
    <AdminLayout>
      <PageHeader
        title="الحزم والقطاعات"
        subtitle="إدارة حزم الرعاية وقطاعات المعرض"
        actions={
          <button onClick={() => setShowCreate(true)} className="h-9 px-4 rounded-lg bg-gold/10 border border-gold/25 text-sm text-gold hover:bg-gold/20 transition-all flex items-center gap-2">
            <Plus size={14} />
            {activeTab === 'packages' ? 'حزمة جديدة' : 'قطاع جديد'}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="حزم الرعاية" value={MOCK_PACKAGES.length} icon={Package} delay={0} />
        <StatsCard title="الرعاة الحاليون" value={MOCK_PACKAGES.reduce((s, p) => s + p.current_sponsors, 0)} icon={Users} delay={0.1} />
        <StatsCard title="الإيرادات المتوقعة" value={formatCurrency(totalRevenue)} icon={DollarSign} delay={0.2} />
        <StatsCard title="القطاعات" value={MOCK_SECTORS.length} icon={Grid3X3} delay={0.3} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 mb-6 w-fit">
        <button onClick={() => setActiveTab('packages')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'packages' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
          <div className="flex items-center gap-2"><Package size={14} /> حزم الرعاية</div>
        </button>
        <button onClick={() => setActiveTab('sectors')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'sectors' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
          <div className="flex items-center gap-2"><Grid3X3 size={14} /> القطاعات</div>
        </button>
      </div>

      {activeTab === 'packages' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_PACKAGES.map((pkg, idx) => {
            const tier = TIER_COLORS[pkg.tier]
            const occupancy = Math.round((pkg.current_sponsors / pkg.max_sponsors) * 100)
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card p-5 hover:border-gold/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-foreground">{pkg.name}</h3>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', tier.bg, tier.text, tier.border)}>
                        {pkg.tier}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">{pkg.name_en}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toast.info('تعديل — قريباً')} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Edit size={13} /></button>
                  </div>
                </div>

                <div className="text-2xl font-bold text-gold mb-4 font-mono">{formatCurrency(pkg.price)}</div>

                {/* Occupancy */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">الإشغال</span>
                    <span className="text-xs font-medium text-foreground">{pkg.current_sponsors}/{pkg.max_sponsors}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${occupancy}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={cn('h-full rounded-full', occupancy >= 90 ? 'bg-danger' : occupancy >= 70 ? 'bg-warning' : 'bg-success')}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-4">
                  {pkg.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle size={11} className="text-success shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border/30 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">الإيرادات: {formatCurrency(pkg.price * pkg.current_sponsors)}</span>
                  <StatusBadge status={pkg.active ? 'active' : 'draft'} />
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SECTORS.map((sector, idx) => {
            const occupancy = Math.round((sector.spaces_booked / sector.spaces_total) * 100)
            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card p-5 hover:border-gold/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${sector.color}15`, border: `1px solid ${sector.color}30` }}>
                      <Layers size={18} style={{ color: sector.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{sector.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-mono">{sector.name_en}</p>
                    </div>
                  </div>
                  <button onClick={() => toast.info('تعديل — قريباً')} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors opacity-0 group-hover:opacity-100"><Edit size={13} /></button>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">المساحات المحجوزة</span>
                    <span className="text-xs font-medium text-foreground">{sector.spaces_booked}/{sector.spaces_total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${occupancy}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: sector.color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">نسبة الإشغال</span>
                  <span className={cn('font-bold', occupancy >= 80 ? 'text-success' : 'text-foreground')}>{occupancy}%</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">{activeTab === 'packages' ? 'إنشاء حزمة جديدة' : 'إنشاء قطاع جديد'}</h3>
                <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">الاسم (عربي)</label><input type="text" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all" /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">الاسم (إنجليزي)</label><input type="text" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all" dir="ltr" /></div>
                </div>
                {activeTab === 'packages' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-foreground mb-1.5">السعر (ر.س)</label><input type="number" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all font-mono" dir="ltr" /></div>
                      <div><label className="block text-sm font-medium text-foreground mb-1.5">الحد الأقصى</label><input type="number" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all font-mono" dir="ltr" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-foreground mb-1.5">المستوى</label>
                      <select className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all">
                        <option value="diamond">ماسي</option><option value="platinum">بلاتيني</option><option value="gold">ذهبي</option><option value="silver">فضي</option><option value="bronze">برونزي</option>
                      </select>
                    </div>
                  </>
                )}
                {activeTab === 'sectors' && (
                  <div><label className="block text-sm font-medium text-foreground mb-1.5">عدد المساحات</label><input type="number" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all font-mono" dir="ltr" /></div>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => { toast.info('سيتم الإنشاء عند ربط الباك إند'); setShowCreate(false) }} className="flex-1 h-10 rounded-lg bg-gold/10 border border-gold/25 text-sm font-medium text-gold hover:bg-gold/20 transition-all">إنشاء</button>
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
