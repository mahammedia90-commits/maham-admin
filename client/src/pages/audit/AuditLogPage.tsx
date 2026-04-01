/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — سجل المراجعة (Audit Log)
 * Features: سجل أحداث، فلترة، تفاصيل، تصدير
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ScrollText, Search, Download, Filter, Clock, User,
  Shield, FileText, Settings, Users, DollarSign, Eye,
  AlertTriangle, CheckCircle, Edit3, Trash2, Plus, LogIn
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AuditEntry {
  id: number; timestamp: string; user: string; action: string; module: string
  target: string; details: string; ip: string; severity: string
}

const demoLogs: AuditEntry[] = [
  { id: 1, timestamp: '2026-04-01 09:45:23', user: 'نور كرم', action: 'تسجيل دخول', module: 'المصادقة', target: 'النظام', details: 'تسجيل دخول ناجح من الرياض', ip: '185.xxx.xxx.12', severity: 'info' },
  { id: 2, timestamp: '2026-04-01 09:30:15', user: 'نور كرم', action: 'تعديل', module: 'العقود', target: 'عقد رعاية أرامكو', details: 'تعديل قيمة العقد من 1M إلى 1.2M ر.س', ip: '185.xxx.xxx.12', severity: 'warning' },
  { id: 3, timestamp: '2026-04-01 09:15:00', user: 'سارة العلي', action: 'إنشاء', module: 'التسويق', target: 'حملة معرض الرياض', details: 'إنشاء حملة Google Ads جديدة بميزانية 50K', ip: '185.xxx.xxx.45', severity: 'info' },
  { id: 4, timestamp: '2026-04-01 08:50:30', user: 'عمر الزهراني', action: 'حذف', module: 'المستخدمين', target: 'حساب تجريبي', details: 'حذف حساب مستخدم تجريبي #TEST-001', ip: '185.xxx.xxx.78', severity: 'danger' },
  { id: 5, timestamp: '2026-04-01 08:30:00', user: 'نورة السبيعي', action: 'إنشاء', module: 'المالية', target: 'فاتورة INV-2026-089', details: 'إنشاء فاتورة لشركة المراعي — 320K ر.س', ip: '185.xxx.xxx.33', severity: 'info' },
  { id: 6, timestamp: '2026-03-31 17:20:00', user: 'خالد الحربي', action: 'تعديل', module: 'العمليات', target: 'مهمة تجهيز الأجنحة', details: 'تحديث التقدم من 40% إلى 55%', ip: '185.xxx.xxx.56', severity: 'info' },
  { id: 7, timestamp: '2026-03-31 16:45:00', user: 'ريم الغامدي', action: 'تعديل صلاحيات', module: 'الأدوار', target: 'دور مشرف العمليات', details: 'إضافة صلاحية "إدارة العقود" للدور', ip: '185.xxx.xxx.22', severity: 'warning' },
  { id: 8, timestamp: '2026-03-31 15:30:00', user: 'أحمد محمد', action: 'إنشاء', module: 'المبيعات', target: 'صفقة STC', details: 'إنشاء صفقة شراكة رقمية — 500K ر.س', ip: '185.xxx.xxx.67', severity: 'info' },
  { id: 9, timestamp: '2026-03-31 14:00:00', user: 'فاطمة أحمد', action: 'إغلاق', module: 'الدعم', target: 'تذكرة T-2026-005', details: 'إغلاق تذكرة خدمات إضافية — تم الحل', ip: '185.xxx.xxx.89', severity: 'success' },
  { id: 10, timestamp: '2026-03-31 11:15:00', user: 'ماجد القحطاني', action: 'تحميل', module: 'الملفات', target: 'عقد أرامكو.pdf', details: 'تحميل نسخة العقد الموقعة', ip: '185.xxx.xxx.44', severity: 'info' },
  { id: 11, timestamp: '2026-03-31 10:00:00', user: 'النظام', action: 'تنبيه', module: 'الامتثال', target: 'رخصة الدفاع المدني', details: 'تنبيه تلقائي: الرخصة تنتهي خلال 30 يوم', ip: 'system', severity: 'warning' },
  { id: 12, timestamp: '2026-03-30 18:30:00', user: 'نور كرم', action: 'تسجيل خروج', module: 'المصادقة', target: 'النظام', details: 'تسجيل خروج طبيعي', ip: '185.xxx.xxx.12', severity: 'info' },
]

