/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Employees Directory & Profile
 * ═══════════════════════════════════════════════════════════════════════════
 * Enterprise employee directory with search, filters, grid/list views,
 * full employee profile modal with tabs (personal, employment, salary,
 * government, performance, documents, timeline)
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Grid3X3, List, Plus, Eye, Edit, Trash2, Download,
  Phone, Mail, MapPin, Calendar, Building2, Briefcase, DollarSign,
  Shield, Star, Brain, FileText, Clock, User, Globe, Fingerprint,
  CreditCard, ShieldCheck, BadgeCheck, Target, TrendingUp, Award,
  ChevronDown, X, MoreHorizontal, UserPlus, Upload, Printer
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { EmployeeAvatar, MiniProgress, MetricBox, InfoField, SectionCard, ActionButton } from './HrShared'
import type { Employee, Department, HRDocument } from '../hrTypes'
import {
  employmentStatusLabels, employmentStatusColors, contractTypeLabels,
  performanceRatingLabels, performanceRatingColors, documentTypeLabels
} from '../hrTypes'

interface HrEmployeesProps {
  employees: Employee[]
  departments: Department[]
  documents: HRDocument[]
  onAdd: () => void
  onEdit: (emp: Employee) => void
  onDelete: (id: string) => void
}

export default function HrEmployees({ employees, departments, documents, onAdd, onEdit, onDelete }: HrEmployeesProps) {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [nationalityFilter, setNationalityFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [profileTab, setProfileTab] = useState('personal')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = !search || e.full_name_ar.includes(search) || e.full_name_en.toLowerCase().includes(search.toLowerCase()) ||
        e.employee_number.includes(search) || e.email.includes(search) || e.national_id.includes(search)
      const matchDept = deptFilter === 'all' || e.department_id === deptFilter
      const matchStatus = statusFilter === 'all' || e.employment_status === statusFilter
      const matchNat = nationalityFilter === 'all' || e.nationality === nationalityFilter
      return matchSearch && matchDept && matchStatus && matchNat
    })
  }, [employees, search, deptFilter, statusFilter, nationalityFilter])

  const empDocuments = selectedEmployee ? documents.filter(d => d.employee_id === selectedEmployee.id) : []

  const profileTabs = [
    { id: 'personal', label: 'شخصي', icon: User },
    { id: 'employment', label: 'وظيفي', icon: Briefcase },
    { id: 'salary', label: 'الراتب', icon: DollarSign },
    { id: 'government', label: 'حكومي', icon: Shield },
    { id: 'performance', label: 'الأداء', icon: Target },
    { id: 'documents', label: 'المستندات', icon: FileText },
    { id: 'ai', label: 'AI', icon: Brain },
  ]

  return (
    <div className="space-y-4">
      {/* ─── Search & Filters Bar ──────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="بحث بالاسم، الرقم الوظيفي، البريد، الهوية..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowFilters(!showFilters)}
              className={cn('h-9 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all border',
                showFilters ? 'bg-gold/10 text-gold border-gold/30' : 'bg-surface2/50 text-muted-foreground border-border/30 hover:text-foreground')}>
              <Filter size={12} /> فلترة
            </button>
            <div className="flex items-center bg-surface2/50 rounded-xl border border-border/30 overflow-hidden">
              <button onClick={() => setViewMode('grid')}
                className={cn('h-9 w-9 flex items-center justify-center transition-all', viewMode === 'grid' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
                <Grid3X3 size={14} />
              </button>
              <button onClick={() => setViewMode('list')}
                className={cn('h-9 w-9 flex items-center justify-center transition-all', viewMode === 'list' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
                <List size={14} />
              </button>
            </div>
            <ActionButton label="إضافة موظف" icon={UserPlus} variant="primary" onClick={onAdd} />
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-border/20">
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
                  <option value="all">كل الأقسام</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name_ar}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
                  <option value="all">كل الحالات</option>
                  {Object.entries(employmentStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={nationalityFilter} onChange={e => setNationalityFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
                  <option value="all">كل الجنسيات</option>
                  <option value="saudi">سعودي</option>
                  <option value="non_saudi">غير سعودي</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/10">
          <span className="text-[10px] text-muted-foreground">عرض {filtered.length} من {employees.length} موظف</span>
          <div className="flex items-center gap-2">
            <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Download size={10} /> تصدير Excel
            </button>
            <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Printer size={10} /> طباعة
            </button>
          </div>
        </div>
      </div>

      {/* ─── Employee Grid View ────────────────────────────────────────── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(emp => (
            <motion.div key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 sm:p-4 hover:border-gold/20 transition-all cursor-pointer group"
              onClick={() => { setSelectedEmployee(emp); setProfileTab('personal') }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <EmployeeAvatar name={emp.full_name_ar} size="md" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{emp.full_name_ar}</p>
                    <p className="text-[10px] text-muted-foreground">{emp.job_title_ar}</p>
                    <p className="text-[9px] text-muted-foreground/60">{emp.employee_number}</p>
                  </div>
                </div>
                <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', employmentStatusColors[emp.employment_status])}>
                  {employmentStatusLabels[emp.employment_status]}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Building2 size={10} className="text-gold/60" /> {emp.department_name}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Phone size={10} className="text-gold/60" /> <span dir="ltr">{emp.phone}</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  <MetricBox label="الأداء" value={`${emp.performance_score}%`}
                    color={emp.performance_score >= 80 ? 'success' : emp.performance_score >= 60 ? 'gold' : 'warning'} />
                  <MetricBox label="الحضور" value={`${emp.attendance_rate}%`}
                    color={emp.attendance_rate >= 90 ? 'success' : 'warning'} />
                  <MetricBox label="AI خطر" value={`${emp.ai_risk_score}%`}
                    color={emp.ai_risk_score > 30 ? 'danger' : emp.ai_risk_score > 15 ? 'warning' : 'success'} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/10">
                <span className={cn('text-[9px] px-1.5 py-0.5 rounded', emp.nationality === 'saudi' ? 'bg-success/10 text-success' : 'bg-info/10 text-info')}>
                  {emp.nationality === 'saudi' ? 'سعودي' : emp.nationality_name}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); onEdit(emp) }}
                    className="p-1 rounded hover:bg-surface2 text-muted-foreground hover:text-foreground"><Edit size={12} /></button>
                  <button onClick={e => { e.stopPropagation(); onDelete(emp.id) }}
                    className="p-1 rounded hover:bg-danger/10 text-muted-foreground hover:text-danger"><Trash2 size={12} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* ─── Employee List View ──────────────────────────────────────── */
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border/20">
                  {['الموظف', 'القسم', 'المسمى', 'الحالة', 'الجنسية', 'الأداء', 'الحضور', 'الراتب', 'إجراءات'].map(h => (
                    <th key={h} className="p-3 text-right text-[10px] font-bold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id} className="border-b border-border/10 hover:bg-surface2/20 cursor-pointer transition-colors"
                    onClick={() => { setSelectedEmployee(emp); setProfileTab('personal') }}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <EmployeeAvatar name={emp.full_name_ar} size="sm" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{emp.full_name_ar}</p>
                          <p className="text-[9px] text-muted-foreground">{emp.employee_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-muted-foreground">{emp.department_name}</td>
                    <td className="p-3 text-[11px] text-foreground">{emp.job_title_ar}</td>
                    <td className="p-3">
                      <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', employmentStatusColors[emp.employment_status])}>
                        {employmentStatusLabels[emp.employment_status]}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={cn('text-[9px] px-1.5 py-0.5 rounded', emp.nationality === 'saudi' ? 'bg-success/10 text-success' : 'bg-info/10 text-info')}>
                        {emp.nationality === 'saudi' ? 'سعودي' : emp.nationality_name}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <MiniProgress value={emp.performance_score} color={emp.performance_score >= 80 ? 'success' : 'warning'} size="xs" />
                        <span className="text-[10px] font-mono text-foreground">{emp.performance_score}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-[11px] font-mono text-foreground">{emp.attendance_rate}%</td>
                    <td className="p-3 text-[11px] font-mono text-foreground">{formatCurrency(emp.total_salary)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button onClick={e => { e.stopPropagation(); onEdit(emp) }}
                          className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Edit size={12} /></button>
                        <button onClick={e => { e.stopPropagation(); onDelete(emp.id) }}
                          className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Employee Profile Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={() => setSelectedEmployee(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl glass-card my-4 sm:my-8" onClick={e => e.stopPropagation()}>
              {/* Profile Header */}
              <div className="p-4 sm:p-6 border-b border-border/20 bg-gradient-to-l from-gold/5 via-transparent to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <EmployeeAvatar name={selectedEmployee.full_name_ar} size="xl" />
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-foreground">{selectedEmployee.full_name_ar}</h2>
                      <p className="text-xs text-muted-foreground">{selectedEmployee.full_name_en}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', employmentStatusColors[selectedEmployee.employment_status])}>
                          {employmentStatusLabels[selectedEmployee.employment_status]}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{selectedEmployee.employee_number}</span>
                        <span className="text-[10px] text-muted-foreground">{selectedEmployee.department_name}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedEmployee(null)}
                    className="p-2 rounded-xl hover:bg-surface2 text-muted-foreground hover:text-foreground"><X size={18} /></button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  <MetricBox label="الأداء" value={`${selectedEmployee.performance_score}%`} color="gold" size="md" />
                  <MetricBox label="الحضور" value={`${selectedEmployee.attendance_rate}%`} color="success" size="md" />
                  <MetricBox label="صافي الراتب" value={formatCurrency(selectedEmployee.total_salary)} color="foreground" size="md" />
                  <MetricBox label="خطر المغادرة" value={`${selectedEmployee.ai_risk_score}%`}
                    color={selectedEmployee.ai_risk_score > 30 ? 'danger' : 'success'} size="md" />
                </div>
              </div>

              {/* Profile Tabs */}
              <div className="border-b border-border/20 overflow-x-auto scrollbar-hide">
                <div className="flex p-1 gap-0.5 min-w-max">
                  {profileTabs.map(tab => (
                    <button key={tab.id} onClick={() => setProfileTab(tab.id)}
                      className={cn('flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-all whitespace-nowrap',
                        profileTab === tab.id ? 'bg-gold/10 text-gold font-bold' : 'text-muted-foreground hover:text-foreground')}>
                      <tab.icon size={12} /> {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                {profileTab === 'personal' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoField label="الاسم بالعربي" value={selectedEmployee.full_name_ar} icon={User} />
                    <InfoField label="الاسم بالإنجليزي" value={selectedEmployee.full_name_en} icon={User} />
                    <InfoField label="رقم الهوية" value={selectedEmployee.national_id} icon={CreditCard} mono dir="ltr" />
                    <InfoField label="الجنس" value={selectedEmployee.gender === 'male' ? 'ذكر' : 'أنثى'} icon={User} />
                    <InfoField label="الجنسية" value={selectedEmployee.nationality_name} icon={Globe} />
                    <InfoField label="تاريخ الميلاد" value={formatDate(selectedEmployee.date_of_birth)} icon={Calendar} />
                    <InfoField label="الجوال" value={selectedEmployee.phone} icon={Phone} dir="ltr" mono />
                    <InfoField label="البريد الرسمي" value={selectedEmployee.email} icon={Mail} dir="ltr" />
                    <InfoField label="البريد الشخصي" value={selectedEmployee.personal_email} icon={Mail} dir="ltr" />
                    <InfoField label="العنوان" value={selectedEmployee.address} icon={MapPin} />
                    <InfoField label="المدينة" value={selectedEmployee.city} icon={MapPin} />
                    <InfoField label="جهة الطوارئ" value={`${selectedEmployee.emergency_contact} - ${selectedEmployee.emergency_phone}`} icon={Phone} />
                  </div>
                )}

                {profileTab === 'employment' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoField label="الرقم الوظيفي" value={selectedEmployee.employee_number} icon={BadgeCheck} mono />
                    <InfoField label="المسمى الوظيفي" value={selectedEmployee.job_title_ar} icon={Briefcase} />
                    <InfoField label="القسم" value={selectedEmployee.department_name} icon={Building2} />
                    <InfoField label="المدير المباشر" value={selectedEmployee.manager_name || 'لا يوجد'} icon={User} />
                    <InfoField label="نوع العقد" value={contractTypeLabels[selectedEmployee.contract_type]} icon={FileText} />
                    <InfoField label="الحالة" value={employmentStatusLabels[selectedEmployee.employment_status]} icon={ShieldCheck} />
                    <InfoField label="تاريخ الالتحاق" value={formatDate(selectedEmployee.join_date)} icon={Calendar} />
                    <InfoField label="نهاية التجربة" value={selectedEmployee.probation_end_date ? formatDate(selectedEmployee.probation_end_date) : 'لا ينطبق'} icon={Clock} />
                    <InfoField label="موقع العمل" value={selectedEmployee.work_location} icon={MapPin} />
                  </div>
                )}

                {profileTab === 'salary' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <InfoField label="الراتب الأساسي" value={formatCurrency(selectedEmployee.basic_salary)} icon={DollarSign} />
                      <InfoField label="بدل سكن" value={formatCurrency(selectedEmployee.housing_allowance)} icon={Building2} />
                      <InfoField label="بدل نقل" value={formatCurrency(selectedEmployee.transport_allowance)} icon={MapPin} />
                      <InfoField label="بدل طعام" value={formatCurrency(selectedEmployee.food_allowance)} icon={DollarSign} />
                      <InfoField label="بدلات أخرى" value={formatCurrency(selectedEmployee.other_allowances)} icon={DollarSign} />
                      <InfoField label="خصم GOSI" value={formatCurrency(selectedEmployee.gosi_deduction)} icon={Shield} iconColor="text-danger" />
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-l from-gold/10 to-transparent border border-gold/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">إجمالي الراتب الشهري</span>
                        <span className="text-xl font-bold font-mono text-gold">{formatCurrency(selectedEmployee.total_salary)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoField label="البنك" value={selectedEmployee.bank_name} icon={Briefcase} />
                      <InfoField label="IBAN" value={selectedEmployee.iban} icon={CreditCard} mono dir="ltr" />
                    </div>
                  </div>
                )}

                {profileTab === 'government' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <InfoField label="رقم الإقامة" value={selectedEmployee.government.iqama_number} icon={CreditCard} mono dir="ltr" />
                      <InfoField label="انتهاء الإقامة" value={formatDate(selectedEmployee.government.iqama_expiry)} icon={Calendar}
                        iconColor={selectedEmployee.government.iqama_status === 'valid' ? 'text-success' : 'text-danger'} />
                      <InfoField label="حالة الإقامة" value={selectedEmployee.government.iqama_status === 'valid' ? 'سارية' : 'منتهية'} icon={ShieldCheck}
                        iconColor={selectedEmployee.government.iqama_status === 'valid' ? 'text-success' : 'text-danger'} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {[
                        { name: 'أبشر', status: selectedEmployee.government.absher_status, ok: selectedEmployee.government.absher_status === 'verified' },
                        { name: 'GOSI', status: selectedEmployee.government.gosi_status, ok: selectedEmployee.government.gosi_status === 'registered' },
                        { name: 'قوى', status: selectedEmployee.government.qiwa_contract_status, ok: selectedEmployee.government.qiwa_contract_status === 'active' },
                        { name: 'مقيم', status: selectedEmployee.government.muqeem_status, ok: selectedEmployee.government.muqeem_status === 'valid' },
                        { name: 'WPS', status: selectedEmployee.government.wps_status, ok: selectedEmployee.government.wps_status === 'active' },
                      ].map(g => (
                        <div key={g.name} className={cn('p-2.5 rounded-lg border text-center', g.ok ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20')}>
                          <p className="text-[10px] font-bold text-foreground">{g.name}</p>
                          <p className={cn('text-[9px] mt-0.5', g.ok ? 'text-success' : 'text-danger')}>{g.status}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoField label="رقم عقد قوى" value={selectedEmployee.government.qiwa_contract_id} icon={FileText} mono dir="ltr" />
                      <InfoField label="اشتراك GOSI الشهري" value={formatCurrency(selectedEmployee.government.gosi_subscription)} icon={DollarSign} />
                    </div>
                    <div className="p-3 rounded-xl bg-gold/5 border border-gold/20">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-gold" />
                        <span className="text-xs font-bold text-foreground">تصنيف نطاقات:</span>
                        <span className="text-xs text-gold font-bold">{selectedEmployee.government.nitaqat_category.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {profileTab === 'performance' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <MetricBox label="النتيجة الكلية" value={`${selectedEmployee.performance_score}%`}
                        color={selectedEmployee.performance_score >= 80 ? 'success' : 'warning'} size="lg" />
                      <MetricBox label="التقييم" value={performanceRatingLabels[selectedEmployee.performance_rating]}
                        color="gold" size="lg" />
                      <MetricBox label="الحضور" value={`${selectedEmployee.attendance_rate}%`} color="info" size="lg" />
                      <MetricBox label="جاهزية الترقية" value={`${selectedEmployee.ai_promotion_readiness}%`} color="emerald-500" size="lg" />
                    </div>
                    <div className="p-3 rounded-xl bg-surface2/30 border border-border/20">
                      <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                        <Brain size={12} className="text-gold" /> احتياجات تدريبية (AI)
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedEmployee.ai_training_needs.map((need, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">{need}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-surface2/30 border border-border/20">
                      <h4 className="text-xs font-bold text-foreground mb-2">آخر مراجعة: {selectedEmployee.last_review_date ? formatDate(selectedEmployee.last_review_date) : 'لم تتم'}</h4>
                      <MiniProgress value={selectedEmployee.performance_score} color={selectedEmployee.performance_score >= 80 ? 'success' : 'warning'} size="lg" label="النتيجة الكلية" />
                    </div>
                  </div>
                )}

                {profileTab === 'documents' && (
                  <div className="space-y-3">
                    {empDocuments.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-8">لا توجد مستندات مرفقة</p>
                    ) : (
                      empDocuments.map(doc => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface2/30 border border-border/20 hover:border-gold/15 transition-all">
                          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                            <FileText size={16} className="text-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{doc.title}</p>
                            <p className="text-[9px] text-muted-foreground">{documentTypeLabels[doc.type]} • {doc.file_size}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={cn('text-[9px] px-2 py-0.5 rounded-full',
                              doc.status === 'valid' ? 'bg-success/10 text-success' : doc.status === 'expired' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning')}>
                              {doc.status === 'valid' ? 'ساري' : doc.status === 'expired' ? 'منتهي' : 'قريب الانتهاء'}
                            </span>
                            <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground">
                              <Download size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {profileTab === 'ai' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <MetricBox label="خطر المغادرة" value={`${selectedEmployee.ai_risk_score}%`}
                        color={selectedEmployee.ai_risk_score > 30 ? 'danger' : 'success'} size="lg" />
                      <MetricBox label="جاهزية الترقية" value={`${selectedEmployee.ai_promotion_readiness}%`} color="gold" size="lg" />
                      <MetricBox label="المشاعر" value={selectedEmployee.ai_sentiment === 'positive' ? 'إيجابي' : selectedEmployee.ai_sentiment === 'neutral' ? 'محايد' : 'سلبي'}
                        color={selectedEmployee.ai_sentiment === 'positive' ? 'success' : selectedEmployee.ai_sentiment === 'negative' ? 'danger' : 'warning'} size="lg" />
                      <MetricBox label="الأداء" value={`${selectedEmployee.performance_score}%`} color="info" size="lg" />
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-l from-gold/5 to-purple-500/5 border border-gold/20">
                      <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                        <Brain size={14} className="text-gold" /> توصيات الذكاء الاصطناعي
                      </h4>
                      <div className="space-y-2">
                        {selectedEmployee.ai_training_needs.map((need, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                            <p className="text-xs text-muted-foreground">يحتاج تطوير في: <span className="text-foreground font-medium">{need}</span></p>
                          </div>
                        ))}
                        {selectedEmployee.ai_promotion_readiness >= 70 && (
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              <span className="text-success font-medium">جاهز للترقية</span> — نسبة الجاهزية {selectedEmployee.ai_promotion_readiness}%
                            </p>
                          </div>
                        )}
                        {selectedEmployee.ai_risk_score > 20 && (
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              <span className="text-danger font-medium">تنبيه مغادرة</span> — يُنصح بمراجعة الرضا الوظيفي والحوافز
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Footer */}
              <div className="p-4 border-t border-border/20 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[9px] text-muted-foreground">آخر تحديث: {formatDate(selectedEmployee.updated_at)}</span>
                <div className="flex items-center gap-2">
                  <ActionButton label="تعديل" icon={Edit} variant="default" size="sm" onClick={() => { setSelectedEmployee(null); onEdit(selectedEmployee) }} />
                  <ActionButton label="طباعة الملف" icon={Printer} variant="default" size="sm" onClick={() => {}} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
