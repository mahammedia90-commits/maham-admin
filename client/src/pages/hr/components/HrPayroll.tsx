/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Payroll System
 * ═══════════════════════════════════════════════════════════════════════════
 * Payroll management: salary structure, allowances, deductions, bonuses,
 * WPS integration, GOSI, payslips, batch processing
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Search, Download, Printer, CheckCircle2, Clock, XCircle,
  AlertTriangle, CreditCard, Building2, TrendingUp, TrendingDown,
  BarChart3, Filter, Eye, Send, Shield, Calendar, FileText, RefreshCw
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { EmployeeAvatar, MiniProgress, MetricBox, ActionButton, SectionCard } from './HrShared'
import type { PayrollRecord } from '../hrTypes'
import { payrollStatusLabels } from '../hrTypes'

interface HrPayrollProps {
  payroll: PayrollRecord[]
  onProcess: () => void
  onApprove: (id: string) => void
}

export default function HrPayroll({ payroll, onProcess, onApprove }: HrPayrollProps) {
  const [search, setSearch] = useState('')
  const [monthFilter, setMonthFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)

  const months = useMemo(() => {
    const m = new Set(payroll.map(p => p.month))
    return Array.from(m).sort().reverse()
  }, [payroll])

  const filtered = useMemo(() => {
    return payroll.filter(p => {
      const matchSearch = !search || p.employee_name.includes(search) || p.department.includes(search)
      const matchMonth = monthFilter === 'all' || p.month === monthFilter
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      return matchSearch && matchMonth && matchStatus
    })
  }, [payroll, search, monthFilter, statusFilter])

  // Stats
  const totalGross = filtered.reduce((s, p) => s + p.gross_salary, 0)
  const totalNet = filtered.reduce((s, p) => s + p.net_salary, 0)
  const totalDeductions = filtered.reduce((s, p) => s + p.total_deductions, 0)
  const totalGosi = filtered.reduce((s, p) => s + p.gosi_employee + p.gosi_employer, 0)
  const paidCount = filtered.filter(p => p.status === 'paid').length
  const pendingCount = filtered.filter(p => p.status !== 'paid').length

  const statusColors: Record<string, string> = {
    draft: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20',
    processing: 'bg-info/10 text-info border-info/20',
    approved: 'bg-gold/10 text-gold border-gold/20',
    paid: 'bg-success/10 text-success border-success/20',
    failed: 'bg-danger/10 text-danger border-danger/20'
  }

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">إجمالي الرواتب</span>
          </div>
          <p className="text-sm font-bold font-mono text-foreground">{formatCurrency(totalGross)}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">صافي المدفوع</span>
          </div>
          <p className="text-sm font-bold font-mono text-foreground">{formatCurrency(totalNet)}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-danger" />
            <span className="text-[10px] text-muted-foreground">إجمالي الخصومات</span>
          </div>
          <p className="text-sm font-bold font-mono text-foreground">{formatCurrency(totalDeductions)}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-info" />
            <span className="text-[10px] text-muted-foreground">GOSI الكلي</span>
          </div>
          <p className="text-sm font-bold font-mono text-foreground">{formatCurrency(totalGosi)}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">مدفوع</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{paidCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-warning" />
            <span className="text-[10px] text-muted-foreground">معلق</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{pendingCount}</p>
        </div>
      </div>

      {/* ─── Search & Filters ──────────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="بحث بالاسم أو القسم..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الأشهر</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الحالات</option>
              {Object.entries(payrollStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <ActionButton label="معالجة الرواتب" icon={RefreshCw} variant="primary" onClick={onProcess} />
          </div>
        </div>
      </div>

      {/* ─── Payroll Table ─────────────────────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-border/20">
                {['الموظف', 'القسم', 'الشهر', 'الأساسي', 'البدلات', 'الإجمالي', 'الخصومات', 'الصافي', 'الحالة', 'WPS', 'إجراءات'].map(h => (
                  <th key={h} className="p-3 text-right text-[10px] font-bold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => {
                const totalAllowances = record.housing + record.transport + record.food + record.other_allowances
                return (
                  <tr key={record.id} className="border-b border-border/10 hover:bg-surface2/20 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <EmployeeAvatar name={record.employee_name} size="sm" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{record.employee_name}</p>
                          <p className="text-[9px] text-muted-foreground">{record.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-muted-foreground">{record.department}</td>
                    <td className="p-3 text-[11px] text-muted-foreground">{record.month}</td>
                    <td className="p-3 text-[11px] font-mono text-foreground">{formatCurrency(record.basic_salary)}</td>
                    <td className="p-3 text-[11px] font-mono text-success">{formatCurrency(totalAllowances)}</td>
                    <td className="p-3 text-[11px] font-mono font-bold text-foreground">{formatCurrency(record.gross_salary)}</td>
                    <td className="p-3 text-[11px] font-mono text-danger">{formatCurrency(record.total_deductions)}</td>
                    <td className="p-3">
                      <span className="text-xs font-bold font-mono text-gold">{formatCurrency(record.net_salary)}</span>
                    </td>
                    <td className="p-3">
                      <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', statusColors[record.status])}>
                        {payrollStatusLabels[record.status]}
                      </span>
                    </td>
                    <td className="p-3">
                      {record.wps_reference ? (
                        <span className="text-[9px] text-success flex items-center gap-1"><CheckCircle2 size={10} /> مرسل</span>
                      ) : (
                        <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> معلق</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedRecord(record)}
                          className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                        {record.status === 'approved' && (
                          <button className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success"><Send size={12} /></button>
                        )}
                        {record.status === 'draft' && (
                          <button onClick={() => onApprove(record.id)}
                            className="p-1.5 rounded-lg hover:bg-gold/10 text-muted-foreground hover:text-gold"><CheckCircle2 size={12} /></button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Download size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Payslip Detail Modal ──────────────────────────────────────── */}
      {selectedRecord && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedRecord(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="w-full max-w-lg glass-card" onClick={e => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={selectedRecord.employee_name} size="lg" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{selectedRecord.employee_name}</h3>
                    <p className="text-[10px] text-muted-foreground">{selectedRecord.department} • {selectedRecord.month}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="p-2 rounded-xl hover:bg-surface2 text-muted-foreground">
                  <XCircle size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Earnings */}
              <div>
                <h4 className="text-xs font-bold text-success mb-2">المستحقات</h4>
                <div className="space-y-1.5">
                  {[
                    { label: 'الراتب الأساسي', value: selectedRecord.basic_salary },
                    { label: 'بدل سكن', value: selectedRecord.housing },
                    { label: 'بدل نقل', value: selectedRecord.transport },
                    { label: 'بدل طعام', value: selectedRecord.food },
                    { label: 'بدلات أخرى', value: selectedRecord.other_allowances },
                    { label: 'أجر إضافي', value: selectedRecord.overtime_pay },
                    { label: 'مكافأة', value: selectedRecord.bonus },
                  ].filter(i => i.value > 0).map(item => (
                    <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-success/5">
                      <span className="text-[11px] text-muted-foreground">{item.label}</span>
                      <span className="text-[11px] font-mono text-success">+{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-success/10 border border-success/20">
                    <span className="text-xs font-bold text-foreground">إجمالي المستحقات</span>
                    <span className="text-xs font-bold font-mono text-success">{formatCurrency(selectedRecord.gross_salary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="text-xs font-bold text-danger mb-2">الخصومات</h4>
                <div className="space-y-1.5">
                  {[
                    { label: 'GOSI (موظف)', value: selectedRecord.gosi_employee },
                    { label: 'GOSI (صاحب عمل)', value: selectedRecord.gosi_employer },
                    { label: 'خصم غياب', value: selectedRecord.absence_deduction },
                    { label: 'خصم سلفة', value: selectedRecord.loan_deduction },
                    { label: 'خصومات أخرى', value: selectedRecord.other_deductions },
                  ].filter(i => i.value > 0).map(item => (
                    <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-danger/5">
                      <span className="text-[11px] text-muted-foreground">{item.label}</span>
                      <span className="text-[11px] font-mono text-danger">-{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-danger/10 border border-danger/20">
                    <span className="text-xs font-bold text-foreground">إجمالي الخصومات</span>
                    <span className="text-xs font-bold font-mono text-danger">{formatCurrency(selectedRecord.total_deductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="p-4 rounded-xl bg-gradient-to-l from-gold/10 to-transparent border border-gold/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">صافي الراتب</span>
                  <span className="text-xl font-bold font-mono text-gold">{formatCurrency(selectedRecord.net_salary)}</span>
                </div>
              </div>

              {/* WPS Info */}
              {selectedRecord.wps_reference && (
                <div className="p-3 rounded-xl bg-surface2/30 border border-border/20">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-success" />
                    <span className="text-[10px] text-muted-foreground">مرجع WPS:</span>
                    <span className="text-[10px] font-mono text-foreground">{selectedRecord.wps_reference}</span>
                  </div>
                  {selectedRecord.paid_date && (
                    <p className="text-[9px] text-muted-foreground mt-1 mr-6">تاريخ الدفع: {formatDate(selectedRecord.paid_date)}</p>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border/20 flex items-center justify-end gap-2">
              <ActionButton label="طباعة" icon={Printer} variant="default" size="sm" onClick={() => {}} />
              <ActionButton label="تحميل PDF" icon={Download} variant="default" size="sm" onClick={() => {}} />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ─── WPS Compliance Notice ─────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4 border-gold/20">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-foreground mb-1">نظام حماية الأجور (WPS)</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              جميع الرواتب يتم تحويلها عبر نظام حماية الأجور WPS التابع لوزارة الموارد البشرية. يتم احتساب خصم GOSI تلقائياً
              (9.75% موظف + 12% صاحب عمل للسعوديين، 2% موظف + 2% صاحب عمل لغير السعوديين). التحويلات تتم قبل اليوم العاشر من كل شهر ميلادي.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
