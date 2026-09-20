# 🌐 AI-PathFinder: 100% Free Live Cloud Deployment Guide

> **Zero Maintenance · Zero Cost Forever · No Credit Card Required**

This guide documents how to host **AI-PathFinder** permanently on the cloud so users can test the application live in their browser without downloading the desktop installer.

---

## 🏆 Pathway 1: Render (Recommended · 100% Free · No Credit Card)

[Render](https://render.com) provides a generous **free tier web service** with native Python & Node.js runtimes. **No credit card is required** to deploy and run free web services.

The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint.

### Step-by-Step Setup (Takes 2 Minutes):

1. **Sign Up**:
   * Navigate to [render.com](https://render.com) and log in with your GitHub account.

2. **Deploy Blueprint**:
   * Click **New +** (top right) → **Blueprint**.
   * Connect your repository: `karansinghverma979/AI-PathFinder`.
   * Render will automatically read `render.yaml`, configure the Python 3.11 environment, compile the React 19 frontend into static assets, install the FastAPI backend, and launch the server.
   * Click **Apply**.

3. **Access Your Live App**:
   * Render will build and deploy your app with a permanent HTTPS link:
   * 👉 `https://ai-pathfinder-xxxx.onrender.com`

*(Note: On the free tier, Render puts inactive services into sleep mode after 15 minutes of inactivity. When a visitor arrives, it automatically wakes up in ~45 seconds. Zero maintenance required).*

---

## 🥈 Pathway 2: Hugging Face Spaces (Python / Gradio Runtime)

> [!NOTE]
> Hugging Face recently updated their policy requiring a credit card or subscription to launch **Docker** SDK Spaces to prevent cryptocurrency mining abuse. However, the standard **Python / Gradio** runtime remains **100% free with zero card required**.

To deploy on Hugging Face without a credit card:
1. Create a Space on [huggingface.co/new-space](https://huggingface.co/new-space).
2. Choose SDK: **Gradio** (CPU basic · Free).
3. Mount the FastAPI application or serve the built React files via Gradio's underlying ASGI server.

---

## 🐳 Pathway 3: Run Locally with Docker

If you want to run the containerized version on your own machine:

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
* **Zero-Maintenance Isolation**: In a public demo environment, ephemeral storage ensures the demo is **self-healing**—if random visitors submit invalid tests or delete records, restarting the container restores the application back to the clean baseline.
