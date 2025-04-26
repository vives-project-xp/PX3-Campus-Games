GRANT ALL PRIVILEGES ON *.* TO 'webuser'@'127.%' IDENTIFIED BY 'SchoolOpdracht';
FLUSH PRIVILEGES;

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
    last_reward_claimed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table voor alle informatie van alle kaarten
CREATE TABLE Cards_dex (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    cardName VARCHAR(100) NOT NULL UNIQUE,
    health INT DEFAULT 0,
    attack INT DEFAULT 0,
    ability ENUM('heal', 'block', 'extra_action', 'free_switch') NOT NULL,
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
'technology&bio', '/Cards/AI.png'),

('Bioloog', 260, 80, 'block', 'Uncommon', 
'Een bioloog werkt met levende organismen en technologie om onderzoek te doen of producten te ontwikkelen. Dit kan in laboratoria, de medische sector of de voedingsindustrie zijn.', 
'technology&bio', '/Cards/Bioloog.png'),

('C-Talen', 300, 60, 'block', 'Ultra Rare', 
'C-talen zijn programmeertalen gebaseerd op C, zoals C++, C# en Objective-C. Ze worden gebruikt voor systeembouw, softwareontwikkeling en high-performance applicaties.', 
'technology&bio', '/Cards/CCsCpp.png'),

('Python', 200, 100, 'block', 'Uncommon', 
'Python is een krachtige en gebruiksvriendelijke programmeertaal, populair voor data-analyse, AI, webontwikkeling en automatisering.', 
'technology&bio', '/Cards/Python.png'),

('Java', 160, 140, 'block', 'Common', 
'Java is een veelzijdige programmeertaal die wordt gebruikt voor webapplicaties, mobiele apps en bedrijfssoftware. Bekend om zijn stabiliteit en platformonafhankelijkheid.', 
'technology&bio', '/Cards/Java.png'),

('Virtual Reality', 200, 120, 'block', 'Rare', 
'Virtual reality (VR) is een computertechniek waarbij een gesimuleerde omgeving wordt gecreëerd die je kunt ervaren alsof je er echt bent. Het wordt vaak gebruikt met een VR-bril om je onder te dompelen in een virtuele wereld.', 
'technology&bio', '/Cards/VirtualReality.png'),

('Software Developer', 160, 140, 'block', 'Common', 
'Een software developer is iemand die computerprogrammas en applicaties maakt. Ze schrijven code, testen die en zorgen ervoor dat de software goed werkt.', 
'technology&bio', '/Cards/SoftwareDev.png'),

('Machine Learning', 180, 140, 'block', 'Uncommon', 
'Machine learning is een vorm van kunstmatige intelligentie waarbij computers leren van data zonder expliciet geprogrammeerd te zijn. Ze ontdekken patronen en maken voorspellingen, waardoor ze taken kunnen uitvoeren die voorheen alleen door mensen konden worden gedaan.', 
'technology&bio', '/Cards/MachineLearning.png'),

('Firewall', 200, 80, 'block', 'Rare', 
'Een firewall is een soort digitale poortwachter voor je computer of netwerk. Het controleert al het verkeer dat in en uit gaat en blokkeert alles wat verdacht of gevaarlijk lijkt.', 
'technology&bio', '/Cards/Firewall.png'),

('Cybersecurity', 160, 140, 'block', 'Common', 
'Een software developer is iemand die computerprogrammas en applicaties maakt. Ze schrijven code, testen die en zorgen ervoor dat de software goed werkt.', 
'technology&bio', '/Cards/Cybersecurity.png');

-- Gezondheidszorg
INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) 
VALUES 
('Dokter', 180, 120, 'heal', 'Common', 
'Een dokter helpt mensen beter te worden door ziektes te behandelen en advies te geven over gezondheid. Ze redden levens en zorgen voor welzijn.', 
'gezondheidszorg', '/Cards/Doctor.png'),

('EHBO', 250, 80, 'heal', 'Common', 
'Een EHBO-kist bevat verband, pleisters en andere hulpmiddelen om snel eerste hulp te verlenen bij ongelukken en verwondingen.', 
'gezondheidszorg', '/Cards/EHBO.png'),

('Hart', 200, 100, 'heal', 'Uncommon', 
'Het hart pompt bloed door het lichaam en houdt je in leven. Het staat symbool voor kracht, emotie en uithoudingsvermogen.', 
'gezondheidszorg', '/Cards/Hearts.png'),

('Pharmacist', 180, 120, 'heal', 'Uncommon', 
'Een pharmacist is een gezondheidswerker die gespecialiseerd is in medicijnen. Ze geven advies over het juiste gebruik van medicijnen en zorgen ervoor dat patiënten de juiste medicijnen krijgen.', 
'gezondheidszorg', '/Cards/Pharmacist.png'),

('Physiotherapeut', 180, 160, 'heal', 'Ultra rare', 
'Een Physiotherapeut is een gezondheidswerker die gespecialiseerd is in het bewegingsapparaat van het lichaam. Ze helpen mensen met pijn of problemen met bewegen door middel van oefeningen en behandelingen.', 
'gezondheidszorg', '/Cards/Physiotherapeut.png'),

