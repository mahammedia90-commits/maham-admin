import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Landing
import LandingPage from "./pages/LandingPage";

// Auth
import LoginPage from "./pages/auth/LoginPage";

// Dashboard
import DashboardPage from "./pages/dashboard/DashboardPage";

// Events
import EventsListPage from "./pages/events/EventsListPage";
import EventCreatePage from "./pages/events/EventCreatePage";
import EventDetailPage from "./pages/events/EventDetailPage";
import CrowdManagementPage from "./pages/events/CrowdManagementPage";

// Requests
import RequestsPage from "./pages/requests/RequestsPage";

// Users
import UsersListPage from "./pages/users/UsersListPage";
import RolesPage from "./pages/users/RolesPage";

// Finance
import FinancePage from "./pages/finance/FinancePage";

// CRM
import CrmPage from "./pages/crm/CrmPage";

// AI
import AiPage from "./pages/ai/AiPage";

// Marketing
import MarketingPage from "./pages/marketing/MarketingPage";

// Sales
import SalesPage from "./pages/sales/SalesPage";

// Operations
import OperationsPage from "./pages/operations/OperationsPage";

// Legal
import LegalPage from "./pages/legal/LegalPage";

// HR
import HrPage from "./pages/hr/HrPage";

// Support
import SupportPage from "./pages/support/SupportPage";

// Projects
import ProjectsPage from "./pages/projects/ProjectsPage";

// Sponsors
import SponsorsPage from "./pages/sponsors/SponsorsPage";

// Portals
import InvestorPortalPage from "./pages/portals/InvestorPortalPage";
import MerchantPortalPage from "./pages/portals/MerchantPortalPage";
import SponsorPortalPage from "./pages/portals/SponsorPortalPage";

// Reports
import ReportsPage from "./pages/reports/ReportsPage";

// Settings
import SettingsPage from "./pages/settings/SettingsPage";

// Audit
import AuditLogPage from "./pages/audit/AuditLogPage";

// Workflows
import WorkflowsPage from "./pages/workflows/WorkflowsPage";

// Contracts
import ContractsPage from "./pages/contracts/ContractsPage";

// Files
import FilesPage from "./pages/files/FilesPage";

// Documents
import DocumentsPage from "./pages/documents/DocumentsPage";

// Messages
import MessagesPage from "./pages/messages/MessagesPage";

// Notifications
import NotificationsPage from "./pages/notifications/NotificationsPage";

// KYC
import KycPage from "./pages/kyc/KycPage";

// Spaces
import SpacesPage from "./pages/spaces/SpacesPage";

// Bookings
import BookingsPage from "./pages/bookings/BookingsPage";

// Waitlist
import WaitlistPage from "./pages/waitlist/WaitlistPage";

// Teams
import TeamsPage from "./pages/teams/TeamsPage";

// Opportunities
import OpportunitiesPage from "./pages/opportunities/OpportunitiesPage";

// Exhibitor Services
import ExhibitorServicesPage from "./pages/exhibitor-services/ExhibitorServicesPage";

// Sponsor Assets
import SponsorAssetsPage from "./pages/sponsor-assets/SponsorAssetsPage";

// Ratings
import RatingsPage from "./pages/ratings/RatingsPage";

// Deal Rooms
import DealRoomsPage from "./pages/deal-rooms/DealRoomsPage";

// Digital Twin
import DigitalTwinPage from "./pages/digital-twin/DigitalTwinPage";

// Live Economy
import LiveEconomyPage from "./pages/live-economy/LiveEconomyPage";

// Field Operations
import FieldOpsPage from "./pages/field-operations/FieldOpsPage";

// Brand Visibility
import BrandVisibilityPage from "./pages/brand-visibility/BrandVisibilityPage";

// Deliverables
import DeliverablesPage from "./pages/deliverables/DeliverablesPage";

// ROI Reports
import RoiReportsPage from "./pages/roi-reports/RoiReportsPage";

// Networking
import NetworkingPage from "./pages/networking/NetworkingPage";

// Sponsorship Opportunities
import SponsorshipOppsPage from "./pages/sponsorship-opportunities/SponsorshipOppsPage";



// Restored Pages
import BadgesPage from "./pages/badges/BadgesPage";
import BannersPage from "./pages/banners/BannersPage";
import BusinessProfilesPage from "./pages/business-profiles/BusinessProfilesPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import CitiesPage from "./pages/cities/CitiesPage";
import CmsPagesPage from "./pages/cms-pages/CmsPagesPage";
import ExhibitionMapPage from "./pages/exhibition-map/ExhibitionMapPage";
import FaqsPage from "./pages/faqs/FaqsPage";
import PackagesPage from "./pages/packages/PackagesPage";
import SponsorBenefitsPage from "./pages/sponsor-benefits/SponsorBenefitsPage";
import GovernmentPage from "./pages/government/GovernmentPage";
import MonitoringPage from "./pages/monitoring/MonitoringPage";

// Revenue Engine — Lead Generation
import LeadGenerationPage from "./pages/lead-generation/LeadGenerationPage";

// Revenue Engine — Pipeline Kanban
import PipelinePage from "./pages/pipeline/PipelinePage";

// Revenue Engine — Lead Detail
import LeadDetailPage from "./pages/lead-detail/LeadDetailPage";

// Revenue Engine — Follow-Ups
import FollowUpsPage from "./pages/followups/FollowUpsPage";

// Revenue Engine — Employee Enforcement
import EnforcementPage from "./pages/enforcement/EnforcementPage";

// Revenue Engine — Sales Performance
import SalesPerformancePage from "./pages/sales-performance/SalesPerformancePage";

// Revenue Engine — Payment Reminders
import PaymentRemindersPage from "./pages/payment-reminders/PaymentRemindersPage";

