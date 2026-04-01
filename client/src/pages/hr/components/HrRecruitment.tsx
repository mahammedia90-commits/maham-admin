import { useState } from 'react';
import { Briefcase, Users, Star, ChevronRight, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { JobOpening, Candidate } from '../hrTypes';
import { recruitmentStageLabels } from '../hrTypes';
import { SectionCard, MiniStat, Badge, ProgressBar } from './HrShared';

interface Props { jobs: JobOpening[]; candidates: Candidate[]; onStageChange: (id: string, stage: string) => void; }
const stageOrder = ['new','screening','interview','technical_test','offer','hired','rejected'] as const;
const stageColors: Record<string, string> = { new: 'bg-chrome/10 text-chrome', screening: 'bg-info/10 text-info', interview: 'bg-warning/10 text-warning', technical_test: 'bg-gold/10 text-gold', offer: 'bg-success/10 text-success', hired: 'bg-success/20 text-success', rejected: 'bg-destructive/10 text-destructive' };

export default function HrRecruitment({ jobs, candidates, onStageChange }: Props) {
  const [selC, setSelC] = useState<Candidate | null>(null);
  const [selJob, setSelJob] = useState('all');
  const openJobs = jobs.filter(j => j.status === 'open').length;
  const avgScore = candidates.length > 0 ? Math.round(candidates.reduce((s, c) => s + c.ai_score, 0) / candidates.length) : 0;
  const filtered = selJob === 'all' ? candidates : candidates.filter(c => c.job_id === selJob);

  return (<div className="space-y-4 sm:space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <MiniStat label="وظائف مفتوحة" value={openJobs} />
      <MiniStat label="إجمالي المتقدمين" value={candidates.length} />
      <MiniStat label="متوسط تقييم AI" value={`${avgScore}%`} color="text-gold" />
      <MiniStat label="عروض مرسلة" value={candidates.filter(c => c.stage === 'offer').length} color="text-success" />
    </div>
    <SectionCard title="الوظائف المفتوحة" icon={<Briefcase className="w-5 h-5" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {jobs.map(job => (
          <div key={job.id} className={`p-4 rounded-lg border cursor-pointer transition-all ${selJob === job.id ? 'border-gold bg-gold/5' : 'border-gold/10 bg-card/30 hover:border-gold/20'}`} onClick={() => setSelJob(selJob === job.id ? 'all' : job.id)}>
            <div className="flex justify-between items-start mb-2"><h4 className="font-semibold text-foreground text-sm">{job.title}</h4><Badge variant={job.status === 'open' ? 'success' : job.status === 'on_hold' ? 'warning' : 'default'}>{job.status === 'open' ? 'مفتوح' : job.status === 'on_hold' ? 'معلق' : 'مغلق'}</Badge></div>
            <p className="text-xs text-chrome mb-2">{job.department} — {job.location}</p>
            <div className="flex justify-between text-xs"><span className="text-chrome">{job.salary_range}</span><span className="text-gold">{job.applicants_count} متقدم</span></div>
          </div>
        ))}
      </div>
    </SectionCard>
    <SectionCard title="مسار التوظيف (Pipeline)" icon={<Users className="w-5 h-5" />}>
      <div className="overflow-x-auto -mx-3 sm:-mx-5 px-3 sm:px-5">
        <div className="flex gap-3 min-w-[800px]">
          {stageOrder.filter(s => s !== 'rejected').map(stage => {
            const sc = filtered.filter(c => c.stage === stage);
            return (<div key={stage} className="flex-1 min-w-[140px]">
              <div className={`px-3 py-2 rounded-t-lg text-center text-xs font-medium ${stageColors[stage]}`}>{recruitmentStageLabels[stage]} ({sc.length})</div>
              <div className="space-y-2 p-2 bg-card/20 rounded-b-lg min-h-[100px]">
                {sc.map(c => (<div key={c.id} className="p-2 bg-card/50 rounded-lg border border-gold/5 cursor-pointer hover:border-gold/20" onClick={() => setSelC(c)}><p className="text-xs font-medium text-foreground truncate">{c.name}</p><p className="text-[10px] text-chrome truncate">{c.job_title}</p><div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 text-gold" /><span className="text-[10px] text-gold">{c.ai_score}%</span></div></div>))}
              </div>
            </div>);
          })}
        </div>
      </div>
    </SectionCard>
    <Dialog open={!!selC} onOpenChange={() => setSelC(null)}>
      <DialogContent className="max-w-lg bg-background border-gold/20">
        {selC && (<>
          <DialogHeader><DialogTitle>{selC.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">{[['الوظيفة',selC.job_title],['البريد',selC.email],['الهاتف',selC.phone],['الخبرة',`${selC.experience_years} سنوات`],['تاريخ التقديم',selC.applied_at],['المرحلة',recruitmentStageLabels[selC.stage]]].map(([l,v]) => <div key={l} className="p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-1">{l}</p><p className="text-sm text-foreground font-medium">{v}</p></div>)}</div>
            <div className="p-4 bg-card/30 rounded-lg text-center"><p className="text-xs text-chrome mb-1">تقييم AI</p><p className="text-3xl font-bold text-gold">{selC.ai_score}%</p><ProgressBar value={selC.ai_score} max={100} /></div>
            <div className="p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-2">المهارات</p><div className="flex flex-wrap gap-1">{selC.skills.map(s => <Badge key={s}>{s}</Badge>)}</div></div>
            {selC.notes && <div className="p-3 bg-card/30 rounded-lg"><p className="text-xs text-chrome mb-1">ملاحظات</p><p className="text-sm text-foreground">{selC.notes}</p></div>}
            <div className="flex gap-2">
              {selC.stage !== 'hired' && selC.stage !== 'rejected' && (<>
                <Button onClick={() => { const idx = stageOrder.indexOf(selC.stage); if (idx < stageOrder.length - 2) { onStageChange(selC.id, stageOrder[idx + 1]); setSelC(null); }}} className="flex-1 bg-gold hover:bg-gold/90 text-black"><ChevronRight className="w-4 h-4 ml-1" />المرحلة التالية</Button>
                <Button onClick={() => { onStageChange(selC.id, 'rejected'); setSelC(null); }} variant="outline" className="text-destructive border-destructive/30"><XCircle className="w-4 h-4" /></Button>
              </>)}
            </div>
          </div>
        </>)}
      </DialogContent>
    </Dialog>
  </div>);
}
