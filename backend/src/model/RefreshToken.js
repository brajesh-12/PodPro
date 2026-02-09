import mongoose from "mongoose";
import User from "./User.js";

const { ObjectId } = mongoose.Schema.Types;

const refreshTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  familyId: {
    type: String,
    required: true
  },
  userId:{
    type: ObjectId,
    ref: User,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const RefreshTokens = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshTokens;