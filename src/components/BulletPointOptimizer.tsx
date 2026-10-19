import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { BulletAnalysis } from '../types';
import { boostBulletWithGemini } from '../utils/geminiEnhancer';
import toast from 'react-hot-toast';

interface BulletPointOptimizerProps {
  bullets: BulletAnalysis[];
  apiKey: string;
  onReplaceBullet: (original: string, improved: string) => void;
}

export const BulletPointOptimizer: React.FC<BulletPointOptimizerProps> = ({
  bullets,
  apiKey,
  onReplaceBullet,
}) => {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [customImprovedMap, setCustomImprovedMap] = useState<Record<string, string>>({});

  const handleBoost = async (bullet: BulletAnalysis) => {
    setLoadingMap(prev => ({ ...prev, [bullet.id]: true }));
    try {
      const boosted = await boostBulletWithGemini(bullet.original, 'Software Engineer', apiKey);
      setCustomImprovedMap(prev => ({ ...prev, [bullet.id]: boosted }));
      toast.success('Bullet point boosted using Google XYZ formula!');
    } catch {
      toast.error('Failed to boost bullet point.');
    } finally {
      setLoadingMap(prev => ({ ...prev, [bullet.id]: false }));
    }
  };

  if (bullets.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center py-10">
        <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">
          No bullet points detected in your resume yet. Add bullets starting with (•, -, or *) to optimize them.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Bullet Point Optimizer (Google XYZ Formula)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transforms weak descriptions into high-impact, metric-driven achievements
          </p>
        </div>
        <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          {bullets.length} bullets analyzed
        </span>
      </div>

      <div className="space-y-4">
        {bullets.map((bullet) => {
          const currentImproved = customImprovedMap[bullet.id] || bullet.improved;
          const isLoading = loadingMap[bullet.id];

          return (
            <div
              key={bullet.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 transition-all hover:border-slate-300"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {bullet.hasMetrics ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Contains Metrics
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Missing Quantifiable Metrics
                    </span>
                  )}
                  {bullet.hasActionVerb && (
                    <span className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      Strong Action Verb
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleBoost(bullet)}
                  disabled={isLoading}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                  title="Generate alternative AI rewrite"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Re-optimizing...' : 'Regenerate'}</span>
                </button>
              </div>

              {/* Original Bullet */}
              <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                <span className="font-bold text-slate-700 uppercase text-[10px] block mb-0.5 tracking-wider">
                  Original:
                </span>
                {bullet.original}
              </div>

              {/* Improved Bullet */}
              <div className="text-xs text-slate-800 bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100 leading-relaxed font-medium">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-indigo-700 uppercase text-[10px] flex items-center gap-1 tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    AI XYZ Optimized:
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium">
                    Google XYZ Formula
                  </span>
                </div>
                {currentImproved}
              </div>

              {/* 1-Click Accept */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onReplaceBullet(bullet.original, currentImproved)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Resume</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
