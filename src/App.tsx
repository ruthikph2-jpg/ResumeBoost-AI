import React, { useState, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { ResumeUploader } from './components/ResumeUploader';
import { JobMatcher } from './components/JobMatcher';
import { AtsScoreCard } from './components/AtsScoreCard';
import { KeywordGapCard } from './components/KeywordGapCard';
import { BulletPointOptimizer } from './components/BulletPointOptimizer';
import { ExportModal } from './components/ExportModal';
import { analyzeResume } from './utils/atsAnalyzer';
import { Download, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

const DEFAULT_RESUME = `Ruthik ph
B.Tech Computer Science & Engineering | Java Full Stack Developer
Email: ruthik@example.com | GitHub: github.com/ruthikph2-jpg

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
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);
  const [jobText, setJobText] = useState(DEFAULT_JOB);
  const [apiKey, setApiKey] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Compute live ATS analysis
  const analysis = useMemo(() => {
    return analyzeResume(resumeText, jobText);
  }, [resumeText, jobText]);

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

      <Navbar apiKey={apiKey} setApiKey={setApiKey} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary-950/40 via-dark-800 to-dark-800 border border-primary-500/20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen ATS Scanner & Bullet Optimizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Optimize Your Resume for Elite Tech Recruiters
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Scans your resume against job postings, identifies missing keywords, evaluates impact metrics, and upgrades bullet points with the Google XYZ framework.
            </p>
          </div>

          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export & Download</span>
          </button>
        </div>

        {/* ATS Score Overview */}
        <AtsScoreCard analysis={analysis} />

        {/* Actionable Recommendations */}
        {analysis.suggestions.length > 0 && (
          <div className="p-4 rounded-xl bg-dark-800/80 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-300">Actionable ATS Suggestions:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {analysis.suggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
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
              wordCount={analysis.wordCount}
            />
            <JobMatcher
              jobText={jobText}
              setJobText={setJobText}
            />
          </div>

          {/* Right Column: Keyword Gap & Bullet Optimizer */}
          <div className="space-y-6">
            <KeywordGapCard
              matchedKeywords={analysis.matchedKeywords}
              missingKeywords={analysis.missingKeywords}
              onAddKeyword={handleAddKeyword}
            />

            <BulletPointOptimizer
              bullets={analysis.bulletPoints}
              apiKey={apiKey}
              onReplaceBullet={handleReplaceBullet}
            />
          </div>

        </div>

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
