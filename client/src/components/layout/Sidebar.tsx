import { useState, useEffect } from 'react'
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
  FileArchive, Shield, ChevronDown, LogOut, PanelRightClose,
  PanelRightOpen, Workflow, ClipboardList, UsersRound,
  MessageSquare, Bell, Fingerprint, MapPin, BookOpen, Clock,
  UserPlus, Target, Wrench, Image, Star, DoorOpen, Cpu,
  Activity, Radio, Eye, Gift, PieChart, Network, Award,
  Crosshair, Kanban, PhoneForwarded, ShieldAlert, Trophy, CreditCard, Zap
} from 'lucide-react'

interface NavItem {
  label: string
  icon: any
  path: string
  children?: { label: string; path: string }[]
  permission?: string
  badge?: string
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'البوابات',
    items: [
      { label: 'بوابة المستثمر', icon: Building2, path: '/portal/investor', badge: 'مركز تحكم' },
      { label: 'بوابة التاجر', icon: Briefcase, path: '/portal/merchant', badge: 'مركز تحكم' },
      { label: 'بوابة الراعي', icon: Handshake, path: '/portal/sponsor', badge: 'مركز تحكم' },
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
      { label: 'الحجوزات', icon: BookOpen, path: '/bookings' },
      { label: 'المساحات والأجنحة', icon: MapPin, path: '/spaces' },
      { label: 'إدارة الحشود', icon: UsersRound, path: '/crowd' },
      { label: 'قوائم الانتظار', icon: Clock, path: '/waitlist' },
    ],
  },
  {
    title: 'المستخدمون والصلاحيات',
    items: [
      { label: 'المستخدمون', icon: Users, path: '/users' },
      { label: 'الأدوار والصلاحيات', icon: Shield, path: '/roles' },
      { label: 'التحقق من الهوية KYC', icon: Fingerprint, path: '/kyc' },
      { label: 'إدارة الفرق', icon: UserPlus, path: '/teams' },
    ],
  },
  {
    title: 'المالية',
    items: [
      { label: 'النظام المالي', icon: DollarSign, path: '/finance' },
    ],
  },
  {
    title: 'التسويق والمبيعات',
    items: [
      { label: 'المبيعات', icon: TrendingUp, path: '/sales' },
      { label: 'إدارة العملاء CRM', icon: UserCheck, path: '/crm' },
      { label: 'التسويق', icon: Megaphone, path: '/marketing' },
    ],
  },
  {
    title: 'محرك الإيرادات',
    items: [
      { label: 'توليد العملاء', icon: Crosshair, path: '/leads', badge: 'جديد' },
      { label: 'أنبوب المبيعات', icon: Kanban, path: '/pipeline', badge: 'Kanban' },
      { label: 'محرك المتابعات', icon: PhoneForwarded, path: '/followups' },
      { label: 'متابعة الأداء', icon: ShieldAlert, path: '/enforcement' },
      { label: 'أداء المبيعات', icon: Trophy, path: '/sales-performance' },
      { label: 'تذكيرات الدفع', icon: CreditCard, path: '/payment-reminders' },
      { label: 'ذكاء المبيعات AI', icon: Zap, path: '/ai/sales-intelligence', badge: 'AI' },
    ],
  },
  {
    title: 'الاستثمار والرعاية',
    items: [
      { label: 'الرعاة والشركاء', icon: Handshake, path: '/sponsors' },
      { label: 'فرص الاستثمار', icon: Target, path: '/opportunities' },
      { label: 'فرص الرعاية', icon: Award, path: '/sponsorship-opportunities' },
      { label: 'غرف الصفقات', icon: DoorOpen, path: '/deal-rooms' },
      { label: 'أصول الرعاة', icon: Image, path: '/sponsor-assets' },
      { label: 'التسليمات', icon: Gift, path: '/deliverables' },
      { label: 'تقارير ROI', icon: PieChart, path: '/roi-reports' },
      { label: 'الظهور الإعلامي', icon: Eye, path: '/brand-visibility' },
    ],
  },
  {
    title: 'التشغيل',
    items: [
      { label: 'العمليات', icon: Cog, path: '/operations' },
      { label: 'العمليات الميدانية', icon: Radio, path: '/field-operations' },
      { label: 'سير العمل', icon: Workflow, path: '/workflows' },
      { label: 'خدمات العارضين', icon: Wrench, path: '/exhibitor-services' },
      { label: 'التواصل والشبكات', icon: Network, path: '/networking' },
    ],
  },
  {
    title: 'الإدارة',
    items: [
      { label: 'الشؤون القانونية', icon: Scale, path: '/legal' },
      { label: 'إدارة العقود', icon: FileText, path: '/contracts' },
      { label: 'الموارد البشرية', icon: ClipboardList, path: '/hr' },
      { label: 'خدمة العملاء 360', icon: HeadphonesIcon, path: '/support' },
      { label: 'إدارة المشاريع', icon: FolderKanban, path: '/projects' },
    ],
  },
  {
    title: 'التواصل',
    items: [
      { label: 'الرسائل', icon: MessageSquare, path: '/messages' },
      { label: 'الإشعارات', icon: Bell, path: '/notifications' },
      { label: 'خزنة المستندات', icon: FileArchive, path: '/documents' },
    ],
  },
  {
    title: 'التقنية والمراقبة',
    items: [
      { label: 'التوأم الرقمي', icon: Cpu, path: '/digital-twin' },
      { label: 'الاقتصاد الحي', icon: Activity, path: '/live-economy' },
    ],
  },
  {
    title: 'النظام',
    items: [
      { label: 'التقارير والتحليلات', icon: BarChart3, path: '/reports' },
      { label: 'التقييمات', icon: Star, path: '/ratings' },
      { label: 'سجل التدقيق', icon: Shield, path: '/audit' },
      { label: 'إدارة الملفات', icon: FileArchive, path: '/files' },
      { label: 'الإعدادات', icon: Settings, path: '/settings' },
    ],
  },
]

