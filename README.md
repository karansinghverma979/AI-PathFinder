# 🚀 AI-PathFinder

**Your Personal AI-Powered Career & Learning Co-Pilot**

AI-PathFinder is a comprehensive full-stack application designed to empower developers and job seekers. It leverages intelligent matching algorithms to connect candidates with their ideal roles and provides structured, up-to-date learning paths for modern technical stacks. 

It is compiled as a **native Windows desktop application** that runs in its own dedicated, chromeless system window frame (using Microsoft Edge WebView2), complete with a custom installer and uninstaller.

---

## ✨ Key Features

- **🖥️ Native Desktop Experience**: Runs in a dedicated Windows app window frame (Edge WebView2) instead of opening in a standard web browser. Closing the window automatically stops all background processes.
- **🎯 Intelligent Job Matching**: Matches user skills against a database of jobs using a refined scoring algorithm that considers partial matches and title relevance.
- **📚 Learning Forge**: Generates structured learning roadmaps for modern stacks (React 19, Next.js 15, Data Science with Polars/PyTorch) with curated, high-quality resources.
- **🏢 Sourcing Dashboard**: Enables companies to find top candidates based on specific skill requirements.
- **📦 Custom Windows Installer**: Includes a wizard asking the user where they want to store the SQLite database. Writes configuration data into `config.json`.
- **🧹 Full Clean Uninstaller**: Standard uninstallation cleans up all files, registry links, application settings, and the custom database files/directories created during runtime.
- **⚡ Modern UI/UX**: Built with React 19 and Tailwind CSS 4, featuring global radial dot grid styling, glassmorphism card templates, and fluid spring animations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Functional Components, Hooks)
- **Styling:** Tailwind CSS 4 (Glassmorphic Components, Fixed Radial Pattern)
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Build Tool:** Vite

### Backend / Desktop Wrapper
- **Engine:** FastAPI (Python 3.12+)
- **Desktop Host:** PyWebView (Microsoft Edge WebView2 Engine)
- **Database:** SQLite
- **Schema Validation:** Pydantic
- **Packaging:** PyInstaller (Standalone `--onefile` compilation)

---

## 🚀 Installation & Developer Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- Inno Setup (v6 or higher, installed automatically via Scoop)

### 1. Clone the Repository
```bash
git clone https://github.com/karansinghverma979/F9_Deveoper.git
cd F9_Deveoper
```

### 2. Run in Development Mode
To run the project in development mode from the source code:
```bash
npm install
npm start
```
*This concurrently starts the FastAPI backend (port `8000`) and the React dev server, then automatically opens `http://localhost:5173` in your browser.*

---

## 📦 Bundling & Compiling (Production Release)

Follow these steps to build the standalone `.exe` and the Inno Setup installer package:

### 1. Build the Frontend
```bash
cd frontend
npm run build
```
*This generates production-ready assets inside `frontend/dist`.*

### 2. Copy Assets to Backend Static Folder
```bash
cd ..
python -c "import shutil, os; shutil.rmtree('backend/static', ignore_errors=True); shutil.copytree('frontend/dist', 'backend/static')"
```

### 3. Compile Standalone `.exe` (PyInstaller)
Install requirements and build the single, console-free Windows executable:
```bash
cd backend
pip install -r requirements.txt
pip install pyinstaller Pillow pywebview
pyinstaller --onefile --noconsole --name "AI-PathFinder" --icon "icon.ico" --add-data "static;static" main.py
```
*The output executable will be generated at `backend/dist/AI-PathFinder.exe`.*

### 4. Build the Setup Installer (Inno Setup)
Make sure you have Inno Setup installed (can be installed via Scoop: `scoop install inno-setup`). Compile the installer script from the root directory:
```bash
iscc installer.iss
```
*This generates `AI-PathFinder-Setup.exe` in the root workspace folder.*

---

## 🗺️ How It Works

### **Configuration & Persistence**
On first startup, the installer prompts for a custom database directory and saves this in `config.json`. The application reads this directory to initialize/connect to `candidates.db`. If the database is brand new, the app automatically runs seeding functions to populate jobs, companies, and candidates.

### **Uninstaller Clean Up**
When a user runs the uninstaller, the process reads the location of the database from `config.json`, forcefully deletes the sqlite database files, deletes the directory tree, deletes the installer files under Program Files, and cleans up shortcuts.

---

## 🤝 Collaboration & Support

### The Architects
- **Karan Singh Verma** - *Lead Full Stack Developer*
- **Ankit Kushwaha** - *Backend Architect*
- **Akarshan Gupta** - *UI/UX Designer*

---

## 📜 License
This project is built with dedication and self-taught craftsmanship. Feel free to explore, learn, and build upon it.

*AI-PathFinder © 2025*
