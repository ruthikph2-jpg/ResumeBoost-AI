import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { ResumeUploader } from './components/ResumeUploader';
import { JobMatcher } from './components/JobMatcher';
import { AtsScoreCard } from './components/AtsScoreCard';
import { KeywordGapCard } from './components/KeywordGapCard';
import { BulletPointOptimizer } from './components/BulletPointOptimizer';
import { ResumeLiveEditor } from './components/ResumeLiveEditor';
import { RoadmapView } from './components/RoadmapView';
import { ExportModal } from './components/ExportModal';
import { runGeminiAnalysis } from './utils/aiAnalysisService';
import { analyzeResume } from './utils/atsAnalyzer';
import { GeminiAtsReport, ParsedProfile } from './types';
import { Download, Sparkles, AlertCircle, Loader2, CheckCircle2, Award, ArrowRight } from 'lucide-react';

const DEFAULT_RESUME = `Ruthik ph
B.Tech Computer Science & Engineering | Java Full Stack Developer
Email: ruthik@example.com | Phone: +91 98765 43210 | Bengaluru, India
GitHub: github.com/ruthikph2-jpg

TECHNICAL SKILLS:
Languages: Java, SQL, JavaScript, TypeScript
Frameworks & Libraries: Spring Boot, Spring Security, Hibernate, React, Tailwind CSS, REST APIs
Databases & Tools: PostgreSQL, MySQL, Docker, Git, Maven, Postman

EXPERIENCE & PROJECTS:
CodeReel - Interactive Java Learning & Execution Visualizer
• Built an interactive Java execution platform turning debugging traces into step-by-step animations.
• Implemented Spring Boot REST APIs for code execution, compilation, and snapshot trace storage.
• Developed React & Monaco editor frontend with Framer Motion animations for Stacks, Queues, and Linked Lists.
• Reduced visual debugging cycle time by 40% through real-time state visualization.

BugShield - AI Bug Detector & Auto-Fixer
• Engineered automated code analysis pipeline integrating Gemini AI for bug detection and patch generation.
• Designed modular microservices architecture utilizing Spring Boot and PostgreSQL with sub-100ms response times.
• Wrote comprehensive JUnit integration tests achieving 85% test coverage across core controller endpoints.
• Deployed full stack application on Docker and cloud hosting supporting concurrent user analyses.
`;

