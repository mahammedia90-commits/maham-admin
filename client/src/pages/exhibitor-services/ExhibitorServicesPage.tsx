import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Wifi, 
  Zap, 
  Truck, 
  Package, 
  ShieldCheck, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock Data
const stats = [
  { title: 'الخدمات المتاحة', value: '24', icon: Wrench, trend: 3 },
  { title: 'الطلبات النشطة', value: '156', icon: Clock, trend: 12 },
  { title: 'إيرادات الخدمات', value: formatCurrency(450000), icon: DollarSign, trend: 8 },
  { title: 'متوسط التقييم', value: '4.8/5', icon: Star, trend: 0 },
];

const services = [
  { id: 'SRV-001', name: 'توصيل كهرباء 220 فولت', category: 'كهرباء', price: 500, description: 'توصيل نقطة كهرباء إضافية للجناح', provider: 'الشركة الوطنية للكهرباء', rating: 4.9 },
  { id: 'SRV-002', name: 'إنترنت عالي السرعة (5G)', category: 'إنترنت', price: 1200, description: 'اتصال إنترنت مخصص بسرعة 500 ميجابت', provider: 'STC', rating: 4.7 },
  { id: 'SRV-003', name: 'تصميم وبناء جناح مخصص', category: 'تصميم جناح', price: 15000, description: 'تصميم وتنفيذ جناح مساحة 20 متر مربع', provider: 'إبداع للمعارض', rating: 4.8 },
  { id: 'SRV-004', name: 'نقل معدات ثقيلة', category: 'نقل', price: 2500, description: 'نقل معدات المعرض من وإلى الموقع', provider: 'لوجستيك بلس', rating: 4.5 },
  { id: 'SRV-005', name: 'تخزين آمن للمعدات', category: 'تخزين', price: 800, description: 'مساحة تخزين 10 متر مربع لمدة أسبوع', provider: 'مخازن آمنة', rating: 4.6 },
  { id: 'SRV-006', name: 'تأمين شامل للجناح', category: 'تأمين', price: 3000, description: 'تأمين ضد الحريق والسرقة خلال فترة المعرض', provider: 'التعاونية للتأمين', rating: 4.9 },
];

const requests = [
  { id: 'REQ-1001', exhibitor: 'شركة التقنية المتقدمة', service: 'توصيل كهرباء 220 فولت', date: '2023-10-15', status: 'completed', amount: 500 },
  { id: 'REQ-1002', exhibitor: 'مؤسسة البناء الحديث', service: 'تصميم وبناء جناح مخصص', date: '2023-10-16', status: 'processing', amount: 15000 },
  { id: 'REQ-1003', exhibitor: 'مجموعة الرواد', service: 'إنترنت عالي السرعة (5G)', date: '2023-10-17', status: 'pending', amount: 1200 },
  { id: 'REQ-1004', exhibitor: 'مصنع الأمل', service: 'نقل معدات ثقيلة', date: '2023-10-18', status: 'cancelled', amount: 2500 },
  { id: 'REQ-1005', exhibitor: 'شركة الأغذية العالمية', service: 'تخزين آمن للمعدات', date: '2023-10-19', status: 'completed', amount: 800 },
];

const reviews = [
  { id: 'REV-001', exhibitor: 'شركة التقنية المتقدمة', service: 'توصيل كهرباء 220 فولت', rating: 5, comment: 'خدمة ممتازة وسريعة', date: '2023-10-20' },
  { id: 'REV-002', exhibitor: 'مؤسسة البناء الحديث', service: 'تصميم وبناء جناح مخصص', rating: 4, comment: 'تصميم رائع ولكن تأخر التسليم قليلاً', date: '2023-10-21' },
  { id: 'REV-003', exhibitor: 'مجموعة الرواد', service: 'إنترنت عالي السرعة (5G)', rating: 5, comment: 'سرعة إنترنت مستقرة طوال فترة المعرض', date: '2023-10-22' },
];

const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'services', label: 'الخدمات المتاحة' },
  { id: 'requests', label: 'الطلبات' },
  { id: 'reviews', label: 'التقييمات' },
];

