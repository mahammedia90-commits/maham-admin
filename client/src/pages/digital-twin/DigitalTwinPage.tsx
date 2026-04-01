import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Users,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Wifi,
  WifiOff,
  Battery,
  MapPin,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Types
type SensorType = 'temperature' | 'humidity' | 'occupancy' | 'energy' | 'air_quality';
type SensorStatus = 'active' | 'warning' | 'offline';

interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: string;
  value: number;
  unit: string;
  status: SensorStatus;
  lastUpdate: string;
  batteryLevel: number;
}

interface Prediction {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

// Mock Data
const MOCK_SENSORS: Sensor[] = [
  {
    id: 'SEN-001',
    name: 'مستشعر الحرارة - القاعة الرئيسية',
    type: 'temperature',
    location: 'القاعة أ',
    value: 23.5,
    unit: '°C',
    status: 'active',
    lastUpdate: '2023-10-25T10:30:00Z',
    batteryLevel: 95,
  },
  {
    id: 'SEN-002',
    name: 'مستشعر الرطوبة - منطقة كبار الشخصيات',
    type: 'humidity',
    location: 'VIP Lounge',
    value: 45,
    unit: '%',
    status: 'active',
    lastUpdate: '2023-10-25T10:32:00Z',
    batteryLevel: 88,
  },
  {
    id: 'SEN-003',
    name: 'كاميرا الإشغال - المدخل الرئيسي',
    type: 'occupancy',
    location: 'البوابة 1',
    value: 1250,
    unit: 'شخص',
    status: 'warning',
    lastUpdate: '2023-10-25T10:35:00Z',
    batteryLevel: 100,
  },
  {
    id: 'SEN-004',
    name: 'مقياس استهلاك الطاقة - الجناح التقني',
    type: 'energy',
    location: 'المنطقة ج',
    value: 450,
    unit: 'kW',
    status: 'active',
    lastUpdate: '2023-10-25T10:30:00Z',
    batteryLevel: 100,
  },
  {
    id: 'SEN-005',
    name: 'مستشعر جودة الهواء - قاعة الطعام',
    type: 'air_quality',
    location: 'Food Court',
    value: 85,
    unit: 'AQI',
    status: 'offline',
    lastUpdate: '2023-10-25T09:15:00Z',
    batteryLevel: 5,
  },
];

const MOCK_PREDICTIONS: Prediction[] = [
  {
    id: 'PRD-001',
    title: 'ازدحام متوقع في المدخل الرئيسي',
    description: 'بناءً على أنماط الزيارات السابقة، نتوقع زيادة في عدد الزوار بنسبة 40% خلال الساعتين القادمتين.',
    probability: 85,
    impact: 'high',
    timeframe: 'خلال ساعتين',
  },
  {
    id: 'PRD-002',
    title: 'ارتفاع استهلاك الطاقة',
    description: 'من المتوقع أن يتجاوز استهلاك الطاقة الحد الطبيعي في الجناح التقني بسبب تشغيل شاشات العرض الكبيرة.',
    probability: 60,
    impact: 'medium',
    timeframe: 'الساعة 14:00',
  },
  {
    id: 'PRD-003',
    title: 'انخفاض جودة الهواء',
    description: 'قد تنخفض جودة الهواء في قاعة الطعام إذا استمر معدل الإشغال الحالي.',
    probability: 45,
    impact: 'low',
    timeframe: 'المساء',
  },
];

const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'sensors', label: 'المستشعرات (IoT)' },
  { id: 'predictions', label: 'التنبؤات الذكية' },
];

