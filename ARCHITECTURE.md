# Railway Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Internet / Users                         │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴────────────┐
        │                       │
    ┌───▼─────┐          ┌────▼──────┐
    │ Frontend │          │  Backend   │
    │ 3000     │          │  8000      │
    └───┬─────┘          └────┬───────┘
        │                      │
        │ API Requests         │
        │ (VITE_API_URL)       │
        └──────────┬───────────┘
                   │
            ┌──────▼──────┐
            │ Data Store  │
            │ (JSON/DB)   │
            └─────────────┘
```

## Local Development (Docker Compose)

```
Your Machine (localhost)
├── port 3000 ──► React + Vite Frontend
│                ├── src/
│                ├── public/
│                └── dist/ (built files)
│
└── port 8000 ──► FastAPI Backend
                 ├── app/
                 ├── data_storage/
                 └── requirements.txt
```

## Railway Deployment (Production)

```
Railway.app (Production)
│
├── Service: Backend (graphsentinel-backend)
│   ├── Dockerfile: Dockerfile.backend
│   ├── Port: 8000
│   ├── Environment: PORT=8000
│   └── URL: https://graphsentinel-backend-xxx.railway.app
│
└── Service: Frontend (graphsentinel-frontend)
    ├── Dockerfile: Dockerfile.frontend
    ├── Port: 3000
    ├── Environment:
    │   ├── PORT=3000
    │   └── VITE_API_URL=https://graphsentinel-backend-xxx.railway.app
    └── URL: https://graphsentinel-frontend-xxx.railway.app
```

## Deployment Flow

```
1. GitHub Repository
   └─ All files including Dockerfiles
      └─ triggers push event

2. Railway Detects & Builds
   ├─ Reads Dockerfile.backend
   │  └─ Installs Python + dependencies
   │     └─ Runs FastAPI app
   │
   └─ Reads Dockerfile.frontend
      └─ Installs Node.js dependencies
         └─ Builds React app
            └─ Serves built files

3. Services Running
   ├─ Backend: http://backend:8000
   ├─ Frontend: http://frontend:3000
   └─ Users: https://your-domain.railway.app

4. Communication
   └─ Frontend calls Backend API
      └─ Backend serves data
         └─ Frontend renders UI
```

## File Relationships

```
GraphSentinel/
│
├─ Dockerfiles
│  ├─ Dockerfile.backend
│  │  └─ Uses: requirements.txt
│  │         python:3.11
│  │         backend/ folder
│  │
│  └─ Dockerfile.frontend
│     └─ Uses: package.json
│            node:20
│            Frontend/ folder
│
├─ Configuration
│  ├─ railway.json (single service config)
│  ├─ railway.yaml (multi-service config)
│  ├─ Procfile (for Railway/Heroku)
│  ├─ docker-compose.yml (local dev)
│  └─ requirements.txt (Python deps)
│
├─ Scripts
│  ├─ run.sh (Linux/Mac Docker setup)
│  ├─ run.ps1 (Windows Docker setup)
│  ├─ setup.sh (Linux/Mac verification)
│  ├─ setup.bat (Windows verification)
│  └─ manage.sh (Docker Compose controls)
│
├─ Documentation
│  ├─ DEPLOYMENT_GUIDE.md (quick start)
│  ├─ RAILWAY_SETUP.md (detailed setup)
│  ├─ DEPLOYMENT_CHECKLIST.md (pre-flight)
│  └─ DEPLOYMENT_FILES.md (file summary)
│
├─ CI/CD
│  └─ .github/workflows/
│     ├─ deploy.yml (auto deploy on push)
│     └─ test.yml (testing)
│
├─ Source Code
│  ├─ backend/ (FastAPI app)
│  │  └─ app/main.py
│  │
│  └─ Frontend/ (React app)
│     └─ src/main.jsx
│
└─ Ignore Files
   ├─ .dockerignore (for Docker builds)
   ├─ .railwayignore (for Railway deploys)
   └─ .gitignore (for Git)
