import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Video, 
  FileText, 
  HardDrive, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  UploadCloud
} from 'lucide-react';

// Interfaces
interface Asset {
  id: string;
  sponsor: string;
  type: 'شعار' | 'بانر' | 'فيديو' | 'بروشور';
  fileName: string;
  size: string;
  sizeInBytes: number;
  uploadDate: string;
  status: 'معتمد' | 'قيد المراجعة' | 'مرفوض';
  dimensions?: string;
  format: string;
}

// Mock Data
const MOCK_ASSETS: Asset[] = [
  {
    id: 'AST-001',
    sponsor: 'شركة التقنية المتقدمة',
    type: 'شعار',
    fileName: 'tech_advanced_logo_dark.svg',
    size: '150 KB',
    sizeInBytes: 153600,
    uploadDate: '2026-03-25T10:30:00Z',
    status: 'معتمد',
    dimensions: '1024x1024',
    format: 'SVG'
  },
  {
    id: 'AST-002',
    sponsor: 'مجموعة العطاء',
    type: 'فيديو',
    fileName: 'alataa_promo_2026.mp4',
    size: '45 MB',
    sizeInBytes: 47185920,
    uploadDate: '2026-03-28T14:15:00Z',
    status: 'قيد المراجعة',
    dimensions: '1920x1080',
    format: 'MP4'
  },
  {
    id: 'AST-003',
    sponsor: 'بنك الابتكار',
    type: 'بروشور',
    fileName: 'innovation_bank_services.pdf',
    size: '3.2 MB',
    sizeInBytes: 3355443,
    uploadDate: '2026-03-30T09:45:00Z',
    status: 'معتمد',
    format: 'PDF'
  },
  {
    id: 'AST-004',
    sponsor: 'شركة البناء الحديث',
    type: 'بانر',
    fileName: 'modern_build_expo_banner.png',
    size: '2.1 MB',
    sizeInBytes: 2202009,
    uploadDate: '2026-04-01T11:20:00Z',
    status: 'معتمد',
    dimensions: '2000x500',
    format: 'PNG'
  },
  {
    id: 'AST-005',
    sponsor: 'شركة التقنية المتقدمة',
    type: 'فيديو',
    fileName: 'tech_interview_ceo.webm',
    size: '120 MB',
    sizeInBytes: 125829120,
    uploadDate: '2026-03-26T16:00:00Z',
    status: 'مرفوض',
    dimensions: '3840x2160',
    format: 'WEBM'
  },
  {
    id: 'AST-006',
    sponsor: 'مؤسسة الغذاء الصحي',
    type: 'شعار',
    fileName: 'healthy_food_logo.png',
    size: '450 KB',
    sizeInBytes: 460800,
    uploadDate: '2026-03-31T08:10:00Z',
    status: 'قيد المراجعة',
    dimensions: '512x512',
    format: 'PNG'
  }
];

const TABS = [
  { id: 'overview', label: 'نظرة عامة', icon: HardDrive },
  { id: 'logos', label: 'الشعارات', icon: ImageIcon },
  { id: 'marketing', label: 'المواد التسويقية', icon: FileText },
  { id: 'videos', label: 'الفيديوهات', icon: Video },
];

export default function SponsorAssetsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');

  // Derived State
  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter(asset => {
      const matchesSearch = asset.sponsor.includes(searchQuery) || asset.fileName.includes(searchQuery);
      const matchesStatus = statusFilter === 'الكل' || asset.status === statusFilter;
      
      let matchesTab = true;
      if (activeTab === 'logos') matchesTab = asset.type === 'شعار';
      if (activeTab === 'marketing') matchesTab = asset.type === 'بانر' || asset.type === 'بروشور';
      if (activeTab === 'videos') matchesTab = asset.type === 'فيديو';

      return matchesSearch && matchesStatus && matchesTab;
    });
  }, [searchQuery, statusFilter, activeTab]);

  // Stats Calculations
  const totalAssets = MOCK_ASSETS.length;
  const approvedAssets = MOCK_ASSETS.filter(a => a.status === 'معتمد').length;
  const pendingAssets = MOCK_ASSETS.filter(a => a.status === 'قيد المراجعة').length;
  const totalSizeBytes = MOCK_ASSETS.reduce((acc, curr) => acc + curr.sizeInBytes, 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);

  const handleDownload = (fileName: string) => {
    toast.success(`جاري تحميل ${fileName}`);
  };

  const handleDelete = (fileName: string) => {
    toast.error(`تم حذف ${fileName}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <PageHeader 
          title="أصول الرعاة الرقمية" 
          subtitle="إدارة ومراجعة الملفات والمواد التسويقية المقدمة من الرعاة"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="إجمالي الأصول" 
            value={totalAssets.toString()} 
            icon={HardDrive} 
            delay={0.1}
          />
          <StatsCard 
            title="الأصول المعتمدة" 
            value={approvedAssets.toString()} 
            icon={CheckCircle} 
            trend={12}
            delay={0.2}
          />
          <StatsCard 
            title="قيد المراجعة" 
            value={pendingAssets.toString()} 
            icon={Clock} 
            delay={0.3}
          />
          <StatsCard 
            title="حجم التخزين المستهلك" 
            value={`${totalSizeMB} MB`} 
            icon={FileText} 
            trend={5}
            delay={0.4}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 space-x-reverse border-b border-border/50 pb-2 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative whitespace-nowrap",
                  isActive 
                    ? "text-gold bg-gold/10 font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-surface2"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-gold"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass-card p-4 rounded-xl">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="ابحث باسم الراعي أو الملف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface2 border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 transition-colors text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gold" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface2 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold/50 transition-colors text-foreground"
            >
              <option value="الكل">جميع الحالات</option>
              <option value="معتمد">معتمد</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="مرفوض">مرفوض</option>
            </select>
          </div>
        </div>

        {/* Assets List */}
        <div className="glass-card rounded-xl overflow-hidden border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-surface2/50 text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">الملف</th>
                  <th className="px-6 py-4 font-medium">الراعي</th>
                  <th className="px-6 py-4 font-medium">النوع / الصيغة</th>
                  <th className="px-6 py-4 font-medium">الحجم / الأبعاد</th>
                  <th className="px-6 py-4 font-medium">تاريخ الرفع</th>
                  <th className="px-6 py-4 font-medium">الحالة</th>
                  <th className="px-6 py-4 font-medium text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset, index) => (
                      <motion.tr 
                        key={asset.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-surface2/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                              {asset.type === 'فيديو' ? <Video className="w-5 h-5" /> : 
                               asset.type === 'بروشور' ? <FileText className="w-5 h-5" /> : 
                               <ImageIcon className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-medium text-foreground max-w-[150px] truncate" title={asset.fileName}>
                                {asset.fileName}
                              </p>
                              <p className="text-xs text-muted-foreground">{asset.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">{asset.sponsor}</td>
                        <td className="px-6 py-4">
                          <p className="text-foreground">{asset.type}</p>
                          <p className="text-xs text-muted-foreground">{asset.format}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-foreground">{asset.size}</p>
                          {asset.dimensions && (
                            <p className="text-xs text-muted-foreground">{asset.dimensions}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(asset.uploadDate)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={asset.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => toast.info(`معاينة ${asset.fileName}`)}
                              className="p-2 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                              title="معاينة"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDownload(asset.fileName)}
                              className="p-2 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                              title="تحميل"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(asset.fileName)}
                              className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <HardDrive className="w-8 h-8 text-muted-foreground/50" />
                          <p>لا توجد أصول مطابقة للبحث</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
