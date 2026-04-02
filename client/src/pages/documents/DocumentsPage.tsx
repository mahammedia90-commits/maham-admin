import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderOpen, Upload, Eye, Download, Trash2, CheckCircle, XCircle,
  Clock, FileText, Image as ImageIcon, File, Filter, Search,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft,
  ChevronsRight, X, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { PageSkeleton, Skeleton } from '@/components/shared/SkeletonLoader'
import EmptyState from '@/components/shared/EmptyState'
import { documentsApi } from '@/api'
import { cn, formatDate } from '@/lib/utils'

const DOC_TYPE_OPTIONS = [
  { value: 'contract', label: 'عقد' },
  { value: 'invoice', label: 'فاتورة' },
  { value: 'kyc', label: 'KYC' },
  { value: 'license', label: 'رخصة' },
  { value: 'certificate', label: 'شهادة' },
  { value: 'report', label: 'تقرير' },
  { value: 'other', label: 'أخرى' },
]

const USER_TYPE_OPTIONS = [
  { value: 'investor', label: 'مستثمر' },
  { value: 'merchant', label: 'تاجر' },
  { value: 'sponsor', label: 'راعي' },
  { value: 'staff', label: 'موظف' },
]

const STATUS_OPTIONS = [
  { value: 'approved', label: 'مقبول' },
  { value: 'pending', label: 'معلق' },
  { value: 'rejected', label: 'مرفوض' },
]

