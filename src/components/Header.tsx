import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { UserRole } from '../types/crm';
import {
  Search,
  Building2,
  Shield,
  Bell,
  Plus,
  GitBranch,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Terminal
} from 'lucide-react';

export const Header: React.FC<{ onOpenAddLead: () => void }> = ({ onOpenAddLead }) => {
  const {
    branches,
    currentBranchId,
    setCurrentBranchId,
    currentUser,
    setUserRole,
    setIsCommandPaletteOpen,
    auditLogs,
    setActiveTab
  } = useCrm();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const roles: UserRole[] = ['Super Admin', 'Branch Manager', 'Sales Executive', 'Viewer'];

  const currentBranch = branches.find((b) => b.id === currentBranchId);
  const recentAlerts = auditLogs.slice(0, 5);

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Brand & Branch selector */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold tracking-tight text-sm shadow-xs">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base">Nexus CRM</span>
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                On-Premise · Coolify
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none">Modular Monolith · PostgreSQL 16</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        {/* Branch / Multi-tenant Partition Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentBranch ? currentBranch.name : 'All Multi-Tenant Branches'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isBranchDropdownOpen && (
            <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Multi-Tenant Branch Scoping
              </div>
              <button
                onClick={() => {
                  setCurrentBranchId('all');
                  setIsBranchDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  currentBranchId === 'all' ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                <span>All Branches (Global Aggregation)</span>
                {currentBranchId === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
              </button>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setCurrentBranchId(b.id);
                    setIsBranchDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentBranchId === b.id ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-[10px] text-slate-400">{b.city}, {b.country} · {b.currency}</div>
                  </div>
                  {currentBranchId === b.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Command Palette Quick Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden lg:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-xs text-slate-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            <span>Search leads, deals, accounts, tasks...</span>
          </div>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Role RBAC switcher, Notifications, Quick Add, User Badge */}
      <div className="flex items-center gap-2.5">
        {/* API Console Quick Access */}
        <button
          onClick={() => setActiveTab('api')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
          title="Open REST API & Mobile Integration Gateway"
        >
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          <span>/api/v1</span>
        </button>

        {/* Quick Add Lead */}
        <button
          onClick={onOpenAddLead}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md relative transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">System Activity Stream</span>
                <span className="text-[10px] text-slate-400">Realtime</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {recentAlerts.map((log) => (
                  <div key={log.id} className="px-4 py-2.5 text-xs hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-slate-800">{log.action.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] truncate">{log.entityName}</p>
                    <div className="text-[10px] text-slate-400 mt-0.5">By {log.actorName} ({log.actorRole})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* RBAC Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-md transition-colors text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-medium text-slate-800 leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-blue-600" />
                <span>{currentUser.role}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-1.5 border-b border-slate-100 mb-1">
                <div className="text-xs font-semibold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                <div className="text-[10px] text-slate-400 mt-1">Org: Nexus Global Corporation</div>
              </div>
              <div className="px-4 py-1 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Simulate RBAC Access Role
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentUser.role === r ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div>{r}</div>
                    <div className="text-[10px] text-slate-400">
                      {r === 'Super Admin'
                        ? 'Full tenant & audit control'
                        : r === 'Branch Manager'
                        ? 'Assigned branch scope'
                        : r === 'Sales Executive'
                        ? 'Own & team accounts'
                        : 'Read-only visibility'}
                    </div>
                  </div>
                  {currentUser.role === r && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
