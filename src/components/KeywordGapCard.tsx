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
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            ATS Keyword Gap Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated screening algorithms rank resumes based on keyword presence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              MATCHED KEYWORDS ({matchedKeywords.length})
            </span>
          </div>

          {matchedKeywords.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">No direct keyword matches found yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing Keywords */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              MISSING SKILLS ({missingKeywords.length})
            </span>
          </div>

          {missingKeywords.length === 0 ? (
            <p className="text-xs text-emerald-600 font-medium italic py-2">
              🎉 100% keyword match! No critical skills missing.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {missingKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => onAddKeyword(kw)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 hover:border-amber-300 flex items-center gap-1 transition-all group shadow-sm"
                  title={`Add "${kw}" to your resume`}
                >
                  <Plus className="w-3 h-3 text-amber-600 group-hover:scale-125 transition-transform" />
                  <span>{kw}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
