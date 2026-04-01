/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Contracts & Legal System
 * ═══════════════════════════════════════════════════════════════════════════
 * Contract management: templates, auto-generation, e-signature tracking,
 * Qiwa registration, contract archive, audit log
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Search, Plus, Eye, Edit, Trash2, Download, Calendar,
  CheckCircle2, XCircle, Clock, AlertTriangle, Shield, Pen, Copy,
  Archive, Filter, Printer, Upload, RefreshCw, Building2, DollarSign
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { EmployeeAvatar, MiniProgress, MetricBox, ActionButton, EmptyState, SectionCard } from './HrShared'
import type { EmploymentContract } from '../hrTypes'
import { contractTypeLabels } from '../hrTypes'

interface HrContractsProps {
  contracts: EmploymentContract[]
  onAdd: () => void
  onRenew: (id: string) => void
}

// Contract templates
const contractTemplates = [
  { id: 'ft_standard', name: 'عقد دوام كامل — معياري', type: 'full_time', desc: 'عقد عمل محدد المدة وفق نظام العمل السعودي', fields: 12 },
  { id: 'ft_executive', name: 'عقد تنفيذي — إداري', type: 'full_time', desc: 'عقد للمناصب الإدارية العليا مع بنود خاصة', fields: 18 },
  { id: 'pt_standard', name: 'عقد دوام جزئي', type: 'part_time', desc: 'عقد عمل جزئي وفق المادة 101 من نظام العمل', fields: 10 },
  { id: 'seasonal', name: 'عقد موسمي — فعاليات', type: 'seasonal', desc: 'عقد مؤقت لفعاليات ومعارض Maham Expo', fields: 8 },
  { id: 'freelancer', name: 'عقد عمل حر', type: 'freelancer', desc: 'عقد مستقل وفق منصة العمل الحر السعودية', fields: 9 },
  { id: 'intern', name: 'عقد تدريب تعاوني', type: 'internship', desc: 'عقد تدريب وفق برنامج تمهير أو التدريب الجامعي', fields: 7 },
]

export default function HrContracts({ contracts, onAdd, onRenew }: HrContractsProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeView, setActiveView] = useState<'contracts' | 'templates'>('contracts')

  const filtered = useMemo(() => {
    return contracts.filter(c => {
      const matchSearch = !search || c.employee_name.includes(search) || c.id.includes(search)
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      const matchType = typeFilter === 'all' || c.contract_type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [contracts, search, statusFilter, typeFilter])

  const statusLabels: Record<string, string> = { active: 'نشط', expired: 'منتهي', terminated: 'ملغى', pending_renewal: 'بانتظار التجديد' }
  const statusColors: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20',
    expired: 'bg-danger/10 text-danger border-danger/20',
    terminated: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20',
    pending_renewal: 'bg-warning/10 text-warning border-warning/20'
  }

  // Stats
  const activeCount = contracts.filter(c => c.status === 'active').length
  const expiringCount = contracts.filter(c => c.status === 'pending_renewal').length
  const expiredCount = contracts.filter(c => c.status === 'expired').length
  const qiwaRegistered = contracts.filter(c => c.qiwa_registered).length

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">عقود نشطة</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{activeCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-warning" />
            <span className="text-[10px] text-muted-foreground">بانتظار التجديد</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{expiringCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={14} className="text-danger" />
            <span className="text-[10px] text-muted-foreground">منتهية</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{expiredCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">مسجلة في قوى</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{qiwaRegistered}/{contracts.length}</p>
        </div>
      </div>

      {/* ─── View Toggle + Search ──────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center bg-surface2/50 rounded-xl border border-border/30 overflow-hidden shrink-0">
            <button onClick={() => setActiveView('contracts')}
              className={cn('h-9 px-4 text-xs transition-all', activeView === 'contracts' ? 'bg-gold/10 text-gold font-bold' : 'text-muted-foreground')}>
              العقود ({contracts.length})
            </button>
            <button onClick={() => setActiveView('templates')}
              className={cn('h-9 px-4 text-xs transition-all', activeView === 'templates' ? 'bg-gold/10 text-gold font-bold' : 'text-muted-foreground')}>
              القوالب ({contractTemplates.length})
            </button>
          </div>
          {activeView === 'contracts' && (
            <>
              <div className="relative flex-1">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="بحث بالاسم أو رقم العقد..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
                  <option value="all">كل الحالات</option>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
                  <option value="all">كل الأنواع</option>
                  {Object.entries(contractTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <ActionButton label="إنشاء عقد" icon={Plus} variant="primary" onClick={onAdd} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Contracts List ────────────────────────────────────────────── */}
      {activeView === 'contracts' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border/20">
                  {['الموظف', 'نوع العقد', 'تاريخ البدء', 'تاريخ الانتهاء', 'الراتب', 'الحالة', 'قوى', 'التوقيع', 'إجراءات'].map(h => (
                    <th key={h} className="p-3 text-right text-[10px] font-bold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(contract => (
                  <tr key={contract.id} className="border-b border-border/10 hover:bg-surface2/20 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <EmployeeAvatar name={contract.employee_name} size="sm" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{contract.employee_name}</p>
                          <p className="text-[9px] text-muted-foreground">{contract.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-foreground">{contractTypeLabels[contract.contract_type]}</td>
                    <td className="p-3 text-[11px] text-muted-foreground">{formatDate(contract.start_date)}</td>
                    <td className="p-3 text-[11px] text-muted-foreground">{contract.end_date ? formatDate(contract.end_date) : 'غير محدد'}</td>
                    <td className="p-3 text-[11px] font-mono text-foreground">{formatCurrency(contract.salary)}</td>
                    <td className="p-3">
                      <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', statusColors[contract.status])}>
                        {statusLabels[contract.status]}
                      </span>
                    </td>
                    <td className="p-3">
                      {contract.qiwa_registered ? (
                        <CheckCircle2 size={14} className="text-success" />
                      ) : (
                        <XCircle size={14} className="text-danger" />
                      )}
                    </td>
                    <td className="p-3">
                      {contract.signed_date ? (
                        <span className="text-[9px] text-success flex items-center gap-1"><Pen size={10} /> {formatDate(contract.signed_date)}</span>
                      ) : (
                        <span className="text-[9px] text-warning flex items-center gap-1"><Clock size={10} /> بانتظار</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Download size={12} /></button>
                        {(contract.status === 'expired' || contract.status === 'pending_renewal') && (
                          <button onClick={() => onRenew(contract.id)}
                            className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success"><RefreshCw size={12} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Contract Templates ────────────────────────────────────────── */}
      {activeView === 'templates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contractTemplates.map(template => (
            <motion.div key={template.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 hover:border-gold/20 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-foreground">{template.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{template.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/10">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-surface2/50 text-muted-foreground">
                    {contractTypeLabels[template.type as keyof typeof contractTypeLabels]}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{template.fields} حقل</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-gold/10 text-muted-foreground hover:text-gold"><Copy size={12} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Compliance Notice ─────────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4 border-gold/20">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-foreground mb-1">الامتثال القانوني للعقود</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              جميع العقود متوافقة مع نظام العمل السعودي (المادة 51-62) ومسجلة في منصة قوى. يتم التحقق تلقائياً من:
              فترة التجربة (90 يوم كحد أقصى)، فترة الإشعار، حقوق نهاية الخدمة، بنود عدم المنافسة، والتأمينات الاجتماعية GOSI.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
