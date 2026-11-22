-- SkillSwap database schema
-- WARNING: ei file chalale "skillswap" database puro muche notun kore banay.
-- Shudhu development-e chalabe. Real data thakle kokhono na.

DROP DATABASE IF EXISTS skillswap;
CREATE DATABASE skillswap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- App-er jonno alada user (root na). Development password, production-e bodlate hobe.
CREATE USER IF NOT EXISTS 'skillswap_user'@'localhost' IDENTIFIED BY 'skillswap_pass_123';
GRANT ALL PRIVILEGES ON skillswap.* TO 'skillswap_user'@'localhost';
FLUSH PRIVILEGES;

USE skillswap;

-- ============ USERS ============
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  bio VARCHAR(255) NOT NULL DEFAULT '',
  location VARCHAR(100) NOT NULL DEFAULT '',
  avatar_color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP())
);

-- ============ SKILLS ============
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  category_id INT NOT NULL,
  CONSTRAINT fk_skills_category FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Kon user ki shekhay (teach, level shoho) ar ki shikhte chay (learn, level nai).
-- UNIQUE(user_id, skill_id): ek skill ek user-er duita list-e thakte pare na.
CREATE TABLE user_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_id INT NOT NULL,
  type ENUM('teach', 'learn') NOT NULL,
  level ENUM('Beginner', 'Intermediate', 'Advanced') NULL,
  UNIQUE KEY uq_user_skill (user_id, skill_id),
  CONSTRAINT fk_us_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_us_skill FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
  CONSTRAINT chk_us_level CHECK (
    (type = 'teach' AND level IS NOT NULL) OR (type = 'learn' AND level IS NULL)
  )
);

-- ============ SWAP REQUESTS ============
-- offered_skill = sender shekhabe, requested_skill = sender shikhte chay
CREATE TABLE exchange_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_user_id INT NOT NULL,
  to_user_id INT NOT NULL,
  offered_skill_id INT NOT NULL,
  requested_skill_id INT NOT NULL,
  message VARCHAR(300) NOT NULL DEFAULT '',
  status ENUM('pending', 'accepted', 'declined', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  responded_at DATETIME NULL,
  CONSTRAINT fk_req_from FOREIGN KEY (from_user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_req_to FOREIGN KEY (to_user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_req_offered FOREIGN KEY (offered_skill_id) REFERENCES skills (id),
  CONSTRAINT fk_req_requested FOREIGN KEY (requested_skill_id) REFERENCES skills (id)
);

-- ============ SESSIONS ============
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  teacher_id INT NOT NULL,
  learner_id INT NOT NULL,
  skill_id INT NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration_mins INT NOT NULL,
  mode ENUM('online', 'in-person') NOT NULL,
  location VARCHAR(150) NOT NULL DEFAULT '',
  notes VARCHAR(200) NOT NULL DEFAULT '',
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  completed_at DATETIME NULL,
  CONSTRAINT fk_ses_request FOREIGN KEY (request_id) REFERENCES exchange_requests (id) ON DELETE CASCADE,
  CONSTRAINT fk_ses_teacher FOREIGN KEY (teacher_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_ses_learner FOREIGN KEY (learner_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_ses_skill FOREIGN KEY (skill_id) REFERENCES skills (id)
);

-- ============ RECORDINGS (video file server-e, ekhane shudhu path) ============
CREATE TABLE recordings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  recorded_by INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  duration_sec INT NOT NULL,
  size_bytes BIGINT NOT NULL,
  mime_type VARCHAR(60) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  CONSTRAINT fk_rec_session FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_rec_user FOREIGN KEY (recorded_by) REFERENCES users (id) ON DELETE CASCADE
);

-- ============ REVIEWS (learner teacher-ke rate kore, ekta session-e ekta-i) ============
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL UNIQUE,
  reviewer_id INT NOT NULL,
  reviewee_id INT NOT NULL,
  skill_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment VARCHAR(300) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  CONSTRAINT fk_rev_session FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_reviewer FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_reviewee FOREIGN KEY (reviewee_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_skill FOREIGN KEY (skill_id) REFERENCES skills (id),
  CONSTRAINT chk_rev_rating CHECK (rating BETWEEN 1 AND 5)
);

-- ============ NOTIFICATIONS ============
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  link VARCHAR(150) NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  INDEX idx_notif_user (user_id, is_read),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ============ PROJECTS ============
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  title VARCHAR(80) NOT NULL,
  description VARCHAR(600) NOT NULL,
  github_url VARCHAR(255) NOT NULL DEFAULT '',
  demo_url VARCHAR(255) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  CONSTRAINT fk_proj_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE project_skills (
  project_id INT NOT NULL,
  skill_id INT NOT NULL,
  PRIMARY KEY (project_id, skill_id),
  CONSTRAINT fk_ps_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  CONSTRAINT fk_ps_skill FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

CREATE TABLE project_members (
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'Contributor',
  joined_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  PRIMARY KEY (project_id, user_id),
  CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE project_likes (
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (project_id, user_id),
  CONSTRAINT fk_pl_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  CONSTRAINT fk_pl_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE project_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  text VARCHAR(300) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  CONSTRAINT fk_pc_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Contribution tracker: ke koto ghonta kaj korlo
CREATE TABLE contributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  description VARCHAR(150) NOT NULL,
  hours DECIMAL(4, 1) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT (UTC_TIMESTAMP()),
  CONSTRAINT fk_con_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  CONSTRAINT fk_con_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT chk_con_hours CHECK (hours >= 0.5 AND hours <= 24)
);