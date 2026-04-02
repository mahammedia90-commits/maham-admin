/* ═══════════════════════════════════════════════════════════════
   بوابة الراعي — مركز تحكم شامل (معمّق) - REAL API
   Nour Theme · Liquid Gold Executive
   9 تابات: نظرة عامة | الرعاة | حزم الرعاية | العقود | ROI والأداء | التقارير | التسليمات | التواصل | الفعاليات القادمة
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Award, Crown, Target, Eye, Download, Filter, Search, Calendar,
  CheckCircle2, Clock, AlertTriangle, BarChart3, Zap, TrendingUp,
  DollarSign, ChevronLeft, Plus, Star, Users, Globe, Megaphone,
  Gift, Handshake, FileCheck, Percent, Package, Image, Video,
  MessageSquare, Send, Phone, Mail, Paperclip, MapPin, CalendarDays
} from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar } from 'recharts'
import client from '@/api/client'

const tabs = ['نظرة عامة', 'الرعاة', 'حزم الرعاية', 'العقود', 'ROI والأداء', 'التقارير', 'التسليمات', 'التواصل', 'الفعاليات القادمة'] as const
type TabType = typeof tabs[number]

export default function SponsorPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة')
  const [searchQuery, setSearchQuery] = useState('')
  const [msgInput, setMsgInput] = useState('')

  // API Data States
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [sponsorsData, setSponsorsData] = useState<any>(null)
  const [packagesData, setPackagesData] = useState<any>(null)
  const [contractsData, setContractsData] = useState<any>(null)
  const [roiMetricsData, setRoiMetricsData] = useState<any>(null)
  const [deliverablesData, setDeliverablesData] = useState<any>(null)
  const [eventsData, setEventsData] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [dash, sponsors, packages, contracts, roi, deliverables, events] = await Promise.all([
          client.get('/admin/sponsor-portal/dashboard'),
          client.get('/admin/sponsor-portal/sponsors'),
          client.get('/admin/sponsor-portal/packages'),
          client.get('/admin/sponsor-portal/contracts'),
          client.get('/admin/sponsor-portal/roi-metrics'),
          client.get('/admin/sponsor-portal/deliverables'),
          client.get('/admin/sponsor-portal/upcoming-events'),
        ])

        setDashboardData(dash.data || dash)
        setSponsorsData(sponsors.data || sponsors)
        setPackagesData(packages.data || packages)
        setContractsData(contracts.data || contracts)
        setRoiMetricsData(roi.data || roi)
        setDeliverablesData(deliverables.data || deliverables)
        setEventsData(events.data || events)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'فشل في تحميل البيانات')
        console.error('API Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const tierColor = (tier: string) => {
    switch(tier) {
      case 'بلاتيني':
      case 'platinum': return '#C9A84C'
      case 'ذهبي':
      case 'gold': return '#DAA520'
      case 'فضي':
      case 'silver': return '#A8A8A8'
      case 'برونزي':
      case 'bronze': return '#CD7F32'
      default: return '#6B6560'
    }
  }

  const delivTypeIcon = (type: string) => {
    switch(type) {
      case 'branding': return Image
      case 'digital': return Globe
      case 'physical': return Package
      case 'event': return CalendarDays
      case 'report': return BarChart3
      default: return FileCheck
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="بوابة الراعي"
          subtitle="إدارة الرعاة وحزم الرعاية والعقود وتحليل العائد على الاستثمار"
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => toast.info('تصدير — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5"><Download size={14} /> تصدير</button>
              <button onClick={() => toast.info('إضافة راعي — قريباً')} className="nour-btn-gold text-xs flex items-center gap-1.5"><Crown size={14} /> راعي جديد</button>
            </div>
          }
        />

        {/* Tabs — scrollable on mobile */}
        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-thin" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
              'px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all duration-300',
              activeTab === tab ? 'bg-gradient-to-l from-gold/15 to-gold/8 text-gold border border-gold/20 shadow-[0_0_12px_rgba(201,168,76,0.08)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}>{tab}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {/* ═══ نظرة عامة ═══ */}
            {activeTab === 'نظرة عامة' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard
                    title="إجمالي الرعاة"
                    value={dashboardData?.data?.total_sponsors || 0}
                    icon={Crown}
                    trend={8}
                    trendLabel="جديد"
                    delay={0}
                  />
                  <StatsCard
                    title="قيمة الرعايات"
                    value={formatCurrency(dashboardData?.data?.total_sponsorship_value || 0)}
                    icon={DollarSign}
                    trend={15}
                    trendLabel="نمو"
                    delay={0.1}
                  />
                  <StatsCard
                    title="متوسط العائد"
                    value={`${dashboardData?.data?.average_roi || 0}%`}
                    icon={TrendingUp}
                    trend={5}
                    trendLabel="ارتفاع"
                    delay={0.2}
                  />
                  <StatsCard
                    title="العقود النشطة"
                    value={dashboardData?.data?.active_contracts || 0}
                    icon={Handshake}
                    trend={3}
                    trendLabel="نشطة"
                    delay={0.3}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 nour-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold mb-4">توزيع الرعاة حسب المستوى</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie data={[]} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value">
                        {[].map((entry: any, idx: number) => (
                          <Cell key={`cell-${idx}`} fill={['#C9A84C', '#DAA520', '#A8A8A8', '#CD7F32'][idx % 4]} />
                        ))}
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>

                  <div className="nour-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold mb-4">توزيع الرعاة</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">بلاتيني</span>
                        <span className="font-semibold text-gold">{dashboardData?.data?.sponsors_by_tier?.platinum || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ذهبي</span>
                        <span className="font-semibold text-yellow-500">{dashboardData?.data?.sponsors_by_tier?.gold || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">فضي</span>
                        <span className="font-semibold text-gray-400">{dashboardData?.data?.sponsors_by_tier?.silver || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">برونزي</span>
                        <span className="font-semibold" style={{ color: '#CD7F32' }}>{dashboardData?.data?.sponsors_by_tier?.bronze || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ الرعاة ═══ */}
            {activeTab === 'الرعاة' && (
              <div className="space-y-4">
                <div className="nour-card p-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-gold/20">
                      <tr>
                        <th className="text-right py-2">الاسم</th>
                        <th className="text-right py-2">المستوى</th>
                        <th className="text-right py-2">قيمة الرعاية</th>
                        <th className="text-right py-2">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {sponsorsData?.data?.map((sponsor: any) => (
                        <tr key={sponsor.id}>
                          <td className="py-3">{sponsor.name || sponsor.name_en}</td>
                          <td className="py-3">
                            <span
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                color: tierColor(sponsor.sponsorship_tier),
                                borderColor: tierColor(sponsor.sponsorship_tier),
                                borderWidth: '1px'
                              }}
                            >
                              {sponsor.sponsorship_tier}
                            </span>
                          </td>
                          <td className="py-3">{formatCurrency(sponsor.sponsorship_amount || 0)}</td>
                          <td className="py-3">
                            <StatusBadge status={sponsor.status} />
                          </td>
                        </tr>
                      )) || <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">لا توجد رعاة</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ حزم الرعاية ═══ */}
            {activeTab === 'حزم الرعاية' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {packagesData?.data?.map((pkg: any) => (
                    <div key={pkg.id} className="nour-card p-4">
                      <h4 className="font-semibold text-sm mb-2">{pkg.name || pkg.name_en}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{pkg.description}</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-muted-foreground">السعر</div>
                          <div className="text-lg font-bold text-gold">{formatCurrency(pkg.price || 0)}</div>
                        </div>
                        <StatusBadge status={pkg.active ? 'active' : 'inactive'} />
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-sm col-span-2">لا توجد حزم</p>}
                </div>
              </div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="nour-card p-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-gold/20">
                      <tr>
                        <th className="text-right py-2">رقم العقد</th>
                        <th className="text-right py-2">المبلغ</th>
                        <th className="text-right py-2">الحالة</th>
                        <th className="text-right py-2">حالة الدفع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {contractsData?.data?.map((contract: any) => (
                        <tr key={contract.id}>
                          <td className="py-3">{contract.contract_number}</td>
                          <td className="py-3">{formatCurrency(contract.total_amount || 0)}</td>
                          <td className="py-3">
                            <StatusBadge status={contract.status} />
                          </td>
                          <td className="py-3">
                            <StatusBadge status={contract.payment_status} />
                          </td>
                        </tr>
                      )) || <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">لا توجد عقود</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ ROI والأداء ═══ */}
            {activeTab === 'ROI والأداء' && (
              <div className="space-y-4">
                <div className="nour-card p-4">
                  <h3 className="text-sm font-semibold mb-4">مؤشرات العائد على الاستثمار</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {roiMetricsData?.data?.map((metric: any) => (
                      <div key={metric.sponsor_id} className="p-3 rounded-lg bg-white/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs text-muted-foreground">{metric.name}</div>
                            <div className="text-sm font-semibold mt-1">{formatCurrency(metric.investment || 0)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">العائد</div>
                            <div className="text-sm font-bold text-gold">{metric.roi_percentage}%</div>
                          </div>
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground text-xs col-span-2">لا توجد مؤشرات</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="space-y-4">
                <div className="nour-card p-4">
                  <h3 className="text-sm font-semibold mb-4">التقارير المتاحة</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير الرعايات الشهري</span>
                      <Download size={14} />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير العائد على الاستثمار</span>
                      <Download size={14} />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير التسليمات</span>
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ التسليمات ═══ */}
            {activeTab === 'التسليمات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {deliverablesData?.data?.map((deliverable: any) => (
                    <div key={deliverable.id} className="nour-card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{deliverable.title}</h4>
                        <StatusBadge status={deliverable.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{deliverable.description}</p>
                      <div className="text-xs text-muted-foreground">موعد التسليم: {formatDate(deliverable.due_date)}</div>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">لا توجد تسليمات</p>}
                </div>
              </div>
            )}

            {/* ═══ التواصل ═══ */}
            {activeTab === 'التواصل' && (
              <div className="space-y-4">
                <div className="nour-card p-4">
                  <h3 className="text-sm font-semibold mb-4">الرسائل والإشعارات</h3>
                  <p className="text-xs text-muted-foreground">لا توجد رسائل حالياً</p>
                </div>
              </div>
            )}

            {/* ═══ الفعاليات القادمة ═══ */}
            {activeTab === 'الفعاليات القادمة' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {eventsData?.data?.map((event: any) => (
                    <div key={event.id} className="nour-card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{event.name}</h4>
                        <StatusBadge status={event.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(event.startDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location || 'لم يحدد'}
                        </div>
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">لا توجد فعاليات قادمة</p>}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
