<template>
  <div class="game-container">
    <h1>Trading Card Battle</h1>
    <div v-if="!gameOver">
      <div class="players">
        <div class="player">
          <h2>{{ player1.name }}</h2>
          <p><strong>Active:</strong> {{ player1.activeCard.toString() }}</p>
          <ul>
            <li v-for="card in player1.benchedCards" :key="card.name">Bench: {{ card.toString() }}</li>
          </ul>
        </div>

        <div class="player">
          <h2>{{ player2.name }}</h2>
          <p><strong>Active:</strong> {{ player2.activeCard.toString() }}</p>
          <ul>
            <li v-for="card in player2.benchedCards" :key="card.name">Bench: {{ card.toString() }}</li>
          </ul>
        </div>
      </div>

      <div class="actions">
        <p><strong>Actieve speler:</strong> {{ currentPlayer.name }} (AP: {{ currentPlayer.ap }})</p>
        <button @click="attack">Aanvallen</button>
        <button @click="useAbility">Gebruik Ability</button>
        <button @click="switchCard">Wissel Kaart</button>
        <button @click="endTurn">Beurt Eindigen</button>
      </div>

      <div class="log">
        <h3>Battle Log</h3>
        <ul>
          <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
        </ul>
      </div>
    </div>

    <div v-else>
      <h2>Game Over</h2>
      <p>Winnaar: {{ winner }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// === Card Klasse ===
class Card {
  constructor(name, health, damage, ability) {
    this.name = name
    this.maxHealth = health
    this.baseHealth = health
    this.health = health
    this.damage = damage
    this.ability = ability
    this.block = 0
    this.tempEffects = []
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
    if (this.ability === 'heal') {
      const healAmount = 75
      this.health = Math.min(this.maxHealth, this.health + healAmount)
      return `${this.name} heals for ${healAmount} HP!`
    } else if (this.ability === 'block') {
      this.block = 80
      this.health += this.block
      return `${this.name} gains ${this.block} temporary HP!`
    } else if (this.ability === 'free_switch') {
      player.switchCard(true)
      return `${player.name} switches cards for free!`
    } else if (this.ability === "extra_action") {
          player.ap += 2; // Grants +2 AP (net +1 after cost)
          return `${player.name} gains 1 AP!`;
    }
    return 'Invalid ability'
  }

  removeBlock() {
    if (this.block > 0) {
      this.health -= this.block
      this.block = 0
      if (this.health < this.baseHealth) {
        this.health = this.baseHealth
      }
    }
  }

  toString() {
    return `${this.name} (HP: ${this.health}/${this.maxHealth}, DMG: ${this.damage})`
  }
}

// === Player Klasse ===
class Player {
  constructor(name, cards) {
    this.name = name
    this.activeCard = cards.shift()
    this.benchedCards = cards
    this.ap = 1
  }

  switchCard(free = false) {
    const availableCards = this.benchedCards.filter(c => c.health > 0)
    if (availableCards.length === 0) return

    const selectedCard = availableCards[0]
    this.benchedCards = this.benchedCards.filter(c => c !== selectedCard)
    this.benchedCards.push(this.activeCard)
    this.activeCard = selectedCard
    if (!free) this.ap--  // Verlaag AP na een wissel
  }

  checkAndSwapCard() {
    if (this.activeCard.health <= 0) {
      this.switchCard()
    }
  }

  hasCardsLeft() {
    return this.activeCard.health > 0 || this.benchedCards.some(card => card.health > 0)
  }
}

const gameOver = ref(false)
const winner = ref('')
const log = ref([])

const player1 = reactive(new Player('Player 1', [
  new Card('WarriorFS', 160, 140, 'free_switch'),
  new Card('WarriorDM', 220, 100, 'extra_action'),
  new Card('KnightB', 260, 80, 'block')
]))

const player2 = reactive(new Player('Player 2', [
  new Card('PriestFS', 180, 120, 'free_switch'),
  new Card('BerserkerDM', 270, 80, 'extra_action'),
  new Card('PaladinB', 300, 60, 'block')
]))

const currentPlayer = ref(null)
const opponent = ref(null)
const turnCount = ref(1)
const attackCount = ref(0)

// Gebruik `onMounted` om het spel te initialiseren en de eerste speler te bepalen
onMounted(() => {
  const firstPlayer = Math.random() < 0.5 ? player1 : player2
  const secondPlayer = firstPlayer === player1 ? player2 : player1

  currentPlayer.value = firstPlayer
  opponent.value = secondPlayer

  log.value.push(`${currentPlayer.value.name} begint het spel!`)
  currentPlayer.value.ap = 1 // Eerste speler krijgt 1 AP
  currentPlayer.value.activeCard.removeBlock()
  
})

function attack() {
  if (currentPlayer.value.ap <= 0) {
    log.value.push('Geen AP meer over!')
    return
  }

  const isSecond = attackCount.value >= 1
  const damage = currentPlayer.value.activeCard.attack(opponent.value.activeCard, currentPlayer.value.ap)
  log.value.push(`${currentPlayer.value.activeCard.name} valt aan voor ${damage} schade!`)

  currentPlayer.value.ap--  // Verlaag AP na de aanval
  attackCount.value++
  checkDefeated()
}

function useAbility() {
  if (currentPlayer.value.ap <= 0 && (currentPlayer.value.activeCard.ability !== 'free_switch' || "extra_action")) {
    log.value.push('Niet genoeg AP!')
    return
  }

  const result = currentPlayer.value.activeCard.useAbility(currentPlayer.value)
  log.value.push(result)

  if (currentPlayer.value.activeCard.ability !== 'free_switch'|| currentPlayer.activeCard.ability !== "extra_action") {
    currentPlayer.value.ap--  // Verlaag AP na het gebruiken van een ability
  }
  checkDefeated()
}

function switchCard() {
  if (currentPlayer.value.ap <= 0 && currentPlayer.value.activeCard.ability !== 'free_switch') {
    log.value.push('Niet genoeg AP!')
    return
  }

  const available = currentPlayer.value.benchedCards.filter(c => c.health > 0)
  if (available.length === 0) {
    log.value.push('Geen kaarten op de bank!')
    return
  }

  const selectedCard = available[0]
  currentPlayer.value.benchedCards.push(currentPlayer.value.activeCard)
  currentPlayer.value.benchedCards = currentPlayer.value.benchedCards.filter(c => c !== selectedCard)
  currentPlayer.value.activeCard = selectedCard

  log.value.push(`${currentPlayer.value.name} wisselt naar ${selectedCard.name}!`)
  if (currentPlayer.value.activeCard.ability !== 'free_switch') {
    currentPlayer.value.ap--  // Verlaag AP na het wisselen van kaart
  }
}

function endTurn() {
  // Zet de beurt om en verhoog de AP voor de nieuwe beurt
  opponent.value.checkAndSwapCard()

  // Wissel de actieve speler
  const temp = currentPlayer.value
  currentPlayer.value = opponent.value
  opponent.value = temp

  // Verhoog de beurt
  turnCount.value++

  // Zorg ervoor dat speler 1 de eerste beurt met 1 AP begint, daarna krijgt elke speler 2 AP
  if (turnCount.value === 1) {
    currentPlayer.value.ap = 1  // Ronde 1: speler krijgt 1 AP
  } else {
    currentPlayer.value.ap = 2  // Na ronde 1: speler krijgt 2 AP
  }

  currentPlayer.value.activeCard.removeBlock()
  attackCount.value = 0

  // Nu pas de log bij
  log.value.push(`${currentPlayer.value.name} is aan de beurt!`)
  checkGameOver()  // Controleer of het spel is afgelopen
}

function checkDefeated() {
  if (opponent.value.activeCard.health <= 0) {
    log.value.push(`${opponent.value.activeCard.name} is verslagen!`)
    opponent.value.checkAndSwapCard()
  }
}

function checkGameOver() {
  if (!player1.hasCardsLeft()) {
    gameOver.value = true
    winner.value = player2.name
  } else if (!player2.hasCardsLeft()) {
    gameOver.value = true
    winner.value = player1.name
  }
}
</script>

<style scoped>
.game-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.players {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.player {
  width: 45%;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.actions button {
  margin: 5px;
  padding: 10px;
  font-size: 16px;
}

.log {
  margin-top: 20px;
  max-height: 200px;
  overflow-y: scroll;
}

.log ul {
  padding-left: 0;
}

.log li {
  list-style: none;
  padding: 5px 0;
}
</style>
