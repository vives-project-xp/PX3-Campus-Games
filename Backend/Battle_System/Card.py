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
        #if "damage_multiplier" in self.temp_effects:
            #base_damage = int(base_damage * 1.5)
        
        #if ap == 2:
            #base_damage = int(base_damage * 1.5)
        
        actual_damage = min(target.health, base_damage)
        target.health -= actual_damage

        if target.health <= 0:
            target.health = 0
        
        return actual_damage
    
    def use_ability(self, player):
        if self.ability == "heal":
            heal_amount = 75
            self.health = min(self.max_health, self.health + heal_amount)
            return f"{self.name} heals for {heal_amount} HP!"
        elif self.ability == "block":
            self.block = 80
            self.health += self.block
            return f"{self.name} gains {self.block} temporary HP!"
        #elif self.ability == "damage_multiplier":
            #self.temp_effects.append("damage_multiplier")
            #return f"{self.name} gets a damage boost!"
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