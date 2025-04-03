function setupGame() {
    const allCards = [
      new Card("WarriorFS", 160, 140, "free_switch"),
      new Card("WarriorDM", 220, 100, "damage_multiplier"),
      new Card("KnightB", 260, 80, "block"),
      new Card("PriestFS", 180, 120, "free_switch"),
      new Card("BerserkerDM", 270, 80, "damage_multiplier"),
      new Card("PaladinB", 300, 60, "block"),
      new Card("PriestH", 220, 100, "heal"),
      new Card("HealerH", 300, 80, "heal"),
      new Card("HealerH", 250, 80, "heal"),
      new Card("KnightB", 220, 100, "block"),
      new Card("BerserkerDM", 200, 120, "damage_multiplier"),
      new Card("PaladinFS", 200, 100, "free_switch")
    ];
  
    const player1 = new Player("Player 1", allCards.slice(0, 3));
    const player2 = new Player("Player 2", allCards.slice(3, 6));
  
    return [player1, player2];
  }
  
  function playGame() {
    const [player1, player2] = setupGame();
    const players = [player1, player2];
  
    // Coin flip
    const firstTurn = players[Math.floor(Math.random() * players.length)];
    console.log(`${firstTurn.name} goes first!`);
  
    let turnCounter = 1;
  
    while (player1.hasCardsLeft() && player2.hasCardsLeft()) {
      const userInput = prompt("Type 'exit' to stop the game, or press Enter to continue: ").toLowerCase();
      if (userInput === "exit") {
        console.log("Game has been stopped by the user.");
        break;
      }
  
      const currentPlayer = players[(turnCounter - 1) % 2];
      const opponent = players[turnCounter % 2];
  
      currentPlayer.ap = turnCounter === 1 ? 1 : 2;
  
      currentPlayer.activeCard.removeBlock();
  
      console.log(`\n${currentPlayer.name}'s turn with ${currentPlayer.ap} AP!`);
  
      // Active turn logic
      while (currentPlayer.ap >= 0) {
        console.log(`\n${currentPlayer.name}'s active card: ${currentPlayer.activeCard}`);
        console.log(`${opponent.name}'s active card: ${opponent.activeCard}`);
        console.log("Choose an action:");
        console.log("1. Attack");
        console.log("2. Use Ability");
        console.log("3. Switch Card");
        console.log("4. End Turn");
  
        const action = prompt("Enter action number: ").trim();
  
        if (action === "1") { // Attack
          if (currentPlayer.ap > 0) {
            const damage = currentPlayer.activeCard.attack(opponent.activeCard, currentPlayer.ap);
            console.log(`${currentPlayer.activeCard.name} attacks ${opponent.activeCard.name} for ${damage} damage!`);
            currentPlayer.ap--;
          } else {
            console.log("Not enough AP!");
          }
        } else if (action === "2") { // Ability
          if (currentPlayer.ap > 0 || currentPlayer.activeCard.ability === "free_switch") {
            const abilityResult = currentPlayer.activeCard.useAbility(currentPlayer);
            console.log(abilityResult);
            if (!abilityResult.includes("free")) {
              currentPlayer.ap--;
            }
          } else {
            console.log("Not enough AP!");
          }
        } else if (action === "3") { // Switch
          if (currentPlayer.ap > 0 || currentPlayer.activeCard.ability === "free_switch") {
            currentPlayer.switchCard();
            if (currentPlayer.activeCard.ability !== "free_switch") {
              currentPlayer.ap--;
            }
          } else {
            console.log("Not enough AP!");
          }
        } else if (action === "4") { // End Turn
          console.log(`${currentPlayer.name} ends their turn.`);
          break;
        } else {
          console.log("Invalid choice, try again.");
        }
      }
  
      opponent.checkAndSwapCard();
      turnCounter++;
    }
  }
  
  // Start the game
  playGame();
  