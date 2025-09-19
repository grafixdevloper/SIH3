// Deployment verification script
const https = require('https');
const http = require('http');

const DEPLOYMENT_URL = process.env.VERCEL_URL || 'localhost:3000';
const isLocal = DEPLOYMENT_URL.includes('localhost');

console.log('🔍 Verifying deployment...');
console.log(`📍 Target: ${DEPLOYMENT_URL}`);

const endpoints = [
    '/api/health',
    '/api/test',
    '/api/internships',
    '/api/students'
];

function testEndpoint(endpoint) {
    return new Promise((resolve) => {
        const url = isLocal ? 
            `http://${DEPLOYMENT_URL}${endpoint}` : 
            `https://${DEPLOYMENT_URL}${endpoint}`;
        
        const client = isLocal ? http : https;
        
        const req = client.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const success = res.statusCode === 200;
                console.log(`${success ? '✅' : '❌'} ${endpoint} - Status: ${res.statusCode}`);
                if (!success) {
                    console.log(`   Response: ${data}`);
                }
                resolve(success);
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ ${endpoint} - Error: ${error.message}`);
            resolve(false);
        });
        
        req.setTimeout(10000, () => {
            console.log(`⏰ ${endpoint} - Timeout`);
            req.destroy();
            resolve(false);
        });
    });
}

async function verifyDeployment() {
    console.log('\n🚀 Testing API endpoints...\n');
    
    const results = await Promise.all(endpoints.map(testEndpoint));
    const successCount = results.filter(r => r).length;
    
    console.log('\n📊 Results:');
    console.log(`✅ Successful: ${successCount}/${endpoints.length}`);
    console.log(`❌ Failed: ${endpoints.length - successCount}/${endpoints.length}`);
    
    if (successCount === endpoints.length) {
        console.log('\n🎉 All endpoints are working! Deployment successful.');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some endpoints failed. Check the logs above.');
        process.exit(1);
    }
}

// Test POST endpoint
async function testMatchSkills() {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            skills: ['Python', 'Data Analysis']
        });
        
        const url = isLocal ? 
            `http://${DEPLOYMENT_URL}/api/match-skills` : 
            `https://${DEPLOYMENT_URL}/api/match-skills`;
        
        const client = isLocal ? http : https;
        const urlParts = new URL(url);
        
        const options = {
            hostname: urlParts.hostname,
            port: urlParts.port,
            path: urlParts.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const success = res.statusCode === 200;
                console.log(`${success ? '✅' : '❌'} POST /api/match-skills - Status: ${res.statusCode}`);
                if (success) {
                    try {
                        const parsed = JSON.parse(data);
                        console.log(`   Found ${parsed.length} matches`);
                    } catch (e) {
                        console.log(`   Response parsing error: ${e.message}`);
                    }
                }
                resolve(success);
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ POST /api/match-skills - Error: ${error.message}`);
            resolve(false);
        });
        
        req.write(postData);
        req.end();
    });
}

async function fullVerification() {
    await verifyDeployment();
    console.log('\n🧪 Testing POST endpoint...\n');
    await testMatchSkills();
    console.log('\n✨ Verification complete!');
}

if (require.main === module) {
    fullVerification();
}
