import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Sparkles, TrendingUp, AlertTriangle, Users,
  BarChart3, Shield, Lightbulb, Zap, Activity, Target,
  PieChart, DollarSign, Calendar, RefreshCw
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import { aiApi } from '@/api'
import { toast } from 'sonner'

const aiModules = [
  { id: 'executive-brain', label: 'العقل التنفيذي', icon: Brain, desc: 'استشارات ذكية وتحليل شامل' },
  { id: 'lead-scoring', label: 'تقييم العملاء', icon: Target, desc: 'تسجيل وتقييم العملاء المحتملين' },
  { id: 'revenue-forecast', label: 'توقع الإيرادات', icon: TrendingUp, desc: 'تنبؤات مالية دقيقة' },
  { id: 'anomaly-detection', label: 'كشف الشذوذ', icon: AlertTriangle, desc: 'اكتشاف الأنماط غير الطبيعية' },
  { id: 'sentiment', label: 'تحليل المشاعر', icon: Sparkles, desc: 'فهم ردود فعل العملاء' },
  { id: 'recommendations', label: 'التوصيات', icon: Lightbulb, desc: 'اقتراحات ذكية مخصصة' },
  { id: 'risk-assessment', label: 'تقييم المخاطر', icon: Shield, desc: 'تحليل وإدارة المخاطر' },
  { id: 'segmentation', label: 'تقسيم العملاء', icon: PieChart, desc: 'تصنيف ذكي للعملاء' },
  { id: 'chatbot', label: 'المساعد الذكي', icon: Zap, desc: 'محادثة ذكية تفاعلية' },
  { id: 'auto-schedule', label: 'الجدولة التلقائية', icon: Calendar, desc: 'تنظيم تلقائي للفعاليات' },
  { id: 'content-gen', label: 'توليد المحتوى', icon: Sparkles, desc: 'إنشاء محتوى تسويقي' },
  { id: 'performance', label: 'تحسين الأداء', icon: Activity, desc: 'تحليل وتحسين الكفاءة' },
]

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function AiPage() {
  const [activeModule, setActiveModule] = useState('executive-brain')
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: 'مرحباً! أنا العقل التنفيذي لمنصة ماهم إكسبو. يمكنني مساعدتك في تحليل البيانات، تقديم التوصيات، وتوقع الاتجاهات. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    }
  ])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!query.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: query, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setLoading(true)

    try {
      const res = await aiApi.executiveBrain({ query: query })
      setMessages(prev => [...prev, {
        role: 'ai',
        content: res.response || res.data?.response || 'تم معالجة طلبك بنجاح.',
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'عذراً، حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const activeModuleData = aiModules.find(m => m.id === activeModule)

  return (
    <AdminLayout>
      <PageHeader
        title="العقل التنفيذي — الذكاء الاصطناعي"
        subtitle="12 وحدة ذكاء اصطناعي متكاملة لدعم القرارات التنفيذية"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
        {/* AI Modules Sidebar */}
        <div className="glass-card p-3 overflow-y-auto">
          <p className="text-[10px] font-bold text-gold/60 uppercase tracking-widest px-2 mb-3">وحدات AI</p>
          <div className="space-y-1">
            {aiModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  activeModule === mod.id
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-muted-foreground hover:bg-surface2 hover:text-foreground border border-transparent'
                )}
              >
                <mod.icon size={16} className={activeModule === mod.id ? 'text-gold' : ''} />
                <div className="text-right">
                  <p className="font-medium text-xs">{mod.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                {activeModuleData && <activeModuleData.icon size={18} className="text-gold" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{activeModuleData?.label}</h3>
                <p className="text-[11px] text-muted-foreground">{activeModuleData?.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-success/10 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                متصل
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-3',
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    msg.role === 'ai' ? 'bg-gold/10 border border-gold/20' : 'bg-chrome/10 border border-chrome/20'
                  )}>
                    {msg.role === 'ai' ? <Brain size={14} className="text-gold" /> : <Users size={14} className="text-chrome" />}
                  </div>
                  <div className={cn(
                    'max-w-[75%] p-3 rounded-xl text-sm leading-relaxed',
                    msg.role === 'ai'
                      ? 'bg-surface2/50 border border-border/30 text-foreground'
                      : 'bg-gold/10 border border-gold/20 text-foreground'
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
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
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="اسأل العقل التنفيذي..."
                className="flex-1 h-11 px-4 rounded-xl bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
              />
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="h-11 px-5 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
