import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  TrendingUp,
  Award,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// --- Mock Data ---

const MOCK_TEAMS = [
  {
    id: 't1',
    name: 'فريق التسويق والمبيعات',
    lead: 'أحمد محمود',
    members: 12,
    activeTasks: 8,
    completedTasks: 45,
    department: 'التسويق',
    status: 'نشط',
    progress: 85
  },
  {
    id: 't2',
    name: 'فريق العمليات واللوجستيات',
    lead: 'سارة خالد',
    members: 18,
    activeTasks: 15,
    completedTasks: 120,
    department: 'العمليات',
    status: 'نشط',
    progress: 92
  },
  {
    id: 't3',
    name: 'فريق الدعم الفني',
    lead: 'محمد علي',
    members: 8,
    activeTasks: 5,
    completedTasks: 310,
    department: 'تقنية المعلومات',
    status: 'نشط',
    progress: 78
  },
  {
    id: 't4',
    name: 'فريق العلاقات العامة',
    lead: 'نورة السعد',
    members: 6,
    activeTasks: 3,
    completedTasks: 28,
    department: 'العلاقات العامة',
    status: 'متوقف مؤقتاً',
    progress: 45
  }
];

const MOCK_MEMBERS = [
  {
    id: 'm1',
    name: 'أحمد محمود',
    role: 'قائد فريق',
    team: 'فريق التسويق والمبيعات',
    tasks: 12,
    performance: 95,
    status: 'متصل',
    email: 'ahmed@mahamexpo.com'
  },
  {
    id: 'm2',
    name: 'سارة خالد',
    role: 'مدير عمليات',
    team: 'فريق العمليات واللوجستيات',
    tasks: 8,
    performance: 88,
    status: 'متصل',
    email: 'sara@mahamexpo.com'
  },
  {
    id: 'm3',
    name: 'خالد عبد الله',
    role: 'أخصائي تسويق',
    team: 'فريق التسويق والمبيعات',
    tasks: 5,
    performance: 76,
    status: 'غير متصل',
    email: 'khalid@mahamexpo.com'
  },
  {
    id: 'm4',
    name: 'فاطمة حسن',
    role: 'دعم فني',
    team: 'فريق الدعم الفني',
    tasks: 15,
    performance: 91,
    status: 'مشغول',
    email: 'fatima@mahamexpo.com'
  }
];

