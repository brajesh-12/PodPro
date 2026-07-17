import * as SQLite from 'expo-sqlite';

export interface SQLiteTask {
  episodeId: string,
  status: string,
  progress: number,
  pauseData: string | null
}

const db = SQLite.openDatabaseSync("podcasts_download.db");

const DownloadDatabase = {

  init: () => {
    db.runSync(`
      CREATE TABLE IF NOT EXISTS download_tasks (
        episodeId TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        progress REAL DEFAULT 0,
        pauseData TEXT
      );
    `);
  },

  getAllTasks(): SQLiteTask[] {
    return db.getAllSync<SQLiteTask>(`SELECT * FROM download_tasks`);
  },

  upsertTask: (episodeId: string, status: string, progress: number = 0, pauseData: string | null = null) => {
    db.runSync(`INSERT OR REPLACE INTO download_tasks (episodeId, status, progress, pauseData)
      VALUES (?, ?, ?, ?)`,
      [episodeId, status, progress, pauseData]
    );
  },

  updateProgress: (episodeId: string, progress: number, pauseData: string | null = null) => {
    db.runSync(
      `UPDATE download_tasks SET progress = ?, pauseData = ? WHERE episodeId = ?`,
      [progress, pauseData, episodeId]
    );
  },

  deleteTask: (episodeId: string) => {
    db.runSync(`DELETE FROM download_tasks WHERE episodeId = ?`, [episodeId])
  },

  clearAll: () => {
    db.runSync('DELETE FROM download_tasks');
  }
};

export default DownloadDatabase;
