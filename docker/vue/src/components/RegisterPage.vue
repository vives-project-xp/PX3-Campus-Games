<template>
    <div class="signup-container">
        <div class="logo"><img src="/logo_campus_games.jpg" alt="Vives Campus Games logo" class="logo-image"></div>

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
            if (this.opleiding === 'non-student') {
                this.errorMessage = 'Gelieve een studiegebied te selecteren.';
                return;
            }
            try {
                const response = await axios.post(`${API_URL}/api/register`, {
                    username: this.username,
                    opleiding: this.opleiding,
                    password: this.password,
                });
                localStorage.setItem('username', this.username);
                localStorage.setItem('userId', response.data.userId);
                this.login();
                this.$router.push('/starter-pack');
            } catch (error) {
                console.error('Registration error:', error); // debugging
                this.errorMessage = error.response?.data?.error || 'Er is een error opgetreden tijdens het registreren.';
            }
        },
        
        async login() {
            this.errorMessage = '';
            try {
                console.log("Attempting login with:", this.username, this.password);  // Debugging

                const response = await axios.post(`${API_URL}/api/login`, {
                    username: this.username,
                    password: this.password,
                }, {
                    headers: {
                        'Content-Type': 'application/json' // Explicit Content-Type
                    }
                });

                console.log("Login response:", response.data); // Debugging

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
            } catch (error) {
                console.error('Login error:', error);
                this.errorMessage = error.response?.data?.error || 'Er is een error opgetreden tijdens het inloggen.';
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
    width: 95%;
    max-width: 500px;
    margin: auto;
    margin-top: 40px;
}

.logo {
    width: 100%;
    max-height: 50vh;
    text-align: center;
    margin-bottom: 2rem;
    margin-top: 40px;
    background-color: #fd0100; 
    border: none; 
    padding: 0; 
    box-sizing: border-box; 
    border-radius: 10px;
}

.logo-image {
    max-width: 100%;
    height: auto;
    display: block;
    margin: auto;
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
    box-sizing: border-box;
}

.error-space {
    height: 2rem;
    color: red;
    text-align: center;
}

.signup-button {
    width: 100%;
    padding: 1.2rem;
    background-color: red;
    font-size: 1.2rem;
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