const DEFAULT_JOB = `Java Backend & Microservices Developer
We are looking for a motivated Java Developer to build reliable, high-performance web applications and REST APIs.
Requirements:
- Strong knowledge of Java, Spring Boot, and relational databases (PostgreSQL/MySQL).
- Experience with RESTful APIs, Docker, and Git.
- Exposure to frontend frameworks like React is a plus.
- Solid understanding of Data Structures, Algorithms (DSA), and Object-Oriented Design.
- Passion for writing clean code and unit tests with JUnit.`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'editor' | 'roadmap'>('analysis');
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);
  const [jobText, setJobText] = useState(DEFAULT_JOB);
  const [apiKey, setApiKey] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Gemini AI Report State
  const [aiReport, setAiReport] = useState<GeminiAtsReport | null>(null);

  // Parsed Profile State for Visual Canvas Editor
  const [profile, setProfile] = useState<ParsedProfile>({
    name: 'Ruthik ph',
    title: 'Java Full Stack Developer',
    email: 'ruthik@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    summary: 'Results-driven software engineer specializing in scalable Spring Boot microservices, high-throughput REST APIs, and modern React interfaces.',
    skills: 'Java, Spring Boot, Spring Security, React, TypeScript, PostgreSQL, Docker, Git, DSA',
    experience: `• CodeReel: Built interactive Java visualizer turning execution traces into step-by-step animations, reducing debug time by 40%.
• BugShield: Engineered AI bug detector pipeline using Gemini AI and Spring Boot microservices with sub-100ms latency.
• Achieved 85% JUnit test coverage and deployed containerized services on Docker.`,
    education: 'B.Tech in Computer Science & Engineering'
  });

  // Local rule-based analyzer for detailed bullets
  const localAnalysis = analyzeResume(resumeText, jobText);

  // Trigger analysis automatically on first load or when user clicks
  const triggerAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const report = await runGeminiAnalysis(resumeText, jobText, apiKey);
      setAiReport(report);
      if (report.parsedProfile) {
        setProfile(report.parsedProfile);
      }
      toast.success('AI ATS evaluation complete!');
    } catch {
      toast.error('Analysis failed, using local metrics.');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    triggerAiAnalysis();
  }, []); // Run on initial mount

  // Handle adding missing keywords to skills section
  const handleAddKeyword = (kw: string) => {
    if (resumeText.toLowerCase().includes('skills:')) {
      const parts = resumeText.split(/(skills:)/i);
      const updated = parts[0] + parts[1] + ` ${kw},` + parts.slice(2).join('');
      setResumeText(updated);
    } else {
      setResumeText(prev => `${prev}\n\nTECHNICAL SKILLS: ${kw}`);
    }
    toast.success(`Added "${kw}" to technical skills!`);
  };

  // Handle accepting and replacing an AI-rewritten bullet point
  const handleReplaceBullet = (original: string, improved: string) => {
    if (resumeText.includes(original)) {
      setResumeText(prev => prev.replace(original, improved));
      toast.success('Resume updated with AI-optimized bullet!');
    } else {
      toast.error('Could not locate original bullet in text.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#F3F4F6',
            border: '1px solid #374151',
            fontSize: '12px',
          },
        }}
      />

      <Navbar
        apiKey={apiKey}
        setApiKey={setApiKey}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary-950/40 via-dark-800 to-dark-800 border border-primary-500/20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI-Powered ATS Resume Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI ATS Scoring, Visual Editor & Placement Roadmaps
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Upload your resume PDF, analyze ATS keyword gaps with Gemini AI, customize templates in the visual editor, and follow structured career pathways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerAiAnalysis}
              disabled={analyzing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{analyzing ? 'Analyzing with AI...' : 'Run AI ATS Scan'}</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-dark-700 hover:bg-dark-600 border border-slate-600 text-slate-200 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ─── TAB 1: ATS SCANNER & ANALYZER ─── */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* ATS Score Overview Card */}
            <AtsScoreCard
              analysis={{
                ...localAnalysis,
                overallScore: aiReport?.atsScore ?? localAnalysis.overallScore,
                matchScore: aiReport?.matchScore ?? localAnalysis.matchScore,
              }}
            />

            {/* AI Insights & Summary */}
            {aiReport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Strengths */}
                <div className="p-4 rounded-xl bg-dark-800/80 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AI DETECTED STRENGTHS</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {aiReport.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Improvements */}
                <div className="p-4 rounded-xl bg-dark-800/80 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>CRITICAL ATS IMPROVEMENTS</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {aiReport.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 2-Column Core Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* Left Column: Input (Resume + Job) */}
              <div className="space-y-6">
                <ResumeUploader
                  resumeText={resumeText}
                  setResumeText={setResumeText}
                  wordCount={localAnalysis.wordCount}
                />
                <JobMatcher
                  jobText={jobText}
                  setJobText={setJobText}
                />
              </div>

              {/* Right Column: Keyword Gap & Bullet Optimizer */}
              <div className="space-y-6">
                <KeywordGapCard
                  matchedKeywords={localAnalysis.matchedKeywords}
                  missingKeywords={aiReport?.missingSkills && aiReport.missingSkills.length > 0 ? aiReport.missingSkills : localAnalysis.missingKeywords}
                  onAddKeyword={handleAddKeyword}
                />

                <BulletPointOptimizer
                  bullets={localAnalysis.bulletPoints}
                  apiKey={apiKey}
                  onReplaceBullet={handleReplaceBullet}
                />
              </div>

            </div>

            {/* Link to Editor Callout */}
            <div className="p-4 rounded-xl bg-primary-950/20 border border-primary-500/30 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Ready to customize and format your resume for job applications?
              </div>
              <button
                onClick={() => setActiveTab('editor')}
                className="flex items-center gap-1.5 text-xs font-bold text-primary-300 hover:text-primary-200"
              >
                <span>Open Visual Resume Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 2: VISUAL RESUME CANVAS EDITOR ─── */}
        {activeTab === 'editor' && (
          <ResumeLiveEditor
            profile={profile}
            setProfile={setProfile}
            apiKey={apiKey}
          />
        )}

        {/* ─── TAB 3: CAREER ROADMAPS ─── */}
        {activeTab === 'roadmap' && (
          <RoadmapView />
        )}

      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        resumeText={resumeText}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>
          ResumeBoost AI — Created by{' '}
          <a
            href="https://github.com/ruthikph2-jpg"
            target="_blank"
            rel="noreferrer"
            className="text-primary-400 hover:underline font-semibold"
          >
            Ruthik ph
          </a>{' '}
          • B.Tech CSE • All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
