import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Globe, Bell, Shield, Palette, Database, Key,
  Mail, Smartphone, Building2, Save, User, Lock, Eye
} from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { settingsApi } from '@/api'

const settingsSections = [
  { key: 'general', label: 'عام', icon: Settings },
  { key: 'profile', label: 'الملف الشخصي', icon: User },
  { key: 'notifications', label: 'الإشعارات', icon: Bell },
  { key: 'security', label: 'الأمان', icon: Shield },
  { key: 'integrations', label: 'التكاملات', icon: Database },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general')

  return (
    <AdminLayout>
      <PageHeader
        title="الإعدادات"
        subtitle="إدارة إعدادات النظام والتكاملات"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Settings Nav */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-3 h-fit">
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  activeSection === section.key ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:bg-surface2/50 border border-transparent'
                )}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3 glass-card p-6">
          {activeSection === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-4">الإعدادات العامة</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">اسم المنصة</label>
                    <input type="text" defaultValue="Maham Expo" className="w-full h-10 px-3 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground focus:border-gold/40 focus:ring-1 focus:ring-gold/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">اللغة الافتراضية</label>
                    <select className="w-full h-10 px-3 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground focus:border-gold/40 outline-none transition-all">
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">المنطقة الزمنية</label>
                    <select className="w-full h-10 px-3 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground focus:border-gold/40 outline-none transition-all">
                      <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                      <option value="Asia/Dubai">دبي (GMT+4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">العملة</label>
                    <select className="w-full h-10 px-3 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground focus:border-gold/40 outline-none transition-all">
                      <option value="SAR">ريال سعودي (SAR)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={() => toast.success('تم حفظ الإعدادات')} className="h-10 px-6 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
                <Save size={16} /> حفظ التغييرات
              </button>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-foreground mb-4">الملف الشخصي</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 border-2 border-gold/20 flex items-center justify-center text-gold text-2xl font-bold">ن</div>
                <div>
                  <p className="text-sm font-bold text-foreground">نور كرم</p>
                  <p className="text-xs text-muted-foreground">مدير تنفيذي</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الاسم الأول</label>
                  <input type="text" defaultValue="نور" className="w-full h-10 px-3 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground focus:border-gold/40 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الاسم الأخير</label>
                  <input type="text" defaultValue="كرم" className="w-full h-10 px-3 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground focus:border-gold/40 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">البريد الإلكتروني</label>
                  <input type="email" defaultValue="nour@mahamexpo.sa" className="w-full h-10 px-3 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground focus:border-gold/40 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الهاتف</label>
                  <input type="tel" defaultValue="+966" className="w-full h-10 px-3 rounded-xl bg-surface2/50 border border-border/30 text-sm text-foreground focus:border-gold/40 outline-none transition-all" />
                </div>
              </div>
              <button onClick={() => toast.success('تم تحديث الملف الشخصي')} className="h-10 px-6 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
                <Save size={16} /> حفظ
              </button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-foreground mb-4">إعدادات الإشعارات</h3>
              {[
                { label: 'إشعارات البريد الإلكتروني', desc: 'استلام إشعارات عبر البريد', icon: Mail },
                { label: 'إشعارات الجوال', desc: 'إشعارات Push على الجوال', icon: Smartphone },
                { label: 'إشعارات النظام', desc: 'إشعارات داخل لوحة التحكم', icon: Bell },
                { label: 'تنبيهات الأمان', desc: 'تنبيهات تسجيل الدخول والأمان', icon: Shield },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-surface2/30 border border-border/20">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-gold" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-surface3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-foreground mb-4">الأمان</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface2/30 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock size={16} className="text-gold" />
                      <div>
                        <p className="text-sm font-medium text-foreground">تغيير كلمة المرور</p>
                        <p className="text-[11px] text-muted-foreground">آخر تغيير: منذ 30 يوم</p>
                      </div>
                    </div>
                    <button onClick={() => toast.info('تغيير كلمة المرور — قريباً')} className="h-8 px-3 rounded-lg bg-gold/10 border border-gold/20 text-xs font-medium text-gold hover:bg-gold/20 transition-all">تغيير</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface2/30 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key size={16} className="text-gold" />
                      <div>
                        <p className="text-sm font-medium text-foreground">المصادقة الثنائية (2FA)</p>
                        <p className="text-[11px] text-muted-foreground">غير مفعّلة</p>
                      </div>
                    </div>
                    <button onClick={() => toast.info('تفعيل 2FA — قريباً')} className="h-8 px-3 rounded-lg bg-gold/10 border border-gold/20 text-xs font-medium text-gold hover:bg-gold/20 transition-all">تفعيل</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface2/30 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye size={16} className="text-gold" />
                      <div>
                        <p className="text-sm font-medium text-foreground">سجل تسجيل الدخول</p>
                        <p className="text-[11px] text-muted-foreground">عرض آخر عمليات تسجيل الدخول</p>
                      </div>
                    </div>
                    <button onClick={() => toast.info('سجل الدخول — قريباً')} className="h-8 px-3 rounded-lg bg-gold/10 border border-gold/20 text-xs font-medium text-gold hover:bg-gold/20 transition-all">عرض</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-foreground mb-4">التكاملات</h3>
              {[
                { name: 'ZATCA — الفوترة الإلكترونية', status: 'متصل', connected: true },
                { name: 'Elm — التحقق من الهوية', status: 'متصل', connected: true },
                { name: 'SADAD — المدفوعات', status: 'غير متصل', connected: false },
                { name: 'SMS Gateway', status: 'متصل', connected: true },
                { name: 'WhatsApp Business', status: 'غير متصل', connected: false },
              ].map((integration) => (
                <div key={integration.name} className="p-4 rounded-xl bg-surface2/30 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-2 h-2 rounded-full', integration.connected ? 'bg-success' : 'bg-chrome')} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{integration.name}</p>
                        <p className={cn('text-[11px]', integration.connected ? 'text-success' : 'text-muted-foreground')}>{integration.status}</p>
                      </div>
                    </div>
                    <button onClick={() => toast.info('إعداد التكامل — قريباً')} className="h-8 px-3 rounded-lg bg-gold/10 border border-gold/20 text-xs font-medium text-gold hover:bg-gold/20 transition-all">
                      {integration.connected ? 'إعدادات' : 'ربط'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
