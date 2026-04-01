import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image, CheckCircle, XCircle, Eye, Download, Clock, Search,
  Filter, FileImage, FileVideo, FileText, Palette, X, AlertTriangle,
  BarChart3, Upload
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate } from '@/lib/utils'

interface SponsorAsset {
  id: number
  sponsor_name: string
  sponsor_tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  event_name: string
  asset_type: 'logo' | 'banner' | 'video' | 'brochure' | 'social_media'
  file_name: string
  file_size: string
  dimensions?: string
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested'
  placement: string
  submitted_at: string
  reviewed_at?: string
  reviewer?: string
  rejection_reason?: string
  thumbnail?: string
}

const MOCK_ASSETS: SponsorAsset[] = [
  { id: 1, sponsor_name: 'شركة التقنية المتقدمة', sponsor_tier: 'platinum', event_name: 'معرض التقنية 2026', asset_type: 'logo', file_name: 'logo-main-v3.svg', file_size: '245 KB', dimensions: '1200x400', status: 'pending', placement: 'المسرح الرئيسي + البانرات', submitted_at: '2026-03-31T10:00:00' },
  { id: 2, sponsor_name: 'شركة التقنية المتقدمة', sponsor_tier: 'platinum', event_name: 'معرض التقنية 2026', asset_type: 'banner', file_name: 'main-banner-expo.jpg', file_size: '2.1 MB', dimensions: '1920x600', status: 'approved', placement: 'الصفحة الرئيسية', submitted_at: '2026-03-30T14:00:00', reviewed_at: '2026-03-30T16:00:00', reviewer: 'أحمد المشرف' },
  { id: 3, sponsor_name: 'مجموعة الابتكار', sponsor_tier: 'gold', event_name: 'معرض التقنية 2026', asset_type: 'video', file_name: 'promo-30sec.mp4', file_size: '18.5 MB', status: 'pending', placement: 'شاشات العرض', submitted_at: '2026-03-31T08:00:00' },
  { id: 4, sponsor_name: 'بنك الاستثمار الأول', sponsor_tier: 'gold', event_name: 'معرض الابتكار 2026', asset_type: 'brochure', file_name: 'investment-brochure.pdf', file_size: '5.2 MB', status: 'rejected', placement: 'منطقة الاستقبال', submitted_at: '2026-03-29T11:00:00', reviewed_at: '2026-03-29T15:00:00', reviewer: 'سارة المراجعة', rejection_reason: 'الدقة غير كافية — يرجى إرسال نسخة بدقة 300 DPI' },
  { id: 5, sponsor_name: 'شركة الحلول الذكية', sponsor_tier: 'silver', event_name: 'معرض التقنية 2026', asset_type: 'social_media', file_name: 'social-kit.zip', file_size: '8.7 MB', status: 'approved', placement: 'وسائل التواصل', submitted_at: '2026-03-28T09:00:00', reviewed_at: '2026-03-28T12:00:00', reviewer: 'أحمد المشرف' },
  { id: 6, sponsor_name: 'مؤسسة الريادة', sponsor_tier: 'bronze', event_name: 'معرض التقنية 2026', asset_type: 'logo', file_name: 'logo-riyada.png', file_size: '120 KB', dimensions: '800x300', status: 'revision_requested', placement: 'كتيب المعرض', submitted_at: '2026-03-27T10:00:00', reviewed_at: '2026-03-27T14:00:00', reviewer: 'سارة المراجعة', rejection_reason: 'يرجى إرسال نسخة بخلفية شفافة (PNG)' },
]

const ASSET_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  logo: { label: 'شعار', icon: Palette, color: 'text-gold' },
  banner: { label: 'بانر', icon: FileImage, color: 'text-info' },
  video: { label: 'فيديو', icon: FileVideo, color: 'text-success' },
  brochure: { label: 'كتيب', icon: FileText, color: 'text-warning' },
  social_media: { label: 'وسائل تواصل', icon: Image, color: 'text-[#e040fb]' },
}

const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  platinum: { label: 'بلاتيني', color: 'text-[#e5e4e2]' },
  gold: { label: 'ذهبي', color: 'text-gold' },
  silver: { label: 'فضي', color: 'text-[#c0c0c0]' },
  bronze: { label: 'برونزي', color: 'text-[#cd7f32]' },
}

const STATUS_MAP: Record<string, string> = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  revision_requested: 'review',
}

