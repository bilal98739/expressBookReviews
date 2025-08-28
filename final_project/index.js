const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
const PORT = 5000;

// Parse JSON bodies
app.use(express.json());

// Session middleware (apply globally, not just /customer)
app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// Authentication middleware for customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Default 404 handler (optional but helpful)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("❌ Failed to start server:", err);
  } else {
    console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
  }
});
