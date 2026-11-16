const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const env = require("./config/environment");
const connectDB = require("./config/database");
const initParkingSocket = require("./sockets/parkingSocket");

// Connect to MongoDB
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

// Provide Socket instance to Express app for controller event emission
app.set("io", io);

// Initialize Socket.IO event listeners
initParkingSocket(io);

// Start Server Listener
const PORT = env.PORT;
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ ParkVolt Backend Server Running on Port ${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📡 Socket.IO Gateway Attached and Listening`);
  console.log(`=======================================================`);
});

// Graceful termination handling
process.on("SIGTERM", () => {
  console.log("[SIGTERM] Gracefully closing HTTP and Socket server...");
  server.close(() => {
    console.log("[Server Closed]");
    process.exit(0);
  });
});
