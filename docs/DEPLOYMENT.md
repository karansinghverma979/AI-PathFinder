# 🌐 AI-PathFinder: 100% Free Live Cloud Deployment Guide

> **Zero Maintenance · Zero Cost Forever · No Credit Card Required**

This guide documents the deployment pathways for **AI-PathFinder**, enabling users to test the application live in their browser without downloading the desktop installer.

---

## 🏆 Pathway 1: GitHub Pages (Recommended · 100% Free Forever)

[GitHub Pages](https://pages.github.com) is built directly into GitHub. It is **100% free forever**, **never requires a credit card**, **never sleeps**, and is hosted on GitHub's global edge CDN.

### Live Application URL:
👉 **`https://karansinghverma979.github.io/AI-PathFinder/`**

### How It Works:
1. **Sovereign In-Browser Engine**: The web version utilizes the built-in client engine ([`frontend/src/services/browserEngine.js`](../frontend/src/services/browserEngine.js)) which emulates the REST API and SQLite storage directly in the visitor's browser using `localStorage`.
2. **Instant Performance**: Zero cold-start delay (0 ms). Every tab (Career, Learning, Hiring, Candidates, Jobs, Companies, About) responds immediately.
3. **Automated CI/CD**: The repository includes [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) which automatically builds the React 19 frontend and publishes to GitHub Pages whenever changes are pushed to `main`.

### To Enable on GitHub (One-Time Step):
1. Go to your repository settings: [github.com/karansinghverma979/AI-PathFinder/settings/pages](https://github.com/karansinghverma979/AI-PathFinder/settings/pages).
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. That's it! GitHub Actions handles the rest automatically.

---

## 🥈 Pathway 2: Render Blueprint (`render.yaml`)

If you prefer running the full Python FastAPI server in a cloud container, [Render](https://render.com) provides a free web service tier.

The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint:
* **One-Click Deploy**: [Deploy to Render](https://render.com/deploy?repo=https://github.com/karansinghverma979/AI-PathFinder)
* **Runtime**: Native Python 3.11 (No Docker required).

*(Note: Free Render web services spin down after 15 minutes of inactivity and take ~45 seconds to wake up on the first visit).*

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

## 💾 Storage & Data Isolation

* **Web Demo**: Data is isolated to each visitor's browser `localStorage`, seeded automatically with default candidates, companies, and jobs. Visitors can test creating and deleting entries without affecting other users.
* **Windows Desktop App**: Data is saved to the local machine at `%LOCALAPPDATA%\AI-PathFinder\Database\candidates.db` for full offline sovereign storage.
