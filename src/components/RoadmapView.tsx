import React, { useState } from 'react';
import { 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  Circle, 
  Compass, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Milestone {
  level: number;
  title: string;
  description: string;
  tags: string[];
}

const JAVA_MILESTONES: Milestone[] = [
  {
    level: 1,
    title: 'Java Basics & Setup',
    description: 'Understand the JDK, JRE, and JVM architecture. Master core language syntax, primitive types, loops, and conditional statements.',
    tags: ['JDK vs JRE vs JVM', 'Data Types & Variables', 'Control Flow Statements', 'Arrays & String Handling']
  },
  {
    level: 2,
    title: 'Object-Oriented Programming (OOP)',
    description: 'Master the building blocks of Java. Implement core OOP pillars: Inheritance, Polymorphism, Encapsulation, and Abstraction.',
    tags: ['Classes & Objects', 'Inheritance & Interfaces', 'Polymorphism (Overriding/Overloading)', 'Abstract Classes']
  },
  {
    level: 3,
    title: 'Collections & Exceptions',
    description: 'Learn to handle lists, sets, and maps efficiently. Implement safe code execution blocks using Java Exception mechanisms.',
    tags: ['List, Set, Map interfaces', 'ArrayList & HashMap internals', 'Try-Catch Blocks', 'Custom Exceptions']
  },
  {
    level: 4,
    title: 'Spring Boot & RESTful Microservices',
    description: 'Develop enterprise-grade backend APIs with modern Spring Boot, Hibernate/JPA, and PostgreSQL.',
    tags: ['Spring Boot Core', 'RESTful APIs', 'Spring Data JPA & Hibernate', 'Spring Security & JWT']
  },
  {
    level: 5,
    title: 'Testing, Docker & Placement Prep',
    description: 'Containerize applications with Docker, write unit tests with JUnit/Mockito, and master SDE DSA interview questions.',
    tags: ['JUnit & Mockito', 'Docker & Containerization', 'System Design Basics', 'DSA & LeetCode Patterns']
  }
];

export const RoadmapView: React.FC = () => {
  const [completedLevels, setCompletedLevels] = useState<number[]>([1, 2, 3, 4, 5]); // default 100% like image 2
  const [selectedPath, setSelectedPath] = useState<'java' | 'react' | 'data'>('java');

  const toggleLevel = (lvl: number) => {
    setCompletedLevels((prev) => 
      prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]
    );
  };

  const progressPercent = Math.round((completedLevels.length / JAVA_MILESTONES.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: AVAILABLE PATHS (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            AVAILABLE PATHS
          </h3>

          <div className="space-y-3">
            {/* Java Developer Path (Active) */}
            <div
              onClick={() => setSelectedPath('java')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedPath === 'java'
                  ? 'border-indigo-500 bg-white shadow-md shadow-indigo-500/5'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Java Developer</h4>
                  <p className="text-xs text-indigo-600 font-medium">5 Levels • Active</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Full-Stack React Dev (Coming Soon) */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 opacity-70 flex items-center justify-between cursor-not-allowed">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-700">Full-Stack React Dev</h4>
                  <p className="text-xs text-slate-400 font-medium">6 Levels • Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Data Scientist (Coming Soon) */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 opacity-70 flex items-center justify-between cursor-not-allowed">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-700">Data Scientist</h4>
                  <p className="text-xs text-slate-400 font-medium">8 Levels • Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Java Developer Roadmap Tree (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* Header & Progress Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Compass className="w-5 h-5" />
                <h2 className="text-lg font-bold text-slate-900">Java Developer Roadmap Tree</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Click a level milestone to mark it completed. Watch your progress grow!
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-xs font-bold text-slate-700 mb-1 flex items-center sm:justify-end gap-2">
                <span>Completion Progress</span>
                <span className="font-mono text-indigo-600 font-extrabold">{progressPercent}%</span>
              </div>
              <div className="w-44 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Level Cards List */}
          <div className="space-y-6">
            {JAVA_MILESTONES.map((item) => {
              const isDone = completedLevels.includes(item.level);
              return (
                <div key={item.level} className="flex items-start gap-4 sm:gap-6 group">
                  
                  {/* Left Circular Level Badge */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs flex flex-col items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                      <span className="text-[10px] uppercase tracking-wider opacity-80">Lvl</span>
                      <span className="leading-none text-sm font-black">{item.level}</span>
                    </div>
                  </div>

                  {/* Milestone Card */}
                  <div 
                    onClick={() => toggleLevel(item.level)}
                    className={`flex-1 p-5 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? 'border-indigo-200 bg-indigo-50/20 hover:border-indigo-300'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Checkbox Icon */}
                      <div className="shrink-0 pt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-400 transition-colors" />
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {item.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
