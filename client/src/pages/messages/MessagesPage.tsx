import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Search, Send, Paperclip, MoreVertical, Phone,
  Video, Star, Archive, Trash2, CheckCheck, Check, Clock, Users,
  Building2, Briefcase, Handshake, Filter, X, ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatDateTime } from '@/lib/utils'

// Mock conversations data
const MOCK_CONVERSATIONS = [
  { id: 1, name: 'أحمد المالكي', role: 'investor', avatar: 'أ', lastMessage: 'شكراً لكم على التحديث بخصوص الفعالية القادمة', time: '2026-03-31T14:30:00', unread: 3, online: true, starred: true },
  { id: 2, name: 'سارة العتيبي', role: 'merchant', avatar: 'س', lastMessage: 'هل يمكن تغيير موقع البوث؟', time: '2026-03-31T13:15:00', unread: 1, online: true, starred: false },
  { id: 3, name: 'محمد الحربي', role: 'sponsor', avatar: 'م', lastMessage: 'تم إرسال الشعار المحدث', time: '2026-03-31T11:00:00', unread: 0, online: false, starred: false },
  { id: 4, name: 'فاطمة الشهري', role: 'merchant', avatar: 'ف', lastMessage: 'متى آخر موعد لتقديم المستندات؟', time: '2026-03-30T16:45:00', unread: 2, online: false, starred: true },
  { id: 5, name: 'خالد الدوسري', role: 'investor', avatar: 'خ', lastMessage: 'أريد الاطلاع على تقرير ROI', time: '2026-03-30T10:20:00', unread: 0, online: true, starred: false },
  { id: 6, name: 'نورة القحطاني', role: 'sponsor', avatar: 'ن', lastMessage: 'تم الموافقة على حزمة الرعاية البلاتينية', time: '2026-03-29T09:00:00', unread: 0, online: false, starred: false },
  { id: 7, name: 'عبدالله الغامدي', role: 'merchant', avatar: 'ع', lastMessage: 'أحتاج مساعدة في إعداد البوث', time: '2026-03-28T15:30:00', unread: 0, online: false, starred: false },
  { id: 8, name: 'ريم الزهراني', role: 'investor', avatar: 'ر', lastMessage: 'ما هي الفرص الاستثمارية الجديدة؟', time: '2026-03-28T11:00:00', unread: 5, online: true, starred: true },
]

