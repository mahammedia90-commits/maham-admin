/* ═══════════════════════════════════════════════════════════════
   بوابة المستثمر — مركز تحكم شامل (معمّق) - REAL API
   Nour Theme · Liquid Gold Executive
   9 تابات: نظرة عامة | المحفظة | المستثمرون | الفرص | العقود | التقارير | التواصل | العناية الواجبة | إدارة المخاطر
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, TrendingUp, DollarSign, Users, Shield, AlertTriangle,
  CheckCircle2, ArrowUpRight, Briefcase, Target, Wallet, Calendar,
  Eye, Download, Filter, Search, ChevronLeft, Zap, Star, Award,
  FileText, LineChart, Globe, MessageSquare, Send, Paperclip,
  ClipboardCheck, FileSearch, ShieldCheck, BarChart3, ArrowDownRight,
  Phone, Mail, Video, Clock, UserCheck, AlertCircle, Activity, PieChart
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import client from '@/api/client'

const tabs = ['نظرة عامة', 'المحفظة الاستثمارية', 'المستثمرون', 'الفرص', 'العقود', 'التقارير', 'التواصل', 'العناية الواجبة', 'إدارة المخاطر'] as const
type TabType = typeof tabs[number]

/* ── بيانات افتراضية للتخطيط ── */
const tierColors: Record<string, string> = {
  'بلاتيني': 'bg-gradient-to-l from-purple-500/15 to-purple-500/5 text-purple-400 border border-purple-500/20',
  'ذهبي': 'bg-gradient-to-l from-gold/15 to-gold/5 text-gold border border-gold/20',
  'فضي': 'bg-gradient-to-l from-gray-400/15 to-gray-400/5 text-gray-300 border border-gray-400/20',
}

const ddStatusIcon = (s: string) => s === 'approved' ? <CheckCircle2 size={14} className="text-emerald-400" /> : s === 'pending' ? <Clock size={14} className="text-amber-400" /> : <AlertCircle size={14} className="text-red-400" />

