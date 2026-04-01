import { useState, useCallback } from 'react';
import { Users, UserPlus, Briefcase, Clock, Calendar, DollarSign, TrendingUp, FileText, Shield, FolderOpen, Brain, LayoutDashboard } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import { mockEmployees, mockLeaves, mockAttendance, mockPayroll, mockJobs, mockCandidates, mockContracts, mockCompliance, mockDocuments, mockOnboarding, mockAIInsights } from './hrMockData';
import type { Employee } from './hrTypes';

import HrOverview from './components/HrOverview';
import HrEmployees from './components/HrEmployees';
import HrRecruitment from './components/HrRecruitment';
import HrContracts from './components/HrContracts';
import HrPayroll from './components/HrPayroll';
import HrAttendance from './components/HrAttendance';
import HrLeaves from './components/HrLeaves';
import HrPerformance from './components/HrPerformance';
import HrCompliance from './components/HrCompliance';
import HrDocuments from './components/HrDocuments';
import HrOnboarding from './components/HrOnboarding';
import HrAiBrain from './components/HrAiBrain';

const tabsList = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'employees', label: 'الموظفون', icon: Users },
  { id: 'recruitment', label: 'التوظيف', icon: UserPlus },
  { id: 'attendance', label: 'الحضور', icon: Clock },
  { id: 'leaves', label: 'الإجازات', icon: Calendar },
  { id: 'payroll', label: 'الرواتب', icon: DollarSign },
  { id: 'performance', label: 'الأداء', icon: TrendingUp },
  { id: 'contracts', label: 'العقود', icon: Briefcase },
  { id: 'compliance', label: 'الامتثال', icon: Shield },
  { id: 'documents', label: 'المستندات', icon: FolderOpen },
  { id: 'onboarding', label: 'التأهيل', icon: FileText },
  { id: 'ai', label: 'العقل AI', icon: Brain },
];

export default function HrPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [leaves, setLeaves] = useState(mockLeaves);

  const handleAddEmployee = useCallback((emp: Partial<Employee>) => {
    const newEmp: Employee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name_ar: emp.name_ar || '',
      name_en: emp.name_en || '',
      email: emp.email || '',
      phone: emp.phone || '',
      national_id: emp.national_id || '',
      department: emp.department || '',
      position: emp.position || '',
      job_title_ar: emp.job_title_ar || emp.position || '',
      employee_number: `M-${String(employees.length + 100)}`,
      join_date: emp.join_date || new Date().toISOString().split('T')[0],
      date_of_birth: emp.date_of_birth || '1990-01-01',
      nationality: emp.nationality || 'سعودي',
      status: 'probation',
      contract_type: emp.contract_type || 'full_time',
      salary: emp.salary || 0,
      housing_allowance: emp.housing_allowance || 0,
      transport_allowance: emp.transport_allowance || 0,
      is_saudi: emp.is_saudi ?? true,
      gender: emp.gender || 'male',
      performance_score: 0,
      leave_balance: 21,
      skills: emp.skills || [],
      certifications: emp.certifications || [],
    };
    setEmployees(prev => [...prev, newEmp]);
  }, [employees.length]);

  const handleDeleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleApproveLeave = useCallback((id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' as const } : l));
  }, []);

  const handleRejectLeave = useCallback((id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' as const } : l));
  }, []);

  const handleStageChange = useCallback((_id: string, _stage: string) => {
    // placeholder for candidate stage change
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="إدارة الموارد البشرية"
          subtitle="نظام شامل لإدارة شؤون الموظفين — متوافق مع الأنظمة السعودية ومدعوم بالذكاء الاصطناعي"
        />

        {/* Tab Navigation */}
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div className="flex gap-1 min-w-max pb-1">
            {tabsList.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gold/10 text-gold border border-gold/30 shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.id === 'ai' && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <HrOverview employees={employees} leaves={leaves} compliance={mockCompliance} aiInsights={mockAIInsights} onTabChange={setActiveTab} />
          )}
          {activeTab === 'employees' && (
            <HrEmployees employees={employees} onAdd={handleAddEmployee} onDelete={handleDeleteEmployee} />
          )}
          {activeTab === 'recruitment' && (
            <HrRecruitment jobs={mockJobs} candidates={mockCandidates} onStageChange={handleStageChange} />
          )}
          {activeTab === 'attendance' && (
            <HrAttendance attendance={mockAttendance} employees={employees} />
          )}
          {activeTab === 'leaves' && (
            <HrLeaves leaves={leaves} employees={employees} onApprove={handleApproveLeave} onReject={handleRejectLeave} />
          )}
          {activeTab === 'payroll' && (
            <HrPayroll employees={employees} payroll={mockPayroll} />
          )}
          {activeTab === 'performance' && (
            <HrPerformance employees={employees} />
          )}
          {activeTab === 'contracts' && (
            <HrContracts employees={employees} contracts={mockContracts} />
          )}
          {activeTab === 'compliance' && (
            <HrCompliance compliance={mockCompliance} employees={employees} />
          )}
          {activeTab === 'documents' && (
            <HrDocuments documents={mockDocuments} />
          )}
          {activeTab === 'onboarding' && (
            <HrOnboarding tasks={mockOnboarding} employees={employees} />
          )}
          {activeTab === 'ai' && (
            <HrAiBrain insights={mockAIInsights} employees={employees} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
