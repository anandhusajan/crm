import React, { useState } from 'react';
import {
  FileText,
  Database,
  Layers,
  Server,
  Shield,
  GitBranch,
  Terminal,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';

export const SystemDocsView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'project' | 'architecture' | 'database' | 'api' | 'coolify'>('project');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">System Architecture & Specifications</h1>
            <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Verified Production Spec
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete technical contracts, database normalization schemas, and deployment topologies generated per the Enterprise CRM Master Plan.
          </p>
        </div>

        {/* Doc Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start">
          <button
            onClick={() => setActiveDoc('project')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeDoc === 'project' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PROJECT.md
          </button>
          <button
            onClick={() => setActiveDoc('architecture')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeDoc === 'architecture' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ARCHITECTURE.md
          </button>
          <button
            onClick={() => setActiveDoc('database')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeDoc === 'database' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DATABASE.md
          </button>
          <button
            onClick={() => setActiveDoc('api')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeDoc === 'api' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            API.md (REST Spec)
          </button>
          <button
            onClick={() => setActiveDoc('coolify')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeDoc === 'coolify' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Coolify & Infrastructure
          </button>
        </div>
      </div>

      {/* Doc Viewer Content Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        {activeDoc === 'project' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Task 1: PROJECT.md Verification</h2>
              <p className="text-slate-500 mt-0.5">High-density overview, business domains, and deployment baseline.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>Deployment & Target Environment</span>
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Target:</strong> Fully Local / On-Premise via Coolify</li>
                  <li><strong>Engine:</strong> Fastify API (Modular Monolith, No Microservice Sprawl)</li>
                  <li><strong>Frontend:</strong> Next.js + React 19 + TypeScript + Tailwind CSS</li>
                  <li><strong>Database:</strong> Self-Hosted Supabase (PostgreSQL 16 Engine)</li>
                  <li><strong>Queue & Cache:</strong> Redis 7.2 + BullMQ Asynchronous Workers</li>
                  <li><strong>Network Topology:</strong> Internal LAN / VPN + Firewall (<code>https://crm.internal</code>)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Governance & Security Invariants</span>
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Strict Zero-Trust Tenancy Isolation (<code>organization_id</code> + <code>branch_id</code>)</li>
                  <li>All mutations verified server-side with RBAC scopes</li>
                  <li>Input validation enforced strictly via Zod schemas</li>
                  <li>Append-only audit logs recording old values vs new values diffs</li>
                  <li>Soft-delete on business records with index optimizations</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-slate-900">Implemented Core CRM Domains:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-md">
                  <strong>1. Leads & Scoring</strong>
                  <div className="text-[11px] text-slate-500 mt-1">Multi-touch ingestion, 0-100 score meter, atomic conversion</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-md">
                  <strong>2. Sales Pipeline</strong>
                  <div className="text-[11px] text-slate-500 mt-1">5 dynamic stages, weighted forecast, stage history audit</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-md">
                  <strong>3. Accounts & Graph</strong>
                  <div className="text-[11px] text-slate-500 mt-1">Company hierarchy, primary contacts, deal linking</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-md">
                  <strong>4. Automation</strong>
                  <div className="text-[11px] text-slate-500 mt-1">BullMQ triggers, conditional rules, webhook dispatch</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'architecture' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Task 2: ARCHITECTURE.md Specification</h2>
              <p className="text-slate-500 mt-0.5">Modular monolith runtime boundaries, BullMQ worker loop, and data routing.</p>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[11px] overflow-x-auto leading-normal">
{`                    USERS (Browser / Mobile Web)
                              │
                    Internal VPN / LAN
                              │
                    Coolify Ingress Proxy
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   Next.js Web           Fastify API          BullMQ Worker
 (TanStack / UI)     (Domain Modules)     (Async Tasks/Automations)
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    Self-Hosted Supabase
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
  PostgreSQL 16         Supabase Auth        Supabase Storage
 (Normalized Tables)  (JWT/MFA/Session)     (Encrypted Buckets)
        ▲
        │
      Redis 7
  (Cache & Queues)`}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Fastify API Layer</span>
                <p className="text-slate-500 text-[11px]">
                  All domain validation, transactions, and business logic reside strictly in the Fastify layer rather than database triggers.
                </p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Redis & BullMQ Engine</span>
                <p className="text-slate-500 text-[11px]">
                  Heavy tasks (PDF quotes, webhooks, lead scoring, mass email sequences) are queued to avoid blocking the HTTP event loop.
                </p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Self-Hosted Supabase</span>
                <p className="text-slate-500 text-[11px]">
                  Provides PostgreSQL relational core, auth token verification, private file storage, and encrypted volume attachments.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'database' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Task 3 & 4: DATABASE.md Schema & Constraints</h2>
              <p className="text-slate-500 mt-0.5">PostgreSQL normalized entity relational tables, indexes, and soft-delete strategy.</p>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-blue-700 font-bold block mb-1 font-sans text-xs">A. Leads Table & Partial Indexes</span>
                <pre className="text-slate-800 overflow-x-auto">
{`CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255) NOT NULL,
  title VARCHAR(150),
  source VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'New',
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  assigned_user_id UUID REFERENCES users(id),
  estimated_value NUMERIC(14,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- High-Performance Composite & Partial Indexes
CREATE INDEX idx_leads_org_status ON leads (organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_org_branch ON leads (organization_id, branch_id) WHERE deleted_at IS NULL;`}
                </pre>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-purple-700 font-bold block mb-1 font-sans text-xs">B. Deals & Pipeline Stages</span>
                <pre className="text-slate-800 overflow-x-auto">
{`CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  pipeline_id UUID NOT NULL,
  stage_id UUID NOT NULL REFERENCES pipeline_stages(id),
  title VARCHAR(255) NOT NULL,
  value NUMERIC(14,2) NOT NULL,
  probability INTEGER CHECK (probability BETWEEN 0 AND 100),
  expected_close_date DATE,
  assigned_user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  contact_id UUID REFERENCES contacts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);`}
                </pre>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-emerald-700 font-bold block mb-1 font-sans text-xs">C. Append-Only Audit Trail</span>
                <pre className="text-slate-800 overflow-x-auto">
{`CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  actor_user_id UUID REFERENCES users(id),
  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(60) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'api' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">API.md: REST Gateway & Mobile Integration Specification</h2>
              <p className="text-slate-500 mt-0.5">Formal OpenAPI 3.1 contracts, mobile device authentication, and rate limiting headers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 font-mono text-[11px]">
                <span className="font-bold text-slate-900 text-xs font-sans block mb-1">Standard Headers Required</span>
                <div className="text-slate-800">
                  <div><strong>Authorization:</strong> Bearer &lt;API_KEY&gt;</div>
                  <div><strong>X-Branch-ID:</strong> branch-1 (Physical Tenant)</div>
                  <div><strong>Content-Type:</strong> application/json</div>
                  <div><strong>Accept:</strong> application/json</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 font-mono text-[11px]">
                <span className="font-bold text-slate-900 text-xs font-sans block mb-1">Response Headers Guaranteed</span>
                <div className="text-slate-800">
                  <div><strong>X-RateLimit-Limit:</strong> 1000 / min</div>
                  <div><strong>X-RateLimit-Remaining:</strong> 994</div>
                  <div><strong>X-Request-Id:</strong> req_1758787200142</div>
                  <div><strong>X-Branch-Scope:</strong> branch-1</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-blue-700 font-bold block mb-1 font-sans text-xs">Mobile App Authentication Flow (POST /api/v1/auth/token)</span>
                <pre className="text-slate-800 overflow-x-auto">
{`// Payload from Mobile App (iOS / Android / Flutter)
{
  "apiKey": "nx_live_c7f89a1b2c3d...",
  "deviceId": "iPhone16,2-iOS19-FieldApp"
}

// Response 200 OK: Returns 24-hour scoped JWT session token
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "branchId": "branch-1",
  "role": "Sales Executive",
  "scopes": ["leads:read", "leads:write", "deals:read", "deals:write", "activities:write"]
}`}
                </pre>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-emerald-700 font-bold block mb-1 font-sans text-xs">Atomic Lead Conversion (POST /api/v1/leads/:id/convert)</span>
                <pre className="text-slate-800 overflow-x-auto">
{`// Converts Lead to Company, Contact, and Deal simultaneously
{
  "dealTitle": "Apex Logistics — Enterprise Rollout",
  "dealValue": 285000,
  "targetStageId": "stage-2"
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'coolify' && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Coolify Deployment Topology & Backup Strategy</h2>
              <p className="text-slate-500 mt-0.5">On-premise container orchestration, persistent volumes, and disaster recovery.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Coolify Stack Composition</span>
                </span>
                <p className="text-slate-600">
                  Containerized via Docker compose orchestrated in Coolify instance:
                </p>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <div>1. <code>nexus-web</code>: Next.js SSR / Static Frontend</div>
                  <div>2. <code>nexus-api</code>: Fastify Application Monolith</div>
                  <div>3. <code>nexus-worker</code>: BullMQ Job Executor</div>
                  <div>4. <code>supabase-db</code>: PostgreSQL 16 (Persistent NVMe Volume)</div>
                  <div>5. <code>nexus-redis</code>: Redis 7.2 (AOF + RDB persistence)</div>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Section 40 Backup & Recovery Invariant</span>
                </span>
                <p className="text-slate-600">
                  "The local server is not the backup." Nexus enforces automated WAL archiving and encrypted daily snapshots:
                </p>
                <div className="p-2.5 bg-slate-50 rounded text-[11px] space-y-1 text-slate-600 font-mono">
                  <div>Primary Postgres → pg_dumpall daily snapshot (02:00 UTC)</div>
                  <div>Local NVMe Backup Storage → GPG 256-bit encryption</div>
                  <div>Sync to Encrypted Off-Site Mirror via WireGuard tunnel</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
