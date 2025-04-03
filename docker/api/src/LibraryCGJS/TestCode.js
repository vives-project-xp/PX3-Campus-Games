class Card {
    constructor(name, health, damage, ability) {
        this.name = name;
        this.maxHealth = health;
        this.baseHealth = health;
        this.health = health;
        this.damage = damage;
        this.ability = ability;
        this.block = 0;
        this.tempEffects = [];
        this.hasAttackedThisTurn = false; // Track if card attacked this turn
    }

    attack(target, ap) {
        if (this.health <= 0) {
            console.log(`${this.name} is defeated and cannot attack!`);
            return 0;
        }

        if (ap <= 0) {
            return 0;
        }

        let baseDamage = this.damage;
        
        // Apply 50% damage penalty if already attacked this turn
        if (this.hasAttackedThisTurn) {
            baseDamage = Math.floor(baseDamage * 0.5);
            console.log(`${this.name} deals reduced damage (50%) this turn!`);
        }

        const actualDamage = Math.min(target.health, baseDamage);
        target.health -= actualDamage;
        this.hasAttackedThisTurn = true; // Mark that this card attacked

        if (target.health <= 0) {
            target.health = 0;
        }

        return actualDamage;
    }

    useAbility(player) {
        if (this.ability === "heal") {
            const healAmount = 75;
            this.health = Math.min(this.maxHealth, this.health + healAmount);
            return `${this.name} heals for ${healAmount} HP!`;
        } else if (this.ability === "block") {
            this.block = 80;
            this.health += this.block;
            return `${this.name} gains ${this.block} temporary HP!`;
        } else if (this.ability === "free_switch") {
            player.switchCard(true);
            return `${player.name} switches cards for free!`;
        } else if (this.ability === "extra_action") {
            player.ap += 2; // Grants +2 AP (net +1 after cost)
            return `${player.name} gains 1 AP!`;
        }
        return "Invalid ability";
    }

    removeBlock() {
        if (this.block > 0) {
            this.health -= this.block;
            this.block = 0;
            if (this.health < this.baseHealth) {
                this.health = this.baseHealth;
            }
        }
    }

    toString() {
        return `${this.name} (HP: ${this.health}/${this.maxHealth}, DMG: ${this.damage})`;
    }
}

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

function setupGame() {
    const allCards = [
        new Card("WarriorFS", 160, 140, "free_switch"),
        new Card("WarriorDM", 220, 100, "extra_action"),
        new Card("KnightB", 260, 80, "block"),
        new Card("PriestFS", 180, 120, "free_switch"),
        new Card("BerserkerDM", 270, 80, "extra_action"),
        new Card("PaladinB", 300, 60, "block"),
        new Card("PriestH", 220, 100, "heal"),
        new Card("HealerH", 300, 80, "heal"),
        new Card("HealerH", 250, 80, "heal"),
        new Card("KnightB", 220, 100, "block"),
        new Card("BerserkerDM", 200, 120, "extra_action"),
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

        // Reset attack state for the active card at the start of the turn
        currentPlayer.activeCard.hasAttackedThisTurn = false;

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