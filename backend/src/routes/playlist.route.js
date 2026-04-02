import { Router } from "express";
import { addEpisode, createPlaylist, deletePlaylist, getPlaylists, lookupPlaylist, playlistEpisodes, removeEpisode, updateCover, updatePlaylist, updateText } from "../controller/playlists.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.use(protectRoute);

router.get("/", getPlaylists);
router.get("/lookup", lookupPlaylist);
router.post("/", createPlaylist);
router.patch("/update/cover/:id", upload.single("image"), updateCover);
router.patch("/update/:id", updateText);
router.delete("/", deletePlaylist);
router.get("/episodes", playlistEpisodes);
router.post("/episodes", addEpisode);
router.delete("/episodes", removeEpisode);

export default router;