// Revenue Engine — AI Sales Intelligence
import AISalesIntelligencePage from "./pages/ai-sales/AISalesIntelligencePage";

function Router() {
  return (
    <Switch>
      {/* Landing */}
      <Route path="/" component={LandingPage} />

      {/* Auth */}
      <Route path="/login" component={LoginPage} />

      {/* Dashboard */}
      <Route path="/dashboard" component={DashboardPage} />

      {/* Events */}
      <Route path="/events" component={EventsListPage} />
      <Route path="/events/create" component={EventCreatePage} />
      <Route path="/events/:id" component={EventDetailPage} />
      <Route path="/crowd" component={CrowdManagementPage} />

      {/* Requests */}
      <Route path="/requests" component={RequestsPage} />

      {/* Users */}
      <Route path="/users" component={UsersListPage} />
      <Route path="/roles" component={RolesPage} />

      {/* Finance */}
      <Route path="/finance" component={FinancePage} />

      {/* CRM */}
      <Route path="/crm" component={CrmPage} />

      {/* AI */}
      <Route path="/ai" component={AiPage} />

      {/* Marketing */}
      <Route path="/marketing" component={MarketingPage} />

      {/* Sales */}
      <Route path="/sales" component={SalesPage} />

      {/* Operations */}
      <Route path="/operations" component={OperationsPage} />

      {/* Legal */}
      <Route path="/legal" component={LegalPage} />

      {/* HR */}
      <Route path="/hr" component={HrPage} />

      {/* Support */}
      <Route path="/support" component={SupportPage} />

      {/* Projects */}
      <Route path="/projects" component={ProjectsPage} />

      {/* Sponsors */}
      <Route path="/sponsors" component={SponsorsPage} />

      {/* Portals */}
      <Route path="/portal/investor" component={InvestorPortalPage} />
      <Route path="/portal/merchant" component={MerchantPortalPage} />
      <Route path="/portal/sponsor" component={SponsorPortalPage} />

      {/* Reports */}
      <Route path="/reports" component={ReportsPage} />

      {/* Settings */}
      <Route path="/settings" component={SettingsPage} />

      {/* Audit */}
      <Route path="/audit" component={AuditLogPage} />
      <Route path="/contracts" component={ContractsPage} />

      {/* Workflows */}
      <Route path="/workflows" component={WorkflowsPage} />

      {/* Files */}
      <Route path="/files" component={FilesPage} />

      {/* Documents */}
      <Route path="/documents" component={DocumentsPage} />

      {/* Messages */}
      <Route path="/messages" component={MessagesPage} />

      {/* Notifications */}
      <Route path="/notifications" component={NotificationsPage} />

      {/* KYC */}
      <Route path="/kyc" component={KycPage} />

      {/* Spaces */}
      <Route path="/spaces" component={SpacesPage} />

      {/* Bookings */}
      <Route path="/bookings" component={BookingsPage} />

      {/* Waitlist */}
      <Route path="/waitlist" component={WaitlistPage} />

      {/* Teams */}
      <Route path="/teams" component={TeamsPage} />

      {/* Opportunities */}
      <Route path="/opportunities" component={OpportunitiesPage} />

      {/* Exhibitor Services */}
      <Route path="/exhibitor-services" component={ExhibitorServicesPage} />

      {/* Sponsor Assets */}
      <Route path="/sponsor-assets" component={SponsorAssetsPage} />

      {/* Ratings */}
      <Route path="/ratings" component={RatingsPage} />

      {/* Deal Rooms */}
      <Route path="/deal-rooms" component={DealRoomsPage} />

      {/* Digital Twin */}
      <Route path="/digital-twin" component={DigitalTwinPage} />

      {/* Live Economy */}
      <Route path="/live-economy" component={LiveEconomyPage} />

      {/* Field Operations */}
      <Route path="/field-operations" component={FieldOpsPage} />

      {/* Brand Visibility */}
      <Route path="/brand-visibility" component={BrandVisibilityPage} />

      {/* Deliverables */}
      <Route path="/deliverables" component={DeliverablesPage} />

      {/* ROI Reports */}
      <Route path="/roi-reports" component={RoiReportsPage} />

      {/* Networking */}
      <Route path="/networking" component={NetworkingPage} />

      {/* Sponsorship Opportunities */}
      <Route path="/sponsorship-opportunities" component={SponsorshipOppsPage} />

      {/* Restored Pages */}
      <Route path="/badges" component={BadgesPage} />
      <Route path="/banners" component={BannersPage} />
      <Route path="/business-profiles" component={BusinessProfilesPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/cities" component={CitiesPage} />
      <Route path="/cms-pages" component={CmsPagesPage} />
      <Route path="/exhibition-map" component={ExhibitionMapPage} />
      <Route path="/faqs" component={FaqsPage} />
      <Route path="/packages" component={PackagesPage} />
      <Route path="/sponsor-benefits" component={SponsorBenefitsPage} />
      <Route path="/government" component={GovernmentPage} />
      <Route path="/monitoring" component={MonitoringPage} />

      {/* Revenue Engine */}
      <Route path="/leads" component={LeadGenerationPage} />
      <Route path="/pipeline" component={PipelinePage} />
      <Route path="/leads/:id" component={LeadDetailPage} />
      <Route path="/followups" component={FollowUpsPage} />
      <Route path="/enforcement" component={EnforcementPage} />
      <Route path="/sales-performance" component={SalesPerformancePage} />
      <Route path="/payment-reminders" component={PaymentRemindersPage} />
      <Route path="/ai/sales-intelligence" component={AISalesIntelligencePage} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'rgba(26, 25, 23, 0.95)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                color: '#F5F0E8',
                backdropFilter: 'blur(12px)',
                fontFamily: 'Cairo, sans-serif',
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
