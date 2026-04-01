import { useState } from 'react'
import { useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LOGO_URL } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard, Calendar, FileText, Users, DollarSign, Megaphone,
  TrendingUp, Settings, BarChart3, Brain, UserCheck, Briefcase,
  Scale, Cog, HeadphonesIcon, FolderKanban, Handshake, Building2,
  Monitor, FileArchive, Shield, ChevronDown, LogOut, PanelRightClose,
  PanelRightOpen, Workflow, Globe, ClipboardList
} from 'lucide-react'

interface NavItem {
  label: string
  icon: any
  path: string
  children?: { label: string; path: string }[]
  permission?: string
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'البوابات',
    items: [
      { label: 'بوابة المستثمر', icon: Building2, path: '/portals/investor' },
      { label: 'بوابة التاجر', icon: Briefcase, path: '/portals/merchant' },
      { label: 'بوابة الراعي', icon: Handshake, path: '/portals/sponsor' },
    ],
  },
  {
    title: 'الرئيسية',
    items: [
      { label: 'لوحة التحكم', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'العقل التنفيذي AI', icon: Brain, path: '/ai' },
    ],
  },
  {
    title: 'إدارة الأعمال',
    items: [
      { label: 'إدارة الفعاليات', icon: Calendar, path: '/events', children: [
        { label: 'قائمة الفعاليات', path: '/events' },
        { label: 'إنشاء فعالية', path: '/events/create' },
      ]},
      { label: 'الطلبات', icon: FileText, path: '/requests' },
      { label: 'المستخدمون', icon: Users, path: '/users', children: [
        { label: 'قائمة المستخدمين', path: '/users' },
        { label: 'الأدوار والصلاحيات', path: '/users/roles' },
      ]},
    ],
  },
  {
    title: 'المالية والمبيعات',
    items: [
      { label: 'النظام المالي', icon: DollarSign, path: '/finance', children: [
        { label: 'الفواتير', path: '/finance/invoices' },
        { label: 'المدفوعات', path: '/finance/payments' },
      ]},
      { label: 'المبيعات', icon: TrendingUp, path: '/sales' },
      { label: 'إدارة العملاء CRM', icon: UserCheck, path: '/crm' },
    ],
  },
  {
    title: 'التسويق والعمليات',
    items: [
      { label: 'التسويق', icon: Megaphone, path: '/marketing' },
      { label: 'العمليات', icon: Cog, path: '/operations' },
      { label: 'سير العمل', icon: Workflow, path: '/workflows' },
    ],
  },
  {
    title: 'الإدارة',
    items: [
      { label: 'الشؤون القانونية', icon: Scale, path: '/legal' },
      { label: 'الموارد البشرية', icon: ClipboardList, path: '/hr' },
      { label: 'خدمة العملاء 360', icon: HeadphonesIcon, path: '/support' },
      { label: 'إدارة المشاريع', icon: FolderKanban, path: '/projects' },
      { label: 'الرعاة والشركاء', icon: Handshake, path: '/sponsors' },
    ],
  },
  {
    title: 'النظام',
    items: [
      { label: 'التقارير والتحليلات', icon: BarChart3, path: '/reports' },
      { label: 'سجل التدقيق', icon: Shield, path: '/audit' },
      { label: 'الخدمات الحكومية', icon: Globe, path: '/government' },
      { label: 'مراقبة النظام', icon: Monitor, path: '/monitoring' },
      { label: 'إدارة الملفات', icon: FileArchive, path: '/files' },
      { label: 'الإعدادات', icon: Settings, path: '/settings' },
    ],
  },
]

export default function Sidebar() {
  const [location, navigate] = useLocation()
  const { sidebarCollapsed, toggleCollapse } = useUIStore()
  const { user, logout: authLogout } = useAuthStore()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (path: string) => {
    setExpandedItems(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    )
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') return location === '/dashboard'
    return location.startsWith(path)
  }

  const handleLogout = () => {
    authLogout()
    navigate('/login')
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed right-0 top-0 h-screen z-40 flex flex-col bg-sidebar border-l border-sidebar-border overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <img src={LOGO_URL} alt="Maham Expo" className="h-9 object-contain" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-gold transition-all"
        >
          {sidebarCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="mb-3">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 py-1.5 text-[10px] font-bold text-gold/60 uppercase tracking-widest"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            {section.items.map((item) => {
              const active = isActive(item.path)
              const expanded = expandedItems.includes(item.path)
              const hasChildren = item.children && item.children.length > 0

              return (
                <div key={item.path}>
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpand(item.path)
                        if (!active) navigate(item.path)
                      } else {
                        navigate(item.path)
                      }
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                      active
                        ? 'bg-gold/10 text-gold border border-gold/20'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon size={18} className={cn(
                      'shrink-0 transition-colors',
                      active ? 'text-gold' : 'text-muted-foreground group-hover:text-gold/70'
                    )} />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex-1 text-right whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {hasChildren && !sidebarCollapsed && (
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-200',
                          expanded && 'rotate-180'
                        )}
                      />
                    )}
                  </button>
                  {/* Children */}
                  <AnimatePresence>
                    {hasChildren && expanded && !sidebarCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mr-6 mt-0.5 space-y-0.5"
                      >
                        {item.children!.map((child) => (
                          <button
                            key={child.path}
                            onClick={() => navigate(child.path)}
                            className={cn(
                              'w-full text-right px-3 py-1.5 rounded-md text-xs transition-all border-r-2',
                              location === child.path
                                ? 'text-gold border-gold bg-gold/5'
                                : 'text-muted-foreground hover:text-foreground border-transparent hover:border-gold/30'
                            )}
                          >
                            {child.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-sidebar-border">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center text-gold font-bold text-sm">
              {user?.name?.charAt(0) || 'م'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || 'المدير'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.role || 'مدير عام'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all"
              title="تسجيل الخروج"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all flex justify-center"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </motion.aside>
  )
}
