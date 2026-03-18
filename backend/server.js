const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});
app.get("/songs", (req, res) => {
    res.json([
      { id: 1, name: "Arijit Song" },
      { id: 2, name: "AP Dhillon Song" }
    ]);
  });
  require("dotenv").config();
const connectDB = require("./config/db");

connectDB();

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const songRoutes = require("./routes/songRoutes");
app.use("/api/songs", songRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});