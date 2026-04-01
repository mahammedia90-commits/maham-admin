/**
 * MAHAM EXPO — Landing Page
 * Design: Liquid Gold Executive — Nour Theme
 * Sections: Hero, Quick Access Portals, Systems, Units, Stats, Services, Journey, About, Contact, Footer
 * All content from admin.mahamexpo.sa rebuilt with premium Nour Theme design
 */
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Shield, ShieldCheck, Brain, Users, Building2, TrendingUp,
  Handshake, Calendar, BarChart3, FileText, Globe, Lock,
  Zap, MapPin, Phone, Mail, ChevronLeft, ChevronDown,
  Sparkles, ArrowLeft, Star, CheckCircle2, Layers,
  Target, Briefcase, HeartHandshake, Megaphone, Scale,
  Settings, Monitor, FolderOpen, UserCheck, Bot,
  CircleDollarSign, ClipboardList, Truck, Gavel,
  BadgeCheck, Cpu, LayoutDashboard, PieChart, Wallet,
  MessagesSquare, FolderKanban, Award, ServerCog,
  FileBarChart, Cog, HardDrive
} from 'lucide-react';
import { LOGO_URL } from '@/lib/utils';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/Ayi8F2UxCsX9Jj9NAXVaQM/landing-hero-bg-ZSKwAgKKQefjvDRyGtBE4Y.webp';
const SYSTEMS_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/Ayi8F2UxCsX9Jj9NAXVaQM/landing-systems-bg-MjCFGhi877Kp7ayWYSwhz7.webp';

// ─── Role Portals ───
const PORTALS = [
  { code: '1989', title: 'المدير التنفيذي', subtitle: 'Super Admin', desc: 'تحكم كامل بالنظام والصلاحيات', icon: ShieldCheck, color: '#C9A84C' },
  { code: '6060', title: 'مدير القسم', subtitle: 'Dept. Manager', desc: 'إدارة الأقسام والفرق', icon: Users, color: '#C9A84C' },
  { code: '5050', title: 'الموظف', subtitle: 'Staff', desc: 'تنفيذ المهام اليومية', icon: UserCheck, color: '#C9A84C' },
  { code: '2024', title: 'التاجر', subtitle: 'Merchant', desc: 'حجز الوحدات والعقود', icon: Building2, color: '#C9A84C' },
  { code: '3030', title: 'المستثمر', subtitle: 'Investor', desc: 'فرص استثمارية وتحليلات', icon: TrendingUp, color: '#C9A84C' },
  { code: '4040', title: 'الراعي', subtitle: 'Sponsor', desc: 'باقات الرعاية والحملات', icon: Handshake, color: '#C9A84C' },
];

// ─── Main Systems ───
const SYSTEMS = [
  { title: 'مركز التحكم الإداري', subtitle: 'Admin Control Center', desc: 'إدارة مركزية شاملة لجميع العمليات والأقسام والصلاحيات مع تحكم كامل بالنظام.', icon: LayoutDashboard, tags: ['إدارة الصلاحيات', 'لوحة مؤشرات', 'تقارير متقدمة'] },
  { title: 'بوابة التاجر', subtitle: 'Merchant Platform', desc: 'منصة متكاملة للتجار لتصفح المعارض وحجز الوحدات وإدارة العقود والمدفوعات.', icon: Building2, tags: ['حجز الوحدات', 'إدارة العقود', 'تتبع المدفوعات'] },
  { title: 'بوابة المستثمر', subtitle: 'Investor Platform', desc: 'منصة استثمارية ذكية لتتبع الفرص وتحليل العوائد وإدارة المحافظ الاستثمارية.', icon: TrendingUp, tags: ['فرص استثمارية', 'تحليل العوائد', 'إدارة المحافظ'] },
  { title: 'بوابة الراعي', subtitle: 'Sponsor Platform', desc: 'منصة رعاية احترافية لإدارة الباقات والحملات التسويقية وقياس العائد على الرعاية.', icon: Award, tags: ['باقات الرعاية', 'تحليل الأثر', 'إدارة الحملات'] },
  { title: 'نظام الموارد البشرية', subtitle: 'HR Management', desc: 'إدارة شاملة للموظفين والأقسام والحضور والرواتب والتقييمات.', icon: Users, tags: ['إدارة الموظفين', 'الحضور والانصراف', 'تقييم الأداء'] },
  { title: 'مركز الذكاء الاصطناعي', subtitle: 'AI Command Center', desc: 'عقل تنفيذي ذكي يحلل البيانات ويقدم توصيات استراتيجية وتنبؤات مالية.', icon: Brain, tags: ['تحليل ذكي', 'توصيات استراتيجية', 'تنبؤات مالية'] },
];

