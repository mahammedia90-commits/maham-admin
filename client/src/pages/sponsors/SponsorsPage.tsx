// Design: Nour Theme — Sponsors Module
// 5 tabs: Overview, Sponsors List, Packages, Deliverables, ROI Analytics
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, DollarSign, TrendingUp, Users, Plus, Eye, Star,
  Crown, Medal, Shield, ArrowUpRight, BarChart3, Package,
  CheckCircle, Clock, XCircle, Gift, Target, Megaphone,
  FileText, Calendar, Globe
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { id: 'sponsors', label: 'قائمة الرعاة', icon: Award },
  { id: 'packages', label: 'حزم الرعاية', icon: Package },
  { id: 'deliverables', label: 'التسليمات', icon: Gift },
  { id: 'roi', label: 'تحليلات ROI', icon: TrendingUp },
]

const sponsorTiers = [
  { tier: 'بلاتيني', icon: Crown, color: 'text-gold', bg: 'bg-gold/10 border-gold/20', count: 3, value: '2.4M' },
  { tier: 'ذهبي', icon: Medal, color: 'text-gold-light', bg: 'bg-gold/8 border-gold/15', count: 8, value: '1.6M' },
  { tier: 'فضي', icon: Shield, color: 'text-chrome', bg: 'bg-chrome/10 border-chrome/20', count: 15, value: '900K' },
  { tier: 'برونزي', icon: Star, color: 'text-chrome-dark', bg: 'bg-surface2 border-border/30', count: 22, value: '440K' },
]

const sponsors = [
  { id: 1, name: 'بنك الأهلي السعودي', tier: 'بلاتيني', value: 800000, status: 'active', roi: 320, events: 5, contact: 'أحمد الراشد', phone: '+966 55 123 4567', joined: '2025-06-15' },
  { id: 2, name: 'STC', tier: 'بلاتيني', value: 750000, status: 'active', roi: 280, events: 4, contact: 'محمد العتيبي', phone: '+966 55 234 5678', joined: '2025-07-20' },
  { id: 3, name: 'أرامكو', tier: 'بلاتيني', value: 850000, status: 'active', roi: 350, events: 6, contact: 'خالد الحربي', phone: '+966 55 345 6789', joined: '2025-05-10' },
  { id: 4, name: 'شركة المراعي', tier: 'ذهبي', value: 300000, status: 'active', roi: 180, events: 3, contact: 'سارة العلي', phone: '+966 55 456 7890', joined: '2025-08-01' },
  { id: 5, name: 'شركة سابك', tier: 'ذهبي', value: 250000, status: 'pending', roi: 0, events: 0, contact: 'فاطمة الزهراني', phone: '+966 55 567 8901', joined: '2026-03-15' },
  { id: 6, name: 'مجموعة الفيصلية', tier: 'فضي', value: 100000, status: 'active', roi: 120, events: 2, contact: 'عبدالله القحطاني', phone: '+966 55 678 9012', joined: '2025-09-20' },
  { id: 7, name: 'شركة الاتصالات المتكاملة', tier: 'فضي', value: 80000, status: 'active', roi: 95, events: 2, contact: 'ريم الدوسري', phone: '+966 55 789 0123', joined: '2025-10-05' },
  { id: 8, name: 'بنك الراجحي', tier: 'ذهبي', value: 350000, status: 'active', roi: 210, events: 4, contact: 'ناصر المالكي', phone: '+966 55 890 1234', joined: '2025-06-30' },
]

const packages = [
  { id: 1, name: 'الراعي البلاتيني', price: 800000, features: ['شعار في جميع المواد', 'جناح VIP حصري', 'كلمة افتتاحية', '10 دعوات VIP', 'تغطية إعلامية كاملة', 'تقرير ROI مفصل'], sponsors: 3, available: 2, color: 'border-gold/40 bg-gradient-to-b from-gold/5 to-transparent' },
  { id: 2, name: 'الراعي الذهبي', price: 300000, features: ['شعار في المواد الرئيسية', 'جناح مميز', '5 دعوات VIP', 'تغطية سوشيال ميديا', 'تقرير أداء'], sponsors: 8, available: 4, color: 'border-gold-light/30 bg-gradient-to-b from-gold-light/5 to-transparent' },
  { id: 3, name: 'الراعي الفضي', price: 100000, features: ['شعار في الموقع', 'مساحة عرض', '3 دعوات', 'ذكر في البيان الصحفي'], sponsors: 15, available: 10, color: 'border-chrome/30 bg-gradient-to-b from-chrome/5 to-transparent' },
  { id: 4, name: 'الراعي البرونزي', price: 20000, features: ['شعار في الموقع', 'دعوتان', 'ذكر في السوشيال ميديا'], sponsors: 22, available: 'غير محدود', color: 'border-border/50' },
]

