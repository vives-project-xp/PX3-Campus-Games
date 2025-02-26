<template>
    <div class="card-collection">
        <h2 v-if="isCollectionRoute">Your Cards:</h2>

        <!-- Fixed Top Section -->
        <div class="fixed-container">
            <!-- Filter Buttons -->
            <div class="filter-box">
                <div class="filter-row">
                    <button :class="{ active: selectedRarities.includes('rare') }" @click="toggleFilter('rare')">Rare</button>
                    <button :class="{ active: selectedRarities.includes('uncommon') }" @click="toggleFilter('uncommon')">Uncommon</button>
                    <button :class="{ active: selectedRarities.includes('common') }" @click="toggleFilter('common')">Common</button>
                </div>
                <div class="filter-row">
                    <button :class="{ active: selectedRarities.includes('ultraRare') }" @click="toggleFilter('ultraRare')">Ultra Rare</button>
                    <button :class="{ active: selectedRarities.includes('legendary') }" @click="toggleFilter('legendary')">Legendary</button>
                </div>
            </div>

            <!-- Search and Total Cards -->
            <div class="search-box">
                <div class="total-cards">
                    <img src="path/to/icon.png" alt="Total Cards Icon" class="icon" />
                    <span>Total Cards: {{ filteredCards.length }}</span>
                </div>
                <div class="search-input">
                    <input type="text" v-model="searchQuery" placeholder="Search cards..." />
                    <button @click="clearSearch">x</button>
                </div>
            </div>
        </div>

        <!-- Scrollable Card Grid -->
        <div class="card-container">
            <div class="card-grid" v-if="filteredCards.length > 0">
                <PlayingCard v-for="card in filteredCards"
                             :key="card.id + card.image"
                             :cardName="card.name"
                             :cardImage="card.image"
                             :isSelected="selectedCards.includes(card.id)"
                             @click="toggleCardSelection(card.id)" />
            </div>
            <div v-else>No cards found.</div>
        </div>
    </div>
</template>

<script>
    import PlayingCard from './PlayingCard.vue';
    import { useRoute } from 'vue-router';
    import { computed, ref } from 'vue';

    export default {
        name: 'collection-page',
        components: {
            PlayingCard,
        },
        setup() {
            const route = useRoute();
            const cards = ref(require('../assets/cards.json'));
            const selectedCards = ref([]);
            const selectedRarities = ref([]);
            const searchQuery = ref('');

            const isCollectionRoute = computed(() => route.path === '/collection');

            const toggleFilter = (rarity) => {
                if (selectedRarities.value.includes(rarity)) {
                    selectedRarities.value = selectedRarities.value.filter(r => r !== rarity);
                } else {
                    selectedRarities.value.push(rarity);
                }
            };

            const clearSearch = () => {
                searchQuery.value = '';
            };

            const filteredCards = computed(() => {
                let filtered = cards.value;
                if (selectedRarities.value.length > 0) {
                    filtered = filtered.filter(card => selectedRarities.value.includes(card.rarity));
                }
                if (searchQuery.value) {
                    filtered = filtered.filter(card => card.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
                }
                return filtered;
            });

            const toggleCardSelection = (cardId) => {
                const index = selectedCards.value.indexOf(cardId);
                if (index > -1) {
                    selectedCards.value.splice(index, 1);
                } else {
                    selectedCards.value.push(cardId);
                }
            };

            return { isCollectionRoute, filteredCards, selectedCards, toggleFilter, selectedRarities, searchQuery, clearSearch, toggleCardSelection };
        },
    };
</script>

<style scoped>
    .card-collection {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .container-box {
        max-width: 1200px;
        width: 95%;
        margin: 0 auto;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    /* Filter Buttons */
    .filter-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start; /* Align buttons to the left */
        gap: 0.5rem;
        margin-bottom: 1rem;
        max-width: 300px; /* Prevents buttons from spreading too far */
    }

    .filter-row {
        display: flex;
        gap: 0.5rem;
    }

        .filter-row button {
            padding: 0.5rem 0.5rem;
            margin: 0.5rem;
            cursor: pointer;
            border: none;
            border-radius: 5px;
            background-color: white;
            color: rgb(32, 32, 32);
            transition: background-color 0.3s, color 0.3s;
            font-size: 1rem;
        }

            .filter-row button.active {
                background-color: red;
                color: white;
            }

    /* Mobile Layout: 3 buttons on top, 2 below */
    @media (max-width: 600px) {
        .filter-box {
            display: grid;
            grid-template-columns: repeat(3, 1fr); /* 3 buttons in first row */
            max-width: 250px;
        }

        .filter-row:nth-child(2) {
            grid-column: span 3; /* Ultra Rare & Legendary below */
            justify-content: center;
        }
    }

    /* Larger screens: All buttons next to each other on the left */
    @media (min-width: 600px) {
        .filter-box {
            flex-direction: row;
            flex-wrap: nowrap;
        }
    }

    /* Search Box */
    .search-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .total-cards {
        display: flex;
        align-items: center;
    }

    .icon {
        width: 20px;
        height: 20px;
        margin-right: 0.5rem;
    }

    .search-input {
        display: flex;
        align-items: center;
    }

        .search-input input {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 0.5rem;
        }

        .search-input button {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            border: none;
            border-radius: 5px;
            background-color: #dc3545;
            color: white;
        }

    /* Card Container */
    .card-container {
        overflow-y: auto;
        max-height: 70vh;
        width: 100%;
    }

    /* Smaller Cards */
    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 0.4rem;
        justify-items: center;
    }

    .playing-card {
        width: 90px;
        height: 130px;
        padding: 0.5rem;
        border-radius: 5px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    }

        .playing-card img {
            width: 100%;
            height: auto;
        }

    /* Even Smaller Cards on Mobile */
    @media (max-width: 600px) {
        .card-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        }

        .playing-card {
            width: 75px;
            height: 110px;
        }
    }

</style>
