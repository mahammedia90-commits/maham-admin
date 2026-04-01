import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Star, 
  Award, 
  Crown, 
  Diamond, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Types
type SponsorshipStatus = 'متاح' | 'محجوز' | 'مغلق';
type SponsorshipTier = 'ماسي' | 'بلاتيني' | 'ذهبي' | 'فضي';

interface SponsorshipOpportunity {
  id: string;
  title: string;
  event: string;
  tier: SponsorshipTier;
  price: number;
  benefits: string[];
  status: SponsorshipStatus;
  deadline: string;
  interestedSponsors: number;
}

// Mock Data
const MOCK_OPPORTUNITIES: SponsorshipOpportunity[] = [
  {
    id: 'SPO-001',
    title: 'الراعي الرسمي لمعرض التقنية',
    event: 'معرض التقنية والابتكار 2025',
    tier: 'ماسي',
    price: 500000,
    benefits: ['جناح 100م', 'شعار في كل المطبوعات', 'كلمة افتتاحية'],
    status: 'متاح',
    deadline: '2024-12-01',
    interestedSponsors: 5,
  },
  {
    id: 'SPO-002',
    title: 'راعي الضيافة',
    event: 'معرض التقنية والابتكار 2025',
    tier: 'ذهبي',
    price: 150000,
    benefits: ['جناح 30م', 'شعار في منطقة الضيافة'],
    status: 'محجوز',
    deadline: '2024-11-15',
    interestedSponsors: 12,
  },
  {
    id: 'SPO-003',
    title: 'الراعي التقني',
    event: 'مؤتمر الذكاء الاصطناعي',
    tier: 'بلاتيني',
    price: 300000,
    benefits: ['توفير البنية التحتية', 'شعار في التطبيق', 'جلسة حوارية'],
    status: 'متاح',
    deadline: '2024-12-10',
    interestedSponsors: 3,
  },
  {
    id: 'SPO-004',
    title: 'راعي التسجيل',
    event: 'مؤتمر الذكاء الاصطناعي',
    tier: 'فضي',
    price: 75000,
    benefits: ['شعار على بطاقات الدخول', 'مساحة إعلانية'],
    status: 'مغلق',
    deadline: '2024-10-01',
    interestedSponsors: 8,
  },
];

const STATS = [
  {
    title: 'فرص متاحة',
    value: '12',
    icon: Star,
    trend: 3,
  },
  {
    title: 'قيمة إجمالية (المتاحة)',
    value: formatCurrency(1250000),
    icon: DollarSign,
    trend: 15,
  },
  {
    title: 'معدل الحجز',
    value: '68%',
    icon: TrendingUp,
    trend: 5,
  },
  {
    title: 'رعاة مهتمون',
    value: '45',
    icon: Users,
    trend: 12,
  },
];

const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'available', label: 'فرص متاحة' },
  { id: 'booked', label: 'محجوزة' },
  { id: 'analytics', label: 'تحليلات' },
];

export default function SponsorshipOppsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const getTierIcon = (tier: SponsorshipTier) => {
    switch (tier) {
      case 'ماسي': return <Diamond className="w-4 h-4 text-blue-400" />;
      case 'بلاتيني': return <Crown className="w-4 h-4 text-slate-300" />;
      case 'ذهبي': return <Award className="w-4 h-4 text-yellow-400" />;
      case 'فضي': return <Award className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTierColor = (tier: SponsorshipTier) => {
    switch (tier) {
      case 'ماسي': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'بلاتيني': return 'text-slate-300 bg-slate-300/10 border-slate-300/20';
      case 'ذهبي': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'فضي': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const filteredOpportunities = MOCK_OPPORTUNITIES.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          opp.event.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'all' || opp.tier === selectedTier;
    
    let matchesTab = true;
    if (activeTab === 'available') matchesTab = opp.status === 'متاح';
    if (activeTab === 'booked') matchesTab = opp.status === 'محجوز';
    
    return matchesSearch && matchesTier && matchesTab;
  });

  const handleAction = (action: string, id: string) => {
    toast.success(`تم تنفيذ الإجراء: ${action} للعنصر ${id}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <PageHeader 
          title="فرص الرعاية" 
          subtitle="إدارة ومتابعة باقات وفرص الرعاية للفعاليات المختلفة"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border/50 pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeTab === tab.id 
                  ? "text-gold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-4 rounded-xl">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن فرصة رعاية أو فعالية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-surface2 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-gold/50 transition-colors text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full sm:w-auto pl-8 pr-10 py-2 bg-surface2 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-gold/50 transition-colors text-foreground appearance-none"
              >
                <option value="all">جميع الفئات</option>
                <option value="ماسي">ماسي</option>
                <option value="بلاتيني">بلاتيني</option>
                <option value="ذهبي">ذهبي</option>
                <option value="فضي">فضي</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'analytics' ? (
          <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-foreground">تحليلات فرص الرعاية</h3>
            <p className="text-muted-foreground max-w-md">
              لوحة التحليلات التفصيلية قيد التطوير. ستعرض قريباً إحصائيات مفصلة حول أداء باقات الرعاية وعوائد الاستثمار.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opp, index) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-5 rounded-xl border border-border/50 hover:border-gold/30 transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                                {opp.title}
                              </h3>
                              <StatusBadge status={opp.status} />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{opp.event}</span>
                            </div>
                          </div>
                          
                          <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                            getTierColor(opp.tier)
                          )}>
                            {getTierIcon(opp.tier)}
                            {opp.tier}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border/50">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">السعر</p>
                            <p className="font-semibold text-foreground">{formatCurrency(opp.price)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">الموعد النهائي</p>
                            <p className="font-medium text-foreground">{formatDate(opp.deadline)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">الرعاة المهتمون</p>
                            <div className="flex items-center gap-1 text-foreground font-medium">
                              <Users className="w-4 h-4 text-gold" />
                              {opp.interestedSponsors}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">المزايا</p>
                            <p className="font-medium text-foreground">{opp.benefits.length} مزايا</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {opp.benefits.map((benefit, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-surface2 text-xs text-muted-foreground border border-border/50">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex lg:flex-col justify-end gap-2 border-t lg:border-t-0 lg:border-r border-border/50 pt-4 lg:pt-0 lg:pr-6">
                        <button 
                          onClick={() => handleAction('عرض التفاصيل', opp.id)}
                          className="p-2 hover:bg-surface2 rounded-lg text-muted-foreground hover:text-gold transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction('تعديل', opp.id)}
                          className="p-2 hover:bg-surface2 rounded-lg text-muted-foreground hover:text-blue-400 transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction('حذف', opp.id)}
                          className="p-2 hover:bg-surface2 rounded-lg text-muted-foreground hover:text-red-400 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">لا توجد نتائج</h3>
                  <p className="text-muted-foreground">لم يتم العثور على فرص رعاية تطابق معايير البحث الحالية.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
