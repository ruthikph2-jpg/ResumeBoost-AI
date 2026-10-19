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

export interface ParsedProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
}

export interface GeminiAtsReport {
  atsScore: number;
  summary: string;
  skills: string[];
  missingSkills: string[];
  strengths: string[];
  keyHighlights: string[];
  improvements: string[];
  matchScore?: number;
  impactScore?: number;
  actionVerbScore?: number;
  parsedProfile: ParsedProfile;
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

export interface RoadmapMilestone {
  level: number;
  title: string;
  description: string;
  topics: string[];
  projectIdea: string;
}
