import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  FileText, 
  CreditCard, 
  UserCheck, 
  Calendar,
  MoreVertical,
  Check,
  Trash2
} from 'lucide-react';

// Types
type NotificationType = 'system' | 'finance' | 'orders';
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
  priority: NotificationPriority;
  source: string;
}

// Mock Data
const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    title: 'طلب جديد',
    message: 'تم استلام طلب حجز جناح جديد لمعرض التقنية 2024.',
    type: 'orders',
    date: '2024-05-20T10:30:00Z',
    read: false,
    priority: 'high',
    source: 'نظام الحجوزات'
  },
  {
    id: 'NOT-002',
    title: 'دفعة مستلمة',
    message: 'تم تأكيد استلام الدفعة الأولى من شركة الأفق بقيمة 50,000 ريال.',
    type: 'finance',
    date: '2024-05-20T09:15:00Z',
    read: false,
    priority: 'medium',
    source: 'النظام المالي'
  },
  {
    id: 'NOT-003',
    title: 'عقد بحاجة لتوقيع',
    message: 'عقد الرعاية البلاتينية لشركة التقدم جاهز للتوقيع النهائي.',
    type: 'system',
    date: '2024-05-19T14:45:00Z',
    read: true,
    priority: 'urgent',
    source: 'إدارة العقود'
  },
  {
    id: 'NOT-004',
    title: 'KYC مكتمل',
    message: 'تم التحقق بنجاح من مستندات شركة النور التجارية.',
    type: 'system',
    date: '2024-05-19T11:20:00Z',
    read: true,
    priority: 'low',
    source: 'نظام الامتثال'
  },
  {
    id: 'NOT-005',
    title: 'فعالية قادمة',
    message: 'تذكير: معرض الابتكار يبدأ بعد 3 أيام. يرجى مراجعة التجهيزات النهائية.',
    type: 'system',
    date: '2024-05-18T08:00:00Z',
    read: true,
    priority: 'high',
    source: 'إدارة الفعاليات'
  },
  {
    id: 'NOT-006',
    title: 'تأخير في السداد',
    message: 'يوجد تأخير في سداد الدفعة الثانية لشركة القمة.',
    type: 'finance',
    date: '2024-05-17T15:30:00Z',
    read: false,
    priority: 'urgent',
    source: 'النظام المالي'
  },
  {
    id: 'NOT-007',
    title: 'طلب دعم فني',
    message: 'تم فتح تذكرة دعم فني جديدة بخصوص مشكلة في منصة العارضين.',
    type: 'system',
    date: '2024-05-17T10:00:00Z',
    read: true,
    priority: 'medium',
    source: 'خدمة العملاء'
  }
];

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'system', label: 'النظام' },
  { id: 'finance', label: 'المالية' },
  { id: 'orders', label: 'الطلبات' }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
    toast.success('تم تحديد الإشعار كمقروء');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast.success('تم تحديد جميع الإشعارات كمقروءة');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('تم حذف الإشعار');
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesTab = activeTab === 'all' || notif.type === activeTab;
    const matchesSearch = notif.title.includes(searchQuery) || notif.message.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    urgent: notifications.filter(n => n.priority === 'urgent').length,
    today: notifications.filter(n => new Date(n.date).toDateString() === new Date().toDateString()).length
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'finance': return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'orders': return <FileText className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gold" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-muted-foreground bg-surface border-border';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل جداً';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'عادي';
      default: return priority;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="مركز الإشعارات" 
          subtitle="إدارة ومتابعة جميع تنبيهات وإشعارات النظام"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي الإشعارات"
            value={stats.total.toString()}
            icon={Bell}
            delay={0.1}
          />
          <StatsCard
            title="غير مقروءة"
            value={stats.unread.toString()}
            icon={AlertCircle}
            delay={0.2}
            trend={12}
          />
          <StatsCard
            title="عاجلة"
            value={stats.urgent.toString()}
            icon={Clock}
            delay={0.3}
          />
          <StatsCard
            title="إشعارات اليوم"
            value={stats.today.toString()}
            icon={Calendar}
            delay={0.4}
            trend={5}
          />
        </div>

        {/* Main Content */}
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border/50 bg-surface2/50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث في الإشعارات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-surface border border-border/50 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-colors text-foreground"
                />
              </div>
              <button 
                onClick={handleMarkAllAsRead}
                className="p-2 bg-surface border border-border/50 rounded-xl text-muted-foreground hover:text-gold hover:border-gold/30 transition-colors"
                title="تحديد الكل كمقروء"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-surface border border-border/50 rounded-xl text-muted-foreground hover:text-gold hover:border-gold/30 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-4">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "group p-4 rounded-xl border transition-all duration-300",
                        notif.read 
                          ? "bg-surface/50 border-border/30" 
                          : "bg-surface2 border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                      )}
                    >
                      <div className="flex gap-4 items-start">
                        {/* Icon */}
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          notif.read ? "bg-surface" : "bg-gold/10"
                        )}>
                          {getIconForType(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <div>
                              <h4 className={cn(
                                "text-base font-medium mb-1",
                                notif.read ? "text-foreground" : "text-gold"
                              )}>
                                {notif.title}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {notif.message}
                              </p>
                            </div>
                            
                            {/* Actions & Time */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(notif.date)}
                              </span>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notif.read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notif.id)}
                                    className="p-1.5 hover:bg-gold/10 hover:text-gold rounded-lg text-muted-foreground transition-colors"
                                    title="تحديد كمقروء"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(notif.id)}
                                  className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-muted-foreground transition-colors"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Meta Tags */}
                          <div className="flex items-center gap-3 mt-3">
                            <span className={cn(
                              "text-xs px-2.5 py-1 rounded-md border",
                              getPriorityColor(notif.priority)
                            )}>
                              {getPriorityLabel(notif.priority)}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-border" />
                              {notif.source}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">لا توجد إشعارات</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      لا توجد إشعارات مطابقة لمعايير البحث أو الفلترة الحالية.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
