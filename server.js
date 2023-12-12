const express = require('express');
const bcrypt = require('bcryptjs');
const PORT = 3000;

const app = express();
app.use(express.json());

let users = [];

app.post('/api/user/register', (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const id = Math.floor(Math.random() * 1000000) + 1;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const newUser = {
      id,
      username,
      password: hashedPassword 
    };

    users.push(newUser);

    res.status(201).json(newUser);
  });
});

app.get('/api/user/list', (req, res) => {
  res.json(users);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
