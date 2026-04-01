import { motion } from 'framer-motion'
import {
  Store, ShoppingBag, MapPin, FileText, Calendar, DollarSign,
  TrendingUp, Plus, Eye, ArrowUpRight, Package, Star
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const booths = [
  { id: 'B-101', event: 'معرض الرياض 2026', location: 'القاعة A — الجناح 12', size: '3x4 م', status: 'confirmed', price: '45,000' },
  { id: 'B-205', event: 'بوليفارد وورلد', location: 'المنطقة C — الموقع 5', size: '5x5 م', status: 'pending', price: '80,000' },
  { id: 'B-310', event: 'مؤتمر التقنية', location: 'القاعة B — الجناح 3', size: '2x3 م', status: 'confirmed', price: '25,000' },
]

const services = [
  { name: 'كهرباء إضافية', price: '2,500', status: 'active' },
  { name: 'إنترنت عالي السرعة', price: '1,500', status: 'active' },
  { name: 'تصميم الجناح', price: '15,000', status: 'pending' },
  { name: 'شاشة عرض LED', price: '8,000', status: 'active' },
]

export default function MerchantPortalPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="بوابة التاجر"
        subtitle="إدارة الأجنحة والحجوزات والخدمات"
        actions={
          <button onClick={() => toast.info('حجز جناح — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            حجز جناح
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="الأجنحة المحجوزة" value="3" icon={Store} trend={0} trendLabel="حالياً" delay={0} />
        <StatsCard title="إجمالي المدفوعات" value={formatCurrency(150000)} icon={DollarSign} trend={0} trendLabel="هذا الموسم" delay={0.1} />
        <StatsCard title="الخدمات المفعّلة" value="4" icon={Package} trend={2} trendLabel="جديدة" delay={0.2} />
        <StatsCard title="التقييم" value="4.8/5" icon={Star} trend={0} trendLabel="ممتاز" delay={0.3} />
      </div>

      {/* My Booths */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card overflow-hidden mb-6">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-bold text-foreground">أجنحتي</h3>
        </div>
        <div className="divide-y divide-border/30">
          {booths.map((booth, i) => (
            <motion.div key={booth.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }} className="p-4 hover:bg-surface2/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Store size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{booth.event}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {booth.location}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground">{booth.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-mono text-[11px] text-muted-foreground">{booth.id}</span>
                  <span className="font-mono font-bold text-gold">{booth.price} ر.س</span>
                  <StatusBadge status={booth.status} />
                  <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Services */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">الخدمات الإضافية</h3>
          <button onClick={() => toast.info('طلب خدمة — قريباً')} className="h-7 px-3 rounded-lg bg-gold/10 border border-gold/20 text-[11px] font-medium text-gold hover:bg-gold/20 transition-all">+ طلب خدمة</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((service, i) => (
            <motion.div key={service.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.05 }} className="p-3 rounded-xl bg-surface2/30 border border-border/20 hover:border-gold/20 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{service.name}</p>
                  <p className="text-xs font-mono text-gold mt-0.5">{service.price} ر.س</p>
                </div>
                <StatusBadge status={service.status} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  )
}
