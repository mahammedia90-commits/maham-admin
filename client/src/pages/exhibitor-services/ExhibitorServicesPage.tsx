import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench, Plus, Search, Eye, Edit, CheckCircle, Clock, XCircle,
  Wifi, Zap, Truck, Palette, Monitor, ShieldCheck, Coffee,
  Users, DollarSign, BarChart3, X, Package
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

interface ServiceRequest {
  id: number
  exhibitor_name: string
  booth_code: string
  service_type: string
  service_icon: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'
  requested_at: string
  scheduled_at?: string
  completed_at?: string
  priority: 'high' | 'medium' | 'low'
}

interface ServiceCatalog {
  id: number
  name: string
  name_en: string
  category: string
  icon: string
  base_price: number
  unit: string
  description: string
  active: boolean
}

const MOCK_REQUESTS: ServiceRequest[] = [
  { id: 1, exhibitor_name: 'شركة التقنية المتقدمة', booth_code: 'A-01', service_type: 'كهرباء إضافية', service_icon: 'zap', description: 'توصيل كهرباء 220V إضافي للشاشات', quantity: 3, unit_price: 500, total_price: 1500, status: 'pending', requested_at: '2026-03-31T09:00:00', priority: 'high' },
  { id: 2, exhibitor_name: 'مجموعة الابتكار', booth_code: 'A-02', service_type: 'إنترنت مخصص', service_icon: 'wifi', description: 'خط إنترنت مخصص 100Mbps', quantity: 1, unit_price: 2000, total_price: 2000, status: 'approved', requested_at: '2026-03-30T14:00:00', scheduled_at: '2026-04-01', priority: 'medium' },
  { id: 3, exhibitor_name: 'متجر الإلكترونيات', booth_code: 'B-01', service_type: 'تصميم بوث', service_icon: 'palette', description: 'تصميم وتنفيذ ديكور البوث', quantity: 1, unit_price: 15000, total_price: 15000, status: 'in_progress', requested_at: '2026-03-28T10:00:00', scheduled_at: '2026-03-29', priority: 'high' },
  { id: 4, exhibitor_name: 'شركة البرمجيات', booth_code: 'B-02', service_type: 'شاشات عرض', service_icon: 'monitor', description: 'شاشة LED 65 بوصة مع حامل', quantity: 2, unit_price: 3000, total_price: 6000, status: 'completed', requested_at: '2026-03-27T11:00:00', completed_at: '2026-03-29', priority: 'medium' },
  { id: 5, exhibitor_name: 'بنك الاستثمار', booth_code: 'A-03', service_type: 'نقل وتركيب', service_icon: 'truck', description: 'نقل معدات من المستودع وتركيبها', quantity: 1, unit_price: 5000, total_price: 5000, status: 'pending', requested_at: '2026-03-31T08:00:00', priority: 'low' },
  { id: 6, exhibitor_name: 'مشروع ناشئ 1', booth_code: 'C-01', service_type: 'ضيافة', service_icon: 'coffee', description: 'خدمة قهوة وضيافة ليومين', quantity: 2, unit_price: 1500, total_price: 3000, status: 'approved', requested_at: '2026-03-29T15:00:00', scheduled_at: '2026-04-02', priority: 'low' },
  { id: 7, exhibitor_name: 'شركة التقنية المتقدمة', booth_code: 'A-01', service_type: 'أمن خاص', service_icon: 'shield', description: 'حارس أمن خاص للبوث', quantity: 1, unit_price: 4000, total_price: 4000, status: 'rejected', requested_at: '2026-03-26T09:00:00', priority: 'low' },
]

const MOCK_CATALOG: ServiceCatalog[] = [
  { id: 1, name: 'كهرباء إضافية', name_en: 'Extra Power', category: 'بنية تحتية', icon: 'zap', base_price: 500, unit: 'نقطة', description: 'توصيل كهرباء 220V إضافي', active: true },
  { id: 2, name: 'إنترنت مخصص', name_en: 'Dedicated Internet', category: 'بنية تحتية', icon: 'wifi', base_price: 2000, unit: 'خط', description: 'خط إنترنت مخصص عالي السرعة', active: true },
  { id: 3, name: 'تصميم بوث', name_en: 'Booth Design', category: 'تصميم', icon: 'palette', base_price: 15000, unit: 'بوث', description: 'تصميم وتنفيذ ديكور كامل', active: true },
  { id: 4, name: 'شاشات عرض', name_en: 'Display Screens', category: 'معدات', icon: 'monitor', base_price: 3000, unit: 'شاشة', description: 'شاشة LED مع حامل', active: true },
  { id: 5, name: 'نقل وتركيب', name_en: 'Transport & Setup', category: 'لوجستيات', icon: 'truck', base_price: 5000, unit: 'رحلة', description: 'نقل معدات وتركيبها', active: true },
  { id: 6, name: 'ضيافة', name_en: 'Hospitality', category: 'خدمات', icon: 'coffee', base_price: 1500, unit: 'يوم', description: 'خدمة قهوة وضيافة', active: true },
  { id: 7, name: 'أمن خاص', name_en: 'Private Security', category: 'أمن', icon: 'shield', base_price: 4000, unit: 'حارس/يوم', description: 'حارس أمن مخصص', active: true },
]

