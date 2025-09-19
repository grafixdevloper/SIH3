// Global variables
let selectedSkills = [];
let uploadedFile = null;

// DOM elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const skillCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const findMatchesBtn = document.getElementById('find-matches-btn');
const resumeInput = document.getElementById('resume-input');
const uploadArea = document.getElementById('upload-area');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const removeFileBtn = document.getElementById('remove-file');
const analyzeResumeBtn = document.getElementById('analyze-resume-btn');
const resultsSection = document.getElementById('results-section');
const loading = document.getElementById('loading');
const matchesContainer = document.getElementById('matches-container');
const noMatches = document.getElementById('no-matches');
const selectedSkillsDisplay = document.getElementById('selected-skills');
const themeToggle = document.getElementById('theme-toggle');

// API base URL - automatically detects environment
function getApiBaseUrl() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    console.log('Current location:', {
        hostname,
        protocol,
        origin: window.location.origin,
        href: window.location.href
    });
    
    // If running locally (either localhost server or file://)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || protocol === 'file:') {
        console.log('Using local API server');
        return 'http://localhost:3000';
    }
    
    // If deployed on Vercel or other platforms
    console.log('Using production API server');
    return window.location.origin;
}

const API_BASE_URL = getApiBaseUrl();
console.log('API Base URL:', API_BASE_URL);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeTabs();
    initializeSkillSelection();
    initializeFileUpload();
    initializeButtons();
});

// Theme functionality
function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', toggleTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle icon
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Tab functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab contents
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Hide results when switching tabs
    hideResults();
}

// Skill selection functionality
function initializeSkillSelection() {
    skillCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedSkills);
    });
    
    updateFindMatchesButton();
}

function updateSelectedSkills() {
    selectedSkills = Array.from(skillCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
    updateFindMatchesButton();
}

function updateFindMatchesButton() {
    findMatchesBtn.disabled = selectedSkills.length === 0;
    
    if (selectedSkills.length > 0) {
        findMatchesBtn.innerHTML = `<i class="fas fa-search"></i> Find My Matches (${selectedSkills.length} skills selected)`;
    } else {
        findMatchesBtn.innerHTML = '<i class="fas fa-search"></i> Find My Matches';
    }
}

// File upload functionality
function initializeFileUpload() {
    // Click to upload
    uploadArea.addEventListener('click', () => {
        resumeInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    resumeInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    removeFileBtn.addEventListener('click', removeFile);
}

function handleFileUpload(file) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        alert('Please upload a valid resume file (PDF, DOC, DOCX, or TXT)');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }
    
    uploadedFile = file;
    fileName.textContent = file.name;
    
    // Show file info and analyze button
    fileInfo.classList.remove('hidden');
    analyzeResumeBtn.classList.remove('hidden');
    
    // Hide upload area
    uploadArea.style.display = 'none';
}

function removeFile() {
    uploadedFile = null;
    resumeInput.value = '';
    fileInfo.classList.add('hidden');
    analyzeResumeBtn.classList.add('hidden');
    uploadArea.style.display = 'block';
    hideResults();
}

// Button event handlers
function initializeButtons() {
    findMatchesBtn.addEventListener('click', () => {
        if (selectedSkills.length > 0) {
            findMatches(selectedSkills);
        }
    });
    
    analyzeResumeBtn.addEventListener('click', () => {
        if (uploadedFile) {
            analyzeResume(uploadedFile);
        }
    });
}

// API functions
async function testApiConnectivity() {
    try {
        console.log('Testing API connectivity...');
        const response = await fetch(`${API_BASE_URL}/api/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('API health check successful:', data);
            return true;
        } else {
            console.warn('API health check failed:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.warn('API health check error:', error.message);
        return false;
    }
}

async function findMatches(skills) {
    showLoading();
    displaySelectedSkills(skills);
    
    // First test API connectivity
    const apiWorking = await testApiConnectivity();
    if (!apiWorking) {
        console.warn('API health check failed, but continuing with main request...');
    }
    
    try {
        console.log('Making API request to:', `${API_BASE_URL}/api/match-skills`);
        console.log('With skills:', skills);
        
        const response = await fetch(`${API_BASE_URL}/api/match-skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ skills: skills })
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            
            // Provide more specific error messages
            let errorMessage = `HTTP error! status: ${response.status}`;
            if (response.status === 404) {
                errorMessage += '. The API endpoint was not found. Please check if the server is running.';
            } else if (response.status === 405) {
                errorMessage += '. Method not allowed. The server may not support POST requests on this endpoint.';
            } else if (response.status >= 500) {
                errorMessage += '. Server error. Please try again later.';
            }
            
            throw new Error(`${errorMessage}, message: ${errorText}`);
        }
        
        const matches = await response.json();
        console.log('Received matches:', matches);
        displayMatches(matches);
    } catch (error) {
        console.error('Error finding matches:', error);
        showError(`Failed to find matches: ${error.message}. Please check the console for more details.`);
    }
}

