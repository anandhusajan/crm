export type UserRole = 'Super Admin' | 'Branch Manager' | 'Sales Executive' | 'Viewer';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type LeadSource = 'Website Inbound' | 'Outbound Campaign' | 'Trade Show / Event' | 'Partner Referral' | 'Direct Organic';

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';
export type ActivityPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ActivityStatus = 'pending' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  branchId: string;
  department: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  currency: string;
  leadCount: number;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  title: string;
  source: LeadSource;
  status: LeadStatus;
  score: number; // 0 to 100
  assignedTo: string; // User Name
  assignedUserId: string;
  branchId: string;
  estimatedValue: number;
  notes: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  annualRevenue: number;
  phone: string;
  city: string;
  country: string;
  branchId: string;
  dealsCount: number;
  contactsCount: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  companyId: string;
  companyName: string;
  isPrimary: boolean;
  branchId: string;
  lastContacted: string;
  createdAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number; // 0 - 100%
  color: string;
  isWon?: boolean;
  isLost?: boolean;
}

export interface DealProduct {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  assignedUserId: string;
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  branchId: string;
  products: DealProduct[];
  notes: string;
  stageHistory: {
    fromStage: string;
    toStage: string;
    changedAt: string;
    changedBy: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description: string;
  dueDate: string;
  priority: ActivityPriority;
  status: ActivityStatus;
  entityType: 'lead' | 'deal' | 'contact' | 'company';
  entityId: string;
  entityTitle: string;
  assignedTo: string;
  createdAt: string;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'contains';
  value: string | number;
}

export interface WorkflowAction {
  type: 'assign_user' | 'send_email' | 'create_task' | 'trigger_webhook' | 'notify_manager';
  params: Record<string, string>;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  triggerType: 'LEAD_CREATED' | 'DEAL_STAGE_CHANGED' | 'TASK_OVERDUE' | 'HIGH_SCORE_LEAD';
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
  lastRun?: string;
  runCount: number;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowTitle: string;
  status: 'success' | 'failed' | 'running';
  entityId: string;
  entityName: string;
  triggeredAt: string;
  durationMs: number;
  stepResults: string[];
}

export interface AuditLog {
  id: string;
  action: 'LEAD_CREATED' | 'LEAD_UPDATED' | 'LEAD_CONVERTED' | 'DEAL_STAGE_CHANGED' | 'DEAL_CREATED' | 'TASK_COMPLETED' | 'WORKFLOW_TRIGGERED' | 'USER_ROLE_UPDATED' | 'EXPORT_GENERATED';
  entityType: 'Lead' | 'Deal' | 'Contact' | 'Company' | 'Task' | 'Workflow' | 'User';
  entityId: string;
  entityName: string;
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  ipAddress: string;
  timestamp: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string;
  createdAt: string;
  status: 'active' | 'revoked';
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'failing';
  lastDelivery: string;
  successRate: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: 'Software License' | 'Cloud / Hosting' | 'Professional Services' | 'Support SLA';
  unitPrice: number;
  currency: string;
  billingFrequency: 'one-time' | 'monthly' | 'annual';
  isActive: boolean;
}

export interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  dealId: string;
  dealTitle: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  items: QuoteItem[];
  subtotal: number;
  discountTotal: number;
  taxRate: number; // e.g. 0.08 for 8%
  taxTotal: number;
  grandTotal: number;
  currency: string;
  status: 'draft' | 'presented' | 'accepted' | 'declined';
  validUntil: string;
  createdAt: string;
  notes: string;
}

export type CommunicationChannel = 'email' | 'sms' | 'whatsapp' | 'call';

export interface CommunicationMessage {
  id: string;
  channel: CommunicationChannel;
  direction: 'inbound' | 'outbound';
  subject?: string;
  body: string;
  sender: string;
  recipient: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'logged';
  entityType: 'lead' | 'deal' | 'contact';
  entityId: string;
  entityName: string;
  durationSeconds?: number; // for calls
  callDisposition?: 'Connected' | 'Left Voicemail' | 'No Answer' | 'Gatekeeper' | 'Follow-up Scheduled';
}

export interface CustomFieldDefinition {
  id: string;
  targetEntity: 'lead' | 'deal' | 'company';
  label: string;
  key: string;
  fieldType: 'text' | 'number' | 'select' | 'boolean';
  options?: string[];
  required: boolean;
}

export interface ApiEndpointDef {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  tags: string[];
  requiresAuth: boolean;
  sampleQueryParams?: Record<string, string>;
  sampleRequestBody?: Record<string, unknown>;
  sampleResponse: {
    status: number;
    body: Record<string, unknown>;
  };
}