```

## Network Communication Flow

### Local (Docker Compose)
```
Browser → localhost:3000 (Frontend)
           ├─ Loads HTML/CSS/JS from /app/dist
           │
           └─ Makes API calls to localhost:8000
                  ↓
              FastAPI Backend
              ├─ Processes request
              ├─ Reads/writes data
              └─ Returns JSON response
                  ↓
             Browser renders response
```

### Railway (Production)
```
Browser → https://frontend-xxx.railway.app
           ├─ Served by Node.js 'serve' package
           ├─ Loads HTML/CSS/JS from /app/dist
           │
           └─ Makes API calls via VITE_API_URL
                  ↓
              VITE_API_URL = https://backend-xxx.railway.app
                  ↓
              FastAPI Backend (Uvicorn)
              ├─ Processes request
              ├─ Reads/writes data
              └─ Returns JSON response
                  ↓
             Browser renders response
```

## Environment Variables

### Backend
```
PORT=8000                              (auto-set by Railway)
VITE_API_URL=http://localhost:8000    (not used in backend)
```

### Frontend
```
PORT=3000                              (auto-set by Railway)
VITE_API_URL=http://localhost:8000    (local dev)
VITE_API_URL=https://backend-xxx...   (production on Railway)
```

## Ports

```
Local Development:
- Frontend: 3000 (React dev server or 'serve')
- Backend:  8000 (Uvicorn ASGI server)

Production (Railway):
- Frontend: 3000 (served by Railway)
- Backend:  8000 (served by Railway)
```

## Build Process

### Backend
```
1. Dockerfile.backend starts
2. Base image: python:3.11-slim
3. COPY requirements.txt
4. RUN pip install -r requirements.txt
5. COPY backend/ (app folder)
6. EXPOSE 8000
7. CMD uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```
1. Dockerfile.frontend starts (multi-stage)

STAGE 1 (Build):
- Base image: node:20-alpine
- COPY package.json
- RUN npm ci (install deps)
- COPY Frontend/ (source code)
- RUN npm run build (creates dist/)

STAGE 2 (Runtime):
- Base image: node:20-alpine
- RUN npm install -g serve (global serve package)
- COPY dist/ from build stage
- EXPOSE 3000
- CMD serve -s dist -l 3000
```

## Data Flow

```
User Input
    ↓
Frontend (React)
    ↓
API Call (HTTP/REST)
    ↓
Backend (FastAPI)
    ↓
Business Logic
    ↓
Data Store (JSON/DB)
    ↓
Response (JSON)
    ↓
Frontend (Render)
    ↓
User sees results
```

## Deployment Environments

### Development
```
Location: Your machine
Method: docker-compose up
Ports: 3000, 8000
Data: Local files
Rebuild: On code change (with hot-reload)
```

### Production (Railway)
```
Location: Railway.app servers
Method: Docker containers
Ports: 3000, 8000
Data: Persistent storage (if configured)
Rebuild: On GitHub push
```

## Service Dependencies

```
Frontend depends on:
- Node.js/npm
- Package dependencies (react, vite, etc.)
- Backend for API calls

Backend depends on:
- Python 3.11+
- FastAPI, Uvicorn
- All packages in requirements.txt

Railway depends on:
- GitHub account
- Dockerfile
- Port availability
```

---

## Quick Reference Commands

```bash
# Local Development
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f backend    # View backend logs
docker-compose logs -f frontend   # View frontend logs

# Docker Builds
docker build -f Dockerfile.backend -t graphsentinel-backend .
docker build -f Dockerfile.frontend -t graphsentinel-frontend .

# Railway CLI
railway login                     # Authenticate
railway up                        # Deploy
railway logs                      # View logs
railway status                    # Check status
```

---

**Architecture Version:** 1.0
**Created:** February 2026
**Project:** GraphSentinel
