# Vives Card Game

![logo_campus_games](https://github.com/user-attachments/assets/83abe292-f3c2-4d02-8858-8ffd983cb7be)

## Inhoud
- [Vives Card Game](#vives-card-game)
- [Inhoud](#inhoud)
- [Doel](#doel)
- [npm versies](#npm-versies)
- [Team](#team)
- [Hoe werkt het](#hoe-werkt-het)
  - [Collectie](#collectie)
  - [Ruilen](#ruilen)
  - [Game](#game)
- [Artwork](#artwork)
  - [Kaart template](#kaart-template)
  - [Generatieproces](#generatieproces)
  - [Stijlrichtlijnen](#stijlrichtlijnen)
  - [Tools en Nabewerking](#tools-en-nabewerking)
  - [Bestandsbeheer](#bestandsbeheer)
- [Installatie](#installatie)
  - [Vereisten](#vereisten)
  - [Stappen](#stappen)
  - [Veelvoorkomende Problemen](#veelvoorkomende-problemen)

## Doel
Ons doel is om een game te ontwikkelen die alle opleidingen met elkaar kan verbinden, zodat studenten samen kunnen spelen en te verrenigen. 

Om dit te bereiken, creëren we een online kaartspel dat heel gebruiksvriendelijk is. Spelers kunnen kaarten verdienen, ruilen en tegen elkaar strijden om kaarten en scores te verzamelen. Met deze score word er een leaderboard gemaakt met de hoogste scores. We zorgen ervoor dat de kaarten er aantrekelijk en eenvoudig uitzien voor een breed plubliek aan te spreken. Om te ruilen moet je fysiek bij elkaar staan, dit word waargemaakt door het scannen van een QR-code om met elkaar te ruilen.

## npm versies
- frontend : 
- backend : 10.2.3

## Team

- Verstraete Domien: Front/Back-end developer

- Brassaert Arthur: Frontend developer

- Meuleman Joshua: Back-end developer/database/3D designer

- De Smet Xander: Front-end developer/graphics designer

- Degeest Bram: Robotics/Back-end developer

- Tom Pladijs: front-end

Alle documentatie, zoals foto's, video's en documenten, wordt gedeeld in de map 'Documentatie'. Maak voor elk onderwerp een aparte map binnen de 'Documentatie'-map, zodat alles overzichtelijk en gestructureerd blijft.

## Hoe werkt het

### Collectie
Bij het aanmaken van een account krijgt de gebruiker een starterpack van 3 kaarten. Verder krijgt de gebruiker elke dag een keuze tussen 3 kaarten. Om je collectie ui te breiden kan je ruilen met andere spelers, games winnen en elke dag spelen. Er zijn verschillende zeldzaamheden dat de kaarten kunnen hebben. Hoe zeldzamer je kaart, hoe meer punten deze waard is voor je score.

### Ruilen
Voor een kaart te ruilen met een andere speler zullen ze beiden fysiek aanwezig moeten zijn bij elkaar. Hiervoor gaat de ene gebruiker een qr-code genereren die de andere dan moet scannen om een ruil te beginnen. De qr-code die gegenereerd word is een random string die word aangemaakt elke keer als de ruil pagina word open gedaan. Deze string word opgeslagen in de database. De andere gebruiker die de qr-code dan scanned zal de string lezen en zoeken aan welke gebruiker deze gekoppeld is. Als deze gevonden is zal er een connectie geopend worden tussen de 2 spelers en kunnen ze een kaart ruilen.


### Game
Voor de Game volgt hetzelfde principe als het ruilen. Qr-code die gegenereert wordt en gescanned door de andere gebruiker. 

## Artwork

Een belangrijk onderdeel van de kaarten is het artwork, dat een herkenbare en aantrekkelijke visuele stijl moet hebben. We hebben gekozen voor een cartoonstijl, omdat deze toegankelijk en visueel aantrekkelijk is voor een breed publiek.

### Kaart template
we maken gebruik van een template voor de kaarten zodat we enkel de kleur, attack, abilitie en levens moeten aanpassen en de afbeelding er in plaatsen.

<img src="https://github.com/user-attachments/assets/9a12f915-8ce8-4f75-9b07-1f745147d5a2" width="200" height="300">

### Generatieproces
De afbeeldingen voor de kaarten worden gegenereerd met behulp van AI. Vervolgens passen we handmatige nabewerking toe om:

- De AI-gegenereerde kenmerken te verminderen

- De stijl consistent te houden met de rest van de kaarten

- Onregelmatigheden of fouten te corrigeren

Hierdoor ontstaat een uniforme en professionele uitstraling die past bij de identiteit van het spel.

### Stijlrichtlijnen
Om een consistente stijl te behouden, hanteren we de volgende richtlijnen:

- Kleurenpalet: Heldere en contrastrijke kleuren met een speelse toon

- Lijnwerk: Duidelijke contourlijnen en schaduwen voor een cartoonachtige uitstraling

- Details: Eenvoudige maar expressieve gezichten en poses

- Achtergronden: Minimalistisch met subtiele details om de focus op de personages te leggen

### Tools en Nabewerking
Voor de generaties en nabewerking maken we gebruik van:

- AI-tools: Voor het genereren van ruwe afbeeldingen

- Adobe Express: Voor correcties en stijlbewaking

### Bestandsbeheer
Om efficiënt samen te werken en de kwaliteit te waarborgen, volgen we deze richtlijnen voor bestandsbeheer:

- Bestandsformaat: PNG voor eindresultaten

- Opslag: Gestructureerde mappen per kaarttype en thema

- Versiebeheer: Gebruik van versiebeheer voor updates en verbeteringen


Het artwork speelt een cruciale rol in de visuele identiteit van ons spel. Door AI-generatie te combineren met handmatige nabewerking zorgen we voor een unieke en hoogwaardige uitstraling die past bij de cartoonstijl van onze game.

### Kaarten toevoegen aan de database

Volg deze stappen om handmatig nieuwe kaarten toe te voegen aan de database:

#### 1. Voeg de kaart handmatig toe aan de draaiende container
Als je applicatie een Dockerized MariaDB- of MySQL-database gebruikt, kun je data als volgt invoeren:

1. **Open de databasecontainer**:
   ```bash
   docker exec -it db mysql -u webuser -p
   ```
   - Vervang `db` door de naam van je MariaDB-container.
   - Voer het wachtwoord in wanneer hierom wordt gevraagd.

2. **Gebruik de juiste database en voeg de kaart toe**:
   ```sql
   USE kaartspel_db;

   INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) VALUES ('name', 100, 50, 'extra_action', 'Rare', 'omschrijving', 'opliendingsType', 'Cards/pngNaam');
   ```

#### 2. Voeg dezelfde invoer toe aan `restore.sql`
1. Open je `restore.sql`-bestand en voeg dezelfde SQL-insert toe op de juiste locatie (Na --opleiding. achter de voorgaande value inputs):
   ```sql
    ('name', 100, 50, 'extra_action', 'Rare', 'omschrijving', 'opliendingsType', 'Cards/pngNaam');
   ```
    De laatste insert voor die opleiding heeft een ; nodig alle voorgaande eindigen met een , .

2. Zorg ervoor dat je dubbele sleutels voorkomt als je meerdere keren herstelt. Gebruik bijvoorbeeld `INSERT IGNORE` of `REPLACE INTO`, afhankelijk van het gewenste gedrag.

## Installatie

Volg deze stappen om de applicatie lokaal op te zetten:

### Vereisten
1. **Windows of Linux**:
   - Zorg ervoor dat je een van deze besturingssystemen gebruikt.
2. **Docker Desktop**:
   - Installeer Docker Desktop (voor Windows) of Docker (voor Linux).
   - Zorg ervoor dat Docker actief is en correct werkt.

### Stappen
1. **Clone de repository**:
   - Open een terminal en voer het volgende commando uit:
     ```bash
     git clone https://github.com/vives-project-xp/PX3-Campus-Games.git
     ```
   - Dit zal de repository naar je lokale machine klonen.

2. **Navigeer naar de projectmap**:
   - Ga naar de map van het project:
     ```bash
     cd PX3-Campus-Games
     ```

3. **Ga naar de Docker-map**:
   - Navigeer naar de [docker](http://_vscodecontentref_/0)-map:
     ```bash
     cd docker
     ```

4. **Configureer de `.env`-file**:
   - Maak een `.env`-bestand in de docker folder van het project als deze nog niet bestaat.
   - Voeg de volgende variabelen toe en stel de gewenste poorten in:
     ```env
      DB_ROOT_PASSWORD=DBrootPswrd
      DB_DATABASE=DBname
      DB_USER=DBuser
      DB_PASSWORD=DBpswrd
      API_HOST=1000
      VUE_HOST=2000
      JWT_SECRET=your_secret_key
     ```
   - Zorg ervoor dat de opgegeven poorten beschikbaar zijn op je systeem.



5. **Start de applicatie**:
   - Gebruik Docker Compose om de applicatie te bouwen en te starten:
     ```bash
     docker compose up --build
     ```

6. **Toegang tot de applicatie**:
   - Zodra de containers zijn gestart, kun je de applicatie openen in je browser via de poort die je hebt ingesteld in de `.env`-file:
     ```
     http://localhost:<FRONTEND_PORT>
     ```

7. **API-documentatie**:
   - De API-documentatie is beschikbaar op de volgende URL's:
     - Swagger UI: [http://localhost:<BACKEND_PORT>/docs](http://localhost:<BACKEND_PORT>/docs)
     - JSON-formaat: [http://localhost:<BACKEND_PORT>/docs.json](http://localhost:<BACKEND_PORT>/docs.json)

### Veelvoorkomende Problemen
- **Docker werkt niet**:
  - Controleer of Docker Desktop actief is (voor Windows) of dat de Docker-service draait (voor Linux).
- **Poortconflict**:
  - Zorg ervoor dat de poorten die je in de `.env`-file hebt opgegeven niet in gebruik zijn door een andere applicatie.
- **.env ontbreekt**:
  - Controleer of je een `.env`-bestand hebt aangemaakt en dat de variabelen correct zijn ingesteld.
- **Databasegebruiker ontbreekt of heeft onvoldoende rechten**:
  - Zorg ervoor dat je een databasegebruiker hebt aangemaakt met een wachtwoord.
  - Geef de gebruiker de juiste permissies om de database te kunnen benaderen en bewerken.
  - Controleer of de database-instellingen correct zijn opgegeven in de `.env`-file:
    ```env
    DB_ROOT_PASSWORD=DBrootPswrd
    DB_DATABASE=DBname
    DB_USER=DBuser
    DB_PASSWORD=DBpswrd
    ```
  - Als de database niet toegankelijk is, controleer dan of de gebruiker toegang heeft tot de opgegeven database.

