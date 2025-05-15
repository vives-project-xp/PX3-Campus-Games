use database kaartspel_db;

INSERT INTO Cards_dex (cardName, health, attack, ability, rarity, info, opleiding, artwork_path) 
VALUES 
('3D Printer', 200, 100, 'block', 'Rare', 
'Een 3D-printer creëert fysieke objecten door materiaal laag voor laag op te bouwen. Het wordt gebruikt in prototyping, productie en zelfs in de medische sector.', 
'technology&bio', '/Cards/3D_printer.png'),

('404', 180, 120, 'block', 'Uncommon', 
'De HTTP 404-foutcode betekent dat de pagina niet gevonden kon worden. Het is een veelvoorkomende foutmelding op het internet wanneer een link niet werkt.', 
'technology&bio', '/Cards/404.png'),

('Aandelen', 160, 140, 'free_switch', 'Ultra Rare', 
'Aandelen vertegenwoordigen eigendom in een bedrijf. Beleggers kopen en verkopen aandelen op de beurs, hopend op waardestijging of dividenduitkeringen.', 
'handel&business', '/Cards/Aandelen.png'),

('Afstudeerhoedje', 220, 80, 'extra_action', 'Ultra Rare', 
'Het afstudeerhoedje is een symbool van academisch succes. Het wordt gedragen tijdens diploma-uitreikingen en vertegenwoordigt het behalen van een opleiding.', 
'onderwijs&sociaal', '/Cards/AfstudeerHoedje.png'),

('Ambulance', 240, 100, 'heal', 'Rare', 
'Een ambulance is een voertuig voor spoedeisende medische hulp. Het brengt patiënten snel naar het ziekenhuis en biedt onderweg levensreddende zorg.', 
'gezondheidszorg', '/Cards/Ambulance.png'),

('Bankdirecteur', 200, 120, 'free_switch', 'Uncommon', 
'De bankdirecteur leidt een financiële instelling. Hij is verantwoordelijk voor strategie, klantrelaties en het beheer van geldstromen.', 
'handel&business', '/Cards/BankDirecteur.png'),

('Baxter', 180, 140, 'block', 'Common', 
'Baxter is een collaboratieve robot ontworpen voor veilige interactie met mensen. Hij wordt gebruikt in onderzoek, onderwijs en industriële toepassingen.', 
'technology&bio', '/Cards/Baxter.png'),

('BSOD', 160, 160, 'block', 'Uncommon', 
'Het Blue Screen of Death (BSOD) is een Windows-foutscherm dat verschijnt bij kritieke systeemfouten. Het dwingt de computer tot herstarten.', 
'technology&bio', '/Cards/BSOD.png'),

('Computermuis', 140, 120, 'block', 'Uncommon', 
'Een computermuis is een invoerapparaat dat de cursor op het scherm bestuurt. Het maakt navigeren en werken met computers intuïtiever.', 
'technology&bio', '/Cards/Computermuis.png'),

('Crypto', 180, 140, 'free_switch', 'Legendary', 
'Cryptocurrency is digitaal geld gebaseerd op blockchain-technologie. Het biedt gedecentraliseerde, veilige transacties zonder tussenkomst van banken.', 
'handel&business', '/Cards/Crypto.png'),

('Dafalgan', 200, 80, 'heal', 'Ultra Rare', 
'Dafalgan is een pijnstiller op basis van paracetamol. Het verlicht pijn en koorts en is een van de meest gebruikte medicijnen ter wereld.', 
'gezondheidszorg', '/Cards/Dafalgan.png'),

('Dierenarts', 220, 100, 'heal', 'Uncommon',
'Een dierenarts behandelt zieke en gewonde dieren. Ze voeren onderzoeken uit, geven vaccinaties en voeren soms operaties uit.',
'gezondheidszorg', '/Cards/Dierenarts.png'),

