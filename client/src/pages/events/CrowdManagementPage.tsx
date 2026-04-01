/*
 * Crowd Management — إدارة الحشود
 * Design: Nour Theme — Liquid Gold Executive
 * مراقبة وإدارة الحشود في الفعاليات والمعارض
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn } from '@/lib/utils'
import {
  Users, AlertTriangle, CheckCircle2, MapPin, Activity,
  TrendingUp, Eye, Shield, Thermometer, Clock, ArrowUpRight,
  Radio, Wifi, Camera, Bell
} from 'lucide-react'

const zones = [
  { id: 'A', name: 'المنطقة A — الأجنحة الرئيسية', capacity: 2000, current: 1720, status: 'warning', cameras: 12, sensors: 8 },
  { id: 'B', name: 'المنطقة B — قاعة المؤتمرات', capacity: 800, current: 450, status: 'normal', cameras: 6, sensors: 4 },
  { id: 'C', name: 'المنطقة C — منطقة الطعام', capacity: 500, current: 380, status: 'normal', cameras: 4, sensors: 3 },
  { id: 'D', name: 'المنطقة D — المدخل الرئيسي', capacity: 1000, current: 890, status: 'warning', cameras: 8, sensors: 6 },
  { id: 'E', name: 'المنطقة E — ساحة العروض', capacity: 3000, current: 1200, status: 'normal', cameras: 16, sensors: 10 },
  { id: 'F', name: 'المنطقة F — مواقف السيارات', capacity: 1500, current: 1350, status: 'critical', cameras: 10, sensors: 5 },
]

const alerts = [
  { id: 1, zone: 'F', type: 'critical', message: 'مواقف السيارات وصلت 90% من السعة — تفعيل خطة الطوارئ', time: 'منذ 5 دقائق', icon: AlertTriangle },
  { id: 2, zone: 'A', type: 'warning', message: 'المنطقة A وصلت 86% — مراقبة مطلوبة', time: 'منذ 12 دقيقة', icon: Users },
  { id: 3, zone: 'D', type: 'warning', message: 'ازدحام عند المدخل الرئيسي — فتح بوابات إضافية', time: 'منذ 20 دقيقة', icon: MapPin },
  { id: 4, zone: 'B', type: 'info', message: 'تم إخلاء قاعة المؤتمرات بنجاح بعد انتهاء الجلسة', time: 'منذ 35 دقيقة', icon: CheckCircle2 },
]

const hourlyFlow = [
  { hour: '08:00', inflow: 120, outflow: 10 },
  { hour: '09:00', inflow: 350, outflow: 45 },
  { hour: '10:00', inflow: 520, outflow: 80 },
  { hour: '11:00', inflow: 680, outflow: 150 },
  { hour: '12:00', inflow: 420, outflow: 280 },
  { hour: '13:00', inflow: 380, outflow: 320 },
  { hour: '14:00', inflow: 550, outflow: 200 },
  { hour: '15:00', inflow: 480, outflow: 350 },
  { hour: '16:00', inflow: 300, outflow: 450 },
  { hour: '17:00', inflow: 150, outflow: 520 },
]

export default function CrowdManagementPage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0)
  const totalCurrent = zones.reduce((sum, z) => sum + z.current, 0)
  const totalCameras = zones.reduce((sum, z) => sum + z.cameras, 0)
  const totalSensors = zones.reduce((sum, z) => sum + z.sensors, 0)
  const overallRate = Math.round((totalCurrent / totalCapacity) * 100)

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6 pb-6 sm:pb-8">
        <PageHeader
          title="إدارة الحشود"
          subtitle="مراقبة وإدارة تدفق الزوار في الفعاليات والمعارض — بيانات حية"
          actions={
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Radio size={12} className="animate-pulse" />
                بث مباشر
              </span>
            </div>
          }
        />

        {/* KPI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <StatsCard title="إجمالي الزوار الآن" value={totalCurrent.toLocaleString()} icon={Users} trend={12} trendLabel="عن أمس" />
          <StatsCard title="معدل الإشغال" value={`${overallRate}%`} icon={Activity} trend={overallRate > 85 ? -3 : 5} trendLabel="تغيير" delay={0.05} />
          <StatsCard title="الكاميرات النشطة" value={totalCameras.toString()} icon={Camera} delay={0.1} />
          <StatsCard title="أجهزة الاستشعار" value={totalSensors.toString()} icon={Wifi} delay={0.15} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {/* Zones Grid - 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-foreground">خريطة المناطق</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {zones.map((zone) => {
                const rate = Math.round((zone.current / zone.capacity) * 100)
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                    className={cn(
                      'glass-card p-3 sm:p-4 lg:p-5 rounded-xl border cursor-pointer transition-all',
                      selectedZone === zone.id ? 'border-gold/30 shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'border-gold/10 hover:border-gold/20',
                      zone.status === 'critical' && 'border-red-500/30 bg-red-500/5'
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                          zone.status === 'critical' ? 'bg-red-500/15 text-red-400' :
                          zone.status === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                          'bg-emerald-500/15 text-emerald-400'
                        )}>
                          {zone.id}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">{zone.name}</p>
                          <p className="text-[10px] text-muted-foreground">{zone.cameras} كاميرا · {zone.sensors} مستشعر</p>
                        </div>
                      </div>
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full',
                        zone.status === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                        zone.status === 'warning' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      )}>
                        {zone.status === 'critical' ? 'حرج' : zone.status === 'warning' ? 'تحذير' : 'طبيعي'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">{zone.current.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                        <span className={cn(
                          'font-mono font-bold',
                          rate >= 90 ? 'text-red-400' : rate >= 80 ? 'text-amber-400' : 'text-emerald-400'
                        )}>
                          {rate}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-card/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${rate}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={cn(
                            'h-full rounded-full',
                            rate >= 90 ? 'bg-gradient-to-l from-red-500 to-red-400' :
                            rate >= 80 ? 'bg-gradient-to-l from-amber-500 to-amber-400' :
                            'bg-gradient-to-l from-emerald-500 to-emerald-400'
                          )}
                        />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedZone === zone.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-3 border-t border-border/30 space-y-2"
                      >
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2 rounded-lg bg-card/30">
                            <span className="text-muted-foreground">متوسط المكوث</span>
                            <p className="font-medium text-foreground mt-0.5">45 دقيقة</p>
                          </div>
                          <div className="p-2 rounded-lg bg-card/30">
                            <span className="text-muted-foreground">التدفق/ساعة</span>
                            <p className="font-medium text-foreground mt-0.5">~{Math.round(zone.current / 8)} شخص</p>
                          </div>
                          <div className="p-2 rounded-lg bg-card/30">
                            <span className="text-muted-foreground">درجة الحرارة</span>
                            <p className="font-medium text-foreground mt-0.5">24°C</p>
                          </div>
                          <div className="p-2 rounded-lg bg-card/30">
                            <span className="text-muted-foreground">جودة الهواء</span>
                            <p className="font-medium text-emerald-400 mt-0.5">جيدة</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 text-[10px] py-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-all border border-gold/15">
                            عرض الكاميرات
                          </button>
                          <button className="flex-1 text-[10px] py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/15">
                            خطة إخلاء
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Hourly Flow */}
            <div className="glass-card rounded-2xl p-3 sm:p-4 lg:p-6 border border-gold/10">
              <h3 className="text-sm font-bold text-foreground mb-4">تدفق الزوار بالساعة</h3>
              <div className="space-y-2">
                {hourlyFlow.map((h) => (
                  <div key={h.hour} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-muted-foreground font-mono">{h.hour}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-4 rounded-full bg-card/30 overflow-hidden flex">
                        <div className="h-full bg-emerald-500/60 rounded-r-full" style={{ width: `${(h.inflow / 700) * 100}%` }} />
                      </div>
                      <span className="w-8 text-emerald-400 text-[10px] font-mono">+{h.inflow}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-4 rounded-full bg-card/30 overflow-hidden flex justify-end">
                        <div className="h-full bg-red-500/40 rounded-l-full" style={{ width: `${(h.outflow / 700) * 100}%` }} />
                      </div>
                      <span className="w-8 text-red-400 text-[10px] font-mono">-{h.outflow}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500/60" /> دخول</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/40" /> خروج</span>
              </div>
            </div>
          </div>

          {/* Alerts Column */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="glass-card rounded-2xl p-3 sm:p-4 lg:p-6 border border-gold/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Bell size={14} className="text-gold" />
                  التنبيهات الحية
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                  {alerts.filter(a => a.type === 'critical').length} حرج
                </span>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-3 rounded-xl border transition-all',
                      alert.type === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                      alert.type === 'warning' ? 'bg-amber-500/5 border-amber-500/15' :
                      'bg-blue-500/5 border-blue-500/15'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <alert.icon size={14} className={cn(
                        'mt-0.5 shrink-0',
                        alert.type === 'critical' ? 'text-red-400' :
                        alert.type === 'warning' ? 'text-amber-400' :
                        'text-blue-400'
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-mono text-gold/60">المنطقة {alert.zone}</span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">{alert.message}</p>
                        <p className="text-[9px] text-muted-foreground/60 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="glass-card rounded-2xl p-3 sm:p-4 lg:p-6 border border-red-500/15">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield size={14} className="text-red-400" />
                إجراءات الطوارئ
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'تفعيل خطة الإخلاء', color: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' },
                  { label: 'إغلاق البوابات', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
                  { label: 'فتح بوابات إضافية', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
                  { label: 'إرسال تنبيه عام', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' },
                ].map((action) => (
                  <button key={action.label} className={cn('w-full text-xs py-2.5 rounded-xl border transition-all font-medium', action.color)}>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Prediction */}
            <div className="glass-card rounded-2xl p-3 sm:p-4 lg:p-6 border border-gold/10">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-gold" />
                توقعات AI
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
                  <p className="text-foreground font-medium">ذروة متوقعة</p>
                  <p className="text-muted-foreground mt-1">الساعة 3:00 - 5:00 مساءً — متوقع وصول 8,500 زائر</p>
                </div>
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
                  <p className="text-foreground font-medium">توصية</p>
                  <p className="text-muted-foreground mt-1">فتح بوابة إضافية في المنطقة D قبل الساعة 2:30 مساءً</p>
                </div>
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
                  <p className="text-foreground font-medium">مخاطر</p>
                  <p className="text-muted-foreground mt-1">احتمال 72% لتجاوز سعة مواقف السيارات — تفعيل خطة بديلة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
