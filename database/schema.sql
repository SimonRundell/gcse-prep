-- GCSEPrep leaderboard schema
-- Creative Commons NC-BY-SA 4.0 — Simon Rundell

CREATE DATABASE IF NOT EXISTS gcse_prep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gcse_prep;

CREATE TABLE IF NOT EXISTS gcse_scores (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  player_id   VARCHAR(36)  NOT NULL,
  game        VARCHAR(50)  NOT NULL,
  score       INT          NOT NULL,
  game_type   VARCHAR(20)  NOT NULL,
  date_played DATE         NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_player (player_id),
  INDEX idx_game   (game_type)
) ENGINE=InnoDB;
