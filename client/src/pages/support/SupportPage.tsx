// Design: Nour Theme — Support Module
// 5 tabs: Tickets, Knowledge Base, Live Chat, Ratings, Stats
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Headphones, MessageCircle, BookOpen, Star, BarChart3, Plus,
  Clock, CheckCircle, AlertCircle, Users, Search, Send,
  ThumbsUp, ThumbsDown, TrendingUp, Mail, Phone, MessageSquare
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'tickets', label: 'التذاكر', icon: Headphones },
  { id: 'knowledge', label: 'قاعدة المعرفة', icon: BookOpen },
  { id: 'chat', label: 'الدردشة الحية', icon: MessageCircle },
  { id: 'ratings', label: 'التقييمات', icon: Star },
  { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
]

const tickets = [
  { id: 'TKT-001', subject: 'مشكلة في حجز الجناح A-12', requester: 'أحمد الراشد', requesterType: 'مستثمر', priority: 'high', status: 'open', category: 'حجوزات', created: '2026-04-01T10:30:00', agent: 'سارة العلي', channel: 'email' },
  { id: 'TKT-002', subject: 'طلب تعديل عقد الرعاية', requester: 'شركة STC', requesterType: 'راعي', priority: 'medium', status: 'in_progress', category: 'عقود', created: '2026-04-01T09:00:00', agent: 'خالد الحربي', channel: 'phone' },
  { id: 'TKT-003', subject: 'استفسار عن خدمات التأثيث', requester: 'محمد العنزي', requesterType: 'تاجر', priority: 'low', status: 'open', category: 'خدمات', created: '2026-04-01T08:15:00', agent: null, channel: 'chat' },
  { id: 'TKT-004', subject: 'مشكلة في الدفع الإلكتروني', requester: 'فهد الدوسري', requesterType: 'مستثمر', priority: 'urgent', status: 'in_progress', category: 'مدفوعات', created: '2026-03-31T16:00:00', agent: 'سارة العلي', channel: 'email' },
  { id: 'TKT-005', subject: 'طلب شهادة مشاركة', requester: 'نورة القحطاني', requesterType: 'تاجر', priority: 'low', status: 'resolved', category: 'عام', created: '2026-03-30T14:00:00', agent: 'خالد الحربي', channel: 'phone' },
  { id: 'TKT-006', subject: 'تغيير موقع الجناح', requester: 'ريم الحربي', requesterType: 'راعي', priority: 'medium', status: 'resolved', category: 'حجوزات', created: '2026-03-29T11:00:00', agent: 'سارة العلي', channel: 'email' },
]

const knowledgeArticles = [
  { id: 1, title: 'كيفية حجز جناح في المعرض', category: 'حجوزات', views: 1250, helpful: 92, updated: '2026-03-20' },
  { id: 2, title: 'شروط وأحكام الرعاية', category: 'رعايات', views: 890, helpful: 88, updated: '2026-03-18' },
  { id: 3, title: 'دليل خدمات العارضين', category: 'خدمات', views: 2100, helpful: 95, updated: '2026-03-25' },
  { id: 4, title: 'طرق الدفع المتاحة', category: 'مدفوعات', views: 1800, helpful: 90, updated: '2026-03-22' },
  { id: 5, title: 'سياسة الإلغاء والاسترداد', category: 'عام', views: 3200, helpful: 85, updated: '2026-03-15' },
  { id: 6, title: 'متطلبات التحقق من الهوية KYC', category: 'تحقق', views: 1500, helpful: 91, updated: '2026-03-28' },
]

const chatSessions = [
  { id: 1, visitor: 'أحمد محمد', type: 'مستثمر', status: 'active', messages: 8, duration: '12 دقيقة', agent: 'سارة العلي', topic: 'استفسار عن فرص الاستثمار' },
  { id: 2, visitor: 'خالد العتيبي', type: 'تاجر', status: 'active', messages: 5, duration: '6 دقائق', agent: 'خالد الحربي', topic: 'مشكلة في الحجز' },
  { id: 3, visitor: 'نورة السعيد', type: 'راعي', status: 'waiting', messages: 1, duration: '2 دقيقة', agent: null, topic: 'طلب عرض سعر' },
]

