# TalentMatrix AI — Automated AI Resume Screening & Evaluation Agent

[![Build Status](https.img.shields.io/badge/Build-Passing-emerald)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Platform](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind-sky)](https://github.com)

**TalentMatrix AI** is an automated, unbiased candidate resume screening engine designed for recruitment teams. It replaces subjective manual resume reviews with a calibrated 5-phase screening pipeline: PII anonymization, rigid requirement matching, dynamic weighted scoring (0–100), candidate categorization, background-tailored interview question generation, and automated demographic fairness auditing (4/5ths Rule).

---

## Key Features

1. **Extraction & Anonymization Engine**
   - Strips PII (Names, Emails, Phones, Addresses, Social Links), demographic indicators, and graduation dates to prevent age and proxy bias.
2. **Dynamic Requirement Matching & Scoring**
   - Strictly maps candidate skills against explicit Must-Have and Nice-to-Have qualifications on a 0–100 weighted scale with adjustable sliders.
3. **Candidate Categorization**
   - Automatically flags candidates into 🟢 **Top Tier** ($\ge 80\%$, 100% Must-Haves), 🟡 **Qualified** ($60-79\%$), or 🔴 **Not a Match** ($<60\%$).
4. **Dynamic Interrogation Generator**
   - Synthesizes 3–5 background-tailored interview questions targeting top accomplishments, competency scenarios, and missing skill gaps.
5. **Historical Data Pattern Learning**
   - Correlates past hire profiles to calculate trajectory similarity and predictive retention velocity scores.
6. **Demographic Bias & Fairness Audit (4/5ths Rule)**
   - Decoupled demographic vault testing for Disparate Impact ($\text{Ratio} \ge 0.80$) with real-time alert triggers.
7. **Automated Company Database & ATS Sync**
   - Ingests incoming database applicants in real-time and writes back scores, categories, and interview questions.
8. **1-Click Bulk Batch Screener**
   - Multi-file drag & drop (PDF, Word, TXT) with parallel text extraction and ranked CSV leaderboard exports.

---

## Quick Start & Local Setup

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
# Clone repository
git clone https://github.com/<YOUR_USERNAME>/ai-resume-screener.git
cd ai-resume-screener

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## Production Build & Docker Deployment

### Building for Production
```bash
npm run build
```

### Docker Deployment
```bash
docker compose up -d --build
```
Access the application container at `http://localhost:8080`.

---

## Documentation Deliverables
- **Deployment Guide**: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
- **Executive Technical PDF**: [`AI_Resume_Screening_Agent_Report.pdf`](./AI_Resume_Screening_Agent_Report.pdf)

---

## License
MIT License. Built for enterprise recruitment optimization.