const MOCK_TASKS = [
  {
    id: 'tsk1',
    title: 'تجهيز حملة إعلانية لمعرض التقنية',
    team: 'فريق التسويق والمبيعات',
    assignee: 'أحمد محمود',
    dueDate: '2026-04-15',
    status: 'قيد التنفيذ',
    priority: 'عالية'
  },
  {
    id: 'tsk2',
    title: 'تنسيق دخول المعدات للقاعة A',
    team: 'فريق العمليات واللوجستيات',
    assignee: 'سارة خالد',
    dueDate: '2026-04-05',
    status: 'مكتمل',
    priority: 'حرجة'
  },
  {
    id: 'tsk3',
    title: 'تحديث نظام تسجيل الزوار',
    team: 'فريق الدعم الفني',
    assignee: 'محمد علي',
    dueDate: '2026-04-10',
    status: 'متأخر',
    priority: 'متوسطة'
  },
  {
    id: 'tsk4',
    title: 'إرسال دعوات كبار الشخصيات',
    team: 'فريق العلاقات العامة',
    assignee: 'نورة السعد',
    dueDate: '2026-04-20',
    status: 'مجدول',
    priority: 'عالية'
  }
];

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'members' | 'tasks'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const totalTeams = MOCK_TEAMS.length;
  const totalMembers = MOCK_TEAMS.reduce((acc, team) => acc + team.members, 0);
  const activeTasksCount = MOCK_TEAMS.reduce((acc, team) => acc + team.activeTasks, 0);
  const avgProgress = Math.round(MOCK_TEAMS.reduce((acc, team) => acc + team.progress, 0) / totalTeams);

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: TrendingUp },
    { id: 'teams', label: 'الفرق', icon: Users },
    { id: 'members', label: 'الأعضاء', icon: Award },
    { id: 'tasks', label: 'المهام', icon: Target },
  ] as const;

  const handleAction = (action: string, item: any) => {
    toast.success(`تم تنفيذ الإجراء: ${action} على ${item.name || item.title}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="إدارة الفرق والمهام" 
          subtitle="إدارة فرق عمل المعارض، تتبع الأداء، وتوزيع المهام بكفاءة"
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي الفرق"
            value={totalTeams.toString()}
            icon={Users}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="إجمالي الأعضاء"
            value={totalMembers.toString()}
            icon={Briefcase}
            trend={5}
            delay={0.2}
          />
          <StatsCard
            title="المهام النشطة"
            value={activeTasksCount.toString()}
            icon={Clock}
            trend={8}
            delay={0.3}
          />
          <StatsCard
            title="نسبة الإنجاز العام"
            value={`${avgProgress}%`}
            icon={CheckCircle2}
            trend={2}
            delay={0.4}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center space-x-2 space-x-reverse border-b border-border/50 pb-2">
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
                    ? "bg-gold/10 text-gold font-medium" 
                    : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar (Search & Filter) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface2 p-4 rounded-xl border border-border/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="ابحث عن فريق، عضو، أو مهمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all text-foreground"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border/50 rounded-lg text-sm hover:bg-gold/5 hover:text-gold hover:border-gold/30 transition-all text-foreground w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4" />
              <span>تصفية</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gold text-gold-foreground rounded-lg text-sm hover:bg-gold/90 transition-all font-medium w-full sm:w-auto justify-center shadow-lg shadow-gold/20">
              <Users className="w-4 h-4" />
              <span>إضافة جديد</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[400px]"
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-xl border border-border/50">
                  <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    أداء الفرق
                  </h3>
                  <div className="space-y-4">
                    {MOCK_TEAMS.map((team) => (
                      <div key={team.id} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-foreground font-medium">{team.name}</span>
                          <span className="text-muted-foreground">{team.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-surface2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${team.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gold rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl border border-border/50">
                  <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    المهام العاجلة
                  </h3>
                  <div className="space-y-3">
                    {MOCK_TASKS.filter(t => t.priority === 'حرجة' || t.priority === 'عالية').slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-start justify-between p-3 rounded-lg bg-surface2 border border-border/30 hover:border-gold/30 transition-all">
                        <div>
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {task.assignee}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                        <StatusBadge status={task.priority} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_TEAMS.filter(t => t.name.includes(searchQuery) || t.department.includes(searchQuery)).map((team, index) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    key={team.id} 
                    className="glass-card rounded-xl border border-border/50 p-5 hover:border-gold/50 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">{team.department}</p>
                      </div>
                      <StatusBadge status={team.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-surface2 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-foreground">{team.members}</p>
                        <p className="text-xs text-muted-foreground">عضو</p>
                      </div>
                      <div className="bg-surface2 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-foreground">{team.activeTasks}</p>
                        <p className="text-xs text-muted-foreground">مهمة نشطة</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">القائد:</span>
                        <span className="text-foreground font-medium">{team.lead}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">المهام المكتملة:</span>
                        <span className="text-foreground font-medium">{team.completedTasks}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                      <span className="text-sm font-medium text-gold">{team.progress}% إنجاز</span>
                      <button 
                        onClick={() => handleAction('عرض التفاصيل', team)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-surface2 text-muted-foreground border-b border-border/50">
                      <tr>
                        <th className="px-6 py-4 font-medium">العضو</th>
                        <th className="px-6 py-4 font-medium">الدور</th>
                        <th className="px-6 py-4 font-medium">الفريق</th>
                        <th className="px-6 py-4 font-medium">المهام</th>
                        <th className="px-6 py-4 font-medium">الأداء</th>
                        <th className="px-6 py-4 font-medium">الحالة</th>
                        <th className="px-6 py-4 font-medium">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {MOCK_MEMBERS.filter(m => m.name.includes(searchQuery) || m.role.includes(searchQuery)).map((member) => (
                        <tr key={member.id} className="hover:bg-surface2/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">{member.role}</td>
                          <td className="px-6 py-4 text-muted-foreground">{member.team}</td>
                          <td className="px-6 py-4 text-foreground font-medium">{member.tasks}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground">{member.performance}%</span>
                              <div className="w-16 h-1.5 bg-surface2 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gold rounded-full" 
                                  style={{ width: `${member.performance}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={member.status} />
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleAction('خيارات', member)}
                              className="p-2 hover:bg-surface2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-surface2 text-muted-foreground border-b border-border/50">
                      <tr>
                        <th className="px-6 py-4 font-medium">المهمة</th>
                        <th className="px-6 py-4 font-medium">الفريق</th>
                        <th className="px-6 py-4 font-medium">المسؤول</th>
                        <th className="px-6 py-4 font-medium">تاريخ الاستحقاق</th>
                        <th className="px-6 py-4 font-medium">الأولوية</th>
                        <th className="px-6 py-4 font-medium">الحالة</th>
                        <th className="px-6 py-4 font-medium">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {MOCK_TASKS.filter(t => t.title.includes(searchQuery) || t.assignee.includes(searchQuery)).map((task) => (
                        <tr key={task.id} className="hover:bg-surface2/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{task.title}</td>
                          <td className="px-6 py-4 text-muted-foreground">{task.team}</td>
                          <td className="px-6 py-4 text-foreground">{task.assignee}</td>
                          <td className="px-6 py-4 text-muted-foreground">{formatDate(task.dueDate)}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={task.priority} />
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={task.status} />
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleAction('خيارات المهمة', task)}
                              className="p-2 hover:bg-surface2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
