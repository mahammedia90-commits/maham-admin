import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Download,
  Building,
  User,
  AlertTriangle
} from 'lucide-react';

// Mock Data
type KycStatus = 'pending' | 'approved' | 'rejected';
type KycType = 'investor' | 'merchant' | 'sponsor';
type RiskLevel = 'low' | 'medium' | 'high';

interface KycRequest {
  id: string;
  companyName: string;
  type: KycType;
  submittedDate: string;
  status: KycStatus;
  documents: string[];
  reviewer?: string;
  notes?: string;
  riskLevel: RiskLevel;
}

const mockRequests: KycRequest[] = [
  {
    id: 'KYC-1001',
    companyName: 'شركة التقنية المتقدمة',
    type: 'investor',
    submittedDate: '2023-10-25T10:30:00Z',
    status: 'pending',
    documents: ['السجل التجاري', 'هوية المفوض', 'رخصة الاستثمار'],
    riskLevel: 'low',
  },
  {
    id: 'KYC-1002',
    companyName: 'مؤسسة التجارة العالمية',
    type: 'merchant',
    submittedDate: '2023-10-24T14:15:00Z',
    status: 'approved',
    documents: ['السجل التجاري', 'هوية المالك'],
    reviewer: 'أحمد عبدالله',
    riskLevel: 'medium',
  },
  {
    id: 'KYC-1003',
    companyName: 'مجموعة الرعاة الذهبية',
    type: 'sponsor',
    submittedDate: '2023-10-22T09:00:00Z',
    status: 'rejected',
    documents: ['السجل التجاري'],
    reviewer: 'سارة محمد',
    notes: 'وثائق غير مكتملة',
    riskLevel: 'high',
  },
  {
    id: 'KYC-1004',
    companyName: 'صندوق الاستثمار الأول',
    type: 'investor',
    submittedDate: '2023-10-26T11:20:00Z',
    status: 'pending',
    documents: ['السجل التجاري', 'هوية المفوض', 'القوائم المالية'],
    riskLevel: 'low',
  },
  {
    id: 'KYC-1005',
    companyName: 'شركة العرض السريع',
    type: 'merchant',
    submittedDate: '2023-10-21T16:45:00Z',
    status: 'approved',
    documents: ['السجل التجاري', 'هوية المالك', 'شهادة الزكاة'],
    reviewer: 'خالد عبدالعزيز',
    riskLevel: 'low',
  },
];

const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'pending', label: 'قيد المراجعة' },
  { id: 'approved', label: 'معتمد' },
  { id: 'rejected', label: 'مرفوض' },
];

export default function KycPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApprove = (id: string) => {
    toast.success(`تم اعتماد الطلب ${id} بنجاح`);
  };

  const handleReject = (id: string) => {
    toast.error(`تم رفض الطلب ${id}`);
  };

  const filteredRequests = mockRequests.filter((req) => {
    const matchesSearch = req.companyName.includes(searchQuery) || req.id.includes(searchQuery);
    if (activeTab === 'overview') return matchesSearch;
    return matchesSearch && req.status === activeTab;
  });

  const stats = [
    { title: 'إجمالي الطلبات', value: mockRequests.length.toString(), icon: FileText, trend: 12 },
    { title: 'طلبات معتمدة', value: mockRequests.filter(r => r.status === 'approved').length.toString(), icon: CheckCircle, trend: 5 },
    { title: 'قيد المراجعة', value: mockRequests.filter(r => r.status === 'pending').length.toString(), icon: Clock, trend: -2 },
    { title: 'طلبات مرفوضة', value: mockRequests.filter(r => r.status === 'rejected').length.toString(), icon: XCircle, trend: 0 },
  ];

  const getTypeLabel = (type: KycType) => {
    switch (type) {
      case 'investor': return 'مستثمر';
      case 'merchant': return 'تاجر';
      case 'sponsor': return 'راعي';
      default: return type;
    }
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'high': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getRiskLabel = (level: RiskLevel) => {
    switch (level) {
      case 'low': return 'منخفض';
      case 'medium': return 'متوسط';
      case 'high': return 'مرتفع';
      default: return level;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="إدارة التحقق من الهوية (KYC)" 
          subtitle="إدارة ومراجعة طلبات التحقق من هوية المستثمرين والتجار والرعاة"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-surface2/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex space-x-2 space-x-reverse overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث برقم الطلب أو اسم الشركة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface2 border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <button className="p-2 bg-surface2 border border-border/50 rounded-lg text-muted-foreground hover:text-gold hover:border-gold/50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-border/50 bg-surface2/30">
                  <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">رقم الطلب</th>
                  <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">الشركة</th>
                  <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">النوع</th>
                  <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">تاريخ التقديم</th>
                  <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">مستوى المخاطرة</th>
                  <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence>
                  {filteredRequests.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-surface2/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-foreground">{request.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                            <Building className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{request.companyName}</p>
                            <p className="text-xs text-muted-foreground">{request.documents.length} وثائق مرفقة</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">{getTypeLabel(request.type)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">{formatDate(request.submittedDate)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getRiskColor(request.riskLevel))}>
                          {getRiskLabel(request.riskLevel)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {request.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApprove(request.id)}
                                className="p-1.5 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                title="اعتماد"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(request.id)}
                                className="p-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                title="رفض"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button className="p-1.5 rounded-md bg-surface2 text-muted-foreground hover:text-gold transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredRequests.length === 0 && (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                <ShieldCheck className="w-12 h-12 opacity-20" />
                <p>لا توجد طلبات تطابق معايير البحث</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
