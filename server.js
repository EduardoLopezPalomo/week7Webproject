const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: false
  }));

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

    res.status(200).json(newUser);
  });
});

app.get('/api/user/list', (req, res) => {
  res.json(users);
});

app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;
  
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      req.session.user = user;
      res.status(200).json({ message: 'Login successful' });
    });
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
