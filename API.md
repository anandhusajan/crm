# Nexus Enterprise CRM — REST API & Mobile App Integration Guide

## 1. Base URL & Protocol
- **Production Gateway:** `https://crm.internal/api/v1`
- **Transport:** HTTPS / TLS 1.3
- **Format:** `application/json` (UTF-8)

## 2. Authentication
All protected endpoints require a Bearer token or API key passed in the `Authorization` header:

```http
Authorization: Bearer nx_live_c7f89a1b2c3d...
```

### Mobile App Authentication Flow (`POST /api/v1/auth/token`)
Field sales mobile apps (iOS / Android / Flutter) authenticate using device credentials to receive a 24-hour scoped JWT token:

```json
// Request POST /api/v1/auth/token
{
  "apiKey": "nx_live_...",
  "deviceId": "iPhone16,2-iOS19-FieldApp"
}

// Response 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "branchId": "branch-1",
  "role": "Sales Executive",
  "scopes": ["leads:read", "leads:write", "deals:read", "deals:write", "activities:write"]
}
```

## 3. Multi-Tenant Branch Scoping Header
Nexus enforces physical multi-tenant isolation. External apps must provide the branch partition identifier:

```http
X-Branch-ID: branch-1
```
If omitted, the backend infers the user's assigned primary branch.

## 4. Rate Limiting Headers
Every response includes real-time rate limit headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 994
X-RateLimit-Reset: 1758787200
X-Request-Id: req_1758787200142
```

## 5. Core Endpoints Summary

### A. Leads & Ingestion
- `GET /api/v1/leads`: List leads with filtering (`?status=Qualified&minScore=80&page=1&limit=20`)
- `POST /api/v1/leads`: Ingest new lead from web form, lead ad, or partner API
- `POST /api/v1/leads/:id/convert`: Atomically convert lead to Verified Company, Primary Contact, and Pipeline Deal

### B. Sales Deals & Pipeline
- `GET /api/v1/deals`: Query active deals across pipeline stages
- `PATCH /api/v1/deals/:id/stage`: Advance deal stage (`{ "stageId": "stage-5" }`). Automatically triggers BullMQ automation workers.

### C. Operational Activities & Mobile Field Work
- `GET /api/v1/activities`: Retrieve tasks, calls, and upcoming appointments
- `POST /api/v1/activities`: Schedule activity or task from mobile device
- `PATCH /api/v1/activities/:id/complete`: Check off completed task

### D. Omni-Channel Communications
- `POST /api/v1/communications/send`: Dispatch customer email, SMS, or log phone interaction with call disposition

## 6. Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead record lead-992 was not found or has been soft-deleted",
    "requestId": "req_1758787200142"
  }
}
```
