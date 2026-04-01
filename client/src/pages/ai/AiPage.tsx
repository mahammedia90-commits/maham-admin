/*
 * AiPage — العقل التنفيذي — 12 وحدة AI
 * كل وحدة لها واجهة مستقلة + Chat مشترك
 * Design: Nour Theme — Gold/Dark glassmorphism
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Send, Sparkles, TrendingUp, AlertTriangle, Users,
  BarChart3, Shield, Lightbulb, Zap, Activity, Target,
  PieChart, DollarSign, Calendar, RefreshCw, CheckCircle,
  ArrowUpRight, ArrowDownRight, Eye, FileText, MessageSquare
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { toast } from 'sonner';

// ========== AI MODULES ==========
const aiModules = [
  { id: 'executive-brain', label: 'العقل التنفيذي', icon: Brain, desc: 'استشارات ذكية وتحليل شامل', color: '#C9A84C' },
  { id: 'lead-scoring', label: 'تقييم العملاء', icon: Target, desc: 'تسجيل وتقييم العملاء المحتملين', color: '#3B82F6' },
  { id: 'revenue-forecast', label: 'توقع الإيرادات', icon: TrendingUp, desc: 'تنبؤات مالية دقيقة', color: '#10B981' },
  { id: 'anomaly-detection', label: 'كشف الشذوذ', icon: AlertTriangle, desc: 'اكتشاف الأنماط غير الطبيعية', color: '#EF4444' },
  { id: 'sentiment', label: 'تحليل المشاعر', icon: Sparkles, desc: 'فهم ردود فعل العملاء', color: '#F59E0B' },
  { id: 'recommendations', label: 'التوصيات', icon: Lightbulb, desc: 'اقتراحات ذكية مخصصة', color: '#8B5CF6' },
  { id: 'risk-assessment', label: 'تقييم المخاطر', icon: Shield, desc: 'تحليل وإدارة المخاطر', color: '#EC4899' },
  { id: 'segmentation', label: 'تقسيم العملاء', icon: PieChart, desc: 'تصنيف ذكي للعملاء', color: '#06B6D4' },
  { id: 'chatbot', label: 'المساعد الذكي', icon: Zap, desc: 'محادثة ذكية تفاعلية', color: '#F97316' },
  { id: 'auto-schedule', label: 'الجدولة التلقائية', icon: Calendar, desc: 'تنظيم تلقائي للفعاليات', color: '#14B8A6' },
  { id: 'content-gen', label: 'توليد المحتوى', icon: Sparkles, desc: 'إنشاء محتوى تسويقي', color: '#A855F7' },
  { id: 'performance', label: 'تحسين الأداء', icon: Activity, desc: 'تحليل وتحسين الكفاءة', color: '#22C55E' },
];

interface ChatMessage { role: 'user' | 'ai'; content: string; timestamp: Date; }

// ========== MOCK AI RESPONSES ==========
const aiResponses: Record<string, string[]> = {
  'executive-brain': [
    'بناءً على تحليل البيانات الحالية، أنصح بزيادة ميزانية التسويق الرقمي بنسبة 20% في الربع القادم. معدل التحويل من الحملات الرقمية أعلى بـ 3.5x مقارنة بالتسويق التقليدي.',
    'تحليل الأداء يُظهر أن معرض التقنية 2026 حقق ROI بنسبة 340%. أنصح بتكرار نفس النموذج مع زيادة المساحة بنسبة 15%.',
    'تنبيه: هناك 3 عقود رعاية تنتهي خلال 30 يوم. أنصح بالتواصل الفوري مع الرعاة لتجديدها. احتمالية التجديد: 78% بناءً على تاريخ التعامل.',
  ],
  'lead-scoring': ['تم تحليل 156 عميل محتمل. 23 عميل حصلوا على تقييم A+ (احتمالية تحويل > 85%). أنصح بتخصيص فريق مبيعات مخصص لهم.'],
  'revenue-forecast': ['التوقع المالي للربع القادم: إيرادات متوقعة 2.8M ر.س (±12%). العوامل الرئيسية: موسم المعارض + 3 فعاليات كبرى مجدولة.'],
  'anomaly-detection': ['تم رصد نمط غير طبيعي: زيادة 340% في طلبات الاسترداد من قطاع الأغذية. يُنصح بالتحقيق الفوري.'],
  'sentiment': ['تحليل 2,450 تقييم: 78% إيجابي، 15% محايد، 7% سلبي. أبرز الشكاوى: وقت الانتظار عند التسجيل (32% من السلبية).'],
  'recommendations': ['توصية: إضافة خدمة "الجناح الذكي" مع شاشات تفاعلية. التحليل يُظهر أن 67% من العارضين مستعدون لدفع 30% إضافية لهذه الخدمة.'],
  'risk-assessment': ['مستوى المخاطر الحالي: متوسط (Score: 42/100). أبرز المخاطر: تأخر 2 مورد في التسليم + عقد راعي رئيسي غير مجدد.'],
  'segmentation': ['تم تقسيم العملاء إلى 5 شرائح: VIP (8%)، نشط (25%)، عادي (40%)، خامل (20%)، معرض للخسارة (7%). أنصح بحملة استرجاع للشريحة الأخيرة.'],
  'chatbot': ['المساعد الذكي جاهز. يمكنني الإجابة على استفسارات العملاء، حجز المواعيد، وتقديم معلومات عن الفعاليات.'],
  'auto-schedule': ['تم تحليل 12 فعالية مجدولة. اقتراح: نقل "ورشة التسويق" من الثلاثاء إلى الأربعاء لتجنب تعارض مع 3 فعاليات أخرى.'],
  'content-gen': ['تم إنشاء 5 مسودات لحملة "معرض التقنية 2026": 3 منشورات سوشيال ميديا + 1 بريد إلكتروني + 1 مقال مدونة. جاهزة للمراجعة.'],
  'performance': ['تحليل الأداء: كفاءة الفريق 87% (↑5% عن الشهر الماضي). أبرز التحسينات: تقليل وقت معالجة الطلبات بنسبة 23%.'],
};

// ========== MODULE DASHBOARDS ==========
const leadScoringData = [
  { name: 'A+ (ممتاز)', value: 23, color: '#10B981' },
  { name: 'A (جيد جداً)', value: 45, color: '#3B82F6' },
  { name: 'B (جيد)', value: 52, color: '#F59E0B' },
  { name: 'C (متوسط)', value: 28, color: '#EF4444' },
  { name: 'D (ضعيف)', value: 8, color: '#6B7280' },
];

const forecastData = [
  { month: 'أبريل', actual: 0, forecast: 680000 },
  { month: 'مايو', actual: 0, forecast: 820000 },
  { month: 'يونيو', actual: 0, forecast: 950000 },
  { month: 'يوليو', actual: 0, forecast: 780000 },
  { month: 'أغسطس', actual: 0, forecast: 1100000 },
  { month: 'سبتمبر', actual: 0, forecast: 1250000 },
];

const riskRadarData = [
  { subject: 'مالي', score: 35, max: 100 },
  { subject: 'تشغيلي', score: 55, max: 100 },
  { subject: 'قانوني', score: 20, max: 100 },
  { subject: 'سمعة', score: 15, max: 100 },
  { subject: 'تقني', score: 40, max: 100 },
  { subject: 'بشري', score: 30, max: 100 },
];

const sentimentTrend = [
  { week: 'أسبوع 1', positive: 82, neutral: 12, negative: 6 },
  { week: 'أسبوع 2', positive: 78, neutral: 15, negative: 7 },
  { week: 'أسبوع 3', positive: 85, neutral: 10, negative: 5 },
  { week: 'أسبوع 4', positive: 80, neutral: 13, negative: 7 },
];

function ModuleDashboard({ moduleId }: { moduleId: string }) {
  if (moduleId === 'lead-scoring') return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatsCard title="إجمالي العملاء" value={156} icon={Users} />
        <StatsCard title="A+ Score" value={23} icon={Target} delay={0.1} />
        <StatsCard title="معدل التحويل" value="34%" icon={TrendingUp} delay={0.2} />
      </div>
      <div className="glass-card p-4">
        <h4 className="text-sm font-bold mb-3">توزيع التقييمات</h4>
        <ResponsiveContainer width="100%" height={180}>
          <RPieChart><Pie data={leadScoringData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">{leadScoringData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} /></RPieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-2">{leadScoringData.map(s => <span key={s.name} className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name}: {s.value}</span>)}</div>
      </div>
    </div>
  );

  if (moduleId === 'revenue-forecast') return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatsCard title="توقع Q2" value={formatCurrency(2800000)} icon={DollarSign} />
        <StatsCard title="دقة التوقع" value="88%" icon={Target} delay={0.1} />
        <StatsCard title="النمو المتوقع" value="+22%" icon={TrendingUp} delay={0.2} />
      </div>
      <div className="glass-card p-4">
        <h4 className="text-sm font-bold mb-3">التوقعات المالية — 6 أشهر</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={forecastData}>
            <defs><linearGradient id="fG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
            <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
            <Area type="monotone" dataKey="forecast" stroke="#10B981" fill="url(#fG)" strokeWidth={2} strokeDasharray="5 5" name="التوقع" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (moduleId === 'risk-assessment') return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatsCard title="مستوى المخاطر" value="متوسط" icon={Shield} />
        <StatsCard title="Score" value="42/100" icon={AlertTriangle} delay={0.1} />
        <StatsCard title="تنبيهات نشطة" value={3} icon={AlertTriangle} delay={0.2} />
      </div>
      <div className="glass-card p-4">
        <h4 className="text-sm font-bold mb-3">خريطة المخاطر</h4>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={riskRadarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#888' }} />
            <PolarRadiusAxis tick={{ fontSize: 9, fill: '#666' }} />
            <Radar name="المخاطر" dataKey="score" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (moduleId === 'sentiment') return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatsCard title="إيجابي" value="78%" icon={CheckCircle} />
        <StatsCard title="محايد" value="15%" icon={Activity} delay={0.1} />
        <StatsCard title="سلبي" value="7%" icon={AlertTriangle} delay={0.2} />
      </div>
      <div className="glass-card p-4">
        <h4 className="text-sm font-bold mb-3">اتجاه المشاعر الأسبوعي</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sentimentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#888' }} />
            <YAxis tick={{ fontSize: 10, fill: '#888' }} />
            <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
            <Bar dataKey="positive" fill="#10B981" name="إيجابي" radius={[2, 2, 0, 0]} />
            <Bar dataKey="neutral" fill="#F59E0B" name="محايد" radius={[2, 2, 0, 0]} />
            <Bar dataKey="negative" fill="#EF4444" name="سلبي" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (moduleId === 'segmentation') return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatsCard title="إجمالي العملاء" value={1245} icon={Users} />
        <StatsCard title="الشرائح" value={5} icon={PieChart} delay={0.1} />
      </div>
      <div className="glass-card p-4">
        <h4 className="text-sm font-bold mb-3">شرائح العملاء</h4>
        <div className="space-y-2">
          {[{ name: 'VIP', pct: 8, count: 100, color: '#C9A84C' }, { name: 'نشط', pct: 25, count: 311, color: '#10B981' }, { name: 'عادي', pct: 40, count: 498, color: '#3B82F6' }, { name: 'خامل', pct: 20, count: 249, color: '#F59E0B' }, { name: 'معرض للخسارة', pct: 7, count: 87, color: '#EF4444' }].map(s => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-sm flex-1">{s.name}</span>
              <span className="text-xs font-mono text-muted-foreground">{s.count}</span>
              <div className="w-24 h-1.5 rounded-full bg-card/80 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} /></div>
              <span className="text-xs font-mono w-8 text-left">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (moduleId === 'anomaly-detection') return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatsCard title="شذوذ مكتشف" value={7} icon={AlertTriangle} />
        <StatsCard title="حرج" value={2} icon={AlertTriangle} delay={0.1} />
        <StatsCard title="تم حله" value={4} icon={CheckCircle} delay={0.2} />
      </div>
      <div className="space-y-2">
        {[
          { title: 'زيادة غير طبيعية في طلبات الاسترداد', severity: 'high', time: 'منذ 2 ساعة' },
          { title: 'انخفاض مفاجئ في معدل التحويل', severity: 'high', time: 'منذ 5 ساعات' },
          { title: 'ارتفاع في وقت الاستجابة للخادم', severity: 'medium', time: 'منذ يوم' },
          { title: 'نمط غير عادي في تسجيل الحسابات', severity: 'medium', time: 'منذ يومين' },
          { title: 'تكرار محاولات دخول فاشلة', severity: 'low', time: 'منذ 3 أيام' },
        ].map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className={`glass-card p-3 flex items-center gap-3 ${a.severity === 'high' ? 'border-danger/30' : a.severity === 'medium' ? 'border-warning/30' : 'border-border/30'}`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 ${a.severity === 'high' ? 'text-danger' : a.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'}`} />
            <div className="flex-1"><p className="text-sm">{a.title}</p><p className="text-[10px] text-muted-foreground">{a.time}</p></div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${a.severity === 'high' ? 'bg-danger/15 text-danger' : a.severity === 'medium' ? 'bg-warning/15 text-warning' : 'bg-muted/50 text-muted-foreground'}`}>{a.severity === 'high' ? 'حرج' : a.severity === 'medium' ? 'متوسط' : 'منخفض'}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Default: show module info card
  const mod = aiModules.find(m => m.id === moduleId);
  return (
    <div className="space-y-4">
      <div className="glass-card p-5 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${mod?.color}15`, border: `1px solid ${mod?.color}30` }}>
          {mod && <mod.icon size={28} style={{ color: mod.color }} />}
        </div>
        <h3 className="font-bold text-lg">{mod?.label}</h3>
        <p className="text-sm text-muted-foreground mt-1">{mod?.desc}</p>
        <p className="text-xs text-muted-foreground mt-3">اسأل في المحادثة للحصول على تحليلات ورؤى من هذه الوحدة</p>
      </div>
    </div>
  );
}

// ========== MAIN PAGE ==========
export default function AiPage() {
  const [activeModule, setActiveModule] = useState('executive-brain');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'مرحباً! أنا العقل التنفيذي لمنصة ماهم إكسبو. يمكنني مساعدتك في تحليل البيانات، تقديم التوصيات، وتوقع الاتجاهات. اختر وحدة AI من القائمة أو اسألني مباشرة.', timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!query.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: query, timestamp: new Date() }]);
    const q = query;
    setQuery('');
    setLoading(true);
    setTimeout(() => {
      const responses = aiResponses[activeModule] || aiResponses['executive-brain'];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'ai', content: response, timestamp: new Date() }]);
      setLoading(false);
    }, 1200 + Math.random() * 800);
  };

  const activeModuleData = aiModules.find(m => m.id === activeModule);

  return (
    <AdminLayout>
      <div className="p-6 space-y-4">
        <PageHeader title="العقل التنفيذي — الذكاء الاصطناعي" subtitle="12 وحدة ذكاء اصطناعي متكاملة لدعم القرارات التنفيذية" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: 'calc(100vh - 14rem)' }}>
          {/* AI Modules Sidebar */}
          <div className="lg:col-span-2 glass-card p-3 overflow-y-auto">
            <p className="text-[10px] font-bold text-accent/60 uppercase tracking-widest px-2 mb-3">وحدات AI</p>
            <div className="space-y-1">
              {aiModules.map(mod => (
                <button key={mod.id} onClick={() => setActiveModule(mod.id)} className={cn('w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all', activeModule === mod.id ? 'bg-accent/10 text-accent border border-accent/20' : 'text-muted-foreground hover:bg-card hover:text-foreground border border-transparent')}>
                  <mod.icon size={14} style={activeModule === mod.id ? { color: mod.color } : {}} />
                  <span className="truncate">{mod.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Module Dashboard */}
          <div className="lg:col-span-4 glass-card p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${activeModuleData?.color}15`, border: `1px solid ${activeModuleData?.color}30` }}>
                {activeModuleData && <activeModuleData.icon size={16} style={{ color: activeModuleData.color }} />}
              </div>
              <div><h3 className="text-sm font-bold">{activeModuleData?.label}</h3><p className="text-[10px] text-muted-foreground">{activeModuleData?.desc}</p></div>
            </div>
            <ModuleDashboard moduleId={activeModule} />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-6 glass-card flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-accent" />
                <span className="text-sm font-bold">محادثة مع {activeModuleData?.label}</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-success/10 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> متصل
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', msg.role === 'ai' ? 'bg-accent/10 border border-accent/20' : 'bg-card border border-border/50')}>
                      {msg.role === 'ai' ? <Brain size={12} className="text-accent" /> : <Users size={12} className="text-muted-foreground" />}
                    </div>
                    <div className={cn('max-w-[80%] p-3 rounded-xl text-sm leading-relaxed', msg.role === 'ai' ? 'bg-card/50 border border-border/30' : 'bg-accent/10 border border-accent/20')}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center"><Brain size={12} className="text-accent animate-pulse" /></div>
                  <div className="bg-card/50 border border-border/30 p-3 rounded-xl"><div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-1.5 h-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: '300ms' }} /></div></div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-border/50">
              <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={`اسأل ${activeModuleData?.label}...`} className="flex-1 h-10 px-3 rounded-xl bg-card/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-all" />
                <button type="submit" disabled={!query.trim() || loading} className="h-10 px-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm disabled:opacity-50 transition-all"><Send size={14} /></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
