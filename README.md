# GraphSentinel v1.0

GraphSentinel is a modern web application for detecting and visualizing fraudulent activities in financial transaction data. It leverages advanced graph analysis to identify suspicious accounts and fraud rings, providing actionable insights for risk management.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Deployment](#deployment)


---

## Features
- **CSV Upload:** Upload transaction data for analysis.  
- **Fraud Detection:** The backend analyzes data for suspicious accounts and fraud rings using graph algorithms.  
- **Interactive Visualization:** Results are displayed as interactive graphs and tables.  
- **Summary Reports:** Provides downloadable JSON reports of detected anomalies.  
- **Authentication:** Secure user access via Clerk integration.  
- **Responsive UI:** Built with React, Vite, and modern SCSS styling.  

---

## Architecture


- **Frontend:** React + Vite (port 3000)  
- **Backend:** FastAPI (port 8000)  
- **Communication:** REST API (CORS enabled)  
- **Deployment:** Docker, Railway, or local setup  

---

## Tech Stack
- **Frontend:** React, Vite, SCSS, Clerk, vis-network, react-force-graph  
- **Backend:** Python 3.11+, FastAPI, Uvicorn, CSV, JSON  
- **DevOps:** Docker, Railway, GitHub Actions  

---

## Project Structure  

---

## Setup & Installation

### Prerequisites
- Node.js 20+  
- Python 3.11+  
- Docker (for containerized setup)  

### Local Development (Recommended)
1. **Clone the repository:**
```bash
git clone https://github.com/your-username/GraphSentinel.git
cd GraphSentinel

Start with Docker Compose:

docker-compose up -d

Frontend: http://localhost:3000

Backend: http://localhost:8000

API Docs: http://localhost:8000/docs

Manual Setup (without Docker):

Backend:

cd backend
pip install -r ../requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Frontend:

cd frontend
npm install
npm run dev

---

##Usage

Upload CSV: Go to the Input page and upload your transaction CSV file. Ensure it includes the following columns:
sender_id, receiver_id, transaction_id, amount, timestamp

Analyze: The backend processes the file, detects fraud rings and suspicious accounts, and stores results.

View Results: Results are visualized as interactive graphs and tables on the Graph page.

Download Report: Download the JSON report for further analysis.

---
##API Overview

POST /api/v1/anomalies/analyze – Upload CSV for analysis

GET /api/v1/anomalies/results – Get latest analysis results

GET /api/v1/anomalies/download – Download results as JSON

GET / – API status

GET /health – Health check

See backend/app/main.py
 for implementation details.

---
###Deployment
Railway (Production)

Push code to GitHub.

Deploy Backend: Add service with Dockerfile.backend, port 8000.

Deploy Frontend: Add service with Dockerfile.frontend, port 3000. Set VITE_API_URL to backend URL.

Set environment variables as needed.

Other Options

Vercel / Netlify: Frontend can be deployed separately.

Custom Domain: Configure via Railway dashboard.
