# Database Specification — PostgreSQL / Self-Hosted Supabase

## 1. Schema Conventions
- All primary keys use `UUIDv7` (or `gen_random_uuid()` with timestamp sequence)
- UTC timestamps (`TIMESTAMPTZ`)
- Foreign keys with `ON DELETE RESTRICT` for financial and CRM records to prevent accidental cascades
- Soft delete (`deleted_at TIMESTAMPTZ NULL`) indexed via partial index `WHERE deleted_at IS NULL`

## 2. Core Relational Schema

### A. Tenancy & Auth
- `organizations` (`id`, `name`, `slug`, `tier`, `settings JSONB`, `created_at`)
- `branches` (`id`, `organization_id`, `name`, `code`, `timezone`, `currency`, `address`)
- `users` (`id`, `email`, `full_name`, `avatar_url`, `status`, `organization_id`, `branch_id`, `role_id`)
- `roles` (`id`, `organization_id`, `name`, `scope`, `description`)
- `permissions` (`id`, `code`, `description`)
- `role_permissions` (`role_id`, `permission_id`)

### B. CRM & Sales
- `leads` (`id`, `organization_id`, `branch_id`, `first_name`, `last_name`, `email`, `phone`, `company_name`, `title`, `source`, `status`, `score`, `assigned_user_id`, `notes_count`, `created_at`, `updated_at`, `deleted_at`)
- `contacts` (`id`, `organization_id`, `company_id`, `first_name`, `last_name`, `email`, `phone`, `title`, `lead_id`, `is_primary`, `created_at`)
- `companies` (`id`, `organization_id`, `name`, `domain`, `industry`, `tier`, `annual_revenue`, `phone`, `city`, `country`, `created_at`)
- `deals` (`id`, `organization_id`, `branch_id`, `pipeline_id`, `stage_id`, `title`, `value`, `currency`, `probability`, `expected_close_date`, `assigned_user_id`, `company_id`, `contact_id`, `created_at`, `updated_at`, `deleted_at`)
- `pipeline_stages` (`id`, `pipeline_id`, `name`, `order_index`, `probability`, `color`, `is_won`, `is_lost`)

### C. Activities, Automation & Governance
- `activities` (`id`, `organization_id`, `type`, `subject`, `description`, `due_date`, `status`, `priority`, `entity_type`, `entity_id`, `assigned_user_id`)
- `workflows` (`id`, `organization_id`, `title`, `trigger_type`, `conditions JSONB`, `actions JSONB`, `is_active`, `last_run_at`)
- `workflow_runs` (`id`, `workflow_id`, `status`, `entity_id`, `logs JSONB`, `started_at`, `finished_at`)
- `audit_logs` (`id`, `organization_id`, `actor_user_id`, `actor_email`, `action`, `entity_type`, `entity_id`, `old_values JSONB`, `new_values JSONB`, `ip_address`, `user_agent`, `created_at`)

## 3. High Performance Indexes
```sql
CREATE INDEX idx_leads_org_status ON leads (organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_org_assignee ON leads (organization_id, assigned_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_org_stage ON deals (organization_id, stage_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_org_time ON audit_logs (organization_id, created_at DESC);
```
