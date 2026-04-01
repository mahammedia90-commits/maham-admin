import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  Archive,
  FileEdit,
  Search,
  Filter,
  Star,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Reply,
  Trash2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

type MessagePriority = 'high' | 'normal' | 'low';
type MessageCategory = 'investor' | 'merchant' | 'sponsor' | 'system';
type FolderType = 'inbox' | 'sent' | 'drafts' | 'archived';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  priority: MessagePriority;
  category: MessageCategory;
  folder: FolderType;
}

const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    sender: 'أحمد عبدالله (مستثمر)',
    recipient: 'الإدارة',
    subject: 'استفسار بخصوص الرعاية الماسية',
    preview: 'أود الاستفسار عن تفاصيل باقة الرعاية الماسية للمعرض القادم وما تتضمنه من ميزات...',
    date: '2023-10-25T10:30:00Z',
    read: false,
    priority: 'high',
    category: 'investor',
    folder: 'inbox'
  },
  {
    id: 'MSG-002',
    sender: 'الإدارة',
    recipient: 'شركة التقنية الحديثة (راعي)',
    subject: 'تأكيد حجز المساحة الإعلانية',
    preview: 'نود تأكيد حجزكم للمساحة الإعلانية في القاعة الرئيسية للمعرض...',
    date: '2023-10-24T14:15:00Z',
    read: true,
    priority: 'normal',
    category: 'sponsor',
    folder: 'sent'
  },
  {
    id: 'MSG-003',
    sender: 'خالد محمد (تاجر)',
    recipient: 'الإدارة',
    subject: 'طلب تعديل موقع الجناح',
    preview: 'نرجو منكم النظر في إمكانية تعديل موقع جناحنا ليكون أقرب للمدخل الرئيسي...',
    date: '2023-10-24T09:45:00Z',
    read: true,
    priority: 'normal',
    category: 'merchant',
    folder: 'inbox'
  },
  {
    id: 'MSG-004',
    sender: 'النظام',
    recipient: 'الإدارة',
    subject: 'تحديثات النظام الدورية',
    preview: 'تم الانتهاء من التحديثات الدورية للنظام بنجاح...',
    date: '2023-10-23T23:00:00Z',
    read: false,
    priority: 'low',
    category: 'system',
    folder: 'inbox'
  },
  {
    id: 'MSG-005',
    sender: 'الإدارة',
    recipient: 'جميع الرعاة',
    subject: 'مسودة: دعوة لحضور الحفل الختامي',
    preview: 'يسرنا دعوتكم لحضور الحفل الختامي للمعرض والذي سيقام في...',
    date: '2023-10-22T11:20:00Z',
    read: true,
    priority: 'normal',
    category: 'sponsor',
    folder: 'drafts'
  },
  {
    id: 'MSG-006',
    sender: 'مؤسسة التجارة العالمية',
    recipient: 'الإدارة',
    subject: 'شكر وتقدير',
    preview: 'نتقدم لكم بخالص الشكر والتقدير على حسن التنظيم والاستقبال...',
    date: '2023-10-20T16:00:00Z',
    read: true,
    priority: 'normal',
    category: 'merchant',
    folder: 'archived'
  },
  {
    id: 'MSG-007',
    sender: 'سارة العتيبي (مستثمرة)',
    recipient: 'الإدارة',
    subject: 'تأكيد الحضور لورشة العمل',
    preview: 'أؤكد حضوري لورشة العمل الخاصة بالمستثمرين يوم الخميس القادم...',
    date: '2023-10-25T08:15:00Z',
    read: false,
    priority: 'normal',
    category: 'investor',
    folder: 'inbox'
  },
  {
    id: 'MSG-008',
    sender: 'الإدارة',
    recipient: 'مجموعة الفارس للتجارة',
    subject: 'تذكير: موعد سداد الدفعة الثانية',
    preview: 'نود تذكيركم بموعد سداد الدفعة الثانية من قيمة الجناح...',
    date: '2023-10-25T09:00:00Z',
    read: true,
    priority: 'high',
    category: 'merchant',
    folder: 'sent'
  }
];

