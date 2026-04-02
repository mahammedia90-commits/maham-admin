import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown,
  Download,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// --- Mock Data ---

const MOCK_STATS = {
  activeLicenses: 24,
  pendingRenewal: 5,
  expired: 1,
  complianceRate: 98
};

type LicenseStatus = 'active' | 'pending' | 'expired' | 'revoked';

interface License {
  id: string;
  name: string;
  authority: string;
  type: string;
  status: LicenseStatus;
  issueDate: string;
  expiryDate: string;
  requirements: string[];
}

const MOCK_LICENSES: License[] = [
  {
    id: 'LIC-2024-001',
    name: 'ترخيص تشغيل فعالية ترفيهية',
    authority: 'الهيئة العامة للترفيه',
    type: 'تشغيل',
    status: 'active',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-14',
    requirements: ['موافقة الدفاع المدني', 'خطة إدارة الحشود', 'تأمين طبي']
  },
  {
    id: 'LIC-2024-002',
    name: 'شهادة سلامة المبنى',
    authority: 'المديرية العامة للدفاع المدني',
    type: 'سلامة',
    status: 'active',
    issueDate: '2024-02-01',
    expiryDate: '2025-01-31',
    requirements: ['فحص أنظمة الإطفاء', 'مخارج الطوارئ', 'تدريب الموظفين']
  },
  {
    id: 'LIC-2024-003',
    name: 'رخصة البلدية التجارية',
    authority: 'وزارة الشؤون البلدية والقروية والإسكان',
    type: 'تجاري',
    status: 'pending',
    issueDate: '2023-06-10',
    expiryDate: '2024-06-09',
    requirements: ['سداد الرسوم', 'تحديث بيانات الموقع']
  },
  {
    id: 'LIC-2023-045',
    name: 'شهادة تسجيل ضريبة القيمة المضافة',
    authority: 'هيئة الزكاة والضريبة والجمارك (ZATCA)',
    type: 'ضريبي',
    status: 'active',
    issueDate: '2023-01-01',
    expiryDate: '2025-12-31',
    requirements: ['تقديم الإقرارات الضريبية ربع السنوية']
  },
  {
    id: 'LIC-2023-012',
    name: 'تصريح بناء مؤقت',
    authority: 'أمانة منطقة الرياض',
    type: 'إنشاءات',
    status: 'expired',
    issueDate: '2023-03-01',
    expiryDate: '2023-09-01',
    requirements: ['إزالة الهياكل المؤقتة', 'تقرير هندسي']
  }
];

const INTEGRATIONS = [
  { id: 'zatca', name: 'منصة فاتورة (ZATCA)', status: 'connected', lastSync: '2024-05-20T10:30:00Z' },
  { id: 'qiwa', name: 'منصة قوى', status: 'connected', lastSync: '2024-05-20T08:15:00Z' },
  { id: 'muqeem', name: 'بوابة مقيم', status: 'disconnected', lastSync: '2024-05-15T14:20:00Z' },
  { id: 'balady', name: 'منصة بلدي', status: 'connected', lastSync: '2024-05-19T09:00:00Z' }
];

// --- Components ---

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300",
      active 
        ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
        : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
    )}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

