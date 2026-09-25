import {
  Branch,
  User,
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
  Product,
  Quote,
  CommunicationMessage,
  CustomFieldDefinition,
  ApiEndpointDef
} from '../types/crm';

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'branch-1', name: 'Global HQ — New York', code: 'NYC-HQ', city: 'New York', country: 'United States', currency: 'USD', leadCount: 42 },
  { id: 'branch-2', name: 'EMEA Regional Hub — London', code: 'LON-EMEA', city: 'London', country: 'United Kingdom', currency: 'GBP', leadCount: 28 },
  { id: 'branch-3', name: 'APAC Growth Center — Singapore', code: 'SGP-APAC', city: 'Singapore', country: 'Singapore', currency: 'USD', leadCount: 19 },
  { id: 'branch-4', name: 'Americas West — San Francisco', code: 'SFO-WEST', city: 'San Francisco', country: 'United States', currency: 'USD', leadCount: 31 },
];

export const INITIAL_USERS: User[] = [
  { id: 'usr-1', name: 'Anandhu Sajan', email: 'anandhusajan.com@gmail.com', role: 'Super Admin', branchId: 'branch-1', department: 'Executive Management' },
  { id: 'usr-2', name: 'Elena Rostova', email: 'elena.rostova@nexus-crm.internal', role: 'Branch Manager', branchId: 'branch-2', department: 'Enterprise Sales' },
  { id: 'usr-3', name: 'Marcus Vance', email: 'marcus.v@nexus-crm.internal', role: 'Sales Executive', branchId: 'branch-1', department: 'Strategic Accounts' },
  { id: 'usr-4', name: 'Priya Sharma', email: 'priya.s@nexus-crm.internal', role: 'Sales Executive', branchId: 'branch-3', department: 'Growth Accounts' },
  { id: 'usr-5', name: 'Lucas Meyer', email: 'lucas.m@nexus-crm.internal', role: 'Viewer', branchId: 'branch-4', department: 'Finance & Auditing' },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'stage-1', name: '1. Qualification', order: 1, probability: 20, color: '#64748b' },
  { id: 'stage-2', name: '2. Discovery & Needs', order: 2, probability: 40, color: '#0284c7' },
  { id: 'stage-3', name: '3. Proposal & Architecture', order: 3, probability: 65, color: '#7c3aed' },
  { id: 'stage-4', name: '4. Executive Negotiation', order: 4, probability: 85, color: '#ea580c' },
  { id: 'stage-5', name: '5. Closed Won', order: 5, probability: 100, color: '#16a34a', isWon: true },
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Apex Logistics Global',
    domain: 'apexlogistics.io',
    industry: 'Freight & Supply Chain',
    size: '1,000 - 5,000 employees',
    annualRevenue: 450000000,
    phone: '+1 (212) 555-0199',
    city: 'New York',
    country: 'USA',
    branchId: 'branch-1',
    dealsCount: 2,
    contactsCount: 2,
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'comp-2',
    name: 'BioGenesis Pharmaceuticals',
    domain: 'biogenesis-labs.com',
    industry: 'Biotechnology & Life Sciences',
    size: '500 - 1,000 employees',
    annualRevenue: 120000000,
    phone: '+44 20 7946 0912',
    city: 'London',
    country: 'UK',
    branchId: 'branch-2',
    dealsCount: 1,
    contactsCount: 1,
    createdAt: '2026-08-14T11:20:00Z'
  },
  {
    id: 'comp-3',
    name: 'OmniVolt Renewable Energy',
    domain: 'omnivolt-energy.de',
    industry: 'CleanTech & Utilities',
    size: '250 - 500 employees',
    annualRevenue: 85000000,
    phone: '+49 30 1234567',
    city: 'Berlin',
    country: 'Germany',
    branchId: 'branch-2',
    dealsCount: 1,
    contactsCount: 2,
    createdAt: '2026-08-20T08:15:00Z'
  },
  {
    id: 'comp-4',
    name: 'CloudScale Infrastructure',
    domain: 'cloudscale.ai',
    industry: 'Cloud Computing & AI',
    size: '100 - 250 employees',
    annualRevenue: 42000000,
    phone: '+1 (415) 555-8392',
    city: 'San Francisco',
    country: 'USA',
    branchId: 'branch-4',
    dealsCount: 1,
    contactsCount: 1,
    createdAt: '2026-09-01T14:30:00Z'
  },
  {
    id: 'comp-5',
    name: 'Finovate Capital Corp',
    domain: 'finovate.sg',
    industry: 'Financial Technology',
    size: '500 - 1,000 employees',
    annualRevenue: 210000000,
    phone: '+65 6789 0123',
    city: 'Singapore',
    country: 'Singapore',
    branchId: 'branch-3',
    dealsCount: 1,
    contactsCount: 1,
    createdAt: '2026-09-05T09:00:00Z'
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cont-1',
    firstName: 'Julian',
    lastName: 'Vanderbilt',
    email: 'j.vanderbilt@apexlogistics.io',
    phone: '+1 (212) 555-0144',
    title: 'Chief Technology Officer',
    companyId: 'comp-1',
    companyName: 'Apex Logistics Global',
    isPrimary: true,
    branchId: 'branch-1',
    lastContacted: '2026-09-22T14:00:00Z',
    createdAt: '2026-08-10T10:15:00Z'
  },
  {
    id: 'cont-2',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@apexlogistics.io',
    phone: '+1 (212) 555-0182',
    title: 'VP of Commercial Operations',
    companyId: 'comp-1',
    companyName: 'Apex Logistics Global',
    isPrimary: false,
    branchId: 'branch-1',
    lastContacted: '2026-09-18T11:00:00Z',
    createdAt: '2026-08-12T13:45:00Z'
  },
  {
    id: 'cont-3',
    firstName: 'Dr. Arthur',
    lastName: 'Pendleton',
    email: 'arthur.p@biogenesis-labs.com',
    phone: '+44 20 7946 0990',
    title: 'Director of Clinical Systems',
    companyId: 'comp-2',
    companyName: 'BioGenesis Pharmaceuticals',
    isPrimary: true,
    branchId: 'branch-2',
    lastContacted: '2026-09-24T09:30:00Z',
    createdAt: '2026-08-14T11:30:00Z'
  },
  {
    id: 'cont-4',
    firstName: 'Greta',
    lastName: 'Weber',
    email: 'g.weber@omnivolt-energy.de',
    phone: '+49 30 1234568',
    title: 'Head of Grid Modernization',
    companyId: 'comp-3',
    companyName: 'OmniVolt Renewable Energy',
    isPrimary: true,
    branchId: 'branch-2',
    lastContacted: '2026-09-21T16:00:00Z',
    createdAt: '2026-08-20T08:30:00Z'
  },
  {
    id: 'cont-5',
    firstName: 'Kieran',
    lastName: 'Nakamura',
    email: 'kieran@cloudscale.ai',
    phone: '+1 (415) 555-8399',
    title: 'Chief Information Security Officer',
    companyId: 'comp-4',
    companyName: 'CloudScale Infrastructure',
    isPrimary: true,
    branchId: 'branch-4',
    lastContacted: '2026-09-23T17:15:00Z',
    createdAt: '2026-09-01T14:45:00Z'
  },
  {
    id: 'cont-6',
    firstName: 'Mei-Ling',
    lastName: 'Tan',
    email: 'meiling.tan@finovate.sg',
    phone: '+65 6789 0199',
    title: 'Managing Director, Risk & Compliance',
    companyId: 'comp-5',
    companyName: 'Finovate Capital Corp',
    isPrimary: true,
    branchId: 'branch-3',
    lastContacted: '2026-09-20T10:45:00Z',
    createdAt: '2026-09-05T09:15:00Z'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    firstName: 'Dominic',
    lastName: 'Sterling',
    email: 'd.sterling@aetherdefense.com',
    phone: '+1 (703) 555-0188',
    companyName: 'Aether Defense Systems',
    title: 'VP Procurement & IT',
    source: 'Website Inbound',
    status: 'Qualified',
    score: 94,
    assignedTo: 'Marcus Vance',
    assignedUserId: 'usr-3',
    branchId: 'branch-1',
    estimatedValue: 240000,
    notes: [
      'Submitted RFP form requesting on-premise CRM deployment with strict data sovereignty.',
      'Needs compliance with NIST 800-171 and zero external cloud data transit.'
    ],
    tags: ['Defense', 'High Value', 'On-Premises Required'],
    createdAt: '2026-09-23T11:20:00Z',
    updatedAt: '2026-09-24T15:10:00Z'
  },
  {
    id: 'lead-102',
    firstName: 'Ingrid',
    lastName: 'Holmstrom',
    email: 'i.holmstrom@nordictelecom.se',
    phone: '+46 8 123 4567',
    companyName: 'Nordic Telecom AB',
    title: 'Director of Customer Experience',
    source: 'Partner Referral',
    status: 'Proposal',
    score: 88,
    assignedTo: 'Elena Rostova',
    assignedUserId: 'usr-2',
    branchId: 'branch-2',
    estimatedValue: 185000,
    notes: [
      'Introduced by Coolify local hosting partner.',
      'Evaluating migration from Salesforce due to high seat pricing.'
    ],
    tags: ['Telecom', 'Coolify Partner', 'Replacement'],
    createdAt: '2026-09-20T09:40:00Z',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'lead-103',
    firstName: 'Wei',
    lastName: 'Zhang',
    email: 'w.zhang@singaporerailways.gov.sg',
    phone: '+65 6222 3344',
    companyName: 'Singapore Transit Authority',
    title: 'Head of Enterprise Architecture',
    source: 'Trade Show / Event',
    status: 'Contacted',
    score: 76,
    assignedTo: 'Priya Sharma',
    assignedUserId: 'usr-4',
    branchId: 'branch-3',
    estimatedValue: 310000,
    notes: [
      'Met at TechWeek Asia 2026 Singapore booth.',
      'Requested private demo of role-based branch security controls.'
    ],
    tags: ['Public Sector', 'APAC', 'Strict RBAC'],
    createdAt: '2026-09-22T04:15:00Z',
    updatedAt: '2026-09-23T08:30:00Z'
  },
  {
    id: 'lead-104',
    firstName: 'Devon',
    lastName: 'Caldwell',
    email: 'caldwell@summitfin.net',
    phone: '+1 (312) 555-7788',
    companyName: 'Summit Financial Partners',
    title: 'Chief Compliance Officer',
    source: 'Outbound Campaign',
    status: 'New',
    score: 65,
    assignedTo: 'Marcus Vance',
    assignedUserId: 'usr-3',
    branchId: 'branch-1',
    estimatedValue: 95000,
    notes: [
      'Downloaded whitepaper on Self-Hosted Financial CRMs.',
      'Follow-up scheduled for this Friday.'
    ],
    tags: ['Fintech', 'Compliance'],
    createdAt: '2026-09-24T18:00:00Z',
    updatedAt: '2026-09-24T18:00:00Z'
  },
  {
    id: 'lead-105',
    firstName: 'Clara',
    lastName: 'Moreau',
    email: 'c.moreau@lyonaero.fr',
    phone: '+33 4 72 00 11 22',
    companyName: 'Lyon Aerospace Group',
    title: 'Supply Chain Operations Lead',
    source: 'Direct Organic',
    status: 'Negotiation',
    score: 91,
    assignedTo: 'Elena Rostova',
    assignedUserId: 'usr-2',
    branchId: 'branch-2',
    estimatedValue: 420000,
    notes: [
      'Security audit completed successfully with our IT architect.',
      'Final contract review pending approval from Lyon board.'
    ],
    tags: ['Aerospace', 'EU Data Sovereign', 'Enterprise Contract'],
    createdAt: '2026-09-15T13:20:00Z',
    updatedAt: '2026-09-25T07:10:00Z'
  },
  {
    id: 'lead-106',
    firstName: 'Aaron',
    lastName: 'Kaufman',
    email: 'akaufman@pinnaclehealth.org',
    phone: '+1 (617) 555-9201',
    companyName: 'Pinnacle Health Systems',
    title: 'VP Patient Records & CRM',
    source: 'Website Inbound',
    status: 'Won',
    score: 98,
    assignedTo: 'Anandhu Sajan',
    assignedUserId: 'usr-1',
    branchId: 'branch-1',
    estimatedValue: 560000,
    notes: [
      'Master Services Agreement executed.',
      'Deployment commencing on local hospital cluster.'
    ],
    tags: ['Healthcare', 'HIPAA Local', 'Key Account'],
    createdAt: '2026-08-28T16:00:00Z',
    updatedAt: '2026-09-24T21:00:00Z'
  },
  {
    id: 'lead-107',
    firstName: 'Liam',
    lastName: 'O\'Connor',
    email: 'liam@dublinmedtech.ie',
    phone: '+353 1 496 0011',
    companyName: 'Dublin MedTech Innovations',
    title: 'Operations Director',
    source: 'Partner Referral',
    status: 'Lost',
    score: 42,
    assignedTo: 'Elena Rostova',
    assignedUserId: 'usr-2',
    branchId: 'branch-2',
    estimatedValue: 60000,
    notes: [
      'Project postponed due to internal reorganization.',
      'Keep in touch for Q2 2027 review.'
    ],
    tags: ['MedTech', 'Budget Delay'],
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-22T14:40:00Z'
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-201',
    title: 'Apex Logistics — Enterprise On-Premise Rollout',
    value: 285000,
    currency: 'USD',
    pipelineId: 'pipe-1',
    stageId: 'stage-4', // Executive Negotiation
    probability: 85,
    expectedCloseDate: '2026-10-15',
    assignedTo: 'Marcus Vance',
    assignedUserId: 'usr-3',
    companyId: 'comp-1',
    companyName: 'Apex Logistics Global',
    contactId: 'cont-1',
    contactName: 'Julian Vanderbilt',
    branchId: 'branch-1',
    products: [
      { id: 'p1', name: 'Nexus CRM Core Platform (Perpetual On-Prem)', quantity: 1, unitPrice: 195000 },
      { id: 'p2', name: 'Coolify Cluster Deployment Architecture Pack', quantity: 1, unitPrice: 45000 },
      { id: 'p3', name: '24/7 Dedicated L3 Technical Support (Year 1)', quantity: 1, unitPrice: 45000 }
    ],
    notes: 'Legal teams reviewing warranty liability and SLA clause 12.3. Ready for CFO signoff.',
    stageHistory: [
      { fromStage: '1. Qualification', toStage: '2. Discovery & Needs', changedAt: '2026-08-25T11:00:00Z', changedBy: 'Marcus Vance' },
      { fromStage: '2. Discovery & Needs', toStage: '3. Proposal & Architecture', changedAt: '2026-09-08T15:30:00Z', changedBy: 'Marcus Vance' },
      { fromStage: '3. Proposal & Architecture', toStage: '4. Executive Negotiation', changedAt: '2026-09-22T09:15:00Z', changedBy: 'Marcus Vance' }
    ],
    createdAt: '2026-08-15T14:00:00Z',
    updatedAt: '2026-09-22T09:15:00Z'
  },
  {
    id: 'deal-202',
    title: 'BioGenesis — Clinical Research CRM & Audit Suite',
    value: 190000,
    currency: 'GBP',
    pipelineId: 'pipe-1',
    stageId: 'stage-3', // Proposal & Architecture
    probability: 65,
    expectedCloseDate: '2026-11-01',
    assignedTo: 'Elena Rostova',
    assignedUserId: 'usr-2',
    companyId: 'comp-2',
    companyName: 'BioGenesis Pharmaceuticals',
    contactId: 'cont-3',
    contactName: 'Dr. Arthur Pendleton',
    branchId: 'branch-2',
    products: [
      { id: 'p1', name: 'Nexus Compliance & Immutable Audit Edition', quantity: 1, unitPrice: 140000 },
      { id: 'p2', name: '21 CFR Part 11 Electronic Signature Integration', quantity: 1, unitPrice: 50000 }
    ],
    notes: 'Custom clinical workflow validation demo scheduled with compliance committee.',
    stageHistory: [
      { fromStage: '1. Qualification', toStage: '2. Discovery & Needs', changedAt: '2026-08-30T10:00:00Z', changedBy: 'Elena Rostova' },
      { fromStage: '2. Discovery & Needs', toStage: '3. Proposal & Architecture', changedAt: '2026-09-16T14:20:00Z', changedBy: 'Elena Rostova' }
    ],
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-09-16T14:20:00Z'
  },
  {
    id: 'deal-203',
    title: 'OmniVolt — Smart Grid Field Operations Licensing',
    value: 145000,
    currency: 'EUR',
    pipelineId: 'pipe-1',
    stageId: 'stage-2', // Discovery & Needs
    probability: 40,
    expectedCloseDate: '2026-11-20',
    assignedTo: 'Elena Rostova',
    assignedUserId: 'usr-2',
    companyId: 'comp-3',
    companyName: 'OmniVolt Renewable Energy',
    contactId: 'cont-4',
    contactName: 'Greta Weber',
    branchId: 'branch-2',
    products: [
      { id: 'p1', name: 'Nexus Field Service & Territory Module', quantity: 1, unitPrice: 110000 },
      { id: 'p2', name: 'Telemetry Webhook Ingestion Engine', quantity: 1, unitPrice: 35000 }
    ],
    notes: 'Technical discovery with Berlin infrastructure engineers underway.',
    stageHistory: [
      { fromStage: '1. Qualification', toStage: '2. Discovery & Needs', changedAt: '2026-09-12T16:00:00Z', changedBy: 'Elena Rostova' }
    ],
    createdAt: '2026-08-28T09:00:00Z',
    updatedAt: '2026-09-12T16:00:00Z'
  },
  {
    id: 'deal-204',
    title: 'Finovate — Cross-Border Wealth Management CRM',
    value: 320000,
    currency: 'USD',
    pipelineId: 'pipe-1',
    stageId: 'stage-5', // Closed Won
    probability: 100,
    expectedCloseDate: '2026-09-18',
    assignedTo: 'Priya Sharma',
    assignedUserId: 'usr-4',
    companyId: 'comp-5',
    companyName: 'Finovate Capital Corp',
    contactId: 'cont-6',
    contactName: 'Mei-Ling Tan',
    branchId: 'branch-3',
    products: [
      { id: 'p1', name: 'Nexus Multi-Tenant Financial Institutional License', quantity: 1, unitPrice: 260000 },
      { id: 'p2', name: 'PostgreSQL Encryption at Rest Configuration Service', quantity: 1, unitPrice: 60000 }
    ],
    notes: 'Signed and payment cleared. Singapore instance provisioned via Docker and Coolify.',
    stageHistory: [
      { fromStage: '3. Proposal & Architecture', toStage: '4. Executive Negotiation', changedAt: '2026-09-02T08:00:00Z', changedBy: 'Priya Sharma' },
      { fromStage: '4. Executive Negotiation', toStage: '5. Closed Won', changedAt: '2026-09-18T11:30:00Z', changedBy: 'Priya Sharma' }
    ],
    createdAt: '2026-08-10T08:00:00Z',
    updatedAt: '2026-09-18T11:30:00Z'
  },
  {
    id: 'deal-205',
    title: 'CloudScale — SRE & Customer Health Tracking',
    value: 115000,
    currency: 'USD',
    pipelineId: 'pipe-1',
    stageId: 'stage-1', // Qualification
    probability: 20,
    expectedCloseDate: '2026-12-05',
    assignedTo: 'Lucas Meyer',
    assignedUserId: 'usr-5',
    companyId: 'comp-4',
    companyName: 'CloudScale Infrastructure',
    contactId: 'cont-5',
    contactName: 'Kieran Nakamura',
    branchId: 'branch-4',
    products: [
      { id: 'p1', name: 'Nexus Developer & API Automation Pack', quantity: 1, unitPrice: 85000 },
      { id: 'p2', name: 'Custom Supabase Realtime Extension', quantity: 1, unitPrice: 30000 }
    ],
    notes: 'Initial technical call completed. Kieran evaluating our webhook delivery rate limits.',
    stageHistory: [],
    createdAt: '2026-09-10T15:00:00Z',
    updatedAt: '2026-09-10T15:00:00Z'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'meeting',
    subject: 'Executive Security Review & SLA Sign-off',
    description: 'Final review of self-hosted deployment architecture with Julian Vanderbilt (CTO) and legal counsel.',
    dueDate: '2026-09-26T14:00:00Z',
    priority: 'urgent',
    status: 'pending',
    entityType: 'deal',
    entityId: 'deal-201',
    entityTitle: 'Apex Logistics — Enterprise On-Premise Rollout',
    assignedTo: 'Marcus Vance',
    createdAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'act-2',
    type: 'call',
    subject: 'Follow-up on RFP Submission',
    description: 'Confirm attendance of Aether Defense VP of Procurement on next Tuesday\'s technical briefing.',
    dueDate: '2026-09-25T16:30:00Z',
    priority: 'high',
    status: 'pending',
    entityType: 'lead',
    entityId: 'lead-101',
    entityTitle: 'Dominic Sterling (Aether Defense)',
    assignedTo: 'Marcus Vance',
    createdAt: '2026-09-24T11:00:00Z'
  },
  {
    id: 'act-3',
    type: 'task',
    subject: 'Draft Singapore Transit Custom RBAC Scope Sheet',
    description: 'Provide breakdown of Branch Manager vs Station Supervisor scopes for government tender submission.',
    dueDate: '2026-09-27T08:00:00Z',
    priority: 'medium',
    status: 'pending',
    entityType: 'lead',
    entityId: 'lead-103',
    entityTitle: 'Wei Zhang (Singapore Transit Authority)',
    assignedTo: 'Priya Sharma',
    createdAt: '2026-09-23T09:00:00Z'
  },
  {
    id: 'act-4',
    type: 'email',
    subject: 'Send Formal Proposal v2.4 to BioGenesis',
    description: 'Updated with 21 CFR Part 11 e-signature add-on and local backup encryption scheme.',
    dueDate: '2026-09-24T12:00:00Z',
    priority: 'high',
    status: 'completed',
    entityType: 'deal',
    entityId: 'deal-202',
    entityTitle: 'BioGenesis — Clinical Research CRM & Audit Suite',
    assignedTo: 'Elena Rostova',
    createdAt: '2026-09-20T14:00:00Z'
  },
  {
    id: 'act-5',
    type: 'note',
    subject: 'Finovate Post-Sale Kickoff Protocol',
    description: 'Primary deployment keys delivered to CISO. PostgreSQL cluster successfully synced with secondary standby.',
    dueDate: '2026-09-19T10:00:00Z',
    priority: 'low',
    status: 'completed',
    entityType: 'deal',
    entityId: 'deal-204',
    entityTitle: 'Finovate — Cross-Border Wealth Management CRM',
    assignedTo: 'Priya Sharma',
    createdAt: '2026-09-19T10:00:00Z'
  }
];

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    title: 'High-Score Inbound Lead Auto-Routing',
    description: 'When an inbound lead is scored >= 85, immediately notify branch sales lead and create high-priority follow-up call.',
    triggerType: 'HIGH_SCORE_LEAD',
    conditions: [
      { field: 'score', operator: 'greater_than', value: 84 },
      { field: 'source', operator: 'equals', value: 'Website Inbound' }
    ],
    actions: [
      { type: 'assign_user', params: { role: 'Branch Manager' } },
      { type: 'create_task', params: { title: 'Call high-value inbound lead within 2 hours', priority: 'urgent' } },
      { type: 'notify_manager', params: { channel: 'In-App & Email' } }
    ],
    isActive: true,
    lastRun: '2026-09-24T18:12:00Z',
    runCount: 142
  },
  {
    id: 'wf-2',
    title: 'Deal Won Onboarding & Provisioning Pipeline',
    description: 'When deal stage transitions to Closed Won, trigger Coolify webhook, create technical kickoff task, and notify finance.',
    triggerType: 'DEAL_STAGE_CHANGED',
    conditions: [
      { field: 'stage_id', operator: 'equals', value: 'stage-5' }
    ],
    actions: [
      { type: 'trigger_webhook', params: { endpoint: 'https://coolify.internal/api/deploy-tenant' } },
      { type: 'create_task', params: { title: 'Schedule Technical Deployment Kickoff', priority: 'high' } },
      { type: 'notify_manager', params: { channel: 'Executive Management' } }
    ],
    isActive: true,
    lastRun: '2026-09-18T11:32:00Z',
    runCount: 38
  },
  {
    id: 'wf-3',
    title: 'Stale Lead Re-engagement Warning',
    description: 'Flag leads with no touchpoint for 7 days and reassign to active team member if unresolved.',
    triggerType: 'TASK_OVERDUE',
    conditions: [
      { field: 'days_inactive', operator: 'greater_than', value: 7 }
    ],
    actions: [
      { type: 'send_email', params: { template: 'reengagement_followup_v1' } },
      { type: 'create_task', params: { title: 'Review lead viability before archiving', priority: 'medium' } }
    ],
    isActive: false,
    lastRun: '2026-09-20T04:00:00Z',
    runCount: 96
  }
];

