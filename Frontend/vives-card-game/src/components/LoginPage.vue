<template>
    <div class="login-container">
        <div class="logo"><img src="/logo_campus_games.jpg" alt="Vives Campus Games logo" class="logo-image"></div>
        
        <label class="input-label">Gebruikersnaam</label>
        <input v-model="username" placeholder="Gebruikersnaam" class="input-field" />
        
        <label class="input-label">Wachtwoord</label>
        <input v-model="password" type="password" placeholder="Wachtwoord" class="input-field" />
        
        <div class="error-space" v-if="errorMessage">{{ errorMessage }}</div>
        
        <button @click="login" class="login-button">Log in</button>
        
        <p class="signup-text">
            Heb je nog geen account? <span class="signup-link" @click="goToSignUp">Registreren</span>
        </p>
    </div>      
</template>

<script>
    import axios from 'axios';
    import { nextTick } from 'vue';

    export default {
        data() {
            return {
                username: '',
                password: '',
                errorMessage: '',
                isLoggedIn: false,
            };
        },
        mounted() {
            this.checkLoginStatus();
        },
        methods: {
            checkLoginStatus() {
                const token = localStorage.getItem('token');
                if (token) {
                    this.isLoggedIn = true;
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const payload = JSON.parse(atob(base64));
                        this.username = payload.username;
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        this.logout();
                    }
                } else {
                    this.isLoggedIn = false;
                }
            },
            async login() {
                this.errorMessage = '';
                try {
                    const response = await axios.post('http://localhost:3000/api/users/login', {
                        username: this.username,
                        password: this.password,
                    });
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.userId);
                    this.$router.push('/account');
                } catch (error) {
                    this.errorMessage = error.response?.data?.error || 'Er is een error opgetreden tijdens het inloggen.';
                }
            },
            goToAcccount() {
                this.$router.push('/account');
            },
            goToSignUp() {
                this.$router.push('/register');
            },
        },
            watch: {
                isLoggedIn(newValue){
                    if(newValue){
                        nextTick(() => {
                            this.goToAcccount();
                        });
                    }
                },
            },
        };
</script>

<style scoped>
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90%;
        margin: auto;
        margin-top: 40px;
    }

.logo {
    width: 100%;
    max-height: 50vh;
    text-align: center;
    margin-bottom: 2rem;
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
}

.error-space {
    height: 2rem;
    color: red;
    text-align: center;
}

    .login-button {
        padding: 15px;
        width: 100%;
        padding: 1.5rem;
        background-color: red;
        color: white;
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        margin-top: 1rem;
        margin-bottom: 2rem;
        font-size: 15px;
    }

    .signup-text {
        margin-top: 1rem;
        color: black;
        text-align: center;
    }

.signup-link {
    color: red;
    text-decoration: underline;
    cursor: pointer;
}
</style>
