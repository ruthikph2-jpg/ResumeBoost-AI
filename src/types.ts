export interface AnalysisResult {
  overallScore: number;
  matchScore: number;
  impactScore: number;
  actionVerbScore: number;
  brevityScore: number;
  wordCount: number;
  detectedMetricsCount: number;
  foundActionVerbs: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletPoints: BulletAnalysis[];
  suggestions: string[];
}

export interface BulletAnalysis {
  id: string;
  original: string;
  score: number;
  hasMetrics: boolean;
  hasActionVerb: boolean;
  improved: string;
  feedback: string;
}

export interface JobPreset {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  description: string;
}
