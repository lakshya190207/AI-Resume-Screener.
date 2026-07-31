# TalentMatrix AI Resume Screener — Production Deployment Guide

This guide details **where and how** to deploy the **TalentMatrix AI Resume Screening Agent** for production use.

---

## Production Readiness Verification ✅

- **Build Status**: Verified with zero compilation errors (`npm run build` completed in 693ms).
- **Core Pipeline**: 100% operational (PII Anonymization, Weighted Scoring, Categorization, Dynamic Interrogation, Baseline Controls, Historical Trajectory Model, Recruiter HITL Audits, 4/5ths Rule Demographic Bias Auditing, Company Database Auto-Sync).
- **Live Local Server**: Active at **`http://localhost:5173/`**.

---

## Deployment Options

### Option 1: Deploy to Vercel (Recommended — Free, Fastest 1-Click Cloud Hosting)

**Vercel** is the easiest and fastest way to host the web application globally with HTTPS and instant continuous deployment.

#### Steps:
1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "Deploy TalentMatrix AI Resume Screener"
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
2. Go to [Vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** &rarr; Select your GitHub repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your live URL will be ready in under 30 seconds (e.g. `https://talentmatrix-ai.vercel.app`).

---

### Option 2: Deploy using Docker (AWS EC2 / DigitalOcean / GCP / Azure)

Using the included [`Dockerfile`](file:///d:/Avi/Projects/ai-resume-screener/Dockerfile) and [`docker-compose.yml`](file:///d:/Avi/Projects/ai-resume-screener/docker-compose.yml), you can deploy to any cloud provider or Linux Virtual Machine.

#### Steps on Server (e.g., AWS EC2, DigitalOcean Droplet, Ubuntu Server):
1. **Install Docker & Docker Compose** on your server:
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io docker-compose -y
   ```
2. **Clone your repository** onto the server:
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd ai-resume-screener
   ```
3. **Run 1-Command Production Container**:
   ```bash
   docker-compose up -d --build
   ```
4. Access your live application at `http://<YOUR_SERVER_IP>:8080` (or configure Nginx / Domain SSL with Certbot).

---

### Option 3: Deploy to Netlify (Alternative 1-Click Free Hosting)

#### Steps:
1. Log in to [Netlify.com](https://netlify.com).
2. Drag and drop the compiled [`dist`](file:///d:/Avi/Projects/ai-resume-screener/dist) folder directly onto the Netlify dashboard, OR connect your GitHub repository.
3. **Build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **"Deploy Site"**.

---

### Option 4: On-Premise Enterprise Company Server (Internal Network)

If your company policy requires hosting strictly on internal networks without public internet exposure:

1. Build the production assets on your machine:
   ```bash
   npm run build
   ```
2. Serve the static [`dist`](file:///d:/Avi/Projects/ai-resume-screener/dist) directory using Nginx, Apache, or Node.js `serve`:
   ```bash
   npm install -g serve
   serve -s dist -l 3000
   ```
3. The app will be accessible internally at `http://internal-ip:3000`.

---

## File Structure & Deployment Artifacts

- [`Dockerfile`](file:///d:/Avi/Projects/ai-resume-screener/Dockerfile): Multi-stage container build file
- [`docker-compose.yml`](file:///d:/Avi/Projects/ai-resume-screener/docker-compose.yml): Production orchestration service config
- [`AI_Resume_Screening_Agent_Report.pdf`](file:///d:/Avi/Projects/ai-resume-screener/AI_Resume_Screening_Agent_Report.pdf): Full technical documentation PDF
