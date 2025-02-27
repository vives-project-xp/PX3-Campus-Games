<template>
    <div>
      <h2>How to play</h2>
      <h3>Collecting:</h3>
      <p>
        Each new user gets a pack of 9 cards when they create an account. From then you can get 3 free cards, per day, by just scanning a QR-code.
        <br> Cards can also be upgraded to a higher rarity, this can be done by combining 3 of the same card, this will give you 1 card with a higher rarity.
      </p>
      <h3>Trading:</h3>
      <p>
        There's a trading system, made to interact with other students on the campus. You can trade cards, only if you're in the same GPS-location.
        <br> To start the trade, one player will be able to generate a QR-code that can be scanned by the other player. If both players confirm the trade, the cards will be transfered.
      </p>
      <h3>Battling:</h3>
      <p>
        Battles will be played in a 1v1 format, where each player can use 3 cards. The order in which the players start will be decided by a coin flip.
        <br> The player that wins the coin flip will start the battle and can perform one of the three options: attack (deals damage to the other player's active card), use ability (uses the ability of the active card) and switch (gives you the option to switch your active card with an inactive one). After that each player can perform 2 actions per turn.
        <br> If you can kill all the cards of your opponent, you win the battle and gain yourself the total amount of points of the cards you defeated. 
        <br> The loser also gets some points, they get the amount of points from the lowest rarity card of the opponent.

      </p>
      


      <h2>Leaderboard</h2>
      <p>
        The leaderboard will be split up into 3 different sections: group leaderboard, individual leaderboard and in the third section a QR-code for the daily login. 
      </p>
      <h3>Group leaderboard:</h3>
      <p>
        The group leaderboard shows you the total amount of points scored by all the members of each field of study. 
        <br>(For example: Technology - 3000pts, Business - 2500pts, ...)
      </p>
      <h3>Individual leaderboard:</h3>
      <p>
        The individual leaderboard shows you the total amount of points scored by each individual user.
      </p>
      <h3>Daily login:</h3>
      <p>
        In this section of the board we will display a QR-code for quick access tot the login page, where you can claim the daily reward.
      </p>



      <h2>The cards</h2>
      <p> Each card will have the following info on them:</p>
      <ul>
        <li>Card name (center title)</li>
        <li>Artwork (illustration of the card)</li>
        <li>Card rarity (border around the card)</li>
        <li>Card type (left circle) </li>
        <li>Card subtype (right circle)</li>
        <li>Hit points (under the card name)</li>
        <li>Attack points (left square)</li>
        <li>Ability (right square)</li>
      </ul>
      <p> The five different rarities each card can have are the following:</p>
      <ul>
        <li>Common (grey)</li>
        <li>Uncommon (green)</li>
        <li>Rare (blue)</li>
        <li>Very rare (purple)</li>
        <li>Ultra rare (gold)</li>
      </ul>
      <p> And these are the possible card types:</p>
      <ul>
        <li>Healthcare ❤</li>
        <li>Marketing and Business 🤝</li>
        <li>Education and Social 🎓</li>
        <li>Technology ⚙</li>
      </ul>



      <h2>About us</h2>
      <p>
        Our goal is to create a fun and interactive game for the students of VIVES. The game is made to be played on campus and the main goal is to interact with students of different fields of study.
        <br> To accomplish our goal we are developing a card game where players can collect and trade cards with each other. The game will also have a battling system where players can battle each other to gain points.
      </p>

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
  </style>