// Design: Nour Theme — AI Executive Brain
// 12 AI Modules — كل وحدة بـ dashboard فرعي كامل + chat + analytics
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Sparkles, TrendingUp, AlertTriangle, Users,
  BarChart3, Shield, Lightbulb, Zap, Activity, Target,
  PieChart, DollarSign, Calendar, RefreshCw, CheckCircle,
  ArrowUpRight, Eye, Clock, MessageSquare, Bot, Cpu,
  TrendingDown, Flame, Crown, Star, Globe, FileText,
  MapPin, Package, Layers, ArrowRight, Search, Filter
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, PieChart as RPieChart, Pie, Cell } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'
import { aiApi } from '@/api'
import { toast } from 'sonner'

// ═══════════════════════════════════════════════════════
// AI MODULES DEFINITION
// ═══════════════════════════════════════════════════════
const aiModules = [
  { id: 'executive-brain', label: 'العقل التنفيذي', icon: Brain, desc: 'استشارات ذكية وتحليل شامل', status: 'active', accuracy: 94 },
  { id: 'lead-scoring', label: 'تقييم العملاء', icon: Target, desc: 'تسجيل وتقييم العملاء المحتملين', status: 'active', accuracy: 91 },
  { id: 'revenue-forecast', label: 'توقع الإيرادات', icon: TrendingUp, desc: 'تنبؤات مالية دقيقة', status: 'active', accuracy: 88 },
  { id: 'anomaly-detection', label: 'كشف الشذوذ', icon: AlertTriangle, desc: 'اكتشاف الأنماط غير الطبيعية', status: 'active', accuracy: 96 },
  { id: 'sentiment', label: 'تحليل المشاعر', icon: Sparkles, desc: 'فهم ردود فعل العملاء', status: 'active', accuracy: 87 },
  { id: 'recommendations', label: 'التوصيات', icon: Lightbulb, desc: 'اقتراحات ذكية مخصصة', status: 'active', accuracy: 90 },
  { id: 'risk-assessment', label: 'تقييم المخاطر', icon: Shield, desc: 'تحليل وإدارة المخاطر', status: 'active', accuracy: 93 },
  { id: 'segmentation', label: 'تقسيم العملاء', icon: PieChart, desc: 'تصنيف ذكي للعملاء', status: 'active', accuracy: 89 },
  { id: 'chatbot', label: 'المساعد الذكي', icon: Bot, desc: 'محادثة ذكية تفاعلية', status: 'active', accuracy: 85 },
  { id: 'auto-schedule', label: 'الجدولة التلقائية', icon: Calendar, desc: 'تنظيم تلقائي للفعاليات', status: 'active', accuracy: 92 },
  { id: 'content-gen', label: 'توليد المحتوى', icon: Sparkles, desc: 'إنشاء محتوى تسويقي', status: 'active', accuracy: 86 },
  { id: 'performance', label: 'تحسين الأداء', icon: Activity, desc: 'تحليل وتحسين الكفاءة', status: 'active', accuracy: 91 },
]

// ═══════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════
const forecastData = [
  { month: 'يوليو', actual: 0, predicted: 5200000 },
  { month: 'أغسطس', actual: 0, predicted: 5800000 },
  { month: 'سبتمبر', actual: 0, predicted: 6100000 },
  { month: 'أكتوبر', actual: 0, predicted: 7200000 },
  { month: 'نوفمبر', actual: 0, predicted: 8500000 },
  { month: 'ديسمبر', actual: 0, predicted: 9100000 },
]

const leadScores = [
  { name: 'شركة الرياض للاستثمار', score: 95, segment: 'VIP', potential: 2500000, action: 'متابعة فورية' },
  { name: 'مجموعة الفطيم', score: 88, segment: 'A', potential: 1800000, action: 'عرض مخصص' },
  { name: 'شركة نيوم', score: 92, segment: 'VIP', potential: 3200000, action: 'اجتماع تنفيذي' },
  { name: 'مؤسسة النخبة', score: 75, segment: 'B', potential: 450000, action: 'حملة تسويقية' },
  { name: 'شركة أرامكو', score: 98, segment: 'VIP', potential: 5000000, action: 'شراكة استراتيجية' },
]

