import axios from 'axios';

async function test() {
  const baseURL = 'https://mergemind-backend.onrender.com/api';
  console.log('Testing Deployed APIs on', baseURL);
  
  try {
    // 1. Login or Register
    console.log('1. Trying to register/login test user...');
    let token;
    const testEmail = 'diagnostic-' + Math.floor(Math.random()*10000) + '@example.com';
    
    try {
      const regRes = await axios.post(`${baseURL}/auth/register`, {
        email: testEmail,
        password: 'Password123!',
        name: 'Diag User'
      });
      token = regRes.data.data.token || regRes.data.token;
      console.log('Registered successfully');
    } catch (e) {
      console.error('Registration failed:', e.response?.data || e.message);
      return;
    }

    console.log('Token received:', token ? 'YES' : 'NO');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    // 2. Create Empty Project
    console.log('2. Creating empty project...');
    try {
      const projectRes = await axios.post(`${baseURL}/projects`, {
        projectName: 'Diag Project ' + Date.now()
      }, { headers });
      
      console.log('Project created:', projectRes.data);
      const projectId = projectRes.data.data.project.id;

      // 3. Connect Repository
      console.log('3. Connecting repository...');
      // Use a dummy PAT or request
      const connectRes = await axios.post(`${baseURL}/github/connect`, {
        projectId,
        githubRepoId: '12345678',
        fullName: 'Aryns293/MergeMind',
        defaultBranch: 'main',
        personalAccessToken: 'ghp_invaliddummytokenforvalidationtesting'
      }, { headers });

      console.log('Repository connected:', connectRes.data);
    } catch (e) {
      console.error('API Error details:');
      if (e.response) {
        console.error('Status:', e.response.status);
        console.error('Data:', JSON.stringify(e.response.data, null, 2));
      } else {
        console.error(e.message);
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

test();
