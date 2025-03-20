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
    }
  
    attack(target, ap) {
      if (this.health <= 0) {
        console.log(`${this.name} is defeated and cannot attack!`);
        return 0;  // Dead cards can't attack
      }
  
      if (ap <= 0) {
        return 0;
      }
  
      let baseDamage = this.damage;
      const actualDamage = Math.min(target.health, baseDamage);
      target.health -= actualDamage;
  
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
  