import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: false,
    },
    code: {
        type: String,
        required: true,
        unique: false,
    },
    verified: {
        type: Boolean,
        required: true,
        unique: false,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
        unique: false,
    },
  }
);

export default mongoose.model("VerificationCode", verificationCodeSchema);