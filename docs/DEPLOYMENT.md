# 🌐 AI-PathFinder: 100% Free Live Cloud Deployment Guide

> **Zero Maintenance · Zero Cost Forever · No Credit Card Required**

This guide documents how to host **AI-PathFinder** permanently on the cloud so users can test the application live in their browser without downloading the desktop installer.

---

## 🏆 Pathway 1: Hugging Face Spaces (Recommended · 100% Free Forever)

[Hugging Face Spaces](https://huggingface.co/spaces) is the premier platform for hosting Python/AI applications permanently. It **never requires a credit card**, **never expires**, and provides a permanent HTTPS domain.

### Step-by-Step Setup (Takes 2 Minutes):

1. **Sign Up / Log In**:
   * Navigate to [huggingface.co](https://huggingface.co) and log in.

2. **Create a New Space**:
   * Click your profile picture (top right) → **New Space**.
   * **Space Name**: `AI-PathFinder`
   * **License**: `mit`
   * **Space SDK**: Select **Docker**
   * **Docker template**: Select **Blank**
   * **Space hardware**: Select **CPU basic · 2 vCPU · 16GB · Free**
   * **Visibility**: Select **Public**
   * Click **Create Space**.

3. **Deploy from GitHub**:
   * **Option A (GitHub Mirroring - Easiest)**:
     1. In your new Space, click **Settings** (tab).
     2. Scroll down to **Repository to duplicate / mirror** or use the Hugging Face GitHub integration to mirror `karansinghverma979/AI-PathFinder`.
   * **Option B (Direct Git Push)**:
     ```bash
     git remote add space https://huggingface.co/spaces/karansinghverma979/AI-PathFinder
     git push space main
     ```

4. **Access Live Application**:
   * Hugging Face will automatically detect the `Dockerfile`, run the multi-stage build (compiling the React frontend and launching the FastAPI server), and bring the app online at:
   * **Direct URL**: `https://karansinghverma979-ai-pathfinder.hf.space`
   * **Showcase Page**: `https://huggingface.co/spaces/karansinghverma979/AI-PathFinder`

---

## 🥈 Pathway 2: Render (Free Web Service)

Render provides free Docker web services directly connected to GitHub repositories.

### Step-by-Step Setup:

1. Log in to [render.com](https://render.com) using your GitHub account.
2. Click **New +** → **Web Service**.
3. Connect your repository: `karansinghverma979/AI-PathFinder`.
4. Configure settings:
   * **Name**: `ai-pathfinder`
   * **Runtime**: `Docker`
   * **Plan**: `Free`
5. Click **Deploy Web Service**.
6. Render will automatically build the Dockerfile and launch the app at `https://ai-pathfinder.onrender.com`.

*(Note: On the free tier, Render spins down after 15 minutes of inactivity and takes ~45 seconds to wake up on the first request. Hugging Face Spaces is recommended for immediate responsiveness).*

---

## 🐳 Pathway 3: Run Locally with Docker

If you want to run the containerized cloud version locally on any machine:

```bash
# 1. Build the unified production container
docker build -t ai-pathfinder .

# 2. Run the container on port 7860
docker run -p 7860:7860 ai-pathfinder
```

Then navigate to `http://localhost:7860` in any browser.

---

## 💾 How SQLite Persistence & Resetting Works

* **Auto-Seeding**: On first boot, the application automatically verifies the database schema. If empty, it seeds sample candidates, companies, and jobs via `seed.py`.
* **Zero-Maintenance Isolation**: In a public demo environment, ephemeral container storage ensures the demo is **self-healing**—if random visitors submit invalid tests or remove records, restarting the container restores the application back to the clean baseline.
