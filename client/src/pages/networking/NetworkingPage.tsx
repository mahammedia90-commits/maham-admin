import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Users, 
  CheckCircle, 
  Star,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  UserPlus
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// Mock Data
const stats = [
  { title: 'جلسات منظمة', value: '1,240', icon: Network, trend: 15, delay: 0 },
  { title: 'مشاركون نشطون', value: '3,850', icon: Users, trend: 8, delay: 0.1 },
  { title: 'مطابقات ناجحة', value: '890', icon: CheckCircle, trend: 22, delay: 0.2 },
  { title: 'معدل الرضا', value: '4.8/5', icon: Star, trend: 2, delay: 0.3 },
];

const sessions = [
  {
    id: '1',
    title: 'اجتماع شراكة استراتيجية',
    type: 'اجتماع',
    date: '2023-11-15T10:00:00Z',
    duration: '45 دقيقة',
    location: 'غرفة الاجتماعات A',
    participants: [
      { name: 'أحمد محمد', role: 'مستثمر', company: 'مجموعة الاستثمار الذهبي' },
      { name: 'سارة خالد', role: 'تاجر', company: 'شركة التقنية الحديثة' }
    ],
    status: 'مكتمل',
    matchScore: 95,
    rating: 5
  },
  {
    id: '2',
    title: 'ورشة عمل: مستقبل التجزئة',
    type: 'ورشة',
    date: '2023-11-16T14:00:00Z',
    duration: '120 دقيقة',
    location: 'القاعة الرئيسية',
    participants: [
      { name: 'خالد عبد الله', role: 'راعي', company: 'بنك المستقبل' },
      { name: 'فاطمة علي', role: 'تاجر', company: 'أزياء العصر' },
      { name: 'عمر حسن', role: 'مستثمر', company: 'صندوق الابتكار' }
    ],
    status: 'مجدول',
    matchScore: 88,
    rating: null
  },
  {
    id: '3',
    title: 'عشاء عمل حصري',
    type: 'عشاء',
    date: '2023-11-17T20:00:00Z',
    duration: '180 دقيقة',
    location: 'مطعم الأفق',
    participants: [
      { name: 'محمد النجار', role: 'مستثمر', company: 'كابيتال بارتنرز' },
      { name: 'نورة السالم', role: 'راعي', company: 'شركة الاتصالات الكبرى' }
    ],
    status: 'قيد الانتظار',
    matchScore: 92,
    rating: null
  },
  {
    id: '4',
    title: 'جلسة تعارف سريعة',
    type: 'اجتماع',
    date: '2023-11-15T11:30:00Z',
    duration: '15 دقيقة',
    location: 'منطقة التعارف السريع',
    participants: [
      { name: 'ياسر العتيبي', role: 'تاجر', company: 'تقنيات المستقبل' },
      { name: 'ريم الدوسري', role: 'مستثمر', company: 'مجموعة ألفا' }
    ],
    status: 'ملغى',
    matchScore: 45,
    rating: null
  }
];

const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'meetings', label: 'الاجتماعات' },
  { id: 'matches', label: 'المطابقات' },
  { id: 'ratings', label: 'التقييمات' }
];

export default function NetworkingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('الكل');

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'الكل' || session.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (action: string, sessionTitle: string) => {
    toast.success(`تم ${action} الجلسة: ${sessionTitle}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="التواصل والشبكات" 
          subtitle="إدارة جلسات التواصل، الاجتماعات، والمطابقات بين المشاركين."
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 space-x-reverse border-b border-border/50 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                activeTab === tab.id 
                  ? "text-gold bg-gold/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-surface2"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 bg-surface2 p-4 rounded-xl border border-border/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="ابحث عن جلسة، مشارك..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-background border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 text-foreground min-w-[120px]"
              >
                <option value="الكل">جميع الأنواع</option>
                <option value="اجتماع">اجتماع</option>
                <option value="ورشة">ورشة</option>
                <option value="عشاء">عشاء</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-0"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-surface2/50 border-b border-border/50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-medium text-muted-foreground">تفاصيل الجلسة</th>
                      <th className="px-6 py-4 text-sm font-medium text-muted-foreground">المشاركون</th>
                      <th className="px-6 py-4 text-sm font-medium text-muted-foreground">الموعد والمكان</th>
                      <th className="px-6 py-4 text-sm font-medium text-muted-foreground">نسبة التطابق</th>
                      <th className="px-6 py-4 text-sm font-medium text-muted-foreground">الحالة</th>
                      <th className="px-6 py-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-surface2/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{session.title}</span>
                            <span className="text-xs text-muted-foreground mt-1">{session.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {session.participants.map((p, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs text-gold font-bold">
                                  {p.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-foreground">{p.name}</span>
                                  <span className="text-xs text-muted-foreground">{p.role} - {p.company}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(session.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{session.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{session.location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-surface2 rounded-full h-2 max-w-[100px]">
                              <div 
                                className="bg-gold h-2 rounded-full" 
                                style={{ width: `${session.matchScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gold">{session.matchScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={session.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleAction('تعديل', session.title)}
                              className="text-xs text-muted-foreground hover:text-gold transition-colors px-2 py-1 rounded bg-surface2"
                            >
                              تعديل
                            </button>
                            <button 
                              onClick={() => handleAction('إلغاء', session.title)}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded bg-red-400/10"
                            >
                              إلغاء
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSessions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          لا توجد جلسات مطابقة للبحث
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
