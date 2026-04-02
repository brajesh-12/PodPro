import { Router } from "express";
import { login, logout, Refresh, signup, updateProfilePic, updateUserName } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/refresh", Refresh);
router.put("/update/name", protectRoute, updateUserName);
router.put("/update/image", protectRoute, upload.single('profilePic'), updateProfilePic);

export default router;