import { Router } from "express";
import { followingFeed, getPodcasts, getPodcastWithDocId, podEpisodes, savePodcast, singlePod, unFollow } from '../controller/podcast.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";
import { routeRateLimiter } from "../lib/ratelimit.js";

const router = Router();

router.use(protectRoute, routeRateLimiter);

router.post("/", savePodcast);
router.get("/", getPodcasts);
router.get("/lookup", singlePod);
router.get("/episodes/feed", followingFeed);
router.get("/episodes/:podcastId", podEpisodes);
router.delete("/", unFollow);
router.get("/lookup/document", getPodcastWithDocId);

export default router;