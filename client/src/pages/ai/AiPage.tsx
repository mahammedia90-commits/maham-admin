/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — الذكاء الاصطناعي (AI Executive Brain)
 * Features: محادثة AI، تحليلات ذكية، توصيات، وحدات AI
 * ═══════════════════════════════════════════════════════
 */
import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Sparkles, TrendingUp, AlertTriangle, Users,
  BarChart3, Shield, Lightbulb, Zap, Activity, Target,
  DollarSign, Calendar, RefreshCw, Bot, User, Copy,
  ChevronDown, Cpu, Eye, FileText, Globe
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Message { id: number; role: 'user' | 'ai'; content: string; timestamp: string; module?: string }
interface AiInsight { id: number; title: string; description: string; type: 'warning' | 'success' | 'info' | 'danger'; module: string; priority: string }

const aiModules = [
  { id: 'executive-brain', label: 'العقل التنفيذي', icon: Brain, desc: 'استشارات ذكية وتحليل شامل', color: 'text-gold' },
  { id: 'sales-ai', label: 'ذكاء المبيعات', icon: TrendingUp, desc: 'تنبؤات وتحليل مبيعات', color: 'text-success' },
  { id: 'risk-ai', label: 'تحليل المخاطر', icon: Shield, desc: 'كشف المخاطر والتنبيهات', color: 'text-danger' },
  { id: 'marketing-ai', label: 'ذكاء التسويق', icon: Target, desc: 'تحسين الحملات والاستهداف', color: 'text-info' },
  { id: 'operations-ai', label: 'ذكاء العمليات', icon: Activity, desc: 'تحسين الكفاءة التشغيلية', color: 'text-warning' },
  { id: 'finance-ai', label: 'ذكاء مالي', icon: DollarSign, desc: 'تحليل مالي وتنبؤات', color: 'text-chrome' },
]

const demoInsights: AiInsight[] = [
  { id: 1, title: 'فرصة مبيعات عالية', description: 'شركة أرامكو أبدت اهتماماً بالرعاية الاستراتيجية. احتمالية الإغلاق 72%. يُنصح بجدولة اجتماع خلال 48 ساعة.', type: 'success', module: 'sales-ai', priority: 'high' },
  { id: 2, title: 'تنبيه: رخصة الدفاع المدني', description: 'رخصة الدفاع المدني تنتهي خلال 30 يوماً. يجب بدء إجراءات التجديد فوراً لتجنب تأخير المعرض.', type: 'warning', module: 'risk-ai', priority: 'high' },
  { id: 3, title: 'أداء حملة Google Ads', description: 'حملة معرض الرياض 2026 تحقق ROI +245%. يُنصح بزيادة الميزانية 20% للاستفادة من الأداء المرتفع.', type: 'info', module: 'marketing-ai', priority: 'medium' },
  { id: 4, title: 'تأخر في العمليات', description: 'مهمة تجهيز مواقف السيارات متأخرة 5 أيام. التقدم الحالي 20%. يُنصح بتخصيص فريق إضافي.', type: 'danger', module: 'operations-ai', priority: 'high' },
  { id: 5, title: 'تحسين التدفق النقدي', description: '3 فواتير مستحقة بقيمة 245,000 ر.س. يُنصح بإرسال تذكيرات دفع تلقائية.', type: 'warning', module: 'finance-ai', priority: 'medium' },
  { id: 6, title: 'أداء الموظفين', description: 'متوسط أداء فريق المبيعات ارتفع 8% هذا الشهر. أحمد محمد يحقق أعلى أداء بمعدل 92%.', type: 'success', module: 'executive-brain', priority: 'low' },
]

