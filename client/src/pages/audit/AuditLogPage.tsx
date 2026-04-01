// Design: Nour Theme — Audit Log Module
// 3 tabs: Activity Log, Security, Reports
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History, Shield, FileText, Search, Download, Clock,
  User, AlertTriangle, CheckCircle, XCircle, Eye,
  Filter, Activity, Lock, Unlock, Globe, Monitor
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'activity', label: 'سجل الأحداث', icon: History },
  { id: 'security', label: 'الأمان', icon: Shield },
  { id: 'reports', label: 'تقارير التدقيق', icon: FileText },
]

const activityLogs = [
  { id: 1, user: 'نور كرم', avatar: 'ن', action: 'إنشاء', module: 'الفعاليات', details: 'إنشاء فعالية "معرض الرياض التقني 2026"', ip: '192.168.1.45', timestamp: '2026-04-01 14:30:22', severity: 'info' },
  { id: 2, user: 'أحمد الراشد', avatar: 'أ', action: 'تعديل', module: 'العقود', details: 'تعديل عقد #C-2026-045 — تحديث قيمة العقد', ip: '10.0.0.12', timestamp: '2026-04-01 14:15:10', severity: 'info' },
  { id: 3, user: 'سارة العلي', avatar: 'س', action: 'موافقة', module: 'KYC', details: 'الموافقة على طلب KYC للتاجر "شركة التقنية المتقدمة"', ip: '10.0.0.8', timestamp: '2026-04-01 13:45:33', severity: 'success' },
  { id: 4, user: 'خالد الحربي', avatar: 'خ', action: 'حذف', module: 'المستندات', details: 'حذف مستند "عقد إيجار قديم.pdf"', ip: '10.0.0.15', timestamp: '2026-04-01 13:20:05', severity: 'warning' },
  { id: 5, user: 'فاطمة الزهراني', avatar: 'ف', action: 'تصدير', module: 'التقارير', details: 'تصدير تقرير الإيرادات الشهري — مارس 2026', ip: '10.0.0.22', timestamp: '2026-04-01 12:55:18', severity: 'info' },
  { id: 6, user: 'محمد العتيبي', avatar: 'م', action: 'تسجيل دخول', module: 'النظام', details: 'تسجيل دخول ناجح من جهاز جديد', ip: '85.12.45.67', timestamp: '2026-04-01 12:30:44', severity: 'info' },
  { id: 7, user: 'عبدالله القحطاني', avatar: 'ع', action: 'رفض', module: 'الحجوزات', details: 'رفض طلب حجز #B-2026-089 — عدم اكتمال المستندات', ip: '10.0.0.18', timestamp: '2026-04-01 11:45:12', severity: 'danger' },
  { id: 8, user: 'نور كرم', avatar: 'ن', action: 'تعديل', module: 'الإعدادات', details: 'تحديث إعدادات الإشعارات — تفعيل SMS', ip: '192.168.1.45', timestamp: '2026-04-01 11:20:30', severity: 'info' },
  { id: 9, user: 'سارة العلي', avatar: 'س', action: 'إنشاء', module: 'الرعاة', details: 'إضافة راعٍ جديد "شركة STC"', ip: '10.0.0.8', timestamp: '2026-04-01 10:55:22', severity: 'success' },
  { id: 10, user: 'أحمد الراشد', avatar: 'أ', action: 'تسجيل خروج', module: 'النظام', details: 'تسجيل خروج طبيعي', ip: '10.0.0.12', timestamp: '2026-04-01 10:30:15', severity: 'info' },
]

const securityEvents = [
  { id: 1, type: 'login_success', user: 'نور كرم', device: 'MacBook Pro — Chrome 120', location: 'الرياض، السعودية', ip: '192.168.1.45', time: '2026-04-01 14:30', risk: 'low' },
  { id: 2, type: 'login_failed', user: 'admin@maham.sa', device: 'Unknown — Firefox', location: 'القاهرة، مصر', ip: '85.12.45.67', time: '2026-04-01 13:15', risk: 'high' },
  { id: 3, type: 'password_change', user: 'سارة العلي', device: 'iPhone 15 — Safari', location: 'الرياض، السعودية', ip: '10.0.0.8', time: '2026-04-01 12:00', risk: 'medium' },
  { id: 4, type: 'permission_change', user: 'نور كرم', device: 'MacBook Pro — Chrome 120', location: 'الرياض، السعودية', ip: '192.168.1.45', time: '2026-04-01 11:30', risk: 'medium' },
  { id: 5, type: 'login_success', user: 'خالد الحربي', device: 'Windows 11 — Edge', location: 'جدة، السعودية', ip: '10.0.0.15', time: '2026-04-01 10:45', risk: 'low' },
  { id: 6, type: 'login_failed', user: 'test@test.com', device: 'Unknown — Bot', location: 'موسكو، روسيا', ip: '195.22.33.44', time: '2026-04-01 09:20', risk: 'critical' },
]

const auditReports = [
  { id: 1, name: 'تقرير النشاط الشهري', period: 'مارس 2026', entries: 2450, users: 18, generated: '2026-04-01' },
  { id: 2, name: 'تقرير الأمان', period: 'مارس 2026', entries: 156, users: 8, generated: '2026-04-01' },
  { id: 3, name: 'تقرير الامتثال SAMA', period: 'Q1 2026', entries: 890, users: 22, generated: '2026-03-31' },
  { id: 4, name: 'تقرير الصلاحيات', period: 'أبريل 2026', entries: 45, users: 5, generated: '2026-04-01' },
]

