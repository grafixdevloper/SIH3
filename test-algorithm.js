const { calculateMatches } = require('./api/matchUtils');

// Test data
const student = { skills: ["Python", "Machine Learning", "Data Analysis"] };
const internships = [
    { title: "Data Science Intern", required_skills: ["Python", "Data Analysis", "Machine Learning"] },
    { title: "Frontend Developer Intern", required_skills: ["React", "JavaScript", "UI/UX"] },
    { title: "AI Research Intern", required_skills: ["Python", "Deep Learning", "Research"] },
    { title: "Project Management Intern", required_skills: ["Project Management", "Communication", "Excel"] },
];

console.log('🧪 Testing Match Algorithm...');
console.log('\nStudent Skills:', student.skills.join(', '));

const results = calculateMatches(student, internships);

console.log('\n📊 Matching Results:');
results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.title}: ${result.match_score}% match`);
});

console.log('\n✅ Algorithm test completed successfully!');
