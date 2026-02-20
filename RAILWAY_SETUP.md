# Railway Deployment Guide

This guide will help you deploy GraphSentinel to Railway.

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository with this code
- Railway CLI installed (optional but recommended)

## Deployment Options

### Option 1: Deploy Backend & Frontend as Separate Services (Recommended)

#### Step 1: Create Backend Service

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your forked GraphSentinel repository
4. Once connected, click "Add Service" → "Docker"
5. Configure the backend service:
   - **Service Name**: `backend` or `graphsentinel-backend`
   - **Dockerfile**: Point to `Dockerfile.backend`
   - **Port**: 8000

6. Add environment variables if needed (Railway auto-detects PORT)
7. Deploy

#### Step 2: Create Frontend Service

1. In the same Railway project, click "Add Service" → "Docker"
2. Configure the frontend service:
   - **Service Name**: `frontend` or `graphsentinel-frontend`
   - **Dockerfile**: Point to `Dockerfile.frontend`
   - **Port**: 3000

3. Link the frontend to communicate with backend (if needed)
4. Deploy

### Option 2: Deploy Backend Only (Simpler)

If you want to deploy just the backend initially:

1. Create a new Railway project
2. Connect your GitHub repository
3. Add a Docker service with `Dockerfile.backend`
4. Set PORT environment variable
5. Deploy

## Environment Variables

Add these in Railway dashboard under your service settings:

**Backend:**
- `PORT=8000`
- Any other environment variables your app needs

**Frontend:**
- `PORT=3000`
- `VITE_API_URL=<your-backend-railway-url>` (if needed for API calls)

## Using railway.json

Place `railway.json` in the root directory for automatic configuration:

```bash
railway up
```

## Manual Deployment Commands

```bash
# Using Railway CLI
railway login
railway init
railway up
```

## Monitoring & Logs

1. Go to Railway Dashboard
2. Select your service
3. Click "Logs" tab to view real-time logs
4. Monitor metrics under "Metrics" tab

## Domain Setup

After deployment, Railway provides a URL like `https://graphsentinel-backend-xxx.railway.app`

You can set up a custom domain:
1. Go to Service Settings
2. Click "Domain"
3. Add your custom domain

## Useful Scripts

### Local Testing

**On Linux/Mac:**
```bash
./run.sh
```

**On Windows (PowerShell):**
```powershell
.\run.ps1
```

### Stop Local Containers

```bash
docker stop graphsentinel-backend-container graphsentinel-frontend-container
docker rm graphsentinel-backend-container graphsentinel-frontend-container
```

## Troubleshooting

### Build fails
- Check that `requirements.txt` has all dependencies
- Ensure `Dockerfile` paths are correct
- Check logs in Railway dashboard

### Connection issues between services
- Use Railway's internal networking: `http://backend:8000` from frontend
- Check CORS settings in FastAPI backend
- Verify environment variables are set

### Port conflicts
- Railway automatically handles port assignment
- Check PORT environment variable is set
- Don't hardcode ports in code

## Rollback

If something goes wrong:
1. Go to Railway Dashboard
2. Select the service
3. Click "Deployments"
4. Select a previous successful deployment
5. Click "Rollback"

## Cost

Railway offers a free tier with generous limits. Monitor your usage at:
- Railway Dashboard → Account → Usage

## Support

- Railway Docs: https://docs.railway.app
- GitHub Issues: Report any build/deployment issues