const ratingsData = [
  { id: 1, from: 'أحمد الراشد', type: 'مستثمر', rating: 5, comment: 'خدمة ممتازة وسرعة في الرد', date: '2026-04-01', agent: 'سارة العلي' },
  { id: 2, from: 'محمد العنزي', type: 'تاجر', rating: 4, comment: 'جيد لكن يحتاج تحسين في سرعة الرد', date: '2026-03-31', agent: 'خالد الحربي' },
  { id: 3, from: 'شركة STC', type: 'راعي', rating: 5, comment: 'احترافية عالية في التعامل', date: '2026-03-30', agent: 'سارة العلي' },
  { id: 4, from: 'فهد الدوسري', type: 'مستثمر', rating: 3, comment: 'المشكلة لم تُحل بالكامل', date: '2026-03-29', agent: 'خالد الحربي' },
]

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('tickets')
  const [ticketFilter, setTicketFilter] = useState('all')

  return (
    <AdminLayout>
      <PageHeader title="خدمة العملاء" subtitle="إدارة التذاكر والدردشة وقاعدة المعرفة والتقييمات" actions={
        <button onClick={() => toast.info('تذكرة جديدة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> تذكرة جديدة</button>
      } />

      <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border/50 overflow-x-auto mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-surface2/50')}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="تذاكر مفتوحة" value="4" icon={AlertCircle} delay={0} />
                <StatsCard title="قيد المعالجة" value="2" icon={Clock} delay={0.1} />
                <StatsCard title="تم الحل" value="18" icon={CheckCircle} delay={0.2} />
                <StatsCard title="متوسط الرد" value="45 دقيقة" icon={TrendingUp} trend={-15} delay={0.3} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                {['all', 'open', 'in_progress', 'resolved'].map(f => (
                  <button key={f} onClick={() => setTicketFilter(f)} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', ticketFilter === f ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground border border-transparent')}>
                    {f === 'all' ? 'الكل' : f === 'open' ? 'مفتوحة' : f === 'in_progress' ? 'قيد المعالجة' : 'محلولة'}
                  </button>
                ))}
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['التذكرة', 'مقدم الطلب', 'الفئة', 'الأولوية', 'الحالة', 'الوكيل', 'القناة'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {tickets.filter(t => ticketFilter === 'all' || t.status === ticketFilter).map((t, i) => (
                      <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors cursor-pointer">
                        <td className="p-4"><div><p className="text-sm font-bold text-foreground">{t.subject}</p><p className="text-[10px] font-mono text-muted-foreground">{t.id}</p></div></td>
                        <td className="p-4"><div><p className="text-sm text-foreground">{t.requester}</p><p className="text-[10px] text-gold">{t.requesterType}</p></div></td>
                        <td className="p-4 text-xs text-muted-foreground">{t.category}</td>
                        <td className="p-4"><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', t.priority === 'urgent' ? 'bg-danger/15 text-danger' : t.priority === 'high' ? 'bg-warning/15 text-warning' : t.priority === 'medium' ? 'bg-info/15 text-info' : 'bg-surface2 text-muted-foreground')}>{t.priority === 'urgent' ? 'عاجل' : t.priority === 'high' ? 'عالي' : t.priority === 'medium' ? 'متوسط' : 'منخفض'}</span></td>
                        <td className="p-4"><StatusBadge status={t.status === 'resolved' ? 'approved' : t.status === 'in_progress' ? 'pending' : 'draft'} /></td>
                        <td className="p-4 text-sm text-muted-foreground">{t.agent || '—'}</td>
                        <td className="p-4"><div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', t.channel === 'email' ? 'bg-gold/10 text-gold' : t.channel === 'phone' ? 'bg-info/10 text-info' : 'bg-success/10 text-success')}>{t.channel === 'email' ? <Mail size={12} /> : t.channel === 'phone' ? <Phone size={12} /> : <MessageSquare size={12} />}</div></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-4">
              <div className="glass-card p-4 flex items-center gap-3">
                <Search size={16} className="text-muted-foreground" />
                <input type="text" placeholder="ابحث في قاعدة المعرفة..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {knowledgeArticles.map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 hover:border-gold/30 transition-colors cursor-pointer">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-medium">{a.category}</span>
                    <h4 className="text-sm font-bold text-foreground mt-3 mb-2">{a.title}</h4>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users size={10} /> {a.views} مشاهدة</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={10} /> {a.helpful}% مفيد</span>
                      <span>{formatDate(a.updated)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="محادثات نشطة" value="2" icon={MessageCircle} delay={0} />
                <StatsCard title="في الانتظار" value="1" icon={Clock} delay={0.1} />
                <StatsCard title="محادثات اليوم" value="15" icon={Send} delay={0.2} />
              </div>
              <div className="space-y-3">
                {chatSessions.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 hover:border-gold/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold', c.status === 'active' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20')}>{c.visitor[0]}</div>
                        <div><p className="text-sm font-bold text-foreground">{c.visitor}</p><p className="text-[10px] text-muted-foreground">{c.type} • {c.topic}</p></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left"><p className="text-xs text-foreground">{c.messages} رسائل</p><p className="text-[10px] text-muted-foreground">{c.duration}</p></div>
                        <span className={cn('w-2 h-2 rounded-full', c.status === 'active' ? 'bg-success animate-pulse' : 'bg-warning animate-pulse')} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="متوسط التقييم" value="4.3 / 5" icon={Star} delay={0} />
                <StatsCard title="إجمالي التقييمات" value="156" icon={Users} delay={0.1} />
                <StatsCard title="إيجابية" value="89%" icon={ThumbsUp} trend={5} delay={0.2} />
                <StatsCard title="سلبية" value="11%" icon={ThumbsDown} trend={-3} delay={0.3} />
              </div>
              <div className="space-y-3">
                {ratingsData.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">{r.from[0]}</div>
                        <div><p className="text-sm font-bold text-foreground">{r.from}</p><p className="text-[10px] text-muted-foreground">{r.type} • الوكيل: {r.agent}</p></div>
                      </div>
                      <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, s) => (<Star key={s} size={14} className={s < r.rating ? 'text-gold fill-gold' : 'text-surface3'} />))}</div>
                    </div>
                    <p className="text-sm text-muted-foreground pr-13">{r.comment}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 pr-13">{formatDate(r.date)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="تذاكر هذا الشهر" value="68" icon={Headphones} trend={12} delay={0} />
                <StatsCard title="معدل الحل" value="94%" icon={CheckCircle} trend={3} delay={0.1} />
                <StatsCard title="رضا العملاء" value="4.3/5" icon={Star} trend={5} delay={0.2} />
                <StatsCard title="أول رد" value="22 دقيقة" icon={Clock} trend={-18} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">توزيع التذاكر حسب الفئة</h3>
                  {[{ cat: 'حجوزات', count: 25, pct: 37 }, { cat: 'مدفوعات', count: 18, pct: 26 }, { cat: 'خدمات', count: 12, pct: 18 }, { cat: 'عقود', count: 8, pct: 12 }, { cat: 'عام', count: 5, pct: 7 }].map((c, i) => (
                    <div key={i} className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-muted-foreground w-16">{c.cat}</span>
                      <div className="flex-1 h-2 rounded-full bg-surface3"><div className="h-full rounded-full bg-gold" style={{ width: `${c.pct}%` }} /></div>
                      <span className="text-xs font-mono text-foreground w-8">{c.count}</span>
                    </div>
                  ))}
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">أداء الوكلاء</h3>
                  {[{ name: 'سارة العلي', resolved: 32, rating: 4.7, avgTime: '18 دقيقة' }, { name: 'خالد الحربي', resolved: 24, rating: 4.2, avgTime: '25 دقيقة' }, { name: 'فاطمة أحمد', resolved: 12, rating: 4.5, avgTime: '20 دقيقة' }].map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface2/30 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs">{a.name[0]}</div>
                      <div className="flex-1"><p className="text-xs font-bold text-foreground">{a.name}</p><p className="text-[10px] text-muted-foreground">{a.resolved} تذكرة محلولة</p></div>
                      <div className="text-left"><p className="text-xs text-gold flex items-center gap-0.5"><Star size={10} className="fill-gold" /> {a.rating}</p><p className="text-[10px] text-muted-foreground">{a.avgTime}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
