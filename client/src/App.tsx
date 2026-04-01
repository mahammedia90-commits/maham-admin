import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Auth
import LoginPage from "./pages/auth/LoginPage";

// Dashboard
import DashboardPage from "./pages/dashboard/DashboardPage";

// Events
import EventsListPage from "./pages/events/EventsListPage";
import EventCreatePage from "./pages/events/EventCreatePage";
import EventDetailPage from "./pages/events/EventDetailPage";

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

function Router() {
  return (
    <Switch>
      {/* Auth */}
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />

      {/* Dashboard */}
      <Route path="/dashboard" component={DashboardPage} />

      {/* Events */}
      <Route path="/events" component={EventsListPage} />
      <Route path="/events/create" component={EventCreatePage} />
      <Route path="/events/:id" component={EventDetailPage} />

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
