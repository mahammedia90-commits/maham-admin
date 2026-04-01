import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Users, 
  Activity, 
  Award, 
  Search, 
  Filter, 
  Download,
  MonitorPlay,
  LayoutTemplate,
  Printer,
  Share2,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Types
interface BrandVisibilityData {
  id: string;
  brand: string;
  sponsor: string;
  impressions: number;
  reach: number;
  engagement: number;
  placements: {
    banner: number;
    screen: number;
    print: number;
  };
  socialMentions: number;
  status: 'active' | 'inactive';
}

// Mock Data
const mockStats = [
  { title: 'إجمالي المشاهدات', value: '2.4M', icon: Eye, trend: 15, delay: 0.1 },
  { title: 'الوصول', value: '1.8M', icon: Users, trend: 8, delay: 0.2 },
  { title: 'التفاعل', value: '450K', icon: Activity, trend: 22, delay: 0.3 },
  { title: 'العلامات النشطة', value: '124', icon: Award, trend: 5, delay: 0.4 },
];

const mockData: BrandVisibilityData[] = [
  {
    id: '1',
    brand: 'أرامكو',
    sponsor: 'الراعي الماسي',
    impressions: 450000,
    reach: 320000,
    engagement: 85000,
    placements: { banner: 12, screen: 8, print: 5000 },
    socialMentions: 1200,
    status: 'active',
  },
  {
    id: '2',
    brand: 'سابك',
    sponsor: 'الراعي البلاتيني',
    impressions: 380000,
    reach: 290000,
    engagement: 72000,
    placements: { banner: 8, screen: 6, print: 4000 },
    socialMentions: 950,
    status: 'active',
  },
  {
    id: '3',
    brand: 'stc',
    sponsor: 'الراعي الرقمي',
    impressions: 520000,
    reach: 410000,
    engagement: 110000,
    placements: { banner: 15, screen: 12, print: 2000 },
    socialMentions: 2500,
    status: 'active',
  },
  {
    id: '4',
    brand: 'الراجحي',
    sponsor: 'الراعي المالي',
    impressions: 310000,
    reach: 250000,
    engagement: 65000,
    placements: { banner: 6, screen: 4, print: 3000 },
    socialMentions: 800,
    status: 'active',
  },
  {
    id: '5',
    brand: 'نيوم',
    sponsor: 'شريك استراتيجي',
    impressions: 650000,
    reach: 520000,
    engagement: 145000,
    placements: { banner: 20, screen: 15, print: 10000 },
    socialMentions: 3800,
    status: 'active',
  },
];

export default function BrandVisibilityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = mockData.filter(item => 
    item.brand.includes(searchQuery) || item.sponsor.includes(searchQuery)
  );

  const handleExport = () => {
    toast.success('تم تصدير التقرير بنجاح');
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'brands', label: 'العلامات التجارية' },
    { id: 'media', label: 'التغطية الإعلامية' },
    { id: 'social', label: 'السوشيال ميديا' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="الظهور الإعلامي للعلامات" 
          subtitle="إدارة ومتابعة ظهور الرعاة والعلامات التجارية في المعرض"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              delay={stat.delay}
            />
          ))}
        </div>

        {/* Tabs */}
        <div className="glass-card rounded-xl p-1">
          <div className="flex space-x-1 space-x-reverse overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-gold/10 text-gold shadow-sm"
                    : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="glass-card rounded-xl p-6 border border-border/50 bg-surface2">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن علامة تجارية أو راعي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-gold/50 text-foreground transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground hover:bg-surface2 transition-colors">
              <Filter className="w-4 h-4" />
              <span>تصفية</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-sm">
                  <th className="pb-4 font-medium">العلامة التجارية</th>
                  <th className="pb-4 font-medium">نوع الرعاية</th>
                  <th className="pb-4 font-medium">المشاهدات</th>
                  <th className="pb-4 font-medium">الوصول</th>
                  <th className="pb-4 font-medium">التفاعل</th>
                  <th className="pb-4 font-medium">أماكن الظهور</th>
                  <th className="pb-4 font-medium">الإشارات</th>
                  <th className="pb-4 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence>
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 last:border-0 hover:bg-surface2/50 transition-colors"
                    >
                      <td className="py-4 font-medium text-foreground">
                        {item.brand}
                      </td>
                      <td className="py-4 text-gold">
                        {item.sponsor}
                      </td>
                      <td className="py-4 text-foreground">
                        {item.impressions.toLocaleString()}
                      </td>
                      <td className="py-4 text-foreground">
                        {item.reach.toLocaleString()}
                      </td>
                      <td className="py-4 text-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          {item.engagement.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="flex items-center gap-1" title="لوحات إعلانية">
                            <LayoutTemplate className="w-4 h-4" />
                            <span>{item.placements.banner}</span>
                          </div>
                          <div className="flex items-center gap-1" title="شاشات">
                            <MonitorPlay className="w-4 h-4" />
                            <span>{item.placements.screen}</span>
                          </div>
                          <div className="flex items-center gap-1" title="مطبوعات">
                            <Printer className="w-4 h-4" />
                            <span>{item.placements.print}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Share2 className="w-4 h-4 text-blue-400" />
                          {item.socialMentions.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4">
                        <StatusBadge status={item.status} />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                لا توجد نتائج مطابقة للبحث
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
