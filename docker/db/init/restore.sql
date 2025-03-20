
-- Maak een nieuwe database aan als deze nog niet bestaat
CREATE DATABASE IF NOT EXISTS kaartspel_db;
USE kaartspel_db;

-- Maak de users tabel aan
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(100) NOT NULL UNIQUE,
    opleiding ENUM('gezondheidszorg', 'handel&business', 'onderwijs&sociaal', 'technology&bio') NOT NULL,
    userPassword VARCHAR(255) NOT NULL,
    user_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table voor alle informatie van alle kaarten
CREATE TABLE Cards_dex (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    cardName VARCHAR(100) NOT NULL UNIQUE,
    health INT DEFAULT 0,
    attack INT DEFAULT 0,
    ability ENUM('heal', 'block', 'damage_multiplier', 'free_switch') NOT NULL,
    rarity ENUM('Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary') NOT NULL,
    info TEXT,
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
    info VARCHAR(255) NOT NULL,
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

-- Technology & Bio
INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) 
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
'technology&bio', './api/Cards/Java_Tech.png'),

('Virtual Reality', 200, 120, 'block', 'Rare', 
'Virtual reality (VR) is een computertechniek waarbij een gesimuleerde omgeving wordt gecreëerd die je kunt ervaren alsof je er echt bent. Het wordt vaak gebruikt met een VR-bril om je onder te dompelen in een virtuele wereld.', 
'technology&bio', './api/Cards/VR_Tech.png'),

('Software Developer', 160, 140, 'block', 'Common', 
'Een software developer is iemand die computerprogrammas en applicaties maakt. Ze schrijven code, testen die en zorgen ervoor dat de software goed werkt.', 
'technology&bio', './api/Cards/Softwaredev_Tech.png'),

('Machine Learning', 180, 140, 'block', 'Uncommon', 
'Machine learning is een vorm van kunstmatige intelligentie waarbij computers leren van data zonder expliciet geprogrammeerd te zijn. Ze ontdekken patronen en maken voorspellingen, waardoor ze taken kunnen uitvoeren die voorheen alleen door mensen konden worden gedaan.', 
'technology&bio', './api/Cards/Machinelearning_Tech.png'),

('Firewall', 200, 80, 'block', 'Common', 
'Een firewall is een soort digitale poortwachter voor je computer of netwerk. Het controleert al het verkeer dat in en uit gaat en blokkeert alles wat verdacht of gevaarlijk lijkt.', 
'technology&bio', './api/Cards/Firewall_Tech.png');

-- Gezondheidszorg
INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) 
VALUES 
('Dokter', 180, 120, 'heal', 'Common', 
'Een dokter helpt mensen beter te worden door ziektes te behandelen en advies te geven over gezondheid. Ze redden levens en zorgen voor welzijn.', 
'gezondheidszorg', './api/Cards/Doctor_Vplg.png'),

('EHBO', 250, 80, 'heal', 'Common', 
'Een EHBO-kist bevat verband, pleisters en andere hulpmiddelen om snel eerste hulp te verlenen bij ongelukken en verwondingen.', 
'gezondheidszorg', './api/Cards/EHBO_Vplg.png'),

('Hart', 200, 100, 'heal', 'Uncommon', 
'Het hart pompt bloed door het lichaam en houdt je in leven. Het staat symbool voor kracht, emotie en uithoudingsvermogen.', 
'gezondheidszorg', './api/Cards/Hart_Vplg.png'),

('Apotheker', 180, 120, 'heal', 'Uncommon', 
'Een apotheker is een gezondheidswerker die gespecialiseerd is in medicijnen. Ze geven advies over het juiste gebruik van medicijnen en zorgen ervoor dat patiënten de juiste medicijnen krijgen.', 
'gezondheidszorg', './api/Cards/Farmacist_Vplg.png'),

('Fysiotherapeut', 180, 160, 'heal', 'Ultra rare', 
'Een fysiotherapeut is een gezondheidswerker die gespecialiseerd is in het bewegingsapparaat van het lichaam. Ze helpen mensen met pijn of problemen met bewegen door middel van oefeningen en behandelingen.', 
'gezondheidszorg', './api/Cards/Fysiotherapeut_Vplg.png'),

('Genetica', 160, 160, 'heal', 'Rare', 
'Genetica is de studie van hoe kenmerken van ouders worden doorgegeven aan hun nakomelingen. Het onderzoekt hoe genen werken en hoe ze de ontwikkeling van levende wezens beïnvloeden.', 
'gezondheidszorg', './api/Cards/Genetica_Vplg.png'),

('Kinderverpleegkundige', 220, 120, 'heal', 'Legendary', 
'Een kinderverpleegkundige is een verpleegkundige die gespecialiseerd is in de zorg voor zieke kinderen. Ze zorgen ervoor dat kinderen zich zo comfortabel mogelijk voelen en helpen hen beter te worden.', 
'gezondheidszorg', './api/Cards/Kinderverpleegkundige_Vplg.png'),

('Spuitnaald', 120, 160, 'heal', 'Common', 
'Een spuitnaald is een dun, hol buisje met een scherpe punt. Het wordt gebruikt om vloeistoffen in of uit het lichaam te brengen, zoals medicijnen of bloed.', 
'gezondheidszorg', './api/Cards/Spuitnaald_Vplg.png'),

('Virus', 140, 140, 'heal', 'Uncommon', 
'Een virus is een heel klein deeltje dat ziektes kan veroorzaken. Het kan zich alleen vermenigvuldigen in de cellen van een levend wezen, zoals een mens of een dier.', 
'gezondheidszorg', './api/Cards/Virus_Vplg.png');

-- Onderwijs & Sociaal
INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) 
VALUES 
('Kleuterjuf', 260, 80, 'damage_multiplier', 'Common', 
'Een kleuterjuf begeleidt jonge kinderen bij hun eerste stappen in het leren en ontwikkelen. Ze zorgt voor een veilige en speelse leeromgeving.', 
'onderwijs&sociaal', './api/Cards/Kleuterjuf_OwSo.png'),

('Leerkracht Secundair', 180, 120, 'damage_multiplier', 'Uncommon', 
'Een leerkracht in het secundair onderwijs begeleidt en inspireert jongeren in hun leerproces. Met kennis en geduld helpt hij hen groeien naar de toekomst.', 
'onderwijs&sociaal', './api/Cards/Leerkrachtsecundair_OwSo.png'),

('HR Manager', 160, 140, 'damage_multiplier', 'Rare', 
'De HR-manager zorgt voor een sterke werkcultuur door talent aan te trekken, medewerkers te ondersteunen en een positieve werkomgeving te creëren.', 
'onderwijs&sociaal', './api/Cards/HRManager_OwSo.png'),

('Psycholoog', 140, 160, 'damage_multiplier', 'Uncommon', 
'Een psycholoog is iemand die de menselijke geest en het gedrag bestudeert. Ze helpen mensen om te gaan met problemen zoals stress, angst of verdriet, en geven advies om zich beter te voelen.', 
'onderwijs&sociaal', './api/Cards/Psycholoog_OwSo.png');

-- Handel & Business
INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) 
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
INSERT INTO users (userName, opleiding, userPassword)
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