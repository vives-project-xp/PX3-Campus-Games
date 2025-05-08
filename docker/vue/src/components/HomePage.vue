<template>
  <div class="logo"><img src="/logo_campus_games.jpg" alt="Vives Campus Games logo" class="logo-image"></div>
    <div class="about-section">
      <h2>Over ons</h2>
      <p>
        Ons doel is om een game te ontwikkelen die alle opleidingen met elkaar kan verbinden, zodat studenten samen kunnen spelen en zich verbonden kunnen voelen.
        <br>
        <br>
        Om dit te bereiken, creëren we een online kaartspel dat heel gebruiksvriendelijk is. Spelers kunnen kaarten verdienen, ruilen en tegen elkaar strijden om kaarten en scores te verzamelen.
Met deze score wordt er een scorebord gemaakt met de hoogste scores. We zorgen ervoor dat de kaarten er aantrekkelijk en eenvoudig uitzien om een breed publiek aan te spreken.
      </p>
    </div>
    <div>
      <h2>Hoe te spelen</h2>
    <button cl
      @click="toggleContent" 
      class="toggle-button"
    >
      {{ isContentVisible ? 'Verberg uitleg' : 'Toon uitleg:' }}
    </button>

    <div v-if="isContentVisible" class="content-container">
      
      
      <h3>Verzamelen:</h3>
      <p>
        Op <b><a class="pageLink" @click="goToCollectionPage">de collectiepagina</a></b> kun je al je verzamelde kaarten bekijken. Er zijn snelle filters beschikbaar om per type te filteren, en met de zoekbalk kun je specifieke kaarten vinden.
      </p>
      
      <h3>Codex:</h3>
      <p>
        In <b><a class="pageLink" @click="goToCodex">de codex</a></b> vind je zowel alle door jou verzamelde kaarten als alle beschikbare kaarten in het spel. Hier kun je gebruikmaken van dezelfde filters en zoekfunctie als op de collectiepagina.
        Klik op een kaart om de details te bekijken. De kaart wordt dan uitvergroot weergegeven, met alle informatie duidelijk zichtbaar in de linkerbovenhoek.
      </p>
      
      <h3>Ruilen:</h3>
      <p>
        Je kunt kaarten ruilen met andere studenten via <b><a class="pageLink" @click="goToTradingPage">de ruilpagina</a></b>. Hier kun je:

        <ul> <li>Een QR-code genereren</li> <li>De QR-code van een medestudent scannen</li> </ul> Nadat de verbinding tot stand is gebracht, selecteer je de kaarten die je wilt ruilen.
        Je krijgt direct te zien welke kaarten je in ruil ontvangt. Bij akkoord bevestig je de ruil, waarna de kaarten automatisch tussen de accounts worden uitgewisseld.
      </p>
      
      <h3>Scorebord</h3>
      <p>
        <b><a class="pageLink" @click="goToLeaderboardPage">Het scorebord</a></b> toont je op de hoeveelste plek je staat in de ranking, je gebruikersnaam en je score. De score is het totaal aantal punten van je kaarten bij elkaar opgeteld.
      </p>
    </div>
  </div>
      <div>



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
        <li>Gewoon</li>
        <li>Ongewoon</li>
        <li>Zeldzaam</li>
        <li>Uiterst zeldzaam</li>
        <li>Legendarisch</li>
      </ul>
      <p> En dit zijn alle mogelijke kaarttypes:</p>
      <ul class ="default list">
        <li>Technology en Bio ⚙</li>
        <li>Gezondheidszorg ❤</li>
        <li>Marketing en Business 🤝</li>
        <li>Onderwijs en Sociaal 🎓</li>
      </ul>
    </div>
      <div>



      
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
      <p>Alle documentatie is terug te vinden in onze 
        <b><a class="pageLink" href="https://github.com/vives-project-xp/PX3-Campus-Games" target="_blank">github repository</a></b>.</p>
    </div>
  </template>
  
  <script>
  export default {
        name: 'home-page',
        data() {
    return {
      isContentVisible: false
    } 
  },

        methods: {
          toggleContent() {
          this.isContentVisible = !this.isContentVisible;
        },
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
    text-align: left;
    font-size:40px;
    padding: 0;
    margin: 0;
  }

  p{
    font-size:20px;
  }
  .logo {
    width: 100%;
    max-height: 50vh;
    text-align: center;
    margin-bottom: 2rem;
    margin-top: 40px;
    background-color: #fd0100; 
    border: none; 
    padding: 0; 
    box-sizing: border-box; 
    border-radius: 10px;
}

.logo-image {
    max-width: 100%;
    height: auto;
    display: block;
    margin: auto;
}
  .about-section {
  
  border: 2px solid grey; 
  border-radius: 10px;    
  padding-left: 20px;
  padding-right: 20px;          
  margin: 20px 0;         
  background-color: lightgray;
  box-shadow: 0 5px 5px lightslategray;
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
  .toggle-button {
    padding: 15px;
        width: 25%;
        padding: 1rem;
        background-color: red;
        color: white;
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 15px;
}


.content-container {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 25px;
  background-color: #fff;
  margin: 20px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

h2 {
  color: #333;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

h3 {
  color: #fd0100; /* Rode kleur voor subkopjes */
  margin-top: 20px;
}

.pageLink {
  color: #0066cc;
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
}

.pageLink:hover {
  color: #004499;
  text-decoration: none;
}

p {
  line-height: 1.6;
  color: #555;
}
  </style>