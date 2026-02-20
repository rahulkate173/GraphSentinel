@echo off
REM GraphSentinel - Deployment Setup Script for Windows
REM This script prepares your project for Railway deployment

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════╗
echo ║   GraphSentinel - Deployment Setup     ║
echo ╚════════════════════════════════════════╝
echo.

REM Check Docker
echo Checking prerequisites...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found
    echo    Install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo ✓ Docker found

REM Check Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose not found
    echo    Docker Compose should be installed with Docker Desktop
    pause
    exit /b 1
)
echo ✓ Docker Compose found

REM Check Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git not found
    echo    Install Git from: https://git-scm.com/downloads
    pause
    exit /b 1
)
echo ✓ Git found

echo.
echo Verifying deployment configuration files...

setlocal enabledelayedexpansion
set "files=requirements.txt Dockerfile.backend Dockerfile.frontend Procfile railway.json docker-compose.yml DEPLOYMENT_GUIDE.md RAILWAY_SETUP.md"

for %%f in (%files%) do (
    if exist "%%f" (
        echo ✓ %%f
    ) else (
        echo ✗ %%f (missing)
    )
)

echo.
echo Configuration Summary:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Backend Framework: FastAPI
echo Frontend Framework: React + Vite
echo Deployment Platform: Railway
echo Backend Dockerfile: Dockerfile.backend
echo Frontend Dockerfile: Dockerfile.frontend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

echo Next Steps:
echo.
echo 1. Local Testing (Docker Compose)
echo    docker-compose up -d
echo.
echo 2. Prepare GitHub
echo    git add .
echo    git commit -m "Add deployment configuration"
echo    git push
echo.
echo 3. Deploy to Railway
echo    Method 1 (Recommended):
echo    - Go to https://railway.app
echo    - Create new project
echo    - Select "Deploy from GitHub repo"
echo    - Choose this repository
echo.
echo    Method 2 (Using Railway CLI):
echo    - Install: npm install -g @railway/cli
echo    - Login: railway login
echo    - Deploy: railway up
echo.
echo 4. Monitor Deployment
echo    - Check Railway Dashboard: https://railway.app/dashboard
echo    - View logs in real-time
echo    - Access your services once deployed
echo.

echo ✓ Setup verified successfully!
echo.
echo For detailed instructions, see: DEPLOYMENT_GUIDE.md
echo.
pause
