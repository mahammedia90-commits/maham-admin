/*
 * AI Sales Intelligence — الذكاء الاصطناعي للمبيعات
 * Route: /ai/sales-intelligence
 * Features: Priority Queue, Revenue Forecast, At-Risk Detection, Smart Recommendations
 */
import { useState, useMemo } from 'react'
import {
  Brain, Zap, TrendingUp, TrendingDown, AlertTriangle, Target,
  DollarSign, Users, Clock, CheckCircle2, ArrowUp, ArrowDown,
  Flame, Eye, Star, BarChart3, Activity, Shield, Lightbulb,
  RefreshCw, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AIPriorityLead {
  id: number; name: string; company: string; type: 'investor' | 'merchant' | 'sponsor'
  ai_score: number; predicted_value: number; predicted_close_pct: number
  urgency: 'critical' | 'high' | 'medium' | 'low'
  recommended_action: string; recommended_channel: string
  risk_factors: string[]; opportunity_signals: string[]
  days_since_contact: number; pipeline_stage: string
}

interface RevenueForecast {
  month: string; predicted: number; actual: number | null; confidence: number
  best_case: number; worst_case: number
}

interface AtRiskDeal {
  id: number; client: string; company: string; value: number
  risk_score: number; risk_reasons: string[]
  recommended_action: string; days_stale: number
}

const MOCK_PRIORITY_QUEUE: AIPriorityLead[] = [
  { id: 1, name: 'عبدالله المنصور', company: 'شركة المنصور للعقارات', type: 'investor', ai_score: 96, predicted_value: 500000, predicted_close_pct: 85, urgency: 'critical', recommended_action: 'اتصال فوري — العميل زار صفحة التسعير 3 مرات اليوم', recommended_channel: 'مكالمة', risk_factors: [], opportunity_signals: ['زيارات متكررة للموقع', 'فتح عرض السعر 5 مرات', 'شركة تتوسع في الرياض'], days_since_contact: 1, pipeline_stage: 'عرض سعر' },
  { id: 2, name: 'ريم السبيعي', company: 'ريم تك', type: 'sponsor', ai_score: 91, predicted_value: 800000, predicted_close_pct: 72, urgency: 'high', recommended_action: 'إرسال عرض رعاية مخصص — تطابق 94% مع معايير الراعي المثالي', recommended_channel: 'بريد + اجتماع', risk_factors: ['منافس يقدم عرض بديل'], opportunity_signals: ['ميزانية تسويق كبيرة', 'حضرت 3 معارض سابقة', 'تبحث عن visibility في السوق السعودي'], days_since_contact: 2, pipeline_stage: 'تأهيل' },
  { id: 3, name: 'فهد العتيبي', company: 'مجموعة فهد التجارية', type: 'merchant', ai_score: 87, predicted_value: 250000, predicted_close_pct: 68, urgency: 'high', recommended_action: 'متابعة الدفعة الثانية — العميل أبدى اهتمام بتوسيع المساحة', recommended_channel: 'واتساب', risk_factors: ['تأخر في الدفعة الأولى'], opportunity_signals: ['طلب معلومات عن مساحات إضافية', 'أعمال ناجحة في موسم سابق'], days_since_contact: 3, pipeline_stage: 'تفاوض' },
  { id: 4, name: 'هند القرني', company: 'هند للأزياء', type: 'merchant', ai_score: 78, predicted_value: 120000, predicted_close_pct: 55, urgency: 'medium', recommended_action: 'جدولة زيارة موقع — العميلة تحتاج رؤية المساحة قبل القرار', recommended_channel: 'زيارة موقع', risk_factors: ['ميزانية محدودة', 'تقارن مع مواقع أخرى'], opportunity_signals: ['علامة تجارية صاعدة', 'حضور قوي على انستغرام'], days_since_contact: 5, pipeline_stage: 'اهتمام' },
  { id: 5, name: 'نورة الدوسري', company: 'بنك الاستثمار السعودي', type: 'sponsor', ai_score: 74, predicted_value: 1200000, predicted_close_pct: 40, urgency: 'medium', recommended_action: 'تحضير عرض تقديمي مخصص للبنك — التركيز على ROI وبيانات الحضور', recommended_channel: 'اجتماع رسمي', risk_factors: ['دورة قرار طويلة', 'يحتاج موافقة مجلس إدارة'], opportunity_signals: ['البنك يبحث عن فرص CSR', 'ميزانية رعاية سنوية 5M+'], days_since_contact: 7, pipeline_stage: 'اهتمام' },
]

const MOCK_FORECASTS: RevenueForecast[] = [
  { month: 'يناير', predicted: 2800000, actual: 2950000, confidence: 92, best_case: 3200000, worst_case: 2400000 },
  { month: 'فبراير', predicted: 3100000, actual: 2880000, confidence: 88, best_case: 3500000, worst_case: 2600000 },
  { month: 'مارس', predicted: 3500000, actual: 3490000, confidence: 90, best_case: 4000000, worst_case: 3000000 },
  { month: 'أبريل', predicted: 4200000, actual: null, confidence: 82, best_case: 5000000, worst_case: 3500000 },
  { month: 'مايو', predicted: 4800000, actual: null, confidence: 75, best_case: 5800000, worst_case: 3800000 },
  { month: 'يونيو', predicted: 5500000, actual: null, confidence: 68, best_case: 6500000, worst_case: 4200000 },
]

const MOCK_AT_RISK: AtRiskDeal[] = [
  { id: 1, client: 'محمد العنزي', company: 'العنزي للمقاولات', value: 180000, risk_score: 85, risk_reasons: ['لا تواصل منذ 14 يوم', 'لم يفتح آخر 3 رسائل', 'المنافس قدم عرض أقل 15%'], recommended_action: 'اتصال عاجل مع عرض خصم 10%', days_stale: 14 },
  { id: 2, client: 'سلطان الغامدي', company: 'الغامدي للتجزئة', value: 180000, risk_score: 72, risk_reasons: ['نزاع على الفاتورة', 'طلب تخفيض السعر مرتين'], recommended_action: 'اجتماع لحل النزاع + عرض بديل', days_stale: 10 },
  { id: 3, client: 'خالد الزهراني', company: 'الزهراني للأغذية', value: 150000, risk_score: 90, risk_reasons: ['تأخر سداد 33 يوم', 'تم تصعيد للقانوني', 'لا رد على المكالمات'], recommended_action: 'زيارة شخصية + خطة سداد مرنة', days_stale: 20 },
]

function formatSAR(amount: number) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
  return amount.toLocaleString('ar-SA')
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? 'text-emerald-400 bg-emerald-500/15' : score >= 70 ? 'text-[#c9a84c] bg-[#c9a84c]/15' : score >= 50 ? 'text-amber-400 bg-amber-500/15' : 'text-red-400 bg-red-500/15'
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono ${color}`}><Brain className="w-3 h-3" />{score}</span>
}

export default function AISalesIntelligencePage() {
  const [activeTab, setActiveTab] = useState<'priority' | 'forecast' | 'risk' | 'insights'>('priority')

  const tabs = [
    { id: 'priority' as const, label: 'قائمة الأولويات', icon: Zap, count: MOCK_PRIORITY_QUEUE.filter(l => l.urgency === 'critical').length },
    { id: 'forecast' as const, label: 'توقعات الإيرادات', icon: TrendingUp },
    { id: 'risk' as const, label: 'صفقات مهددة', icon: AlertTriangle, count: MOCK_AT_RISK.length },
    { id: 'insights' as const, label: 'رؤى ذكية', icon: Lightbulb },
  ]

  const pipelineValue = MOCK_PRIORITY_QUEUE.reduce((s, l) => s + l.predicted_value, 0)
  const weightedValue = MOCK_PRIORITY_QUEUE.reduce((s, l) => s + l.predicted_value * l.predicted_close_pct / 100, 0)
  const atRiskValue = MOCK_AT_RISK.reduce((s, d) => s + d.value, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#a08030] flex items-center justify-center"><Brain className="w-5 h-5 text-black" /></div>
          <div>
            <h1 className="text-2xl font-bold text-[#e2e2f0]">الذكاء الاصطناعي للمبيعات</h1>
            <p className="text-[#5a5a78] text-sm">تحليل تنبؤي — أولويات ذكية — كشف المخاطر — توصيات فورية</p>
          </div>
        </div>
        <Button className="bg-[#c9a84c] hover:bg-[#b8973f] text-black text-sm"><RefreshCw className="w-4 h-4 ml-2" />تحديث التحليل</Button>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'قيمة الأنبوب', value: `${formatSAR(pipelineValue)} ر.س`, icon: DollarSign, color: 'text-[#c9a84c]' },
          { label: 'القيمة المرجحة', value: `${formatSAR(weightedValue)} ر.س`, icon: Target, color: 'text-emerald-400' },
          { label: 'صفقات مهددة', value: `${formatSAR(atRiskValue)} ر.س`, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'دقة التوقع', value: '89%', icon: Brain, color: 'text-[#c9a84c]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1"><s.icon className={`w-4 h-4 ${s.color}`} /><span className="text-xs text-[#5a5a78]">{s.label}</span></div>
            <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#252535]">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-[#5a5a78] hover:text-[#e2e2f0]'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
              {tab.count !== undefined && tab.count > 0 && <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full font-mono">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Queue */}
      {activeTab === 'priority' && (
        <div className="space-y-4">
          {MOCK_PRIORITY_QUEUE.map((lead, i) => (
            <div key={lead.id} className={`bg-[#0f0f1a] border rounded-xl p-5 ${lead.urgency === 'critical' ? 'border-red-500/50 bg-red-500/5' : lead.urgency === 'high' ? 'border-[#c9a84c]/30' : 'border-[#252535]'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold font-mono text-[#5a5a78]">#{i + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#e2e2f0] font-bold">{lead.name}</span>
                      <ScoreBadge score={lead.ai_score} />
                      <span className={`text-xs px-1.5 py-0.5 rounded ${lead.type === 'investor' ? 'bg-[#60a5fa]/15 text-[#60a5fa]' : lead.type === 'sponsor' ? 'bg-[#f59e0b]/15 text-[#f59e0b]' : 'bg-[#34d399]/15 text-[#34d399]'}`}>
                        {lead.type === 'investor' ? 'مستثمر' : lead.type === 'sponsor' ? 'راعي' : 'تاجر'}
                      </span>
                      {lead.urgency === 'critical' && <span className="text-xs bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse"><Flame className="w-3 h-3" />عاجل</span>}
                    </div>
                    <div className="text-xs text-[#5a5a78]">{lead.company} · {lead.pipeline_stage}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold font-mono text-[#c9a84c]">{formatSAR(lead.predicted_value)} ر.س</div>
                  <div className="text-xs text-emerald-400">{lead.predicted_close_pct}% احتمال إغلاق</div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-[#c9a84c]" />
                  <span className="text-xs font-bold text-[#c9a84c]">توصية الذكاء الاصطناعي</span>
                  <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-1.5 py-0.5 rounded">{lead.recommended_channel}</span>
                </div>
                <p className="text-sm text-[#e2e2f0]">{lead.recommended_action}</p>
              </div>

              {/* Signals */}
              <div className="flex flex-wrap gap-2">
                {lead.opportunity_signals.map((s, j) => (
                  <span key={j} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded flex items-center gap-1"><ArrowUp className="w-3 h-3" />{s}</span>
                ))}
                {lead.risk_factors.map((r, j) => (
                  <span key={j} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded flex items-center gap-1"><ArrowDown className="w-3 h-3" />{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Forecast */}
      {activeTab === 'forecast' && (
        <div className="space-y-4">
          <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#e2e2f0] mb-4">توقعات الإيرادات — 2026</h3>
            <div className="space-y-3">
              {MOCK_FORECASTS.map(f => {
                const maxVal = Math.max(...MOCK_FORECASTS.map(x => x.best_case))
                const pctPredicted = f.predicted / maxVal * 100
                const pctActual = f.actual ? f.actual / maxVal * 100 : 0
                return (
                  <div key={f.month} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-[#5a5a78] text-left">{f.month}</div>
                    <div className="flex-1 relative">
                      <div className="h-8 bg-[#171724] rounded relative overflow-hidden">
                        <div className="absolute inset-y-0 right-0 bg-[#c9a84c]/20 rounded" style={{ width: `${pctPredicted}%` }} />
                        {f.actual !== null && <div className="absolute inset-y-0 right-0 bg-[#c9a84c] rounded" style={{ width: `${pctActual}%` }} />}
                      </div>
                    </div>
                    <div className="w-32 text-left">
                      <div className="text-sm font-mono text-[#c9a84c]">{formatSAR(f.predicted)} ر.س</div>
                      {f.actual !== null && (
                        <div className={`text-xs font-mono ${f.actual >= f.predicted ? 'text-emerald-400' : 'text-red-400'}`}>
                          فعلي: {formatSAR(f.actual)}
                        </div>
                      )}
                    </div>
                    <div className="w-12 text-left">
                      <span className={`text-xs font-mono ${f.confidence >= 85 ? 'text-emerald-400' : f.confidence >= 70 ? 'text-amber-400' : 'text-[#5a5a78]'}`}>{f.confidence}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-[#5a5a78]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#c9a84c] rounded" />فعلي</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#c9a84c]/20 rounded" />متوقع</span>
            </div>
          </div>

          {/* Forecast Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-4 text-center">
              <div className="text-xs text-[#5a5a78] mb-1">أفضل سيناريو (H1)</div>
              <div className="text-xl font-bold font-mono text-emerald-400">{formatSAR(MOCK_FORECASTS.reduce((s, f) => s + f.best_case, 0))} ر.س</div>
            </div>
            <div className="bg-[#0f0f1a] border border-[#c9a84c]/30 rounded-lg p-4 text-center">
              <div className="text-xs text-[#5a5a78] mb-1">السيناريو المتوقع (H1)</div>
              <div className="text-xl font-bold font-mono text-[#c9a84c]">{formatSAR(MOCK_FORECASTS.reduce((s, f) => s + f.predicted, 0))} ر.س</div>
            </div>
            <div className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-4 text-center">
              <div className="text-xs text-[#5a5a78] mb-1">أسوأ سيناريو (H1)</div>
              <div className="text-xl font-bold font-mono text-red-400">{formatSAR(MOCK_FORECASTS.reduce((s, f) => s + f.worst_case, 0))} ر.س</div>
            </div>
          </div>
        </div>
      )}

      {/* At-Risk Deals */}
      {activeTab === 'risk' && (
        <div className="space-y-4">
          {MOCK_AT_RISK.map(deal => (
            <div key={deal.id} className="bg-[#0f0f1a] border border-red-500/30 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#e2e2f0] font-bold">{deal.client}</span>
                    <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded font-bold">خطر {deal.risk_score}%</span>
                  </div>
                  <div className="text-xs text-[#5a5a78]">{deal.company} · متوقف منذ {deal.days_stale} يوم</div>
                </div>
                <div className="text-lg font-bold font-mono text-red-400">{formatSAR(deal.value)} ر.س</div>
              </div>
              <div className="space-y-2 mb-3">
                {deal.risk_reasons.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-red-400"><AlertTriangle className="w-3 h-3 flex-shrink-0" />{r}</div>
                ))}
              </div>
              <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1"><Brain className="w-4 h-4 text-[#c9a84c]" /><span className="text-xs font-bold text-[#c9a84c]">الإجراء المقترح</span></div>
                <p className="text-sm text-[#e2e2f0]">{deal.recommended_action}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Smart Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {[
            { title: 'أفضل وقت للاتصال', insight: 'تحليل 200+ مكالمة يُظهر أن أعلى معدل رد يكون بين 10:00-11:30 صباحاً و 4:00-5:00 مساءً', impact: 'زيادة معدل الرد 35%', icon: Clock, color: 'text-emerald-400' },
            { title: 'القطاع الأكثر ربحية', insight: 'قطاع العقارات يمثل 42% من الإيرادات بمعدل تحويل 35% — أعلى من المتوسط بـ 2x', impact: 'التركيز على هذا القطاع يرفع الإيرادات 25%', icon: BarChart3, color: 'text-[#c9a84c]' },
            { title: 'نمط فقدان الصفقات', insight: '68% من الصفقات المفقودة تتوقف في مرحلة "عرض السعر" — السبب الرئيسي: تأخر المتابعة أكثر من 48 ساعة', impact: 'تقليل وقت المتابعة يحفظ 180K شهرياً', icon: AlertTriangle, color: 'text-red-400' },
            { title: 'فرصة Cross-Sell', insight: '5 تجار حاليين يطابقون معايير الترقية لمساحات أكبر — القيمة المحتملة 750K', impact: 'إيرادات إضافية بدون تكلفة اكتساب', icon: TrendingUp, color: 'text-emerald-400' },
            { title: 'تحسين عملية البيع', insight: 'الصفقات التي تشمل زيارة موقع تُغلق بنسبة 2.5x أعلى من الصفقات عبر الهاتف فقط', impact: 'جدولة زيارات للصفقات الكبيرة (>200K)', icon: Lightbulb, color: 'text-[#c9a84c]' },
          ].map((insight, i) => (
            <div key={i} className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-[#171724] flex items-center justify-center flex-shrink-0 ${insight.color}`}><insight.icon className="w-5 h-5" /></div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#e2e2f0] mb-1">{insight.title}</h4>
                  <p className="text-sm text-[#5a5a78] mb-2">{insight.insight}</p>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#c9a84c]" />
                    <span className="text-xs text-[#c9a84c] font-medium">{insight.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
