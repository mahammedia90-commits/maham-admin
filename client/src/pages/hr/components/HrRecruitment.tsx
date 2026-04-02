/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Recruitment System
 * ═══════════════════════════════════════════════════════════════════════════
 * Full recruitment pipeline: Job postings, candidates, interview tracking,
 * AI scoring, offer management, contract generation
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Search, Plus, Eye, Edit, Trash2, Users, Clock, CheckCircle2,
  XCircle, Star, Brain, FileText, MapPin, DollarSign, Calendar, Filter,
  ArrowRight, ChevronDown, X, Upload, Mail, Phone, Award, Target,
  TrendingUp, BarChart3, Sparkles, UserPlus, Send, Download
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { EmployeeAvatar, MiniProgress, MetricBox, SectionCard, ActionButton, EmptyState, SeverityBadge } from './HrShared'
import type { JobPosting, Candidate } from '../hrTypes'
import { recruitmentStageLabels, contractTypeLabels } from '../hrTypes'

interface HrRecruitmentProps {
  jobs: JobPosting[]
  candidates: Candidate[]
  onAddJob: () => void
  onUpdateStage: (candidateId: string, stage: string) => void
}

export default function HrRecruitment({ jobs, candidates, onAddJob, onUpdateStage }: HrRecruitmentProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline')

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch = !search || j.title_ar.includes(search) || j.title_en.toLowerCase().includes(search.toLowerCase()) || j.department_name.includes(search)
      const matchStatus = statusFilter === 'all' || j.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [jobs, search, statusFilter])

  const jobCandidates = selectedJob ? candidates.filter(c => c.job_id === selectedJob.id) : []

  // Pipeline stages
  const pipelineStages = [
    { id: 'screening', label: 'فرز', color: 'blue-500', icon: Search },
    { id: 'interview', label: 'مقابلة', color: 'purple-500', icon: Users },
    { id: 'evaluation', label: 'تقييم', color: 'gold', icon: Star },
    { id: 'offer', label: 'عرض', color: 'emerald-500', icon: Send },
    { id: 'hired', label: 'تم التوظيف', color: 'success', icon: CheckCircle2 },
    { id: 'rejected', label: 'مرفوض', color: 'danger', icon: XCircle },
  ]

  // Stats
  const totalApplicants = candidates.length
  const hiredCount = candidates.filter(c => c.stage === 'hired').length
  const interviewCount = candidates.filter(c => c.stage === 'interview').length
  const avgAiScore = candidates.length > 0 ? Math.round(candidates.reduce((s, c) => s + c.ai_score, 0) / candidates.length) : 0

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">وظائف شاغرة</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{jobs.filter(j => j.status === 'open').length}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-info" />
            <span className="text-[10px] text-muted-foreground">إجمالي المتقدمين</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{totalApplicants}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">تم توظيفهم</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{hiredCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">متوسط AI Score</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{avgAiScore}%</p>
        </div>
      </div>

      {/* ─── Search & Actions ──────────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="بحث بالمسمى الوظيفي أو القسم..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الحالات</option>
              <option value="open">مفتوح</option>
              <option value="closed">مغلق</option>
              <option value="on_hold">معلق</option>
              <option value="filled">تم الشغل</option>
            </select>
            <ActionButton label="إضافة وظيفة" icon={Plus} variant="primary" onClick={onAddJob} />
          </div>
        </div>
      </div>

      {/* ─── Job Postings Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredJobs.map(job => {
          const jobCands = candidates.filter(c => c.job_id === job.id)
          const statusColors: Record<string, string> = {
            open: 'bg-success/10 text-success border-success/20',
            closed: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20',
            on_hold: 'bg-warning/10 text-warning border-warning/20',
            filled: 'bg-info/10 text-info border-info/20'
          }
          const statusLabels: Record<string, string> = { open: 'مفتوح', closed: 'مغلق', on_hold: 'معلق', filled: 'تم الشغل' }
          return (
            <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 sm:p-4 hover:border-gold/20 transition-all cursor-pointer"
              onClick={() => setSelectedJob(job)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{job.title_ar}</h4>
                  <p className="text-[10px] text-muted-foreground">{job.title_en}</p>
                </div>
                <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', statusColors[job.status])}>
                  {statusLabels[job.status]}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Building2Icon size={10} className="text-gold/60" /> {job.department_name}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <MapPin size={10} className="text-gold/60" /> {job.location}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <DollarSign size={10} className="text-gold/60" /> {formatCurrency(job.salary_range.min)} - {formatCurrency(job.salary_range.max)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mb-3">
                <MetricBox label="متقدمين" value={job.applicants_count} />
                <MetricBox label="مقابلات" value={jobCands.filter(c => c.stage === 'interview').length} />
                <MetricBox label="AI Match" value={`${job.ai_match_score}%`} color="gold" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/10">
                <span className="text-[9px] text-muted-foreground">{contractTypeLabels[job.contract_type]}</span>
                <span className="text-[9px] text-muted-foreground">إغلاق: {formatDate(job.closing_date)}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ─── Job Detail + Candidates Pipeline Modal ────────────────────── */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={() => setSelectedJob(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-5xl glass-card my-4 sm:my-8" onClick={e => e.stopPropagation()}>
              {/* Job Header */}
              <div className="p-4 sm:p-6 border-b border-border/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">{selectedJob.title_ar}</h2>
                    <p className="text-xs text-muted-foreground">{selectedJob.title_en} • {selectedJob.department_name}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {selectedJob.location}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><DollarSign size={10} /> {formatCurrency(selectedJob.salary_range.min)} - {formatCurrency(selectedJob.salary_range.max)}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> نشر: {formatDate(selectedJob.posted_date)}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedJob(null)}
                    className="p-2 rounded-xl hover:bg-surface2 text-muted-foreground hover:text-foreground"><X size={18} /></button>
                </div>

                {/* Requirements */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedJob.requirements.map((req, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-surface2/50 border border-border/30 text-muted-foreground">{req}</span>
                  ))}
                </div>
              </div>

              {/* Candidates Pipeline */}
              <div className="p-4 sm:p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users size={16} className="text-gold" /> المرشحون ({jobCandidates.length})
                </h3>

                {jobCandidates.length === 0 ? (
                  <EmptyState icon={Users} title="لا يوجد مرشحون بعد" subtitle="لم يتقدم أحد لهذه الوظيفة حتى الآن" />
                ) : (
                  <div className="space-y-4">
                    {/* Pipeline View */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {pipelineStages.map(stage => {
                        const stageCands = jobCandidates.filter(c => c.stage === stage.id)
                        return (
                          <div key={stage.id} className="p-2 rounded-xl bg-surface2/30 border border-border/20">
                            <div className="flex items-center gap-1.5 mb-2">
                              <stage.icon size={12} className={`text-${stage.color}`} />
                              <span className="text-[10px] font-bold text-foreground">{stage.label}</span>
                              <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full mr-auto', `bg-${stage.color}/10 text-${stage.color}`)}>
                                {stageCands.length}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {stageCands.map(cand => (
                                <div key={cand.id} className="p-2 rounded-lg bg-surface/50 border border-border/10 hover:border-gold/15 transition-all">
                                  <div className="flex items-center gap-1.5">
                                    <EmployeeAvatar name={cand.name} size="xs" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] font-medium text-foreground truncate">{cand.name}</p>
                                      <p className="text-[8px] text-muted-foreground">AI: {cand.ai_score}%</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Candidates List */}
                    <div className="glass-card overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                          <thead>
                            <tr className="border-b border-border/20">
                              {['المرشح', 'المرحلة', 'AI Score', 'التقييم', 'المقابلة', 'التقدم', 'إجراءات'].map(h => (
                                <th key={h} className="p-3 text-right text-[10px] font-bold text-muted-foreground">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {jobCandidates.map(cand => (
                              <tr key={cand.id} className="border-b border-border/10 hover:bg-surface2/20 transition-colors">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <EmployeeAvatar name={cand.name} size="sm" />
                                    <div>
                                      <p className="text-xs font-medium text-foreground">{cand.name}</p>
                                      <p className="text-[9px] text-muted-foreground">{cand.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface2/50 text-foreground">
                                    {recruitmentStageLabels[cand.stage]}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1.5">
                                    <MiniProgress value={cand.ai_score} color={cand.ai_score >= 80 ? 'success' : cand.ai_score >= 60 ? 'gold' : 'warning'} size="xs" />
                                    <span className="text-[10px] font-mono text-foreground">{cand.ai_score}%</span>
                                  </div>
                                </td>
                                <td className="p-3 text-[11px] font-mono text-foreground">{cand.evaluation_score ?? '—'}</td>
                                <td className="p-3 text-[10px] text-muted-foreground">{cand.interview_date ? formatDate(cand.interview_date) : '—'}</td>
                                <td className="p-3 text-[10px] text-muted-foreground">{formatDate(cand.applied_date)}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    {cand.stage !== 'hired' && cand.stage !== 'rejected' && (
                                      <>
                                        <button onClick={() => onUpdateStage(cand.id, 'hired')}
                                          className="p-1 rounded bg-success/10 text-success hover:bg-success/20"><CheckCircle2 size={12} /></button>
                                        <button onClick={() => onUpdateStage(cand.id, 'rejected')}
                                          className="p-1 rounded bg-danger/10 text-danger hover:bg-danger/20"><XCircle size={12} /></button>
                                      </>
                                    )}
                                    <button className="p-1 rounded hover:bg-surface2 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper component to avoid import issues
function Building2Icon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
    </svg>
  )
}
