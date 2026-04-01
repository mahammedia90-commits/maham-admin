/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — إدارة الملفات (File Management)
 * Features: ملفات، مجلدات، رفع، تحميل، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderOpen, FileText, Image, Film, Music, Archive,
  Upload, Download, Trash2, Eye, Search, Plus,
  Grid3X3, List, AlertTriangle, X, File, HardDrive
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileItem {
  id: number; name: string; type: string; size: string; date: string; category: string; uploader: string
}

const fileTypeIcons: Record<string, typeof FileText> = { pdf: FileText, doc: FileText, xls: FileText, image: Image, video: Film, audio: Music, zip: Archive }
const fileTypeColors: Record<string, string> = { pdf: 'bg-danger/10 text-danger', doc: 'bg-info/10 text-info', xls: 'bg-success/10 text-success', image: 'bg-gold/10 text-gold', video: 'bg-warning/10 text-warning', audio: 'bg-chrome/10 text-chrome', zip: 'bg-surface2 text-muted-foreground' }

const demoFiles: FileItem[] = [
  { id: 1, name: 'عقد رعاية أرامكو 2026.pdf', type: 'pdf', size: '3.2 MB', date: '2026-03-31', category: 'عقود', uploader: 'ماجد القحطاني' },
  { id: 2, name: 'خطة معرض الرياض.docx', type: 'doc', size: '1.8 MB', date: '2026-03-30', category: 'مشاريع', uploader: 'نور كرم' },
  { id: 3, name: 'الميزانية التقديرية Q2.xlsx', type: 'xls', size: '980 KB', date: '2026-03-29', category: 'مالية', uploader: 'نورة السبيعي' },
  { id: 4, name: 'تصميم الجناح الرئيسي.png', type: 'image', size: '5.4 MB', date: '2026-03-28', category: 'تصاميم', uploader: 'هند المطيري' },
  { id: 5, name: 'فيديو ترويجي — المعرض.mp4', type: 'video', size: '45 MB', date: '2026-03-27', category: 'تسويق', uploader: 'سارة العلي' },
  { id: 6, name: 'عقد تأجير المراعي.pdf', type: 'pdf', size: '2.1 MB', date: '2026-03-26', category: 'عقود', uploader: 'ماجد القحطاني' },
  { id: 7, name: 'قائمة العارضين المؤكدين.xlsx', type: 'xls', size: '1.2 MB', date: '2026-03-25', category: 'عمليات', uploader: 'خالد الحربي' },
  { id: 8, name: 'شعار Maham Expo.svg', type: 'image', size: '120 KB', date: '2026-03-24', category: 'تصاميم', uploader: 'هند المطيري' },
  { id: 9, name: 'تقرير الأداء الشهري.pdf', type: 'pdf', size: '4.5 MB', date: '2026-03-23', category: 'تقارير', uploader: 'ريم الغامدي' },
  { id: 10, name: 'ملفات المعرض — نسخة احتياطية.zip', type: 'zip', size: '120 MB', date: '2026-03-22', category: 'أرشيف', uploader: 'عمر الزهراني' },
  { id: 11, name: 'عرض تقديمي للمستثمرين.pdf', type: 'pdf', size: '8.2 MB', date: '2026-03-21', category: 'استثمار', uploader: 'نور كرم' },
  { id: 12, name: 'خريطة المعرض التفاعلية.png', type: 'image', size: '3.8 MB', date: '2026-03-20', category: 'تصاميم', uploader: 'هند المطيري' },
]

const categories = ['الكل', 'عقود', 'مشاريع', 'مالية', 'تصاميم', 'تسويق', 'عمليات', 'تقارير', 'أرشيف', 'استثمار']

