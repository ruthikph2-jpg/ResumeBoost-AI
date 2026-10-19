import React, { useEffect, useState } from 'react';
import { 
  History, 
  Trash2, 
  Search,
  RefreshCw,
  FileText,
  Calendar,
  CheckCircle2,
  Award
} from 'lucide-react';
import { fetchScanHistory, clearScanHistoryDb, ScanRecord } from '../utils/sqliteDb';
import toast from 'react-hot-toast';

export const SqliteHistoryView: React.FC = () => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const records = await fetchScanHistory();
      setHistory(records);
    } catch (err) {
      console.error(err);
      toast.error('Could not load history records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your scan history?')) {
      await clearScanHistoryDb();
      setHistory([]);
      toast.success('Scan history cleared.');
    }
  };

  const filteredHistory = history.filter(item => 
    item.target_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-1">
            <History className="w-4 h-4" />
            <span className="uppercase tracking-wider">Previous Analyses</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Scan History
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Review your previous resume evaluations, track your ATS score progression, and compare role requirements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              title="Clear all records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
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
              placeholder="Search by role or candidate name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            {filteredHistory.length} Saved Evaluation(s)
          </span>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4"># ID</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Target Role</th>
                <th className="py-3.5 px-4">ATS Score</th>
                <th className="py-3.5 px-4">Keyword Match</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                    No scan records found yet. Scan your first resume to see it here!
                  </td>
                </tr>
              ) : (
                filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{row.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.candidate_name}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{row.target_role}</td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 font-bold text-indigo-600">{row.match_score}%</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{row.created_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
