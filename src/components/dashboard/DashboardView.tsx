import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import {
  TrendingUp,
  DollarSign,
  Users2,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  GitBranch,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    filteredLeads,
    filteredDeals,
    filteredActivities,
    stages,
    branches,
    currentBranchId,
    auditLogs,
    setActiveTab,
    toggleActivityStatus
  } = useCrm();

  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'ytd'>('90d');

  // Metrics calculations
  const totalPipelineValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipelineValue = filteredDeals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);
  const wonDeals = filteredDeals.filter((d) => d.stageId === 'stage-5');
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  const totalLeads = filteredLeads.length;
  const qualifiedLeads = filteredLeads.filter((l) => ['Qualified', 'Proposal', 'Negotiation', 'Won'].includes(l.status)).length;
  const wonLeads = filteredLeads.filter((l) => l.status === 'Won').length;
  const leadConversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  const pendingActivities = filteredActivities.filter((a) => a.status === 'pending');
  const urgentActivities = pendingActivities.filter((a) => a.priority === 'urgent' || a.priority === 'high');

  // Lead sources breakdown
  const sourcesMap = filteredLeads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceEntries = Object.entries(sourcesMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Executive Commercial Dashboard</h1>
            <span className="text-xs text-slate-500 font-mono">
              Branch: {currentBranchId === 'all' ? 'All Hubs' : branches.find((b) => b.id === currentBranchId)?.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline metrics, multi-tenant lead velocity, and operational activity.
          </p>
        </div>

        {/* Date Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              dateRange === '30d' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange('90d')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              dateRange === '90d' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quarter (Q3)
          </button>
          <button
            onClick={() => setDateRange('ytd')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              dateRange === 'ytd' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Year to Date
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pipeline Value */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Active Pipeline</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            ${totalPipelineValue.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-700 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> +18.4%
            </span>
            <span aria-hidden="true">·</span>
            <span>Weighted: ${Math.round(weightedPipelineValue).toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: Won Revenue */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Closed Won Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            ${wonRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-medium text-slate-700">{wonDeals.length} Won Deals</span>
            <span aria-hidden="true">·</span>
            <span>Avg Deal: ${wonDeals.length > 0 ? Math.round(wonRevenue / wonDeals.length).toLocaleString() : 0}</span>
          </div>
        </div>

        {/* Card 3: Lead Ingestion & Conversion */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Lead Conversion Rate</span>
            <Users2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {leadConversionRate}%
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>{qualifiedLeads} Qualified</span>
            <span aria-hidden="true">·</span>
            <span>{totalLeads} Total Ingested</span>
          </div>
        </div>

        {/* Card 4: Action Items & Tasks */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Pending Activities</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {pendingActivities.length}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-amber-700 font-semibold">{urgentActivities.length} High/Urgent</span>
            <span aria-hidden="true">·</span>
            <span>Due this week</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Breakdown & Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pipeline Stage Distribution */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sales Pipeline Funnel Velocity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Value and deal distribution across active sales stages</p>
            </div>
            <button
              onClick={() => setActiveTab('deals')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {stages.map((stage) => {
              const stageDeals = filteredDeals.filter((d) => d.stageId === stage.id);
              const stageSum = stageDeals.reduce((sum, d) => sum + d.value, 0);
              const percentage = totalPipelineValue > 0 ? (stageSum / totalPipelineValue) * 100 : 0;

              return (
                <div key={stage.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                      <span className="font-medium text-slate-800">{stage.name}</span>
                      <span className="text-slate-400 font-mono">({stageDeals.length} deals)</span>
                    </div>
                    <div className="font-mono text-slate-700 font-semibold">
                      ${stageSum.toLocaleString()}{' '}
                      <span className="text-slate-400 font-normal">({Math.round(percentage)}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(percentage, 2)}%`,
                        backgroundColor: stage.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Lead Sources Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Lead Source Attribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Origin channels for inbound pipeline</p>
            </div>
            <button
              onClick={() => setActiveTab('leads')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {sourceEntries.map(([source, count]) => {
              const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              return (
                <div key={source} className="border-b border-slate-100 pb-2.5 last:border-none">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-700 font-medium">{source}</span>
                    <span className="font-mono text-slate-500">{count} leads · {pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Section: Actionable Tasks & Live Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending High Priority Tasks */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Urgent Activities & Action Items</h2>
              <p className="text-xs text-slate-500 mt-0.5">Immediate items requiring customer engagement</p>
            </div>
            <button
              onClick={() => setActiveTab('activities')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              All Activities
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingActivities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={act.status === 'completed'}
                    onChange={() => toggleActivityStatus(act.id)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{act.subject}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span>{act.entityTitle}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>Assigned to {act.assignedTo}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      act.priority === 'urgent'
                        ? 'text-red-700 font-bold'
                        : act.priority === 'high'
                        ? 'text-amber-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {act.priority}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Due {new Date(act.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Governance & Audit Stream */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Security & Operational Audit Stream</h2>
              <p className="text-xs text-slate-500 mt-0.5">Append-only compliance log from PostgreSQL</p>
            </div>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Full Audit Trail
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="border-b border-slate-100 pb-3 last:border-none text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-800">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">[{log.entityType}]</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] truncate">{log.entityName}</p>
                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>Actor: {log.actorName} ({log.actorRole})</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
