import random
import time

class Card:
    def __init__(self, name, health, attack_damage):
        self.name = name
        self.max_health = health
        self.health = health
        self.attack_damage = attack_damage

    def attack(self, opponent):
        damage = random.randint(self.attack_damage - 10, self.attack_damage + 10)
        opponent.health -= damage
        if opponent.health < 0:
            opponent.health = 0
        return damage

    def is_defeated(self):
        return self.health <= 0

    def display(self):
        return f"{self.name} [❤️ {self.health}/{self.max_health}]"

class Player:
    def __init__(self, name, cards):
        self.name = name
        self.cards = cards  # Lijst van 3 kaarten
        self.active_card = self.get_first_alive_card()  # Eerste levende kaart

    def get_first_alive_card(self):
        """Zoekt de eerste levende kaart en stelt deze in als actief."""
        for card in self.cards:
            if not card.is_defeated():
                return card
        return None  # Alle kaarten zijn verslagen

    def switch_card(self):
        """Wisselt naar een andere kaart, maar forceert de laatste kaart als nodig."""
        available_cards = [card for card in self.cards if not card.is_defeated()]
        if len(available_cards) == 1:
            self.active_card = available_cards[0]  # Forceer de enige levende kaart
            print(f"⚠ {self.name} heeft nog maar 1 kaart en gebruikt {self.active_card.name}!")
        elif len(available_cards) > 1:
            for idx, card in enumerate(available_cards):
                print(f"{idx + 1}. {card.display()}")
            choice = int(input("Kies een andere kaart: ")) - 1
            self.active_card = available_cards[choice]
            print(f"🔄 {self.name} wisselt naar {self.active_card.name}!")
        else:
            print(f"💀 {self.name} heeft geen levende kaarten meer!")

    def is_defeated(self):
        return all(card.is_defeated() for card in self.cards)

def battle(player1, player2):
    print("🔥 BATTLE START! 🔥")
    print(f"{player1.name} VS {player2.name}\n")
    
    time.sleep(1)  # Korte pauze voor effect

    turn = 0
    while not player1.is_defeated() and not player2.is_defeated():
        attacker = player1 if turn % 2 == 0 else player2
        defender = player2 if turn % 2 == 0 else player1

        if attacker.is_defeated():
            print(f"💀 {attacker.name} heeft geen kaarten meer!")
            break

        print(f"\n🎮 {attacker.name}'s beurt!")
        print(f"🃏 Actieve kaart: {attacker.active_card.display()}")

        action = input("Kies een actie (attack / switch / exit): ").lower()

        if action == "exit":
            print("🛑 Spel gestopt!")
            return

        if action == "attack":
            damage = attacker.active_card.attack(defender.active_card)
            print(f"💥 {attacker.active_card.name} valt aan en doet {damage} schade!")
            print(f"🛡 {defender.active_card.display()}")

            if defender.active_card.is_defeated():
                print(f"💀 {defender.active_card.name} is verslagen!")
                defender.switch_card()

        elif action == "switch":
            attacker.switch_card()

        time.sleep(1)
        turn += 1

    winner = player1 if not player1.is_defeated() else player2
    print(f"\n🏆 {winner.name} wint de battle!")

# 🔹 TEST GEGEVENS
player1 = Player("Speler 1", [
    Card("Dragon", 250, 70),
    Card("Phoenix", 200, 80),
    Card("Wolf", 180, 60)
])

player2 = Player("Speler 2", [
    Card("Kraken", 260, 75),
    Card("Golem", 220, 85),
    Card("Griffin", 190, 65)
])

battle(player1, player2)