('DNA', 160, 160, 'heal', 'Rare', 
'DNA is het erfelijk materiaal dat de instructies bevat voor de ontwikkeling en werking van alle levende organismen. Het bepaalt onze eigenschappen en hoe ons lichaam functioneert.', 
'gezondheidszorg', '/Cards/DNA.png'),

('Pediatrie', 220, 120, 'heal', 'Legendary', 
'Pediatrie is de tak van geneeskunde die zich richt op de gezondheid en ontwikkeling van kinderen. Het omvat diagnose, behandeling en preventie van ziekten bij kinderen.', 
'gezondheidszorg', '/Cards/Pediatric.png'),

('Spuitnaald', 120, 160, 'heal', 'Common', 
'Een spuitnaald is een dun, hol buisje met een scherpe punt. Het wordt gebruikt om vloeistoffen in of uit het lichaam te brengen, zoals medicijnen of bloed.', 
'gezondheidszorg', '/Cards/Spuitnaald.png'),

('Virus', 140, 140, 'heal', 'Uncommon', 
'Een virus is een heel klein deeltje dat ziektes kan veroorzaken. Het kan zich alleen vermenigvuldigen in de cellen van een levend wezen, zoals een mens of een dier.', 
'gezondheidszorg', '/Cards/Virus.png');

-- Onderwijs & Sociaal
-- nieuwe ability
INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) 
VALUES 
('Kleuterjuf', 260, 80, 'extra_action', 'Common', 
'Een kleuterjuf begeleidt jonge kinderen bij hun eerste stappen in het leren en ontwikkelen. Ze zorgt voor een veilige en speelse leeromgeving.', 
'onderwijs&sociaal', '/Cards/Kleuterjuf.png'),

('Leerkracht Secundair', 180, 120, 'extra_action', 'Uncommon', 
'Een leerkracht in het secundair onderwijs begeleidt en inspireert jongeren in hun leerproces. Met kennis en geduld helpt hij hen groeien naar de toekomst.', 
'onderwijs&sociaal', '/Cards/Leerkracht.png'),

('HR Manager', 160, 140, 'extra_action', 'Rare', 
'De HR-manager zorgt voor een sterke werkcultuur door talent aan te trekken, medewerkers te ondersteunen en een positieve werkomgeving te creëren.', 
'onderwijs&sociaal', '/Cards/HRmanager.png'),

('Directeur', 260, 80, 'extra_action', 'Legendary',
'Een directeur is de leider van een organisatie of school. Hij of zij is verantwoordelijk voor het nemen van belangrijke beslissingen en het aansteken van de visie van de organisatie.', 
'onderwijs&sociaal', '/Cards/Directeur.png'),

('DJ', 200, 100, 'extra_action', 'Ultra rare','Een DJ draait muziek op feesten en evenementen. Hij mixt nummers, creëert een goede sfeer en laat mensen dansen.',
'onderwijs&sociaal', '/Cards/DJ.png'),

('Psycholoog', 140, 160, 'extra_action', 'Uncommon', 
'Een psycholoog is iemand die de menselijke geest en het gedrag bestudeert. Ze helpen mensen om te gaan met problemen zoals stress, angst of verdriet, en geven advies om zich beter te voelen.', 
'onderwijs&sociaal', '/Cards/Psycholoog.png');



-- Handel & Business
INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) 
VALUES 
('Salesman', 180, 140, 'free_switch', 'Rare', 
'Een salesman overtuigt klanten om producten of diensten te kopen. Met charme en kennis bouwt hij relaties op en verhoogt hij de verkoop.', 
'handel&business', '/Cards/Salesman.png'),

('Chef', 150, 100, 'free_switch', 'Uncommon', 
'Een chef-kok creëert heerlijke gerechten met passie en precisie. Zij leidt de keuken, perfectioneert smaken en zorgt voor een onvergetelijke eetervaring.', 
'handel&business', '/Cards/chef.png'),

('Boekhouder', 200, 90, 'free_switch', 'Common', 
'Een salesman overtuigt klanten om producten of diensten te kopen. Met charme en kennis bouwt hij relaties op en verhoogt hij de verkoop.', 
'handel&business', '/Cards/Boekhouder.png'),

('Hotel Manager', 160, 120, 'free_switch', 'Common', 
'De hotelmanager houdt alles draaiende in een hotel. Van gastvrijheid tot logistiek, hij zorgt ervoor dat elke gast een perfecte ervaring heeft.', 
'handel&business', '/Cards/HotelManager.png'),

('Boer', 240, 120, 'free_switch', 'Common', 
'Een boer is een harde werker die gewassen verbouwt en dieren verzorgt om voedsel te produceren. Hij speelt een cruciale rol in het voeden van de wereld en het onderhouden van het platteland.', 
'handel&business', '/Cards/Boer.png');