export const INITIAL_WORKFLOW_RUNS: WorkflowRun[] = [
  {
    id: 'run-901',
    workflowId: 'wf-1',
    workflowTitle: 'High-Score Inbound Lead Auto-Routing',
    status: 'success',
    entityId: 'lead-101',
    entityName: 'Dominic Sterling (Aether Defense)',
    triggeredAt: '2026-09-23T11:21:00Z',
    durationMs: 142,
    stepResults: [
      'Condition evaluated: score (94) > 84 [PASSED]',
      'Condition evaluated: source ("Website Inbound") [PASSED]',
      'Action: Lead assigned to Marcus Vance (Strategic Accounts)',
      'Action: Task "Call high-value inbound lead" created with priority: urgent',
      'Action: In-app notification dispatched to branch manager'
    ]
  },
  {
    id: 'run-902',
    workflowId: 'wf-2',
    workflowTitle: 'Deal Won Onboarding & Provisioning Pipeline',
    status: 'success',
    entityId: 'deal-204',
    entityName: 'Finovate — Cross-Border Wealth Management CRM',
    triggeredAt: '2026-09-18T11:31:00Z',
    durationMs: 380,
    stepResults: [
      'Condition evaluated: stage_id == stage-5 (Closed Won) [PASSED]',
      'Action: Webhook dispatched to Coolify tenant orchestrator (HTTP 200 OK)',
      'Action: Task "Schedule Technical Deployment Kickoff" registered',
      'Action: Executive notification dispatched to Anandhu Sajan'
    ]
  },
  {
    id: 'run-903',
    workflowId: 'wf-1',
    workflowTitle: 'High-Score Inbound Lead Auto-Routing',
    status: 'success',
    entityId: 'lead-106',
    entityName: 'Aaron Kaufman (Pinnacle Health Systems)',
    triggeredAt: '2026-08-28T16:01:00Z',
    durationMs: 110,
    stepResults: [
      'Condition evaluated: score (98) > 84 [PASSED]',
      'Action: Lead assigned to Anandhu Sajan (Executive)',
      'Action: High-priority activity spawned'
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-801',
    action: 'LEAD_CONVERTED',
    entityType: 'Lead',
    entityId: 'lead-106',
    entityName: 'Aaron Kaufman (Pinnacle Health)',
    actorName: 'Anandhu Sajan',
    actorEmail: 'anandhusajan.com@gmail.com',
    actorRole: 'Super Admin',
    ipAddress: '192.168.1.10',
    timestamp: '2026-09-24T21:00:14Z',
    oldValues: { status: 'Qualified', isLead: true },
    newValues: { status: 'Won', convertedCompanyId: 'comp-pinnacle', convertedContactId: 'cont-kaufman', convertedDealId: 'deal-pinnacle-core' }
  },
  {
    id: 'aud-802',
    action: 'DEAL_STAGE_CHANGED',
    entityType: 'Deal',
    entityId: 'deal-201',
    entityName: 'Apex Logistics — Enterprise On-Premise Rollout',
    actorName: 'Marcus Vance',
    actorEmail: 'marcus.v@nexus-crm.internal',
    actorRole: 'Sales Executive',
    ipAddress: '192.168.1.42',
    timestamp: '2026-09-22T09:15:32Z',
    oldValues: { stageId: 'stage-3', probability: 65, stageName: '3. Proposal & Architecture' },
    newValues: { stageId: 'stage-4', probability: 85, stageName: '4. Executive Negotiation' }
  },
  {
    id: 'aud-803',
    action: 'WORKFLOW_TRIGGERED',
    entityType: 'Workflow',
    entityId: 'wf-1',
    entityName: 'High-Score Inbound Lead Auto-Routing',
    actorName: 'System Automation Worker (BullMQ)',
    actorEmail: 'worker@crm.internal',
    actorRole: 'Super Admin',
    ipAddress: '127.0.0.1',
    timestamp: '2026-09-23T11:21:00Z',
    oldValues: { queueState: 'waiting' },
    newValues: { queueState: 'completed', stepsExecuted: 3, latencyMs: 142 }
  },
  {
    id: 'aud-804',
    action: 'USER_ROLE_UPDATED',
    entityType: 'User',
    entityId: 'usr-3',
    entityName: 'Marcus Vance',
    actorName: 'Anandhu Sajan',
    actorEmail: 'anandhusajan.com@gmail.com',
    actorRole: 'Super Admin',
    ipAddress: '192.168.1.10',
    timestamp: '2026-09-20T14:22:10Z',
    oldValues: { role: 'Sales Executive', scope: 'OWN' },
    newValues: { role: 'Sales Executive', scope: 'TEAM', assignedAccounts: 18 }
  },
  {
    id: 'aud-805',
    action: 'EXPORT_GENERATED',
    entityType: 'Lead',
    entityId: 'bulk-leads-export',
    entityName: 'Q3 Enterprise Lead Pipeline.csv',
    actorName: 'Elena Rostova',
    actorEmail: 'elena.rostova@nexus-crm.internal',
    actorRole: 'Branch Manager',
    ipAddress: '10.0.2.15',
    timestamp: '2026-09-19T16:04:45Z',
    oldValues: {},
    newValues: { recordsExported: 42, branchScope: 'branch-2', format: 'CSV' }
  }
];

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Coolify Webhook Orchestrator',
    prefix: 'nx_live_c7f8...',
    lastUsedAt: '2026-09-24T18:12:00Z',
    createdAt: '2026-08-01T12:00:00Z',
    status: 'active'
  },
  {
    id: 'key-2',
    name: 'Self-Hosted Supabase Sync Service',
    prefix: 'nx_live_9a2b...',
    lastUsedAt: '2026-09-25T04:10:00Z',
    createdAt: '2026-08-15T09:30:00Z',
    status: 'active'
  },
  {
    id: 'key-3',
    name: 'Legacy ETL Importer (Deprecated)',
    prefix: 'nx_live_110e...',
    lastUsedAt: '2026-08-30T10:00:00Z',
    createdAt: '2026-07-10T14:00:00Z',
    status: 'revoked'
  }
];

