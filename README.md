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
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)
- [License](#license)

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

docker-compose up -d

Backend
cd backend
pip install -r ../requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Frontend
cd frontend
npm install
npm run dev