export default function FilesPage() {
  const [files, setFiles] = useState(demoFiles)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('الكل')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const stats = useMemo(() => ({
    total: files.length,
    totalSize: '195 MB',
    categories: new Set(files.map(f => f.category)).size,
  }), [files])

  const filtered = useMemo(() => {
    let result = [...files]
    if (catFilter !== 'الكل') result = result.filter(f => f.category === catFilter)
    if (search) { const s = search.toLowerCase(); result = result.filter(f => f.name.includes(s) || f.uploader.includes(s)) }
    return result
  }, [files, catFilter, search])

  const handleDelete = (id: number) => {
    const f = files.find(f => f.id === id)
    setFiles(prev => prev.filter(f => f.id !== id))
    toast.success(`تم حذف: ${f?.name}`)
    setDeleteConfirm(null)
  }

  return (
    <AdminLayout>
      <PageHeader title="إدارة الملفات" subtitle={`${stats.total} ملف — ${stats.totalSize} — ${stats.categories} تصنيف`}
        actions={<button onClick={() => setShowUploadModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Upload size={16} /> رفع ملف</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatsCard title="إجمالي الملفات" value={String(stats.total)} icon={FolderOpen} delay={0} />
        <StatsCard title="الحجم الكلي" value={stats.totalSize} icon={HardDrive} delay={0.05} />
        <StatsCard title="العقود" value={String(files.filter(f => f.category === 'عقود').length)} icon={FileText} delay={0.1} />
        <StatsCard title="التصاميم" value={String(files.filter(f => f.category === 'تصاميم').length)} icon={Image} delay={0.15} />
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-64"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في الملفات..." className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={cn('h-7 px-2.5 rounded-lg text-[10px] font-medium transition-all', catFilter === c ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>{c}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface2 rounded-lg p-0.5">
          <button onClick={() => setViewMode('list')} className={cn('p-1.5 rounded-md transition-all', viewMode === 'list' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}><List size={14} /></button>
          <button onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded-md transition-all', viewMode === 'grid' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}><Grid3X3 size={14} /></button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="divide-y divide-border/30">
            {filtered.length === 0 ? (
              <div className="px-4 py-16 text-center"><FolderOpen size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground text-sm">لا يوجد ملفات مطابقة</p></div>
            ) : filtered.map((file, idx) => {
              const FIcon = fileTypeIcons[file.type] || File
              return (
                <motion.div key={file.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                  className="px-4 py-3 hover:bg-surface2/30 transition-colors flex items-center gap-4">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', fileTypeColors[file.type])}>
                    <FIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{file.category} — {file.uploader} — {file.date}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">{file.size}</span>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => toast.info(`عرض: ${file.name}`)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                    <button onClick={() => toast.info(`تحميل: ${file.name}`)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Download size={14} /></button>
                    <button onClick={() => setDeleteConfirm(file.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((file, i) => {
            const FIcon = fileTypeIcons[file.type] || File
            return (
              <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="glass-card p-4 hover:border-gold/20 transition-all group">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3', fileTypeColors[file.type])}>
                  <FIcon size={22} />
                </div>
                <p className="text-xs font-medium text-foreground text-center truncate mb-1">{file.name}</p>
                <p className="text-[9px] text-muted-foreground text-center">{file.size} — {file.date}</p>
                <div className="flex items-center justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toast.info(`تحميل: ${file.name}`)} className="p-1 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Download size={12} /></button>
                  <button onClick={() => setDeleteConfirm(file.id)} className="p-1 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={12} /></button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* نافذة الرفع */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowUploadModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Upload size={18} className="text-gold" /></div><div><h3 className="text-base font-bold text-foreground">رفع ملف</h3><p className="text-xs text-muted-foreground">رفع ملف جديد للنظام</p></div></div>
              <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-gold/30 transition-colors cursor-pointer" onClick={() => toast.info('اختيار ملف — قريباً')}>
                <Upload size={32} className="mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">اسحب الملف هنا أو اضغط للاختيار</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">PDF, DOC, XLS, PNG, JPG, MP4 — حتى 100 MB</p>
              </div>
              <button onClick={() => { setShowUploadModal(false); toast.info('رفع الملفات — قريباً') }} className="w-full mt-4 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إغلاق</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف الملف</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{files.find(f => f.id === deleteConfirm)?.name}</span>؟</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
