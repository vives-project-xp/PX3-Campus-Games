import random

class Card:
    def __init__(self, name, health, damage, ability):
        self.name = name
        self.max_health = health
        self.health = health
        self.damage = damage
        self.ability = ability
        self.block = 0
        self.temp_effects = []

    def attack(self, target, ap):
        if ap <= 0 or self.health <= 0:
            return 0  # Dode kaarten kunnen niet aanvallen
        base_damage = self.damage
        if "damage_multiplier" in self.temp_effects:
            base_damage = int(base_damage * 1.5)
        
        if ap == 2:
            base_damage = int(base_damage * 0.5)  # Tweede aanval doet 50% schade
        
        actual_damage = max(0, base_damage - target.block)
        target.health -= actual_damage
        target.block = 0  # Block verdwijnt na één beurt
        return actual_damage
    
    def use_ability(self, target):
        if self.ability == "heal":
            heal_amount = random.randint(50, 75)
            target.health = min(target.max_health, target.health + heal_amount)
            return f"{self.name} heals {target.name} for {heal_amount} HP!"
        elif self.ability == "block":
            self.block = random.randint(80, 100)
            return f"{self.name} blocks {self.block} damage!"
        elif self.ability == "damage_multiplier":
            self.temp_effects.append("damage_multiplier")
            return f"{self.name} gets a damage boost for this and next turn!"
        elif self.ability == "free_switch":
            return "free_switch"
        return "Invalid ability"
    
    def __repr__(self):
        return f"{self.name} (HP: {self.health}/{self.max_health}, DMG: {self.damage})"

class Player:
    def __init__(self, name, cards):
        self.name = name
        self.active_card = cards.pop(0)
        self.benched_cards = cards
        self.ap = 1  # Eerste beurt heeft 1 AP, volgende beurten 2 AP
    
    def switch_card(self, new_card):
        if new_card in self.benched_cards:
            self.benched_cards.append(self.active_card)
            self.benched_cards.remove(new_card)
            self.active_card = new_card
            return True
        return False
    
    def check_and_swap_card(self):
        """Controleert of de actieve kaart is verslagen en wisselt deze indien mogelijk."""
        if self.active_card.health <= 0:
            print(f"{self.active_card.name} has fainted!")
            if self.benched_cards:
                new_card = self.benched_cards.pop(0)
                self.active_card = new_card
                print(f"{self.name} swaps in {new_card.name}!")
            else:
                print(f"{self.name} has no more cards left!")

    def has_cards_left(self):
        return self.active_card.health > 0 or any(c.health > 0 for c in self.benched_cards)

# Game Setup
def setup_game():
    all_cards = [
        Card("Dragon", random.randint(150, 300), random.randint(50, 150), "heal"),
        Card("Warrior", random.randint(150, 300), random.randint(50, 150), "damage_multiplier"),
        Card("Mage", random.randint(150, 300), random.randint(50, 150), "heal"),
        Card("Knight", random.randint(150, 300), random.randint(50, 150), "block"),
        Card("Archer", random.randint(150, 300), random.randint(50, 150), "damage_multiplier"),
        Card("Berserker", random.randint(150, 300), random.randint(50, 150), "block")
    ]
    
    random.shuffle(all_cards)
    player1 = Player("Player 1", all_cards[:3])
    player2 = Player("Player 2", all_cards[3:6])
    
    return player1, player2

# Game Loop
def play_game():
    player1, player2 = setup_game()
    players = [player1, player2]
    
    first_turn = random.choice(players)
    second_turn = player1 if first_turn == player2 else player2
    print(f"{first_turn.name} goes first!")
    
    turn_counter = 1
    
    while player1.has_cards_left() and player2.has_cards_left():
        user_input = input("Type 'exit' or 'stop' to end the game, or press Enter to continue: ").strip().lower()
        if user_input in ["exit", "stop"]:
            print("Game has been stopped by the user.")
            break
        
        current_player = players[(turn_counter - 1) % 2]
        opponent = players[turn_counter % 2]
        current_player.ap = 2 if turn_counter > 1 else 1
        
        print(f"\n{current_player.name}'s turn with {current_player.ap} AP!")
        
        while current_player.ap > 0:
            print(f"\n{current_player.name}'s active card: {current_player.active_card}")
            print(f"{opponent.name}'s active card: {opponent.active_card}")
            print("Choose an action:")
            print("1. Attack")
            print("2. Use Ability")
            print("3. Switch Card")
            action = input("Enter the number of your action: ").strip()
            
            if action == "1":
                damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
                print(f"{current_player.active_card.name} attacks {opponent.active_card.name} for {damage} damage!")
                current_player.ap -= 1
            elif action == "2":
                if current_player.active_card.ability:
                    result = current_player.active_card.use_ability(current_player.active_card)
                    if result == "free_switch":
                        if current_player.benched_cards:
                            new_card = random.choice(current_player.benched_cards)
                            current_player.switch_card(new_card)
                            print(f"{current_player.name} freely switches to {new_card.name}!")
                    else:
                        print(result)
                    current_player.ap -= 1
                else:
                    print("No abilities available.")
            elif action == "3":
                if current_player.benched_cards:
                    print("Choose a card to switch to:")
                    for i, card in enumerate(current_player.benched_cards):
                        print(f"{i + 1}. {card}")
                    card_choice = int(input("Enter the number of the card: ").strip()) - 1
                    if 0 <= card_choice < len(current_player.benched_cards):
                        new_card = current_player.benched_cards[card_choice]
                        current_player.switch_card(new_card)
                        print(f"{current_player.name} switches to {new_card.name}!")
                        current_player.ap -= 1
                    else:
                        print("Invalid card choice.")
                else:
                    print("No benched cards available.")
            else:
                print("Invalid action choice.")

        # Controleer of de actieve kaart is verslagen en vervang deze
        opponent.check_and_swap_card()
        
        # Controleer of het spel eindigt
        if not opponent.has_cards_left():
            print(f"{current_player.name} wins!")
            break
        
        turn_counter += 1
    
    # Eindcontrole na de beurt
    if not player1.has_cards_left():
        print(f"{player2.name} wins!")
    elif not player2.has_cards_left():
        print(f"{player1.name} wins!")
    
if __name__ == "__main__":
    play_game()
