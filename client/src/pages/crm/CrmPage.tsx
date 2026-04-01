import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Target, Phone, Mail, MessageSquare, Star, Plus,
  Eye, Edit, TrendingUp, BarChart3, UserCheck, Filter
} from 'lucide-react'
import { PieChart as RPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import DataTable, { Column } from '@/components/shared/DataTable'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatNumber } from '@/lib/utils'
import { crmApi } from '@/api'
import { toast } from 'sonner'

const pipelineData = [
  { name: 'عملاء جدد', value: 45, color: '#C9A84C' },
  { name: 'مهتمون', value: 30, color: '#D4B96A' },
  { name: 'تفاوض', value: 15, color: '#A0A0A0' },
  { name: 'مغلق', value: 10, color: '#6B6B6B' },
]

const pipelineStages = [
  { name: 'عملاء جدد', count: 45, value: '180,000', color: 'bg-gold/20 border-gold/30' },
  { name: 'تواصل أولي', count: 32, value: '250,000', color: 'bg-gold/15 border-gold/25' },
  { name: 'عرض سعر', count: 18, value: '420,000', color: 'bg-chrome/20 border-chrome/30' },
  { name: 'تفاوض', count: 12, value: '580,000', color: 'bg-info/15 border-info/25' },
  { name: 'إغلاق', count: 8, value: '750,000', color: 'bg-success/15 border-success/25' },
]

interface Lead {
  id: number
  name: string
  company: string
  email: string
  phone: string
  stage: string
  score: number
  source: string
}

export default function CrmPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'table' | 'pipeline'>('pipeline')

  const columns: Column<Lead>[] = [
    {
      key: 'name',
      label: 'العميل',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
            {row.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-[11px] text-muted-foreground">{row.company}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'البريد',
      render: (val) => <span className="text-xs text-muted-foreground">{val}</span>,
    },
    {
      key: 'stage',
      label: 'المرحلة',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'score',
      label: 'التقييم AI',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-surface3">
            <div className={cn('h-full rounded-full', val >= 80 ? 'bg-success' : val >= 50 ? 'bg-warning' : 'bg-danger')} style={{ width: `${val}%` }} />
          </div>
          <span className="text-xs font-mono">{val}%</span>
        </div>
      ),
    },
    {
      key: 'source',
      label: 'المصدر',
      render: (val) => <span className="text-xs text-muted-foreground">{val}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Phone size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-success transition-colors"><Mail size={14} /></button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة علاقات العملاء"
        subtitle="تتبع العملاء المحتملين وإدارة خط المبيعات"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface2 rounded-xl p-0.5">
              <button onClick={() => setView('pipeline')} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', view === 'pipeline' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
                Pipeline
              </button>
              <button onClick={() => setView('table')} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', view === 'table' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
                جدول
              </button>
            </div>
            <button onClick={() => toast.info('إضافة عميل — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
              <Plus size={16} />
              عميل جديد
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي العملاء" value="1,247" icon={Users} trend={15} trendLabel="هذا الشهر" delay={0} />
        <StatsCard title="عملاء نشطون" value="892" icon={UserCheck} trend={8} trendLabel="هذا الأسبوع" delay={0.1} />
        <StatsCard title="معدل التحويل" value="32%" icon={Target} trend={5} trendLabel="تحسن" delay={0.2} />
        <StatsCard title="قيمة الفرص" value="2.1M" icon={TrendingUp} trend={22} trendLabel="هذا الربع" delay={0.3} />
      </div>

      {view === 'pipeline' ? (
        /* Pipeline View */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {pipelineStages.map((stage, i) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className={cn('glass-card p-4 border', stage.color)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-foreground">{stage.name}</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground">{stage.count}</span>
              </div>
              <p className="text-lg font-bold font-mono text-gold mb-3">{stage.value} <span className="text-[10px] text-muted-foreground font-normal">ر.س</span></p>
              {/* Placeholder cards */}
              <div className="space-y-2">
                {Array.from({ length: Math.min(stage.count, 3) }).map((_, j) => (
                  <div key={j} className="p-2 rounded-lg bg-surface2/50 border border-border/20 hover:border-gold/20 transition-colors cursor-pointer">
                    <div className="h-2 w-3/4 rounded bg-surface3 mb-1.5" />
                    <div className="h-1.5 w-1/2 rounded bg-surface3" />
                  </div>
                ))}
                {stage.count > 3 && (
                  <p className="text-[10px] text-center text-muted-foreground">+{stage.count - 3} آخرين</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Table View */
        <DataTable
          columns={columns}
          data={[]}
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="بحث في العملاء..."
          currentPage={page}
          totalPages={1}
          onPageChange={setPage}
          emptyMessage="لا يوجد عملاء حالياً"
        />
      )}
    </AdminLayout>
  )
}
