import { generateAccessToken, generateRefreshToken } from "../lib/generateToken.js";
import User from "../model/User.js";
import bcrypt from 'bcryptjs';
import RefreshTokens from '../model/RefreshToken.js';
import jwt from 'jsonwebtoken';
import ENV from "../lib/env.js";

export const signup = async (req, res) => {
  const { email, password, userName } = req.body;

  try {
    if (!email || !password || !userName) {
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
      userName,
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
        id: newUser._id,
        email: newUser.email,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
        tokens: {
          accessToken,
          refreshToken
        }
      });

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

    if(newRefreshToken) {
      await newRefreshToken.save();
    }

    res.status(200).json({
      id: user._id,
      email,
      userName: user.userName,
      profilePic: user.profilePic,
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

export const logout = (req, res) => {
  res.send("This is logout endpoint");

  // here we delete tokens from secure storage and database
}

export const Refresh = async (req, res) => {
  // here we get refresh token send by app and then decode and verify token and match it with database then generate new access token and refresh token and send new access token
  try {
    // get token
    const token = req.headers['authorization']?.split(" ")[1]

    if(!token) {
      return res.status(401).json({message: "Unauthorized: Token is not found"});
    }

    const decoded = jwt.verify(token, ENV.REFRESH_JWT_SECRET);
    if(!decoded) {
      return res.status(401).json({message: "Unauthorized: Invalid token"});
    }

    const savedToken = await RefreshTokens.findOne({token: token});
    if(token ==! savedToken.token) {
      return res.status(401).json({message: "Unauthorized: Invalid token"});
    }

    if(savedToken.isUsed) {
      await RefreshTokens.deleteMany({familyId: savedToken.familyId});
      return res.status(401).json({message: "Security Breach Detected. Please log in again."});
    }

    const newAccessToken = generateAccessToken(savedToken.userId);
    const newRefreshToken = generateRefreshToken(savedToken.userId);

    // after using previous token, toggle isUsed to true
    await RefreshTokens.findByIdAndUpdate(
      savedToken._id,
      {$set: {isUsed: true}}
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

    if(tokenDoc) {
      await tokenDoc.save();

      res.status(201).json({
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      });
    }

  } catch (error) {
    if(error.name === "TokenExpiredError") {
      return res.status(401).json({message: "Unauthorized: Invalid token"});
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    console.error("Error refreshing token:", error);
    res.status(500).json({message: "Internal server error"});
  }
}