/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — الدعم الفني (Support & Helpdesk)
 * Features: تذاكر، قاعدة معرفة، إحصائيات، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Headphones, MessageSquare, Clock, CheckCircle, AlertTriangle,
  Users, Star, TrendingUp, Plus, Eye, Phone, Mail, X,
  Trash2, Search, BookOpen, LifeBuoy, Zap, Filter
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface Ticket {
  id: string; subject: string; customer: string; priority: string; status: string
  assignee: string; time: string; channel: string; description: string; category: string
}

const demoTickets: Ticket[] = [
  { id: 'T-2026-001', subject: 'مشكلة في حجز الجناح B-12', customer: 'شركة الفيصل للتجارة', priority: 'high', status: 'open', assignee: 'أحمد محمد', time: '2026-03-31 14:30', channel: 'email', description: 'العميل يواجه خطأ عند محاولة تأكيد حجز الجناح B-12 في معرض الرياض. الخطأ يظهر عند الدفع.', category: 'حجوزات' },
  { id: 'T-2026-002', subject: 'طلب تعديل موقع الجناح', customer: 'مجموعة المراعي', priority: 'medium', status: 'in_progress', assignee: 'سارة العلي', time: '2026-03-31 11:00', channel: 'phone', description: 'العميل يريد نقل جناحه من الموقع C-5 إلى A-3 بسبب قربه من المدخل الرئيسي.', category: 'تعديلات' },
  { id: 'T-2026-003', subject: 'استفسار عن باقات الرعاية', customer: 'بنك الراجحي', priority: 'low', status: 'open', assignee: 'فاطمة أحمد', time: '2026-03-30 16:45', channel: 'email', description: 'العميل يستفسر عن تفاصيل باقة الرعاية البلاتينية والخدمات المشمولة.', category: 'استفسارات' },
  { id: 'T-2026-004', subject: 'مشكلة في الفاتورة الإلكترونية', customer: 'شركة التقنية المتقدمة', priority: 'high', status: 'in_progress', assignee: 'نورة السبيعي', time: '2026-03-30 09:20', channel: 'email', description: 'الفاتورة الإلكترونية تظهر مبلغ خاطئ. الفرق 15,000 ر.س عن المبلغ المتفق عليه.', category: 'مالية' },
  { id: 'T-2026-005', subject: 'طلب خدمات إضافية للجناح', customer: 'شركة نسما القابضة', priority: 'medium', status: 'resolved', assignee: 'خالد الحربي', time: '2026-03-29 13:00', channel: 'phone', description: 'العميل يطلب إضافة شاشة LED كبيرة وتوصيلات كهربائية إضافية.', category: 'خدمات' },
  { id: 'T-2026-006', subject: 'شكوى من جودة الخدمة', customer: 'مؤسسة الحلول الذكية', priority: 'high', status: 'open', assignee: 'ريم الغامدي', time: '2026-03-29 10:30', channel: 'email', description: 'العميل غير راضٍ عن تأخر الرد على استفساراته. يطلب تعويض أو خصم.', category: 'شكاوى' },
  { id: 'T-2026-007', subject: 'طلب إلغاء حجز', customer: 'شركة الأفق للتطوير', priority: 'medium', status: 'resolved', assignee: 'تركي الشمري', time: '2026-03-28 15:00', channel: 'phone', description: 'العميل يطلب إلغاء حجز الجناح D-8 واسترداد المبلغ المدفوع.', category: 'إلغاءات' },
  { id: 'T-2026-008', subject: 'مشكلة تقنية في البوابة', customer: 'مجموعة بن لادن', priority: 'low', status: 'open', assignee: 'عمر الزهراني', time: '2026-03-28 11:15', channel: 'email', description: 'العميل لا يستطيع تسجيل الدخول إلى بوابة العارضين. يظهر خطأ 403.', category: 'تقنية' },
]

const priorityColors: Record<string, string> = { high: 'bg-danger/10 text-danger', medium: 'bg-warning/10 text-warning', low: 'bg-info/10 text-info' }
const priorityLabels: Record<string, string> = { high: 'عالية', medium: 'متوسطة', low: 'منخفضة' }
const statusColors: Record<string, string> = { open: 'bg-gold/10 text-gold', in_progress: 'bg-info/10 text-info', resolved: 'bg-success/10 text-success', closed: 'bg-chrome/10 text-chrome' }
const statusLabels: Record<string, string> = { open: 'مفتوحة', in_progress: 'قيد المعالجة', resolved: 'محلولة', closed: 'مغلقة' }
const channelIcons: Record<string, typeof Mail> = { email: Mail, phone: Phone, chat: MessageSquare }

