# 🚀 Vercel Deployment Checklist

## Pre-deployment Verification

### Required Files in Root Directory ✅
- [x] `package.json` - NPM configuration
- [x] `vercel.json` - Vercel deployment config
- [x] `index.html` - Frontend entry point
- [x] `styles.css` - Styling
- [x] `script.js` - Frontend JavaScript
- [x] `requirements.txt` - Local Python dependencies
- [x] `.gitignore` - Git ignore rules

### API Directory Structure ✅
- [x] `api/index.py` - Serverless Python function
- [x] `api/requirements.txt` - API Python dependencies

### Supporting Files ✅
- [x] `match_utils.py` - Matching algorithm (referenced in vercel.json)
- [x] `intern_ai_backend.py` - Local development server
- [x] `DEPLOYMENT.md` - Deployment documentation
- [x] `verify-deployment.js` - Deployment verification script

## Deployment Commands

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview (development)
npm run deploy
# OR
vercel

# Deploy to production
npm run deploy-prod
# OR
vercel --prod

# Verify deployment
npm run verify-deployment
```

## Local Testing Before Deployment

```bash
# Test local development server
python intern_ai_backend.py
# Then visit: http://localhost:5000

# Test frontend
python -m http.server 8080
# Then visit: http://localhost:8080

# Verify API health
npm run test-api
```

## Post-deployment Verification

After deployment, test these URLs (replace with your Vercel URL):

### Frontend
- https://your-project.vercel.app/

### API Endpoints
- https://your-project.vercel.app/api/health
- https://your-project.vercel.app/api/internships
- https://your-project.vercel.app/api/students

### POST Endpoint Test
```bash
curl -X POST https://your-project.vercel.app/api/match-skills \
  -H "Content-Type: application/json" \
  -d '{"skills": ["Python", "Data Analysis"]}'
```

## Environment Variables (if needed)

```bash
# Set environment variables
vercel env add VARIABLE_NAME

# Example for API base URL override
vercel env add API_BASE_URL https://your-custom-api.com
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Python version compatibility in `api/requirements.txt`
2. **Import errors**: Verify `match_utils.py` is included in `vercel.json`
3. **CORS issues**: Ensure Flask-CORS is properly configured
4. **Function timeout**: Optimize heavy computations or upgrade Vercel plan

### Debug Commands:
```bash
# View function logs
vercel logs https://your-deployment-url.vercel.app

# Local development with Vercel environment
vercel dev

# Check deployment status
vercel ls
```

## Success Indicators ✅

After successful deployment:
- [ ] Frontend loads at Vercel URL
- [ ] Dark/light theme toggle works
- [ ] Skills selection works
- [ ] File upload interface works
- [ ] API endpoints return JSON responses
- [ ] Match functionality returns results
- [ ] No console errors in browser

## Repository Setup for Auto-deployment

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository in Vercel dashboard
3. Enable auto-deployment on push to main branch
4. Configure build settings (usually auto-detected)

---

**🎉 Your Government Internship Matcher is ready for production!**
