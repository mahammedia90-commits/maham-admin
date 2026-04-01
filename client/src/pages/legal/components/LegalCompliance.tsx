import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock, XCircle, TrendingUp, FileCheck, Scale, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComplianceItem {
  id: string;
  authority: string;
  authorityAr: string;
  requirement: string;
  status: 'compliant' | 'warning' | 'non_compliant' | 'pending';
  lastCheck: string;
  nextReview: string;
  details: string;
  score: number;
}

const complianceData: ComplianceItem[] = [
  { id: '1', authority: 'ZATCA', authorityAr: 'هيئة الزكاة والضريبة والجمارك', requirement: 'الفوترة الإلكترونية — المرحلة الثانية (التكامل)', status: 'compliant', lastCheck: '2026-03-28', nextReview: '2026-06-28', details: 'جميع الفواتير متوافقة مع متطلبات FATOORA ومرسلة عبر API', score: 98 },
  { id: '2', authority: 'ZATCA', authorityAr: 'هيئة الزكاة والضريبة والجمارك', requirement: 'ضريبة القيمة المضافة 15% — الإقرار الضريبي', status: 'compliant', lastCheck: '2026-03-30', nextReview: '2026-04-30', details: 'الإقرار الضريبي الربع سنوي مقدّم في الموعد', score: 100 },
  { id: '3', authority: 'SAMA', authorityAr: 'البنك المركزي السعودي', requirement: 'مكافحة غسل الأموال (AML) — التحقق من العملاء', status: 'compliant', lastCheck: '2026-03-25', nextReview: '2026-06-25', details: 'KYC مكتمل لجميع العملاء والموردين النشطين', score: 95 },
  { id: '4', authority: 'NCA', authorityAr: 'الهيئة الوطنية للأمن السيبراني', requirement: 'حماية البيانات — تشفير العقود والمستندات', status: 'warning', lastCheck: '2026-03-20', nextReview: '2026-04-20', details: 'بعض المستندات القديمة تحتاج ترقية تشفير AES-256', score: 78 },
  { id: '5', authority: 'MCI', authorityAr: 'وزارة التجارة', requirement: 'السجل التجاري — تحديث البيانات السنوي', status: 'compliant', lastCheck: '2026-02-15', nextReview: '2027-02-15', details: 'السجل التجاري محدّث ونشط', score: 100 },
  { id: '6', authority: 'MHRSD', authorityAr: 'وزارة الموارد البشرية', requirement: 'عقود العمل — التوثيق في مدد', status: 'warning', lastCheck: '2026-03-15', nextReview: '2026-04-15', details: '2 عقود عمل جديدة بحاجة لتوثيق في منصة مدد', score: 80 },
  { id: '7', authority: 'PDPL', authorityAr: 'نظام حماية البيانات الشخصية', requirement: 'حماية البيانات الشخصية — سياسة الخصوصية', status: 'compliant', lastCheck: '2026-03-01', nextReview: '2026-09-01', details: 'سياسة الخصوصية محدّثة ومتوافقة مع PDPL', score: 92 },
  { id: '8', authority: 'ISO', authorityAr: 'المنظمة الدولية للمعايير', requirement: 'ISO 27001 — أمن المعلومات', status: 'pending', lastCheck: '2026-01-10', nextReview: '2026-07-10', details: 'التدقيق السنوي مجدول في يوليو 2026', score: 85 },
];

const statusConfig = {
  compliant: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10 border-success/20', label: 'متوافق' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', label: 'تحذير' },
  non_compliant: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', label: 'غير متوافق' },
  pending: { icon: Clock, color: 'text-chrome', bg: 'bg-card/50 border-gold/10', label: 'قيد المراجعة' },
};

export default function LegalCompliance() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? complianceData : complianceData.filter(c => c.status === filter);
  const overallScore = Math.round(complianceData.reduce((s, c) => s + c.score, 0) / complianceData.length);
  const compliantCount = complianceData.filter(c => c.status === 'compliant').length;
  const warningCount = complianceData.filter(c => c.status === 'warning').length;

  return (
    <div className="space-y-4">
      {/* Score Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-4 rounded-xl border border-gold/10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" className="text-card/50" />
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={`${overallScore}, 100`} className={overallScore >= 90 ? 'text-success' : overallScore >= 70 ? 'text-warning' : 'text-destructive'} />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${overallScore >= 90 ? 'text-success' : 'text-warning'}`}>{overallScore}%</span>
          </div>
          <p className="text-xs text-chrome">نسبة الامتثال</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-success/20">
          <CheckCircle className="w-6 h-6 text-success mb-1" />
          <p className="text-2xl font-bold text-success">{compliantCount}</p>
          <p className="text-xs text-chrome">متوافق</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-warning/20">
          <AlertTriangle className="w-6 h-6 text-warning mb-1" />
          <p className="text-2xl font-bold text-warning">{warningCount}</p>
          <p className="text-xs text-chrome">تحذيرات</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gold/10">
          <Scale className="w-6 h-6 text-gold mb-1" />
          <p className="text-2xl font-bold text-foreground">{complianceData.length}</p>
          <p className="text-xs text-chrome">إجمالي المتطلبات</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {[{ id: 'all', label: 'الكل' }, { id: 'compliant', label: 'متوافق' }, { id: 'warning', label: 'تحذير' }, { id: 'non_compliant', label: 'غير متوافق' }, { id: 'pending', label: 'قيد المراجعة' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${filter === f.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-chrome hover:text-foreground hover:bg-card/50'}`}>{f.label}</button>
        ))}
      </div>

      {/* Compliance Items */}
      <div className="space-y-2">
        {filtered.map(item => {
          const cfg = statusConfig[item.status];
          const Icon = cfg.icon;
          return (
            <div key={item.id} className={`glass-card p-4 rounded-xl border ${cfg.bg} transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-card/50 border border-gold/10 text-chrome">{item.authority}</span>
                      <span className="text-[10px] text-chrome">{item.authorityAr}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-1">{item.requirement}</p>
                    <p className="text-xs text-chrome mt-0.5">{item.details}</p>
                    <div className="flex gap-3 mt-2 text-[10px] text-chrome">
                      <span>آخر فحص: {item.lastCheck}</span>
                      <span>المراجعة القادمة: {item.nextReview}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-20 h-2 bg-card/50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.score >= 90 ? 'bg-success' : item.score >= 70 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="text-xs text-chrome">{item.score}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendations */}
      <div className="glass-card p-4 rounded-xl border border-gold/20 bg-gold/5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-gold" />
          <p className="text-sm font-semibold text-gold">توصيات AI للامتثال</p>
        </div>
        <div className="space-y-2">
          {[
            'ترقية تشفير المستندات القديمة إلى AES-256 لتحقيق التوافق الكامل مع NCA',
            'توثيق عقدي العمل الجديدين في منصة مدد قبل 15 أبريل 2026',
            'جدولة التدقيق الداخلي لـ ISO 27001 قبل التدقيق الخارجي في يوليو',
            'تحديث سياسة الاحتفاظ بالبيانات وفقاً لآخر تعديلات PDPL',
          ].map((rec, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-card/30 rounded-lg">
              <span className="text-gold text-xs mt-0.5">●</span>
              <p className="text-xs text-foreground">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
