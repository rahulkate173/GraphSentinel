# Railway Deployment Checklist

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment Checklist

### ✓ Project Setup
- [ ] All dependencies listed in `requirements.txt` (backend)
- [ ] All dependencies listed in `Frontend/package.json` (frontend)
- [ ] No hardcoded sensitive data (API keys, passwords)
- [ ] Environment variables configured in `.env.example`

### ✓ Git Repository
- [ ] Repository pushed to GitHub
- [ ] All deployment files committed:
  - [ ] `Dockerfile.backend`
  - [ ] `Dockerfile.frontend`
  - [ ] `requirements.txt`
  - [ ] `docker-compose.yml`
  - [ ] `railway.json` or `railway.yaml`
  - [ ] `Procfile`
  - [ ] `.dockerignore`

### ✓ Local Testing (Optional but Recommended)
Run these commands locally first:

```bash
# Test with Docker Compose
docker-compose up -d

# Check services are running
curl http://localhost:8000
curl http://localhost:3000
curl http://localhost:8000/docs

# Stop services
docker-compose down
```

- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] Services are accessible on configured ports
- [ ] Frontend can communicate with backend API

### ✓ Environment Variables
Review and set up in Railway dashboard:

**Backend Service:**
- [ ] PORT = 8000 (usually auto-set)
- [ ] Any custom environment variables your app needs

**Frontend Service:**
- [ ] PORT = 3000 (usually auto-set)
- [ ] VITE_API_URL = https://<your-backend-railway-url>.railway.app

### ✓ GitHub Setup
- [ ] GitHub account created
- [ ] Repository created and code pushed
- [ ] Repository is public (or Railway has access)

### ✓ Railway Setup
- [ ] Railway account created (https://railway.app)
- [ ] Premium/Hobby plan active (free tier available)
- [ ] Connected to GitHub account

---

## Deployment Steps

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

- [ ] All files committed
- [ ] Push successful
- [ ] Remote repository updated

### Step 2: Create Railway Project
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize GitHub access
5. Select your GraphSentinel repository
6. Start deployment

- [ ] Project created
- [ ] GitHub connected
- [ ] Repository selected

### Step 3: Configure Backend Service
1. In Railway project, create Docker service
2. Set Dockerfile to `Dockerfile.backend`
3. Configure environment variables
4. Wait for build and deployment

- [ ] Service created
- [ ] Dockerfile configured
- [ ] Build successful
- [ ] Service running
- [ ] Note the public URL

### Step 4: Configure Frontend Service (Optional)
1. Create another Docker service in same project
2. Set Dockerfile to `Dockerfile.frontend`
3. Set `VITE_API_URL` environment variable to backend URL
4. Wait for build and deployment

- [ ] Service created
- [ ] Dockered configured
- [ ] API URL configured
- [ ] Build successful
- [ ] Service running
- [ ] Frontend accessible

### Step 5: Test Deployment
1. Access backend API docs: `https://<backend-url>/docs`
2. Access frontend: `https://<frontend-url>`
3. Test API connectivity from frontend

- [ ] Backend API responding
- [ ] Frontend loading
- [ ] API calls working
- [ ] No CORS errors

---

## Post-Deployment

### Monitoring
- [ ] Monitor logs in Railway dashboard
- [ ] Set up error alerts
- [ ] Review metrics and resource usage

### Custom Domain (Optional)
- [ ] Domain registered
- [ ] DNS configured
- [ ] SSL certificate generated
- [ ] Domain added to Railway service

### Rollback Plan
- [ ] Know how to access Railway dashboard
- [ ] Know how to view deployment history
- [ ] Practice rolling back if needed

---

## Troubleshooting

If deployment fails, check:

1. **Build Errors**
   - [ ] Review Railway build logs
   - [ ] Check Dockerfile syntax
   - [ ] Verify all files are in repository
   - [ ] Check `.railwayignore` for excluded files

2. **Runtime Errors**
   - [ ] Check Railway service logs
   - [ ] Verify environment variables
   - [ ] Check port availability
   - [ ] Review application startup code

3. **Connectivity Issues**
   - [ ] Verify backend and frontend are in same project (recommended)
   - [ ] Check VITE_API_URL environment variable
   - [ ] Review CORS settings in FastAPI
   - [ ] Check network connectivity

4. **Performance Issues**
   - [ ] Monitor CPU and memory usage
   - [ ] Check for resource limits
   - [ ] Review application logs
   - [ ] Optimize database queries

---

## Support Resources

- Railway Documentation: https://docs.railway.app
- FastAPI Documentation: https://fastapi.tiangolo.com
- React Documentation: https://react.dev
- GitHub Issues: Create issue in your repository
- Community Support: Railway Discord: https://discord.gg/railway

---

## Sign-Off

- [ ] All checklist items completed
- [ ] Services deployed and tested
- [ ] Monitoring configured
- [ ] Team informed of deployment
- [ ] Documentation updated

**Deployment Date:** _______________
**Deployed By:** _______________
**Backend URL:** _______________
**Frontend URL:** _______________

---

**Note:** Keep this checklist for reference and future deployments.
