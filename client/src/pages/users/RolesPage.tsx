/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — الأدوار والصلاحيات (Roles & Permissions)
 * Design: Dark/Light glassmorphism, Gold accents, RTL-first
 * Features: مصفوفة صلاحيات تفاعلية، CRUD أدوار، تبديل صلاحيات
 * ═══════════════════════════════════════════════════════
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, Check, X, Plus, Trash2,
  Lock, Eye, Settings, FileText, DollarSign,
  BarChart3, Calendar, Megaphone, Briefcase,
  AlertTriangle, Copy, Save
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Role {
  id: number
  name: string
  nameEn: string
  description: string
  usersCount: number
  color: string
  isSystem: boolean
  permissions: string[]
}

interface PermissionGroup {
  group: string
  icon: typeof Shield
  perms: { key: string; label: string }[]
}

const initialRoles: Role[] = [
  { id: 1, name: 'مدير عام', nameEn: 'Super Admin', description: 'صلاحيات كاملة على جميع أقسام النظام', usersCount: 2, color: 'from-gold/20 to-gold/5', isSystem: true, permissions: ['all'] },
  { id: 2, name: 'مدير قسم', nameEn: 'Department Manager', description: 'إدارة القسم المحدد مع صلاحيات مراجعة', usersCount: 5, color: 'from-info/20 to-info/5', isSystem: true, permissions: ['events.view','events.create','events.edit','requests.view','requests.approve','requests.reject','users.view','finance.view','reports.view','reports.export','crm.view','crm.create','marketing.view','operations.view'] },
  { id: 3, name: 'موظف', nameEn: 'Staff', description: 'صلاحيات محدودة للعمليات اليومية', usersCount: 15, color: 'from-chrome/20 to-chrome/5', isSystem: true, permissions: ['events.view','requests.view','requests.create','users.view','crm.view','support.view','support.create'] },
  { id: 4, name: 'مدير مالي', nameEn: 'Finance Manager', description: 'إدارة كاملة للشؤون المالية والعقود', usersCount: 3, color: 'from-success/20 to-success/5', isSystem: false, permissions: ['finance.view','finance.create','finance.edit','finance.refund','finance.zatca','reports.view','reports.export','events.view'] },
  { id: 5, name: 'مدير تسويق', nameEn: 'Marketing Manager', description: 'إدارة الحملات التسويقية والمحتوى', usersCount: 2, color: 'from-warning/20 to-warning/5', isSystem: false, permissions: ['marketing.view','marketing.create','marketing.edit','crm.view','crm.create','reports.view','events.view'] },
  { id: 6, name: 'مشرف دعم', nameEn: 'Support Supervisor', description: 'إشراف على فريق خدمة العملاء', usersCount: 4, color: 'from-chart-5/20 to-chart-5/5', isSystem: false, permissions: ['support.view','support.create','support.edit','support.assign','users.view','events.view','crm.view'] },
]

