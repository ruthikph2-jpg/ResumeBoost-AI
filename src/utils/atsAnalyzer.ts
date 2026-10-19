import { AnalysisResult, BulletAnalysis } from '../types';

export const ACTION_VERBS = [
  'accelerated', 'achieved', 'architected', 'automated', 'boosted', 'built',
  'centralized', 'consolidated', 'constructed', 'converted', 'cut', 'decreased',
  'delivered', 'deployed', 'designed', 'developed', 'devised', 'engineered',
  'enhanced', 'established', 'executed', 'expanded', 'expedited', 'formulated',
  'generated', 'halved', 'headed', 'implemented', 'improved', 'increased',
  'initiated', 'instituted', 'integrated', 'launched', 'led', 'leveraged',
  'maximized', 'mentored', 'migrated', 'minimized', 'modernized', 'optimized',
  'orchestrated', 'overhauled', 'pioneered', 'reduced', 'refactored', 'resolved',
  'revamped', 'scaled', 'slashed', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'surpassed', 'transformed', 'upgraded', 'yielded'
];

export const WEAK_PHRASES = [
  'responsible for', 'worked on', 'helped with', 'participated in',
  'assisted in', 'handled', 'was part of', 'duties included', 'tasks were',
  'tried to', 'did', 'attempted'
];

export const TECH_KEYWORDS_DICTIONARY = [
  'java', 'spring boot', 'spring security', 'hibernate', 'jpa', 'react', 'typescript',
  'javascript', 'next.js', 'node.js', 'express', 'python', 'django', 'fastapi',
  'rest api', 'graphql', 'microservices', 'postgresql', 'mysql', 'mongodb', 'redis',
  'kafka', 'rabbitmq', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd',
  'github actions', 'git', 'linux', 'data structures', 'algorithms', 'dsa',
  'system design', 'unit testing', 'junit', 'mockito', 'tailwind css', 'vite'
];

export function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  const found = new Set<string>();

  // Check known tech dictionary
  for (const kw of TECH_KEYWORDS_DICTIONARY) {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    if (regex.test(normalized)) {
      found.add(kw);
    }
  }

  // Also extract prominent capitalized / technical words
  const words = text.match(/\b[A-Za-z0-9+#.]{2,}\b/g) || [];
  const wordFreq: Record<string, number> = {};
  const stopWords = new Set(['the', 'and', 'with', 'for', 'that', 'this', 'have', 'from', 'your', 'will', 'about', 'more', 'work', 'experience', 'team', 'role', 'looking', 'skills', 'responsibilities']);

  for (const w of words) {
    const lower = w.toLowerCase();
    if (!stopWords.has(lower) && lower.length >= 3) {
      wordFreq[lower] = (wordFreq[lower] || 0) + 1;
    }
  }

  // Add top frequency words
  Object.entries(wordFreq)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([w]) => found.add(w));

  return Array.from(found);
}

