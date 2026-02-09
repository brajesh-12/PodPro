import { Router } from "express";
import { followingFeed, getPodcasts, podEpisodes, savePodcast, unFollow } from '../controller/podcast.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.post("/", savePodcast);
router.get("/", getPodcasts);
router.get("/episodes/feed", followingFeed);
router.get("/episodes/:podcastId", podEpisodes);
router.delete("/", unFollow);

export default router;