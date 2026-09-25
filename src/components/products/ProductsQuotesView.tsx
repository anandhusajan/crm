import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Product, Quote, QuoteItem } from '../../types/crm';
import {
  FileSpreadsheet,
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  DollarSign,
  Building,
  User,
  X,
  FileCheck,
  Percent,
  Sparkles
} from 'lucide-react';

export const ProductsQuotesView: React.FC = () => {
  const {
    products,
    quotes,
    deals,
    companies,
    contacts,
    createQuote,
    addToast
  } = useCrm();

  const [activeSubTab, setActiveSubTab] = useState<'quotes' | 'products'>('quotes');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isGenerateQuoteOpen, setIsGenerateQuoteOpen] = useState(false);
  const [selectedQuoteForPrint, setSelectedQuoteForPrint] = useState<Quote | null>(null);

  // Form state for generating quote
  const [selectedDealId, setSelectedDealId] = useState(deals[0]?.id || '');
  const [quoteItems, setQuoteItems] = useState<{ productId: string; quantity: number; discountPct: number }[]>([
    { productId: products[0]?.id || 'prod-1', quantity: 1, discountPct: 0 }
  ]);
  const [taxRate, setTaxRate] = useState<number>(0.0);
  const [quoteNotes, setQuoteNotes] = useState('Payment terms: Net 30 upon successful container orchestration.');

  const selectedDeal = deals.find((d) => d.id === selectedDealId) || deals[0];

  const handleAddItemRow = () => {
    setQuoteItems([...quoteItems, { productId: products[0]?.id || 'prod-1', quantity: 1, discountPct: 0 }]);
  };

  const handleRemoveItemRow = (idx: number) => {
    if (quoteItems.length > 1) {
      setQuoteItems(quoteItems.filter((_, i) => i !== idx));
    }
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal) return;

    let subtotal = 0;
    let discountTotal = 0;

    const items: QuoteItem[] = quoteItems.map((qi, idx) => {
      const prod = products.find((p) => p.id === qi.productId) || products[0];
      const lineSub = prod.unitPrice * qi.quantity;
      const lineDisc = lineSub * (qi.discountPct / 100);
      const lineTotal = lineSub - lineDisc;

      subtotal += lineSub;
      discountTotal += lineDisc;

      return {
        id: `qi-${Date.now()}-${idx}`,
        productId: prod.id,
        productName: prod.name,
        quantity: qi.quantity,
        unitPrice: prod.unitPrice,
        discountPct: qi.discountPct,
        total: lineTotal
      };
    });

    const taxTotal = (subtotal - discountTotal) * taxRate;
    const grandTotal = subtotal - discountTotal + taxTotal;

    const newQuote = createQuote({
      dealId: selectedDeal.id,
      dealTitle: selectedDeal.title,
      companyName: selectedDeal.companyName,
      contactName: selectedDeal.contactName,
      contactEmail: `${selectedDeal.contactName.toLowerCase().replace(/ /g, '.')}@${selectedDeal.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      items,
      subtotal,
      discountTotal,
      taxRate,
      taxTotal,
      grandTotal,
      currency: 'USD',
      status: 'presented',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: quoteNotes
    });

    setIsGenerateQuoteOpen(false);
    setSelectedQuoteForPrint(newQuote);
  };

  const filteredQuotes = quotes.filter(
    (q) =>
      q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.dealTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Commercial Catalog & Formal Quotes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Section 17 Sales Domain: Itemized pricing, pro-forma quote generation, and contractual proposals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tab toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('quotes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'quotes' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Quotes ({quotes.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'products' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Product SKUs ({products.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsGenerateQuoteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Deal Quote</span>
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
          placeholder={`Search ${activeSubTab === 'quotes' ? 'quotes by number or client' : 'products by SKU or title'}...`}
          className="w-full pl-9 pr-4 py-1.5 text-xs text-slate-900 border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-hidden bg-white shadow-2xs"
        />
      </div>

      {/* Sub-Tab 1: Quotes Table */}
      {activeSubTab === 'quotes' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Quote Number</th>
                <th className="py-3 px-4">Associated Deal & Account</th>
                <th className="py-3 px-4">Commercial Line Items</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{q.quoteNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{q.companyName}</div>
                    <div className="text-[11px] text-slate-500">{q.dealTitle}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{q.items.length} Product Line Items</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {q.items.map((i) => i.productName.split(' ')[0]).join(', ')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-base text-slate-900">
                    ${q.grandTotal.toLocaleString()} {q.currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase font-mono ${
                        q.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : q.status === 'presented'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{q.validUntil}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedQuoteForPrint(q)}
                      className="px-2.5 py-1 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Sheet</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sub-Tab 2: Product Catalog Table */}
      {activeSubTab === 'products' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Product / Service Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Billing Model</th>
                <th className="py-3 px-4">Catalog Unit Price</th>
                <th className="py-3 px-4">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{p.sku}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-500 max-w-md">{p.description}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{p.category}</td>
                  <td className="py-3.5 px-4 text-slate-600 uppercase font-mono text-[10px]">
                    {p.billingFrequency}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ${p.unitPrice.toLocaleString()} {p.currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Active Catalog Item</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Quote Modal */}
      {isGenerateQuoteOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsGenerateQuoteOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Generate Commercial Deal Quote</h2>
                <p className="text-slate-500 mt-0.5">Assembles itemized line-items, tax calculations, and terms.</p>
              </div>
              <button onClick={() => setIsGenerateQuoteOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Sales Opportunity *</label>
                <select
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-hidden"
                >
                  {deals.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} — {d.companyName} (${d.value.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Proposal Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {quoteItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-md">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].productId = e.target.value;
                          setQuoteItems(updated);
                        }}
                        className="flex-1 border border-slate-200 rounded px-2 py-1 bg-white text-xs"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (${p.unitPrice.toLocaleString()})
                          </option>
                        ))}
                      </select>

                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...quoteItems];
                            updated[idx].quantity = Number(e.target.value);
                            setQuoteItems(updated);
                          }}
                          placeholder="Qty"
                          className="w-full border border-slate-200 rounded px-2 py-1 bg-white text-xs font-mono"
                        />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPct}
                          onChange={(e) => {
                            const updated = [...quoteItems];
                            updated[idx].discountPct = Number(e.target.value);
                            setQuoteItems(updated);
                          }}
                          placeholder="Disc %"
                          className="w-full border border-slate-200 rounded px-2 py-1 bg-white text-xs font-mono"
                        />
                      </div>

                      {quoteItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Commercial Notes & SLA Terms</label>
                <textarea
                  rows={2}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGenerateQuoteOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Generate Formal Quote</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formal Printable Quote Sheet Modal */}
      {selectedQuoteForPrint && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedQuoteForPrint(null)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 p-8 space-y-6 text-xs font-sans max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6">
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg mb-2">
                  N
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">NEXUS ENTERPRISE SYSTEMS</h2>
                <p className="text-slate-500 text-[11px] leading-tight">
                  High-Performance On-Premise CRM Platforms · Coolify Cluster Ready
                </p>
              </div>

              <div className="text-right">
                <div className="text-base font-bold font-mono text-slate-900">{selectedQuoteForPrint.quoteNumber}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Date: {new Date(selectedQuoteForPrint.createdAt).toLocaleDateString()}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Valid Until: {selectedQuoteForPrint.validUntil}
                </div>
              </div>
            </div>

            {/* Bill To & Deal Context */}
            <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Client Legal Entity</span>
                <div className="font-bold text-sm text-slate-900 mt-0.5">{selectedQuoteForPrint.companyName}</div>
                <div className="text-slate-600 mt-0.5">Attn: {selectedQuoteForPrint.contactName}</div>
                <div className="text-slate-500 font-mono text-[11px]">{selectedQuoteForPrint.contactEmail}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Scope / Deployment</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedQuoteForPrint.dealTitle}</div>
                <div className="text-slate-600 mt-0.5">Status: Formal Binding Quote</div>
                <div className="text-emerald-700 font-semibold mt-0.5">Guaranteed On-Premise Data Residency</div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Disc %</th>
                    <th className="p-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedQuoteForPrint.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-medium text-slate-800">{item.productName}</td>
                      <td className="p-3 text-center font-mono">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">${item.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">{item.discountPct}%</td>
                      <td className="p-3 text-right font-mono font-semibold text-slate-900">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>${selectedQuoteForPrint.subtotal.toLocaleString()}</span>
                </div>
                {selectedQuoteForPrint.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discounts:</span>
                    <span>-${selectedQuoteForPrint.discountTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Tax (0% On-Premise B2B):</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-base text-slate-900">
                  <span>Grand Total:</span>
                  <span>${selectedQuoteForPrint.grandTotal.toLocaleString()} {selectedQuoteForPrint.currency}</span>
                </div>
              </div>
            </div>

            {/* Terms and Signature Placeholder */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-4">
              <p><strong>Terms:</strong> {selectedQuoteForPrint.notes}</p>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-semibold text-slate-800">Authorized Signature (Client)</div>
                  <div className="text-[10px] text-slate-400">Date & Corporate Seal</div>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-semibold text-slate-800">Authorized Signature (Nexus Systems)</div>
                  <div className="text-[10px] text-slate-400">Enterprise Licensing Officer</div>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 rounded font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setSelectedQuoteForPrint(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded font-medium cursor-pointer"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
