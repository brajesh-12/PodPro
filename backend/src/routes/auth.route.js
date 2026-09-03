import { Router } from "express";
import { deleteAccount, emailChecker, globalLogOut, login, logout, Refresh, signup, updateProfilePic, updateUserName } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";
import { routeRateLimiter } from "../lib/ratelimit.js";

const router = Router();

router.post("/email", emailChecker);
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", protectRoute, logout);
router.post("/globalLogout", protectRoute, globalLogOut);
router.get("/refresh", Refresh);
router.put("/update/name", protectRoute, routeRateLimiter, updateUserName);
router.put("/update/image", protectRoute, routeRateLimiter, upload.single('profilePic'), updateProfilePic);
router.post('/delete', protectRoute, deleteAccount);

export default router;