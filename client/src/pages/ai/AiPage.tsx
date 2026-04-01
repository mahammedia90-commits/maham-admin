// Design: Nour Theme — AI Executive Brain
// 12 AI Modules with dashboards, chat, and analytics
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Sparkles, TrendingUp, AlertTriangle, Users,
  BarChart3, Shield, Lightbulb, Zap, Activity, Target,
  PieChart, DollarSign, Calendar, RefreshCw, CheckCircle,
  ArrowUpRight, Eye, Clock, MessageSquare, Bot, Cpu
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency } from '@/lib/utils'
import { aiApi } from '@/api'
import { toast } from 'sonner'

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
  { id: 1, type: 'مالي', desc: 'انخفاض مفاجئ في تحصيل فواتير قطاع التجار بنسبة 23%', severity: 'high', date: '2026-03-28' },
  { id: 2, type: 'تشغيلي', desc: 'ارتفاع غير طبيعي في طلبات الإلغاء — معرض الرياض التقني', severity: 'medium', date: '2026-03-27' },
  { id: 3, type: 'أمني', desc: 'محاولات دخول متكررة من IP غير معروف — 47 محاولة', severity: 'high', date: '2026-03-29' },
  { id: 4, type: 'تسويقي', desc: 'انخفاض معدل التحويل في حملة الرعاة الجدد بنسبة 15%', severity: 'low', date: '2026-03-26' },
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

interface ChatMessage { role: 'user' | 'ai'; content: string; timestamp: Date }

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
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-surface2/30 hover:bg-surface2/50 transition-colors">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold', lead.score >= 90 ? 'bg-gold/15 text-gold' : lead.score >= 80 ? 'bg-info/15 text-info' : 'bg-chrome/15 text-chrome')}>{lead.score}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.action} — {formatCurrency(lead.potential)}</p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', lead.segment === 'VIP' ? 'bg-gold/15 text-gold' : lead.segment === 'A' ? 'bg-info/15 text-info' : 'bg-chrome/15 text-chrome')}>{lead.segment}</span>
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
            <div className="glass-card p-4">
              <h4 className="text-sm font-bold text-foreground mb-3">توقعات الإيرادات — النصف الثاني 2026</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={forecastData}>
                  <defs><linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v/1000000}M`} />
                  <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
                  <Area type="monotone" dataKey="predicted" stroke="#C9A84C" fill="url(#predGrad)" strokeWidth={2} strokeDasharray="5 5" name="متوقع" />
                </AreaChart>
              </ResponsiveContainer>
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
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn('p-4 rounded-xl border', a.severity === 'high' ? 'bg-danger/5 border-danger/30' : a.severity === 'medium' ? 'bg-warning/5 border-warning/30' : 'bg-info/5 border-info/30')}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className={a.severity === 'high' ? 'text-danger' : a.severity === 'medium' ? 'text-warning' : 'text-info'} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', a.severity === 'high' ? 'bg-danger/15 text-danger' : a.severity === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info')}>{a.severity === 'high' ? 'خطورة عالية' : a.severity === 'medium' ? 'متوسطة' : 'منخفضة'}</span>
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
            <div className="grid grid-cols-2 gap-3">
              <StatsCard title="المشاعر الإيجابية" value="74%" icon={Sparkles} trend={8} delay={0} />
              <StatsCard title="دقة التحليل" value="87%" icon={Target} delay={0.1} />
            </div>
            <div className="space-y-3">
              {sentimentData.map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface2/30">
                  <p className="text-sm font-bold text-foreground mb-2">{s.category}</p>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div className="bg-success" style={{ width: `${s.positive}%` }} />
                    <div className="bg-chrome/50" style={{ width: `${s.neutral}%` }} />
                    <div className="bg-danger" style={{ width: `${s.negative}%` }} />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                    <span>إيجابي {s.positive}%</span><span>محايد {s.neutral}%</span><span>سلبي {s.negative}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'recommendations':
        return (
          <div className="space-y-3 p-4 overflow-y-auto flex-1">
            {recommendations.map((rec, i) => (
              <motion.div key={rec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-surface2/30 hover:bg-surface2/50 transition-colors border border-border/30">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', rec.impact === 'عالي' ? 'bg-gold/15 text-gold' : 'bg-info/15 text-info')}>{rec.impact}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-gold">ثقة: {rec.confidence}%</span>
                  <span className="text-chrome">{rec.category}</span>
                  <button onClick={() => toast.info('تطبيق التوصية — قريباً')} className="mr-auto text-gold hover:underline">تطبيق</button>
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
              <div key={i} className="p-4 rounded-xl bg-surface2/30 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-foreground">{risk.title}</h4>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', risk.level === 'عالي' ? 'bg-danger/15 text-danger' : risk.level === 'متوسط' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success')}>{risk.level}</span>
                </div>
                <div className="h-2 bg-surface2/50 rounded-full overflow-hidden mb-2">
                  <div className={cn('h-full rounded-full', risk.score > 70 ? 'bg-danger' : risk.score > 40 ? 'bg-warning' : 'bg-success')} style={{ width: `${risk.score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground"><span className="text-gold">الإجراء:</span> {risk.mitigation}</p>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const showChat = ['executive-brain', 'chatbot', 'segmentation', 'auto-schedule', 'content-gen', 'performance'].includes(activeModule)
  const showDashboard = ['lead-scoring', 'revenue-forecast', 'anomaly-detection', 'sentiment', 'recommendations', 'risk-assessment'].includes(activeModule)

  return (
    <AdminLayout>
      <PageHeader
        title="العقل التنفيذي — الذكاء الاصطناعي"
        subtitle="12 وحدة ذكاء اصطناعي متكاملة لدعم القرارات التنفيذية"
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">
              <Cpu size={12} /> 12 وحدة نشطة
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: 'calc(100vh - 12rem)' }}>
        {/* AI Modules Sidebar */}
        <div className="glass-card p-3 overflow-y-auto">
          <p className="text-[10px] font-bold text-gold/60 uppercase tracking-widest px-2 mb-3">وحدات AI</p>
          <div className="space-y-1">
            {aiModules.map(m => (
              <button key={m.id} onClick={() => setActiveModule(m.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all', activeModule === m.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:bg-surface2 hover:text-foreground border border-transparent')}>
                <m.icon size={16} className={activeModule === m.id ? 'text-gold' : ''} />
                <div className="text-right flex-1">
                  <p className="font-medium text-xs">{m.label}</p>
                  <p className="text-[9px] text-muted-foreground">{m.accuracy}% دقة</p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden">
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
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-success/10 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> متصل
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeModule} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
              {showDashboard && renderModuleContent()}

              {showChat && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', msg.role === 'ai' ? 'bg-gold/10 border border-gold/20' : 'bg-chrome/10 border border-chrome/20')}>
                            {msg.role === 'ai' ? <Brain size={14} className="text-gold" /> : <Users size={14} className="text-chrome" />}
                          </div>
                          <div className={cn('max-w-[75%] p-3 rounded-xl text-sm leading-relaxed', msg.role === 'ai' ? 'bg-surface2/50 border border-border/30 text-foreground' : 'bg-gold/10 border border-gold/20 text-foreground')}>
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
                        <div className="bg-surface2/50 border border-border/30 p-3 rounded-xl">
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
                      <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={`اسأل ${mod.label}...`} className="flex-1 h-11 px-4 rounded-xl bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
                      <button type="submit" disabled={!query.trim() || loading} className="h-11 px-5 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 disabled:opacity-50 transition-all flex items-center gap-2">
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
