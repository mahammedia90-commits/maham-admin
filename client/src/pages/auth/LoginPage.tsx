import { useState } from 'react'
import { useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Lock, ArrowLeft, Shield, Fingerprint } from 'lucide-react'
import { LOGO_URL, LOGIN_BG_URL } from '@/lib/utils'
import { authApi } from '@/api'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

export default function LoginPage() {
  const [, navigate] = useLocation()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !password) {
      toast.error('يرجى إدخال رقم الجوال وكلمة المرور')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.login({ phone, password })
      if (res.requires_otp) {
        setStep('otp')
        toast.success('تم إرسال رمز التحقق')
      } else if (res.user) {
        setUser(res.user)
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      toast.error('يرجى إدخال رمز التحقق')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.verifyOTP({ code: otp })
      if (res.user) {
        setUser(res.user)
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'رمز التحقق غير صحيح')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Right Side — Form */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 lg:px-14 bg-background relative z-10">
        {/* Gold accent line */}
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm mx-auto"
        >
          {/* Logo */}
          <div className="mb-10">
            <img src={LOGO_URL} alt="Maham Expo" className="h-14 object-contain" />
            <p className="text-muted-foreground text-sm mt-3">لوحة إدارة المعارض والفعاليات</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold text-foreground">تسجيل الدخول</h2>
                  <p className="text-sm text-muted-foreground mt-1">أدخل بياناتك للوصول إلى لوحة التحكم</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">رقم الجوال</label>
                  <div className="relative">
                    <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      className="w-full h-11 pr-10 pl-4 rounded-xl bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">كلمة المرور</label>
                  <div className="relative">
                    <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pr-10 pl-4 rounded-xl bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Shield size={16} />
                      تسجيل الدخول
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP}
                className="space-y-5"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="flex items-center gap-1 text-sm text-gold hover:text-gold-light mb-4 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    رجوع
                  </button>
                  <h2 className="text-xl font-bold text-foreground">التحقق من الهوية</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    تم إرسال رمز التحقق إلى <span className="text-gold font-mono" dir="ltr">{phone}</span>
                  </p>
                </div>

                {/* OTP */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">رمز التحقق</label>
                  <div className="relative">
                    <Fingerprint size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      dir="ltr"
                      className="w-full h-11 pr-10 pl-4 rounded-xl bg-surface2 border border-border/50 text-sm text-foreground text-center font-mono tracking-[0.5em] placeholder:text-muted-foreground placeholder:tracking-[0.5em] focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Fingerprint size={16} />
                      تأكيد الدخول
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="w-full text-center text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  لم يصلك الرمز؟ إعادة الإرسال
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground/50 text-center">
              Maham Expo &copy; {new Date().getFullYear()} — جميع الحقوق محفوظة
            </p>
          </div>
        </motion.div>
      </div>

      {/* Left Side — Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${LOGIN_BG_URL})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />

        {/* Floating Gold Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-gold/8 blur-3xl"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              منصة إدارة المعارض
              <span className="block text-gold mt-1">الأكثر تقدماً</span>
            </h2>
            <p className="text-white/60 text-sm max-w-md leading-relaxed">
              نظام متكامل لإدارة الفعاليات والمعارض مدعوم بالذكاء الاصطناعي، يوفر رؤية شاملة 360 درجة لجميع العمليات التشغيلية والمالية والتسويقية.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
