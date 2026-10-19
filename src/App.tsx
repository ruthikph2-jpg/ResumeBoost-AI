import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Sidebar, NavTab } from './components/Sidebar';
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
  FileText,
  LayoutGrid,
  ShieldCheck,
  TrendingUp,
  Zap,
  BookOpen
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
  const [activeTab, setActiveTab] = useState<NavTab>('roadmaps'); // Default to roadmaps or analyze
  const [scannerView, setScannerView] = useState<'landing' | 'results'>('landing');
  const [selectedRole, setSelectedRole] = useState('java_backend');
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);
  const [jobText, setJobText] = useState(DEFAULT_JOB);
  const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#1E293B',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            fontSize: '12px',
          },
        }}
      />

      {/* Clean Left Sidebar Navigation (Matching Image 2) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Minimal Clean Header (No GitHub button, No Gemini key button) */}
        <header className="h-16 px-6 sm:px-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-800 capitalize tracking-tight">
              {activeTab === 'roadmaps' && 'Career Roadmaps & Learning Paths'}
              {activeTab === 'analyze' && 'AI ATS Resume Scanner'}
              {activeTab === 'dashboard' && 'Developer Overview Dashboard'}
              {activeTab === 'create' && 'Live Visual Resume Builder'}
              {activeTab === 'modify' && 'Bullet Point & Keyword Optimizer'}
              {activeTab === 'history' && 'Resume Exports & History'}
              {activeTab === 'settings' && 'App Settings & Preferences'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          
          {/* ─── TAB: ROADMAPS (Exact Layout from Image 2) ─── */}
          {activeTab === 'roadmaps' && (
            <RoadmapView />
          )}

          {/* ─── TAB: ANALYZE (ATS Scanner) ─── */}
          {activeTab === 'analyze' && (
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
                <div className="space-y-6">
                  {/* Top Action Bar in Results Mode */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setScannerView('landing')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Scan Another Resume</span>
                      </button>
                      <div className="text-xs text-slate-500 font-medium">
                        Target Role:{' '}
                        <span className="font-bold text-indigo-600">
                          {ROLE_TEMPLATES[selectedRole]?.title || 'Custom Role'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setActiveTab('create')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Open Live Resume Editor</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('roadmaps')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Career Roadmap</span>
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
                    <div className="p-5 rounded-3xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>AI EXECUTIVE SUMMARY & ATS EVALUATION</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {aiReport.summary}
                      </p>
                    </div>
                  )}

                  {/* AI Insights & Diagnostics */}
                  {aiReport && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* AI Strengths */}
                      <div className="p-5 rounded-3xl bg-white border border-emerald-200/90 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>AI DETECTED STRENGTHS</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-600">
                          {aiReport.strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold mt-0.5">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AI Improvements */}
                      <div className="p-5 rounded-3xl bg-white border border-amber-200/90 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>CRITICAL ATS IMPROVEMENTS</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-600">
                          {aiReport.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-600 font-bold mt-0.5">•</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* 2-Column: Keyword Gap + Bullet Optimizer */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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

                  {/* Source Resume Drawer */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>ACTIVE RESUME SOURCE TEXT ({localAnalysis.wordCount} words)</span>
                      </div>
                      <button
                        onClick={() => setShowRawResumeToggle(!showRawResumeToggle)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                      >
                        {showRawResumeToggle ? 'Collapse Text' : 'View / Edit Resume Text'}
                      </button>
                    </div>

                    {showRawResumeToggle && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <textarea
                          rows={8}
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={handleStartScan}
                            disabled={analyzing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-Run Analysis With Edited Text</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─── TAB: DASHBOARD ─── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-indigo-200">
                    Candidate Profile
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black mt-1">
                    Welcome back, Ruthik!
                  </h1>
                  <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
                    Your resume is tuned for Java Full-Stack roles. Track your ATS score, optimize bullets, and complete learning roadmap levels.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('analyze')}
                  className="px-5 py-2.5 rounded-2xl bg-white text-indigo-600 font-extrabold text-xs shadow-sm hover:bg-indigo-50 transition-all shrink-0 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Scan Resume</span>
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Current ATS Score</span>
                  <div className="text-2xl font-black text-indigo-600">
                    {aiReport?.atsScore ?? localAnalysis.overallScore}%
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">● High Placement Fit</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Keywords Matched</span>
                  <div className="text-2xl font-black text-slate-900">
                    {localAnalysis.matchedKeywords.length}
                  </div>
                  <span className="text-[11px] text-slate-400">Skills detected in resume</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Action Verbs Found</span>
                  <div className="text-2xl font-black text-purple-600">
                    {localAnalysis.actionVerbScore}%
                  </div>
                  <span className="text-[11px] text-purple-600 font-medium">Strong verb density</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Roadmap Progress</span>
                  <div className="text-2xl font-black text-emerald-600">
                    100%
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">5/5 Levels Completed</span>
                </div>
              </div>

              {/* Quick Launch Shortcuts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab('analyze')}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Analyze Resume (ATS Scanner)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload a PDF or paste text to test ATS compatibility against 7 target role presets.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('create')}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Visual Live Resume Editor</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    WYSIWYG A4 paper canvas with color themes and 1-click browser print / PDF export.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('roadmaps')}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Java Placement Roadmap Tree</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    5-level structured curriculum covering Java setup, OOP, Collections, Spring Boot, and Docker.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: CREATE RESUME (Visual Editor) ─── */}
          {activeTab === 'create' && (
            <ResumeLiveEditor
              profile={profile}
              setProfile={setProfile}
              apiKey={apiKey}
            />
          )}

          {/* ─── TAB: MODIFY RESUME (Bullets & Keywords) ─── */}
          {activeTab === 'modify' && (
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
          )}

          {/* ─── TAB: HISTORY & SETTINGS ─── */}
          {(activeTab === 'history' || activeTab === 'settings') && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4 max-w-2xl mx-auto text-center py-12">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {activeTab === 'history' ? 'Resume Scan History' : 'Application Settings'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {activeTab === 'history'
                  ? 'Past resume analyses and exported files are saved locally in your browser session for quick access.'
                  : 'ResumeBoost AI is operating in active client-side mode with Google Gemini 3.5 integration.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                >
                  Export Current Resume
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        resumeText={resumeText}
      />
    </div>
  );
}
