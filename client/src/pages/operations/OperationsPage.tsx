// Design: Nour Theme — Operations Module
// 5 tabs: Field Ops, Logistics, Maintenance, Security, Emergency
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck, Wrench, Shield, AlertTriangle, Plus,
  MapPin, Clock, CheckCircle, Users, Package, Zap,
  Radio, Eye, Activity, Thermometer
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'field', label: 'العمليات الميدانية', icon: MapPin },
  { id: 'logistics', label: 'اللوجستيات', icon: Truck },
  { id: 'maintenance', label: 'الصيانة', icon: Wrench },
  { id: 'security', label: 'الأمن والسلامة', icon: Shield },
  { id: 'emergency', label: 'الطوارئ', icon: AlertTriangle },
]

const fieldTasks = [
  { id: 'FT-001', title: 'تجهيز القاعة A — معرض الرياض التقني', assignee: 'فريق التجهيز 1', status: 'in_progress', priority: 'high', location: 'القاعة A', dueDate: '2026-04-05', progress: 65 },
  { id: 'FT-002', title: 'تركيب أنظمة الصوت — القاعة B', assignee: 'فريق الصوتيات', status: 'completed', priority: 'medium', location: 'القاعة B', dueDate: '2026-04-03', progress: 100 },
  { id: 'FT-003', title: 'فحص أنظمة الإضاءة — جميع القاعات', assignee: 'فريق الكهرباء', status: 'pending', priority: 'high', location: 'جميع القاعات', dueDate: '2026-04-04', progress: 0 },
  { id: 'FT-004', title: 'تنسيق المداخل والمخارج', assignee: 'فريق التنظيم', status: 'in_progress', priority: 'medium', location: 'المداخل الرئيسية', dueDate: '2026-04-06', progress: 40 },
  { id: 'FT-005', title: 'تركيب اللوحات الإرشادية', assignee: 'فريق التصميم', status: 'pending', priority: 'low', location: 'جميع المناطق', dueDate: '2026-04-07', progress: 0 },
]

const shipments = [
  { id: 'SH-001', item: 'أجنحة العرض — 50 وحدة', from: 'مستودع الرياض', to: 'مركز المعارض', status: 'delivered', carrier: 'DHL', eta: '2026-04-01' },
  { id: 'SH-002', item: 'شاشات LED — 20 وحدة', from: 'جدة', to: 'مركز المعارض', status: 'in_transit', carrier: 'أرامكس', eta: '2026-04-03' },
  { id: 'SH-003', item: 'أثاث المعرض — 100 قطعة', from: 'الدمام', to: 'مركز المعارض', status: 'in_transit', carrier: 'سمسا', eta: '2026-04-04' },
  { id: 'SH-004', item: 'مواد تسويقية — 5000 نسخة', from: 'المطبعة', to: 'مركز المعارض', status: 'preparing', carrier: 'نقل داخلي', eta: '2026-04-05' },
]

const maintenanceTickets = [
  { id: 'MNT-001', issue: 'تسريب مياه — دورات المياه القاعة C', priority: 'urgent', status: 'in_progress', assignee: 'فريق السباكة', reported: '2026-04-01' },
  { id: 'MNT-002', issue: 'عطل مكيف — القاعة A الجناح 12', priority: 'high', status: 'pending', assignee: 'فريق التكييف', reported: '2026-04-01' },
  { id: 'MNT-003', issue: 'إصلاح أرضية — المدخل الرئيسي', priority: 'medium', status: 'completed', assignee: 'فريق الصيانة', reported: '2026-03-30' },
  { id: 'MNT-004', issue: 'استبدال إضاءة — الممر B', priority: 'low', status: 'completed', assignee: 'فريق الكهرباء', reported: '2026-03-29' },
]

