const express = require("express");
const app = express();

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Custom Logging Middleware
app.use((req, res, next) => {
  const currentTime = new Date().toISOString();
  console.log(`Request received at: ${currentTime}`);
  console.log(`${req.method} ${req.url}`);
  next();
});

// In-memory user storage
let users = [];

// Helper function for consistent JSON response
const createResponse = (message, data = null) => {
  return {
    message,
    time: new Date().toISOString(),
    data
  };
};


// Root Route
app.get("/", (req, res) => {
  res.json(createResponse("Server Running"));
});


// ================= USERS ROUTES =================

// GET all users
app.get("/users", (req, res) => {
  res.json(createResponse("Users fetched", users));
});


// BONUS: GET user by ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const user = users[id];

  if (!user) {
    return res.status(404).json(createResponse("User not found"));
  }

  res.json(createResponse("User fetched", user));
});


// POST add new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json(createResponse("Name and email are required"));
  }

  // Check duplicate email
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json(createResponse("Email already exists"));
  }

  const newUser = { name, email };

  users.push(newUser);

  res.status(201).json(createResponse("User added successfully", newUser));
});


// DELETE user by ID
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (!users[id]) {
    return res.status(404).json(createResponse("User not found"));
  }

  const deletedUser = users.splice(id, 1);

  res.json(createResponse("User deleted successfully", deletedUser));
});


// ================= LOGIN ROUTE =================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json(createResponse("All fields required"));
  }

  // Hardcoded credentials
  if (email === "admin@gmail.com" && password === "1234") {
    return res.json(createResponse("Login Success"));
  }

  res.status(401).json(createResponse("Invalid Credentials"));
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
