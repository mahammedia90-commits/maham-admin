import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Map, ZoomIn, ZoomOut, RotateCcw, Layers, Filter, Search,
  Eye, Edit, Users, DollarSign, Grid3X3, CheckCircle, Clock,
  XCircle, X, Maximize2
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'

interface Space {
  id: number
  code: string
  zone: string
  type: 'booth_premium' | 'booth_standard' | 'booth_small' | 'stage' | 'lounge' | 'service'
  size_sqm: number
  status: 'available' | 'reserved' | 'booked' | 'maintenance'
  tenant_name?: string
  tenant_type?: 'merchant' | 'sponsor' | 'investor'
  price: number
  x: number
  y: number
  w: number
  h: number
}

const ZONES = ['A', 'B', 'C', 'D']

const MOCK_SPACES: Space[] = [
  // Zone A — Premium
  { id: 1, code: 'A-01', zone: 'A', type: 'booth_premium', size_sqm: 100, status: 'booked', tenant_name: 'شركة التقنية المتقدمة', tenant_type: 'sponsor', price: 150000, x: 5, y: 5, w: 20, h: 15 },
  { id: 2, code: 'A-02', zone: 'A', type: 'booth_premium', size_sqm: 80, status: 'booked', tenant_name: 'مجموعة الابتكار', tenant_type: 'sponsor', price: 120000, x: 27, y: 5, w: 18, h: 15 },
  { id: 3, code: 'A-03', zone: 'A', type: 'booth_premium', size_sqm: 60, status: 'reserved', tenant_name: 'بنك الاستثمار', tenant_type: 'investor', price: 90000, x: 47, y: 5, w: 15, h: 15 },
  { id: 4, code: 'A-04', zone: 'A', type: 'stage', size_sqm: 200, status: 'booked', tenant_name: 'المسرح الرئيسي', price: 0, x: 65, y: 5, w: 30, h: 15 },
  // Zone B — Standard
  { id: 5, code: 'B-01', zone: 'B', type: 'booth_standard', size_sqm: 30, status: 'booked', tenant_name: 'متجر الإلكترونيات', tenant_type: 'merchant', price: 45000, x: 5, y: 25, w: 12, h: 10 },
  { id: 6, code: 'B-02', zone: 'B', type: 'booth_standard', size_sqm: 30, status: 'booked', tenant_name: 'شركة البرمجيات', tenant_type: 'merchant', price: 45000, x: 19, y: 25, w: 12, h: 10 },
  { id: 7, code: 'B-03', zone: 'B', type: 'booth_standard', size_sqm: 30, status: 'available', price: 45000, x: 33, y: 25, w: 12, h: 10 },
  { id: 8, code: 'B-04', zone: 'B', type: 'booth_standard', size_sqm: 30, status: 'available', price: 45000, x: 47, y: 25, w: 12, h: 10 },
  { id: 9, code: 'B-05', zone: 'B', type: 'booth_standard', size_sqm: 30, status: 'reserved', tenant_name: 'مؤسسة الحلول', tenant_type: 'merchant', price: 45000, x: 61, y: 25, w: 12, h: 10 },
  { id: 10, code: 'B-06', zone: 'B', type: 'lounge', size_sqm: 50, status: 'booked', tenant_name: 'صالة VIP', price: 0, x: 75, y: 25, w: 20, h: 10 },
  // Zone C — Small
  { id: 11, code: 'C-01', zone: 'C', type: 'booth_small', size_sqm: 15, status: 'booked', tenant_name: 'مشروع ناشئ 1', tenant_type: 'merchant', price: 20000, x: 5, y: 40, w: 9, h: 8 },
  { id: 12, code: 'C-02', zone: 'C', type: 'booth_small', size_sqm: 15, status: 'booked', tenant_name: 'مشروع ناشئ 2', tenant_type: 'merchant', price: 20000, x: 16, y: 40, w: 9, h: 8 },
  { id: 13, code: 'C-03', zone: 'C', type: 'booth_small', size_sqm: 15, status: 'available', price: 20000, x: 27, y: 40, w: 9, h: 8 },
  { id: 14, code: 'C-04', zone: 'C', type: 'booth_small', size_sqm: 15, status: 'available', price: 20000, x: 38, y: 40, w: 9, h: 8 },
  { id: 15, code: 'C-05', zone: 'C', type: 'booth_small', size_sqm: 15, status: 'maintenance', price: 20000, x: 49, y: 40, w: 9, h: 8 },
  { id: 16, code: 'C-06', zone: 'C', type: 'booth_small', size_sqm: 15, status: 'available', price: 20000, x: 60, y: 40, w: 9, h: 8 },
  // Zone D — Services
  { id: 17, code: 'D-01', zone: 'D', type: 'service', size_sqm: 40, status: 'booked', tenant_name: 'مركز التسجيل', price: 0, x: 5, y: 55, w: 15, h: 10 },
  { id: 18, code: 'D-02', zone: 'D', type: 'service', size_sqm: 30, status: 'booked', tenant_name: 'مركز الإعلام', price: 0, x: 22, y: 55, w: 12, h: 10 },
  { id: 19, code: 'D-03', zone: 'D', type: 'lounge', size_sqm: 60, status: 'booked', tenant_name: 'منطقة الطعام', price: 0, x: 36, y: 55, w: 20, h: 10 },
]

