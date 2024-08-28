const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route für das Login-Formular
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route für die Registrierungsseite
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Route zum Verarbeiten von Logins
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'private', 'credentials.json'), 'utf8'));
  
  if (credentials[username] === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Route zum Verarbeiten von Registrierungen
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const filePath = path.join(__dirname, 'private', 'credentials.json');
  let credentials = {};
  
  if (fs.existsSync(filePath)) {
    credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  if (credentials[username]) {
    res.json({ success: false, message: 'Username already exists' });
  } else {
    credentials[username] = password;
    fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
    res.json({ success: true });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
