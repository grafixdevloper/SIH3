# Fixing the 405 Error - Deployment Troubleshooting Guide

## The Problem
You're getting a "405 Method Not Allowed" error when trying to access the `/api/match-skills` endpoint. This is likely because:

1. **Vercel deployment is not working correctly**
2. **The API endpoint is not properly configured**
3. **CORS issues or routing problems**

## Quick Fixes

### Option 1: Test Locally First
1. Open a terminal in your project directory
2. Run the API server locally:
   ```bash
   cd c:\Users\win11\Documents\sih2
   python api\index.py
   ```
3. Open your browser to `http://localhost:3000` (if using Live Server) or open `index.html` directly
4. Test the skill matching functionality

### Option 2: Fix Vercel Deployment

#### Step 1: Check Your Vercel Deployment URL
- Go to your Vercel dashboard
- Find your project and get the correct deployment URL
- Update the test script to use your actual URL instead of "https://your-vercel-url.vercel.app"

#### Step 2: Redeploy to Vercel
```bash
# If you have Vercel CLI installed
vercel --prod

# Or push to your connected Git repository
git add .
git commit -m "Fix API routing and CORS issues"
git push origin main
```

#### Step 3: Check Vercel Function Logs
- Go to Vercel dashboard → Your Project → Functions
- Click on your API function to see logs
- Look for any errors in the deployment

### Option 3: Use the API Test Page
1. Open `api-test.html` in your browser
2. Test each endpoint individually
3. Check which ones work and which ones fail
4. Use the console to see detailed error messages

## What I've Fixed

### 1. Improved CORS Handling
- Added more specific CORS headers
- Better preflight request handling
- Added `@app.after_request` decorator for consistent headers

### 2. Enhanced Error Messages
- More descriptive error messages for different HTTP status codes
- API connectivity testing before main requests
- Better console logging for debugging

### 3. Fixed API Base URL Detection
- More robust URL detection for different deployment scenarios
- Proper handling of localhost vs. production environments

### 4. Updated Vercel Configuration
- Added `methods` specification in routing
- Proper static file handling
- Correct output directory configuration

## Testing Steps

1. **Test API Locally:**
   - Run `python test_api.py` to test all endpoints
   - Check which endpoints return 200 vs 404/405

2. **Test in Browser:**
   - Open browser console (F12)
   - Try the skill matching feature
   - Check the API requests in the Network tab

3. **Check Vercel Deployment:**
   - Verify your deployment URL is correct
   - Check function logs in Vercel dashboard
   - Test API endpoints directly in browser

## Next Steps

1. **If working locally:** The issue is with your Vercel deployment
2. **If not working locally:** There's a code issue that needs fixing
3. **If 404 errors:** The routing is incorrect
4. **If 405 errors:** The HTTP method is not allowed
5. **If CORS errors:** The frontend and backend domains don't match

## Contact Points for Help

If you're still getting the 405 error:
1. Share your actual Vercel deployment URL
2. Share the browser console output
3. Share the Network tab details for the failed request
4. Let me know if the local server works or not

The API test results showed that your `/api/match-skills` endpoint IS working locally (Status 200), so the code is correct. The issue is likely with the deployment configuration or URL.
