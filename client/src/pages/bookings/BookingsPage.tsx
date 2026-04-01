import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard,
  Building,
  User,
  MapPin,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Types
type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'waitlist';
type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'refunded';

interface Booking {
  id: string;
  company: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  event: string;
  space: string;
  date: string;
  status: BookingStatus;
  amount: number;
  paymentStatus: PaymentStatus;
  notes?: string;
}

// Mock Data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BKG-2024-001',
    company: 'شركة التقنية الحديثة',
    contact: {
      name: 'أحمد محمد',
      email: 'ahmed@tech-modern.com',
      phone: '+966 50 123 4567'
    },
    event: 'معرض الرياض التقني 2024',
    space: 'جناح A1 - 50 متر مربع',
    date: '2024-03-15T10:30:00Z',
    status: 'confirmed',
    amount: 150000,
    paymentStatus: 'paid',
    notes: 'طلب تجهيزات إضافية للشاشات'
  },
  {
    id: 'BKG-2024-002',
    company: 'مجموعة الأفق العقارية',
    contact: {
      name: 'سارة خالد',
      email: 'sara@horizon-group.com',
      phone: '+966 55 987 6543'
    },
    event: 'معرض العقارات الدولي',
    space: 'جناح B3 - 100 متر مربع',
    date: '2024-03-14T14:15:00Z',
    status: 'pending',
    amount: 250000,
    paymentStatus: 'partial',
    notes: 'بانتظار موافقة الإدارة المالية'
  },
  {
    id: 'BKG-2024-003',
    company: 'مؤسسة الابتكار التجاري',
    contact: {
      name: 'فهد العتيبي',
      email: 'fahad@innovation-co.com',
      phone: '+966 54 321 0987'
    },
    event: 'أسبوع التجارة الإلكترونية',
    space: 'جناح C2 - 30 متر مربع',
    date: '2024-03-12T09:00:00Z',
    status: 'cancelled',
    amount: 75000,
    paymentStatus: 'refunded',
    notes: 'تم الإلغاء لظروف طارئة'
  },
  {
    id: 'BKG-2024-004',
    company: 'شركة الصناعات المتقدمة',
    contact: {
      name: 'عمر حسن',
      email: 'omar@advanced-ind.com',
      phone: '+966 56 789 1234'
    },
    event: 'المعرض الصناعي السعودي',
    space: 'جناح D5 - 150 متر مربع',
    date: '2024-03-10T11:45:00Z',
    status: 'confirmed',
    amount: 450000,
    paymentStatus: 'unpaid',
    notes: 'الدفع مجدول الأسبوع القادم'
  },
  {
    id: 'BKG-2024-005',
    company: 'رواد المستقبل للاستثمار',
    contact: {
      name: 'نورة السالم',
      email: 'noura@future-pioneers.com',
      phone: '+966 53 456 7890'
    },
    event: 'قمة المستثمرين 2024',
    space: 'قاعة كبار الشخصيات',
    date: '2024-03-16T13:20:00Z',
    status: 'waitlist',
    amount: 120000,
    paymentStatus: 'unpaid',
    notes: 'في قائمة الانتظار للترقية'
  }
];

