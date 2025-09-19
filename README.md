# Government Internship Matcher - Frontend

A simple and intuitive web application that helps students find matching government internship opportunities based on their skills or resume.

## Features

### 🎯 Two Ways to Find Matches
1. **Skills Selection**: Choose from a comprehensive list of categorized skills
2. **Resume Upload**: Upload your resume and let AI analyze your skills automatically

### 🌙 Dark Mode Support
- Toggle between light and dark themes
- Dark theme features deep purple (`#231054`) color scheme
- Theme preference saved automatically
- Smooth transitions between themes

### 🏛️ Government Ministry Internships
- Ministry of Electronics and Information Technology (MeitY)
- Ministry of Education  
- Ministry of Science & Technology
- Ministry of Corporate Affairs
- And more...

### 🤖 AI-Powered Matching
- Uses TF-IDF vectorization and cosine similarity
- Provides percentage match scores
- Ranks internships by compatibility

## Files Structure

```
sih3/ (Root Directory - Ready for Vercel)
├── api/
│   ├── index.js            # Express.js serverless API for Vercel
│   └── matchUtils.js       # AI matching algorithm (JavaScript)
├── index.html              # Main HTML file with dark mode toggle
├── styles.css              # CSS styling with theme variables  
├── script.js               # JavaScript functionality with theme management
├── package.json            # Node.js dependencies and scripts
├── vercel.json             # Vercel deployment configuration
├── verify-deployment.js    # Deployment verification script
├── VERCEL_CHECKLIST.md     # Pre-deployment checklist
├── DEPLOYMENT.md           # Detailed deployment guide
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## How to Run

### Local Development

#### Prerequisites
- Node.js 16 or higher
- npm (comes with Node.js)
- Modern web browser (Chrome, Firefox, Safari, Edge)

#### Backend Setup
```bash
# Navigate to project directory
cd sih3

# Install Node.js dependencies
npm install

# Start the backend server
npm run dev
```

The backend will start at `http://localhost:3000`

#### Frontend Setup

Simply open `index.html` in your web browser, or use a local server:

##### Option A: Direct File Opening
```bash
# Simply double-click index.html or open in browser
# File path: file:///path/to/sih3/index.html
```

##### Option B: Local Server (Recommended for full functionality)
```bash
# Using Node.js http-server (installed as dev dependency)
npm run dev-frontend
# Then visit: http://localhost:8080

# Or using Node.js http-server (if installed)
npx http-server
# Then visit: http://localhost:8080
```

**Note**: Using a local server is recommended to avoid CORS issues when making API calls.

### 🚀 Production Deployment (Vercel)

Your project is **ready for Vercel deployment** from the root directory!

#### Quick Deploy Commands:
```bash
# Install Vercel CLI (one-time setup)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production  
vercel --prod

# Verify deployment
npm run verify-deployment
```

#### Pre-deployment Checklist:
See [VERCEL_CHECKLIST.md](VERCEL_CHECKLIST.md) for complete verification steps.

#### Automated GitHub Deployment:
1. Push your code to GitHub repository
2. Connect repository in [Vercel Dashboard](https://vercel.com/dashboard)
3. Automatic deployments on every push to main branch

#### Quick Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/gov-internship-matcher)

**Vercel deployment features:**
- ✅ Serverless Node.js API functions  
- ✅ Automatic HTTPS and custom domains
- ✅ Global CDN for fast loading
- ✅ Auto-deployment from Git
- ✅ Preview deployments for pull requests
- ✅ Built-in analytics and monitoring

## How to Use

### Method 1: Skills Selection
1. Click on the "Select Skills" tab
2. Choose skills from categorized lists:
   - Programming & Development (Python, JavaScript, React, etc.)
   - Data Science & AI (Machine Learning, Deep Learning, etc.)
   - Design & UI/UX (Figma, Adobe Creative Suite, etc.)
   - Business & Management (Project Management, Communication, etc.)
3. Click "Find My Matches" to get recommendations

### Method 2: Resume Upload
1. Click on the "Upload Resume" tab
2. Drag & drop your resume or click to browse
3. Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
4. Click "Analyze Resume & Find Matches"

### Theme Toggle
- Click the moon/sun icon in the header to switch between light and dark themes
- Your theme preference is automatically saved

## API Endpoints

The backend provides these endpoints:

- `GET /api/recommendations/<student_id>` - Get matches for a specific student
- `GET /api/candidates/<internship_id>` - Get candidates for an internship
- `POST /api/match-skills` - Get matches based on provided skills array

### Example API Usage

```javascript
// Find matches for selected skills
fetch('http://localhost:5000/api/match-skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        skills: ['Python', 'Data Analysis', 'Machine Learning'] 
    })
})
```

## Customization

### Adding New Skills
Edit the skill categories in `index.html` and add corresponding entries to the backend skill matching logic.

### Adding New Internships
Modify the `ALL_INTERNSHIPS` array in `intern_ai_backend.py`.

### Styling
Customize the appearance by editing `styles.css`. The design uses:
- CSS Grid and Flexbox for layout
- Gradient backgrounds
- Smooth animations and transitions
- Responsive design for mobile devices

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS custom properties (variables)
  - CSS Grid and Flexbox for responsive layouts
  - Gradient backgrounds and smooth animations
  - Dark/light theme system using CSS variables
- **JavaScript (Vanilla)**: 
  - Theme management with localStorage persistence
  - File upload handling and validation
  - REST API communication
  - Dynamic UI updates

### Backend  
- **Node.js & Express**: Lightweight REST API server
- **CORS**: Cross-origin resource sharing support
- **Custom ML Implementation**: TF-IDF and cosine similarity in pure JavaScript

### Dependencies (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",    // Web framework
    "cors": "^2.8.5",        // CORS support
    "ml-matrix": "^6.10.7"   // Matrix operations for ML
  },
  "devDependencies": {
    "http-server": "^14.1.1" // Local development server
  }
}
```

## Browser Support

- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

## Future Enhancements

- [ ] Real resume parsing using NLP libraries (spaCy, NLTK)
- [ ] User authentication and profile management
- [ ] Save favorite internships and application tracking
- [ ] Advanced filtering options (location, duration, stipend)
- [ ] Email notifications for new matching opportunities
- [ ] Integration with actual government internship portals
- [ ] System theme detection (auto dark/light mode)
- [ ] Multi-language support for wider accessibility
- [ ] Mobile app version using Progressive Web App (PWA)
- [ ] Analytics dashboard for internship coordinators

## Troubleshooting

### Common Issues

1. **CORS Error**: If you see CORS errors, make sure to:
   - Run the frontend through a local server (not file://)
   - Ensure the API server is running: `npm run dev`

2. **Dependencies Missing**: If Node.js modules are missing:
   ```bash
   npm install
   ```

3. **Port Already in Use**: If port 3000 is occupied:
   ```javascript
   // In api/index.js, change PORT to a different value:
   const PORT = process.env.PORT || 3001;
   // Then update API_BASE_URL in script.js to http://localhost:3001
   ```

4. **Dark Mode Not Saving**: Clear browser cache and localStorage:
   - Open Developer Tools (F12)
   - Go to Application/Storage tab
   - Clear localStorage for your domain

## Contributing

This project was created for the Smart India Hackathon. Feel free to contribute by:
- Adding more government internship opportunities
- Improving the skill matching algorithm
- Enhancing the UI/UX design
- Adding new features

---

Made with ❤️ for Smart India Hackathon 2024
