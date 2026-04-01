import { useRoute, useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, DollarSign, Clock, Globe, Edit, Trash2, Eye, BarChart3, UserCheck } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate, formatCurrency, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

export default function EventDetailPage() {
  const [match, params] = useRoute('/events/:id')
  const [, navigate] = useLocation()

  return (
    <AdminLayout>
      <PageHeader
        title="تفاصيل الفعالية"
        subtitle={`فعالية رقم #${params?.id}`}
        showBack
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/events/${params?.id}/edit`)}
              className="h-9 px-4 rounded-xl border border-gold/20 text-sm font-medium text-gold hover:bg-gold/10 transition-all flex items-center gap-2"
            >
              <Edit size={14} />
              تعديل
            </button>
            <button
              onClick={() => toast.success('تم نشر الفعالية')}
              className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"
            >
              <Globe size={14} />
              نشر
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">معرض ماهم إكسبو الدولي</h2>
                <p className="text-sm text-muted-foreground mt-1">معرض تجاري — الرياض</p>
              </div>
              <StatusBadge status="published" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              معرض دولي متخصص في عرض أحدث المنتجات والخدمات في مجال التقنية والابتكار. يجمع المعرض بين المستثمرين والتجار والرعاة من مختلف أنحاء المنطقة.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'المسجلون', value: '847', icon: Users, color: 'text-gold' },
              { label: 'الإيرادات', value: '٤٥٠,٠٠٠', icon: DollarSign, color: 'text-success' },
              { label: 'الأكشاك', value: '120', icon: BarChart3, color: 'text-info' },
              { label: 'الرعاة', value: '15', icon: UserCheck, color: 'text-chrome' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-4 text-center"
              >
                <stat.icon size={18} className={cn('mx-auto mb-2', stat.color)} />
                <p className="text-lg font-bold text-foreground font-mono">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">معلومات الفعالية</h3>
            <div className="space-y-3">
              {[
                { icon: Calendar, label: 'تاريخ البدء', value: '15 مايو 2026' },
                { icon: Calendar, label: 'تاريخ الانتهاء', value: '18 مايو 2026' },
                { icon: MapPin, label: 'الموقع', value: 'مركز الرياض الدولي للمعارض' },
                { icon: Users, label: 'السعة', value: '2,000 شخص' },
                { icon: Clock, label: 'المدة', value: '4 أيام' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center">
                    <item.icon size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{item.label}</p>
                    <p className="text-sm text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">نسبة الإشغال</h3>
            <div className="relative w-full h-3 rounded-full bg-surface3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-l from-gold to-gold-light"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">847 / 2,000</span>
              <span className="text-xs font-bold text-gold">72%</span>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
