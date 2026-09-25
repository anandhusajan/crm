# Nexus Enterprise CRM — Project Overview

## 1. Executive Summary
Nexus Enterprise CRM is a mission-critical, enterprise-grade Customer Relationship Management platform engineered for local/on-premise deployment via Coolify, self-hosted Supabase (PostgreSQL, Storage, Realtime, Auth), Node.js Fastify API, and Next.js / React frontend.

Designed as a high-density, modular monolith with zero-trust multi-tenancy, Nexus provides granular Role-Based Access Control (RBAC), multi-branch organization scoping, dynamic sales pipelines, multi-touch lead conversion, task management, automation workflow triggers, and append-only audit trails.

## 2. Target Deployment & Infrastructure
- **Deployment**: Fully Local / On-Premise via Coolify
- **Primary Database**: PostgreSQL 16 (via Self-Hosted Supabase)
- **Cache & Message Broker**: Redis 7 + BullMQ
- **Application Core**: Fastify API (Modular Monolith)
- **Frontend App**: Next.js / React + TypeScript + Tailwind CSS
- **Network Topology**: Internal LAN / VPN + Dedicated Firewall (`https://crm.internal`)

## 3. High-Density Domain Modules
1. **Multi-Tenant Foundation**: Organizations -> Branches -> Departments -> Teams -> Users -> Roles & Scopes.
2. **Leads Engine**: Multi-source ingestion, lead scoring (0-100), qualification workflow, instant conversion to (Contact + Company + Deal).
3. **Deals & Pipeline**: Dynamic stages, win probabilities, forecasted revenue, stage duration analytics, stage movement audit logs.
4. **Contacts & Companies**: Unified account graph, multi-contact association, addresses, transaction history.
5. **Tasks & Activities**: Calls, meetings, emails, reminders, priority matrices, owner assignments.
6. **Automation Workflow Engine**: Event triggers (Lead Created, Deal Stage Changed, Task Overdue), evaluation conditions, asynchronous BullMQ action execution.
7. **Append-Only Audit System**: Tamper-evident logging of all mutations (`old_values` vs `new_values` diffs, IP, actor ID, timestamp).
8. **Command Palette (Cmd+K)**: Instant cross-entity search and workflow shortcuts.
9. **Import & Deduplication**: CSV parser with mapping preview and email/phone collision detection.