async function analyzeResume(file) {
    showLoading();
    
    // For now, we'll simulate resume analysis by extracting skills
    // In a real implementation, you would send the file to a backend service
    // that uses NLP to extract skills from the resume
    
    try {
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock extracted skills - in reality, this would come from resume analysis
        const extractedSkills = await simulateResumeAnalysis(file);
        
        displaySelectedSkills(extractedSkills);
        findMatches(extractedSkills);
        
    } catch (error) {
        console.error('Error analyzing resume:', error);
        showError('Failed to analyze resume. Please try again.');
    }
}

// Simulate resume analysis (in a real app, this would be done server-side)
async function simulateResumeAnalysis(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result.toLowerCase();
            const skills = [];
            
            // Simple keyword matching (in reality, you'd use more sophisticated NLP)
            const skillKeywords = {
                'python': 'Python',
                'javascript': 'JavaScript',
                'react': 'React',
                'machine learning': 'Machine Learning',
                'deep learning': 'Deep Learning',
                'data analysis': 'Data Analysis',
                'ui/ux': 'UI/UX',
                'project management': 'Project Management',
                'communication': 'Communication',
                'excel': 'Excel',
                'java': 'Java',
                'research': 'Research'
            };
            
            for (const [keyword, skill] of Object.entries(skillKeywords)) {
                if (text.includes(keyword)) {
                    skills.push(skill);
                }
            }
            
            // Add some random skills if none found
            if (skills.length === 0) {
                skills.push('Communication', 'Project Management');
            }
            
            resolve([...new Set(skills)]); // Remove duplicates
        };
        
        reader.readAsText(file);
    });
}

// UI helper functions
function showLoading() {
    resultsSection.classList.remove('hidden');
    loading.classList.remove('hidden');
    matchesContainer.innerHTML = '';
    noMatches.classList.add('hidden');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function hideLoading() {
    loading.classList.add('hidden');
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

function showError(message) {
    hideLoading();
    matchesContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

function displaySelectedSkills(skills) {
    selectedSkillsDisplay.innerHTML = skills
        .map(skill => `<span class="skill-badge">${skill}</span>`)
        .join('');
}

function displayMatches(matches) {
    hideLoading();
    
    if (matches.length === 0) {
        noMatches.classList.remove('hidden');
        return;
    }
    
    matchesContainer.innerHTML = matches
        .map(match => createMatchCard(match))
        .join('');
}

function createMatchCard(match) {
    const scoreClass = getScoreClass(match.match_score);
    const formattedScore = Math.round(match.match_score);
    
    return `
        <div class="match-card">
            <div class="match-header">
                <div class="match-title">
                    <h3>${match.title}</h3>
                    <div class="ministry">${match.ministry}</div>
                    <div class="location"><i class="fas fa-map-marker-alt"></i> ${match.location}</div>
                </div>
                <div class="match-score">
                    <div class="score-circle ${scoreClass}">
                        ${formattedScore}%
                    </div>
                    <span>Match</span>
                </div>
            </div>
            <div class="required-skills">
                <h4><i class="fas fa-tools"></i> Required Skills:</h4>
                <div class="skills-tags">
                    ${match.required_skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function getScoreClass(score) {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
}

// Add some CSS for error messages
const style = document.createElement('style');
style.textContent = `
    .error-message {
        text-align: center;
        padding: 40px;
        color: var(--error-text);
        background: var(--error-bg);
        border-radius: 12px;
        margin: 20px 0;
    }
    
    .error-message i {
        font-size: 3rem;
        margin-bottom: 15px;
        display: block;
    }
    
    .error-message h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    
    .primary-btn:disabled {
        background: var(--text-muted);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;
document.head.appendChild(style);
