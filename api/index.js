const express = require('express');
const cors = require('cors');
const { calculateMatches } = require('./matchUtils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests  
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// In-memory data
const ALL_STUDENTS = [
    {
        id: "1",
        name: "Priya Sharma",
        skills: ["Python", "Data Analysis", "React", "Project Management"],
    },
    {
        id: "2",
        name: "Aman Verma",
        skills: ["Python", "Machine Learning", "Deep Learning"],
    },
    {
        id: "3",
        name: "Sneha Patel",
        skills: ["React", "JavaScript", "UI/UX"],
    },
];

const ALL_INTERNSHIPS = [
    {
        id: 1,
        title: "Data Science Intern",
        ministry: "Ministry of Electronics and Information Technology",
        location: "New Delhi",
        required_skills: ["Python", "Data Analysis", "Machine Learning"],
    },
    {
        id: 2,
        title: "Frontend Developer Intern",
        ministry: "Ministry of Education",
        location: "Bangalore",
        required_skills: ["React", "JavaScript", "UI/UX"],
    },
    {
        id: 3,
        title: "AI Research Intern",
        ministry: "Ministry of Science & Technology",
        location: "Hyderabad",
        required_skills: ["Python", "Deep Learning", "Research"],
    },
    {
        id: 4,
        title: "Project Management Intern",
        ministry: "Ministry of Corporate Affairs",
        location: "Mumbai",
        required_skills: ["Project Management", "Communication", "Excel"],
    },
    {
        id: 5,
        title: "Cybersecurity Intern",
        ministry: "Ministry of Home Affairs",
        location: "New Delhi",
        required_skills: ["Cybersecurity", "Python", "Networking"],
    },
    {
        id: 6,
        title: "Digital Marketing Intern",
        ministry: "Ministry of Information & Broadcasting",
        location: "Mumbai",
        required_skills: ["Digital Marketing", "Social Media", "Content Writing"],
    },
    {
        id: 7,
        title: "Web Development Intern",
        ministry: "National Informatics Centre",
        location: "Pune",
        required_skills: ["HTML", "CSS", "JavaScript", "React"],
    },
    {
        id: 8,
        title: "Data Analytics Intern",
        ministry: "Ministry of Statistics & Programme Implementation",
        location: "Chennai",
        required_skills: ["Data Analysis", "Excel", "SQL", "Statistics"],
    },
];

// Mock data for candidates
const candidates = [
    {
        id: 1,
        name: "Aman Verma",
        university: "IIT Delhi",
        match_score: 98,
    },
    {
        id: 2,
        name: "Sneha Patel",
        university: "BITS Pilani",
        match_score: 95,
    },
    {
        id: 3,
        name: "Rahul Singh",
        university: "NIT Trichy",
        match_score: 93,
    },
    {
        id: 4,
        name: "Meera Nair",
        university: "VIT Vellore",
        match_score: 91,
    },
];

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: "healthy",
        message: "Gov Internship Matcher API is running",
        timestamp: new Date().toISOString().split('T')[0],
        version: "1.0.0"
    });
});

// Also handle health check without /api prefix for Vercel
app.get('/health', (req, res) => {
    res.json({
        status: "healthy",
        message: "Gov Internship Matcher API is running",
        timestamp: new Date().toISOString().split('T')[0],
        version: "1.0.0"
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        method: "GET",
        message: "GET test successful",
        api_working: true
    });
});

app.get('/test', (req, res) => {
    res.json({
        method: "GET",
        message: "GET test successful",
        api_working: true
    });
});

app.post('/api/test', (req, res) => {
    const data = req.body || {};
    res.json({
        method: "POST",
        received_data: data,
        message: "POST test successful"
    });
});

app.post('/test', (req, res) => {
    const data = req.body || {};
    res.json({
        method: "POST",
        received_data: data,
        message: "POST test successful"
    });
});

// Get recommendations for a specific student
app.get('/api/recommendations/:student_id', (req, res) => {
    try {
        const studentId = req.params.student_id;
        const student = ALL_STUDENTS.find(s => s.id === studentId);
        
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        // Use AI match function
        const scored = calculateMatches(student, JSON.parse(JSON.stringify(ALL_INTERNSHIPS)));
        
        // Return only necessary fields
        const result = scored.map(i => ({
            id: i.id,
            title: i.title,
            ministry: i.ministry,
            location: i.location,
            required_skills: i.required_skills,
            match_score: i.match_score,
        }));
        
        res.json(result);
    } catch (error) {
        console.error('Error in get_recommendations:', error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

// Get candidates for a specific internship
app.get('/api/candidates/:internship_id', (req, res) => {
    res.json(candidates);
});

// Match skills endpoint
app.post('/api/match-skills', (req, res) => {
    try {
        const data = req.body;
        
        if (!data) {
            return res.status(400).json({ error: "No JSON data provided" });
        }
        
        const skills = data.skills || [];
        
        if (!skills.length) {
            return res.status(400).json({ error: "No skills provided" });
        }
        
        // Create a mock student profile with the provided skills
        const studentProfile = { skills: skills };
        
        // Use AI match function
        const scored = calculateMatches(studentProfile, JSON.parse(JSON.stringify(ALL_INTERNSHIPS)));
        
        // Return only necessary fields
        const result = scored.map(i => ({
            id: i.id,
            title: i.title,
            ministry: i.ministry,
            location: i.location,
            required_skills: i.required_skills,
            match_score: i.match_score,
        }));
        
        res.json(result);
        
    } catch (error) {
        console.error('Error in match_skills:', error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

// Also handle match-skills without /api prefix for Vercel
app.post('/match-skills', (req, res) => {
    try {
        const data = req.body;
        
        if (!data) {
            return res.status(400).json({ error: "No JSON data provided" });
        }
        
        const skills = data.skills || [];
        
        if (!skills.length) {
            return res.status(400).json({ error: "No skills provided" });
        }
        
        // Create a mock student profile with the provided skills
        const studentProfile = { skills: skills };
        
        // Use AI match function
        const scored = calculateMatches(studentProfile, JSON.parse(JSON.stringify(ALL_INTERNSHIPS)));
        
        // Return only necessary fields
        const result = scored.map(i => ({
            id: i.id,
            title: i.title,
            ministry: i.ministry,
            location: i.location,
            required_skills: i.required_skills,
            match_score: i.match_score,
        }));
        
        res.json(result);
        
    } catch (error) {
        console.error('Error in match_skills:', error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

// Get all internships
app.get('/api/internships', (req, res) => {
    res.json(ALL_INTERNSHIPS);
});

// Get all students (for admin purposes)
app.get('/api/students', (req, res) => {
    res.json(ALL_STUDENTS);
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: "Gov Internship Matcher API",
        version: "1.0.0",
        endpoints: [
            "GET /api/health",
            "GET /api/test",
            "POST /api/test",
            "GET /api/recommendations/:student_id",
            "GET /api/candidates/:internship_id",
            "POST /api/match-skills",
            "GET /api/internships",
            "GET /api/students"
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found` 
    });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Gov Internship Matcher API running on port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
}

// Export for Vercel
module.exports = app;
