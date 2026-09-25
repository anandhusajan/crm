import React, { useState, useEffect, useRef } from 'react';
import { useCrm } from '../context/CrmContext';
import {
  Search,
  Users2,
  GitPullRequest,
  Building2,
  CalendarCheck2,
  ArrowRight,
  X,
  Zap,
  Sliders,
  FileCode2,
  Download,
  Terminal,
  Mail,
  FileSpreadsheet
} from 'lucide-react';

interface CommandPaletteProps {
  onOpenAddLead: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onOpenAddLead }) => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    leads,
    deals,
    companies,
    contacts,
    activities,
    setActiveTab,
    setCurrentBranchId,
    exportLeadsCsv,
    addToast
  } = useCrm();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchedLeads = q
    ? leads.filter(
        (l) =>
          l.firstName.toLowerCase().includes(q) ||
          l.lastName.toLowerCase().includes(q) ||
          l.companyName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedDeals = q
    ? deals.filter((d) => d.title.toLowerCase().includes(q) || d.companyName.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedCompanies = q
    ? companies.filter((c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedContacts = q
    ? contacts.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.companyName.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedActivities = q
    ? activities.filter((a) => a.subject.toLowerCase().includes(q) || a.entityTitle.toLowerCase().includes(q)).slice(0, 3)
    : [];

  // Default Quick Commands
  const quickCommands = [
    {
      label: 'Create New Inbound Lead',
      category: 'Actions',
      icon: Users2,
      action: () => {
        setIsCommandPaletteOpen(false);
        onOpenAddLead();
      }
    },
    {
      label: 'Open REST API & Mobile Integration Gateway',
      category: 'Integration',
      icon: Terminal,
      action: () => {
        setActiveTab('api');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Compose Customer Email or Log Call',
      category: 'Communication',
      icon: Mail,
      action: () => {
        setActiveTab('comms');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Generate Commercial Deal Quote',
      category: 'Sales',
      icon: FileSpreadsheet,
      action: () => {
        setActiveTab('quotes');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Navigate to Sales Pipeline Kanban',
      category: 'Navigation',
      icon: GitPullRequest,
      action: () => {
        setActiveTab('deals');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'View Immutable Audit Log',
      category: 'Navigation',
      icon: Sliders,
      action: () => {
        setActiveTab('audit');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Inspect Architectural Specs (PROJECT.md & DB)',
      category: 'Docs',
      icon: FileCode2,
      action: () => {
        setActiveTab('docs');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      label: 'Export Current Leads to CSV',
      category: 'Actions',
      icon: Download,
      action: () => {
        setIsCommandPaletteOpen(false);
        exportLeadsCsv();
      }
    },
    {
      label: 'Switch Scope: EMEA Regional Hub (London)',
      category: 'Tenancy',
      icon: Zap,
      action: () => {
        setCurrentBranchId('branch-2');
        setIsCommandPaletteOpen(false);
        addToast({ type: 'info', title: 'Branch Scope Updated', description: 'Switched to EMEA Regional Hub' });
      }
    }
  ];

  const filteredCommands = q
    ? quickCommands.filter((c) => c.label.toLowerCase().includes(q))
    : quickCommands;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search entities across all modules..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* If query has matches in Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Leads
              </div>
              <div className="space-y-0.5">
                {matchedLeads.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setActiveTab('leads');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{l.firstName} {l.lastName}</div>
                      <div className="text-[11px] text-slate-500">{l.companyName} · Score: {l.score}/100 · {l.status}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* If query has matches in Deals */}
          {matchedDeals.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Pipeline Deals
              </div>
              <div className="space-y-0.5">
                {matchedDeals.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveTab('deals');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{d.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">${d.value.toLocaleString()} · {d.companyName} · Prob: {d.probability}%</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* If query has matches in Companies */}
          {matchedCompanies.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Accounts / Companies
              </div>
              <div className="space-y-0.5">
                {matchedCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveTab('accounts');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.industry} · {c.city}, {c.country}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Commands & Navigation */}
          {filteredCommands.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Quick Commands
              </div>
              <div className="space-y-0.5">
                {filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.label}
                      onClick={cmd.action}
                      className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-800">{cmd.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                        {cmd.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {q &&
            matchedLeads.length === 0 &&
            matchedDeals.length === 0 &&
            matchedCompanies.length === 0 &&
            matchedContacts.length === 0 &&
            matchedActivities.length === 0 &&
            filteredCommands.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                No matching records or actions found for "{query}".
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Navigation: Use arrow keys or click</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
