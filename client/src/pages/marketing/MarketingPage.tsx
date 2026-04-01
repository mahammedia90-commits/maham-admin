/*
 * MarketingPage — إدارة التسويق
 * تابات: نظرة عامة | الحملات | سوشيال ميديا | البريد | التحليلات
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, TrendingUp, Eye, MousePointer, DollarSign, Users,
  Mail, Share2, BarChart3, Target, Plus, Play, Pause, CheckCircle,
  Clock, Calendar, Globe, MessageSquare, Zap, ArrowUpRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RPieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface Campaign {
  id: number; name: string; type: 'email' | 'social' | 'ads' | 'event';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number; spent: number; impressions: number; clicks: number;
  conversions: number; startDate: string; endDate: string;
}

const mockCampaigns: Campaign[] = [
  { id: 1, name: 'حملة معرض التقنية 2026', type: 'ads', status: 'active', budget: 50000, spent: 32000, impressions: 450000, clicks: 12500, conversions: 340, startDate: '2026-03-01', endDate: '2026-04-30' },
  { id: 2, name: 'تسويق بريدي — رعاة جدد', type: 'email', status: 'active', budget: 5000, spent: 2800, impressions: 15000, clicks: 3200, conversions: 85, startDate: '2026-03-15', endDate: '2026-04-15' },
  { id: 3, name: 'إنستغرام — معرض الأغذية', type: 'social', status: 'completed', budget: 20000, spent: 19500, impressions: 280000, clicks: 8900, conversions: 210, startDate: '2026-02-01', endDate: '2026-03-15' },
  { id: 4, name: 'حملة موسم الرياض', type: 'event', status: 'active', budget: 80000, spent: 45000, impressions: 620000, clicks: 18000, conversions: 520, startDate: '2026-03-10', endDate: '2026-05-31' },
  { id: 5, name: 'Google Ads — حجز أجنحة', type: 'ads', status: 'paused', budget: 30000, spent: 15000, impressions: 180000, clicks: 5400, conversions: 120, startDate: '2026-02-15', endDate: '2026-04-15' },
  { id: 6, name: 'حملة تويتر — معرض العقار', type: 'social', status: 'draft', budget: 15000, spent: 0, impressions: 0, clicks: 0, conversions: 0, startDate: '2026-04-01', endDate: '2026-05-01' },
];

const trafficData = [
  { month: 'يناير', organic: 12000, paid: 8000, social: 5000, direct: 3000 },
  { month: 'فبراير', organic: 15000, paid: 12000, social: 7000, direct: 4000 },
  { month: 'مارس', organic: 22000, paid: 18000, social: 12000, direct: 5500 },
  { month: 'أبريل', organic: 28000, paid: 22000, social: 15000, direct: 7000 },
  { month: 'مايو', organic: 35000, paid: 28000, social: 20000, direct: 8500 },
  { month: 'يونيو', organic: 32000, paid: 25000, social: 18000, direct: 8000 },
];

const channelData = [
  { name: 'بحث عضوي', value: 35, color: '#10B981' },
  { name: 'إعلانات مدفوعة', value: 28, color: '#3B82F6' },
  { name: 'سوشيال ميديا', value: 22, color: '#F59E0B' },
  { name: 'مباشر', value: 10, color: '#8B5CF6' },
  { name: 'إحالات', value: 5, color: '#EC4899' },
];

const socialPosts = [
  { platform: 'Instagram', content: 'استعدوا لأكبر معرض تقنية في الرياض!', likes: 2450, comments: 180, shares: 320, date: '2026-03-28' },
  { platform: 'Twitter', content: 'فرص رعاية حصرية لمعرض التقنية 2026 — سجل الآن', likes: 890, comments: 65, shares: 210, date: '2026-03-27' },
  { platform: 'LinkedIn', content: 'ماهم إكسبو تعلن عن شراكة استراتيجية مع 15 شركة تقنية', likes: 1200, comments: 95, shares: 180, date: '2026-03-25' },
  { platform: 'Instagram', content: 'خلف الكواليس — تجهيزات معرض الأغذية الدولي', likes: 3100, comments: 240, shares: 450, date: '2026-03-22' },
];

const emailCampaigns = [
  { name: 'دعوة VIP — معرض التقنية', sent: 2500, opened: 1850, clicked: 620, bounced: 45, date: '2026-03-28' },
  { name: 'عرض خاص — حجز مبكر', sent: 5000, opened: 3200, clicked: 980, bounced: 120, date: '2026-03-20' },
  { name: 'نشرة شهرية — مارس', sent: 8000, opened: 4800, clicked: 1200, bounced: 200, date: '2026-03-15' },
  { name: 'تذكير — تجديد الرعاية', sent: 150, opened: 120, clicked: 85, bounced: 5, date: '2026-03-10' },
];

type TabKey = 'overview' | 'campaigns' | 'social' | 'email' | 'analytics';
const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { key: 'campaigns', label: 'الحملات', icon: Megaphone },
  { key: 'social', label: 'سوشيال ميديا', icon: Share2 },
  { key: 'email', label: 'البريد الإلكتروني', icon: Mail },
  { key: 'analytics', label: 'التحليلات', icon: TrendingUp },
];

const typeLabels: Record<string, string> = { email: 'بريد', social: 'سوشيال', ads: 'إعلانات', event: 'فعالية' };

function OverviewTab() {
  const totalImpressions = mockCampaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = mockCampaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = mockCampaigns.reduce((s, c) => s + c.conversions, 0);
  const totalSpent = mockCampaigns.reduce((s, c) => s + c.spent, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الانطباعات" value={formatNumber(totalImpressions)} icon={Eye} trend={25} />
        <StatsCard title="النقرات" value={formatNumber(totalClicks)} icon={MousePointer} trend={18} delay={0.1} />
        <StatsCard title="التحويلات" value={formatNumber(totalConversions)} icon={Target} trend={32} delay={0.2} />
        <StatsCard title="الإنفاق" value={formatCurrency(totalSpent)} icon={DollarSign} delay={0.3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-bold mb-4">مصادر الزيارات</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
              <Area type="monotone" dataKey="organic" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="عضوي" />
              <Area type="monotone" dataKey="paid" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="مدفوع" />
              <Area type="monotone" dataKey="social" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="سوشيال" />
              <Area type="monotone" dataKey="direct" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="مباشر" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">توزيع القنوات</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RPieChart><Pie data={channelData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">{channelData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} /></RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{channelData.map(c => <div key={c.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.name}</span><span className="font-mono">{c.value}%</span></div>)}</div>
        </motion.div>
      </div>
    </div>
  );
}

function CampaignsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الحملات" value={mockCampaigns.length} icon={Megaphone} />
        <StatsCard title="نشطة" value={mockCampaigns.filter(c => c.status === 'active').length} icon={Play} delay={0.1} />
        <StatsCard title="مكتملة" value={mockCampaigns.filter(c => c.status === 'completed').length} icon={CheckCircle} delay={0.2} />
        <StatsCard title="ROI" value="285%" icon={TrendingUp} trend={15} delay={0.3} />
      </div>
      <div className="space-y-3">
        {mockCampaigns.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.type === 'ads' ? 'bg-info/10 border border-info/20' : c.type === 'email' ? 'bg-accent/10 border border-accent/20' : c.type === 'social' ? 'bg-warning/10 border border-warning/20' : 'bg-success/10 border border-success/20'}`}>
                  {c.type === 'ads' ? <Globe className="w-4 h-4 text-info" /> : c.type === 'email' ? <Mail className="w-4 h-4 text-accent" /> : c.type === 'social' ? <Share2 className="w-4 h-4 text-warning" /> : <Calendar className="w-4 h-4 text-success" />}
                </div>
                <div><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-muted-foreground">{typeLabels[c.type]} — {formatDate(c.startDate)} → {formatDate(c.endDate)}</p></div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="grid grid-cols-5 gap-3">
              <div className="text-center"><p className="text-[10px] text-muted-foreground">الميزانية</p><p className="text-sm font-mono">{formatCurrency(c.budget)}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">المصروف</p><p className="text-sm font-mono">{formatCurrency(c.spent)}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">الانطباعات</p><p className="text-sm font-mono">{formatNumber(c.impressions)}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">النقرات</p><p className="text-sm font-mono">{formatNumber(c.clicks)}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">التحويلات</p><p className="text-sm font-mono font-bold text-accent">{c.conversions}</p></div>
            </div>
            {c.budget > 0 && <div className="mt-2"><div className="h-1.5 rounded-full bg-card/80 overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.min((c.spent / c.budget) * 100, 100)}%` }} /></div></div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SocialTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="إجمالي المتابعين" value="125K" icon={Users} trend={8} />
        <StatsCard title="معدل التفاعل" value="4.2%" icon={MessageSquare} trend={12} delay={0.1} />
        <StatsCard title="المنشورات هذا الشهر" value={socialPosts.length} icon={Share2} delay={0.2} />
      </div>
      <div className="space-y-3">
        {socialPosts.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.platform === 'Instagram' ? 'bg-pink-500/15 text-pink-400' : p.platform === 'Twitter' ? 'bg-sky-500/15 text-sky-400' : 'bg-blue-500/15 text-blue-400'}`}>{p.platform}</span>
              <span className="text-xs text-muted-foreground">{formatDate(p.date)}</span>
            </div>
            <p className="text-sm mb-3">{p.content}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{formatNumber(p.likes)} اعجاب</span>
              <span>{p.comments} تعليق</span>
              <span>{p.shares} مشاركة</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmailTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="إجمالي المرسل" value={emailCampaigns.reduce((s, e) => s + e.sent, 0)} icon={Mail} />
        <StatsCard title="معدل الفتح" value="68%" icon={Eye} trend={5} delay={0.1} />
        <StatsCard title="معدل النقر" value="22%" icon={MousePointer} delay={0.2} />
        <StatsCard title="معدل الارتداد" value="2.3%" icon={ArrowUpRight} delay={0.3} />
      </div>
      <div className="space-y-3">
        {emailCampaigns.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3"><p className="font-medium text-sm">{e.name}</p><span className="text-xs text-muted-foreground">{formatDate(e.date)}</span></div>
            <div className="grid grid-cols-4 gap-3">
              <div className="glass-card p-2 text-center"><p className="text-[10px] text-muted-foreground">مرسل</p><p className="text-sm font-mono">{formatNumber(e.sent)}</p></div>
              <div className="glass-card p-2 text-center"><p className="text-[10px] text-muted-foreground">مفتوح</p><p className="text-sm font-mono text-success">{formatNumber(e.opened)}</p></div>
              <div className="glass-card p-2 text-center"><p className="text-[10px] text-muted-foreground">نقر</p><p className="text-sm font-mono text-accent">{formatNumber(e.clicked)}</p></div>
              <div className="glass-card p-2 text-center"><p className="text-[10px] text-muted-foreground">ارتداد</p><p className="text-sm font-mono text-danger">{e.bounced}</p></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const cpcData = [{ month: 'يناير', cpc: 2.5 }, { month: 'فبراير', cpc: 2.2 }, { month: 'مارس', cpc: 1.8 }, { month: 'أبريل', cpc: 1.5 }, { month: 'مايو', cpc: 1.3 }, { month: 'يونيو', cpc: 1.6 }];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">تكلفة النقرة (CPC) — شهري</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cpcData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} /><Bar dataKey="cpc" fill="#C9A84C" radius={[4, 4, 0, 0]} name="CPC (ر.س)" /></BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">مؤشرات الأداء الرئيسية</h3>
          <div className="space-y-3">
            {[{ label: 'تكلفة الاكتساب (CPA)', value: '45 ر.س', trend: -12 }, { label: 'عائد الإنفاق (ROAS)', value: '3.8x', trend: 22 }, { label: 'معدل التحويل', value: '2.8%', trend: 8 }, { label: 'قيمة العميل (CLV)', value: '12,500 ر.س', trend: 15 }].map((kpi) => (
              <div key={kpi.label} className="glass-card p-3 flex items-center justify-between">
                <span className="text-sm">{kpi.label}</span>
                <div className="flex items-center gap-2"><span className="font-mono font-bold text-accent">{kpi.value}</span><span className={`text-[10px] ${kpi.trend > 0 ? 'text-success' : 'text-danger'}`}>{kpi.trend > 0 ? '+' : ''}{kpi.trend}%</span></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة التسويق" subtitle="الحملات التسويقية والسوشيال ميديا والتحليلات" actions={<Button onClick={() => toast.info('إنشاء حملة — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> حملة جديدة</Button>} />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'campaigns' && <CampaignsTab />}
            {activeTab === 'social' && <SocialTab />}
            {activeTab === 'email' && <EmailTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
