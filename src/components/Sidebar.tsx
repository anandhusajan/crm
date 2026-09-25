import React from 'react';
import { useCrm } from '../context/CrmContext';
import {
  LayoutDashboard,
  Users2,
  GitPullRequest,
  Building2,
  CalendarCheck2,
  Workflow,
  ScrollText,
  FileCode2,
  Sliders,
  Download,
  Upload,
  Database,
  Terminal,
  Mail,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  onOpenImport: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  highlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenImport }) => {
  const { activeTab, setActiveTab, filteredLeads, filteredActivities, exportLeadsCsv, quotes } = useCrm();

  const pendingTasksCount = filteredActivities.filter((a) => a.status === 'pending').length;

  const navGroups: NavGroup[] = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      group: 'CRM & Revenue',
      items: [
        { id: 'leads', label: 'Leads & Ingestion', icon: Users2, count: filteredLeads.length },
        { id: 'deals', label: 'Sales Pipeline (Kanban)', icon: GitPullRequest },
        { id: 'quotes', label: 'Quotes & Catalog', icon: FileSpreadsheet, count: quotes.length },
        { id: 'accounts', label: 'Companies & Contacts', icon: Building2 },
        { id: 'comms', label: 'Omni-Channel Comms', icon: Mail },
        { id: 'activities', label: 'Tasks & Activities', icon: CalendarCheck2, count: pendingTasksCount },
      ]
    },
    {
      group: 'Integration & Mobile',
      items: [
        { id: 'api', label: 'REST API & Mobile Connect', icon: Terminal, highlight: true },
        { id: 'automation', label: 'BullMQ Workflows', icon: Workflow },
        { id: 'audit', label: 'Immutable Audit Trail', icon: ScrollText },
      ]
    },
    {
      group: 'System & Architecture',
      items: [
        { id: 'docs', label: 'Architecture & Schema Docs', icon: FileCode2 },
        { id: 'settings', label: 'Settings & Security', icon: Sliders },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="p-4 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.group}
            </div>
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'api' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.id === 'api' && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        LIVE
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-slate-800 text-slate-200'
                            : 'bg-slate-100 text-slate-600 font-semibold'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer: Import/Export + Deployment badge */}
      <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImport}
            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={exportLeadsCsv}
            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="p-2.5 rounded-md border border-slate-200 bg-white text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Self-Hosted Cluster</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Supabase DB · BullMQ · Fastify Modular Monolith
          </p>
        </div>
      </div>
    </aside>
  );
};
