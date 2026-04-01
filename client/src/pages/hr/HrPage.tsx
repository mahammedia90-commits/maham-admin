import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, UserCheck, Calendar, Clock, DollarSign, Award,
  Briefcase, TrendingUp, Plus, Eye, FileText, Building2
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable, { Column } from '@/components/shared/DataTable'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface Employee {
  id: number
  name: string
  department: string
  position: string
  status: string
  join_date: string
  salary: number
}

const departments = [
  { name: 'التقنية', count: 12, head: 'أحمد محمد', color: 'bg-gold/10 border-gold/20' },
  { name: 'التسويق', count: 8, head: 'سارة العلي', color: 'bg-info/10 border-info/20' },
  { name: 'المبيعات', count: 10, head: 'خالد الحربي', color: 'bg-success/10 border-success/20' },
  { name: 'العمليات', count: 15, head: 'فاطمة أحمد', color: 'bg-chrome/10 border-chrome/20' },
  { name: 'المالية', count: 6, head: 'محمد العتيبي', color: 'bg-warning/10 border-warning/20' },
  { name: 'الموارد البشرية', count: 4, head: 'نورة السعيد', color: 'bg-gold/10 border-gold/20' },
]

const leaveRequests = [
  { id: 1, employee: 'أحمد محمد', type: 'إجازة سنوية', from: '2026-04-10', to: '2026-04-15', status: 'pending', days: 5 },
  { id: 2, employee: 'سارة العلي', type: 'إجازة مرضية', from: '2026-04-01', to: '2026-04-03', status: 'approved', days: 3 },
  { id: 3, employee: 'خالد الحربي', type: 'إجازة طارئة', from: '2026-04-05', to: '2026-04-05', status: 'approved', days: 1 },
]

export default function HrPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<'employees' | 'departments' | 'leaves' | 'payroll'>('employees')

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      label: 'الموظف',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
            {row.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-[11px] text-muted-foreground">{row.position}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'القسم' },
    {
      key: 'status',
      label: 'الحالة',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'salary',
      label: 'الراتب',
      sortable: true,
      render: (val) => <span className="font-mono text-gold">{formatCurrency(val)}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
      ),
    },
  ]

  const tabs = [
    { key: 'employees', label: 'الموظفون', icon: Users },
    { key: 'departments', label: 'الأقسام', icon: Building2 },
    { key: 'leaves', label: 'الإجازات', icon: Calendar },
    { key: 'payroll', label: 'الرواتب', icon: DollarSign },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="الموارد البشرية"
        subtitle="إدارة الموظفين والأقسام والإجازات والرواتب"
        actions={
          <button onClick={() => toast.info('إضافة موظف — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            إضافة موظف
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الموظفين" value="55" icon={Users} trend={3} trendLabel="هذا الشهر" delay={0} />
        <StatsCard title="الحضور اليوم" value="48" icon={UserCheck} trend={0} trendLabel="87% حضور" delay={0.1} />
        <StatsCard title="إجازات معلقة" value="5" icon={Calendar} trend={-2} trendLabel="أقل" delay={0.2} />
        <StatsCard title="مسير الرواتب" value={formatCurrency(825000)} icon={DollarSign} trend={0} trendLabel="هذا الشهر" delay={0.3} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', tab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'employees' && (
        <DataTable columns={columns} data={[]} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في الموظفين..." currentPage={page} totalPages={1} onPageChange={setPage} emptyMessage="لا يوجد موظفون حالياً" />
      )}

      {tab === 'departments' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <motion.div key={dept.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn('glass-card p-5 border', dept.color)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Building2 size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{dept.name}</h3>
                  <p className="text-[11px] text-muted-foreground">رئيس القسم: {dept.head}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Users size={12} /> {dept.count} موظف</span>
                <button className="text-xs text-gold hover:text-gold-light transition-colors">عرض التفاصيل</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'leaves' && (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-border/30">
            {leaveRequests.map((req, i) => (
              <motion.div key={req.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-4 hover:bg-surface2/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">{req.employee.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.employee}</p>
                      <p className="text-[11px] text-muted-foreground">{req.type} — {req.days} أيام</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{req.from} → {req.to}</span>
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab === 'payroll' && (
        <div className="glass-card p-8 text-center">
          <DollarSign size={40} className="text-gold/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground mb-1">مسير الرواتب</h3>
          <p className="text-xs text-muted-foreground">سيتم عرض بيانات الرواتب عند الاتصال بالخادم</p>
        </div>
      )}
    </AdminLayout>
  )
}
