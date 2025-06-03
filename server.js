require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db_connect");
const errorHandler = require("./middleware/errorMiddleware");

// Import routes
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const consultationRoutes = require("./routes/consultationRoutes");

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/consultations", consultationRoutes);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leave", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("newMessage", (data) => {
    io.to(data.chatId).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
