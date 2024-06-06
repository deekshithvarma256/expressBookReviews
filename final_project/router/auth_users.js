const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:'deek', password:'password'}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return /^[a-zA-Z0-9]{3,}$/.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!authenticatedUser(username,password)){
    return res.status(401).json({message: "Incorrect username or password."})
  }
  const token = jwt.sign({username}, "jwt_secret_key", {expiresIn: '1h'});
  req.session.token = token;
  console.log(token)
  return res.status(200).json({message: "Successfully logged in."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const {isbn} = req.params;
    const {review} = req.body;
    const book = books[isbn]
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }
    book.reviews[req.user.username] = review;
    return res.status(200).json({ message: "Review added/updated successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
      const {isbn} = req.params;
      const book = books[isbn]
      const username = req.session.username;
      if (!book) {
          return res.status(404).json({ message: "Book not found." });
      }
      book.reviews[username] = {};
      return res.status(200).json({ message: "Review deleted successfully." });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