export default function ExhibitorServicesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const categories = ['الكل', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredRequests = requests.filter(request => {
    return request.exhibitor.toLowerCase().includes(searchQuery.toLowerCase()) || 
           request.service.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAction = (action: string, id: string) => {
    toast.success(`تم تنفيذ الإجراء: ${action} للعنصر ${id}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <PageHeader 
          title="خدمات العارضين" 
          subtitle="إدارة الخدمات المقدمة للعارضين، متابعة الطلبات، وتقييم الأداء"
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 space-x-reverse border-b border-border/50 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeTab === tab.id 
                  ? "text-gold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-gold"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search and Filter Controls */}
        <AnimatePresence mode="wait">
          {activeTab !== 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4 rounded-xl"
            >
              <div className="relative w-full md:w-96">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface2 border border-border/50 rounded-lg pr-10 pl-4 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              
              {activeTab === 'services' && (
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="w-5 h-5 text-gold" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-surface2 border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="glass-card p-6 rounded-xl border border-border/50">
                  <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    أحدث الخدمات المضافة
                  </h3>
                  <div className="space-y-4">
                    {services.slice(0, 3).map(service => (
                      <div key={service.id} className="flex justify-between items-center p-3 bg-surface2 rounded-lg border border-border/50">
                        <div>
                          <p className="font-medium text-foreground">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.provider}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-gold font-bold">{formatCurrency(service.price)}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-3 h-3 text-gold fill-gold" />
                            {service.rating}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl border border-border/50">
                  <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    أحدث الطلبات
                  </h3>
                  <div className="space-y-4">
                    {requests.slice(0, 3).map(request => (
                      <div key={request.id} className="flex justify-between items-center p-3 bg-surface2 rounded-lg border border-border/50">
                        <div>
                          <p className="font-medium text-foreground">{request.exhibitor}</p>
                          <p className="text-sm text-muted-foreground">{request.service}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={request.status as any} />
                          <span className="text-xs text-muted-foreground">{formatDate(request.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-6 rounded-xl border border-border/50 flex flex-col hover:border-gold/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-gold/10 rounded-lg">
                        {service.category === 'كهرباء' && <Zap className="w-6 h-6 text-gold" />}
                        {service.category === 'إنترنت' && <Wifi className="w-6 h-6 text-gold" />}
                        {service.category === 'تصميم جناح' && <Wrench className="w-6 h-6 text-gold" />}
                        {service.category === 'نقل' && <Truck className="w-6 h-6 text-gold" />}
                        {service.category === 'تخزين' && <Package className="w-6 h-6 text-gold" />}
                        {service.category === 'تأمين' && <ShieldCheck className="w-6 h-6 text-gold" />}
                      </div>
                      <div className="flex items-center gap-1 bg-surface2 px-2 py-1 rounded-full text-sm">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="text-foreground font-medium">{service.rating}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-foreground mb-1">{service.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{service.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">مزود الخدمة:</span>
                        <span className="text-foreground font-medium">{service.provider}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">التصنيف:</span>
                        <span className="text-foreground font-medium">{service.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <span className="text-xl font-bold text-gold">{formatCurrency(service.price)}</span>
                      <button 
                        onClick={() => handleAction('تعديل', service.id)}
                        className="px-4 py-2 bg-surface2 hover:bg-gold/10 text-gold rounded-lg transition-colors text-sm font-medium"
                      >
                        تعديل الخدمة
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card rounded-xl border border-border/50 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-surface2/50 border-b border-border/50">
                      <tr>
                        <th className="p-4 text-sm font-medium text-muted-foreground">رقم الطلب</th>
                        <th className="p-4 text-sm font-medium text-muted-foreground">العارض</th>
                        <th className="p-4 text-sm font-medium text-muted-foreground">الخدمة</th>
                        <th className="p-4 text-sm font-medium text-muted-foreground">التاريخ</th>
                        <th className="p-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                        <th className="p-4 text-sm font-medium text-muted-foreground">الحالة</th>
                        <th className="p-4 text-sm font-medium text-muted-foreground">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-surface2/30 transition-colors">
                          <td className="p-4 text-sm font-medium text-foreground">{request.id}</td>
                          <td className="p-4 text-sm text-foreground">{request.exhibitor}</td>
                          <td className="p-4 text-sm text-muted-foreground">{request.service}</td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDate(request.date)}</td>
                          <td className="p-4 text-sm font-medium text-gold">{formatCurrency(request.amount)}</td>
                          <td className="p-4">
                            <StatusBadge status={request.status as any} />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleAction('موافقة', request.id)}
                                className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                                title="موافقة"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleAction('رفض', request.id)}
                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                title="رفض"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6 rounded-xl border border-border/50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-foreground">{review.exhibitor}</h4>
                        <p className="text-sm text-muted-foreground">{review.service}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4", 
                              i < review.rating ? "text-gold fill-gold" : "text-muted-foreground/30"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground mb-4">"{review.comment}"</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(review.date)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
