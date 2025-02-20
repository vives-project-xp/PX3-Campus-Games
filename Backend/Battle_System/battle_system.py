import random

class Card:
    def __init__(self, name, health, damage, abilities):
        self.name = name
        self.max_health = health
        self.health = health
        self.damage = damage
        self.abilities = abilities
        self.block = 0
        self.temp_effects = []

    def attack(self, target, ap):
        if ap <= 0:
            return 0
        base_damage = self.damage
        if "damage_multiplier" in self.temp_effects:
            base_damage = int(base_damage * 1.5)
        
        if ap == 2:
            base_damage = int(base_damage * 0.5)  # Second attack is 50% damage
        
        actual_damage = max(0, base_damage - target.block)
        target.health -= actual_damage
        target.block = 0  # Block only lasts one turn
        return actual_damage
    
    def use_ability(self, ability, target):
        if ability == "heal":
            heal_amount = random.randint(50, 75)
            target.health = min(target.max_health, target.health + heal_amount)
            return f"{self.name} heals {target.name} for {heal_amount} HP!"
        elif ability == "block":
            self.block = random.randint(80, 100)
            return f"{self.name} blocks {self.block} damage!"
        elif ability == "damage_multiplier":
            self.temp_effects.append("damage_multiplier")
            return f"{self.name} gets a damage boost for this and next turn!"
        elif ability == "free_switch":
            return "free_switch"
        return "Invalid ability"
    
    def __repr__(self):
        return f"{self.name} (HP: {self.health}/{self.max_health}, DMG: {self.damage})"

class Player:
    def __init__(self, name, cards):
        self.name = name
        self.active_card = cards.pop(0)
        self.benched_cards = cards
        self.ap = 1  # First turn has 1 AP, subsequent turns have 2 AP
    
    def switch_card(self, new_card):
        if new_card in self.benched_cards:
            self.benched_cards.append(self.active_card)
            self.benched_cards.remove(new_card)
            self.active_card = new_card
            return True
        return False
    
    def has_cards_left(self):
        return self.active_card.health > 0 or any(c.health > 0 for c in self.benched_cards)

# Game Setup
def setup_game():
    all_cards = [
        Card("Dragon", random.randint(150, 300), random.randint(50, 150), ["heal", "block"]),
        Card("Warrior", random.randint(150, 300), random.randint(50, 150), ["damage_multiplier", "block"]),
        Card("Mage", random.randint(150, 300), random.randint(50, 150), ["heal", "free_switch"]),
        Card("Knight", random.randint(150, 300), random.randint(50, 150), ["block", "free_switch"]),
        Card("Archer", random.randint(150, 300), random.randint(50, 150), ["damage_multiplier", "heal"]),
        Card("Berserker", random.randint(150, 300), random.randint(50, 150), ["block", "damage_multiplier"])
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
        
        # Example of attack action
        if current_player.ap > 0:
            damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
            print(f"{current_player.active_card.name} attacks {opponent.active_card.name} for {damage} damage!")
            current_player.ap -= 1
        
        # Example of ability usage
        if current_player.ap > 0 and current_player.active_card.abilities:
            ability = random.choice(current_player.active_card.abilities)
            result = current_player.active_card.use_ability(ability, current_player.active_card)
            if result == "free_switch":
                if current_player.benched_cards:
                    new_card = random.choice(current_player.benched_cards)
                    current_player.switch_card(new_card)
                    print(f"{current_player.name} freely switches to {new_card.name}!")
            else:
                print(result)
            current_player.ap -= 1
        
        # Check if opponent lost
        if opponent.active_card.health <= 0 and not opponent.has_cards_left():
            print(f"{current_player.name} wins!")
            break
        
        turn_counter += 1
    
if __name__ == "__main__":
    play_game()
