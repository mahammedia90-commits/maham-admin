// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAHAM EXPO — Legal Mock Data (واقعية — جاهزة للاستبدال بـ API)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Contract, Invoice, Payment, ExpiryAlert, AIContractInsight, LegalDashboardStats } from './legalTypes';

const mahamParty = {
  name: 'Maham Services & IT',
  nameAr: 'شركة ماهم للخدمات وتقنية المعلومات',
  vatNumber: '310456789012345',
  crNumber: '1010987654',
  email: 'info@mahamexpo.sa',
  phone: '00966535555900',
  address: 'الرياض، حي العليا، طريق الملك فهد',
};

export const contracts: Contract[] = [
  {
    id: 'CNT-001', contractNumber: 'RNT-2026-0001', type: 'rental', status: 'active',
    title: 'عقد إيجار مساحة — معرض الرياض الدولي للتقنية',
    partyA: mahamParty,
    partyB: { name: 'Al-Rajhi Trading Co.', nameAr: 'شركة الراجحي التجارية', vatNumber: '310123456789012', crNumber: '1010123456', email: 'contracts@alrajhi-trade.sa', phone: '00966501234567', address: 'الرياض، حي الملقا' },
    eventId: 'EVT-001', eventName: 'معرض الرياض الدولي للتقنية 2026',
    totalAmount: 450000, vatAmount: 67500, grandTotal: 517500, currency: 'SAR',
    paymentType: 'installments',
    paymentSchedule: [
      { id: 'PS-001', dueDate: '2026-01-15', amount: 150000, vatAmount: 22500, total: 172500, status: 'paid', paidAt: '2026-01-14' },
      { id: 'PS-002', dueDate: '2026-03-15', amount: 150000, vatAmount: 22500, total: 172500, status: 'paid', paidAt: '2026-03-12' },
      { id: 'PS-003', dueDate: '2026-05-15', amount: 150000, vatAmount: 22500, total: 172500, status: 'pending' },
    ],
    startDate: '2026-01-01', endDate: '2026-12-31',
    signedAt: '2025-12-20', activatedAt: '2026-01-01',
    createdAt: '2025-12-15', updatedAt: '2026-03-12',
    signatureStatus: 'fully_signed', partyASignedAt: '2025-12-18', partyBSignedAt: '2025-12-20',
    versions: [{ id: 'V-001', version: 1, documentUrl: '#', changedBy: 'نور كرم', changedAt: '2025-12-15', changes: 'إنشاء العقد الأولي' }],
    invoices: [], riskScore: 15, aiFlags: [], createdBy: 'نور كرم', approvedBy: 'أحمد المالكي',
  },
  {
    id: 'CNT-002', contractNumber: 'SPO-2026-0001', type: 'sponsorship', status: 'active',
    title: 'عقد رعاية بلاتينية — معرض جدة للأغذية',
    partyA: mahamParty,
    partyB: { name: 'Al Marai Company', nameAr: 'شركة المراعي', vatNumber: '310987654321098', crNumber: '1010654321', email: 'sponsorship@almarai.com', phone: '00966509876543', address: 'الرياض، حي الصحافة' },
    eventId: 'EVT-002', eventName: 'معرض جدة الدولي للأغذية 2026',
    totalAmount: 800000, vatAmount: 120000, grandTotal: 920000, currency: 'SAR',
    paymentType: 'full',
    paymentSchedule: [{ id: 'PS-004', dueDate: '2026-02-01', amount: 800000, vatAmount: 120000, total: 920000, status: 'paid', paidAt: '2026-01-28' }],
    startDate: '2026-02-01', endDate: '2026-08-31',
    signedAt: '2026-01-25', activatedAt: '2026-02-01',
    createdAt: '2026-01-10', updatedAt: '2026-02-01',
    signatureStatus: 'fully_signed', partyASignedAt: '2026-01-22', partyBSignedAt: '2026-01-25',
    versions: [{ id: 'V-002', version: 1, documentUrl: '#', changedBy: 'نور كرم', changedAt: '2026-01-10', changes: 'إنشاء عقد الرعاية' }],
    invoices: [], riskScore: 8, aiFlags: [], createdBy: 'نور كرم', approvedBy: 'سارة القحطاني',
  },
  {
    id: 'CNT-003', contractNumber: 'INV-2026-0001', type: 'investment', status: 'pending_sign',
    title: 'عقد استثمار — بوليفارد وورلد موسم الرياض',
    partyA: mahamParty,
    partyB: { name: 'Saudi Ventures Fund', nameAr: 'صندوق المشاريع السعودية', vatNumber: '310555666777888', crNumber: '1010555666', email: 'invest@saudifund.sa', phone: '00966555123456', address: 'الرياض، حي الورود، برج المملكة' },
    eventId: 'EVT-003', eventName: 'بوليفارد وورلد — موسم الرياض 2026',
    totalAmount: 2500000, vatAmount: 375000, grandTotal: 2875000, currency: 'SAR',
    paymentType: 'milestone',
    paymentSchedule: [
      { id: 'PS-005', dueDate: '2026-04-01', amount: 1000000, vatAmount: 150000, total: 1150000, status: 'pending' },
      { id: 'PS-006', dueDate: '2026-07-01', amount: 750000, vatAmount: 112500, total: 862500, status: 'pending' },
      { id: 'PS-007', dueDate: '2026-10-01', amount: 750000, vatAmount: 112500, total: 862500, status: 'pending' },
    ],
    startDate: '2026-04-01', endDate: '2027-03-31',
    createdAt: '2026-03-15', updatedAt: '2026-03-28',
    signatureStatus: 'pending_party_b', partyASignedAt: '2026-03-25',
    versions: [{ id: 'V-003', version: 1, documentUrl: '#', changedBy: 'نور كرم', changedAt: '2026-03-15', changes: 'إنشاء عقد الاستثمار' }],
    invoices: [], riskScore: 35, aiFlags: ['مبلغ كبير — يتطلب مراجعة إضافية'], createdBy: 'نور كرم',
  },
  {
    id: 'CNT-004', contractNumber: 'RNT-2026-0002', type: 'rental', status: 'expiring_soon',
    title: 'عقد إيجار جناح — معرض الدمام للسيارات',
    partyA: mahamParty,
    partyB: { name: 'Abdul Latif Jameel', nameAr: 'عبداللطيف جميل', vatNumber: '310111222333444', crNumber: '1010111222', email: 'events@alj.sa', phone: '00966503334444', address: 'جدة، حي الحمراء' },
    eventId: 'EVT-004', eventName: 'معرض الدمام الدولي للسيارات 2026',
    totalAmount: 280000, vatAmount: 42000, grandTotal: 322000, currency: 'SAR',
    paymentType: 'full',
    paymentSchedule: [{ id: 'PS-008', dueDate: '2026-02-15', amount: 280000, vatAmount: 42000, total: 322000, status: 'paid', paidAt: '2026-02-14' }],
    startDate: '2026-02-01', endDate: '2026-04-15',
    signedAt: '2026-01-28', activatedAt: '2026-02-01',
    createdAt: '2026-01-20', updatedAt: '2026-03-25',
    signatureStatus: 'fully_signed', partyASignedAt: '2026-01-26', partyBSignedAt: '2026-01-28',
    versions: [], invoices: [], riskScore: 45, aiFlags: ['ينتهي خلال 15 يوم'], createdBy: 'سارة القحطاني', approvedBy: 'نور كرم',
  },
  {
    id: 'CNT-005', contractNumber: 'RNT-2025-0008', type: 'rental', status: 'expired',
    title: 'عقد إيجار مساحة — معرض الرياض للعقارات 2025',
    partyA: mahamParty,
    partyB: { name: 'Dar Al Arkan', nameAr: 'دار الأركان', vatNumber: '310222333444555', crNumber: '1010222333', email: 'expo@daralarkan.com', phone: '00966504445555', address: 'الرياض، حي النخيل' },
    totalAmount: 350000, vatAmount: 52500, grandTotal: 402500, currency: 'SAR',
    paymentType: 'full',
    paymentSchedule: [{ id: 'PS-009', dueDate: '2025-09-01', amount: 350000, vatAmount: 52500, total: 402500, status: 'paid', paidAt: '2025-08-30' }],
    startDate: '2025-09-01', endDate: '2025-12-31',
    signedAt: '2025-08-25', activatedAt: '2025-09-01',
    createdAt: '2025-08-15', updatedAt: '2025-12-31',
    signatureStatus: 'fully_signed', partyASignedAt: '2025-08-22', partyBSignedAt: '2025-08-25',
    versions: [], invoices: [], riskScore: 0, aiFlags: [], createdBy: 'أحمد المالكي', approvedBy: 'نور كرم',
  },
  {
    id: 'CNT-006', contractNumber: 'SPO-2026-0002', type: 'sponsorship', status: 'draft',
    title: 'عقد رعاية ذهبية — معرض المدينة للتراث',
    partyA: mahamParty,
    partyB: { name: 'STC Solutions', nameAr: 'حلول STC', vatNumber: '310666777888999', crNumber: '1010666777', email: 'marketing@stc.com.sa', phone: '00966505556666', address: 'الرياض، حي الملز' },
    eventId: 'EVT-005', eventName: 'معرض المدينة المنورة للتراث 2026',
    totalAmount: 500000, vatAmount: 75000, grandTotal: 575000, currency: 'SAR',
    paymentType: 'installments',
    paymentSchedule: [
      { id: 'PS-010', dueDate: '2026-05-01', amount: 250000, vatAmount: 37500, total: 287500, status: 'pending' },
      { id: 'PS-011', dueDate: '2026-07-01', amount: 250000, vatAmount: 37500, total: 287500, status: 'pending' },
    ],
    startDate: '2026-05-01', endDate: '2026-10-31',
    createdAt: '2026-03-20', updatedAt: '2026-03-28',
    signatureStatus: 'not_required',
    versions: [], invoices: [], riskScore: 20, aiFlags: [], createdBy: 'نور كرم',
  },
  {
    id: 'CNT-007', contractNumber: 'RNT-2026-0003', type: 'rental', status: 'cancelled',
    title: 'عقد إيجار — معرض أبها السياحي (ملغي)',
    partyA: mahamParty,
    partyB: { name: 'Tourism Co.', nameAr: 'شركة السياحة المتقدمة', vatNumber: '310777888999000', crNumber: '1010777888', email: 'info@tourism-co.sa', phone: '00966506667777', address: 'أبها، حي المنسك' },
    totalAmount: 120000, vatAmount: 18000, grandTotal: 138000, currency: 'SAR',
    paymentType: 'full', paymentSchedule: [],
    startDate: '2026-06-01', endDate: '2026-08-31',
    createdAt: '2026-02-10', updatedAt: '2026-03-05',
    signatureStatus: 'not_required',
    versions: [], invoices: [], riskScore: 0, aiFlags: ['ألغي بسبب عدم استيفاء الشروط'], createdBy: 'سارة القحطاني', notes: 'ألغي بطلب من الطرف الثاني',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'INV-001', invoiceNumber: 'INV-2026-0001', contractId: 'CNT-001', contractNumber: 'RNT-2026-0001',
    billFrom: mahamParty,
    billTo: contracts[0].partyB,
    items: [
      { id: 'ITM-001', description: 'Booth Rental — Hall A, Space 12', descriptionAr: 'إيجار جناح — صالة A، مساحة 12', quantity: 1, unitPrice: 150000, vatRate: 0.15, vatAmount: 22500, total: 172500, type: 'space' },
    ],
    subtotal: 150000, vatRate: 0.15, vatAmount: 22500, total: 172500,
    status: 'paid', currency: 'SAR', issueDate: '2026-01-10', dueDate: '2026-01-15', paidAt: '2026-01-14',
    zatcaStatus: 'cleared', zatcaQrCode: 'AQZNQUhBTQIOMzEwNDU2Nzg5MDEyMzQ1AxQyMDI2LTAxLTEwVDEwOjAwOjAwWgQIMTcyNTAwLjAFBzIyNTAwLjA=',
    payments: [], paidAmount: 172500, remainingAmount: 0, createdBy: 'نور كرم', createdAt: '2026-01-10',
  },
  {
    id: 'INV-002', invoiceNumber: 'INV-2026-0002', contractId: 'CNT-001', contractNumber: 'RNT-2026-0001',
    billFrom: mahamParty,
    billTo: contracts[0].partyB,
    items: [
      { id: 'ITM-002', description: 'Booth Rental — Hall A, Space 12 (2nd installment)', descriptionAr: 'إيجار جناح — صالة A، مساحة 12 (القسط الثاني)', quantity: 1, unitPrice: 150000, vatRate: 0.15, vatAmount: 22500, total: 172500, type: 'space' },
    ],
    subtotal: 150000, vatRate: 0.15, vatAmount: 22500, total: 172500,
    status: 'paid', currency: 'SAR', issueDate: '2026-03-10', dueDate: '2026-03-15', paidAt: '2026-03-12',
    zatcaStatus: 'cleared', zatcaQrCode: 'AQZNQUhBTQIOMzEwNDU2Nzg5MDEyMzQ1AxQyMDI2LTAzLTEwVDEwOjAwOjAwWgQIMTcyNTAwLjAFBzIyNTAwLjA=',
    payments: [], paidAmount: 172500, remainingAmount: 0, createdBy: 'نور كرم', createdAt: '2026-03-10',
  },
  {
    id: 'INV-003', invoiceNumber: 'INV-2026-0003', contractId: 'CNT-002', contractNumber: 'SPO-2026-0001',
    billFrom: mahamParty,
    billTo: contracts[1].partyB,
    items: [
      { id: 'ITM-003', description: 'Platinum Sponsorship Package', descriptionAr: 'باقة الرعاية البلاتينية', quantity: 1, unitPrice: 800000, vatRate: 0.15, vatAmount: 120000, total: 920000, type: 'sponsorship' },
    ],
    subtotal: 800000, vatRate: 0.15, vatAmount: 120000, total: 920000,
    status: 'paid', currency: 'SAR', issueDate: '2026-01-26', dueDate: '2026-02-01', paidAt: '2026-01-28',
    zatcaStatus: 'cleared', zatcaQrCode: 'AQZNQUhBTQIOMzEwNDU2Nzg5MDEyMzQ1AxQyMDI2LTAxLTI2VDEwOjAwOjAwWgQIOTIwMDAwLjAFBzEyMDAwMC4w',
    payments: [], paidAmount: 920000, remainingAmount: 0, createdBy: 'نور كرم', createdAt: '2026-01-26',
  },
  {
    id: 'INV-004', invoiceNumber: 'INV-2026-0004', contractId: 'CNT-004', contractNumber: 'RNT-2026-0002',
    billFrom: mahamParty,
    billTo: contracts[3].partyB,
    items: [
      { id: 'ITM-004', description: 'Exhibition Booth — Dammam Auto Show', descriptionAr: 'جناح معرض — معرض الدمام للسيارات', quantity: 1, unitPrice: 280000, vatRate: 0.15, vatAmount: 42000, total: 322000, type: 'space' },
    ],
    subtotal: 280000, vatRate: 0.15, vatAmount: 42000, total: 322000,
    status: 'paid', currency: 'SAR', issueDate: '2026-02-10', dueDate: '2026-02-15', paidAt: '2026-02-14',
    zatcaStatus: 'cleared',
    payments: [], paidAmount: 322000, remainingAmount: 0, createdBy: 'سارة القحطاني', createdAt: '2026-02-10',
  },
  {
    id: 'INV-005', invoiceNumber: 'INV-2026-0005', contractId: 'CNT-001', contractNumber: 'RNT-2026-0001',
    billFrom: mahamParty,
    billTo: contracts[0].partyB,
    items: [
      { id: 'ITM-005', description: 'Booth Rental — Hall A, Space 12 (3rd installment)', descriptionAr: 'إيجار جناح — صالة A، مساحة 12 (القسط الثالث)', quantity: 1, unitPrice: 150000, vatRate: 0.15, vatAmount: 22500, total: 172500, type: 'space' },
    ],
    subtotal: 150000, vatRate: 0.15, vatAmount: 22500, total: 172500,
    status: 'sent', currency: 'SAR', issueDate: '2026-03-28', dueDate: '2026-05-15',
    zatcaStatus: 'submitted',
    payments: [], paidAmount: 0, remainingAmount: 172500, createdBy: 'نور كرم', createdAt: '2026-03-28',
  },
];

