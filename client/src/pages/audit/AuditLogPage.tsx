import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  History, Filter, Search, User, Calendar, Clock, Shield,
  Eye, Download, FileText, Activity
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable, { Column } from '@/components/shared/DataTable'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AuditEntry {
  id: number
  user: string
  action: string
  module: string
  details: string
  ip: string
  timestamp: string
}

export default function AuditLogPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const columns: Column<AuditEntry>[] = [
    {
      key: 'timestamp',
      label: 'الوقت',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">{val}</span>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'المستخدم',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-[10px] font-bold">{val?.charAt(0)}</div>
          <span className="text-sm text-foreground">{val}</span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'الإجراء',
      render: (val) => {
        const colors: Record<string, string> = {
          'إنشاء': 'bg-success/15 text-success',
          'تعديل': 'bg-info/15 text-info',
          'حذف': 'bg-danger/15 text-danger',
          'تسجيل دخول': 'bg-gold/15 text-gold',
          'تصدير': 'bg-chrome/15 text-chrome',
        }
        return <span className={cn('text-[10px] px-2 py-0.5 rounded-full', colors[val] || 'bg-surface2 text-muted-foreground')}>{val}</span>
      },
    },
    { key: 'module', label: 'القسم' },
    { key: 'details', label: 'التفاصيل' },
    {
      key: 'ip',
      label: 'IP',
      render: (val) => <span className="font-mono text-[11px] text-muted-foreground">{val}</span>,
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="سجل التدقيق"
        subtitle="تتبع جميع العمليات والإجراءات في النظام"
        actions={
          <button onClick={() => toast.info('تصدير السجل — قريباً')} className="h-9 px-4 rounded-xl bg-surface2/50 border border-border/30 text-sm font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-2">
            <Download size={16} />
            تصدير
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={[]}
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="بحث في سجل التدقيق..."
        currentPage={page}
        totalPages={1}
        onPageChange={setPage}
        emptyMessage="لا توجد سجلات حالياً"
      />
    </AdminLayout>
  )
}
