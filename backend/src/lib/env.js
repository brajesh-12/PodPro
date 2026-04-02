import 'dotenv/config';

const ENV = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  CLOUDINARY_CLOUDNAME: process.env.CLOUDINARY_CLOUDNAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}

export default ENV;