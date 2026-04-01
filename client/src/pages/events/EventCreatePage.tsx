import { useState } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, DollarSign, FileText, Image, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import { eventsApi } from '@/api'
import { toast } from 'sonner'

const steps = [
  { id: 1, label: 'المعلومات الأساسية', icon: FileText },
  { id: 2, label: 'الموقع والتاريخ', icon: MapPin },
  { id: 3, label: 'السعة والتسعير', icon: DollarSign },
  { id: 4, label: 'المراجعة والنشر', icon: Check },
]

export default function EventCreatePage() {
  const [, navigate] = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'exhibition', description: '',
    location: '', city: '', start_date: '', end_date: '',
    capacity: '', price: '', early_bird_price: '',
  })

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await eventsApi.create(form)
      toast.success('تم إنشاء الفعالية بنجاح')
      navigate('/events')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'فشل إنشاء الفعالية')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full h-11 px-4 rounded-xl bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"

  return (
    <AdminLayout>
      <PageHeader title="إنشاء فعالية جديدة" subtitle="أضف فعالية أو معرض جديد" showBack />

      {/* Steps */}
      <div className="glass-card p-4 mb-3 sm:mb-4 lg:mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                  currentStep >= step.id
                    ? 'bg-gold/15 border border-gold/30 text-gold'
                    : 'bg-surface2 border border-border/50 text-muted-foreground'
                )}>
                  {currentStep > step.id ? <Check size={16} /> : <step.icon size={16} />}
                </div>
                <span className={cn(
                  'text-xs font-medium hidden sm:inline',
                  currentStep >= step.id ? 'text-gold' : 'text-muted-foreground'
                )}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-3',
                  currentStep > step.id ? 'bg-gold/30' : 'bg-border/30'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-3 sm:p-4 lg:p-6"
      >
        {currentStep === 1 && (
          <div className="space-y-5 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">اسم الفعالية</label>
              <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="أدخل اسم الفعالية" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">نوع الفعالية</label>
              <select value={form.type} onChange={(e) => updateForm('type', e.target.value)} className={inputClass}>
                <option value="exhibition">معرض تجاري</option>
                <option value="conference">مؤتمر</option>
                <option value="workshop">ورشة عمل</option>
                <option value="special">فعالية خاصة</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">الوصف</label>
              <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="وصف تفصيلي للفعالية..." rows={4} className={cn(inputClass, 'h-auto py-3')} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">المدينة</label>
                <select value={form.city} onChange={(e) => updateForm('city', e.target.value)} className={inputClass}>
                  <option value="">اختر المدينة</option>
                  <option value="riyadh">الرياض</option>
                  <option value="jeddah">جدة</option>
                  <option value="dammam">الدمام</option>
                  <option value="makkah">مكة المكرمة</option>
                  <option value="madinah">المدينة المنورة</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الموقع التفصيلي</label>
                <input value={form.location} onChange={(e) => updateForm('location', e.target.value)} placeholder="مركز المعارض..." className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">تاريخ البدء</label>
                <input type="date" value={form.start_date} onChange={(e) => updateForm('start_date', e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">تاريخ الانتهاء</label>
                <input type="date" value={form.end_date} onChange={(e) => updateForm('end_date', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">السعة القصوى</label>
              <input type="number" value={form.capacity} onChange={(e) => updateForm('capacity', e.target.value)} placeholder="عدد الحضور المتوقع" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">السعر (ر.س)</label>
                <input type="number" value={form.price} onChange={(e) => updateForm('price', e.target.value)} placeholder="0.00" className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">سعر الحجز المبكر (ر.س)</label>
                <input type="number" value={form.early_bird_price} onChange={(e) => updateForm('early_bird_price', e.target.value)} placeholder="0.00" className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-foreground mb-4">مراجعة البيانات</h3>
            {[
              { label: 'اسم الفعالية', value: form.name || '—' },
              { label: 'النوع', value: form.type },
              { label: 'المدينة', value: form.city || '—' },
              { label: 'الموقع', value: form.location || '—' },
              { label: 'تاريخ البدء', value: form.start_date || '—' },
              { label: 'تاريخ الانتهاء', value: form.end_date || '—' },
              { label: 'السعة', value: form.capacity || '—' },
              { label: 'السعر', value: form.price ? `${form.price} ر.س` : '—' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
          <button
            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="h-9 sm:h-10 px-3 sm:px-5 rounded-xl border border-border/50 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gold/30 disabled:opacity-30 transition-all flex items-center gap-2"
          >
            <ChevronRight size={16} />
            السابق
          </button>
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(s => Math.min(4, s + 1))}
              className="h-9 sm:h-10 px-3 sm:px-5 rounded-xl bg-gold/10 border border-gold/20 text-xs sm:text-sm font-medium text-gold hover:bg-gold/20 transition-all flex items-center gap-2"
            >
              التالي
              <ChevronLeft size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="h-9 sm:h-10 px-4 sm:px-6 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-gold/25 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Check size={16} />}
              نشر الفعالية
            </button>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  )
}
