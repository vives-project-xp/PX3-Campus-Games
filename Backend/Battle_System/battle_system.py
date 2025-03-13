import random

##########################################
# classen in verschillende files plaatsen                                   //Done
# kijken voor python fastAPI Flask of websockets ipv overzetten naar JS?    //
##########################################

class Card:
    def __init__(self, name, health, damage, ability):
        self.name = name
        self.max_health = health
        self.base_health = health
        self.health = health
        self.damage = damage
        self.ability = ability
        self.block = 0
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
            base_damage = int(base_damage * 0.5)
        
        actual_damage = min(target.health, base_damage)
        target.health -= actual_damage

        if target.health <= 0:
            target.health = 0
        
        return actual_damage
    
    def use_ability(self):
        if self.ability == "heal":
            heal_amount = 75
            self.health = min(self.max_health, self.health + heal_amount)
            return f"{self.name} heals for {heal_amount} HP!"
        elif self.ability == "block":
            self.block = 80
            self.health += self.block
            return f"{self.name} gains {self.block} temporary HP!"
        elif self.ability == "damage_multiplier":
            self.temp_effects.append("damage_multiplier")
            return f"{self.name} gets a damage boost!"
        elif self.ability == "free_switch":
            player.switch_card(free=True)
            return f"{player.name} switches cards for free!"
        return "Invalid ability"
    
    def remove_block(self):
        if self.block > 0:
            self.health -= self.block
            self.block = 0
            if self.health < self.base_health:
                self.health = self.base_health

    def __repr__(self):
        return f"{self.name} (HP: {self.health}/{self.max_health}, DMG: {self.damage})"

class Player:
    def __init__(self, name, cards):
        self.name = name
        self.active_card = cards.pop(0)
        self.benched_cards = cards
        self.ap = 1

    def switch_card(self, free=False):
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
                        if not free:
                            self.ap -= 1
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
from Player import Player  # Import the Player class
from Card import Card      # Import the Card class

# Game Setup
def setup_game():
    # Temp Cards
    all_cards = [
        #       Name    HP   DMG    Ability
        Card("WarriorFS", 160, 140, "free_switch"),
        Card("WarriorDM", 220, 100, "damage_multiplier"),
        Card("KnightB", 260, 80, "block"),
        Card("PriestFS", 180, 120, "free_switch"),
        Card("BerserkerDM", 270, 80, "damage_multiplier"),
        Card("PaladinB", 300, 60, "block"),
        
        Card("PriestH", 220, 100, "heal"),
        Card("HealerH", 300, 80, "heal"),
        Card("HealerH", 250, 80, "heal"),
        Card("KnightB", 220, 100, "block"),
        Card("BerserkerDM", 200, 120, "damage_multiplier"),
        Card("PaladinFS", 200, 100, "free_switch"),
    ]
    
    
    player1 = Player("Player 1", all_cards[:3])
    player2 = Player("Player 2", all_cards[3:6])
    
    return player1, player2

# Game Loop
def play_game():
    player1, player2 = setup_game()
    players = [player1, player2]
    
    # Coin flip
    first_turn = random.choice(players)
    print(f"{first_turn.name} goes first!")

    turn_counter = 1
    
    while player1.has_cards_left() and player2.has_cards_left():
        user_input = input("Type 'exit' to stop the game, or press Enter to continue: ").strip().lower()
        if user_input == "exit":
            print("Game has been stopped by the user.") # Force end game
            break
        
        current_player = players[(turn_counter - 1) % 2]
        opponent = players[turn_counter % 2]
        
        current_player.ap = 1 if turn_counter == 1 else 2  

        current_player.active_card.remove_block()

        print(f"\n{current_player.name}'s turn with {current_player.ap} AP!") # Active turn
        
        # Active turn stats
        while current_player.ap >= 0:
            print(f"\n{current_player.name}'s active card: {current_player.active_card} {current_player.active_card.ability}")
            print(f"{opponent.name}'s active card: {opponent.active_card} {opponent.active_card.ability}")
            print("Choose an action:")
            print(f"1. Attack: {current_player.active_card.damage} DMG")
            print(f"2. Use Ability: {current_player.active_card.ability}")
            print("3. Switch Card")
            print("4. End Turn")
            
            action = input("Enter action number: ").strip()
            
            if action == "1": # Attack
                if current_player.ap > 0:
                    damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
                    print(f"{current_player.active_card.name} attacks {opponent.active_card.name} for {damage} damage!")
                    current_player.ap -= 1
                else:
                    print("Not enough AP!")
            
            elif action == "2": # Ability
                if current_player.ap > 0 or current_player.active_card.ability == "free_switch":
                    ability_result = current_player.active_card.use_ability(current_player)
                    print(ability_result)
                    if "free" not in ability_result:
                        current_player.ap -= 1
                else:
                    print("Not enough AP!")
            
            elif action == "3": # Switch
                if current_player.ap > 0 or current_player.active_card.ability == "free_switch":
                    current_player.switch_card()
                    if current_player.active_card.ability != "free_switch":
                        current_player.ap -= 1
                else:
                    print("Not enough AP!")
            
            elif action == "4": # End Turn
                print(f"{current_player.name} ends their turn.")
                break  # Ends turn
            elif action == "999": # InstKill for testing only
                if current_player.ap > 0:
                    damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
                    damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
                    damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
                    damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
                    damage = current_player.active_card.attack(opponent.active_card, current_player.ap)
                    
                    break
            
            else: # Invalid Input
                print("Invalid choice, try again.")
        
        opponent.check_and_swap_card()
        turn_counter += 1

if __name__ == "__main__":
    play_game()
