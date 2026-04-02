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
  const { theme, sidebarCollapsed, sidebarOpen, setSidebarOpen, toggleCollapse } = useUIStore()
  const { user, logout: authLogout } = useAuthStore()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const showLabels = !sidebarCollapsed || sidebarOpen
  const isDark = theme === 'dark'

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
            transition={{ duration: 0.35 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 lg:hidden"
            style={{
              background: isDark
                ? 'oklch(0 0 0 / 50%)'
                : 'oklch(0 0 0 / 25%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed && isDesktop ? 72 : 280,
          x: 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed right-0 top-0 h-screen z-50 flex flex-col overflow-hidden',
          'max-lg:transition-transform max-lg:duration-350 max-lg:ease-[cubic-bezier(0.22,1,0.36,1)]',
          sidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full',
          'max-lg:w-[280px]',
        )}
        style={{
          background: isDark
            ? 'oklch(0.11 0.008 78 / 88%)'
            : 'oklch(0.965 0.008 78 / 88%)',
          backdropFilter: 'blur(72px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(72px) saturate(1.6)',
          borderLeft: isDark
            ? '1px solid oklch(0.78 0.11 85 / 6%)'
            : '1px solid oklch(0.55 0.14 80 / 8%)',
          boxShadow: isDark
            ? '-8px 0 32px oklch(0 0 0 / 20%), inset 1px 0 0 oklch(1 0 0 / 2%)'
            : '-8px 0 32px oklch(0 0 0 / 5%), inset 1px 0 0 oklch(1 0 0 / 40%)',
        }}
      >
        {/* ── Decorative gold line at top ── */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent, oklch(0.78 0.11 85 / 40%), oklch(0.78 0.11 85 / 60%), oklch(0.78 0.11 85 / 40%), transparent)'
              : 'linear-gradient(90deg, transparent, oklch(0.55 0.14 80 / 35%), oklch(0.55 0.14 80 / 50%), oklch(0.55 0.14 80 / 35%), transparent)',
          }}
        />

        {/* ── Logo Area ── */}
        <div className="relative flex items-center justify-between px-4 py-4">
          <AnimatePresence mode="wait">
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
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
            className="p-2 rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              color: isDark
                ? 'oklch(0.88 0.005 85 / 50%)'
                : 'oklch(0.22 0.015 75 / 50%)',
            }}
          >
            {sidebarCollapsed && isDesktop ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
          </button>
        </div>

        {/* ── Divider ── */}
        <div
          className="mx-4 h-px"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent, oklch(0.78 0.11 85 / 12%), transparent)'
              : 'linear-gradient(90deg, transparent, oklch(0.55 0.14 80 / 15%), transparent)',
          }}
        />

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={section.title} className="mb-1">
              {/* Section divider */}
              {sIdx > 0 && (
                <div
                  className="mx-3 my-2.5 h-px opacity-50"
                  style={{
                    background: isDark
                      ? 'linear-gradient(90deg, transparent, oklch(0.78 0.11 85 / 10%), transparent)'
                      : 'linear-gradient(90deg, transparent, oklch(0.55 0.14 80 / 12%), transparent)',
                  }}
                />
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
                    )}
                    style={{
                      color: sIdx === 0
                        ? (isDark ? 'oklch(0.78 0.11 85)' : 'oklch(0.55 0.14 80)')
                        : (isDark ? 'oklch(0.88 0.005 85 / 35%)' : 'oklch(0.22 0.015 75 / 40%)'),
                    }}
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

                return (
                  <div key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path, !!hasChildren)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 group relative',
                        !showLabels && 'justify-center px-2'
                      )}
                      style={{
                        color: active
                          ? (isDark ? 'oklch(0.78 0.11 85)' : 'oklch(0.55 0.14 80)')
                          : (isDark ? 'oklch(0.88 0.005 85 / 65%)' : 'oklch(0.22 0.015 75 / 65%)'),
                        background: active
                          ? (isDark
                              ? 'linear-gradient(135deg, oklch(0.78 0.11 85 / 10%), oklch(0.78 0.11 85 / 4%))'
                              : 'linear-gradient(135deg, oklch(0.55 0.14 80 / 8%), oklch(0.55 0.14 80 / 3%))')
                          : 'transparent',
                        boxShadow: active
                          ? (isDark
                              ? '0 0 16px oklch(0.78 0.11 85 / 5%), inset 0 1px 0 oklch(1 0 0 / 3%)'
                              : '0 0 16px oklch(0.55 0.14 80 / 4%), inset 0 1px 0 oklch(1 0 0 / 30%)')
                          : 'none',
                      }}
                      title={!showLabels ? item.label : undefined}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = isDark
                            ? 'oklch(0.78 0.11 85 / 5%)'
                            : 'oklch(0.55 0.14 80 / 4%)'
                          e.currentTarget.style.color = isDark
                            ? 'oklch(0.88 0.005 85 / 90%)'
                            : 'oklch(0.22 0.015 75 / 90%)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = isDark
                            ? 'oklch(0.88 0.005 85 / 65%)'
                            : 'oklch(0.22 0.015 75 / 65%)'
                        }
                      }}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-full"
                          style={{
                            background: isDark
                              ? 'oklch(0.78 0.11 85)'
                              : 'oklch(0.55 0.14 80)',
                            boxShadow: isDark
                              ? '0 0 8px oklch(0.78 0.11 85 / 40%)'
                              : '0 0 8px oklch(0.55 0.14 80 / 30%)',
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      {/* Icon with gold glow on active */}
                      <item.icon
                        size={18}
                        className="shrink-0 transition-all duration-300"
                        style={{
                          color: active
                            ? (isDark ? 'oklch(0.78 0.11 85)' : 'oklch(0.55 0.14 80)')
                            : undefined,
                          filter: active
                            ? (isDark
                                ? 'drop-shadow(0 0 6px oklch(0.78 0.11 85 / 30%))'
                                : 'drop-shadow(0 0 6px oklch(0.55 0.14 80 / 25%))')
                            : 'none',
                          opacity: active ? 1 : 0.55,
                        }}
                      />

                      {/* Label */}
                      {showLabels && (
                        <span className="flex-1 text-right whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.label}
                        </span>
                      )}

                      {/* Badge — glass style */}
                      {item.badge && showLabels && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{
                            background: isDark
                              ? 'oklch(0.78 0.11 85 / 10%)'
                              : 'oklch(0.55 0.14 80 / 8%)',
                            color: isDark
                              ? 'oklch(0.78 0.11 85 / 70%)'
                              : 'oklch(0.55 0.14 80 / 65%)',
                            border: isDark
                              ? '1px solid oklch(0.78 0.11 85 / 12%)'
                              : '1px solid oklch(0.55 0.14 80 / 10%)',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Expand arrow */}
                      {hasChildren && showLabels && (
                        <ChevronDown
                          size={14}
                          className={cn(
                            'transition-transform duration-300',
                            expanded && 'rotate-180'
                          )}
                          style={{ opacity: 0.4 }}
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
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden mr-7 mt-0.5 space-y-0.5"
                        >
                          {item.children!.map((child) => {
                            const childActive = location === child.path
                            return (
                              <button
                                key={child.path}
                                onClick={() => {
                                  navigate(child.path)
                                  setSidebarOpen(false)
                                }}
                                className="w-full text-right px-3 py-1.5 rounded-lg text-xs transition-all duration-300 border-r-2"
                                style={{
                                  color: childActive
                                    ? (isDark ? 'oklch(0.78 0.11 85)' : 'oklch(0.55 0.14 80)')
                                    : (isDark ? 'oklch(0.88 0.005 85 / 45%)' : 'oklch(0.22 0.015 75 / 45%)'),
                                  borderColor: childActive
                                    ? (isDark ? 'oklch(0.78 0.11 85)' : 'oklch(0.55 0.14 80)')
                                    : 'transparent',
                                  background: childActive
                                    ? (isDark ? 'oklch(0.78 0.11 85 / 6%)' : 'oklch(0.55 0.14 80 / 5%)')
                                    : 'transparent',
                                }}
                              >
                                {child.label}
                              </button>
                            )
                          })}
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
        <div
          className="mx-4 h-px"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent, oklch(0.78 0.11 85 / 12%), transparent)'
              : 'linear-gradient(90deg, transparent, oklch(0.55 0.14 80 / 15%), transparent)',
          }}
        />

        {/* ── User & Logout ── */}
        <div className="p-3">
          {showLabels ? (
            <div
              className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300"
              style={{
                background: isDark
                  ? 'oklch(0.78 0.11 85 / 4%)'
                  : 'oklch(0.55 0.14 80 / 3%)',
                border: isDark
                  ? '1px solid oklch(0.78 0.11 85 / 6%)'
                  : '1px solid oklch(0.55 0.14 80 / 5%)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, oklch(0.78 0.11 85 / 18%), oklch(0.78 0.11 85 / 6%))'
                    : 'linear-gradient(135deg, oklch(0.55 0.14 80 / 15%), oklch(0.55 0.14 80 / 5%))',
                  color: isDark ? 'oklch(0.78 0.11 85)' : 'oklch(0.55 0.14 80)',
                  border: isDark
                    ? '1px solid oklch(0.78 0.11 85 / 15%)'
                    : '1px solid oklch(0.55 0.14 80 / 12%)',
                  boxShadow: isDark
                    ? '0 0 10px oklch(0.78 0.11 85 / 8%)'
                    : '0 0 10px oklch(0.55 0.14 80 / 6%)',
                }}
              >
                {user?.name?.charAt(0) || 'م'}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-semibold truncate"
                  style={{ color: isDark ? 'oklch(0.88 0.005 85)' : 'oklch(0.22 0.015 75)' }}
                >
                  {user?.name || 'المدير'}
                </p>
                <p
                  className="text-[10px] truncate"
                  style={{ color: isDark ? 'oklch(0.78 0.11 85 / 55%)' : 'oklch(0.55 0.14 80 / 55%)' }}
                >
                  {user?.role || 'مشرف / إداري'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-all duration-300"
                style={{
                  color: isDark ? 'oklch(0.88 0.005 85 / 35%)' : 'oklch(0.22 0.015 75 / 35%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'oklch(0.62 0.22 25)'
                  e.currentTarget.style.background = 'oklch(0.62 0.22 25 / 10%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? 'oklch(0.88 0.005 85 / 35%)' : 'oklch(0.22 0.015 75 / 35%)'
                  e.currentTarget.style.background = 'transparent'
                }}
                title="تسجيل الخروج"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-2 rounded-xl transition-all duration-300 flex justify-center"
              style={{
                color: isDark ? 'oklch(0.88 0.005 85 / 35%)' : 'oklch(0.22 0.015 75 / 35%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'oklch(0.62 0.22 25)'
                e.currentTarget.style.background = 'oklch(0.62 0.22 25 / 10%)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? 'oklch(0.88 0.005 85 / 35%)' : 'oklch(0.22 0.015 75 / 35%)'
                e.currentTarget.style.background = 'transparent'
              }}
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
