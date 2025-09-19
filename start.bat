@echo off
title Government Internship Matcher - Setup

echo 🚀 Starting Government Internship Matcher...

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
) else (
    echo ✅ Dependencies already installed
)

:: Start the API server
echo.
echo 🌟 Starting API server on port 3000...
echo 📍 API Health Check: http://localhost:3000/api/health
echo 📍 Frontend: Open index.html in your browser or run 'npm run dev-frontend' in another terminal
echo.
echo Press Ctrl+C to stop the server

npm run dev

pause
