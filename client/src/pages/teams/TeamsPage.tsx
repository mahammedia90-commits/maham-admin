import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Search, Eye, Edit, Trash2, Shield, Crown,
  Mail, Phone, Calendar, Clock, CheckCircle, X, UserPlus,
  Settings, Star, Activity
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatDate } from '@/lib/utils'

interface TeamMember {
  id: number
  name: string
  email: string
  phone: string
  role: string
  department: string
  avatar: string
  status: 'active' | 'inactive' | 'on_leave'
  permissions: string[]
  joined_at: string
  last_active: string
}

interface Role {
  id: number
  name: string
  name_en: string
  description: string
  members_count: number
  permissions_count: number
  color: string
}

const MOCK_MEMBERS: TeamMember[] = [
  { id: 1, name: 'نور كرم', email: 'nour@maham.sa', phone: '0550000001', role: 'مدير تنفيذي', department: 'الإدارة العليا', avatar: 'ن', status: 'active', permissions: ['all'], joined_at: '2025-01-01', last_active: '2026-03-31T14:30:00' },
  { id: 2, name: 'أحمد المشرف', email: 'ahmed@maham.sa', phone: '0550000002', role: 'مدير العمليات', department: 'العمليات', avatar: 'أ', status: 'active', permissions: ['operations', 'events', 'reports'], joined_at: '2025-03-15', last_active: '2026-03-31T13:00:00' },
  { id: 3, name: 'سارة المراجعة', email: 'sara@maham.sa', phone: '0550000003', role: 'مديرة المحتوى', department: 'التسويق', avatar: 'س', status: 'active', permissions: ['content', 'sponsors', 'assets'], joined_at: '2025-06-01', last_active: '2026-03-31T12:00:00' },
  { id: 4, name: 'محمد الحسابات', email: 'mohammed@maham.sa', phone: '0550000004', role: 'محاسب أول', department: 'المالية', avatar: 'م', status: 'active', permissions: ['finance', 'invoices', 'payments'], joined_at: '2025-04-10', last_active: '2026-03-31T11:00:00' },
  { id: 5, name: 'فاطمة القانونية', email: 'fatima@maham.sa', phone: '0550000005', role: 'مستشارة قانونية', department: 'الشؤون القانونية', avatar: 'ف', status: 'active', permissions: ['legal', 'contracts', 'compliance'], joined_at: '2025-07-20', last_active: '2026-03-31T10:00:00' },
  { id: 6, name: 'خالد التقني', email: 'khaled@maham.sa', phone: '0550000006', role: 'مطور أنظمة', department: 'تقنية المعلومات', avatar: 'خ', status: 'active', permissions: ['system', 'users', 'settings'], joined_at: '2025-05-01', last_active: '2026-03-30T16:00:00' },
  { id: 7, name: 'هند الموارد', email: 'hind@maham.sa', phone: '0550000007', role: 'مديرة الموارد البشرية', department: 'الموارد البشرية', avatar: 'ه', status: 'on_leave', permissions: ['hr', 'employees', 'payroll'], joined_at: '2025-08-15', last_active: '2026-03-28T09:00:00' },
  { id: 8, name: 'عمر المبيعات', email: 'omar@maham.sa', phone: '0550000008', role: 'مدير المبيعات', department: 'المبيعات', avatar: 'ع', status: 'active', permissions: ['sales', 'merchants', 'investors'], joined_at: '2025-09-01', last_active: '2026-03-31T09:00:00' },
]

const MOCK_ROLES: Role[] = [
  { id: 1, name: 'مدير تنفيذي', name_en: 'CEO', description: 'صلاحيات كاملة على جميع الأقسام', members_count: 1, permissions_count: 42, color: '#c9a84c' },
  { id: 2, name: 'مدير عمليات', name_en: 'Operations Manager', description: 'إدارة الفعاليات والعمليات والتقارير', members_count: 1, permissions_count: 28, color: '#00d4ff' },
  { id: 3, name: 'مدير محتوى', name_en: 'Content Manager', description: 'إدارة المحتوى والأصول والرعاة', members_count: 1, permissions_count: 18, color: '#00e5a0' },
  { id: 4, name: 'محاسب', name_en: 'Accountant', description: 'إدارة المالية والفواتير والمدفوعات', members_count: 1, permissions_count: 15, color: '#f59e0b' },
  { id: 5, name: 'مستشار قانوني', name_en: 'Legal Advisor', description: 'إدارة العقود والامتثال', members_count: 1, permissions_count: 12, color: '#e040fb' },
  { id: 6, name: 'مطور أنظمة', name_en: 'System Developer', description: 'إدارة النظام والمستخدمين', members_count: 1, permissions_count: 35, color: '#ff6b6b' },
  { id: 7, name: 'عارض', name_en: 'Viewer', description: 'صلاحيات القراءة فقط', members_count: 0, permissions_count: 8, color: '#888' },
]

