const axios = require('axios');

const users = [
  { email: 'huyen@gmail.com', username: 'Huyen', password: 'Test123' },
  { email: 'mike@gmail.com', username: 'Mike', password: 'Test123' },
  { email: 'chau@gmail.com', username: 'Chau', password: 'Test123' },
];

(async () => {
  for (const user of users) {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', user);
      console.log(`Created user: ${user.email}`, res.status);
    } catch (err) {
      console.error(` Failed to create user ${user.email}`);
      console.error(err.response?.data || err.message);
    }
  }
})();