export default function DigitalTwinPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('تم تحديث بيانات التوأم الرقمي بنجاح');
    }, 1500);
  };

  const filteredSensors = MOCK_SENSORS.filter(
    (sensor) =>
      sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSensorIcon = (type: SensorType) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-orange-500" />;
      case 'humidity':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'occupancy':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'energy':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'air_quality':
        return <Activity className="w-5 h-5 text-purple-500" />;
      default:
        return <Cpu className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeader
            title="التوأم الرقمي (Digital Twin)"
            subtitle="مراقبة حية لمعرض مهام إكسبو وإدارة مستشعرات IoT والتنبؤات الذكية"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-surface2 border border-border/50 rounded-lg text-foreground hover:bg-gold/10 hover:text-gold transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              <span>تحديث مباشر</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="مستشعرات نشطة"
            value="1,245"
            icon={Wifi}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="تنبيهات حرجة"
            value="3"
            icon={AlertTriangle}
            trend={2}
            delay={0.2}
          />
          <StatsCard
            title="كفاءة الطاقة"
            value="92%"
            icon={Zap}
            trend={5}
            delay={0.3}
          />
          <StatsCard
            title="معدل الإشغال الحالي"
            value="8,450"
            icon={Users}
            trend={15}
            delay={0.4}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border/50 pb-px">
          {TABS.map((tab) => (
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
                  layoutId="activeTabIndicator"
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
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Map/Floor Plan Placeholder */}
                <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-border/50 bg-surface2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">المخطط التفاعلي للمعرض</h3>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> طبيعي
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span> تحذير
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> حرج
                      </span>
                    </div>
                  </div>
                  <div className="aspect-video bg-black/20 rounded-lg border border-border/30 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      خريطة حرارية حية للمعرض (3D View)
                    </p>
                    
                    {/* Simulated Map Points */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>

                {/* Quick Alerts */}
                <div className="glass-card rounded-xl p-6 border border-border/50 bg-surface2 flex flex-col">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-gold" />
                    تنبيهات النظام
                  </h3>
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {MOCK_SENSORS.filter(s => s.status !== 'active').map(sensor => (
                      <div key={sensor.id} className="p-3 rounded-lg bg-black/20 border border-border/30 flex gap-3">
                        <div className="mt-1">
                          {sensor.status === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{sensor.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {sensor.status === 'warning' ? 'قراءة غير طبيعية' : 'فقدان الاتصال بالمستشعر'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">{formatDate(sensor.lastUpdate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'sensors' && (
              <motion.div
                key="sensors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="بحث عن مستشعر أو موقع..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-10 py-2 bg-surface2 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-gold/50 text-foreground"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface2 border border-border/50 rounded-lg text-sm text-foreground hover:bg-gold/10 hover:text-gold transition-colors whitespace-nowrap">
                    <Filter className="w-4 h-4" />
                    <span>تصفية متقدمة</span>
                  </button>
                </div>

                {/* Sensors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSensors.map((sensor, index) => (
                    <motion.div
                      key={sensor.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card rounded-xl p-5 border border-border/50 bg-surface2 hover:border-gold/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center border border-border/30">
                            {getSensorIcon(sensor.type)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{sensor.name}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {sensor.location}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={sensor.status} />
                      </div>
                      
                      <div className="flex items-end justify-between mt-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">القراءة الحالية</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground">{sensor.value}</span>
                            <span className="text-sm text-muted-foreground">{sensor.unit}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground mb-1">
                            <Battery className={cn("w-3 h-3", sensor.batteryLevel < 20 ? "text-red-500" : "text-green-500")} />
                            {sensor.batteryLevel}%
                          </div>
                          <p className="text-[10px] text-muted-foreground opacity-70">
                            تحديث: {new Date(sensor.lastUpdate).toLocaleTimeString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {filteredSensors.length === 0 && (
                  <div className="text-center py-12 glass-card rounded-xl border border-border/50 bg-surface2">
                    <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">لم يتم العثور على مستشعرات مطابقة للبحث</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'predictions' && (
              <motion.div
                key="predictions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-xl p-6 border border-border/50 bg-surface2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gold/10 text-gold">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">محرك الذكاء الاصطناعي التنبؤي</h3>
                      <p className="text-sm text-muted-foreground">تحليل البيانات الحية لتوقع الأحداث المستقبلية في المعرض</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-lg bg-black/20 border border-border/30">
                      <p className="text-sm text-muted-foreground mb-1">دقة التنبؤات</p>
                      <p className="text-2xl font-bold text-gold">94.2%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-border/30">
                      <p className="text-sm text-muted-foreground mb-1">البيانات المحللة</p>
                      <p className="text-2xl font-bold text-foreground">2.4M <span className="text-sm font-normal text-muted-foreground">نقطة/ساعة</span></p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20 border border-border/30">
                      <p className="text-sm text-muted-foreground mb-1">حالة المحرك</p>
                      <p className="text-2xl font-bold text-green-500">نشط ومستقر</p>
                    </div>
                  </div>

                  <h4 className="text-md font-medium text-foreground mb-4">التنبؤات النشطة</h4>
                  <div className="space-y-4">
                    {MOCK_PREDICTIONS.map((prediction, index) => (
                      <motion.div
                        key={prediction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-xl bg-black/20 border border-border/30 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-black/30 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              prediction.impact === 'high' ? "bg-red-500/20 text-red-500" :
                              prediction.impact === 'medium' ? "bg-yellow-500/20 text-yellow-500" :
                              "bg-blue-500/20 text-blue-500"
                            )}>
                              أثر {prediction.impact === 'high' ? 'عالي' : prediction.impact === 'medium' ? 'متوسط' : 'منخفض'}
                            </span>
                            <span className="text-xs text-muted-foreground bg-surface2 px-2 py-0.5 rounded border border-border/50">
                              {prediction.timeframe}
                            </span>
                          </div>
                          <h5 className="text-base font-medium text-foreground mb-1">{prediction.title}</h5>
                          <p className="text-sm text-muted-foreground leading-relaxed">{prediction.description}</p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center min-w-[100px] p-3 rounded-lg bg-surface2 border border-border/50">
                          <span className="text-xs text-muted-foreground mb-1">الاحتمالية</span>
                          <span className="text-xl font-bold text-gold">{prediction.probability}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
