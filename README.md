# 🚀 ResumeBoost AI — Next-Gen AI ATS Resume Optimizer & Builder

> **Transform your resume into an interview magnet.** ResumeBoost AI is an advanced, high-performance ATS Scanner, PDF Parser, Keyword Gap Analyzer, Google XYZ Bullet Point Optimizer, Visual Live Resume Editor, and Placement Career Roadmap portal.

[![GitHub](https://img.shields.io/badge/Author-ruthikph2--jpg-6366F1?logo=github)](https://github.com/ruthikph2-jpg)
[![Repository](https://img.shields.io/badge/GitHub-ResumeBoost--AI-10B981?logo=github)](https://github.com/ruthikph2-jpg/ResumeBoost-AI)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev)

---

## ✨ Key Features

- 🎯 **Target Role Presets & Dropdown Selector**:
  - Instant pre-configured requirements for:
    - **Java & Spring Boot Developer** (Microservices, JPA/Hibernate, Docker, JUnit, PostgreSQL)
    - **Software Development Engineer (SDE)** (DSA, OOP, System Design, REST APIs)
    - **Frontend Developer** (React, TypeScript, Tailwind CSS, State Management)
    - **Data Analyst / Data Scientist** (SQL, Python, Pandas, Tableau, PowerBI)
    - **Cloud & DevOps Engineer** (AWS, Docker, Kubernetes, CI/CD, Terraform)
    - **Electrical & Embedded Systems Engineer** (C/C++, Microcontrollers, MATLAB)
    - **Technical Product Manager** (Roadmaps, User Stories, Agile)

- ⚡ **In-Browser Client-Side PDF Parsing**:
  - Direct PDF text extraction using `pdfjs-dist` inside the browser without requiring slow external server cold starts.
  - Drag-and-drop file upload zone supporting `.pdf` and `.txt` files up to 10MB.
  - 1-click test button to evaluate Ruthik's Sample Java Full-Stack Resume instantly.

- 📊 **Animated Multi-Stage AI Scanning Feedback**:
  - Progress bar dynamically ticks from 0% to 100% through distinct analysis phases:
    1. Parsing document structure & formatting
    2. Extracting technical competencies & project impact
    3. Calculating ATS compatibility index with Gemini AI
    4. Generating Google XYZ bullet recommendations & career milestones

- 🏆 **Comprehensive ATS Results Dashboard**:
  - **Radial ATS Score Gauge (0–100%)**: Visual grade rating (ATS Optimized, Competitive, Needs Optimization).
  - **4-Category Breakdown**: Skills Match %, Impact & Quantified Metrics, Formatting & Length, Action Verb Strength.
  - **AI Executive Summary**: Personalized assessment of your candidate profile.
  - **AI Detected Strengths & Critical Improvements**: Pinpoints exact reasons why ATS systems would accept or reject the resume.

- 🔍 **Automated Keyword Gap Analysis**:
  - Highlights matched keywords in green vs. missing keywords in amber.
  - **1-Click "+ Add to Skills"**: Instantly injects missing keywords into your resume's technical skills section.

- 🤖 **Google XYZ Formula Bullet Optimizer**:
  - Rewrites passive, vague job descriptions into impactful metrics:
    > *"Accomplished [X] as measured by [Y] by doing [Z]"*
  - **1-Click "Apply to Resume"**: Automatically finds and replaces the original bullet point in your resume text.

- 📝 **Live Visual A4 Canvas Resume Editor**:
  - Full-featured WYSIWYG A4 resume canvas with live preview.
  - Edit personal details, summary, technical stack, experience, and education.
  - Color theme customization (Indigo, Emerald, Violet, Cyan, Slate).
  - 1-click PDF download / browser print layout (`@media print`).

- 🗺️ **Placement Career Roadmaps**:
  - Interactive career path checklists for Java Backend, Frontend, Cloud/DevOps, and Data Engineering.
  - Level-by-level milestones from Core Fundamentals up to Mock Interviews and System Design.

---

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **PDF Extraction**: `pdfjs-dist` (In-browser Web Worker)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Tooling & Bundler**: Vite & PostCSS
- **AI Integration**: Google Gemini 1.5 API support + built-in offline NLP engine

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/ruthikph2-jpg/ResumeBoost-AI.git
cd ResumeBoost-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🌐 Deploy to Vercel (1-Click Free Deployment)

1. Ensure all changes are committed and pushed to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account (`ruthikph2-jpg`).
3. Click **Add New...** → **Project**.
4. Import your repository: **`ResumeBoost-AI`**.
5. Configure Project:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**! 🚀
7. Your app will be live on `https://resume-boost-ai-ruthik.vercel.app` in under 60 seconds!

---

## 👨‍💻 Author

**Ruthik ph**  
- GitHub: [@ruthikph2-jpg](https://github.com/ruthikph2-jpg)  
- Focus: Java, Spring Boot, DSA, Full-Stack Web Development  
- Degree: B.Tech in Computer Science & Engineering  

---

## 📄 License

Proprietary License — Copyright (c) 2026 **Ruthik ph**. All Rights Reserved.  
Unauthorized copying, modification, or redistribution of this software is strictly prohibited. See [LICENSE](LICENSE) for details.
