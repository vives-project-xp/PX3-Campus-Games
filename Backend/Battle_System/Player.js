class Player {
    constructor(name, cards) {
      this.name = name;
      this.activeCard = cards.pop(0);
      this.benchedCards = cards;
      this.ap = 1;
    }
  
    switchCard(free = false) {
      const availableCards = this.benchedCards.filter(card => card.health > 0);
  
      if (availableCards.length > 0) {
        console.log("Available cards:");
        availableCards.forEach((card, index) => {
          console.log(`${index + 1}. ${card.name} (HP: ${card.health})`);
        });
  
        let choice;
        while (true) {
          choice = parseInt(prompt("Choose a card to switch to (number): "), 10) - 1;
          if (choice >= 0 && choice < availableCards.length) {
            const selectedCard = availableCards[choice];
            this.benchedCards = this.benchedCards.filter(card => card !== selectedCard);
            this.benchedCards.push(this.activeCard);
            this.activeCard = selectedCard;
  
            console.log(`${this.name} switches to ${this.activeCard.name}!`);
            if (!free) {
              this.ap--;
            }
            return;
          } else {
            console.log("Invalid choice. Try again.");
          }
        }
      } else {
        console.log(`${this.name} has no available cards left!`);
      }
    }
  
    checkAndSwapCard() {
      if (this.activeCard.health <= 0) {
        console.log(`${this.activeCard.name} has fainted!`);
        this.switchCard();
      }
    }
  
    hasCardsLeft() {
      return this.activeCard.health > 0 || this.benchedCards.some(card => card.health > 0);
    }
  }
  