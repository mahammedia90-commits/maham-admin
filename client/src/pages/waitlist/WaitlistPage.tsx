import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, CheckCircle, TrendingUp, Users, ChevronDown, MoreHorizontal, ArrowUpRight, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Types
type Priority = 'عالية' | 'متوسطة' | 'عادية';
type WaitlistType = 'تاجر' | 'مستثمر' | 'راعي';
type WaitlistStatus = 'في الانتظار' | 'تم القبول' | 'مرفوض' | 'مؤرشف';

interface WaitlistItem {
  id: string;
  company: string;
  event: string;
  requestDate: string;
  priority: Priority;
  type: WaitlistType;
  position: number;
  status: WaitlistStatus;
  contact: string;
}

// Mock Data
const mockWaitlist: WaitlistItem[] = [
  {
    id: 'WL-1001',
    company: 'شركة الأفق للتجارة',
    event: 'معرض التكنولوجيا 2025',
    requestDate: '2024-10-15',
    priority: 'عالية',
    type: 'تاجر',
    position: 1,
    status: 'في الانتظار',
    contact: 'ahmed@horizon.com',
  },
  {
    id: 'WL-1002',
    company: 'مجموعة الاستثمار الذهبي',
    event: 'معرض العقارات الدولي',
    requestDate: '2024-10-18',
    priority: 'متوسطة',
    type: 'مستثمر',
    position: 4,
    status: 'في الانتظار',
    contact: 'info@goldinvest.sa',
  },
  {
    id: 'WL-1003',
    company: 'رؤية للمقاولات',
    event: 'معرض البناء والتشييد',
    requestDate: '2024-09-20',
    priority: 'عادية',
    type: 'راعي',
    position: 12,
    status: 'مؤرشف',
    contact: 'contact@vision-cont.com',
  },
  {
    id: 'WL-1004',
    company: 'مؤسسة التقنية الحديثة',
    event: 'معرض التكنولوجيا 2025',
    requestDate: '2024-10-01',
    priority: 'عالية',
    type: 'تاجر',
    position: 0,
    status: 'تم القبول',
    contact: 'sales@moderntech.sa',
  },
  {
    id: 'WL-1005',
    company: 'الرواد للاستيراد والتصدير',
    event: 'معرض الغذاء السنوي',
    requestDate: '2024-10-20',
    priority: 'متوسطة',
    type: 'تاجر',
    position: 2,
    status: 'في الانتظار',
    contact: 'info@alrowad.com',
  },
];

export default function WaitlistPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'archived'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleApprove = (id: string) => {
    toast.success('تم قبول الطلب بنجاح');
  };

  const handleReject = (id: string) => {
    toast.error('تم رفض الطلب');
  };

  const filteredData = mockWaitlist.filter((item) => {
    const matchesSearch = item.company.includes(searchQuery) || item.event.includes(searchQuery);
    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    if (activeTab === 'active') {
      return matchesSearch && matchesFilter && item.status === 'في الانتظار';
    } else if (activeTab === 'archived') {
      return matchesSearch && matchesFilter && (item.status === 'مؤرشف' || item.status === 'مرفوض');
    }
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'عالية': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'متوسطة': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'عادية': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="إدارة قوائم الانتظار" 
          subtitle="متابعة وإدارة طلبات الانضمام للمعارض والفعاليات"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="في الانتظار"
            value="142"
            icon={Clock}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="تم القبول هذا الشهر"
            value="38"
            icon={CheckCircle}
            trend={5}
            delay={0.2}
          />
          <StatsCard
            title="متوسط وقت الانتظار"
            value="14 يوم"
            icon={Calendar}
            trend={2}
            delay={0.3}
          />
          <StatsCard
            title="معدل التحويل"
            value="26%"
            icon={TrendingUp}
            trend={3}
            delay={0.4}
          />
        </div>

        {/* Main Content Area */}
        <div className="glass-card rounded-xl border border-border/50 bg-surface2 overflow-hidden">
          
          {/* Tabs */}
          <div className="flex items-center border-b border-border/50 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "px-4 py-4 text-sm font-medium transition-colors relative",
                activeTab === 'overview' ? "text-gold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              نظرة عامة
              {activeTab === 'overview' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                "px-4 py-4 text-sm font-medium transition-colors relative",
                activeTab === 'active' ? "text-gold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              القائمة النشطة
              {activeTab === 'active' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={cn(
                "px-4 py-4 text-sm font-medium transition-colors relative",
                activeTab === 'archived' ? "text-gold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              المؤرشف
              {activeTab === 'archived' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          </div>

          {/* Filters & Search */}
          <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث باسم الشركة أو المعرض..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-gold/50 text-foreground"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border/50 rounded-lg text-sm hover:border-gold/50 transition-colors">
                  <Filter className="h-4 w-4 text-gold" />
                  <span>النوع: {filterType === 'all' ? 'الكل' : filterType}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-40 bg-surface2 border border-border/50 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="p-1">
                    {['all', 'تاجر', 'مستثمر', 'راعي'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className="block w-full text-right px-4 py-2 text-sm text-foreground hover:bg-gold/10 hover:text-gold rounded-md"
                      >
                        {type === 'all' ? 'الكل' : type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border/50 bg-background/50">
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">الشركة</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">المعرض</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">تاريخ الطلب</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">الأولوية</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">النوع</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">الترتيب</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-gold/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{item.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.contact}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{item.event}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(item.requestDate)}</td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", getPriorityColor(item.priority))}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.type}</td>
                      <td className="px-6 py-4">
                        {item.status === 'في الانتظار' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold text-gold">#{item.position}</span>
                            {item.position <= 3 && <ArrowUpRight className="h-4 w-4 text-green-400" />}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.status === 'في الانتظار' && (
                            <>
                              <button 
                                onClick={() => handleApprove(item.id)}
                                className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-md transition-colors"
                                title="قبول"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(item.id)}
                                className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                title="رفض"
                              >
                                <AlertCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button className="p-1.5 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-md transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">لا توجد نتائج</p>
                <p className="text-sm text-muted-foreground mt-1">لم يتم العثور على شركات تطابق معايير البحث الحالية.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
