'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Lock, Building, FileText, Code, Database, X } from 'lucide-react';

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar bg-slate-200">
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 bg-white shadow-sm my-4 border border-slate-300">
        
        {/* Notice Box */}
        <div className="bg-[#FFFFCC] border border-[#FFCC00] p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-800">
            <strong>ATTENTION:</strong> The Data Query Interface (DQI) and Live Telemetry feeds are restricted to authorized nodes only. All access is logged and audited as per national security guidelines.
          </p>
        </div>

        {/* Project Details */}
        <h2 className="text-lg font-bold text-gov-blue border-b border-gov-blue pb-1 mb-4 uppercase mt-0">
          Project Overview & Assessment
        </h2>
        <p className="text-sm text-slate-700 text-justify mb-4 leading-relaxed">
          The National Earth Observation Portal is a secure, multi-tier spatial data infrastructure project developed to facilitate advanced geographical analysis, environmental monitoring, and national planning. It provides varying levels of access to high-resolution optical imagery, live multi-spectral telemetry (including NASA GIBS overlays for NDVI and Thermal), and advanced SQL-based querying capabilities.
        </p>
        <p className="text-sm text-slate-700 text-justify mb-6 leading-relaxed">
          Authorized personnel and institutional researchers can assess environmental trends, execute dynamic data plotting, and perform multispectral comparative analyses directly within the browser environment.
        </p>

        {/* Image Placeholder */}
        <div className="border border-slate-400 p-1 bg-slate-100 mb-8 text-center">
          <div className="w-full h-64 bg-slate-300 border border-slate-400 flex items-center justify-center text-slate-500 font-mono text-sm">
            [ Interface Preview Graphic ]
          </div>
          <p className="text-xs text-slate-600 italic mt-2">
            Fig 1: Interface preview featuring Active Overlays, Target Resolution, and Data Inspector.
          </p>
        </div>

        {/* Access Portals */}
        <h2 className="text-lg font-bold text-gov-blue border-b border-gov-blue pb-1 mb-4 uppercase mt-8">
          System Access Gateways
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Government Portal */}
          <div className="flex-1 border border-slate-300 bg-slate-50 p-6 flex flex-col">
            <h3 className="text-base font-bold text-black border-b border-slate-400 border-dotted pb-2 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gov-blue" /> Government Administrative Portal
            </h3>
            <p className="text-xs text-slate-500 mb-4">Restricted to Central/State departments and Defense personnel.</p>
            <ul className="list-square ml-5 mb-6 text-sm text-slate-700 space-y-1 flex-1">
              <li>Advanced SQL Database Console (DQI)</li>
              <li>Live Confidential Telemetry Feeds</li>
              <li>Dynamic Data Plotting & Analysis</li>
              <li>Multispectral Matrix Comparison</li>
              <li>Secure FITS Array Downloads</li>
            </ul>
            <Link 
              href="/dashboard" 
              className="bg-gov-blue hover:bg-blue-900 text-white font-bold py-2 px-4 text-sm text-center border border-blue-950 transition-colors"
            >
              Gov SSO Login &gt;&gt;
            </Link>
          </div>

          {/* Research Portal */}
          <div className="flex-1 border border-slate-300 bg-slate-50 p-6 flex flex-col">
            <h3 className="text-base font-bold text-black border-b border-slate-400 border-dotted pb-2 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-600" /> Institutional Research Portal
            </h3>
            <p className="text-xs text-slate-500 mb-4">For accredited academic and environmental research institutions.</p>
            <ul className="list-square ml-5 mb-6 text-sm text-slate-700 space-y-1 flex-1">
              <li>OSM Vector & Optical Base Maps</li>
              <li>Standard Regional Telemetry Plots</li>
              <li>Export Metadata (XML / JSON)</li>
              <li>Historical Archive Access</li>
              <li>View-Only Multispectral Tools</li>
            </ul>
            <button className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 text-sm text-center border border-slate-400 transition-colors">
              Academic Login &gt;&gt;
            </button>
          </div>
        </div>

        {/* API Docs Table */}
        <h2 className="text-lg font-bold text-gov-blue border-b border-gov-blue pb-1 mb-4 uppercase mt-8">
          Developer Resources & Documentation
        </h2>
        <p className="text-sm text-slate-700 mb-4">
          To integrate our telemetry and spatial models into departmental applications, review the documentation below. Access to the AI REST API requires an active authentication token.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-sm mb-4">
            <thead className="bg-slate-200 text-slate-800">
              <tr>
                <th className="border border-slate-300 p-2 text-left w-1/4">Resource Type</th>
                <th className="border border-slate-300 p-2 text-left w-2/4">Description</th>
                <th className="border border-slate-300 p-2 text-left w-1/4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-slate-50 transition-colors">
                <td className="border border-slate-300 p-3 font-bold flex items-center gap-2">
                  <Code className="w-4 h-4 text-gov-blue" /> AI Integration
                </td>
                <td className="border border-slate-300 p-3">Comprehensive REST API documentation for querying external AI models to analyze spatial parameters and predict telemetry trends.</td>
                <td className="border border-slate-300 p-3">
                  <button onClick={() => setActiveModal('api')} className="font-bold text-gov-blue hover:text-red-700 hover:underline">
                    [View REST API Endpoints]
                  </button>
                </td>
              </tr>
              <tr className="bg-slate-50 hover:bg-slate-100 transition-colors">
                <td className="border border-slate-300 p-3 font-bold flex items-center gap-2">
                  <Database className="w-4 h-4 text-gov-blue" /> Database & Webportal
                </td>
                <td className="border border-slate-300 p-3">Detailed architecture proposal and syntactical guidelines for utilizing the Data Query Interface (DQI) and Webportal tools.</td>
                <td className="border border-slate-300 p-3">
                  <button onClick={() => setActiveModal('webportal')} className="font-bold text-gov-blue hover:text-red-700 hover:underline">
                    [View Architecture Docs]
                  </button>
                </td>
              </tr>
              <tr className="bg-white hover:bg-slate-50 transition-colors">
                <td className="border border-slate-300 p-3 font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gov-blue" /> SQL Proposal
                </td>
                <td className="border border-slate-300 p-3">Formal project proposal (.docx equivalent) outlining the data structures, schema, and implementation strategy for the telemetry database.</td>
                <td className="border border-slate-300 p-3">
                  <button onClick={() => setActiveModal('sql')} className="font-bold text-gov-blue hover:text-red-700 hover:underline">
                    [View SQL Proposal]
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white text-xs text-center py-4 px-6 mt-auto">
        <p className="mb-2">&copy; 2026 Government of India | Ministry of Earth Sciences. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-2 text-slate-300 mb-2">
          <a href="#" className="hover:text-white hover:underline">Website Policies</a> |
          <a href="#" className="hover:text-white hover:underline">Help</a> |
          <a href="#" className="hover:text-white hover:underline">Contact Us</a> |
          <a href="#" className="hover:text-white hover:underline">Terms and Conditions</a>
        </div>
        <p className="text-slate-400">Designed, Developed and Hosted by National Informatics Centre (NIC)</p>
      </footer>

      {/* --- MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/70 z-[1000] flex justify-center items-center p-4">
          <div className="bg-white border border-slate-500 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gov-blue text-white px-4 py-3 flex justify-between items-center text-sm font-bold tracking-wide shadow-md">
              <span>
                {activeModal === 'api' && 'REST API Documentation (v1.2) - National Earth Observation System'}
                {activeModal === 'webportal' && 'Webportal Architecture & Component Guidelines'}
                {activeModal === 'sql' && 'SQL Database Implementation Proposal (.docx equivalent)'}
              </span>
              <button onClick={closeModal} className="text-slate-300 hover:text-amber-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar text-sm text-slate-800 space-y-4">
              
              {activeModal === 'api' && (
                <>
                  <p>This document outlines the REST API endpoints available for integrating the National Earth Observation Portal's AI and data retrieval capabilities into authorized governmental applications.</p>
                  
                  <h4 className="text-base font-bold text-gov-blue border-b border-slate-300 pb-1 mt-6 mb-2 uppercase">1. Authentication & Access</h4>
                  <p>Access to all endpoints is strictly authenticated. Requests must include a standard Authorization header with a Bearer Token provided by the Centralized Government SSO identity provider (e.g., PARICHAY).</p>
                  <pre className="bg-slate-100 border border-slate-300 p-3 font-mono text-xs overflow-x-auto text-slate-700">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</pre>
                  <p><strong>Rate Limits:</strong> Automated queries are rate-limited to 50 requests per minute per authenticated nodal agency. Exceeding this limit will trigger automated IP suspension and logging in the central security audit.</p>

                  <h4 className="text-base font-bold text-gov-blue border-b border-slate-300 pb-1 mt-6 mb-2 uppercase">2. Core Endpoints</h4>
                  
                  <h5 className="font-bold mt-4 mb-2">2.1 Spatial Parameter Prediction (AI Model)</h5>
                  <p>Predicts short-term environmental and telemetry trends using historical multispectral data (NASA MODIS/VIIRS subsets) processed through our internal machine learning models.</p>
                  <ul className="list-disc ml-6 mt-2 mb-4">
                    <li><strong>Endpoint:</strong> <code className="bg-slate-100 px-1 py-0.5 border border-slate-300 font-mono">POST /api/v1/spatial/predict</code></li>
                    <li><strong>Content-Type:</strong> <code className="bg-slate-100 px-1 py-0.5 border border-slate-300 font-mono">application/json</code></li>
                  </ul>
                  <p><strong>Request Payload:</strong></p>
                  <pre className="bg-slate-100 border border-slate-300 p-3 font-mono text-xs overflow-x-auto text-slate-700">
{`{
  "coordinates": {
    "lat": 31.6340,
    "lon": 74.8723
  },
  "model": "NDVI_TREND",
  "forecast_days": 7
}`}
                  </pre>
                </>
              )}

              {activeModal === 'webportal' && (
                <>
                  <p>This document details the frontend architecture, mapping engines, and operational segregation of the Earth Observation Portal.</p>
                  <h4 className="text-base font-bold text-gov-blue border-b border-slate-300 pb-1 mt-6 mb-2 uppercase">1. Dual-Portal System Architecture</h4>
                  <p>To comply with data security and segregation mandates, the system operates two distinct environments utilizing a shared backend infrastructure but completely isolated frontend feature flags and routing.</p>
                  <ul className="list-disc ml-6 mt-2 mb-4 space-y-2">
                    <li><strong>Institutional Research Portal (Tier-1):</strong> Designed for academia. Provides read-only access to basic OSM Vector mapping, historical data arrays, and limited metadata export. Live high-resolution telemetry is disabled.</li>
                    <li><strong>Government Administrative Portal (Tier-2):</strong> Requires high-level clearance. Features live NASA GIBS telemetry overlays (Night Lights, Thermal LST), confidential metric computation, dynamic plotting, and full access to the Data Query Interface (DQI).</li>
                  </ul>
                </>
              )}

              {activeModal === 'sql' && (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-1">PROPOSAL FOR SPATIAL DATA QUERY INTERFACE (DQI)</h3>
                    <p>Document Ref: GOV-RS-SQL-0926</p>
                    <p className="font-bold text-gov-green">Status: APPROVED</p>
                  </div>
                  <h4 className="text-base font-bold text-gov-blue border-b border-slate-300 pb-1 mt-6 mb-2 uppercase">1. Executive Summary</h4>
                  <p>This proposal outlines the structure and usage syntax for the Data Query Interface (DQI) embedded within the Government Administrative Portal. The DQI is designed to provide analysts with terminal-like SQL access to live and historical telemetry records without requiring direct database management access.</p>
                  
                  <h4 className="text-base font-bold text-gov-blue border-b border-slate-300 pb-1 mt-6 mb-2 uppercase">2. Proposed Schema Structure</h4>
                  <p>The primary dataset accessible via the frontend DQI is the <code className="bg-slate-100 px-1 py-0.5 border border-slate-300 font-mono">telemetry</code> table, structurally defined to handle rapid spatial queries.</p>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}