<template>
    <div class="signup-container">
        <div class="spacer"></div>
        <div class="logo-placeholder">Logo Here</div>

        <label class="input-label">Gebruikersnaam</label>
        <input v-model="username" placeholder="Gebruikersnaam" class="input-field" />

        <label class="input-label">Wachtwoord</label>
        <input v-model="password" type="password" placeholder="Wachtwoord" class="input-field" />

        <div class="error-space" v-if="errorMessage">{{ errorMessage }}</div>

        <button @click="login" class="signup-button">Inloggen</button>

        <p class="signup-text">
            Heb je nog geen account? <span class="signup-link" @click="goToSignUp">Registreren</span>
        </p>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                username: '',
                password: '',
                errorMessage: '',
            };
        },
        methods: {
            async login() {
                this.errorMessage = '';
                try {
                    const response = await axios.post('http://localhost:3000/api/users/login', {
                        username: this.username,
                        password: this.password,
                    });
                    alert(response.data.message);
                } catch (error) {
                    this.errorMessage = error.response?.data?.error || 'An error occurred during login.';
                }
            },
            goToSignUp() {
                this.$router.push('/account');
            }
        }
    };
</script>

<style scoped>
    .signup-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90%;
        margin: auto;
    }

    .spacer {
        height: 4rem;
    }

    .logo-placeholder {
        width: 90%;
        max-height: 50vh;
        background-color: lightgray;
        text-align: center;
        padding: 11.1rem 1rem 10rem 1rem;
        margin-bottom: 2rem;
    }

    .input-label {
        align-self: flex-start;
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }

    .input-field {
        width: 100%;
        padding: 1rem;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        border: 0.1rem solid #ccc;
        border-radius: 0.6rem;
    }

    .error-space {
        height: 2rem;
        color: red;
        text-align: center;
    }

    .signup-button {
        width: 100%;
        padding: 1.5rem;
        background-color: red;
        color: white;
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        margin-top: 1rem;
        margin-bottom: 2rem;
    }

    .signup-text {
        margin-top: 1rem;
        color: black;
    }

    .signup-link {
        color: red;
        text-decoration: underline;
        cursor: pointer;
    }
</style>
