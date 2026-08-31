'use client';

import dynamic from 'next/dynamic';
import ControlPanel from '@/components/layout/ControlPanel';
import DataInspector from '@/components/layout/DataInspector';
import MapWrapper from '@/components/map/MapWrapper';
import GeoChatPanel from '@/components/tools/GeoChatPanel';
import SqlModal from '@/components/tools/SqlModal'; 
import AnalysisModal from '@/components/tools/AnalysisModal'; 

const CompareModal = dynamic(() => import('@/components/tools/CompareModal'), { ssr: false });

export default function DashboardPage() {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-300 relative">
      <ControlPanel />
      
      <main className="flex-1 relative flex flex-col">
        <MapWrapper />
        
        <div className="absolute bottom-6 right-6 z-[450]">
          <GeoChatPanel />
        </div>
      </main>

      <DataInspector />
      
      {/* Modals mount here, hidden by default */}
      <SqlModal />
      <AnalysisModal />
      <CompareModal/>
    </div>
  );
}