const permissionGroups: PermissionGroup[] = [
  { group: 'الفعاليات', icon: Calendar, perms: [{ key: 'events.view', label: 'عرض' },{ key: 'events.create', label: 'إنشاء' },{ key: 'events.edit', label: 'تعديل' },{ key: 'events.delete', label: 'حذف' },{ key: 'events.publish', label: 'نشر' }] },
  { group: 'الطلبات', icon: FileText, perms: [{ key: 'requests.view', label: 'عرض' },{ key: 'requests.create', label: 'إنشاء' },{ key: 'requests.approve', label: 'موافقة' },{ key: 'requests.reject', label: 'رفض' }] },
  { group: 'المستخدمون', icon: Users, perms: [{ key: 'users.view', label: 'عرض' },{ key: 'users.create', label: 'إنشاء' },{ key: 'users.edit', label: 'تعديل' },{ key: 'users.delete', label: 'حذف' }] },
  { group: 'المالية', icon: DollarSign, perms: [{ key: 'finance.view', label: 'عرض' },{ key: 'finance.create', label: 'إنشاء' },{ key: 'finance.edit', label: 'تعديل' },{ key: 'finance.refund', label: 'استرداد' },{ key: 'finance.zatca', label: 'ZATCA' }] },
  { group: 'التقارير', icon: BarChart3, perms: [{ key: 'reports.view', label: 'عرض' },{ key: 'reports.export', label: 'تصدير' }] },
  { group: 'CRM', icon: Briefcase, perms: [{ key: 'crm.view', label: 'عرض' },{ key: 'crm.create', label: 'إنشاء' },{ key: 'crm.edit', label: 'تعديل' },{ key: 'crm.delete', label: 'حذف' }] },
  { group: 'التسويق', icon: Megaphone, perms: [{ key: 'marketing.view', label: 'عرض' },{ key: 'marketing.create', label: 'إنشاء' },{ key: 'marketing.edit', label: 'تعديل' }] },
  { group: 'العمليات', icon: Settings, perms: [{ key: 'operations.view', label: 'عرض' },{ key: 'operations.manage', label: 'إدارة' }] },
  { group: 'الدعم', icon: Eye, perms: [{ key: 'support.view', label: 'عرض' },{ key: 'support.create', label: 'إنشاء' },{ key: 'support.edit', label: 'تعديل' },{ key: 'support.assign', label: 'تعيين' }] },
  { group: 'الإعدادات', icon: Lock, perms: [{ key: 'settings.view', label: 'عرض' },{ key: 'settings.edit', label: 'تعديل' }] },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [selectedRole, setSelectedRole] = useState<number>(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', nameEn: '', description: '' })
  const [hasChanges, setHasChanges] = useState(false)

  const activeRole = roles.find(r => r.id === selectedRole)
  const totalPerms = permissionGroups.reduce((s, g) => s + g.perms.length, 0)

  const hasPerm = (perm: string) => {
    if (!activeRole) return false
    return activeRole.permissions.includes('all') || activeRole.permissions.includes(perm)
  }

  const togglePerm = (perm: string) => {
    if (!activeRole || activeRole.permissions.includes('all')) return
    setRoles(prev => prev.map(r => {
      if (r.id !== selectedRole) return r
      const perms = r.permissions.includes(perm) ? r.permissions.filter(p => p !== perm) : [...r.permissions, perm]
      return { ...r, permissions: perms }
    }))
    setHasChanges(true)
  }

  const toggleGroupAll = (group: PermissionGroup) => {
    if (!activeRole || activeRole.permissions.includes('all')) return
    const allPerms = group.perms.map(p => p.key)
    const allChecked = allPerms.every(p => activeRole.permissions.includes(p))
    setRoles(prev => prev.map(r => {
      if (r.id !== selectedRole) return r
      const perms = allChecked ? r.permissions.filter(p => !allPerms.includes(p)) : Array.from(new Set([...r.permissions, ...allPerms]))
      return { ...r, permissions: perms }
    }))
    setHasChanges(true)
  }

  const handleSavePermissions = () => {
    toast.success(`تم حفظ صلاحيات: ${activeRole?.name}`)
    setHasChanges(false)
  }

  const handleAddRole = () => {
    if (!formData.name) { toast.error('يرجى إدخال اسم الدور'); return }
    const newRole: Role = {
      id: Math.max(...roles.map(r => r.id)) + 1, name: formData.name, nameEn: formData.nameEn || formData.name,
      description: formData.description, usersCount: 0, color: 'from-gold/15 to-gold/5', isSystem: false, permissions: [],
    }
    setRoles(prev => [...prev, newRole])
    setSelectedRole(newRole.id)
    toast.success(`تم إنشاء الدور: ${formData.name}`)
    setShowAddModal(false)
    setFormData({ name: '', nameEn: '', description: '' })
  }

  const handleDeleteRole = (id: number) => {
    const role = roles.find(r => r.id === id)
    if (role?.isSystem) { toast.error('لا يمكن حذف دور نظامي'); return }
    setRoles(prev => prev.filter(r => r.id !== id))
    if (selectedRole === id) setSelectedRole(roles[0]?.id || 1)
    toast.success(`تم حذف الدور: ${role?.name}`)
    setDeleteConfirm(null)
  }

  const handleDuplicate = (role: Role) => {
    const newRole: Role = { ...role, id: Math.max(...roles.map(r => r.id)) + 1, name: `${role.name} (نسخة)`, nameEn: `${role.nameEn} (Copy)`, isSystem: false, usersCount: 0 }
    setRoles(prev => [...prev, newRole])
    setSelectedRole(newRole.id)
    toast.success(`تم نسخ الدور: ${role.name}`)
  }

  const activePermsCount = activeRole?.permissions.includes('all') ? totalPerms : (activeRole?.permissions.length || 0)

  return (
    <AdminLayout>
      <PageHeader
        title="الأدوار والصلاحيات"
        subtitle={`${roles.length} دور — ${totalPerms} صلاحية متاحة`}
        showBack
        actions={
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button onClick={handleSavePermissions} className="h-9 px-4 rounded-xl bg-success/10 border border-success/20 text-success font-bold text-sm hover:bg-success/20 transition-all flex items-center gap-2 animate-pulse">
                <Save size={14} /> حفظ التغييرات
              </button>
            )}
            <button onClick={() => { setFormData({ name: '', nameEn: '', description: '' }); setShowAddModal(true) }} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
              <Plus size={16} /> إنشاء دور جديد
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* قائمة الأدوار */}
        <div className="space-y-2">
          {roles.map((role, i) => (
            <motion.div key={role.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedRole(role.id)}
              className={cn('glass-card p-4 cursor-pointer group transition-all', selectedRole === role.id ? 'border-gold/40 bg-gold/5 shadow-lg shadow-gold/5' : 'hover:border-gold/20')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border transition-all', selectedRole === role.id ? 'bg-gold/20 border-gold/30' : 'bg-gold/10 border-gold/20')}>
                    <Shield size={18} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{role.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{role.nameEn}</p>
                  </div>
                </div>
                {!role.isSystem && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); handleDuplicate(role) }} className="p-1 rounded hover:bg-surface2 text-muted-foreground hover:text-gold" title="نسخ"><Copy size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(role.id) }} className="p-1 rounded hover:bg-danger/10 text-muted-foreground hover:text-danger" title="حذف"><Trash2 size={12} /></button>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 line-clamp-1">{role.description}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Users size={11} />{role.usersCount} مستخدم</span>
                <span className="text-[11px] text-gold">{role.permissions.includes('all') ? 'كل الصلاحيات' : `${role.permissions.length} صلاحية`}</span>
              </div>
              {role.isSystem && <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/15 mt-2"><Lock size={8} />نظامي</span>}
            </motion.div>
          ))}
        </div>

        {/* مصفوفة الصلاحيات */}
        <div className="lg:col-span-3">
          {activeRole && (
            <motion.div key={activeRole.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Shield size={18} className="text-gold" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">صلاحيات: {activeRole.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{activePermsCount} من {totalPerms} صلاحية مفعّلة</p>
                  </div>
                </div>
                {activeRole.permissions.includes('all') && <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">صلاحيات كاملة</span>}
              </div>

              <div className="px-4 pt-3">
                <div className="w-full h-2 rounded-full bg-surface3 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(activePermsCount / totalPerms) * 100}%` }} className="h-full rounded-full bg-gradient-to-l from-gold to-gold-light" transition={{ duration: 0.5 }} />
                </div>
              </div>

              <div className="p-4 space-y-3">
                {permissionGroups.map((group) => {
                  const GroupIcon = group.icon
                  const allChecked = group.perms.every(p => hasPerm(p.key))
                  const someChecked = group.perms.some(p => hasPerm(p.key))
                  return (
                    <div key={group.group} className="rounded-xl border border-border/30 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-surface2/30 cursor-pointer hover:bg-surface2/50 transition-colors" onClick={() => toggleGroupAll(group)}>
                        <div className="flex items-center gap-2">
                          <GroupIcon size={14} className="text-gold" />
                          <span className="text-xs font-bold text-foreground">{group.group}</span>
                          <span className="text-[10px] text-muted-foreground">({group.perms.filter(p => hasPerm(p.key)).length}/{group.perms.length})</span>
                        </div>
                        <div className={cn('w-5 h-5 rounded flex items-center justify-center border transition-all', allChecked ? 'bg-gold border-gold' : someChecked ? 'bg-gold/30 border-gold/50' : 'bg-surface3 border-border/50')}>
                          {allChecked && <Check size={12} className="text-black" />}
                          {someChecked && !allChecked && <div className="w-2 h-0.5 bg-gold rounded" />}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3">
                        {group.perms.map((perm) => {
                          const checked = hasPerm(perm.key)
                          const isAll = activeRole.permissions.includes('all')
                          return (
                            <button key={perm.key} onClick={() => togglePerm(perm.key)} disabled={isAll}
                              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border', checked ? 'bg-gold/10 text-gold border-gold/20 hover:bg-gold/20' : 'bg-surface2/50 text-muted-foreground border-transparent hover:border-border/50 hover:text-foreground', isAll && 'opacity-60 cursor-not-allowed')}>
                              <div className={cn('w-3.5 h-3.5 rounded flex items-center justify-center border transition-all', checked ? 'bg-gold border-gold' : 'bg-surface3 border-border/50')}>
                                {checked && <Check size={8} className="text-black" />}
                              </div>
                              {perm.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* نافذة إضافة دور */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Shield size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">إنشاء دور جديد</h3><p className="text-xs text-muted-foreground">أدخل بيانات الدور الجديد</p></div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم الدور (عربي) <span className="text-danger">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="مثال: مدير مشاريع" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم الدور (إنجليزي)</label>
                  <input type="text" value={formData.nameEn} onChange={(e) => setFormData(p => ({ ...p, nameEn: e.target.value }))} placeholder="e.g. Project Manager" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">الوصف</label>
                  <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="وصف مختصر للدور..." rows={3} className="w-full p-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAddRole} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إنشاء الدور</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-4 sm:p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف الدور</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف الدور <span className="text-foreground font-medium">{roles.find(r => r.id === deleteConfirm)?.name}</span>؟</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDeleteRole(deleteConfirm)} className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
