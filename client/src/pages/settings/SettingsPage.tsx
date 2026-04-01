/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — الإعدادات (Settings)
 * Features: عام، أمان، إشعارات، تكاملات، نظام
 * ═══════════════════════════════════════════════════════
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Shield, Bell, Globe, Palette, Database,
  Key, Mail, Smartphone, Lock, Eye, EyeOff,
  Save, ToggleLeft, ToggleRight, Building2, User, Zap
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ToggleProps { label: string; desc: string; value: boolean; onChange: () => void }
function Toggle({ label, desc, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div><p className="text-sm text-foreground">{label}</p><p className="text-[10px] text-muted-foreground">{desc}</p></div>
      <button onClick={onChange} className="text-muted-foreground hover:text-gold transition-colors">
        {value ? <ToggleRight size={24} className="text-success" /> : <ToggleLeft size={24} />}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    companyName: 'Maham Expo',
    companyNameAr: 'ماهم إكسبو',
    email: 'info@mahamexpo.sa',
    phone: '+966501234567',
    address: 'الرياض — حي العليا — برج المملكة',
    website: 'https://mahamexpo.sa',
    timezone: 'Asia/Riyadh',
    language: 'ar',
    currency: 'SAR',
    dateFormat: 'DD/MM/YYYY',
    twoFactor: true,
    sessionTimeout: '30',
    ipWhitelist: false,
    loginNotify: true,
    emailNotify: true,
    smsNotify: false,
    pushNotify: true,
    newBooking: true,
    paymentReceived: true,
    contractExpiry: true,
    supportTicket: true,
    dailyReport: true,
    weeklyReport: true,
    darkMode: true,
    compactMode: false,
    animations: true,
    zatcaEnabled: true,
    zatcaKey: 'ZATCA-XXXX-XXXX-XXXX',
    samaCompliance: true,
    autoBackup: true,
    backupFrequency: 'daily',
    maintenanceMode: false,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    toast.success('تم تحديث الإعداد')
  }

  const tabs = [
    { key: 'general', label: 'عام', icon: Building2 },
    { key: 'security', label: 'الأمان', icon: Shield },
    { key: 'notifications', label: 'الإشعارات', icon: Bell },
    { key: 'integrations', label: 'التكاملات', icon: Zap },
    { key: 'appearance', label: 'المظهر', icon: Palette },
    { key: 'system', label: 'النظام', icon: Database },
  ]

  return (
    <AdminLayout>
      <PageHeader title="الإعدادات" subtitle="إعدادات النظام والتكوين" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* القائمة الجانبية */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={cn('w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all', activeTab === t.key ? 'glass-card border-gold/30 bg-gold/5' : 'hover:bg-surface2/50')}>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', activeTab === t.key ? 'bg-gold/10' : 'bg-surface2')}>
                <t.icon size={16} className={activeTab === t.key ? 'text-gold' : 'text-muted-foreground'} />
              </div>
              <span className={cn('text-sm font-medium', activeTab === t.key ? 'text-foreground' : 'text-muted-foreground')}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* المحتوى */}
        <div className="lg:col-span-3">
          {/* عام */}
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-3 sm:p-4 lg:p-6">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Building2 size={16} className="text-gold" />معلومات الشركة</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم الشركة (English)</label><input type="text" value={settings.companyName} onChange={(e) => updateSetting('companyName', e.target.value)} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم الشركة (عربي)</label><input type="text" value={settings.companyNameAr} onChange={(e) => updateSetting('companyNameAr', e.target.value)} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">البريد الإلكتروني</label><input type="email" value={settings.email} onChange={(e) => updateSetting('email', e.target.value)} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">رقم الهاتف</label><input type="text" value={settings.phone} onChange={(e) => updateSetting('phone', e.target.value)} dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">العنوان</label><input type="text" value={settings.address} onChange={(e) => updateSetting('address', e.target.value)} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الموقع الإلكتروني</label><input type="url" value={settings.website} onChange={(e) => updateSetting('website', e.target.value)} dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المنطقة الزمنية</label><select value={settings.timezone} onChange={(e) => updateSetting('timezone', e.target.value)} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option value="Asia/Riyadh">الرياض (GMT+3)</option></select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">اللغة</label><select value={settings.language} onChange={(e) => updateSetting('language', e.target.value)} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option value="ar">العربية</option><option value="en">English</option></select></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">العملة</label><select value={settings.currency} onChange={(e) => updateSetting('currency', e.target.value)} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option value="SAR">ريال سعودي (SAR)</option><option value="USD">دولار (USD)</option></select></div>
                </div>
              </div>
              <button onClick={() => toast.success('تم حفظ الإعدادات')} className="mt-5 h-10 px-6 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Save size={16} />حفظ التغييرات</button>
            </motion.div>
          )}

          {/* الأمان */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-3 sm:p-4 lg:p-6">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Shield size={16} className="text-gold" />إعدادات الأمان</h3>
              <div className="divide-y divide-border/30">
                <Toggle label="المصادقة الثنائية (2FA)" desc="تفعيل التحقق بخطوتين لجميع المستخدمين" value={settings.twoFactor} onChange={() => updateSetting('twoFactor', !settings.twoFactor)} />
                <Toggle label="إشعار تسجيل الدخول" desc="إرسال إشعار عند تسجيل دخول من جهاز جديد" value={settings.loginNotify} onChange={() => updateSetting('loginNotify', !settings.loginNotify)} />
                <Toggle label="قائمة IP المسموحة" desc="تقييد الوصول لعناوين IP محددة فقط" value={settings.ipWhitelist} onChange={() => updateSetting('ipWhitelist', !settings.ipWhitelist)} />
                <div className="py-3">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">مهلة الجلسة (دقائق)</label>
                  <input type="number" value={settings.sessionTimeout} onChange={(e) => updateSetting('sessionTimeout', e.target.value)} dir="ltr" className="w-32 h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-all" />
                </div>
              </div>
            </motion.div>
          )}

          {/* الإشعارات */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass-card p-3 sm:p-4 lg:p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Bell size={16} className="text-gold" />قنوات الإشعارات</h3>
                <div className="divide-y divide-border/30">
                  <Toggle label="البريد الإلكتروني" desc="إرسال الإشعارات عبر البريد" value={settings.emailNotify} onChange={() => updateSetting('emailNotify', !settings.emailNotify)} />
                  <Toggle label="الرسائل النصية (SMS)" desc="إرسال الإشعارات عبر SMS" value={settings.smsNotify} onChange={() => updateSetting('smsNotify', !settings.smsNotify)} />
                  <Toggle label="إشعارات الدفع" desc="إشعارات المتصفح والتطبيق" value={settings.pushNotify} onChange={() => updateSetting('pushNotify', !settings.pushNotify)} />
                </div>
              </div>
              <div className="glass-card p-3 sm:p-4 lg:p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">أحداث الإشعارات</h3>
                <div className="divide-y divide-border/30">
                  <Toggle label="حجز جديد" desc="إشعار عند استلام طلب حجز" value={settings.newBooking} onChange={() => updateSetting('newBooking', !settings.newBooking)} />
                  <Toggle label="استلام دفعة" desc="إشعار عند استلام دفعة مالية" value={settings.paymentReceived} onChange={() => updateSetting('paymentReceived', !settings.paymentReceived)} />
                  <Toggle label="انتهاء عقد" desc="تنبيه قبل انتهاء العقود" value={settings.contractExpiry} onChange={() => updateSetting('contractExpiry', !settings.contractExpiry)} />
                  <Toggle label="تذكرة دعم" desc="إشعار عند إنشاء تذكرة جديدة" value={settings.supportTicket} onChange={() => updateSetting('supportTicket', !settings.supportTicket)} />
                  <Toggle label="تقرير يومي" desc="إرسال ملخص يومي للإدارة" value={settings.dailyReport} onChange={() => updateSetting('dailyReport', !settings.dailyReport)} />
                </div>
              </div>
            </motion.div>
          )}

          {/* التكاملات */}
          {activeTab === 'integrations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {[
                { name: 'ZATCA — الفوترة الإلكترونية', desc: 'ربط مع هيئة الزكاة والضريبة والجمارك', enabled: settings.zatcaEnabled, icon: '🏛️' },
                { name: 'SAMA — البنك المركزي', desc: 'امتثال لأنظمة البنك المركزي السعودي', enabled: settings.samaCompliance, icon: '🏦' },
                { name: 'Google Workspace', desc: 'ربط البريد والتقويم والمستندات', enabled: true, icon: '📧' },
                { name: 'WhatsApp Business', desc: 'إرسال إشعارات عبر واتساب', enabled: false, icon: '💬' },
                { name: 'Stripe / Moyasar', desc: 'بوابة الدفع الإلكتروني', enabled: true, icon: '💳' },
                { name: 'HubSpot CRM', desc: 'مزامنة بيانات العملاء', enabled: false, icon: '📊' },
              ].map((integration, i) => (
                <motion.div key={integration.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div><p className="text-sm font-bold text-foreground">{integration.name}</p><p className="text-[10px] text-muted-foreground">{integration.desc}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full', integration.enabled ? 'bg-success/10 text-success' : 'bg-chrome/10 text-chrome')}>{integration.enabled ? 'مفعّل' : 'غير مفعّل'}</span>
                    <button onClick={() => toast.info(`إعدادات ${integration.name} — قريباً`)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Settings size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* المظهر */}
          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-3 sm:p-4 lg:p-6">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Palette size={16} className="text-gold" />إعدادات المظهر</h3>
              <div className="divide-y divide-border/30">
                <Toggle label="الوضع الداكن" desc="تفعيل الوضع الداكن للواجهة" value={settings.darkMode} onChange={() => updateSetting('darkMode', !settings.darkMode)} />
                <Toggle label="الوضع المضغوط" desc="تقليل المسافات لعرض محتوى أكثر" value={settings.compactMode} onChange={() => updateSetting('compactMode', !settings.compactMode)} />
                <Toggle label="الحركات والانتقالات" desc="تفعيل الرسوم المتحركة في الواجهة" value={settings.animations} onChange={() => updateSetting('animations', !settings.animations)} />
              </div>
              <div className="mt-4 p-4 rounded-xl bg-surface2/50 border border-border/30">
                <p className="text-xs font-bold text-foreground mb-2">نظام الألوان — Nour Theme</p>
                <div className="flex items-center gap-2">
                  {['#C9A84C', '#D4B85C', '#1a1917', '#0f0f0e', '#10B981', '#3B82F6', '#EF4444', '#F59E0B'].map(c => (
                    <div key={c} className="w-8 h-8 rounded-lg border border-border/30" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* النظام */}
          {activeTab === 'system' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass-card p-3 sm:p-4 lg:p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Database size={16} className="text-gold" />النسخ الاحتياطي</h3>
                <div className="divide-y divide-border/30">
                  <Toggle label="نسخ احتياطي تلقائي" desc="إنشاء نسخة احتياطية تلقائياً" value={settings.autoBackup} onChange={() => updateSetting('autoBackup', !settings.autoBackup)} />
                  <div className="py-3">
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">تكرار النسخ</label>
                    <select value={settings.backupFrequency} onChange={(e) => updateSetting('backupFrequency', e.target.value)} className="w-48 h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50">
                      <option value="hourly">كل ساعة</option><option value="daily">يومياً</option><option value="weekly">أسبوعياً</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="glass-card p-3 sm:p-4 lg:p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">معلومات النظام</h3>
                <div className="space-y-2 text-xs">
                  {[
                    ['الإصدار', 'v2.0.0-beta'],
                    ['البيئة', 'Production'],
                    ['قاعدة البيانات', 'PostgreSQL 16'],
                    ['الخادم', 'Manus Cloud — الرياض'],
                    ['آخر نسخة احتياطية', '2026-04-01 06:00'],
                    ['مساحة التخزين', '12.4 GB / 50 GB'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/20">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-mono text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-3 sm:p-4 lg:p-6 border-warning/30">
                <Toggle label="وضع الصيانة" desc="تفعيل وضع الصيانة — يمنع وصول المستخدمين العاديين" value={settings.maintenanceMode} onChange={() => updateSetting('maintenanceMode', !settings.maintenanceMode)} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
