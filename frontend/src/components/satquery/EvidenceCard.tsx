import React from 'react';
import { EvidencePayload } from '@/types/chat';

interface EvidenceCardProps {
  evidence: EvidencePayload;
}

export default function EvidenceCard({ evidence }: EvidenceCardProps) {
  if (!evidence) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mt-4">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
        Evidence & Visualizations
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Render Image/Mask if provided */}
        {evidence.imageUrl && (
          <div className="h-40 bg-slate-100 rounded border border-slate-200 overflow-hidden relative">
            {/* Replace with actual Next/Image in production */}
            <img src={evidence.imageUrl} alt="Spatial Evidence" className="object-cover w-full h-full" />
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Spatial Mask
            </div>
          </div>
        )}

        {/* Render Statistics if provided */}
        {evidence.stats && (
          <div className="flex flex-col justify-center space-y-3 p-4 bg-slate-50 rounded border border-slate-100">
            {Object.entries(evidence.stats).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-slate-500">{key}:</span> 
                <span className="font-semibold text-slate-800">{value}</span>
              </div>
            ))}
            
            {/* Highlighted Change Metric */}
            {evidence.highlightChange && (
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                <span className="text-slate-500">Net Change:</span> 
                <span className="font-bold text-green-600">{evidence.highlightChange}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}