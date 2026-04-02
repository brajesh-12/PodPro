import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userName: {
    type: String,
    default: ""
  },
  profilePic: {
    type: String,
    default: ""
  }
},{
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;