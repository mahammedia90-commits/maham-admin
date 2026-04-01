// Design: Nour Theme — Documents Vault Manager
// 4 tabs: All Documents, Categories, Shared, Trash
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, FolderOpen, Upload, Download, Trash2, Share2,
  Search, Filter, Eye, File, Image, FileSpreadsheet,
  Clock, Shield, Users, Star
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'all', label: 'جميع المستندات', icon: FileText },
  { id: 'categories', label: 'التصنيفات', icon: FolderOpen },
  { id: 'shared', label: 'المشترك', icon: Share2 },
  { id: 'trash', label: 'المحذوفات', icon: Trash2 },
]

const fileTypeIcons: Record<string, { icon: typeof File; color: string }> = {
  pdf: { icon: FileText, color: 'text-red-400 bg-red-400/10' },
  docx: { icon: File, color: 'text-blue-400 bg-blue-400/10' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-400 bg-green-400/10' },
  png: { icon: Image, color: 'text-purple-400 bg-purple-400/10' },
  jpg: { icon: Image, color: 'text-purple-400 bg-purple-400/10' },
}

const documents = [
  { id: 1, name: 'عقد رعاية بنك الأهلي — 2026', type: 'pdf', size: '2.4 MB', category: 'عقود', uploadedBy: 'نور كرم', date: '2026-03-28', status: 'approved', shared: true, starred: true },
  { id: 2, name: 'فاتورة STC — مارس 2026', type: 'pdf', size: '850 KB', category: 'فواتير', uploadedBy: 'أحمد المالي', date: '2026-03-25', status: 'approved', shared: false, starred: false },
  { id: 3, name: 'خطة المعرض التقني 2026', type: 'docx', size: '1.8 MB', category: 'خطط', uploadedBy: 'سارة المدير', date: '2026-03-20', status: 'pending', shared: true, starred: true },
  { id: 4, name: 'تقرير ROI — Q1 2026', type: 'xlsx', size: '3.2 MB', category: 'تقارير', uploadedBy: 'محمد التحليل', date: '2026-03-18', status: 'approved', shared: true, starred: false },
  { id: 5, name: 'تصميم جناح أرامكو', type: 'png', size: '5.1 MB', category: 'تصاميم', uploadedBy: 'خالد المصمم', date: '2026-03-15', status: 'approved', shared: false, starred: false },
  { id: 6, name: 'شهادة KYC — شركة المراعي', type: 'pdf', size: '1.2 MB', category: 'KYC', uploadedBy: 'النظام', date: '2026-03-12', status: 'approved', shared: false, starred: false },
  { id: 7, name: 'محضر اجتماع مجلس الإدارة', type: 'docx', size: '650 KB', category: 'محاضر', uploadedBy: 'نور كرم', date: '2026-03-10', status: 'draft', shared: true, starred: true },
  { id: 8, name: 'ميزانية الربع الثاني 2026', type: 'xlsx', size: '2.8 MB', category: 'مالية', uploadedBy: 'أحمد المالي', date: '2026-03-08', status: 'pending', shared: false, starred: false },
]

const categories = [
  { name: 'عقود', count: 45, size: '128 MB', icon: FileText, color: 'bg-gold/10 text-gold border-gold/20' },
  { name: 'فواتير', count: 120, size: '85 MB', icon: FileSpreadsheet, color: 'bg-success/10 text-success border-success/20' },
  { name: 'تقارير', count: 38, size: '210 MB', icon: File, color: 'bg-info/10 text-info border-info/20' },
  { name: 'خطط', count: 15, size: '45 MB', icon: FolderOpen, color: 'bg-warning/10 text-warning border-warning/20' },
  { name: 'تصاميم', count: 62, size: '1.2 GB', icon: Image, color: 'bg-purple-400/10 text-purple-400 border-purple-400/20' },
  { name: 'KYC', count: 88, size: '320 MB', icon: Shield, color: 'bg-red-400/10 text-red-400 border-red-400/20' },
  { name: 'محاضر', count: 22, size: '18 MB', icon: FileText, color: 'bg-chrome/10 text-chrome border-chrome/20' },
  { name: 'مالية', count: 95, size: '156 MB', icon: FileSpreadsheet, color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
]

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const filtered = documents.filter(d => d.name.includes(search) || d.category.includes(search))

  return (
    <AdminLayout>
      <PageHeader title="خزنة المستندات" subtitle="إدارة مركزية لجميع المستندات والملفات — عقود، فواتير، تقارير، KYC" actions={
        <button onClick={() => toast.info('رفع مستند — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Upload size={16} /> رفع مستند</button>
      } />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي المستندات" value="485" icon={FileText} trend={8} delay={0} />
        <StatsCard title="المشترك" value="124" icon={Share2} delay={0.1} />
        <StatsCard title="حجم التخزين" value="2.16 GB" icon={FolderOpen} delay={0.2} />
        <StatsCard title="قيد المراجعة" value="18" icon={Clock} delay={0.3} />
      </div>
      <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border/50 overflow-x-auto mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-surface2/50')}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'all' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في المستندات..." className="w-full h-10 pr-10 pl-4 rounded-xl bg-surface2/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50" /></div>
                <button className="h-10 px-4 rounded-xl bg-surface2/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"><Filter size={14} /> تصفية</button>
              </div>
              <div className="space-y-2">
                {filtered.map((doc, i) => {
                  const ft = fileTypeIcons[doc.type] || { icon: File, color: 'text-muted-foreground bg-surface2' }
                  const FIcon = ft.icon
                  return (
                    <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-4 hover:border-gold/20 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', ft.color)}><FIcon size={18} /></div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-foreground truncate">{doc.name}</h4>
                              {doc.starred && <Star size={12} className="text-gold fill-gold shrink-0" />}
                              {doc.shared && <Share2 size={12} className="text-info shrink-0" />}
                            </div>
                            <p className="text-[10px] text-muted-foreground">{doc.category} • {doc.size} • {doc.uploadedBy} • {formatDate(doc.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={doc.status} />
                          <button onClick={() => toast.info('تحميل — قريباً')} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Download size={14} /></button>
                          <button onClick={() => toast.info('عرض — قريباً')} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 border cursor-pointer hover:border-gold/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', cat.color.split(' ').slice(0, 2).join(' '))}><cat.icon size={18} /></div>
                    <h4 className="text-sm font-bold text-foreground">{cat.name}</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{cat.count} ملف</span>
                    <span className="text-xs font-mono text-gold">{cat.size}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {activeTab === 'shared' && (
            <div className="space-y-2">
              {documents.filter(d => d.shared).map((doc, i) => {
                const ft = fileTypeIcons[doc.type] || { icon: File, color: 'text-muted-foreground bg-surface2' }
                const FIcon = ft.icon
                return (
                  <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 hover:border-gold/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', ft.color)}><FIcon size={18} /></div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{doc.name}</h4>
                          <p className="text-[10px] text-muted-foreground">مشترك مع: الفريق التنفيذي • {formatDate(doc.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2"><Users size={14} className="text-info" /><span className="text-xs text-info">مشترك</span></div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
          {activeTab === 'trash' && (
            <div className="flex flex-col items-center justify-center py-20">
              <Trash2 size={48} className="text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">سلة المحذوفات فارغة</h3>
              <p className="text-sm text-muted-foreground">لا توجد مستندات محذوفة حالياً</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
