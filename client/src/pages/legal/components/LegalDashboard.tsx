import { FileText, AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp, Shield, PenTool } from 'lucide-react';
import type { LegalDashboardStats, Contract, ExpiryAlert, AIContractInsight } from '../legalTypes';
import { contractTypeLabels, contractStatusLabels, contractStatusColors, contractTypeColors, lifecycleSteps } from '../legalTypes';

interface Props {
  stats: LegalDashboardStats;
  contracts: Contract[];
  alerts: ExpiryAlert[];
  insights: AIContractInsight[];
  onViewContract: (id: string) => void;
}

function fmt(n: number) { return n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n); }

export default function LegalDashboard({ stats, contracts, alerts, insights, onViewContract }: Props) {
  const kpis = [
    { label: 'إجمالي العقود', value: stats.totalContracts, icon: FileText, color: 'text-gold' },
    { label: 'العقود النشطة', value: stats.activeContracts, icon: CheckCircle, color: 'text-success' },
    { label: 'بانتظار التوقيع', value: stats.pendingSignature, icon: PenTool, color: 'text-warning' },
    { label: 'ينتهي قريباً', value: stats.expiringSoon, icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'قيمة العقود', value: `${fmt(stats.totalContractValue)} ر.س`, icon: DollarSign, color: 'text-gold' },
    { label: 'تم التحصيل', value: `${fmt(stats.totalCollected)} ر.س`, icon: TrendingUp, color: 'text-success' },
    { label: 'المتأخرات', value: `${fmt(stats.overdueAmount)} ر.س`, icon: Clock, color: stats.overdueAmount > 0 ? 'text-destructive' : 'text-success' },
    { label: 'امتثال ZATCA', value: `${stats.zatcaCompliance}%`, icon: Shield, color: stats.zatcaCompliance >= 90 ? 'text-success' : 'text-warning' },
  ];

  const collectionRate = stats.totalInvoiced > 0 ? Math.round((stats.totalCollected / stats.totalInvoiced) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Lifecycle Strip */}
      <div className="glass-card p-3 sm:p-4 rounded-xl border border-gold/10">
        <p className="text-xs text-chrome mb-3">دورة حياة العقد</p>
        <div className="flex items-center justify-between overflow-x-auto gap-1">
          {lifecycleSteps.map((step, i) => (
            <div key={step.id} className="flex items-center min-w-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <span className="text-gold text-xs font-bold">{i + 1}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-chrome whitespace-nowrap">{step.label}</span>
              </div>
              {i < lifecycleSteps.length - 1 && (
                <div className="w-4 sm:w-8 h-px bg-gold/20 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {kpis.map(k => (
          <div key={k.label} className="glass-card p-3 sm:p-4 rounded-xl border border-gold/10">
            <div className="flex items-center justify-between mb-2">
              <k.icon className={`w-5 h-5 ${k.color}`} />
              <span className="text-xs text-chrome">{k.label}</span>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Collection Progress */}
      <div className="glass-card p-4 rounded-xl border border-gold/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">نسبة التحصيل</p>
          <span className="text-sm font-bold text-gold">{collectionRate}%</span>
        </div>
        <div className="w-full h-3 bg-card/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-l from-gold to-gold/70 rounded-full transition-all duration-500" style={{ width: `${collectionRate}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-chrome">
          <span>تم فوترة: {fmt(stats.totalInvoiced)} ر.س</span>
          <span>تم تحصيل: {fmt(stats.totalCollected)} ر.س</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contracts by Type */}
        <div className="glass-card p-4 rounded-xl border border-gold/10">
          <p className="text-sm font-semibold text-foreground mb-3">العقود حسب النوع</p>
          <div className="space-y-3">
            {(Object.entries(stats.contractsByType) as [string, number][]).filter(([,v]) => v > 0).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs border ${contractTypeColors[k as keyof typeof contractTypeColors]}`}>
                    {contractTypeLabels[k as keyof typeof contractTypeLabels]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-card/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gold/60 rounded-full" style={{ width: `${(v / stats.totalContracts) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-foreground w-6 text-left">{v}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contracts by Status */}
        <div className="glass-card p-4 rounded-xl border border-gold/10">
          <p className="text-sm font-semibold text-foreground mb-3">العقود حسب الحالة</p>
          <div className="space-y-3">
            {(Object.entries(stats.contractsByStatus) as [string, number][]).filter(([,v]) => v > 0).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-xs border ${contractStatusColors[k as keyof typeof contractStatusColors]}`}>
                  {contractStatusLabels[k as keyof typeof contractStatusLabels]}
                </span>
                <span className="text-sm font-bold text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expiry Alerts */}
      {alerts.length > 0 && (
        <div className="glass-card p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <p className="text-sm font-semibold text-orange-500">تنبيهات انتهاء العقود</p>
          </div>
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.contractId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-card/30 rounded-lg gap-2 cursor-pointer hover:bg-card/50 transition-colors" onClick={() => onViewContract(a.contractId)}>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.partyName} — {a.contractNumber}</p>
                  <p className="text-xs text-chrome">ينتهي في {a.endDate} ({a.daysRemaining} يوم)</p>
                </div>
                <span className="text-sm font-bold text-orange-500">{a.totalAmount.toLocaleString()} ر.س</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="glass-card p-4 rounded-xl border border-gold/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🧠</span>
            <p className="text-sm font-semibold text-foreground">رؤى الذكاء الاصطناعي</p>
          </div>
          <div className="space-y-2">
            {insights.map(ins => {
              const sColor = ins.severity === 'high' ? 'border-destructive/20 bg-destructive/5' : ins.severity === 'medium' ? 'border-warning/20 bg-warning/5' : 'border-gold/10';
              const sIcon = ins.type === 'risk' ? '⚠️' : ins.type === 'compliance' ? '🛡️' : ins.type === 'opportunity' ? '💡' : '⚙️';
              return (
                <div key={ins.id} className={`p-3 rounded-lg border ${sColor} cursor-pointer hover:bg-card/50 transition-colors`} onClick={() => ins.contractId && onViewContract(ins.contractId)}>
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">{sIcon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{ins.title}</p>
                      <p className="text-xs text-chrome mt-1">{ins.description}</p>
                      <p className="text-xs text-gold mt-1">💡 {ins.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Contracts */}
      <div className="glass-card p-4 rounded-xl border border-gold/10">
        <p className="text-sm font-semibold text-foreground mb-3">آخر العقود</p>
        <div className="space-y-2">
          {contracts.slice(0, 5).map(c => (
            <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-card/30 rounded-lg gap-2 cursor-pointer hover:bg-card/50 transition-colors" onClick={() => onViewContract(c.id)}>
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-8 h-8 text-gold shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                  <p className="text-xs text-chrome">{c.contractNumber} — {c.partyB.nameAr}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2 py-0.5 rounded text-xs border ${contractStatusColors[c.status]}`}>
                  {contractStatusLabels[c.status]}
                </span>
                <span className="text-sm font-bold text-foreground">{c.grandTotal.toLocaleString()} ر.س</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
