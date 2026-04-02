/*
 * CRM Pipeline Kanban — أنابيب المبيعات
 * Route: /sales/pipeline
 * Design: Dark surface + Gold accents + Kanban columns
 * Features: Drag simulation, deal cards, SLA indicators, stage totals
 */
import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import {
  DollarSign, Clock, AlertTriangle, Users, TrendingUp,
  Plus, Eye, MoreHorizontal, ChevronLeft, ChevronRight,
  Building2, Phone, Flame, Thermometer, Snowflake, Zap,
  ArrowLeft, ArrowRight, GripVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PipelineDeal, Priority, ClientType } from '@/types/revenue-engine'
import { CLIENT_TYPES, PIPELINE_STAGES_DEFAULT } from '@/types/revenue-engine'

// ─── Mock Pipeline Data ─────────────────────────────
const STAGES = PIPELINE_STAGES_DEFAULT.map((s, i) => ({
  id: i + 1,
  ...s,
  deals_count: 0,
  deals_value: 0,
}))

const MOCK_DEALS: PipelineDeal[] = [
  { id: 1, lead_id: 1, stage_id: 4, value: 450000, close_probability: 75, assigned_to: 1, days_in_stage: 2, last_activity: '2026-04-01T08:00:00Z', next_action: 'اجتماع عرض المساحات', next_action_date: '2026-04-03', is_overdue: false, is_at_risk: false, created_at: '2026-03-28T10:00:00Z', updated_at: '2026-04-01T08:00:00Z', lead: { id: 1, full_name: 'عبدالله المنصور', company: 'شركة المنصور للعقارات', phone: '+966535001001', phone_whatsapp: true, email: 'a@m.sa', city: 'الرياض', sector: 'real_estate', lead_type: 'investor', source: 'website', priority: 'hot', assigned_to: 1, ai_score: 92, status: 'qualified', next_action: null, next_action_date: null, notes: null, created_at: '2026-03-28T10:00:00Z', updated_at: '2026-04-01T08:00:00Z', last_contacted_at: '2026-04-01T08:00:00Z' }, assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب', department: 'المبيعات', is_online: true } },
  { id: 2, lead_id: 2, stage_id: 3, value: 180000, close_probability: 60, assigned_to: 2, days_in_stage: 3, last_activity: '2026-03-31T16:00:00Z', next_action: 'إرسال عرض سعر', next_action_date: '2026-04-02', is_overdue: false, is_at_risk: false, created_at: '2026-03-25T14:00:00Z', updated_at: '2026-03-31T16:00:00Z', lead: { id: 2, full_name: 'فهد العتيبي', company: 'مجموعة فهد التجارية', phone: '+966535002002', phone_whatsapp: true, email: 'f@fg.sa', city: 'جدة', sector: 'food', lead_type: 'merchant', source: 'exhibition', priority: 'hot', assigned_to: 2, ai_score: 87, status: 'contacted', next_action: null, next_action_date: null, notes: null, created_at: '2026-03-25T14:00:00Z', updated_at: '2026-03-31T16:00:00Z', last_contacted_at: '2026-03-31T16:00:00Z' }, assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة', department: 'المبيعات', is_online: true } },
  { id: 3, lead_id: 6, stage_id: 7, value: 750000, close_probability: 85, assigned_to: 1, days_in_stage: 1, last_activity: '2026-04-01T10:00:00Z', next_action: 'توقيع عقد رعاية', next_action_date: '2026-04-05', is_overdue: false, is_at_risk: false, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-04-01T10:00:00Z', lead: { id: 6, full_name: 'ريم السبيعي', company: 'ريم تك', phone: '+966535006006', phone_whatsapp: true, email: 'r@rt.sa', city: 'الخبر', sector: 'tech', lead_type: 'sponsor', source: 'website', priority: 'hot', assigned_to: 1, ai_score: 91, status: 'qualified', next_action: null, next_action_date: null, notes: null, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-04-01T10:00:00Z', last_contacted_at: '2026-04-01T10:00:00Z' }, assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب', department: 'المبيعات', is_online: true } },
  { id: 4, lead_id: 8, stage_id: 5, value: 120000, close_probability: 55, assigned_to: 2, days_in_stage: 5, last_activity: '2026-03-31T11:00:00Z', next_action: 'زيارة موقع', next_action_date: '2026-04-03', is_overdue: true, is_at_risk: true, created_at: '2026-03-22T13:00:00Z', updated_at: '2026-03-31T11:00:00Z', lead: { id: 8, full_name: 'هند القرني', company: 'هند للأزياء', phone: '+966535008008', phone_whatsapp: true, email: 'h@hs.sa', city: 'مكة المكرمة', sector: 'fashion', lead_type: 'merchant', source: 'exhibition', priority: 'hot', assigned_to: 2, ai_score: 85, status: 'contacted', next_action: null, next_action_date: null, notes: null, created_at: '2026-03-22T13:00:00Z', updated_at: '2026-03-31T11:00:00Z', last_contacted_at: '2026-03-31T11:00:00Z' }, assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة', department: 'المبيعات', is_online: true } },
  { id: 5, lead_id: 5, stage_id: 2, value: 95000, close_probability: 40, assigned_to: 2, days_in_stage: 2, last_activity: '2026-03-30T14:00:00Z', next_action: 'متابعة بعد العرض', next_action_date: '2026-04-04', is_overdue: false, is_at_risk: false, created_at: '2026-03-20T11:00:00Z', updated_at: '2026-03-30T14:00:00Z', lead: { id: 5, full_name: 'سلطان الغامدي', company: 'الغامدي للتجزئة', phone: '+966535005005', phone_whatsapp: true, email: 's@gr.sa', city: 'الطائف', sector: 'retail', lead_type: 'merchant', source: 'campaign', priority: 'warm', assigned_to: 2, ai_score: 68, status: 'contacted', next_action: null, next_action_date: null, notes: null, created_at: '2026-03-20T11:00:00Z', updated_at: '2026-03-30T14:00:00Z', last_contacted_at: '2026-03-30T14:00:00Z' }, assigned_user: { id: 2, name: 'سارة القحطاني', role: 'مندوبة', department: 'المبيعات', is_online: true } },
  { id: 6, lead_id: 3, stage_id: 1, value: 0, close_probability: 20, assigned_to: 1, days_in_stage: 0, last_activity: null, next_action: 'اتصال تعريفي', next_action_date: '2026-04-02', is_overdue: false, is_at_risk: false, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', lead: { id: 3, full_name: 'نورة الدوسري', company: 'بنك الاستثمار السعودي', phone: '+966535003003', phone_whatsapp: false, email: 'n@sib.sa', city: 'الرياض', sector: 'tech', lead_type: 'sponsor', source: 'referral', priority: 'warm', assigned_to: 1, ai_score: 78, status: 'new', next_action: null, next_action_date: null, notes: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', last_contacted_at: null }, assigned_user: { id: 1, name: 'أحمد الشمري', role: 'مندوب', department: 'المبيعات', is_online: true } },
  { id: 7, lead_id: 4, stage_id: 1, value: 0, close_probability: 10, assigned_to: 0, days_in_stage: 0, last_activity: null, next_action: null, next_action_date: null, is_overdue: true, is_at_risk: true, created_at: '2026-04-01T07:00:00Z', updated_at: '2026-04-01T07:00:00Z', lead: { id: 4, full_name: 'خالد الحربي', company: 'حربي فاشن', phone: '+966535004004', phone_whatsapp: true, email: 'k@hf.sa', city: 'الدمام', sector: 'fashion', lead_type: 'merchant', source: 'cold_call', priority: 'cold', assigned_to: null, ai_score: 45, status: 'new', next_action: null, next_action_date: null, notes: null, created_at: '2026-04-01T07:00:00Z', updated_at: '2026-04-01T07:00:00Z', last_contacted_at: null } },
]

function formatSAR(amount: number) {
  if (amount === 0) return '—'
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ر.س`
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K ر.س`
  return `${amount.toLocaleString('ar-SA')} ر.س`
}

function PriorityDot({ priority }: { priority: Priority }) {
  const colors = { hot: 'bg-red-400', warm: 'bg-amber-400', cold: 'bg-blue-400' }
  return <span className={`w-2 h-2 rounded-full ${colors[priority]}`} />
}

function TypeDot({ type }: { type: ClientType }) {
  const colors = { investor: 'bg-[#60a5fa]', merchant: 'bg-[#34d399]', sponsor: 'bg-[#f59e0b]' }
  return <span className={`w-2 h-2 rounded-full ${colors[type]}`} title={CLIENT_TYPES[type]} />
}

// ─── Deal Card ──────────────────────────────────────
function DealCard({ deal, onMoveLeft, onMoveRight, canMoveLeft, canMoveRight }: {
  deal: PipelineDeal
  onMoveLeft: () => void
  onMoveRight: () => void
  canMoveLeft: boolean
  canMoveRight: boolean
}) {
  const [, navigate] = useLocation()
  const slaStage = STAGES.find(s => s.id === deal.stage_id)
  const slaExceeded = slaStage && slaStage.sla_hours > 0 && deal.days_in_stage * 24 > slaStage.sla_hours

  return (
    <div className={`bg-[#171724] border rounded-lg p-3 space-y-2 cursor-pointer hover:border-[#c9a84c]/50 transition-all group ${deal.is_at_risk ? 'border-red-500/50 bg-red-500/5' : 'border-[#252535]'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <TypeDot type={deal.lead?.lead_type || 'merchant'} />
          <PriorityDot priority={deal.lead?.priority || 'warm'} />
          <span className="text-[#e2e2f0] text-sm font-medium truncate max-w-[140px]">{deal.lead?.full_name}</span>
        </div>
        {deal.is_at_risk && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />}
      </div>

      <div className="text-[#5a5a78] text-xs flex items-center gap-1">
        <Building2 className="w-3 h-3" />{deal.lead?.company}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[#c9a84c] font-mono text-sm font-bold">{formatSAR(deal.value)}</span>
        <span className={`text-xs font-mono ${deal.close_probability >= 70 ? 'text-emerald-400' : deal.close_probability >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{deal.close_probability}%</span>
      </div>

      {deal.next_action && (
        <div className="text-xs text-[#5a5a78] bg-[#0f0f1a] rounded px-2 py-1 truncate">
          {deal.next_action}
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className={`flex items-center gap-1 ${slaExceeded ? 'text-red-400 font-bold' : 'text-[#5a5a78]'}`}>
          <Clock className="w-3 h-3" />{deal.days_in_stage}d
          {slaExceeded && <span className="text-[10px]">SLA!</span>}
        </span>
        {deal.assigned_user && (
          <span className="text-[#5a5a78] truncate max-w-[80px]">{deal.assigned_user.name.split(' ')[0]}</span>
        )}
      </div>

      {/* Move buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-[#252535]/50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onMoveRight() }} disabled={!canMoveRight} className="p-1 rounded hover:bg-[#252535] text-[#5a5a78] hover:text-[#c9a84c] disabled:opacity-20" title="نقل للمرحلة التالية">
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); navigate(`/leads/${deal.lead_id}`) }} className="p-1 rounded hover:bg-[#252535] text-[#5a5a78] hover:text-[#e2e2f0]" title="عرض التفاصيل">
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onMoveLeft() }} disabled={!canMoveLeft} className="p-1 rounded hover:bg-[#252535] text-[#5a5a78] hover:text-[#c9a84c] disabled:opacity-20" title="نقل للمرحلة السابقة">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────
export default function PipelinePage() {
  const [deals, setDeals] = useState<PipelineDeal[]>(MOCK_DEALS)

  const moveDeal = (dealId: number, direction: 'left' | 'right') => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d
      const currentIdx = STAGES.findIndex(s => s.id === d.stage_id)
      const newIdx = direction === 'right' ? currentIdx + 1 : currentIdx - 1
      if (newIdx < 0 || newIdx >= STAGES.length) return d
      return { ...d, stage_id: STAGES[newIdx].id, days_in_stage: 0, updated_at: new Date().toISOString() }
    }))
  }

  // Stats
  const stats = useMemo(() => {
    const totalValue = deals.reduce((s, d) => s + d.value, 0)
    const atRisk = deals.filter(d => d.is_at_risk).length
    const avgProb = deals.length > 0 ? Math.round(deals.reduce((s, d) => s + d.close_probability, 0) / deals.length) : 0
    const weighted = deals.reduce((s, d) => s + d.value * d.close_probability / 100, 0)
    return { totalDeals: deals.length, totalValue, atRisk, avgProb, weighted }
  }, [deals])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2f0]">أنابيب المبيعات</h1>
          <p className="text-[#5a5a78] text-sm mt-1">تتبع الصفقات عبر مراحل البيع — من التواصل الأول حتى إغلاق العقد</p>
        </div>
        <Button className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-sm"><Plus className="w-4 h-4 ml-2" />صفقة جديدة</Button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'إجمالي الصفقات', value: stats.totalDeals, icon: Users, color: 'text-[#c9a84c]' },
          { label: 'قيمة الأنبوب', value: formatSAR(stats.totalValue), icon: DollarSign, color: 'text-[#c9a84c]' },
          { label: 'القيمة المرجحة', value: formatSAR(stats.weighted), icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'معدل الإغلاق', value: `${stats.avgProb}%`, icon: TrendingUp, color: 'text-[#60a5fa]' },
          { label: 'صفقات معرضة للخطر', value: stats.atRisk, icon: AlertTriangle, color: stats.atRisk > 0 ? 'text-red-400' : 'text-emerald-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-[#171724] flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-[#5a5a78]">{s.label}</div>
              <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {STAGES.map((stage, stageIdx) => {
            const stageDeals = deals.filter(d => d.stage_id === stage.id)
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0)
            return (
              <div key={stage.id} className="w-[280px] flex-shrink-0">
                {/* Stage Header */}
                <div className="bg-[#0f0f1a] border border-[#252535] rounded-t-xl p-3 border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <span className="text-[#e2e2f0] text-sm font-bold">{stage.name_ar}</span>
                      <span className="bg-[#171724] text-[#5a5a78] text-xs px-1.5 py-0.5 rounded-full font-mono">{stageDeals.length}</span>
                    </div>
                    {stage.sla_hours > 0 && (
                      <span className="text-[10px] text-[#5a5a78]">SLA: {stage.sla_hours}h</span>
                    )}
                  </div>
                  <div className="text-[#c9a84c] text-xs font-mono">{formatSAR(stageValue)}</div>
                </div>

                {/* Stage Body */}
                <div className="bg-[#0f0f1a]/50 border border-[#252535] border-t-0 rounded-b-xl p-2 space-y-2 min-h-[200px]">
                  {stageDeals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-10 h-10 rounded-full bg-[#171724] flex items-center justify-center mb-2">
                        <Plus className="w-4 h-4 text-[#5a5a78]" />
                      </div>
                      <span className="text-[#5a5a78] text-xs">لا توجد صفقات</span>
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onMoveLeft={() => moveDeal(deal.id, 'left')}
                        onMoveRight={() => moveDeal(deal.id, 'right')}
                        canMoveLeft={stageIdx > 0}
                        canMoveRight={stageIdx < STAGES.length - 1}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
