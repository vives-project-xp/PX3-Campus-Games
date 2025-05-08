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
      <div v-if="showSwitchMenu" class="switch-menu">
       <h3>Kies een kaart om te wisselen:</h3>
        <ul>
          <li v-for="card in availableSwitchCards" :key="card.name">
            <button @click="selectCard(card)">
            {{ card.toString() }}
            </button>
          </li>
        </ul>
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
const showSwitchMenu = ref(false)
const isFreeSwitch = ref(false)
const availableSwitchCards = ref([])

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
    this.hasAttackedThisTurn = false
  }

  attack(target, ap) {
    if (this.health <= 0 || ap <= 0) return 0

    let baseDamage = this.damage
    if (this.hasAttackedThisTurn) {
      baseDamage = Math.floor(baseDamage * 0.5)
    }

    const actualDamage = Math.min(target.health, baseDamage)
    target.health -= actualDamage
    this.hasAttackedThisTurn = true

    if (target.health < 0) target.health = 0
    return actualDamage
  }

  useAbility(player) {
    switch (this.ability) {
      case 'heal':
        const healAmount = 75
        this.health = Math.min(this.maxHealth, this.health + healAmount)
        return `${this.name} heals for ${healAmount} HP!`
      case 'block':
        this.block = 80
        this.health += this.block
        return `${this.name} gains ${this.block} temporary HP!`
      case 'free_switch':
        player.switchCard(true)
        return `${player.name} switches cards for free!`
      case 'extra_action':
        player.ap += 2
        return `${player.name} gains 1 AP!`
      default:
        return 'Invalid ability'
    }
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
    if (!free) this.ap--
  }

  checkAndSwapCard() {
    if (this.activeCard.health <= 0) {
      this.switchCard()
    }
  }

  hasCardsLeft() {
    return this.activeCard.health > 0 || this.benchedCards.some(c => c.health > 0)
  }
}

const gameOver = ref(false)
const winner = ref('')
const log = ref([])

const player1 = reactive(new Player('Player 1', [
  new Card('WarriorFS', 160, 140, 'free_switch'),
  new Card('WarriorDM', 220, 100, 'damage_multiplier'),
  new Card('KnightB', 260, 80, 'block')
]))

const player2 = reactive(new Player('Player 2', [
  new Card('PriestFS', 180, 120, 'free_switch'),
  new Card('BerserkerDM', 270, 80, 'damage_multiplier'),
  new Card('PaladinB', 300, 60, 'block')
]))

const currentPlayer = ref(null)
const opponent = ref(null)
const turnCount = ref(1)
const attackCount = ref(0)

onMounted(() => {
  const first = Math.random() < 0.5 ? player1 : player2
  const second = first === player1 ? player2 : player1

  currentPlayer.value = first
  opponent.value = second

  log.value.push(`${currentPlayer.value.name} begint het spel!`)
  currentPlayer.value.ap = 1
  currentPlayer.value.activeCard.removeBlock()
})

function attack() {
  if (currentPlayer.value.ap <= 0) {
    log.value.push('Geen AP meer over!')
    return
  }

  const damage = currentPlayer.value.activeCard.attack(opponent.value.activeCard, currentPlayer.value.ap)
  log.value.push(`${currentPlayer.value.activeCard.name} valt aan voor ${damage} schade!`)

  currentPlayer.value.ap--
  attackCount.value++
  checkDefeated()
}

function useAbility() {
  if (currentPlayer.value.ap <= 0 && currentPlayer.value.activeCard.ability !== 'free_switch' && currentPlayer.value.activeCard.ability !== 'extra_action') {
    log.value.push('Niet genoeg AP!')
    return
  }

  const result = currentPlayer.value.activeCard.useAbility(currentPlayer.value)
  log.value.push(result)

  // Check for free_switch ability
  if (currentPlayer.value.activeCard.ability === 'free_switch') {
   showSwitchMenu.value = true
    isFreeSwitch.value = true
    availableSwitchCards.value = available

  } else if (!['free_switch', 'extra_action'].includes(currentPlayer.value.activeCard.ability)) {
    currentPlayer.value.ap--
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

  // Bij een gewone wissel, kaarten laten kiezen
  isFreeSwitch.value = false
  availableSwitchCards.value = available
  showSwitchMenu.value = true
}

function selectCard(card) {
  // Als free_switch actief is, wordt de kaart gewisseld zonder AP te kosten
  if (isFreeSwitch.value) {
    const bench = currentPlayer.value.benchedCards;
    bench.push(currentPlayer.value.activeCard);
    currentPlayer.value.activeCard = card;
    currentPlayer.value.benchedCards = bench.filter(c => c !== card);

    log.value.push(`${currentPlayer.value.name} wisselt naar ${card.name} zonder kosten!`);
    showSwitchMenu.value = false; // Laat het menu open voor een nieuwe kaartkeuze
    isFreeSwitch.value = false; // Zet free_switch terug naar false
  } else {
    // Als free_switch niet actief is, wordt de wissel met kosten uitgevoerd
    const bench = currentPlayer.value.benchedCards;
    bench.push(currentPlayer.value.activeCard);
    currentPlayer.value.activeCard = card;
    currentPlayer.value.benchedCards = bench.filter(c => c !== card);

    if (!isFreeSwitch.value) {
      currentPlayer.value.ap--; // Verminder AP bij gewone wissel
    }

    log.value.push(`${currentPlayer.value.name} wisselt naar ${card.name}!`);
    showSwitchMenu.value = false;
  }
}



function endTurn() {
  opponent.value.checkAndSwapCard()

  const temp = currentPlayer.value
  currentPlayer.value = opponent.value
  opponent.value = temp

  turnCount.value++
  currentPlayer.value.ap = turnCount.value === 1 ? 1 : 2

  currentPlayer.value.activeCard.removeBlock()
  attackCount.value = 0

  log.value.push(`${currentPlayer.value.name} is aan de beurt!`)
  checkGameOver()
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

.switch-menu {
  background: #eef;
  border: 2px solid #88f;
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
}

.switch-menu button {
  margin: 5px;
  padding: 10px;
  font-weight: bold;
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
