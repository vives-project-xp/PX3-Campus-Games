class Player:
    
    def __init__(self, name, cards):
        self.name = name
        self.active_card = cards.pop(0)
        self.benched_cards = cards
        self.ap = 1

    def switch_card(self, free=False):
        available_cards = [card for card in self.benched_cards if card.health > 0]

        if available_cards:
            print("Available cards:")
            for i, card in enumerate(available_cards):
                print(f"{i + 1}. {card.name} (HP: {card.health})")
            
            while True:
                choice = input("Choose a card to switch to (number): ").strip()
                if choice.isdigit():
                    choice = int(choice) - 1
                    if 0 <= choice < len(available_cards):
                        # Swap active card with selected benched card
                        selected_card = available_cards[choice]
                        self.benched_cards.remove(selected_card)
                        self.benched_cards.append(self.active_card)
                        self.active_card = selected_card

                        print(f"{self.name} switches to {self.active_card.name}!")
                        if not free:
                            self.ap -= 1
                        return
                print("Invalid choice. Try again.")
        else:
            print(f"{self.name} has no available cards left!")

    def check_and_swap_card(self):
        if self.active_card.health <= 0:
            print(f"{self.active_card.name} has fainted!")
            self.switch_card()

    def has_cards_left(self):
        return self.active_card.health > 0 or any(c.health > 0 for c in self.benched_cards)
