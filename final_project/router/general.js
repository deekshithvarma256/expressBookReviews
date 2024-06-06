const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password required." })
    }
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username is already taken." })
    }
    if (!isValid) {
        return res.status(400).json({ message: "Please enter valid username." })
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered." });
});
const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(books) }, 2000)
    })
}
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    getBooks().then(books => res.status(200).send(JSON.stringify(books, null, 4)))
        .catch(err => { console.log(err); res.status(500).json({ message: "Internal server error" }) })
});
const getIsbnBook = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { if (books[isbn]) { resolve(books[isbn]) } else { reject("Book not found.") } }, 2000)
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    //Write your code here
    const { isbn } = req.params;
    try {
        const book = await getIsbnBook(isbn);
        res.status(200).json(book);
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

const getAuthorBook = (author) => {
    return new Promise((resolve, reject) => {
        let bookfilter = Object.values(books).filter(book => book.author === author);
        setTimeout(() => { if (bookfilter.length > 0) { resolve(bookfilter) } 
        else { reject("Book not found.") } }, 2000)
    })
}
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    try {
        const { author } = req.params;
        const filtered = await getAuthorBook(author);
        res.status(200).send(JSON.stringify(filtered, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

const getTitleBook = (title) => {
    return new Promise((resolve, reject) => {
        let bookfilter = Object.values(books).filter(book => book.title === title);
        if (bookfilter.length > 0){
            setTimeout(() => { resolve(bookfilter) }, 2000)
        } else { reject("Book not found.") } })
}
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    try{
        const { title } = req.params;
        const filtered = await getTitleBook(title);
        res.status(200).send(JSON.stringify(filtered, null, 4));
    } catch(err) {
        res.status(404).json({ message: err });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const { isbn } = req.params;
    const book = books[isbn]
    if (book && Object.values(book.reviews).length > 0) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4))
    }
    return res.status(200).json({ message: "No reviews yet." });
});

module.exports.general = public_users;
