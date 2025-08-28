const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Utility: check if username exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Utility: check if username & password match
const authenticatedUser = (username, password) => {
  let validUser = users.find(
    (user) => user.username === username && user.password === password
  );
  return validUser !== undefined;
};

// ---------------------- Task 7: Login ----------------------
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username: username }, "access", {
      expiresIn: "1h",
    });

    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// ---------------------- Task 8: Add or Modify Review ----------------------
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  let username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Initialize reviews object if not present
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

// ---------------------- Task 9: Delete Review ----------------------
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews,
    });
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
