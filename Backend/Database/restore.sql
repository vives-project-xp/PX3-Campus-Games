-- Maak een nieuwe database aan als deze nog niet bestaat
CREATE DATABASE IF NOT EXISTS kaartspel_db;
USE kaartspel_db;

-- Maak de users tabel aan
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    opleiding ENUM('gezondheidszorg', 'handel&business', 'onderwijs&sociaal', 'technology&bio') NOT NULL,
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
    opleiding ENUM('gezondheidszorg', 'handel&business', 'onderwijs&sociaal', 'technology&bio') NOT NULL,
    total_score INT DEFAULT 0
);

-- Table voor alle informatie van alle kaarten
CREATE TABLE Cards_dex (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    health INT DEFAULT 0,
    attack INT DEFAULT 0,
    ability ENUM('heal', 'block', 'damage_multiplier', 'free_switch') NOT NULL,
    rarity ENUM('Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary') NOT NULL,
    description TEXT,
    artwork_path VARCHAR(255) NOT NULL,
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


CREATE TABLE daily_quests (
    quest_id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    reward INT NOT NULL,  -- Aantal coins of een kaart
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_quests (
    user_id INT NOT NULL,
    quest_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, quest_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quest_id) REFERENCES daily_quests(quest_id) ON DELETE CASCADE
);




