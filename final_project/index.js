const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let books = require('./router/booksdb.js');
const { general } = require('./router/general.js');
const { authenticated, isValid, users } = require('./router/auth_users.js');

app.use('/public', general);
app.use('/customer', authenticated);

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
      jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized access" });
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(403).json({ message: "Token required" });
    }
  });
  
  const PORT = 3000;
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });