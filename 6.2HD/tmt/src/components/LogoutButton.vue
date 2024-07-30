<template>
    <v-btn @click="handleLogout" icon>
        <v-icon icon="mdi-logout" size="large"></v-icon>
    </v-btn>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();

const store = useAuthStore();
const { logout } = store;

async function handleLogout() {
    try {
        const { status, data } = await logout();

        if (status === 200) {
            router.push("/login");
        } else {
            console.log(data);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>