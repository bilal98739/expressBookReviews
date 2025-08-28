const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ---------------------- Task 10: Get the list of books ----------------------
public_users.get("/", async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// ---------------------- Task 11: Get book details based on ISBN ----------------------
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ---------------------- Task 12: Get book details based on Author ----------------------
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    let booksByAuthor = Object.values(books).filter((book) => book.author === author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// ---------------------- Task 13: Get book details based on Title ----------------------
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  let booksByTitle = Object.values(books).filter((book) => book.title === title);
  return res.status(200).json(booksByTitle);
});

// ---------------------- Register user ----------------------
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { // ✅ fix: prevent duplicate
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user." });
});

module.exports.general = public_users;
