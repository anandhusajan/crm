# Architecture Specification — Nexus Enterprise CRM

## 1. Modular Monolith Architecture
Nexus strictly rejects unnecessary microservice sprawl in favor of a domain-bounded modular monolith.

```text
                  USERS (Browser / Mobile Web)
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
      Redis
  (Cache/Queues)
```

## 2. Multi-Tenant Scoping Principles
1. Every business record carries:
   - `id`: UUIDv7
   - `organization_id`: Inferred strictly from validated session claims (never client body)
   - `branch_id`: Branch boundary partition
   - `created_by`, `updated_by`, `created_at`, `updated_at`
   - `deleted_at`: UTC timestamp for soft-deletion
2. RBAC Scopes:
   - `OWN`: Records owned by current user
   - `TEAM`: Records within user's assigned team
   - `BRANCH`: Records assigned to user's branch
   - `ORGANIZATION`: All records across organization
   - `ALL`: Cross-tenant super-admin view

## 3. Automation & Background Pipeline
- Triggers push event payloads to Redis BullMQ queue.
- Worker threads process condition blocks and schedule actions (Webhook delivery, email notifications, lead assignments, task generations).
- Execution records are written to `workflow_runs` and `workflow_run_steps` with latency and payload traces.
