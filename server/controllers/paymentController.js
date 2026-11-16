const paymentService = require("../services/paymentService");

/**
 * @desc    Generate a Razorpay Order ID for checkout
 * @route   POST /api/payments/create-order
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({
        success: false,
        message: "amount and bookingId are required to initiate payment."
      });
    }

    const orderData = await paymentService.createRazorpayOrder(amount, bookingId);

    res.status(200).json({
      success: true,
      order: orderData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Razorpay HMAC-SHA256 signature
 * @route   POST /api/payments/verify
 * @access  Private
 */
const verifyPayment = async (req, res, next) => {
  try {
    const {
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount
    } = req.body;

    const isValid = paymentService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid cryptographic signature."
      });
    }

    const payment = await paymentService.recordPayment({
      bookingId,
      userId: req.user._id || req.user.id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and recorded successfully",
      payment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
