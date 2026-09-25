import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Activity, ActivityPriority, ActivityType } from '../../types/crm';
import {
  CalendarCheck2,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Users2,
  CheckSquare,
  FileText,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';

export const ActivitiesView: React.FC = () => {
  const {
    filteredActivities,
    addActivity,
    toggleActivityStatus,
    deleteActivity,
    availableUsers,
    leads,
    deals
  } = useCrm();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('2026-09-28T15:00:00Z');
  const [priority, setPriority] = useState<ActivityPriority>('medium');
  const [type, setType] = useState<ActivityType>('task');
  const [assignedTo, setAssignedTo] = useState(availableUsers[0]?.name || '');
  const [entityType, setEntityType] = useState<'lead' | 'deal'>('lead');
  const [entityId, setEntityId] = useState(leads[0]?.id || '');

  const filtered = filteredActivities.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || a.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesStatus && matchesPriority && matchesType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    const targetTitle =
      entityType === 'lead'
        ? leads.find((l) => l.id === entityId)?.companyName || 'Associated Lead'
        : deals.find((d) => d.id === entityId)?.title || 'Associated Deal';

    addActivity({
      type,
      subject,
      description,
      dueDate,
      priority,
      status: 'pending',
      entityType,
      entityId,
      entityTitle: targetTitle,
      assignedTo
    });

    setSubject('');
    setDescription('');
    setIsAddOpen(false);
  };

  const getTypeIcon = (t: ActivityType) => {
    switch (t) {
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-blue-600" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-purple-600" />;
      case 'meeting':
        return <Users2 className="w-3.5 h-3.5 text-amber-600" />;
      case 'note':
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Operational Activities & Tasks</h1>
          <p className="text-xs text-slate-500 mt-1">
            Action items, meetings, customer calls, and team execution management.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Activity</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Action Items
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'completed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed History
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Channels</option>
              <option value="call">Calls</option>
              <option value="meeting">Meetings</option>
              <option value="email">Emails</option>
              <option value="task">Tasks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filtered.map((activity) => (
          <div
            key={activity.id}
            className={`p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4 text-xs ${
              activity.status === 'completed' ? 'bg-slate-50/40 opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={activity.status === 'completed'}
                onChange={() => toggleActivityStatus(activity.id)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500 cursor-pointer h-4 w-4"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-100">{getTypeIcon(activity.type)}</div>
                  <h3
                    className={`font-semibold text-sm ${
                      activity.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {activity.subject}
                  </h3>
                </div>
                <p className="text-slate-600 text-xs">{activity.description}</p>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                  <span className="font-medium text-slate-700">Entity: {activity.entityTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>Owner: {activity.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    activity.priority === 'urgent'
                      ? 'text-red-700 font-bold'
                      : activity.priority === 'high'
                      ? 'text-amber-700'
                      : 'text-slate-500'
                  }`}
                >
                  {activity.priority}
                </span>
                <button
                  onClick={() => deleteActivity(activity.id)}
                  className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors cursor-pointer"
                  title="Remove activity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Due: {new Date(activity.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No activities matching criteria.
          </div>
        )}
      </div>

      {/* Schedule Activity Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Schedule Task / Activity</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Subject / Objective *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Discuss deployment prerequisites with engineering team"
                  className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify notes, agenda, dial-in, or follow-up milestones"
                  className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Activity Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ActivityType)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    <option value="call">Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="email">Email</option>
                    <option value="task">Task</option>
                    <option value="note">Internal Note</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ActivityPriority)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Assigned Rep</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Linked Relation</label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    <option value="lead">Lead Ingestion</option>
                    <option value="deal">Pipeline Deal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Record</label>
                  <select
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    {entityType === 'lead'
                      ? leads.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.firstName} {l.lastName} ({l.companyName})
                          </option>
                        ))
                      : deals.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.title}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-md text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold cursor-pointer"
                >
                  Register Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
