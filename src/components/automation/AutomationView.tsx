import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Workflow, WorkflowRun } from '../../types/crm';
import {
  Workflow as WorkflowIcon,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  ArrowRight,
  Server,
  Zap,
  Activity,
  AlertCircle
} from 'lucide-react';

export const AutomationView: React.FC = () => {
  const {
    workflows,
    workflowRuns,
    toggleWorkflowActive,
    triggerManualWorkflowRun
  } = useCrm();

  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Automation Engine & BullMQ Queues</h1>
            <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Worker Active (4 threads)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Asynchronous background job engine powered by Redis & BullMQ. Triggers events, validates condition rules, and dispatches multi-step mutations.
          </p>
        </div>
      </div>

      {/* Redis & Queue Infrastructure Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Queue Broker</div>
          <div className="text-base font-bold font-mono mt-0.5 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Redis 7.2 (Local Unix Socket)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero external latency</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">BullMQ Worker Pool</div>
          <div className="text-base font-bold font-mono mt-0.5 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-blue-400" />
            <span>4 Concurrency Slots</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Idempotent retries enabled</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Avg Job Latency</div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
            142 ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sub-second execution SLA</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Completed Runs</div>
          <div className="text-base font-bold font-mono mt-0.5">
            {workflowRuns.length + 276} total
          </div>
          <div className="text-[11px] text-slate-400 mt-1">0 dead-letter queue failures</div>
        </div>
      </div>

      {/* Workflow Rule Definitions */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Configured Event Workflows</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className={`bg-white border rounded-lg p-5 shadow-2xs space-y-4 transition-all flex flex-col justify-between ${
                wf.isActive ? 'border-slate-300' : 'border-slate-200 opacity-80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-blue-600 font-semibold tracking-wider">
                      Trigger: {wf.triggerType}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug mt-0.5">{wf.title}</h3>
                  </div>
                  {/* Toggle Active Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={wf.isActive}
                      onChange={() => toggleWorkflowActive(wf.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{wf.description}</p>

                {/* Conditions Block */}
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-md text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rule Conditions</div>
                  {wf.conditions.map((c, i) => (
                    <div key={i} className="font-mono text-slate-700 text-[11px] flex items-center gap-1.5">
                      <span className="text-slate-400">WHEN</span>
                      <span className="font-semibold text-slate-900">{c.field}</span>
                      <span className="text-blue-600">{c.operator}</span>
                      <span className="font-semibold text-slate-800">"{c.value}"</span>
                    </div>
                  ))}
                </div>

                {/* Actions Block */}
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-md text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dispatched Actions</div>
                  {wf.actions.map((a, i) => (
                    <div key={i} className="text-slate-700 text-[11px] flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800 uppercase text-[10px] tracking-wider">{a.type.replace('_', ' ')}</span>
                      <span className="text-slate-500 font-mono text-[10px]">({Object.values(a.params).join(', ')})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Run Trigger + Stats */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-mono">
                  Runs: {wf.runCount} · Last: {wf.lastRun ? new Date(wf.lastRun).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Never'}
                </div>
                <button
                  onClick={() => triggerManualWorkflowRun(wf.id)}
                  disabled={!wf.isActive}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-xs flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Test Run</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BullMQ Workflow Execution Runs Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">BullMQ Execution Job History</h2>
            <p className="text-xs text-slate-500 mt-0.5">Asynchronous step logs and execution payloads</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Run Identifier</th>
                <th className="py-3 px-4">Workflow Rule</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Execution Latency</th>
                <th className="py-3 px-4">Triggered At</th>
                <th className="py-3 px-4 text-right">Step Traces</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workflowRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">{run.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{run.workflowTitle}</td>
                  <td className="py-3 px-4 text-slate-600">{run.entityName}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{run.status.toUpperCase()}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{run.durationMs} ms</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(run.triggeredAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedRun(run)}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded text-xs transition-colors cursor-pointer"
                    >
                      View Steps ({run.stepResults.length})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step Traces Modal */}
      {selectedRun && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedRun(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Job Execution Trace</h3>
                <div className="text-xs text-slate-500 font-mono">Job ID: {selectedRun.id} · {selectedRun.durationMs}ms</div>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">Executed Step Sequence:</div>
              <div className="space-y-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono">
                {selectedRun.stepResults.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">[{idx + 1}]</span>
                    <span className="text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRun(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-medium cursor-pointer"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