export default function SponsorAssetsPage() {
  const [assets] = useState(MOCK_ASSETS)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [selectedAsset, setSelectedAsset] = useState<SponsorAsset | null>(null)

  const filtered = assets.filter(a => {
    if (search && !a.sponsor_name.includes(search) && !a.file_name.includes(search)) return false
    if (filterType && a.asset_type !== filterType) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  return (
    <AdminLayout>
      <PageHeader
        title="أصول الرعاة"
        subtitle="مراجعة وإدارة الشعارات والبانرات والمواد الإعلانية للرعاة"
        actions={
          <button onClick={() => toast.info('طلب أصول جديدة — قريباً')} className="h-9 px-4 rounded-lg bg-gold/10 border border-gold/25 text-sm text-gold hover:bg-gold/20 transition-all flex items-center gap-2">
            <Upload size={14} />
            طلب أصول
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الأصول" value={assets.length} icon={Image} delay={0} />
        <StatsCard title="بانتظار المراجعة" value={assets.filter(a => a.status === 'pending').length} icon={Clock} delay={0.1} />
        <StatsCard title="مقبولة" value={assets.filter(a => a.status === 'approved').length} icon={CheckCircle} delay={0.2} />
        <StatsCard title="مرفوضة / تعديل" value={assets.filter(a => a.status === 'rejected' || a.status === 'revision_requested').length} icon={AlertTriangle} delay={0.3} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالراعي أو اسم الملف..." className="w-full h-9 pr-9 pl-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-all" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل الأنواع</option>
          {Object.entries(ASSET_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل الحالات</option>
          <option value="pending">معلق</option>
          <option value="approved">مقبول</option>
          <option value="rejected">مرفوض</option>
          <option value="revision_requested">تعديل مطلوب</option>
        </select>
      </div>

      {/* Assets Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الراعي</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">النوع</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الملف</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الموضع</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الحالة</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">التاريخ</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-[140px]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">لا توجد أصول مطابقة</td></tr>
                ) : (
                  filtered.map((asset, idx) => {
                    const typeConf = ASSET_TYPE_CONFIG[asset.asset_type]
                    const tierConf = TIER_CONFIG[asset.sponsor_tier]
                    return (
                      <motion.tr key={asset.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="border-b border-border/30 hover:bg-surface/50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{asset.sponsor_name}</p>
                            <p className={cn('text-[10px]', tierConf.color)}>{tierConf.label} — {asset.event_name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <typeConf.icon size={14} className={typeConf.color} />
                            <span className="text-xs text-foreground">{typeConf.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-xs text-foreground font-mono">{asset.file_name}</p>
                            <p className="text-[10px] text-muted-foreground">{asset.file_size}{asset.dimensions ? ` — ${asset.dimensions}` : ''}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{asset.placement}</td>
                        <td className="px-4 py-3"><StatusBadge status={STATUS_MAP[asset.status] || asset.status} /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{formatDate(asset.submitted_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSelectedAsset(asset)} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-info transition-colors" title="معاينة"><Eye size={13} /></button>
                            {asset.status === 'pending' && (
                              <>
                                <button onClick={() => toast.success('تمت الموافقة')} className="p-1.5 rounded-md hover:bg-success/10 text-muted-foreground hover:text-success transition-colors" title="قبول"><CheckCircle size={13} /></button>
                                <button onClick={() => toast.error('تم الرفض')} className="p-1.5 rounded-md hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors" title="رفض"><XCircle size={13} /></button>
                              </>
                            )}
                            <button onClick={() => toast.info('تحميل — قريباً')} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors" title="تحميل"><Download size={13} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedAsset(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">تفاصيل الأصل</h3>
                <button onClick={() => setSelectedAsset(null)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الراعي</p><p className="text-sm font-medium text-foreground">{selectedAsset.sponsor_name}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">المستوى</p><p className={cn('text-sm font-medium', TIER_CONFIG[selectedAsset.sponsor_tier].color)}>{TIER_CONFIG[selectedAsset.sponsor_tier].label}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">نوع الأصل</p><p className="text-sm text-foreground">{ASSET_TYPE_CONFIG[selectedAsset.asset_type].label}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الحجم</p><p className="text-sm text-foreground">{selectedAsset.file_size}</p></div>
                </div>
                <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">موضع العرض</p><p className="text-sm text-foreground">{selectedAsset.placement}</p></div>
                {selectedAsset.rejection_reason && (
                  <div className="glass-card p-3 border-r-2 border-r-danger">
                    <p className="text-[10px] text-danger mb-1">سبب الرفض / التعديل</p>
                    <p className="text-sm text-foreground">{selectedAsset.rejection_reason}</p>
                  </div>
                )}
                {selectedAsset.reviewer && (
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">المراجع</p><p className="text-sm text-foreground">{selectedAsset.reviewer} — {selectedAsset.reviewed_at ? formatDate(selectedAsset.reviewed_at) : ''}</p></div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