('Event Planner', 180, 120, 'extra_action', 'Uncommon', 
'Een event planner organiseert bijeenkomsten, van bruiloften tot zakelijke evenementen. Ze regelen locaties, catering en programma\'s voor onvergetelijke ervaringen.', 
'handel&business', '/Cards/EventPlanner.png'),

('Examen', 160, 140, 'extra_action', 'Common', 
'Een examen test kennis en vaardigheden van studenten. Het is een spannend moment dat vaak bepaalt of een opleiding succesvol is afgerond.', 
'onderwijs&sociaal', '/Cards/Examen.png'),

('Excel', 200, 100, 'block', 'Rare', 
'Microsoft Excel is een spreadsheetprogramma voor data-organisatie en -analyse. Het wordt wereldwijd gebruikt voor berekeningen, grafieken en data-management.', 
'technology&bio', '/Cards/Excel.png'),

('Geld', 120, 180, 'free_switch', 'Rare', 
'Geld is een ruilmiddel voor goederen en diensten. Het vergemakkelijkt economische transacties en is een maatstaf voor waarde.', 
'handel&business', '/Cards/Geld.png'),

('Geschiedenisleerkracht', 200, 100, 'extra_action', 'Common', 
'Een geschiedenisleerkracht brengt het verleden tot leven voor studenten. Hij inspireert met verhalen over historische gebeurtenissen en hun impact op vandaag.', 
'onderwijs&sociaal', '/Cards/GeschiedenisLeerkracht.png'),

('GTA V', 180, 120, 'block', 'Ultra Rare', 
'Grand Theft Auto V is een populair openwereldspel met een enorme spelwereld, verhaalmissies en online multiplayer-mogelijkheden.', 
'technology&bio', '/Cards/GTA_V.png'),

('Labjas', 160, 100, 'heal', 'Ultra Rare', 
'Een labjas is beschermende kleding voor wetenschappers en onderzoekers. Het beschermt tegen chemicaliën en houdt experimenten schoon.', 
'technology&bio', '/Cards/Labjas.png'),

('Labo', 220, 80, 'heal', 'Common', 
'Een laboratorium is een gecontroleerde omgeving voor wetenschappelijk onderzoek. Hier worden experimenten uitgevoerd en nieuwe ontdekkingen gedaan.', 
'technology&bio', '/Cards/Labo.png'),

('Linux', 180, 140, 'block', 'Uncommon', 
'Linux is een open-source besturingssysteem bekend om zijn stabiliteit en veiligheid. Het wordt veel gebruikt in servers, supercomputers en embedded systemen.', 
'technology&bio', '/Cards/Linux.png'),

('Minecraft', 200, 100, 'block', 'Ultra Rare', 
'Minecraft is een sandbox-spel waar spelers blokken plaatsen en breken om werelden te creëren. Het stimuleert creativiteit en probleemoplossend denken.', 
'technology&bio', '/Cards/Minecraft.png'),

('NFTs', 160, 140, 'free_switch', 'Ultra Rare',
'NFTs (Non-Fungible Tokens) zijn unieke digitale certificaten van eigendom voor digitale kunst, verzamelobjecten en andere virtuele items.',
'handel&business', '/Cards/NFTS.png'),

('Piloot', 220, 100, 'free_switch', 'Uncommon', 
'Een piloot bestuurt vliegtuigen en zorgt voor veilige passagiersvluchten. Het vereist precisie, training en verantwoordelijkheid.', 
'handel&business', '/Cards/Piloot.png'),

('Pop-a-loon', 180, 120, 'block', 'Rare', 
'Pop-a-loon is een ballonnenbedrijf dat feesten en evenementen opvrolijkt met kleurrijke balloncreaties en decoraties.', 
'handel&business', '/Cards/Pop_a_loon.png'),

('Powerpoint', 160, 120, 'extra_action', 'Rare', 
'Microsoft PowerPoint is software voor het maken van presentaties. Het wordt gebruikt om ideeën visueel te presenteren met tekst, afbeeldingen en animaties.', 
'technology&bio', '/Cards/Powerpoint.png'),

