import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, FileText, CheckCircle, Clock, 
  AlertCircle, ChevronLeft, Calendar, User, Building, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Types
type DeliverableStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';
type DeliverablePriority = 'high' | 'medium' | 'low';

interface Deliverable {
  id: string;
  title: string;
  sponsor: string;
  assignee: string;
  dueDate: string;
  status: DeliverableStatus;
  priority: DeliverablePriority;
  completionPercent: number;
  notes: string;
}

// Mock Data
const MOCK_DELIVERABLES: Deliverable[] = [
  {
    id: 'DEL-001',
    title: 'تصميم جناح العرض الماسي',
    sponsor: 'شركة التقنية المتقدمة',
    assignee: 'أحمد محمود',
    dueDate: '2024-06-15',
    status: 'in_progress',
    priority: 'high',
    completionPercent: 65,
    notes: 'بانتظار الموافقة على التصميم المبدئي'
  },
  {
    id: 'DEL-002',
    title: 'تجهيز المواد الإعلانية',
    sponsor: 'البنك الوطني',
    assignee: 'سارة خالد',
    dueDate: '2024-05-20',
    status: 'completed',
    priority: 'medium',
    completionPercent: 100,
    notes: 'تم التسليم والاعتماد'
  },
  {
    id: 'DEL-003',
    title: 'تركيب الشاشات التفاعلية',
    sponsor: 'مجموعة الاتصالات',
    assignee: 'فهد عبدالله',
    dueDate: '2024-06-01',
    status: 'delayed',
    priority: 'high',
    completionPercent: 30,
    notes: 'تأخير في وصول الشحنة'
  },
  {
    id: 'DEL-004',
    title: 'إصدار تصاريح الدخول',
    sponsor: 'شركة السيارات الحديثة',
    assignee: 'نورة سعد',
    dueDate: '2024-06-25',
    status: 'pending',
    priority: 'low',
    completionPercent: 0,
    notes: 'قيد المراجعة الأمنية'
  },
  {
    id: 'DEL-005',
    title: 'تجهيز منطقة كبار الشخصيات',
    sponsor: 'الراعي البلاتيني',
    assignee: 'محمد علي',
    dueDate: '2024-06-10',
    status: 'in_progress',
    priority: 'high',
    completionPercent: 80,
    notes: 'جاري وضع اللمسات النهائية'
  }
];

const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'in_progress', label: 'قيد التنفيذ' },
  { id: 'completed', label: 'مكتملة' },
  { id: 'delayed', label: 'متأخرة' }
];

export default function DeliverablesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliverables, setDeliverables] = useState<Deliverable[]>(MOCK_DELIVERABLES);

  // Stats
  const totalDeliverables = deliverables.length;
  const completedDeliverables = deliverables.filter(d => d.status === 'completed').length;
  const inProgressDeliverables = deliverables.filter(d => d.status === 'in_progress').length;
  const delayedDeliverables = deliverables.filter(d => d.status === 'delayed').length;

  // Filter
  const filteredDeliverables = deliverables.filter(d => {
    const matchesSearch = d.title.includes(searchQuery) || d.sponsor.includes(searchQuery);
    const matchesTab = activeTab === 'overview' ? true : d.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAction = () => {
    toast.success('تم تنفيذ الإجراء بنجاح');
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <PageHeader 
          title="إدارة التسليمات" 
          subtitle="متابعة تسليمات الرعاة والعارضين وحالة إنجازها"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي التسليمات"
            value={totalDeliverables.toString()}
            icon={FileText}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="مكتملة"
            value={completedDeliverables.toString()}
            icon={CheckCircle}
            trend={5}
            delay={0.2}
          />
          <StatsCard
            title="قيد التنفيذ"
            value={inProgressDeliverables.toString()}
            icon={Clock}
            delay={0.3}
          />
          <StatsCard
            title="متأخرة"
            value={delayedDeliverables.toString()}
            icon={AlertCircle}
            trend={2}
            delay={0.4}
          />
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-4 rounded-xl border border-border/50 bg-surface2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-gold/10 text-gold border border-gold/20" 
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
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
                placeholder="البحث عن تسليم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border/50 rounded-lg pr-9 pl-4 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <button className="p-2 rounded-lg border border-border/50 hover:bg-surface text-muted-foreground transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deliverables List */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDeliverables.map((deliverable, index) => (
              <motion.div
                key={deliverable.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="glass-card p-5 rounded-xl border border-border/50 bg-surface2 hover:border-gold/30 transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded">
                            {deliverable.id}
                          </span>
                          <StatusBadge status={deliverable.status} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                          {deliverable.title}
                        </h3>
                      </div>
                      <button 
                        onClick={handleAction}
                        className="p-2 rounded-lg bg-gold/5 text-gold hover:bg-gold/10 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4 text-gold/70" />
                        <span>{deliverable.sponsor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 text-gold/70" />
                        <span>{deliverable.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-gold/70" />
                        <span>{formatDate(deliverable.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Priority */}
                  <div className="lg:w-64 flex flex-col justify-center space-y-3 pl-0 lg:pl-6 lg:border-r border-border/50">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">نسبة الإنجاز</span>
                        <span className="text-sm font-bold text-foreground">{deliverable.completionPercent}%</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${deliverable.completionPercent}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={cn(
                            "h-full rounded-full",
                            deliverable.completionPercent === 100 ? "bg-emerald-500" :
                            deliverable.completionPercent > 50 ? "bg-gold" : "bg-amber-500"
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">الأولوية</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        deliverable.priority === 'high' ? "bg-red-500/10 text-red-500" :
                        deliverable.priority === 'medium' ? "bg-amber-500/10 text-amber-500" :
                        "bg-blue-500/10 text-blue-500"
                      )}>
                        {deliverable.priority === 'high' ? 'عالية' :
                         deliverable.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {deliverable.notes && (
                  <div className="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-0.5 text-gold/50" />
                    <p>{deliverable.notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredDeliverables.length === 0 && (
            <div className="glass-card p-12 rounded-xl border border-border/50 bg-surface2 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">لا توجد تسليمات</h3>
              <p className="text-muted-foreground">لم يتم العثور على تسليمات تطابق معايير البحث.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
