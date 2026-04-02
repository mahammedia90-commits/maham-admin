import { useState } from 'react';
import { Brain, Send, Sparkles, AlertTriangle, TrendingUp, FileText, Shield, Scale, Lightbulb, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface AIInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'compliance' | 'recommendation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  relatedEntity: string;
}

const insightsData: AIInsight[] = [
  { id: '1', type: 'risk', title: 'عقد أرامكو يقترب من الانتهاء', description: 'عقد رعاية أرامكو ينتهي خلال 45 يوماً. يجب بدء مفاوضات التجديد فوراً لتجنب فقدان الراعي الرئيسي. القيمة المعرضة للخطر: 2,000,000 ر.س', priority: 'high', relatedEntity: 'CTR-2026-001' },
  { id: '2', type: 'compliance', title: 'فاتورتان بحاجة لاعتماد ZATCA', description: 'INV-2026-003 و INV-2026-005 لم يتم إرسالهما لمنصة FATOORA بعد. الموعد النهائي: 5 أيام عمل من تاريخ الإصدار', priority: 'high', relatedEntity: 'INV-2026-003' },
  { id: '3', type: 'opportunity', title: 'فرصة تفاوض أفضل مع STC', description: 'بناءً على تحليل العقود السابقة، يمكن التفاوض على خصم 12% على عقد STC الجديد مقابل التزام لمدة 3 سنوات. الوفر المتوقع: 180,000 ر.س', priority: 'medium', relatedEntity: 'CTR-2026-002' },
  { id: '4', type: 'recommendation', title: 'تحسين شروط الدفع', description: 'تحليل أنماط الدفع يظهر أن 35% من المدفوعات تتأخر. يُنصح بإضافة بند غرامة تأخير 2% شهرياً في العقود الجديدة', priority: 'medium', relatedEntity: 'عام' },
  { id: '5', type: 'risk', title: 'مخاطر قانونية في عقد المقاول', description: 'عقد مقاول الديكور لا يحتوي على بند تعويض عن التأخير. يجب إضافة ملحق قبل بدء التنفيذ', priority: 'high', relatedEntity: 'CTR-2026-004' },
  { id: '6', type: 'compliance', title: 'تحديث سياسة KYC مطلوب', description: 'وفقاً لتعليمات SAMA الجديدة (مارس 2026)، يجب تحديث إجراءات التحقق من هوية العملاء خلال 60 يوماً', priority: 'medium', relatedEntity: 'SAMA' },
];

