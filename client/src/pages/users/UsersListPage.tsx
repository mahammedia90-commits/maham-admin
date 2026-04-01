import { useState } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Users, Plus, Eye, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable, { Column } from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, roleLabels } from '@/lib/utils'
import { toast } from 'sonner'

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
  created_at: string
}

export default function UsersListPage() {
  const [, navigate] = useLocation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'المستخدم',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
            {row.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Mail size={10} /> {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'الجوال',
      render: (val) => <span className="font-mono text-xs text-muted-foreground" dir="ltr">{val}</span>,
    },
    {
      key: 'role',
      label: 'الدور',
      render: (val) => (
        <span className="flex items-center gap-1 text-xs">
          <Shield size={12} className="text-gold" />
          {roleLabels[val] || val}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: 'إجراءات',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/users/${row.id}`)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Edit size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة المستخدمين"
        subtitle="عرض وإدارة جميع مستخدمي النظام"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/users/roles')}
              className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all flex items-center gap-2"
            >
              <Shield size={14} />
              الأدوار والصلاحيات
            </button>
            <button
              onClick={() => toast.info('نموذج إضافة مستخدم — قريباً')}
              className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة مستخدم
            </button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={[]}
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="بحث بالاسم أو البريد أو الجوال..."
        currentPage={page}
        totalPages={1}
        onPageChange={setPage}
        emptyMessage="لا يوجد مستخدمون حالياً"
      />
    </AdminLayout>
  )
}