export default function GovernmentPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'licenses' | 'compliance' | 'integrations'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLicenses = MOCK_LICENSES.filter(license => {
    const matchesSearch = license.name.includes(searchQuery) || license.authority.includes(searchQuery) || license.id.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRenew = (id: string) => {
    toast.success(`تم إرسال طلب تجديد للترخيص ${id}`);
  };

  const handleSync = (name: string) => {
    toast.success(`جاري مزامنة البيانات مع ${name}...`);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <PageHeader 
          title="الخدمات الحكومية الرقمية" 
          subtitle="إدارة التراخيص، التصاريح، الامتثال، والتكامل مع الجهات الحكومية"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="التراخيص النشطة"
            value={MOCK_STATS.activeLicenses.toString()}
            icon={ShieldCheck}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="قيد التجديد"
            value={MOCK_STATS.pendingRenewal.toString()}
            icon={Clock}
            trend={2}
            delay={0.2}
          />
          <StatsCard
            title="تراخيص منتهية"
            value={MOCK_STATS.expired.toString()}
            icon={AlertTriangle}
            trend={1}
            delay={0.3}
          />
          <StatsCard
            title="نسبة الامتثال"
            value={`${MOCK_STATS.complianceRate}%`}
            icon={CheckCircle2}
            trend={5}
            delay={0.4}
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 border-b border-border/50 pb-4">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={Building2} 
            label="نظرة عامة" 
          />
          <TabButton 
            active={activeTab === 'licenses'} 
            onClick={() => setActiveTab('licenses')} 
            icon={FileText} 
            label="التراخيص والتصاريح" 
          />
          <TabButton 
            active={activeTab === 'compliance'} 
            onClick={() => setActiveTab('compliance')} 
            icon={ShieldCheck} 
            label="الامتثال والمخالفات" 
          />
          <TabButton 
            active={activeTab === 'integrations'} 
            onClick={() => setActiveTab('integrations')} 
            icon={LinkIcon} 
            label="التكاملات الحكومية" 
          />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-border/50 bg-surface2">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-gold" />
                    الجهات الحكومية المرتبطة
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['الهيئة العامة للترفيه', 'الدفاع المدني', 'وزارة التجارة', 'ZATCA', 'أمانة الرياض', 'وزارة الموارد البشرية'].map((entity, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-gold/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-foreground">{entity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-2xl border border-border/50 bg-surface2">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-gold" />
                    تنبيهات هامة
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-500">ترخيص منتهي</p>
                        <p className="text-xs text-muted-foreground mt-1">تصريح بناء مؤقت (أمانة الرياض) منتهي منذ 3 أشهر.</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3">
                      <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-500">تجديد قريب</p>
                        <p className="text-xs text-muted-foreground mt-1">رخصة البلدية التجارية تنتهي خلال 20 يوم.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'licenses' && (
              <div className="glass-card p-6 rounded-2xl border border-border/50 bg-surface2 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="بحث برقم الترخيص، الاسم، أو الجهة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-gold/50 text-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-48">
                      <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:border-gold/50 text-foreground appearance-none"
                      >
                        <option value="all">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="pending">قيد التجديد</option>
                        <option value="expired">منتهي</option>
                      </select>
                      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <button className="p-2.5 bg-gold/10 text-gold rounded-xl hover:bg-gold/20 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground text-sm">
                        <th className="pb-4 font-medium">رقم الترخيص</th>
                        <th className="pb-4 font-medium">اسم الترخيص</th>
                        <th className="pb-4 font-medium">الجهة المصدرة</th>
                        <th className="pb-4 font-medium">تاريخ الإصدار</th>
                        <th className="pb-4 font-medium">تاريخ الانتهاء</th>
                        <th className="pb-4 font-medium">الحالة</th>
                        <th className="pb-4 font-medium">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredLicenses.map((license) => (
                        <tr key={license.id} className="hover:bg-background/30 transition-colors">
                          <td className="py-4 font-mono text-sm text-foreground">{license.id}</td>
                          <td className="py-4">
                            <p className="font-medium text-foreground">{license.name}</p>
                            <p className="text-xs text-muted-foreground">{license.type}</p>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">{license.authority}</td>
                          <td className="py-4 text-sm text-foreground">{formatDate(license.issueDate)}</td>
                          <td className="py-4 text-sm text-foreground">{formatDate(license.expiryDate)}</td>
                          <td className="py-4">
                            <StatusBadge status={license.status as any} />
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {license.status === 'pending' || license.status === 'expired' ? (
                                <button 
                                  onClick={() => handleRenew(license.id)}
                                  className="px-3 py-1.5 bg-gold/10 text-gold text-xs rounded-lg hover:bg-gold/20 transition-colors"
                                >
                                  تجديد
                                </button>
                              ) : (
                                <button className="p-1.5 text-muted-foreground hover:text-gold transition-colors">
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredLicenses.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      لا توجد تراخيص مطابقة للبحث
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-border/50 bg-surface2">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-gold" />
                    متطلبات الامتثال الحالية
                  </h3>
                  <div className="space-y-4">
                    {MOCK_LICENSES.filter(l => l.status !== 'expired').map(license => (
                      <div key={license.id} className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <p className="font-medium text-foreground mb-2">{license.name}</p>
                        <ul className="space-y-2">
                          {license.requirements.map((req, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-2xl border border-border/50 bg-surface2">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Upload className="w-6 h-6 text-gold" />
                    رفع وثائق الامتثال
                  </h3>
                  <div className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-gold/50 transition-colors cursor-pointer bg-background/30">
                    <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-foreground font-medium mb-2">اسحب وأفلت الملفات هنا</p>
                    <p className="text-sm text-muted-foreground mb-6">أو انقر لاختيار ملفات (PDF, JPG, PNG)</p>
                    <button className="px-6 py-2.5 bg-gold text-black font-medium rounded-xl hover:bg-gold/90 transition-colors">
                      استعراض الملفات
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="glass-card p-6 rounded-2xl border border-border/50 bg-surface2">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <LinkIcon className="w-6 h-6 text-gold" />
                    حالة الربط مع الجهات الحكومية
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface2 border border-border/50 text-foreground rounded-xl hover:border-gold/30 transition-colors text-sm">
                    <RefreshCw className="w-4 h-4" />
                    مزامنة الكل
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {INTEGRATIONS.map((integration) => (
                    <div key={integration.id} className="p-5 rounded-2xl bg-background/50 border border-border/50 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-surface2 border border-border/50 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{integration.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              آخر مزامنة: {formatDate(integration.lastSync)}
                            </p>
                          </div>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                          integration.status === 'connected' 
                            ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        )}>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            integration.status === 'connected' ? "bg-green-500" : "bg-red-500"
                          )} />
                          {integration.status === 'connected' ? 'متصل' : 'غير متصل'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleSync(integration.name)}
                          className="flex-1 py-2 bg-surface2 hover:bg-gold/10 hover:text-gold text-foreground text-sm rounded-xl border border-border/50 transition-colors flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          مزامنة الآن
                        </button>
                        <button className="px-4 py-2 bg-surface2 hover:bg-surface2/80 text-foreground text-sm rounded-xl border border-border/50 transition-colors">
                          الإعدادات
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
