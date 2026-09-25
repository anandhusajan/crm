import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import {
  Sliders,
  Key,
  Webhook,
  Shield,
  Building,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Lock,
  Server,
  Database,
  Radio,
  ExternalLink
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    branches,
    apiKeys,
    createApiKey,
    revokeApiKey,
    webhooks,
    addWebhook,
    currentUser,
    availableUsers
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'rbac' | 'apikeys' | 'webhooks' | 'health'>('rbac');

  // New API key modal
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  // New Webhook modal
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);

  const permissionsMatrix = [
    { module: 'Leads & Ingestion', superAdmin: 'Full (All Branches)', manager: 'Branch Scope', exec: 'Own + Team Scope', viewer: 'Read Only' },
    { module: 'Deals & Pipeline', superAdmin: 'Full (All Branches)', manager: 'Branch Scope', exec: 'Own Accounts', viewer: 'Read Only' },
    { module: 'Accounts & Contacts', superAdmin: 'Full (All Branches)', manager: 'Branch Scope', exec: 'Write Allowed', viewer: 'Read Only' },
    { module: 'BullMQ Workflows', superAdmin: 'Full Control', manager: 'View & Run', exec: 'Trigger Assigned', viewer: 'No Access' },
    { module: 'Immutable Audit Trail', superAdmin: 'Full Audit Read', manager: 'Branch Audit Read', exec: 'No Access', viewer: 'Audit Read Only' },
    { module: 'Data Ingestion & CSV Export', superAdmin: 'Global Export', manager: 'Branch Export', exec: 'No Export Allowed', viewer: 'No Export Allowed' },
  ];

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    createApiKey(newKeyName.trim());
    setNewKeyName('');
    setIsCreatingKey(false);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;
    addWebhook(webhookUrl.trim(), ['lead.created', 'deal.won']);
    setWebhookUrl('');
    setIsCreatingWebhook(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Platform Settings & Security Governance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure multi-tenant boundaries, RBAC authorization matrices, API integration credentials, and webhook endpoints.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'rbac' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RBAC Permission Scopes
          </button>
          <button
            onClick={() => setActiveTab('apikeys')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'apikeys' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            API Access Keys
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'webhooks' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Outbound Webhooks
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'health' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Diagnostics
          </button>
        </div>
      </div>

      {/* Tab 1: RBAC Permission Matrix */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Scopes Matrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Permissions mapped to resource actions (e.g. <code>lead.create</code>, <code>deal.update</code>, <code>customer.export</code>).
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Domain Resource</th>
                    <th className="py-2.5 px-4 font-semibold text-slate-800">Super Admin (ALL)</th>
                    <th className="py-2.5 px-4 font-semibold text-blue-700">Branch Manager (BRANCH)</th>
                    <th className="py-2.5 px-4 font-semibold text-purple-700">Sales Executive (OWN/TEAM)</th>
                    <th className="py-2.5 px-4 font-semibold text-slate-600">Auditor / Viewer (READ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissionsMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-800">{row.module}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700">{row.superAdmin}</td>
                      <td className="py-3 px-4 font-mono text-blue-700">{row.manager}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{row.exec}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{row.viewer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Multi-Tenant Branches Overview */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Configured Multi-Tenant Operational Branches</h2>
              <p className="text-xs text-slate-500 mt-0.5">Physical and organizational data partitions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {branches.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{b.code}</span>
                    <span className="font-mono text-[10px] text-slate-400">{b.currency}</span>
                  </div>
                  <div className="font-medium text-slate-800">{b.name}</div>
                  <div className="text-[11px] text-slate-500">{b.city}, {b.country}</div>
                  <div className="text-[10px] text-blue-600 font-mono mt-1 pt-1 border-t border-slate-200/50">
                    {b.leadCount} Assigned Pipeline Accounts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: API Keys Management */}
      {activeTab === 'apikeys' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">API Access & Integration Keys</h2>
              <p className="text-xs text-slate-500 mt-0.5">Machine-to-machine authentication tokens for external services</p>
            </div>
            <button
              onClick={() => setIsCreatingKey(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate API Key</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Key Name / Consumer</th>
                  <th className="py-2.5 px-4">Token Prefix</th>
                  <th className="py-2.5 px-4">Created Date</th>
                  <th className="py-2.5 px-4">Last Activity</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">{key.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{key.prefix}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{key.lastUsedAt}</td>
                    <td className="py-3 px-4">
                      {key.status === 'active' ? (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Revoked
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {key.status === 'active' && (
                        <button
                          onClick={() => revokeApiKey(key.id)}
                          className="text-red-600 hover:text-red-700 text-xs font-medium cursor-pointer"
                        >
                          Revoke Key
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create Key Modal */}
          {isCreatingKey && (
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
              onClick={() => setIsCreatingKey(false)}
            >
              <div
                className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-bold text-sm text-slate-900">Provision New API Key</h3>
                <form onSubmit={handleAddKey} className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Key Description / Purpose</label>
                    <input
                      type="text"
                      required
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. ERP Finance Ingestion Daemon"
                      className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingKey(false)}
                      className="px-3 py-1.5 border border-slate-200 rounded text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 text-white rounded font-medium cursor-pointer"
                    >
                      Generate Key
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Webhooks */}
      {activeTab === 'webhooks' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Outbound Event Webhooks</h2>
              <p className="text-xs text-slate-500 mt-0.5">HTTP POST webhooks dispatched asynchronously with HMAC SHA256 signatures</p>
            </div>
            <button
              onClick={() => setIsCreatingWebhook(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Endpoint</span>
            </button>
          </div>

          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div key={wh.id} className="p-4 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-slate-900">{wh.url}</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {wh.successRate}% Success
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-medium text-slate-700">Subscribed Events:</span>
                  {wh.events.map((e) => (
                    <span key={e} className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {e}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Last Delivery: {new Date(wh.lastDelivery).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Add Webhook Modal */}
          {isCreatingWebhook && (
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
              onClick={() => setIsCreatingWebhook(false)}
            >
              <div
                className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-bold text-sm text-slate-900">Register Webhook Endpoint</h3>
                <form onSubmit={handleAddWebhook} className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Target HTTPS Endpoint</label>
                    <input
                      type="url"
                      required
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://accounting.internal/crm-events"
                      className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-hidden"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingWebhook(false)}
                      className="px-3 py-1.5 border border-slate-200 rounded text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 text-white rounded font-medium cursor-pointer"
                    >
                      Save Webhook
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: System Diagnostics */}
      {activeTab === 'health' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6 text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900">On-Premise Infrastructure Health Check</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status of modular monolith services and storage engines</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Self-Hosted PostgreSQL 16</div>
                <div className="text-slate-500 mt-0.5">Status: Healthy · Active Connections: 14 / 100 max</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">Storage: 4.2 GB / 250 GB NVMe volume</div>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Redis 7.2 Broker & BullMQ Workers</div>
                <div className="text-slate-500 mt-0.5">Status: Operational · 4 Concurrent Worker Threads</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">Memory: 24.8 MB · 0 Failed Queue Jobs</div>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Fastify Modular Monolith (API)</div>
                <div className="text-slate-500 mt-0.5">Status: Healthy · Average Latency: 12ms</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">PID: 14092 · Node.js 22 LTS · Uptime: 99.98%</div>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Coolify Deployment Daemon</div>
                <div className="text-slate-500 mt-0.5">Status: Connected · LAN Ingress: crm.internal:443</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">Docker Compose Stack: nexus-crm-production</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
