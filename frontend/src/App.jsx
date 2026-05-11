import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
  Route, Wand2, FileDown, RotateCcw, Youtube, BookOpen, CheckCircle,
  Moon, Sun, Download, X, Timer, Star, Flame, Share2, NotebookPen,
  ChevronDown, ChevronUp, Trophy, Zap, Target
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './index.css';

const MOCK_API = "http://localhost:5000/api/generate-roadmap";

// ─── Pomodoro Timer Component ───────────────────────────────────────────────
function PomodoroTimer({ moduleId }) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            const nextBreak = !isBreak;
            setIsBreak(nextBreak);
            setSecondsLeft(nextBreak ? 5 * 60 : 25 * 60);
            confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  const reset = () => { setIsRunning(false); setSecondsLeft(25 * 60); setIsBreak(false); };

  return (
    <div className="pomodoro-card" onClick={e => e.stopPropagation()}>
      <div className="pomodoro-label">
        <Timer size={14} /> {isBreak ? '☕ Break Time' : '🍅 Focus Session'}
      </div>
      <div className="pomodoro-ring-wrap">
        <svg viewBox="0 0 56 56" className="pomodoro-ring">
          <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <circle cx="28" cy="28" r="24" fill="none"
            stroke={isBreak ? "var(--success)" : "var(--primary-grad-end)"}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 24}`}
            strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className="pomodoro-time">{mins}:{secs}</span>
      </div>
      <div className="pomodoro-btns">
        <button onClick={() => setIsRunning(r => !r)} className={`pomo-btn ${isRunning ? 'pomo-pause' : 'pomo-start'}`}>
          {isRunning ? '⏸' : '▶'}
        </button>
        <button onClick={reset} className="pomo-btn pomo-reset">↺</button>
      </div>
    </div>
  );
}

// ─── Star Rating Component ───────────────────────────────────────────────────
function StarRating({ moduleId, ratings, setRatings }) {
  const current = ratings[moduleId] || 0;
  return (
    <div className="star-rating" onClick={e => e.stopPropagation()}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Difficulty:</span>
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={16}
          fill={n <= current ? '#f59e0b' : 'none'}
          color={n <= current ? '#f59e0b' : 'var(--text-muted)'}
          style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => setRatings(prev => ({ ...prev, [moduleId]: n }))}
        />
      ))}
    </div>
  );
}

// ─── Toast Notification ──────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="toast">
      <CheckCircle size={18} color="var(--success)" />
      {message}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
function App() {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [theme, setTheme] = useState('dark');
  const [activeModal, setActiveModal] = useState(null);

  // New feature states
  const [ratings, setRatings] = useState({});
  const [notes, setNotes] = useState({});
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('studyStreak') || '0'));
  const [lastStudyDate, setLastStudyDate] = useState(() => localStorage.getItem('lastStudyDate') || '');
  const [toast, setToast] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [activeTimers, setActiveTimers] = useState({});

  const pdfRef = useRef();

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  // Update streak when a module is completed
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    if (lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = lastStudyDate === yesterday ? streak + 1 : 1;
      setStreak(newStreak);
      setLastStudyDate(today);
      localStorage.setItem('studyStreak', newStreak);
      localStorage.setItem('lastStudyDate', today);
    }
  }, [lastStudyDate, streak]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!skills || !role || !timeline) return;
    setLoading(true);
    try {
      const response = await axios.post(MOCK_API, { currentSkills: skills, targetRole: role, timeline });
      if (response.data.success) setRoadmapData(response.data.data);
      else throw new Error("Failed");
    } catch {
      setRoadmapData(generateMockData(skills, role, timeline));
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (e, moduleId) => {
    e.stopPropagation();
    const isNowComplete = !completedModules[moduleId];
    setCompletedModules(prev => ({ ...prev, [moduleId]: isNowComplete }));
    if (isNowComplete) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      updateStreak();
      setToast('Module completed! 🎉 Keep going!');
    }
  };

  const calculateProgress = () => {
    if (!roadmapData) return 0;
    const total = roadmapData.roadmap.length;
    const completed = Object.values(completedModules).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const handleExportPDF = () => {
    const element = pdfRef.current;
    element.classList.add('pdf-export-mode');
    html2pdf().set({
      margin: 0.5, filename: 'Career_Roadmap.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save().then(() => element.classList.remove('pdf-export-mode'));
  };

  const handleExportMarkdown = () => {
    if (!roadmapData) return;
    let md = `# Roadmap to ${roadmapData.targetRole}\n\n**Timeline:** ${roadmapData.timeline}\n\n`;
    md += `## Skill Gap Analysis\n- **Current:** ${roadmapData.skillGapAnalysis.currentSkills.join(', ')}\n`;
    md += `- **Missing:** ${roadmapData.skillGapAnalysis.missingSkills.join(', ')}\n\n> ${roadmapData.skillGapAnalysis.summary}\n\n`;
    roadmapData.roadmap.forEach(m => {
      md += `### Month ${m.month}: ${m.title}\n${m.description}\n\n`;
      if (m.checklist) { md += `**Topics:**\n`; m.checklist.forEach(i => md += `- [ ] ${i}\n`); md += '\n'; }
      if (m.interviewPrompt) md += `**Interview Prep:** _${m.interviewPrompt}_\n\n`;
      if (notes[m.id]) md += `**My Notes:** ${notes[m.id]}\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: 'Career_Roadmap.md' }).click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const data = { skills, role, timeline };
    const encoded = btoa(JSON.stringify(data));
    const shareUrl = `${window.location.origin}?roadmap=${encoded}`;
    navigator.clipboard.writeText(shareUrl).then(() => setToast('Share link copied to clipboard! 🔗'));
  };

  const toggleTimerVisibility = (e, moduleId) => {
    e.stopPropagation();
    setActiveTimers(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const progress = calculateProgress();
  const completedCount = Object.values(completedModules).filter(Boolean).length;

  return (
    <>
      <div className="background-effects">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Fixed Top Bar */}
      <div className="top-bar">
        <div className="streak-badge">
          <Flame size={16} color="#f59e0b" />
          <span>{streak} Day Streak</span>
        </div>
        <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <main className="container">
        {!roadmapData ? (
          <section className="glass-panel slide-in">
            <header className="header">
              <div className="logo">
                <Route size={40} />
                <h1>AI Career Architect</h1>
              </div>
              <p>Design your personalized path to industry readiness.</p>

              {/* Stats Row */}
              <div className="stats-row">
                <div className="stat-chip"><Trophy size={14} /> Professional Roadmaps</div>
                <div className="stat-chip"><Zap size={14} /> AI-Powered</div>
                <div className="stat-chip"><Target size={14} /> Skill Gap Analysis</div>
              </div>
            </header>

            {!loading ? (
              <form onSubmit={handleGenerate} className="form-grid">
                <div className="input-group">
                  <label>Current Skills</label>
                  <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g., HTML, CSS, JavaScript" required />
                </div>
                <div className="input-group">
                  <label>Target Role</label>
                  <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., Full Stack Developer" required />
                </div>
                <div className="input-group">
                  <label>Timeline (Months)</label>
                  <input type="number" min="1" max="24" value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="e.g., 6" required />
                </div>
                <button type="submit" className="btn-primary">
                  <span>Generate Roadmap</span>
                  <Wand2 size={20} />
                </button>
              </form>
            ) : (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>AI is crafting your perfect path...</p>
              </div>
            )}
          </section>
        ) : (
          <section className="slide-in">
            {/* Top Controls */}
            <div className="controls-bar">
              <div className="progress-block">
                <div className="progress-text">
                  <strong>{progress}% Complete</strong>
                  <span>{completedCount} / {roadmapData.roadmap.length} modules</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
              <div className="action-btns">
                <button onClick={handleShare} className="btn-icon" title="Share Roadmap"><Share2 size={16} /> Share</button>
                <button onClick={handleExportMarkdown} className="btn-icon" title="Export Markdown"><Download size={16} /> MD</button>
                <button onClick={handleExportPDF} className="btn-secondary"><FileDown size={16} /> PDF</button>
                <button onClick={() => { setRoadmapData(null); setCompletedModules({}); setRatings({}); setNotes({}); }} className="btn-outline">
                  <RotateCcw size={16} /> New
                </button>
              </div>
            </div>

            <div ref={pdfRef}>
              <div className="roadmap-header">
                <h2>Roadmap to {roadmapData.targetRole}</h2>
                <p>Estimated Timeline: {roadmapData.timeline}</p>
              </div>

              {/* Skill Gap */}
              <div className="skill-gap-card glass-panel">
                <h3 style={{ marginBottom: '1rem' }}>🔍 Skill Gap Analysis</h3>
                <div className="gap-content">
                  <div>
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>✅ Current Skills</h4>
                    {roadmapData.skillGapAnalysis.currentSkills.map((s, i) => <span key={i} className="tag">{s}</span>)}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>❌ Missing Skills</h4>
                    {roadmapData.skillGapAnalysis.missingSkills.map((s, i) => <span key={i} className="tag missing">{s}</span>)}
                  </div>
                </div>
                <p className="summary-text">{roadmapData.skillGapAnalysis.summary}</p>
              </div>

              {/* Timeline */}
              <div className="timeline-container">
                <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2rem' }}>🛤️ Your Step-by-Step Path</h3>
                <div className="timeline">
                  {roadmapData.roadmap.map((module, index) => (
                    <div key={module.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                      <div
                        className={`timeline-content ${completedModules[module.id] ? 'completed' : ''}`}
                        onClick={() => setActiveModal(module)}
                        title="Click to view full details"
                      >
                        {/* Header Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div className="timeline-month">Month {module.month}</div>
                          {completedModules[module.id] && <CheckCircle size={22} color="var(--success)" />}
                        </div>

                        <h3 style={{ marginBottom: '0.4rem', fontSize: '1.1rem' }}>{module.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{module.description}</p>

                        {/* Star Rating */}
                        <StarRating moduleId={module.id} ratings={ratings} setRatings={setRatings} />

                        {/* Notes Section */}
                        <div className="notes-section" onClick={e => e.stopPropagation()}>
                          <button className="notes-toggle" onClick={() => setExpandedNotes(p => ({ ...p, [module.id]: !p[module.id] }))}>
                            <NotebookPen size={13} />
                            {expandedNotes[module.id] ? 'Hide Notes' : 'Add Notes'}
                            {expandedNotes[module.id] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                          {expandedNotes[module.id] && (
                            <textarea
                              className="notes-textarea"
                              placeholder="Write your personal notes here..."
                              value={notes[module.id] || ''}
                              onChange={e => setNotes(p => ({ ...p, [module.id]: e.target.value }))}
                              rows={3}
                            />
                          )}
                        </div>

                        {/* Pomodoro Toggle */}
                        <button className="timer-toggle-btn" onClick={e => toggleTimerVisibility(e, module.id)}>
                          <Timer size={13} />
                          {activeTimers[module.id] ? 'Hide Timer' : '🍅 Start Focus Timer'}
                        </button>

                        {activeTimers[module.id] && <PomodoroTimer moduleId={module.id} />}

                        {/* Complete Checkbox */}
                        <label className="complete-checkbox" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" checked={!!completedModules[module.id]} onChange={e => toggleComplete(e, module.id)} />
                          Mark as Completed
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Detail Modal */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}><X size={22} /></button>
            <div className="timeline-month" style={{ marginBottom: '0.8rem' }}>Month {activeModal.month}</div>
            <h2 style={{ marginBottom: '0.4rem' }}>{activeModal.title}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{activeModal.description}</p>

            {activeModal.checklist && (
              <>
                <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>📋 Topics to Master</h4>
                <ul className="modal-checklist">
                  {activeModal.checklist.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </>
            )}

            {activeModal.interviewPrompt && (
              <div className="modal-interview-prompt">
                <strong>💡 Mock Interview Prep:</strong><br />
                {activeModal.interviewPrompt}
              </div>
            )}

            {activeModal.resources && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <h4 style={{ marginBottom: '0.8rem' }}>🔗 Curated Resources</h4>
                <ul style={{ listStyle: 'none' }}>
                  {activeModal.resources.map((res, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>
                      <a href={res.link} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--primary-grad-start)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {res.type === 'YouTube' ? <Youtube size={16} /> : <BookOpen size={16} />}
                        {res.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function generateMockData(skills, role, timeline) {
  return {
    targetRole: role,
    timeline: `${timeline} Months`,
    skillGapAnalysis: {
      currentSkills: skills.split(',').map(s => s.trim()),
      missingSkills: ["React/Next.js", "State Management", "TypeScript", "API Integration", "Testing"],
      summary: `To become an industry-ready ${role}, you need to master modern frameworks, typed languages, and backend connectivity.`
    },
    roadmap: [
      {
        id: "m1", month: 1, title: "Advanced JS & DOM", description: "Deep dive into ES6+, async programming, closures, and event-driven design.",
        checklist: ["Arrow functions & Lexical this", "Promises & async/await", "Event bubbling & delegation", "Closures & Scoping"],
        interviewPrompt: "Explain how the JavaScript event loop handles async operations. What is the difference between microtasks and macrotasks?",
        resources: [
          { type: "YouTube", title: "JavaScript: The Hard Parts", link: "https://youtube.com" },
          { type: "Docs", title: "MDN - Asynchronous JS", link: "https://developer.mozilla.org" }
        ]
      },
      {
        id: "m2", month: 2, title: "React Fundamentals", description: "Understand React philosophy, JSX, functional components, and React hooks.",
        checklist: ["Virtual DOM concepts", "useState and useEffect", "Prop drilling & Context", "Component Lifecycle"],
        interviewPrompt: "What is the difference between a controlled and uncontrolled component in React? When would you use each?",
        resources: [
          { type: "YouTube", title: "React Crash Course", link: "https://youtube.com" },
          { type: "Docs", title: "React Official Docs", link: "https://react.dev" }
        ]
      },
      {
        id: "m3", month: 3, title: "State Management & Routing", description: "Learn global state with Redux Toolkit and client-side routing with React Router.",
        checklist: ["Redux store setup", "Reducers & Actions", "React Router Dom v6", "Protected Routes"],
        interviewPrompt: "How does Redux solve the prop drilling problem and when would you choose Context API over Redux?",
        resources: [
          { type: "Docs", title: "Redux Toolkit", link: "https://redux-toolkit.js.org/" },
          { type: "YouTube", title: "React Router Tutorial", link: "https://youtube.com" }
        ]
      },
      {
        id: "m4", month: 4, title: "TypeScript Integration", description: "Add static typing to React apps to prevent bugs and improve DX.",
        checklist: ["Type Annotations", "Interfaces & Types", "Generics", "TypeScript with React"],
        interviewPrompt: "What is the difference between `interface` and `type` in TypeScript? When would you use one over the other?",
        resources: [{ type: "Docs", title: "TypeScript for React Devs", link: "https://www.typescriptlang.org/" }]
      },
      {
        id: "m5", month: 5, title: "Backend & Next.js", description: "Learn server-side rendering, API routes, and database connectivity with Next.js.",
        checklist: ["SSR vs SSG vs ISR", "Next.js API Routes", "Prisma / SQLite", "Authentication (NextAuth)"],
        interviewPrompt: "Explain the difference between SSR and SSG in Next.js and when you'd choose each approach.",
        resources: [{ type: "Docs", title: "Next.js Documentation", link: "https://nextjs.org/docs" }]
      },
      {
        id: "m6", month: 6, title: "Testing & Deployment", description: "Write unit/integration tests and deploy to production on Vercel.",
        checklist: ["Jest Basics", "React Testing Library", "CI/CD concepts", "Vercel Deployment"],
        interviewPrompt: "What is the difference between unit testing and integration testing? Write a simple test for a React component.",
        resources: [
          { type: "YouTube", title: "React Testing Crash Course", link: "https://youtube.com" },
          { type: "Docs", title: "Vercel Deployment Guide", link: "https://vercel.com/docs" }
        ]
      }
    ].slice(0, parseInt(timeline) || 3)
  };
}

export default App;