export const payments: Payment[] = [
  { id: 'PAY-001', paymentNumber: 'PAY-2026-0001', invoiceId: 'INV-001', contractId: 'CNT-001', amount: 172500, currency: 'SAR', method: 'bank_transfer', status: 'completed', gatewayRef: 'BT-20260114-001', initiatedAt: '2026-01-14', completedAt: '2026-01-14' },
  { id: 'PAY-002', paymentNumber: 'PAY-2026-0002', invoiceId: 'INV-002', contractId: 'CNT-001', amount: 172500, currency: 'SAR', method: 'sadad', status: 'completed', sadadBillNumber: 'SADAD-0001', initiatedAt: '2026-03-12', completedAt: '2026-03-12' },
  { id: 'PAY-003', paymentNumber: 'PAY-2026-0003', invoiceId: 'INV-003', contractId: 'CNT-002', amount: 920000, currency: 'SAR', method: 'bank_transfer', status: 'completed', gatewayRef: 'BT-20260128-002', initiatedAt: '2026-01-28', completedAt: '2026-01-28' },
  { id: 'PAY-004', paymentNumber: 'PAY-2026-0004', invoiceId: 'INV-004', contractId: 'CNT-004', amount: 322000, currency: 'SAR', method: 'mada', status: 'completed', gatewayRef: 'MADA-20260214-001', initiatedAt: '2026-02-14', completedAt: '2026-02-14' },
  { id: 'PAY-005', paymentNumber: 'PAY-2026-0005', invoiceId: 'INV-005', contractId: 'CNT-001', amount: 50000, currency: 'SAR', method: 'stc_pay', status: 'pending', initiatedAt: '2026-03-30', notes: 'دفعة جزئية — بانتظار التأكيد' },
];