const MOCK_MESSAGES = [
  { id: 1, sender: 'them', content: 'السلام عليكم، أريد الاستفسار عن الفعالية القادمة', time: '2026-03-31T14:00:00', status: 'read' },
  { id: 2, sender: 'me', content: 'وعليكم السلام، أهلاً بك. الفعالية القادمة ستكون في 15 أبريل 2026', time: '2026-03-31T14:05:00', status: 'read' },
  { id: 3, sender: 'them', content: 'ممتاز! هل يمكنني حجز بوث في المنطقة A؟', time: '2026-03-31T14:10:00', status: 'read' },
  { id: 4, sender: 'me', content: 'نعم، المنطقة A متاحة حالياً. سأرسل لك التفاصيل والأسعار', time: '2026-03-31T14:15:00', status: 'read' },
  { id: 5, sender: 'me', content: 'تم إرسال عرض الأسعار على بريدكم الإلكتروني', time: '2026-03-31T14:20:00', status: 'delivered' },
  { id: 6, sender: 'them', content: 'شكراً لكم على التحديث بخصوص الفعالية القادمة', time: '2026-03-31T14:30:00', status: 'read' },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [filterRole, setFilterRole] = useState<string>('')
  const [showStarredOnly, setShowStarredOnly] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation])

  const filteredConversations = MOCK_CONVERSATIONS.filter(c => {
    if (searchQuery && !c.name.includes(searchQuery) && !c.lastMessage.includes(searchQuery)) return false
    if (filterRole && c.role !== filterRole) return false
    if (showStarredOnly && !c.starred) return false
    return true
  })

  const selectedConv = MOCK_CONVERSATIONS.find(c => c.id === selectedConversation)

  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'investor': return <Building2 size={12} className="text-[#00d4ff]" />
      case 'merchant': return <Briefcase size={12} className="text-[#00e5a0]" />
      case 'sponsor': return <Handshake size={12} className="text-[#f59e0b]" />
      default: return null
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'investor': return 'مستثمر'
      case 'merchant': return 'تاجر'
      case 'sponsor': return 'راعي'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'investor': return 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/20'
      case 'merchant': return 'bg-[#00e5a0]/10 text-[#00e5a0] border-[#00e5a0]/20'
      case 'sponsor': return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const handleSend = () => {
    if (!messageInput.trim()) return
    toast.info('سيتم الإرسال عند ربط الباك إند')
    setMessageInput('')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCheck size={12} className="text-info" />
      case 'delivered': return <CheckCheck size={12} className="text-muted-foreground" />
      case 'sent': return <Check size={12} className="text-muted-foreground" />
      default: return <Clock size={12} className="text-muted-foreground" />
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="مركز الرسائل"
        subtitle="التواصل مع المستثمرين والتجار والرعاة"
        actions={
          <div className="flex items-center gap-2">
            <StatsCard title="غير مقروءة" value={totalUnread} icon={MessageSquare} className="!p-3 !mb-0" />
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-0 h-[calc(100vh-12rem)] glass-card overflow-hidden">
        {/* Conversations List */}
        <div className="col-span-4 border-l border-border/50 flex flex-col">
          {/* Search & Filters */}
          <div className="p-3 border-b border-border/50 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="بحث في المحادثات..."
                className="w-full h-9 pr-9 pl-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="h-7 px-2 rounded-md bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-gold/40 transition-all cursor-pointer"
              >
                <option value="">الكل</option>
                <option value="investor">مستثمرون</option>
                <option value="merchant">تجار</option>
                <option value="sponsor">رعاة</option>
              </select>
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={cn(
                  'h-7 px-2 rounded-md border text-xs transition-all flex items-center gap-1',
                  showStarredOnly ? 'bg-gold/10 border-gold/25 text-gold' : 'bg-surface border-border text-muted-foreground hover:text-gold'
                )}
              >
                <Star size={10} fill={showStarredOnly ? 'currentColor' : 'none'} />
                مميزة
              </button>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare size={32} className="text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">لا توجد محادثات</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 border-b border-border/20 transition-all text-right',
                    selectedConversation === conv.id ? 'bg-gold/5 border-r-2 border-r-gold' : 'hover:bg-surface/50'
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                      getRoleColor(conv.role)
                    )}>
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-success border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground truncate">{conv.name}</span>
                        {conv.starred && <Star size={10} className="text-gold shrink-0" fill="currentColor" />}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(conv.time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {getRoleIcon(conv.role)}
                      <span className="text-[10px] text-muted-foreground">{getRoleLabel(conv.role)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="shrink-0 w-5 h-5 rounded-full bg-gold text-black text-[10px] font-bold flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-8 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold', getRoleColor(selectedConv.role))}>
                    {selectedConv.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{selectedConv.name}</h3>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border', getRoleColor(selectedConv.role))}>
                        {getRoleLabel(selectedConv.role)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedConv.online ? 'متصل الآن' : 'آخر ظهور ' + new Date(selectedConv.time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground transition-colors" title="مكالمة صوتية">
                    <Phone size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground transition-colors" title="مكالمة فيديو">
                    <Video size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground transition-colors" title="المزيد">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {MOCK_MESSAGES.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex', msg.sender === 'me' ? 'justify-start' : 'justify-end')}
                  >
                    <div className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-2.5',
                      msg.sender === 'me'
                        ? 'bg-gold/10 border border-gold/20 rounded-br-sm'
                        : 'bg-surface2 border border-border/50 rounded-bl-sm'
                    )}>
                      <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                      <div className={cn('flex items-center gap-1 mt-1', msg.sender === 'me' ? 'justify-start' : 'justify-end')}>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(msg.time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.sender === 'me' && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors" title="إرفاق ملف">
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 h-10 px-4 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="p-2.5 rounded-lg bg-gold/10 border border-gold/25 text-gold hover:bg-gold/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <MessageSquare size={48} className="text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">اختر محادثة للبدء</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
