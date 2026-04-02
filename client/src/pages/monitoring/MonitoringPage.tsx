import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// --- Types ---
type ServerStatus = 'active' | 'stopped' | 'maintenance';
type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

interface SystemServer {
  id: string;
  name: string;
  type: string;
  status: ServerStatus;
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  alerts: number;
  lastPing: string;
}

interface SystemAlert {
  id: string;
  serverId: string;
  serverName: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  status: 'active' | 'resolved';
}

// --- Mock Data ---
const MOCK_SERVERS: SystemServer[] = [
  { id: 'srv-001', name: 'Main API Gateway', type: 'Gateway', status: 'active', cpu: 45, memory: 62, disk: 30, uptime: '45d 12h', alerts: 0, lastPing: '2024-05-20T10:30:00Z' },
  { id: 'srv-002', name: 'Auth Server', type: 'Auth', status: 'active', cpu: 20, memory: 45, disk: 15, uptime: '120d 5h', alerts: 1, lastPing: '2024-05-20T10:30:00Z' },
  { id: 'srv-003', name: 'Database Primary', type: 'Database', status: 'active', cpu: 78, memory: 85, disk: 65, uptime: '200d 1h', alerts: 3, lastPing: '2024-05-20T10:30:00Z' },
  { id: 'srv-004', name: 'Database Replica', type: 'Database', status: 'maintenance', cpu: 5, memory: 10, disk: 65, uptime: '0d 2h', alerts: 0, lastPing: '2024-05-20T10:25:00Z' },
  { id: 'srv-005', name: 'Payment Worker', type: 'Worker', status: 'stopped', cpu: 0, memory: 0, disk: 20, uptime: '0d 0h', alerts: 2, lastPing: '2024-05-19T22:15:00Z' },
  { id: 'srv-006', name: 'Notification Service', type: 'Service', status: 'active', cpu: 35, memory: 40, disk: 25, uptime: '30d 8h', alerts: 0, lastPing: '2024-05-20T10:30:00Z' },
  { id: 'srv-007', name: 'Analytics Engine', type: 'Worker', status: 'active', cpu: 92, memory: 78, disk: 80, uptime: '15d 4h', alerts: 5, lastPing: '2024-05-20T10:30:00Z' },
];

const MOCK_ALERTS: SystemAlert[] = [
  { id: 'alt-001', serverId: 'srv-007', serverName: 'Analytics Engine', message: 'High CPU usage detected (>90%)', severity: 'high', timestamp: '2024-05-20T10:25:00Z', status: 'active' },
  { id: 'alt-002', serverId: 'srv-003', serverName: 'Database Primary', message: 'Memory usage approaching limit', severity: 'medium', timestamp: '2024-05-20T10:15:00Z', status: 'active' },
  { id: 'alt-003', serverId: 'srv-005', serverName: 'Payment Worker', message: 'Service unresponsive', severity: 'critical', timestamp: '2024-05-19T22:20:00Z', status: 'active' },
  { id: 'alt-004', serverId: 'srv-002', serverName: 'Auth Server', message: 'Unusual number of failed login attempts', severity: 'low', timestamp: '2024-05-20T09:00:00Z', status: 'resolved' },
  { id: 'alt-005', serverId: 'srv-007', serverName: 'Analytics Engine', message: 'Disk space running low', severity: 'medium', timestamp: '2024-05-20T08:30:00Z', status: 'active' },
];

