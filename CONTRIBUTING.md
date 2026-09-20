# Showcase & Forking Guide 🧭

> **AI-PathFinder is an immutable, feature-complete production showcase and open-source architectural reference.**

---

## 🏛️ Repository Status: Showcase Only

**AI-PathFinder v1.0.0 is finished.** The application has reached its architectural goal as a zero-dependency, standalone Windows desktop application for career gap analysis, structured learning path generation, and reverse-hiring recruitment with local SQLite storage.

### 🚫 Why Pull Requests Are Closed
To preserve the deterministic architecture, packaging reproducibility, and stability of this milestone release:
- **We do not accept external pull requests or unsolicited code modifications.**
- **We do not accept feature requests or roadmap proposals.**
- Any pull requests opened against this repository will be automatically acknowledged and closed by our GitHub Actions showcase sentry.

---

## 🍴 You Are Warmly Welcome to Fork!

If you want to add new features, integrate LLM providers (Gemini, Claude, OpenAI), enhance the UI, or adapt the hiring matcher for your organization, **you are enthusiastically encouraged to fork this repository**!

Under the terms of the **[MIT License](LICENSE)**, you have full freedom to:
- Fork the project and customize the codebase to your liking.
- Run, compile, and distribute your own personal or commercial builds.
- Extract patterns, API endpoints, or database schemas for your own software.

---

## 🛠️ Local Development & Fork Guide

If you have forked AI-PathFinder and want to develop locally:

### 1. Prerequisites
- **Node.js**: v20.x or higher LTS
- **Python**: 3.11 or higher
- **Inno Setup**: v6.x (for compiling the Windows installer via `iscc.exe`)

### 2. Clone Your Fork
```bash
git clone https://github.com/<your-username>/AI-PathFinder.git
cd AI-PathFinder
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*FastAPI server boots on `http://127.0.0.1:8000` with automatic SQLite table creation and database seeding.*

### 4. Frontend Setup
In a new terminal:
```bash
cd frontend
npm ci
npm run dev
```
*Vite development server boots on `http://localhost:5173` with instant hot reloading.*

### 5. Packaging Standalone Windows Installer
1. **Build Frontend Bundle**:
   ```bash
   cd frontend
   npm run build
   cd ..
   python -c "import shutil, os; shutil.rmtree('backend/static', ignore_errors=True); shutil.copytree('frontend/dist', 'backend/static')"
   ```
2. **Compile PyInstaller Executable**:
   ```bash
   cd backend
   pip install pyinstaller Pillow pywebview
   pyinstaller --onefile --noconsole --name "AI-PathFinder" --icon "icon.ico" --add-data "static;static" main.py
   cd ..
   ```
3. **Compile Inno Setup Installer**:
   ```bash
   iscc installer.iss
   ```
   *Outputs `AI-PathFinder-Setup.exe` in root directory.*

---

## 📜 Licensing & Attribution

AI-PathFinder is released under the **[MIT License](LICENSE)**. If you fork this project or reuse its architecture, please preserve the original copyright notice:

```text
Copyright (c) 2025 Karan Singh Verma
```

Thank you for exploring AI-PathFinder! 🧭