const anomalies = [
  { id: 1, type: 'مالي', desc: 'انخفاض مفاجئ في تحصيل فواتير قطاع التجار بنسبة 23%', severity: 'high' as const, date: '2026-03-28' },
  { id: 2, type: 'تشغيلي', desc: 'ارتفاع غير طبيعي في طلبات الإلغاء — معرض الرياض التقني', severity: 'medium' as const, date: '2026-03-27' },
  { id: 3, type: 'أمني', desc: 'محاولات دخول متكررة من IP غير معروف — 47 محاولة', severity: 'high' as const, date: '2026-03-29' },
  { id: 4, type: 'تسويقي', desc: 'انخفاض معدل التحويل في حملة الرعاة الجدد بنسبة 15%', severity: 'low' as const, date: '2026-03-26' },
]

const sentimentData = [
  { category: 'المستثمرون', positive: 78, neutral: 15, negative: 7 },
  { category: 'التجار', positive: 65, neutral: 22, negative: 13 },
  { category: 'الرعاة', positive: 82, neutral: 12, negative: 6 },
  { category: 'الزوار', positive: 71, neutral: 20, negative: 9 },
]

const recommendations = [
  { id: 1, title: 'زيادة أسعار الأجنحة المميزة بنسبة 12%', impact: 'عالي', confidence: 94, category: 'إيرادات', reason: 'الطلب يتجاوز العرض بنسبة 35% في آخر 3 معارض' },
  { id: 2, title: 'إطلاق برنامج ولاء للتجار المتكررين', impact: 'متوسط', confidence: 87, category: 'نمو', reason: '62% من التجار يحجزون مرة واحدة فقط' },
  { id: 3, title: 'تقليل مدة معالجة طلبات KYC إلى 24 ساعة', impact: 'عالي', confidence: 91, category: 'كفاءة', reason: 'متوسط المعالجة الحالي 4.2 يوم — يسبب فقدان 18% من العملاء' },
  { id: 4, title: 'إضافة حزمة رعاية "ذهبية+" بسعر 750,000 ر.س', impact: 'عالي', confidence: 89, category: 'إيرادات', reason: 'فجوة سعرية بين الذهبية (500K) والبلاتينية (1M)' },
]

// ═══════════════════════════════════════════════════════
// SEGMENTATION DATA
// ═══════════════════════════════════════════════════════
const segmentData = [
  { name: 'VIP (إنفاق > 1M)', value: 15, color: '#C9A84C', count: 23, avgSpend: 2400000 },
  { name: 'A (إنفاق 500K-1M)', value: 25, color: '#D4B96E', count: 38, avgSpend: 720000 },
  { name: 'B (إنفاق 100K-500K)', value: 35, color: '#A8893A', count: 54, avgSpend: 280000 },
  { name: 'C (إنفاق < 100K)', value: 25, color: '#8B7332', count: 39, avgSpend: 55000 },
]

// ═══════════════════════════════════════════════════════
// AUTO-SCHEDULE DATA
// ═══════════════════════════════════════════════════════
const scheduleOptimizations = [
  { event: 'معرض التقنية 2026', current: 'أكتوبر 15-18', suggested: 'أكتوبر 22-25', reason: 'تجنب تعارض مع مؤتمر LEAP — زيادة الحضور المتوقعة 28%', confidence: 92 },
  { event: 'معرض الأغذية الدولي', current: 'نوفمبر 5-8', suggested: 'نوفمبر 12-15', reason: 'توافق أفضل مع موسم الرياض — زيادة الزوار 35%', confidence: 88 },
  { event: 'معرض العقارات', current: 'ديسمبر 1-4', suggested: 'ديسمبر 8-11', reason: 'بعد صرف الرواتب — زيادة القوة الشرائية', confidence: 85 },
]

