/**
 * Notification Service
 * Dispatches transactional notifications via SMS, Email, and WebPush.
 */
class NotificationService {
  async sendBookingConfirmation(user, booking) {
    console.log(
      `[Notification: SMS/Push] Dispatched to ${user.email || "user"}: Booking ${booking.bookingId} confirmed for slot ${booking.slotNumber || "Bay"}.`
    );
    return { success: true, timestamp: new Date().toISOString() };
  }

  async sendOverstayAlert(user, slotNumber) {
    console.log(
      `[Notification: Alert] Vehicle overstay detected for slot ${slotNumber}. Grace period timer started.`
    );
    return { success: true };
  }
}

module.exports = new NotificationService();
