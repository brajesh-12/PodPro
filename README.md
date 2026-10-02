##  🎙️ PodPro

PodPro is a full-stack podcast platform that brings a unified subscription layout to the audio space. It relies on a centralized, dynamic feed that aggregates content from followed creators instead of burying new episodes across screens. I architected and built it entirely from scratch: UI design, React Native frontend, and Express/MongoDB backend.

## 📦 Technologies

- `Expo`
- `React Native`
- `Typescript`
- `CSS`
- `JWT`
- `MongoDB`
- `Express`
- `Node.js`
- `Cloudinary`
- `Zustand`

## 🌟Features

Here what you can do with PodPro:

**Listen Podcast:** You can listen any podcast present on itunes api.

**Search Podcast:** You can search podcast by their name,  creator or genre.

**Follow Podcast:** You can follow any podcast and get notifications when new episodes arrive.

**Create Playlist:** You can create playlists and add episodes in it.

**Download Episode:** You can download episodes for offline listening.

**Persistent Audio Player:** users can likely navigate to different screens while the audio continues playing seamlessly at the bottom.

**Automatic Data Sync:** Seamlessly transition between devices. Upon login, your previously downloaded episodes are automatically fetched and saved locally to your new device.

## 👨‍🍳The Process

I started by sketching out the core features and evaluating potential data sources. During this research, I discovered the iTunes Search API, which provided the comprehensive podcast catalog needed to power the app.

Next, I focused on the UI and UX by analyzing major audio platforms like Spotify, YouTube Music, Pocket Casts, and Apple Podcasts. I studied their core mechanics, such as how users follow shows, and noticed a gap in the market: very few apps allow users to create custom playlists for specific podcast episodes. To further improve the UX, I designed a centralized, dynamic feed to aggregate new episodes from followed creators, solving the common problem of buried content.

With the design finalized, I built the backend using Node.js and Express. The most challenging aspect was structuring the database so we could incrementally grow our own data storage, reducing our reliance on the iTunes API and minimizing future external API calls. For secure authentication, I implemented JWT token rotation utilizing both Refresh and Access Tokens.

Moving to the frontend, I integrated the API and focused on user control. I implemented the custom playlist feature, background notifications for new episodes, and engineered a robust local download manager. Using Expo FileSystem, I configured idempotent directory creation and recursive parent directory handling so downloads never crash on repeated runs or missing folders.

Finally, I tackled state synchronization to keep the audio player persistent across screens without interrupting playback. To tie the full-stack experience together, I built a cross-device sync engine so users logging into a new device automatically have their saved offline library downloaded in the background.

Along the way, while building everything, I took notes on what I've learned so I don't miss out on it. I also documented the behind-the-scenes processes every time a feature was added.

Documenting every problem and how I solved it deepened my understanding of the core topics used in this project, such as authentication, authorization, token race conditions, and handling complex data on the frontend.

## 📚What I Learned

During this project, I've picked up important skills and a better understanding of complex ideas, which improved my logical thinking.

- **System Design:** Building this app taught me how to architect and manage end-to-end system design for future projects.

- **Multiple State Management:** I learned how to manage and connect multiple global states together without interrupting the user flow.

- **Device File System:** Creating the download manager taught me how mobile applications communicate with a device at the system level.

- **Animation Handling:** I learned how to simplify the implementation of complex, multi-component effects using React Native animations.

- **Database Syncing:** I learned multiple methods for keeping an internal database perfectly synced with updates from an external source like the iTunes database.

- **Race Conditions:** Handling complex system issues, specifically a refresh token race condition, taught me how to resolve difficult asynchronous conflicts.

## 📈Overal Growth

Each part of this project helped me understand more about building apps, managing complex information, and improving user experience. It was more than just making a tool. It was about solving problems, learning new things, and improving my skills for future work.

## ⚒️ How can it be improved?

* Add background playing when app is closed.
* Add feature to create multiple profiles in same acount.
* Add random playlist creation based on user's taste.
* Implementing proper hydration state in app.


## 🍿 Images and Video