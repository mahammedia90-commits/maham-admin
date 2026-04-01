import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingCart, TrendingUp, DollarSign, Target, Users, Plus,
  ArrowUpRight, BarChart3, Briefcase, Award, Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const salesData = [
  { month: 'يناير', booths: 120000, sponsorships: 80000, services: 40000 },
  { month: 'فبراير', booths: 150000, sponsorships: 95000, services: 55000 },
  { month: 'مارس', booths: 200000, sponsorships: 120000, services: 70000 },
  { month: 'أبريل', booths: 180000, sponsorships: 110000, services: 65000 },
  { month: 'مايو', booths: 250000, sponsorships: 150000, services: 85000 },
  { month: 'يونيو', booths: 320000, sponsorships: 180000, services: 95000 },
]

const deals = [
  { id: 1, name: 'صفقة شركة الفيصل', value: '450,000', stage: 'تفاوض', probability: 75, rep: 'أحمد محمد', days: 12 },
  { id: 2, name: 'رعاية بنك الأهلي', value: '800,000', stage: 'عرض سعر', probability: 60, rep: 'سارة العلي', days: 5 },
  { id: 3, name: 'حجز أجنحة مجموعة المراعي', value: '320,000', stage: 'إغلاق', probability: 90, rep: 'خالد الحربي', days: 2 },
  { id: 4, name: 'خدمات لوجستية — DHL', value: '180,000', stage: 'تواصل', probability: 40, rep: 'فاطمة أحمد', days: 20 },
]

const topReps = [
  { name: 'أحمد محمد', deals: 12, revenue: '1.8M', avatar: 'أ' },
  { name: 'سارة العلي', deals: 10, revenue: '1.5M', avatar: 'س' },
  { name: 'خالد الحربي', deals: 8, revenue: '1.2M', avatar: 'خ' },
]

export default function SalesPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="إدارة المبيعات"
        subtitle="تتبع الصفقات وأداء فريق المبيعات"
        actions={
          <button onClick={() => toast.info('إنشاء صفقة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            صفقة جديدة
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي المبيعات" value={formatCurrency(4850000)} icon={DollarSign} trend={25} trendLabel="هذا الربع" delay={0} />
        <StatsCard title="الصفقات النشطة" value="24" icon={Briefcase} trend={8} trendLabel="هذا الشهر" delay={0.1} />
        <StatsCard title="معدل الإغلاق" value="68%" icon={Target} trend={5} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="متوسط قيمة الصفقة" value="202K" icon={Award} trend={12} trendLabel="زيادة" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Sales Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">المبيعات حسب القناة</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
              <Bar dataKey="booths" fill="#C9A84C" radius={[4, 4, 0, 0]} name="أجنحة" />
              <Bar dataKey="sponsorships" fill="#A0A0A0" radius={[4, 4, 0, 0]} name="رعايات" />
              <Bar dataKey="services" fill="#6B6B6B" radius={[4, 4, 0, 0]} name="خدمات" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Reps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">أفضل مندوبي المبيعات</h3>
          <div className="space-y-3">
            {topReps.map((rep, i) => (
              <div key={rep.name} className="flex items-center gap-3 p-3 rounded-xl bg-surface2/30 hover:bg-surface2/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                  {rep.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{rep.name}</p>
                  <p className="text-[11px] text-muted-foreground">{rep.deals} صفقة</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-mono font-bold text-gold">{rep.revenue}</p>
                  <p className="text-[10px] text-muted-foreground">ر.س</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Active Deals */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-bold text-foreground">الصفقات النشطة</h3>
        </div>
        <div className="divide-y divide-border/30">
          {deals.map((deal, i) => (
            <motion.div key={deal.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.05 }} className="p-4 hover:bg-surface2/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Briefcase size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{deal.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">{deal.rep}</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-0.5"><Clock size={10} /> {deal.days} يوم</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <p className="text-muted-foreground">القيمة</p>
                    <p className="font-mono font-bold text-gold">{deal.value}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">المرحلة</p>
                    <p className="font-medium text-foreground">{deal.stage}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">الاحتمالية</p>
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 rounded-full bg-surface3">
                        <div className={cn('h-full rounded-full', deal.probability >= 80 ? 'bg-success' : deal.probability >= 50 ? 'bg-warning' : 'bg-chrome')} style={{ width: `${deal.probability}%` }} />
                      </div>
                      <span className="font-mono">{deal.probability}%</span>
                    </div>
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
    </AdminLayout>
  )
}
