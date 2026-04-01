import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('ar-SA').format(num)
}

export const statusColors: Record<string, string> = {
  active: 'bg-success/15 text-success border border-success/20',
  published: 'bg-success/15 text-success border border-success/20',
  completed: 'bg-info/15 text-info border border-info/20',
  pending: 'bg-warning/15 text-warning border border-warning/20',
  review: 'bg-warning/15 text-warning border border-warning/20',
  draft: 'bg-muted/50 text-muted-foreground border border-border',
  rejected: 'bg-danger/15 text-danger border border-danger/20',
  cancelled: 'bg-danger/15 text-danger border border-danger/20',
  approved: 'bg-success/15 text-success border border-success/20',
  paid: 'bg-success/15 text-success border border-success/20',
  unpaid: 'bg-danger/15 text-danger border border-danger/20',
  overdue: 'bg-danger/15 text-danger border border-danger/20',
  sent: 'bg-info/15 text-info border border-info/20',
  not_sent: 'bg-muted/50 text-muted-foreground border border-border',
  accepted: 'bg-success/15 text-success border border-success/20',
}

export const statusLabels: Record<string, string> = {
  active: 'نشط',
  published: 'منشور',
  completed: 'مكتمل',
  pending: 'قيد الانتظار',
  review: 'قيد المراجعة',
  draft: 'مسودة',
  rejected: 'مرفوض',
  cancelled: 'ملغي',
  approved: 'موافق عليه',
  paid: 'مدفوع',
  unpaid: 'غير مدفوع',
  overdue: 'متأخر',
  sent: 'مرسل',
  not_sent: 'غير مرسل',
  accepted: 'مقبول',
}

export const roleLabels: Record<string, string> = {
  super_admin: 'مدير عام',
  department_manager: 'مدير قسم',
  staff: 'موظف',
  merchant: 'تاجر',
  investor: 'مستثمر',
  sponsor: 'راعي',
}

export const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/Ayi8F2UxCsX9Jj9NAXVaQM/maham-expo-logo-official_d1307ebd.png'
export const LOGIN_BG_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/Ayi8F2UxCsX9Jj9NAXVaQM/login-bg-jydpkZVJnyyPvU8yagwCb3.webp'
export const DASHBOARD_HERO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/Ayi8F2UxCsX9Jj9NAXVaQM/dashboard-hero-4wXQMTK5yxxsmZsLMMxG6a.webp'