const actionColors: Record<string, string> = {
  'إنشاء': 'bg-success/15 text-success', 'تعديل': 'bg-info/15 text-info', 'حذف': 'bg-danger/15 text-danger',
  'موافقة': 'bg-success/15 text-success', 'رفض': 'bg-danger/15 text-danger', 'تصدير': 'bg-chrome/15 text-chrome',
  'تسجيل دخول': 'bg-gold/15 text-gold', 'تسجيل خروج': 'bg-surface2 text-muted-foreground',
}

const riskColors: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-success/15', text: 'text-success', label: 'منخفض' },
  medium: { bg: 'bg-warning/15', text: 'text-warning', label: 'متوسط' },
  high: { bg: 'bg-danger/15', text: 'text-danger', label: 'مرتفع' },
  critical: { bg: 'bg-danger/20', text: 'text-danger', label: 'حرج' },
}

const securityTypeLabels: Record<string, { icon: typeof Lock; label: string }> = {
  login_success: { icon: Unlock, label: 'دخول ناجح' },
  login_failed: { icon: XCircle, label: 'دخول فاشل' },
  password_change: { icon: Lock, label: 'تغيير كلمة مرور' },
  permission_change: { icon: Shield, label: 'تغيير صلاحيات' },
}

export default function AuditLogPage() {
  const [activeTab, setActiveTab] = useState('activity')
  const [search, setSearch] = useState('')

  const filteredLogs = activityLogs.filter(l => !search || l.user.includes(search) || l.details.includes(search) || l.module.includes(search))

  return (
    <AdminLayout>
      <PageHeader title="سجل التدقيق" subtitle="تتبع جميع العمليات والإجراءات والأحداث الأمنية" actions={
        <button onClick={() => toast.info('تصدير السجل — قريباً')} className="h-9 px-4 rounded-xl bg-surface2/50 border border-border/30 text-sm font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"><Download size={16} /> تصدير</button>
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

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="إجمالي الأحداث" value="2,450" icon={Activity} delay={0} />
                <StatsCard title="المستخدمون النشطون" value="18" icon={User} delay={0.1} />
                <StatsCard title="أحداث اليوم" value="10" icon={Clock} delay={0.2} />
                <StatsCard title="تنبيهات أمنية" value="2" icon={AlertTriangle} trend={-50} delay={0.3} />
              </div>

              <div className="glass-card p-3">
                <div className="relative">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في السجل..." className="w-full h-10 pr-10 pl-4 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50" />
                </div>
              </div>

              <div className="space-y-2">
                {filteredLogs.map((log, i) => (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-3 px-4 hover:border-gold/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold">{log.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-foreground">{log.user}</span>
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full', actionColors[log.action] || 'bg-surface2 text-muted-foreground')}>{log.action}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface2 text-muted-foreground">{log.module}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.details}</p>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-[10px] font-mono text-muted-foreground">{log.timestamp}</p>
                        <p className="text-[10px] font-mono text-muted-foreground/60">{log.ip}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="محاولات دخول ناجحة" value="145" icon={CheckCircle} delay={0} />
                <StatsCard title="محاولات دخول فاشلة" value="12" icon={XCircle} trend={-25} delay={0.1} />
                <StatsCard title="أجهزة مسجلة" value="28" icon={Monitor} delay={0.2} />
                <StatsCard title="تنبيهات حرجة" value="1" icon={AlertTriangle} delay={0.3} />
              </div>

              <div className="space-y-3">
                {securityEvents.map((ev, i) => {
                  const typeInfo = securityTypeLabels[ev.type] || { icon: Activity, label: ev.type }
                  const risk = riskColors[ev.risk]
                  const TypeIcon = typeInfo.icon
                  return (
                    <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn('glass-card p-4 hover:border-gold/20 transition-colors', ev.risk === 'critical' && 'border-danger/30')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', risk.bg)}><TypeIcon size={18} className={risk.text} /></div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-foreground">{typeInfo.label}</h4>
                              <span className={cn('text-[10px] px-2 py-0.5 rounded-full', risk.bg, risk.text)}>{risk.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{ev.user} • {ev.device}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Globe size={10} /> {ev.location}</p>
                          <p className="text-[10px] font-mono text-muted-foreground/60">{ev.ip} • {ev.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {auditReports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center"><FileText size={18} className="text-gold" /></div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{r.name}</h4>
                          <p className="text-[10px] text-muted-foreground">{r.period} • {formatDate(r.generated)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mb-4">
                      <div><p className="text-[10px] text-muted-foreground">السجلات</p><p className="text-lg font-bold text-foreground">{r.entries.toLocaleString()}</p></div>
                      <div><p className="text-[10px] text-muted-foreground">المستخدمون</p><p className="text-lg font-bold text-gold">{r.users}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toast.info('عرض التقرير — قريباً')} className="flex-1 h-8 rounded-lg bg-surface2/50 text-xs font-medium text-foreground hover:bg-surface2 transition-all flex items-center justify-center gap-1"><Eye size={12} /> عرض</button>
                      <button onClick={() => toast.info('تحميل — قريباً')} className="flex-1 h-8 rounded-lg bg-gold/10 text-xs font-medium text-gold hover:bg-gold/20 transition-all flex items-center justify-center gap-1"><Download size={12} /> تحميل</button>
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
