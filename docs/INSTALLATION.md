# 🚀 AI-PathFinder Installation & Setup Guide

This guide covers all methods for installing, running, and building **AI-PathFinder** on Windows 10 and 11.

---

## ⚡ Multi-Pathway Installation Matrix

| Method | Target Audience | Dependencies Required | Time to Launch |
| :--- | :--- | :--- | :--- |
| **Pathway A: Standalone Installer** | General Users & Recruiters | None (Zero Dependencies) | **< 30 seconds** |
| **Pathway B: Portable Archive** | Users wanting zero registry writes | None (Zero Dependencies) | **< 15 seconds** |
| **Pathway C: Build from Source** | Developers & Contributors | Node.js 20+, Python 3.11+, Inno Setup | ~5 minutes |

---

## 💻 Pathway A: Standalone Windows Installer (Recommended)

The easiest method to get started. No external runtimes (Node, Python) are required.

### 1-Line PowerShell Command
Open PowerShell and run:
```powershell
irm https://github.com/karansinghverma979/AI-PathFinder/releases/download/v1.0.0/AI-PathFinder-Setup.exe -OutFile AI-PathFinder-Setup.exe; .\AI-PathFinder-Setup.exe
```

### Manual Download
1. Download **`AI-PathFinder-Setup.exe`** from the [Latest GitHub Release](https://github.com/karansinghverma979/AI-PathFinder/releases/tag/v1.0.0).
2. Double-click the `.exe` installer.
3. Follow the Setup Wizard:
   * Select your application installation path (defaults to `{autopf}\AI-PathFinder`).
   * Select your SQLite database folder (defaults to `%LOCALAPPDATA%\AI-PathFinder\Database\`).
4. Click **Install**. Launch AI-PathFinder from your Desktop or Start Menu.

---

## 🛠️ Pathway C: Build & Package from Source

For developers who want to inspect the source code or build custom variations.

### 1. Prerequisites
* **Git**: `git --version`
* **Node.js**: v20.x or higher LTS
* **Python**: 3.11 or higher
* **Inno Setup**: v6.x (for running `iscc.exe`)

### 2. Clone Repository
```bash
git clone https://github.com/karansinghverma979/AI-PathFinder.git
cd AI-PathFinder
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*FastAPI server initializes on `http://127.0.0.1:8000`.*

### 4. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm ci
npm run dev
```
*Vite web application initializes on `http://localhost:5173`.*

### 5. Compiling Standalone Production Installer
To bundle the complete standalone Windows `.exe` installer:

```bash
# Step 1: Build the Vite production bundle
cd frontend
npm run build
cd ..

# Step 2: Copy static assets into backend
python -c "import shutil, os; shutil.rmtree('backend/static', ignore_errors=True); shutil.copytree('frontend/dist', 'backend/static')"

# Step 3: Compile PyInstaller backend executable
cd backend
pip install pyinstaller Pillow pywebview
pyinstaller --onefile --noconsole --name "AI-PathFinder" --icon "icon.ico" --add-data "static;static" main.py
cd ..

# Step 4: Run Inno Setup Compiler
iscc installer.iss
```
*The compiled installer `AI-PathFinder-Setup.exe` will be generated in the root repository directory.*

---

## 🧹 Complete Uninstallation

To completely remove AI-PathFinder from your system:
1. Open Windows **Settings** > **Apps** > **Installed apps**.
2. Find **AI-PathFinder** and click **Uninstall**.
3. The custom uninstaller will remove:
   * The application executable and static bundles in `{app}`.
   * Desktop and Start Menu shortcut registrations.
   * `config.json` configuration markers.
   * The runtime SQLite database (`candidates.db` and temporary WAL files) in `%LOCALAPPDATA%\AI-PathFinder\Database\`.
