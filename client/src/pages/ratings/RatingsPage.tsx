import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  User, 
  Building2, 
  CalendarDays,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Types
type RatingType = 'event' | 'service' | 'exhibitor';
type ReviewerRole = 'visitor' | 'exhibitor' | 'sponsor';

interface Rating {
  id: string;
  reviewer: {
    name: string;
    role: ReviewerRole;
    avatar?: string;
  };
  target: string;
  rating: number;
  comment: string;
  date: string;
  type: RatingType;
  verified: boolean;
  status: 'published' | 'pending' | 'hidden';
}

// Mock Data
const MOCK_RATINGS: Rating[] = [
  {
    id: 'R-1001',
    reviewer: { name: 'أحمد عبد الله', role: 'visitor' },
    target: 'معرض التقنية السعودي',
    rating: 5,
    comment: 'تنظيم ممتاز وتجربة رائعة. المنصات كانت واضحة وسهلة الوصول.',
    date: '2024-05-15T10:30:00Z',
    type: 'event',
    verified: true,
    status: 'published'
  },
  {
    id: 'R-1002',
    reviewer: { name: 'شركة الابتكار المحدودة', role: 'exhibitor' },
    target: 'خدمات التنظيف والصيانة',
    rating: 4,
    comment: 'الخدمات جيدة بشكل عام، لكن نتمنى تحسين سرعة الاستجابة في أوقات الذروة.',
    date: '2024-05-14T14:20:00Z',
    type: 'service',
    verified: true,
    status: 'published'
  },
  {
    id: 'R-1003',
    reviewer: { name: 'مجموعة الأفق', role: 'sponsor' },
    target: 'جناح شركة التقدم',
    rating: 5,
    comment: 'عرض مبهر ومنتجات مبتكرة. فريق العمل كان محترفاً جداً.',
    date: '2024-05-12T09:15:00Z',
    type: 'exhibitor',
    verified: true,
    status: 'published'
  },
  {
    id: 'R-1004',
    reviewer: { name: 'سارة خالد', role: 'visitor' },
    target: 'معرض البناء والتشييد',
    rating: 2,
    comment: 'الازدحام كان شديداً ولم يكن هناك مسارات واضحة للحركة.',
    date: '2024-05-10T16:45:00Z',
    type: 'event',
    verified: false,
    status: 'pending'
  },
  {
    id: 'R-1005',
    reviewer: { name: 'مؤسسة الرواد', role: 'exhibitor' },
    target: 'خدمات الإنترنت والشبكات',
    rating: 1,
    comment: 'انقطاع متكرر في الاتصال أثر على عروضنا التقديمية.',
    date: '2024-05-09T11:00:00Z',
    type: 'service',
    verified: true,
    status: 'published'
  },
  {
    id: 'R-1006',
    reviewer: { name: 'محمد فهد', role: 'visitor' },
    target: 'جناح الإبداع الرقمي',
    rating: 4,
    comment: 'تقنيات مثيرة للاهتمام، لكن المساحة كانت ضيقة قليلاً.',
    date: '2024-05-08T13:30:00Z',
    type: 'exhibitor',
    verified: true,
    status: 'published'
  }
];

