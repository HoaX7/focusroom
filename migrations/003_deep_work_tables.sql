CREATE TABLE IF NOT EXISTS deep_work (
  id TEXT PRIMARY KEY NOT NULL,
  year TEXT, -- year
  user_id TEXT NOT NULL,
  locked_in TEXT, -- hours worked per day
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);