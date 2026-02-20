#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}GraphSentinel Deployment Setup${NC}"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}Docker found!${NC}"

# Build and run backend
echo -e "${YELLOW}Building backend Docker image...${NC}"
docker build -f Dockerfile.backend -t graphsentinel-backend:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backend image built successfully!${NC}"
else
    echo -e "${RED}Failed to build backend image${NC}"
    exit 1
fi

# Build and run frontend
echo -e "${YELLOW}Building frontend Docker image...${NC}"
docker build -f Dockerfile.frontend -t graphsentinel-frontend:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Frontend image built successfully!${NC}"
else
    echo -e "${RED}Failed to build frontend image${NC}"
    exit 1
fi

# Run containers
echo -e "${YELLOW}Starting containers...${NC}"
docker run -d -p 8000:8000 --name graphsentinel-backend-container graphsentinel-backend:latest
docker run -d -p 3000:3000 --name graphsentinel-frontend-container graphsentinel-frontend:latest

echo -e "${GREEN}Containers started!${NC}"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "To stop containers:"
echo "  docker stop graphsentinel-backend-container graphsentinel-frontend-container"
echo "  docker rm graphsentinel-backend-container graphsentinel-frontend-container"