const typeConfig = {
  risk: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', label: 'مخاطر' },
  opportunity: { icon: TrendingUp, color: 'text-success', bg: 'bg-success/10 border-success/20', label: 'فرصة' },
  compliance: { icon: Shield, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', label: 'امتثال' },
  recommendation: { icon: Lightbulb, color: 'text-gold', bg: 'bg-gold/10 border-gold/20', label: 'توصية' },
};

const priorityColors = { high: 'text-destructive', medium: 'text-warning', low: 'text-chrome' };
const priorityLabels = { high: 'عاجل', medium: 'متوسط', low: 'منخفض' };

const defaultMessages: AIMessage[] = [
  { id: '1', role: 'ai', content: 'مرحباً! أنا العقل القانوني الذكي لماهم. يمكنني مساعدتك في:\n\n• تحليل العقود واكتشاف المخاطر\n• مراجعة الامتثال القانوني\n• اقتراح تحسينات على الشروط\n• تتبع المواعيد النهائية\n• تحليل أنماط الدفع\n\nكيف يمكنني مساعدتك اليوم؟', timestamp: '12:00' },
];

export default function LegalAI() {
  const [messages, setMessages] = useState<AIMessage[]>(defaultMessages);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeView, setActiveView] = useState<'insights' | 'chat'>('insights');

  const filteredInsights = filter === 'all' ? insightsData : insightsData.filter(i => i.type === filter);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AIMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        'عقد': 'بناءً على تحليلي للعقود النشطة:\n\n📊 إجمالي العقود: 5\n✅ نشط: 3\n⚠️ يقترب من الانتهاء: 1\n📝 مسودة: 1\n\nالعقد الأكثر أهمية حالياً هو عقد أرامكو (CTR-2026-001) الذي ينتهي خلال 45 يوماً. أنصح ببدء مفاوضات التجديد فوراً.',
        'فاتورة': 'تحليل الفواتير:\n\n💰 إجمالي الفواتير: 5\n✅ مدفوع بالكامل: 2\n⏳ مدفوع جزئياً: 1\n📤 مرسل: 1\n📝 مسودة: 1\n\n⚠️ تنبيه: فاتورتان بحاجة لاعتماد ZATCA خلال 5 أيام عمل.',
        'امتثال': 'حالة الامتثال القانوني:\n\n🟢 ZATCA: متوافق 98%\n🟢 SAMA: متوافق 95%\n🟡 NCA: تحذير 78%\n🟢 MCI: متوافق 100%\n🟡 MHRSD: تحذير 80%\n\nالنسبة الإجمالية: 91% — تحتاج تحسين في NCA و MHRSD.',
      };
      const key = Object.keys(aiResponses).find(k => input.includes(k));
      const aiMsg: AIMessage = { id: (Date.now() + 1).toString(), role: 'ai', content: key ? aiResponses[key] : 'شكراً لسؤالك. بناءً على تحليلي للبيانات القانونية الحالية، أنصح بمراجعة العقود المقتربة من الانتهاء والتأكد من اعتماد جميع الفواتير في منصة ZATCA. هل تريد تفاصيل أكثر عن موضوع محدد؟', timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setActiveView('insights')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeView === 'insights' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-chrome hover:text-foreground'}`}>
          <Sparkles className="w-4 h-4 inline ml-1" />رؤى ذكية
        </button>
        <button onClick={() => setActiveView('chat')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeView === 'chat' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-chrome hover:text-foreground'}`}>
          <Brain className="w-4 h-4 inline ml-1" />محادثة AI
        </button>
      </div>

      {activeView === 'insights' ? (
        <>
          {/* Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[{ id: 'all', label: 'الكل' }, { id: 'risk', label: 'مخاطر' }, { id: 'opportunity', label: 'فرص' }, { id: 'compliance', label: 'امتثال' }, { id: 'recommendation', label: 'توصيات' }].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${filter === f.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-chrome hover:text-foreground hover:bg-card/50'}`}>{f.label}</button>
            ))}
          </div>

          {/* Insights */}
          <div className="space-y-2">
            {filteredInsights.map(insight => {
              const cfg = typeConfig[insight.type];
              const Icon = cfg.icon;
              return (
                <div key={insight.id} className={`glass-card p-4 rounded-xl border ${cfg.bg} transition-all hover:scale-[1.01]`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                          <span className={`text-[10px] font-medium ${priorityColors[insight.priority]}`}>{priorityLabels[insight.priority]}</span>
                        </div>
                      </div>
                      <p className="text-xs text-chrome mt-1">{insight.description}</p>
                      <p className="text-[10px] text-chrome mt-2">مرتبط بـ: <strong className="text-foreground">{insight.relatedEntity}</strong></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Chat */
        <div className="glass-card rounded-xl border border-gold/10 overflow-hidden" style={{ height: '500px' }}>
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-gold/10 border border-gold/20' : 'bg-card/50 border border-gold/10'}`}>
                    {msg.role === 'ai' ? <Bot className="w-4 h-4 text-gold" /> : <User className="w-4 h-4 text-chrome" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'ai' ? 'bg-card/50 border border-gold/10 text-foreground' : 'bg-gold/10 border border-gold/20 text-foreground'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] text-chrome mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="p-3 border-t border-gold/10 bg-card/30">
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="اسأل العقل القانوني الذكي..." className="flex-1 px-4 py-2 bg-background border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
                <Button onClick={handleSend} className="bg-gold hover:bg-gold/90 text-black"><Send className="w-4 h-4" /></Button>
              </div>
              <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                {['حلل العقود النشطة', 'حالة الفواتير', 'تقرير الامتثال', 'المخاطر القانونية'].map(q => (
                  <button key={q} onClick={() => { setInput(q); }} className="px-3 py-1 rounded-full text-[10px] bg-card/50 border border-gold/10 text-chrome hover:text-gold hover:border-gold/20 whitespace-nowrap transition-colors">{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
