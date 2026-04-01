import { useState } from 'react';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Send, Zap, Target, Users, Shield, DollarSign, BarChart3 } from 'lucide-react';
import type { AIHRInsight, Employee } from '../hrTypes';
import { SectionCard, MiniStat, Badge, HrModal } from './HrShared';

interface Props { insights: AIHRInsight[]; employees: Employee[]; }

export default function HrAiBrain({ insights, employees }: Props) {
  const [selectedInsight, setSelectedInsight] = useState<AIHRInsight | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: 'مرحباً! أنا العقل التنفيذي لإدارة الموارد البشرية في Maham. يمكنني تحليل بيانات الموظفين، تقديم توصيات ذكية، والإجابة على استفساراتك. كيف يمكنني مساعدتك؟' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const criticalCount = insights.filter(i => i.priority === 'critical').length;
  const highCount = insights.filter(i => i.priority === 'high').length;
  const newCount = insights.filter(i => i.status === 'new').length;
  const resolvedCount = insights.filter(i => i.status === 'resolved').length;
  const avgConfidence = insights.length > 0 ? Math.round(insights.reduce((s, i) => s + i.confidence, 0) / insights.length) : 0;

  const filtered = filterPriority ? insights.filter(i => i.priority === filterPriority) : insights;

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      const responses: Record<string, string> = {
        'موظف': `لديك ${employees.length} موظف حالياً. ${employees.filter(e => e.status === 'active').length} نشط، ${employees.filter(e => e.status === 'probation').length} في فترة تجربة. نسبة السعودة ${Math.round((employees.filter(e => e.is_saudi).length / employees.length) * 100)}%.`,
        'راتب': `إجمالي الرواتب الشهرية: ${employees.reduce((s, e) => s + e.salary, 0).toLocaleString()} ر.س. متوسط الراتب: ${Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length).toLocaleString()} ر.س.`,
        'أداء': `متوسط الأداء: ${Math.round(employees.reduce((s, e) => s + (e.performance_score || 0), 0) / employees.length)}%. أعلى أداء: ${employees.sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0))[0]?.name_ar || 'غير محدد'}.`,
        'سعودة': `نسبة السعودة الحالية: ${Math.round((employees.filter(e => e.is_saudi).length / employees.length) * 100)}%. ${employees.filter(e => e.is_saudi).length} سعودي من أصل ${employees.length}. النطاق: ${Math.round((employees.filter(e => e.is_saudi).length / employees.length) * 100) >= 85 ? 'بلاتيني' : 'أخضر مرتفع'}.`,
      };
      const key = Object.keys(responses).find(k => userMsg.includes(k));
      const aiResponse = key ? responses[key] : `تحليل سؤالك: "${userMsg}"\n\nبناءً على بيانات ${employees.length} موظف، أقترح مراجعة لوحة التحكم للحصول على تفاصيل أكثر. هل تريد تقريراً مفصلاً؟`;
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  const categoryIcon = (cat: string) => {
    const icons: Record<string, React.ReactNode> = {
      retention: <Users className="w-4 h-4" />, performance: <Target className="w-4 h-4" />,
      compliance: <Shield className="w-4 h-4" />, cost: <DollarSign className="w-4 h-4" />,
      recruitment: <Zap className="w-4 h-4" />, training: <BarChart3 className="w-4 h-4" />,
    };
    return icons[cat] || <Brain className="w-4 h-4" />;
  };

  const priorityLabel = (p: string) => p === 'critical' ? 'حرج' : p === 'high' ? 'عالي' : p === 'medium' ? 'متوسط' : 'منخفض';
  const priorityVariant = (p: string) => p === 'critical' ? 'danger' as const : p === 'high' ? 'warning' as const : p === 'medium' ? 'info' as const : 'success' as const;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        <MiniStat label="رؤى حرجة" value={criticalCount} color="text-destructive" />
        <MiniStat label="رؤى عالية" value={highCount} color="text-warning" />
        <MiniStat label="جديدة" value={newCount} color="text-gold" />
        <MiniStat label="تم حلها" value={resolvedCount} color="text-success" />
        <MiniStat label="متوسط الثقة" value={`${avgConfidence}%`} color="text-info" />
      </div>

      {/* AI Chat */}
      <SectionCard title="المحادثة مع العقل التنفيذي" icon={<Brain className="w-5 h-5" />}>
        <div className="bg-card/30 rounded-lg border border-border/50 h-64 sm:h-80 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-xs ${msg.role === 'user' ? 'bg-gold/10 text-foreground border border-gold/20' : 'bg-card text-foreground border border-border/50'}`}>
                  {msg.role === 'ai' && <div className="flex items-center gap-1 mb-1 text-gold"><Brain className="w-3 h-3" /><span className="text-[10px] font-bold">Maham AI</span></div>}
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border/50">
            <div className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="اسأل عن الموظفين، الرواتب، الأداء، السعودة..." className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-chrome focus:outline-none focus:ring-2 focus:ring-gold/30" />
              <button onClick={handleSend} className="p-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors"><Send className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {['كم عدد الموظفين؟', 'ما نسبة السعودة؟', 'تحليل الرواتب', 'تقرير الأداء'].map(q => (
                <button key={q} onClick={() => setChatInput(q)} className="px-2 py-1 text-[10px] text-chrome bg-card/50 rounded hover:bg-gold/10 hover:text-gold transition-colors">{q}</button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* AI Insights */}
      <SectionCard title="رؤى وتوصيات الذكاء الاصطناعي" icon={<Sparkles className="w-5 h-5" />}>
        <div className="flex gap-1 flex-wrap mb-4">
          {[{ v: '', l: 'الكل' }, { v: 'critical', l: 'حرج' }, { v: 'high', l: 'عالي' }, { v: 'medium', l: 'متوسط' }, { v: 'low', l: 'منخفض' }].map(s => (
            <button key={s.v} onClick={() => setFilterPriority(s.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterPriority === s.v ? 'bg-gold/10 text-gold border border-gold/30' : 'text-chrome hover:bg-muted'}`}>{s.l}</button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map(insight => (
            <div key={insight.id} className={`glass-card p-3 sm:p-4 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer ${
              insight.priority === 'critical' ? 'border-destructive/20 bg-destructive/5' : insight.priority === 'high' ? 'border-warning/20 bg-warning/5' : 'border-border/50'
            }`} onClick={() => setSelectedInsight(insight)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${insight.priority === 'critical' ? 'bg-destructive/10 text-destructive' : insight.priority === 'high' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'}`}>
                    {categoryIcon(insight.category)}
                  </div>
                  <div><p className="text-xs sm:text-sm font-bold text-foreground">{insight.title}</p><p className="text-[10px] text-chrome">{insight.category}</p></div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={priorityVariant(insight.priority)}>{priorityLabel(insight.priority)}</Badge>
                  <span className="text-xs text-chrome hidden sm:inline">{insight.confidence}%</span>
                </div>
              </div>
              <p className="text-xs text-chrome mb-2">{insight.description}</p>
              <div className="flex items-center gap-2 text-xs"><Sparkles className="w-3 h-3 text-gold shrink-0" /><span className="text-gold font-medium">التوصية:</span><span className="text-foreground truncate">{insight.recommendation}</span></div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* AI Capabilities */}
      <SectionCard title="قدرات العقل التنفيذي" icon={<Zap className="w-5 h-5" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: <TrendingUp className="w-6 h-6" />, title: 'التنبؤ بالاستقالات', desc: 'تحليل أنماط السلوك والتنبؤ بمخاطر ترك العمل', color: 'text-warning' },
            { icon: <Target className="w-6 h-6" />, title: 'تحسين الأداء', desc: 'توصيات مخصصة لتطوير كل موظف بناءً على بياناته', color: 'text-success' },
            { icon: <Shield className="w-6 h-6" />, title: 'مراقبة الامتثال', desc: 'فحص تلقائي للأنظمة السعودية وتنبيهات فورية', color: 'text-info' },
            { icon: <DollarSign className="w-6 h-6" />, title: 'تحسين التكاليف', desc: 'تحليل هيكل الرواتب واقتراح تحسينات مالية', color: 'text-gold' },
          ].map(cap => (
            <div key={cap.title} className="glass-card p-4 rounded-lg text-center border border-border/50 hover:border-gold/20 transition-all">
              <div className={`mx-auto mb-2 ${cap.color}`}>{cap.icon}</div>
              <p className="text-xs font-bold text-foreground mb-1">{cap.title}</p>
              <p className="text-[10px] text-chrome">{cap.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Insight Detail Modal */}
      <HrModal open={!!selectedInsight} onClose={() => setSelectedInsight(null)} title="تفاصيل الرؤية" size="md">
        {selectedInsight && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${selectedInsight.priority === 'critical' ? 'bg-destructive/10 text-destructive' : selectedInsight.priority === 'high' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'}`}>
                {categoryIcon(selectedInsight.category)}
              </div>
              <div><p className="text-sm font-bold text-foreground">{selectedInsight.title}</p><p className="text-xs text-chrome">{selectedInsight.category}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-chrome mb-1">الأولوية</p><Badge variant={priorityVariant(selectedInsight.priority)}>{priorityLabel(selectedInsight.priority)}</Badge></div>
              <div><p className="text-xs text-chrome mb-1">الثقة</p><p className="text-sm font-bold text-gold">{selectedInsight.confidence}%</p></div>
              <div><p className="text-xs text-chrome mb-1">الأثر</p><p className="text-sm text-foreground">{selectedInsight.impact}</p></div>
              <div><p className="text-xs text-chrome mb-1">الحالة</p><Badge variant={selectedInsight.status === 'resolved' ? 'success' : selectedInsight.status === 'acknowledged' ? 'warning' : 'info'}>{selectedInsight.status === 'resolved' ? 'تم الحل' : selectedInsight.status === 'acknowledged' ? 'تم الاطلاع' : 'جديد'}</Badge></div>
            </div>
            <div><p className="text-xs text-chrome mb-1">الوصف</p><p className="text-sm text-foreground">{selectedInsight.description}</p></div>
            <div className="p-3 rounded-lg bg-gold/5 border border-gold/20"><p className="text-xs text-chrome mb-1">التوصية</p><p className="text-sm text-gold font-medium">{selectedInsight.recommendation}</p></div>
            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-gold/10 text-gold rounded-lg text-xs font-medium hover:bg-gold/20">تنفيذ التوصية</button>
              <button className="px-4 py-2 bg-success/10 text-success rounded-lg text-xs font-medium hover:bg-success/20">تحديد كمحلول</button>
              <button className="px-4 py-2 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/80">تجاهل</button>
            </div>
          </div>
        )}
      </HrModal>
    </div>
  );
}
