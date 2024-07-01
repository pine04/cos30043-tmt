<script setup>
import { useAuthStore } from "@/store/auth";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const formData = reactive({
    valid: true,
    username: "",
    email: "",
    password: "",
    cfPassword: ""
});

const router = useRouter();

onMounted(async () => {
    try {
        const response = await fetch("/api/login-status");
        const data = await response.json();

        if (data.isLoggedIn) {
            router.push("/protected");
        }

        console.log(data);
    } catch (error) {
        console.log(error);
    }
});

async function onSubmit(event) {
    event.preventDefault();

    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                username: formData.username, 
                email: formData.email,
                password: formData.password,
                cfPassword: formData.cfPassword
            })
        }
        const response = await fetch("/api/register", options);
        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const auth = useAuthStore();
</script>

<template>
    <div class="body">
        <v-form v-model="valid" @submit="onSubmit">
            <h1>Register</h1>
            <v-text-field
                v-model="formData.username"
                variant="outlined"
                label="Username"
            ></v-text-field>

            <v-text-field
                v-model="formData.email"
                variant="outlined"
                label="Email"
            ></v-text-field>
    
            <v-text-field
                v-model="formData.password"
                variant="outlined"
                label="Password"
                type="password"
            ></v-text-field>

            <v-text-field
                v-model="formData.cfPassword"
                variant="outlined"
                label="Confirm password"
                type="password"
            ></v-text-field>
    
            <v-btn variant="outlined" type="submit">
                Register
            </v-btn>
            <p>Already have an account? <router-link to="/login">Login</router-link></p>
        </v-form>

        {{ auth.isAuthenticated }}
    </div>
</template>

<style scoped>
.body {
    display: grid;
    height: 100dvh;
    height: 100vh;
    grid-template-columns: 1fr 1fr;
    background: lightskyblue;
}

.body form {
    grid-column: 2 / 3;
    background: white;
    padding: 2rem;
}
</style>