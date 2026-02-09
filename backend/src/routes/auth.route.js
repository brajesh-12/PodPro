import { Router } from "express";
import { login, Refresh, signup } from "../controller/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/refresh", Refresh);

export default router;