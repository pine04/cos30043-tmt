<template>
    <v-app-bar elevation="0" class="bg-blue">
        <v-menu>
            <template v-slot:activator="{props}">
                <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Search for friends"
                    variant="outlined"
                    bg-color="white"
                    hide-details
                    density="compact"
                    class="mx-8 search-bar"
                    v-bind="props"
                    @keydown.enter="search"
                ></v-text-field>
            </template>

            <v-list>
                <v-list-item class="text-center">Type to search</v-list-item>
            </v-list>
        </v-menu>

        <div class="d-flex ga-6 ml-auto mr-8 align-center">
            <v-btn icon to="/">
                <v-icon icon="mdi-home-outline" size="x-large"></v-icon>
            </v-btn>

            <v-btn icon to="/find-friends">
                <v-icon icon="mdi-account-group" size="x-large"></v-icon>
            </v-btn>

            <v-btn to="/profile">
                <v-avatar image="default_avatar.jpg" size="small" class="mr-2"></v-avatar>
                <p>{{ currentUsername }}</p>
            </v-btn>

            <v-btn v-if="$vuetify.display.mobile" icon @click="drawer = !drawer">
                <v-icon icon="mdi-menu" size="x-large"></v-icon>
            </v-btn>
        </div>
    </v-app-bar>

    <v-navigation-drawer location="right" v-model="drawer" :permanent="!$vuetify.display.mobile">
        <div class="d-flex flex-column ga-4 pt-2">
            <v-list-item v-for="user in data">
                <div class="d-flex ga-3 align-center">
                    <v-avatar image="default_avatar.jpg" size="small"></v-avatar>
                    <p>{{ user }}</p>
                </div>
            </v-list-item>
        </div>
    </v-navigation-drawer>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const drawer = ref(false);

const searchQuery = ref("");
const router = useRouter();
const { currentUsername } = storeToRefs(useAuthStore());

function search() {
    if (searchQuery.value) {
        router.push(`/find-friends?nameQuery=${searchQuery.value}`);
    }
}

watch(searchQuery, (newQuery) => {
    console.log(newQuery, oldQuery);
});

const data = [
    "Keanu Cloud",
    "Thea Chamberlin",
    "Yoselin Crowley",
    "Kade Zavala",
    "Jasmin Hoy",
    "Savanah Dye",
    "Shelly Adair",
    "Cade Diehl",
    "Kaylan Hopkins",
    "Hazel Abreu"
];
</script>

<style scoped>
.search-bar {
    width: 100%;
    max-width: 32rem;
}
</style>