export default function RatingsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'services' | 'exhibitors'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratings, setRatings] = useState<Rating[]>(MOCK_RATINGS);

  // Filter ratings based on active tab and search query
  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = 
      rating.reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.comment.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (activeTab === 'events') return rating.type === 'event';
    if (activeTab === 'services') return rating.type === 'service';
    if (activeTab === 'exhibitors') return rating.type === 'exhibitor';
    
    return true; // overview tab
  });

  // Calculate stats
  const totalRatings = ratings.length;
  const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;
  const positiveRatings = ratings.filter(r => r.rating >= 4).length;
  const negativeRatings = ratings.filter(r => r.rating <= 2).length;

  const handleAction = (id: string, action: string) => {
    toast.success(`تم تنفيذ الإجراء: ${action} للتقييم ${id}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={cn(
              "w-4 h-4",
              star <= rating ? "fill-gold text-gold" : "fill-muted text-muted"
            )} 
          />
        ))}
      </div>
    );
  };

  const getRoleLabel = (role: ReviewerRole) => {
    switch (role) {
      case 'visitor': return 'زائر';
      case 'exhibitor': return 'عارض';
      case 'sponsor': return 'راعي';
      default: return role;
    }
  };

  const getTypeLabel = (type: RatingType) => {
    switch (type) {
      case 'event': return 'فعالية';
      case 'service': return 'خدمة';
      case 'exhibitor': return 'جناح عارض';
      default: return type;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="التقييمات والمراجعات" 
          subtitle="إدارة ومتابعة تقييمات الزوار والعارضين للفعاليات والخدمات"
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="متوسط التقييم العام"
            value={averageRating.toFixed(1)}
            icon={Star}
            trend={5}
            delay={0.1}
          />
          <StatsCard
            title="إجمالي التقييمات"
            value={totalRatings.toString()}
            icon={MessageSquare}
            trend={12}
            delay={0.2}
          />
          <StatsCard
            title="تقييمات إيجابية"
            value={positiveRatings.toString()}
            icon={ThumbsUp}
            trend={8}
            delay={0.3}
          />
          <StatsCard
            title="تقييمات سلبية"
            value={negativeRatings.toString()}
            icon={ThumbsDown}
            trend={2}
            delay={0.4}
          />
        </div>

        {/* Main Content */}
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden bg-surface2">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-4 border-b border-border/50 bg-surface2/50">
            {[
              { id: 'overview', label: 'نظرة عامة' },
              { id: 'events', label: 'تقييمات الفعاليات' },
              { id: 'services', label: 'تقييمات الخدمات' },
              { id: 'exhibitors', label: 'تقييمات العارضين' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative",
                  activeTab === tab.id 
                    ? "text-gold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-surface3"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabRatings"
                    className="absolute inset-0 bg-gold/10 rounded-xl border border-gold/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface2/30">
            <div className="relative w-full sm:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="ابحث في التقييمات، الأسماء، أو التعليقات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-xl bg-surface3 border border-border/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface3 border border-border/50 hover:border-gold/30 hover:bg-gold/5 transition-all text-sm text-foreground">
                <Filter className="w-4 h-4 text-gold" />
                <span>تصفية</span>
              </button>
            </div>
          </div>

          {/* Ratings List */}
          <div className="p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredRatings.length > 0 ? (
                filteredRatings.map((rating, index) => (
                  <motion.div
                    key={rating.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 rounded-2xl bg-surface3 border border-border/50 hover:border-gold/30 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                      {/* Reviewer Info */}
                      <div className="flex items-start gap-4 w-full md:w-1/3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                          {rating.reviewer.role === 'visitor' ? <User className="w-5 h-5 text-gold" /> : 
                           rating.reviewer.role === 'exhibitor' ? <Building2 className="w-5 h-5 text-gold" /> : 
                           <ShieldCheck className="w-5 h-5 text-gold" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{rating.reviewer.name}</h4>
                            {rating.verified && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <span>{getRoleLabel(rating.reviewer.role)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {formatDate(rating.date)}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Rating Content */}
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2 py-1 rounded-md bg-surface2 border border-border/50 text-muted-foreground">
                              {getTypeLabel(rating.type)}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {rating.target}
                            </span>
                          </div>
                          {renderStars(rating.rating)}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                          "{rating.comment}"
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                        <StatusBadge status={rating.status === 'published' ? 'active' : rating.status === 'pending' ? 'pending' : 'inactive'} />
                        
                        <div className="relative group/menu">
                          <button className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <div className="absolute left-0 top-full mt-1 w-40 rounded-xl bg-surface3 border border-border/50 shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 overflow-hidden">
                            <button 
                              onClick={() => handleAction(rating.id, 'نشر')}
                              className="w-full text-right px-4 py-2 text-sm hover:bg-surface2 text-foreground transition-colors"
                            >
                              نشر التقييم
                            </button>
                            <button 
                              onClick={() => handleAction(rating.id, 'إخفاء')}
                              className="w-full text-right px-4 py-2 text-sm hover:bg-surface2 text-foreground transition-colors"
                            >
                              إخفاء التقييم
                            </button>
                            <button 
                              onClick={() => handleAction(rating.id, 'رد')}
                              className="w-full text-right px-4 py-2 text-sm hover:bg-surface2 text-gold transition-colors"
                            >
                              إضافة رد
                            </button>
                          </div>
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
                  <div className="w-16 h-16 rounded-full bg-surface3 border border-border/50 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">لا توجد تقييمات</h3>
                  <p className="text-sm text-muted-foreground">
                    لم يتم العثور على تقييمات تطابق معايير البحث الخاصة بك.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
