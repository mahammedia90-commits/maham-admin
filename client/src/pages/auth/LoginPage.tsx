/**
 * MAHAM EXPO — Login Page (3 Internal Roles Only + Demo Entry)
 * Design: Liquid Gold Executive — Nour Theme
 * Roles: مشرف/إداري, مدير قسم, موظف (NO merchant/investor/sponsor — they have separate portals)
 * Demo: Each role has a "دخول تجريبي" button that bypasses auth and goes straight to dashboard
 * RED RULES: Uses authApi from api/index.ts, setUser from authStore — NO changes to those files
 */
import { useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Users, UserCheck, ArrowRight, ArrowLeft,
  Lock, Key, Fingerprint, Shield, Eye, EyeOff, Loader2,
  Phone, Sparkles, Zap
} from 'lucide-react';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { LOGO_URL, LOGIN_BG_URL } from '@/lib/utils';
import { toast } from 'sonner';

interface Role {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: typeof ShieldCheck;
  code: string;
  gradient: string;
  roleCode: number;
  roleName: string;
}

// Only 3 internal roles — merchant/investor/sponsor have separate portals
const ROLES: Role[] = [
  {
    id: 'admin', title: 'مشرف / إداري', subtitle: 'Super Admin',
    desc: 'لوحة التحكم المركزية', icon: ShieldCheck, code: '1989',
    gradient: 'from-amber-500/20 to-yellow-600/10',
    roleCode: 1989, roleName: 'super_admin'
  },
  {
    id: 'manager', title: 'مدير قسم', subtitle: 'Dept. Manager',
    desc: 'إدارة القسم والفريق', icon: Users, code: '6060',
    gradient: 'from-amber-500/15 to-orange-600/10',
    roleCode: 6060, roleName: 'department_manager'
  },
  {
    id: 'staff', title: 'موظف', subtitle: 'Staff',
    desc: 'الوصول حسب الصلاحيات', icon: UserCheck, code: '5050',
    gradient: 'from-amber-500/10 to-yellow-700/10',
    roleCode: 5050, roleName: 'staff'
  },
];

const STEPS = [
  { id: 1, label: 'الدور الوظيفي', icon: Users },
  { id: 2, label: 'رمز التخصص', icon: Key },
  { id: 3, label: 'تأكيد الهوية', icon: Fingerprint },
];

const STATS = [
  { value: '+2,500', label: 'مستخدم نشط' },
  { value: '32', label: 'وحدة تشغيلية' },
  { value: '7', label: 'مسار متوافق' },
  { value: '+150', label: 'فعالية مُدارة' },
];

