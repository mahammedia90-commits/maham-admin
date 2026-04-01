/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — الموارد البشرية (HR Management)
 * Features: موظفين، حضور، إجازات، رواتب، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UserCheck, Calendar, Clock, DollarSign, Award,
  Briefcase, TrendingUp, Plus, Eye, FileText, Building2,
  X, Trash2, AlertTriangle, Search, Mail, Phone, MapPin
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface Employee {
  id: number; name: string; department: string; position: string; status: string
  salary: number; joinDate: string; email: string; phone: string; city: string
  attendance: number; leaves: number; performance: number
}

const demoEmployees: Employee[] = [
  { id: 1, name: 'أحمد محمد الشهري', department: 'المبيعات', position: 'مدير مبيعات', status: 'active', salary: 18000, joinDate: '2024-03-15', email: 'ahmed@mahamexpo.sa', phone: '+966501234567', city: 'الرياض', attendance: 96, leaves: 2, performance: 92 },
  { id: 2, name: 'سارة العلي', department: 'التسويق', position: 'مديرة تسويق', status: 'active', salary: 16000, joinDate: '2024-06-01', email: 'sara@mahamexpo.sa', phone: '+966502345678', city: 'الرياض', attendance: 98, leaves: 1, performance: 95 },
  { id: 3, name: 'خالد الحربي', department: 'العمليات', position: 'مشرف عمليات', status: 'active', salary: 14000, joinDate: '2025-01-10', email: 'khalid@mahamexpo.sa', phone: '+966503456789', city: 'الرياض', attendance: 94, leaves: 3, performance: 88 },
  { id: 4, name: 'فاطمة أحمد', department: 'خدمة العملاء', position: 'أخصائية دعم', status: 'active', salary: 12000, joinDate: '2025-04-20', email: 'fatima@mahamexpo.sa', phone: '+966504567890', city: 'جدة', attendance: 92, leaves: 4, performance: 85 },
  { id: 5, name: 'عمر الزهراني', department: 'تقنية المعلومات', position: 'مطور أنظمة', status: 'active', salary: 20000, joinDate: '2024-01-05', email: 'omar@mahamexpo.sa', phone: '+966505678901', city: 'الرياض', attendance: 97, leaves: 1, performance: 94 },
  { id: 6, name: 'نورة السبيعي', department: 'المالية', position: 'محاسبة', status: 'active', salary: 13000, joinDate: '2025-02-15', email: 'noura@mahamexpo.sa', phone: '+966506789012', city: 'الرياض', attendance: 99, leaves: 0, performance: 91 },
  { id: 7, name: 'ماجد القحطاني', department: 'القانونية', position: 'مستشار قانوني', status: 'on_leave', salary: 22000, joinDate: '2023-11-01', email: 'majed@mahamexpo.sa', phone: '+966507890123', city: 'الرياض', attendance: 90, leaves: 8, performance: 87 },
  { id: 8, name: 'ريم الغامدي', department: 'الموارد البشرية', position: 'مديرة HR', status: 'active', salary: 17000, joinDate: '2024-08-10', email: 'reem@mahamexpo.sa', phone: '+966508901234', city: 'الرياض', attendance: 95, leaves: 2, performance: 93 },
  { id: 9, name: 'تركي الشمري', department: 'المبيعات', position: 'مندوب مبيعات', status: 'active', salary: 10000, joinDate: '2025-06-01', email: 'turki@mahamexpo.sa', phone: '+966509012345', city: 'الدمام', attendance: 88, leaves: 5, performance: 78 },
  { id: 10, name: 'هند المطيري', department: 'التسويق', position: 'مصممة جرافيك', status: 'probation', salary: 11000, joinDate: '2026-01-15', email: 'hind@mahamexpo.sa', phone: '+966510123456', city: 'الرياض', attendance: 100, leaves: 0, performance: 82 },
]

const departments = ['الكل', 'المبيعات', 'التسويق', 'العمليات', 'خدمة العملاء', 'تقنية المعلومات', 'المالية', 'القانونية', 'الموارد البشرية']
const statusLabels: Record<string, string> = { active: 'نشط', on_leave: 'إجازة', probation: 'تجربة', terminated: 'منتهي' }
const statusColors: Record<string, string> = { active: 'bg-success/10 text-success', on_leave: 'bg-warning/10 text-warning', probation: 'bg-info/10 text-info', terminated: 'bg-danger/10 text-danger' }