const tabs = [
  { id: 'inbox', label: 'الوارد', icon: Mail },
  { id: 'sent', label: 'المرسل', icon: Send },
  { id: 'drafts', label: 'المسودات', icon: FileEdit },
  { id: 'archived', label: 'المؤرشف', icon: Archive }
] as const;

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<FolderType>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesTab = msg.folder === activeTab;
      const matchesSearch = 
        msg.subject.includes(searchQuery) || 
        msg.sender.includes(searchQuery) || 
        msg.preview.includes(searchQuery);
      return matchesTab && matchesSearch;
    });
  }, [messages, activeTab, searchQuery]);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: true } : msg));
    toast.success('تم تحديد الرسالة كمقروءة');
  };

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, folder: 'archived' } : msg));
    toast.success('تم أرشفة الرسالة');
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const getPriorityColor = (priority: MessagePriority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'normal': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'low': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPriorityLabel = (priority: MessagePriority) => {
    switch (priority) {
      case 'high': return 'عاجل';
      case 'normal': return 'عادي';
      case 'low': return 'منخفض';
    }
  };

  const getCategoryLabel = (category: MessageCategory) => {
    switch (category) {
      case 'investor': return 'مستثمر';
      case 'merchant': return 'تاجر';
      case 'sponsor': return 'راعي';
      case 'system': return 'نظام';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="مركز الرسائل والمحادثات"
          subtitle="إدارة التواصل مع المستثمرين، التجار، والرعاة"
          actions={<button onClick={() => toast.info("قريباً")} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">إجراء</button>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي الرسائل"
            value="1,245"
            icon={MessageSquare}
            trend={12}
            delay={0.1}
          />
          <StatsCard
            title="رسائل غير مقروءة"
            value="38"
            icon={AlertCircle}
            trend={5}
            delay={0.2}
          />
          <StatsCard
            title="مرسلة اليوم"
            value="156"
            icon={Send}
            trend={8}
            delay={0.3}
          />
          <StatsCard
            title="متوسط وقت الرد"
            value="45 دقيقة"
            icon={Clock}
            trend={15}
            delay={0.4}
          />
        </div>

        <div className="glass-card rounded-xl border border-border/50 bg-surface2 overflow-hidden h-[600px] flex">
          {/* Sidebar */}
          <div className="w-64 border-l border-border/50 flex flex-col bg-surface2/50">
            <div className="p-4">
              <button 
                onClick={() => toast.info('إنشاء رسالة جديدة')}
                className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                <FileEdit className="w-4 h-4 ml-2" />
                إنشاء رسالة
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-2">
              <ul className="space-y-1 px-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedMessage(null);
                      }}
                      className={cn(
                        "w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                        activeTab === tab.id
                          ? "bg-gold/10 text-gold font-medium"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <tab.icon className={cn(
                        "w-5 h-5 ml-3",
                        activeTab === tab.id ? "text-gold" : "text-muted-foreground"
                      )} />
                      <span>{tab.label}</span>
                      {tab.id === 'inbox' && (
                        <span className="mr-auto bg-gold/20 text-gold text-xs py-0.5 px-2 rounded-full">
                          {messages.filter(m => m.folder === 'inbox' && !m.read).length}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Message List */}
          <div className={cn(
            "flex-1 flex flex-col border-l border-border/50 bg-surface2/30 transition-all duration-300",
            selectedMessage ? "hidden lg:flex lg:w-1/3 lg:flex-none" : "flex"
          )}>
            <div className="p-4 border-b border-border/50 space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ابحث في الرسائل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 border border-border/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="p-1.5 hover:bg-white/5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {filteredMessages.length} رسالة
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredMessages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center"
                  >
                    <Mail className="w-12 h-12 mb-4 opacity-20" />
                    <p>لا توجد رسائل في هذا المجلد</p>
                  </motion.div>
                ) : (
                  filteredMessages.map((msg) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (!msg.read) {
                          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
                        }
                      }}
                      className={cn(
                        "p-4 border-b border-border/50 cursor-pointer transition-colors relative group",
                        selectedMessage?.id === msg.id ? "bg-gold/5" : "hover:bg-white/5",
                        !msg.read ? "bg-white/5" : ""
                      )}
                    >
                      {!msg.read && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold" />
                      )}
                      <div className="flex justify-between items-start mb-1 pr-4">
                        <span className={cn(
                          "font-medium text-sm truncate max-w-[70%]",
                          !msg.read ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {activeTab === 'sent' ? msg.recipient : msg.sender}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(msg.date)}
                        </span>
                      </div>
                      <h4 className={cn(
                        "text-sm mb-1 pr-4 truncate",
                        !msg.read ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {msg.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 pr-4">
                        {msg.preview}
                      </p>
                      <div className="flex items-center gap-2 mt-2 pr-4">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border",
                          getPriorityColor(msg.priority)
                        )}>
                          {getPriorityLabel(msg.priority)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-border/50">
                          {getCategoryLabel(msg.category)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Message Detail */}
          <div className={cn(
            "flex-1 flex flex-col bg-surface2",
            !selectedMessage ? "hidden lg:flex items-center justify-center" : "flex"
          )}>
            {!selectedMessage ? (
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 opacity-50" />
                </div>
                <p>اختر رسالة لعرض محتواها</p>
              </div>
            ) : (
              <>
                {/* Mobile back button */}
                <div className="lg:hidden p-4 border-b border-border/50 flex items-center">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight className="w-5 h-5 ml-1" />
                    العودة للرسائل
                  </button>
                </div>
                
                {/* Detail Header */}
                <div className="p-6 border-b border-border/50">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold text-foreground">{selectedMessage.subject}</h2>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={(e) => handleArchive(selectedMessage.id, e)}
                        className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors tooltip-trigger"
                        title="أرشفة"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-red-500 transition-colors tooltip-trigger"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-lg">
                        {selectedMessage.sender.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {selectedMessage.sender}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          إلى: {selectedMessage.recipient}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-col items-end">
                      <span>{formatDate(selectedMessage.date)}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border",
                          getPriorityColor(selectedMessage.priority)
                        )}>
                          {getPriorityLabel(selectedMessage.priority)}
                        </span>
                        <StatusBadge status={selectedMessage.read ? 'active' : 'pending'} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Detail Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-invert max-w-none text-muted-foreground">
                    <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                      {selectedMessage.preview}
                      <br /><br />
                      نأمل منكم الرد في أقرب وقت ممكن.
                      <br /><br />
                      مع خالص التحيات،
                      <br />
                      {selectedMessage.sender.split(' ')[0]}
                    </p>
                  </div>
                </div>
                
                {/* Reply Box */}
                <div className="p-4 border-t border-border/50 bg-surface2/50">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <textarea 
                        placeholder="اكتب ردك هنا..."
                        className="w-full bg-black/20 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:border-gold/50 text-foreground placeholder:text-muted-foreground resize-none h-20"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <button 
                        onClick={() => toast.success('تم إرسال الرد بنجاح')}
                        className="bg-gold hover:bg-gold/90 text-black p-3 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