export function analyzeResume(resumeText: string, jobText: string): AnalysisResult {
  const cleanResume = resumeText.trim();
  const cleanJob = jobText.trim();

  // Word count
  const words = cleanResume.match(/\b\w+\b/g) || [];
  const wordCount = words.length;

  // Action verbs check
  const resumeLower = cleanResume.toLowerCase();
  const foundActionVerbs: string[] = [];
  for (const verb of ACTION_VERBS) {
    if (new RegExp(`\\b${verb}\\b`, 'i').test(resumeLower)) {
      foundActionVerbs.push(verb);
    }
  }

  // Metrics check (%, $, numbers with scale, time improvements)
  const metricRegex = /(\b\d+(\.\d+)?%\b|\$\d+[\d,]*(\.\d+)?\b|\b\d+x\b|\b\d+\+?\s*(users|clients|requests|ms|seconds|minutes|queries|transactions|prs|stars|downloads|endpoints|tests|fps)\b)/gi;
  const metricsFound = cleanResume.match(metricRegex) || [];
  const detectedMetricsCount = metricsFound.length;

  // Job matching
  const jobKeywords = cleanJob.length > 20 ? extractKeywords(cleanJob) : extractKeywords(cleanResume);
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of jobKeywords) {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(resumeLower)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  // Scores calculation (0-100)
  // Match score
  const matchScore = jobKeywords.length > 0
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : 75;

  // Impact score (based on metrics presence)
  const impactScore = Math.min(100, Math.round(detectedMetricsCount * 18 + 15));

  // Action verbs score
  const actionVerbScore = Math.min(100, Math.round(foundActionVerbs.length * 12 + 20));

  // Brevity score (ideal resume between 350 - 750 words)
  let brevityScore = 85;
  if (wordCount < 150) brevityScore = 40;
  else if (wordCount < 300) brevityScore = 65;
  else if (wordCount > 1000) brevityScore = 70;
  else brevityScore = 95;

  // Weighted overall score
  const overallScore = Math.round(
    matchScore * 0.4 +
    impactScore * 0.25 +
    actionVerbScore * 0.25 +
    brevityScore * 0.1
  );

  // Extract and analyze bullet points
  const rawLines = cleanResume.split('\n');
  const bulletCandidates = rawLines
    .map(line => line.trim())
    .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || (line.length > 25 && /^[A-Z]/.test(line)));

  const bulletPoints: BulletAnalysis[] = bulletCandidates.slice(0, 10).map((line, idx) => {
    const cleanLine = line.replace(/^[•\-*]\s*/, '');
    const hasMetric = metricRegex.test(cleanLine);
    const firstWord = (cleanLine.split(/\s+/)[0] || '').toLowerCase();
    const hasAction = ACTION_VERBS.includes(firstWord);

    let score = 50;
    if (hasAction) score += 25;
    if (hasMetric) score += 25;

    // Generate smart improvement recommendation
    let improved = cleanLine;
    let feedback = 'Strong bullet point with clear action and scope.';

    if (!hasAction && !hasMetric) {
      improved = `Spearheaded ${cleanLine.charAt(0).toLowerCase() + cleanLine.slice(1)}, improving operational efficiency by 35% and reducing latency across services.`;
      feedback = 'Missing strong action verb and quantifiable outcome. Apply Google XYZ formula (Accomplished [X] by doing [Z] as measured by [Y]).';
    } else if (!hasMetric) {
      improved = `${cleanLine}, boosting throughput by 40% and supporting 10k+ concurrent requests.`;
      feedback = 'Great action verb, but lacks quantifiable business or performance impact.';
    } else if (!hasAction) {
      improved = `Engineered and delivered ${cleanLine.charAt(0).toLowerCase() + cleanLine.slice(1)}`;
      feedback = 'Contains metrics, but starts passively. Begin with an assertive technical action verb.';
    }

    return {
      id: `bullet-${idx}`,
      original: cleanLine,
      score,
      hasMetrics: hasMetric,
      hasActionVerb: hasAction,
      improved,
      feedback
    };
  });

  // Actionable suggestions
  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Add top missing keywords from job description: ${missingKeywords.slice(0, 4).join(', ')}.`);
  }
  if (detectedMetricsCount < 3) {
    suggestions.push('Include more quantifiable data (e.g. percentages, user volume, latency reductions, dollar amounts).');
  }
  if (foundActionVerbs.length < 5) {
    suggestions.push('Strengthen sentences with punchy action verbs like "Architected", "Spearheaded", "Optimized".');
  }
  if (cleanResume.includes('responsible for') || cleanResume.includes('worked on')) {
    suggestions.push('Eliminate passive phrases like "responsible for" or "worked on" in favor of direct ownership verbs.');
  }

  return {
    overallScore,
    matchScore,
    impactScore,
    actionVerbScore,
    brevityScore,
    wordCount,
    detectedMetricsCount,
    foundActionVerbs,
    matchedKeywords,
    missingKeywords,
    bulletPoints,
    suggestions
  };
}
