import random

##########################################
# classen in verschillende files plaatsen                                   //Done
# kijken voor python fastAPI Flask of websockets ipv overzetten naar JS?    //
##########################################

from Player import Player  # Import the Player class
from Card import Card      # Import the Card class

# Game Setup
def setup_game():
    # Temp Cards
    all_cards = [
        #       Name    HP   DMG    Ability
        Card("WarriorFS", 1600, 140, "free_switch"),
        Card("WarriorDM", 2200, 100, "damage_multiplier"),
        Card("KnightB", 2600, 80, "block"),
        Card("PriestFS", 1800, 120, "free_switch"),
        Card("BerserkerDM", 2700, 80, "damage_multiplier"),
        Card("PaladinB", 3000, 60, "block"),
        
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
