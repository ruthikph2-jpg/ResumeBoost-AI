import React, { useRef, useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  Upload, 
  FileCheck, 
  FileText, 
  X, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Edit2
} from 'lucide-react';
import { extractTextFromPdf } from '../utils/pdfParser';
import toast from 'react-hot-toast';

export interface ScannerLandingProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  jobText: string;
  setJobText: (text: string) => void;
  resumeText: string;
  setResumeText: (text: string) => void;
  onStartScan: () => void;
  analyzing: boolean;
  scanProgress: number;
  scanStage: string;
}

export const ROLE_TEMPLATES: Record<string, { title: string; description: string }> = {
  java_backend: {
    title: 'Java & Spring Boot Developer',
    description: `Design and implement scalable microservices using Java, Spring Boot, and RESTful APIs. Experience with Hibernate/JPA, PostgreSQL or MySQL, Docker containerization, and unit testing using JUnit. Solid grasp of Data Structures, Algorithms (DSA), and Object-Oriented Design patterns.`,
  },
  software_engineer: {
    title: 'Software Development Engineer (SDE)',
    description: `Design, develop, test, and maintain high-quality software applications. Write clean, efficient, and reusable code following industry best practices. Work with databases, RESTful APIs, and version control (Git/GitHub). Strong knowledge of Data Structures & Algorithms, OOP, DBMS, Operating Systems, and Computer Networks. Good problem-solving and communication skills.`,
  },
  frontend_developer: {
    title: 'Frontend Developer (React / TypeScript)',
    description: `Build responsive, user-friendly, and interactive web applications using React.js, TypeScript, Tailwind CSS, and modern frontend tooling. Integrate RESTful APIs, manage application state, write clean UI components, and collaborate on user interface layout and design workflows.`,
  },
  data_analyst: {
    title: 'Data Analyst / Data Scientist',
    description: `Analyze business requirements and deliver data-driven insights. Query relational databases using SQL, perform statistical data analysis with Python/Pandas, build interactive visualization reports (Tableau/PowerBI), clean and model application data, and communicate key highlights to stakeholders.`,
  },
  cloud_devops: {
    title: 'Cloud & DevOps Engineer',
    description: `Deploy, manage, and monitor scalable cloud applications on AWS/GCP. Build automated CI/CD pipelines with GitHub Actions, containerize microservices using Docker and Kubernetes, manage infrastructure as code (Terraform), and ensure system reliability and uptime.`,
  },
  electrical_engineer: {
    title: 'Electrical & Embedded Systems Engineer',
    description: `Design, test, and maintain electrical systems, circuits, microcontrollers, and hardware components. Work with embedded C/C++, MATLAB, and PCB layout tools. Debug and troubleshoot hardware defects, analyze circuit designs, and ensure hardware quality.`,
  },
  product_manager: {
    title: 'Technical Product Manager',
    description: `Analyze market requirements, define product specs, and collaborate with engineering teams. Manage product roadmaps, coordinate cross-functional teams, participate in sprint planning, write user stories, and lead agile review workflows.`,
  },
};

