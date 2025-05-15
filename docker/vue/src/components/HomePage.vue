<template>
  <div class="logo"><img src="/logo_campus_games.jpg" alt="Vives Campus Games logo" class="logo-image"></div>
  <div class="call-to-action">
      <button v-if="!isLoggedIn" @click="goToLogin" class="login-button">Start</button>
    </div>
  <div class ="home-page"> 
    
    
    

    <div class="about-section">
      <button @click="toggleSection('aboutUs')" class="toggle-button1">
        {{ visibleSections.aboutUs ? 'Verberg over ons' : 'Over ons' }}
      </button>
      <div v-if="visibleSections.aboutUs" class="content-container">
        <p>
          Ons doel is om een game te ontwikkelen die alle opleidingen met elkaar kan verbinden, zodat studenten samen kunnen spelen en zich verbonden kunnen voelen.
          <br>
          <br>
          Om dit te bereiken, creëren we een online kaartspel dat heel gebruiksvriendelijk is. Spelers kunnen kaarten verdienen, ruilen en tegen elkaar strijden om kaarten en scores te verzamelen.
          Met deze score word er een scorebord gemaakt met de hoogste scores. We zorgen ervoor dat de kaarten er aantrekkelijk en eenvoudig uitzien om een breed publiek aan te spreken.
        </p>
      </div>
    </div>
    
    <div>
      <h2>Hoe te spelen</h2>
      <button @click="toggleSection('howToPlay')" class="toggle-button2">
        {{ visibleSections.howToPlay ? 'Verberg uitleg' : 'Toon uitleg' }}
      </button>

      <div v-if="visibleSections.howToPlay" class="content-container">
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
          Het is mogelijk om met andere studenten te ruilen, dit kan door naar <b><a class="pageLink" @click="goToTradingPage">de ruilpagina</a></b> te gaan. Hier kun je een QR-code aanmaken, of die van je medestudent scannen, als dit gebeurt is kun je de kaart(en) selecteren die je wilt ruilen.
          <br> Je ziet ook de kaart(en) die je zult krijgen na aflopen van de ruil. Als je akkoord gaat met de ruil, kun je deze bevestigen. De kaarten worden dan automatisch naar het account van de juiste speler overgezet.
        </p>

        <h3>Scorebord:</h3>
        <p>
          <b><a class="pageLink" @click="goToLeaderboardPage">Het scorebord</a></b> toont je op de hoeveelste plek je staat in de ranking, je gebruikersnaam en je score. De score is het totaal aantal punten van je kaarten bij elkaar opgeteld.
        </p>
      </div>
    </div>

    <div>
      <h2>De kaarten</h2>
      <p> Elke kaart geeft volgende info weer:</p>
      <ul class="default list">
        <li>Kaartnaam (centrale titel)</li>
        <li>Artwork (illustratie)</li>
        <li>Zeldzaamheid (kleur van de rand)</li>
        <li>Kaarttype (cirkel linksboven)</li>
        <li>Levenspunten (boven de kaartnaam)</li>
        <li>Aanvalspunten (linker voorkant)</li>
        <li>Vaardigheid (rechter vierkant)</li>
      </ul>
      <p> De vijf verschillende zeldzaamheden zijn als volgt:</p>
      <ul class="default list">
        <li>Gewoon</li>
        <li>Ongewoon</li>
        <li>Zeldzaam</li>
        <li>Uiterst zeldzaam</li>
        <li>Legendarisch</li>
      </ul>
      <p> En dit zijn alle mogelijke kaarttypes:</p>
      <ul class="default list">
        <li>Technology en Bio ⚙</li>
        <li>Gezondheidszorg ❤</li>
        <li>Marketing en Business 🤝</li>
        <li>Onderwijs en Sociaal 🎓</li>
      </ul>
    </div>

    <div>
      <h2>Ons team:</h2>
      <ul class="default list">
        <li>Verstraete Domien: Front- en back-end developer</li>
        <li>Meuleman Joshua: Back-end/database developer, 3D designer (indien nodig)</li>
        <li>Brassaert Arthur: Front-end developer</li>
        <li>Pladijs Tom: Front-end developer, kaart ontwerper</li>
        <li>Oyen Quentin: Spelregels en concept uitwerken</li>
        <li>Declerq Jules: Graphics designer, sociale media beheren</li>
        <li>De Smet Xander: Front-end developer/ graphics designer</li>
        <li>Degeest Bram: Robotics/ back-end developer</li>
      </ul>
      <h2>Documentatie:</h2>
      <p>Alle documentatie is terug te vinden in onze
        <b><a class="pageLink" href="https://github.com/vives-project-xp/PX3-Campus-Games" target="_blank">github repository</a></b>.</p>
    </div>

    
  </div>
  <div class="call-to-action">
      <button v-if="!isLoggedIn" @click="goToLogin" class="login-button">Start</button>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
  name: 'home-page',
  setup() {
    const router = useRouter();
    const visibleSections = ref({
      aboutUs: false,
      howToPlay: false
    });
    const isLoggedIn = ref(false);

    const toggleSection = (section) => {
      visibleSections.value[section] = !visibleSections.value[section];
    };

    const goToCodex = () => {
      router.push('/codex');
    };

    const goToTradingPage = () => {
      router.push('/trading');
    };

    const goToGamePage = () => {
      router.push('/game');
    };

    const goToCollectionPage = () => {
      router.push('/collection');
    };

    const goToLeaderboardPage = () => {
      router.push('/leaderboard');
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      isLoggedIn.value = !!token;
    };

    onMounted(() => {
      checkLoginStatus();
    });

    const goToLogin = () => {
      router.push('/login');
    };

    return {
      visibleSections,
      isLoggedIn,
      toggleSection,
      goToCodex,
      goToTradingPage,
      goToGamePage,
      goToCollectionPage,
      goToLeaderboardPage,
      goToLogin
    };
  }
};
</script>

<style scoped>
h2 {
  text-align: left;
  font-size: 20px;
  padding: 0;
  margin: 0;
}

p {
  font-size: 20px;
}
.home-page {
  border: 2px solid grey;
  border-radius: 10px;
  margin: 20px 0;
  background-color: rgba(255, 255, 255, 0.85); /* Semi-transparent white */
  box-shadow: 0 5px 5px lightslategray;
  padding-left: 20px;
  padding-right: 20px;
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

.call-to-action {
    text-align: center;
    margin-bottom: 20px;
}

.login-button {
    padding: 10px 20px;
    font-size: 50px;
    font-weight: bold;
    background-color: red;
    color: white;
    border-radius: 10px;
    border : none;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.about-section {
  background-color: rgba(255, 255, 255, 0.85); /* Semi-transparent white */
}

.pageLink {
  color: red;
  cursor: pointer;
  text-decoration: underline;
}

.default.list {
  list-style-type: disc;
  font-size: 18px;
}

.toggle-button1 {
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 20px;
  font-weight: bold;
}

.toggle-button2 {
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 20px;
  font-weight: bold;
}

.content-container {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 25px;
  background-color: #fff;
  margin: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #333;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

h3 {
  color: red;
  margin-top: 20px;
}

.pageLink {
  color: red;
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
}

.pageLink:hover {
  color: #cc0000;
  text-decoration: none;
}

p {
  line-height: 1.6;
  color: #555;
}
</style>