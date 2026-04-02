import { useState } from 'react';
import { Scale, LayoutDashboard, FileText, Receipt, CreditCard, Shield, Brain, Copy, Plus, Download } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LegalDashboard from './components/LegalDashboard';
import ContractsList from './components/ContractsList';
import ContractDetail from './components/ContractDetail';
import InvoicesList from './components/InvoicesList';
import PaymentsList from './components/PaymentsList';
import LegalCompliance from './components/LegalCompliance';
import LegalAI from './components/LegalAI';
import ContractTemplates from './components/ContractTemplates';
import { contracts as mockContracts, invoices as mockInvoices, payments as mockPayments, expiryAlerts, aiInsights, dashboardStats } from './legalMockData';
import type { Contract, Invoice, ContractType } from './legalTypes';

type Tab = 'overview' | 'contracts' | 'invoices' | 'payments' | 'compliance' | 'templates' | 'ai';
const tabs: { id: Tab; label: string; icon: typeof Scale }[] = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'contracts', label: 'العقود', icon: FileText },
  { id: 'invoices', label: 'الفواتير', icon: Receipt },
  { id: 'payments', label: 'المدفوعات', icon: CreditCard },
  { id: 'compliance', label: 'الامتثال', icon: Shield },
  { id: 'templates', label: 'القوالب', icon: Copy },
  { id: 'ai', label: 'العقل القانوني', icon: Brain },
];

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [contracts, setContracts] = useState(mockContracts);
  const [invoices] = useState(mockInvoices);
  const [payments] = useState(mockPayments);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [nf, setNf] = useState({
    contractNumber: '', title: '', type: 'sponsorship' as ContractType,
    partyName: '', partyNameAr: '', partyEmail: '', partyPhone: '',
    startDate: '', endDate: '', totalAmount: '',
  });

  const handleView = (id: string) => {
    const c = contracts.find(x => x.id === id);
    if (c) setSelectedContract(c);
  };

  const handleAdd = () => {
    if (!nf.title || !nf.partyName) return;
    const val = Number(nf.totalAmount) || 0;
    const now = new Date().toISOString();
    const c: Contract = {
      id: `CNT-${Date.now()}`,
      contractNumber: nf.contractNumber || `CTR-2026-${String(contracts.length + 1).padStart(4, '0')}`,
      title: nf.title,
      type: nf.type,
      status: 'draft',
      partyA: {
        name: 'Maham Expo Co.', nameAr: 'شركة ماهم للمعارض والمؤتمرات',
        vatNumber: '310987654321098', crNumber: '1010654321',
        email: 'contracts@mahamexpo.sa', phone: '00966500000000',
        address: 'الرياض، المملكة العربية السعودية',
      },
      partyB: {
        name: nf.partyName, nameAr: nf.partyNameAr || nf.partyName,
        vatNumber: '', crNumber: '',
        email: nf.partyEmail || '', phone: nf.partyPhone || '',
        address: '',
      },
      totalAmount: val,
      vatAmount: val * 0.15,
      grandTotal: val * 1.15,
      currency: 'SAR',
      paymentType: 'installments',
      paymentSchedule: [],
      startDate: nf.startDate || '2026-04-01',
      endDate: nf.endDate || '2026-12-31',
      createdAt: now,
      updatedAt: now,
      signatureStatus: 'pending_party_a',
      documentUrl: undefined,
      versions: [],
      invoices: [],
      createdBy: 'نور كرم',
      approvedBy: undefined,
      notes: '',
    };
    setContracts(prev => [c, ...prev]);
    setShowAdd(false);
    setNf({ contractNumber: '', title: '', type: 'sponsorship', partyName: '', partyNameAr: '', partyEmail: '', partyPhone: '', startDate: '', endDate: '', totalAmount: '' });
  };

  const cInv = selectedContract ? invoices.filter(i => i.contractId === selectedContract.id) : [];
  const cPay = selectedContract ? payments.filter(p => p.contractId === selectedContract.id) : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="الشؤون القانونية والعقود"
        subtitle="إدارة العقود والفواتير والمدفوعات والامتثال — متوافق مع ZATCA و SAMA"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="border-gold/20 text-chrome hover:text-foreground">
              <Download className="w-4 h-4 ml-1" />تصدير
            </Button>
            <Button onClick={() => setShowAdd(true)} className="bg-gold hover:bg-gold/90 text-black">
              <Plus className="w-4 h-4 ml-1" />عقد جديد
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map(t => {
          const I = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${
                activeTab === t.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-sm' : 'text-chrome hover:text-foreground hover:bg-card/50'
              }`}>
              <I className="w-4 h-4" />{t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <LegalDashboard stats={dashboardStats} contracts={contracts} alerts={expiryAlerts} insights={aiInsights} onViewContract={handleView} />
      )}
      {activeTab === 'contracts' && (
        <ContractsList contracts={contracts} onViewContract={handleView} onAddContract={() => setShowAdd(true)} />
      )}
      {activeTab === 'invoices' && (
        <InvoicesList invoices={invoices} onViewInvoice={(inv: Invoice) => {
          const c = contracts.find(x => x.id === inv.contractId);
          if (c) setSelectedContract(c);
        }} />
      )}
      {activeTab === 'payments' && <PaymentsList payments={payments} />}
      {activeTab === 'compliance' && <LegalCompliance />}
      {activeTab === 'templates' && <ContractTemplates />}
      {activeTab === 'ai' && <LegalAI />}

      {/* Contract Detail Modal */}
      {selectedContract && (
        <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
          <DialogContent className="max-w-4xl bg-background border-gold/20 max-h-[90vh] overflow-y-auto p-0">
            <ContractDetail contract={selectedContract} invoices={cInv} payments={cPay} onClose={() => setSelectedContract(null)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Add Contract Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg bg-background border-gold/20 max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>إنشاء عقد جديد</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-chrome mb-1 block">رقم العقد</label>
                <input value={nf.contractNumber} onChange={e => setNf(p => ({ ...p, contractNumber: e.target.value }))}
                  placeholder="CTR-2026-0006" className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-chrome mb-1 block">نوع العقد</label>
                <select value={nf.type} onChange={e => setNf(p => ({ ...p, type: e.target.value as ContractType }))}
                  className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground focus:border-gold/30 focus:outline-none">
                  <option value="sponsorship">رعاية</option>
                  <option value="rental">تأجير</option>
                  <option value="service">خدمات</option>
                  <option value="partnership">شراكة</option>
                  <option value="employment">توظيف</option>
                  <option value="nda">سرية</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-chrome mb-1 block">عنوان العقد</label>
              <input value={nf.title} onChange={e => setNf(p => ({ ...p, title: e.target.value }))}
                placeholder="عقد رعاية ذهبية — معرض ماهم 2026" className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-chrome mb-1 block">الطرف الثاني (إنجليزي)</label>
                <input value={nf.partyName} onChange={e => setNf(p => ({ ...p, partyName: e.target.value }))}
                  placeholder="Saudi Aramco" className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-chrome mb-1 block">الطرف الثاني (عربي)</label>
                <input value={nf.partyNameAr} onChange={e => setNf(p => ({ ...p, partyNameAr: e.target.value }))}
                  placeholder="شركة أرامكو السعودية" className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-chrome mb-1 block">البريد الإلكتروني</label>
                <input value={nf.partyEmail} onChange={e => setNf(p => ({ ...p, partyEmail: e.target.value }))}
                  placeholder="contracts@aramco.sa" className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-chrome mb-1 block">رقم الهاتف</label>
                <input value={nf.partyPhone} onChange={e => setNf(p => ({ ...p, partyPhone: e.target.value }))}
                  placeholder="00966500000000" className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-chrome mb-1 block">تاريخ البداية</label>
                <input type="date" value={nf.startDate} onChange={e => setNf(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground focus:border-gold/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-chrome mb-1 block">تاريخ النهاية</label>
                <input type="date" value={nf.endDate} onChange={e => setNf(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground focus:border-gold/30 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-chrome mb-1 block">القيمة (ر.س)</label>
                <input type="number" value={nf.totalAmount} onChange={e => setNf(p => ({ ...p, totalAmount: e.target.value }))}
                  placeholder="500000" className="w-full px-3 py-2 bg-card/50 border border-gold/10 rounded-lg text-sm text-foreground placeholder:text-chrome/50 focus:border-gold/30 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAdd} className="flex-1 bg-gold hover:bg-gold/90 text-black">
                <Plus className="w-4 h-4 ml-1" />إنشاء العقد
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">إلغاء</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
