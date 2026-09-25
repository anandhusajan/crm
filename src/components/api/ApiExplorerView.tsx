import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { ApiEndpointDef } from '../../types/crm';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Download,
  Smartphone,
  Key,
  Shield,
  Clock,
  Layers,
  Code2,
  Cpu,
  Radio,
  ExternalLink,
  QrCode,
  ArrowRight
} from 'lucide-react';

export const ApiExplorerView: React.FC = () => {
  const {
    apiEndpoints,
    apiKeys,
    currentBranchId,
    executeApiRequest,
    addToast
  } = useCrm();

  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(apiEndpoints[0]?.id || '');
  const [selectedApiKey, setSelectedApiKey] = useState<string>(apiKeys[0]?.prefix || 'nx_live_c7f8...');
  const [authHeaderEnabled, setAuthHeaderEnabled] = useState<boolean>(true);
  const [activeCodeLang, setActiveCodeLang] = useState<'curl' | 'swift' | 'kotlin' | 'ts' | 'flutter'>('curl');

  // Request state
  const selectedEndpoint = apiEndpoints.find((e) => e.id === selectedEndpointId) || apiEndpoints[0];
  const [requestBodyText, setRequestBodyText] = useState<string>(
    selectedEndpoint?.sampleRequestBody ? JSON.stringify(selectedEndpoint.sampleRequestBody, null, 2) : ''
  );
  const [queryParamsText, setQueryParamsText] = useState<string>(
    selectedEndpoint?.sampleQueryParams ? JSON.stringify(selectedEndpoint.sampleQueryParams, null, 2) : ''
  );

  // Response state
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
    durationMs: number;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);

  // Update editor when changing endpoint
  const handleSelectEndpoint = (ep: ApiEndpointDef) => {
    setSelectedEndpointId(ep.id);
    setRequestBodyText(ep.sampleRequestBody ? JSON.stringify(ep.sampleRequestBody, null, 2) : '');
    setQueryParamsText(ep.sampleQueryParams ? JSON.stringify(ep.sampleQueryParams, null, 2) : '');
    setResponseResult(null);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    let parsedBody: Record<string, unknown> | undefined;
    let parsedParams: Record<string, string> | undefined;

    try {
      if (requestBodyText.trim()) parsedBody = JSON.parse(requestBodyText);
      if (queryParamsText.trim()) parsedParams = JSON.parse(queryParamsText);
    } catch (err) {
      alert('Invalid JSON formatting in Request Body or Query Parameters.');
      setIsLoading(false);
      return;
    }

    const authKeyToSend = authHeaderEnabled ? selectedApiKey : '';
    const result = await executeApiRequest(selectedEndpoint, parsedParams, parsedBody, authKeyToSend);
    setResponseResult(result);
    setIsLoading(false);
  };

  // Generate code snippet for mobile / backend developers
  const getCodeSnippet = () => {
    const baseUrl = 'https://crm.internal';
    const path = selectedEndpoint.path;
    const method = selectedEndpoint.method;

    if (activeCodeLang === 'curl') {
      return `curl -X ${method} "${baseUrl}${path}" \\
  -H "Authorization: Bearer ${authHeaderEnabled ? selectedApiKey : '<API_KEY>'}" \\
  -H "X-Branch-ID: ${currentBranchId}" \\
  -H "Content-Type: application/json"${
    method !== 'GET' && requestBodyText.trim()
      ? ` \\\n  -d '${requestBodyText.replace(/\n/g, '').replace(/\s+/g, ' ')}'`
      : ''
  }`;
    }

    if (activeCodeLang === 'swift') {
      return `// Swift 6 / iOS & macOS URLSession Client
import Foundation

var request = URLRequest(url: URL(string: "${baseUrl}${path}")!)
request.httpMethod = "${method}"
request.setValue("Bearer ${selectedApiKey}", forHTTPHeaderField: "Authorization")
request.setValue("${currentBranchId}", forHTTPHeaderField: "X-Branch-ID")
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
${method !== 'GET' && requestBodyText.trim() ? `request.httpBody = """\n${requestBodyText}\n""".data(using: .utf8)` : ''}

let (data, response) = try await URLSession.shared.data(for: request)
if let httpRes = response as? HTTPURLResponse, httpRes.statusCode == 200 {
    print("Success: \\(data.count) bytes received")
}`;
    }

    if (activeCodeLang === 'kotlin') {
      return `// Kotlin / Android & KMP with OkHttp & Coroutines
val client = OkHttpClient()
val request = Request.Builder()
    .url("${baseUrl}${path}")
    .addHeader("Authorization", "Bearer ${selectedApiKey}")
    .addHeader("X-Branch-ID", "${currentBranchId}")
    .${method.toLowerCase()}(${method !== 'GET' && requestBodyText.trim() ? `"${requestBodyText.replace(/"/g, '\\"')}".toRequestBody("application/json".toMediaType())` : ''})
    .build()

