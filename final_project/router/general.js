const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({message: "Username and Password required."})
    }
    if(users.some(user => user.username === username)){
        return res.status(400).json({message: "Username is already taken."})
    }
    if(!isValid){
        return res.status(400).json({message: "Please enter valid username."})
    }
    users.push({ username, password });
    return res.status(201).json({message: "User successfully registered."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const { isbn } = req.params;
    const book = books[isbn]
    if(book){
        return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found."})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const {author} = req.params;
  const filtered = Object.values(books).filter(book => book.author === author);
  if(filtered.length>0){
    return res.status(200).send(JSON.stringify(filtered, null, 4));
  }
  return res.status(404).json({message: "Book not found."});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const {title} = req.params;
    const filtered = Object.values(books).filter(book => book.title === title);
    if(filtered.length>0){
        return res.status(200).send(JSON.stringify(filtered, null, 4));
    }
    return res.status(404).json({message: "Book not found."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const {isbn} = req.params;
    const book = books[isbn]
    if( book && Object.values(book.reviews).length>0){
        return res.status(200).send(JSON.stringify(book.reviews, null, 4))
    }
    return res.status(200).json({message: "No reviews yet."});
});

module.exports.general = public_users;