const STATUS_COLORS: Record<string, { fill: string; label: string }> = {
  available: { fill: 'rgba(0, 229, 160, 0.3)', label: 'متاح' },
  reserved: { fill: 'rgba(245, 158, 11, 0.3)', label: 'محجوز مبدئياً' },
  booked: { fill: 'rgba(201, 168, 76, 0.25)', label: 'مؤكد' },
  maintenance: { fill: 'rgba(239, 68, 68, 0.2)', label: 'صيانة' },
}

const TYPE_LABELS: Record<string, string> = {
  booth_premium: 'بوث مميز',
  booth_standard: 'بوث عادي',
  booth_small: 'بوث صغير',
  stage: 'مسرح',
  lounge: 'صالة',
  service: 'خدمات',
}

export default function ExhibitionMapPage() {
  const [spaces] = useState(MOCK_SPACES)
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null)
  const [filterZone, setFilterZone] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [zoom, setZoom] = useState(1)

  const filtered = spaces.filter(s => {
    if (filterZone && s.zone !== filterZone) return false
    if (filterStatus && s.status !== filterStatus) return false
    return true
  })

  const totalSpaces = spaces.length
  const bookedSpaces = spaces.filter(s => s.status === 'booked').length
  const availableSpaces = spaces.filter(s => s.status === 'available').length
  const totalRevenue = spaces.filter(s => s.status === 'booked' || s.status === 'reserved').reduce((s, sp) => s + sp.price, 0)

  return (
    <AdminLayout>
      <PageHeader
        title="خريطة المعرض"
        subtitle="إدارة المساحات والبوثات والمناطق التفاعلية"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي المساحات" value={totalSpaces} icon={Grid3X3} delay={0} />
        <StatsCard title="محجوزة" value={bookedSpaces} icon={CheckCircle} delay={0.1} />
        <StatsCard title="متاحة" value={availableSpaces} icon={Clock} delay={0.2} />
        <StatsCard title="الإيرادات" value={formatCurrency(totalRevenue)} icon={DollarSign} delay={0.3} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Map Area */}
        <div className="col-span-12 lg:col-span-9">
          <div className="glass-card overflow-hidden">
            {/* Map Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <select value={filterZone} onChange={e => setFilterZone(e.target.value)} className="h-8 px-2 rounded-md bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
                  <option value="">كل المناطق</option>
                  {ZONES.map(z => <option key={z} value={z}>المنطقة {z}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 px-2 rounded-md bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
                  <option value="">كل الحالات</option>
                  {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><ZoomIn size={16} /></button>
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><ZoomOut size={16} /></button>
                <button onClick={() => setZoom(1)} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><RotateCcw size={16} /></button>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="relative overflow-auto p-4" style={{ minHeight: 500 }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top right', transition: 'transform 0.3s ease' }}>
                <svg viewBox="0 0 100 70" className="w-full" style={{ minWidth: 700 }}>
                  {/* Background Grid */}
                  <defs>
                    <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                      <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(201,168,76,0.05)" strokeWidth="0.1" />
                    </pattern>
                  </defs>
                  <rect width="100" height="70" fill="url(#grid)" rx="1" />

                  {/* Zone Labels */}
                  {ZONES.map((z, i) => (
                    <text key={z} x="1" y={8 + i * 15} fontSize="2" fill="rgba(201,168,76,0.4)" fontWeight="bold" fontFamily="Cairo">
                      المنطقة {z}
                    </text>
                  ))}

                  {/* Spaces */}
                  {filtered.map(space => {
                    const statusConf = STATUS_COLORS[space.status]
                    const isSelected = selectedSpace?.id === space.id
                    return (
                      <g key={space.id} onClick={() => setSelectedSpace(space)} className="cursor-pointer">
                        <rect
                          x={space.x}
                          y={space.y}
                          width={space.w}
                          height={space.h}
                          fill={statusConf.fill}
                          stroke={isSelected ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.15)'}
                          strokeWidth={isSelected ? 0.4 : 0.15}
                          rx={0.5}
                          className="transition-all hover:stroke-[rgba(201,168,76,0.5)] hover:stroke-[0.3]"
                        />
                        <text
                          x={space.x + space.w / 2}
                          y={space.y + space.h / 2 - 1}
                          textAnchor="middle"
                          fontSize="1.5"
                          fill="rgba(245,240,232,0.8)"
                          fontWeight="bold"
                          fontFamily="Cairo"
                        >
                          {space.code}
                        </text>
                        <text
                          x={space.x + space.w / 2}
                          y={space.y + space.h / 2 + 1.5}
                          textAnchor="middle"
                          fontSize="1"
                          fill="rgba(245,240,232,0.5)"
                          fontFamily="Cairo"
                        >
                          {space.tenant_name ? (space.tenant_name.length > 12 ? space.tenant_name.slice(0, 12) + '...' : space.tenant_name) : statusConf.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 p-3 border-t border-border/50">
              {Object.entries(STATUS_COLORS).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: val.fill.replace('0.3', '0.6').replace('0.25', '0.6').replace('0.2', '0.6') }} />
                  <span className="text-[10px] text-muted-foreground">{val.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Space Details Panel */}
        <div className="col-span-12 lg:col-span-3">
          <div className="glass-card p-4 sticky top-20">
            {selectedSpace ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gold">{selectedSpace.code}</h3>
                  <button onClick={() => setSelectedSpace(null)} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground"><X size={14} /></button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">النوع</span><span className="text-foreground">{TYPE_LABELS[selectedSpace.type]}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">المساحة</span><span className="text-foreground">{selectedSpace.size_sqm} م²</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">المنطقة</span><span className="text-foreground">{selectedSpace.zone}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">الحالة</span><span className={cn('font-medium', selectedSpace.status === 'available' ? 'text-success' : selectedSpace.status === 'booked' ? 'text-gold' : selectedSpace.status === 'reserved' ? 'text-warning' : 'text-danger')}>{STATUS_COLORS[selectedSpace.status].label}</span></div>
                  {selectedSpace.price > 0 && <div className="flex justify-between text-xs"><span className="text-muted-foreground">السعر</span><span className="text-gold font-mono">{formatCurrency(selectedSpace.price)}</span></div>}
                  {selectedSpace.tenant_name && <div className="flex justify-between text-xs"><span className="text-muted-foreground">المستأجر</span><span className="text-foreground">{selectedSpace.tenant_name}</span></div>}
                </div>
                <div className="space-y-2 pt-2">
                  {selectedSpace.status === 'available' && (
                    <button onClick={() => toast.info('حجز المساحة — قريباً')} className="w-full h-9 rounded-lg bg-gold/10 border border-gold/25 text-xs font-medium text-gold hover:bg-gold/20 transition-all">حجز المساحة</button>
                  )}
                  <button onClick={() => toast.info('تعديل — قريباً')} className="w-full h-9 rounded-lg bg-surface border border-border text-xs text-muted-foreground hover:text-foreground transition-all">تعديل التفاصيل</button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <Map size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">اختر مساحة من الخريطة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
