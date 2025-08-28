const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Task 10: Get the list of books using async/await
public_users.get('/', async (req, res) => {
  try {
    let response = await axios.get("http://localhost:5000/books"); 
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});


// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  let isbn = req.params.isbn;

  axios.get(`http://localhost:5000/books/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error fetching book details", error: error.message });
    });
});


// Task 12: Get book details based on Author using async/await
public_users.get('/author/:author', async (req, res) => {
  let author = req.params.author;

  try {
    let response = await axios.get("http://localhost:5000/books");
    let booksByAuthor = Object.values(response.data).filter(book => book.author === author);

    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});


// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', (req, res) => {
  let title = req.params.title;

  axios.get("http://localhost:5000/books")
    .then(response => {
      let booksByTitle = Object.values(response.data).filter(book => book.title === title);
      return res.status(200).json(booksByTitle);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    });
});


// Register user route (kept from earlier)
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "Unable to register user."});
});


module.exports.general = public_users;
