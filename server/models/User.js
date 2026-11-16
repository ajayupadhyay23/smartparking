const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"]
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false // Do not return password by default in queries
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ["user", "admin", "operator"],
      default: "user"
    },
    walletBalance: {
      type: Number,
      default: 500,
      min: [0, "Wallet balance cannot be negative"]
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Hash password with bcrypt before writing to MongoDB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Verify entered password against bcrypt hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
