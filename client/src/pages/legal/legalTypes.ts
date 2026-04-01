// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAHAM EXPO — Legal & Contracts Module Types
// متوافق مع V5 Architecture + NOUR Theme + ZATCA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── أنواع العقود ──
export type ContractType = 'rental' | 'sponsorship' | 'investment' | 'employment';
export type ContractStatus = 'draft' | 'pending_sign' | 'active' | 'expiring_soon' | 'expired' | 'renewed' | 'cancelled';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'sadad' | 'mada' | 'stc_pay' | 'apple_pay' | 'tamara' | 'bank_transfer' | 'cash';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type SignatureStatus = 'not_required' | 'pending_party_a' | 'pending_party_b' | 'fully_signed';
export type ZatcaStatus = 'pending' | 'submitted' | 'cleared' | 'failed';

// ── العقد ──
export interface Contract {
  id: string;
  contractNumber: string;
  type: ContractType;
  status: ContractStatus;
  title: string;
  partyA: ContractParty;
  partyB: ContractParty;
  eventId?: string;
  eventName?: string;
  spaceId?: string;
  requestId?: string;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  currency: 'SAR';
  paymentType: 'full' | 'installments' | 'milestone';
  paymentSchedule: PaymentScheduleItem[];
  startDate: string;
  endDate: string;
  signedAt?: string;
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
  signatureStatus: SignatureStatus;
  partyASignedAt?: string;
  partyBSignedAt?: string;
  documentUrl?: string;
  versions: ContractVersion[];
  invoices: Invoice[];
  riskScore?: number;
  aiFlags?: string[];
  createdBy: string;
  approvedBy?: string;
  notes?: string;
}

export interface ContractParty {
  name: string;
  nameAr: string;
  vatNumber: string;
  crNumber?: string;
  email: string;
  phone: string;
  address: string;
}

export interface ContractVersion {
  id: string;
  version: number;
  documentUrl: string;
  changedBy: string;
  changedAt: string;
  changes: string;
}

export interface PaymentScheduleItem {
  id: string;
  dueDate: string;
  amount: number;
  vatAmount: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: string;
  invoiceId?: string;
}

// ── الفاتورة ──
export interface Invoice {
  id: string;
  invoiceNumber: string;
  contractId: string;
  contractNumber?: string;
  billTo: InvoiceParty;
  billFrom: InvoiceParty;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  status: InvoiceStatus;
  currency: 'SAR';
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  zatcaStatus: ZatcaStatus;
  zatcaQrCode?: string;
  payments: Payment[];
  paidAmount: number;
  remainingAmount: number;
  pdfUrl?: string;
  createdBy: string;
  createdAt: string;
}

export interface InvoiceParty {
  name: string;
  nameAr: string;
  vatNumber: string;
  crNumber?: string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  descriptionAr: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  type: 'space' | 'service' | 'sponsorship' | 'penalty' | 'other';
}

// ── المدفوعات ──
export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber?: string;
  contractId: string;
  amount: number;
  currency: 'SAR';
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayRef?: string;
  sadadBillNumber?: string;
  initiatedAt: string;
  completedAt?: string;
  refundedAmount?: number;
  notes?: string;
}

// ── Dashboard Stats ──
export interface LegalDashboardStats {
  totalContracts: number;
  activeContracts: number;
  expiringSoon: number;
  pendingSignature: number;
  totalContractValue: number;
  totalInvoiced: number;
  totalCollected: number;
  overdueAmount: number;
  zatcaCompliance: number;
  contractsByType: Record<ContractType, number>;
  contractsByStatus: Record<ContractStatus, number>;
}

// ── تنبيهات ──
export interface ExpiryAlert {
  contractId: string;
  contractNumber: string;
  partyName: string;
  type: ContractType;
  endDate: string;
  daysRemaining: number;
  totalAmount: number;
}

// ── رؤى AI ──
export interface AIContractInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'compliance' | 'optimization';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  contractId?: string;
  recommendation: string;
  createdAt: string;
}

// ── Labels ──
export const contractTypeLabels: Record<ContractType, string> = {
  rental: 'إيجار مساحة',
  sponsorship: 'رعاية',
  investment: 'استثمار',
  employment: 'عقد عمل',
};

export const contractStatusLabels: Record<ContractStatus, string> = {
  draft: 'مسودة',
  pending_sign: 'بانتظار التوقيع',
  active: 'نشط',
  expiring_soon: 'ينتهي قريباً',
  expired: 'منتهي',
  renewed: 'مجدّد',
  cancelled: 'ملغي',
};

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  draft: 'مسودة',
  sent: 'مرسلة',
  paid: 'مدفوعة',
  partially_paid: 'مدفوعة جزئياً',
  overdue: 'متأخرة',
  cancelled: 'ملغاة',
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  sadad: 'سداد',
  mada: 'مدى',
  stc_pay: 'STC Pay',
  apple_pay: 'Apple Pay',
  tamara: 'تمارا',
  bank_transfer: 'تحويل بنكي',
  cash: 'نقداً',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'معلق',
  processing: 'قيد المعالجة',
  completed: 'مكتمل',
  failed: 'فشل',
  refunded: 'مسترد',
};

export const zatcaStatusLabels: Record<ZatcaStatus, string> = {
  pending: 'معلق',
  submitted: 'مقدّم',
  cleared: 'معتمد',
  failed: 'فشل',
};

// ── Colors ──
export const contractStatusColors: Record<ContractStatus, string> = {
  draft: 'bg-muted/50 text-muted-foreground border-muted',
  pending_sign: 'bg-warning/10 text-warning border-warning/20',
  active: 'bg-success/10 text-success border-success/20',
  expiring_soon: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  expired: 'bg-destructive/10 text-destructive border-destructive/20',
  renewed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  cancelled: 'bg-muted/30 text-muted-foreground/50 border-muted/20',
};

export const invoiceStatusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-muted/50 text-muted-foreground border-muted',
  sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  paid: 'bg-success/10 text-success border-success/20',
  partially_paid: 'bg-warning/10 text-warning border-warning/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
  cancelled: 'bg-muted/30 text-muted-foreground/50 border-muted/20',
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-success/10 text-success border-success/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
  refunded: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

export const contractTypeColors: Record<ContractType, string> = {
  rental: 'bg-gold/10 text-gold border-gold/20',
  sponsorship: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  investment: 'bg-success/10 text-success border-success/20',
  employment: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

// ── Lifecycle Steps ──
export const lifecycleSteps = [
  { id: 'request', label: 'الطلب', icon: 'FileText' },
  { id: 'draft', label: 'المسودة', icon: 'Edit' },
  { id: 'sign', label: 'التوقيع', icon: 'PenTool' },
  { id: 'active', label: 'نشط', icon: 'CheckCircle' },
  { id: 'invoice', label: 'الفاتورة', icon: 'Receipt' },
  { id: 'payment', label: 'الدفع', icon: 'CreditCard' },
  { id: 'close', label: 'الإغلاق', icon: 'Lock' },
] as const;