const deliverables = [
  { id: 1, sponsor: 'بنك الأهلي السعودي', item: 'شعار في جميع المطبوعات', status: 'delivered', dueDate: '2026-03-15', deliveredDate: '2026-03-12' },
  { id: 2, sponsor: 'بنك الأهلي السعودي', item: 'كلمة افتتاحية — 15 دقيقة', status: 'scheduled', dueDate: '2026-04-15', deliveredDate: null },
  { id: 3, sponsor: 'STC', item: 'جناح VIP — 50 م²', status: 'delivered', dueDate: '2026-03-20', deliveredDate: '2026-03-18' },
  { id: 4, sponsor: 'STC', item: 'تغطية سوشيال ميديا — 10 منشورات', status: 'in_progress', dueDate: '2026-04-10', deliveredDate: null },
  { id: 5, sponsor: 'أرامكو', item: 'تقرير ROI مفصل', status: 'pending', dueDate: '2026-04-30', deliveredDate: null },
  { id: 6, sponsor: 'شركة المراعي', item: 'بانر إعلاني — الصفحة الرئيسية', status: 'delivered', dueDate: '2026-03-10', deliveredDate: '2026-03-08' },
  { id: 7, sponsor: 'بنك الراجحي', item: 'فيديو ترويجي — 30 ثانية', status: 'in_progress', dueDate: '2026-04-05', deliveredDate: null },
]

const roiData = [
  { sponsor: 'أرامكو', invested: 850000, impressions: '12.5M', leads: 450, conversions: 85, revenue: 3825000, roi: 350 },
  { sponsor: 'بنك الأهلي', invested: 800000, impressions: '10.2M', leads: 380, conversions: 72, revenue: 3360000, roi: 320 },
  { sponsor: 'STC', invested: 750000, impressions: '8.8M', leads: 320, conversions: 65, revenue: 2850000, roi: 280 },
  { sponsor: 'بنك الراجحي', invested: 350000, impressions: '4.5M', leads: 180, conversions: 38, revenue: 1085000, roi: 210 },
  { sponsor: 'المراعي', invested: 300000, impressions: '3.2M', leads: 145, conversions: 28, revenue: 840000, roi: 180 },
]

const deliverableStatusMap: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  delivered: { label: 'تم التسليم', color: 'bg-success/15 text-success', icon: CheckCircle },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-info/15 text-info', icon: Clock },
  scheduled: { label: 'مجدول', color: 'bg-warning/15 text-warning', icon: Calendar },
  pending: { label: 'معلق', color: 'bg-surface2 text-muted-foreground', icon: Clock },
}

