<template>
    <div>
      <h2>Hoe te spelen</h2>
      <h3>Verzamelen:</h3>
      <p>
        Elke gebruiker krijgt een pack met 9 kaarten als ze een account aanmaken. Daarna kun je dagelijks 3 kaarten claimen door simpelweg in te loggen.
        <br> Je kan ook kaarten upgraden naar een hogere zeldzaamheid, dit kan door 3 dezelfde kaarten te combineren, dit geeft je 1 kaart met een hogere zeldzaamheid.
      </p>
      <h3>Ruilen:</h3>
      <p>
        Er is een ruilsysteem ontworpen om met andere studenten op de campus te communiceren.
        <br> Om de ruil te starten, kan één speler een QR-code genereren die door de andere speler kan worden gescand. Als beide spelers de ruil bevestigen, worden de kaarten overgedragen.
      </p>
      <!--<h3>Vechten:</h3>
      <p>
        Battles will be played in a 1v1 format, where each player can use 3 cards. The order in which the players start will be decided by a coin flip.
        <br> The player that wins the coin flip will start the battle and can perform one of the three options: attack (deals damage to the other player's active card), use ability (uses the ability of the active card) and switch (gives you the option to switch your active card with an inactive one). After that each player can perform 2 actions per turn.
        <br> If you can kill all the cards of your opponent, you win the battle and gain yourself the total amount of points of the cards you defeated. 
        <br> The loser also gets some points, they get the amount of points from the lowest rarity card of the opponent.

      </p>-->
      


      <h2>Scorebord</h2>
      <p>
        Het scorebord zal opgedeeld worden in 3 secties: groepsscorebord, individueel scorebord en in de laatste sectie komt een QR-code.
      </p>
      <h3>Groepsscorebord:</h3>
      <p>
        Het groepsscorebord zal weergeven hoeveel punten alle studenten van een specifiek studiegebied gescoord hebben. 
        <br>(Bijvoorbeeld: Technology - 3000ptn, Handel & Business - 2500ptn, ...)
      </p>
      <h3>Individueel scorebord:</h3>
      <p>
        Het individuele scorebord zal de ranking van alle individuele spelers tonen.
      </p>
      <h3>Dagelijkse login:</h3>
      <p>
        In de laatste sectie kun je via de QR-code direct naar de login-pagina gaan, hiermee kun je makkelijk je dagelijkse beloning claimen.
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
        Ons doel is om een leuke game te ontwikkelen voor de studenten van Vives. Het doel van het spel is om studenten van verschillende studiegebieden te verenigen en interactie te creëren.
        <br> Om dit doel te verwezenlijken maken we een digitaal kaartspel waarin spelers kunnen verzamelen, ruilen en tegen elkaar strijden. Als de spelers strijden tegen elkaar kunnen ze nieuwe kaarten verdienen, alsook punten voor de rankings.
      </p>
      <h3>Ons team:</h3>
      <ul class ="default list">
        <li>Verstraete Domien: Front/Back-end ontwikkelaar</li>
        <li>Meuleman Joshua: Back-end/database ontwikkelaar, 3D designer (indien nodig)</li>
        <li>Brassaert Arthur: Frontend ontwikkelaar</li>
        <li>Pladijs Tom: Front-end ontwikkelaar, kaart ontwerper</li>
        <li>Oyen Quentin: Spelregels en concept uitwerken</li>
        <li>Declerq Jules: Grafisch ontwerper, sociale media beheren</li>
        <li>De Smet Xander: Grafisch ontwerper</li>
        <li>Degeest Bram: Robotics</li>
      </ul>

    </div>
  </template>
  
  <script>
  export default {
    name: 'home-page'
  };
  </script>

  <style scoped>
  h2 {
    font-size:40px;
  }

  p{
    font-size:20px;
  }

  .default.list {
    list-style-type: disc;
    font-size: 18px;
  }
  </style>