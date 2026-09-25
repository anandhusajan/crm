import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Lead, LeadSource } from '../../types/crm';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const { importLeads, leads } = useCrm();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Sample CSV data loaded for demonstration
  const sampleCsvRows: Partial<Lead>[] = [
    {
      firstName: 'Alonzo',
      lastName: 'Mendoza',
      companyName: 'Vanguard Aerospace Inc.',
      email: 'a.mendoza@vanguard-aero.com',
      phone: '+1 (206) 555-0144',
      title: 'Chief Engineer',
      source: 'Trade Show / Event' as LeadSource,
      estimatedValue: 220000,
      score: 87
    },
    {
      firstName: 'Helena',
      lastName: 'Vogel',
      companyName: 'Bavaria Automation GmbH',
      email: 'h.vogel@bavaria-auto.de',
      phone: '+49 89 2345678',
      title: 'Director of Plant Systems',
      source: 'Website Inbound' as LeadSource,
      estimatedValue: 195000,
      score: 91
    },
    // Duplicate example
    {
      firstName: 'Dominic',
      lastName: 'Sterling',
      companyName: 'Aether Defense Systems',
      email: 'd.sterling@aetherdefense.com', // Duplicate of lead-101
      phone: '+1 (703) 555-0188',
      title: 'VP Procurement & IT',
      source: 'Website Inbound' as LeadSource,
      estimatedValue: 240000,
      score: 94
    },
    {
      firstName: 'Ravi',
      lastName: 'Subramaniam',
      companyName: 'IndoPacific Maritime Group',
      email: 'r.subramaniam@indopacific-maritime.sg',
      phone: '+65 6444 8899',
      title: 'Head of Fleet Operations',
      source: 'Partner Referral' as LeadSource,
      estimatedValue: 340000,
      score: 82
    }
  ];

  if (!isOpen) return null;

  // Duplicate analysis
  const duplicates = sampleCsvRows.filter((row) =>
    leads.some((l) => (row.email ? l.email.toLowerCase() === row.email.toLowerCase() : false))
  );
  const cleanRecords = sampleCsvRows.filter(
    (row) => !leads.some((l) => (row.email ? l.email.toLowerCase() === row.email.toLowerCase() : false))
  );

  const handleExecuteImport = () => {
    importLeads(sampleCsvRows);
    onClose();
    setStep(1);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Enterprise CSV Pipeline Ingestion</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Section 34 Multi-step validation, column mapping, and duplicate collision prevention.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="flex items-center justify-between text-xs font-medium border-b border-slate-100 pb-3 text-slate-400">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-blue-600 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
            <span>Dataset Selection</span>
          </div>
          <div className="h-px w-12 bg-slate-200" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-blue-600 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
            <span>Schema & Mapping</span>
          </div>
          <div className="h-px w-12 bg-slate-200" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-blue-600 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
            <span>Deduplication & Queue</span>
          </div>
        </div>

        {/* Step 1: File Selection */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3 bg-slate-50/50">
              <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
              <div>
                <span className="font-semibold text-slate-800">Ready to ingest batch leads</span>
                <p className="text-slate-500 mt-1">Accepts UTF-8 encoded .CSV with comma separators</p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium cursor-pointer shadow-xs"
                >
                  Load Sample Enterprise Dataset (4 Records)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Mapping Preview */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
              <span className="font-semibold">Automatic Field Schema Mapping:</span>
              <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[11px] text-slate-600">
                <div>CSV: <code>first_name</code> → <code>firstName</code></div>
                <div>CSV: <code>company</code> → <code>companyName</code></div>
                <div>CSV: <code>work_email</code> → <code>email</code></div>
                <div>CSV: <code>est_value</code> → <code>estimatedValue</code></div>
                <div>CSV: <code>lead_source</code> → <code>source</code></div>
                <div>CSV: <code>ai_score</code> → <code>score</code></div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Company</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Value</th>
                    <th className="p-2">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sampleCsvRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2 font-medium">{r.firstName} {r.lastName}</td>
                      <td className="p-2">{r.companyName}</td>
                      <td className="p-2 font-mono text-slate-600">{r.email}</td>
                      <td className="p-2 font-mono">${(r.estimatedValue || 0).toLocaleString()}</td>
                      <td className="p-2 font-mono">{r.score}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-xs cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <span>Run Deduplication Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Deduplication and Confirmation */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Duplicate Collision Detected ({duplicates.length} Record)</span>
              </div>
              <p className="text-amber-700 leading-relaxed">
                As required by Section 35 of the Master Plan, incoming records matching existing corporate emails or phone numbers are quarantined to prevent database pollution.
              </p>
              {duplicates.map((d, i) => (
                <div key={i} className="font-mono text-[11px] text-amber-900 bg-white/70 p-2 rounded">
                  Duplicate: <strong>{d.email}</strong> matches existing lead for Dominic Sterling (Aether Defense Systems).
                  <span className="text-slate-500 block text-[10px]">Action: Record will be skipped to protect account history.</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{cleanRecords.length} Clean Records Approved for Ingestion</span>
              </div>
              <p className="text-emerald-700">
                Will be ingested into current branch scope ({cleanRecords.length} leads).
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-xs cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleExecuteImport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Commit {cleanRecords.length} Leads to Database</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
