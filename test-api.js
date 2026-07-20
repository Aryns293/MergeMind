import axios from 'axios';
import fs from 'fs';

async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com', // I don't know the user's email, but wait, I can just grab a user from prisma
      password: 'Password123!'
    });
    console.log(res.data);
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
run();