const aiResponses: Record<string, string[]> = {
  'executive-brain': [
    'بناءً على تحليل البيانات الحالية، أنصح بالتركيز على 3 محاور رئيسية:\n\n1. **تسريع إغلاق صفقة أرامكو** — القيمة المحتملة 1.2M ر.س\n2. **تجديد رخصة الدفاع المدني** — لتجنب تأخير المعرض\n3. **زيادة ميزانية Google Ads** — الأداء الحالي ممتاز\n\nالأولوية القصوى هي تأمين رعاية أرامكو لأنها ستغطي 40% من تكاليف المعرض.',
    'تحليل الوضع المالي يُظهر أن الإيرادات المتوقعة للربع القادم تتجاوز 4.5M ر.س. نقاط القوة: تنوع مصادر الدخل. نقاط الضعف: تأخر 3 فواتير مستحقة.',
  ],
  'sales-ai': [
    'تحليل خط المبيعات:\n\n- **8 صفقات نشطة** بقيمة إجمالية 4.3M ر.س\n- **القيمة المرجحة**: 2.8M ر.س\n- **أعلى احتمالية إغلاق**: حجز المراعي (95%)\n- **أكبر قيمة**: رعاية أرامكو (1.2M ر.س)\n\nتوصية: ركّز على الصفقات ذات الاحتمالية > 70% لتحقيق الهدف الربعي.',
  ],
  'risk-ai': [
    'تم رصد 3 مخاطر تحتاج اهتمام:\n\n🔴 **عالية**: رخصة الدفاع المدني — تنتهي خلال 30 يوم\n🟡 **متوسطة**: امتثال NCA — غير مكتمل\n🟢 **منخفضة**: تأخر مواقف السيارات — قابل للتعويض\n\nالتوصية: معالجة المخاطر العالية خلال 48 ساعة.',
  ],
}

