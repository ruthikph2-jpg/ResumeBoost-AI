import React from 'react';
import { FileText, RotateCcw, Sparkles, Upload } from 'lucide-react';

interface ResumeUploaderProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  wordCount: number;
}

const SAMPLE_JAVA_RESUME = `Ruthik ph
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

const SAMPLE_WEAK_RESUME = `Alex Doe
Junior Developer
Email: alex@example.com

SKILLS:
Java, HTML, CSS, JavaScript, MySQL

EXPERIENCE:
Software Intern - TechCorp
• Responsible for working on backend features using Java.
• Helped with bug fixes and code reviews with the team.
• Was part of the team that maintained the database.
• Did some frontend work using HTML and CSS.
`;

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  resumeText,
  setResumeText,
  wordCount,
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 glow-effect border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-400" />
          <h2 className="font-bold text-sm text-slate-100 tracking-wide">YOUR RESUME CONTENT</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            {wordCount} words
          </span>
          {resumeText && (
            <button
              onClick={() => setResumeText('')}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors ml-2"
              title="Clear resume"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={12}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your raw resume text here, or click one of the quick samples below..."
          className="w-full bg-dark-900/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500/80 focus:ring-1 focus:ring-primary-500/50 leading-relaxed transition-all resize-y"
        />
      </div>

      {/* Preset buttons */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setResumeText(SAMPLE_JAVA_RESUME)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 border border-primary-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-primary-400" />
            <span>Load Ruthik's Java Stack Resume</span>
          </button>
          <button
            onClick={() => setResumeText(SAMPLE_WEAK_RESUME)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-800 hover:bg-dark-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            Load Weak Resume (See ATS Detection)
          </button>
        </div>
      </div>
    </div>
  );
};
