-- Maak een nieuwe database aan
CREATE DATABASE IF NOT EXISTS kaartspel_db;
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
    user_id INT NOT NULL,
    score INT DEFAULT 0,
    week_number INT NOT NULL,
    year INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
);

-- Maak de totale scores tabel aan
CREATE TABLE scores_total (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_score INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Maak de scores per opleiding aan
CREATE TABLE scores_study (
    id INT AUTO_INCREMENT PRIMARY KEY,
    opleiding VARCHAR(100) NOT NULL UNIQUE,
    total_score INT DEFAULT 0
);

-- Table voor alle informatie van alle kaarten (health, attack, defense, name, rarity, card_id)
CREATE TABLE Cards_dex (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    health INT DEFAULT 0,
    attack INT DEFAULT 0,
    defense INT DEFAULT 0,
    rarity ENUM('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tussenliggende tabel voor gebruikerskaarten (JOIN TABLE)
CREATE TABLE user_cards (
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    quantity INT DEFAULT 1,
    PRIMARY KEY (user_id, card_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES Cards_dex(card_id) ON DELETE CASCADE
);
