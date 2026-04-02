/* ═══════════════════════════════════════════════════════════════
   بوابة التاجر — مركز تحكم شامل (معمّق) - REAL API
   Nour Theme · Liquid Gold Executive
   9 تابات: نظرة عامة | الأكشاك | التجار | الطلبات | العقود | التقارير | الخدمات | المدفوعات | التواصل
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
  Store, ShoppingBag, MapPin, Users, FileCheck, CreditCard,
  Star, Eye, Download, Filter, Search, Calendar,
  Package, CheckCircle2, Clock, AlertTriangle, BarChart3,
  Zap, TrendingUp, DollarSign, ChevronLeft, Plus,
  Wrench, Truck, Wifi, Palette, MessageSquare, Send,
  Phone, Mail, Receipt, ArrowUpRight, ArrowDownRight,
  RefreshCw, Ban, CircleDollarSign, Paperclip
} from 'lucide-react'
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import client from '@/api/client'

const tabs = ['نظرة عامة', 'الأكشاك والمواقع', 'التجار', 'الطلبات', 'العقود', 'التقارير', 'الخدمات', 'المدفوعات', 'التواصل'] as const
type TabType = typeof tabs[number]

export default function MerchantPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة')
  const [searchQuery, setSearchQuery] = useState('')
  const [msgInput, setMsgInput] = useState('')

  // API Data States
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [boothsData, setBoothsData] = useState<any>(null)
  const [merchantsData, setMerchantsData] = useState<any>(null)
  const [boothRequestsData, setBoothRequestsData] = useState<any>(null)
  const [contractsData, setContractsData] = useState<any>(null)
  const [servicesData, setServicesData] = useState<any>(null)
  const [paymentsData, setPaymentsData] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [dash, booths, merchants, requests, contracts, services, payments] = await Promise.all([
          client.get('/admin/merchant-portal/dashboard'),
          client.get('/admin/merchant-portal/booths'),
          client.get('/admin/merchant-portal/merchants'),
          client.get('/admin/merchant-portal/booth-requests'),
          client.get('/admin/merchant-portal/contracts'),
          client.get('/admin/merchant-portal/services'),
          client.get('/admin/merchant-portal/payments'),
        ])

        setDashboardData(dash.data || dash)
        setBoothsData(booths.data || booths)
        setMerchantsData(merchants.data || merchants)
        setBoothRequestsData(requests.data || requests)
        setContractsData(contracts.data || contracts)
        setServicesData(services.data || services)
        setPaymentsData(payments.data || payments)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'فشل في تحميل البيانات')
        console.error('API Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

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
          title="بوابة التاجر"
          subtitle="إدارة التجار والأكشاك والحجوزات والعقود التجارية"
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => toast.info('تصدير — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5"><Download size={14} /> تصدير</button>
              <button onClick={() => toast.info('إضافة تاجر — قريباً')} className="nour-btn-gold text-xs flex items-center gap-1.5"><Store size={14} /> تاجر جديد</button>
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
                  <StatsCard title="إجمالي التجار" value={dashboardData?.data?.total_merchants || 0} icon={Store} trend={18} trendLabel="جديد" delay={0} />
                  <StatsCard title="الأكشاك المحجوزة" value={`${dashboardData?.data?.occupied_booths || 0} / ${dashboardData?.data?.total_booths || 0}`} icon={MapPin} trend={dashboardData?.data?.occupancy_rate || 0} trendLabel="إشغال" delay={0.1} />
                  <StatsCard title="إيرادات الحجوزات" value={formatCurrency(dashboardData?.data?.total_revenue || 0)} icon={DollarSign} trend={32} trendLabel="نمو" delay={0.2} />
                  <StatsCard title="طلبات معلقة" value={dashboardData?.data?.pending_requests || 0} icon={Clock} trend={-3} trendLabel="أقل" delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 nour-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground">توزيع الأكشاك حسب النوع</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie data={[]} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
                        {[].map((entry: any, idx: number) => (
                          <Cell key={`cell-${idx}`} fill={['#C9A84C', '#B8860B', '#DAA520', '#8B7355', '#6B6560'][idx % 5]} />
                        ))}
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>

                  <div className="nour-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold mb-4">الحالة الحالية</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">نسبة الإشغال</span>
                        <span className="font-semibold text-gold">{dashboardData?.data?.occupancy_rate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-gold to-yellow-500 h-2 rounded-full"
                          style={{ width: `${dashboardData?.data?.occupancy_rate || 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">العقود النشطة</span>
                        <span className="font-semibold">{dashboardData?.data?.active_contracts || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ الأكشاك والمواقع ═══ */}
            {activeTab === 'الأكشاك والمواقع' && (
              <div className="space-y-4">
                <div className="nour-card p-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-gold/20">
                      <tr>
                        <th className="text-right py-2">اسم الكشك</th>
                        <th className="text-right py-2">المنطقة</th>
                        <th className="text-right py-2">الحالة</th>
                        <th className="text-right py-2">السعر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {boothsData?.data?.map((booth: any) => (
                        <tr key={booth.id}>
                          <td className="py-3">{booth.name}</td>
                          <td className="py-3">{booth.zone}</td>
                          <td className="py-3">
                            <StatusBadge status={booth.status} />
                          </td>
                          <td className="py-3">{formatCurrency(booth.price || 0)}</td>
                        </tr>
                      )) || <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">لا توجد أكشاك</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ التجار ═══ */}
            {activeTab === 'التجار' && (
              <div className="space-y-4">
                <div className="nour-card p-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-gold/20">
                      <tr>
                        <th className="text-right py-2">اسم التاجر</th>
                        <th className="text-right py-2">البريد الإلكتروني</th>
                        <th className="text-right py-2">الهاتف</th>
                        <th className="text-right py-2">القطاع</th>
                        <th className="text-right py-2">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {merchantsData?.data?.map((merchant: any) => (
                        <tr key={merchant.id}>
                          <td className="py-3">{merchant.name || merchant.name_en}</td>
                          <td className="py-3 text-xs">{merchant.email}</td>
                          <td className="py-3">{merchant.phone}</td>
                          <td className="py-3">{merchant.sector}</td>
                          <td className="py-3">
                            <StatusBadge status={merchant.status} />
                          </td>
                        </tr>
                      )) || <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">لا توجد تجار</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ الطلبات ═══ */}
            {activeTab === 'الطلبات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {boothRequestsData?.data?.map((request: any) => (
                    <div key={request.id} className="nour-card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{request.merchant_name || 'طلب رقم ' + request.id}</h4>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">المبلغ: {formatCurrency(request.amount || 0)}</p>
                      <div className="text-xs text-muted-foreground">تم الإنشاء: {formatDate(request.created_at)}</div>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">لا توجد طلبات</p>}
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
                          <td className="py-3">{formatCurrency(contract.amount || 0)}</td>
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

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="space-y-4">
                <div className="nour-card p-4">
                  <h3 className="text-sm font-semibold mb-4">التقارير المتاحة</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير الحجوزات الشهري</span>
                      <Download size={14} />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير الإيرادات</span>
                      <Download size={14} />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير أداء التجار</span>
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ الخدمات ═══ */}
            {activeTab === 'الخدمات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {servicesData?.data?.map((service: any) => (
                    <div key={service.id} className="nour-card p-4">
                      <h4 className="font-semibold text-sm mb-2">{service.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{service.description}</p>
                      <div className="flex justify-between text-xs">
                        <span>السعر: {formatCurrency(service.price || 0)}</span>
                        <StatusBadge status={service.status} />
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">لا توجد خدمات</p>}
                </div>
              </div>
            )}

            {/* ═══ المدفوعات ═══ */}
            {activeTab === 'المدفوعات' && (
              <div className="space-y-4">
                <div className="nour-card p-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-gold/20">
                      <tr>
                        <th className="text-right py-2">رقم الدفع</th>
                        <th className="text-right py-2">المبلغ</th>
                        <th className="text-right py-2">الطريقة</th>
                        <th className="text-right py-2">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {paymentsData?.data?.map((payment: any) => (
                        <tr key={payment.id}>
                          <td className="py-3">{payment.id}</td>
                          <td className="py-3">{formatCurrency(payment.amount || 0)}</td>
                          <td className="py-3">{payment.method}</td>
                          <td className="py-3">
                            <StatusBadge status={payment.status} />
                          </td>
                        </tr>
                      )) || <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">لا توجد مدفوعات</td></tr>}
                    </tbody>
                  </table>
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

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
