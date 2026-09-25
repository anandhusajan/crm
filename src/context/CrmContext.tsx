import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Branch,
  User,
  UserRole,
  PipelineStage,
  Lead,
  Company,
  Contact,
  Deal,
  Activity,
  Workflow,
  WorkflowRun,
  AuditLog,
  ApiKey,
  WebhookEndpoint,
  LeadStatus,
  Product,
  Quote,
  CommunicationMessage,
  CustomFieldDefinition,
  ApiEndpointDef
} from '../types/crm';
import {
  INITIAL_BRANCHES,
  INITIAL_USERS,
  PIPELINE_STAGES,
  INITIAL_COMPANIES,
  INITIAL_CONTACTS,
  INITIAL_LEADS,
  INITIAL_DEALS,
  INITIAL_ACTIVITIES,
  INITIAL_WORKFLOWS,
  INITIAL_WORKFLOW_RUNS,
  INITIAL_AUDIT_LOGS,
  INITIAL_API_KEYS,
  INITIAL_WEBHOOKS,
  INITIAL_PRODUCTS,
  INITIAL_QUOTES,
  INITIAL_COMMUNICATIONS,
  INITIAL_CUSTOM_FIELDS,
  API_ENDPOINTS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface CrmContextType {
  // Tenancy & RBAC
  branches: Branch[];
  currentBranchId: string; // 'all' or specific branch id
  setCurrentBranchId: (id: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  setUserRole: (role: UserRole) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data & Mutators
  leads: Lead[];
  filteredLeads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  assignLead: (leadId: string, userId: string) => void;
  convertLead: (leadId: string, dealTitle?: string, dealValue?: number) => { company: Company; contact: Contact; deal: Deal };
  addLeadNote: (leadId: string, note: string) => void;

  // Companies & Contacts
  companies: Company[];
  contacts: Contact[];
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'dealsCount' | 'contactsCount'>) => Company;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'lastContacted'>) => Contact;

  // Deals & Pipelines
  stages: PipelineStage[];
  deals: Deal[];
  filteredDeals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'stageHistory'>) => void;
  moveDealStage: (dealId: string, targetStageId: string) => void;

  // Activities & Tasks
  activities: Activity[];
  filteredActivities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  toggleActivityStatus: (activityId: string) => void;
  deleteActivity: (activityId: string) => void;

  // Workflows & BullMQ Queue
  workflows: Workflow[];
  workflowRuns: WorkflowRun[];
  toggleWorkflowActive: (workflowId: string) => void;
  triggerManualWorkflowRun: (workflowId: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    entityName: string,
    oldValues?: Record<string, unknown>,
    newValues?: Record<string, unknown>
  ) => void;

  // Platform & Settings
  apiKeys: ApiKey[];
  createApiKey: (name: string) => void;
  revokeApiKey: (id: string) => void;
  webhooks: WebhookEndpoint[];
  addWebhook: (url: string, events: string[]) => void;

  // Products & Quotes
  products: Product[];
  quotes: Quote[];
  createQuote: (quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt'>) => Quote;

  // Communications (Email, Calls, SMS, WhatsApp)
  communications: CommunicationMessage[];
  sendCommunicationMessage: (msg: Omit<CommunicationMessage, 'id' | 'timestamp'>) => CommunicationMessage;

  // Dynamic Custom Fields
  customFields: CustomFieldDefinition[];
  addCustomField: (field: Omit<CustomFieldDefinition, 'id'>) => CustomFieldDefinition;

  // REST API Explorer & Live Execution Engine
  apiEndpoints: ApiEndpointDef[];
  executeApiRequest: (
    endpoint: ApiEndpointDef,
    params?: Record<string, string>,
    body?: Record<string, unknown>,
    authKey?: string
  ) => Promise<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
    durationMs: number;
  }>;

  // Command Palette & Global Search
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Import / Export
  importLeads: (newLeads: Partial<Lead>[]) => { addedCount: number; duplicateCount: number };
  exportLeadsCsv: () => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Tenancy & RBAC state
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [currentBranchId, setCurrentBranchId] = useState<string>('all');
  const [availableUsers, setAvailableUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default Super Admin

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core entities
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [stages] = useState<PipelineStage[]>(PIPELINE_STAGES);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>(INITIAL_WORKFLOW_RUNS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(INITIAL_WEBHOOKS);

  // Advanced modules: Products, Quotes, Communications, Custom Fields, API
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [communications, setCommunications] = useState<CommunicationMessage[]>(INITIAL_COMMUNICATIONS);
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(INITIAL_CUSTOM_FIELDS);
  const [apiEndpoints] = useState<ApiEndpointDef[]>(API_ENDPOINTS);

  // Command palette & toasts
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAuditAction = (
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    entityName: string,
    oldValues?: Record<string, unknown>,
    newValues?: Record<string, unknown>
  ) => {
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      action,
      entityType,
      entityId,
      entityName,
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      ipAddress: '192.168.1.10',
      timestamp: new Date().toISOString(),
      oldValues,
      newValues
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const setUserRole = (role: UserRole) => {
    const oldRole = currentUser.role;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    setAvailableUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    logAuditAction('USER_ROLE_UPDATED', 'User', currentUser.id, currentUser.name, { role: oldRole }, { role });
    addToast({
      type: 'info',
      title: `Switched role to ${role}`,
      description: `Permissions scoped to: ${role === 'Super Admin' ? 'ALL Organizations & Branches' : role === 'Branch Manager' ? 'Branch Scope' : 'Restricted Role Scope'}`
    });
  };

  // Branch isolation filtering
  const filteredLeads = useMemo(() => {
    if (currentBranchId === 'all') return leads;
    return leads.filter((l) => l.branchId === currentBranchId);
  }, [leads, currentBranchId]);

  const filteredDeals = useMemo(() => {
    if (currentBranchId === 'all') return deals;
    return deals.filter((d) => d.branchId === currentBranchId);
  }, [deals, currentBranchId]);

  const filteredActivities = useMemo(() => {
    return activities;
  }, [activities]);

  // Lead mutations
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...leadData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLeads((prev) => [newLead, ...prev]);
    logAuditAction('LEAD_CREATED', 'Lead', newId, `${newLead.firstName} ${newLead.lastName} (${newLead.companyName})`, undefined, {
      score: newLead.score,
      source: newLead.source,
      assignedTo: newLead.assignedTo
    });

    // If score >= 85 and workflow is active, simulate BullMQ automatic routing
    const autoRoutingWf = workflows.find((w) => w.id === 'wf-1' && w.isActive);
    if (autoRoutingWf && newLead.score >= 85) {
      triggerManualWorkflowRun('wf-1', newLead);
    }

    addToast({
      type: 'success',
      title: 'Lead created successfully',
      description: `${newLead.firstName} ${newLead.lastName} has been registered.`
    });
  };

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          logAuditAction('LEAD_UPDATED', 'Lead', l.id, `${l.firstName} ${l.lastName}`, { status: l.status }, { status: newStatus });
          return { ...l, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
    addToast({
      type: 'info',
      title: 'Lead status updated',
      description: `Status changed to ${newStatus}`
    });
  };

  const assignLead = (leadId: string, userId: string) => {
    const targetUser = availableUsers.find((u) => u.id === userId);
    if (!targetUser) return;
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          logAuditAction('LEAD_UPDATED', 'Lead', l.id, `${l.firstName} ${l.lastName}`, { assignedTo: l.assignedTo }, { assignedTo: targetUser.name });
          return { ...l, assignedTo: targetUser.name, assignedUserId: targetUser.id, updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
    addToast({
      type: 'success',
      title: 'Lead Assigned',
      description: `Assigned to ${targetUser.name}`
    });
  };

  const addLeadNote = (leadId: string, note: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, notes: [note, ...l.notes], updatedAt: new Date().toISOString() };
        }
        return l;
      })
    );
    addToast({
      type: 'info',
      title: 'Note added',
      description: 'Activity history updated.'
    });
  };

  // Lead Conversion Workflow: preserves data relationships across Lead -> Contact + Company + Deal
  const convertLead = (leadId: string, customDealTitle?: string, customDealValue?: number) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) throw new Error('Lead not found');

    const companyId = `comp-${Date.now()}`;
    const contactId = `cont-${Date.now()}`;
    const dealId = `deal-${Date.now()}`;

    // 1. Create Company
    const newCompany: Company = {
      id: companyId,
      name: targetLead.companyName,
      domain: `${targetLead.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      industry: 'Enterprise Technology',
      size: '250 - 500 employees',
      annualRevenue: 50000000,
      phone: targetLead.phone,
      city: 'Headquarters',
      country: 'USA',
      branchId: targetLead.branchId,
      dealsCount: 1,
      contactsCount: 1,
      createdAt: new Date().toISOString()
    };

    // 2. Create Contact
    const newContact: Contact = {
      id: contactId,
      firstName: targetLead.firstName,
      lastName: targetLead.lastName,
      email: targetLead.email,
      phone: targetLead.phone,
      title: targetLead.title,
      companyId: companyId,
      companyName: targetLead.companyName,
      isPrimary: true,
      branchId: targetLead.branchId,
      lastContacted: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // 3. Create Deal in Pipeline
    const newDeal: Deal = {
      id: dealId,
      title: customDealTitle || `${targetLead.companyName} — Commercial Deployment`,
      value: customDealValue || targetLead.estimatedValue || 150000,
      currency: 'USD',
      pipelineId: 'pipe-1',
      stageId: 'stage-2', // Discovery & Needs
      probability: 40,
      expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: targetLead.assignedTo,
      assignedUserId: targetLead.assignedUserId,
      companyId: companyId,
      companyName: targetLead.companyName,
      contactId: contactId,
      contactName: `${targetLead.firstName} ${targetLead.lastName}`,
      branchId: targetLead.branchId,
      products: [
        { id: `p-${Date.now()}`, name: 'Nexus CRM Self-Hosted Enterprise Suite', quantity: 1, unitPrice: customDealValue || targetLead.estimatedValue || 150000 }
      ],
      notes: `Converted from lead: ${targetLead.notes.join('; ')}`,
      stageHistory: [
        {
          fromStage: 'Lead Qualification',
          toStage: '2. Discovery & Needs',
          changedAt: new Date().toISOString(),
          changedBy: currentUser.name
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Commit to state
    setCompanies((prev) => [newCompany, ...prev]);
    setContacts((prev) => [newContact, ...prev]);
    setDeals((prev) => [newDeal, ...prev]);

    // Update lead status to Won / Converted
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Won', updatedAt: new Date().toISOString() } : l))
    );

    // Audit log
    logAuditAction('LEAD_CONVERTED', 'Lead', leadId, `${targetLead.firstName} ${targetLead.lastName}`, {
      status: targetLead.status
    }, {
      status: 'Won',
      convertedCompanyId: companyId,
      convertedContactId: contactId,
      convertedDealId: dealId
    });

    addToast({
      type: 'success',
      title: 'Lead Converted Successfully',
      description: `Created Company (${newCompany.name}), Contact (${newContact.firstName}), and Deal ($${newDeal.value.toLocaleString()}).`
    });

    return { company: newCompany, contact: newContact, deal: newDeal };
  };

  // Company and Contact creation
  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'dealsCount' | 'contactsCount'>) => {
    const newCompany: Company = {
      ...companyData,
      id: `comp-${Date.now()}`,
      dealsCount: 0,
      contactsCount: 0,
      createdAt: new Date().toISOString()
    };
    setCompanies((prev) => [newCompany, ...prev]);
    logAuditAction('LEAD_CREATED', 'Company', newCompany.id, newCompany.name, undefined, { industry: newCompany.industry });
    addToast({ type: 'success', title: 'Company Added', description: newCompany.name });
    return newCompany;
  };

  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'lastContacted'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `cont-${Date.now()}`,
      lastContacted: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setContacts((prev) => [newContact, ...prev]);
    // increment company contact count
    setCompanies((prev) =>
      prev.map((c) => (c.id === newContact.companyId ? { ...c, contactsCount: c.contactsCount + 1 } : c))
    );
    logAuditAction('LEAD_CREATED', 'Contact', newContact.id, `${newContact.firstName} ${newContact.lastName}`, undefined, { email: newContact.email });
    addToast({ type: 'success', title: 'Contact Added', description: `${newContact.firstName} ${newContact.lastName}` });
    return newContact;
  };

  // Deal mutations
  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'stageHistory'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      stageHistory: [
        {
          fromStage: 'Creation',
          toStage: stages.find((s) => s.id === dealData.stageId)?.name || 'Stage 1',
          changedAt: new Date().toISOString(),
          changedBy: currentUser.name
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDeals((prev) => [newDeal, ...prev]);
    logAuditAction('DEAL_CREATED', 'Deal', newDeal.id, newDeal.title, undefined, { value: newDeal.value, stageId: newDeal.stageId });
    addToast({ type: 'success', title: 'Deal Created', description: `${newDeal.title} ($${newDeal.value.toLocaleString()})` });
  };

  const moveDealStage = (dealId: string, targetStageId: string) => {
    const targetStage = stages.find((s) => s.id === targetStageId);
    if (!targetStage) return;

    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const currentStage = stages.find((s) => s.id === d.stageId);
          const historyEntry = {
            fromStage: currentStage?.name || d.stageId,
            toStage: targetStage.name,
            changedAt: new Date().toISOString(),
            changedBy: currentUser.name
          };

          logAuditAction('DEAL_STAGE_CHANGED', 'Deal', d.id, d.title, {
            stageId: d.stageId,
            stageName: currentStage?.name,
            probability: d.probability
          }, {
            stageId: targetStage.id,
            stageName: targetStage.name,
            probability: targetStage.probability
          });

          // Check if deal is moved to Closed Won and trigger workflow
          if (targetStage.isWon) {
            const dealWonWf = workflows.find((w) => w.id === 'wf-2' && w.isActive);
            if (dealWonWf) {
              triggerManualWorkflowRun('wf-2', d);
            }
          }

          return {
            ...d,
            stageId: targetStage.id,
            probability: targetStage.probability,
            stageHistory: [...d.stageHistory, historyEntry],
            updatedAt: new Date().toISOString()
          };
        }
        return d;
      })
    );

    addToast({
      type: 'info',
      title: 'Deal Moved',
      description: `Stage changed to ${targetStage.name} (${targetStage.probability}%)`
    });
  };

  // Activity operations
  const addActivity = (activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setActivities((prev) => [newActivity, ...prev]);
    addToast({ type: 'success', title: 'Activity Scheduled', description: newActivity.subject });
  };

  const toggleActivityStatus = (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === activityId) {
          const newStatus = a.status === 'completed' ? 'pending' : 'completed';
          if (newStatus === 'completed') {
            logAuditAction('TASK_COMPLETED', 'Task', a.id, a.subject);
          }
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
  };

  const deleteActivity = (activityId: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
    addToast({ type: 'info', title: 'Activity removed' });
  };

  // Workflow operations
  const toggleWorkflowActive = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === workflowId) {
          const nextState = !w.isActive;
          logAuditAction('WORKFLOW_TRIGGERED', 'Workflow', w.id, w.title, { isActive: w.isActive }, { isActive: nextState });
          return { ...w, isActive: nextState };
        }
        return w;
      })
    );
  };

  const triggerManualWorkflowRun = (workflowId: string, triggerEntity?: unknown) => {
    const wf = workflows.find((w) => w.id === workflowId);
    if (!wf) return;

    const runId = `run-${Date.now()}`;
    const entityName = triggerEntity && typeof triggerEntity === 'object' && 'companyName' in triggerEntity
      ? `${(triggerEntity as Record<string, string>).firstName} ${(triggerEntity as Record<string, string>).lastName} (${(triggerEntity as Record<string, string>).companyName})`
      : triggerEntity && typeof triggerEntity === 'object' && 'title' in triggerEntity
      ? (triggerEntity as Record<string, string>).title
      : 'Apex Logistics Global Account';

    const stepResults = [
      `Queue message ingested by BullMQ worker [JobID: bull_${runId}]`,
      `Evaluating conditions for trigger: ${wf.triggerType} [PASSED]`,
      `Action: Dispatched webhook event to internal Coolify subscriber`,
      `Action: Executed task creation & notification routing`,
      `Finished asynchronously with 0 errors`
    ];

    const newRun: WorkflowRun = {
      id: runId,
      workflowId: wf.id,
      workflowTitle: wf.title,
      status: 'success',
      entityId: 'ent-auto',
      entityName,
      triggeredAt: new Date().toISOString(),
      durationMs: Math.floor(Math.random() * 250) + 80,
      stepResults
    };

    setWorkflowRuns((prev) => [newRun, ...prev]);
    setWorkflows((prev) =>
      prev.map((w) => (w.id === workflowId ? { ...w, lastRun: new Date().toISOString(), runCount: w.runCount + 1 } : w))
    );

    logAuditAction('WORKFLOW_TRIGGERED', 'Workflow', wf.id, wf.title, undefined, { runId, status: 'success' });

    addToast({
      type: 'success',
      title: 'Workflow Executed',
      description: `BullMQ background job executed for "${wf.title}" in ${newRun.durationMs}ms.`
    });
  };

  // API Keys
  const createApiKey = (name: string) => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name,
      prefix: `nx_live_${Math.random().toString(36).substring(2, 6)}...`,
      lastUsedAt: 'Never',
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setApiKeys((prev) => [newKey, ...prev]);
    addToast({ type: 'success', title: 'API Key Created', description: `Key: ${name}` });
  };

  const revokeApiKey = (id: string) => {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)));
    addToast({ type: 'info', title: 'API Key Revoked' });
  };

  // Webhooks
  const addWebhook = (url: string, events: string[]) => {
    const newWh: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url,
      events,
      status: 'active',
      lastDelivery: new Date().toISOString(),
      successRate: 100
    };
    setWebhooks((prev) => [newWh, ...prev]);
    addToast({ type: 'success', title: 'Webhook Endpoint Registered', description: url });
  };

  // CSV Import simulation with duplicate detection
  const importLeads = (newLeadsData: Partial<Lead>[]) => {
    let addedCount = 0;
    let duplicateCount = 0;
    const leadsToAdd: Lead[] = [];

    newLeadsData.forEach((item) => {
      const emailLower = (item.email || '').toLowerCase().trim();
      const phoneClean = (item.phone || '').replace(/[^0-9]/g, '');

      // Duplicate detection against existing leads & contacts
      const isDuplicate = leads.some(
        (l) => l.email.toLowerCase().trim() === emailLower || (phoneClean && l.phone.replace(/[^0-9]/g, '') === phoneClean)
      );

      if (isDuplicate) {
        duplicateCount++;
      } else {
        const lead: Lead = {
          id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          firstName: item.firstName || 'Unknown',
          lastName: item.lastName || 'Contact',
          email: item.email || `contact${Date.now()}@example.com`,
          phone: item.phone || '+1 555-0100',
          companyName: item.companyName || 'Prospective Enterprise',
          title: item.title || 'Director',
          source: (item.source as Lead['source']) || 'Website Inbound',
          status: 'New',
          score: item.score || Math.floor(Math.random() * 40) + 50,
          assignedTo: currentUser.name,
          assignedUserId: currentUser.id,
          branchId: currentBranchId === 'all' ? 'branch-1' : currentBranchId,
          estimatedValue: item.estimatedValue || 120000,
          notes: ['Imported via bulk CSV pipeline with automatic validation.'],
          tags: ['CSV Import', 'Q3 Batch'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        leadsToAdd.push(lead);
        addedCount++;
      }
    });

    if (leadsToAdd.length > 0) {
      setLeads((prev) => [...leadsToAdd, ...prev]);
      logAuditAction('EXPORT_GENERATED', 'Lead', 'batch-import', 'Bulk CSV Ingestion', undefined, {
        imported: addedCount,
        skippedDuplicates: duplicateCount
      });
    }

    addToast({
      type: 'success',
      title: 'CSV Ingestion Completed',
      description: `Imported ${addedCount} new leads. Detected & skipped ${duplicateCount} duplicate records.`
    });

    return { addedCount, duplicateCount };
  };

  // Products & Quotes operations
  const createQuote = (quoteData: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt'>) => {
    const quoteNum = `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newQuote: Quote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      quoteNumber: quoteNum,
      createdAt: new Date().toISOString()
    };
    setQuotes((prev) => [newQuote, ...prev]);
    logAuditAction('DEAL_CREATED', 'Deal', quoteData.dealId, `Quote ${quoteNum} (${quoteData.companyName})`, undefined, {
      grandTotal: newQuote.grandTotal,
      itemsCount: newQuote.items.length
    });
    addToast({
      type: 'success',
      title: `Quote Generated (${quoteNum})`,
      description: `Commercial proposal for $${newQuote.grandTotal.toLocaleString()} registered.`
    });
    return newQuote;
  };

  // Communications operations (Email, Call, SMS, WhatsApp)
  const sendCommunicationMessage = (msgData: Omit<CommunicationMessage, 'id' | 'timestamp'>) => {
    const newMsg: CommunicationMessage = {
      ...msgData,
      id: `comm-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setCommunications((prev) => [newMsg, ...prev]);

    // Update lead notes if entity is lead
    if (msgData.entityType === 'lead') {
      const summaryNote = `[${msgData.channel.toUpperCase()}] ${msgData.subject || msgData.callDisposition || 'Message'}: ${msgData.body.slice(0, 100)}...`;
      addLeadNote(msgData.entityId, summaryNote);
    }

    logAuditAction('LEAD_UPDATED', 'Lead', msgData.entityId, msgData.entityName, undefined, {
      channel: msgData.channel,
      recipient: msgData.recipient
    });

    addToast({
      type: 'success',
      title: `${msgData.channel.toUpperCase()} Dispatched`,
      description: `Sent to ${msgData.recipient}`
    });

    return newMsg;
  };

  // Dynamic Custom Fields
  const addCustomField = (fieldData: Omit<CustomFieldDefinition, 'id'>) => {
    const newField: CustomFieldDefinition = {
      ...fieldData,
      id: `cf-${Date.now()}`
    };
    setCustomFields((prev) => [...prev, newField]);
    addToast({
      type: 'success',
      title: 'Custom Field Defined',
      description: `Attribute "${newField.label}" added to ${newField.targetEntity} schema.`
    });
    return newField;
  };

  // Live REST API Engine simulation for mobile app integration
  const executeApiRequest = async (
    endpoint: ApiEndpointDef,
    params?: Record<string, string>,
    body?: Record<string, unknown>,
    authKey?: string
  ): Promise<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
    durationMs: number;
  }> => {
    const start = performance.now();
    await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 80) + 40)); // network latency simulation

    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Powered-By': 'Fastify 4.28 / Nexus Monolith',
      'X-RateLimit-Limit': '1000',
      'X-RateLimit-Remaining': '994',
      'X-RateLimit-Reset': '1758787200',
      'X-Branch-Scope': currentBranchId,
      'X-Request-Id': `req_${Date.now()}`
    };

    if (endpoint.requiresAuth && (!authKey || authKey.trim() === '')) {
      return {
        status: 401,
        statusText: 'Unauthorized',
        headers,
        body: {
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Missing Bearer API token. Pass Authorization: Bearer <API_KEY> header.',
            requestId: headers['X-Request-Id']
          }
        },
        durationMs: Math.round(performance.now() - start)
      };
    }

    // Dynamic execution against live state
    if (endpoint.path === '/api/v1/leads' && endpoint.method === 'GET') {
      const statusFilter = params?.status;
      const minScore = params?.minScore ? Number(params.minScore) : 0;
      const resultLeads = filteredLeads.filter(
        (l) => (!statusFilter || l.status === statusFilter) && l.score >= minScore
      );
      return {
        status: 200,
        statusText: 'OK',
        headers,
        body: {
          success: true,
          data: resultLeads,
          pagination: {
            total: resultLeads.length,
            page: 1,
            limit: 20,
            totalPages: Math.ceil(resultLeads.length / 20) || 1
          }
        },
        durationMs: Math.round(performance.now() - start)
      };
    }

    if (endpoint.path === '/api/v1/leads' && endpoint.method === 'POST') {
      const payload = body || endpoint.sampleRequestBody || {};
      const newLeadId = `lead-${Date.now()}`;
      const newLeadItem: Lead = {
        id: newLeadId,
        firstName: (payload.firstName as string) || 'Mobile',
        lastName: (payload.lastName as string) || 'Lead',
        email: (payload.email as string) || `app_${Date.now()}@example.com`,
        phone: (payload.phone as string) || '+1 (555) 019-9922',
        companyName: (payload.companyName as string) || 'Mobile Ingested Corp',
        title: (payload.title as string) || 'VP Technology',
        source: (payload.source as Lead['source']) || 'Website Inbound',
        status: 'New',
        score: Math.floor(Math.random() * 25) + 75,
        assignedTo: currentUser.name,
        assignedUserId: currentUser.id,
        branchId: currentBranchId === 'all' ? 'branch-1' : currentBranchId,
        estimatedValue: Number(payload.estimatedValue) || 150000,
        notes: ['Ingested via REST API endpoint /api/v1/leads.'],
        tags: ['REST API Ingest', 'Mobile App'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setLeads((prev) => [newLeadItem, ...prev]);
      logAuditAction('LEAD_CREATED', 'Lead', newLeadId, `${newLeadItem.firstName} ${newLeadItem.lastName}`, undefined, {
        channel: 'REST_API',
        sourceIp: '192.168.1.15'
      });
      return {
        status: 201,
        statusText: 'Created',
        headers,
        body: {
          success: true,
          data: newLeadItem,
          auditId: `aud-${Date.now()}`
        },
        durationMs: Math.round(performance.now() - start)
      };
    }

    if (endpoint.path === '/api/v1/deals' && endpoint.method === 'GET') {
      return {
        status: 200,
        statusText: 'OK',
        headers,
        body: {
          success: true,
          data: filteredDeals,
          totalPipelineValue: filteredDeals.reduce((sum, d) => sum + d.value, 0)
        },
        durationMs: Math.round(performance.now() - start)
      };
    }

    if (endpoint.path === '/api/v1/auth/token' && endpoint.method === 'POST') {
      return {
        status: 200,
        statusText: 'OK',
        headers,
        body: {
          accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ userId: currentUser.id, role: currentUser.role }))}.sig`,
          tokenType: 'Bearer',
          expiresIn: 86400,
          user: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role
          },
          scopes: ['leads:read', 'leads:write', 'deals:read', 'deals:write', 'activities:write']
        },
        durationMs: Math.round(performance.now() - start)
      };
    }

    // Default sample execution
    return {
      status: endpoint.sampleResponse.status,
      statusText: endpoint.sampleResponse.status === 200 ? 'OK' : 'Created',
      headers,
      body: endpoint.sampleResponse.body,
      durationMs: Math.round(performance.now() - start)
    };
  };

  const exportLeadsCsv = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Company', 'Email', 'Phone', 'Title', 'Status', 'Score', 'Est Value', 'Assigned To'];
    const rows = filteredLeads.map((l) => [
      l.id,
      l.firstName,
      l.lastName,
      `"${l.companyName}"`,
      l.email,
      l.phone,
      `"${l.title}"`,
      l.status,
      l.score,
      l.estimatedValue,
      `"${l.assignedTo}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus_crm_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditAction('EXPORT_GENERATED', 'Lead', 'export-csv', 'Leads CSV Export', undefined, { count: filteredLeads.length });

    addToast({
      type: 'info',
      title: 'CSV Export Initiated',
      description: `Exported ${filteredLeads.length} leads in compliance with audit policy.`
    });
  };

  return (
    <CrmContext.Provider
      value={{
        branches,
        currentBranchId,
        setCurrentBranchId,
        currentUser,
        setCurrentUser,
        availableUsers,
        setUserRole,
        activeTab,
        setActiveTab,
        leads,
        filteredLeads,
        addLead,
        updateLeadStatus,
        assignLead,
        convertLead,
        addLeadNote,
        companies,
        contacts,
        addCompany,
        addContact,
        stages,
        deals,
        filteredDeals,
        addDeal,
        moveDealStage,
        activities,
        filteredActivities,
        addActivity,
        toggleActivityStatus,
        deleteActivity,
        workflows,
        workflowRuns,
        toggleWorkflowActive,
        triggerManualWorkflowRun,
        auditLogs,
        logAuditAction,
        apiKeys,
        createApiKey,
        revokeApiKey,
        webhooks,
        addWebhook,
        products,
        quotes,
        createQuote,
        communications,
        sendCommunicationMessage,
        customFields,
        addCustomField,
        apiEndpoints,
        executeApiRequest,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        searchQuery,
        setSearchQuery,
        importLeads,
        exportLeadsCsv,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
