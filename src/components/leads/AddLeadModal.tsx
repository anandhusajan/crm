import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { LeadSource, LeadStatus } from '../../types/crm';
import { X, Sparkles, Building2, User, Mail, Phone, DollarSign } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead, availableUsers, currentBranchId, currentUser } = useCrm();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState<LeadSource>('Website Inbound');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [score, setScore] = useState<number>(78);
  const [estimatedValue, setEstimatedValue] = useState<number>(120000);
  const [assignedUserId, setAssignedUserId] = useState<string>(currentUser.id);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !companyName || !email) {
      alert('Please fill in required fields (Name, Company, Email)');
      return;
    }

    const assignedUser = availableUsers.find((u) => u.id === assignedUserId) || availableUsers[0];

    addLead({
      firstName,
      lastName,
      email,
      phone: phone || '+1 (555) 019-2831',
      companyName,
      title: title || 'Director of Operations',
      source,
      status,
      score,
      assignedTo: assignedUser.name,
      assignedUserId: assignedUser.id,
      branchId: currentBranchId === 'all' ? 'branch-1' : currentBranchId,
      estimatedValue,
      notes: note ? [note] : ['Registered via CRM Ingestion Portal.'],
      tags: ['Inbound', 'Verified Domain']
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Register Inbound Enterprise Lead</h2>
            <p className="text-xs text-slate-500 mt-0.5">Captures prospect information, scores intent, and logs mutation to audit trail.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Liam"
                className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Sterling"
                className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Defense Inc."
                className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VP Infrastructure"
                className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Corporate Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="l.sterling@apexdefense.com"
                className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Direct Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2831"
                className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
              >
                <option value="Website Inbound">Website Inbound</option>
                <option value="Outbound Campaign">Outbound Campaign</option>
                <option value="Trade Show / Event">Trade Show / Event</option>
                <option value="Partner Referral">Partner Referral</option>
                <option value="Direct Organic">Direct Organic</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Initial Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full border border-slate-200 rounded px-2.5 py-1.5 font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Est. Value ($ USD)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full border border-slate-200 rounded px-2.5 py-1.5 font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Assign Sales Representative</label>
            <select
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white focus:outline-hidden"
            >
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.role} ({u.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Discovery Notes</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Requirements, tech stack, timeframe..."
              className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-md text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Create Lead Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
