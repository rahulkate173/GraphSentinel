#!/bin/bash

# GraphSentinel - Deployment Setup Script
# This script prepares your project for Railway deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   GraphSentinel - Deployment Setup     ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found${NC}"
    echo "   Install Docker from: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo -e "${GREEN}✓ Docker found${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose not found${NC}"
    echo "   Docker Compose should be installed with Docker Desktop"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose found${NC}"

# Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not found${NC}"
    echo "   Install Git from: https://git-scm.com/downloads"
    exit 1
fi
echo -e "${GREEN}✓ Git found${NC}"

echo ""
echo -e "${YELLOW}Setting up deployment files...${NC}"

# Make scripts executable
if [ -f "run.sh" ]; then
    chmod +x run.sh
    echo -e "${GREEN}✓ run.sh made executable${NC}"
fi

if [ -f "manage.sh" ]; then
    chmod +x manage.sh
    echo -e "${GREEN}✓ manage.sh made executable${NC}"
fi

if [ -f "setup.sh" ]; then
    chmod +x setup.sh
    echo -e "${GREEN}✓ setup.sh made executable${NC}"
fi

echo ""
echo -e "${YELLOW}Verifying deployment configuration files...${NC}"

# Check required files
required_files=(
    "requirements.txt"
    "Dockerfile.backend"
    "Dockerfile.frontend"
    "Procfile"
    "railway.json"
    "docker-compose.yml"
    "DEPLOYMENT_GUIDE.md"
    "RAILWAY_SETUP.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file (missing)${NC}"
    fi
done

echo ""
echo -e "${YELLOW}Configuration Summary:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Backend Framework: ${BLUE}FastAPI${NC}"
echo -e "Frontend Framework: ${BLUE}React + Vite${NC}"
echo -e "Deployment Platform: ${BLUE}Railway${NC}"
echo -e "Backend Dockerfile: ${BLUE}Dockerfile.backend${NC}"
echo -e "Frontend Dockerfile: ${BLUE}Dockerfile.frontend${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. ${BLUE}Local Testing${NC}"
echo "   For Docker Compose:"
echo "   ${GREEN}docker-compose up -d${NC}"
echo ""
echo "2. ${BLUE}Prepare GitHub${NC}"
echo "   - Push your code to GitHub"
echo "   - ${GREEN}git add .${NC}"
echo "   - ${GREEN}git commit -m 'Add deployment configuration'${NC}"
echo "   - ${GREEN}git push${NC}"
echo ""
echo "3. ${BLUE}Deploy to Railway${NC}"
echo "   Method 1 (Recommended):"
echo "   - Go to https://railway.app"
echo "   - Create new project"
echo "   - Select 'Deploy from GitHub repo'"
echo "   - Choose this repository"
echo ""
echo "   Method 2 (Using Railway CLI):"
echo "   - Install: ${GREEN}npm install -g @railway/cli${NC}"
echo "   - Login: ${GREEN}railway login${NC}"
echo "   - Deploy: ${GREEN}railway up${NC}"
echo ""
echo "4. ${BLUE}Monitor Deployment${NC}"
echo "   - Check Railway Dashboard: https://railway.app/dashboard"
echo "   - View logs in real-time"
echo "   - Access your services once deployed"
echo ""

echo -e "${GREEN}✓ Setup completed successfully!${NC}"
echo ""
echo "For detailed instructions, see: ${BLUE}DEPLOYMENT_GUIDE.md${NC}"
echo ""