// ─── 21 Units ───
const UNITS = [
  { name: 'لوحة التحكم الرئيسية', icon: LayoutDashboard },
  { name: 'إدارة الفعاليات', icon: Calendar },
  { name: 'النظام المالي', icon: Wallet },
  { name: 'التسويق والعلاقات', icon: Megaphone },
  { name: 'المبيعات', icon: Target },
  { name: 'إدارة العمليات', icon: Truck },
  { name: 'الشؤون القانونية', icon: Scale },
  { name: 'إدارة المعارض', icon: Building2 },
  { name: 'الموارد البشرية', icon: Users },
  { name: 'إدارة العملاء', icon: UserCheck },
  { name: 'CRM والأتمتة الذكية', icon: Bot },
  { name: 'خدمة العملاء 360', icon: MessagesSquare },
  { name: 'إدارة المشاريع', icon: FolderKanban },
  { name: 'الرعاة والشركاء', icon: Handshake },
  { name: 'الخدمات الحكومية', icon: Globe },
  { name: 'مراقبة النظام', icon: ServerCog },
  { name: 'التقارير والتحليلات', icon: FileBarChart },
  { name: 'بوابة المستثمر', icon: TrendingUp },
  { name: 'بوابة التاجر', icon: Briefcase },
  { name: 'بوابة الراعي', icon: HeartHandshake },
  { name: 'الإعدادات', icon: Cog },
];

// ─── Services ───
const SERVICES = [
  { title: 'خريطة تفاعلية ذكية', desc: 'تصفح المعارض واختر وحدتك على خريطة تفاعلية ثلاثية الأبعاد مع حالة الوحدات في الوقت الفعلي.', icon: MapPin },
  { title: 'إدارة العقود الرقمية', desc: 'عقود إلكترونية بتوقيع رقمي متوافقة مع الأنظمة السعودية وقابلة للتتبع والأرشفة.', icon: FileText },
  { title: 'ذكاء اصطناعي تنفيذي', desc: 'تحليلات ذكية وتوصيات استراتيجية وتنبؤات مالية مدعومة بأحدث تقنيات الذكاء الاصطناعي.', icon: Brain },
  { title: 'أمان سيادي متقدم', desc: '6 مستويات صلاحيات مع تشفير متقدم متوافق مع NCA و ISO 27001 وحماية البيانات الشخصية.', icon: Shield },
  { title: 'توافق تنظيمي كامل', desc: 'متوافق مع ZATCA Phase 2 و SAMA و PDPL و VAT 15% وجميع المعايير السعودية والعالمية.', icon: BadgeCheck },
  { title: 'أتمتة العمليات', desc: 'سير عمل آلي من الحجز إلى التعاقد والدفع مع إشعارات فورية وتقارير تلقائية.', icon: Zap },
];

const COMPLIANCE = ['ZATCA', 'SAMA', 'IFRS', 'ISO', 'NCA', 'PDPL'];

// ─── Animated Counter ───
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold" style={{ color: '#C9A84C' }}>
      {count.toLocaleString('ar-SA')}{suffix}
    </div>
  );
}