export default function DocumentsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [previewDoc, setPreviewDoc] = useState<any>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents', page, search, filters, sortKey, sortDir],
    queryFn: () => documentsApi.list({ page, search, ...filters, sort: sortKey, direction: sortDir }),
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['documents-stats'],
    queryFn: () => documentsApi.stats(),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: number; status: string; reason?: string }) =>
      documentsApi.updateStatus(id, { status, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['documents-stats'] })
      toast.success('تم تحديث حالة المستند')
    },
    onError: () => toast.error('فشل تحديث الحالة'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('تم حذف المستند')
    },
    onError: () => toast.error('فشل حذف المستند'),
  })

  const handleExport = () => {
    documentsApi.export(filters).then(blob => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'documents-export.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
    }).catch(() => toast.error('فشل التصدير'))
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const documents = data?.data || []
  const totalPages = data?.meta?.last_page || 1
  const totalItems = data?.meta?.total || 0

  const statsData = stats?.data || {}

  const getFileIcon = (type: string) => {
    if (type?.includes('image')) return <ImageIcon size={16} className="text-info" />
    if (type?.includes('pdf')) return <FileText size={16} className="text-danger" />
    return <File size={16} className="text-muted-foreground" />
  }

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'investor': return 'text-[#00d4ff]'
      case 'merchant': return 'text-[#00e5a0]'
      case 'sponsor': return 'text-[#f59e0b]'
      default: return 'text-muted-foreground'
    }
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'investor': return 'مستثمر'
      case 'merchant': return 'تاجر'
      case 'sponsor': return 'راعي'
      case 'staff': return 'موظف'
      default: return type
    }
  }

  if (isLoading && !data) {
    return (
      <AdminLayout>
        <PageSkeleton />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة المستندات"
        subtitle="إدارة مستندات كل المستثمرين والتجار والرعاة"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="h-9 px-4 rounded-lg bg-surface border border-border text-sm text-muted-foreground hover:text-gold hover:border-gold/30 transition-all flex items-center gap-2"
            >
              <Download size={14} />
              تصدير
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="h-9 px-4 rounded-lg bg-gold/10 border border-gold/25 text-sm text-gold hover:bg-gold/20 transition-all flex items-center gap-2"
            >
              <Upload size={14} />
              رفع مستند
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="إجمالي المستندات"
          value={statsData.total || 0}
          icon={FolderOpen}
          delay={0}
        />
        <StatsCard
          title="مقبولة"
          value={statsData.approved || 0}
          icon={CheckCircle}
          delay={0.1}
        />
        <StatsCard
          title="معلقة"
          value={statsData.pending || 0}
          icon={Clock}
          delay={0.2}
        />
        <StatsCard
          title="مرفوضة"
          value={statsData.rejected || 0}
          icon={XCircle}
          delay={0.3}
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="بحث في المستندات..."
            className="w-full h-10 pr-10 pl-4 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
          />
        </div>
        <select
          value={filters.user_type || ''}
          onChange={e => { setFilters(f => ({ ...f, user_type: e.target.value })); setPage(1) }}
          className="h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all cursor-pointer"
        >
          <option value="">نوع المستخدم</option>
          {USER_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={filters.doc_type || ''}
          onChange={e => { setFilters(f => ({ ...f, doc_type: e.target.value })); setPage(1) }}
          className="h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all cursor-pointer"
        >
          <option value="">نوع المستند</option>
          {DOC_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={filters.status || ''}
          onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1) }}
          className="h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all cursor-pointer"
        >
          <option value="">الحالة</option>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Documents Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {[
                  { key: 'name', label: 'اسم المستند', sortable: true },
                  { key: 'doc_type', label: 'النوع', sortable: true },
                  { key: 'user_name', label: 'المستخدم', sortable: true },
                  { key: 'user_type', label: 'الدور', sortable: true },
                  { key: 'status', label: 'الحالة', sortable: true },
                  { key: 'created_at', label: 'التاريخ', sortable: true },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      'px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                      col.sortable && 'cursor-pointer hover:text-gold transition-colors select-none'
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.label}</span>
                      {sortKey === col.key && (
                        sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[160px]">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    {Array.from({ length: 7 }).map((_, ci) => (
                      <td key={ci} className="px-4 py-3"><Skeleton className="h-5 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16">
                    <EmptyState
                      icon={<FolderOpen size={32} className="text-muted-foreground/40" />}
                      title="لا توجد مستندات"
                      description="لم يتم رفع أي مستندات بعد أو لا توجد نتائج مطابقة للبحث"
                    />
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {documents.map((doc: any, idx: number) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.02 }}
                      className="border-b border-border/30 hover:bg-surface/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.mime_type)}
                          <span className="text-foreground font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {DOC_TYPE_OPTIONS.find(o => o.value === doc.doc_type)?.label || doc.doc_type}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{doc.user_name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={getUserTypeColor(doc.user_type)}>
                          {getUserTypeLabel(doc.user_type)}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono text-xs">
                        {doc.created_at ? formatDate(doc.created_at) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"
                            title="معاينة"
                          >
                            <Eye size={14} />
                          </button>
                          {doc.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: doc.id, status: 'approved' })}
                                className="p-1.5 rounded-md hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"
                                title="قبول"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: doc.id, status: 'rejected', reason: 'مرفوض من الإدارة' })}
                                className="p-1.5 rounded-md hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                                title="رفض"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => window.open(doc.url, '_blank')}
                            className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"
                            title="تحميل"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => { if (confirm('هل أنت متأكد من حذف هذا المستند؟')) deleteMutation.mutate(doc.id) }}
                            className="p-1.5 rounded-md hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              عرض {((page - 1) * 15) + 1} - {Math.min(page * 15, totalItems)} من {totalItems}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="p-1.5 rounded-md hover:bg-surface disabled:opacity-30 transition-colors"><ChevronsRight size={14} /></button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md hover:bg-surface disabled:opacity-30 transition-colors"><ChevronRight size={14} /></button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                const p = start + i
                if (p > totalPages) return null
                return (
                  <button key={p} onClick={() => setPage(p)} className={cn('w-8 h-8 rounded-md text-xs font-medium transition-all', page === p ? 'bg-gold/15 text-gold border border-gold/25' : 'hover:bg-surface text-muted-foreground')}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-md hover:bg-surface disabled:opacity-30 transition-colors"><ChevronLeft size={14} /></button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-1.5 rounded-md hover:bg-surface disabled:opacity-30 transition-colors"><ChevronsLeft size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-2xl max-h-[80vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">معاينة المستند</h3>
                <button onClick={() => setPreviewDoc(null)} className="p-2 rounded-lg hover:bg-surface2 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">اسم المستند</p>
                    <p className="text-sm font-medium text-foreground">{previewDoc.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">النوع</p>
                    <p className="text-sm text-foreground">{DOC_TYPE_OPTIONS.find(o => o.value === previewDoc.doc_type)?.label}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المستخدم</p>
                    <p className="text-sm text-foreground">{previewDoc.user_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                    <StatusBadge status={previewDoc.status} />
                  </div>
                </div>
                {previewDoc.mime_type?.includes('image') && previewDoc.url && (
                  <div className="rounded-lg overflow-hidden border border-border/50">
                    <img src={previewDoc.url} alt={previewDoc.name} className="w-full object-contain max-h-96" />
                  </div>
                )}
                {previewDoc.mime_type?.includes('pdf') && previewDoc.url && (
                  <div className="rounded-lg overflow-hidden border border-border/50 h-96">
                    <iframe src={previewDoc.url} className="w-full h-full" title="PDF Preview" />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">رفع مستند جديد</h3>
                <button onClick={() => setShowUpload(false)} className="p-2 rounded-lg hover:bg-surface2 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">اسم المستند</label>
                  <input type="text" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all" placeholder="أدخل اسم المستند" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">نوع المستند</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all">
                    {DOC_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">المستخدم المرتبط</label>
                  <input type="text" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all" placeholder="بحث عن مستخدم..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">الملف</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-gold/30 transition-colors cursor-pointer">
                    <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">اسحب الملف هنا أو انقر للاختيار</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">PDF, صور, Word — حد أقصى 10MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => { toast.info('سيتم الرفع عند ربط الباك إند'); setShowUpload(false) }}
                    className="flex-1 h-10 rounded-lg bg-gold/10 border border-gold/25 text-sm font-medium text-gold hover:bg-gold/20 transition-all"
                  >
                    رفع المستند
                  </button>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="h-10 px-6 rounded-lg bg-surface border border-border text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
