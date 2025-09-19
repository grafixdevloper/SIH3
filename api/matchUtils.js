/**
 * TF-IDF and Cosine Similarity implementation for matching skills
 */

/**
 * Creates a TF-IDF matrix from documents
 * @param {string[]} documents - Array of document strings
 * @returns {Object} - TF-IDF vectors and vocabulary
 */
function createTfIdfMatrix(documents) {
    // Tokenize and create vocabulary
    const vocabulary = new Set();
    const tokenizedDocs = documents.map(doc => {
        const tokens = doc.toLowerCase().split(/\s+/).filter(token => token.length > 0);
        tokens.forEach(token => vocabulary.add(token));
        return tokens;
    });

    const vocabArray = Array.from(vocabulary);
    const vocabIndex = {};
    vocabArray.forEach((term, index) => {
        vocabIndex[term] = index;
    });

    // Calculate TF (Term Frequency)
    const tfMatrix = tokenizedDocs.map(tokens => {
        const tf = new Array(vocabArray.length).fill(0);
        tokens.forEach(token => {
            const index = vocabIndex[token];
            tf[index]++;
        });
        // Normalize by document length
        const docLength = tokens.length;
        if (docLength > 0) {
            for (let i = 0; i < tf.length; i++) {
                tf[i] = tf[i] / docLength;
            }
        }
        return tf;
    });

    // Calculate IDF (Inverse Document Frequency)
    const idf = new Array(vocabArray.length);
    for (let i = 0; i < vocabArray.length; i++) {
        const termCount = tfMatrix.reduce((count, doc) => count + (doc[i] > 0 ? 1 : 0), 0);
        idf[i] = Math.log(documents.length / (termCount + 1)); // +1 to avoid division by zero
    }

    // Calculate TF-IDF
    const tfidfMatrix = tfMatrix.map(tf => {
        return tf.map((tfValue, index) => tfValue * idf[index]);
    });

    return {
        matrix: tfidfMatrix,
        vocabulary: vocabArray,
        vocabIndex: vocabIndex
    };
}

/**
 * Calculates cosine similarity between two vectors
 * @param {number[]} vec1 - First vector
 * @param {number[]} vec2 - Second vector
 * @returns {number} - Cosine similarity score (0-1)
 */
function cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        norm1 += vec1[i] * vec1[i];
        norm2 += vec2[i] * vec2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    
    if (magnitude === 0) {
        return 0;
    }

    return dotProduct / magnitude;
}

/**
 * Calculates match scores between a student's skills and internship requirements
 * @param {Object} studentProfile - Student profile with skills array
 * @param {Array} internships - Array of internship objects with required_skills
 * @returns {Array} - Internships with added match_score, sorted by score descending
 */
function calculateMatches(studentProfile, internships) {
    try {
        // Prepare documents
        const studentSkills = studentProfile.skills || [];
        const studentDoc = studentSkills.join(' ');
        
        const internshipDocs = internships.map(internship => {
            const requiredSkills = internship.required_skills || [];
            return requiredSkills.join(' ');
        });

        // If no skills provided, return all internships with 0 score
        if (studentSkills.length === 0) {
            return internships.map(internship => ({
                ...internship,
                match_score: 0
            })).sort((a, b) => b.match_score - a.match_score);
        }

        // Create all documents (internships + student)
        const allDocuments = [...internshipDocs, studentDoc];
        
        // Create TF-IDF matrix
        const tfidfResult = createTfIdfMatrix(allDocuments);
        const tfidfMatrix = tfidfResult.matrix;
        
        // Student vector is the last one
        const studentVector = tfidfMatrix[tfidfMatrix.length - 1];
        const internshipVectors = tfidfMatrix.slice(0, -1);

        // Calculate similarities and add scores to internships
        const resultsWithScores = internships.map((internship, index) => {
            const similarity = cosineSimilarity(studentVector, internshipVectors[index]);
            return {
                ...internship,
                match_score: Math.round(similarity * 1000) / 10 // Round to 1 decimal place
            };
        });

        // Sort by match score descending
        return resultsWithScores.sort((a, b) => b.match_score - a.match_score);

    } catch (error) {
        console.error('Error in calculateMatches:', error);
        
        // Fallback: simple keyword matching
        const studentSkills = (studentProfile.skills || []).map(skill => skill.toLowerCase());
        
        return internships.map(internship => {
            const requiredSkills = (internship.required_skills || []).map(skill => skill.toLowerCase());
            const intersection = studentSkills.filter(skill => requiredSkills.includes(skill));
            const matchScore = requiredSkills.length > 0 ? (intersection.length / requiredSkills.length) * 100 : 0;
            
            return {
                ...internship,
                match_score: Math.round(matchScore * 10) / 10
            };
        }).sort((a, b) => b.match_score - a.match_score);
    }
}

module.exports = {
    calculateMatches,
    cosineSimilarity,
    createTfIdfMatrix
};

// Example usage for testing
if (require.main === module) {
    const student = { skills: ["Python", "Machine Learning", "Data Analysis"] };
    const internships = [
        { title: "Data Science Intern", required_skills: ["Python", "Data Analysis", "Machine Learning"] },
        { title: "Frontend Developer Intern", required_skills: ["React", "JavaScript", "UI/UX"] },
        { title: "AI Research Intern", required_skills: ["Python", "Deep Learning", "Research"] },
        { title: "Project Management Intern", required_skills: ["Project Management", "Communication", "Excel"] },
    ];
    
    const results = calculateMatches(student, internships);
    console.log('\nMatching Results:');
    results.forEach(result => {
        console.log(`${result.title}: ${result.match_score}% match`);
    });
}