const STATUS_LABELS: Record<string, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  on_leave: 'إجازة',
}

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'roles'>('members')
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState<string>('')
  const [showInvite, setShowInvite] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const departments = Array.from(new Set(MOCK_MEMBERS.map(m => m.department)))

  const filteredMembers = MOCK_MEMBERS.filter(m => {
    if (search && !m.name.includes(search) && !m.email.includes(search)) return false
    if (filterDept && m.department !== filterDept) return false
    return true
  })

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة الفريق"
        subtitle="الأعضاء والأدوار والصلاحيات"
        actions={
          <button onClick={() => setShowInvite(true)} className="h-9 px-4 rounded-lg bg-gold/10 border border-gold/25 text-sm text-gold hover:bg-gold/20 transition-all flex items-center gap-2">
            <UserPlus size={14} />
            دعوة عضو
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="أعضاء الفريق" value={MOCK_MEMBERS.length} icon={Users} delay={0} />
        <StatsCard title="نشطون" value={MOCK_MEMBERS.filter(m => m.status === 'active').length} icon={CheckCircle} delay={0.1} />
        <StatsCard title="الأدوار" value={MOCK_ROLES.length} icon={Shield} delay={0.2} />
        <StatsCard title="الأقسام" value={departments.length} icon={Activity} delay={0.3} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 mb-6 w-fit">
        <button onClick={() => setActiveTab('members')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'members' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
          <div className="flex items-center gap-2"><Users size={14} /> الأعضاء</div>
        </button>
        <button onClick={() => setActiveTab('roles')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'roles' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
          <div className="flex items-center gap-2"><Shield size={14} /> الأدوار والصلاحيات</div>
        </button>
      </div>

      {activeTab === 'members' ? (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد..." className="w-full h-9 pr-9 pl-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-all" />
            </div>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
              <option value="">كل الأقسام</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMembers.map((member, idx) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="glass-card p-5 hover:border-gold/20 transition-all group cursor-pointer" onClick={() => setSelectedMember(member)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-lg font-bold">
                        {member.avatar}
                      </div>
                      <div className={cn('absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-background', member.status === 'active' ? 'bg-success' : member.status === 'on_leave' ? 'bg-warning' : 'bg-muted-foreground')} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-1">
                        {member.name}
                        {member.role === 'مدير تنفيذي' && <Crown size={12} className="text-gold" />}
                      </h3>
                      <p className="text-xs text-gold">{member.role}</p>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toast.info('تعديل — قريباً') }} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors opacity-0 group-hover:opacity-100"><Edit size={13} /></button>
                </div>
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail size={11} /><span className="font-mono" dir="ltr">{member.email}</span></div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone size={11} /><span className="font-mono" dir="ltr">{member.phone}</span></div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <span className="text-[10px] text-muted-foreground">{member.department}</span>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full', member.status === 'active' ? 'bg-success/10 text-success' : member.status === 'on_leave' ? 'bg-warning/10 text-warning' : 'bg-muted/10 text-muted-foreground')}>
                    {STATUS_LABELS[member.status]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ROLES.map((role, idx) => (
            <motion.div key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} className="glass-card p-5 hover:border-gold/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${role.color}15`, border: `1px solid ${role.color}30` }}>
                    <Shield size={18} style={{ color: role.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{role.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{role.name_en}</p>
                  </div>
                </div>
                <button onClick={() => toast.info('تعديل الدور — قريباً')} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors opacity-0 group-hover:opacity-100"><Settings size={13} /></button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{role.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><Users size={11} /><span>{role.members_count} عضو</span></div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><Shield size={11} /><span>{role.permissions_count} صلاحية</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowInvite(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">دعوة عضو جديد</h3>
                <button onClick={() => setShowInvite(false)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="block text-sm font-medium text-foreground mb-1.5">الاسم الكامل</label><input type="text" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1.5">البريد الإلكتروني</label><input type="email" className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all" dir="ltr" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1.5">الدور</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all">
                    {MOCK_ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-foreground mb-1.5">القسم</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-gold/40 transition-all">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => { toast.info('سيتم الإرسال عند ربط الباك إند'); setShowInvite(false) }} className="flex-1 h-10 rounded-lg bg-gold/10 border border-gold/25 text-sm font-medium text-gold hover:bg-gold/20 transition-all">إرسال الدعوة</button>
                  <button onClick={() => setShowInvite(false)} className="h-10 px-6 rounded-lg bg-surface border border-border text-sm text-muted-foreground hover:text-foreground transition-all">إلغاء</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedMember(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">ملف العضو</h3>
                <button onClick={() => setSelectedMember(null)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-2">{selectedMember.avatar}</div>
                  <h4 className="text-lg font-bold text-foreground">{selectedMember.name}</h4>
                  <p className="text-xs text-gold">{selectedMember.role} — {selectedMember.department}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">البريد</p><p className="text-xs font-mono text-foreground" dir="ltr">{selectedMember.email}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الهاتف</p><p className="text-xs font-mono text-foreground" dir="ltr">{selectedMember.phone}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">تاريخ الانضمام</p><p className="text-xs text-foreground">{formatDate(selectedMember.joined_at)}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">آخر نشاط</p><p className="text-xs text-foreground">{formatDate(selectedMember.last_active)}</p></div>
                </div>
                <div className="mt-3 glass-card p-3">
                  <p className="text-[10px] text-muted-foreground mb-2">الصلاحيات</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMember.permissions.map(p => (
                      <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
