import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Check, X, Eye, Clock, Filter, CheckCheck } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable, { Column } from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate } from '@/lib/utils'
import { requestsApi } from '@/api'
import { toast } from 'sonner'

interface Request {
  id: number
  type: string
  requester: string
  event: string
  status: string
  created_at: string
  priority: string
}

export default function RequestsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')

  const columns: Column<Request>[] = [
    {
      key: 'id',
      label: '#',
      render: (val) => <span className="font-mono text-xs text-muted-foreground">#{val}</span>,
    },
    {
      key: 'type',
      label: 'نوع الطلب',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-gold" />
          <span className="text-sm">{row.type}</span>
        </div>
      ),
    },
    {
      key: 'requester',
      label: 'مقدم الطلب',
      sortable: true,
    },
    {
      key: 'event',
      label: 'الفعالية',
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (val) => (
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full font-medium',
          val === 'high' && 'bg-danger/15 text-danger',
          val === 'medium' && 'bg-warning/15 text-warning',
          val === 'low' && 'bg-info/15 text-info',
        )}>
          {val === 'high' ? 'عالية' : val === 'medium' ? 'متوسطة' : 'منخفضة'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'created_at',
      label: 'التاريخ',
      sortable: true,
      render: (val) => <span className="text-xs text-muted-foreground">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: 'إجراءات',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors" title="عرض">
            <Eye size={14} />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => toast.success('تم قبول الطلب')}
                className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"
                title="قبول"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => toast.error('تم رفض الطلب')}
                className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                title="رفض"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  const filters = [
    { key: 'all', label: 'الكل' },
    { key: 'pending', label: 'معلق' },
    { key: 'approved', label: 'موافق' },
    { key: 'rejected', label: 'مرفوض' },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة الطلبات"
        subtitle="مراجعة والتعامل مع طلبات الحجز والمشاركة"
        actions={
          <button
            onClick={() => toast.info('تم تحديث قائمة الطلبات')}
            className="h-9 px-4 rounded-xl border border-gold/20 text-sm font-medium text-gold hover:bg-gold/10 transition-all flex items-center gap-2"
          >
            <CheckCheck size={16} />
            موافقة جماعية
          </button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'h-8 px-3 rounded-lg text-xs font-medium transition-all',
              filter === f.key
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={[]}
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="بحث في الطلبات..."
        currentPage={page}
        totalPages={1}
        onPageChange={setPage}
        emptyMessage="لا توجد طلبات حالياً"
      />
    </AdminLayout>
  )
}
