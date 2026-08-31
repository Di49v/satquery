'use client';

import ControlPanel from '@/components/layout/ControlPanel';
import DataInspector from '@/components/layout/DataInspector';
import MapWrapper from '@/components/map/MapWrapper';

export default function DashboardPage() {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-300">
      <ControlPanel />
      
      <main className="flex-1 relative flex flex-col">
        <MapWrapper />
      </main>

      <DataInspector />
    </div>
  );
}