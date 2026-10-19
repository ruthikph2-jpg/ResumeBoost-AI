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
      <div className="glass-card rounded-2xl p-6 glow-effect border border-slate-800 text-center py-10">
        <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-400">
          No bullet points detected in your resume yet. Add bullets starting with (•, -, or *) to optimize them.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 glow-effect border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-100 tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            AI BULLET POINT OPTIMIZER (GOOGLE XYZ FORMULA)
          </h3>
          <p className="text-xs text-slate-400">
            Transforms weak descriptions into high-impact, metric-driven achievements
          </p>
        </div>
        <span className="text-xs text-primary-400 font-mono">
          {bullets.length} bullets analyzed
        </span>
      </div>

      <div className="space-y-4">
        {bullets.map((b) => {
          const improvedText = customImprovedMap[b.id] || b.improved;
          const isLoading = loadingMap[b.id];

          return (
            <div
              key={b.id}
              className="p-4 rounded-xl bg-dark-900/90 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3"
            >
              {/* Header Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    b.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    b.score >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    Score: {b.score}/100
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={`flex items-center gap-1 ${b.hasActionVerb ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {b.hasActionVerb ? <Check className="w-3 h-3" /> : '○'} Action Verb
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className={`flex items-center gap-1 ${b.hasMetrics ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {b.hasMetrics ? <Check className="w-3 h-3" /> : '○'} Quantifiable Metrics
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleBoost(b)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 border border-primary-500/30 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Enhancing...' : 'Re-Boost AI'}</span>
                </button>
              </div>

              {/* Original */}
              <div className="p-2.5 rounded-lg bg-dark-800/60 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
                <span className="text-slate-500 select-none mr-2">BEFORE:</span>
                {b.original}
              </div>

              {/* Improved */}
              <div className="p-2.5 rounded-lg bg-primary-950/20 border border-primary-500/30 text-xs font-mono text-primary-200 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-primary-400 font-bold select-none mr-2">AI REWRITE:</span>
                  <span>{improvedText}</span>
                </div>
                
                <button
                  onClick={() => onReplaceBullet(b.original, improvedText)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/20 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept Rewrite</span>
                </button>
              </div>

              {/* Diagnostic Feedback */}
              <p className="text-[11px] text-slate-400 italic">
                💡 {b.feedback}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
