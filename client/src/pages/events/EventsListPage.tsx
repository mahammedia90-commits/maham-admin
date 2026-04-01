import { useState } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Calendar, Plus, Eye, Edit, Trash2, Globe, MapPin, Users, Clock } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable, { Column } from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { eventsApi } from '@/api'
import { formatDate, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface Event {
  id: number
  name: string
  type: string
  status: string
  start_date: string
  end_date: string
  location: string
  capacity: number
  registered: number
  revenue: number
}

export default function EventsListPage() {
  const [, navigate] = useLocation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const columns: Column<Event>[] = [
    {
      key: 'name',
      label: 'اسم الفعالية',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Calendar size={16} className="text-gold" />
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-[11px] text-muted-foreground">{row.type}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'start_date',
      label: 'تاريخ البدء',
      sortable: true,
      render: (val) => (
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock size={12} />
          {formatDate(val)}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'الموقع',
      render: (val) => (
        <span className="flex items-center gap-1 text-muted-foreground">
          <MapPin size={12} />
          {val}
        </span>
      ),
    },
    {
      key: 'capacity',
      label: 'السعة',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-surface3 max-w-[80px]">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${Math.min((row.registered / row.capacity) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{row.registered}/{row.capacity}</span>
        </div>
      ),
    },
    {
      key: 'revenue',
      label: 'الإيرادات',
      sortable: true,
      render: (val) => <span className="font-mono text-gold">{formatCurrency(val)}</span>,
    },
    {
      key: 'actions',
      label: 'إجراءات',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/events/${row.id}`) }}
            className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"
            title="عرض"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/events/${row.id}/edit`) }}
            className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"
            title="تعديل"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toast.info('سيتم حذف الفعالية بعد التأكيد') }}
            className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
            title="حذف"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة الفعاليات"
        subtitle="عرض وإدارة جميع الفعاليات والمعارض"
        actions={
          <button
            onClick={() => navigate('/events/create')}
            className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            إنشاء فعالية
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={[]}
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="بحث في الفعاليات..."
        currentPage={page}
        totalPages={1}
        onPageChange={setPage}
        emptyMessage="لا توجد فعاليات حالياً"
        onRowClick={(row) => navigate(`/events/${row.id}`)}
      />
    </AdminLayout>
  )
}
