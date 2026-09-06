import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GeoMessage } from '@/lib/store/useGeoChatStore';
import EvidenceCard from './EvidenceCard';
import AnalysisTrace from './AnalysisTrace';

interface ChatMessageProps {
  message: GeoMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-blue-600 text-white px-5 py-3 rounded-xl rounded-tr-sm shadow-sm max-w-[80%] text-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-10 border-b border-slate-200/50 pb-8 last:border-0">
      <div className="w-full max-w-4xl space-y-4">
        
        {/* Main Text Response with Markdown Support */}
        <div className="bg-white border border-slate-200 text-slate-800 px-6 py-4 rounded-xl rounded-tl-sm shadow-sm text-sm leading-relaxed prose prose-sm prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.text || ""}
          </ReactMarkdown>
        </div>

        {/* Dynamic Evidence Panel */}
        {message.evidence && <EvidenceCard evidence={message.evidence} />}

        {/* Expandable Execution Trace */}
        {message.trace && <AnalysisTrace trace={message.trace} />}
      </div>
    </div>
  );
}