const TABS = [
  { id: 'all', label: 'نظرة عامة', icon: Calendar },
  { id: 'pending', label: 'حجوزات جديدة', icon: Clock },
  { id: 'confirmed', label: 'مؤكدة', icon: CheckCircle },
  { id: 'cancelled', label: 'ملغاة', icon: XCircle },
  { id: 'waitlist', label: 'قائمة الانتظار', icon: AlertCircle }
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // Filter bookings based on active tab and search query
  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    const matchesTab = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch = 
      booking.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.event.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Calculate stats
  const totalBookings = MOCK_BOOKINGS.length;
  const confirmedBookings = MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length;
  const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending').length;
  const totalRevenue = MOCK_BOOKINGS.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.amount : sum, 0);

  const handleAction = (action: string, id: string) => {
    toast.success(`تم تنفيذ إجراء "${action}" للحجز ${id}`);
    setSelectedBooking(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="إدارة الحجوزات" 
          subtitle="إدارة ومتابعة حجوزات المعارض والفعاليات"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي الحجوزات"
            value={totalBookings.toString()}
            icon={Calendar}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="حجوزات مؤكدة"
            value={confirmedBookings.toString()}
            icon={CheckCircle}
            trend={5}
            delay={0.2}
          />
          <StatsCard
            title="حجوزات معلقة"
            value={pendingBookings.toString()}
            icon={Clock}
            trend={2}
            delay={0.3}
          />
          <StatsCard
            title="إيرادات الحجوزات"
            value={formatCurrency(totalRevenue)}
            icon={TrendingUp}
            trend={18}
            delay={0.4}
          />
        </div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card rounded-2xl border border-border/50 overflow-hidden flex flex-col"
        >
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-border/50 bg-surface2/50 backdrop-blur-sm p-2 gap-2 hide-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-gold/10 text-gold shadow-sm" 
                      : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 border border-gold/20 rounded-xl pointer-events-none"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-border/50 bg-surface2/30">
            <div className="relative w-full sm:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="البحث برقم الحجز، الشركة، أو الفعالية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 border border-border/50 rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 hover:bg-surface2 transition-colors text-sm font-medium w-full sm:w-auto justify-center">
                <Filter className="w-4 h-4" />
                تصفية متقدمة
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 hover:bg-surface2 transition-colors text-sm font-medium w-full sm:w-auto justify-center">
                <FileText className="w-4 h-4" />
                تصدير
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-muted-foreground bg-surface2/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">معلومات الحجز</th>
                  <th className="px-6 py-4 font-medium">الفعالية والمساحة</th>
                  <th className="px-6 py-4 font-medium">التاريخ</th>
                  <th className="px-6 py-4 font-medium">الحالة</th>
                  <th className="px-6 py-4 font-medium">المالية</th>
                  <th className="px-6 py-4 font-medium text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence mode="popLayout">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <motion.tr 
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-surface2/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">{booking.company}</span>
                            <span className="text-xs text-muted-foreground">{booking.id}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <User className="w-3 h-3" />
                              <span>{booking.contact.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-foreground">{booking.event}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{booking.space}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(booking.date)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">{formatCurrency(booking.amount)}</span>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full inline-flex w-fit",
                              booking.paymentStatus === 'paid' ? "bg-emerald-500/10 text-emerald-500" :
                              booking.paymentStatus === 'partial' ? "bg-amber-500/10 text-amber-500" :
                              booking.paymentStatus === 'refunded' ? "bg-red-500/10 text-red-500" :
                              "bg-surface2 text-muted-foreground"
                            )}>
                              {booking.paymentStatus === 'paid' ? 'مدفوع' :
                               booking.paymentStatus === 'partial' ? 'دفعة جزئية' :
                               booking.paymentStatus === 'refunded' ? 'مسترد' : 'غير مدفوع'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="relative inline-block text-right">
                            <button 
                              onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                              className="p-2 hover:bg-surface2 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            
                            <AnimatePresence>
                              {selectedBooking === booking.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute left-0 mt-2 w-48 rounded-xl glass-card border border-border/50 shadow-xl z-50 overflow-hidden"
                                >
                                  <div className="py-1 flex flex-col">
                                    <button onClick={() => handleAction('عرض التفاصيل', booking.id)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-surface2 w-full text-right transition-colors">
                                      <Eye className="w-4 h-4 text-muted-foreground" />
                                      عرض التفاصيل
                                    </button>
                                    <button onClick={() => handleAction('تعديل الحجز', booking.id)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-surface2 w-full text-right transition-colors">
                                      <Edit className="w-4 h-4 text-muted-foreground" />
                                      تعديل الحجز
                                    </button>
                                    <div className="h-px bg-border/50 my-1"></div>
                                    <button onClick={() => handleAction('إلغاء الحجز', booking.id)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 w-full text-right transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                      إلغاء الحجز
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search className="w-8 h-8 opacity-20" />
                          <p>لم يتم العثور على حجوزات تطابق بحثك</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Mock) */}
          <div className="p-4 border-t border-border/50 bg-surface2/30 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              عرض {filteredBookings.length} من أصل {MOCK_BOOKINGS.length} حجز
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-lg border border-border/50 hover:bg-surface2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                السابق
              </button>
              <button className="px-3 py-1 rounded-lg bg-gold/10 text-gold border border-gold/20 font-medium">
                1
              </button>
              <button className="px-3 py-1 rounded-lg border border-border/50 hover:bg-surface2 transition-colors">
                2
              </button>
              <button className="px-3 py-1 rounded-lg border border-border/50 hover:bg-surface2 transition-colors">
                التالي
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