// ═══════════════════════════════════════════════════════
// CONTENT GEN DATA
// ═══════════════════════════════════════════════════════
const generatedContent = [
  { id: 1, type: 'بريد إلكتروني', title: 'دعوة VIP — معرض التقنية 2026', status: 'جاهز', quality: 94, lang: 'عربي + إنجليزي' },
  { id: 2, type: 'منشور سوشال', title: 'إعلان الحجز المبكر — خصم 20%', status: 'قيد المراجعة', quality: 88, lang: 'عربي' },
  { id: 3, type: 'صفحة هبوط', title: 'Landing Page — معرض الأغذية', status: 'جاهز', quality: 91, lang: 'عربي + إنجليزي' },
  { id: 4, type: 'تقرير', title: 'تقرير الأداء الشهري — مارس 2026', status: 'مكتمل', quality: 96, lang: 'عربي' },
  { id: 5, type: 'عرض تقديمي', title: 'Pitch Deck — جولة استثمارية', status: 'قيد المراجعة', quality: 90, lang: 'إنجليزي' },
]

// ═══════════════════════════════════════════════════════
// PERFORMANCE DATA
// ═══════════════════════════════════════════════════════
const performanceMetrics = [
  { dept: 'المبيعات', current: 87, target: 90, trend: 'up' as const, kpis: ['معدل التحويل: 23%', 'متوسط حجم الصفقة: 450K', 'دورة البيع: 18 يوم'] },
  { dept: 'التسويق', current: 78, target: 85, trend: 'up' as const, kpis: ['ROI الحملات: 340%', 'تكلفة الاكتساب: 1,200 ر.س', 'معدل الوصول: 2.1M'] },
  { dept: 'العمليات', current: 92, target: 90, trend: 'up' as const, kpis: ['SLA الاستجابة: 98.2%', 'رضا العملاء: 4.6/5', 'وقت التجهيز: 3.2 يوم'] },
  { dept: 'المالية', current: 85, target: 88, trend: 'down' as const, kpis: ['نسبة التحصيل: 89%', 'DSO: 42 يوم', 'هامش الربح: 34%'] },
  { dept: 'الموارد البشرية', current: 81, target: 85, trend: 'up' as const, kpis: ['معدل الدوران: 8%', 'رضا الموظفين: 4.2/5', 'وقت التوظيف: 21 يوم'] },
]

const radarPerf = [
  { subject: 'المبيعات', score: 87 }, { subject: 'التسويق', score: 78 },
  { subject: 'العمليات', score: 92 }, { subject: 'المالية', score: 85 },
  { subject: 'HR', score: 81 }, { subject: 'القانونية', score: 90 },
]