const securityPosts = [
  { id: 1, name: 'المدخل الرئيسي', guards: 4, cameras: 6, status: 'active', incidents: 0 },
  { id: 2, name: 'القاعة A', guards: 3, cameras: 8, status: 'active', incidents: 1 },
  { id: 3, name: 'القاعة B', guards: 3, cameras: 8, status: 'active', incidents: 0 },
  { id: 4, name: 'مواقف السيارات', guards: 2, cameras: 12, status: 'active', incidents: 2 },
  { id: 5, name: 'منطقة VIP', guards: 4, cameras: 4, status: 'active', incidents: 0 },
]

const emergencyProtocols = [
  { id: 1, name: 'بروتوكول الإخلاء', type: 'حريق', status: 'active', lastDrill: '2026-03-15', nextDrill: '2026-04-15', readiness: 95 },
  { id: 2, name: 'بروتوكول الطوارئ الطبية', type: 'طبي', status: 'active', lastDrill: '2026-03-20', nextDrill: '2026-04-20', readiness: 90 },
  { id: 3, name: 'بروتوكول الكوارث الطبيعية', type: 'كوارث', status: 'active', lastDrill: '2026-02-28', nextDrill: '2026-05-28', readiness: 85 },
  { id: 4, name: 'بروتوكول الأمن السيبراني', type: 'سيبراني', status: 'review', lastDrill: '2026-03-01', nextDrill: '2026-04-01', readiness: 75 },
]

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState('field')

  return (
    <AdminLayout>
      <PageHeader title="العمليات" subtitle="إدارة العمليات الميدانية واللوجستيات والصيانة والأمن والطوارئ" actions={
        <button onClick={() => toast.info('مهمة جديدة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> مهمة جديدة</button>
      } />

      <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border/50 overflow-x-auto mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-surface2/50')}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {activeTab === 'field' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="مهام نشطة" value="5" icon={Activity} delay={0} />
                <StatsCard title="مكتملة" value="12" icon={CheckCircle} delay={0.1} />
                <StatsCard title="فرق العمل" value="8" icon={Users} delay={0.2} />
                <StatsCard title="متوسط الإنجاز" value="41%" icon={Zap} delay={0.3} />
              </div>
              <div className="space-y-3">
                {fieldTasks.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={cn('w-2 h-2 rounded-full', t.priority === 'high' ? 'bg-danger' : t.priority === 'medium' ? 'bg-warning' : 'bg-info')} />
                        <div><p className="text-sm font-bold text-foreground">{t.title}</p><p className="text-[10px] text-muted-foreground">{t.id} • {t.assignee} • {t.location}</p></div>
                      </div>
                      <StatusBadge status={t.status === 'completed' ? 'approved' : t.status === 'in_progress' ? 'pending' : 'draft'} />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full transition-all', t.progress === 100 ? 'bg-success' : t.progress > 50 ? 'bg-gold' : 'bg-warning')} style={{ width: `${t.progress}%` }} /></div>
                      <span className="text-xs font-mono text-muted-foreground">{t.progress}%</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> {formatDate(t.dueDate)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="شحنات نشطة" value="4" icon={Truck} delay={0} />
                <StatsCard title="تم التسليم" value="8" icon={Package} delay={0.1} />
                <StatsCard title="في الطريق" value="2" icon={MapPin} delay={0.2} />
                <StatsCard title="قيد التجهيز" value="1" icon={Clock} delay={0.3} />
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['الشحنة','من','إلى','الحالة','الناقل','الوصول المتوقع'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {shipments.map((s, i) => (
                      <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                        <td className="p-4"><div><p className="text-sm font-bold text-foreground">{s.item}</p><p className="text-[10px] font-mono text-muted-foreground">{s.id}</p></div></td>
                        <td className="p-4 text-sm text-muted-foreground">{s.from}</td>
                        <td className="p-4 text-sm text-foreground">{s.to}</td>
                        <td className="p-4"><StatusBadge status={s.status === 'delivered' ? 'approved' : s.status === 'in_transit' ? 'pending' : 'draft'} /></td>
                        <td className="p-4 text-sm text-muted-foreground">{s.carrier}</td>
                        <td className="p-4 text-sm text-muted-foreground">{formatDate(s.eta)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="تذاكر مفتوحة" value="2" icon={Wrench} delay={0} />
                <StatsCard title="تم الحل" value="8" icon={CheckCircle} delay={0.1} />
                <StatsCard title="عاجلة" value="1" icon={AlertTriangle} delay={0.2} />
                <StatsCard title="متوسط الحل" value="18 ساعة" icon={Clock} delay={0.3} />
              </div>
              <div className="space-y-3">
                {maintenanceTickets.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center', t.priority === 'urgent' ? 'bg-danger/10 text-danger' : t.priority === 'high' ? 'bg-warning/10 text-warning' : t.priority === 'medium' ? 'bg-info/10 text-info' : 'bg-surface2 text-muted-foreground')}><Wrench size={14} /></span>
                        <div><p className="text-sm font-bold text-foreground">{t.issue}</p><p className="text-[10px] text-muted-foreground">{t.id} • {t.assignee} • أُبلغ: {formatDate(t.reported)}</p></div>
                      </div>
                      <StatusBadge status={t.status === 'completed' ? 'approved' : t.status === 'in_progress' ? 'pending' : 'draft'} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="نقاط الأمن" value="5" icon={Shield} delay={0} />
                <StatsCard title="الحراس" value="16" icon={Users} delay={0.1} />
                <StatsCard title="الكاميرات" value="38" icon={Eye} delay={0.2} />
                <StatsCard title="الحوادث اليوم" value="3" icon={AlertTriangle} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {securityPosts.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={16} className="text-gold" />
                      <h4 className="text-sm font-bold text-foreground">{p.name}</h4>
                      <span className="mr-auto w-2 h-2 rounded-full bg-success animate-pulse" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">حراس</p><p className="text-sm font-bold text-foreground">{p.guards}</p></div>
                      <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">كاميرات</p><p className="text-sm font-bold text-foreground">{p.cameras}</p></div>
                      <div className="p-2 rounded-lg bg-surface2/30 text-center"><p className="text-[10px] text-muted-foreground">حوادث</p><p className="text-sm font-bold" style={{ color: p.incidents > 0 ? '#ef4444' : '#10b981' }}>{p.incidents}</p></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="بروتوكولات نشطة" value="4" icon={Radio} delay={0} />
                <StatsCard title="متوسط الجاهزية" value="86%" icon={Thermometer} delay={0.1} />
                <StatsCard title="آخر تمرين" value="15 مارس" icon={Clock} delay={0.2} />
                <StatsCard title="حالات طوارئ" value="0" icon={AlertTriangle} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {emergencyProtocols.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', p.type === 'حريق' ? 'bg-danger/10 text-danger' : p.type === 'طبي' ? 'bg-success/10 text-success' : p.type === 'كوارث' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info')}>
                        <AlertTriangle size={18} />
                      </div>
                      <div><h4 className="text-sm font-bold text-foreground">{p.name}</h4><p className="text-[10px] text-muted-foreground">{p.type}</p></div>
                      <StatusBadge status={p.status === 'active' ? 'approved' : 'pending'} />
                    </div>
                    <div className="mb-3"><div className="flex items-center justify-between mb-1"><span className="text-[10px] text-muted-foreground">الجاهزية</span><span className="text-xs font-mono text-gold">{p.readiness}%</span></div><div className="w-full h-2 rounded-full bg-surface3"><div className={cn('h-full rounded-full', p.readiness >= 90 ? 'bg-success' : p.readiness >= 80 ? 'bg-gold' : 'bg-warning')} style={{ width: `${p.readiness}%` }} /></div></div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>آخر تمرين: {formatDate(p.lastDrill)}</span>
                      <span>التمرين القادم: {formatDate(p.nextDrill)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
