import { create } from "zustand";
import { io } from "socket.io-client";

/**
 * Socket.IO Store for ParkVolt
 * Manages WebSocket connection and dispatches real-time slot state updates
 * to the main useParkVoltStore.
 */

let socketInstance = null;

export const useSocketStore = create((set, get) => ({
  isConnected: false,
  activeRoom: null,

  /**
   * Connect to the Socket.IO server and wire event handlers
   */
  connect: (serverUrl, updateSlotStatus) => {
    if (socketInstance && socketInstance.connected) return;

    socketInstance = io(serverUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    socketInstance.on("connect", () => {
      console.log(`[Socket.IO] Connected → ID: ${socketInstance.id}`);
      set({ isConnected: true });
    });

    // Real-time slot status broadcast handler
    socketInstance.on("slot:status_changed", ({ slotId, status, locationId }) => {
      console.log(`[Socket.IO Event] slot:status_changed → slotId: ${slotId} | status: ${status}`);
      if (locationId && updateSlotStatus) {
        updateSlotStatus(locationId, slotId, status);
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(`[Socket.IO] Disconnected → ${reason}`);
      set({ isConnected: false });
    });

    socketInstance.on("connect_error", (err) => {
      console.warn(`[Socket.IO] Connection error (server may be offline): ${err.message}`);
      set({ isConnected: false });
    });
  },

  /**
   * Join a parking facility room for targeted broadcasts
   */
  joinLocationRoom: (locationId) => {
    if (!socketInstance || !socketInstance.connected) return;
    socketInstance.emit("join:location", locationId);
    set({ activeRoom: locationId });
    console.log(`[Socket.IO] Joined location room: ${locationId}`);
  },

  /**
   * Leave the current facility room
   */
  leaveLocationRoom: (locationId) => {
    if (!socketInstance || !socketInstance.connected) return;
    socketInstance.emit("leave:location", locationId);
    set({ activeRoom: null });
  },

  /**
   * Soft-hold a slot during payment to prevent double-booking
   */
  softHoldSlot: (locationId, slotId, userId) => {
    if (!socketInstance || !socketInstance.connected) return;
    socketInstance.emit("slot:soft_hold", { locationId, slotId, userId });
  },

  /**
   * Disconnect socket connection on app unmount
   */
  disconnect: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      set({ isConnected: false, activeRoom: null });
    }
  }
}));
