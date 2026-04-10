const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const investmentRoutes = require("./routes/investment");

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Socket auth failed: token missing"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "finmate_secret_key"
    );

    socket.userId = decoded.id;
    return next();
  } catch {
    return next(new Error("Socket auth failed: invalid token"));
  }
});

io.on("connection", (socket) => {
  const room = `user:${socket.userId}`;
  socket.join(room);

  socket.on("disconnect", () => {
    socket.leave(room);
  });
});

app.set("io", io);

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/investments", investmentRoutes);

app.get("/", (req, res) => {
  res.send("FinMate API is running");
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
