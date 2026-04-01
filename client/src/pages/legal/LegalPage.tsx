import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Scale, FileText, Shield, AlertTriangle, CheckCircle, Clock,
  Download, Eye, Plus, Gavel, BookOpen, Lock
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable, { Column } from '@/components/shared/DataTable'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface Contract {
  id: number
  title: string
  party: string
  type: string
  status: string
  start_date: string
  end_date: string
  value: string
}

const complianceItems = [
  { id: 1, name: 'ZATCA — الفوترة الإلكترونية', status: 'compliant', lastCheck: '2026-03-28', icon: Shield },
  { id: 2, name: 'SAMA — مكافحة غسل الأموال', status: 'compliant', lastCheck: '2026-03-25', icon: Lock },
  { id: 3, name: 'NCA — الأمن السيبراني', status: 'warning', lastCheck: '2026-03-20', icon: Shield },
  { id: 4, name: 'IFRS — المعايير المحاسبية', status: 'compliant', lastCheck: '2026-03-15', icon: BookOpen },
  { id: 5, name: 'ISO 27001 — أمن المعلومات', status: 'pending', lastCheck: '—', icon: Shield },
]

export default function LegalPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<'contracts' | 'compliance'>('contracts')

  const columns: Column<Contract>[] = [
    {
      key: 'title',
      label: 'العقد',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <FileText size={16} className="text-gold" />
          </div>
          <div>
            <p className="font-medium text-foreground">{row.title}</p>
            <p className="text-[11px] text-muted-foreground">{row.type}</p>
          </div>
        </div>
      ),
    },
    { key: 'party', label: 'الطرف الآخر', sortable: true },
    {
      key: 'value',
      label: 'القيمة',
      render: (val) => <span className="font-mono text-gold">{val} ر.س</span>,
    },
    {
      key: 'start_date',
      label: 'تاريخ البدء',
      render: (val) => <span className="text-xs text-muted-foreground">{formatDate(val)}</span>,
    },
    {
      key: 'end_date',
      label: 'تاريخ الانتهاء',
      render: (val) => <span className="text-xs text-muted-foreground">{formatDate(val)}</span>,
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Download size={14} /></button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="الشؤون القانونية"
        subtitle="إدارة العقود والامتثال التنظيمي"
        actions={
          <button onClick={() => toast.info('إنشاء عقد — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} />
            عقد جديد
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="العقود النشطة" value="34" icon={FileText} trend={5} trendLabel="هذا الشهر" delay={0} />
        <StatsCard title="قيد التجديد" value="8" icon={Clock} trend={0} trendLabel="هذا الربع" delay={0.1} />
        <StatsCard title="نسبة الامتثال" value="92%" icon={Shield} trend={3} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="تنبيهات" value="2" icon={AlertTriangle} trend={-1} trendLabel="أقل" delay={0.3} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setTab('contracts')} className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', tab === 'contracts' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground border border-transparent')}>
          <Gavel size={14} /> العقود
        </button>
        <button onClick={() => setTab('compliance')} className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', tab === 'compliance' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground border border-transparent')}>
          <Shield size={14} /> الامتثال
        </button>
      </div>

      {tab === 'contracts' ? (
        <DataTable columns={columns} data={[]} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في العقود..." currentPage={page} totalPages={1} onPageChange={setPage} emptyMessage="لا توجد عقود حالياً" />
      ) : (
        <div className="space-y-3">
          {complianceItems.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    item.status === 'compliant' ? 'bg-success/10 text-success' : item.status === 'warning' ? 'bg-warning/10 text-warning' : 'bg-surface2 text-muted-foreground'
                  )}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">آخر فحص: {item.lastCheck}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  {item.status === 'compliant' && <CheckCircle size={16} className="text-success" />}
                  {item.status === 'warning' && <AlertTriangle size={16} className="text-warning" />}
                  {item.status === 'pending' && <Clock size={16} className="text-muted-foreground" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
