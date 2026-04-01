import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  DollarSign, 
  Percent, 
  Clock, 
  Search, 
  Filter, 
  FileText, 
  Users, 
  Calendar, 
  MoreVertical,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';

type DealStage = 'negotiation' | 'offer' | 'closed';
type DealStatus = 'active' | 'completed' | 'cancelled' | 'pending';

interface Deal {
  id: string;
  title: string;
  investor: string;
  value: number;
  stage: DealStage;
  documents: number;
  participants: number;
  deadline: string;
  status: DealStatus;
}

const mockDeals: Deal[] = [
  {
    id: 'DR-001',
    title: 'استثمار في جناح التقنية',
    investor: 'شركة ألفا للاستثمار',
    value: 2500000,
    stage: 'negotiation',
    documents: 12,
    participants: 4,
    deadline: '2026-05-15',
    status: 'active'
  },
  {
    id: 'DR-002',
    title: 'رعاية المعرض الرئيسي',
    investor: 'مجموعة الأفق',
    value: 5000000,
    stage: 'offer',
    documents: 8,
    participants: 6,
    deadline: '2026-04-30',
    status: 'pending'
  },
  {
    id: 'DR-003',
    title: 'شراكة استراتيجية للخدمات',
    investor: 'شركة الخدمات المتكاملة',
    value: 1200000,
    stage: 'closed',
    documents: 25,
    participants: 8,
    deadline: '2026-03-10',
    status: 'completed'
  },
  {
    id: 'DR-004',
    title: 'تطوير المنصة الرقمية',
    investor: 'صندوق الابتكار',
    value: 3500000,
    stage: 'negotiation',
    documents: 5,
    participants: 3,
    deadline: '2026-06-01',
    status: 'active'
  },
  {
    id: 'DR-005',
    title: 'حقوق البث الحصري',
    investor: 'شبكة الإعلام العربي',
    value: 8000000,
    stage: 'closed',
    documents: 15,
    participants: 5,
    deadline: '2026-02-20',
    status: 'completed'
  }
];

const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'active', label: 'صفقات نشطة' },
  { id: 'closed', label: 'مغلقة' },
  { id: 'analytics', label: 'تحليلات' }
];

const STAGE_LABELS: Record<DealStage, string> = {
  negotiation: 'تفاوض',
  offer: 'عرض',
  closed: 'إغلاق'
};

export default function DealRoomsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.title.includes(searchQuery) || deal.investor.includes(searchQuery);
    const matchesStage = selectedStage === 'all' || deal.stage === selectedStage;
    const matchesTab = 
      activeTab === 'overview' ? true :
      activeTab === 'active' ? (deal.status === 'active' || deal.status === 'pending') :
      activeTab === 'closed' ? (deal.status === 'completed' || deal.status === 'cancelled') :
      activeTab === 'analytics' ? false : true;
    
    return matchesSearch && matchesStage && matchesTab;
  });

  const handleAction = (action: string, id: string) => {
    toast.success(`تم تنفيذ الإجراء: ${action} على الصفقة ${id}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <PageHeader 
          title="غرف الصفقات" 
          subtitle="إدارة ومتابعة الصفقات بين المستثمرين والمنظمين"
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="صفقات نشطة"
            value="12"
            icon={Briefcase}
            trend={15}
            delay={0.1}
          />
          <StatsCard
            title="قيمة إجمالية"
            value={formatCurrency(45000000)}
            icon={DollarSign}
            trend={8}
            delay={0.2}
          />
          <StatsCard
            title="معدل الإغلاق"
            value="68%"
            icon={Percent}
            trend={5}
            delay={0.3}
          />
          <StatsCard
            title="متوسط وقت الإغلاق"
            value="14 يوم"
            icon={Clock}
            trend={2}
            delay={0.4}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 space-x-reverse border-b border-border/50 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all duration-300 relative",
                activeTab === tab.id
                  ? "text-gold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-gold"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Filters and Search */}
        {activeTab !== 'analytics' && (
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center glass-card p-4 rounded-xl border border-border/50 bg-surface2">
            <div className="relative w-full sm:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="البحث في الصفقات والمستثمرين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 text-foreground transition-colors"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full bg-background/50 border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 text-foreground appearance-none"
                >
                  <option value="all">جميع المراحل</option>
                  <option value="negotiation">تفاوض</option>
                  <option value="offer">عرض</option>
                  <option value="closed">إغلاق</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'analytics' ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-8 rounded-xl border border-border/50 bg-surface2 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-foreground">تحليلات غرف الصفقات</h3>
                <p className="text-muted-foreground max-w-md">
                  جاري تجهيز لوحة التحليلات المتقدمة. ستتمكن قريباً من عرض الرسوم البيانية لتدفق الصفقات ومعدلات التحويل.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4"
              >
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal, index) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-5 rounded-xl border border-border/50 bg-surface2 hover:border-gold/30 transition-all duration-300 group"
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-md">
                                  {deal.id}
                                </span>
                                <StatusBadge status={deal.status} />
                              </div>
                              <h3 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                                {deal.title}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Users className="w-4 h-4" />
                                {deal.investor}
                              </p>
                            </div>
                            <div className="text-left">
                              <div className="text-lg font-bold text-foreground">
                                {formatCurrency(deal.value)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                القيمة المقدرة
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t border-border/30">
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-4 h-4 text-gold/70" />
                              <span>المرحلة: <span className="text-foreground">{STAGE_LABELS[deal.stage]}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-gold/70" />
                              <span>المستندات: <span className="text-foreground">{deal.documents}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-gold/70" />
                              <span>المشاركون: <span className="text-foreground">{deal.participants}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gold/70" />
                              <span>الموعد النهائي: <span className="text-foreground">{formatDate(deal.deadline)}</span></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex lg:flex-col justify-end gap-2 border-t lg:border-t-0 lg:border-r border-border/30 pt-4 lg:pt-0 lg:pr-6">
                          <button 
                            onClick={() => handleAction('عرض', deal.id)}
                            className="p-2 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors flex-1 lg:flex-none flex justify-center"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleAction('مراسلة', deal.id)}
                            className="p-2 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors flex-1 lg:flex-none flex justify-center"
                            title="الرسائل"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleAction('تحميل', deal.id)}
                            className="p-2 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors flex-1 lg:flex-none flex justify-center"
                            title="تحميل المستندات"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleAction('خيارات', deal.id)}
                            className="p-2 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors flex-1 lg:flex-none flex justify-center"
                            title="مزيد من الخيارات"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-card p-12 rounded-xl border border-border/50 bg-surface2 flex flex-col items-center justify-center text-center space-y-3">
                    <Briefcase className="w-12 h-12 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium text-foreground">لا توجد صفقات</h3>
                    <p className="text-sm text-muted-foreground">
                      لم يتم العثور على صفقات تطابق معايير البحث الخاصة بك.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
