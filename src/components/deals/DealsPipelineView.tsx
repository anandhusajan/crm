import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Deal, PipelineStage } from '../../types/crm';
import {
  DollarSign,
  Plus,
  ChevronRight,
  ChevronLeft,
  Building,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  FileText,
  Sliders,
  ArrowRight
} from 'lucide-react';

export const DealsPipelineView: React.FC = () => {
  const {
    stages,
    filteredDeals,
    moveDealStage,
    addDeal,
    companies,
    contacts,
    availableUsers,
    currentBranchId,
    currentUser
  } = useCrm();

  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);

  // New Deal Form State
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState<number>(180000);
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-1');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [closeDate, setCloseDate] = useState<string>('2026-11-15');
  const [assignedUserId, setAssignedUserId] = useState<string>(currentUser.id);
  const [dealNote, setDealNote] = useState('');

  const totalPipeline = filteredDeals.reduce((sum, d) => sum + d.value, 0);

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle) return;

    const company = companies.find((c) => c.id === selectedCompanyId) || companies[0];
    const contact = contacts.find((c) => c.id === selectedContactId) || contacts[0];
    const stage = stages.find((s) => s.id === selectedStageId) || stages[0];
    const assignedUser = availableUsers.find((u) => u.id === assignedUserId) || availableUsers[0];

    addDeal({
      title: dealTitle,
      value: dealValue,
      currency: 'USD',
      pipelineId: 'pipe-1',
      stageId: stage.id,
      probability: stage.probability,
      expectedCloseDate: closeDate,
      assignedTo: assignedUser.name,
      assignedUserId: assignedUser.id,
      companyId: company.id,
      companyName: company.name,
      contactId: contact.id,
      contactName: `${contact.firstName} ${contact.lastName}`,
      branchId: currentBranchId === 'all' ? 'branch-1' : currentBranchId,
      products: [
        { id: `p-${Date.now()}`, name: 'Nexus CRM Core License', quantity: 1, unitPrice: dealValue }
      ],
      notes: dealNote || 'Commercial agreement under active review.'
    });

    setDealTitle('');
    setIsAddDealOpen(false);
  };

  const getNextStage = (currentStageId: string) => {
    const currentIndex = stages.findIndex((s) => s.id === currentStageId);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      return stages[currentIndex + 1];
    }
    return null;
  };

  const getPrevStage = (currentStageId: string) => {
    const currentIndex = stages.findIndex((s) => s.id === currentStageId);
    if (currentIndex > 0) {
      return stages[currentIndex - 1];
    }
    return null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Commercial Sales Pipeline</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic stage progression, probability forecasting, and stage migration audit tracking.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Value</span>
            <div className="text-sm font-bold font-mono text-slate-900">${totalPipeline.toLocaleString()}</div>
          </div>
          <button
            onClick={() => setIsAddDealOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {stages.map((stage) => {
          const stageDeals = filteredDeals.filter((d) => d.stageId === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage.id}
              className="bg-slate-50/80 border border-slate-200 rounded-lg p-3 flex flex-col min-h-[550px] shadow-2xs"
            >
              {/* Stage Header */}
              <div className="border-b border-slate-200/80 pb-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                    <span className="font-semibold text-xs text-slate-900 leading-tight truncate">
                      {stage.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                    {stage.probability}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1">
                  <span>{stageDeals.length} deals</span>
                  <span className="font-semibold text-slate-700">${stageTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Deals List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageDeals.map((deal) => {
                  const next = getNextStage(deal.stageId);
                  const prev = getPrevStage(deal.stageId);

                  return (
                    <div
                      key={deal.id}
                      onClick={() => setActiveDeal(deal)}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {deal.title}
                        </h3>
                      </div>

                      <div className="text-base font-bold font-mono text-slate-900">
                        ${deal.value.toLocaleString()}
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{deal.companyName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{deal.contactName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Close: {deal.expectedCloseDate}</span>
                        </div>
                      </div>

                      {/* Quick stage progression arrows */}
                      <div
                        className="pt-2 border-t border-slate-100 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-[10px] text-slate-400">{deal.assignedTo.split(' ')[0]}</div>
                        <div className="flex items-center gap-1">
                          {prev && (
                            <button
                              onClick={() => moveDealStage(deal.id, prev.id)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              title={`Move back to ${prev.name}`}
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {next && (
                            <button
                              onClick={() => moveDealStage(deal.id, next.id)}
                              className="px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
                              title={`Advance to ${next.name}`}
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {stageDeals.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                    No deals in stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Details Slide-Over Drawer */}
      {activeDeal && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex justify-end animate-in fade-in"
          onClick={() => setActiveDeal(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Deal Record · {activeDeal.id}</span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{activeDeal.title}</h2>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  ${activeDeal.value.toLocaleString()} {activeDeal.currency}
                </div>
              </div>
              <button
                onClick={() => setActiveDeal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stage Mover in Drawer */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="text-slate-500 font-medium">Update Pipeline Stage:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {stages.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      moveDealStage(activeDeal.id, st.id);
                      setActiveDeal({ ...activeDeal, stageId: st.id, probability: st.probability });
                    }}
                    className={`px-2 py-1.5 rounded text-left border text-[11px] font-medium transition-colors cursor-pointer ${
                      activeDeal.stageId === st.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>{st.name.split('. ')[1] || st.name}</div>
                    <div className="text-[9px] opacity-75 font-mono">{st.probability}%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Account / Company</span>
                <span className="font-semibold text-slate-900">{activeDeal.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Person</span>
                <span className="font-medium text-slate-900">{activeDeal.contactName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Executive</span>
                <span className="text-slate-800">{activeDeal.assignedTo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Expected Close</span>
                <span className="font-mono text-slate-800">{activeDeal.expectedCloseDate}</span>
              </div>
            </div>

            {/* Products Breakdown */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Commercial Quote Line Items</h3>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden text-xs">
                {activeDeal.products.map((prod) => (
                  <div key={prod.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{prod.name}</div>
                      <div className="text-[11px] text-slate-500">Qty: {prod.quantity}</div>
                    </div>
                    <div className="font-mono font-semibold text-slate-800">${prod.unitPrice.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Transition History / Audit Trail */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Stage Progression Audit History</span>
              </h3>
              <div className="border border-slate-200 rounded-lg p-3 space-y-2.5 text-xs bg-slate-50/50">
                {activeDeal.stageHistory.map((hist, i) => (
                  <div key={i} className="flex items-start gap-2 border-b border-slate-200/50 pb-2 last:border-none">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-slate-800">
                        {hist.fromStage} <span className="text-slate-400">→</span> {hist.toStage}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(hist.changedAt).toLocaleString()} by {hist.changedBy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {isAddDealOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsAddDealOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Create Pipeline Deal</h2>
                <p className="text-xs text-slate-500 mt-0.5">Register a commercial opportunity into the stage pipeline.</p>
              </div>
              <button
                onClick={() => setIsAddDealOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="e.g. Acme Corp — Enterprise Deployment"
                  className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Commercial Value ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Initial Stage</label>
                  <select
                    value={selectedStageId}
                    onChange={(e) => setSelectedStageId(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.probability}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Associated Company</label>
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Associated Contact</label>
                  <select
                    value={selectedContactId}
                    onChange={(e) => setSelectedContactId(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    {contacts.map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        {ct.firstName} {ct.lastName} ({ct.companyName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Expected Close Date</label>
                  <input
                    type="date"
                    value={closeDate}
                    onChange={(e) => setCloseDate(e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Assigned Executive</label>
                  <select
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-hidden"
                  >
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDealOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-md text-xs font-medium text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
