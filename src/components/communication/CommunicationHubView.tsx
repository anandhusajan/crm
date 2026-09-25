import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { CommunicationChannel, CommunicationMessage } from '../../types/crm';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Building,
  FileText,
  X,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing
} from 'lucide-react';

export const CommunicationHubView: React.FC = () => {
  const {
    communications,
    sendCommunicationMessage,
    leads,
    deals,
    contacts,
    currentUser
  } = useCrm();

  const [activeChannel, setActiveChannel] = useState<'all' | CommunicationChannel>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isComposeEmailOpen, setIsComposeEmailOpen] = useState(false);
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);

  // Email form state
  const [emailTo, setEmailTo] = useState(contacts[0]?.email || 'j.vanderbilt@apexlogistics.io');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [linkedEntityType, setLinkedEntityType] = useState<'lead' | 'deal' | 'contact'>('deal');
  const [linkedEntityId, setLinkedEntityId] = useState(deals[0]?.id || '');

  // Call log form state
  const [callRecipient, setCallRecipient] = useState('+1 (212) 555-0144');
  const [callDisposition, setCallDisposition] = useState<'Connected' | 'Left Voicemail' | 'No Answer' | 'Gatekeeper' | 'Follow-up Scheduled'>('Connected');
  const [callDuration, setCallDuration] = useState<number>(360);
  const [callNotes, setCallNotes] = useState('');

  // Email templates
  const templates: Record<string, { subject: string; body: string }> = {
    custom: { subject: '', body: '' },
    intro: {
      subject: 'Nexus CRM — Enterprise Self-Hosted Architecture Overview',
      body: 'Hi {{name}},\n\nThank you for reaching out regarding Nexus CRM. Attached is our technical architecture brief outlining our local Coolify cluster setup, zero-telemetry database isolation, and PostgreSQL 16 schema.\n\nWould you have 20 minutes next Tuesday for a live walkthrough with our systems engineering team?\n\nBest regards,\n' + currentUser.name
    },
    proposal: {
      subject: 'Commercial Proposal & Service Level Agreement Transmittal',
      body: 'Dear {{name}},\n\nPlease find attached the formal commercial proposal and perpetual licensing terms for your review. All on-premise installation specifications and 24/7 dedicated L3 support provisions are included.\n\nLet us know if your procurement committee requires any adjustments to Section 12.\n\nWarm regards,\n' + currentUser.name
    },
    demo_followup: {
      subject: 'Nexus CRM Discovery Session Summary & Next Milestones',
      body: 'Hi {{name}},\n\nGreat speaking with you today. Below is the summary of items we covered:\n1. Strict RBAC multi-tenant branch partitioning\n2. BullMQ asynchronous workflow triggers\n3. High-throughput REST API integration for your mobile field app\n\nNext step: We will prepare the staging deployment container.\n\nBest,\n' + currentUser.name
    }
  };

  const handleTemplateChange = (tplKey: string) => {
    setSelectedTemplate(tplKey);
    if (templates[tplKey]) {
      setEmailSubject(templates[tplKey].subject);
      setEmailBody(templates[tplKey].body);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo || !emailSubject || !emailBody) return;

    const targetEntity =
      linkedEntityType === 'deal'
        ? deals.find((d) => d.id === linkedEntityId)
        : leads.find((l) => l.id === linkedEntityId);

    const entityName = targetEntity ? targetEntity.companyName : 'Commercial Account';

    sendCommunicationMessage({
      channel: 'email',
      direction: 'outbound',
      subject: emailSubject,
      body: emailBody,
      sender: currentUser.email,
      recipient: emailTo,
      status: 'sent',
      entityType: linkedEntityType,
      entityId: linkedEntityId,
      entityName
    });

    setIsComposeEmailOpen(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callRecipient || !callNotes) return;

    sendCommunicationMessage({
      channel: 'call',
      direction: 'outbound',
      subject: `Call Outcome: ${callDisposition}`,
      body: callNotes,
      sender: currentUser.name,
      recipient: callRecipient,
      status: 'logged',
      entityType: linkedEntityType,
      entityId: linkedEntityId,
      entityName: 'Apex Logistics (CTO Julian Vanderbilt)',
      durationSeconds: callDuration,
      callDisposition
    });

    setIsLogCallOpen(false);
    setCallNotes('');
  };

  const filteredMessages = communications.filter((msg) => {
    const matchesChannel = activeChannel === 'all' || msg.channel === activeChannel;
    const matchesSearch =
      (msg.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Omni-Channel Communications Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Unified chronological customer touchpoint stream spanning emails, telephone calls, SMS alerts, and mobile notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLogCallOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Log Telephone Call</span>
          </button>
          <button
            onClick={() => setIsComposeEmailOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Compose Email</span>
          </button>
        </div>
      </div>

      {/* Filter & Channel Switcher Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-200 rounded-lg p-3 shadow-2xs text-xs">
        {/* Channel Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveChannel('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeChannel === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Channels ({communications.length})
          </button>
          <button
            onClick={() => setActiveChannel('email')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeChannel === 'email' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-purple-600" />
            <span>Emails</span>
          </button>
          <button
            onClick={() => setActiveChannel('call')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeChannel === 'call' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Calls</span>
          </button>
          <button
            onClick={() => setActiveChannel('sms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeChannel === 'sms' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>SMS & Alerts</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search communications..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden"
          />
        </div>
      </div>

      {/* Communications Timeline Stream */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3 hover:border-slate-300 transition-colors text-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    msg.channel === 'email'
                      ? 'bg-purple-50 text-purple-700'
                      : msg.channel === 'call'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {msg.channel === 'email' && <Mail className="w-4 h-4" />}
                  {msg.channel === 'call' && <Phone className="w-4 h-4" />}
                  {msg.channel === 'sms' && <MessageSquare className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {msg.subject || `Call with ${msg.recipient}`}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">
                      [{msg.direction.toUpperCase()}]
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>From: {msg.sender}</span>
                    <span aria-hidden="true">·</span>
                    <span>To: {msg.recipient}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">Account: {msg.entityName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
                {msg.durationSeconds && (
                  <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                    Duration: {Math.floor(msg.durationSeconds / 60)}m {msg.durationSeconds % 60}s
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs">
              {msg.body}
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs bg-white border border-slate-200 rounded-lg">
            No communications found matching criteria.
          </div>
        )}
      </div>

      {/* Compose Email Modal */}
      {isComposeEmailOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsComposeEmailOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Compose Enterprise Commercial Email</h2>
              <button onClick={() => setIsComposeEmailOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Pre-Built Message Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-700 focus:outline-hidden"
                >
                  <option value="custom">Custom Email</option>
                  <option value="intro">1. Enterprise Introduction & Whitepaper</option>
                  <option value="proposal">2. Commercial Proposal & SLA Transmittal</option>
                  <option value="demo_followup">3. Post-Demo Technical Summary</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Recipient Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Associated Deal</label>
                  <select
                    value={linkedEntityId}
                    onChange={(e) => setLinkedEntityId(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden truncate"
                  >
                    {deals.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Subject Line *</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full border border-slate-200 rounded px-3 py-1.5 font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Message Body *</label>
                <textarea
                  rows={8}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full border border-slate-200 rounded p-3 font-sans focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposeEmailOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send & Record in Audit Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Call Modal */}
      {isLogCallOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsLogCallOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Log Telephone / Video Call</h2>
              <button onClick={() => setIsLogCallOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogCall} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone Number / Dial-in</label>
                <input
                  type="text"
                  required
                  value={callRecipient}
                  onChange={(e) => setCallRecipient(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Call Disposition</label>
                  <select
                    value={callDisposition}
                    onChange={(e) => setCallDisposition(e.target.value as any)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    <option value="Connected">Connected & Discussed</option>
                    <option value="Left Voicemail">Left Voicemail</option>
                    <option value="No Answer">No Answer</option>
                    <option value="Gatekeeper">Gatekeeper</option>
                    <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={callDuration}
                    onChange={(e) => setCallDuration(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Call Notes & Key Takeaways *</label>
                <textarea
                  rows={4}
                  required
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record summary of customer commitments, technical objections, and next steps..."
                  className="w-full border border-slate-200 rounded p-2.5 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogCallOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium shadow-xs cursor-pointer"
                >
                  Save Call Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
