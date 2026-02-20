# PowerShell script for Windows deployment

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "GraphSentinel Deployment Setup" -Color "Yellow"
Write-ColorOutput "==================================" -Color "Yellow"

# Check if Docker is installed
$dockerTest = docker --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Docker is not installed. Please install Docker Desktop first." -Color "Red"
    exit 1
}

Write-ColorOutput "Docker found!" -Color "Green"

# Build backend
Write-ColorOutput "Building backend Docker image..." -Color "Yellow"
docker build -f Dockerfile.backend -t graphsentinel-backend:latest .

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput "Backend image built successfully!" -Color "Green"
} else {
    Write-ColorOutput "Failed to build backend image" -Color "Red"
    exit 1
}

# Build frontend
Write-ColorOutput "Building frontend Docker image..." -Color "Yellow"
docker build -f Dockerfile.frontend -t graphsentinel-frontend:latest .

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput "Frontend image built successfully!" -Color "Green"
} else {
    Write-ColorOutput "Failed to build frontend image" -Color "Red"
    exit 1
}

# Run containers
Write-ColorOutput "Starting containers..." -Color "Yellow"
docker run -d -p 8000:8000 --name graphsentinel-backend-container graphsentinel-backend:latest
docker run -d -p 3000:3000 --name graphsentinel-frontend-container graphsentinel-frontend:latest

Write-ColorOutput "Containers started!" -Color "Green"
Write-ColorOutput "Backend: http://localhost:8000" -Color "Cyan"
Write-ColorOutput "Frontend: http://localhost:3000" -Color "Cyan"
Write-Host ""
Write-ColorOutput "To stop containers:" -Color "Yellow"
Write-ColorOutput "  docker stop graphsentinel-backend-container graphsentinel-frontend-container" -Color "Gray"
Write-ColorOutput "  docker rm graphsentinel-backend-container graphsentinel-frontend-container" -Color "Gray"
