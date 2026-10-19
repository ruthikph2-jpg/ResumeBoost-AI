import React, { useState } from 'react';
import { Download, Copy, Check, Printer, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, resumeText }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    toast.success('Resume copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Optimized_Resume_Ruthik.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded as TXT!');
  };

  const handleDownloadMd = () => {
    const blob = new Blob([resumeText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Optimized_Resume_Ruthik.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded as Markdown!');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume - Ruthik ph</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
              pre { font-family: inherit; white-space: pre-wrap; font-size: 14px; }
            </style>
          </head>
          <body>
            <pre>${resumeText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-dark-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Export Optimized Resume</h3>
            <p className="text-xs text-slate-400">Save your ATS-ready resume in your preferred format</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-dark-900 border border-slate-800 max-h-60 overflow-y-auto mb-6 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
          {resumeText}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-dark-700 hover:bg-dark-600 border border-slate-600 text-xs font-semibold text-white transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-dark-700 hover:bg-dark-600 border border-slate-600 text-xs font-semibold text-white transition-all"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Save .TXT</span>
          </button>

          <button
            onClick={handleDownloadMd}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-dark-700 hover:bg-dark-600 border border-slate-600 text-xs font-semibold text-white transition-all"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Save .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-xs font-bold text-white shadow-lg shadow-primary-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
