import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { ScannerLanding, ROLE_TEMPLATES } from './components/ScannerLanding';
import { AtsScoreCard } from './components/AtsScoreCard';
import { KeywordGapCard } from './components/KeywordGapCard';
import { BulletPointOptimizer } from './components/BulletPointOptimizer';
import { ResumeLiveEditor } from './components/ResumeLiveEditor';
import { RoadmapView } from './components/RoadmapView';
import { ExportModal } from './components/ExportModal';
import { runGeminiAnalysis } from './utils/aiAnalysisService';
import { analyzeResume } from './utils/atsAnalyzer';
import { GeminiAtsReport, ParsedProfile } from './types';
import { 
  Download, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  Compass, 
  RotateCcw,
  FileText
} from 'lucide-react';

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

const DEFAULT_JOB = ROLE_TEMPLATES.java_backend.description;

export default function App() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'editor' | 'roadmap'>('analysis');
  const [scannerView, setScannerView] = useState<'landing' | 'results'>('landing');
  const [selectedRole, setSelectedRole] = useState('java_backend');
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);
  const [jobText, setJobText] = useState(DEFAULT_JOB);
  const [apiKey, setApiKey] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [showRawResumeToggle, setShowRawResumeToggle] = useState(false);

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

  // Trigger analysis with progress animation
  const handleStartScan = async () => {
    if (!resumeText.trim()) {
      toast.error('Please upload or paste a resume first.');
      return;
    }

    setAnalyzing(true);
    setScanProgress(10);
    setScanStage('Parsing resume document structure...');

    const progressTimer = setInterval(() => {
      setScanProgress((prev) => {
        if (prev < 35) {
          setScanStage('Extracting technical competencies & project impact...');
          return prev + 12;
        }
        if (prev < 70) {
          setScanStage('Matching against role requirements with Gemini AI...');
          return prev + 10;
        }
        if (prev < 90) {
          setScanStage('Generating Google XYZ bullet improvements & ATS metrics...');
          return prev + 6;
        }
        return prev;
      });
    }, 350);

    try {
      const report = await runGeminiAnalysis(resumeText, jobText, apiKey);
      clearInterval(progressTimer);
      setScanProgress(100);
      setScanStage('Analysis complete! Preparing ATS report...');
      setAiReport(report);
      if (report.parsedProfile) {
        setProfile(report.parsedProfile);
      }
      setTimeout(() => {
        setAnalyzing(false);
        setScannerView('results');
        toast.success('AI ATS evaluation complete!');
      }, 500);
    } catch {
      clearInterval(progressTimer);
      setScanProgress(100);
      setTimeout(() => {
        setAnalyzing(false);
        setScannerView('results');
        toast.error('Scan completed with offline rule analyzer.');
      }, 500);
    }
  };

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
        
        {/* ─── TAB 1: ATS SCANNER & ANALYZER ─── */}
        {activeTab === 'analysis' && (
          <>
            {scannerView === 'landing' ? (
              <ScannerLanding
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                jobText={jobText}
                setJobText={setJobText}
                resumeText={resumeText}
                setResumeText={setResumeText}
                onStartScan={handleStartScan}
                analyzing={analyzing}
                scanProgress={scanProgress}
                scanStage={scanStage}
              />
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Top Action Bar in Results Mode */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-800/80 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setScannerView('landing')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-dark-700 hover:bg-dark-600 text-slate-200 border border-slate-600 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Scan Another Resume</span>
                    </button>
                    <div className="text-xs text-slate-400">
                      Target Role:{' '}
                      <span className="font-semibold text-primary-300">
                        {ROLE_TEMPLATES[selectedRole]?.title || 'Custom Role'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveTab('editor')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/20 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Open Live Resume Editor</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-dark-700 hover:bg-dark-600 text-slate-200 border border-slate-600 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Career Roadmap</span>
                    </button>
                    <button
                      onClick={() => setIsExportOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-dark-700 hover:bg-dark-600 text-slate-200 border border-slate-600 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* ATS Score Overview Card */}
                <AtsScoreCard
                  analysis={{
                    ...localAnalysis,
                    overallScore: aiReport?.atsScore ?? localAnalysis.overallScore,
                    matchScore: aiReport?.matchScore ?? localAnalysis.matchScore,
                  }}
                />

                {/* AI Summary Banner if present */}
                {aiReport?.summary && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary-950/30 to-dark-800 border border-primary-500/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-300 mb-1">
                      <Sparkles className="w-4 h-4 text-primary-400" />
                      <span>AI EXECUTIVE SUMMARY & ATS EVALUATION</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aiReport.summary}
                    </p>
                  </div>
                )}

                {/* AI Insights & Diagnostics */}
                {aiReport && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* AI Strengths */}
                    <div className="p-5 rounded-xl bg-dark-800/80 border border-emerald-500/20 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>AI DETECTED STRENGTHS</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {aiReport.strengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold mt-0.5">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Improvements */}
                    <div className="p-5 rounded-xl bg-dark-800/80 border border-amber-500/20 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>CRITICAL ATS IMPROVEMENTS</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {aiReport.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold mt-0.5">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2-Column Core Insights: Keyword Gap + Bullet Optimizer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  
                  {/* Left: Keyword Gap Card */}
                  <KeywordGapCard
                    matchedKeywords={localAnalysis.matchedKeywords}
                    missingKeywords={aiReport?.missingSkills && aiReport.missingSkills.length > 0 ? aiReport.missingSkills : localAnalysis.missingKeywords}
                    onAddKeyword={handleAddKeyword}
                  />

                  {/* Right: Google XYZ Bullet Point Optimizer */}
                  <BulletPointOptimizer
                    bullets={localAnalysis.bulletPoints}
                    apiKey={apiKey}
                    onReplaceBullet={handleReplaceBullet}
                  />

                </div>

                {/* Collapsible Raw Resume Preview & Quick Edit */}
                <div className="p-4 rounded-xl bg-dark-800/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <FileText className="w-4 h-4 text-primary-400" />
                      <span>ACTIVE RESUME SOURCE TEXT ({localAnalysis.wordCount} words)</span>
                    </div>
                    <button
                      onClick={() => setShowRawResumeToggle(!showRawResumeToggle)}
                      className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
                    >
                      {showRawResumeToggle ? 'Collapse Text' : 'View / Edit Resume Text'}
                    </button>
                  </div>

                  {showRawResumeToggle && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <textarea
                        rows={8}
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="w-full bg-dark-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-primary-500 leading-relaxed resize-y"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleStartScan}
                          disabled={analyzing}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-Run Analysis With Edited Text</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Callout to Visual Live Editor */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-950/40 via-dark-800 to-indigo-950/30 border border-primary-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary-400" />
                      <span>Ready to format and print your optimized resume?</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Transfer your AI improvements straight into an ATS-compliant A4 visual layout with color themes and 1-click PDF export.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25 transition-all"
                  >
                    <span>Open Visual Resume Editor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
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
