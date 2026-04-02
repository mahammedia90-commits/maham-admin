/*
 * Sales Performance — أداء المبيعات ولوحة المتصدرين
 * Route: /sales/performance
 * Features: Leaderboard, Commission tracker, Revenue targets, Team KPIs
 */
import { useState, useMemo } from 'react'
import {
  Trophy, TrendingUp, DollarSign, Users, Target, Award,
  Crown, Medal, Star, Flame, Calendar, ArrowUp, ArrowDown,
  Percent, Clock, CheckCircle2, BarChart3, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SalesRep {
  id: number; name: string; avatar: string; role: string
  revenue_month: number; revenue_target: number; revenue_prev_month: number
  deals_closed: number; deals_target: number; deals_pipeline: number
  conversion_rate: number; avg_deal_size: number; avg_close_days: number
  commission_earned: number; commission_rate: number
  leads_contacted: number; followups_done: number
  streak_days: number; rank_change: number
}

const MOCK_REPS: SalesRep[] = [
  { id: 4, name: 'ليلى الحربي', avatar: 'ل', role: 'مندوبة مبيعات', revenue_month: 1800000, revenue_target: 1500000, revenue_prev_month: 1200000, deals_closed: 6, deals_target: 5, deals_pipeline: 3, conversion_rate: 38, avg_deal_size: 300000, avg_close_days: 12, commission_earned: 54000, commission_rate: 3, leads_contacted: 45, followups_done: 38, streak_days: 28, rank_change: 1 },
  { id: 1, name: 'أحمد الشمري', avatar: 'أ', role: 'مندوب مبيعات أول', revenue_month: 1200000, revenue_target: 1500000, revenue_prev_month: 1350000, deals_closed: 4, deals_target: 5, deals_pipeline: 5, conversion_rate: 32, avg_deal_size: 300000, avg_close_days: 15, commission_earned: 36000, commission_rate: 3, leads_contacted: 38, followups_done: 30, streak_days: 12, rank_change: -1 },
  { id: 2, name: 'سارة القحطاني', avatar: 'س', role: 'مندوبة مبيعات', revenue_month: 395000, revenue_target: 1000000, revenue_prev_month: 520000, deals_closed: 2, deals_target: 5, deals_pipeline: 4, conversion_rate: 18, avg_deal_size: 197500, avg_close_days: 22, commission_earned: 11850, commission_rate: 3, leads_contacted: 22, followups_done: 15, streak_days: 0, rank_change: 0 },
  { id: 3, name: 'محمد العنزي', avatar: 'م', role: 'مندوب مبيعات', revenue_month: 95000, revenue_target: 1000000, revenue_prev_month: 180000, deals_closed: 1, deals_target: 5, deals_pipeline: 2, conversion_rate: 8, avg_deal_size: 95000, avg_close_days: 30, commission_earned: 2850, commission_rate: 3, leads_contacted: 12, followups_done: 8, streak_days: 0, rank_change: 0 },
]

function formatSAR(amount: number) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
  return amount.toLocaleString('ar-SA')
}

function ProgressRing({ value, max, size = 80, strokeWidth = 6, color = '#c9a84c' }: { value: number; max: number; size?: number; strokeWidth?: number; color?: string }) {
  const pct = Math.min(100, Math.round(value / max * 100))
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#252535" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pct >= 100 ? '#00e5a0' : pct >= 70 ? color : pct >= 40 ? '#f59e0b' : '#ff4d6d'} strokeWidth={strokeWidth} strokeDasharray={`${pct / 100 * circumference} ${circumference}`} strokeLinecap="round" />
    </svg>
  )
}