export const expiryAlerts: ExpiryAlert[] = [
  { contractId: 'CNT-004', contractNumber: 'RNT-2026-0002', partyName: 'عبداللطيف جميل', type: 'rental', endDate: '2026-04-15', daysRemaining: 14, totalAmount: 280000 },
];

export const aiInsights: AIContractInsight[] = [
  { id: 'AI-001', type: 'risk', title: 'عقد استثمار بمبلغ كبير بانتظار التوقيع', description: 'عقد INV-2026-0001 بقيمة 2.5M ريال لا يزال بانتظار توقيع الطرف الثاني منذ 6 أيام', severity: 'high', contractId: 'CNT-003', recommendation: 'التواصل مع صندوق المشاريع السعودية لتسريع التوقيع', createdAt: '2026-03-28' },
  { id: 'AI-002', type: 'compliance', title: 'فاتورة ZATCA معلقة', description: 'فاتورة INV-2026-0005 مقدّمة لـ ZATCA ولم تُعتمد بعد — يجب المتابعة', severity: 'medium', recommendation: 'مراجعة حالة الفاتورة في بوابة ZATCA', createdAt: '2026-03-29' },
  { id: 'AI-003', type: 'opportunity', title: 'فرصة تجديد عقد عبداللطيف جميل', description: 'عقد RNT-2026-0002 ينتهي خلال 15 يوم — العميل أبدى اهتماماً بالتجديد', severity: 'medium', contractId: 'CNT-004', recommendation: 'إرسال عرض تجديد بخصم 5% لتأمين العقد', createdAt: '2026-03-30' },
  { id: 'AI-004', type: 'optimization', title: 'تحسين شروط الدفع', description: 'تحليل 7 عقود يُظهر أن العملاء يدفعون أسرع بـ 3 أيام عند استخدام سداد مقارنة بالتحويل البنكي', severity: 'low', recommendation: 'تفعيل سداد كخيار افتراضي في العقود الجديدة', createdAt: '2026-03-31' },
];

export const dashboardStats: LegalDashboardStats = {
  totalContracts: 7,
  activeContracts: 2,
  expiringSoon: 1,
  pendingSignature: 1,
  totalContractValue: 5000000,
  totalInvoiced: 1759500,
  totalCollected: 1587000,
  overdueAmount: 0,
  zatcaCompliance: 95,
  contractsByType: { rental: 4, sponsorship: 2, investment: 1, employment: 0 },
  contractsByStatus: { draft: 1, pending_sign: 1, active: 2, expiring_soon: 1, expired: 1, renewed: 0, cancelled: 1 },
};
