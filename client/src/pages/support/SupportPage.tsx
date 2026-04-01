import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Headphones, MessageSquare, Clock, CheckCircle, AlertTriangle,
  Users, Star, TrendingUp, Plus, Eye, Phone, Mail
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const tickets = [
  { id: 'T-2026-001', subject: 'مشكلة في حجز الجناح', customer: 'شركة الفيصل', priority: 'high', status: 'open', assignee: 'أحمد', time: 'منذ 2 ساعة', channel: 'email' },
  { id: 'T-2026-002', subject: 'استفسار عن الأسعار', customer: 'مؤسسة النور', priority: 'medium', status: 'in_progress', assignee: 'سارة', time: 'منذ 4 ساعات', channel: 'phone' },
  { id: 'T-2026-003', subject: 'طلب تغيير موقع الجناح', customer: 'مجموعة المراعي', priority: 'low', status: 'resolved', assignee: 'خالد', time: 'منذ يوم', channel: 'chat' },
  { id: 'T-2026-004', subject: 'مشكلة في الدفع الإلكتروني', customer: 'شركة التقنية', priority: 'high', status: 'open', assignee: 'فاطمة', time: 'منذ 30 دقيقة', channel: 'email' },
  { id: 'T-2026-005', subject: 'طلب فاتورة ضريبية', customer: 'بنك الأهلي', priority: 'medium', status: 'resolved', assignee: 'أحمد', time: 'منذ 3 أيام', channel: 'phone' },
]

export default function SupportPage() {
  const [filter, setFilter] = useState('all')

  return (
    <AdminLayout>
      <PageHeader
        title="خدمة العملاء"
        subtitle="إدارة التذاكر والدعم الفني"
        actions={
          <button onClick={() => toast.info('إنشاء تذكرة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            تذكرة جديدة
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="التذاكر المفتوحة" value="12" icon={MessageSquare} trend={-3} trendLabel="أقل" delay={0} />
        <StatsCard title="متوسط الاستجابة" value="2.4 ساعة" icon={Clock} trend={15} trendLabel="أسرع" delay={0.1} />
        <StatsCard title="نسبة الحل" value="94%" icon={CheckCircle} trend={5} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="رضا العملاء" value="4.7/5" icon={Star} trend={8} trendLabel="تحسن" delay={0.3} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        {['all', 'open', 'in_progress', 'resolved'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', filter === f ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground border border-transparent')}>
            {f === 'all' ? 'الكل' : f === 'open' ? 'مفتوحة' : f === 'in_progress' ? 'قيد المعالجة' : 'محلولة'}
          </button>
        ))}
      </div>

      {/* Tickets */}
      <div className="glass-card overflow-hidden">
        <div className="divide-y divide-border/30">
          {tickets.filter(t => filter === 'all' || t.status === filter).map((ticket, i) => (
            <motion.div key={ticket.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-4 hover:bg-surface2/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    ticket.channel === 'email' ? 'bg-gold/10 text-gold' : ticket.channel === 'phone' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'
                  )}>
                    {ticket.channel === 'email' ? <Mail size={16} /> : ticket.channel === 'phone' ? <Phone size={16} /> : <MessageSquare size={16} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">{ticket.id}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', ticket.priority === 'high' ? 'bg-danger/15 text-danger' : ticket.priority === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info')}>
                        {ticket.priority === 'high' ? 'عاجل' : ticket.priority === 'medium' ? 'متوسط' : 'عادي'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-0.5">{ticket.subject}</p>
                    <p className="text-[11px] text-muted-foreground">{ticket.customer} — {ticket.assignee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> {ticket.time}</span>
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