export default function HrPage() {
  const [activeTab, setActiveTab] = useState('employees')
  const [employees, setEmployees] = useState(demoEmployees)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('الكل')
  const [detailEmp, setDetailEmp] = useState<Employee | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newEmp, setNewEmp] = useState({ name: '', department: 'المبيعات', position: '', salary: '', email: '', phone: '' })

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    avgSalary: Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length),
    totalPayroll: employees.reduce((s, e) => s + e.salary, 0),
    avgPerformance: Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length),
  }), [employees])

  const filtered = useMemo(() => {
    let result = [...employees]
    if (deptFilter !== 'الكل') result = result.filter(e => e.department === deptFilter)
    if (search) { const s = search.toLowerCase(); result = result.filter(e => e.name.includes(s) || e.position.includes(s) || e.email.includes(s)) }
    return result
  }, [employees, deptFilter, search])

  const handleAdd = () => {
    if (!newEmp.name || !newEmp.position) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    const e: Employee = {
      id: Math.max(...employees.map(e => e.id)) + 1, name: newEmp.name, department: newEmp.department,
      position: newEmp.position, status: 'probation', salary: parseFloat(newEmp.salary) || 0,
      joinDate: new Date().toISOString().split('T')[0], email: newEmp.email, phone: newEmp.phone,
      city: 'الرياض', attendance: 100, leaves: 0, performance: 0,
    }
    setEmployees(prev => [e, ...prev])
    toast.success(`تمت إضافة الموظف: ${e.name}`)
    setShowAddModal(false)
    setNewEmp({ name: '', department: 'المبيعات', position: '', salary: '', email: '', phone: '' })
  }

  const handleDelete = (id: number) => {
    const e = employees.find(e => e.id === id)
    setEmployees(prev => prev.filter(e => e.id !== id))
    toast.success(`تم حذف الموظف: ${e?.name}`)
    setDeleteConfirm(null)
  }

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة الموارد البشرية"
        subtitle={`${stats.total} موظف — الرواتب الشهرية: ${formatCurrency(stats.totalPayroll)}`}
        actions={
          <button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} /> موظف جديد
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="إجمالي الموظفين" value={String(stats.total)} icon={Users} delay={0} />
        <StatsCard title="موظفون نشطون" value={String(stats.active)} icon={UserCheck} delay={0.05} />
        <StatsCard title="متوسط الأداء" value={`${stats.avgPerformance}%`} icon={TrendingUp} trend={3} trendLabel="تحسن" delay={0.1} />
        <StatsCard title="إجمالي الرواتب" value={formatCurrency(stats.totalPayroll)} icon={DollarSign} delay={0.15} />
      </div>

      {/* تبويبات */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
        {[{ key: 'employees', label: 'الموظفون', icon: Users }, { key: 'attendance', label: 'الحضور', icon: Clock }, { key: 'departments', label: 'الأقسام', icon: Building2 }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', activeTab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'employees' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50 flex-wrap gap-3">
            <div className="relative w-64">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو المنصب..."
                className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {departments.map(d => (
                <button key={d} onClick={() => setDeptFilter(d)} className={cn('h-7 px-2.5 rounded-lg text-[11px] font-medium transition-all', deptFilter === d ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>{d}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead><tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الموظف</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">القسم</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المنصب</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الحالة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الراتب</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الأداء</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">إجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-16 text-center"><Users size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground text-sm">لا يوجد موظفون مطابقون</p></td></tr>
                ) : filtered.map((emp, idx) => (
                  <motion.tr key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">{emp.name.charAt(0)}</div>
                        <div><p className="text-sm font-medium text-foreground">{emp.name}</p><p className="text-[10px] text-muted-foreground">{emp.email}</p></div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{emp.department}</td>
                    <td className="px-3 py-3 text-xs text-foreground">{emp.position}</td>
                    <td className="px-3 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', statusColors[emp.status])}>{statusLabels[emp.status]}</span></td>
                    <td className="px-3 py-3"><span className="font-mono text-sm text-foreground">{formatCurrency(emp.salary)}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-12 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', emp.performance >= 90 ? 'bg-success' : emp.performance >= 70 ? 'bg-gold' : 'bg-warning')} style={{ width: `${emp.performance}%` }} /></div>
                        <span className="text-[10px] font-mono text-muted-foreground">{emp.performance}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button onClick={() => setDetailEmp(emp)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                        <button onClick={() => setDeleteConfirm(emp.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'attendance' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {employees.filter(e => e.status === 'active').map((emp, i) => (
            <motion.div key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">{emp.name.charAt(0)}</div>
                <div><h4 className="text-sm font-bold text-foreground">{emp.name}</h4><p className="text-[10px] text-muted-foreground">{emp.department}</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-success/5 border border-success/15 text-center"><p className="text-[9px] text-muted-foreground">الحضور</p><p className="text-sm font-bold font-mono text-success">{emp.attendance}%</p></div>
                <div className="p-2 rounded-lg bg-warning/5 border border-warning/15 text-center"><p className="text-[9px] text-muted-foreground">الإجازات</p><p className="text-sm font-bold font-mono text-warning">{emp.leaves}</p></div>
                <div className="p-2 rounded-lg bg-gold/5 border border-gold/15 text-center"><p className="text-[9px] text-muted-foreground">الأداء</p><p className="text-sm font-bold font-mono text-gold">{emp.performance}%</p></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'departments' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.filter(d => d !== 'الكل').map((dept, i) => {
            const deptEmps = employees.filter(e => e.department === dept)
            const avgPerf = deptEmps.length ? Math.round(deptEmps.reduce((s, e) => s + e.performance, 0) / deptEmps.length) : 0
            const totalSalary = deptEmps.reduce((s, e) => s + e.salary, 0)
            return (
              <motion.div key={dept} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-3 sm:p-4 lg:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Building2 size={18} className="text-gold" /></div>
                  <div><h3 className="text-sm font-bold text-foreground">{dept}</h3><p className="text-[10px] text-muted-foreground">{deptEmps.length} موظف</p></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 sm:mb-3">
                  <div className="p-2 rounded-lg bg-surface2/50"><p className="text-[9px] text-muted-foreground">الرواتب</p><p className="text-xs font-bold font-mono text-foreground">{formatCurrency(totalSalary)}</p></div>
                  <div className="p-2 rounded-lg bg-surface2/50"><p className="text-[9px] text-muted-foreground">متوسط الأداء</p><p className={cn('text-xs font-bold font-mono', avgPerf >= 90 ? 'text-success' : avgPerf >= 70 ? 'text-gold' : 'text-warning')}>{avgPerf}%</p></div>
                </div>
                <div className="space-y-1.5">
                  {deptEmps.slice(0, 3).map(e => (
                    <div key={e.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{e.name}</span>
                      <span className="text-foreground">{e.position}</span>
                    </div>
                  ))}
                  {deptEmps.length > 3 && <p className="text-[10px] text-center text-muted-foreground">+{deptEmps.length - 3} آخرين</p>}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* نافذة تفاصيل الموظف */}
      <AnimatePresence>
        {detailEmp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailEmp(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xl">{detailEmp.name.charAt(0)}</div>
                  <div><h2 className="text-lg font-bold text-foreground">{detailEmp.name}</h2><p className="text-xs text-muted-foreground">{detailEmp.position} — {detailEmp.department}</p></div>
                </div>
                <button onClick={() => setDetailEmp(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 sm:mb-4">
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">البريد</p><p className="text-xs text-foreground flex items-center gap-1"><Mail size={10} className="text-gold" />{detailEmp.email}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الجوال</p><p className="text-xs text-foreground flex items-center gap-1" dir="ltr"><Phone size={10} className="text-gold" />{detailEmp.phone}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">المدينة</p><p className="text-xs text-foreground flex items-center gap-1"><MapPin size={10} className="text-gold" />{detailEmp.city}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">تاريخ الالتحاق</p><p className="text-xs text-foreground flex items-center gap-1"><Calendar size={10} className="text-gold" />{formatDate(detailEmp.joinDate)}</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 text-center"><p className="text-[10px] text-muted-foreground">الراتب</p><p className="text-sm font-bold font-mono text-gold">{formatCurrency(detailEmp.salary)}</p></div>
                <div className="p-3 rounded-xl bg-success/5 border border-success/20 text-center"><p className="text-[10px] text-muted-foreground">الحضور</p><p className="text-sm font-bold font-mono text-success">{detailEmp.attendance}%</p></div>
                <div className="p-3 rounded-xl bg-info/5 border border-info/20 text-center"><p className="text-[10px] text-muted-foreground">الأداء</p><p className="text-sm font-bold font-mono text-info">{detailEmp.performance}%</p></div>
              </div>
              <span className={cn('text-xs px-2.5 py-1 rounded-full', statusColors[detailEmp.status])}>{statusLabels[detailEmp.status]}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة إضافة موظف */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Users size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">موظف جديد</h3><p className="text-xs text-muted-foreground">إضافة موظف للنظام</p></div>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الاسم <span className="text-danger">*</span></label><input type="text" value={newEmp.name} onChange={(e) => setNewEmp(p => ({ ...p, name: e.target.value }))} placeholder="الاسم الكامل" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القسم</label><select value={newEmp.department} onChange={(e) => setNewEmp(p => ({ ...p, department: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50">{departments.filter(d => d !== 'الكل').map(d => <option key={d}>{d}</option>)}</select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المنصب <span className="text-danger">*</span></label><input type="text" value={newEmp.position} onChange={(e) => setNewEmp(p => ({ ...p, position: e.target.value }))} placeholder="المسمى الوظيفي" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">البريد</label><input type="email" value={newEmp.email} onChange={(e) => setNewEmp(p => ({ ...p, email: e.target.value }))} placeholder="email@mahamexpo.sa" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الراتب (ر.س)</label><input type="number" value={newEmp.salary} onChange={(e) => setNewEmp(p => ({ ...p, salary: e.target.value }))} placeholder="0" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إضافة الموظف</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-4 sm:p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف الموظف</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{employees.find(e => e.id === deleteConfirm)?.name}</span>؟</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
