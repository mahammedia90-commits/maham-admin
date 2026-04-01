import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, FileText, Download, Calendar, Filter, TrendingUp,
  PieChart, Activity, DollarSign, Users, Eye, Printer
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const reportCategories = [
  {
    title: 'التقارير المالية',
    icon: DollarSign,
    color: 'bg-gold/10 border-gold/20 text-gold',
    reports: [
      { name: 'تقرير الإيرادات الشهري', type: 'PDF', lastGenerated: '2026-03-28' },
      { name: 'تقرير المصروفات', type: 'Excel', lastGenerated: '2026-03-25' },
      { name: 'تقرير الأرباح والخسائر', type: 'PDF', lastGenerated: '2026-03-20' },
      { name: 'تقرير التدفقات النقدية', type: 'PDF', lastGenerated: '2026-03-15' },
    ]
  },
  {
    title: 'تقارير الفعاليات',
    icon: Calendar,
    color: 'bg-info/10 border-info/20 text-info',
    reports: [
      { name: 'تقرير أداء الفعاليات', type: 'PDF', lastGenerated: '2026-03-28' },
      { name: 'تقرير الحضور', type: 'Excel', lastGenerated: '2026-03-25' },
      { name: 'تقرير رضا العارضين', type: 'PDF', lastGenerated: '2026-03-20' },
    ]
  },
  {
    title: 'تقارير المبيعات',
    icon: TrendingUp,
    color: 'bg-success/10 border-success/20 text-success',
    reports: [
      { name: 'تقرير المبيعات الشهري', type: 'PDF', lastGenerated: '2026-03-28' },
      { name: 'تقرير أداء الفريق', type: 'Excel', lastGenerated: '2026-03-25' },
      { name: 'تقرير Pipeline', type: 'PDF', lastGenerated: '2026-03-20' },
    ]
  },
  {
    title: 'تقارير الموارد البشرية',
    icon: Users,
    color: 'bg-chrome/10 border-chrome/20 text-chrome',
    reports: [
      { name: 'تقرير الحضور والانصراف', type: 'Excel', lastGenerated: '2026-03-28' },
      { name: 'تقرير الإجازات', type: 'PDF', lastGenerated: '2026-03-25' },
      { name: 'تقرير مسير الرواتب', type: 'Excel', lastGenerated: '2026-03-20' },
    ]
  },
]

export default function ReportsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="التقارير"
        subtitle="إنشاء وتصدير التقارير التحليلية"
        actions={
          <button onClick={() => toast.info('إنشاء تقرير مخصص — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <FileText size={16} />
            تقرير مخصص
          </button>
        }
      />

      <div className="space-y-6">
        {reportCategories.map((category, ci) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.1 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-4 border-b border-border/50 flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center', category.color)}>
                <category.icon size={16} />
              </div>
              <h3 className="text-sm font-bold text-foreground">{category.title}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground">{category.reports.length}</span>
            </div>
            <div className="divide-y divide-border/30">
              {category.reports.map((report, ri) => (
                <motion.div
                  key={report.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ci * 0.1 + ri * 0.03 }}
                  className="p-3 px-4 hover:bg-surface2/30 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{report.name}</p>
                      <p className="text-[11px] text-muted-foreground">آخر إنشاء: {report.lastGenerated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground">{report.type}</span>
                    <button onClick={() => toast.info('جاري إنشاء التقرير...')} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors" title="عرض">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => toast.info('جاري التحميل...')} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors" title="تحميل">
                      <Download size={14} />
                    </button>
                    <button onClick={() => toast.info('جاري الطباعة...')} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-chrome transition-colors" title="طباعة">
                      <Printer size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  )
}
