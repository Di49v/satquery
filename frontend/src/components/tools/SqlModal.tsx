'use client';

import { useState } from 'react';
import { Database, X, GitBranch, Play, Download, Bolt, AlertCircle } from 'lucide-react';
import { useModalStore } from '@/lib/store/useModalStore';
import { useAuditStore } from '@/lib/store/useAuditStore';

// Mock Database
const MOCK_DB = [
  { id: 'T-01', region: 'Amritsar', lat: '31.6340', lon: '74.8723', sensor: 'OPTICAL_HIGH_RES', status: 'ACTIVE', elevation: 232, temp: 35.5, timestamp: '2024-01-01' },
  { id: 'T-02', region: 'Amritsar', lat: '31.6440', lon: '74.8623', sensor: 'THERMAL_IR', status: 'STANDBY', elevation: 230, temp: 36.2, timestamp: '2024-02-01' },
  { id: 'T-03', region: 'New Delhi', lat: '28.6139', lon: '77.2090', sensor: 'RADAR_SAR', status: 'ACTIVE', elevation: 215, temp: 40.1, timestamp: '2024-01-15' },
  { id: 'T-04', region: 'New Delhi', lat: '28.6239', lon: '77.2190', sensor: 'NDVI_MODIS', status: 'OFFLINE', elevation: 218, temp: 38.5, timestamp: '2024-03-01' },
  { id: 'T-05', region: 'Grand Canyon', lat: '36.1069', lon: '-112.1129', sensor: 'ELEVATION_DEM', status: 'ACTIVE', elevation: 2000, temp: 25.0, timestamp: '2024-01-01' },
  { id: 'T-06', region: 'Global', lat: '0.0000', lon: '0.0000', sensor: 'VIIRS_NIGHT', status: 'ACTIVE', elevation: 0, temp: 15.5, timestamp: '2024-04-01' },
  { id: 'T-07', region: 'Leh', lat: '34.1526', lon: '77.5771', sensor: 'OPTICAL_HIGH_RES', status: 'ACTIVE', elevation: 3500, temp: -5.0, timestamp: '2024-01-10' },
  { id: 'T-08', region: 'Mumbai', lat: '19.0760', lon: '72.8777', sensor: 'THERMAL_IR', status: 'ACTIVE', elevation: 14, temp: 32.0, timestamp: '2024-02-15' },
];

