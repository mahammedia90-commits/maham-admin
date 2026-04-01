/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — إدارة المستخدمين (Users Management)
 * Design: Dark/Light glassmorphism, Gold accents, RTL-first
 * Features: بيانات تجريبية، CRUD كامل، نموذج إضافة/تعديل،
 *   تصفية متقدمة، عرض تفاصيل، إحصائيات، بحث
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Eye, Edit, Trash2, Shield, Mail, Phone,
  Search, Filter, Download, UserCheck, UserX, Building2,
  Calendar, MapPin, Globe, Lock, Unlock, MoreVertical,
  X, Check, AlertTriangle, Star, Activity
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, roleLabels, formatDate, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
  department: string
  city: string
  joinDate: string
  lastLogin: string
  avatar: string
  isVerified: boolean
  tasksCompleted: number
}

// ── بيانات تجريبية ──────────────────────────────────
const demoUsers: User[] = [
  { id: 1, name: 'سارة أحمد الحربي', email: 'sara@mahamexpo.sa', phone: '+966501234567', role: 'super_admin', status: 'active', department: 'الإدارة العامة', city: 'الرياض', joinDate: '2025-01-15', lastLogin: '2026-03-31T22:30:00', avatar: 'س', isVerified: true, tasksCompleted: 245 },
  { id: 2, name: 'محمد علي القحطاني', email: 'mohammed@mahamexpo.sa', phone: '+966502345678', role: 'department_manager', status: 'active', department: 'إدارة الفعاليات', city: 'الرياض', joinDate: '2025-03-20', lastLogin: '2026-03-31T18:15:00', avatar: 'م', isVerified: true, tasksCompleted: 189 },
  { id: 3, name: 'أحمد خالد العتيبي', email: 'ahmed@mahamexpo.sa', phone: '+966503456789', role: 'department_manager', status: 'active', department: 'الإدارة المالية', city: 'جدة', joinDate: '2025-04-10', lastLogin: '2026-03-30T14:00:00', avatar: 'أ', isVerified: true, tasksCompleted: 156 },
  { id: 4, name: 'نورة سعد المطيري', email: 'noura@mahamexpo.sa', phone: '+966504567890', role: 'staff', status: 'active', department: 'خدمة العملاء', city: 'الرياض', joinDate: '2025-06-01', lastLogin: '2026-03-31T20:45:00', avatar: 'ن', isVerified: true, tasksCompleted: 98 },
  { id: 5, name: 'عبدالله فهد الشمري', email: 'abdullah@mahamexpo.sa', phone: '+966505678901', role: 'staff', status: 'active', department: 'التسويق', city: 'الدمام', joinDate: '2025-07-15', lastLogin: '2026-03-29T11:30:00', avatar: 'ع', isVerified: true, tasksCompleted: 67 },
  { id: 6, name: 'ريم عبدالرحمن الزهراني', email: 'reem@mahamexpo.sa', phone: '+966506789012', role: 'staff', status: 'active', department: 'إدارة الفعاليات', city: 'الرياض', joinDate: '2025-08-20', lastLogin: '2026-03-31T16:00:00', avatar: 'ر', isVerified: true, tasksCompleted: 82 },
  { id: 7, name: 'تركي ناصر الدوسري', email: 'turki@mahamexpo.sa', phone: '+966507890123', role: 'staff', status: 'pending', department: 'العمليات', city: 'الرياض', joinDate: '2026-03-01', lastLogin: '', avatar: 'ت', isVerified: false, tasksCompleted: 5 },
  { id: 8, name: 'هند محمد السبيعي', email: 'hind@mahamexpo.sa', phone: '+966508901234', role: 'department_manager', status: 'active', department: 'الموارد البشرية', city: 'الرياض', joinDate: '2025-05-10', lastLogin: '2026-03-31T09:00:00', avatar: 'ه', isVerified: true, tasksCompleted: 134 },
  { id: 9, name: 'فيصل سعود العنزي', email: 'faisal@mahamexpo.sa', phone: '+966509012345', role: 'staff', status: 'rejected', department: 'تقنية المعلومات', city: 'جدة', joinDate: '2026-02-15', lastLogin: '', avatar: 'ف', isVerified: false, tasksCompleted: 0 },
  { id: 10, name: 'لمياء خالد الغامدي', email: 'lamya@mahamexpo.sa', phone: '+966510123456', role: 'staff', status: 'active', department: 'المبيعات', city: 'الرياض', joinDate: '2025-09-01', lastLogin: '2026-03-30T17:30:00', avatar: 'ل', isVerified: true, tasksCompleted: 71 },
  { id: 11, name: 'ماجد عبدالعزيز الحربي', email: 'majed@mahamexpo.sa', phone: '+966511234567', role: 'staff', status: 'active', department: 'الشؤون القانونية', city: 'الرياض', joinDate: '2025-10-15', lastLogin: '2026-03-28T13:00:00', avatar: 'ج', isVerified: true, tasksCompleted: 43 },
  { id: 12, name: 'دانة سلمان العمري', email: 'dana@mahamexpo.sa', phone: '+966512345678', role: 'staff', status: 'active', department: 'التسويق', city: 'الدمام', joinDate: '2025-11-20', lastLogin: '2026-03-31T21:00:00', avatar: 'د', isVerified: true, tasksCompleted: 55 },
]