export const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'wh-1',
    url: 'https://coolify.internal/webhooks/crm-lead-events',
    events: ['lead.created', 'deal.stage_changed', 'deal.won'],
    status: 'active',
    lastDelivery: '2026-09-24T18:12:00Z',
    successRate: 99.8
  },
  {
    id: 'wh-2',
    url: 'https://accounting.internal/api/v1/deal-invoicing',
    events: ['deal.won'],
    status: 'active',
    lastDelivery: '2026-09-18T11:32:00Z',
    successRate: 100.0
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'NX-CORE-ENT',
    name: 'Nexus CRM Enterprise Core License (On-Premise)',
    description: 'Perpetual self-hosted license for unlimited seats with full RBAC and multi-branch tenancy.',
    category: 'Software License',
    unitPrice: 195000,
    currency: 'USD',
    billingFrequency: 'one-time',
    isActive: true
  },
  {
    id: 'prod-2',
    sku: 'NX-COOLIFY-HA',
    name: 'Coolify Multi-Node HA Deployment & Clustering Pack',
    description: 'Zero-downtime clustering architecture for PostgreSQL replication, Redis Sentinel, and BullMQ worker nodes.',
    category: 'Cloud / Hosting',
    unitPrice: 45000,
    currency: 'USD',
    billingFrequency: 'one-time',
    isActive: true
  },
  {
    id: 'prod-3',
    sku: 'NX-SLA-L3-247',
    name: '24/7 Dedicated L3 Technical Support & Hotfix SLA',
    description: 'Guaranteed 15-minute response time for P0 incidents with direct access to core engineering architects.',
    category: 'Support SLA',
    unitPrice: 45000,
    currency: 'USD',
    billingFrequency: 'annual',
    isActive: true
  },
  {
    id: 'prod-4',
    sku: 'NX-COMPL-21CFR',
    name: 'Compliance & Audit Hardening Suite (21 CFR Part 11 / HIPAA)',
    description: 'Tamper-evident cryptographically signed audit logs, field-level encryption at rest, and electronic signatures.',
    category: 'Software License',
    unitPrice: 50000,
    currency: 'USD',
    billingFrequency: 'one-time',
    isActive: true
  },
  {
    id: 'prod-5',
    sku: 'NX-API-SDK-MOB',
    name: 'Nexus Mobile Gateway & External API Suite',
    description: 'REST API endpoints, JWT device pairing, OpenAPI 3.1 contracts, and webhook subscription router.',
    category: 'Software License',
    unitPrice: 30000,
    currency: 'USD',
    billingFrequency: 'one-time',
    isActive: true
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'quote-101',
    quoteNumber: 'QT-2026-0891',
    dealId: 'deal-201',
    dealTitle: 'Apex Logistics — Enterprise On-Premise Rollout',
    companyName: 'Apex Logistics Global',
    contactName: 'Julian Vanderbilt',
    contactEmail: 'j.vanderbilt@apexlogistics.io',
    items: [
      {
        id: 'qi-1',
        productId: 'prod-1',
        productName: 'Nexus CRM Enterprise Core License (On-Premise)',
        quantity: 1,
        unitPrice: 195000,
        discountPct: 0,
        total: 195000
      },
      {
        id: 'qi-2',
        productId: 'prod-2',
        productName: 'Coolify Multi-Node HA Deployment & Clustering Pack',
        quantity: 1,
        unitPrice: 45000,
        discountPct: 0,
        total: 45000
      },
      {
        id: 'qi-3',
        productId: 'prod-3',
        productName: '24/7 Dedicated L3 Technical Support & Hotfix SLA',
        quantity: 1,
        unitPrice: 45000,
        discountPct: 0,
        total: 45000
      }
    ],
    subtotal: 285000,
    discountTotal: 0,
    taxRate: 0.0,
    taxTotal: 0,
    grandTotal: 285000,
    currency: 'USD',
    status: 'presented',
    validUntil: '2026-10-31',
    createdAt: '2026-09-22T09:30:00Z',
    notes: 'Price includes full on-site deployment assistance and local database migration validation.'
  }
];

