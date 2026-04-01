// Design: Nour Theme — Marketing Module
// 5 tabs: Campaigns, Content, Social, Email, Analytics
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Megaphone, FileText, Share2, Mail, BarChart3, Plus,
  Eye, TrendingUp, Target, DollarSign, Users,
  Clock, ArrowUpRight, Globe,
  MousePointerClick, Send, Inbox, Video, Image
} from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'campaigns', label: 'الحملات', icon: Megaphone },
  { id: 'content', label: 'المحتوى', icon: FileText },
  { id: 'social', label: 'سوشيال ميديا', icon: Share2 },
  { id: 'email', label: 'البريد الإلكتروني', icon: Mail },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
]

const campaigns = [
  { id: 'CMP-001', name: 'حملة معرض الرياض التقني 2026', type: 'متكاملة', status: 'active', budget: 250000, spent: 180000, leads: 342, conversions: 45, roi: 285, startDate: '2026-02-01', endDate: '2026-04-30' },
  { id: 'CMP-002', name: 'استقطاب رعاة — Q2', type: 'بريد إلكتروني', status: 'active', budget: 50000, spent: 32000, leads: 128, conversions: 18, roi: 420, startDate: '2026-03-01', endDate: '2026-06-30' },
  { id: 'CMP-003', name: 'حملة التجار الجدد', type: 'سوشيال ميديا', status: 'active', budget: 80000, spent: 55000, leads: 215, conversions: 32, roi: 195, startDate: '2026-03-15', endDate: '2026-05-15' },
  { id: 'CMP-004', name: 'إعلان معرض جدة الدولي', type: 'إعلانات مدفوعة', status: 'draft', budget: 150000, spent: 0, leads: 0, conversions: 0, roi: 0, startDate: '2026-05-01', endDate: '2026-07-31' },
  { id: 'CMP-005', name: 'حملة ولاء المستثمرين', type: 'بريد إلكتروني', status: 'completed', budget: 30000, spent: 28000, leads: 95, conversions: 22, roi: 380, startDate: '2026-01-01', endDate: '2026-02-28' },
]

const contentItems = [
  { id: 1, title: 'دليل المستثمر — معرض الرياض التقني', type: 'PDF', status: 'published', views: 1240, downloads: 345, date: '2026-03-20' },
  { id: 2, title: 'فيديو ترويجي — ماهم إكسبو 2026', type: 'فيديو', status: 'published', views: 8500, downloads: 0, date: '2026-03-15' },
  { id: 3, title: 'إنفوجرافيك — إحصائيات المعارض', type: 'صورة', status: 'published', views: 3200, downloads: 890, date: '2026-03-10' },
  { id: 4, title: 'مقال — مستقبل المعارض في السعودية', type: 'مقال', status: 'draft', views: 0, downloads: 0, date: '2026-03-28' },
  { id: 5, title: 'كتيب حزم الرعاية 2026', type: 'PDF', status: 'review', views: 0, downloads: 0, date: '2026-03-25' },
]

const socialPlatforms = [
  { platform: 'Instagram', followers: 45200, growth: 12, posts: 85, engagement: 4.2, color: 'bg-pink-500/10 text-pink-400', icon: '📸' },
  { platform: 'Twitter/X', followers: 28500, growth: 8, posts: 120, engagement: 2.8, color: 'bg-sky-500/10 text-sky-400', icon: '🐦' },
  { platform: 'LinkedIn', followers: 18900, growth: 15, posts: 45, engagement: 5.1, color: 'bg-blue-500/10 text-blue-400', icon: '💼' },
]

const emailCampaigns = [
  { id: 1, name: 'نشرة مارس — فرص الاستثمار', sent: 4500, opened: 2800, clicked: 890, bounced: 45, date: '2026-03-01' },
  { id: 2, name: 'دعوة معرض الرياض التقني', sent: 3200, opened: 2400, clicked: 1200, bounced: 32, date: '2026-03-10' },
  { id: 3, name: 'عرض خاص — حزم الرعاية', sent: 1800, opened: 1100, clicked: 450, bounced: 18, date: '2026-03-20' },
  { id: 4, name: 'تذكير — آخر موعد للتسجيل', sent: 5200, opened: 3800, clicked: 1600, bounced: 52, date: '2026-03-25' },
]

