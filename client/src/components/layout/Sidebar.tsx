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
      animate={{ width: sidebarCollapsed ? 72 : 272 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed right-0 top-0 h-screen z-40 flex flex-col bg-sidebar border-l border-sidebar-border overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--sidebar) 0%, rgba(24,23,21,0.98) 100%)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border/50">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <img src={LOGO_URL} alt="Maham Expo" className="h-10 object-contain" />
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
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className="mb-2">
            {/* Section divider for portals */}
            {sIdx === 1 && (
              <div className="mx-3 my-2 border-t border-gold/10" />
            )}
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest",
                    sIdx === 0 ? "text-gold/80" : "text-gold/50"
                  )}
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            {section.items.map((item) => {
              const active = isActive(item.path)
              const expanded = expandedItems.includes(item.path)
              const hasChildren = item.children && item.children.length > 0
              const isPortal = sIdx === 0

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
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                      active
                        ? isPortal
                          ? 'bg-gradient-to-l from-gold/15 to-gold/5 text-gold border border-gold/25 shadow-[0_0_12px_rgba(201,168,76,0.1)]'
                          : 'bg-gold/10 text-gold border border-gold/20'
                        : isPortal
                          ? 'text-sidebar-foreground/80 hover:bg-gold/8 hover:text-gold border border-transparent hover:border-gold/15'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon size={18} className={cn(
                      'shrink-0 transition-colors',
                      active ? 'text-gold' : isPortal ? 'text-gold/60 group-hover:text-gold' : 'text-muted-foreground group-hover:text-gold/70'
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
                    {item.badge && !sidebarCollapsed && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold/70 border border-gold/15">
                        {item.badge}
                      </span>
                    )}
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
      <div className="p-3 border-t border-sidebar-border/50">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/25 flex items-center justify-center text-gold font-bold text-sm shadow-[0_0_8px_rgba(201,168,76,0.1)]">
              {user?.name?.charAt(0) || 'م'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'المدير'}</p>
              <p className="text-[10px] text-gold/60 truncate">{user?.role || 'مشرف / إداري'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
              title="تسجيل الخروج"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all flex justify-center"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </motion.aside>
  )
}
