<template>
    <div class="signup-container">
        <div class="spacer"></div>
        <div class="logo-placeholder">Logo Here</div>

        <label class="input-label">Gebruikersnaam</label>
        <input v-model="username" placeholder="Gebruikersnaam" class="input-field" />

        <label class="input-label">Studiegebied</label>
        <select v-model="educationType" class="input-field">
            <option value="non-student">Non-student</option>
            <option value="option1">Technology & Bio</option>
            <option value="option2">Gezondheidszorg</option>
            <option value="option3">Marketing & Business</option>
            <option value="option4">Onderwijs & Sociaal</option>
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
    //import dotenv from 'dotenv';

    export default {
        data() {
            return {
                username: '',
                educationType: 'non-student',
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
                    const response = await axios.post('http://localhost:3000/api/users/register', {
                        username: this.username,
                        educationType: this.educationType,
                        password: this.password,
                    });
                    alert(response.data.message);
                } catch (error) {
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
    }

    .spacer {
        height: 4rem;
    }

    .logo-placeholder {
        width: 90%;
        max-height: 50vh;
        background-color: lightgray;
        text-align: center;
        padding: 4rem 1rem 4rem 1rem;
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
    }

    .login-link {
        color: red;
        text-decoration: underline;
        cursor: pointer;
    }
</style>