const trafficData = [
  { week: 'W1', organic: 3200, paid: 1800, social: 950, email: 680 },
  { week: 'W2', organic: 3500, paid: 2100, social: 1100, email: 720 },
  { week: 'W3', organic: 4100, paid: 2500, social: 1300, email: 850 },
  { week: 'W4', organic: 4800, paid: 2800, social: 1500, email: 920 },
]

const conversionData = [
  { month: 'يناير', leads: 180, qualified: 95, converted: 28 },
  { month: 'فبراير', leads: 220, qualified: 128, converted: 42 },
  { month: 'مارس', leads: 342, qualified: 185, converted: 65 },
]

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns')

  return (
    <AdminLayout>
      <PageHeader
        title="التسويق والحملات"
        subtitle="إدارة الحملات التسويقية والمحتوى وسوشيال ميديا والبريد الإلكتروني"
        actions={
          <button onClick={() => toast.info('إنشاء حملة — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} /> حملة جديدة
          </button>
        }
      />

      <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border/50 overflow-x-auto mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-surface2/50')}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="حملات نشطة" value="3" icon={Megaphone} delay={0} />
                <StatsCard title="إجمالي الميزانية" value={formatCurrency(560000)} icon={DollarSign} delay={0.1} />
                <StatsCard title="عملاء محتملون" value="685" icon={Users} trend={28} delay={0.2} />
                <StatsCard title="متوسط ROI" value="320%" icon={TrendingUp} trend={15} delay={0.3} />
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['الحملة','النوع','الحالة','الميزانية','المنفق','العملاء','التحويلات','ROI'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {campaigns.map((c, i) => (
                      <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                        <td className="p-4"><div><p className="text-sm font-bold text-foreground">{c.name}</p><p className="text-[10px] font-mono text-muted-foreground">{c.id} • {formatDate(c.startDate)} — {formatDate(c.endDate)}</p></div></td>
                        <td className="p-4 text-xs text-muted-foreground">{c.type}</td>
                        <td className="p-4"><StatusBadge status={c.status === 'active' ? 'approved' : c.status === 'completed' ? 'approved' : 'pending'} /></td>
                        <td className="p-4 text-sm font-mono text-foreground">{formatCurrency(c.budget)}</td>
                        <td className="p-4"><div><p className="text-sm font-mono text-foreground">{formatCurrency(c.spent)}</p><div className="w-16 h-1 rounded-full bg-surface3 mt-1"><div className="h-full rounded-full bg-gold" style={{ width: `${c.budget > 0 ? (c.spent/c.budget)*100 : 0}%` }} /></div></div></td>
                        <td className="p-4 text-sm font-bold text-foreground">{formatNumber(c.leads)}</td>
                        <td className="p-4 text-sm font-bold text-gold">{c.conversions}</td>
                        <td className="p-4"><span className={cn('text-sm font-bold', c.roi > 300 ? 'text-success' : c.roi > 0 ? 'text-gold' : 'text-muted-foreground')}>{c.roi}%</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="محتوى منشور" value="12" icon={FileText} delay={0} />
                <StatsCard title="إجمالي المشاهدات" value={formatNumber(12940)} icon={Eye} trend={35} delay={0.1} />
                <StatsCard title="التحميلات" value={formatNumber(1235)} icon={ArrowUpRight} trend={22} delay={0.2} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentItems.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 hover:border-gold/30 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', item.type === 'PDF' ? 'bg-danger/10 text-danger' : item.type === 'فيديو' ? 'bg-info/10 text-info' : item.type === 'صورة' ? 'bg-success/10 text-success' : 'bg-gold/10 text-gold')}>
                        {item.type === 'PDF' ? <FileText size={14} /> : item.type === 'فيديو' ? <Video size={14} /> : item.type === 'صورة' ? <Image size={14} /> : <FileText size={14} />}
                      </div>
                      <StatusBadge status={item.status === 'published' ? 'approved' : item.status === 'review' ? 'pending' : 'draft'} />
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-2">{item.title}</h4>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye size={10} /> {formatNumber(item.views)}</span>
                      <span className="flex items-center gap-1"><ArrowUpRight size={10} /> {formatNumber(item.downloads)}</span>
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {socialPlatforms.map((s, i) => (
                  <motion.div key={s.platform} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-xl', s.color)}>{s.icon}</div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{s.platform}</h4>
                        <p className="text-[10px] text-muted-foreground">{formatNumber(s.followers)} متابع</p>
                      </div>
                      <span className="mr-auto text-xs text-success flex items-center gap-1"><ArrowUpRight size={12} /> +{s.growth}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-surface2/30"><p className="text-[10px] text-muted-foreground">المنشورات</p><p className="text-lg font-bold text-foreground">{s.posts}</p></div>
                      <div className="p-3 rounded-xl bg-surface2/30"><p className="text-[10px] text-muted-foreground">التفاعل</p><p className="text-lg font-bold text-gold">{s.engagement}%</p></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="رسائل مرسلة" value={formatNumber(14700)} icon={Send} delay={0} />
                <StatsCard title="معدل الفتح" value="68%" icon={Inbox} trend={5} delay={0.1} />
                <StatsCard title="معدل النقر" value="28%" icon={MousePointerClick} trend={8} delay={0.2} />
                <StatsCard title="معدل الارتداد" value="1.0%" icon={Clock} trend={-2} delay={0.3} />
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50">
                    {['الحملة','المرسلة','المفتوحة','النقرات','الارتداد','التاريخ'].map(h => (
                      <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {emailCampaigns.map((e, i) => (
                      <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/30 hover:bg-surface2/30 transition-colors">
                        <td className="p-4 text-sm font-bold text-foreground">{e.name}</td>
                        <td className="p-4 text-sm font-mono text-foreground">{formatNumber(e.sent)}</td>
                        <td className="p-4"><div className="flex items-center gap-2"><span className="text-sm font-mono">{formatNumber(e.opened)}</span><span className="text-[10px] text-success">{Math.round(e.opened/e.sent*100)}%</span></div></td>
                        <td className="p-4"><div className="flex items-center gap-2"><span className="text-sm font-mono">{formatNumber(e.clicked)}</span><span className="text-[10px] text-gold">{Math.round(e.clicked/e.sent*100)}%</span></div></td>
                        <td className="p-4 text-sm font-mono text-muted-foreground">{e.bounced}</td>
                        <td className="p-4 text-sm text-muted-foreground">{formatDate(e.date)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="زيارات الموقع" value={formatNumber(42800)} icon={Globe} trend={22} delay={0} />
                <StatsCard title="معدل التحويل" value="3.8%" icon={Target} trend={12} delay={0.1} />
                <StatsCard title="تكلفة الاكتساب" value={formatCurrency(185)} icon={DollarSign} trend={-8} delay={0.2} />
                <StatsCard title="عائد الإنفاق" value="4.2x" icon={TrendingUp} trend={15} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">مصادر الزيارات — مارس 2026</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="mktOrgGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient>
                        <linearGradient id="mktPaidGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Area type="monotone" dataKey="organic" stroke="#C9A84C" fill="url(#mktOrgGrad)" strokeWidth={2} name="عضوي" />
                      <Area type="monotone" dataKey="paid" stroke="#3b82f6" fill="url(#mktPaidGrad)" strokeWidth={2} name="مدفوع" />
                      <Area type="monotone" dataKey="social" stroke="#ec4899" fill="transparent" strokeWidth={2} name="سوشيال" />
                      <Area type="monotone" dataKey="email" stroke="#10b981" fill="transparent" strokeWidth={2} name="بريد" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">قمع التحويل — Q1 2026</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                      <Bar dataKey="leads" fill="#A0A0A0" name="عملاء محتملون" radius={[4,4,0,0]} />
                      <Bar dataKey="qualified" fill="#3b82f6" name="مؤهلون" radius={[4,4,0,0]} />
                      <Bar dataKey="converted" fill="#C9A84C" name="محولون" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
