SevaSuraksha Monorepo

This repository contains separate Frontend (React + Vite) and Backend (Node.js + Express) apps.

Structure
- frontend/ — React app (Vite)
- backend/ — Express server with Gemini chat route

Requirements
- Node.js 18+

Backend Setup
1. Create env file:
   - Path: backend/.env
   - Content:
     - GEMINI_API_KEY=YOUR_KEY_HERE
2. Install and run:
   - cd backend
   - npm install
   - npm start
   - Server runs on http://localhost:5000

API
- POST http://localhost:5000/api/chat
  - Body: { "message": "user question" }
  - Response: { "reply": "AI answer" }

Frontend Setup
1. Install and run:
   - cd frontend
   - npm install
   - npm run dev
   - App runs on http://localhost:3000

Chat Page
- Navigate to http://localhost:3000/chat
- Features: user/bot bubbles, auto-scroll, typing indicator, responsive UI

Tech Stack
- Frontend: React, Vite, React Router, React-Bootstrap, Bootstrap, Axios
- Backend: Node.js, Express, CORS, dotenv
- AI: Gemini 1.5 Flash (via Google Generative Language API)

Notes
- Keep the API key only in the backend .env; never expose it in the frontend.
- Ensure the backend is running before using the chat page.


