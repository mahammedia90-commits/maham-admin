import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award, DollarSign, TrendingUp, Users, Plus, Eye, Star,
  Crown, Medal, Shield, ArrowUpRight, BarChart3
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const sponsorTiers = [
  { tier: 'بلاتيني', icon: Crown, color: 'text-gold', bg: 'bg-gold/10 border-gold/20', count: 3, value: '2.4M' },
  { tier: 'ذهبي', icon: Medal, color: 'text-gold-light', bg: 'bg-gold/8 border-gold/15', count: 8, value: '1.6M' },
  { tier: 'فضي', icon: Shield, color: 'text-chrome', bg: 'bg-chrome/10 border-chrome/20', count: 15, value: '900K' },
  { tier: 'برونزي', icon: Star, color: 'text-chrome-dark', bg: 'bg-surface2 border-border/30', count: 22, value: '440K' },
]

const sponsors = [
  { id: 1, name: 'بنك الأهلي السعودي', tier: 'بلاتيني', value: '800,000', status: 'active', roi: '+320%', events: 5 },
  { id: 2, name: 'STC', tier: 'بلاتيني', value: '750,000', status: 'active', roi: '+280%', events: 4 },
  { id: 3, name: 'أرامكو', tier: 'بلاتيني', value: '850,000', status: 'active', roi: '+350%', events: 6 },
  { id: 4, name: 'شركة المراعي', tier: 'ذهبي', value: '300,000', status: 'active', roi: '+180%', events: 3 },
  { id: 5, name: 'شركة سابك', tier: 'ذهبي', value: '250,000', status: 'pending', roi: '—', events: 0 },
  { id: 6, name: 'مجموعة الفيصلية', tier: 'فضي', value: '100,000', status: 'active', roi: '+120%', events: 2 },
]

export default function SponsorsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="الرعاة والشركاء"
        subtitle="إدارة الرعايات وحزم الشراكة وتتبع ROI"
        actions={
          <button onClick={() => toast.info('إضافة راعٍ — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            إضافة راعٍ
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الرعاة" value="48" icon={Award} trend={12} trendLabel="هذا الربع" delay={0} />
        <StatsCard title="قيمة الرعايات" value={formatCurrency(5340000)} icon={DollarSign} trend={25} trendLabel="نمو" delay={0.1} />
        <StatsCard title="متوسط ROI" value="+215%" icon={TrendingUp} trend={18} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="معدل التجديد" value="82%" icon={Users} trend={5} trendLabel="تحسن" delay={0.3} />
      </div>

      {/* Sponsor Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {sponsorTiers.map((tier, i) => (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className={cn('glass-card p-4 border', tier.bg)}
          >
            <div className="flex items-center gap-2 mb-2">
              <tier.icon size={18} className={tier.color} />
              <h4 className="text-sm font-bold text-foreground">{tier.tier}</h4>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{tier.count} راعٍ</span>
              <span className="text-sm font-mono font-bold text-gold">{tier.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sponsors List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-bold text-foreground">قائمة الرعاة</h3>
        </div>
        <div className="divide-y divide-border/30">
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              className="p-4 hover:bg-surface2/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                    {sponsor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{sponsor.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full',
                        sponsor.tier === 'بلاتيني' ? 'bg-gold/15 text-gold' :
                        sponsor.tier === 'ذهبي' ? 'bg-gold/10 text-gold-light' :
                        'bg-chrome/10 text-chrome'
                      )}>{sponsor.tier}</span>
                      <span className="text-[11px] text-muted-foreground">{sponsor.events} فعاليات</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <p className="text-muted-foreground">القيمة</p>
                    <p className="font-mono font-bold text-gold">{sponsor.value}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">ROI</p>
                    <p className={cn('font-mono font-bold', sponsor.roi.startsWith('+') ? 'text-success' : 'text-muted-foreground')}>{sponsor.roi}</p>
                  </div>
                  <StatusBadge status={sponsor.status} />
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
