import express from 'express';
import ENV from './lib/env.js';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import playlistsRoutes from './routes/playlist.route.js';
import podcastRoutes from './routes/podcast.route.js';
import { initCronJobs } from './lib/cronJobs.js';

const app = express();
const PORT = ENV.PORT || 3000;

app.get("/api/test", (req,res) => {
  res.send('Test successful: Server is working');
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/playlists", playlistsRoutes);
app.use("/api/podcasts", podcastRoutes);


app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  connectDB();
  initCronJobs();
});