'use client';

import { useState, useMemo, useEffect } from 'react';
import { LineChart, X, Sliders, Filter, Info } from 'lucide-react';
import { useModalStore } from '@/lib/store/useModalStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Fallback database if modal is opened without a payload
const MOCK_DB = [
  { region: 'Amritsar', sensor: 'OPTICAL_HIGH_RES', temp: 35.5, elevation: 232, timestamp: '2024-01-01' },
  { region: 'Amritsar', sensor: 'THERMAL_IR', temp: 36.2, elevation: 230, timestamp: '2024-02-01' },
  { region: 'New Delhi', sensor: 'RADAR_SAR', temp: 40.1, elevation: 215, timestamp: '2024-01-15' },
  { region: 'New Delhi', sensor: 'NDVI_MODIS', temp: 38.5, elevation: 218, timestamp: '2024-03-01' },
  { region: 'Leh', sensor: 'OPTICAL_HIGH_RES', temp: -5.0, elevation: 3500, timestamp: '2024-01-10' },
  { region: 'Mumbai', sensor: 'THERMAL_IR', temp: 32.0, elevation: 14, timestamp: '2024-02-15' },
  { region: 'Amritsar', sensor: 'NDVI_MODIS', temp: 28.5, elevation: 232, timestamp: '2024-06-01' }
];