export default function AiPage() {
  const [activeModule, setActiveModule] = useState('executive-brain')
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'modules'>('chat')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', content: 'مرحباً نور! أنا العقل التنفيذي لـ Maham Expo. كيف يمكنني مساعدتك اليوم؟\n\nيمكنني تحليل البيانات، تقديم توصيات، أو الإجابة على أسئلتك حول أي قسم في النظام.', timestamp: '09:00', module: 'executive-brain' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: messages.length + 1, role: 'user', content: input, timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }), module: activeModule }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const responses = aiResponses[activeModule] || aiResponses['executive-brain']
      const response = responses[Math.floor(Math.random() * responses.length)]
      const aiMsg: Message = { id: messages.length + 2, role: 'ai', content: response, timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }), module: activeModule }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const insightIcon = (type: string) => type === 'success' ? Sparkles : type === 'warning' ? AlertTriangle : type === 'danger' ? AlertTriangle : Lightbulb
  const insightColor = (type: string) => type === 'success' ? 'border-success/30 bg-success/5' : type === 'warning' ? 'border-warning/30 bg-warning/5' : type === 'danger' ? 'border-danger/30 bg-danger/5' : 'border-info/30 bg-info/5'
  const insightIconColor = (type: string) => type === 'success' ? 'text-success' : type === 'warning' ? 'text-warning' : type === 'danger' ? 'text-danger' : 'text-info'

  return (
    <AdminLayout>
      <PageHeader
        title="الذكاء الاصطناعي — العقل التنفيذي"
        subtitle="Maham AI — تحليلات ذكية وتوصيات تنفيذية"
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> متصل</span>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="رؤى نشطة" value={String(demoInsights.length)} icon={Lightbulb} delay={0} />
        <StatsCard title="تنبيهات عالية" value={String(demoInsights.filter(i => i.priority === 'high').length)} icon={AlertTriangle} delay={0.05} />
        <StatsCard title="وحدات AI" value={String(aiModules.length)} icon={Cpu} delay={0.1} />
        <StatsCard title="دقة التنبؤ" value="94%" icon={Target} trend={2} trendLabel="تحسن" delay={0.15} />
      </div>

      {/* تبويبات */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
        {[
          { key: 'chat' as const, label: 'المحادثة', icon: Bot },
          { key: 'insights' as const, label: 'الرؤى', icon: Sparkles },
          { key: 'modules' as const, label: 'الوحدات', icon: Cpu },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', activeTab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* المحادثة */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* اختيار الوحدة */}
          <div className="lg:col-span-1 space-y-2">
            {aiModules.map(m => (
              <button key={m.id} onClick={() => setActiveModule(m.id)}
                className={cn('w-full p-3 rounded-xl text-right transition-all flex items-center gap-3', activeModule === m.id ? 'glass-card border-gold/30 bg-gold/5' : 'bg-surface2/30 hover:bg-surface2/50 border border-transparent')}>
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', activeModule === m.id ? 'bg-gold/10' : 'bg-surface2')}>
                  <m.icon size={16} className={activeModule === m.id ? 'text-gold' : 'text-muted-foreground'} />
                </div>
                <div className="flex-1 min-w-0"><p className={cn('text-xs font-bold', activeModule === m.id ? 'text-foreground' : 'text-muted-foreground')}>{m.label}</p><p className="text-[9px] text-muted-foreground truncate">{m.desc}</p></div>
              </button>
            ))}
          </div>

          {/* نافذة المحادثة */}
          <div className="lg:col-span-3 glass-card flex flex-col h-[500px]">
            <div className="p-4 border-b border-border/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center"><Brain size={16} className="text-gold" /></div>
              <div><p className="text-sm font-bold text-foreground">{aiModules.find(m => m.id === activeModule)?.label}</p><p className="text-[10px] text-muted-foreground">{aiModules.find(m => m.id === activeModule)?.desc}</p></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', msg.role === 'ai' ? 'bg-gold/10' : 'bg-info/10')}>
                    {msg.role === 'ai' ? <Bot size={14} className="text-gold" /> : <User size={14} className="text-info" />}
                  </div>
                  <div className={cn('max-w-[80%] p-3 rounded-xl text-sm', msg.role === 'ai' ? 'bg-surface2/50 border border-border/30 text-foreground' : 'bg-gold/10 border border-gold/20 text-foreground')}>
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block">{line.replace(/\*\*/g, '')}</strong>
                      if (line.includes('**')) return <span key={i} className="block" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      return <span key={i} className="block">{line}</span>
                    })}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] text-muted-foreground">{msg.timestamp}</span>
                      {msg.role === 'ai' && <button onClick={() => { navigator.clipboard.writeText(msg.content); toast.success('تم النسخ') }} className="p-1 rounded hover:bg-surface3 text-muted-foreground hover:text-foreground transition-colors"><Copy size={10} /></button>}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center"><Bot size={14} className="text-gold" /></div>
                  <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} /><span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} /></div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اسأل العقل التنفيذي..." className="flex-1 h-10 px-4 rounded-xl bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
                <button onClick={handleSend} disabled={!input.trim() || isTyping}
                  className="h-10 w-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black flex items-center justify-center hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-50">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الرؤى */}
      {activeTab === 'insights' && (
        <div className="space-y-3">
          {demoInsights.map((insight, i) => {
            const IIcon = insightIcon(insight.type)
            return (
              <motion.div key={insight.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={cn('glass-card p-3 sm:p-4 lg:p-5 border', insightColor(insight.type))}>
                <div className="flex items-start gap-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', insightColor(insight.type))}>
                    <IIcon size={18} className={insightIconColor(insight.type)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-foreground">{insight.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface2 text-muted-foreground">{aiModules.find(m => m.id === insight.module)?.label}</span>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full', insight.priority === 'high' ? 'bg-danger/10 text-danger' : insight.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info')}>{insight.priority === 'high' ? 'عالية' : insight.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* الوحدات */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {aiModules.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-3 sm:p-4 lg:p-5 hover:border-gold/20 transition-all cursor-pointer group" onClick={() => { setActiveModule(m.id); setActiveTab('chat') }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:scale-105 transition-transform"><m.icon size={22} className={m.color} /></div>
                <div><h3 className="text-sm font-bold text-foreground">{m.label}</h3><p className="text-[10px] text-muted-foreground">{m.desc}</p></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] text-success"><span className="w-1.5 h-1.5 rounded-full bg-success" />نشط</span>
                <span className="text-[10px] text-muted-foreground group-hover:text-gold transition-colors">فتح المحادثة →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
