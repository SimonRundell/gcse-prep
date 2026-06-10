-- GCSEPrep database schema
-- Copyright (c) 2026 Becky Hingston & Simon Rundell, Exeter College Faculty of ITDD
-- Creative Commons NC-BY-SA 4.0

CREATE DATABASE IF NOT EXISTS gcse_prep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gcse_prep;

-- ----------------------------------------------------------------
-- Leaderboard
-- ----------------------------------------------------------------
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

-- ----------------------------------------------------------------
-- Admin users
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Question bank (maps to AQA Nov 2024 Paper 1F slot structure)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_bank (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slot       VARCHAR(10)  NOT NULL,
  topic      VARCHAR(100) NOT NULL,
  question   TEXT         NOT NULL,
  answer     TEXT         NOT NULL,
  marks      TINYINT UNSIGNED NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slot  (slot),
  INDEX idx_topic (topic)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Vocabulary words (Word Scramble game)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS words (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  word       VARCHAR(100) NOT NULL,
  clue       TEXT         NOT NULL,
  subject    VARCHAR(50)  NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Video channels
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS video_channels (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject     VARCHAR(20)  NOT NULL COMMENT 'maths | english',
  name        VARCHAR(100) NOT NULL,
  emoji       VARCHAR(10),
  bg          VARCHAR(50),
  url         VARCHAR(500) NOT NULL,
  description TEXT,
  topics      JSON,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_subject (subject)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- AQA Nov 2024 Foundation Paper 1 blueprint
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blueprint (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  q_ref      VARCHAR(10)  NOT NULL,
  topic      VARCHAR(100) NOT NULL,
  style      TEXT         NOT NULL,
  marks      TINYINT UNSIGNED NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_q_ref (q_ref)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Exam board data (one row per board; JSON stores spec + subjects)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS boards (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  board_code VARCHAR(20)  NOT NULL UNIQUE,
  color      VARCHAR(20)  NOT NULL,
  data       JSON         NOT NULL COMMENT 'keys: spec, subjects',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Global board configuration (subject_labels, ao_desc, topic_bank_map)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS board_config (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  config_key   VARCHAR(50) NOT NULL UNIQUE,
  config_value JSON        NOT NULL,
  updated_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
