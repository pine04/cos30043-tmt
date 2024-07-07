<template>
    <v-app-bar elevation="0" class="bg-blue">
        <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search"
            variant="outlined"
            bg-color="white"
            hide-details
            density="compact"
            class="mx-8 search-bar"
        ></v-text-field>

        <div class="d-flex ga-6 ml-auto mr-8 align-center">
            <v-btn icon to="/">
                <v-icon icon="mdi-home-outline" size="x-large"></v-icon>
            </v-btn>

            <v-btn icon to="/chat">
                <v-icon icon="mdi-chat-outline" size="x-large"></v-icon>
            </v-btn>

            <v-btn to="/profile">
                <v-avatar image="default_avatar.jpg" size="small" class="mr-2"></v-avatar>
                <p>{{ currentUsername }}</p>
            </v-btn>
        </div>
    </v-app-bar>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const searchQuery = ref("");
const store = useAuthStore();

const { currentUsername } = storeToRefs(store);
</script>

<style scoped>
.search-bar {
    width: 100%;
    max-width: 32rem;
}
</style>
