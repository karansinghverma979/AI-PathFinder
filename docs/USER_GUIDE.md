# 📖 AI-PathFinder Comprehensive User Manual

> **Step-by-Step Guide to Navigating Careers, Synthesizing Learning Roadmaps, and Recruiting Top Talent**

---

## 1. First Launch & Setup

When you launch **AI-PathFinder** for the first time:
1. **Cold Boot Initialization**: The backend automatically provisions your local SQLite database in your configured data folder (`%LOCALAPPDATA%\AI-PathFinder\Database\candidates.db`).
2. **Auto-Seeding**: Default high-tier candidate profiles, corporate vacancies, and industry roles are loaded immediately.
3. **Navigation**: Use the clean top navigation bar to switch between the 4 dedicated hubs:
   * 🎯 **Career**: Job Matcher & Gap Analysis
   * 📚 **Learning**: AI Learning Forge & Roadmaps
   * 💼 **Hiring**: Recruitment & Candidate Search
   * 👥 **Candidates**: Global Talent Directory CRUD

---

## 2. 🎯 Career Tab (Job Matcher)

The **Career Tab** helps developers and job seekers discover how their existing skill set matches real-world vacancies.

### How to Use:
1. Enter your technical skills in the search field separated by commas (e.g., `React, TypeScript, Tailwind, Python`).
2. Click **"Analyze Match"**.
3. The engine evaluates all corporate vacancies in your local database:
   * **Overall Match Percentage**: Displays your compatibility score with the vacancy.
   * **Matched Skills**: Highlights the skills you already possess that meet job requirements.
   * **Missing Skills (Skill Gap)**: Highlights exactly what you need to learn to become 100% qualified.
4. Click on any job card to expand the full description, company profile, and location.

<p align="center">
  <img width="800" alt="Career Matcher Overview" src="../assets/screenshots/career-matcher-1.png" />
</p>
<p align="center">
  <img width="800" alt="Career Match Score Breakdown" src="../assets/screenshots/career-matcher-2.png" />
</p>

---

## 3. 📚 Learning Tab (AI Learning Forge)

The **Learning Tab** creates structured, 3-tier educational pathways for technical domains.

### How to Use:
1. Type any career title into the prompt bar (e.g., `React`, `Frontend Developer`, `Python`, `Data Science`, `DevOps`).
2. Click **"Forge Path"**.
3. The forge outputs a 3-tier progressive learning tree:
   * **🟢 Tier 1: Easy (Foundations)**: Core fundamentals, syntax, setup, and key mental models.
   * **🟡 Tier 2: Medium (Intermediate Execution)**: State management, API integration, data querying, and architecture.
   * **🔴 Tier 3: Hard (Advanced Mastery)**: Production performance, server rendering, distributed scaling, and security.
4. Each milestone card includes verified resources:
   * 🎥 **Video Tutorials**: Direct links to top video guides.
   * 📄 **Official Documentation**: Up-to-date framework docs.
   * 🐙 **Open-Source GitHub Repos**: Production codebases for hands-on reference.

<p align="center">
  <img width="800" alt="Learning Roadmap" src="../assets/screenshots/learning-forge-1.png" />
</p>
<p align="center">
  <img width="800" alt="Milestone Resources" src="../assets/screenshots/learning-forge-2.png" />
</p>

---

## 4. 💼 Hiring Tab (Recruitment Hub)

Designed for companies, engineering leads, and technical recruiters who need to find the right candidate fast.

### How to Use:
1. Paste your raw job description or required skills into the search box (e.g., *"Looking for a Full Stack engineer skilled in Python, FastAPI, React, and Docker"*).
2. Click **"Scan Candidate Pool"**.
3. The engine performs reverse token matching across the local database:
   * Ranks all matching candidates in descending order of compatibility.
   * Displays candidate experience level, current role, and availability window.
   * Visualizes matched vs. missing skills for every applicant.
4. Click **"Contact Candidate"** to launch a pre-composed email draft directly to the candidate.

<p align="center">
  <img width="800" alt="Hiring Search" src="../assets/screenshots/hiring-hub-1.png" />
</p>
<p align="center">
  <img width="800" alt="Ranked Candidates" src="../assets/screenshots/hiring-hub-2.png" />
</p>

---

## 5. 👥 Candidates Tab (Profile Manager)

The **Candidates Tab** is your global talent directory.

### Features:
* **Add Candidate**: Click the **"+ Add Candidate"** button. Enter their name, email, role, skills, location, and experience.
* **Dicebear Avatar Selection**: Generate unique, expressive avatars for candidate profiles via the built-in avatar selector.
* **Developer Lock**: Core system profiles (e.g., Lead Architect profiles) are flagged with `is_developer = 1` to protect them against accidental edits or deletion.
* **Search & Filter**: Filter candidates instantly by skill keywords or location.

<p align="center">
  <img width="800" alt="Candidate Management Directory" src="../assets/screenshots/candidates-directory.png" />
</p>

---

## 6. Database Management & Backup

Your candidate data and custom job postings are saved safely in your local SQLite database.

* **Database File**: `%LOCALAPPDATA%\AI-PathFinder\Database\candidates.db`
* **Backing Up**: To backup your data, simply copy `candidates.db` to an external drive or cloud folder.
* **Restoring**: Paste your backup `candidates.db` into the database folder.
* **Resetting**: If you delete `candidates.db`, the application will recreate and seed fresh default data upon the next startup.

---

## 7. Troubleshooting & Support

| Issue | Resolution |
| :--- | :--- |
| **Port 8000 already in use** | Ensure another instance of AI-PathFinder or uvicorn isn't running in Task Manager. Terminate the background process and re-launch. |
| **Database read-only error** | Ensure the database folder specified in `config.json` has write permissions for your user account. |
| **Avatars not loading** | Dicebear avatars require an active internet connection to render. Profiles will display default fallback initials if offline. |

*For technical documentation and architecture blueprints, see [ARCHITECTURE.md](ARCHITECTURE.md).*