export default function SalesPerformancePage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'commission' | 'targets'>('leaderboard')
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month')

  const teamTotals = useMemo(() => ({
    revenue: MOCK_REPS.reduce((s, r) => s + r.revenue_month, 0),
    target: MOCK_REPS.reduce((s, r) => s + r.revenue_target, 0),
    deals: MOCK_REPS.reduce((s, r) => s + r.deals_closed, 0),
    pipeline: MOCK_REPS.reduce((s, r) => s + r.deals_pipeline, 0),
    commission: MOCK_REPS.reduce((s, r) => s + r.commission_earned, 0),
    avgConversion: Math.round(MOCK_REPS.reduce((s, r) => s + r.conversion_rate, 0) / MOCK_REPS.length),
  }), [])

  const tabs = [
    { id: 'leaderboard' as const, label: 'لوحة المتصدرين', icon: Trophy },
    { id: 'commission' as const, label: 'العمولات', icon: DollarSign },
    { id: 'targets' as const, label: 'الأهداف', icon: Target },
  ]

  const rankIcons = [Crown, Medal, Star]
  const rankColors = ['text-[#c9a84c]', 'text-[#c0c0c0]', 'text-[#cd7f32]']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2f0]">أداء المبيعات</h1>
          <p className="text-[#5a5a78] text-sm mt-1">لوحة المتصدرين، العمولات، الأهداف — تحفيز الفريق وتتبع الإنجاز</p>
        </div>
        <div className="flex bg-[#171724] rounded-lg p-0.5">
          {(['month', 'quarter', 'year'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${period === p ? 'bg-[#c9a84c] text-black' : 'text-[#5a5a78]'}`}>
              {p === 'month' ? 'شهري' : p === 'quarter' ? 'ربعي' : 'سنوي'}
            </button>
          ))}
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'إيرادات الفريق', value: `${formatSAR(teamTotals.revenue)} ر.س`, icon: DollarSign, color: 'text-[#c9a84c]' },
          { label: 'نسبة الهدف', value: `${Math.round(teamTotals.revenue / teamTotals.target * 100)}%`, icon: Target, color: teamTotals.revenue >= teamTotals.target ? 'text-emerald-400' : 'text-amber-400' },
          { label: 'صفقات مغلقة', value: teamTotals.deals, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'في الأنبوب', value: teamTotals.pipeline, icon: BarChart3, color: 'text-[#60a5fa]' },
          { label: 'إجمالي العمولات', value: `${formatSAR(teamTotals.commission)} ر.س`, icon: Award, color: 'text-[#c9a84c]' },
          { label: 'معدل التحويل', value: `${teamTotals.avgConversion}%`, icon: TrendingUp, color: 'text-emerald-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1"><s.icon className={`w-4 h-4 ${s.color}`} /><span className="text-xs text-[#5a5a78]">{s.label}</span></div>
            <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#252535]">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-[#5a5a78] hover:text-[#e2e2f0]'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {MOCK_REPS.slice(0, 3).map((rep, i) => {
              const RankIcon = rankIcons[i] || Star
              const pct = Math.round(rep.revenue_month / rep.revenue_target * 100)
              return (
                <div key={rep.id} className={`bg-[#0f0f1a] border rounded-xl p-5 text-center relative ${i === 0 ? 'border-[#c9a84c]/50 bg-[#c9a84c]/5 scale-105' : 'border-[#252535]'}`}>
                  <div className="absolute top-3 right-3">
                    <span className={`text-2xl font-bold font-mono ${rankColors[i]}`}>#{i + 1}</span>
                  </div>
                  <div className="relative inline-block mb-3">
                    <ProgressRing value={rep.revenue_month} max={rep.revenue_target} size={80} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-xl font-bold">{rep.avatar}</div>
                    </div>
                  </div>
                  <div className="text-[#e2e2f0] font-bold mb-1">{rep.name}</div>
                  <div className="text-[#c9a84c] text-xl font-bold font-mono mb-1">{formatSAR(rep.revenue_month)} ر.س</div>
                  <div className="text-xs text-[#5a5a78]">{pct}% من الهدف</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {rep.rank_change > 0 && <span className="text-xs text-emerald-400 flex items-center gap-0.5"><ArrowUp className="w-3 h-3" />+{rep.rank_change}</span>}
                    {rep.rank_change < 0 && <span className="text-xs text-red-400 flex items-center gap-0.5"><ArrowDown className="w-3 h-3" />{rep.rank_change}</span>}
                    {rep.streak_days >= 7 && <span className="text-xs text-[#c9a84c] flex items-center gap-0.5"><Flame className="w-3 h-3" />{rep.streak_days}d</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Full Table */}
          <div className="bg-[#0f0f1a] border border-[#252535] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252535] bg-[#171724]/50">
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">#</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">الموظف</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">الإيرادات</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">الهدف</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">الصفقات</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">التحويل</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">متوسط الصفقة</th>
                  <th className="px-4 py-3 text-right text-[#5a5a78] font-medium">أيام الإغلاق</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_REPS.map((rep, i) => (
                  <tr key={rep.id} className="border-b border-[#252535]/50 hover:bg-[#171724]/50">
                    <td className="px-4 py-3">
                      {i < 3 ? (
                        <span className={rankColors[i]}>{(() => { const Icon = rankIcons[i]; return <Icon className="w-5 h-5" /> })()}</span>
                      ) : (
                        <span className="text-[#5a5a78] font-mono">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-sm font-bold">{rep.avatar}</div>
                        <div>
                          <div className="text-[#e2e2f0] font-medium">{rep.name}</div>
                          <div className="text-[#5a5a78] text-xs">{rep.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#c9a84c] font-mono font-bold">{formatSAR(rep.revenue_month)} ر.س</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs ${rep.revenue_month >= rep.revenue_target ? 'text-emerald-400' : 'text-amber-400'}`}>{Math.round(rep.revenue_month / rep.revenue_target * 100)}%</span>
                        <div className="w-16 h-1.5 bg-[#252535] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${rep.revenue_month >= rep.revenue_target ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, rep.revenue_month / rep.revenue_target * 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#e2e2f0] font-mono">{rep.deals_closed}/{rep.deals_target}</td>
                    <td className="px-4 py-3"><span className={`font-mono ${rep.conversion_rate >= 25 ? 'text-emerald-400' : rep.conversion_rate >= 15 ? 'text-amber-400' : 'text-red-400'}`}>{rep.conversion_rate}%</span></td>
                    <td className="px-4 py-3 text-[#e2e2f0] font-mono">{formatSAR(rep.avg_deal_size)} ر.س</td>
                    <td className="px-4 py-3"><span className={`font-mono ${rep.avg_close_days <= 15 ? 'text-emerald-400' : rep.avg_close_days <= 25 ? 'text-amber-400' : 'text-red-400'}`}>{rep.avg_close_days}d</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Commission Tab */}
      {activeTab === 'commission' && (
        <div className="space-y-4">
          <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-[#c9a84c]">إجمالي العمولات المستحقة هذا الشهر</div>
              <div className="text-3xl font-bold font-mono text-[#c9a84c]">{formatSAR(teamTotals.commission)} ر.س</div>
            </div>
            <div className="text-left">
              <div className="text-sm text-[#5a5a78]">نسبة العمولة الأساسية</div>
              <div className="text-2xl font-bold font-mono text-[#e2e2f0]">3%</div>
            </div>
          </div>
          <div className="space-y-3">
            {MOCK_REPS.map((rep, i) => (
              <div key={rep.id} className="bg-[#0f0f1a] border border-[#252535] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] font-bold">{rep.avatar}</div>
                  <div>
                    <div className="text-[#e2e2f0] font-medium">{rep.name}</div>
                    <div className="text-xs text-[#5a5a78]">{rep.deals_closed} صفقة × {rep.commission_rate}%</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold font-mono text-[#c9a84c]">{formatSAR(rep.commission_earned)} ر.س</div>
                  <div className="text-xs text-[#5a5a78]">من إيرادات {formatSAR(rep.revenue_month)} ر.س</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Targets Tab */}
      {activeTab === 'targets' && (
        <div className="space-y-4">
          {MOCK_REPS.map(rep => {
            const revPct = Math.round(rep.revenue_month / rep.revenue_target * 100)
            const dealPct = Math.round(rep.deals_closed / rep.deals_target * 100)
            const prevChange = Math.round((rep.revenue_month - rep.revenue_prev_month) / rep.revenue_prev_month * 100)
            return (
              <div key={rep.id} className="bg-[#0f0f1a] border border-[#252535] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] font-bold">{rep.avatar}</div>
                    <div>
                      <div className="text-[#e2e2f0] font-bold">{rep.name}</div>
                      <div className="text-xs text-[#5a5a78]">{rep.role}</div>
                    </div>
                  </div>
                  <span className={`text-sm flex items-center gap-1 ${prevChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {prevChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}{Math.abs(prevChange)}% عن الشهر السابق
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#5a5a78]">الإيرادات</span>
                      <span className={`font-mono ${revPct >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatSAR(rep.revenue_month)} / {formatSAR(rep.revenue_target)} ر.س</span>
                    </div>
                    <div className="h-3 bg-[#252535] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${revPct >= 100 ? 'bg-emerald-500' : revPct >= 70 ? 'bg-[#c9a84c]' : revPct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, revPct)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#5a5a78]">الصفقات</span>
                      <span className={`font-mono ${dealPct >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{rep.deals_closed} / {rep.deals_target}</span>
                    </div>
                    <div className="h-3 bg-[#252535] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${dealPct >= 100 ? 'bg-emerald-500' : dealPct >= 70 ? 'bg-[#c9a84c]' : dealPct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, dealPct)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
