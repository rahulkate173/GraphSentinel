# GraphSentinel - Deployment Files Summary

This directory now contains all the necessary files for deploying to Railway.

## Files Created

### Docker Configuration
- **Dockerfile.backend** - Backend container configuration
- **Dockerfile.frontend** - Frontend container configuration
- **docker-compose.yml** - Local development setup with both services
- **.dockerignore** - Files to exclude from Docker builds

### Railway Configuration
- **railway.json** - Railway service configuration
- **railway.yaml** - Multi-service Railway configuration
- **Procfile** - Process file for Railway (legacy, for reference)
- **.railwayignore** - Files to exclude from Railway deployment

### Python Dependencies
- **requirements.txt** - Python package dependencies for backend

### Scripts
- **run.sh** - Linux/Mac deployment script (builds and runs Docker containers)
- **run.ps1** - Windows PowerShell deployment script
- **setup.sh** - Linux/Mac setup verification script
- **manage.sh** - Interactive Docker Compose management tool (Linux/Mac)

### Documentation
- **DEPLOYMENT_GUIDE.md** - Quick start guide for local and Railway deployment
- **RAILWAY_SETUP.md** - Comprehensive Railway deployment instructions
- **DEPLOYMENT_FILES.md** - This file

### CI/CD Workflows (.github/workflows/)
- **deploy.yml** - GitHub Actions workflow for automated deployment to Railway
- **test.yml** - GitHub Actions workflow for testing

---

## Quick Start

### Local Development (Recommended)

**On Windows/Mac/Linux:**
```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Deployment to Railway

1. Push your code to GitHub (with all these new files)
2. Go to https://railway.app
3. Create a new project
4. Select "Deploy from GitHub repo"
5. Choose this repository
6. Railway will auto-detect and deploy both services

---

## Architecture

```
GraphSentinel (Root)
├── backend/                    # FastAPI application
│   ├── app/main.py
│   └── data_storage/
├── Frontend/                   # React + Vite application
│   ├── src/
│   └── package.json
├── Dockerfiles                 # Container configurations
├── Railway configs             # Deployment configuration
├── Scripts                     # Helper scripts
└── GitHub Actions              # CI/CD workflows
```

---

## File Descriptions

### Dockerfiles

**Dockerfile.backend**
- Builds FastAPI backend
- Uses Python 3.11 slim image
- Installs dependencies from requirements.txt
- Exposes port 8000
- Runs: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

**Dockerfile.frontend**
- Multi-stage build for React
- Stage 1: Build with Node.js
- Stage 2: Serve with 'serve' package
- Exposes port 3000
- Runs: `serve -s dist -l 3000`

### Requirements.txt

Python packages needed for backend:
- fastapi - Web framework
- uvicorn - ASGI server
- python-multipart - File upload support
- python-dotenv - Environment variables
- pydantic - Data validation

### Railway Configuration

**railway.json** - Single backend service config
**railway.yaml** - Multi-service configuration (backend + frontend)

Use railway.yaml for deploying both services to the same Railway project.

### Scripts

**run.sh / run.ps1**
- Automated setup script
- Checks Docker installation
- Builds both Docker images
- Starts containers
- Links to services

**setup.sh**
- Verifies all deployment files
- Checks prerequisites
- Makes scripts executable
- Shows deployment summary

**manage.sh**
- Interactive menu for Docker Compose
- Start/stop services
- View logs
- Rebuild images
- Full restart

### Documentation

**DEPLOYMENT_GUIDE.md**
- Step-by-step instructions
- Docker Compose usage
- Railway deployment steps
- Troubleshooting guide
- Environment variable setup

**RAILWAY_SETUP.md**
- Detailed Railway instructions
- Service configuration
- Custom domain setup
- Monitoring and rollback
- Cost information

---

## Environment Variables

### Backend (.env in backend/ or root/)
```
PORT=8000
```

### Frontend (.env in Frontend/ or root/)
```
VITE_API_URL=http://localhost:8000
PORT=3000
```

For Railway production, set these in the service settings:
- Backend: PORT=8000
- Frontend: VITE_API_URL=https://your-backend-railway-url, PORT=3000

---

## GitHub Actions Workflows

### deploy.yml
- Triggers: Push to main/master/deploy, or PRs
- Builds Docker images
- Optionally pushes to Docker Hub
- Deploys to Railway using Railway CLI

**Required Secrets:**
- RAILWAY_TOKEN: Get from https://railway.app/account/tokens

**Optional Secrets:**
- DOCKER_USERNAME: Docker Hub username
- DOCKER_PASSWORD: Docker Hub password

### test.yml
- Triggers: PRs to main/master, push to develop
- Tests Python 3.11, 3.12
- Tests Node.js 18, 20
- Runs linting and build checks

---

## Deployment Methods

### Method 1: Railway Dashboard (Easiest)
1. Go to https://railway.app/dashboard
2. New Project → Deploy from GitHub
3. Follow prompts

### Method 2: Railway CLI
```bash
npm install -g @railway/cli
railway login
railway up
```

### Method 3: GitHub Actions (Automated)
- Workflows automatically deploy on push to main/deploy
- Requires RAILWAY_TOKEN in GitHub Secrets

### Method 4: Docker Compose (Local)
```bash
docker-compose up -d
```

---

## Troubleshooting

### Build fails
Check logs in Railway dashboard or with:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Services won't start
- Verify port availability (8000, 3000)
- Check environment variables
- Review logs for errors

### API connection issues
- Ensure VITE_API_URL matches your backend URL
- Check CORS settings in backend
- Verify network connectivity

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Docker Docs: https://docs.docker.com

---

**Created:** February 2026
**Project:** GraphSentinel
**Status:** Ready for deployment
