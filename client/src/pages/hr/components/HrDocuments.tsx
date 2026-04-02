/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Document Management System
 * ═══════════════════════════════════════════════════════════════════════════
 * Document vault: upload, classify, verify, OCR, expiry tracking,
 * AI-powered categorization, PDPL compliance
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Search, Upload, Eye, Download, Trash2, Filter,
  CheckCircle2, AlertTriangle, Clock, Calendar, Tag, FolderOpen,
  Shield, Brain, ScanLine, FileCheck, FileLock
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { EmployeeAvatar, MetricBox, ActionButton, EmptyState, SectionCard, SeverityBadge } from './HrShared'
import type { HRDocument } from '../hrTypes'
import { documentTypeLabels } from '../hrTypes'

interface HrDocumentsProps {
  documents: HRDocument[]
  onUpload: () => void
}

export default function HrDocuments({ documents, onUpload }: HrDocumentsProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => {
    return documents.filter(d => {
      const matchSearch = !search || d.title.includes(search) || d.employee_name.includes(search)
      const matchType = typeFilter === 'all' || d.type === typeFilter
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [documents, search, typeFilter, statusFilter])

  // Stats
  const validCount = documents.filter(d => d.status === 'valid').length
  const expiringCount = documents.filter(d => d.status === 'expiring_soon').length
  const expiredCount = documents.filter(d => d.status === 'expired').length
  const pendingCount = documents.filter(d => d.status === 'pending_review').length

  const statusColors: Record<string, string> = {
    valid: 'bg-success/10 text-success border-success/20',
    expiring_soon: 'bg-warning/10 text-warning border-warning/20',
    expired: 'bg-danger/10 text-danger border-danger/20',
    pending_review: 'bg-info/10 text-info border-info/20'
  }
  const statusLabels: Record<string, string> = { valid: 'ساري', expiring_soon: 'قارب الانتهاء', expired: 'منتهي', pending_review: 'قيد المراجعة' }

  const typeIcons: Record<string, any> = {
    id_copy: Shield, passport: FileCheck, contract: FileText, cv: FileText,
    certificate: FileCheck, nda: FileLock, policy: FileText, medical: FileText,
    iqama: Shield, license: FileCheck, other: FolderOpen
  }

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">ساري</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{validCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-warning" />
            <span className="text-[10px] text-muted-foreground">قارب الانتهاء</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{expiringCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-danger" />
            <span className="text-[10px] text-muted-foreground">منتهي</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{expiredCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={14} className="text-info" />
            <span className="text-[10px] text-muted-foreground">قيد المراجعة</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{pendingCount}</p>
        </div>
      </div>

      {/* ─── AI Document Intelligence ──────────────────────────────────── */}
      <SectionCard title="ذكاء المستندات — AI Document Intelligence" icon={Brain}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
            <ScanLine size={16} className="text-gold mb-1" />
            <h5 className="text-[10px] font-bold text-foreground mb-0.5">OCR ذكي</h5>
            <p className="text-[9px] text-muted-foreground">استخراج تلقائي للبيانات من المستندات الممسوحة ضوئياً — الهوية، الإقامة، الجواز</p>
          </div>
          <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
            <Tag size={16} className="text-gold mb-1" />
            <h5 className="text-[10px] font-bold text-foreground mb-0.5">تصنيف تلقائي</h5>
            <p className="text-[9px] text-muted-foreground">تصنيف المستندات تلقائياً حسب النوع والموظف والقسم باستخدام NLP</p>
          </div>
          <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
            <Calendar size={16} className="text-gold mb-1" />
            <h5 className="text-[10px] font-bold text-foreground mb-0.5">تنبيهات الانتهاء</h5>
            <p className="text-[9px] text-muted-foreground">تنبيهات تلقائية قبل 30/60/90 يوم من انتهاء أي مستند حكومي</p>
          </div>
        </div>
      </SectionCard>

      {/* ─── Search & Filters ──────────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="بحث بالعنوان أو الموظف..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الأنواع</option>
              {Object.entries(documentTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الحالات</option>
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <ActionButton label="رفع مستند" icon={Upload} variant="primary" onClick={onUpload} />
          </div>
        </div>
      </div>

      {/* ─── Documents Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(doc => {
          const Icon = typeIcons[doc.type] || FileText
          return (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 sm:p-4 hover:border-gold/20 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-surface2/50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-foreground truncate">{doc.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{doc.employee_name}</p>
                </div>
                <span className={cn('text-[9px] px-2 py-0.5 rounded-full border shrink-0', statusColors[doc.status])}>
                  {statusLabels[doc.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-[9px]">
                  <span className="text-muted-foreground">النوع: </span>
                  <span className="text-foreground">{documentTypeLabels[doc.type]}</span>
                </div>
                <div className="text-[9px]">
                  <span className="text-muted-foreground">الحجم: </span>
                  <span className="text-foreground">{doc.file_size}</span>
                </div>
                <div className="text-[9px]">
                  <span className="text-muted-foreground">تاريخ الرفع: </span>
                  <span className="text-foreground">{formatDate(doc.uploaded_at)}</span>
                </div>
                {doc.expiry_date && (
                  <div className="text-[9px]">
                    <span className="text-muted-foreground">الانتهاء: </span>
                    <span className={doc.status === 'expired' ? 'text-danger' : doc.status === 'expiring_soon' ? 'text-warning' : 'text-foreground'}>
                      {formatDate(doc.expiry_date)}
                    </span>
                  </div>
                )}
              </div>

              {doc.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mb-3">
                  {doc.tags.map(tag => (
                    <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-surface2/50 text-muted-foreground">{tag}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/10">
                <span className="text-[9px] text-muted-foreground">تحقق: {doc.verified_by}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Download size={12} /></button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