export const INITIAL_COMMUNICATIONS: CommunicationMessage[] = [
  {
    id: 'comm-1',
    channel: 'email',
    direction: 'outbound',
    subject: 'Enterprise Architecture & SLA Proposal — Apex Logistics Global',
    body: 'Dear Julian,\n\nFollowing our technical review session yesterday, attached is the revised proposal for Nexus CRM deployed within your private Coolify cluster.\n\nKey highlights:\n- Strict on-premise data residency (zero third-party cloud analytics)\n- Fastify API throughput rated at 15,000 req/sec\n- 24/7 dedicated L3 engineering support\n\nPlease let me know if legal requires any modifications to Section 8.',
    sender: 'marcus.v@nexus-crm.internal',
    recipient: 'j.vanderbilt@apexlogistics.io',
    timestamp: '2026-09-24T14:15:00Z',
    status: 'delivered',
    entityType: 'deal',
    entityId: 'deal-201',
    entityName: 'Apex Logistics — Enterprise On-Premise Rollout'
  },
  {
    id: 'comm-2',
    channel: 'call',
    direction: 'outbound',
    subject: 'Contract SLA Review with CTO Julian Vanderbilt',
    body: 'Spoke directly with Julian. He confirmed the IT steering committee approved the local Supabase architecture. Their CISO only asked for confirmation regarding off-site encrypted backup routines.',
    sender: 'Marcus Vance',
    recipient: '+1 (212) 555-0144',
    timestamp: '2026-09-23T16:45:00Z',
    status: 'logged',
    entityType: 'contact',
    entityId: 'cont-1',
    entityName: 'Julian Vanderbilt (Apex Logistics)',
    durationSeconds: 780,
    callDisposition: 'Connected'
  },
  {
    id: 'comm-3',
    channel: 'email',
    direction: 'inbound',
    subject: 'Re: 21 CFR Part 11 Electronic Signature Verification',
    body: 'Hi Elena,\n\nOur clinical audit committee reviewed your audit trail schema in DATABASE.md. The append-only design with old/new values JSONB meets our strict requirements. Could you provide a formal quote for our London labs?\n\nBest regards,\nDr. Arthur Pendleton',
    sender: 'arthur.p@biogenesis-labs.com',
    recipient: 'elena.rostova@nexus-crm.internal',
    timestamp: '2026-09-24T09:20:00Z',
    status: 'read',
    entityType: 'lead',
    entityId: 'lead-102',
    entityName: 'BioGenesis Pharmaceuticals'
  },
  {
    id: 'comm-4',
    channel: 'sms',
    direction: 'outbound',
    body: 'Nexus Alert: Technical deployment kickoff scheduled for Tuesday 10:00 AM UTC. Meeting coordinates sent to email.',
    sender: 'Nexus Mobile Gateway',
    recipient: '+65 6789 0199',
    timestamp: '2026-09-20T11:00:00Z',
    status: 'delivered',
    entityType: 'deal',
    entityId: 'deal-204',
    entityName: 'Finovate Capital Corp'
  }
];

