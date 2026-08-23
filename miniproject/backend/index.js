// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const compilerRoute = require("./compiler");

const app = express();

// ---------------------------
// FIXED CORS (Express v4 safe)
// ---------------------------
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(express.json());

// ---------------------------
// MongoDB Connect
// ---------------------------
async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mydatabase");
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error);
  }
}
connectDB();

// ---------------------------
// Test route
// ---------------------------
app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

// ---------------------------
// Compiler
// ---------------------------
app.use("/api/run", compilerRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
