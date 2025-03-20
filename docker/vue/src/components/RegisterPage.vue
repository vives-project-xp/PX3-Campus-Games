<template>
    <div class="signup-container">
        <div class="logo"><img src="/logo_campus_games.jpg" alt="Vives Campus Games logo"></div>

        <label class="input-label">Gebruikersnaam</label>
        <input v-model="username" placeholder="Gebruikersnaam" class="input-field" />

        <label class="input-label">Studiegebied</label>
        <select v-model="opleiding" class="input-field">
            <option value="non-student">Geen student van Hogeschool Vives</option>
            <option value="technology&bio">Technology & Bio</option>
            <option value="gezondheidszorg">Gezondheidszorg</option>
            <option value="handel&business">Marketing & Business</option>
            <option value="onderwijs&sociaal">Onderwijs & Sociaal</option>
        </select>

        <label class="input-label">Wachtwoord</label>
        <input v-model="password" type="password" placeholder="Wachtwoord" class="input-field" />

        <label class="input-label">Wachtwoord herhalen</label>
        <input v-model="confirmPassword" type="password" placeholder="Wachtwoord herhalen" class="input-field" />

        <div class="error-space" v-if="errorMessage">{{ errorMessage }}</div>

        <button @click="register" class="signup-button">Registreren</button>

        <p class="login-text">
            Heb je al een account? <span class="login-link" @click="goToLogin">Log in</span>
        </p>
    </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '../config';

export default {
    data() {
        return {
            username: '',
            opleiding: 'non-student',
            password: '',
            confirmPassword: '',
            errorMessage: '',
        };
    },
    methods: {
        async register() {
            this.errorMessage = '';
            if (this.password !== this.confirmPassword) {
                this.errorMessage = 'Wachtwoorden komen niet overeen!';
                return;
            }
            try {
                const response = await axios.post(`${API_URL}/api/register`, {
                    username: this.username,
                    opleiding: this.opleiding,
                    password: this.password,
                });
                alert(response.data.message);
                localStorage.setItem('username', this.username);
                localStorage.setItem('userId', response.data.userId);
                this.$router.push('/starter-pack');
            } catch (error) {
                console.error('Registration error:', error); // debugging
                this.errorMessage = error.response?.data?.error || 'An error occurred during registration.';
            }
        },
        goToLogin() {
            this.$router.push('/login');
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
        margin-top: 40px;
    }

    .logo {
        width: 100%;
        text-align: center;
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

    .login-text {
        margin-top: 1rem;
        color: black;
        text-align: center;
    }

    .login-link {
        color: red;
        text-decoration: underline;
        cursor: pointer;
    }
</style>