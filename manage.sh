#!/bin/bash

# GraphSentinel - Docker Compose Helper Script
# This script helps manage the application using Docker Compose

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
show_menu() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}GraphSentinel Docker Manager${NC}"
    echo -e "${BLUE}================================${NC}"
    echo "1) Start services"
    echo "2) Stop services"
    echo "3) View logs (backend)"
    echo "4) View logs (frontend)"
    echo "5) Rebuild images"
    echo "6) Clean up (remove containers)"
    echo "7) Full restart"
    echo "8) Exit"
    echo -e "${BLUE}================================${NC}"
}

start_services() {
    echo -e "${YELLOW}Starting services...${NC}"
    docker-compose up -d
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Services started successfully!${NC}"
        echo -e "${BLUE}Backend: http://localhost:8000${NC}"
        echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
    else
        echo -e "${RED}Failed to start services${NC}"
    fi
}

stop_services() {
    echo -e "${YELLOW}Stopping services...${NC}"
    docker-compose down
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Services stopped successfully!${NC}"
    fi
}

view_backend_logs() {
    echo -e "${YELLOW}Backend logs (Ctrl+C to exit):${NC}"
    docker-compose logs -f backend
}

view_frontend_logs() {
    echo -e "${YELLOW}Frontend logs (Ctrl+C to exit):${NC}"
    docker-compose logs -f frontend
}

rebuild_images() {
    echo -e "${YELLOW}Rebuilding images...${NC}"
    docker-compose build --no-cache
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Images rebuilt successfully!${NC}"
    else
        echo -e "${RED}Failed to rebuild images${NC}"
    fi
}

cleanup() {
    echo -e "${YELLOW}Cleaning up...${NC}"
    docker-compose down -v
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Cleanup completed!${NC}"
    fi
}

full_restart() {
    echo -e "${YELLOW}Performing full restart...${NC}"
    cleanup
    echo -e "${YELLOW}Waiting 2 seconds...${NC}"
    sleep 2
    start_services
}

# Main loop
while true; do
    show_menu
    read -p "Select option: " choice
    
    case $choice in
        1) start_services ;;
        2) stop_services ;;
        3) view_backend_logs ;;
        4) view_frontend_logs ;;
        5) rebuild_images ;;
        6) cleanup ;;
        7) full_restart ;;
        8) echo -e "${GREEN}Exiting...${NC}"; exit 0 ;;
        *) echo -e "${RED}Invalid option${NC}" ;;
    esac
    
    echo ""
done
