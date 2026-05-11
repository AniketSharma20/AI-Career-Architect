"""
run.py - Start Flask backend + React frontend together.
Usage:  python run.py
"""
import subprocess
import sys
import os
import time
import threading
import io

# Force stdout to use UTF-8 so Vite's unicode chars don't crash
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = ROOT          # app.py is at root level
FRONTEND_DIR = os.path.join(ROOT, "frontend")

def stream_output(proc, label):
    """Print stdout of a subprocess with a prefix label."""
    for line in iter(proc.stdout.readline, b""):
        text = line.decode("utf-8", errors="replace").rstrip()
        try:
            print(f"[{label}] {text}", flush=True)
        except Exception:
            pass  # silently skip unprintable lines

def run_flask():
    print("[Flask] Starting backend on http://127.0.0.1:5000 ...", flush=True)
    proc = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=BACKEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    stream_output(proc, "Flask")

def run_vite():
    time.sleep(2)   # Give Flask a head-start
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"

    # Install node_modules if missing
    if not os.path.exists(os.path.join(FRONTEND_DIR, "node_modules")):
        print("[Vite] Running npm install first...", flush=True)
        subprocess.run([npm_cmd, "install"], cwd=FRONTEND_DIR)

    print("[Vite] Starting React frontend...", flush=True)
    proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        env={**os.environ, "FORCE_COLOR": "0"},   # disable ANSI colors from Vite
    )
    stream_output(proc, "Vite")

if __name__ == "__main__":
    print("=" * 50, flush=True)
    print("  AI Career Architect --- Full Stack Dev Server  ", flush=True)
    print("=" * 50, flush=True)

    flask_thread = threading.Thread(target=run_flask, daemon=True)
    vite_thread  = threading.Thread(target=run_vite,  daemon=True)

    flask_thread.start()
    vite_thread.start()

    try:
        flask_thread.join()
        vite_thread.join()
    except KeyboardInterrupt:
        print("\n[INFO] Shutting down both servers. Goodbye!", flush=True)
