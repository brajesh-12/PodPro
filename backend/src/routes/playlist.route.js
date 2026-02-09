import { Router } from "express";
import { addEpisode, createPlaylist, deletePlaylist, getPlaylists, playlistEpisodes, removeEpisode, updatePlaylist } from "../controller/playlists.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.get("/", getPlaylists);
router.post("/", createPlaylist);
router.patch("/update", updatePlaylist);
router.delete("/", deletePlaylist);
router.get("/episodes", playlistEpisodes);
router.post("/episodes", addEpisode);
router.delete("/episodes", removeEpisode);

export default router;