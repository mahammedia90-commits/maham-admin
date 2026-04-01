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
  TrendingUp, 
  Users, 
  Percent, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  ChevronRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Types
type OpportunityStatus = 'active' | 'closed' | 'upcoming';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  sector: string;
  investmentRange: [number, number];
  expectedROI: number;
  status: OpportunityStatus;
  deadline: string;
  interestedInvestors: number;
  location: string;
}

// Mock Data
const mockOpportunities: Opportunity[] = [
  {
    id: 'OPP-001',
    title: 'رعاية المعرض السعودي للتقنية',
    description: 'فرصة للرعاية الماسية للمعرض الأكبر للتقنية في الشرق الأوسط بمشاركة أكثر من 500 شركة.',
    sector: 'التقنية',
    investmentRange: [500000, 1000000],
    expectedROI: 25,
    status: 'active',
    deadline: '2024-08-01',
    interestedInvestors: 12,
    location: 'الرياض، مركز الرياض الدولي للمؤتمرات'
  },
  {
    id: 'OPP-002',
    title: 'تطوير تطبيق المعارض الموحد',
    description: 'مشروع لتطوير منصة شاملة لإدارة وحجز تذاكر المعارض المحلية والدولية.',
    sector: 'البرمجيات',
    investmentRange: [200000, 500000],
    expectedROI: 30,
    status: 'active',
    deadline: '2024-07-15',
    interestedInvestors: 8,
    location: 'عن بعد / الرياض'
  },
  {
    id: 'OPP-003',
    title: 'شراكة في معرض البناء والتطوير',
    description: 'فرصة استثمارية لإنشاء أجنحة مخصصة للشركات الناشئة في مجال البناء.',
    sector: 'العقارات',
    investmentRange: [1000000, 2500000],
    expectedROI: 18,
    status: 'closed',
    deadline: '2024-03-10',
    interestedInvestors: 5,
    location: 'جدة، سوبر دوم'
  },
  {
    id: 'OPP-004',
    title: 'الاستثمار في معدات العرض التفاعلية',
    description: 'توفير شاشات ومعدات عرض تفاعلية ثلاثية الأبعاد للمعارض القادمة.',
    sector: 'المعدات',
    investmentRange: [150000, 300000],
    expectedROI: 22,
    status: 'upcoming',
    deadline: '2024-09-20',
    interestedInvestors: 15,
    location: 'الدمام، معارض الظهران'
  },
  {
    id: 'OPP-005',
    title: 'رعاية مؤتمر الذكاء الاصطناعي',
    description: 'فرصة رعاية حصرية لمؤتمر الذكاء الاصطناعي الأول بمشاركة خبراء عالميين.',
    sector: 'التقنية',
    investmentRange: [750000, 1500000],
    expectedROI: 28,
    status: 'active',
    deadline: '2024-08-30',
    interestedInvestors: 20,
    location: 'الرياض، فندق الريتز كارلتون'
  }
];

const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'active', label: 'فرص نشطة' },
  { id: 'closed', label: 'مغلقة' },
  { id: 'analytics', label: 'تحليلات' }
];

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');

  const sectors = ['all', ...Array.from(new Set(mockOpportunities.map(o => o.sector)))];

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = opp.title.includes(searchQuery) || opp.description.includes(searchQuery);
    const matchesSector = selectedSector === 'all' || opp.sector === selectedSector;
    
    if (activeTab === 'active') return matchesSearch && matchesSector && opp.status === 'active';
    if (activeTab === 'closed') return matchesSearch && matchesSector && opp.status === 'closed';
    return matchesSearch && matchesSector;
  });

  const handleAction = (id: string) => {
    toast.success(`تم إرسال طلب التفاصيل للفرصة ${id}`);
  };

  const getStatusColor = (status: OpportunityStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'closed': return 'default';
      case 'upcoming': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: OpportunityStatus) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'closed': return 'مغلقة';
      case 'upcoming': return 'قادمة';
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="فرص الاستثمار" 
          subtitle="إدارة ومتابعة الفرص الاستثمارية في المعارض والفعاليات"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="فرص نشطة"
            value="12"
            icon={Briefcase}
            trend={15}
            delay={0.1}
          />
          <StatsCard
            title="قيمة إجمالية"
            value={formatCurrency(15000000)}
            icon={TrendingUp}
            trend={8}
            delay={0.2}
          />
          <StatsCard
            title="مستثمرون مهتمون"
            value="145"
            icon={Users}
            trend={24}
            delay={0.3}
          />
          <StatsCard
            title="معدل التحويل"
            value="18.5%"
            icon={Percent}
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
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeTab === tab.id ? "text-gold" : "text-muted-foreground hover:text-foreground"
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
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass-card p-4 rounded-xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن فرصة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface2 border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 transition-colors text-foreground"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-surface2 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold/50 transition-colors text-foreground min-w-[150px]"
              >
                <option value="all">جميع القطاعات</option>
                {sectors.filter(s => s !== 'all').map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'analytics' ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="glass-card p-6 rounded-xl border border-border/50 flex flex-col items-center justify-center min-h-[300px]">
                  <BarChart3 className="w-16 h-16 text-gold/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">توزيع الاستثمارات حسب القطاع</h3>
                  <p className="text-muted-foreground text-sm text-center">رسم بياني يوضح حجم الاستثمارات في كل قطاع (مؤقت)</p>
                </div>
                <div className="glass-card p-6 rounded-xl border border-border/50 flex flex-col items-center justify-center min-h-[300px]">
                  <PieChart className="w-16 h-16 text-gold/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">حالة الفرص الاستثمارية</h3>
                  <p className="text-muted-foreground text-sm text-center">رسم بياني يوضح نسبة الفرص النشطة إلى المغلقة (مؤقت)</p>
                </div>
                <div className="glass-card p-6 rounded-xl border border-border/50 flex flex-col items-center justify-center min-h-[300px] md:col-span-2">
                  <Activity className="w-16 h-16 text-gold/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">نمو الاستثمارات خلال العام</h3>
                  <p className="text-muted-foreground text-sm text-center">رسم بياني يوضح مسار نمو الاستثمارات (مؤقت)</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
              >
                {filteredOpportunities.length > 0 ? (
                  filteredOpportunities.map((opp, index) => (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-5 rounded-xl border border-border/50 hover:border-gold/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gold/70 bg-gold/10 px-2 py-0.5 rounded">{opp.id}</span>
                            <StatusBadge status={getStatusColor(opp.status)}/>
                          </div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors">{opp.title}</h3>
                        </div>
                        <div className="text-left">
                          <span className="text-xs text-muted-foreground block mb-1">العائد المتوقع</span>
                          <span className="text-lg font-bold text-emerald-400">%{opp.expectedROI}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{opp.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-surface2 p-3 rounded-lg border border-border/30">
                          <span className="text-xs text-muted-foreground block mb-1">نطاق الاستثمار</span>
                          <span className="text-sm font-semibold text-foreground">
                            {formatCurrency(opp.investmentRange[0])} - {formatCurrency(opp.investmentRange[1])}
                          </span>
                        </div>
                        <div className="bg-surface2 p-3 rounded-lg border border-border/30">
                          <span className="text-xs text-muted-foreground block mb-1">المستثمرون المهتمون</span>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold" />
                            <span className="text-sm font-semibold text-foreground">{opp.interestedInvestors} مستثمر</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{opp.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>الموعد: {formatDate(opp.deadline)}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleAction(opp.id)}
                          className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
                        >
                          التفاصيل
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground bg-surface2/50 rounded-xl border border-border/50">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p>لم يتم العثور على فرص استثمارية مطابقة للبحث.</p>
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
