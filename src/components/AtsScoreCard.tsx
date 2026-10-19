import React from 'react';
import { Award, Zap, TrendingUp, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AtsScoreCardProps {
  analysis: AnalysisResult;
}

export const AtsScoreCard: React.FC<AtsScoreCardProps> = ({ analysis }) => {
  const { overallScore, matchScore, impactScore, actionVerbScore, brevityScore } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-600', stroke: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 60) return { text: 'text-amber-600', stroke: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { text: 'text-rose-600', stroke: '#F43F5E', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  const scoreTheme = getScoreColor(overallScore);

  // Circumference for radial progress (r = 45)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Radial Meter */}
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 108 108">
              {/* Background circle */}
              <circle
                cx="54"
                cy="54"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="54"
                cy="54"
                r={radius}
                stroke={scoreTheme.stroke}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black tracking-tight ${scoreTheme.text}`}>
                {overallScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                ATS Score
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className={`w-5 h-5 ${scoreTheme.text}`} />
              <h3 className="text-lg font-extrabold text-slate-900">
                {overallScore >= 80 ? 'ATS Optimized' : overallScore >= 60 ? 'Competitive' : 'Needs Optimization'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              {overallScore >= 80
                ? 'Your resume demonstrates strong technical depth, high action verb density, and measurable impact metrics.'
                : overallScore >= 60
                ? 'Good foundation! Adding more quantifiable metrics (%) and matching target keywords will push your score above 85%.'
                : 'Several critical ATS signals are missing. Boost your bullet points and add target job keywords to pass screening.'}
            </p>
          </div>
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          {/* Match Score */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
              <span className="text-slate-600 font-semibold">Keyword Match</span>
              <span className="font-bold text-slate-900">{matchScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${matchScore}%` }} />
            </div>
          </div>

          {/* Impact Score */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
              <span className="text-slate-600 font-semibold">Impact & Metrics</span>
              <span className="font-bold text-emerald-600">{impactScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${impactScore}%` }} />
            </div>
          </div>

          {/* Brevity Score */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
              <span className="text-slate-600 font-semibold">Length & Brevity</span>
              <span className="font-bold text-slate-900">{brevityScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${brevityScore}%` }} />
            </div>
          </div>

          {/* Action Verbs */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
              <span className="text-slate-600 font-semibold">Action Verbs</span>
              <span className="font-bold text-indigo-600">{actionVerbScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${actionVerbScore}%` }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
