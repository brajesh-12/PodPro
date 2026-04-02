import { generateAccessToken, generateRefreshToken } from "../lib/generateToken.js";
import User from "../model/User.js";
import bcrypt from 'bcryptjs';
import RefreshTokens from '../model/RefreshToken.js';
import jwt from 'jsonwebtoken';
import ENV from "../lib/env.js";
import { defaultPlaylists } from "./playlists.controller.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be more than 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist, try login" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashPassword
    });

    if (newUser) {
      const savedUser = await newUser.save();

      // will generate token and save in secure storage and save in database too
      const accessToken = generateAccessToken(savedUser._id);
      const refreshToken = generateRefreshToken(savedUser._id);

      // saving refreshToken to database
      const familyId = crypto.randomUUID();
      const dateToLive = 5
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + dateToLive);

      const saveToken = new RefreshTokens({
        token: refreshToken,
        familyId,
        expiresAt: expiryDate,
        userId: savedUser._id
      });

      await saveToken.save();

      res.status(201).json({
        user: {
          id: newUser._id,
          email: newUser.email,
          userName: newUser.userName,
          profilePic: newUser.profilePic,
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });

      defaultPlaylists(newUser._id);

    } else {
      res.status(400).json({ message: "Invalid user data" });
    }

  } catch (error) {
    console.error("Error in sigup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // will generate token and save in secure storage and database
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const familyId = crypto.randomUUID();

    // Saving refresh token in database
    const daysToLive = 5;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysToLive)

    const newRefreshToken = new RefreshTokens({
      token: refreshToken,
      familyId,
      userId: user._id,
      expiresAt: expiryDate,
    });

    if (newRefreshToken) {
      await newRefreshToken.save();
    }

    res.status(200).json({
      user: {
        id: user._id,
        email,
        userName: user.userName,
        profilePic: user.profilePic,
      },
      tokens: {
        accessToken,
        refreshToken,
      }
    });

  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};

export const logout = async (req, res) => {
  try {
    const id = req.query.id;

    const token = req.headers['authorization']?.split(" ")[1]

    if(!token || !id) return res.status(400).json({message: "Insufficient data."});

    const user = await User.findOne({_id: id});
    if(!user) return res.status(400).json({message: "User not found."});

    const verify = jwt.verify(token, ENV.REFRESH_JWT_SECRET);
    if(!verify) return res.status(400).json({message: "Unauthorized: Invalid Token."});
    
    // now check in database
    const savedToken = await RefreshTokens.findOne({token: token});
    if(token !== savedToken.token) return res.status(400).json({message: "Unauthorized: Invalid Token."});
    
    await RefreshTokens.deleteMany({familyId: savedToken.familyId, userId: id});

    res.status(200).json({message: "Logged out successfully."});

  } catch (error) {
    console.error("Error loging out:", error);
    res.status(500).json({message: "Internal server error."});
  }
}

export const updateUserName = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userName } = req.body;

    if(!userName) return res.status(400).json({message: "UserName is required."});

    const updateUserName = await User.findByIdAndUpdate(userId, {
      userName: userName
    });

    res.status(200).json({
      message: "UserName updated successfully.",
      user: updateUserName
    });

  } catch (error) {
    console.error("Error updating userName:", error);
    res.status(500).json({message: "Internal server error"});
  }
}

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;

    if(!req.file) return res.status(400).json({message: "Profile picture is required"});

    const result = await uploadToCloudinary(req.file.buffer);

    const updateProfilePic = await User.findByIdAndUpdate(userId, 
      { $set: { profilePic: result.secure_url } },
      { new: true }
    );

    // const uploadToCloud = await cloudinary.uploader.upload(profilePic);

    // const updateProfilePic = await User.findByIdAndUpdate(userId, {
    //   profilePic: uploadToCloud.url
    // });

    res.status(200).json({
      message: "ProfilePic updated successfully.",
      user: updateProfilePic
    });

  } catch (error) {
    console.error("Error updating profilePic:", error);
    res.status(500).json({message: "Internal server error"});
  }
}

export const Refresh = async (req, res) => {
  // here we get refresh token send by app and then decode and verify token and match it with database then generate new access token and refresh token and send new access token
  try {
    // get token
    const token = req.headers['authorization']?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token is not found" });
    }

    const decoded = jwt.verify(token, ENV.REFRESH_JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const savedToken = await RefreshTokens.findOne({ token: token });
    if (token == !savedToken.token) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    if (savedToken.isUsed) {
      await RefreshTokens.deleteMany({ familyId: savedToken.familyId });
      return res.status(401).json({ message: "Security Breach Detected. Please log in again." });
    }

    const newAccessToken = generateAccessToken(savedToken.userId);
    const newRefreshToken = generateRefreshToken(savedToken.userId);

    // after using previous token, toggle isUsed to true
    await RefreshTokens.findByIdAndUpdate(
      savedToken._id,
      { $set: { isUsed: true } }
    );

    const familyId = savedToken.familyId
    const dateToLive = 5;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + dateToLive);

    const tokenDoc = new RefreshTokens({
      token: newRefreshToken,
      userId: savedToken.userId,
      familyId,
      expiresAt: expiryDate
    });

    if (tokenDoc) {
      await tokenDoc.save();

      res.status(201).json({
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      });
    }

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}