export default function SqlModal() {
  const { activeModal, closeModal } = useModalStore();
  const { addLog } = useAuditStore();
  
  const [query, setQuery] = useState("SELECT * FROM telemetry WHERE region = 'Amritsar';");
  const [results, setResults] = useState<any[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (activeModal !== 'sql') return null;

  const executeSql = () => {
    setError(null);
    setResults([]);
    setFields([]);
    
    addLog(`Executing query: ${query.substring(0, 30)}...`);

    const trimmedQuery = query.trim();
    if (!trimmedQuery.toUpperCase().startsWith('SELECT')) {
      setError("Only SELECT queries are supported in this restricted terminal.");
      return;
    }

    const match = trimmedQuery.match(/SELECT\s+(.+?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.+?))?(?:;|$)/i);
    if (!match) {
      setError("Invalid syntax. Expected: SELECT [cols] FROM [table] [WHERE condition];");
      return;
    }

    const [, colsStr, table, whereClause] = match;
    const reqCols = colsStr.split(',').map(s => s.trim());
    
    if (table.toLowerCase() !== 'telemetry') {
      setError(`Relation '${table}' does not exist.`);
      return;
    }

    let data = [...MOCK_DB];

    // Basic WHERE parser
    if (whereClause) {
      const conditionMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*(>=|<=|>|<|=)\s*(['"]?)(.*?)\3/);
      if (conditionMatch) {
        const [, col, op, , val] = conditionMatch;
        data = data.filter(row => {
          const rowVal = row[col as keyof typeof row];
          const numVal = Number(val);
          const numRowVal = Number(rowVal);
          
          if (!isNaN(numVal) && !isNaN(numRowVal)) {
            switch(op) {
              case '>': return numRowVal > numVal;
              case '<': return numRowVal < numVal;
              case '>=': return numRowVal >= numVal;
              case '<=': return numRowVal <= numVal;
              case '=': return numRowVal === numVal;
              default: return false;
            }
          } else {
            return op === '=' && String(rowVal).toLowerCase() === val.toLowerCase();
          }
        });
      } else {
        setError("Unsupported WHERE syntax. Use formats like col = 'val' or col > 10.");
        return;
      }
    }

    if (data.length === 0) {
      setFields([]);
      return; // 0 results, no error
    }

    const finalCols = reqCols[0] === '*' ? Object.keys(data[0]) : reqCols;
    
    const mappedData = data.map(row => {
      const newRow: any = {};
      finalCols.forEach(k => newRow[k] = row[k as keyof typeof row] ?? null);
      return newRow;
    });

    setFields(finalCols);
    setResults(mappedData);
    addLog(`Query Executed: ${mappedData.length} rows retrieved.`);
  };

  const exportCSV = () => {
    if (results.length === 0) return;
    
    const csvRows = [fields.join(',')];
    results.forEach(row => {
      const values = fields.map(k => `"${String(row[k] ?? '')}"`);
      csvRows.push(values.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `govrs_export_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addLog(`Data Exported: ${a.download}`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[1002] flex justify-center items-center p-6 backdrop-blur-sm">
      <div className="bg-slate-200 w-full max-w-6xl h-[85vh] border-2 border-slate-500 flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="bg-gov-header text-white px-4 py-3 border-b border-slate-600 flex justify-between items-center">
          <span className="text-sm font-bold tracking-wider flex items-center">
            <Database className="w-4 h-4 mr-2 text-blue-400" /> GOV.RS DATA QUERY INTERFACE (DQI)
          </span>
          <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Pane: Library */}
          <div className="w-full md:w-1/3 bg-white border-r border-slate-300 flex flex-col overflow-y-auto panel-scroll p-6 text-sm text-slate-800">
            <h2 className="text-lg font-bold text-gov-blue border-b-2 border-gov-accent pb-2 mb-4">Query Library & Export</h2>
            
            <h3 className="font-bold text-gov-blue mb-2 bg-slate-100 p-1.5 border border-slate-200 flex items-center">
              <GitBranch className="w-4 h-4 mr-2" /> Spatial Data Queries
            </h3>
            
            <div className="space-y-1.5 flex flex-col mb-6">
              <button 
                onClick={() => { setQuery("SELECT * FROM telemetry WHERE region = 'Amritsar';"); }} 
                className="text-left text-xs bg-white border border-slate-300 p-1.5 hover:bg-slate-50 transition-colors flex items-center group shadow-sm"
              >
                <Play className="w-3 h-3 text-slate-400 group-hover:text-gov-accent mr-2 shrink-0" />
                <span className="font-mono text-slate-700 font-bold break-all">SELECT * FROM telemetry WHERE region = 'Amritsar';</span>
              </button>
              <button 
                onClick={() => { setQuery("SELECT id, sensor, status FROM telemetry WHERE status = 'ACTIVE';"); }} 
                className="text-left text-xs bg-white border border-slate-300 p-1.5 hover:bg-slate-50 transition-colors flex items-center group shadow-sm"
              >
                <Play className="w-3 h-3 text-slate-400 group-hover:text-gov-accent mr-2 shrink-0" />
                <span className="font-mono text-slate-700 font-bold break-all">SELECT id, sensor, status FROM telemetry WHERE status = 'ACTIVE';</span>
              </button>
              <button 
                onClick={() => { setQuery("SELECT * FROM telemetry WHERE temp > 30;"); }} 
                className="text-left text-xs bg-white border border-slate-300 p-1.5 hover:bg-slate-50 transition-colors flex items-center group shadow-sm"
              >
                <Play className="w-3 h-3 text-slate-400 group-hover:text-gov-accent mr-2 shrink-0" />
                <span className="font-mono text-slate-700 font-bold break-all">SELECT * FROM telemetry WHERE temp &gt; 30;</span>
              </button>
            </div>

            <h3 className="font-bold text-gov-blue mb-2 bg-slate-100 p-1.5 border border-slate-200 flex items-center">
              <Download className="w-4 h-4 mr-2" /> Result Data Export
            </h3>
            <button 
              onClick={exportCSV}
              disabled={results.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold py-2 border border-emerald-800 transition shadow-sm flex justify-center items-center"
            >
              EXPORT TO CSV
            </button>
          </div>

          {/* Right Pane: Terminal */}
          <div className="w-full md:w-2/3 flex flex-col p-4 bg-slate-100">
            <div className="mb-2 flex justify-between items-end">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">SQL Query Input</label>
              <span className="text-[10px] font-mono text-slate-500 font-bold">Standard Syntax Supported</span>
            </div>
            
            <div className="relative mb-4">
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-24 bg-white border border-slate-300 text-slate-800 p-3 font-mono focus:outline-none focus:border-gov-accent text-sm resize-none shadow-inner" 
                spellCheck="false"
              />
              <button 
                onClick={executeSql}
                className="absolute bottom-2 right-2 bg-gov-accent hover:bg-blue-700 text-white px-5 py-1.5 text-xs font-bold border border-blue-900 transition-colors shadow flex items-center"
              >
                <Bolt className="w-3 h-3 mr-1.5" /> EXECUTE
              </button>
            </div>

            {/* Results Table */}
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Query Results</label>
            <div className="flex-1 border border-slate-300 bg-white overflow-auto shadow-sm panel-scroll">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                  <tr>
                    {fields.map(f => (
                      <th key={f} className="p-2 px-3 uppercase border-r border-slate-300 font-bold text-gov-blue">{f}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {error && (
                    <tr><td colSpan={10} className="p-4 text-red-700 bg-red-50 font-medium"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</td></tr>
                  )}
                  {!error && results.length === 0 && fields.length === 0 && (
                    <tr><td colSpan={10} className="p-6 text-center text-slate-400 italic font-mono text-xs">Awaiting query execution...</td></tr>
                  )}
                  {!error && results.length === 0 && fields.length > 0 && (
                    <tr><td colSpan={10} className="p-4 text-slate-500 italic text-center">0 rows returned.</td></tr>
                  )}
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50">
                      {fields.map(f => (
                        <td key={f} className="p-2 px-3 border-r border-slate-200 truncate max-w-[200px] font-mono text-[11px] text-slate-800">
                          {row[f] !== null ? String(row[f]) : <span className="text-slate-400 italic">NULL</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}