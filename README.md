GraphSentinel is a modern web application for detecting and visualizing fraudulent activities in financial transaction data. It leverages advanced graph analysis to identify suspicious accounts and fraud rings, providing actionable insights for risk management. --- ## Table of Contents - [Features](#features) - [Architecture](#architecture) - [Tech Stack](#tech-stack) - [Project Structure](#project-structure) - [Setup & Installation](#setup--installation) - [Usage](#usage) - [API Overview](#api-overview) - [Deployment](#deployment) - [Troubleshooting](#troubleshooting) - [Resources](#resources) --- ## Features - **CSV Upload:** Upload transaction data for analysis. - **Fraud Detection:** Backend analyzes data for suspicious accounts and fraud rings using graph algorithms. - **Interactive Visualization:** Frontend displays results as interactive graphs and tables. - **Summary Reports:** Downloadable JSON reports of detected anomalies. - **Authentication:** Clerk integration for secure user access. - **Responsive UI:** Built with React, Vite, and modern SCSS styling. --- ## Architecture
┌────────────┐      API Calls      ┌────────────┐
│ Frontend   │  ───────────────▶  │  Backend   │
│ (React)    │  ◀───────────────  │ (FastAPI)  │
└────────────┘                    └────────────┘
       │                               │
       ▼                               ▼
   User Browser                  Data Storage (JSON)
- **Frontend:** React + Vite (port 3000) - **Backend:** FastAPI (port 8000) - **Communication:** REST API (CORS enabled) - **Deployment:** Docker, Railway, or local --- ## Tech Stack - **Frontend:** React, Vite, SCSS, Clerk, vis-network, react-force-graph - **Backend:** Python 3.11+, FastAPI, Uvicorn, CSV, JSON - **DevOps:** Docker, Railway, GitHub Actions --- ## Project Structure
GraphSentinel/
├── backend/           # FastAPI backend
│   ├── app/
│   │   └── main.py    # Main API logic
│   └── data_storage/  # Analysis results
├── Frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
├── requirements.txt   # Python deps
└── ... (docs, scripts)
--- ## Setup & Installation ### Prerequisites - Node.js 20+ - Python 3.11+ - Docker (for containerized setup) ### Local Development (Recommended) 1. **Clone the repository:**
bash
   git clone https://github.com/your-username/GraphSentinel.git
   cd GraphSentinel
2. **Start with Docker Compose:**
bash
   docker-compose up -d
- Frontend: http://localhost:3000 - Backend: http://localhost:8000 - API Docs: http://localhost:8000/docs 3. **Manual Setup (without Docker):** - **Backend:**
bash
     cd backend
     pip install -r ../requirements.txt
     uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
- **Frontend:**
bash
     cd Frontend
     npm install
     npm run dev
--- ## Usage 1. **Upload CSV:** Go to the Input page and upload your transaction CSV file (must include sender_id, receiver_id, transaction_id, amount, timestamp columns). 2. **Analyze:** The backend processes the file, detects fraud rings and suspicious accounts, and stores results. 3. **View Results:** Results are visualized as interactive graphs and tables on the Graph page. 4. **Download Report:** Download the JSON report for further analysis. --- ## API Overview - **POST /api/v1/anomalies/analyze**: Upload CSV for analysis - **GET /api/v1/anomalies/results**: Get latest analysis results - **GET /api/v1/anomalies/download**: Download results as JSON - **GET /**: API status - **GET /health**: Health check See [backend/app/main.py](backend/app/main.py) for implementation details. --- ## Deployment ### Railway (Production) 1. **Push code to GitHub** 2. **Deploy Backend:** - Add service with Dockerfile.backend, port 8000 3. **Deploy Frontend:** - Add service with Dockerfile.frontend, port 3000 - Set VITE_API_URL to backend URL 4. **Set environment variables as needed** ### Other Options - **Vercel/Netlify:** Frontend can be deployed separately - **Custom Domain:** Configure via Railway dashboard --- ## Troubleshooting - **Backend won't start:** Check Python version, requirements, and logs - **Frontend won't build:** Check Node.js version, clear node_modules - **API issues:** Verify backend is running, check VITE_API_URL, review CORS settings - **Deployment fails:** Check Railway logs, Dockerfile paths, and environment variables --- ## Resources - [FastAPI Docs](https://fastapi.tiangolo.com) - [React Docs](https://react.dev) - [Vite Docs](https://vitejs.dev) - [Railway Docs](https://docs.railway.app) - [Docker Docs](https://docs.docker.com) --- **Project:** GraphSentinel **Version:** 1.0 **Created:** February 2026
