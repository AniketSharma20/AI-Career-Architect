@echo off
echo ====================================================
echo Starting Full-Stack Career Roadmap Generator...
echo ====================================================

echo Starting Flask Backend Server...
start "Flask Backend" cmd /k "cd backend && python -m pip install -r requirements.txt && python app.py"

echo Starting Vite React Frontend Server...
start "React Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo Both servers are starting up in separate windows!
echo Once the Vite server is ready, check your browser for the localhost link.
pause
