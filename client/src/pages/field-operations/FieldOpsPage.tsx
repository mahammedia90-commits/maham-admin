import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  MapPin,
  Calendar,
  MoreVertical
} from 'lucide-react';

// Types
type TaskType = 'تركيب أجنحة' | 'صيانة' | 'أمن' | 'نظافة' | 'لوجستيك';
type TaskPriority = 'عالية' | 'متوسطة' | 'منخفضة';
type TaskStatus = 'قيد التنفيذ' | 'مكتملة' | 'معلقة' | 'ملغاة';

interface FieldTask {
  id: string;
  title: string;
  type: TaskType;
  assignedTeam: string;
  location: string;
  priority: TaskPriority;
  status: TaskStatus;
  startTime: string;
  endTime: string;
}

// Mock Data
const MOCK_TASKS: FieldTask[] = [
  {
    id: 'TSK-1001',
    title: 'تركيب الجناح الماسي - شركة أرامكو',
    type: 'تركيب أجنحة',
    assignedTeam: 'فريق التركيبات A',
    location: 'القاعة الرئيسية - منطقة A',
    priority: 'عالية',
    status: 'قيد التنفيذ',
    startTime: '2024-05-15T08:00:00Z',
    endTime: '2024-05-18T18:00:00Z'
  },
  {
    id: 'TSK-1002',
    title: 'تأمين المداخل الرئيسية',
    type: 'أمن',
    assignedTeam: 'فريق الأمن B',
    location: 'البوابات 1-4',
    priority: 'عالية',
    status: 'قيد التنفيذ',
    startTime: '2024-05-10T00:00:00Z',
    endTime: '2024-05-25T23:59:59Z'
  },
  {
    id: 'TSK-1003',
    title: 'صيانة الإضاءة',
    type: 'صيانة',
    assignedTeam: 'فريق الصيانة الكهربائية',
    location: 'القاعة C',
    priority: 'متوسطة',
    status: 'مكتملة',
    startTime: '2024-05-12T09:00:00Z',
    endTime: '2024-05-12T14:00:00Z'
  },
  {
    id: 'TSK-1004',
    title: 'تنظيف الممرات الرئيسية',
    type: 'نظافة',
    assignedTeam: 'فريق النظافة 1',
    location: 'جميع الممرات',
    priority: 'منخفضة',
    status: 'قيد التنفيذ',
    startTime: '2024-05-15T06:00:00Z',
    endTime: '2024-05-15T10:00:00Z'
  },
  {
    id: 'TSK-1005',
    title: 'نقل معدات العرض',
    type: 'لوجستيك',
    assignedTeam: 'فريق الدعم اللوجستي',
    location: 'من المستودع إلى القاعة B',
    priority: 'متوسطة',
    status: 'معلقة',
    startTime: '2024-05-16T08:00:00Z',
    endTime: '2024-05-16T12:00:00Z'
  }
];

export default function FieldOpsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Filter tasks based on search and type
  const filteredTasks = MOCK_TASKS.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.assignedTeam.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || task.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'تركيب أجنحة': return <Wrench className="w-5 h-5" />;
      case 'أمن': return <ShieldCheck className="w-5 h-5" />;
      case 'صيانة': return <Wrench className="w-5 h-5" />;
      case 'نظافة': return <Sparkles className="w-5 h-5" />;
      case 'لوجستيك': return <Truck className="w-5 h-5" />;
      default: return <Wrench className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'عالية': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'متوسطة': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'منخفضة': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="العمليات الميدانية" 
          subtitle="إدارة ومتابعة المهام والفرق الميدانية في المعرض"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="مهام نشطة"
            value="24"
            icon={Clock}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="مهام مكتملة"
            value="156"
            icon={CheckCircle2}
            trend={8}
            delay={0.2}
          />
          <StatsCard
            title="فرق ميدانية"
            value="18"
            icon={Users}
            delay={0.3}
          />
          <StatsCard
            title="نسبة الإنجاز"
            value="85%"
            icon={AlertTriangle}
            trend={5}
            delay={0.4}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 space-x-reverse border-b border-border/50 pb-px">
          {[
            { id: 'overview', label: 'نظرة عامة' },
            { id: 'tasks', label: 'المهام الميدانية' },
            { id: 'teams', label: 'الفرق' },
            { id: 'reports', label: 'التقارير' }
          ].map((tab) => (
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="ابحث عن مهمة، فريق، أو معرف..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-10 py-2 bg-surface2 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 bg-surface2 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="تركيب أجنحة">تركيب أجنحة</option>
                      <option value="صيانة">صيانة</option>
                      <option value="أمن">أمن</option>
                      <option value="نظافة">نظافة</option>
                      <option value="لوجستيك">لوجستيك</option>
                    </select>
                    <button className="p-2 bg-surface2 border border-border/50 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="grid gap-4">
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-4 rounded-xl border border-border/50 bg-surface2 hover:border-gold/30 transition-all group"
                    >
                      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-gold/10 text-gold">
                            {getTaskIcon(task.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
                              <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">{task.title}</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{task.assignedTeam}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{task.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(task.startTime)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-border/50 pt-4 lg:pt-0">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", getPriorityColor(task.priority))}>
                            {task.priority}
                          </span>
                          <StatusBadge status={task.status} />
                          <button className="p-2 text-muted-foreground hover:text-gold transition-colors rounded-lg hover:bg-gold/10">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground glass-card rounded-xl border border-border/50">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد مهام تطابق معايير البحث</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="glass-card p-8 rounded-xl border border-border/50 text-center text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gold opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">نظرة عامة على العمليات الميدانية</h3>
                <p>قريباً: لوحة تحكم تفاعلية لعرض خريطة المعرض وتوزيع الفرق الميدانية في الوقت الفعلي.</p>
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="glass-card p-8 rounded-xl border border-border/50 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 text-gold opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">إدارة الفرق الميدانية</h3>
                <p>قريباً: إدارة جداول المناوبات، تقييم الأداء، وتوزيع الموارد البشرية.</p>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="glass-card p-8 rounded-xl border border-border/50 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gold opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">التقارير الميدانية</h3>
                <p>قريباً: تقارير تفصيلية عن الحوادث، أوقات الاستجابة، واستهلاك المواد.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
