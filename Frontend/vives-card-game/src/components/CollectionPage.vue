<template>
    <div class="card-collection">
        <h2 v-if="isCollectionRoute">Your Cards:</h2>

        <!-- Container Box -->
        <div class="container-box">
            <!-- Upper Part: Filter Buttons -->
            <div class="filter-box">
                <button :class="{ active: selectedRarity === 'rare' }" @click="filterCards('rare')">Rare</button>
                <button :class="{ active: selectedRarity === 'ultraRare' }" @click="filterCards('ultraRare')">Ultra Rare</button>
                <button :class="{ active: selectedRarity === 'legendary' }" @click="filterCards('legendary')">Legendary</button>
                <button :class="{ active: selectedRarity === 'uncommon' }" @click="filterCards('uncommon')">Uncommon</button>
                <button :class="{ active: selectedRarity === 'common' }" @click="filterCards('common')">Common</button>
            </div>

            <!-- Lower Part: Total Cards and Search Input -->
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

            <!-- Card Grid -->
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
            const cards = ref(require('../assets/cards.json')); // Direct import
            const selectedCards = ref([]);
            const selectedRarity = ref(null); // To store the selected rarity
            const searchQuery = ref(''); // To store the search input

            const isCollectionRoute = computed(() => {
                return route.path === '/collection';
            });

            const filterCards = (rarity) => {
                if (selectedRarity.value === rarity) {
                    selectedRarity.value = null; // Remove filter if the same button is clicked
                } else {
                    selectedRarity.value = rarity; // Set the selected rarity
                }
            };

            const clearSearch = () => {
                searchQuery.value = ''; // Clear the search input
            };

            const filteredCards = computed(() => {
                let filtered = cards.value;

                // Filter by rarity if selected
                if (selectedRarity.value) {
                    filtered = filtered.filter(card => card.rarity === selectedRarity.value);
                }

                // Filter by search query
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

            return { isCollectionRoute, filteredCards, selectedCards, filterCards, searchQuery, clearSearch, toggleCardSelection };
        },
    };
</script>

<style scoped>
    .card-collection {
        padding: 1rem;
        width: 100%;
    }

    .container-box {
        max-width: 1200px; /* Maximum width for larger screens */
        width: 80%; /* 80% width on mobile devices */
        margin: 0 auto; /* Center the box */
        padding: 1rem;
        border: 1px solid #ccc; /* Optional: Add a border */
        border-radius: 8px; /* Optional: Rounded corners */
        background-color: #f9f9f9; /* Optional: Light background color */
    }

    .filter-box {
        display: flex;
        justify-content: space-around;
        margin-bottom: 1rem;
    }

        .filter-box button {
            padding: 0.5rem 1rem;
            cursor: pointer;
            border: none; /* Remove default border */
            border-radius: 5px; /* Rounded corners for buttons */
            background-color: #007bff; /* Default button color */
            color: white; /* Text color */
            transition: background-color 0.3s; /* Smooth transition */
        }

            .filter-box button.active {
                background-color: red; /* Active button color */
            }

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
        width: 20px; /* Adjust icon size */
        height: 20px; /* Adjust icon size */
        margin-right: 0.5rem;
    }

    .search-input {
        display: flex;
        align-items: center;
    }

        .search-input input {
            padding: 0.5rem;
            border: 1px solid #ccc; /* Border for the input */
            border-radius: 5px; /* Rounded corners for input */
            margin-right: 0.5rem; /* Space between input and button */
        }

        .search-input button {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            border: none; /* Remove default border */
            border-radius: 5px; /* Rounded corners for button */
            background-color: #dc3545; /* Clear button color */
            color: white; /* Text color */
        }

    .card-grid {
        display: grid; /* Grid layout for cards */
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Responsive columns */
        gap: 1rem; /* Spacing between cards */
        justify-items: center; /* Center cards horizontally */
    }

    @media (max-width: 600px) {
        .filter-box {
            flex-direction: column; /* Stack buttons vertically on small screens */
            align-items: center; /* Center buttons */
        }

        .search-box {
            flex-direction: column; /* Stack search box elements vertically */
            align-items: flex-start; /* Align items to the start */
        }

        .search-input {
            width: 100%; /* Full width for search input */
        }
    }
</style>


