import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Map, LayoutGrid, CheckCircle, Clock, Wrench, Building2, Store, Expand } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// Mock Data
const MOCK_SPACES = [
  {
    id: 'SP-001',
    name: 'الجناح الماسي 1',
    hall: 'القاعة الرئيسية A',
    size: 150,
    type: 'جناح',
    price: 50000,
    status: 'محجوز',
    tenant: 'شركة التقنية المتقدمة',
    features: ['واجهة بانورامية', 'توصيلات VIP', 'مخزن خاص'],
  },
  {
    id: 'SP-002',
    name: 'مساحة عرض مفتوحة B',
    hall: 'القاعة B',
    size: 50,
    type: 'مساحة مفتوحة',
    price: 15000,
    status: 'متاح',
    tenant: null,
    features: ['إضاءة مركزة', 'توصيل كهرباء 3-phase'],
  },
  {
    id: 'SP-003',
    name: 'كشك C1',
    hall: 'المنطقة C',
    size: 12,
    type: 'كشك',
    price: 5000,
    status: 'صيانة',
    tenant: null,
    features: ['تجهيز أساسي', 'شاشة عرض'],
  },
  {
    id: 'SP-004',
    name: 'الجناح الذهبي 2',
    hall: 'القاعة الرئيسية A',
    size: 100,
    type: 'جناح',
    price: 35000,
    status: 'متاح',
    tenant: null,
    features: ['موقع مميز', 'سجاد فاخر'],
  },
  {
    id: 'SP-005',
    name: 'كشك C2',
    hall: 'المنطقة C',
    size: 12,
    type: 'كشك',
    price: 5000,
    status: 'محجوز',
    tenant: 'مؤسسة الرواد',
    features: ['تجهيز أساسي'],
  },
];

const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'available', label: 'المساحات المتاحة' },
  { id: 'booked', label: 'المحجوزة' },
  { id: 'map', label: 'خريطة المعرض' },
];

export default function SpacesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const totalSpaces = MOCK_SPACES.length;
  const bookedSpaces = MOCK_SPACES.filter((s) => s.status === 'محجوز').length;
  const availableSpaces = MOCK_SPACES.filter((s) => s.status === 'متاح').length;
  const occupancyRate = Math.round((bookedSpaces / totalSpaces) * 100) || 0;

  // Filter logic
  const filteredSpaces = MOCK_SPACES.filter((space) => {
    const matchesSearch = space.name.includes(searchQuery) || space.id.includes(searchQuery);
    if (activeTab === 'available') return matchesSearch && space.status === 'متاح';
    if (activeTab === 'booked') return matchesSearch && space.status === 'محجوز';
    return matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'جناح': return <Building2 className="w-4 h-4" />;
      case 'كشك': return <Store className="w-4 h-4" />;
      case 'مساحة مفتوحة': return <Expand className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="إدارة المساحات والأجنحة"
          subtitle="إدارة مساحات العرض، الأجنحة، والأكشاك في المعرض"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي المساحات"
            value={totalSpaces.toString()}
            icon={LayoutGrid}
            delay={0.1}
          />
          <StatsCard
            title="المساحات المحجوزة"
            value={bookedSpaces.toString()}
            icon={CheckCircle}
            trend={12}
            delay={0.2}
          />
          <StatsCard
            title="المساحات المتاحة"
            value={availableSpaces.toString()}
            icon={Clock}
            delay={0.3}
          />
          <StatsCard
            title="نسبة الإشغال"
            value={`${occupancyRate}%`}
            icon={Map}
            trend={5}
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
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        {activeTab !== 'map' && (
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-card p-4 rounded-xl border border-border/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث برقم أو اسم المساحة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface2 border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 transition-colors text-foreground"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface2 border border-border/50 rounded-lg text-sm hover:bg-gold/10 hover:text-gold transition-colors text-foreground">
              <Filter className="w-4 h-4" />
              <span>تصفية متقدمة</span>
            </button>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-xl border border-border/50 p-8 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <Map className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-foreground">خريطة المعرض التفاعلية</h3>
              <p className="text-muted-foreground max-w-md">
                جاري تحميل وحدة الخريطة التفاعلية. ستتمكن هنا من رؤية توزيع المساحات والأجنحة بشكل مرئي.
              </p>
              <button 
                onClick={() => toast.success('تم تحديث بيانات الخريطة')}
                className="mt-4 px-6 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90 transition-colors"
              >
                تحديث الخريطة
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSpaces.map((space, index) => (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-xl border border-border/50 p-5 hover:border-gold/30 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-0.5 rounded">
                          {space.id}
                        </span>
                        <StatusBadge status={space.status} />
                      </div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                        {space.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center text-muted-foreground">
                      {getTypeIcon(space.type)}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">القاعة:</span>
                      <span className="text-foreground font-medium">{space.hall}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المساحة:</span>
                      <span className="text-foreground font-medium">{space.size} م²</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">النوع:</span>
                      <span className="text-foreground font-medium">{space.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">السعر:</span>
                      <span className="text-gold font-bold">{formatCurrency(space.price)}</span>
                    </div>
                    {space.tenant && (
                      <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                        <span className="text-muted-foreground">المستأجر:</span>
                        <span className="text-foreground font-medium">{space.tenant}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex flex-wrap gap-2">
                      {space.features.map((feature, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-md bg-surface2 text-muted-foreground">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredSpaces.length === 0 && activeTab !== 'map' && (
          <div className="glass-card rounded-xl border border-border/50 p-12 text-center flex flex-col items-center">
            <LayoutGrid className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg text-foreground font-medium">لا توجد مساحات مطابقة</p>
            <p className="text-sm text-muted-foreground mt-1">جرب تغيير كلمات البحث أو الفلتر</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