const knowledgeBase = [
  { title: 'كيفية حجز جناح في المعرض', category: 'حجوزات', views: 1250 },
  { title: 'سياسة الإلغاء والاسترداد', category: 'سياسات', views: 890 },
  { title: 'الخدمات المتاحة للعارضين', category: 'خدمات', views: 720 },
  { title: 'دليل بوابة العارضين', category: 'تقنية', views: 650 },
  { title: 'باقات الرعاية والشراكة', category: 'رعاية', views: 580 },
  { title: 'متطلبات السلامة والأمان', category: 'سلامة', views: 430 },
]

export default function SupportPage() {
  const [tickets, setTickets] = useState(demoTickets)
  const [activeTab, setActiveTab] = useState('tickets')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [newTicket, setNewTicket] = useState({ subject: '', customer: '', priority: 'medium', channel: 'email', description: '', category: 'استفسارات' })

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    highPriority: tickets.filter(t => t.priority === 'high' && t.status !== 'resolved').length,
  }), [tickets])

  const filtered = useMemo(() => {
    let result = [...tickets]
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter)
    if (search) { const s = search.toLowerCase(); result = result.filter(t => t.subject.includes(s) || t.customer.includes(s) || t.id.includes(s)) }
    return result
  }, [tickets, statusFilter, search])

  const handleAdd = () => {
    if (!newTicket.subject || !newTicket.customer) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    const t: Ticket = {
      id: `T-2026-${String(tickets.length + 1).padStart(3, '0')}`, subject: newTicket.subject, customer: newTicket.customer,
      priority: newTicket.priority, status: 'open', assignee: 'غير محدد', time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      channel: newTicket.channel, description: newTicket.description, category: newTicket.category,
    }
    setTickets(prev => [t, ...prev])
    toast.success(`تم إنشاء التذكرة: ${t.id}`)
    setShowAddModal(false)
    setNewTicket({ subject: '', customer: '', priority: 'medium', channel: 'email', description: '', category: 'استفسارات' })
  }

  const handleDelete = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id))
    toast.success(`تم حذف التذكرة: ${id}`)
    setDeleteConfirm(null)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
    toast.success(`تم تحديث حالة التذكرة ${id}`)
  }

  return (
    <AdminLayout>
      <PageHeader
        title="الدعم الفني"
        subtitle={`${stats.total} تذكرة — ${stats.open} مفتوحة — ${stats.highPriority} عالية الأولوية`}
        actions={
          <button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} /> تذكرة جديدة
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatsCard title="التذاكر المفتوحة" value={String(stats.open)} icon={MessageSquare} delay={0} />
        <StatsCard title="قيد المعالجة" value={String(stats.inProgress)} icon={Clock} delay={0.05} />
        <StatsCard title="تم الحل" value={String(stats.resolved)} icon={CheckCircle} delay={0.1} />
        <StatsCard title="رضا العملاء" value="4.6/5" icon={Star} trend={8} trendLabel="تحسن" delay={0.15} />
      </div>

      {/* تبويبات */}
      <div className="flex items-center gap-2 mb-4">
        {[{ key: 'tickets', label: 'التذاكر', icon: Headphones }, { key: 'knowledge', label: 'قاعدة المعرفة', icon: BookOpen }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', activeTab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* التذاكر */}
      {activeTab === 'tickets' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50 flex-wrap gap-3">
            <div className="relative w-64">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في التذاكر..."
                className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
            </div>
            <div className="flex items-center gap-1.5">
              {[{ key: 'all', label: 'الكل' }, { key: 'open', label: 'مفتوحة' }, { key: 'in_progress', label: 'قيد المعالجة' }, { key: 'resolved', label: 'محلولة' }].map(f => (
                <button key={f.key} onClick={() => setStatusFilter(f.key)} className={cn('h-7 px-2.5 rounded-lg text-[11px] font-medium transition-all', statusFilter === f.key ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>{f.label}</button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border/30">
            {filtered.length === 0 ? (
              <div className="px-4 py-16 text-center"><Headphones size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground text-sm">لا يوجد تذاكر مطابقة</p></div>
            ) : filtered.map((ticket, idx) => {
              const ChIcon = channelIcons[ticket.channel] || Mail
              return (
                <motion.div key={ticket.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                  className="px-4 py-3 hover:bg-surface2/30 transition-colors flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', ticket.priority === 'high' ? 'bg-danger/10' : ticket.priority === 'medium' ? 'bg-warning/10' : 'bg-info/10')}>
                      <ChIcon size={16} className={ticket.priority === 'high' ? 'text-danger' : ticket.priority === 'medium' ? 'text-warning' : 'text-info'} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">{ticket.id}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', priorityColors[ticket.priority])}>{priorityLabels[ticket.priority]}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', statusColors[ticket.status])}>{statusLabels[ticket.status]}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{ticket.subject}</p>
                    <p className="text-[10px] text-muted-foreground">{ticket.customer} — {ticket.assignee} — {ticket.time}</p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => setDetailTicket(ticket)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                    {ticket.status === 'open' && <button onClick={() => handleStatusChange(ticket.id, 'in_progress')} className="p-1.5 rounded-lg hover:bg-info/10 text-muted-foreground hover:text-info transition-colors" title="بدء المعالجة"><Zap size={14} /></button>}
                    {ticket.status === 'in_progress' && <button onClick={() => handleStatusChange(ticket.id, 'resolved')} className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-colors" title="تم الحل"><CheckCircle size={14} /></button>}
                    <button onClick={() => setDeleteConfirm(ticket.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* قاعدة المعرفة */}
      {activeTab === 'knowledge' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {knowledgeBase.map((article, i) => (
            <motion.div key={article.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5 hover:border-gold/20 transition-all cursor-pointer group" onClick={() => toast.info(`عرض المقال: ${article.title}`)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:scale-105 transition-transform"><BookOpen size={18} className="text-gold" /></div>
                <div className="flex-1 min-w-0"><h3 className="text-sm font-bold text-foreground truncate">{article.title}</h3><p className="text-[10px] text-muted-foreground">{article.category}</p></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Eye size={10} />{article.views} مشاهدة</span>
                <span className="group-hover:text-gold transition-colors">قراءة المقال →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* نافذة تفاصيل التذكرة */}
      <AnimatePresence>
        {detailTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailTicket(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div><span className="text-xs font-mono text-muted-foreground">{detailTicket.id}</span><h2 className="text-base font-bold text-foreground mt-1">{detailTicket.subject}</h2></div>
                <button onClick={() => setDetailTicket(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">العميل</p><p className="text-xs text-foreground">{detailTicket.customer}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">المسؤول</p><p className="text-xs text-foreground">{detailTicket.assignee}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">القناة</p><p className="text-xs text-foreground">{detailTicket.channel === 'email' ? 'بريد إلكتروني' : detailTicket.channel === 'phone' ? 'هاتف' : 'محادثة'}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">التصنيف</p><p className="text-xs text-foreground">{detailTicket.category}</p></div>
              </div>
              <div className="p-3 rounded-xl bg-surface2/50 border border-border/30 mb-4"><p className="text-[10px] text-muted-foreground mb-1">الوصف</p><p className="text-sm text-foreground leading-relaxed">{detailTicket.description}</p></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', priorityColors[detailTicket.priority])}>{priorityLabels[detailTicket.priority]}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', statusColors[detailTicket.status])}>{statusLabels[detailTicket.status]}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{detailTicket.time}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة تذكرة جديدة */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Headphones size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">تذكرة جديدة</h3><p className="text-xs text-muted-foreground">إنشاء تذكرة دعم فني</p></div>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الموضوع <span className="text-danger">*</span></label><input type="text" value={newTicket.subject} onChange={(e) => setNewTicket(p => ({ ...p, subject: e.target.value }))} placeholder="موضوع التذكرة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">العميل <span className="text-danger">*</span></label><input type="text" value={newTicket.customer} onChange={(e) => setNewTicket(p => ({ ...p, customer: e.target.value }))} placeholder="اسم العميل/الشركة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الأولوية</label><select value={newTicket.priority} onChange={(e) => setNewTicket(p => ({ ...p, priority: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option value="high">عالية</option><option value="medium">متوسطة</option><option value="low">منخفضة</option></select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القناة</label><select value={newTicket.channel} onChange={(e) => setNewTicket(p => ({ ...p, channel: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option value="email">بريد</option><option value="phone">هاتف</option><option value="chat">محادثة</option></select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">التصنيف</label><select value={newTicket.category} onChange={(e) => setNewTicket(p => ({ ...p, category: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option>استفسارات</option><option>حجوزات</option><option>مالية</option><option>تقنية</option><option>شكاوى</option></select></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الوصف</label><textarea value={newTicket.description} onChange={(e) => setNewTicket(p => ({ ...p, description: e.target.value }))} placeholder="وصف المشكلة..." rows={3} className="w-full p-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" /></div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إنشاء التذكرة</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف التذكرة</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف التذكرة <span className="text-foreground font-medium font-mono">{deleteConfirm}</span>؟</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