val response = client.newCall(request).execute()
val jsonString = response.body?.string()`;
    }

    if (activeCodeLang === 'ts') {
      return `// React Native / Next.js / TypeScript Client
import axios from 'axios';

const api = axios.create({
  baseURL: '${baseUrl}',
  headers: {
    'Authorization': 'Bearer ${selectedApiKey}',
    'X-Branch-ID': '${currentBranchId}',
    'Content-Type': 'application/json'
  }
});

export const callEndpoint = async () => {
  const response = await api.${method.toLowerCase()}('${path}'${method !== 'GET' && requestBodyText.trim() ? `, ${requestBodyText}` : ''});
  return response.data;
};`;
    }

    if (activeCodeLang === 'flutter') {
      return `// Dart / Flutter Client with http package
import 'package:http/http.dart' as http;
import 'dart:convert';

final response = await http.${method.toLowerCase()}(
  Uri.parse('${baseUrl}${path}'),
  headers: {
    'Authorization': 'Bearer ${selectedApiKey}',
    'X-Branch-ID': '${currentBranchId}',
    'Content-Type': 'application/json',
  },
  ${method !== 'GET' && requestBodyText.trim() ? `body: jsonEncode(${requestBodyText}),` : ''}
);`;
    }

    return '';
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    addToast({ type: 'info', title: 'Snippet Copied to Clipboard' });
  };

  const handleDownloadOpenApi = () => {
    const openApiSpec = {
      openapi: '3.1.0',
      info: {
        title: 'Nexus Enterprise CRM REST API',
        version: '1.0.0',
        description: 'Complete OpenAPI 3.1 specification for Nexus CRM on-premise modular monolith.'
      },
      servers: [{ url: 'https://crm.internal', description: 'Local On-Premise Coolify Gateway' }],
      paths: apiEndpoints.reduce((acc, ep) => {
        acc[ep.path] = {
          [ep.method.toLowerCase()]: {
            summary: ep.summary,
            description: ep.description,
            tags: ep.tags,
            responses: {
              [ep.sampleResponse.status]: {
                description: 'Successful execution',
                content: { 'application/json': { schema: { example: ep.sampleResponse.body } } }
              }
            }
          }
        };
        return acc;
      }, {} as Record<string, unknown>)
    };

    const blob = new Blob([JSON.stringify(openApiSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nexus_crm_openapi_v1.json';
    link.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'OpenAPI 3.1 Spec Downloaded', description: 'Ready to import into Postman, Retrofit, or Swagger UI.' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">API Gateway & Mobile App Integration Hub</h1>
            <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-blue-600" />
              <span>v1 REST Core · OpenAPI 3.1</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Engineered for seamless integration with mobile apps (iOS / Android / React Native / Flutter) and third-party enterprise services.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadOpenApi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download OpenAPI Spec</span>
          </button>
        </div>
      </div>

      {/* Mobile App Quick-Start & Gateway Credentials Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Smartphone className="w-4 h-4" />
              <span>Mobile Client Connection Gateway</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">Ready for iOS, Android & Field Apps</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect external client apps using persistent device session tokens or scoped API keys.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Gateway Ingress Endpoint</div>
              <div className="font-mono text-xs font-bold text-emerald-400">https://crm.internal/api/v1</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-800/70 border border-slate-700/60 rounded-lg space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">1. Authentication Flow</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Mobile apps call <code>POST /api/v1/auth/token</code> with device ID to receive a 24-hour scoped JWT Bearer token.
            </p>
          </div>
          <div className="p-3 bg-slate-800/70 border border-slate-700/60 rounded-lg space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">2. Multi-Tenant Branch Scoping</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              All requests must provide header <code>X-Branch-ID</code> or inherit branch permissions from user credentials.
            </p>
          </div>
          <div className="p-3 bg-slate-800/70 border border-slate-700/60 rounded-lg space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">3. Offline-Ready BullMQ Sync</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Outbound lead captures & mobile calls are queued with client UUIDs to prevent duplicate creation on reconnect.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Endpoints List + Interactive Test Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col (4/12): Endpoint Directory */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">API Endpoints Catalogue</span>
            <span className="text-[10px] text-slate-400 font-mono">{apiEndpoints.length} Routes</span>
          </div>

          <div className="space-y-1.5">
            {apiEndpoints.map((ep) => {
              const isSelected = ep.id === selectedEndpoint.id;
              const methodColor =
                ep.method === 'GET'
                  ? 'text-blue-700 bg-blue-50 border-blue-200'
                  : ep.method === 'POST'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : ep.method === 'PATCH'
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                  : 'text-red-700 bg-red-50 border-red-200';

              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 border-slate-300 shadow-2xs'
                      : 'border-transparent hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${methodColor}`}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-800 truncate">{ep.path}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{ep.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col (8/12): Interactive Request Console & Code Generator */}
        <div className="lg:col-span-8 space-y-6">
          {/* Request Configurator */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      selectedEndpoint.method === 'GET'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedEndpoint.method === 'POST'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900">{selectedEndpoint.path}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedEndpoint.description}</p>
              </div>

              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isLoading ? 'Executing...' : 'Send Live Request'}</span>
              </button>
            </div>

            {/* Auth Header Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="authHeader"
                  checked={authHeaderEnabled}
                  onChange={(e) => setAuthHeaderEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="authHeader" className="font-medium text-slate-800 cursor-pointer">
                  Send Authorization Header: <code>Bearer &lt;API_KEY&gt;</code>
                </label>
              </div>

              <select
                disabled={!authHeaderEnabled}
                value={selectedApiKey}
                onChange={(e) => setSelectedApiKey(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2.5 py-1 bg-white font-mono text-slate-700 disabled:opacity-40"
              >
                {apiKeys.map((k) => (
                  <option key={k.id} value={k.prefix}>
                    {k.name} ({k.prefix})
                  </option>
                ))}
              </select>
            </div>

            {/* Request Body Editor (if POST/PATCH) */}
            {selectedEndpoint.method !== 'GET' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">JSON Request Body</span>
                  <span className="text-[10px] text-slate-400 font-mono">application/json</span>
                </div>
                <textarea
                  rows={6}
                  value={requestBodyText}
                  onChange={(e) => setRequestBodyText(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-lg focus:outline-hidden"
                />
              </div>
            )}

            {/* Query Params Editor (if GET) */}
            {selectedEndpoint.method === 'GET' && selectedEndpoint.sampleQueryParams && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Query Parameters (JSON format)</span>
                  <span className="text-[10px] text-slate-400 font-mono">URL SearchParams</span>
                </div>
                <textarea
                  rows={3}
                  value={queryParamsText}
                  onChange={(e) => setQueryParamsText(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-lg focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Response Viewer */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Live HTTP Response</span>
                {responseResult && (
                  <span
                    className={`font-mono font-semibold px-2 py-0.5 rounded text-[10px] ${
                      responseResult.status < 300
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {responseResult.status} {responseResult.statusText} · {responseResult.durationMs}ms
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Fastify Modular Engine</span>
            </div>

            {responseResult ? (
              <div className="space-y-3">
                {/* Headers */}
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[10px] font-mono text-slate-600 grid grid-cols-2 gap-1">
                  <div>content-type: {responseResult.headers['Content-Type']}</div>
                  <div>x-ratelimit-remaining: {responseResult.headers['X-RateLimit-Remaining']} / 1000</div>
                  <div>x-branch-scope: {responseResult.headers['X-Branch-Scope']}</div>
                  <div>x-request-id: {responseResult.headers['X-Request-Id']}</div>
                </div>

                {/* Body */}
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto max-h-80 leading-relaxed">
                  {JSON.stringify(responseResult.body, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                Click "Send Live Request" above to execute API call against live CRM state.
              </div>
            )}
          </div>

          {/* Client SDK Code Generator for Mobile Developers */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Client Code Generator</h3>
                <p className="text-[11px] text-slate-400">Copy ready-to-run mobile app snippets</p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded text-[11px] font-medium">
                {(['curl', 'swift', 'kotlin', 'ts', 'flutter'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeLang(lang)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer uppercase font-mono text-[10px] ${
                      activeCodeLang === lang ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                    }`}
                  >
                    {lang === 'ts' ? 'React Native' : lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={handleCopyCode}
                className="absolute right-3 top-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>

              <pre className="p-4 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto max-h-64 leading-relaxed">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
