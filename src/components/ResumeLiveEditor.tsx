import React, { useState } from 'react';
import { ParsedProfile } from '../types';
import { Printer, Sparkles, Download, Palette } from 'lucide-react';
import { boostBulletWithGemini } from '../utils/geminiEnhancer';
import toast from 'react-hot-toast';

interface ResumeLiveEditorProps {
  profile: ParsedProfile;
  setProfile: React.Dispatch<React.SetStateAction<ParsedProfile>>;
  apiKey: string;
}

export const ResumeLiveEditor: React.FC<ResumeLiveEditorProps> = ({
  profile,
  setProfile,
  apiKey,
}) => {
  const [themeColor, setThemeColor] = useState<'indigo' | 'emerald' | 'cyan'>('indigo');
  const [boosting, setBoosting] = useState(false);

  const colors = {
    indigo: { accent: 'text-indigo-600', border: 'border-indigo-600', bg: 'bg-indigo-50' },
    emerald: { accent: 'text-emerald-600', border: 'border-emerald-600', bg: 'bg-emerald-50' },
    cyan: { accent: 'text-cyan-600', border: 'border-cyan-600', bg: 'bg-cyan-50' }
  }[themeColor];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${profile.name} - Resume</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.5; font-size: 13px; max-width: 800px; margin: auto; }
              h1 { font-size: 24px; margin: 0 0 4px 0; color: #1e1b4b; text-transform: uppercase; }
              .subtitle { font-size: 14px; color: #4338ca; font-weight: 600; margin-bottom: 8px; }
              .contact { font-size: 11px; color: #6b7280; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
              h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #1e1b4b; border-bottom: 2px solid #4338ca; padding-bottom: 3px; margin: 16px 0 8px 0; }
              p { margin: 4px 0; }
              .exp-item { margin-bottom: 12px; }
              pre { font-family: inherit; white-space: pre-wrap; margin: 0; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>${profile.name}</h1>
            <div class="subtitle">${profile.title}</div>
            <div class="contact">${profile.email} • ${profile.phone} • ${profile.location}</div>
            
            <h2>Professional Summary</h2>
            <p>${profile.summary}</p>

            <h2>Technical Skills</h2>
            <p>${profile.skills}</p>

            <h2>Experience & Projects</h2>
            <pre>${profile.experience}</pre>

            <h2>Education</h2>
            <p>${profile.education}</p>

            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleBoostAllExperience = async () => {
    setBoosting(true);
    try {
      const lines = profile.experience.split('\n');
      const boostedLines: string[] = [];

      for (const line of lines) {
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          const boosted = await boostBulletWithGemini(line, profile.title, apiKey);
          boostedLines.push(`• ${boosted}`);
        } else {
          boostedLines.push(line);
        }
      }

      setProfile(prev => ({ ...prev, experience: boostedLines.join('\n') }));
      toast.success('Experience bullets upgraded with Google XYZ metrics!');
    } catch {
      toast.error('Failed to boost experience bullets.');
    } finally {
      setBoosting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <Palette className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Accent Theme:</span>
          <div className="flex gap-2">
            {(['indigo', 'emerald', 'cyan'] as const).map((color) => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`w-6 h-6 rounded-full border-2 capitalize transition-all ${
                  color === 'indigo' ? 'bg-indigo-600' : color === 'emerald' ? 'bg-emerald-600' : 'bg-cyan-600'
                } ${themeColor === color ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent opacity-60'}`}
                title={`${color} theme`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBoostAllExperience}
            disabled={boosting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${boosting ? 'animate-spin' : ''}`} />
            <span>{boosting ? 'Optimizing Experience...' : 'AI Boost All Bullets'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Canvas Preview & Editor */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-14 shadow-lg space-y-7 text-slate-800 font-sans">
        
        {/* Name & Title Header */}
        <div className="border-b border-slate-200 pb-5">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
            className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded px-1 -mx-1"
            placeholder="Your Full Name"
          />
          <input
            type="text"
            value={profile.title}
            onChange={(e) => setProfile(p => ({ ...p, title: e.target.value }))}
            className={`w-full bg-transparent text-sm sm:text-base font-bold ${colors.accent} tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded px-1 -mx-1 mt-1`}
            placeholder="Target Job Title (e.g. Java Full Stack Developer)"
          />
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
            <input
              type="text"
              value={profile.email}
              onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
              className="bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-200 rounded px-1 -mx-1"
              placeholder="Email"
            />
            <span>•</span>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
              className="bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-200 rounded px-1 -mx-1"
              placeholder="Phone"
            />
            <span>•</span>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
              className="bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-200 rounded px-1 -mx-1"
              placeholder="Location"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-1.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.accent}`}>
            Professional Summary
          </h3>
          <textarea
            rows={3}
            value={profile.summary}
            onChange={(e) => setProfile(p => ({ ...p, summary: e.target.value }))}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded p-1 -m-1 resize-y"
            placeholder="Brief high-impact summary of your technical background..."
          />
        </div>

        {/* Technical Skills */}
        <div className="space-y-1.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.accent}`}>
            Core Technical Skills
          </h3>
          <textarea
            rows={2}
            value={profile.skills}
            onChange={(e) => setProfile(p => ({ ...p, skills: e.target.value }))}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded p-1 -m-1 font-mono resize-y"
            placeholder="Languages, frameworks, databases, and tools..."
          />
        </div>

        {/* Experience & Projects */}
        <div className="space-y-1.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.accent}`}>
            Experience & Key Engineering Projects
          </h3>
          <textarea
            rows={8}
            value={profile.experience}
            onChange={(e) => setProfile(p => ({ ...p, experience: e.target.value }))}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded p-1 -m-1 font-mono resize-y"
            placeholder="Bullet points describing your roles, projects, metrics, and technologies used..."
          />
        </div>

        {/* Education */}
        <div className="space-y-1.5">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.accent}`}>
            Education
          </h3>
          <input
            type="text"
            value={profile.education}
            onChange={(e) => setProfile(p => ({ ...p, education: e.target.value }))}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded p-1 -m-1"
            placeholder="Degree, Major, Institution, Graduation Year"
          />
        </div>

      </div>
    </div>
  );
};
