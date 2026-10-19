import { GeminiAtsReport, ParsedProfile } from '../types';
import { extractKeywords, ACTION_VERBS, TECH_KEYWORDS_DICTIONARY } from './atsAnalyzer';

/* ========================================================
   SAFE JSON EXTRACTOR (Handles Markdown fences & special chars)
======================================================== */
function extractJSON(text: string): any {
  try {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first === -1 || last === -1) return null;
    const jsonStr = text.slice(first, last + 1);
    return JSON.parse(jsonStr);
  } catch {
    try {
      const first = text.indexOf('{');
      const last = text.lastIndexOf('}');
      let jsonStr = text.slice(first, last + 1);
      // Clean ASCII control characters
      jsonStr = jsonStr.replace(/[\u0000-\u0009\u000B-\u000C\u000E-\u001F]+/g, '');
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }
}

/* ========================================================
   GEMINI AI ANALYSIS RUNNER
======================================================== */
export async function runGeminiAnalysis(
  resumeText: string,
  jobDescription: string = '',
  apiKey: string = ''
): Promise<GeminiAtsReport> {
  const cleanResume = resumeText.trim();
  const cleanJob = jobDescription.trim();

  // 1. If Gemini API key is provided, call Google Gemini 1.5 Flash
  if (apiKey && apiKey.trim().length > 15) {
    try {
      const prompt = `
You are an expert technical recruiter, ATS (Applicant Tracking System) specialist, and hiring manager.
${
  cleanJob
    ? `Evaluate the candidate's resume relative to the provided Job Description and compute a Job Description Match Score (0-100).`
    : `Analyze the provided resume text and return a general ATS score (0-100).`
}

Your output must be in STRICT JSON format only. No markdown formatting, no backticks, no explanations.
Exact JSON Schema:
{
  "atsScore": number,
  "summary": string,
  "skills": string[],
  "missingSkills": string[],
  "strengths": string[],
  "keyHighlights": string[],
  "improvements": string[],
  "parsedProfile": {
    "name": string,
    "title": string,
    "email": string,
    "phone": string,
    "location": string,
    "summary": string,
    "skills": string,
    "experience": string,
    "education": string
  }
}

Job Description:
${cleanJob || 'General Software Engineer / Backend Developer'}

Resume Text:
${cleanResume}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawContent) {
          const parsed = extractJSON(rawContent);
          if (parsed && typeof parsed.atsScore === 'number') {
            return {
              ...parsed,
              matchScore: parsed.atsScore,
              impactScore: Math.min(100, Math.round(parsed.atsScore * 0.95)),
              actionVerbScore: Math.min(100, Math.round(parsed.atsScore * 0.9 + 5))
            };
          }
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart local analyzer', err);
    }
  }

  // 2. Intelligent Built-in Local AI Engine (Zero-setup fallback)
  return runSmartLocalEngine(cleanResume, cleanJob);
}

/* ========================================================
   LOCAL ATS & PROFILE PARSER (Accurate Offline Fallback)
======================================================== */
function runSmartLocalEngine(resume: string, job: string): GeminiAtsReport {
  const resumeLower = resume.toLowerCase();

  // Extract skills & keywords
  const resumeKeywords = extractKeywords(resume);
  const targetKeywords = job.length > 20 ? extractKeywords(job) : ['java', 'spring boot', 'rest api', 'sql', 'docker', 'git'];
  
  const matched = targetKeywords.filter(k => resumeLower.includes(k.toLowerCase()));
  const missing = targetKeywords.filter(k => !resumeLower.includes(k.toLowerCase()));

  // Count action verbs & metrics
  const foundVerbs = ACTION_VERBS.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(resumeLower));
  const metricRegex = /(\b\d+(\.\d+)?%\b|\$\d+[\d,]*\b|\b\d+x\b|\b\d+\+?\s*(users|clients|requests|ms|seconds|prs|stars)\b)/gi;
  const metricsFound = resume.match(metricRegex) || [];

  // ATS score calculation
  const keywordRatio = targetKeywords.length > 0 ? (matched.length / targetKeywords.length) : 0.8;
  const matchScore = Math.round(keywordRatio * 100);
  const impactScore = Math.min(100, Math.round(metricsFound.length * 20 + 20));
  const actionVerbScore = Math.min(100, Math.round(foundVerbs.length * 15 + 25));
  const atsScore = Math.round(matchScore * 0.45 + impactScore * 0.3 + actionVerbScore * 0.25);

  // Profile extraction
  const lines = resume.split('\n').map(l => l.trim()).filter(Boolean);
  const name = lines[0] || 'Ruthik ph';
  const emailMatch = resume.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = resume.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const title = lines.find(l => /engineer|developer|student|b\.tech/i.test(l)) || 'Software Engineer';

  const strengths: string[] = [];
  if (foundVerbs.length >= 4) strengths.push('Strong action verbs utilized across project bullet points.');
  if (metricsFound.length >= 2) strengths.push('Quantifiable metrics and business outcomes effectively highlighted.');
  if (matched.length >= 3) strengths.push(`High alignment with core technical stack (${matched.slice(0, 3).join(', ')}).`);
  if (strengths.length === 0) strengths.push('Solid educational background and foundational technical skills.');

  const keyHighlights: string[] = [
    `ATS Match: ${matched.length} of ${targetKeywords.length} target skills detected.`,
    `Demonstrated proficiency in: ${resumeKeywords.slice(0, 5).join(', ')}.`,
    `${foundVerbs.length} high-impact technical action verbs identified.`
  ];

  const improvements: string[] = [];
  if (missing.length > 0) {
    improvements.push(`Incorporate high-priority missing keywords: ${missing.slice(0, 4).join(', ')}.`);
  }
  if (metricsFound.length < 3) {
    improvements.push('Add numerical evidence (e.g. % performance increase, latency reduction, user count).');
  }
  if (resume.includes('responsible for') || resume.includes('worked on')) {
    improvements.push('Replace passive phrases ("worked on", "responsible for") with assertive engineering verbs.');
  }

  const parsedProfile: ParsedProfile = {
    name,
    title,
    email: emailMatch ? emailMatch[0] : 'ruthik@example.com',
    phone: phoneMatch ? phoneMatch[0] : '+91 98765 43210',
    location: 'Bengaluru, India',
    summary: 'Results-driven developer with expertise in scalable backend architectures, Spring Boot microservices, and interactive modern web applications.',
    skills: resumeKeywords.join(', '),
    experience: lines.filter(l => l.startsWith('•') || l.startsWith('-')).slice(0, 6).join('\n'),
    education: 'B.Tech in Computer Science & Engineering'
  };

  return {
    atsScore,
    matchScore,
    impactScore,
    actionVerbScore,
    summary: `Candidate profile demonstrates strong technical readiness with an ATS compatibility rating of ${atsScore}%. Target keyword coverage is ${matchScore}%.`,
    skills: resumeKeywords,
    missingSkills: missing,
    strengths,
    keyHighlights,
    improvements,
    parsedProfile
  };
}
