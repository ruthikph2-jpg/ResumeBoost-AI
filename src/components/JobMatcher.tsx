import React from 'react';
import { Briefcase, Target } from 'lucide-react';
import { JobPreset } from '../types';

interface JobMatcherProps {
  jobText: string;
  setJobText: (text: string) => void;
}

const JOB_PRESETS: JobPreset[] = [
  {
    id: 'java-dev',
    title: 'Java / Spring Boot Engineer',
    category: 'Backend',
    keywords: ['Java', 'Spring Boot', 'REST API', 'Microservices', 'PostgreSQL', 'Docker', 'Hibernate', 'JUnit'],
    description: `We are seeking a talented Java Backend Engineer to design and build scalable microservices and REST APIs.
Requirements:
- Strong core Java skills, Spring Boot, Spring Security, and JPA/Hibernate.
- Experience with relational databases like PostgreSQL or MySQL.
- Knowledge of containerization with Docker and CI/CD pipelines.
- Unit and integration testing with JUnit and Mockito.
- Understanding of Data Structures, Algorithms, and System Design fundamentals.`
  },
  {
    id: 'fullstack',
    title: 'Full Stack React & Node Developer',
    category: 'Full Stack',
    keywords: ['React', 'TypeScript', 'Node.js', 'REST API', 'Tailwind CSS', 'PostgreSQL', 'Git'],
    description: `Looking for a Full Stack Developer proficient in modern frontend (React, TypeScript, Tailwind) and backend services.
Requirements:
- Hands-on expertise building single page applications with React, Vite, and state management.
- Backend API development with Node.js/Express or Spring Boot.
- Database modeling with SQL (PostgreSQL).
- Writing clean, maintainable, production-ready code with automated tests.`
  },
  {
    id: 'sde1',
    title: 'SDE-1 / Graduate Developer',
    category: 'General SDE',
    keywords: ['DSA', 'Java', 'Problem Solving', 'Git', 'Linux', 'SQL', 'Algorithms'],
    description: `Entry-level Software Development Engineer role focusing on high-performance algorithms, system efficiency, and modern backend architectures.
Requirements:
- Strong foundations in Data Structures and Algorithms (DSA).
- Proficiency in Java, C++, or Python.
- Good understanding of object-oriented programming (OOP) and SQL.
- Enthusiasm for building projects and pushing clean commits to GitHub.`
  }
];

export const JobMatcher: React.FC<JobMatcherProps> = ({ jobText, setJobText }) => {
  return (
    <div className="glass-card rounded-2xl p-5 glow-effect border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <h2 className="font-bold text-sm text-slate-100 tracking-wide">TARGET JOB DESCRIPTION</h2>
        </div>
        <span className="text-xs text-slate-400">Match against real requirements</span>
      </div>

      <div className="relative">
        <textarea
          rows={6}
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste the target job description or select a role preset below to see how well your resume matches..."
          className="w-full bg-dark-900/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 leading-relaxed transition-all resize-y"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-400 font-medium">Role Presets:</span>
        {JOB_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setJobText(preset.description)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-800 hover:bg-dark-700 text-slate-300 border border-slate-700/60 transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-3 h-3 text-emerald-400" />
            <span>{preset.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
