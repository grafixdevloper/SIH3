#!/bin/bash

# Government Internship Matcher - Setup Script
echo "🚀 Starting Government Internship Matcher..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Start the API server
echo "🌟 Starting API server on port 3000..."
echo "📍 API Health Check: http://localhost:3000/api/health"
echo "📍 Frontend: Open index.html in your browser or use 'npm run dev-frontend'"
echo ""
echo "Press Ctrl+C to stop the server"

npm run dev
