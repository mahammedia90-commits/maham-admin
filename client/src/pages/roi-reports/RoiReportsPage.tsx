import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Award, 
  BarChart3, 
  Search, 
  Filter, 
  Download,
  Users,
  Target,
  Eye,
  Calendar,
  ChevronDown
} from 'lucide-react';

// Mock Data
const SPONSOR_REPORTS = [
  {
    id: 'SR-001',
    entity: 'شركة التقنية المتقدمة',
    type: 'sponsor',
    invested: 150000,
    revenue: 450000,
    roi: 200,
    impressions: 1250000,
    leads: 450,
    conversions: 85,
    period: 'Q1 2024',
    status: 'completed',
    date: '2024-03-31'
  },
  {
    id: 'SR-002',
    entity: 'مجموعة الاستثمار العالمية',
    type: 'sponsor',
    invested: 250000,
    revenue: 600000,
    roi: 140,
    impressions: 2100000,
    leads: 820,
    conversions: 140,
    period: 'Q1 2024',
    status: 'completed',
    date: '2024-03-31'
  },
  {
    id: 'SR-003',
    entity: 'بنك المستقبل',
    type: 'sponsor',
    invested: 100000,
    revenue: 280000,
    roi: 180,
    impressions: 850000,
    leads: 310,
    conversions: 65,
    period: 'Q2 2024',
    status: 'active',
    date: '2024-06-30'
  }
];

const EVENT_REPORTS = [
  {
    id: 'ER-001',
    entity: 'معرض التقنية السنوي',
    type: 'event',
    invested: 500000,
    revenue: 1250000,
    roi: 150,
    impressions: 5000000,
    leads: 2500,
    conversions: 450,
    period: '2024',
    status: 'completed',
    date: '2024-01-15'
  },
  {
    id: 'ER-002',
    entity: 'قمة الذكاء الاصطناعي',
    type: 'event',
    invested: 350000,
    revenue: 980000,
    roi: 180,
    impressions: 3200000,
    leads: 1800,
    conversions: 320,
    period: '2024',
    status: 'active',
    date: '2024-05-20'
  }
];

const ALL_REPORTS = [...SPONSOR_REPORTS, ...EVENT_REPORTS];

export default function RoiReportsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sponsors' | 'events'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const stats = {
    avgRoi: 170,
    totalInvestment: 1350000,
    totalRevenue: 3560000,
    topSponsor: 'شركة التقنية المتقدمة'
  };

  const handleExport = () => {
    toast.success('جاري تصدير التقارير...', {
      description: 'سيتم تحميل الملف بصيغة PDF قريباً'
    });
  };

  const filteredReports = useMemo(() => {
    let reports = ALL_REPORTS;
    
    if (activeTab === 'sponsors') {
      reports = SPONSOR_REPORTS;
    } else if (activeTab === 'events') {
      reports = EVENT_REPORTS;
    }

    return reports.filter(report => {
      const matchesSearch = report.entity.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            report.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPeriod = selectedPeriod === 'all' || report.period.includes(selectedPeriod);
      
      return matchesSearch && matchesPeriod;
    });
  }, [activeTab, searchQuery, selectedPeriod]);

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'sponsors', label: 'تقارير الرعاة' },
    { id: 'events', label: 'تقارير الفعاليات' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="تقارير العائد على الاستثمار" 
          subtitle="تحليل الأداء المالي والعوائد للرعاة والفعاليات"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="متوسط العائد (ROI)"
            value={`${stats.avgRoi}%`}
            icon={TrendingUp}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="إجمالي الاستثمار"
            value={formatCurrency(stats.totalInvestment)}
            icon={DollarSign}
            trend={8}
            delay={0.2}
          />
          <StatsCard
            title="إجمالي العوائد"
            value={formatCurrency(stats.totalRevenue)}
            icon={BarChart3}
            trend={15}
            delay={0.3}
          />
          <StatsCard
            title="أفضل راعي أداءً"
            value={stats.topSponsor}
            icon={Award}
            delay={0.4}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card p-4 rounded-xl border border-border/50">
          <div className="flex bg-surface2 rounded-lg p-1 w-full md:w-auto overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-gold/10 text-gold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface3"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث في التقارير..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-9 py-2 bg-surface2 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-gold/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none pl-8 pr-4 py-2 bg-surface2 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-gold/50 text-foreground"
              >
                <option value="all">كل الفترات</option>
                <option value="2024">2024</option>
                <option value="Q1">الربع الأول</option>
                <option value="Q2">الربع الثاني</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 border border-border/50 hover:border-gold/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-full">
                        {report.id}
                      </span>
                      <StatusBadge status={report.status as any} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                      {report.entity}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{report.period}</span>
                      <span className="text-border/50">•</span>
                      <span>{formatDate(report.date)}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gold">{report.roi}%</div>
                    <div className="text-xs text-muted-foreground">العائد على الاستثمار</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface2 p-3 rounded-lg border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">الاستثمار</div>
                    <div className="font-semibold text-foreground">{formatCurrency(report.invested)}</div>
                  </div>
                  <div className="bg-surface2 p-3 rounded-lg border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">العوائد</div>
                    <div className="font-semibold text-foreground">{formatCurrency(report.revenue)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <Eye className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-sm font-semibold text-foreground">
                      {(report.impressions / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-[10px] text-muted-foreground">مشاهدات</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-sm font-semibold text-foreground">{report.leads}</div>
                    <div className="text-[10px] text-muted-foreground">عملاء محتملين</div>
                  </div>
                  <div className="text-center">
                    <Target className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-sm font-semibold text-foreground">{report.conversions}</div>
                    <div className="text-[10px] text-muted-foreground">تحويلات</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredReports.length === 0 && (
          <div className="glass-card p-12 text-center rounded-xl border border-border/50">
            <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">لا توجد تقارير</h3>
            <p className="text-muted-foreground">لم يتم العثور على تقارير تطابق معايير البحث الحالية.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