('RC Auto', 200, 100, 'block', 'Ultra Rare', 
'Een radiografisch bestuurbare auto is een modelvoertuig dat op afstand wordt bestuurd. Het is een populaire hobby voor jong en oud.', 
'technology&bio', '/Cards/RC_auto.png'),

('Reisagent', 180, 120, 'free_switch', 'Common', 
'Een reisagent helpt bij het plannen en boeken van vakanties. Ze adviseren over bestemmingen, accommodaties en reisroutes.', 
'handel&business', '/Cards/Reisagent.png'),

('Rolstoel', 240, 60, 'heal', 'Rare', 
'Een rolstoel geeft mobiliteit aan mensen met beperkingen. Het stelt gebruikers in staat zich zelfstandig te verplaatsen en deel te nemen aan het dagelijks leven.', 
'gezondheidszorg', '/Cards/Rolstoel.png'),

('Schoolbus', 220, 80, 'extra_action', 'Rare', 
'Een schoolbus vervoert leerlingen veilig van en naar school. Het is een herkenbaar symbool van onderwijs en jeugd.', 
'onderwijs&sociaal', '/Cards/SchoolBus.png'),

('Serveerster', 160, 140, 'free_switch', 'Common', 
'Een serveerster bedient gasten in restaurants en cafés. Ze zorgt voor een prettige eetervaring met vriendelijke service en aandacht.', 
'handel&business', '/Cards/Serveerster.png'),

('Soldeerstation', 180, 120, 'block', 'Uncommon', 
'Een soldeerstation wordt gebruikt om elektronische componenten te verbinden. Het is een essentieel gereedschap voor elektronicareparatie en -bouw.', 
'technology&bio', '/Cards/SoldeerStation.png'),

('Sommelier', 200, 100, 'free_switch', 'Uncommon', 
'Een sommelier is een wijnkenner die gasten adviseert over wijnkeuzes. Hij combineert kennis van smaken, regio\'s en voedselpairings.', 
'handel&business', '/Cards/Sommelier.png'),

('Stewardess', 180, 120, 'free_switch', 'Common', 
'Een stewardess zorgt voor passagiers tijdens vluchten. Ze bieden service, veiligheidsinstructies en zorgen voor comfort aan boord.', 
'handel&business', '/Cards/Stewerdess.png'),

('Supermarkt', 220, 80, 'free_switch', 'Common', 
'Een supermarkt verkoopt voedsel en huishoudelijke producten. Het is een centrale plek in het dagelijks leven waar mensen hun boodschappen doen.', 
'handel&business', '/Cards/Supermarkt.png'),

('The Wolf of Wall Street', 160, 160, 'free_switch', 'Ultra Rare', 
'Verwijst naar de film over excessen in de financiële wereld. Symbool voor risicovolle investeringen en het najagen van rijkdom.', 
'handel&business', '/Cards/TheWolfOfWallStreet.png'),

('TOLEDO', 140, 140, 'extra_action', 'Ultra Rare', 
'TOLEDO is het digitale leerplatform van de KU Leuven. Studenten vinden er cursussen, opdrachten en communicatie met docenten.', 
'onderwijs&sociaal', '/Cards/TOLEDO.png'),

('Wiskundeleerkracht', 180, 120, 'extra_action', 'Uncommon', 
'Een wiskundeleerkracht onderwijst abstract denken en probleemoplossende vaardigheden. Hij maakt complexe concepten begrijpelijk voor studenten.', 
'onderwijs&sociaal', '/Cards/WiskundeLeerkracht.png'),

('Word', 160, 120, 'extra_action', 'Rare', 
'Microsoft Word is een tekstverwerkingsprogramma voor het maken van documenten. Het is een van de meest gebruikte softwaretools ter wereld.', 
'technology&bio', '/Cards/Word.png'),