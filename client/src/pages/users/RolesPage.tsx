import { motion } from 'framer-motion'
import { Shield, Users, Check, X, Edit, Plus } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const roles = [
  { id: 1, name: 'مدير عام', code: 1989, users: 2, color: 'from-gold/20 to-gold/5', permissions: ['all'] },
  { id: 2, name: 'مدير قسم', code: 2, users: 5, color: 'from-chrome/20 to-chrome/5', permissions: ['events.view', 'events.edit', 'users.view', 'reports.view'] },
  { id: 3, name: 'موظف', code: 3, users: 15, color: 'from-info/20 to-info/5', permissions: ['events.view', 'requests.view'] },
  { id: 4, name: 'تاجر', code: 4, users: 120, color: 'from-success/20 to-success/5', permissions: ['events.view', 'requests.create'] },
  { id: 5, name: 'مستثمر', code: 5, users: 45, color: 'from-warning/20 to-warning/5', permissions: ['events.view', 'finance.view'] },
  { id: 6, name: 'راعي', code: 6, users: 18, color: 'from-gold/15 to-gold/5', permissions: ['events.view', 'sponsors.view'] },
]

const allPermissions = [
  { group: 'الفعاليات', perms: ['events.view', 'events.create', 'events.edit', 'events.delete', 'events.publish'] },
  { group: 'الطلبات', perms: ['requests.view', 'requests.create', 'requests.approve', 'requests.reject'] },
  { group: 'المستخدمون', perms: ['users.view', 'users.create', 'users.edit', 'users.delete'] },
  { group: 'المالية', perms: ['finance.view', 'finance.create', 'finance.refund'] },
  { group: 'التقارير', perms: ['reports.view', 'reports.export'] },
  { group: 'الإعدادات', perms: ['settings.view', 'settings.edit'] },
]

export default function RolesPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="الأدوار والصلاحيات"
        subtitle="إدارة أدوار المستخدمين ومصفوفة الصلاحيات"
        showBack
        actions={
          <button
            onClick={() => toast.info('إنشاء دور جديد — قريباً')}
            className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            إنشاء دور جديد
          </button>
        }
      />

      {/* Roles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {roles.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn('glass-card p-5 bg-gradient-to-br group hover:border-gold/30 transition-all', role.color)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Shield size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{role.name}</h3>
                  <p className="text-[11px] text-muted-foreground">كود: {role.code}</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors opacity-0 group-hover:opacity-100">
                <Edit size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users size={12} />
                {role.users} مستخدم
              </span>
              <span className="text-xs text-gold">
                {role.permissions.includes('all') ? 'كل الصلاحيات' : `${role.permissions.length} صلاحية`}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-4 border-b border-border/50">
          <h3 className="text-sm font-bold text-foreground">مصفوفة الصلاحيات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الصلاحية</th>
                {roles.map(r => (
                  <th key={r.id} className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((group) => (
                <>
                  <tr key={group.group} className="bg-surface2/30">
                    <td colSpan={roles.length + 1} className="px-4 py-2 text-xs font-bold text-gold">{group.group}</td>
                  </tr>
                  {group.perms.map((perm) => (
                    <tr key={perm} className="border-b border-border/20 hover:bg-surface2/30">
                      <td className="px-4 py-2 text-xs text-foreground">{perm}</td>
                      {roles.map(r => (
                        <td key={r.id} className="px-3 py-2 text-center">
                          {r.permissions.includes('all') || r.permissions.includes(perm) ? (
                            <Check size={14} className="text-success mx-auto" />
                          ) : (
                            <X size={14} className="text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  )
}
