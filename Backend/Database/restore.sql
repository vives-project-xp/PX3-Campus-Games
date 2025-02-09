-- Maak een nieuwe database aan
CREATE DATABASE if not EXISTS kaartspel_db;
USE kaartspel_db;

-- Maak de users tabel aan
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    opleiding VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maak de scores tabel aan per week
CREATE TABLE scores_weekly (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    score INT DEFAULT 0,
    week_number INT NOT NULL,
    year INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Maak de totale scores tabel aan
CREATE TABLE scores_total (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_score INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Maak de scores per opleiding aan
CREATE TABLE scores_study (
    id INT AUTO_INCREMENT PRIMARY KEY,
    opleiding VARCHAR(100) NOT NULL,
    total_score INT DEFAULT 0,
    UNIQUE (opleiding)
);