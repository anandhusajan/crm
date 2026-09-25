import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Company, Contact } from '../../types/crm';
import {
  Building2,
  Users2,
  Search,
  Plus,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  Briefcase,
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const ContactsCompaniesView: React.FC = () => {
  const {
    companies,
    contacts,
    addCompany,
    addContact,
    deals,
    currentBranchId
  } = useCrm();

  const [activeSubTab, setActiveSubTab] = useState<'companies' | 'contacts'>('companies');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  // New Company form
  const [companyName, setCompanyName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('Enterprise Technology');
  const [size, setSize] = useState('250 - 500 employees');
  const [annualRevenue, setAnnualRevenue] = useState<number>(45000000);
  const [companyPhone, setCompanyPhone] = useState('+1 (555) 012-9900');
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('USA');

  // New Contact form
  const [contactFirst, setContactFirst] = useState('');
  const [contactLast, setContactLast] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || '');
  const [isPrimary, setIsPrimary] = useState(true);

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(
    (ct) =>
      ct.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ct.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ct.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ct.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    addCompany({
      name: companyName,
      domain: domain || `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      industry,
      size,
      annualRevenue,
      phone: companyPhone,
      city,
      country,
      branchId: currentBranchId === 'all' ? 'branch-1' : currentBranchId
    });

    setCompanyName('');
    setIsAddCompanyOpen(false);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactFirst || !contactEmail) return;

    const company = companies.find((c) => c.id === selectedCompanyId) || companies[0];

    addContact({
      firstName: contactFirst,
      lastName: contactLast,
      email: contactEmail,
      phone: contactPhone || '+1 (555) 012-3344',
      title: contactTitle || 'Executive Director',
      companyId: company.id,
      companyName: company.name,
      isPrimary,
      branchId: currentBranchId === 'all' ? 'branch-1' : currentBranchId
    });

    setContactFirst('');
    setContactLast('');
    setContactEmail('');
    setIsAddContactOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Accounts & Entity Graph</h1>
          <p className="text-xs text-slate-500 mt-1">
            Normalized commercial accounts, multi-contact relationships, and corporate hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tab segmented toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveSubTab('companies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'companies'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Companies ({companies.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('contacts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'contacts'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>Contacts ({contacts.length})</span>
            </button>
          </div>

          <button
            onClick={() => (activeSubTab === 'companies' ? setIsAddCompanyOpen(true) : setIsAddContactOpen(true))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeSubTab === 'companies' ? 'Add Company' : 'Add Contact'}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeSubTab === 'companies' ? 'companies by name or industry' : 'contacts by name or email'}...`}
          className="w-full pl-9 pr-4 py-1.5 text-xs text-slate-900 border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-hidden bg-white shadow-2xs"
        />
      </div>

      {/* View 1: Companies Grid/Table */}
      {activeSubTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((comp) => {
            const compDeals = deals.filter((d) => d.companyId === comp.id);
            const compContacts = contacts.filter((c) => c.companyId === comp.id);
            const totalDealValue = compDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={comp.id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{comp.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{comp.domain}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">
                    {comp.industry}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-md">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Annual Revenue</span>
                    <span className="font-mono font-bold text-slate-900">${(comp.annualRevenue / 1000000).toFixed(0)}M</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Location</span>
                    <span className="truncate block">{comp.city}, {comp.country}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Contacts</span>
                    <span className="font-medium text-slate-800">{compContacts.length} verified</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Active Pipeline</span>
                    <span className="font-mono font-semibold text-emerald-700">${totalDealValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{comp.phone}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Size: {comp.size}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Contacts Table */}
      {activeSubTab === 'contacts' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Contact Person & Title</th>
                <th className="py-3 px-4">Associated Company</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Last Touchpoint</th>
                <th className="py-3 px-4">Primary Rep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((ct) => (
                <tr key={ct.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{ct.firstName} {ct.lastName}</div>
                    <div className="text-[11px] text-slate-500">{ct.title}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ct.companyName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{ct.email}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{ct.phone}</td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(ct.lastContacted).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4">
                    {ct.isPrimary ? (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Primary Key Contact
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Stakeholder</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Company Modal */}
      {isAddCompanyOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsAddCompanyOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add Corporate Account</h2>
              <button onClick={() => setIsAddCompanyOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Company Legal Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Global Solutions"
                  className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. apexsolutions.io"
                    className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-md text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold cursor-pointer"
                >
                  Create Company Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddContactOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsAddContactOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add Individual Contact</h2>
              <button onClick={() => setIsAddContactOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={contactFirst}
                    onChange={(e) => setContactFirst(e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={contactLast}
                    onChange={(e) => setContactLast(e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-hidden"
                />
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
                  <label className="block font-medium text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={contactTitle}
                    onChange={(e) => setContactTitle(e.target.value)}
                    placeholder="e.g. Chief Technical Architect"
                    className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryContact"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="primaryContact" className="text-slate-700 cursor-pointer">
                  Mark as Primary Account Decision Maker
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddContactOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-md text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
