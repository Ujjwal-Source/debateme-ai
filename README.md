# ⚔️ DebateMe AI

> AI-powered debate arena. Challenge your ideas. Destroy fallacies. Think better.

![Version](https://img.shields.io/badge/version-4.0-gold)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Features

- ⚔️ **VS AI** — Debate against 7 famous styles (Peterson, Hitchens, Socrates, Elon, Gandhi, Nietzsche)
- 👥 **2 Player Mode** — Turn-based debate with a friend
- ⚡ **Speed Mode** — 10-second arguments, pure instinct
- 🎭 **AI vs AI** — Watch two AI styles battle each other
- 🧠 **Coach Mode** — Real-time coaching tips after every argument
- ⚡ **Fact Checking** — Parallel fact-check on every argument
- 💡 **Argument Suggestions** — AI suggests counter-arguments
- 💪 **Strength Meter** — Real-time argument quality score
- 🎰 **XP Bet Mode** — Bet your XP on the outcome
- 🃏 **Argument Cards** — Strategic power cards
- 📊 **Weakness Heatmap** — Track your debate patterns
- 🏆 **XP System + Rank Titles** — Level up from Rookie to Legend
- 🎖️ **12 Achievements** — Unlock badges as you improve
- 🎯 **Daily Challenge** — New topic every day
- 🏟️ **Tournament Mode** — 3-round bracket
- 📚 **Debate School** — 5 lessons with quizzes
- 🔊 **Text-to-Speech** — AI speaks its responses aloud
- 🎙️ **Voice Input** — Speak your arguments in Hindi/English
- 🌙 **Dark/Light Mode** — Beautiful on both
- 📱 **Mobile Responsive** — Works on all screen sizes

---

## 🛠️ Local Setup (VS Code)

### Step 1 — Prerequisites

Install these first (if not already installed):

| Tool | Download Link | Check if installed |
|------|--------------|-------------------|
| **Node.js** (v18+) | [nodejs.org](https://nodejs.org) | `node --version` |
| **Git** | [git-scm.com](https://git-scm.com) | `git --version` |
| **VS Code** | [code.visualstudio.com](https://code.visualstudio.com) | — |

### Step 2 — Clone / Download the project

**Option A — Clone from GitHub (after uploading):**
```bash
git clone https://github.com/YOUR_USERNAME/debateme-ai.git
cd debateme-ai
```

**Option B — Download ZIP:**
1. Download and extract the ZIP
2. Open VS Code
3. File → Open Folder → select the extracted folder

### Step 3 — Install dependencies

Open VS Code terminal (`Ctrl+`` ` `` `):
```bash
npm install
```

This downloads React, Vite, and all other packages (~30 seconds).

### Step 4 — Run the app

```bash
npm run dev
```

Open your browser: **http://localhost:3000** ✅

The app will hot-reload whenever you save a file.

### Step 5 — Recommended VS Code Extensions

Install these for the best development experience:
- **ES7+ React Snippets** — `dsznajder.es7-react-js-snippets`
- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Auto Rename Tag** — `formulahendry.auto-rename-tag`
- **GitLens** — `eamodio.gitlens`

---

## 📁 Project Structure

```
debateme-ai/
│
├── public/
│   └── sword.svg           # Favicon
│
├── src/
│   ├── main.jsx            # React entry point
│   └── App.jsx             # Main app (entire game logic + UI)
│
├── index.html              # HTML shell
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── netlify.toml            # Netlify deploy config
├── vercel.json             # Vercel deploy config
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🐙 GitHub Upload — Step by Step

### Step 1 — Create GitHub account
Go to [github.com](https://github.com) and sign up (free).

### Step 2 — Create a new repository
1. Click **"New"** (green button) or go to github.com/new
2. Repository name: `debateme-ai`
3. Description: `AI-Powered Debate Arena`
4. Choose **Public** (so you can deploy free)
5. **DO NOT** check "Initialize repository" (we'll push our own)
6. Click **"Create repository"**

### Step 3 — Connect local project to GitHub

In VS Code terminal, inside the project folder:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# First commit
git commit -m "🚀 Initial commit - DebateMe AI v4"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/debateme-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4 — Future updates

Every time you make changes:
```bash
git add .
git commit -m "✨ Add new feature: [describe what you added]"
git push
```

---

## 🌐 Deployment — Go Live!

### Option A — Vercel (Recommended — Fastest, Free)

1. Go to [vercel.com](https://vercel.com) — sign up with GitHub
2. Click **"New Project"**
3. Click **"Import"** next to your `debateme-ai` repo
4. Vercel auto-detects Vite ✅
5. Click **"Deploy"**
6. Done! Your app is live at: `https://debateme-ai.vercel.app`

**Auto-deploy:** Every `git push` automatically redeploys! 🔄

### Option B — Netlify (Also Free)

1. Go to [netlify.com](https://netlify.com) — sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub → select `debateme-ai`
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **"Deploy site"**
7. Live at: `https://debateme-ai.netlify.app`

### Option C — GitHub Pages (Free, slightly more setup)

```bash
npm install --save-dev gh-pages
```

Add to `package.json` scripts:
```json
"deploy": "gh-pages -d dist",
"predeploy": "npm run build"
```

Add to `vite.config.js`:
```js
base: '/debateme-ai/',
```

Then deploy:
```bash
npm run deploy
```

---

## 🔄 Update Workflow

Once deployed, updating is simple:

```bash
# 1. Make your changes in VS Code
# 2. Test locally with: npm run dev
# 3. When ready:

git add .
git commit -m "🆕 Feature: describe what you added"
git push

# Vercel/Netlify automatically rebuilds and redeploys! ✅
```

---

## 🛣️ Roadmap — Coming Features

- [ ] 🎙️ Full Voice Debate (AI speaks back with TTS)
- [ ] 🌍 Real News Mode (live headlines as debate topics)
- [ ] 🎭 Debate Script Generator
- [ ] 🤝 Interview Practice Mode
- [ ] 📊 Visual Argument Map
- [ ] 🃏 Argument Strategy Cards
- [ ] 🌐 Full Hindi Mode
- [ ] 📱 PWA (installable mobile app)
- [ ] 🔥 Online Multiplayer

---

## ⚙️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Claude Sonnet API | AI debate engine, fact-check, coach |
| Web Speech API | Voice input & TTS |
| window.storage / sessionStorage | Persistent data |
| CSS Custom Properties | Theming system |

---

## 📄 License

MIT — free to use, modify, and deploy.

---

**Built with ⚔️ by DebateMe AI**
