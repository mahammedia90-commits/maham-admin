/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Performance Management System
 * ═══════════════════════════════════════════════════════════════════════════
 * Performance reviews: KPIs, 360 feedback, self-assessment, AI analysis,
 * development plans, succession planning
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Search, Star, TrendingUp, TrendingDown, BarChart3, Eye,
  Award, Users, Brain, CheckCircle2, AlertTriangle, ArrowRight,
  ChevronDown, X, Sparkles, Zap, BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmployeeAvatar, MiniProgress, MetricBox, ActionButton, EmptyState, SectionCard } from './HrShared'
import type { PerformanceReview, Employee } from '../hrTypes'
import { performanceRatingLabels, performanceRatingColors } from '../hrTypes'

interface HrPerformanceProps {
  reviews: PerformanceReview[]
  employees: Employee[]
}

export default function HrPerformance({ reviews, employees }: HrPerformanceProps) {
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null)

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      const matchSearch = !search || r.employee_name.includes(search) || r.reviewer_name.includes(search)
      const matchRating = ratingFilter === 'all' || r.rating === ratingFilter
      return matchSearch && matchRating
    })
  }, [reviews, search, ratingFilter])

  // Stats
  const avgScore = reviews.length > 0 ? Math.round(reviews.reduce((s, r) => s + r.final_score, 0) / reviews.length) : 0
  const exceptionalCount = reviews.filter(r => r.rating === 'exceptional' || r.rating === 'exceeds').length
  const belowCount = reviews.filter(r => r.rating === 'below' || r.rating === 'unsatisfactory').length

  // Rating distribution
  const ratingDist = useMemo(() => {
    const dist: Record<string, number> = { exceptional: 0, exceeds: 0, meets: 0, below: 0, unsatisfactory: 0 }
    reviews.forEach(r => { dist[r.rating] = (dist[r.rating] || 0) + 1 })
    return dist
  }, [reviews])

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">متوسط الأداء</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{avgScore}%</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">متميزون</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{exceptionalCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-danger" />
            <span className="text-[10px] text-muted-foreground">أقل من المتوقع</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{belowCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-info" />
            <span className="text-[10px] text-muted-foreground">إجمالي التقييمات</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{reviews.length}</p>
        </div>
      </div>

      {/* ─── Rating Distribution ───────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <h4 className="text-xs font-bold text-foreground mb-3">توزيع التقييمات</h4>
        <div className="space-y-2">
          {Object.entries(performanceRatingLabels).map(([key, label]) => {
            const count = ratingDist[key] || 0
            const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-28 shrink-0">{label}</span>
                <div className="flex-1 h-5 rounded-full bg-surface2/50 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                    className={cn('h-full rounded-full', performanceRatingColors[key as keyof typeof performanceRatingColors])} />
                </div>
                <span className="text-[10px] font-mono text-foreground w-12 text-left">{count} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Search & Filters ──────────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="بحث بالاسم..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
          </div>
          <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
            <option value="all">كل التقييمات</option>
            {Object.entries(performanceRatingLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* ─── Reviews Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(review => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-3 sm:p-4 hover:border-gold/20 transition-all cursor-pointer"
            onClick={() => setSelectedReview(review)}>
            <div className="flex items-center gap-3 mb-3">
              <EmployeeAvatar name={review.employee_name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{review.employee_name}</p>
                <p className="text-[10px] text-muted-foreground">{review.period}</p>
              </div>
              <span className={cn('text-[9px] px-2 py-0.5 rounded-full', performanceRatingColors[review.rating])}>
                {performanceRatingLabels[review.rating]}
              </span>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              <MetricBox label="ذاتي" value={`${review.self_score}%`} />
              <MetricBox label="المدير" value={`${review.manager_score}%`} />
              <MetricBox label="النهائي" value={`${review.final_score}%`} color="gold" />
            </div>

            {/* KPI Progress */}
            <div className="space-y-1.5">
              {review.kpis.slice(0, 3).map((kpi, i) => {
                const pct = Math.min(Math.round((kpi.actual / kpi.target) * 100), 100)
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] text-muted-foreground">{kpi.name}</span>
                      <span className="text-[9px] font-mono text-foreground">{pct}%</span>
                    </div>
                    <MiniProgress value={pct} color={pct >= 90 ? 'success' : pct >= 70 ? 'gold' : 'danger'} size="xs" />
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/10">
              <span className="text-[9px] text-muted-foreground">المقيّم: {review.reviewer_name}</span>
              <span className={cn('text-[9px] px-1.5 py-0.5 rounded', review.status === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                {review.status === 'approved' ? 'معتمد' : review.status === 'reviewed' ? 'تمت المراجعة' : review.status === 'submitted' ? 'مقدم' : 'مسودة'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Review Detail Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={() => setSelectedReview(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl glass-card my-4 sm:my-8" onClick={e => e.stopPropagation()}>
              <div className="p-4 sm:p-6 border-b border-border/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar name={selectedReview.employee_name} size="lg" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{selectedReview.employee_name}</h3>
                      <p className="text-[10px] text-muted-foreground">{selectedReview.period} • المقيّم: {selectedReview.reviewer_name}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedReview(null)} className="p-2 rounded-xl hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Scores */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'التقييم الذاتي', value: selectedReview.self_score, icon: Users },
                    { label: 'تقييم المدير', value: selectedReview.manager_score, icon: Star },
                    { label: 'النتيجة النهائية', value: selectedReview.final_score, icon: Target },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl bg-surface2/30 border border-border/20 text-center">
                      <item.icon size={16} className="text-gold mx-auto mb-1" />
                      <p className="text-lg font-bold font-mono text-foreground">{item.value}%</p>
                      <p className="text-[9px] text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* KPIs Detail */}
                <div>
                  <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2"><Target size={14} className="text-gold" /> مؤشرات الأداء (KPIs)</h4>
                  <div className="space-y-2">
                    {selectedReview.kpis.map((kpi, i) => {
                      const pct = Math.min(Math.round((kpi.actual / kpi.target) * 100), 100)
                      return (
                        <div key={i} className="p-3 rounded-xl bg-surface2/20 border border-border/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-medium text-foreground">{kpi.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-muted-foreground">الوزن: {kpi.weight}%</span>
                              <span className="text-[10px] font-mono font-bold text-foreground">{kpi.actual}/{kpi.target}</span>
                            </div>
                          </div>
                          <MiniProgress value={pct} color={pct >= 90 ? 'success' : pct >= 70 ? 'gold' : 'danger'} size="sm" />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-success/5 border border-success/10">
                    <h5 className="text-[10px] font-bold text-success mb-2 flex items-center gap-1"><Award size={12} /> نقاط القوة</h5>
                    <ul className="space-y-1">
                      {selectedReview.strengths.map((s, i) => (
                        <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <CheckCircle2 size={10} className="text-success shrink-0 mt-0.5" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-xl bg-warning/5 border border-warning/10">
                    <h5 className="text-[10px] font-bold text-warning mb-2 flex items-center gap-1"><TrendingUp size={12} /> مجالات التحسين</h5>
                    <ul className="space-y-1">
                      {selectedReview.improvements.map((s, i) => (
                        <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                          <ArrowRight size={10} className="text-warning shrink-0 mt-0.5" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
                  <h5 className="text-[10px] font-bold text-gold mb-2 flex items-center gap-1"><Brain size={12} /> توصيات الذكاء الاصطناعي</h5>
                  <ul className="space-y-1">
                    {selectedReview.ai_recommendations.map((r, i) => (
                      <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                        <Sparkles size={10} className="text-gold shrink-0 mt-0.5" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
