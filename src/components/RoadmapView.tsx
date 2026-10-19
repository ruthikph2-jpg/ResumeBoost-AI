import React, { useState } from 'react';
import { Compass, CheckCircle2, Award, ExternalLink, Code2, Layers, BookOpen } from 'lucide-react';
import { RoadmapMilestone } from '../types';

const JAVA_ROADMAP: RoadmapMilestone[] = [
  {
    level: 1,
    title: 'Core Java & OOP Fundamentals',
    description: 'Master core Java 17/21 language features, memory model, and collections.',
    topics: ['OOP Principles (Encapsulation, Polymorphism, Abstraction)', 'Java Collections Framework (HashMap, ArrayList, PriorityQueue)', 'Generics & Exception Handling', 'Java 8+ Streams, Lambdas & Optional'],
    projectIdea: 'Console-based Banking & Account Management System with multi-threaded transaction simulation.'
  },
  {
    level: 2,
    title: 'Data Structures & Algorithms (DSA)',
    description: 'Build algorithmic problem-solving speed for technical interview rounds.',
    topics: ['Arrays, Two Pointers & Sliding Window', 'Linked Lists, Stacks & Queues', 'Binary Trees, BST & Graph Traversal (BFS/DFS)', 'Dynamic Programming & Greedy Algorithms'],
    projectIdea: 'Interactive Algorithm Visualizer web app or CLI benchmark tool comparing sorting & graph speeds.'
  },
  {
    level: 3,
    title: 'Spring Boot & RESTful Microservices',
    description: 'Develop enterprise-grade backend APIs with modern Spring ecosystem.',
    topics: ['Spring Boot Starter Web & Dependency Injection', 'Spring Data JPA & Hibernate ORM', 'Spring Security with JWT authentication', 'REST API Design & Validation (Jakarta Validation)'],
    projectIdea: 'E-Commerce / Inventory Microservice with JWT Auth, PostgreSQL database, and OpenAPI/Swagger documentation.'
  },
  {
    level: 4,
    title: 'Databases, Caching & Message Queues',
    description: 'Scale systems beyond single-node architecture with databases and async streaming.',
    topics: ['Relational Database Indexing & Query Tuning (PostgreSQL/MySQL)', 'In-memory Caching with Redis', 'Event-Driven Architecture with Apache Kafka or RabbitMQ', 'Connection Pooling (HikariCP)'],
    projectIdea: 'Real-time Live Notification & Telemetry Service with Redis Pub/Sub and WebSocket connections.'
  },
  {
    level: 5,
    title: 'DevOps, Docker & Cloud Deployment',
    description: 'Package, containerize, and deploy production Java applications to the cloud.',
    topics: ['Docker Multi-stage Builds for Spring Boot JARs', 'Docker Compose Local Orchestration', 'CI/CD Pipelines with GitHub Actions', 'Deploying to Render, AWS EC2, or Railway'],
    projectIdea: 'Full-stack Containerized Application deployed on cloud with automated CI/CD unit testing.'
  }
];

const FULLSTACK_ROADMAP: RoadmapMilestone[] = [
  {
    level: 1,
    title: 'Modern Frontend Foundations',
    description: 'Master modern TypeScript, React, and modular state management.',
    topics: ['React 18 Hooks (useEffect, useMemo, useCallback)', 'TypeScript Generics & Strict Typing', 'Tailwind CSS & Responsive Layouts', 'Client-side Routing (React Router)'],
    projectIdea: 'Interactive Developer Portfolio with dynamic theme switcher and project showcase.'
  },
  {
    level: 2,
    title: 'Backend Integration & State Management',
    description: 'Connect frontend interfaces to high-performance backend REST & GraphQL endpoints.',
    topics: ['Zustand or Redux Toolkit for Global State', 'Axios HTTP Interceptors & Token Handling', 'React Query / SWR for Data Fetching & Caching', 'Form Handling & Zod Schema Validation'],
    projectIdea: 'Collaborative Kanban Task Board with drag-and-drop cards and persistent backend sync.'
  },
  {
    level: 3,
    title: 'Full-Stack Security & Authentication',
    description: 'Implement secure sessions, OAuth2 providers, and access control.',
    topics: ['JWT Access & Refresh Token Rotation', 'OAuth2 Social Login (Google & GitHub)', 'CORS Policy & Cookie Security (HttpOnly)', 'Role-based Access Control (RBAC)'],
    projectIdea: 'SaaS Dashboard with user auth, billing tier toggles, and protected administrative routes.'
  }
];

export const RoadmapView: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<'java' | 'fullstack'>('java');
  const milestones = activeTrack === 'java' ? JAVA_ROADMAP : FULLSTACK_ROADMAP;

  return (
    <div className="space-y-6">
      {/* Header and Track Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-800 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary-400" />
            CAREER PLACEMENT ROADMAPS
          </h2>
          <p className="text-xs text-slate-400">
            Bridge your resume skill gaps with structured learning pathways and portfolio projects
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-dark-900 border border-slate-700/60">
          <button
            onClick={() => setActiveTrack('java')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTrack === 'java'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Java / Spring Boot Track
          </button>
          <button
            onClick={() => setActiveTrack('fullstack')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTrack === 'fullstack'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Full Stack React Track
          </button>
        </div>
      </div>

      {/* Pathway Milestones */}
      <div className="relative border-l-2 border-primary-500/30 ml-4 sm:ml-8 space-y-8 pb-4">
        {milestones.map((milestone) => (
          <div key={milestone.level} className="relative pl-6 sm:pl-8">
            {/* Milestone Badge Icon */}
            <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-dark-900 border-2 border-primary-500 flex items-center justify-center text-xs font-bold text-primary-300 shadow-lg shadow-primary-500/20">
              {milestone.level}
            </div>

            {/* Content Card */}
            <div className="glass-card rounded-2xl p-5 glow-effect border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    STAGE {milestone.level}
                  </span>
                  <h3 className="font-bold text-base text-white">{milestone.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{milestone.description}</p>
              </div>

              {/* Core Topics Checklist */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Key Skills to Master:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {milestone.topics.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-dark-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Portfolio Project */}
              <div className="p-3.5 rounded-xl bg-primary-950/20 border border-primary-500/25 flex items-start gap-3">
                <Code2 className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-primary-300 uppercase tracking-wider block">
                    Recommended Resume Project:
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-mono">
                    {milestone.projectIdea}
                  </p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
