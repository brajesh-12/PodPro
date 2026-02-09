import jwt from 'jsonwebtoken';
import ENV from '../lib/env.js';
import User from '../model/User.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    const decoded = jwt.verify(token, ENV.ACCESS_JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    // this next() will pass the control to the next middleware or route handler
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Internal server error" });
  }
}