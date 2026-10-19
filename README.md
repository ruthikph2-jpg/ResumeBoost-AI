# 🚀 ResumeBoost AI — Next-Gen AI ATS Resume Optimizer & Builder

> **Transform your resume into an interview magnet.** ResumeBoost AI is an advanced, high-performance ATS Scanner, PDF Parser, Tesseract OCR Engine, Keyword Gap Analyzer, Google XYZ Bullet Point Optimizer, Visual Live Resume Editor, Embedded SQLite Database, and Placement Career Roadmap portal.

[![Live Demo](https://img.shields.io/badge/Live_Demo-resume--boost--ai--ruthik.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://resume-boost-ai-ruthik.vercel.app)
[![GitHub](https://img.shields.io/badge/Author-ruthikph2--jpg-6366F1?logo=github)](https://github.com/ruthikph2-jpg)
[![Repository](https://img.shields.io/badge/GitHub-ResumeBoost--AI-10B981?logo=github)](https://github.com/ruthikph2-jpg/ResumeBoost-AI)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-WASM-003B57?logo=sqlite)](https://sqlite.org)

---

## 🌐 Live Application Demo

🔗 **[https://resume-boost-ai-ruthik.vercel.app](https://resume-boost-ai-ruthik.vercel.app)**

*Experience live ATS scoring, Google XYZ bullet rewriting, in-browser PDF parsing, Tesseract OCR image recognition, and interactive Java roadmaps right in your browser!*

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
  - Direct PDF text extraction using `pdfjs-dist` inside the browser without requiring external server cold starts.
  - Drag-and-drop file upload zone supporting `.pdf`, `.txt`, and image files up to 10MB.
  - 1-click test button to evaluate Ruthik's Sample Java Full-Stack Resume instantly.

- 🔍 **Tesseract OCR Fallback for Scanned Resumes & Photos**:
  - Automatically runs client-side optical character recognition via `tesseract.js` on image uploads (`.png`, `.jpg`, `.jpeg`, `.webp`) and flat scanned PDFs.

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
  - Color theme customization (Indigo, Emerald, Cyan).
  - 1-click PDF download / browser print layout (`@media print`).

- 🗄️ **Embedded SQLite Database (WebAssembly)**:
  - Persistent relational history logging powered by `sql.js`.
  - Automatically tracks scan records, dates, target roles, and ATS scores.
  - Clean **Scan History** dashboard with live search and filtering.

- 🗺️ **Placement Career Roadmaps**:
  - Interactive career path checklists for Java Backend, Frontend, and Data Science.
  - Level-by-level milestones from Core Fundamentals up to System Design and Mock Interviews.

---

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with clean, modern sidebar architecture
- **PDF Extraction**: `pdfjs-dist` (In-browser Web Worker)
- **OCR Engine**: `tesseract.js` (Client-side WebAssembly OCR)
- **Database**: `sql.js` (Embedded SQLite WebAssembly Engine)
- **AI Integration**: Google Gemini 3.5 API with smart offline NLP fallback
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Tooling & Bundler**: Vite & PostCSS
- **Deployment**: Vercel

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

## 🎓 Placement Interview Preparation

Looking for technical interview talking points, architectural diagrams, and model answers? Check out the complete placement guide:  
👉 **[INTERVIEW_GUIDE.md](INTERVIEW_GUIDE.md)**

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