const actionIcons: Record<string, typeof Edit3> = { 'تسجيل دخول': LogIn, 'تسجيل خروج': LogIn, 'إنشاء': Plus, 'تعديل': Edit3, 'حذف': Trash2, 'تعديل صلاحيات': Shield, 'إغلاق': CheckCircle, 'تحميل': Download, 'تنبيه': AlertTriangle }
const severityColors: Record<string, string> = { info: 'bg-info/10 text-info', warning: 'bg-warning/10 text-warning', danger: 'bg-danger/10 text-danger', success: 'bg-success/10 text-success' }
const moduleIcons: Record<string, typeof Settings> = { 'المصادقة': Shield, 'العقود': FileText, 'التسويق': Eye, 'المستخدمين': Users, 'المالية': DollarSign, 'العمليات': Settings, 'الأدوار': Shield, 'المبيعات': DollarSign, 'الدعم': AlertTriangle, 'الملفات': FileText, 'الامتثال': Shield }

export default function AuditLogPage() {
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('الكل')
  const [severityFilter, setSeverityFilter] = useState('all')

  const modules = useMemo(() => ['الكل', ...Array.from(new Set(demoLogs.map(l => l.module)))], [])

  const filtered = useMemo(() => {
    let result = [...demoLogs]
    if (moduleFilter !== 'الكل') result = result.filter(l => l.module === moduleFilter)
    if (severityFilter !== 'all') result = result.filter(l => l.severity === severityFilter)
    if (search) { const s = search.toLowerCase(); result = result.filter(l => l.user.includes(s) || l.action.includes(s) || l.target.includes(s) || l.details.includes(s)) }
    return result
  }, [moduleFilter, severityFilter, search])

  return (
    <AdminLayout>
      <PageHeader title="سجل المراجعة" subtitle={`${demoLogs.length} حدث مسجل — آخر 48 ساعة`}
        actions={<button onClick={() => toast.info('تصدير السجل — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Download size={16} /> تصدير</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatsCard title="إجمالي الأحداث" value={String(demoLogs.length)} icon={ScrollText} delay={0} />
        <StatsCard title="تعديلات" value={String(demoLogs.filter(l => l.action === 'تعديل' || l.action === 'تعديل صلاحيات').length)} icon={Edit3} delay={0.05} />
        <StatsCard title="تنبيهات" value={String(demoLogs.filter(l => l.severity === 'warning').length)} icon={AlertTriangle} delay={0.1} />
        <StatsCard title="مستخدمون نشطون" value={String(new Set(demoLogs.filter(l => l.user !== 'النظام').map(l => l.user)).size)} icon={Users} delay={0.15} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50 flex-wrap gap-3">
          <div className="relative w-64"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في السجل..." className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              {['all', 'info', 'warning', 'danger', 'success'].map(s => (
                <button key={s} onClick={() => setSeverityFilter(s)} className={cn('h-7 px-2 rounded-lg text-[10px] font-medium transition-all', severityFilter === s ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
                  {s === 'all' ? 'الكل' : s === 'info' ? 'معلومات' : s === 'warning' ? 'تحذير' : s === 'danger' ? 'خطر' : 'نجاح'}
                </button>
              ))}
            </div>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="h-7 px-2 rounded-lg bg-surface2 border border-border/50 text-[10px] text-foreground focus:outline-none focus:border-gold/50">
              {modules.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="divide-y divide-border/30">
          {filtered.length === 0 ? (
            <div className="px-4 py-16 text-center"><ScrollText size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground text-sm">لا يوجد أحداث مطابقة</p></div>
          ) : filtered.map((log, idx) => {
            const AIcon = actionIcons[log.action] || Edit3
            return (
              <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                className="px-4 py-3 hover:bg-surface2/30 transition-colors flex items-center gap-4">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', severityColors[log.severity])}>
                  <AIcon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-foreground">{log.user}</span>
                    <span className="text-[10px] text-muted-foreground">—</span>
                    <span className="text-[10px] text-muted-foreground">{log.action}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', severityColors[log.severity])}>{log.module}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                </div>
                <div className="flex-shrink-0 text-left">
                  <p className="text-[10px] font-mono text-muted-foreground">{log.timestamp.split(' ')[1]}</p>
                  <p className="text-[9px] text-muted-foreground/60">{log.timestamp.split(' ')[0]}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}
