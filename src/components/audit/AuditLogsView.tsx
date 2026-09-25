import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { AuditLog } from '../../types/crm';
import {
  ScrollText,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  X,
  Clock,
  ArrowRight,
  Database,
  Lock
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Immutable Audit Trail</h1>
            <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Append-Only · Tamper Sealed</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically sealed audit records meeting SOC2, ISO 27001, and HIPAA compliance specifications.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by entity, actor, or IP address..."
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-md focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Actions</option>
              <option value="LEAD_CREATED">LEAD_CREATED</option>
              <option value="LEAD_UPDATED">LEAD_UPDATED</option>
              <option value="LEAD_CONVERTED">LEAD_CONVERTED</option>
              <option value="DEAL_STAGE_CHANGED">DEAL_STAGE_CHANGED</option>
              <option value="DEAL_CREATED">DEAL_CREATED</option>
              <option value="TASK_COMPLETED">TASK_COMPLETED</option>
              <option value="WORKFLOW_TRIGGERED">WORKFLOW_TRIGGERED</option>
              <option value="USER_ROLE_UPDATED">USER_ROLE_UPDATED</option>
              <option value="EXPORT_GENERATED">EXPORT_GENERATED</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Entity:</span>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Entities</option>
              <option value="Lead">Lead</option>
              <option value="Deal">Deal</option>
              <option value="Task">Task</option>
              <option value="Workflow">Workflow</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">Entity & Reference</th>
              <th className="py-3 px-4">Actor & Role</th>
              <th className="py-3 px-4">Source IP</th>
              <th className="py-3 px-4 text-right">State Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-slate-500 text-[11px]">
                  {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                </td>
                <td className="py-3 px-4 font-semibold text-slate-900">
                  <span className="font-mono text-xs">{log.action}</span>
                </td>
                <td className="py-3 px-4 font-sans text-slate-700">
                  <div className="font-medium text-slate-900 truncate max-w-xs">{log.entityName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Type: {log.entityType}</div>
                </td>
                <td className="py-3 px-4 font-sans text-slate-800">
                  <div>{log.actorName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                </td>
                <td className="py-3 px-4 text-slate-600 text-[11px]">{log.ipAddress}</td>
                <td className="py-3 px-4 text-right font-sans">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="px-2 py-1 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Inspect</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diff Inspector Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Audit Record State Inspector</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Action: {selectedLog.action} · Entity: {selectedLog.entityType} ({selectedLog.entityId})
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider block">
                  Old State Values
                </span>
                <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-mono overflow-x-auto max-h-60">
                  {selectedLog.oldValues && Object.keys(selectedLog.oldValues).length > 0
                    ? JSON.stringify(selectedLog.oldValues, null, 2)
                    : '// No prior state (Genesis mutation)'}
                </pre>
              </div>

              <div className="space-y-1.5">
                <span className="text-emerald-700 font-semibold uppercase text-[10px] tracking-wider block">
                  New State Values
                </span>
                <pre className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg text-slate-800 text-xs font-mono overflow-x-auto max-h-60">
                  {selectedLog.newValues && Object.keys(selectedLog.newValues).length > 0
                    ? JSON.stringify(selectedLog.newValues, null, 2)
                    : '// State unchanged'}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-600">
              <div>
                <strong>Actor Signature:</strong> {selectedLog.actorName} ({selectedLog.actorEmail})
              </div>
              <div>
                <strong>Network Origin:</strong> IP {selectedLog.ipAddress} · Node: nexus-api-fastify-01
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                Timestamp: {selectedLog.timestamp}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-medium cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
