import { motion } from 'framer-motion'
import {
  Award, Crown, BarChart3, Eye, TrendingUp, DollarSign,
  Globe, Users, Calendar, ArrowUpRight, Zap, Target
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'

const exposureData = [
  { name: 'شاشات LED', value: 35, color: '#C9A84C' },
  { name: 'مطبوعات', value: 25, color: '#D4B96A' },
  { name: 'سوشال ميديا', value: 20, color: '#A0A0A0' },
  { name: 'موقع إلكتروني', value: 12, color: '#6B6B6B' },
  { name: 'أخرى', value: 8, color: '#4A4A4A' },
]

const sponsorships = [
  { id: 1, event: 'معرض الرياض الدولي 2026', tier: 'بلاتيني', value: '800,000', impressions: '2.5M', leads: 450, status: 'active' },
  { id: 2, event: 'بوليفارد وورلد', tier: 'ذهبي', value: '300,000', impressions: '1.2M', leads: 180, status: 'active' },
  { id: 3, event: 'مؤتمر التقنية المالية', tier: 'بلاتيني', value: '500,000', impressions: '800K', leads: 220, status: 'upcoming' },
]

export default function SponsorPortalPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="بوابة الراعي"
        subtitle="تتبع الرعايات والتعرض والعائد على الاستثمار"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الرعايات" value={formatCurrency(1600000)} icon={DollarSign} trend={0} trendLabel="هذا الموسم" delay={0} />
        <StatsCard title="إجمالي التعرض" value="4.5M" icon={Eye} trend={35} trendLabel="انطباع" delay={0.1} />
        <StatsCard title="العملاء المحتملون" value="850" icon={Users} trend={22} trendLabel="lead" delay={0.2} />
        <StatsCard title="ROI" value="+285%" icon={TrendingUp} trend={18} trendLabel="تحسن" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Exposure Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">توزيع التعرض</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={exposureData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {exposureData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {exposureData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-mono text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Sponsorships */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-sm font-bold text-foreground">رعاياتي</h3>
          </div>
          <div className="divide-y divide-border/30">
            {sponsorships.map((sp, i) => (
              <motion.div key={sp.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }} className="p-4 hover:bg-surface2/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Crown size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{sp.event}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold">{sp.tier}</span>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', sp.status === 'active' ? 'bg-success/15 text-success' : 'bg-info/15 text-info')}>
                          {sp.status === 'active' ? 'نشط' : 'قادم'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-xs">
                    <div className="text-center hidden sm:block">
                      <p className="text-muted-foreground">القيمة</p>
                      <p className="font-mono font-bold text-gold">{sp.value}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-muted-foreground">الانطباعات</p>
                      <p className="font-mono font-medium text-foreground">{sp.impressions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Leads</p>
                      <p className="font-mono font-medium text-foreground">{sp.leads}</p>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors">
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
