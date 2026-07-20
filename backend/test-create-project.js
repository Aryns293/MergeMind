import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const baseURL = 'http://localhost:5050/api';
  console.log('Testing APIs on', baseURL);
  
  try {
    // 1. Login
    console.log('1. Logging in...');
    let loginRes;
    try {
      loginRes = await axios.post(`${baseURL}/auth/login`, {
        email: 'demo@mergemind.vercel.app',
        password: 'password123'
      });
    } catch (e) {
      console.log('Login failed, trying to register demo user...');
      loginRes = await axios.post(`${baseURL}/auth/register`, {
        email: 'demo@mergemind.vercel.app',
        password: 'password123',
        name: 'Demo User'
      });
    }

    const token = loginRes.data.data.token || loginRes.data.token;
    console.log('Token received:', token ? 'YES' : 'NO');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    // 2. Create Empty Project
    console.log('2. Creating empty project...');
    const projectRes = await axios.post(`${baseURL}/projects`, {
      projectName: 'Test Project ' + Date.now()
    }, { headers });
    
    console.log('Project created:', projectRes.data);
    const projectId = projectRes.data.data.project.id;

    // 3. Connect Repository
    console.log('3. Connecting repository...');
    const pat = process.env.GITHUB_ACCESS_TOKEN;
    console.log('Using PAT:', pat ? 'Configured' : 'Missing');
    
    const connectRes = await axios.post(`${baseURL}/github/connect`, {
      projectId,
      githubRepoId: '99999999',
      fullName: 'Aryns293/MergeMind',
      defaultBranch: 'main',
      personalAccessToken: pat
    }, { headers });

    console.log('Repository connected:', connectRes.data);

  } catch (error) {
    console.error('Error during API test:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

test();