export const INITIAL_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  {
    id: 'cf-1',
    targetEntity: 'lead',
    label: 'Hosting Topology Requirement',
    key: 'hosting_preference',
    fieldType: 'select',
    options: ['Coolify On-Premises', 'Bare-Metal Docker', 'Air-Gapped Private Cloud'],
    required: true
  },
  {
    id: 'cf-2',
    targetEntity: 'lead',
    label: 'Data Sovereignty Region',
    key: 'data_sovereignty',
    fieldType: 'select',
    options: ['US FedRAMP / NIST', 'EU GDPR / Germany', 'Singapore MAS / APAC'],
    required: false
  },
  {
    id: 'cf-3',
    targetEntity: 'deal',
    label: 'Security Clearance Tier',
    key: 'security_clearance',
    fieldType: 'select',
    options: ['Commercial Enterprise', 'Confidential', 'Secret / DoD Compatible'],
    required: false
  },
  {
    id: 'cf-4',
    targetEntity: 'company',
    label: 'VAT / Tax Registration Number',
    key: 'vat_number',
    fieldType: 'text',
    required: false
  }
];

export const API_ENDPOINTS: ApiEndpointDef[] = [
  {
    id: 'ep-1',
    method: 'GET',
    path: '/api/v1/leads',
    summary: 'List Inbound Leads with Branch Scoping',
    description: 'Retrieves leads filtered by status, score threshold, or search keyword. Enforces branch isolation according to authenticated API token.',
    tags: ['Leads'],
    requiresAuth: true,
    sampleQueryParams: {
      status: 'Qualified',
      minScore: '80',
      limit: '20',
      page: '1'
    },
    sampleResponse: {
      status: 200,
      body: {
        success: true,
        data: [
          {
            id: 'lead-101',
            firstName: 'Dominic',
            lastName: 'Sterling',
            companyName: 'Aether Defense Systems',
            email: 'd.sterling@aetherdefense.com',
            score: 94,
            status: 'Qualified',
            estimatedValue: 240000,
            branchId: 'branch-1'
          }
        ],
        pagination: { total: 42, page: 1, limit: 20, totalPages: 3 }
      }
    }
  },
  {
    id: 'ep-2',
    method: 'POST',
    path: '/api/v1/leads',
    summary: 'Create / Ingest Inbound Lead from External App',
    description: 'Receives new leads from mobile app, web landing page, or partner API. Automatically calculates intent score and dispatches BullMQ auto-routing workers.',
    tags: ['Leads'],
    requiresAuth: true,
    sampleRequestBody: {
      firstName: 'Samantha',
      lastName: 'Wong',
      email: 's.wong@hyperion-robotics.com',
      phone: '+1 (415) 555-0992',
      companyName: 'Hyperion Robotics',
      title: 'VP Autonomous Systems',
      source: 'Website Inbound',
      estimatedValue: 180000,
      notes: ['Requested self-hosted deployment demo for mobile robotics team.']
    },
    sampleResponse: {
      status: 201,
      body: {
        success: true,
        data: {
          id: 'lead-108',
          firstName: 'Samantha',
          lastName: 'Wong',
          companyName: 'Hyperion Robotics',
          score: 88,
          status: 'New',
          assignedTo: 'Marcus Vance',
          createdAt: '2026-09-25T06:00:00Z'
        },
        auditId: 'aud-9901'
      }
    }
  },
  {
    id: 'ep-3',
    method: 'POST',
    path: '/api/v1/leads/:id/convert',
    summary: 'Atomically Convert Lead to Account & Deal',
    description: 'Executes relational transition: converts lead into a Company record, Contact record, and Pipeline Deal simultaneously while preserving audit log history.',
    tags: ['Leads', 'Pipeline'],
    requiresAuth: true,
    sampleRequestBody: {
      dealTitle: 'Hyperion Robotics — Enterprise Rollout',
      dealValue: 180000,
      targetStageId: 'stage-2'
    },
    sampleResponse: {
      status: 200,
      body: {
        success: true,
        message: 'Lead converted successfully',
        data: {
          companyId: 'comp-108',
          companyName: 'Hyperion Robotics',
          contactId: 'cont-108',
          contactName: 'Samantha Wong',
          dealId: 'deal-208',
          dealValue: 180000,
          stage: 'Discovery & Needs'
        }
      }
    }
  },
  {
    id: 'ep-4',
    method: 'GET',
    path: '/api/v1/deals',
    summary: 'List Pipeline Deals & Stage Totals',
    description: 'Returns all deals in active pipeline with probability, expected close date, and financial line items.',
    tags: ['Deals'],
    requiresAuth: true,
    sampleQueryParams: {
      pipelineId: 'pipe-1',
      stageId: 'stage-4'
    },
    sampleResponse: {
      status: 200,
      body: {
        success: true,
        data: [
          {
            id: 'deal-201',
            title: 'Apex Logistics — Enterprise On-Premise Rollout',
            value: 285000,
            currency: 'USD',
            probability: 85,
            stageId: 'stage-4',
            companyName: 'Apex Logistics Global',
            assignedTo: 'Marcus Vance'
          }
        ],
        totalPipelineValue: 1055000
      }
    }
  },
  {
    id: 'ep-5',
    method: 'PATCH',
    path: '/api/v1/deals/:id/stage',
    summary: 'Advance or Move Deal Stage',
    description: 'Transitions deal to target stage. Writes immutable stage progression audit entry and evaluates BullMQ automation conditions (e.g. Deal Won provisioning).',
    tags: ['Deals'],
    requiresAuth: true,
    sampleRequestBody: {
      stageId: 'stage-5',
      closeReason: 'Customer signed enterprise MSA'
    },
    sampleResponse: {
      status: 200,
      body: {
        success: true,
        data: {
          id: 'deal-201',
          stageId: 'stage-5',
          stageName: 'Closed Won',
          probability: 100,
          wonRevenue: 285000,
          updatedAt: '2026-09-25T06:05:00Z'
        },
        automationTriggered: 'Deal Won Onboarding & Provisioning Pipeline'
      }
    }
  },
  {
    id: 'ep-6',
    method: 'POST',
    path: '/api/v1/activities',
    summary: 'Log Activity, Call, or Task from Mobile App',
    description: 'Allows sales reps on mobile devices to log calls, schedule meetings, or complete tasks with real-time sync.',
    tags: ['Activities'],
    requiresAuth: true,
    sampleRequestBody: {
      type: 'call',
      subject: 'Mobile Check-in with Chief Procurement',
      description: 'Confirmed tender submission time.',
      dueDate: '2026-09-26T14:00:00Z',
      priority: 'high',
      entityType: 'deal',
      entityId: 'deal-201'
    },
    sampleResponse: {
      status: 201,
      body: {
        success: true,
        data: {
          id: 'act-992',
          subject: 'Mobile Check-in with Chief Procurement',
          status: 'pending',
          assignedTo: 'Marcus Vance'
        }
      }
    }
  },
  {
    id: 'ep-7',
    method: 'POST',
    path: '/api/v1/auth/token',
    summary: 'Exchange API Key / Credentials for Mobile Session JWT',
    description: 'Exchanges client API key or mobile user credentials for scoped JWT Bearer token valid for 24 hours.',
    tags: ['Auth'],
    requiresAuth: false,
    sampleRequestBody: {
      apiKey: 'nx_live_c7f89a1b2c3d...',
      deviceId: 'iPhone16,2-iOS19-NexusApp'
    },
    sampleResponse: {
      status: 200,
      body: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        tokenType: 'Bearer',
        expiresIn: 86400,
        branchId: 'branch-1',
        role: 'Sales Executive',
        scopes: ['leads:read', 'leads:write', 'deals:read', 'deals:write', 'activities:write']
      }
    }
  }
];

