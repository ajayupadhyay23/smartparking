/**
 * ToastNotifications.jsx
 * Floating toast banners showing live simulation feedback, booking extensions, and top-up confirmations.
 */
import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useBooking } from "../../context/BookingContext";

export default function ToastNotifications() {
  const { notifications, removeNotification } = useBooking();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((note) => (
        <div key={note.id} className="toast">
          <div style={{ marginTop: "2px" }}>
            {note.type === "success" && <CheckCircle2 size={18} color="var(--color-green)" />}
            {note.type === "error" && <AlertCircle size={18} color="var(--color-red)" />}
            {note.type === "info" && <Info size={18} color="var(--color-primary)" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "700" }}>{note.title}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {note.message}
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeNotification(note.id)}
            style={{ color: "var(--text-muted)", display: "flex", padding: "2px" }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