// ─── Section Wrapper ───
function Section({ children, id, className = '' }: { children: React.ReactNode; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Gold Divider ───
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to left, #C9A84C, transparent)' }} />
      <Sparkles className="w-4 h-4" style={{ color: '#C9A84C' }} />
      <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to right, #C9A84C, transparent)' }} />
    </div>
  );
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['portals', 'systems', 'units', 'stats', 'services', 'about', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveNav(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'systems', label: 'الأنظمة' },
    { id: 'units', label: 'الوحدات' },
    { id: 'services', label: 'الخدمات' },
    { id: 'stats', label: 'الأرقام' },
    { id: 'about', label: 'عن المنصة' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: '#0C0C0E', color: '#E8E4DC' }}>
      {/* ═══ Navbar ═══ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(12, 12, 14, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201, 168, 76, 0.15)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <img src={LOGO_URL} alt="MAHAM EXPO" className="h-10 md:h-12 object-contain" />
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium transition-colors duration-300 relative"
                style={{ color: activeNav === item.id ? '#C9A84C' : '#A09A8E' }}
              >
                {item.label}
                {activeNav === item.id && (
                  <motion.div layoutId="navIndicator" className="absolute -bottom-1 left-0 right-0 h-0.5" style={{ background: '#C9A84C' }} />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #B8860B)',
              color: '#0C0C0E',
              boxShadow: '0 0 20px rgba(201, 168, 76, 0.3)',
            }}
          >
            ادخل المنصة
          </button>
        </div>
      </motion.nav>

      {/* ═══ Hero Section ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(12,12,14,0.4) 0%, rgba(12,12,14,0.7) 50%, rgba(12,12,14,0.98) 100%)' }} />
        </div>

        {/* Floating Gold Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: '#C9A84C',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <img src={LOGO_URL} alt="MAHAM EXPO" className="h-20 md:h-28 mx-auto mb-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
            style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1px solid rgba(201, 168, 76, 0.3)' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
            <span className="text-sm" style={{ color: '#C9A84C' }}>نظام التشغيل المركزي لإدارة المعارض والمؤتمرات</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            <span style={{ color: '#E8E4DC' }}>نُعيد تعريف</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A0, #C9A84C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              صناعة المعارض
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#A09A8E' }}
          >
            منصة متكاملة تجمع بين التاجر والمستثمر والداعم تحت سقف رقمي واحد.
            <br />
            من الحجز إلى التعاقد، من التسويق إلى التحليل الذكي بالذكاء الاصطناعي.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #B8860B)',
                color: '#0C0C0E',
                boxShadow: '0 0 40px rgba(201, 168, 76, 0.4)',
              }}
            >
              <Zap className="w-5 h-5" />
              ادخل المنصة الآن
            </button>
            <button
              onClick={() => scrollTo('systems')}
              className="px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-3"
              style={{
                background: 'rgba(201, 168, 76, 0.08)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                color: '#C9A84C',
              }}
            >
              استكشف الأنظمة
              <ChevronLeft className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6" style={{ color: '#C9A84C' }} />
        </motion.div>
      </section>

      {/* ═══ Quick Access Portals ═══ */}
      <Section id="portals" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 sm:mb-4 lg:mb-6" style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <Zap className="w-4 h-4" style={{ color: '#C9A84C' }} />
              <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>بوابات الدخول السريع</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>اختر بوابتك</h2>
            <p className="text-lg" style={{ color: '#A09A8E' }}>6 بوابات مخصصة حسب دورك في منظومة المعارض والمؤتمرات</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {PORTALS.map((portal, i) => (
              <motion.button
                key={portal.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => navigate('/login')}
                className="relative p-6 rounded-2xl text-right transition-all duration-500 group overflow-hidden"
                style={{
                  background: 'rgba(24, 23, 21, 0.6)',
                  border: '1px solid rgba(201, 168, 76, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ boxShadow: 'inset 0 0 60px rgba(201, 168, 76, 0.08)' }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
                      <Lock className="w-3 h-3" style={{ color: '#C9A84C' }} />
                      <span className="text-xs font-mono" style={{ color: '#C9A84C' }}>{portal.code}</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.05))' }}>
                      <portal.icon className="w-6 h-6" style={{ color: '#C9A84C' }} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-1" style={{ color: '#E8E4DC' }}>{portal.title}</h3>
                  <p className="text-xs font-medium mb-2" style={{ color: '#C9A84C' }}>{portal.subtitle}</p>
                  <p className="text-sm" style={{ color: '#A09A8E' }}>{portal.desc}</p>

                  <div className="flex items-center gap-2 mt-4 group-hover:gap-3 transition-all" style={{ color: '#C9A84C' }}>
                    <span className="text-sm font-medium">ادخل الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8" style={{ color: '#6B6560' }}>
            <Lock className="w-4 h-4" />
            <span className="text-sm">رمز التخصص مطلوب للدخول — تواصل مع إدارة النظام للحصول عليه</span>
          </div>
        </div>
      </Section>

      {/* ═══ Main Systems ═══ */}
      <Section id="systems" className="py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-30">
          <img src={SYSTEMS_BG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 sm:mb-4 lg:mb-6" style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <Layers className="w-4 h-4" style={{ color: '#C9A84C' }} />
              <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>الأنظمة الرئيسية</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              ستة أنظمة متكاملة
              <br />
              <span style={{ color: '#C9A84C' }}>تحت سقف واحد</span>
            </h2>
            <p className="text-lg" style={{ color: '#A09A8E' }}>كل نظام مصمم بدقة ليخدم دوراً محدداً في منظومة المعارض والمؤتمرات</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {SYSTEMS.map((sys, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl group hover:scale-[1.02] transition-all duration-500"
                style={{
                  background: 'linear-gradient(145deg, rgba(24, 23, 21, 0.8), rgba(18, 17, 15, 0.9))',
                  border: '1px solid rgba(201, 168, 76, 0.1)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.05))' }}>
                  <sys.icon className="w-7 h-7" style={{ color: '#C9A84C' }} />
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: '#E8E4DC' }}>{sys.title}</h3>
                <p className="text-xs font-medium mb-3" style={{ color: '#C9A84C' }}>{sys.subtitle}</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#A09A8E' }}>{sys.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {sys.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(201, 168, 76, 0.08)', color: '#C9A84C', border: '1px solid rgba(201, 168, 76, 0.15)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button onClick={() => navigate('/login')} className="flex items-center gap-2 mt-5 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#C9A84C' }}>
                  <span>ادخل النظام</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 21 Units ═══ */}
      <Section id="units" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 sm:mb-4 lg:mb-6" style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <Cpu className="w-4 h-4" style={{ color: '#C9A84C' }} />
              <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>21 وحدة تشغيلية</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>وحدات النظام المتكاملة</h2>
            <p className="text-lg" style={{ color: '#A09A8E' }}>كل وحدة مصممة لتغطي جانباً محدداً من عمليات الشركة بكفاءة عالية</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {UNITS.map((unit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                whileHover={{ scale: 1.08, y: -5 }}
                className="p-4 rounded-xl text-center group cursor-default"
                style={{
                  background: 'rgba(24, 23, 21, 0.5)',
                  border: '1px solid rgba(201, 168, 76, 0.08)',
                }}
              >
                <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'rgba(201, 168, 76, 0.1)' }}>
                  <unit.icon className="w-5 h-5" style={{ color: '#C9A84C' }} />
                </div>
                <span className="text-xs font-medium leading-tight block" style={{ color: '#A09A8E' }}>{unit.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ Live Stats ═══ */}
      <Section id="stats" className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 sm:mb-4 lg:mb-6" style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <BarChart3 className="w-4 h-4" style={{ color: '#C9A84C' }} />
              <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>أرقام حية</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>أرقام تتحدث عن نفسها</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: 2500, suffix: '+', label: 'تاجر ومستثمر', sub: 'مسجل في المنصة' },
              { value: 150, suffix: '+', label: 'فعالية مُدارة', sub: 'عبر المنصة' },
              { value: 7, suffix: '', label: 'مسار متوافق', sub: 'معايير سعودية وعالمية' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="text-center p-8 rounded-2xl"
                style={{
                  background: 'rgba(24, 23, 21, 0.5)',
                  border: '1px solid rgba(201, 168, 76, 0.1)',
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-lg font-bold mt-3" style={{ color: '#E8E4DC' }}>{stat.label}</p>
                <p className="text-sm" style={{ color: '#6B6560' }}>{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ Services ═══ */}
      <Section id="services" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 sm:mb-4 lg:mb-6" style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <Star className="w-4 h-4" style={{ color: '#C9A84C' }} />
              <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>الخدمات</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              خدمات متكاملة
              <br />
              <span style={{ color: '#C9A84C' }}>بمعايير عالمية</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl group hover:scale-[1.02] transition-all duration-500"
                style={{
                  background: 'rgba(24, 23, 21, 0.5)',
                  border: '1px solid rgba(201, 168, 76, 0.08)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'rgba(201, 168, 76, 0.1)' }}>
                  <svc.icon className="w-6 h-6" style={{ color: '#C9A84C' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#E8E4DC' }}>{svc.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#A09A8E' }}>{svc.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Compliance Badges */}
          <div className="mt-16 text-center">
            <p className="text-sm mb-3 sm:mb-4 lg:mb-6" style={{ color: '#6B6560' }}>متوافق مع المعايير السعودية والعالمية</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {COMPLIANCE.map((badge) => (
                <div key={badge} className="px-5 py-2.5 rounded-lg text-sm font-bold" style={{ background: 'rgba(201, 168, 76, 0.06)', border: '1px solid rgba(201, 168, 76, 0.15)', color: '#C9A84C' }}>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ About ═══ */}
      <Section id="about" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 sm:mb-4 lg:mb-6" style={{ background: 'rgba(201, 168, 76, 0.1)', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
                <Globe className="w-4 h-4" style={{ color: '#C9A84C' }} />
                <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>عن مهام إكسبو</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Cairo, sans-serif' }}>
                نبني مستقبل
                <br />
                صناعة المعارض
                <br />
                <span style={{ color: '#C9A84C' }}>في المملكة</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#A09A8E' }}>
                مهام إكسبو هي المنصة الرقمية المتكاملة التي تجمع بين أحدث تقنيات الذكاء الاصطناعي وأفضل ممارسات إدارة المعارض والمؤتمرات. نقدم حلولاً شاملة تغطي كامل دورة حياة الفعالية من التخطيط إلى التنفيذ والتحليل، متوافقة مع جميع المعايير السعودية والعالمية.
              </p>
            </div>
            <div className="space-y-4">
              {[
                '21 وحدة تشغيلية متكاملة تغطي جميع الأقسام',
                'ذكاء اصطناعي تنفيذي لاتخاذ القرارات',
                'خريطة تفاعلية لحجز الوحدات في الوقت الفعلي',
                '6 مستويات صلاحيات مع تشفير متقدم (NCA/ISO)',
                '7 مصادر دخل متنوعة ومتكاملة',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'rgba(24, 23, 21, 0.5)', border: '1px solid rgba(201, 168, 76, 0.08)' }}
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: '#C9A84C' }} />
                  <span className="text-sm font-medium" style={{ color: '#E8E4DC' }}>{item}</span>
                </motion.div>
              ))}
              <div className="pt-4">
                <p className="text-sm font-bold" style={{ color: '#C9A84C' }}>مهام للخدمات وتقنية المعلومات</p>
                <p className="text-xs" style={{ color: '#6B6560' }}>الشركة الأم — Maham Services & IT</p>
                <p className="text-xs" style={{ color: '#6B6560' }}>الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ Contact ═══ */}
      <Section id="contact" className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>تواصل معنا</h2>
            <p className="text-lg" style={{ color: '#A09A8E' }}>فريقنا جاهز لمساعدتك في تنظيم معرضك القادم</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(24, 23, 21, 0.5)', border: '1px solid rgba(201, 168, 76, 0.08)' }}>
              <Phone className="w-8 h-8 mx-auto mb-4" style={{ color: '#C9A84C' }} />
              <h3 className="font-bold mb-3" style={{ color: '#E8E4DC' }}>اتصل بنا</h3>
              <p className="text-sm" style={{ color: '#A09A8E' }} dir="ltr">+966 53 555 5900</p>
              <p className="text-sm" style={{ color: '#A09A8E' }} dir="ltr">+966 53 477 8899</p>
            </div>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(24, 23, 21, 0.5)', border: '1px solid rgba(201, 168, 76, 0.08)' }}>
              <Mail className="w-8 h-8 mx-auto mb-4" style={{ color: '#C9A84C' }} />
              <h3 className="font-bold mb-3" style={{ color: '#E8E4DC' }}>البريد الإلكتروني</h3>
              <p className="text-sm" style={{ color: '#A09A8E' }}>info@mahamexpo.sa</p>
              <p className="text-sm" style={{ color: '#A09A8E' }}>rent@mahamexpo.sa</p>
            </div>
            <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(24, 23, 21, 0.5)', border: '1px solid rgba(201, 168, 76, 0.08)' }}>
              <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: '#C9A84C' }} />
              <h3 className="font-bold mb-3" style={{ color: '#E8E4DC' }}>الموقع</h3>
              <p className="text-sm" style={{ color: '#A09A8E' }}>الرياض</p>
              <p className="text-sm" style={{ color: '#A09A8E' }}>المملكة العربية السعودية</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(201, 168, 76, 0.02))', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>جاهز لإدارة معارضك بذكاء؟</h2>
          <p className="text-lg mb-8" style={{ color: '#A09A8E' }}>ابدأ الآن واكتشف كيف يمكن لمنصة مهام إكسبو أن تحول طريقة إدارتك للمعارض والمؤتمرات</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #B8860B)',
                color: '#0C0C0E',
                boxShadow: '0 0 40px rgba(201, 168, 76, 0.3)',
              }}
            >
              ادخل المنصة الآن
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid rgba(201, 168, 76, 0.1)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={LOGO_URL} alt="MAHAM EXPO" className="h-10 mb-4" />
              <p className="text-sm" style={{ color: '#6B6560' }}>نظام التشغيل المركزي لإدارة المعارض والمؤتمرات</p>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: '#C9A84C' }}>الأنظمة</h4>
              <div className="space-y-2">
                {['مركز التحكم', 'بوابة التاجر', 'بوابة المستثمر', 'بوابة الراعي'].map((item) => (
                  <button key={item} onClick={() => navigate('/login')} className="block text-sm hover:underline" style={{ color: '#A09A8E' }}>{item}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: '#C9A84C' }}>الوحدات</h4>
              <div className="space-y-2">
                {['إدارة الفعاليات', 'النظام المالي', 'الموارد البشرية', 'الذكاء الاصطناعي'].map((item) => (
                  <button key={item} onClick={() => navigate('/login')} className="block text-sm hover:underline" style={{ color: '#A09A8E' }}>{item}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: '#C9A84C' }}>روابط</h4>
              <div className="space-y-2">
                {[
                  { label: 'info@mahamexpo.sa', href: 'mailto:info@mahamexpo.sa' },
                  { label: 'rent@mahamexpo.sa', href: 'mailto:rent@mahamexpo.sa' },
                ].map((item) => (
                  <a key={item.label} href={item.href} className="block text-sm hover:underline" style={{ color: '#A09A8E' }}>{item.label}</a>
                ))}
              </div>
            </div>
          </div>
          <GoldDivider />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <p className="text-xs" style={{ color: '#4A4540' }}>© {new Date().getFullYear()} مهام للخدمات وتقنية المعلومات. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <button className="text-xs hover:underline" style={{ color: '#6B6560' }}>سياسة الخصوصية</button>
              <button className="text-xs hover:underline" style={{ color: '#6B6560' }}>الشروط والأحكام</button>
              <button className="text-xs hover:underline" style={{ color: '#6B6560' }}>الدعم الفني</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
