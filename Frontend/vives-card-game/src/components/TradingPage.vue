<template>
    <div class="trading-container">
        <h2>Trading Page</h2>

        <!-- QR Code Section -->
        <div v-if="!qrScanned" class="qr-section">
            <button @click="generateQRCode">Generate QR Code</button>
            <button @click="scanQRCode">Scan QR Code</button>
            <button @click="skipQR">Skip QR</button>
            <p v-if="qrGenerated">QR Code Generated! Waiting for scan...</p>
            <p v-if="qrScanned">QR Code Scanned! Proceed to trade.</p>
        </div>

        <!-- Trade Section -->
        <div v-if="qrScanned" class="trade-section">
            <div class="card-container">
                <h3>Your Card</h3>
                <div class="card-box" @click="selectYourCard">
                    <p v-if="!yourCard">Select a Card</p>
                    <PlayingCard v-if="yourCard" :cardName="yourCard.name" :cardImage="yourCard.image" />
                </div>
            </div>

            <div class="trade-icon">🔄</div>

            <div class="card-container">
                <h3>Friend's Card</h3>
                <div class="card-box" @click="assignFriendCard">
                    <p v-if="!friendCard">Assign a Card</p>
                    <PlayingCard v-if="friendCard" :cardName="friendCard.name" :cardImage="friendCard.image" />
                </div>
            </div>
        </div>

        <!-- Ready to Trade Buttons -->
        <div v-if="qrScanned && yourCard && friendCard" class="trade-status">
            <button :class="{ ready: userReady }" @click="setUserReady">
                {{ userReady ? "✅ Ready to Trade" : "❌ Not Ready to Trade" }}
            </button>
            <button :class="{ ready: friendReady }" disabled>
                {{ friendReady ? "✅ Friend Ready" : "❌ Friend Not Ready" }}
            </button>
        </div>

        <!-- Trading Animation -->
        <div v-if="tradeInProgress" class="trade-animation">
            <div class="trade-animation-box">
                <div class="trade-card"
                     :class="{ animate: tradeInProgress }"
                     :style="{ transform: tradeInProgress ? 'translateX(120px) translateY(-1rem)' : 'translateX(0)' }">
                    <img :src="yourCard.image" />
                </div>
                <div class="trade-card"
                     :class="{ animate: tradeInProgress }"
                     :style="{ transform: tradeInProgress ? 'translateX(-120px) translateY(-1rem)' : 'translateX(0)' }">
                    <img :src="friendCard.image" />
                </div>
            </div>
        </div>

        <!-- New Card Display -->
        <div v-if="newCardDisplay" class="overlay">
            <div class="overlay-content">
                <h3>You received:</h3>
                <PlayingCard :cardName="friendCard.name" :cardImage="friendCard.image" />
                <button @click="closeNewCard">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from "vue";
    import PlayingCard from "./PlayingCard.vue";

    export default {
        components: { PlayingCard },
        setup() {
            const cards = ref(require("../assets/cards.json")); // Load cards
            const qrGenerated = ref(false);
            const qrScanned = ref(false);
            const yourCard = ref(null);
            const friendCard = ref(null);
            const userReady = ref(false);
            const friendReady = ref(false);
            const tradeInProgress = ref(false);
            const newCardDisplay = ref(false);

            const generateQRCode = () => {
                qrGenerated.value = true;
            };

            const scanQRCode = () => {
                if (qrGenerated.value) {
                    qrScanned.value = true;
                } else {
                    alert("Generate QR code first!");
                }
            };

            const skipQR = () => {
                qrScanned.value = true;
            };

            // Selects a random card from user's collection
            const selectYourCard = () => {
                if (cards.value.length > 0) {
                    yourCard.value = cards.value[Math.floor(Math.random() * cards.value.length)];
                }
            };

            // Assigns a random card to the friend
            const assignFriendCard = () => {
                if (cards.value.length > 0) {
                    friendCard.value = cards.value[Math.floor(Math.random() * cards.value.length)];
                }
            };

            const setUserReady = () => {
                userReady.value = true;

                // Simulate friend clicking ready after 4 seconds
                setTimeout(() => {
                    friendReady.value = true;
                    startTrade();
                }, 4000);
            };

            const startTrade = () => {
                if (userReady.value && friendReady.value) {
                    tradeInProgress.value = true;
                    setTimeout(() => {
                        tradeInProgress.value = false;
                        setTimeout(() => {
                            newCardDisplay.value = true;
                        }, 500);
                    }, 2000);
                }
            };

            const closeNewCard = () => {
                newCardDisplay.value = false;
                resetTrade();
            };

            const resetTrade = () => {
                qrGenerated.value = false;
                qrScanned.value = false;
                yourCard.value = null;
                friendCard.value = null;
                userReady.value = false;
                friendReady.value = false;
                tradeInProgress.value = false;
                newCardDisplay.value = false;
            };

            return {
                cards,
                qrGenerated,
                qrScanned,
                yourCard,
                friendCard,
                userReady,
                friendReady,
                tradeInProgress,
                newCardDisplay,
                generateQRCode,
                scanQRCode,
                skipQR,
                selectYourCard,
                assignFriendCard,
                setUserReady,
                startTrade,
                closeNewCard,
                resetTrade,
            };
        },
    };
</script>

<style scoped>
    .trading-container {
        text-align: center;
        padding: 20px;
    }

    .qr-section,
    .trade-section,
    .trade-status {
        margin: 20px 0;
    }

    .card-container {
        display: inline-block;
        margin: 10px;
        text-align: center;
    }

    .card-box {
        width: 150px;
        height: 200px;
        border: 2px dashed gray;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-top: 10px;
    }

    .trade-icon {
        font-size: 40px;
        display: inline-block;
        margin: 0 20px;
    }

    .trade-status {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

        .trade-status button {
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            background-color: #ccc;
            cursor: pointer;
        }

            .trade-status button.ready {
                background-color: #4caf50;
                color: white;
            }

    /* Trade Animation */
    .trade-animation {
        text-align: center;
        margin-top: 20px;
    }

    .trade-animation-box {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 80px;
        position: relative;
        height: 150px;
    }

    .trade-card {
        width: 100px;
        transition: transform 1s ease-in-out, box-shadow 1s ease-in-out;
    }

    /* Overlay */
    .overlay {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    }

    .overlay-content {
        text-align: center;
    }
</style>
