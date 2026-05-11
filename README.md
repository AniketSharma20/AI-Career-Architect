<div align="center">

# 🛤️ AI Career Architect

### Personalized Career Roadmap Generator — Full-Stack App

*An AI-powered, interactive web application that generates step-by-step career learning paths based on your current skills, target role, and timeline.*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)

</div>

---

## 📸 Preview

> **Landing Page** — Premium glassmorphism dark mode UI with animated gradient background.

> **Generated Roadmap** — Interactive vertical timeline with skill gap analysis, resources, and progress tracking.

---

## ✨ Features

### 🎯 Core
| Feature | Description |
|---|---|
| **AI Roadmap Generation** | Input your skills, target role & timeline → Get a full learning path |
| **Skill Gap Analysis** | Visual comparison of current vs. missing skills |
| **Vertical Timeline UI** | Interactive month-by-month learning modules |
| **Curated Resources** | YouTube & Docs links for each module |
| **Mini Projects** | Hands-on project ideas per month |

### 🚀 Advanced
| Feature | Description |
|---|---|
| **🍅 Pomodoro Timer** | Built-in 25-min focus / 5-min break timer per module |
| **⭐ Difficulty Rating** | Rate each module 1–5 stars |
| **📝 Personal Notes** | Save notes per module (persisted in state) |
| **🔥 Streak Tracker** | Daily study streak counter (localStorage) |
| **🎉 Gamification** | Confetti animation on module completion |
| **🔍 Detail Modals** | Click any module → Full checklist + Mock Interview Prep |
| **🌗 Theme Toggle** | Dark / Light mode switcher |
| **🔗 Share Roadmap** | Copy shareable link to clipboard |
| **📄 PDF Export** | Export the full roadmap as a PDF |
| **📝 Markdown Export** | Export roadmap as a `.md` file (for Notion/GitHub) |
| **📱 Mobile Responsive** | Fully optimized for all screen sizes (390px → Desktop) |

---

## 🏗️ Tech Stack

### Backend
- **Python 3.10+** — Core language
- **Flask** — REST API framework
- **Flask-SQLAlchemy** — ORM for database
- **Flask-CORS** — Cross-Origin Resource Sharing
- **SQLite** — Lightweight database for saving roadmaps

### Frontend
- **React 19** (via **Vite 8**) — UI framework
- **Vanilla CSS** — Premium glassmorphism design system
- **Axios** — HTTP client for API calls
- **Canvas-Confetti** — Gamification celebrations
- **Lucide React** — Icon library
- **html2pdf.js** — PDF export

---

## 📁 Project Structure

```
personalization carrer project/
│
├── 📄 run.bat                   # ← One-click launcher (starts both servers)
├── 📄 README.md
│
├── 📂 backend/
│   ├── app.py                   # Flask entry point + API routes
│   ├── models.py                # SQLAlchemy DB models (User, Roadmap)
│   ├── ai_service.py            # AI/mock roadmap generation logic
│   └── requirements.txt         # Python dependencies
│
├── 📂 frontend/
│   ├── index.html               # Root HTML (viewport + SEO meta)
│   ├── package.json
│   └── src/
│       ├── App.jsx              # Main React component (all features)
│       ├── index.css            # Global design system + responsive CSS
│       └── main.jsx             # React entry point
│
└── 📂 prototype/                # Original vanilla HTML/CSS/JS prototype
```

---

## 🚀 Getting Started

### ✅ Prerequisites
- **Python 3.10+** installed → [Download](https://python.org)
- **Node.js 18+** installed → [Download](https://nodejs.org)
- **Git** (optional)

---

### ⚡ Option 1: One-Click Start (Recommended for Windows)

Just double-click `run.bat` in the project root folder.

It will automatically:
1. Install Python backend dependencies
2. Start Flask backend server on `http://localhost:5000`
3. Install Node.js frontend dependencies
4. Start React frontend on `http://localhost:5173`

```bat
run.bat
```

Then open your browser and go to → **http://localhost:5173**

---

### 🛠️ Option 2: Manual Start

**Step 1 — Start Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
> Backend runs on: `http://localhost:5000`

**Step 2 — Start Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs on: `http://localhost:5173`

---

## 🔌 API Reference

### `POST /api/generate-roadmap`
Generate a personalized roadmap.

**Request Body:**
```json
{
  "currentSkills": "HTML, CSS, JavaScript",
  "targetRole": "Full Stack Developer",
  "timeline": 6
}
```

**Response:**
```json
{
  "success": true,
  "roadmap_id": 1,
  "data": {
    "targetRole": "Full Stack Developer",
    "timeline": "6 Months",
    "skillGapAnalysis": {
      "currentSkills": ["HTML", "CSS", "JavaScript"],
      "missingSkills": ["React", "State Management", "TypeScript"],
      "summary": "..."
    },
    "roadmap": [
      {
        "id": "m1",
        "month": 1,
        "title": "Advanced JavaScript & DOM",
        "description": "...",
        "checklist": ["Arrow functions", "Promises", "..."],
        "interviewPrompt": "Explain the event loop...",
        "resources": [
          { "type": "YouTube", "title": "...", "link": "https://..." }
        ],
        "miniProject": "Build a weather app..."
      }
    ]
  }
}
```

### `GET /api/roadmaps/<roadmap_id>`
Retrieve a previously saved roadmap by ID.

---

## 🤖 Connecting a Real AI Model

The `backend/ai_service.py` is pre-structured for AI integration.

Replace the mock return with a real call — example with **Google Gemini**:

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_API_KEY")

def generate_ai_roadmap(skills, target_role, timeline):
    model = genai.GenerativeModel("gemini-pro")
    prompt = f"""
    You are an expert career coach. Generate a JSON roadmap for:
    - Current Skills: {skills}
    - Target Role: {target_role}
    - Timeline: {timeline} months
    Return ONLY valid JSON following this schema: ...
    """
    response = model.generate_content(prompt)
    return json.loads(response.text)
```

---

## 📱 Mobile Support

The app is fully responsive across all screen sizes:

| Breakpoint | Layout |
|---|---|
| ≤ 480px (Mobile) | Single column, stacked timeline, touch-friendly targets |
| 481–768px (Tablet) | Adapted grid, left-aligned timeline |
| 769px+ (Desktop) | Full two-column zigzag timeline |

---

## 🔮 Roadmap — Future Enhancements

- [ ] **User Authentication** — Login/signup with JWT tokens
- [ ] **Saved Roadmaps Dashboard** — View & resume previous roadmaps
- [ ] **Real AI Integration** — Connect Gemini / OpenAI API
- [ ] **AI Chat Mentor** — Ask questions about any module
- [ ] **Community Sharing** — Publish roadmaps publicly
- [ ] **Job Board Integration** — Show matching jobs per skill
- [ ] **Mobile App** — React Native version

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ by Aniket Sharma**

*If this project helped you, please ⭐ star the repo!*

</div>