const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'servers', label: 'الخوادم' },
  { id: 'performance', label: 'الأداء' },
  { id: 'alerts', label: 'التنبيهات' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServerStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('تم تحديث بيانات النظام بنجاح');
    }, 1000);
  };

  const filteredServers = MOCK_SERVERS.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          server.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeServersCount = MOCK_SERVERS.filter(s => s.status === 'active').length;
  const totalAlertsCount = MOCK_ALERTS.filter(a => a.status === 'active').length;
  const avgCpuUsage = Math.round(MOCK_SERVERS.reduce((acc, s) => acc + s.cpu, 0) / MOCK_SERVERS.length);

  const renderProgressBar = (value: number, type: 'cpu' | 'memory' | 'disk') => {
    let colorClass = 'bg-emerald-500';
    if (value > 85) colorClass = 'bg-red-500';
    else if (value > 70) colorClass = 'bg-amber-500';

    return (
      <div className="w-full flex items-center gap-2">
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", colorClass)} 
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground w-8 text-right">{value}%</span>
      </div>
    );
  };

  const renderSeverityBadge = (severity: AlertSeverity) => {
    const config = {
      low: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'منخفض' },
      medium: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', label: 'متوسط' },
      high: { color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', label: 'مرتفع' },
      critical: { color: 'text-red-500 bg-red-500/10 border-red-500/20', label: 'حرج' },
    };
    const { color, label } = config[severity];
    
    return (
      <span className={cn("px-2 py-1 text-xs rounded-md border", color)}>
        {label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="مراقبة النظام" 
          subtitle="مراقبة حالة الخوادم، الأداء، والتنبيهات الحية"
          actions={
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-surface2 border border-border/50 rounded-lg text-gold hover:bg-gold/5 transition-colors"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              <span>تحديث البيانات</span>
            </button>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="الخوادم النشطة"
            value={`${activeServersCount} / ${MOCK_SERVERS.length}`}
            icon={Server}
            trend={100}
            delay={0.1}
          />
          <StatsCard
            title="متوسط استخدام CPU"
            value={`${avgCpuUsage}%`}
            icon={Cpu}
            trend={5}
            delay={0.2}
          />
          <StatsCard
            title="التنبيهات النشطة"
            value={totalAlertsCount.toString()}
            icon={AlertTriangle}
            trend={2}
            delay={0.3}
          />
          <StatsCard
            title="وقت التشغيل الكلي"
            value="99.98%"
            icon={Activity}
            trend={0}
            delay={0.4}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-2 space-x-reverse border-b border-border/50 pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeTab === tab.id 
                  ? "text-gold" 
                  : "text-muted-foreground hover:text-foreground hover:bg-surface2/50 rounded-t-lg"
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
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 rounded-xl border border-border/50 bg-surface2">
                      <h3 className="text-lg font-semibold text-foreground mb-4">حالة النظام العامة</h3>
                      <div className="flex items-center justify-center py-12">
                        <div className="relative">
                          <div className="w-48 h-48 rounded-full border-4 border-gold/20 flex items-center justify-center">
                            <div className="text-center">
                              <span className="block text-4xl font-bold text-gold">98%</span>
                              <span className="text-sm text-muted-foreground">الصحة العامة</span>
                            </div>
                          </div>
                          <motion.div 
                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                        <div className="p-4 rounded-lg bg-surface/50 border border-border/30">
                          <span className="block text-2xl font-bold text-foreground">{MOCK_SERVERS.length}</span>
                          <span className="text-xs text-muted-foreground">إجمالي الخوادم</span>
                        </div>
                        <div className="p-4 rounded-lg bg-surface/50 border border-border/30">
                          <span className="block text-2xl font-bold text-emerald-500">{activeServersCount}</span>
                          <span className="text-xs text-muted-foreground">تعمل بكفاءة</span>
                        </div>
                        <div className="p-4 rounded-lg bg-surface/50 border border-border/30">
                          <span className="block text-2xl font-bold text-red-500">{totalAlertsCount}</span>
                          <span className="text-xs text-muted-foreground">تنبيهات نشطة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="glass-card p-6 rounded-xl border border-border/50 bg-surface2">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-between">
                        <span>أحدث التنبيهات</span>
                        <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-full">{totalAlertsCount} جديد</span>
                      </h3>
                      <div className="space-y-4">
                        {MOCK_ALERTS.slice(0, 4).map(alert => (
                          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface/50 border border-border/30">
                            {alert.severity === 'critical' ? <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /> : 
                             alert.severity === 'high' ? <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" /> :
                             <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />}
                            <div>
                              <p className="text-sm font-medium text-foreground">{alert.message}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>{alert.serverName}</span>
                                <span>•</span>
                                <span>{formatDate(alert.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setActiveTab('alerts')}
                        className="w-full mt-4 py-2 text-sm text-gold hover:bg-gold/5 rounded-lg transition-colors"
                      >
                        عرض كل التنبيهات
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Servers Tab */}
              {activeTab === 'servers' && (
                <div className="glass-card rounded-xl border border-border/50 bg-surface2 overflow-hidden">
                  <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="البحث عن خادم..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 bg-surface border border-border/50 rounded-lg text-sm focus:outline-none focus:border-gold/50 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-surface border border-border/50 rounded-lg text-sm px-3 py-2 focus:outline-none focus:border-gold/50 text-foreground"
                      >
                        <option value="all">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="maintenance">صيانة</option>
                        <option value="stopped">متوقف</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-right">
                      <thead className="bg-surface/50 border-b border-border/50 text-muted-foreground text-sm">
                        <tr>
                          <th className="px-6 py-4 font-medium">الخادم</th>
                          <th className="px-6 py-4 font-medium">الحالة</th>
                          <th className="px-6 py-4 font-medium">CPU</th>
                          <th className="px-6 py-4 font-medium">الذاكرة</th>
                          <th className="px-6 py-4 font-medium">القرص</th>
                          <th className="px-6 py-4 font-medium">وقت التشغيل</th>
                          <th className="px-6 py-4 font-medium">تنبيهات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredServers.length > 0 ? (
                          filteredServers.map((server) => (
                            <tr key={server.id} className="hover:bg-surface/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-surface border border-border/50 flex items-center justify-center">
                                    <Server className="w-5 h-5 text-gold" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{server.name}</p>
                                    <p className="text-xs text-muted-foreground">{server.type} • {server.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <StatusBadge status={
                                  server.status === 'active' ? 'success' : 
                                  server.status === 'maintenance' ? 'warning' : 'danger'
                                } />
                              </td>
                              <td className="px-6 py-4 w-32">{renderProgressBar(server.cpu, 'cpu')}</td>
                              <td className="px-6 py-4 w-32">{renderProgressBar(server.memory, 'memory')}</td>
                              <td className="px-6 py-4 w-32">{renderProgressBar(server.disk, 'disk')}</td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">{server.uptime}</td>
                              <td className="px-6 py-4">
                                {server.alerts > 0 ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">
                                    {server.alerts}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                              لا توجد خوادم مطابقة للبحث
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-xl border border-border/50 bg-surface2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">استهلاك المعالج (CPU)</h3>
                        <p className="text-sm text-muted-foreground">متوسط الاستهلاك الحالي</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-6">{avgCpuUsage}%</div>
                    <div className="space-y-4">
                      {MOCK_SERVERS.sort((a, b) => b.cpu - a.cpu).slice(0, 5).map(server => (
                        <div key={server.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{server.name}</span>
                            <span className="font-medium">{server.cpu}%</span>
                          </div>
                          {renderProgressBar(server.cpu, 'cpu')}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-xl border border-border/50 bg-surface2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                        <MemoryStick className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">استهلاك الذاكرة (RAM)</h3>
                        <p className="text-sm text-muted-foreground">متوسط الاستهلاك الحالي</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-6">
                      {Math.round(MOCK_SERVERS.reduce((acc, s) => acc + s.memory, 0) / MOCK_SERVERS.length)}%
                    </div>
                    <div className="space-y-4">
                      {MOCK_SERVERS.sort((a, b) => b.memory - a.memory).slice(0, 5).map(server => (
                        <div key={server.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{server.name}</span>
                            <span className="font-medium">{server.memory}%</span>
                          </div>
                          {renderProgressBar(server.memory, 'memory')}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-xl border border-border/50 bg-surface2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <HardDrive className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">استهلاك التخزين (Disk)</h3>
                        <p className="text-sm text-muted-foreground">متوسط الاستهلاك الحالي</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-6">
                      {Math.round(MOCK_SERVERS.reduce((acc, s) => acc + s.disk, 0) / MOCK_SERVERS.length)}%
                    </div>
                    <div className="space-y-4">
                      {MOCK_SERVERS.sort((a, b) => b.disk - a.disk).slice(0, 5).map(server => (
                        <div key={server.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{server.name}</span>
                            <span className="font-medium">{server.disk}%</span>
                          </div>
                          {renderProgressBar(server.disk, 'disk')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Alerts Tab */}
              {activeTab === 'alerts' && (
                <div className="glass-card rounded-xl border border-border/50 bg-surface2 overflow-hidden">
                  <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <h3 className="font-semibold text-foreground">سجل التنبيهات</h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-sm bg-surface border border-border/50 rounded-lg hover:bg-surface/80 transition-colors">
                        تحديد الكل كمقروء
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-border/50">
                    {MOCK_ALERTS.map((alert) => (
                      <div key={alert.id} className={cn(
                        "p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-colors hover:bg-surface/30",
                        alert.status === 'active' ? "bg-surface/10" : "opacity-70"
                      )}>
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-2 rounded-full mt-1",
                            alert.severity === 'critical' ? "bg-red-500/10 text-red-500" :
                            alert.severity === 'high' ? "bg-orange-500/10 text-orange-500" :
                            alert.severity === 'medium' ? "bg-amber-500/10 text-amber-500" :
                            "bg-blue-500/10 text-blue-500"
                          )}>
                            {alert.severity === 'critical' ? <XCircle className="w-5 h-5" /> : 
                             alert.severity === 'high' ? <AlertCircle className="w-5 h-5" /> :
                             <AlertTriangle className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{alert.message}</h4>
                              {renderSeverityBadge(alert.severity)}
                              {alert.status === 'resolved' && (
                                <span className="px-2 py-1 text-xs rounded-md border border-emerald-500/20 text-emerald-500 bg-emerald-500/10">
                                  تم الحل
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Server className="w-3.5 h-3.5" />
                                {alert.serverName}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDate(alert.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {alert.status === 'active' && (
                          <button 
                            className="px-4 py-2 text-sm bg-surface border border-border/50 rounded-lg hover:bg-surface/80 transition-colors whitespace-nowrap"
                            onClick={() => toast.success('تم تعيين التنبيه كمقروء')}
                          >
                            تحديد كمقروء
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