export default function ExhibitorServicesPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'catalog'>('requests')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)

  const filteredRequests = MOCK_REQUESTS.filter(r => {
    if (search && !r.exhibitor_name.includes(search) && !r.service_type.includes(search)) return false
    if (filterStatus && r.status !== filterStatus) return false
    return true
  })

  const totalRevenue = MOCK_REQUESTS.filter(r => r.status !== 'rejected').reduce((s, r) => s + r.total_price, 0)

  const getIcon = (icon: string, size = 16) => {
    const map: Record<string, any> = { zap: Zap, wifi: Wifi, palette: Palette, monitor: Monitor, truck: Truck, coffee: Coffee, shield: ShieldCheck }
    const Icon = map[icon] || Wrench
    return <Icon size={size} />
  }

  const getStatusMap = (status: string) => {
    switch (status) {
      case 'pending': return 'pending'
      case 'approved': return 'approved'
      case 'in_progress': return 'review'
      case 'completed': return 'completed'
      case 'rejected': return 'rejected'
      default: return status
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="خدمات العارضين"
        subtitle="إدارة طلبات الخدمات الإضافية وكتالوج الخدمات"
        actions={
          <button onClick={() => toast.info('طلب خدمة جديدة — قريباً')} className="h-9 px-4 rounded-lg bg-gold/10 border border-gold/25 text-sm text-gold hover:bg-gold/20 transition-all flex items-center gap-2">
            <Plus size={14} />
            طلب خدمة
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الطلبات" value={MOCK_REQUESTS.length} icon={Wrench} delay={0} />
        <StatsCard title="قيد التنفيذ" value={MOCK_REQUESTS.filter(r => r.status === 'in_progress').length} icon={Clock} delay={0.1} />
        <StatsCard title="مكتملة" value={MOCK_REQUESTS.filter(r => r.status === 'completed').length} icon={CheckCircle} delay={0.2} />
        <StatsCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} icon={DollarSign} delay={0.3} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 mb-6 w-fit">
        <button onClick={() => setActiveTab('requests')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'requests' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
          <div className="flex items-center gap-2"><Wrench size={14} /> طلبات الخدمات</div>
        </button>
        <button onClick={() => setActiveTab('catalog')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'catalog' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
          <div className="flex items-center gap-2"><Package size={14} /> كتالوج الخدمات</div>
        </button>
      </div>

      {activeTab === 'requests' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالعارض أو الخدمة..." className="w-full h-9 pr-9 pl-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-all" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
              <option value="">كل الحالات</option>
              <option value="pending">معلق</option>
              <option value="approved">موافق عليه</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>

          {/* Requests Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">العارض</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الخدمة</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الكمية</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">المبلغ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الحالة</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">التاريخ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-[120px]">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">لا توجد طلبات</td></tr>
                  ) : (
                    filteredRequests.map((req, idx) => (
                      <motion.tr key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="border-b border-border/30 hover:bg-surface/50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{req.exhibitor_name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{req.booth_code}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gold">{getIcon(req.service_icon, 14)}</span>
                            <span className="text-sm text-foreground">{req.service_type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-mono">{req.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gold font-mono">{formatCurrency(req.total_price)}</td>
                        <td className="px-4 py-3"><StatusBadge status={getStatusMap(req.status)} /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{formatDate(req.requested_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSelectedRequest(req)} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Eye size={13} /></button>
                            {req.status === 'pending' && (
                              <>
                                <button onClick={() => toast.success('تمت الموافقة')} className="p-1.5 rounded-md hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"><CheckCircle size={13} /></button>
                                <button onClick={() => toast.error('تم الرفض')} className="p-1.5 rounded-md hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><XCircle size={13} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_CATALOG.map((svc, idx) => (
            <motion.div key={svc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} className="glass-card p-5 hover:border-gold/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  {getIcon(svc.icon, 20)}
                </div>
                <button onClick={() => toast.info('تعديل — قريباً')} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors opacity-0 group-hover:opacity-100"><Edit size={13} /></button>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-0.5">{svc.name}</h3>
              <p className="text-[10px] text-muted-foreground/60 font-mono mb-2">{svc.name_en}</p>
              <p className="text-xs text-muted-foreground mb-3">{svc.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <span className="text-xs text-muted-foreground">{svc.category}</span>
                <span className="text-sm font-bold text-gold font-mono">{formatCurrency(svc.base_price)}/{svc.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedRequest(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">تفاصيل الطلب</h3>
                <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">العارض</p><p className="text-sm font-medium text-foreground">{selectedRequest.exhibitor_name}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">البوث</p><p className="text-sm font-mono text-foreground">{selectedRequest.booth_code}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الخدمة</p><p className="text-sm text-foreground">{selectedRequest.service_type}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">المبلغ</p><p className="text-sm text-gold font-mono">{formatCurrency(selectedRequest.total_price)}</p></div>
                </div>
                <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground mb-1">الوصف</p><p className="text-sm text-foreground">{selectedRequest.description}</p></div>
                {selectedRequest.scheduled_at && (
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الموعد المجدول</p><p className="text-sm text-foreground">{formatDate(selectedRequest.scheduled_at)}</p></div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