export default function SponsorsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <AdminLayout>
      <PageHeader title="الرعاة والشركاء" subtitle="إدارة الرعايات وحزم الشراكة وتتبع ROI والتسليمات" actions={
        <button onClick={() => toast.info('إضافة راعٍ — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> إضافة راعٍ</button>
      } />

      <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border/50 overflow-x-auto mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-surface2/50')}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="إجمالي الرعاة" value="48" icon={Award} trend={12} delay={0} />
                <StatsCard title="قيمة الرعايات" value="5.34M" icon={DollarSign} trend={25} delay={0.1} />
                <StatsCard title="متوسط ROI" value="+215%" icon={TrendingUp} trend={18} delay={0.2} />
                <StatsCard title="معدل التجديد" value="82%" icon={Users} trend={5} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {sponsorTiers.map((tier, i) => (
                  <motion.div key={tier.tier} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }} className={cn('glass-card p-4 border', tier.bg)}>
                    <div className="flex items-center gap-2 mb-2"><tier.icon size={18} className={tier.color} /><h4 className="text-sm font-bold text-foreground">{tier.tier}</h4></div>
                    <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{tier.count} راعٍ</span><span className="text-sm font-mono font-bold text-gold">{tier.value}</span></div>
                  </motion.div>
                ))}
              </div>
              <div className="glass-card p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">أحدث الأنشطة</h3>
                <div className="space-y-3">
                  {[
                    { text: 'تم تجديد رعاية بنك الأهلي — بلاتيني', time: 'منذ ساعتين', type: 'success' },
                    { text: 'طلب رعاية جديد من شركة سابك — ذهبي', time: 'منذ 5 ساعات', type: 'info' },
                    { text: 'تم تسليم تقرير ROI لأرامكو', time: 'أمس', type: 'success' },
                    { text: 'تم إنشاء حزمة رعاية جديدة — إعلامي', time: 'منذ يومين', type: 'info' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn('w-2 h-2 rounded-full', a.type === 'success' ? 'bg-success' : 'bg-info')} />
                      <span className="text-sm text-foreground flex-1">{a.text}</span>
                      <span className="text-[10px] text-muted-foreground">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sponsors' && (
            <div className="space-y-3">
              {sponsors.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 hover:border-gold/30 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold">{s.name.charAt(0)}</div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{s.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full', s.tier === 'بلاتيني' ? 'bg-gold/15 text-gold' : s.tier === 'ذهبي' ? 'bg-gold/10 text-gold-light' : 'bg-chrome/10 text-chrome')}>{s.tier}</span>
                          <span className="text-[10px] text-muted-foreground">{s.contact} • {s.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center"><p className="text-[10px] text-muted-foreground">القيمة</p><p className="text-sm font-mono font-bold text-gold">{formatCurrency(s.value)}</p></div>
                      <div className="text-center"><p className="text-[10px] text-muted-foreground">ROI</p><p className={cn('text-sm font-mono font-bold', s.roi > 0 ? 'text-success' : 'text-muted-foreground')}>{s.roi > 0 ? `+${s.roi}%` : '—'}</p></div>
                      <div className="text-center"><p className="text-[10px] text-muted-foreground">الفعاليات</p><p className="text-sm font-bold text-foreground">{s.events}</p></div>
                      <StatusBadge status={s.status} />
                      <button onClick={() => toast.info('عرض تفاصيل الراعي — قريباً')} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><ArrowUpRight size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={cn('glass-card p-6 border', p.color)}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                    <span className="text-xl font-mono font-bold text-gold">{formatCurrency(p.price)}</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {p.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle size={14} className="text-success shrink-0" /> {f}</li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="text-xs text-muted-foreground">{p.sponsors} رعاة مشتركون</span>
                    <span className="text-xs text-gold">{typeof p.available === 'number' ? `${p.available} متاح` : p.available}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'deliverables' && (
            <div className="space-y-3">
              {deliverables.map((d, i) => {
                const st = deliverableStatusMap[d.status]
                const StIcon = st.icon
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 hover:border-gold/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', st.color)}><StIcon size={18} /></div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{d.item}</h4>
                          <p className="text-[10px] text-muted-foreground">{d.sponsor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left"><p className="text-[10px] text-muted-foreground">الموعد</p><p className="text-xs font-mono text-foreground">{formatDate(d.dueDate)}</p></div>
                        {d.deliveredDate && <div className="text-left"><p className="text-[10px] text-muted-foreground">تم التسليم</p><p className="text-xs font-mono text-success">{formatDate(d.deliveredDate)}</p></div>}
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full', st.color)}>{st.label}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="إجمالي الاستثمار" value="3.05M" icon={DollarSign} delay={0} />
                <StatsCard title="إجمالي العائد" value="11.96M" icon={TrendingUp} trend={290} delay={0.1} />
                <StatsCard title="العملاء المحتملون" value="1,475" icon={Target} delay={0.2} />
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['الراعي', 'الاستثمار', 'المشاهدات', 'العملاء المحتملون', 'التحويلات', 'العائد', 'ROI'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {roiData.map((r, i) => (
                      <motion.tr key={r.sponsor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                        <td className="p-4 text-sm font-bold text-foreground">{r.sponsor}</td>
                        <td className="p-4 text-sm font-mono text-warning">{formatCurrency(r.invested)}</td>
                        <td className="p-4 text-sm font-mono text-foreground">{r.impressions}</td>
                        <td className="p-4 text-sm text-foreground">{r.leads}</td>
                        <td className="p-4 text-sm text-foreground">{r.conversions}</td>
                        <td className="p-4 text-sm font-mono font-bold text-success">{formatCurrency(r.revenue)}</td>
                        <td className="p-4"><span className="text-sm font-bold text-gold">+{r.roi}%</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
