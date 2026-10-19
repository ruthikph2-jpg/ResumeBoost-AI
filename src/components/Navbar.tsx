import React, { useState } from 'react';
import { Sparkles, Github, Key, Check, BarChart3, Edit3, Compass } from 'lucide-react';

interface NavbarProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  activeTab: 'analysis' | 'editor' | 'roadmap';
  setActiveTab: (tab: 'analysis' | 'editor' | 'roadmap') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiKey,
  setApiKey,
  activeTab,
  setActiveTab,
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ResumeBoost
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                AI ATS v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Built by Ruthik ph</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center p-1 rounded-xl bg-dark-800 border border-slate-800">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analysis'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>ATS Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Visual Resume Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Placement Roadmaps</span>
          </button>
        </nav>

        {/* Right Action Links */}
        <div className="flex items-center gap-3">
          {/* API Key Modal Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-dark-800 hover:bg-dark-700 border border-slate-700/60 text-slate-300 transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{apiKey ? 'Gemini Key Configured' : 'Gemini Key'}</span>
          </button>

          {/* GitHub Profile */}
          <a
            href="https://github.com/ruthikph2-jpg"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/20 transition-all hover:scale-[1.02]"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ruthikph2-jpg</span>
          </a>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-dark-900 py-2 px-2">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-1 text-xs font-semibold py-1 px-2.5 rounded-lg ${activeTab === 'analysis' ? 'bg-primary-600 text-white' : 'text-slate-400'}`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Scanner</span>
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1 text-xs font-semibold py-1 px-2.5 rounded-lg ${activeTab === 'editor' ? 'bg-primary-600 text-white' : 'text-slate-400'}`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-1 text-xs font-semibold py-1 px-2.5 rounded-lg ${activeTab === 'roadmap' ? 'bg-primary-600 text-white' : 'text-slate-400'}`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Roadmaps</span>
        </button>
      </div>

      {/* Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Google Gemini API Key</h3>
                <p className="text-xs text-slate-400">Enables direct cloud Gemini 1.5 Flash evaluation</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              ResumeBoost AI includes a built-in intelligent NLP engine that runs immediately offline. To connect your live personal Google Gemini 1.5 key, enter it below:
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-dark-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saved ? 'Saved!' : 'Save Key'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
