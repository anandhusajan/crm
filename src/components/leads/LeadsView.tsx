import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Lead, LeadStatus, LeadSource } from '../../types/crm';
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Building,
  UserCheck,
  CheckCircle2,
  CalendarPlus,
  StickyNote,
  X,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface LeadsViewProps {
  onOpenAddLead: () => void;
  onOpenImport: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ onOpenAddLead, onOpenImport }) => {
  const {
    filteredLeads,
    updateLeadStatus,
    assignLead,
    convertLead,
    addLeadNote,
    availableUsers,
    exportLeadsCsv,
    addActivity,
    currentUser
  } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Slide-over detail drawer
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Convert modal
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState<number>(150000);

  // New Note state
  const [noteText, setNoteText] = useState('');

  // Quick activity modal state inside active lead
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activitySubject, setActivitySubject] = useState('');
  const [activityType, setActivityType] = useState<'call' | 'email' | 'meeting' | 'task'>('call');
  const [activityPriority, setActivityPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const sources: LeadSource[] = [
    'Website Inbound',
    'Outbound Campaign',
    'Trade Show / Event',
    'Partner Referral',
    'Direct Organic'
  ];

  const filtered = filteredLeads.filter((lead) => {
    const matchesSearch =
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleOpenConvert = (lead: Lead) => {
    setConvertingLead(lead);
    setDealTitle(`${lead.companyName} — Commercial Deployment`);
    setDealValue(lead.estimatedValue || 150000);
  };

  const handleConfirmConvert = () => {
    if (!convertingLead) return;
    convertLead(convertingLead.id, dealTitle, dealValue);
    setConvertingLead(null);
    if (activeLead?.id === convertingLead.id) {
      setActiveLead(null);
    }
  };

  const handleAddNote = (leadId: string) => {
    if (!noteText.trim()) return;
    addLeadNote(leadId, noteText);
    setNoteText('');
    if (activeLead && activeLead.id === leadId) {
      setActiveLead({
        ...activeLead,
        notes: [noteText, ...activeLead.notes]
      });
    }
  };

  const handleAddQuickActivity = (lead: Lead) => {
    if (!activitySubject.trim()) return;
    addActivity({
      type: activityType,
      subject: activitySubject,
      description: `Follow-up with ${lead.firstName} ${lead.lastName} (${lead.title} at ${lead.companyName})`,
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      priority: activityPriority,
      status: 'pending',
      entityType: 'lead',
      entityId: lead.id,
      entityTitle: `${lead.firstName} ${lead.lastName} (${lead.companyName})`,
      assignedTo: lead.assignedTo
    });
    setActivitySubject('');
    setIsAddingActivity(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Leads & Ingestion Pipeline</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track prospective accounts, algorithmically score intent, and convert qualified leads into enterprise accounts & deals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenImport}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            Import CSV
          </button>
          <button
            onClick={exportLeadsCsv}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            Export CSV
          </button>
          <button
            onClick={onOpenAddLead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, email, company..."
            className="w-full pl-9 pr-4 py-1.5 text-xs text-slate-900 border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Sources</option>
              {sources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Lead Name & Title</th>
                <th className="py-3 px-4">Company & Source</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4">Est. Value</th>
                <th className="py-3 px-4">Owner Assignment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => setActiveLead(lead)}
                >
                  {/* Lead Name & Title */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{lead.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{lead.email}</div>
                  </td>

                  {/* Company & Source */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.companyName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span>{lead.source}</span>
                      <span aria-hidden="true" className="mx-1">·</span>
                      <span>{lead.phone}</span>
                    </div>
                  </td>

                  {/* Lead Score */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-xs ${
                          lead.score >= 85
                            ? 'text-emerald-700'
                            : lead.score >= 60
                            ? 'text-blue-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {lead.score}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            lead.score >= 85
                              ? 'bg-emerald-600'
                              : lead.score >= 60
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Lifecycle Status selector */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className={`text-xs font-medium px-2 py-1 rounded border focus:outline-hidden cursor-pointer ${
                        lead.status === 'Won'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : lead.status === 'Lost'
                          ? 'border-slate-200 bg-slate-100 text-slate-500'
                          : lead.status === 'Qualified' || lead.status === 'Proposal'
                          ? 'border-blue-200 bg-blue-50 text-blue-800'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Est. Value */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    ${lead.estimatedValue ? lead.estimatedValue.toLocaleString() : '0'}
                  </td>

                  {/* Owner Assignment */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.assignedUserId}
                      onChange={(e) => assignLead(lead.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 focus:outline-hidden"
                    >
                      {availableUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {lead.status !== 'Won' ? (
                        <button
                          onClick={() => handleOpenConvert(lead)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Convert to Contact + Company + Deal"
                        >
                          <span>Convert</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Converted</span>
                        </span>
                      )}
                      <button
                        onClick={() => setActiveLead(lead)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded text-xs transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No leads matching criteria. Try adjusting filters or create a new lead.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {filteredLeads.length} leads</span>
          <span className="font-mono">Server-side pagination active · Soft-delete filtered</span>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {activeLead && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex justify-end animate-in fade-in"
          onClick={() => setActiveLead(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {activeLead.firstName} {activeLead.lastName}
                </h2>
                <p className="text-xs text-slate-500">{activeLead.title} at {activeLead.companyName}</p>
                <div className="text-[11px] text-slate-400 font-mono mt-1">Lead ID: {activeLead.id}</div>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick action bar */}
            <div className="flex items-center gap-2">
              {activeLead.status !== 'Won' && (
                <button
                  onClick={() => handleOpenConvert(activeLead)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Convert to Account & Deal</span>
                </button>
              )}
              <button
                onClick={() => setIsAddingActivity(!isAddingActivity)}
                className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>Schedule Task</span>
              </button>
            </div>

            {/* If quick task form opened */}
            {isAddingActivity && (
              <div className="p-4 border border-blue-200 bg-blue-50/40 rounded-lg space-y-3 text-xs">
                <div className="font-semibold text-slate-900">Schedule Quick Activity</div>
                <input
                  type="text"
                  value={activitySubject}
                  onChange={(e) => setActivitySubject(e.target.value)}
                  placeholder="e.g. Schedule discovery call with procurement"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white text-xs"
                />
                <div className="flex gap-2">
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as any)}
                    className="border border-slate-200 rounded px-2 py-1 bg-white text-xs"
                  >
                    <option value="call">Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="email">Email</option>
                    <option value="task">Task</option>
                  </select>
                  <select
                    value={activityPriority}
                    onChange={(e) => setActivityPriority(e.target.value as any)}
                    className="border border-slate-200 rounded px-2 py-1 bg-white text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <button
                    onClick={() => handleAddQuickActivity(activeLead)}
                    className="px-3 py-1 bg-blue-600 text-white rounded font-medium ml-auto cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Key Information Box */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email</span>
                <span className="font-mono text-slate-800">{activeLead.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone</span>
                <span className="font-mono text-slate-800">{activeLead.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lead Score</span>
                <span className="font-bold text-slate-900">{activeLead.score}/100</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimated Value</span>
                <span className="font-mono font-bold text-slate-900">${activeLead.estimatedValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Source</span>
                <span className="text-slate-800">{activeLead.source}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Owner</span>
                <span className="text-slate-800 font-medium">{activeLead.assignedTo}</span>
              </div>
            </div>

            {/* Notes & Activity History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                  <span>Activity & Engagement Notes</span>
                </h3>
              </div>

              {/* Add Note Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record an interaction note..."
                  className="flex-1 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNote(activeLead.id);
                  }}
                />
                <button
                  onClick={() => handleAddNote(activeLead.id)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {activeLead.notes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-md text-xs text-slate-700">
                    <p>{note}</p>
                    <div className="text-[10px] text-slate-400 mt-1">Logged by system / user</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Convert Lead Confirmation Modal */}
      {convertingLead && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setConvertingLead(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Enterprise Lead Conversion Engine</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Convert {convertingLead.firstName} {convertingLead.lastName}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                As required by Section 15 of the CRM Master Plan, converting a lead atomically constructs three
                connected relational records while preserving history:
              </p>
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-lg text-xs border border-slate-200">
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>1 New Company Record:</strong> {convertingLead.companyName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>1 New Primary Contact:</strong> {convertingLead.firstName} {convertingLead.lastName} ({convertingLead.email})
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>1 New Sales Deal in Pipeline:</strong> Created in Discovery stage
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Deal Title</label>
                <input
                  type="text"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Commercial Value ($ USD)</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded text-xs font-mono focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setConvertingLead(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-md text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConvert}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Execute Conversion & Log Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