export default function AnalysisModal() {
  const { activeModal, closeModal, analysisPayload } = useModalStore();
  
  const [type, setType] = useState<'line' | 'bar' | 'scatter'>('line');
  const [xCol, setXCol] = useState('timestamp');
  const [yCol, setYCol] = useState('temp');
  const [groupCol, setGroupCol] = useState('none');
  const [locFilter, setLocFilter] = useState('ALL');

  const sourceData = analysisPayload?.data && analysisPayload.data.length > 0 ? analysisPayload.data : MOCK_DB;
  const columns = sourceData.length > 0 ? Object.keys(sourceData[0]) : [];
  const regions = Array.from(new Set(sourceData.map((d: any) => String(d.region)).filter(Boolean)));

  // Auto-select valid defaults when data changes
  useEffect(() => {
    if (columns.length > 0) {
      setXCol(columns.includes('timestamp') ? 'timestamp' : columns[0]);
      setYCol(columns.includes('temp') ? 'temp' : columns[1] || columns[0]);
      setGroupCol(columns.includes('sensor') ? 'sensor' : 'none');
    }
  }, [analysisPayload]);

  // Chart data computation
  const chartData = useMemo(() => {
    let filtered = sourceData.filter((d: any) => locFilter === 'ALL' || String(d.region) === locFilter);
    filtered = filtered.filter((d: any) => d[xCol] != null && d[yCol] != null);
    filtered.sort((a: any, b: any) => (a[xCol] > b[xCol] ? 1 : -1));

    const labels = Array.from(new Set(filtered.map((d: any) => String(d[xCol]))));
    const datasets: any[] = [];

    if (groupCol !== 'none') {
      const groups = Array.from(new Set(filtered.map((d: any) => String(d[groupCol]))));
      groups.forEach((g, i) => {
        const groupData = filtered.filter((d: any) => String(d[groupCol]) === g);
        const color = `hsl(${i * (360 / Math.max(groups.length, 1))}, 75%, 45%)`;
        
        const dataPoints = type === 'scatter' 
          ? groupData.map((d: any) => ({ x: Number(d[xCol]) || d[xCol], y: Number(d[yCol]) || 0 }))
          : labels.map(l => {
              const matches = groupData.filter((d: any) => String(d[xCol]) === l);
              const sum = matches.reduce((acc, curr) => acc + Number(curr[yCol] || 0), 0);
              return matches.length ? sum / matches.length : null;
            });

        datasets.push({ label: g as string, data: dataPoints, borderColor: color, backgroundColor: type === 'line' ? 'transparent' : color, borderWidth: 2, tension: 0.1, spanGaps: true });
      });
    } else {
      const color = '#2563eb';
      const dataPoints = type === 'scatter' 
          ? filtered.map((d: any) => ({ x: Number(d[xCol]) || d[xCol], y: Number(d[yCol]) || 0 }))
          : labels.map(l => {
              const matches = filtered.filter((d: any) => String(d[xCol]) === l);
              const sum = matches.reduce((acc, curr) => acc + Number(curr[yCol] || 0), 0);
              return matches.length ? sum / matches.length : null;
            });
      datasets.push({ label: yCol.toUpperCase(), data: dataPoints, borderColor: color, backgroundColor: type === 'line' ? 'transparent' : color, borderWidth: 2, tension: 0.1 });
    }

    return { labels: type !== 'scatter' ? labels : [], datasets };
  }, [sourceData, type, xCol, yCol, groupCol, locFilter]);

  if (activeModal !== 'analysis') return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[1003] flex justify-center items-center p-6 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[85vh] border-2 border-slate-500 flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="bg-gov-header text-white px-4 py-3 border-b border-slate-600 flex justify-between items-center">
          <span className="text-sm font-bold tracking-wider flex items-center">
            <LineChart className="w-4 h-4 mr-2 text-purple-400" /> DYNAMIC DATA ANALYSIS & PLOTTING
          </span>
          <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Controls Side */}
          <div className="w-72 bg-slate-50 border-r border-slate-300 p-5 flex flex-col space-y-3 text-sm text-slate-800 overflow-y-auto panel-scroll shrink-0">
            <h3 className="font-bold text-gov-blue border-b-2 border-purple-300 pb-1 flex items-center"><Sliders className="w-4 h-4 mr-2" /> Plot Config</h3>
            
            <label className="block text-[10px] font-bold text-slate-600 uppercase">Chart Format</label>
            <select value={type} onChange={(e: any) => setType(e.target.value)} className="w-full p-2 border border-slate-300 text-xs focus:border-purple-500 outline-none bg-white">
              <option value="line">Line Graph (Trends)</option>
              <option value="bar">Bar Chart (Categorical)</option>
              <option value="scatter">Scatter Plot (Correlation)</option>
            </select>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">X-Axis</label>
                <select value={xCol} onChange={(e) => setXCol(e.target.value)} className="w-full p-2 border border-slate-300 text-xs bg-white">
                  {columns.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Y-Axis</label>
                <select value={yCol} onChange={(e) => setYCol(e.target.value)} className="w-full p-2 border border-slate-300 text-xs bg-white">
                  {columns.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            <label className="block text-[10px] font-bold text-slate-600 uppercase mt-2">Compare By (Series Split)</label>
            <select value={groupCol} onChange={(e) => setGroupCol(e.target.value)} className="w-full p-2 border border-slate-300 text-xs bg-white">
              <option value="none">-- No Comparison --</option>
              {columns.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>

            <h3 className="font-bold text-gov-blue border-b-2 border-amber-300 pb-1 mt-4 flex items-center"><Filter className="w-4 h-4 mr-2" /> Data Filters</h3>
            <label className="block text-[10px] font-bold text-slate-600 uppercase">Location Filter</label>
            <select value={locFilter} onChange={(e) => setLocFilter(e.target.value)} className="w-full p-2 border border-slate-300 text-xs bg-white">
              <option value="ALL">All Available Regions</option>
              {regions.map((r: any) => <option key={r} value={r}>{r}</option>)}
            </select>

            <div className="bg-blue-50 p-3 border border-blue-200 text-[10px] text-blue-900 rounded-sm mt-auto font-medium">
              <Info className="w-4 h-4 mb-1 inline mr-1" />
              Data mapped directly from {analysisPayload?.source === 'sql' ? 'DQI SQL Query Results.' : 'Active Dataset.'}
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-1 p-6 flex items-center justify-center bg-white relative">
            <div className="w-full h-full relative">
              <Chart 
                type={type} 
                data={chartData} 
                options={{ 
                  responsive: true, maintainAspectRatio: false, 
                  plugins: { title: { display: true, text: `Analysis: ${yCol.toUpperCase()} vs ${xCol.toUpperCase()}`, font: { size: 16 } } } 
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}