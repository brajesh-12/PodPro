import jwt from 'jsonwebtoken';
import ENV from './env.js';

export const generateAccessToken = (userId) => {
  // access token
  const token = jwt.sign({userId}, ENV.ACCESS_JWT_SECRET,{
    expiresIn: '15m'
  });

  return token;
}

export const generateRefreshToken = (userId) => {
  // will generate refresh token with refresh token secret
  const token = jwt.sign({userId}, ENV.REFRESH_JWT_SECRET,{
    expiresIn: "7d"
  });

  return token;
}