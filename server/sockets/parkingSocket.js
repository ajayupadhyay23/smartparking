/**
 * Socket.IO Real-Time Gateway for ParkVolt
 * Handles rooms, live slot broadcasts, and soft concurrency holds.
 */
const initParkingSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`[Socket.IO Client Connected] ID: ${socket.id}`);

    // Join a specific parking facility room
    socket.on("join:location", (locationId) => {
      socket.join(locationId);
      console.log(`[Socket.IO Room Join] Client ${socket.id} joined facility room: ${locationId}`);
    });

    // Leave facility room
    socket.on("leave:location", (locationId) => {
      socket.leave(locationId);
      console.log(`[Socket.IO Room Leave] Client ${socket.id} left room: ${locationId}`);
    });

    // Temporary soft-hold while user is completing payment (prevents concurrent clicks)
    socket.on("slot:soft_hold", ({ locationId, slotId, userId }) => {
      socket.to(locationId).emit("slot:status_changed", {
        slotId,
        status: "reserved",
        heldBy: userId
      });
    });

    // Client disconnect
    socket.on("disconnect", (reason) => {
      console.log(`[Socket.IO Client Disconnected] ID: ${socket.id} | Reason: ${reason}`);
    });
  });
};

module.exports = initParkingSocket;
