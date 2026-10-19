import React from 'react';
import { CheckCircle2, AlertCircle, Plus, Sparkles } from 'lucide-react';

interface KeywordGapCardProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  onAddKeyword: (kw: string) => void;
}

export const KeywordGapCard: React.FC<KeywordGapCardProps> = ({
  matchedKeywords,
  missingKeywords,
  onAddKeyword,
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 glow-effect border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-100 tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            ATS KEYWORD GAP ANALYSIS
          </h3>
          <p className="text-xs text-slate-400">
            Automated screening algorithms rank resumes based on keyword presence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        <div className="p-4 rounded-xl bg-dark-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              MATCHED KEYWORDS ({matchedKeywords.length})
            </span>
          </div>

          {matchedKeywords.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">No direct keyword matches found yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing Keywords */}
        <div className="p-4 rounded-xl bg-dark-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              MISSING IN RESUME ({missingKeywords.length})
            </span>
            <span className="text-[10px] text-slate-500">Click (+) to add to resume</span>
          </div>

          {missingKeywords.length === 0 ? (
            <p className="text-xs text-emerald-400/80 italic py-2">
              🎉 Outstanding! All target job keywords are present in your resume.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => onAddKeyword(kw)}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 group"
                  title={`Add "${kw}" to technical skills`}
                >
                  <span>{kw}</span>
                  <Plus className="w-3 h-3 text-amber-400 group-hover:rotate-90 transition-transform" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
