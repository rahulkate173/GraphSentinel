# Quick Start Guide for GraphSentinel Deployment

## Local Development

### Using Docker Compose (Recommended for Windows)

1. **Start the application:**
   ```bash
   docker-compose up -d
   ```

2. **Access the services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

3. **View logs:**
   ```bash
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Using Run Scripts

**On Linux/Mac:**
```bash
chmod +x run.sh manage.sh
./run.sh
```

**On Windows (PowerShell):**
```powershell
.\run.ps1
```

### Using Docker Compose Manager (Linux/Mac)

```bash
chmod +x manage.sh
./manage.sh
```

---

## Railway Deployment

### Step 1: Fork the Repository

1. Go to https://github.com/your-username/GraphSentinel
2. Fork the repository to your account

### Step 2: Create Railway Account

1. Visit https://railway.app
2. Sign up or log in with GitHub

### Step 3: Deploy Backend

1. Click "New Project" → "Deploy from GitHub repo"
2. Select your forked GraphSentinel repository
3. Create a new service:
   - Click "Add Service" → "Docker"
   - Name: `backend`
   - Dockerfile: `Dockerfile.backend`
   - Port: 8000

4. Watch the deployment in the Logs tab
5. Once deployed, note the backend URL (e.g., `https://graphsentinel-backend-xxx.railway.app`)

### Step 4: Deploy Frontend

1. Optionally deploy to the same project:
   - Click "Add Service" → "Docker"
   - Name: `frontend`
   - Dockerfile: `Dockerfile.frontend`
   - Environment variable:
     - `VITE_API_URL=<your-backend-url>`

2. Or deploy frontend to a free hosting service (Vercel, Netlify)

### Step 5: Configure Environment Variables

In Railway dashboard:

**For Backend:**
- Add any required environment variables
- PORT variable is automatic

**For Frontend:**
- Set `VITE_API_URL` to your backend URL
- Set `PORT=3000`

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend
PORT=8000

# Frontend
VITE_API_URL=http://localhost:8000
```

For production on Railway, set these in the service settings.

---

## Project Structure

```
GraphSentinel/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # Main FastAPI app
│   │   ├── api/               # API routes
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utilities
│   └── data_storage/          # Data files
├── Frontend/                   # React/Vite frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   └── services/          # API services
│   └── package.json
├── Dockerfile.backend         # Backend container
├── Dockerfile.frontend        # Frontend container
├── docker-compose.yml         # Local development
├── Procfile                   # Railway config (backend)
├── railroad.json              # Railway config
└── requirements.txt           # Python dependencies
```

---

## Troubleshooting

### Backend won't start
1. Check logs: `docker-compose logs backend`
2. Verify `requirements.txt` has all dependencies
3. Check Python version (3.11+ recommended)

### Frontend won't build
1. Check logs: `docker-compose logs frontend`
2. Verify Node.js version (20+ recommended)
3. Clear node_modules: `rm -rf Frontend/node_modules`

### API connection issues
1. Verify backend is running
2. Check `VITE_API_URL` environment variable
3. Check CORS settings in backend
4. Review network requests in browser dev tools

### Railway deployment fails
1. Check Railway logs for build errors
2. Verify Dockerfile paths are correct
3. Ensure all required files are in repository
4. Check `.railwayignore` for excluded files

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Deploy frontend to Railway (or Vercel/Netlify)
3. ✅ Set up custom domain
4. ✅ Configure monitoring and alerts
5. ✅ Set up CI/CD for automatic deployments

---

## Resources

- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Railway Docs: https://docs.railway.app
- Docker Docs: https://docs.docker.com

---

## Support

For issues or questions:
1. Check the [RAILWAY_SETUP.md](RAILWAY_SETUP.md) for detailed setup guide
2. Review Railway logs in the dashboard
3. Check backend API docs at `/docs` endpoint
