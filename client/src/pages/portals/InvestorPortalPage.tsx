import { motion } from 'framer-motion'
import {
  TrendingUp, DollarSign, BarChart3, PieChart, Building2,
  ArrowUpRight, Globe, Shield, Eye, Calendar, Briefcase
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'

const investmentData = [
  { month: 'يناير', value: 2400000, returns: 180000 },
  { month: 'فبراير', value: 2650000, returns: 210000 },
  { month: 'مارس', value: 3100000, returns: 280000 },
  { month: 'أبريل', value: 3500000, returns: 320000 },
  { month: 'مايو', value: 4200000, returns: 410000 },
  { month: 'يونيو', value: 4800000, returns: 480000 },
]

const opportunities = [
  { id: 1, name: 'معرض الرياض الدولي 2026', type: 'معرض', minInvestment: '500,000', expectedROI: '+35%', status: 'open', deadline: '2026-04-30' },
  { id: 2, name: 'بوليفارد وورلد — موسم الرياض', type: 'تجاري', minInvestment: '1,000,000', expectedROI: '+45%', status: 'open', deadline: '2026-05-15' },
  { id: 3, name: 'مؤتمر التقنية المالية', type: 'مؤتمر', minInvestment: '250,000', expectedROI: '+28%', status: 'closing_soon', deadline: '2026-04-10' },
]

export default function InvestorPortalPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="بوابة المستثمر"
        subtitle="فرص الاستثمار والعوائد وتحليل الأداء"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الاستثمارات" value={formatCurrency(15800000)} icon={DollarSign} trend={32} trendLabel="نمو سنوي" delay={0} />
        <StatsCard title="العوائد المحققة" value={formatCurrency(1880000)} icon={TrendingUp} trend={28} trendLabel="هذا الربع" delay={0.1} />
        <StatsCard title="المستثمرون النشطون" value="42" icon={Building2} trend={15} trendLabel="جديد" delay={0.2} />
        <StatsCard title="الفرص المتاحة" value="8" icon={Globe} trend={3} trendLabel="جديدة" delay={0.3} />
      </div>

      {/* Investment Performance Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 mb-6">
        <h3 className="text-sm font-bold text-foreground mb-4">أداء الاستثمارات</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={investmentData}>
            <defs>
              <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
            <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
            <Area type="monotone" dataKey="value" stroke="#C9A84C" fill="url(#invGrad)" strokeWidth={2} name="قيمة الاستثمار" />
            <Area type="monotone" dataKey="returns" stroke="#22c55e" fill="url(#retGrad)" strokeWidth={2} name="العوائد" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Investment Opportunities */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-bold text-foreground">فرص الاستثمار المتاحة</h3>
        </div>
        <div className="divide-y divide-border/30">
          {opportunities.map((opp, i) => (
            <motion.div key={opp.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.05 }} className="p-4 hover:bg-surface2/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Briefcase size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{opp.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold">{opp.type}</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> حتى {opp.deadline}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center hidden sm:block">
                    <p className="text-muted-foreground">الحد الأدنى</p>
                    <p className="font-mono font-medium text-foreground">{opp.minInvestment} ر.س</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">العائد المتوقع</p>
                    <p className="font-mono font-bold text-success">{opp.expectedROI}</p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-1 rounded-full', opp.status === 'open' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning')}>
                    {opp.status === 'open' ? 'متاح' : 'يغلق قريباً'}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors">
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  )
}
