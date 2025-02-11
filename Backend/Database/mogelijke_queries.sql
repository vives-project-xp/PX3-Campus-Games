-- Een nieuwe gebruiker toevoegen (registratie)
INSERT INTO users (name, opleiding, password) VALUES ('Gebruikersnaam', 'Opleiding', 'VeiligGehashtWachtwoord');

-- Een gebruiker opzoeken bij inloggen
SELECT id, password FROM users WHERE name = 'Gebruikersnaam';

-- Score ophalen per gebruiker
SELECT total_score FROM scores_total WHERE user_id = 1;

-- Score per week ophalen
SELECT score, week_number, year FROM scores_weekly WHERE user_id = 1 ORDER BY year DESC, week_number DESC;

-- Score per opleiding ophalen
SELECT total_score FROM scores_study WHERE opleiding = (SELECT opleiding FROM users WHERE id = 1);

-- Score toevoegen of updaten per week
INSERT INTO scores_weekly (user_id, score, week_number, year) 
VALUES (1, 50, WEEK(CURDATE()), YEAR(CURDATE())) 
ON DUPLICATE KEY UPDATE score = score + 50;

-- Totale score updaten
INSERT INTO scores_total (user_id, total_score) 
VALUES (1, 50) 
ON DUPLICATE KEY UPDATE total_score = total_score + 50;

-- Score per opleiding updaten
UPDATE scores_study 
SET total_score = total_score + 50 
WHERE opleiding = (SELECT opleiding FROM users WHERE id = 1);

-- Controleren of een gebruiker al een score heeft voor de huidige week
SELECT * FROM scores_weekly 
WHERE user_id = 1 
AND week_number = WEEK(CURDATE()) 
AND year = YEAR(CURDATE());

-- Automatisch oude scores archiveren
DELETE FROM scores_weekly 
WHERE year < YEAR(CURDATE()) - 1;

-- Een kaart toevoegen aan een gebruiker
INSERT INTO user_cards (user_id, card_name, quantity) 
VALUES (1, 'Magische Kaart', 1)
ON DUPLICATE KEY UPDATE quantity = quantity + 1;

-- Alle kaarten van een gebruiker opvragen
SELECT card_name, quantity FROM user_cards WHERE user_id = 1;

-- Een kaart verwijderen (bijv. als de gebruiker een kaart gebruikt)
UPDATE user_cards 
SET quantity = quantity - 1 
WHERE user_id = 1 AND card_name = 'Magische Kaart' AND quantity > 0;

-- Controleren welke gebruikers de meeste kaarten hebben
SELECT user_id, SUM(quantity) as totaal_kaarten 
FROM user_cards 
GROUP BY user_id 
ORDER BY totaal_kaarten DESC;