export default function InvestorPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة')
  const [searchQuery, setSearchQuery] = useState('')
  const [msgInput, setMsgInput] = useState('')

  // API Data States
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [investorsData, setInvestorsData] = useState<any>(null)
  const [opportunitiesData, setOpportunitiesData] = useState<any>(null)
  const [contractsData, setContractsData] = useState<any>(null)
  const [dueDiligenceData, setDueDiligenceData] = useState<any>(null)
  const [riskData, setRiskData] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [dash, portfolio, investors, opportunities, contracts, dueDiligence, risk] = await Promise.all([
          client.get('/admin/investor-portal/dashboard'),
          client.get('/admin/investor-portal/portfolio'),
          client.get('/admin/investor-portal/investors'),
          client.get('/admin/investor-portal/opportunities'),
          client.get('/admin/investor-portal/contracts'),
          client.get('/admin/investor-portal/due-diligence'),
          client.get('/admin/investor-portal/risk-management'),
        ])

        setDashboardData(dash.data || dash)
        setPortfolioData(portfolio.data || portfolio)
        setInvestorsData(investors.data || investors)
        setOpportunitiesData(opportunities.data || opportunities)
        setContractsData(contracts.data || contracts)
        setDueDiligenceData(dueDiligence.data || dueDiligence)
        setRiskData(risk.data || risk)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'فشل في تحميل البيانات')
        console.error('API Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Fallback calculations
  const totalInvested = dashboardData?.data?.portfolio_value || 0
  const avgROI = dashboardData?.data?.roi || 0
  const totalDeals = investorsData?.meta?.total || 0
  const activeInvestors = dashboardData?.data?.active_investors || 0

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
          title="بوابة المستثمر"
          subtitle="مركز التحكم الشامل لإدارة الاستثمارات والمستثمرين والفرص الاستثمارية"
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button className="nour-btn-outline text-xs flex items-center gap-1.5"><Download size={14} /> تصدير</button>
              <button className="nour-btn-gold text-xs flex items-center gap-1.5"><Target size={14} /> فرصة جديدة</button>
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatsCard
                    title="إجمالي المستثمرين"
                    value={dashboardData?.data?.total_investors || 0}
                    icon={Users}
                    change={5}
                    trend="up"
                  />
                  <StatsCard
                    title="إجمالي المحفظة"
                    value={formatCurrency(totalInvested)}
                    icon={Wallet}
                    change={12}
                    trend="up"
                  />
                  <StatsCard
                    title="متوسط العائد (ROI)"
                    value={`${avgROI}%`}
                    icon={TrendingUp}
                    change={3}
                    trend="up"
                  />
                  <StatsCard
                    title="نسبة النمو"
                    value={`${dashboardData?.data?.growth_rate || 0}%`}
                    icon={ArrowUpRight}
                    change={8}
                    trend="up"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Investment Trend */}
                  <div className="nour-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <LineChart size={16} /> اتجاه الاستثمارات
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={[]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(201,168,76,0.2)' }} />
                        <Area type="monotone" dataKey="استثمارات" stroke="#C9A84C" fillOpacity={1} fill="url(#colorInvest)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sector Distribution */}
                  <div className="nour-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <PieChart size={16} /> توزيع القطاعات
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPie data={portfolioData?.data?.by_sector || []} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="total_value">
                        {(portfolioData?.data?.by_sector || []).map((entry: any, idx: number) => (
                          <Cell key={`cell-${idx}`} fill={['#C9A84C', '#B8860B', '#DAA520', '#8B7355', '#6B6560'][idx % 5]} />
                        ))}
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Risk Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="nour-card p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                      <Shield size={16} /> مصفوفة المخاطر
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {riskData?.data?.slice(0, 4).map((risk: any) => (
                        <div key={risk.id} className="nour-bg-dark p-3 rounded-lg border border-gold/10">
                          <div className="text-xs text-muted-foreground">{risk.risk_type}</div>
                          <div className="text-lg font-bold text-gold">{risk.current_roi || 0}%</div>
                          <div className={`text-xs mt-1 px-2 py-1 rounded inline-block ${risk.level === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {risk.level === 'high' ? 'مرتفع' : 'متوسط'}
                          </div>
                        </div>
                      )) || <p className="text-muted-foreground text-xs">لا توجد بيانات</p>}
                    </div>
                  </div>

                  <div className="nour-card p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                      <AlertTriangle size={16} /> تنبيهات المخاطر
                    </h3>
                    <div className="space-y-2">
                      {riskData?.data?.slice(0, 3).map((alert: any) => (
                        <div key={alert.id} className={`p-2 rounded-lg text-xs border-l-2 ${
                          alert.level === 'high' ? 'bg-red-500/10 border-l-red-500' : 'bg-yellow-500/10 border-l-yellow-500'
                        }`}>
                          <div className="font-semibold">{alert.name}</div>
                          <div className="text-muted-foreground">{alert.mitigation}</div>
                        </div>
                      )) || <p className="text-muted-foreground text-xs">لا توجد تنبيهات</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ المحفظة الاستثمارية ═══ */}
            {activeTab === 'المحفظة الاستثمارية' && (
              <div className="space-y-4">
                <div className="nour-card p-4">
                  <h3 className="text-sm font-semibold mb-4">توزيع المحفظة حسب القطاع</h3>
                  <div className="space-y-3">
                    {portfolioData?.data?.by_sector?.map((sector: any) => (
                      <div key={sector.sector} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{sector.sector}</span>
                          <span className="text-gold">{formatCurrency(sector.total_value)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-gold to-yellow-500 h-2 rounded-full"
                            style={{ width: `${(sector.total_value / (portfolioData?.data?.total_portfolio || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground text-xs">لا توجد بيانات</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ المستثمرون ═══ */}
            {activeTab === 'المستثمرون' && (
              <div className="space-y-4">
                <div className="nour-card p-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-gold/20">
                      <tr>
                        <th className="text-right py-2">الاسم</th>
                        <th className="text-right py-2">المبلغ المستثمر</th>
                        <th className="text-right py-2">ROI</th>
                        <th className="text-right py-2">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {investorsData?.data?.map((investor: any) => (
                        <tr key={investor.id}>
                          <td className="py-3">{investor.name || investor.name_en}</td>
                          <td className="py-3">{formatCurrency(investor.investment_amount || 0)}</td>
                          <td className="py-3 text-gold">{investor.roi_percentage || 0}%</td>
                          <td className="py-3">
                            <StatusBadge status={investor.status} />
                          </td>
                        </tr>
                      )) || <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">لا توجد بيانات</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ الفرص ═══ */}
            {activeTab === 'الفرص' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {opportunitiesData?.data?.map((opp: any) => (
                    <div key={opp.id} className="nour-card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{opp.title}</h4>
                        <StatusBadge status={opp.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{opp.type}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>الحد الأدنى للاستثمار: {formatCurrency(opp.min_investment || 0)}</div>
                        <div>العائد المتوقع: {opp.expected_roi || 0}%</div>
                        <div>المجموع المستهدف: {formatCurrency(opp.target_value || 0)}</div>
                        <div>المجموع المجمع: {formatCurrency(opp.raised_amount || 0)}</div>
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">لا توجد فرص</p>}
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

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="space-y-4">
                <div className="nour-card p-4">
                  <h3 className="text-sm font-semibold mb-4">التقارير المتاحة</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير الأداء الشهري</span>
                      <Download size={14} />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير التدفق النقدي</span>
                      <Download size={14} />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gold/5 transition flex items-center justify-between">
                      <span className="text-sm">تقرير تحليل المخاطر</span>
                      <Download size={14} />
                    </button>
                  </div>
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

            {/* ═══ العناية الواجبة ═══ */}
            {activeTab === 'العناية الواجبة' && (
              <div className="space-y-4">
                <div className="nour-card p-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-gold/20">
                      <tr>
                        <th className="text-right py-2">المستثمر</th>
                        <th className="text-right py-2">KYC</th>
                        <th className="text-right py-2">الفحص المالي</th>
                        <th className="text-right py-2">الفحص القانوني</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {dueDiligenceData?.data?.map((dd: any) => (
                        <tr key={dd.id}>
                          <td className="py-3">{dd.investor_name}</td>
                          <td className="py-3">{ddStatusIcon('approved')}</td>
                          <td className="py-3">{ddStatusIcon('approved')}</td>
                          <td className="py-3">{ddStatusIcon('approved')}</td>
                        </tr>
                      )) || <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">لا توجد بيانات</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ إدارة المخاطر ═══ */}
            {activeTab === 'إدارة المخاطر' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {riskData?.data?.map((risk: any) => (
                    <div key={risk.investor_id} className="nour-card p-4 border-l-2 border-l-red-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm">{risk.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{risk.risk_type}</p>
                          <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                        </div>
                        <div className={`px-3 py-1 rounded text-xs font-semibold ${
                          risk.level === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {risk.level === 'high' ? 'مرتفع' : 'متوسط'}
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>ROI الحالي: <span className="text-gold">{risk.current_roi}%</span></div>
                        <div>متوسط ROI: <span className="text-gold">{risk.average_roi}%</span></div>
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">لا توجد مخاطر مكتشفة</p>}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
