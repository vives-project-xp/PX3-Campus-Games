<template>
    <div>
      <h2>Hoe te spelen</h2>
      <h3>Verzamelen:</h3>
      <p>
        Elke gebruiker krijgt een pack met 3 kaarten als ze een account aanmaken. Daarna kun je dagelijks een kaart claimen door simpelweg in te loggen, je krijgt dan de optie om te kiezen tussen 3 kaarten.
        <br> Op <b><a class="pageLink" @click="goToCollectionPage">de collectiepagina</a></b> kun je al je eigen kaarten bekijken. Er zijn ook snelle filters die je kunt gebruiken om te filteren per type en om specifieke kaarten te vinden is er ook de zoekbalk.
      </p>
      <h3>Codex:</h3>
      <p>
        In <b><a class="pageLink" @click="goToCodex">de codex</a></b> kun je alle kaarten bekijken die je hebt verzameld, alsook alle kaarten in het spel. Hier zijn dezelfde filters en zoekbalk beschikbaar als op de collectiepagina.
        <br> Om de details van een kaart te zien kun je op de kaart klikken, deze zal dan uitvergroot worden en linksboven zie je dan alle info van de kaart.
      </p>
      <h3>Ruilen:</h3>
      <p>
        Het is mogelijk om met andere studenten  te ruilen, dit kan door naar <b><a class="pageLink" @click="goToTradingPage">de ruilpagina</a></b> te gaan. Hier kun je een QR-code aanmaken, of die van je medestudent scannen, als dit gebeurt is kun je de kaart(en) selecteren die je wilt ruilen.
        <br> Je ziet ook de kaart(en) die je zult krijgen na aflopen van de ruil. Als je akkoord gaat met de ruil, kun je deze bevestigen. De kaarten worden dan automatisch naar heet account van de juiste speler overgezet.
      </p>
      <h3>Game:</h3>
      <p>
        Op <b><a class="pageLink" @click="goToGamePage">de gamepagina</a></b> kunnen er games tussen 2 spelers gespeeld worden, waarbij elke speler 3 kaarten kan gebruiken. De volgorde waarin de spelers beginnen, wordt bepaald door kop of munt.
        <br> De speler die kop of munt juist had begint het gevecht en kan een van de drie opties uitvoeren: aanvallen (brengt schade toe aan de actieve kaart van de andere speler), vaardigheid gebruiken (gebruikt de vaardigheid van de actieve kaart) en wisselen (geeft je de optie om je actieve kaart te wisselen met een inactieve kaart). Daarna kan elke speler 2 acties per beurt uitvoeren.
        <br> Als je alle kaarten van je tegenstander kunt doden, win je het gevecht en verdien je het totale aantal punten van de kaarten die je hebt verslagen.
        <br> De verliezer krijgt ook wat punten, ze krijgen het aantal punten van de kaart met de laagste zeldzaamheid van de tegenstander.
      </p>
      <h3>Scorebord</h3>
      <p>
        <b><a class="pageLink" @click="goToLeaderboardPage">Het scorebord</a></b> toont je op de hoeveelste plek je staat in de ranking, je gebruikersnaam en je score. De score is het totaal aantal punten van je kaarten bij elkaar opgeteld.
      </p>



      <h2>De kaarten</h2>
      <p> Elke kaart geeft volgende info weer:</p>
      <ul class ="default list">
        <li>Kaartnaam (centrale titel)</li>
        <li>Artwork (illustratie)</li>
        <li>Zeldzaamheid (kleur van de rand)</li>
        <li>Kaarttype (cirkel linksboven) </li>
        <li>Levenspunten (boven de kaartnaam)</li>
        <li>Aanvalspunten (linker voorkant)</li>
        <li>Vaardigheid (rechter vierkant)</li>
      </ul>
      <p> De vijf verschillende zeldzaamheden zijn als volgt:</p>
      <ul class ="default list">
        <li>Common (grijs)</li>
        <li>Uncommon (groen)</li>
        <li>Rare (blauw)</li>
        <li>Very rare (paars)</li>
        <li>Ultra rare (goud)</li>
      </ul>
      <p> En dit zijn alle mogelijke kaarttypes:</p>
      <ul class ="default list">
        <li>Technology en Bio ⚙</li>
        <li>Gezondheidszorg ❤</li>
        <li>Marketing en Business 🤝</li>
        <li>Onderwijs en Sociaal 🎓</li>
      </ul>



      <h2>Over ons</h2>
      <p>
        Ons doel is om een game te ontwikkelen die alle opleidingen met elkaar kan verbinden, zodat studenten samen kunnen spelen en te verrenigen.
        <br>
        <br>
        Om dit te bereiken, creëren we een online kaartspel dat heel gebruiksvriendelijk is. Spelers kunnen kaarten verdienen, ruilen en tegen elkaar strijden om kaarten en scores te verzamelen. 
        Met deze score word er een scorebord gemaakt met de hoogste scores. We zorgen ervoor dat de kaarten er aantrekelijk en eenvoudig uitzien om een breed plubliek aan te spreken.
      </p>
      <h3>Ons team:</h3>
      <ul class ="default list">
        <li>Verstraete Domien: Front- en back-end developer</li>
        <li>Meuleman Joshua: Back-end/database developer, 3D designer (indien nodig)</li>
        <li>Brassaert Arthur: Front-end developer</li>
        <li>Pladijs Tom: Front-end developer, kaart ontwerper</li>
        <li>Oyen Quentin: Spelregels en concept uitwerken</li>
        <li>Declerq Jules: Graphics designer, sociale media beheren</li>
        <li>De Smet Xander: Front-end developer/ graphics designer</li>
        <li>Degeest Bram: Robotics/ back-end developer</li>
      </ul>
      <h3>Documentatie:</h3>
      <p>Alle documentatie is terug te vinden in onze <b><a class="pageLink" href="https://github.com/vives-project-xp/PX3-Campus-Games" target="_blank">github repository</a></b>.</p>

    </div>
  </template>
  
  <script>
  export default {
        name: 'home-page',

        methods: {
          goToCodex() {
            this.$router.push('/codex');
          },

          goToTradingPage() {
            this.$router.push('/trading');
          },

          goToGamePage() {
            this.$router.push('/game');
          },

          goToCollectionPage() {
            this.$router.push('/collection');
          },

          goToLeaderboardPage() {
            this.$router.push('/leaderboard');
          },
        }
  };
  </script>

  <style scoped>
  h2 {
    font-size:40px;
  }

  p{
    font-size:20px;
  }

  .pageLink {
    color: var(--secondary-color);
    cursor: pointer;
    text-decoration: underline;
  }

  .default.list {
    list-style-type: disc;
    font-size: 18px;
  }
  </style>