import React, { useState } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadsView } from './components/leads/LeadsView';
import { DealsPipelineView } from './components/deals/DealsPipelineView';
import { ContactsCompaniesView } from './components/contacts/ContactsCompaniesView';
import { ActivitiesView } from './components/activities/ActivitiesView';
import { AutomationView } from './components/automation/AutomationView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { SystemDocsView } from './components/docs/SystemDocsView';
import { SettingsView } from './components/settings/SettingsView';
import { ApiExplorerView } from './components/api/ApiExplorerView';
import { CommunicationHubView } from './components/communication/CommunicationHubView';
import { ProductsQuotesView } from './components/products/ProductsQuotesView';
import { AddLeadModal } from './components/leads/AddLeadModal';
import { ImportExportModal } from './components/import/ImportExportModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeTab } = useCrm();
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <Header onOpenAddLead={() => setIsAddLeadOpen(true)} />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar onOpenImport={() => setIsImportOpen(true)} />

        {/* View Router Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60 pb-16">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'leads' && (
            <LeadsView
              onOpenAddLead={() => setIsAddLeadOpen(true)}
              onOpenImport={() => setIsImportOpen(true)}
            />
          )}
          {activeTab === 'deals' && <DealsPipelineView />}
          {activeTab === 'quotes' && <ProductsQuotesView />}
          {activeTab === 'accounts' && <ContactsCompaniesView />}
          {activeTab === 'comms' && <CommunicationHubView />}
          {activeTab === 'activities' && <ActivitiesView />}
          {activeTab === 'api' && <ApiExplorerView />}
          {activeTab === 'automation' && <AutomationView />}
          {activeTab === 'audit' && <AuditLogsView />}
          {activeTab === 'docs' && <SystemDocsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette onOpenAddLead={() => setIsAddLeadOpen(true)} />
      <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} />
      <ImportExportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <MainLayout />
    </CrmProvider>
  );
}
