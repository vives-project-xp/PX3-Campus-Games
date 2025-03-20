
-- Maak een nieuwe database aan als deze nog niet bestaat
CREATE DATABASE IF NOT EXISTS kaartspel_db;
USE kaartspel_db;

-- Maak de users tabel aan
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    opleiding ENUM('gezondheidszorg', 'handel&business', 'onderwijs&sociaal', 'technology&bio') NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    opleiding ENUM('gezondheidszorg', 'handel&business', 'onderwijs&sociaal', 'technology&bio') NOT NULL,
    artwork_path VARCHAR(255) NOT NULL
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

-- Insert sample data
-- Technology & Bio
INSERT INTO Cards_dex (name, health, attack, ability, rarity, description, opleiding, artwork_path) 
VALUES 
('AI', 220, 100, 'block', 'Legendary', 
'AI is technologie die computers laat leren en problemen oplossen zoals mensen. Het wordt gebruikt voor spraakherkenning, aanbevelingen en automatisering.', 
'technology&bio', './api/Cards/AI_Tech.png'),

('Biotechnicus', 260, 80, 'block', 'Uncommon', 
'Een biotechnicus werkt met levende organismen en technologie om onderzoek te doen of producten te ontwikkelen. Dit kan in laboratoria, de medische sector of de voedingsindustrie zijn.', 
'technology&bio', './api/Cards/Biotechnicus_Tech.png'),

('C-Talen', 300, 60, 'block', 'Ultra Rare', 
'C-talen zijn programmeertalen gebaseerd op C, zoals C++, C# en Objective-C. Ze worden gebruikt voor systeembouw, softwareontwikkeling en high-performance applicaties.', 
'technology&bio', './api/Cards/CCsCPP_Tech.png'),

('Python', 200, 100, 'block', 'Uncommon', 
'Python is een krachtige en gebruiksvriendelijke programmeertaal, populair voor data-analyse, AI, webontwikkeling en automatisering.', 
'technology&bio', './api/Cards/Python_Tech.png'),

('Java', 160, 140, 'block', 'Common', 
'Java is een veelzijdige programmeertaal die wordt gebruikt voor webapplicaties, mobiele apps en bedrijfssoftware. Bekend om zijn stabiliteit en platformonafhankelijkheid.', 
'technology&bio', './api/Cards/Java_Tech.png');

-- Gezondheidszorg
INSERT INTO Cards_dex (name, health, attack, ability, rarity, description, opleiding, artwork_path) 
VALUES 
('Dokter', 180, 120, 'heal', 'Common', 
'Een dokter helpt mensen beter te worden door ziektes te behandelen en advies te geven over gezondheid. Ze redden levens en zorgen voor welzijn.', 
'gezondheidszorg', './api/Cards/Doctor_Vplg.png'),

('EHBO', 250, 80, 'heal', 'Common', 
'Een EHBO-kist bevat verband, pleisters en andere hulpmiddelen om snel eerste hulp te verlenen bij ongelukken en verwondingen.', 
'gezondheidszorg', './api/Cards/EHBO_Vplg.png'),

('Hart', 200, 100, 'heal', 'Uncommon', 
'Het hart pompt bloed door het lichaam en houdt je in leven. Het staat symbool voor kracht, emotie en uithoudingsvermogen.', 
'gezondheidszorg', './api/Cards/Hart_Vplg.png');

-- Onderwijs & Sociaal
INSERT INTO Cards_dex (name, health, attack, ability, rarity, description, opleiding, artwork_path) 
VALUES 
('Kleuterjuf', 260, 80, 'damage_multiplier', 'Common', 
'Een kleuterjuf begeleidt jonge kinderen bij hun eerste stappen in het leren en ontwikkelen. Ze zorgt voor een veilige en speelse leeromgeving.', 
'onderwijs&sociaal', './api/Cards/Kleuterjuf_OwSo.png'),

('Leerkracht Secundair', 180, 120, 'damage_multiplier', 'Uncommon', 
'Een leerkracht in het secundair onderwijs begeleidt en inspireert jongeren in hun leerproces. Met kennis en geduld helpt hij hen groeien naar de toekomst.', 
'onderwijs&sociaal', './api/Cards/Leerkrachtsecundair_OwSo.png'),

('HR Manager', 160, 140, 'damage_multiplier', 'Rare', 
'De HR-manager zorgt voor een sterke werkcultuur door talent aan te trekken, medewerkers te ondersteunen en een positieve werkomgeving te creëren.', 
'onderwijs&sociaal', './api/Cards/HRManager_OwSo.png');

-- Handel & Business
INSERT INTO Cards_dex (name, health, attack, ability, rarity, description, opleiding, artwork_path) 
VALUES 
('Salesman', 180, 140, 'free_switch', 'Rare', 
'Een salesman overtuigt klanten om producten of diensten te kopen. Met charme en kennis bouwt hij relaties op en verhoogt hij de verkoop.', 
'handel&business', './api/Cards/Salesman_HnBd.png'),

('Chef', 150, 100, 'free_switch', 'Uncommon', 
'Een chef-kok creëert heerlijke gerechten met passie en precisie. Zij leidt de keuken, perfectioneert smaken en zorgt voor een onvergetelijke eetervaring.', 
'handel&business', './api/Cards/Chef_HnBd.png'),

('Hotel Manager', 160, 120, 'free_switch', 'Common', 
'De hotelmanager houdt alles draaiende in een hotel. Van gastvrijheid tot logistiek, hij zorgt ervoor dat elke gast een perfecte ervaring heeft.', 
'handel&business', './api/Cards/Hotelmanager_HnBd.png');

-- Voeg een paar gebruikers toe
INSERT INTO users (name, opleiding, password)
VALUES 
('admin1', 'technology&bio', 'admin1'),
('admin2', 'technology&bio', 'admin2');

-- Voeg kaarten toe aan gebruikers
INSERT INTO user_cards (user_id, card_id, quantity)
VALUES 
(1, 1, 1), 
(1, 2, 1), 
(1, 3, 1), 
(1, 4, 1), 
(1, 5, 1),
(2, 1, 1), 
(2, 2, 1), 
(2, 3, 1), 
(2, 4, 1), 
(2, 5, 1);