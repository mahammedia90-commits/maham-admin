import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Megaphone, BarChart3, Eye, TrendingUp, Globe, Mail, Share2,
  Plus, Target, Zap, MousePointer, Users, ArrowUpRight
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

const campaignPerformance = [
  { week: 'الأسبوع 1', impressions: 45000, clicks: 3200, conversions: 180 },
  { week: 'الأسبوع 2', impressions: 52000, clicks: 4100, conversions: 220 },
  { week: 'الأسبوع 3', impressions: 68000, clicks: 5500, conversions: 310 },
  { week: 'الأسبوع 4', impressions: 75000, clicks: 6200, conversions: 380 },
]

const campaigns = [
  { id: 1, name: 'حملة معرض الرياض 2026', channel: 'Google Ads', status: 'active', budget: '50,000', spent: '32,400', roi: '+245%', impressions: '1.2M', clicks: '45K' },
  { id: 2, name: 'حملة البريد — دعوات VIP', channel: 'Email', status: 'active', budget: '5,000', spent: '3,200', roi: '+180%', impressions: '25K', clicks: '8.5K' },
  { id: 3, name: 'حملة السوشال ميديا', channel: 'Instagram', status: 'paused', budget: '30,000', spent: '18,000', roi: '+120%', impressions: '850K', clicks: '32K' },
  { id: 4, name: 'حملة إعادة الاستهداف', channel: 'Facebook', status: 'draft', budget: '20,000', spent: '0', roi: '—', impressions: '0', clicks: '0' },
]

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns')

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة التسويق"
        subtitle="الحملات التسويقية وتحليل الأداء"
        actions={
          <button onClick={() => toast.info('إنشاء حملة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            حملة جديدة
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الانطباعات" value="3.1M" icon={Eye} trend={28} trendLabel="هذا الشهر" delay={0} />
        <StatsCard title="النقرات" value="91.7K" icon={MousePointer} trend={15} trendLabel="هذا الشهر" delay={0.1} />
        <StatsCard title="معدل التحويل" value="4.2%" icon={Target} trend={12} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="ROI" value="+182%" icon={TrendingUp} trend={22} trendLabel="هذا الربع" delay={0.3} />
      </div>

      {/* Performance Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 mb-6">
        <h3 className="text-sm font-bold text-foreground mb-4">أداء الحملات</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={campaignPerformance}>
            <defs>
              <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v/1000}k`} />
            <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
            <Area type="monotone" dataKey="impressions" stroke="#C9A84C" fill="url(#impGrad)" strokeWidth={2} name="الانطباعات" />
            <Area type="monotone" dataKey="clicks" stroke="#A0A0A0" fill="transparent" strokeWidth={2} name="النقرات" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Campaigns List */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-bold text-foreground">الحملات التسويقية</h3>
        </div>
        <div className="divide-y divide-border/30">
          {campaigns.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="p-4 hover:bg-surface2/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Megaphone size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Globe size={10} /> {campaign.channel}
                      </span>
                      <StatusBadge status={campaign.status} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center hidden sm:block">
                    <p className="text-muted-foreground">الميزانية</p>
                    <p className="font-mono font-medium text-foreground">{campaign.budget}</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-muted-foreground">المصروف</p>
                    <p className="font-mono font-medium text-foreground">{campaign.spent}</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-muted-foreground">الانطباعات</p>
                    <p className="font-mono font-medium text-foreground">{campaign.impressions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">ROI</p>
                    <p className={cn('font-mono font-bold', campaign.roi.startsWith('+') ? 'text-success' : 'text-muted-foreground')}>{campaign.roi}</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors">
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
