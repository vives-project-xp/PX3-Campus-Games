import random

##########################################
# classen in verschillende files plaatsen
# kijken voor python fastAPI Flask of websockets ipv overzetten naar JS?
##########################################

class Card:
    def __init__(self, name, health, damage, ability):
        self.name = name
        self.max_health = health
        self.base_health = health  # Keeps track of real health before block is applied
        self.health = health
        self.damage = damage
        self.ability = ability
        self.block = 0  # Temporary HP
        self.temp_effects = []

    def attack(self, target, ap):
        if self.health <= 0:
            print(f"{self.name} is defeated and cannot attack!") 
            return 0  # Dead cards can't attack

        if ap <= 0:
            return 0
        
        base_damage = self.damage
        if "damage_multiplier" in self.temp_effects:
            base_damage = int(base_damage * 1.5)
        
        if ap == 2:
            base_damage = int(base_damage * 0.5)  # Second attack does 50% damage
        
        actual_damage = min(target.health, base_damage)  # Ensure HP doesn't go negative
        target.health -= actual_damage

        if target.health <= 0:
            target.health = 0  # Prevents negative HP
        
        return actual_damage
    
    def use_ability(self):
        #######################
        # change to switch case
        # functies maken buiten de switch cases
        # functies aanroepen in de switch cases
        #######################

        if self.ability == "heal":
            heal_amount = random.randint(50, 75)
            self.health = min(self.max_health, self.health + heal_amount)
            return f"{self.name} heals for {heal_amount} HP!"
        elif self.ability == "block":
            self.block = random.randint(80, 100)
            self.health += self.block  # Temporarily increases HP
            return f"{self.name} gains {self.block} temporary HP!"
        elif self.ability == "damage_multiplier":
            self.temp_effects.append("damage_multiplier")
            return f"{self.name} gets a damage boost!"
        elif self.ability == "free_switch":
            return "free_switch"
        return "Invalid ability"
    
    def remove_block(self):
        if self.block > 0:
            self.health -= self.block  # Remove block HP
            self.block = 0
            if self.health < self.base_health:
                self.health = self.base_health  # Ensure it doesn't drop below base HP

    def __repr__(self):
        return f"{self.name} (HP: {self.health}/{self.max_health}, DMG: {self.damage})"

class Player:
    def __init__(self, name, cards):
        self.name = name
        self.active_card = cards.pop(0)
        self.benched_cards = cards
        self.ap = 1  # First turn = 1 AP, later turns = 2 AP

    def switch_card(self):
        if self.benched_cards:
            print("Available cards:")
            for i, card in enumerate(self.benched_cards):
                print(f"{i + 1}. {card.name} (HP: {card.health})")
            
            while True:
                choice = input("Choose a card to switch to (number): ").strip()
                if choice.isdigit():
                    choice = int(choice) - 1
                    if 0 <= choice < len(self.benched_cards):
                        self.active_card = self.benched_cards.pop(choice)
                        print(f"{self.name} switches to {self.active_card.name}!")
                        return
                print("Invalid choice. Try again.")
        else:
            print(f"{self.name} has no more cards left!")

    def check_and_swap_card(self):
        if self.active_card.health <= 0:
            print(f"{self.active_card.name} has fainted!")
            self.switch_card()

    def has_cards_left(self):
        return self.active_card.health > 0 or any(c.health > 0 for c in self.benched_cards)

# Game Setup
def setup_game():
    all_cards = [
        Card("Dragon Healer", random.randint(200, 201), random.randint(75, 76), "heal"),
        Card("Warrior", random.randint(250, 251), random.randint(50, 151), "damage_multiplier"),
        Card("Priest", random.randint(200, 201), random.randint(75, 76), "heal"),
        Card("Knight", random.randint(250, 251), random.randint(150, 151), "block"),
        Card("Berserker", random.randint(220, 221), random.randint(50, 151), "damage_multiplier"),
        Card("Paladin", random.randint(220, 221), random.randint(150, 151), "block")
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
    print(f"{first_turn.name} goes first!")

    turn_counter = 1
    
    while player1.has_cards_left() and player2.has_cards_left():
        user_input = input("Type 'exit' to stop the game, or press Enter to continue: ").strip().lower()
        if user_input == "exit":
            print("Game has been stopped by the user.")
            break
        
        current_player = players[(turn_counter - 1) % 2]
        opponent = players[turn_counter % 2]
        current_player.ap = 2 if turn_counter > 1 else 1  

        current_player.active_card.remove_block()

        print(f"\n{current_player.name}'s turn with {current_player.ap} AP!")
        
        while current_player.ap > 0:
            print(f"\n{current_player.name}'s active card: {current_player.active_card}")
            print(f"{opponent.name}'s active card: {opponent.active_card}")
            print("Choose an action:")
            print("1. Attack")
            print("2. Use Ability")
            print("3. Switch Card")
            action = input("Enter action number: ").strip()
            
            if action == "1":
                damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
                print(f"{current_player.active_card.name} attacks {opponent.active_card.name} for {damage} damage!")
                current_player.ap -= 1
            elif action == "2":
                ability_result = current_player.active_card.use_ability()
                print(ability_result)
                current_player.ap -= 1
            elif action == "3":
                current_player.switch_card()
                break
            else:
                print("Invalid choice, try again.")

        opponent.check_and_swap_card()
        turn_counter += 1

if __name__ == "__main__":
    play_game()
