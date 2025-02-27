require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const socketIo = require("socket.io");

const app = express();  // <--- Define app here
const server = http.createServer(app);  // Use app to create server
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/votingDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB Models
const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  hash: String,
  hasVoted: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const VoteSchema = new mongoose.Schema({
  candidate: String,
  userHash: String,
  timestamp: { type: Date, default: Date.now },
});

const BlacklistSchema = new mongoose.Schema({
  phone: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
});

const CandidateSchema = new mongoose.Schema({
  candidateA: String,
  candidateB: String,
});

const User = mongoose.model("User", UserSchema);
const Vote = mongoose.model("Vote", VoteSchema);
const Blacklist = mongoose.model("Blacklist", BlacklistSchema);
const Candidate = mongoose.model("Candidate", CandidateSchema);

// API Routes

// Register User and Generate Hash
app.post("/register", async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and Phone are required!" });
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ error: "Phone number already registered!" });
  }

  const hash = crypto.createHash("sha256").update(uuidv4()).digest("hex");
  const newUser = new User({ name, phone, hash });
  await newUser.save();

  res.json({ hash });
});

// Validate Hash
app.post("/validate-hash", async (req, res) => {
  const { hash } = req.body;
  const user = await User.findOne({ hash });

  if (!user) {
    return res.status(400).json({ error: "Invalid Hash!" });
  }

  if (user.hasVoted) {
    return res.status(400).json({ error: "Hash already used!" });
  }

  res.json({ message: "Valid Hash! You can vote." });
});

// Cast Vote
app.post("/vote", async (req, res) => {
  const { hash, candidate } = req.body;
  const user = await User.findOne({ hash });

  if (!user) {
    return res.status(400).json({ error: "Invalid Hash!" });
  }

  if (user.hasVoted) {
    return res.status(400).json({ error: "Hash already used!" });
  }

  await Vote.create({ candidate, userHash: hash });
  await User.updateOne({ hash }, { hasVoted: true });

  io.emit("updateStats", await getLiveStats()); // Send live updates

  res.json({ message: "Vote successfully cast!" });
});

// Get Statistics (For Real-time Stats)
const getLiveStats = async () => {
  return await Vote.aggregate([{ $group: { _id: "$candidate", count: { $sum: 1 } } }]);
};

app.get("/stats", async (req, res) => {
  res.json(await getLiveStats());
});

// Set Candidates (Admin)
app.post("/set-candidates", async (req, res) => {
  const { candidateA, candidateB } = req.body;
  await Candidate.deleteMany({});
  const newPoll = new Candidate({ candidateA, candidateB });
  await newPoll.save();
  res.json({ message: "Candidates Set Successfully!" });
});

// Get Candidates
app.get("/get-candidates", async (req, res) => {
  const candidates = await Candidate.findOne();
  res.json(candidates);
});

// Fetch Voters List
app.get("/voters", async (req, res) => {
  const voters = await User.find({}, "name phone hash timestamp");
  res.json(voters);
});

// WebSocket: Live Updates
io.on("connection", (socket) => {
  console.log("Admin connected");

  const sendLiveStats = async () => {
    io.emit("updateStats", await getLiveStats());
  };

  sendLiveStats();

  socket.on("disconnect", () => {
    console.log("Admin disconnected");
  });
});

// Start Server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
