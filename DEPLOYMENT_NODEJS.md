# Government Internship Matcher - Vercel Deployment (Node.js)

This document explains how to deploy the Government Internship Matcher to Vercel using Node.js.

## 📁 Project Structure for Vercel

```
sih3/
├── api/
│   ├── index.js            # Express.js serverless API
│   └── matchUtils.js       # AI matching algorithm in JavaScript
├── index.html              # Frontend entry point
├── styles.css              # Styling
├── script.js               # Frontend logic
├── package.json            # Node.js dependencies and scripts
├── vercel.json             # Vercel configuration
├── verify-deployment.js    # Deployment verification script
├── start.bat               # Windows startup script
├── start.sh                # Linux/Mac startup script
└── README.md               # Documentation
```

## 🚀 Deployment Steps

### 1. Prerequisites
- [Vercel CLI](https://vercel.com/cli) installed: `npm i -g vercel`
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 16+ installed locally for testing

### 2. Deploy via Vercel CLI

```bash
# Navigate to project directory
cd sih3

# Login to Vercel (one-time setup)
vercel login

# Deploy to preview environment
vercel

# Deploy to production
vercel --prod
```

### 3. Deploy via GitHub (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit - Node.js version"
git branch -M main
git remote add origin https://github.com/yourusername/gov-internship-matcher.git
git push -u origin main
```

2. **Connect to Vercel**:
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings from `package.json`

## 🛠️ Configuration Files

### `vercel.json`
```json
{
  "functions": {
    "api/index.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ]
}
```

### `package.json` (Key sections)
```json
{
  "name": "gov-internship-matcher",
  "main": "index.html",
  "scripts": {
    "start": "node api/index.js",
    "dev": "node api/index.js",
    "deploy": "vercel",
    "verify-deployment": "node verify-deployment.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

## 🔧 Local Development

### Quick Start
```bash
# Install dependencies
npm install

# Start the API server
npm run dev
# Server runs on http://localhost:3000

# In another terminal, start frontend server (optional)
npm run dev-frontend
# Frontend runs on http://localhost:8080
```

### Windows Quick Start
```batch
# Double-click start.bat or run:
start.bat
```

### Linux/Mac Quick Start
```bash
# Make executable and run:
chmod +x start.sh
./start.sh
```

## ✅ Verification

### Post-Deployment Testing

1. **Automated verification**:
```bash
npm run verify-deployment
```

2. **Manual verification**:
   - Visit: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"healthy","message":"Gov Internship Matcher API is running"}`

3. **Frontend testing**:
   - Visit: `https://your-app.vercel.app`
   - Test skills matching functionality
   - Verify theme toggle works

### Common Endpoints to Test

- `GET /api/health` - Health check
- `GET /api/internships` - All internships
- `POST /api/match-skills` - Skill matching
- `GET /api/students` - All students

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**:
   - Ensure `package.json` has all required dependencies
   - Check Node.js version compatibility (use 16+ or 18+)

2. **API Not Working**:
   - Verify `vercel.json` configuration
   - Check function timeout settings
   - Review Vercel function logs

3. **CORS Issues**:
   - CORS is configured in `api/index.js`
   - Frontend automatically detects API URL

4. **Dependency Issues**:
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📊 Performance Notes

- **Cold Start**: ~200-500ms for Node.js functions
- **Response Time**: <100ms for cached responses  
- **Concurrent Requests**: Scales automatically
- **Size Limits**: 50MB total deployment size

## 🔗 Useful Resources

- [Vercel Node.js Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

## 🎯 Environment Variables (Optional)

For production, you may want to set:

```bash
# In Vercel Dashboard -> Settings -> Environment Variables
NODE_ENV=production
API_VERSION=1.0.0
```

## 📈 Monitoring

Vercel provides built-in:
- Analytics dashboard
- Function logs
- Performance metrics  
- Error tracking

Access via: [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Functions/Analytics
