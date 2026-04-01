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

// Monitoring
import MonitoringPage from "./pages/monitoring/MonitoringPage";

// Government
import GovernmentPage from "./pages/government/GovernmentPage";

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

      {/* Monitoring */}
      <Route path="/monitoring" component={MonitoringPage} />

      {/* Government */}
      <Route path="/government" component={GovernmentPage} />

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