const departments = ['الكل', 'الإدارة العامة', 'إدارة الفعاليات', 'الإدارة المالية', 'خدمة العملاء', 'التسويق', 'العمليات', 'الموارد البشرية', 'تقنية المعلومات', 'المبيعات', 'الشؤون القانونية']

const roleColors: Record<string, string> = {
  super_admin: 'bg-gold/15 text-gold border border-gold/20',
  department_manager: 'bg-info/15 text-info border border-info/20',
  staff: 'bg-chrome/15 text-chrome border border-chrome/20',
}

export default function UsersListPage() {
  const [, navigate] = useLocation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('الكل')
  const [users, setUsers] = useState<User[]>(demoUsers)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [detailUser, setDetailUser] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // ── نموذج الإضافة/التعديل ──────────────────────────
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: 'staff', department: 'إدارة الفعاليات', city: 'الرياض',
  })

  const perPage = 8

  // ── إحصائيات ──────────────────────────────────
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    admins: users.filter(u => u.role === 'super_admin').length,
    managers: users.filter(u => u.role === 'department_manager').length,
    staff: users.filter(u => u.role === 'staff').length,
  }), [users])

  // ── تصفية ──────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...users]
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter)
    if (statusFilter !== 'all') result = result.filter(u => u.status === statusFilter)
    if (deptFilter !== 'الكل') result = result.filter(u => u.department === deptFilter)
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(u =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.phone.includes(s) ||
        u.department.includes(s)
      )
    }
    return result
  }, [users, roleFilter, statusFilter, deptFilter, search])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  // ── إجراءات ──────────────────────────────────
  const handleAdd = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: 'pending',
      department: formData.department,
      city: formData.city,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: '',
      avatar: formData.name.charAt(0),
      isVerified: false,
      tasksCompleted: 0,
    }
    setUsers(prev => [newUser, ...prev])
    toast.success(`تمت إضافة المستخدم: ${formData.name}`)
    setShowAddModal(false)
    setFormData({ name: '', email: '', phone: '', role: 'staff', department: 'إدارة الفعاليات', city: 'الرياض' })
  }

  const handleEdit = () => {
    if (!editUser) return
    setUsers(prev => prev.map(u => u.id === editUser.id ? {
      ...u,
      name: formData.name || u.name,
      email: formData.email || u.email,
      phone: formData.phone || u.phone,
      role: formData.role || u.role,
      department: formData.department || u.department,
      city: formData.city || u.city,
    } : u))
    toast.success(`تم تحديث بيانات: ${formData.name || editUser.name}`)
    setEditUser(null)
  }

  const handleDelete = (id: number) => {
    const user = users.find(u => u.id === id)
    setUsers(prev => prev.filter(u => u.id !== id))
    toast.success(`تم حذف المستخدم: ${user?.name}`)
    setDeleteConfirm(null)
  }

  const handleToggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u
      const newStatus = u.status === 'active' ? 'rejected' : 'active'
      toast.info(`تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} حساب: ${u.name}`)
      return { ...u, status: newStatus }
    }))
  }

  const openEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      city: user.city,
    })
    setEditUser(user)
  }

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة المستخدمين"
        subtitle={`${stats.total} مستخدم — ${stats.active} نشط — ${stats.pending} بانتظار التفعيل`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/roles')}
              className="h-9 px-4 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all flex items-center gap-2"
            >
              <Shield size={14} />
              الأدوار
            </button>
            <button
              onClick={() => toast.info('جاري تصدير المستخدمين...')}
              className="h-9 px-3 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all flex items-center gap-2"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => { setFormData({ name: '', email: '', phone: '', role: 'staff', department: 'إدارة الفعاليات', city: 'الرياض' }); setShowAddModal(true) }}
              className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة مستخدم
            </button>
          </div>
        }
      />

      {/* ── إحصائيات ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="إجمالي المستخدمين" value={formatNumber(stats.total)} icon={Users} delay={0} />
        <StatsCard title="مستخدمون نشطون" value={formatNumber(stats.active)} icon={UserCheck} trend={8} trendLabel="هذا الشهر" delay={0.05} />
        <StatsCard title="مدراء الأقسام" value={formatNumber(stats.managers)} icon={Shield} delay={0.1} />
        <StatsCard title="بانتظار التفعيل" value={formatNumber(stats.pending)} icon={Activity} delay={0.15} />
      </div>

      {/* ── فلاتر الأدوار ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4 flex-wrap">
        {[
          { key: 'all', label: 'الكل', count: stats.total },
          { key: 'super_admin', label: 'مدير عام', count: stats.admins },
          { key: 'department_manager', label: 'مدير قسم', count: stats.managers },
          { key: 'staff', label: 'موظف', count: stats.staff },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => { setRoleFilter(f.key); setPage(1) }}
            className={cn(
              'h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
              roleFilter === f.key
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            {f.label}
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', roleFilter === f.key ? 'bg-gold/20' : 'bg-surface3')}>{f.count}</span>
          </button>
        ))}

        <div className="mr-auto flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'h-8 px-3 rounded-lg text-xs transition-all flex items-center gap-1.5 border',
              showFilters ? 'border-gold/30 bg-gold/10 text-gold' : 'border-transparent bg-surface2/50 text-muted-foreground'
            )}
          >
            <Filter size={12} />
            فلاتر متقدمة
          </button>
        </div>
      </div>

      {/* ── فلاتر متقدمة ──────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 mb-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">الحالة</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                  className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="pending">بانتظار التفعيل</option>
                  <option value="rejected">معطل</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">القسم</label>
                <select
                  value={deptFilter}
                  onChange={(e) => { setDeptFilter(e.target.value); setPage(1) }}
                  className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setRoleFilter('all'); setStatusFilter('all'); setDeptFilter('الكل'); setSearch(''); setPage(1) }}
                  className="h-9 px-4 rounded-lg bg-surface2 border border-border/50 text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  مسح الفلاتر
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── جدول المستخدمين ──────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="relative w-full sm:w-56 md:w-64 lg:w-72">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="بحث بالاسم أو البريد أو الجوال..."
              className="w-full h-10 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
            />
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} مستخدم</span>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">المستخدم</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الجوال</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الدور</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">القسم</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الحالة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">آخر دخول</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm">لا يوجد مستخدمون مطابقون</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {paged.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-border/30 hover:bg-surface2/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                              {user.avatar}
                            </div>
                            {user.isVerified && (
                              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                                <Check size={8} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Mail size={10} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-xs text-muted-foreground" dir="ltr">{user.phone}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full', roleColors[user.role])}>
                          <Shield size={10} />
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 size={10} />
                          {user.department}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[11px] text-muted-foreground">
                          {user.lastLogin ? formatDate(user.lastLogin) : 'لم يسجل دخول'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-0.5">
                          <button
                            onClick={() => setDetailUser(user)}
                            className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"
                            title="عرض"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEdit(user)}
                            className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"
                            title="تعديل"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              user.status === 'active'
                                ? 'hover:bg-warning/10 text-muted-foreground hover:text-warning'
                                : 'hover:bg-success/10 text-muted-foreground hover:text-success'
                            )}
                            title={user.status === 'active' ? 'تعطيل' : 'تفعيل'}
                          >
                            {user.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground">صفحة {page} من {totalPages}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                    p === page ? 'bg-gold text-black' : 'hover:bg-surface2 text-muted-foreground'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── نافذة تفاصيل المستخدم ──────────────────── */}
      <AnimatePresence>
        {detailUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setDetailUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-2xl">
                        {detailUser.avatar}
                      </div>
                      {detailUser.isVerified && (
                        <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-success flex items-center justify-center border-2 border-background">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{detailUser.name}</h2>
                      <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1', roleColors[detailUser.role])}>
                        <Shield size={10} />
                        {roleLabels[detailUser.role]}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setDetailUser(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <InfoItem icon={Mail} label="البريد" value={detailUser.email} />
                  <InfoItem icon={Phone} label="الجوال" value={detailUser.phone} dir="ltr" />
                  <InfoItem icon={Building2} label="القسم" value={detailUser.department} />
                  <InfoItem icon={MapPin} label="المدينة" value={detailUser.city} />
                  <InfoItem icon={Calendar} label="تاريخ الانضمام" value={formatDate(detailUser.joinDate)} />
                  <InfoItem icon={Activity} label="المهام المنجزة" value={`${detailUser.tasksCompleted} مهمة`} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface2/50 border border-border/30">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={detailUser.status} />
                    <span className="text-xs text-muted-foreground">
                      آخر دخول: {detailUser.lastLogin ? formatDate(detailUser.lastLogin) : 'لم يسجل دخول'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── نافذة إضافة/تعديل مستخدم ──────────────────── */}
      <AnimatePresence>
        {(showAddModal || editUser) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => { setShowAddModal(false); setEditUser(null) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-md p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  {editUser ? <Edit size={18} className="text-gold" /> : <Plus size={18} className="text-gold" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{editUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h3>
                  <p className="text-xs text-muted-foreground">{editUser ? 'تعديل بيانات المستخدم' : 'أدخل بيانات المستخدم الجديد'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <FormField label="الاسم الكامل" value={formData.name} onChange={(v) => setFormData(p => ({ ...p, name: v }))} placeholder="أدخل الاسم الكامل" required />
                <FormField label="البريد الإلكتروني" value={formData.email} onChange={(v) => setFormData(p => ({ ...p, email: v }))} placeholder="example@mahamexpo.sa" type="email" required />
                <FormField label="رقم الجوال" value={formData.phone} onChange={(v) => setFormData(p => ({ ...p, phone: v }))} placeholder="+966500000000" dir="ltr" required />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">الدور</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"
                    >
                      <option value="staff">موظف</option>
                      <option value="department_manager">مدير قسم</option>
                      <option value="super_admin">مدير عام</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">القسم</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(p => ({ ...p, department: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"
                    >
                      {departments.filter(d => d !== 'الكل').map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">المدينة</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة">مكة المكرمة</option>
                    <option value="المدينة">المدينة المنورة</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={editUser ? handleEdit : handleAdd}
                  className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all"
                >
                  {editUser ? 'حفظ التعديلات' : 'إضافة المستخدم'}
                </button>
                <button
                  onClick={() => { setShowAddModal(false); setEditUser(null) }}
                  className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── تأكيد الحذف ──────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-sm p-4 sm:p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-danger" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">تأكيد الحذف</h3>
              <p className="text-sm text-muted-foreground mb-5">
                هل أنت متأكد من حذف المستخدم <span className="text-foreground font-medium">{users.find(u => u.id === deleteConfirm)?.name}</span>؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all"
                >
                  حذف
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

// ── مكونات مساعدة ──────────────────────────────────
function InfoItem({ icon: Icon, label, value, dir }: { icon: typeof Mail; label: string; value: string; dir?: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-foreground flex items-center gap-1.5" dir={dir}>
        <Icon size={13} className="text-gold" />
        {value}
      </p>
    </div>
  )
}

function FormField({ label, value, onChange, placeholder, type = 'text', dir, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; dir?: string; required?: boolean
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
      />
    </div>
  )
}
