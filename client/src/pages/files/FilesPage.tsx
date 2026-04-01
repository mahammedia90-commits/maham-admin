import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FolderOpen, File, Image, FileText, Upload, Download,
  Trash2, Eye, Search, Grid, List, HardDrive
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const folders = [
  { name: 'عقود', count: 24, icon: FileText, color: 'text-gold' },
  { name: 'صور الفعاليات', count: 156, icon: Image, color: 'text-info' },
  { name: 'تقارير', count: 38, icon: FileText, color: 'text-success' },
  { name: 'مستندات', count: 67, icon: File, color: 'text-chrome' },
]

export default function FilesPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة الملفات"
        subtitle="تنظيم وإدارة ملفات النظام"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface2 rounded-xl p-0.5">
              <button onClick={() => setView('grid')} className={cn('h-7 w-7 rounded-lg flex items-center justify-center transition-all', view === 'grid' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
                <Grid size={14} />
              </button>
              <button onClick={() => setView('list')} className={cn('h-7 w-7 rounded-lg flex items-center justify-center transition-all', view === 'list' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>
                <List size={14} />
              </button>
            </div>
            <button onClick={() => toast.info('رفع ملف — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
              <Upload size={16} />
              رفع ملف
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الملفات" value="285" icon={File} trend={12} trendLabel="هذا الشهر" delay={0} />
        <StatsCard title="المساحة المستخدمة" value="4.2 GB" icon={HardDrive} trend={0} trendLabel="من 10 GB" delay={0.1} />
        <StatsCard title="المجلدات" value="4" icon={FolderOpen} trend={0} trendLabel="مجلد" delay={0.2} />
        <StatsCard title="آخر رفع" value="اليوم" icon={Upload} trend={0} trendLabel="منذ ساعة" delay={0.3} />
      </div>

      {/* Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {folders.map((folder, i) => (
          <motion.div
            key={folder.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="glass-card p-4 hover:border-gold/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <folder.icon size={18} className={folder.color} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">{folder.name}</p>
                <p className="text-[11px] text-muted-foreground">{folder.count} ملف</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state for files */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-12 text-center">
        <FolderOpen size={48} className="text-gold/20 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-foreground mb-1">اختر مجلداً لعرض الملفات</h3>
        <p className="text-xs text-muted-foreground">أو ارفع ملفاً جديداً باستخدام الزر أعلاه</p>
      </motion.div>
    </AdminLayout>
  )
}
