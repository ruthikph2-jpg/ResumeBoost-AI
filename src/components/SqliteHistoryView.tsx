import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Download, 
  Trash2, 
  Terminal, 
  Sparkles, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Search,
  RefreshCw
} from 'lucide-react';
import { fetchScanHistory, clearScanHistoryDb, downloadSqliteFile, ScanRecord, getDatabase } from '../utils/sqliteDb';
import toast from 'react-hot-toast';

export const SqliteHistoryView: React.FC = () => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSql, setCustomSql] = useState('SELECT * FROM scan_history ORDER BY id DESC;');
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const records = await fetchScanHistory();
      setHistory(records);
    } catch (err) {
      console.error(err);
      toast.error('Could not load records from SQLite database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear all SQLite history records?')) {
      await clearScanHistoryDb();
      setHistory([]);
      setSqlResult(null);
      toast.success('SQLite scan history cleared.');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadSqliteFile();
      toast.success('Downloaded SQLite database (.sqlite)!');
    } catch {
      toast.error('Failed to export SQLite database.');
    }
  };

  const handleRunSql = async () => {
    if (!customSql.trim()) return;
    setSqlError(null);
    try {
      const db = await getDatabase();
      const res = db.exec(customSql);
      if (res.length > 0) {
        const cols = res[0].columns;
        const vals = res[0].values;
        const parsed = vals.map(row => {
          const obj: any = {};
          cols.forEach((c, idx) => { obj[c] = row[idx]; });
          return obj;
        });
        setSqlResult(parsed);
        toast.success(`SQL executed! Returned ${parsed.length} row(s).`);
      } else {
        setSqlResult([]);
        toast.success('Query executed successfully (0 rows returned).');
      }
    } catch (err: any) {
      setSqlError(err.message || 'SQL execution failed');
      toast.error('SQL query failed.');
    }
  };

  const filteredHistory = history.filter(item => 
    item.target_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-1">
            <Database className="w-4 h-4" />
            <span className="uppercase tracking-wider">Embedded SQLite 3.x Database</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              Active WASM
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Resume Scan History & SQL Data Store
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            All resume evaluations, ATS scores, and candidate profiles are stored in an in-memory SQLite database persisted in your browser.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Refresh from SQLite"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download .sqlite DB</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              title="Clear all records"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role or candidate name in SQLite..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            {filteredHistory.length} Record(s) in SQLite
          </span>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-500 tracking-wider">
              <tr>
                <th className="py-3 px-4"># ID</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">ATS Score</th>
                <th className="py-3 px-4">Keyword Match</th>
                <th className="py-3 px-4">Date / Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                    No scan records found in SQLite database.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">#{row.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{row.candidate_name}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{row.target_role}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        row.ats_score >= 80 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.ats_score >= 60
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {row.ats_score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-600">{row.match_score}%</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{row.created_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive SQL Query Console */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Terminal className="w-4 h-4 text-indigo-600" />
          <span>Live SQLite SQL Console</span>
        </div>
        <p className="text-xs text-slate-500">
          Run raw SQL queries against your client-side SQLite database engine:
        </p>

        <div className="space-y-2">
          <textarea
            rows={2}
            value={customSql}
            onChange={(e) => setCustomSql(e.target.value)}
            className="w-full bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
            placeholder="SELECT * FROM scan_history;"
          />
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400">
              Tables: <code className="text-indigo-600 font-semibold font-mono">scan_history</code>, <code className="text-indigo-600 font-semibold font-mono">saved_resumes</code>
            </span>
            <button
              onClick={handleRunSql}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              Run Query
            </button>
          </div>
        </div>

        {sqlError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
            {sqlError}
          </div>
        )}

        {sqlResult && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 overflow-x-auto max-h-60">
            <pre className="text-xs font-mono text-slate-800">
              {JSON.stringify(sqlResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
