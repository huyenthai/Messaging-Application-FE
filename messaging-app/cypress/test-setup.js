const axios = require('axios');

const users = [
  { email: 'huyen@gmail.com', username: 'Huyen', password: 'Test123' },
  { email: 'mike@gmail.com', username: 'Mike', password: 'Test123' },
  { email: 'chau@gmail.com', username: 'Chau', password: 'Test123' },
];

(async () => {
  for (const user of users) {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', user);
      console.log(`Seeded user ${user.email}`);
    } catch (err) {
      console.error(`Failed to create user ${user.email}`, err.response?.data || err.message);
    }
  }
})();
