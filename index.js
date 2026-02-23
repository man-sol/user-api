// Import Express
const express = require("express");
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// --- In-memory data source ---
let users = [
  { id: "1", firstName: "Anshika", lastName: "Agarwal", hobby: "Teaching" },
  { id: "2", firstName: "Rahul", lastName: "Sharma", hobby: "Reading" }
];

// --- Middleware: Logger ---
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

// --- Middleware: Validate User for POST and PUT ---
function validateUser(req, res, next) {
  const { firstName, lastName, hobby } = req.body;
  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({ error: "firstName, lastName and hobby are required" });
  }
  next();
}

// --- Routes ---

// GET /users - fetch all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// GET /users/:id - fetch user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json(user);
});

// POST /user - add a new user
app.post("/user", validateUser, (req, res) => {
  const newUser = { id: (users.length + 1).toString(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /user/:id - update user details
app.put("/user/:id", validateUser, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  users[index] = { id: req.params.id, ...req.body };
  res.status(200).json(users[index]);
});

// DELETE /user/:id - delete a user
app.delete("/user/:id", (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  const deletedUser = users.splice(index, 1);
  res.status(200).json({ message: "User deleted", user: deletedUser[0] });
});

// --- Error handling middleware (fallback) ---
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});