<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const { login } = useAuthStore();

const formData = reactive({
    valid: true,
    usernameOrEmail: "",
    password: ""
});

const router = useRouter();

async function onSubmit(event) {
    event.preventDefault();

    try {
        const { status, data } = await login(formData.usernameOrEmail, formData.password);

        if (status === 200) {
            router.push("/");
        } else {
            console.log(data);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <div class="body">
        <v-form v-model="valid" @submit="onSubmit">
            <h1>Login</h1>
            <v-text-field
                v-model="formData.usernameOrEmail"
                variant="outlined"
                label="Username or email"
            ></v-text-field>

            <v-text-field
                v-model="formData.password"
                variant="outlined"
                label="Password"
                type="password"
            ></v-text-field>

            <v-btn variant="outlined" type="submit"> Login </v-btn>

            <p>Don't have an account? <router-link to="/register">Register</router-link></p>
        </v-form>
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
