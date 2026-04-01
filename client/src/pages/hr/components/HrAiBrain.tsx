/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR AI Executive Brain
 * ═══════════════════════════════════════════════════════════════════════════
 * AI-powered HR intelligence: predictive analytics, turnover prediction,
 * salary benchmarking, workforce planning, chatbot, smart recommendations
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Sparkles, TrendingUp, TrendingDown, Users, Target,
  AlertTriangle, Zap, MessageSquare, Send, BarChart3, Shield,
  Lightbulb, Eye, ArrowRight, CheckCircle2, Clock, Star,
  DollarSign, UserMinus, UserPlus, Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmployeeAvatar, MiniProgress, MetricBox, SectionCard } from './HrShared'
import type { AIHRInsight, Employee } from '../hrTypes'

interface HrAiBrainProps {
  insights: AIHRInsight[]
  employees: Employee[]
}

export default function HrAiBrain({ insights, employees }: HrAiBrainProps) {
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'مرحباً نور! أنا العقل التنفيذي لإدارة الموارد البشرية في Maham Expo. يمكنني مساعدتك في تحليل بيانات الموظفين، التنبؤ بمعدل الدوران، مقارنة الرواتب بالسوق، وتقديم توصيات ذكية. كيف يمكنني مساعدتك؟' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [activeSection, setActiveSection] = useState<'insights' | 'predictions' | 'chat'>('insights')

  // AI Predictions
  const predictions = useMemo(() => [
    {
      title: 'توقع معدل الدوران الوظيفي',
      value: '8.5%',
      trend: 'down',
      detail: 'انخفاض متوقع بنسبة 2.1% مقارنة بالربع السابق بفضل برنامج الاحتفاظ بالمواهب',
      confidence: 87,
      icon: UserMinus,
      color: 'success'
    },
    {
      title: 'الحاجة للتوظيف — Q2 2026',
      value: '7 موظفين',
      trend: 'up',
      detail: 'مطلوب 3 مطورين، 2 مبيعات، 1 تسويق، 1 عمليات لتغطية النمو المتوقع',
      confidence: 92,
      icon: UserPlus,
      color: 'gold'
    },
    {
      title: 'مؤشر رضا الموظفين',
      value: '82%',
      trend: 'up',
      detail: 'تحسن ملحوظ بعد تطبيق نظام المكافآت الجديد وبرنامج التطوير المهني',
      confidence: 78,
      icon: Star,
      color: 'success'
    },
    {
      title: 'فجوة الرواتب مع السوق',
      value: '+4.2%',
      trend: 'up',
      detail: 'رواتب Maham Expo أعلى من متوسط السوق بـ 4.2% — ميزة تنافسية في الاستقطاب',
      confidence: 85,
      icon: DollarSign,
      color: 'gold'
    },
  ], [])

  // AI-powered employee risk analysis
  const riskEmployees = useMemo(() => {
    return employees
      .map(emp => {
        let risk = 0
        if (emp.performance_score < 70) risk += 30
        if (emp.attendance_rate < 90) risk += 20
        if (emp.leaves_taken > 15) risk += 15
        if (emp.performance_rating === 'below' || emp.performance_rating === 'unsatisfactory') risk += 25
        const tenure = (new Date().getTime() - new Date(emp.join_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        if (tenure > 3 && emp.performance_score > 85) risk += 10 // High performers with long tenure may leave
        return { ...emp, risk: Math.min(risk, 100) }
      })
      .filter(e => e.risk > 20)
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 6)
  }, [employees])

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setChatInput('')

    // Simulate AI response
    setTimeout(() => {
      let response = ''
      if (userMsg.includes('دوران') || userMsg.includes('استقالة') || userMsg.includes('ترك')) {
        response = `بناءً على تحليل بيانات 12 موظف، معدل الدوران المتوقع للربع القادم هو 8.5%. الموظفون الأكثر عرضة للمغادرة: ${riskEmployees.slice(0, 2).map(e => e.full_name_ar).join('، ')}. أوصي بـ: 1) مراجعة حزم التعويضات 2) جلسات one-on-one مع المديرين 3) تفعيل برنامج التطوير المهني.`
      } else if (userMsg.includes('راتب') || userMsg.includes('رواتب') || userMsg.includes('تعويض')) {
        response = `متوسط الرواتب في Maham Expo: ${Math.round(employees.reduce((s, e) => s + e.total_salary, 0) / employees.length).toLocaleString()} ر.س. مقارنة بالسوق السعودي، نحن أعلى بـ 4.2%. الأقسام التي تحتاج مراجعة: العمليات (أقل من السوق بـ 3%) وتقنية المعلومات (أقل بـ 1.5%).`
      } else if (userMsg.includes('أداء') || userMsg.includes('تقييم')) {
        response = `متوسط الأداء العام: ${Math.round(employees.reduce((s, e) => s + e.performance_score, 0) / employees.length)}%. أعلى أداء: ${employees.sort((a, b) => b.performance_score - a.performance_score).slice(0, 3).map(e => `${e.full_name_ar} (${e.performance_score}%)`).join('، ')}. أوصي بتفعيل برنامج مكافآت الأداء المتميز.`
      } else if (userMsg.includes('سعودة') || userMsg.includes('نطاقات') || userMsg.includes('توطين')) {
        const saudis = employees.filter(e => e.nationality === 'saudi').length
        const rate = Math.round((saudis / employees.length) * 100)
        response = `نسبة السعودة الحالية: ${rate}% (${saudis} من ${employees.length}). التصنيف: ${rate >= 80 ? 'بلاتيني' : rate >= 60 ? 'أخضر مرتفع' : 'أخضر متوسط'}. لتحسين النسبة، أوصي بـ: 1) التركيز على توظيف سعوديين في الأقسام ذات النسب المنخفضة 2) برنامج تدريب وتأهيل 3) الاستفادة من برنامج دعم التوظيف (هدف).`
      } else {
        response = `شكراً لسؤالك. بناءً على تحليل بيانات ${employees.length} موظف في Maham Expo، إليك ملخص سريع: متوسط الأداء ${Math.round(employees.reduce((s, e) => s + e.performance_score, 0) / employees.length)}%، معدل الحضور ${Math.round(employees.reduce((s, e) => s + e.attendance_rate, 0) / employees.length)}%، نسبة السعودة ${Math.round((employees.filter(e => e.nationality === 'saudi').length / employees.length) * 100)}%. هل تريد تفاصيل أكثر عن موضوع محدد؟`
      }
      setChatMessages(prev => [...prev, { role: 'ai', text: response }])
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {/* ─── AI Brain Header ───────────────────────────────────────────── */}
      <div className="glass-card p-4 sm:p-6 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
            <Brain size={24} className="text-gold" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">العقل التنفيذي — Maham AI HR Brain</h3>
            <p className="text-[10px] text-muted-foreground">تحليلات تنبؤية • توصيات ذكية • أتمتة القرارات • امتثال تلقائي</p>
          </div>
        </div>
        <div className="flex items-center bg-surface2/30 rounded-xl border border-border/20 overflow-hidden">
          {[
            { id: 'insights' as const, label: 'رؤى ذكية', icon: Lightbulb },
            { id: 'predictions' as const, label: 'تنبؤات', icon: TrendingUp },
            { id: 'chat' as const, label: 'محادثة AI', icon: MessageSquare },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)}
              className={cn('flex-1 h-9 text-[10px] flex items-center justify-center gap-1.5 transition-all',
                activeSection === tab.id ? 'bg-gold/10 text-gold font-bold' : 'text-muted-foreground hover:text-foreground')}>
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── AI Insights ───────────────────────────────────────────────── */}
      {activeSection === 'insights' && (
        <div className="space-y-4">
          {/* Insights Cards */}
          <div className="space-y-2">
            {insights.map(insight => (
              <motion.div key={insight.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={cn('glass-card p-3 sm:p-4 transition-all',
                  insight.priority === 'critical' ? 'border-danger/20' : insight.priority === 'high' ? 'border-warning/20' : 'border-border/10')}>
                <div className="flex items-start gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    insight.priority === 'critical' ? 'bg-danger/10' : insight.priority === 'high' ? 'bg-warning/10' : 'bg-gold/10')}>
                    <Sparkles size={16} className={insight.priority === 'critical' ? 'text-danger' : insight.priority === 'high' ? 'text-warning' : 'text-gold'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-xs font-bold text-foreground">{insight.title}</h4>
                      <span className={cn('text-[8px] px-1.5 py-0.5 rounded-full',
                        insight.priority === 'critical' ? 'bg-danger/10 text-danger' : insight.priority === 'high' ? 'bg-warning/10 text-warning' : 'bg-gold/10 text-gold')}>
                        {insight.priority === 'critical' ? 'حرج' : insight.priority === 'high' ? 'عالي' : insight.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-surface2/50 text-muted-foreground">{insight.category}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">{insight.description}</p>
                    <div className="p-2 rounded-lg bg-gold/5 border border-gold/10">
                      <span className="text-[9px] text-gold flex items-center gap-1"><Zap size={10} /> التوصية: {insight.recommendation}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[8px] text-muted-foreground">الأثر: {insight.impact}</span>
                      <span className="text-[8px] text-muted-foreground flex items-center gap-1">
                        <Activity size={8} /> الثقة: {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Risk Employees */}
          <SectionCard title="تحليل مخاطر الموظفين — AI Risk Analysis" icon={AlertTriangle}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {riskEmployees.map(emp => (
                <div key={emp.id} className="p-3 rounded-xl bg-surface2/20 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <EmployeeAvatar name={emp.full_name_ar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-foreground truncate">{emp.full_name_ar}</p>
                      <p className="text-[8px] text-muted-foreground">{emp.department_name}</p>
                    </div>
                    <span className={cn('text-[9px] font-mono font-bold px-1.5 py-0.5 rounded',
                      emp.risk >= 60 ? 'bg-danger/10 text-danger' : emp.risk >= 40 ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info')}>
                      {emp.risk}%
                    </span>
                  </div>
                  <MiniProgress value={emp.risk} color={emp.risk >= 60 ? 'danger' : emp.risk >= 40 ? 'warning' : 'info'} size="xs" />
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[8px] text-muted-foreground">أداء: {emp.performance_score}%</span>
                    <span className="text-[8px] text-muted-foreground">حضور: {emp.attendance_rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ─── AI Predictions ────────────────────────────────────────────── */}
      {activeSection === 'predictions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {predictions.map(pred => (
            <motion.div key={pred.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 hover:border-gold/20 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', `bg-${pred.color}/10`)}>
                  <pred.icon size={20} className={`text-${pred.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-foreground mb-0.5">{pred.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono text-foreground">{pred.value}</span>
                    {pred.trend === 'up' ? <TrendingUp size={14} className="text-success" /> : <TrendingDown size={14} className="text-danger" />}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">{pred.detail}</p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground">مستوى الثقة:</span>
                <MiniProgress value={pred.confidence} color="gold" size="xs" />
                <span className="text-[9px] font-mono text-gold">{pred.confidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── AI Chat ───────────────────────────────────────────────────── */}
      {activeSection === 'chat' && (
        <div className="glass-card overflow-hidden">
          <div className="h-[400px] overflow-y-auto p-3 sm:p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={cn('flex', msg.role === 'user' ? 'justify-start' : 'justify-end')}>
                <div className={cn('max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-gold/10 text-foreground rounded-tr-sm'
                    : 'bg-surface2/50 text-foreground rounded-tl-sm border border-border/20')}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Brain size={12} className="text-gold" />
                      <span className="text-[9px] font-bold text-gold">Maham AI</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="p-3 border-t border-border/20">
            <div className="flex items-center gap-2">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="اسأل عن الرواتب، الأداء، السعودة، الدوران الوظيفي..."
                className="flex-1 h-10 px-4 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
              <button onClick={handleSendChat}
                className="h-10 w-10 rounded-xl bg-gold/10 hover:bg-gold/20 flex items-center justify-center text-gold transition-all">
                <Send size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {['ما معدل الدوران المتوقع؟', 'حلل الرواتب مقارنة بالسوق', 'ما نسبة السعودة؟', 'من أفضل الموظفين أداءً؟'].map(q => (
                <button key={q} onClick={() => { setChatInput(q); }}
                  className="text-[8px] px-2 py-1 rounded-lg bg-surface2/30 text-muted-foreground hover:text-gold hover:bg-gold/5 transition-all border border-border/10">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
