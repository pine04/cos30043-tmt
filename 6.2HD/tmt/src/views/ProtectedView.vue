<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const users = ref([]);
const router = useRouter();

onMounted(async () => {
    try {
        const response = await fetch("/api/protected");

        if (response.status === 401) {
            router.push("/login");
        }
        const data = await response.json();

        console.log(data);
        users.value = data;
    } catch (err) {
        console.log(err);
    }
});

async function handleLogout() {
    try {
        const response = await fetch("/api/logout", { method: "POST" });
        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <p v-for="user in users">
        {{ user["Username"] }}
    </p>
    <v-btn @click="handleLogout" variant="outlined">Log out</v-btn>
</template>