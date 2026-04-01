import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, BellOff, CheckCheck, Trash2, Filter, Settings,
  AlertTriangle, Info, CheckCircle, XCircle, Calendar,
  DollarSign, FileText, Users, Shield, Brain, Clock,
  ChevronDown, Search, MailOpen, Mail
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatDateTime } from '@/lib/utils'

type NotifType = 'info' | 'warning' | 'success' | 'error' | 'system'
type NotifCategory = 'events' | 'finance' | 'legal' | 'users' | 'security' | 'ai' | 'operations'

interface Notification {
  id: number
  title: string
  message: string
  type: NotifType
  category: NotifCategory
  read: boolean
  time: string
  actionUrl?: string
  actionLabel?: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'طلب حجز بوث جديد', message: 'قدّم التاجر أحمد المالكي طلب حجز بوث في المنطقة A - الفعالية: معرض التقنية 2026', type: 'info', category: 'events', read: false, time: '2026-03-31T14:30:00', actionUrl: '/requests', actionLabel: 'مراجعة الطلب' },
  { id: 2, title: 'تنبيه: عقد ينتهي خلال 7 أيام', message: 'عقد الراعي الذهبي مع شركة التقنية المتقدمة ينتهي في 7 أبريل 2026', type: 'warning', category: 'legal', read: false, time: '2026-03-31T13:00:00', actionUrl: '/legal', actionLabel: 'عرض العقد' },
  { id: 3, title: 'دفعة مالية مستلمة', message: 'تم استلام دفعة بقيمة 150,000 ر.س من المستثمر خالد الدوسري عبر SADAD', type: 'success', category: 'finance', read: false, time: '2026-03-31T11:45:00', actionUrl: '/finance', actionLabel: 'عرض التفاصيل' },
  { id: 4, title: 'فشل في إرسال فاتورة ZATCA', message: 'فشل إرسال الفاتورة #INV-2026-0089 إلى منصة فاتورة — خطأ في التوقيع الرقمي', type: 'error', category: 'finance', read: false, time: '2026-03-31T10:30:00', actionUrl: '/finance', actionLabel: 'إعادة المحاولة' },
  { id: 5, title: 'مستخدم جديد مسجل', message: 'تسجيل مستثمر جديد: ريم الزهراني — بانتظار التحقق KYC', type: 'info', category: 'users', read: true, time: '2026-03-31T09:15:00', actionUrl: '/users', actionLabel: 'مراجعة الحساب' },
  { id: 6, title: 'تنبيه أمني: محاولة دخول مشبوهة', message: 'تم رصد 5 محاولات دخول فاشلة من IP: 185.xxx.xxx.12 خلال 10 دقائق', type: 'error', category: 'security', read: true, time: '2026-03-30T22:00:00', actionUrl: '/audit', actionLabel: 'عرض السجل' },
  { id: 7, title: 'توصية AI: تحسين التسعير', message: 'يقترح العقل التنفيذي زيادة أسعار البوثات في المنطقة B بنسبة 12% بناءً على تحليل الطلب', type: 'info', category: 'ai', read: true, time: '2026-03-30T16:00:00', actionUrl: '/ai', actionLabel: 'عرض التحليل' },
  { id: 8, title: 'فعالية جديدة منشورة', message: 'تم نشر فعالية "معرض الابتكار 2026" بنجاح — تاريخ البدء: 20 مايو 2026', type: 'success', category: 'events', read: true, time: '2026-03-30T14:00:00', actionUrl: '/events', actionLabel: 'عرض الفعالية' },
  { id: 9, title: 'تحديث سياسة الامتثال', message: 'تم تحديث متطلبات NCA للأمن السيبراني — يرجى مراجعة الإعدادات', type: 'warning', category: 'security', read: true, time: '2026-03-30T10:00:00', actionUrl: '/legal', actionLabel: 'مراجعة' },
  { id: 10, title: 'اكتمال مهمة العمليات', message: 'تم إكمال تجهيز القاعة الرئيسية لمعرض التقنية — جاهز للتفتيش', type: 'success', category: 'operations', read: true, time: '2026-03-29T17:00:00', actionUrl: '/operations', actionLabel: 'عرض التفاصيل' },
  { id: 11, title: 'طلب KYC معلق', message: 'مستندات KYC للتاجر سارة العتيبي بحاجة لمراجعة — مرفق: سجل تجاري + هوية', type: 'warning', category: 'users', read: true, time: '2026-03-29T12:00:00', actionUrl: '/documents', actionLabel: 'مراجعة المستندات' },
  { id: 12, title: 'تقرير أسبوعي جاهز', message: 'التقرير الأسبوعي للأداء المالي والتشغيلي جاهز للتحميل', type: 'info', category: 'finance', read: true, time: '2026-03-29T08:00:00', actionUrl: '/reports', actionLabel: 'تحميل التقرير' },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filterType, setFilterType] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterRead, setFilterRead] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const unreadCount = notifications.filter(n => !n.read).length
  const warningCount = notifications.filter(n => n.type === 'warning').length
  const errorCount = notifications.filter(n => n.type === 'error').length

  const filtered = notifications.filter(n => {
    if (filterType && n.type !== filterType) return false
    if (filterCategory && n.category !== filterCategory) return false
    if (filterRead === 'unread' && n.read) return false
    if (filterRead === 'read' && !n.read) return false
    if (searchQuery && !n.title.includes(searchQuery) && !n.message.includes(searchQuery)) return false
    return true
  })

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('تم تعليم جميع الإشعارات كمقروءة')
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('تم حذف الإشعار')
  }

  const getTypeIcon = (type: NotifType) => {
    switch (type) {
      case 'info': return <Info size={16} className="text-info" />
      case 'warning': return <AlertTriangle size={16} className="text-warning" />
      case 'success': return <CheckCircle size={16} className="text-success" />
      case 'error': return <XCircle size={16} className="text-danger" />
      case 'system': return <Shield size={16} className="text-gold" />
    }
  }

  const getCategoryIcon = (category: NotifCategory) => {
    switch (category) {
      case 'events': return <Calendar size={12} />
      case 'finance': return <DollarSign size={12} />
      case 'legal': return <FileText size={12} />
      case 'users': return <Users size={12} />
      case 'security': return <Shield size={12} />
      case 'ai': return <Brain size={12} />
      case 'operations': return <Settings size={12} />
    }
  }

  const getCategoryLabel = (category: NotifCategory) => {
    switch (category) {
      case 'events': return 'الفعاليات'
      case 'finance': return 'المالية'
      case 'legal': return 'القانونية'
      case 'users': return 'المستخدمون'
      case 'security': return 'الأمان'
      case 'ai': return 'الذكاء الاصطناعي'
      case 'operations': return 'العمليات'
    }
  }

  const getTypeBg = (type: NotifType) => {
    switch (type) {
      case 'info': return 'border-r-info'
      case 'warning': return 'border-r-warning'
      case 'success': return 'border-r-success'
      case 'error': return 'border-r-danger'
      case 'system': return 'border-r-gold'
    }
  }

  // Group by date
  const groupedByDate = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    const date = new Date(n.time).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(n)
    return acc
  }, {})

  return (
    <AdminLayout>
      <PageHeader
        title="مركز الإشعارات"
        subtitle="جميع التنبيهات والإشعارات في مكان واحد"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="h-9 px-4 rounded-lg bg-surface border border-border text-sm text-muted-foreground hover:text-gold hover:border-gold/30 disabled:opacity-30 transition-all flex items-center gap-2"
            >
              <CheckCheck size={14} />
              تعليم الكل كمقروء
            </button>
            <button
              onClick={() => toast.info('إعدادات الإشعارات — قريباً')}
              className="h-9 px-4 rounded-lg bg-surface border border-border text-sm text-muted-foreground hover:text-gold hover:border-gold/30 transition-all flex items-center gap-2"
            >
              <Settings size={14} />
              الإعدادات
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الإشعارات" value={notifications.length} icon={Bell} delay={0} />
        <StatsCard title="غير مقروءة" value={unreadCount} icon={Mail} delay={0.1} />
        <StatsCard title="تحذيرات" value={warningCount} icon={AlertTriangle} delay={0.2} />
        <StatsCard title="أخطاء" value={errorCount} icon={XCircle} delay={0.3} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث في الإشعارات..."
            className="w-full h-9 pr-9 pl-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-all"
          />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل الأنواع</option>
          <option value="info">معلومات</option>
          <option value="warning">تحذيرات</option>
          <option value="success">نجاح</option>
          <option value="error">أخطاء</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل الأقسام</option>
          <option value="events">الفعاليات</option>
          <option value="finance">المالية</option>
          <option value="legal">القانونية</option>
          <option value="users">المستخدمون</option>
          <option value="security">الأمان</option>
          <option value="ai">الذكاء الاصطناعي</option>
          <option value="operations">العمليات</option>
        </select>
        <select value={filterRead} onChange={e => setFilterRead(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">الكل</option>
          <option value="unread">غير مقروءة</option>
          <option value="read">مقروءة</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-6">
        {Object.keys(groupedByDate).length === 0 ? (
          <div className="glass-card py-16 flex flex-col items-center">
            <BellOff size={40} className="text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">لا توجد إشعارات مطابقة</p>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([date, notifs]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Clock size={12} />
                {date}
              </h3>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {notifs.map((notif, idx) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className={cn(
                        'glass-card p-4 border-r-3 transition-all group',
                        getTypeBg(notif.type),
                        !notif.read && 'bg-gold/[0.02]'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {getTypeIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={cn('text-sm font-semibold', notif.read ? 'text-foreground/80' : 'text-foreground')}>
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{notif.message}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                              {getCategoryIcon(notif.category)}
                              {getCategoryLabel(notif.category)}
                            </span>
                            <span className="text-[10px] text-muted-foreground/70">
                              {new Date(notif.time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {notif.actionLabel && (
                              <button
                                onClick={() => { markRead(notif.id); window.location.href = notif.actionUrl || '#' }}
                                className="text-[10px] text-gold hover:text-gold-light transition-colors font-medium"
                              >
                                {notif.actionLabel}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {!notif.read && (
                            <button
                              onClick={() => markRead(notif.id)}
                              className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"
                              title="تعليم كمقروء"
                            >
                              <MailOpen size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1.5 rounded-md hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  )
}