const SAMPLE_JAVA_RESUME = `Ruthik ph
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

export const ScannerLanding: React.FC<ScannerLandingProps> = ({
  selectedRole,
  setSelectedRole,
  jobText,
  setJobText,
  resumeText,
  setResumeText,
  onStartScan,
  analyzing,
  scanProgress,
  scanStage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [showDirectPaste, setShowDirectPaste] = useState(false);
  const [customJobMode, setCustomJobMode] = useState(false);

  const handleRoleSelect = (roleKey: string) => {
    setSelectedRole(roleKey);
    if (roleKey && ROLE_TEMPLATES[roleKey]) {
      setJobText(ROLE_TEMPLATES[roleKey].description);
    }
  };

  const processFile = async (file: File) => {
    const allowed = ['application/pdf', 'text/plain'];
    const isPdf = file.name.endsWith('.pdf') || file.type === 'application/pdf';
    const isTxt = file.name.endsWith('.txt') || file.type === 'text/plain';

    if (!isPdf && !isTxt) {
      toast.error('Please upload a PDF or plain text resume file (.pdf, .txt)');
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setUploadedFile({ name: file.name, size: sizeFormatted });

    if (isPdf) {
      toast.loading('Parsing PDF text in browser...', { id: 'pdf-toast' });
      try {
        const text = await extractTextFromPdf(file);
        if (text && text.trim().length > 50) {
          setResumeText(text);
          toast.success(`Successfully parsed ${file.name}`, { id: 'pdf-toast' });
        } else {
          toast.error('Could not extract readable text from this PDF (it might be scanned).', { id: 'pdf-toast' });
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to parse PDF', { id: 'pdf-toast' });
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          setResumeText(text);
          toast.success(`Loaded ${file.name}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setResumeText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = () => {
    setUploadedFile({ name: 'Ruthik_FullStack_Resume.pdf', size: '142 KB' });
    setResumeText(SAMPLE_JAVA_RESUME);
    handleRoleSelect('java_backend');
    toast.success("Loaded Ruthik's Java Full-Stack Resume!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI ATS Resume Optimizer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Supercharge Your Resume <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
            For Any Job Target With AI
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Upload your resume, select your target role, and get instant ATS compatibility scoring, keyword gap diagnostics, and AI-powered bullet point enhancements.
        </p>
      </div>

      {/* Main Scanner Box */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Step 1: Target Role Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-primary-400" />
              <span>Step 1: Select Target Role</span>
            </label>
            <button
              onClick={() => setCustomJobMode(!customJobMode)}
              className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              <span>{customJobMode ? 'Use Role Presets' : 'Custom Job Description'}</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm font-medium text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>-- Choose a target role to match against --</option>
              {Object.entries(ROLE_TEMPLATES).map(([key, data]) => (
                <option key={key} value={key} className="bg-dark-900 text-slate-200">
                  {data.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Collapsible Job Description View */}
          {(customJobMode || jobText) && (
            <div className="pt-2">
              <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>Job Description requirements used for ATS matching:</span>
                <span className="text-[10px] text-slate-500">{jobText.split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                rows={3}
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the target job description or paste requirements here..."
                className="w-full bg-dark-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500/60 leading-relaxed resize-y"
              />
            </div>
          )}
        </div>

        {/* Step 2: Resume File Upload Zone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileUp className="w-4 h-4 text-emerald-400" />
              <span>Step 2: Upload Your Resume (PDF / TXT)</span>
            </label>
            <button
              onClick={() => setShowDirectPaste(!showDirectPaste)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>{showDirectPaste ? 'Hide Text Area' : 'Or Paste Raw Text'}</span>
            </button>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
            accept=".pdf,.txt,.md"
            className="hidden"
          />

          {/* Dropzone Container */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!uploadedFile) fileInputRef.current?.click();
            }}
            className={`relative rounded-2xl border-2 border-dashed transition-all p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer ${
              isDragging
                ? 'border-primary-400 bg-primary-500/10 scale-[1.01]'
                : uploadedFile
                ? 'border-emerald-500/60 bg-emerald-950/20'
                : 'border-slate-700/80 hover:border-primary-500/70 bg-dark-900/50 hover:bg-dark-900/80'
            }`}
          >
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-100">{uploadedFile.name}</div>
                  <div className="text-xs text-emerald-400 mt-0.5">
                    Ready for ATS scan • {uploadedFile.size}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-dark-800 hover:bg-dark-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-200">
                    Drag and drop your resume file here
                  </div>
                  <div className="text-xs text-slate-400">
                    Supports <span className="text-slate-300 font-medium">PDF</span> and <span className="text-slate-300 font-medium">TXT</span> documents up to 10MB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-md transition-all"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Direct Paste Collapsible */}
          {showDirectPaste && (
            <div className="pt-2">
              <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>Extracted or Pasted Resume Text:</span>
                <span className="text-[10px] text-slate-500">
                  {resumeText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your raw resume text here..."
                className="w-full bg-dark-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500/60 leading-relaxed resize-y"
              />
            </div>
          )}
        </div>

        {/* 1-Click Sample Test Action */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 gap-2">
          <span>Don't have a resume PDF ready?</span>
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Ruthik's Sample Java Resume (1-Click Test)</span>
          </button>
        </div>

        {/* Progress Bar (During Scanning) */}
        {analyzing && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary-400 animate-ping" />
                {scanStage}
              </span>
              <span className="font-mono text-slate-400 font-bold">{scanProgress}%</span>
            </div>
            <div className="h-2.5 w-full bg-dark-900 rounded-full overflow-hidden border border-slate-700/80">
              <div
                className="h-full bg-gradient-to-r from-primary-600 via-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Big Action Button */}
        <div>
          <button
            type="button"
            onClick={onStartScan}
            disabled={analyzing || !resumeText.trim()}
            className="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-xl shadow-primary-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {analyzing ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-amber-300" />
                <span>Running Deep AI ATS Scan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Analyze Resume with AI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          {!resumeText.trim() && (
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Please upload a resume PDF or select the 1-click sample to begin analysis.
            </p>
          )}
        </div>

      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-dark-800/40 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-primary-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>ATS Compatibility Index</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates keyword frequencies, action verbs, quantified metrics, and structural formatting.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-dark-800/40 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>Google XYZ Bullet Optimizer</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rewrites weak bullet points using Google's formula: "Accomplished [X] as measured by [Y] by doing [Z]".
          </p>
        </div>

        <div className="p-4 rounded-xl bg-dark-800/40 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Briefcase className="w-4 h-4" />
            <span>Target Role Roadmaps</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Structured career milestones and interview topics tailored for Java, Full-Stack, and Cloud placements.
          </p>
        </div>
      </div>
    </div>
  );
};
