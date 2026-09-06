import React from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface AnalysisTraceProps {
  trace: string[];
}

export default function AnalysisTrace({ trace }: AnalysisTraceProps) {
  if (!trace || trace.length === 0) return null;

  return (
    <details className="group bg-slate-50 border border-slate-200 rounded-lg cursor-pointer mt-4">
      <summary className="flex items-center px-4 py-3 text-sm font-semibold text-slate-700 select-none">
        <ChevronRight className="w-4 h-4 mr-2 transition-transform group-open:rotate-90" />
        Analysis Trace
      </summary>
      <div className="px-4 pb-4 pt-1 border-t border-slate-200 space-y-2 text-sm text-slate-600">
        {trace.map((step, index) => (
          <div key={index} className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </details>
  );
}