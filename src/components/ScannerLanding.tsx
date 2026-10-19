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

import { extractTextFromImage } from '../utils/ocrParser';

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
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/i.test(file.name);
    const isPdf = file.name.endsWith('.pdf') || file.type === 'application/pdf';
    const isTxt = file.name.endsWith('.txt') || file.name.endsWith('.md') || file.type === 'text/plain';

    if (!isPdf && !isTxt && !isImage) {
      toast.error('Please upload a PDF, Image (PNG/JPG), or Text resume file.');
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setUploadedFile({ name: file.name, size: sizeFormatted });

    if (isImage) {
      // 1. Image upload: Run Tesseract OCR directly
      toast.loading('Analyzing image with Tesseract OCR engine...', { id: 'ocr-toast' });
      try {
        const text = await extractTextFromImage(file, (_pct, status) => {
          toast.loading(status, { id: 'ocr-toast' });
        });
        if (text && text.trim().length > 30) {
          setResumeText(text);
          toast.success(`Successfully extracted text from ${file.name} via Tesseract OCR!`, { id: 'ocr-toast' });
        } else {
          toast.error('Tesseract OCR could not detect readable text from this image.', { id: 'ocr-toast' });
        }
      } catch (err) {
        console.error('Tesseract OCR Error:', err);
        toast.error('Failed to run Tesseract OCR on image.', { id: 'ocr-toast' });
      }
    } else if (isPdf) {
      // 2. PDF upload: Extract text with pdfjs-dist
      toast.loading('Parsing PDF text in browser...', { id: 'pdf-toast' });
      try {
        const text = await extractTextFromPdf(file);
        if (text && text.trim().length > 50) {
          setResumeText(text);
          toast.success(`Successfully parsed ${file.name}`, { id: 'pdf-toast' });
        } else {
          toast.error('PDF appears to be a scanned image with no embedded text. Tip: Upload as a PNG/JPG image to use Tesseract OCR!', { id: 'pdf-toast', duration: 5000 });
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to parse PDF', { id: 'pdf-toast' });
      }
    } else {
      // 3. Text or Markdown upload
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
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI ATS Resume Optimizer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Supercharge Your Resume <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            For Any Job Target With AI
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Upload your resume, select your target role, and get instant ATS compatibility scoring, keyword gap diagnostics, and AI-powered bullet point enhancements.
        </p>
      </div>

      {/* Main Scanner Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Step 1: Target Role Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Step 1: Select Target Role</span>
            </label>
            <button
              onClick={() => setCustomJobMode(!customJobMode)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              <span>{customJobMode ? 'Use Role Presets' : 'Custom Job Description'}</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>-- Choose a target role to match against --</option>
              {Object.entries(ROLE_TEMPLATES).map(([key, data]) => (
                <option key={key} value={key} className="text-slate-800 font-medium">
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

          {/* Job Description View */}
          {(customJobMode || jobText) && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                <span>Job Description requirements used for ATS matching:</span>
                <span className="text-[11px] text-slate-400 font-mono">{jobText.split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                rows={3}
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the target job description or requirements here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-mono text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 leading-relaxed resize-y"
              />
            </div>
          )}
        </div>

        {/* Step 2: Resume File Upload Zone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-emerald-600" />
              <span>Step 2: Upload Your Resume (PDF / Image / TXT)</span>
            </label>
            <button
              onClick={() => setShowDirectPaste(!showDirectPaste)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors"
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
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md"
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
            className={`relative rounded-3xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01]'
                : uploadedFile
                ? 'border-emerald-400 bg-emerald-50/40'
                : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{uploadedFile.name}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">
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
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-colors"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-800">
                    Drag and drop your resume file here
                  </div>
                  <div className="text-xs text-slate-500">
                    Supports <span className="text-slate-800 font-semibold">PDF</span>, <span className="text-slate-800 font-semibold">Images (PNG/JPG via Tesseract OCR)</span>, and <span className="text-slate-800 font-semibold">TXT</span> files
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                  >
                    Browse Files
                  </button>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    Tesseract OCR Active
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Direct Paste Collapsible */}
          {showDirectPaste && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                <span>Extracted or Pasted Resume Text:</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {resumeText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your raw resume text here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-mono text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
              />
            </div>
          )}
        </div>

        {/* 1-Click Sample Test Action */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 gap-2">
          <span>Don't have a resume PDF ready?</span>
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Ruthik's Sample Java Resume (1-Click Test)</span>
          </button>
        </div>

        {/* Progress Bar (During Scanning) */}
        {analyzing && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-600 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                {scanStage}
              </span>
              <span className="font-mono text-slate-700 font-bold">{scanProgress}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-300 rounded-full"
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
            className="w-full py-4 px-6 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {analyzing ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-amber-200" />
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
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Please upload a resume PDF or select the 1-click sample to begin analysis.
            </p>
          )}
        </div>

      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>ATS Compatibility Index</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Evaluates keyword frequencies, action verbs, quantified metrics, and structural formatting.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>Google XYZ Bullet Optimizer</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rewrites weak bullet points using Google's formula: "Accomplished [X] as measured by [Y] by doing [Z]".
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
            <Briefcase className="w-4 h-4" />
            <span>Target Role Roadmaps</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Structured career milestones and interview topics tailored for Java, Full-Stack, and Cloud placements.
          </p>
        </div>
      </div>
    </div>
  );
};