const PERMISSIONS = [
  'dashboard.view', 'events.view', 'events.create', 'events.edit', 'events.delete',
  'users.view', 'users.create', 'users.edit', 'requests.view', 'requests.approve',
  'finance.view', 'reports.view', 'settings.view', 'ai.view', 'crm.view',
  'marketing.view', 'sales.view',
];

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { setUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Demo Login — bypasses API, goes straight to dashboard ───
  const handleDemoLogin = (role: Role) => {
    const demoUser = {
      id: 999,
      name: role.title === 'مشرف / إداري' ? 'نور كرم' : role.title === 'مدير قسم' ? 'أحمد المدير' : 'سارة الموظفة',
      email: `demo.${role.id}@mahamexpo.sa`,
      phone: '0500000000',
      role: role.roleName,
      role_code: role.roleCode,
      permissions: PERMISSIONS,
      avatar: undefined,
    };
    setUser(demoUser);
    toast.success(`تم الدخول التجريبي كـ ${role.title}`);
    navigate('/dashboard');
  };

  // ─── OTP Input Handler ───
  const handleOtpChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...otpValues];
    newValues[index] = value.slice(-1);
    setOtpValues(newValues);
    setOtpError('');
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otpValues]);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otpValues]);

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      setOtpValues(pasted.split(''));
      otpRefs.current[3]?.focus();
    }
  }, []);

  // ─── Navigation ───
  const goToStep = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  // ─── Step 2: Validate OTP ───
  const validateOtp = () => {
    const code = otpValues.join('');
    if (code.length !== 4) {
      setOtpError('أدخل الرمز المكوّن من 4 أرقام');
      return;
    }
    if (selectedRole && code !== selectedRole.code) {
      setOtpError('رمز التخصص غير صحيح');
      return;
    }
    goToStep(3);
  };

  // ─── Step 3: Login via authApi ───
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error('يرجى إدخال رقم الهاتف وكلمة المرور');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authApi.login({ phone, password });
      if (res.requires_otp) {
        toast.success('تم إرسال رمز التحقق');
      } else if (res.user) {
        setUser(res.user);
        toast.success('تم تسجيل الدخول بنجاح');
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Slide Animation ───
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 280 : -280, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -280 : 280, opacity: 0, scale: 0.95 }),
  };

  return (
    <div dir="rtl" className="min-h-screen flex" style={{ background: '#0C0C0E' }}>
      {/* ═══ Left Panel — Login Form ═══ */}
      <div className="w-full lg:w-[520px] xl:w-[560px] flex flex-col relative z-10" style={{ background: 'rgba(12, 12, 14, 0.98)' }}>
        {/* Subtle gold accent line */}
        <div className="absolute top-0 right-0 w-[2px] h-full" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201, 168, 76, 0.3), transparent)' }} />

        {/* Back to Home */}
        <div className="p-5 md:p-6">
          <motion.button
            whileHover={{ scale: 1.03, x: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(201, 168, 76, 0.03))',
              border: '1px solid rgba(201, 168, 76, 0.15)',
              color: '#C9A84C',
              backdropFilter: 'blur(8px)',
            }}
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </motion.button>
        </div>

        {/* Steps Progress */}
        <div className="px-5 md:px-6 mb-6">
          <div className="flex items-center justify-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <motion.div
                  animate={{ scale: step === s.id ? 1.05 : 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: step >= s.id ? 'rgba(201, 168, 76, 0.12)' : 'rgba(201, 168, 76, 0.03)',
                    border: `1px solid ${step >= s.id ? 'rgba(201, 168, 76, 0.35)' : 'rgba(201, 168, 76, 0.08)'}`,
                    boxShadow: step === s.id ? '0 0 15px rgba(201, 168, 76, 0.15)' : 'none',
                  }}
                >
                  <s.icon className="w-3.5 h-3.5 transition-colors duration-300" style={{ color: step >= s.id ? '#C9A84C' : '#3A3530' }} />
                  <span className="text-[11px] font-medium transition-colors duration-300" style={{ color: step >= s.id ? '#C9A84C' : '#3A3530' }}>{s.label}</span>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div className="w-5 h-px mx-1 transition-all duration-500" style={{ background: step > s.id ? 'rgba(201, 168, 76, 0.5)' : 'rgba(201, 168, 76, 0.08)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 px-5 md:px-8 pb-6 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex justify-center"
            >
              <img src={LOGO_URL} alt="MAHAM EXPO" className="h-12 md:h-14 object-contain" />
            </motion.div>

            <AnimatePresence mode="wait" custom={direction}>
              {/* ═══ Step 1: Choose Role (3 roles only) ═══ */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="text-center mb-6">
                    <h1 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#E8E4DC', fontFamily: 'Cairo, sans-serif' }}>
                      مرحباً بك في المنصة
                    </h1>
                    <p className="text-sm" style={{ color: '#A09A8E' }}>اختر دورك الوظيفي للدخول إلى القسم المخصص لك</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {ROLES.map((role, i) => (
                      <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.35 }}
                        className="rounded-xl overflow-hidden"
                        style={{
                          background: 'rgba(201, 168, 76, 0.04)',
                          border: '1px solid rgba(201, 168, 76, 0.1)',
                        }}
                      >
                        {/* Role Button — goes to Step 2 (OTP) */}
                        <motion.button
                          whileHover={{ scale: 1.01, x: -2 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setSelectedRole(role);
                            goToStep(2);
                          }}
                          className="w-full p-4 flex items-center justify-between group transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'rgba(201, 168, 76, 0.1)', boxShadow: '0 0 15px rgba(201, 168, 76, 0.05)' }}>
                              <role.icon className="w-5 h-5" style={{ color: '#C9A84C' }} />
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm" style={{ color: '#E8E4DC' }}>{role.title}</h3>
                                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(201, 168, 76, 0.1)', color: '#C9A84C' }}>{role.subtitle}</span>
                              </div>
                              <p className="text-xs mt-0.5" style={{ color: '#6B6560' }}>{role.desc}</p>
                            </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" style={{ color: '#C9A84C' }} />
                        </motion.button>

                        {/* Demo Entry Button */}
                        <div className="px-4 pb-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDemoLogin(role)}
                            className="w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all duration-300"
                            style={{
                              background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(201, 168, 76, 0.03))',
                              border: '1px dashed rgba(201, 168, 76, 0.2)',
                              color: '#C9A84C',
                            }}
                          >
                            <Zap className="w-3.5 h-3.5" />
                            دخول تجريبي
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ Step 2: Specialty Code (OTP) ═══ */}
              {step === 2 && selectedRole && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <button
                    onClick={() => { goToStep(1); setOtpValues(['', '', '', '']); setOtpError(''); }}
                    className="flex items-center gap-2 mb-5 text-sm font-medium transition-all hover:gap-3"
                    style={{ color: '#C9A84C' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                    تغيير الدور
                  </button>

                  {/* Selected Role Badge */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6" style={{ background: 'rgba(201, 168, 76, 0.06)', border: '1px solid rgba(201, 168, 76, 0.15)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201, 168, 76, 0.12)' }}>
                      <selectedRole.icon className="w-4.5 h-4.5" style={{ color: '#C9A84C' }} />
                    </div>
                    <div>
                      <span className="text-sm font-bold" style={{ color: '#E8E4DC' }}>{selectedRole.title}</span>
                      <span className="text-xs mr-2 px-1.5 py-0.5 rounded" style={{ background: 'rgba(201, 168, 76, 0.08)', color: '#C9A84C' }}>{selectedRole.subtitle}</span>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.12), rgba(201, 168, 76, 0.04))',
                        boxShadow: '0 0 30px rgba(201, 168, 76, 0.1)',
                      }}
                    >
                      <Key className="w-7 h-7" style={{ color: '#C9A84C' }} />
                    </motion.div>
                    <h2 className="text-xl font-bold mb-1.5" style={{ color: '#E8E4DC', fontFamily: 'Cairo, sans-serif' }}>أدخل رمز التخصص</h2>
                    <p className="text-sm" style={{ color: '#6B6560' }}>الرمز المخصص لدورك في المنصة</p>
                  </div>

                  {/* OTP Inputs */}
                  <div className="flex items-center justify-center gap-3 mb-3" dir="ltr">
                    {otpValues.map((val, i) => (
                      <motion.input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="w-14 h-16 rounded-xl text-center text-2xl font-bold outline-none transition-all duration-300 focus:scale-105"
                        style={{
                          background: val ? 'rgba(201, 168, 76, 0.1)' : 'rgba(201, 168, 76, 0.04)',
                          border: `2px solid ${val ? 'rgba(201, 168, 76, 0.45)' : otpError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(201, 168, 76, 0.12)'}`,
                          color: '#C9A84C',
                          fontFamily: 'JetBrains Mono, monospace',
                          boxShadow: val ? '0 0 20px rgba(201, 168, 76, 0.1)' : 'none',
                        }}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm mb-3" style={{ color: '#EF4444' }}>
                      {otpError}
                    </motion.p>
                  )}

                  <p className="text-center text-xs mb-5" style={{ color: '#4A4540' }}>أدخل الرمز المكوّن من 4 أرقام</p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={validateOtp}
                    disabled={otpValues.some((v) => !v)}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C, #B8860B)',
                      color: '#0C0C0E',
                      boxShadow: otpValues.every(v => v) ? '0 0 30px rgba(201, 168, 76, 0.25)' : 'none',
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    تأكيد الرمز
                  </motion.button>

                  {/* Demo Entry from Step 2 */}
                  <div className="mt-4 text-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDemoLogin(selectedRole)}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(201, 168, 76, 0.03))',
                        border: '1px dashed rgba(201, 168, 76, 0.2)',
                        color: '#C9A84C',
                      }}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      دخول تجريبي بدون رمز
                    </motion.button>
                  </div>

                  <p className="text-center text-xs mt-4" style={{ color: '#3A3530' }}>
                    لا تملك رمز تخصص؟{' '}
                    <button className="underline transition-colors hover:text-[#C9A84C]" style={{ color: '#6B6560' }}>تواصل مع إدارة النظام</button>
                  </p>
                </motion.div>
              )}

              {/* ═══ Step 3: Identity Confirmation ═══ */}
              {step === 3 && selectedRole && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <button
                    onClick={() => goToStep(2)}
                    className="flex items-center gap-2 mb-5 text-sm font-medium transition-all hover:gap-3"
                    style={{ color: '#C9A84C' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                    رجوع
                  </button>

                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.12), rgba(201, 168, 76, 0.04))',
                        boxShadow: '0 0 30px rgba(201, 168, 76, 0.1)',
                      }}
                    >
                      <Fingerprint className="w-7 h-7" style={{ color: '#C9A84C' }} />
                    </motion.div>
                    <h2 className="text-xl font-bold mb-1.5" style={{ color: '#E8E4DC', fontFamily: 'Cairo, sans-serif' }}>تأكيد الهوية</h2>
                    <p className="text-sm" style={{ color: '#6B6560' }}>أدخل بيانات الدخول الخاصة بك</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: '#A09A8E' }}>رقم الهاتف</label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B6560' }} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="05xxxxxxxx"
                          dir="ltr"
                          className="w-full h-12 pr-10 pl-16 rounded-xl text-sm outline-none transition-all duration-300 focus:scale-[1.01]"
                          style={{
                            background: 'rgba(201, 168, 76, 0.04)',
                            border: '1px solid rgba(201, 168, 76, 0.12)',
                            color: '#E8E4DC',
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(201, 168, 76, 0.08)' }}>
                          <span className="text-[11px] font-bold" style={{ color: '#C9A84C' }}>+966</span>
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: '#A09A8E' }}>كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B6560' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-12 pr-10 pl-10 rounded-xl text-sm outline-none transition-all duration-300 focus:scale-[1.01]"
                          style={{
                            background: 'rgba(201, 168, 76, 0.04)',
                            border: '1px solid rgba(201, 168, 76, 0.12)',
                            color: '#E8E4DC',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
                          style={{ color: '#6B6560' }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || !phone || !password}
                      className="w-full py-3.5 rounded-xl font-bold text-sm mt-2 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #C9A84C, #B8860B)',
                        color: '#0C0C0E',
                        boxShadow: phone && password ? '0 0 30px rgba(201, 168, 76, 0.25)' : 'none',
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          جاري الدخول...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          تسجيل الدخول
                        </>
                      )}
                    </motion.button>

                    {/* Demo Entry from Step 3 */}
                    <div className="text-center pt-1">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDemoLogin(selectedRole)}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(201, 168, 76, 0.03))',
                          border: '1px dashed rgba(201, 168, 76, 0.2)',
                          color: '#C9A84C',
                        }}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        دخول تجريبي بدون بيانات
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Security Badges */}
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-center gap-5 mb-3">
              {[
                { icon: Lock, label: 'تشفير 256-bit' },
                { icon: Fingerprint, label: 'مصادقة ثنائية' },
                { icon: Shield, label: 'NCA متوافق' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-1.5">
                  <badge.icon className="w-3 h-3" style={{ color: '#3A3530' }} />
                  <span className="text-[10px]" style={{ color: '#3A3530' }}>{badge.label}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px]" style={{ color: '#2A2520' }}>
              بالدخول أنت توافق على{' '}
              <button className="underline" style={{ color: '#4A4540' }}>الشروط والأحكام</button>
              {' '}و{' '}
              <button className="underline" style={{ color: '#4A4540' }}>سياسة الخصوصية</button>
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Right Panel — Visual Showcase ═══ */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${LOGIN_BG_URL})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(12,12,14,0.65) 0%, rgba(12,12,14,0.25) 50%, rgba(12,12,14,0.7) 100%)' }} />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: '#C9A84C',
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                opacity: 0.1,
              }}
              animate={{
                y: [0, -15 - Math.random() * 15, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          ))}
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
            style={{ background: 'rgba(201, 168, 76, 0.08)' }}
          />
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 9, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
            className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl"
            style={{ background: 'rgba(201, 168, 76, 0.06)' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 p-10 xl:p-14">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-center max-w-lg"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ background: 'rgba(201, 168, 76, 0.08)', border: '1px solid rgba(201, 168, 76, 0.2)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#C9A84C' }} />
              <span className="text-xs font-medium" style={{ color: '#C9A84C' }}>مدعوم بالذكاء الاصطناعي</span>
            </motion.div>

            <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight" style={{ color: '#E8E4DC', fontFamily: 'Cairo, sans-serif' }}>
              نظام التشغيل المركزي
              <br />
              <span style={{ color: '#C9A84C' }}>لإدارة المعارض والمؤتمرات</span>
            </h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: '#A09A8E' }}>
              منصة متكاملة تجمع 32 وحدة تشغيلية تحت سقف واحد، مدعومة بالذكاء الاصطناعي
              ومتوافقة مع جميع المعايير السعودية والعالمية
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="grid grid-cols-2 gap-4 w-full max-w-md"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.03, borderColor: 'rgba(201, 168, 76, 0.3)' }}
                className="p-5 rounded-xl text-center transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="text-xl xl:text-2xl font-bold mb-1" style={{ color: '#C9A84C', fontFamily: 'JetBrains Mono, monospace' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: '#A09A8E' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Compliance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex items-center gap-2.5 mt-10"
          >
            {['PDPL', 'IFRS', 'ISO', 'NCA', 'SAMA', 'ZATCA'].map((badge) => (
              <span key={badge} className="px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all duration-300 hover:border-[rgba(201,168,76,0.3)]" style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#6B6560', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