interface ChatMessage { role: 'user' | 'ai'; content: string; timestamp: Date }

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function AiPage() {
  const [activeModule, setActiveModule] = useState('executive-brain')
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'مرحباً! أنا العقل التنفيذي لمنصة ماهم إكسبو. يمكنني مساعدتك في تحليل البيانات، تقديم التوصيات، وتوقع الاتجاهات. كيف يمكنني مساعدتك اليوم؟', timestamp: new Date() }
  ])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!query.trim() || loading) return
    setMessages(prev => [...prev, { role: 'user', content: query, timestamp: new Date() }])
    setQuery('')
    setLoading(true)
    try {
      const res = await aiApi.executiveBrain({ query })
      setMessages(prev => [...prev, { role: 'ai', content: res.response || res.data?.response || 'تم معالجة طلبك بنجاح.', timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', timestamp: new Date() }])
    } finally { setLoading(false) }
  }

  const mod = aiModules.find(m => m.id === activeModule)!

  // ═══════════════════════════════════════════════════════
  // MODULE DASHBOARDS
  // ═══════════════════════════════════════════════════════
  const renderModuleContent = () => {
    switch (activeModule) {
      case 'lead-scoring':
        return (
          <div className="space-y-4 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="عملاء VIP" value="8" icon={Target} trend={12} delay={0} />
              <StatsCard title="متوسط التقييم" value="87.4" icon={BarChart3} trend={5} delay={0.1} />
              <StatsCard title="قيمة محتملة" value={formatCurrency(12950000)} icon={DollarSign} delay={0.2} />
            </div>
            <div className="space-y-2">
              {leadScores.map((lead, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-colors border border-border/20">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold', lead.score >= 90 ? 'bg-gold/15 text-gold' : lead.score >= 80 ? 'bg-blue-500/15 text-blue-400' : 'bg-muted/15 text-muted-foreground')}>{lead.score}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.action} — {formatCurrency(lead.potential)}</p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', lead.segment === 'VIP' ? 'bg-gold/15 text-gold' : lead.segment === 'A' ? 'bg-blue-500/15 text-blue-400' : 'bg-muted/15 text-muted-foreground')}>{lead.segment}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )
      case 'revenue-forecast':
        return (
          <div className="space-y-4 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="توقع Q3" value={formatCurrency(17100000)} icon={TrendingUp} trend={28} delay={0} />
              <StatsCard title="توقع Q4" value={formatCurrency(24800000)} icon={DollarSign} trend={45} delay={0.1} />
              <StatsCard title="دقة التوقع" value="88%" icon={Target} delay={0.2} />
            </div>
            <div className="glass-card p-4 border border-gold/10 rounded-xl">
              <h4 className="text-sm font-bold text-foreground mb-3">توقعات الإيرادات — النصف الثاني 2026</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={forecastData}>
                  <defs><linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v/1000000}M`} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px', color: 'var(--card-foreground)' }} formatter={(v: number) => [formatCurrency(v), '']} />
                  <Area type="monotone" dataKey="predicted" stroke="#C9A84C" fill="url(#predGrad)" strokeWidth={2} strokeDasharray="5 5" name="متوقع" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-card/30 border border-border/20">
                <p className="text-xs text-muted-foreground mb-1">أعلى مصدر إيراد متوقع</p>
                <p className="text-sm font-bold text-gold">إيجارات الأجنحة — 42%</p>
                <p className="text-[10px] text-emerald-400">+8% عن النصف الأول</p>
              </div>
              <div className="p-3 rounded-xl bg-card/30 border border-border/20">
                <p className="text-xs text-muted-foreground mb-1">أسرع قطاع نمو</p>
                <p className="text-sm font-bold text-gold">الرعايات الرقمية — 156%</p>
                <p className="text-[10px] text-emerald-400">قطاع جديد واعد</p>
              </div>
            </div>
          </div>
        )
      case 'anomaly-detection':
        return (
          <div className="space-y-3 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="شذوذ مكتشف" value="4" icon={AlertTriangle} delay={0} />
              <StatsCard title="عالي الخطورة" value="2" icon={Shield} delay={0.1} />
              <StatsCard title="دقة الكشف" value="96%" icon={CheckCircle} delay={0.2} />
            </div>
            {anomalies.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn('p-4 rounded-xl border', a.severity === 'high' ? 'bg-red-500/5 border-red-500/20' : a.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20')}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className={a.severity === 'high' ? 'text-red-400' : a.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', a.severity === 'high' ? 'bg-red-500/15 text-red-400' : a.severity === 'medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400')}>{a.severity === 'high' ? 'خطورة عالية' : a.severity === 'medium' ? 'متوسطة' : 'منخفضة'}</span>
                      <span className="text-[10px] text-muted-foreground">{a.type}</span>
                    </div>
                    <p className="text-sm text-foreground">{a.desc}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{a.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      case 'sentiment':
        return (
          <div className="space-y-4 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="المشاعر الإيجابية" value="74%" icon={Sparkles} trend={8} delay={0} />
              <StatsCard title="تحليلات اليوم" value="1,247" icon={MessageSquare} delay={0.1} />
              <StatsCard title="دقة التحليل" value="87%" icon={Target} delay={0.2} />
            </div>
            <div className="space-y-3">
              {sentimentData.map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-card/30 border border-border/20">
                  <p className="text-sm font-bold text-foreground mb-2">{s.category}</p>
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                    <div className="bg-emerald-400 rounded-r-full" style={{ width: `${s.positive}%` }} />
                    <div className="bg-gray-400/50" style={{ width: `${s.neutral}%` }} />
                    <div className="bg-red-400 rounded-l-full" style={{ width: `${s.negative}%` }} />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                    <span className="text-emerald-400">إيجابي {s.positive}%</span><span>محايد {s.neutral}%</span><span className="text-red-400">سلبي {s.negative}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-gold/5 border border-gold/15">
              <p className="text-xs font-bold text-gold mb-1">توصية AI</p>
              <p className="text-[11px] text-muted-foreground">التجار لديهم أعلى نسبة مشاعر سلبية (13%). السبب الرئيسي: تأخر معالجة طلبات الحجز. يُنصح بتقليل وقت المعالجة من 4.2 يوم إلى 24 ساعة.</p>
            </div>
          </div>
        )
      case 'recommendations':
        return (
          <div className="space-y-3 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              <StatsCard title="توصيات نشطة" value="4" icon={Lightbulb} delay={0} />
              <StatsCard title="تأثير متوقع" value="+2.1M ر.س" icon={DollarSign} delay={0.1} />
            </div>
            {recommendations.map((rec, i) => (
              <motion.div key={rec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-card/30 hover:bg-card/50 transition-colors border border-border/20">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', rec.impact === 'عالي' ? 'bg-gold/15 text-gold' : 'bg-blue-500/15 text-blue-400')}>{rec.impact}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-gold">ثقة: {rec.confidence}%</span>
                  <span className="text-muted-foreground">{rec.category}</span>
                  <button onClick={() => toast.info('تطبيق التوصية — قريباً')} className="mr-auto text-gold hover:underline flex items-center gap-1"><Zap size={10} />تطبيق</button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      case 'risk-assessment':
        return (
          <div className="space-y-4 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="مستوى المخاطر" value="متوسط" icon={Shield} delay={0} />
              <StatsCard title="مخاطر عالية" value="3" icon={AlertTriangle} delay={0.1} />
              <StatsCard title="مخاطر مُعالجة" value="12" icon={CheckCircle} delay={0.2} />
            </div>
            {[
              { title: 'مخاطر تشغيلية — تأخر تجهيز المعارض', level: 'عالي', score: 78, mitigation: 'تفعيل نظام الإنذار المبكر + زيادة فريق اللوجستيات' },
              { title: 'مخاطر مالية — تأخر تحصيل الفواتير', level: 'عالي', score: 72, mitigation: 'نظام تذكير تلقائي + خصم 5% للدفع المبكر' },
              { title: 'مخاطر أمنية — هجمات DDoS محتملة', level: 'متوسط', score: 55, mitigation: 'تفعيل CloudFlare + مراقبة 24/7' },
              { title: 'مخاطر سمعة — شكاوى التجار', level: 'منخفض', score: 30, mitigation: 'فريق دعم مخصص + استبيان رضا أسبوعي' },
            ].map((risk, i) => (
              <div key={i} className="p-4 rounded-xl bg-card/30 border border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-foreground">{risk.title}</h4>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', risk.level === 'عالي' ? 'bg-red-500/15 text-red-400' : risk.level === 'متوسط' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400')}>{risk.level}</span>
                </div>
                <div className="h-2 bg-card/50 rounded-full overflow-hidden mb-2">
                  <div className={cn('h-full rounded-full', risk.score > 70 ? 'bg-red-400' : risk.score > 40 ? 'bg-amber-400' : 'bg-emerald-400')} style={{ width: `${risk.score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground"><span className="text-gold">الإجراء:</span> {risk.mitigation}</p>
              </div>
            ))}
          </div>
        )
      // ═══════════════════════════════════════════════════════
      // NEW: Segmentation Dashboard
      // ═══════════════════════════════════════════════════════
      case 'segmentation':
        return (
          <div className="space-y-4 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-3">
              <StatsCard title="إجمالي العملاء" value="154" icon={Users} delay={0} />
              <StatsCard title="شرائح VIP" value="23" icon={Crown} trend={15} delay={0.1} />
              <StatsCard title="متوسط الإنفاق" value={formatCurrency(680000)} icon={DollarSign} delay={0.2} />
              <StatsCard title="معدل الاحتفاظ" value="78%" icon={Target} trend={5} delay={0.3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4 border border-gold/10 rounded-xl">
                <h4 className="text-sm font-bold text-foreground mb-3">توزيع الشرائح</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <RPieChart>
                    <Pie data={segmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {segmentData.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontSize: '11px' }} />
                  </RPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {segmentData.map((seg, i) => (
                  <div key={i} className="p-3 rounded-xl bg-card/30 border border-border/20 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">{seg.name}</p>
                      <p className="text-[10px] text-muted-foreground">{seg.count} عميل — متوسط: {formatCurrency(seg.avgSpend)}</p>
                    </div>
                    <span className="text-sm font-bold font-mono text-foreground">{seg.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gold/5 border border-gold/15">
              <p className="text-xs font-bold text-gold mb-1">توصية AI للتقسيم</p>
              <p className="text-[11px] text-muted-foreground">15 عميل من شريحة B على وشك الترقية لشريحة A (إنفاق أكثر من 400K). يُنصح بعرض حزمة ترقية مخصصة لزيادة الإيرادات بـ 2.4M ر.س.</p>
            </div>
          </div>
        )
      // ═══════════════════════════════════════════════════════
      // NEW: Auto-Schedule Dashboard
      // ═══════════════════════════════════════════════════════
      case 'auto-schedule':
        return (
          <div className="space-y-4 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="فعاليات مجدولة" value="8" icon={Calendar} delay={0} />
              <StatsCard title="تحسينات مقترحة" value="3" icon={Lightbulb} delay={0.1} />
              <StatsCard title="زيادة الحضور المتوقعة" value="+28%" icon={TrendingUp} delay={0.2} />
            </div>
            <div className="space-y-3">
              {scheduleOptimizations.map((opt, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-card/30 border border-gold/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-foreground">{opt.event}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold">ثقة {opt.confidence}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/15">
                      <p className="text-[10px] text-red-400">الموعد الحالي</p>
                      <p className="text-xs font-bold text-foreground">{opt.current}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                      <p className="text-[10px] text-emerald-400">الموعد المقترح</p>
                      <p className="text-xs font-bold text-foreground">{opt.suggested}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{opt.reason}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => toast.success('تم قبول التحسين')} className="text-[10px] px-3 py-1.5 rounded-lg bg-gold/12 text-gold border border-gold/20 hover:bg-gold/22">قبول</button>
                    <button onClick={() => toast.info('تم التأجيل')} className="text-[10px] px-3 py-1.5 rounded-lg bg-card/50 text-muted-foreground border border-border/30 hover:bg-card/70">تأجيل</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      // ═══════════════════════════════════════════════════════
      // NEW: Content Generation Dashboard
      // ═══════════════════════════════════════════════════════
      case 'content-gen':
        return (
          <div className="space-y-4 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="محتوى مُولّد" value="47" icon={FileText} delay={0} />
              <StatsCard title="جودة متوسطة" value="91%" icon={Star} delay={0.1} />
              <StatsCard title="وقت التوليد" value="2.3 دقيقة" icon={Clock} delay={0.2} />
            </div>
            <div className="space-y-2">
              {generatedContent.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-card/30 border border-border/20 hover:border-gold/15 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <FileText size={16} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{item.type}</span>
                      <span className="text-[10px] text-muted-foreground">{item.lang}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full', item.status === 'جاهز' || item.status === 'مكتمل' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400')}>{item.status}</span>
                    <p className="text-[10px] text-gold mt-1">جودة: {item.quality}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => toast.info('توليد محتوى جديد — قريباً')} className="w-full p-3 rounded-xl border border-dashed border-gold/20 text-gold text-xs hover:bg-gold/5 transition-all flex items-center justify-center gap-2">
              <Sparkles size={14} /> توليد محتوى جديد بالذكاء الاصطناعي
            </button>
          </div>
        )
      // ═══════════════════════════════════════════════════════
      // NEW: Performance Optimizer Dashboard
      // ═══════════════════════════════════════════════════════
      case 'performance':
        return (
          <div className="space-y-4 p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-3">
              <StatsCard title="الأداء العام" value="84.6%" icon={Activity} trend={3} delay={0} />
              <StatsCard title="أقسام فوق الهدف" value="2/5" icon={Target} delay={0.1} />
              <StatsCard title="تحسينات مقترحة" value="8" icon={Lightbulb} delay={0.2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4 border border-gold/10 rounded-xl">
                <h4 className="text-sm font-bold text-foreground mb-3">رادار الأداء</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarPerf}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'Cairo' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }} />
                    <Radar name="الأداء" dataKey="score" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {performanceMetrics.map((dept, i) => (
                  <div key={i} className="p-3 rounded-xl bg-card/30 border border-border/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">{dept.dept}</span>
                      <div className="flex items-center gap-1">
                        {dept.trend === 'up' ? <TrendingUp size={10} className="text-emerald-400" /> : <TrendingDown size={10} className="text-red-400" />}
                        <span className={cn('text-xs font-bold font-mono', dept.current >= dept.target ? 'text-emerald-400' : 'text-amber-400')}>{dept.current}%</span>
                        <span className="text-[9px] text-muted-foreground">/ {dept.target}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-card/50 rounded-full overflow-hidden mb-1.5">
                      <div className={cn('h-full rounded-full', dept.current >= dept.target ? 'bg-emerald-400' : 'bg-amber-400')} style={{ width: `${dept.current}%` }} />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dept.kpis.map((kpi, j) => (
                        <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-card/50 text-muted-foreground">{kpi}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const hasCustomDashboard = ['lead-scoring', 'revenue-forecast', 'anomaly-detection', 'sentiment', 'recommendations', 'risk-assessment', 'segmentation', 'auto-schedule', 'content-gen', 'performance'].includes(activeModule)
  const showChat = !hasCustomDashboard || activeModule === 'executive-brain' || activeModule === 'chatbot'

  return (
    <AdminLayout>
      <PageHeader
        title="العقل التنفيذي — الذكاء الاصطناعي"
        subtitle="12 وحدة ذكاء اصطناعي متكاملة لدعم القرارات التنفيذية"
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu size={12} /> 12 وحدة نشطة
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: 'calc(100vh - 12rem)' }}>
        {/* AI Modules Sidebar */}
        <div className="glass-card p-3 overflow-y-auto border border-gold/10 rounded-xl">
          <p className="text-[10px] font-bold text-gold/60 uppercase tracking-widest px-2 mb-3">وحدات AI</p>
          <div className="space-y-1">
            {aiModules.map(m => (
              <button key={m.id} onClick={() => setActiveModule(m.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all', activeModule === m.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:bg-card/50 hover:text-foreground border border-transparent')}>
                <m.icon size={16} className={activeModule === m.id ? 'text-gold' : ''} />
                <div className="text-right flex-1">
                  <p className="font-medium text-xs">{m.label}</p>
                  <p className="text-[9px] text-muted-foreground">{m.accuracy}% دقة</p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden border border-gold/10 rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <mod.icon size={18} className="text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{mod.label}</h3>
                <p className="text-[11px] text-muted-foreground">{mod.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold">{mod.accuracy}% دقة</span>
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> متصل
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeModule} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
              {hasCustomDashboard && activeModule !== 'executive-brain' && activeModule !== 'chatbot' && renderModuleContent()}

              {showChat && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', msg.role === 'ai' ? 'bg-gold/10 border border-gold/20' : 'bg-card/50 border border-border/30')}>
                            {msg.role === 'ai' ? <Brain size={14} className="text-gold" /> : <Users size={14} className="text-muted-foreground" />}
                          </div>
                          <div className={cn('max-w-[75%] p-3 rounded-xl text-sm leading-relaxed', msg.role === 'ai' ? 'bg-card/30 border border-border/30 text-foreground' : 'bg-gold/10 border border-gold/20 text-foreground')}>
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {loading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                          <Brain size={14} className="text-gold animate-pulse" />
                        </div>
                        <div className="bg-card/30 border border-border/30 p-3 rounded-xl">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 border-t border-border/50">
                    <form onSubmit={e => { e.preventDefault(); handleSend() }} className="flex items-center gap-2">
                      <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={`اسأل ${mod.label}...`} className="flex-1 h-11 px-4 rounded-xl bg-card/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
                      <button type="submit" disabled={!query.trim() || loading} className="h-11 px-5 rounded-xl bg-gradient-to-l from-gold via-gold to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 disabled:opacity-50 transition-all flex items-center gap-2">
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  )
}
