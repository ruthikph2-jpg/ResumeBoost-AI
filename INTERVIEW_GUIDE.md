# 🎓 Placement Interview Guide — ResumeBoost AI

> **A complete cheat-sheet and technical talking points for your campus placement interviews.**  
> Use this guide when technical interviewers, hiring managers, and recruiters ask you about **ResumeBoost AI**.

---

## ⏱️ 1. 30-Second Elevator Pitch
> *"I built **ResumeBoost AI**, an intelligent ATS resume analyzer and career roadmap portal designed to help engineering students pass automated applicant screening filters. It evaluates resumes against target job descriptions, computes a 0–100 ATS compatibility score, identifies missing keyword gaps, rewrites weak bullets using Google's XYZ formula, and tracks progress with interactive role roadmaps. Under the hood, it features client-side PDF parsing with `pdfjs-dist`, Tesseract OCR fallback for scanned resumes, Google Gemini 3.5 API integration, and an embedded SQLite WebAssembly database for persistent scan history."*

---

## 🏛️ 2. Architectural Overview

```
                      [ User Input / Dropzone ]
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
   [ PDF Document ]                                [ Image / Photo ]
         │                                                 │
   (pdfjs-dist)                                     (Tesseract OCR)
         │                                                 │
         └────────────────────────┬────────────────────────┘
                                  │ Extracted Plaintext
                                  ▼
                     [ ATS Processing Pipeline ]
                                  │
             ┌────────────────────┴────────────────────┐
             ▼                                         ▼
   [ Google Gemini 3.5 AI ]               [ Local Algorithmic NLP ]
   • Strict JSON Schema                   • Keyword frequency dictionary
   • Recruiter evaluation                 • Action verb density analyzer
   • Google XYZ bullet rewriter           • Quantifiable metric detector
             │                                         │
             └────────────────────┬────────────────────┘
                                  │
                                  ▼
                     [ SQLite Database (WASM) ]
                     • Table: scan_history
                     • In-browser relational persistence
                     • Exportable .sqlite binary file
                                  │
                                  ▼
                       [ Presentation Layer ]
                       • ATS Score Gauge (0-100%)
                       • 4-Category Breakdown
                       • Live A4 WYSIWYG Editor
                       • Career Placement Roadmap Tree
```

---

## 🎯 3. Core Technical Decisions & Rationale

| Question | Your Technical Answer |
|---|---|
| **Why In-Browser PDF & OCR Parsing?** | Traditional architectures send PDF files to a backend server (e.g., Python/Flask or Node.js) which introduces network latency, cold-start delays, and privacy concerns. By running `pdfjs-dist` and `tesseract.js` in client-side Web Workers, processing is instantaneous and 100% private. |
| **Why Gemini 3.5 Flash-Lite?** | We chose `gemini-3.5-flash-lite` because it delivers sub-second latency and supports strict JSON schema enforcement (`responseMimeType: "application/json"`). Low temperature (0.2) ensures deterministic ATS scoring without hallucination. |
| **Why SQLite WebAssembly (`sql.js`)?** | Instead of requiring an external database server (like PostgreSQL/MySQL) for a demo or frontend portfolio, SQLite runs directly in the browser via WebAssembly. It offers real relational SQL storage, transactions, and binary export (`.sqlite`) with zero backend overhead. |
| **How does the Hybrid Fallback work?** | If the user has a Gemini API key and network connectivity, the system invokes live AI. If the user is offline or the API limit is hit, the app seamlessly falls back to the built-in algorithmic NLP engine, guaranteeing 100% uptime during live demos. |

---

## ❓ 4. Top 10 Technical Interview Questions & Answers

### Q1: How does your ATS scoring algorithm calculate the 0–100 score?
> **Answer**: The ATS algorithm evaluates four weighted components:
> 1. **Keyword Match (40%)**: Compares technical keywords in the resume against the target job requirements using normalized token matching.
> 2. **Impact & Metrics (25%)**: Scans bullet points for quantifiable numbers, percentages, currency, and scale (e.g., *“40% latency reduction”*, *“15,000+ requests”*).
> 3. **Action Verb Strength (20%)**: Measures the density of strong engineering verbs (*Engineered, Architected, Spearheaded*) versus passive verbs (*Responsible for, Helped with*).
> 4. **Brevity & Formatting (15%)**: Assesses total word count (ideal: 350–700 words), section organization, and bullet point length.

### Q2: How did you ensure Gemini returns valid JSON every time?
> **Answer**: We configured `generationConfig` with `responseMimeType: "application/json"` and supplied a schema definition in the prompt. Additionally, we implemented a defensive regex JSON extractor `extractJSON()` in `aiAnalysisService.ts` that strips markdown code fences (` ```json `) and handles control characters before running `JSON.parse()`.

### Q3: What happens if a candidate uploads an image or a scanned PDF?
> **Answer**: We integrated **Tesseract.js** as an OCR fallback. If a PNG or JPG is uploaded, or if the PDF parser extracts fewer than 40 characters (indicating a flat image with no selectable text), the system routes the file into the OCR pipeline using Web Workers, extracts the text, and displays real-time progress percentages.

### Q4: How is SQLite stored and persisted in the browser?
> **Answer**: Using `sql.js` (SQLite compiled to WebAssembly), the database operates entirely in memory for high-speed read/writes. Upon each mutation (`INSERT`, `DELETE`), we call `db.export()`, which returns a `Uint8Array` of the SQLite binary database, and persist it into browser storage. Users can also download the raw `.sqlite` file and open it in DB Browser for SQLite.

### Q5: What is Google's XYZ formula and how did you implement it?
> **Answer**: Google's hiring standard recommends phrasing accomplishments as:  
> **"Accomplished [X] as measured by [Y], by doing [Z]"**  
> We built `geminiEnhancer.ts` which takes weak, passive bullets (e.g., *"Responsible for backend Java code"*), prompts Gemini or our rule-based engine, and transforms them into quantified achievements (e.g., *"Engineered high-throughput Spring Boot REST microservices, slashing server latency by 42% for 15,000+ daily active users"*).

---

## 🏆 5. Placement Highlights to Mention on Your Resume

Add this bullet to your actual resume under **Projects**:
```
ResumeBoost AI | React, TypeScript, Tailwind CSS, SQLite WASM, Google Gemini AI, Tesseract OCR
• Engineered an AI ATS resume analyzer evaluating resumes against target job descriptions with sub-second scoring.
• Integrated Google Gemini 3.5 API with strict JSON schema enforcement and built-in offline NLP fallback.
• Implemented client-side PDF parsing and Tesseract OCR for extracting text from scanned documents and images.
• Embedded SQLite WebAssembly database for relational scan history persistence with binary file export.
• Built interactive Java & Full-Stack placement roadmap trees and live A4 WYSIWYG resume canvas editor.
```