export default function Sidebar() {
  const [location, navigate] = useLocation()
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen, toggleCollapse } = useUIStore()
  const { user, logout: authLogout } = useAuthStore()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const showLabels = !sidebarCollapsed || sidebarOpen

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

  const handleNavClick = (path: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpand(path)
      if (!isActive(path)) navigate(path)
    } else {
      navigate(path)
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed && isDesktop ? 72 : 280,
          x: 0,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed right-0 top-0 h-screen z-50 flex flex-col overflow-hidden',
          'max-lg:transition-transform max-lg:duration-300 max-lg:ease-[cubic-bezier(0.22,1,0.36,1)]',
          sidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full',
          'max-lg:w-[280px]',
        )}
        style={{
          background: 'var(--sidebar)',
          borderLeft: '1px solid var(--sidebar-border)',
        }}
      >
        {/* ── Decorative gold line at top ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-l from-transparent via-[var(--sidebar-primary)] to-transparent opacity-40" />

        {/* ── Logo Area ── */}
        <div className="relative flex items-center justify-between px-4 py-4">
          <AnimatePresence mode="wait">
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5"
              >
                <img src={LOGO_URL} alt="Maham Expo" className="h-9 object-contain" />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => {
              if (!isDesktop) {
                setSidebarOpen(false)
              } else {
                toggleCollapse()
              }
            }}
            className={cn(
              'p-2 rounded-xl transition-all duration-300',
              'text-[var(--sidebar-foreground)]/50 hover:text-[var(--sidebar-primary)]',
              'hover:bg-[var(--sidebar-accent)]',
            )}
          >
            {sidebarCollapsed && isDesktop ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="mx-4 h-px bg-gradient-to-l from-transparent via-[var(--sidebar-border)] to-transparent" />

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={section.title} className="mb-1">
              {/* Section divider (not for first section) */}
              {sIdx > 0 && (
                <div className="mx-3 my-2.5 h-px bg-gradient-to-l from-transparent via-[var(--sidebar-border)] to-transparent opacity-60" />
              )}

              {/* Section title */}
              <AnimatePresence>
                {showLabels && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]',
                      sIdx === 0
                        ? 'text-[var(--sidebar-primary)]'
                        : 'text-[var(--sidebar-foreground)] opacity-40'
                    )}
                  >
                    {section.title}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Nav items */}
              {section.items.map((item) => {
                const active = isActive(item.path)
                const expanded = expandedItems.includes(item.path)
                const hasChildren = item.children && item.children.length > 0
                const isPortal = sIdx === 0

                return (
                  <div key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path, !!hasChildren)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 group relative',
                        active
                          ? isPortal
                            ? [
                                'text-[var(--sidebar-primary)]',
                                'bg-[var(--sidebar-accent)]',
                                'shadow-[0_0_16px_var(--sidebar-primary)/8%]',
                              ].join(' ')
                            : [
                                'text-[var(--sidebar-primary)]',
                                'bg-[var(--sidebar-accent)]',
                              ].join(' ')
                          : [
                              'text-[var(--sidebar-foreground)] opacity-70',
                              'hover:opacity-100',
                              'hover:bg-[var(--sidebar-accent)]',
                            ].join(' '),
                        !showLabels && 'justify-center px-2'
                      )}
                      title={!showLabels ? item.label : undefined}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-full bg-[var(--sidebar-primary)]"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      {/* Icon */}
                      <item.icon
                        size={18}
                        className={cn(
                          'shrink-0 transition-all duration-300',
                          active
                            ? 'text-[var(--sidebar-primary)]'
                            : 'text-[var(--sidebar-foreground)] opacity-50 group-hover:opacity-80'
                        )}
                      />

                      {/* Label */}
                      {showLabels && (
                        <span className="flex-1 text-right whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.label}
                        </span>
                      )}

                      {/* Badge */}
                      {item.badge && showLabels && (
                        <span className={cn(
                          'text-[9px] px-1.5 py-0.5 rounded-full font-semibold',
                          'bg-[var(--sidebar-primary)]/8 text-[var(--sidebar-primary)]/60',
                          'border border-[var(--sidebar-primary)]/10',
                        )}>
                          {item.badge}
                        </span>
                      )}

                      {/* Expand arrow */}
                      {hasChildren && showLabels && (
                        <ChevronDown
                          size={14}
                          className={cn(
                            'transition-transform duration-300 opacity-40',
                            expanded && 'rotate-180'
                          )}
                        />
                      )}
                    </button>

                    {/* Children */}
                    <AnimatePresence>
                      {hasChildren && expanded && showLabels && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden mr-7 mt-0.5 space-y-0.5"
                        >
                          {item.children!.map((child) => (
                            <button
                              key={child.path}
                              onClick={() => {
                                navigate(child.path)
                                setSidebarOpen(false)
                              }}
                              className={cn(
                                'w-full text-right px-3 py-1.5 rounded-lg text-xs transition-all duration-300 border-r-2',
                                location === child.path
                                  ? 'text-[var(--sidebar-primary)] border-[var(--sidebar-primary)] bg-[var(--sidebar-accent)]'
                                  : 'text-[var(--sidebar-foreground)] opacity-50 hover:opacity-80 border-transparent hover:border-[var(--sidebar-primary)]/30'
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

        {/* ── Divider ── */}
        <div className="mx-4 h-px bg-gradient-to-l from-transparent via-[var(--sidebar-border)] to-transparent" />

        {/* ── User & Logout ── */}
        <div className="p-3">
          {showLabels ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--sidebar-accent)]/50 transition-all duration-300 hover:bg-[var(--sidebar-accent)]">
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold',
                'bg-gradient-to-br from-[var(--sidebar-primary)]/20 to-[var(--sidebar-primary)]/5',
                'text-[var(--sidebar-primary)]',
                'border border-[var(--sidebar-primary)]/15',
              )}>
                {user?.name?.charAt(0) || 'م'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[var(--sidebar-foreground)] truncate">
                  {user?.name || 'المدير'}
                </p>
                <p className="text-[10px] text-[var(--sidebar-primary)] opacity-60 truncate">
                  {user?.role || 'مشرف / إداري'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--sidebar-foreground)] opacity-40 hover:opacity-100 hover:text-red-400 transition-all duration-300"
                title="تسجيل الخروج"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-2 rounded-xl hover:bg-red-500/10 text-[var(--sidebar-foreground)] opacity-40 hover:text-red-400 transition-all duration-300 flex justify-center"
              title="تسجيل الخروج"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  )
}
