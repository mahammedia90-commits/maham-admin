import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Store,
  CreditCard,
  BarChart3,
  MapPin
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// Mock Data
const stats = [
  {
    title: 'إيرادات اليوم',
    value: formatCurrency(1250400),
    trend: 15,
    icon: TrendingUp,
  },
  {
    title: 'زوار اليوم',
    value: '12,450',
    trend: 8,
    icon: Users,
  },
  {
    title: 'متوسط السلة',
    value: formatCurrency(450),
    trend: 2,
    icon: ShoppingCart,
  },
  {
    title: 'معدل التحويل',
    value: '4.8%',
    trend: -1,
    icon: Activity,
  }
];

const liveSales = [
  { id: 'TRX-001', time: '10:45:22', booth: 'جناح التقنية A12', amount: 12500, status: 'مكتمل', method: 'بطاقة ائتمان' },
  { id: 'TRX-002', time: '10:44:15', booth: 'المطعم الذهبي', amount: 350, status: 'مكتمل', method: 'مدى' },
  { id: 'TRX-003', time: '10:42:50', booth: 'معرض السيارات', amount: 450000, status: 'قيد المعالجة', method: 'تحويل بنكي' },
  { id: 'TRX-004', time: '10:40:11', booth: 'جناح العطور', amount: 1200, status: 'مكتمل', method: 'Apple Pay' },
  { id: 'TRX-005', time: '10:38:05', booth: 'المقهى الملكي', amount: 85, status: 'مكتمل', method: 'نقدي' },
];

const topBooths = [
  { id: 1, name: 'جناح التقنية المتقدمة', category: 'تكنولوجيا', visitors: 1250, sales: 450000, conversion: '12%' },
  { id: 2, name: 'معرض السيارات الفاخرة', category: 'سيارات', visitors: 980, sales: 1250000, conversion: '5%' },
  { id: 3, name: 'ركن العطور الشرقية', category: 'عطور', visitors: 850, sales: 45000, conversion: '18%' },
  { id: 4, name: 'المطعم الذهبي', category: 'أغذية', visitors: 1500, sales: 25000, conversion: '45%' },
];

const tabs = [
  { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { id: 'sales', label: 'المبيعات الحية', icon: CreditCard },
  { id: 'visitors', label: 'حركة الزوار', icon: Users },
  { id: 'analytics', label: 'التحليلات', icon: Activity },
];

export default function LiveEconomyPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = () => {
    toast.success('تم تحديث البيانات الاقتصادية بنجاح');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="الاقتصاد الحي للمعرض"
          subtitle="مراقبة وتحليل الحركة الاقتصادية والمبيعات في الوقت الفعلي"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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
        <div className="flex space-x-2 space-x-reverse border-b border-border/50 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                  isActive 
                    ? "bg-gold/10 text-gold border border-gold/20" 
                    : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Sales Feed */}
                <div className="lg:col-span-2 glass-card p-6 rounded-xl border border-border/50 bg-surface2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Activity className="w-5 h-5 text-gold" />
                      أحدث العمليات
                    </h3>
                    <button className="text-sm text-gold hover:underline">عرض الكل</button>
                  </div>
                  
                  <div className="space-y-4">
                    {liveSales.map((sale, idx) => (
                      <motion.div 
                        key={sale.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:border-gold/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{sale.booth}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{sale.id}</span>
                              <span>•</span>
                              <span>{sale.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-foreground">{formatCurrency(sale.amount)}</p>
                          <StatusBadge status={sale.status === 'مكتمل' ? 'success' : 'warning'} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Top Booths */}
                <div className="glass-card p-6 rounded-xl border border-border/50 bg-surface2">
                  <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Store className="w-5 h-5 text-gold" />
                    الأجنحة الأكثر نشاطاً
                  </h3>
                  
                  <div className="space-y-4">
                    {topBooths.map((booth, idx) => (
                      <div key={booth.id} className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-foreground">{booth.name}</p>
                            <p className="text-xs text-muted-foreground">{booth.category}</p>
                          </div>
                          <div className="text-xs font-bold px-2 py-1 rounded-full bg-gold/10 text-gold">
                            #{idx + 1}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">الزوار</p>
                            <p className="font-medium text-foreground">{booth.visitors.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">المبيعات</p>
                            <p className="font-medium text-foreground">{formatCurrency(booth.sales)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div className="glass-card p-6 rounded-xl border border-border/50 bg-surface2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-lg font-semibold text-foreground">سجل المبيعات الحية</h3>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text"
                        placeholder="بحث في العمليات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 rounded-lg bg-background border border-border/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-sm text-foreground"
                      />
                    </div>
                    <button className="p-2 rounded-lg bg-background border border-border/50 hover:border-gold text-muted-foreground hover:text-gold transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="text-xs text-muted-foreground uppercase bg-background/50">
                      <tr>
                        <th className="px-4 py-3 rounded-tr-lg">رقم العملية</th>
                        <th className="px-4 py-3">الوقت</th>
                        <th className="px-4 py-3">الجناح</th>
                        <th className="px-4 py-3">طريقة الدفع</th>
                        <th className="px-4 py-3">المبلغ</th>
                        <th className="px-4 py-3 rounded-tl-lg">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveSales.map((sale) => (
                        <tr key={sale.id} className="border-b border-border/50 hover:bg-background/30 transition-colors">
                          <td className="px-4 py-4 font-medium text-foreground">{sale.id}</td>
                          <td className="px-4 py-4 text-muted-foreground">{sale.time}</td>
                          <td className="px-4 py-4 text-foreground">{sale.booth}</td>
                          <td className="px-4 py-4 text-muted-foreground">{sale.method}</td>
                          <td className="px-4 py-4 font-bold text-foreground">{formatCurrency(sale.amount)}</td>
                          <td className="px-4 py-4">
                            <StatusBadge status={sale.status === 'مكتمل' ? 'success' : 'warning'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(activeTab === 'visitors' || activeTab === 'analytics') && (
              <div className="glass-card p-12 rounded-xl border border-border/50 bg-surface2 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4">
                  {activeTab === 'visitors' ? <MapPin className="w-8 h-8" /> : <BarChart3 className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {activeTab === 'visitors' ? 'خريطة حركة الزوار' : 'التحليلات المتقدمة'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  جاري تحميل البيانات الحية من أجهزة الاستشعار وأنظمة المعرض...
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
