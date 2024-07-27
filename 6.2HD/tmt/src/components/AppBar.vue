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

    <v-navigation-drawer location="right" :model-value="!$vuetify.display.mobile || drawer" :permanent="!$vuetify.display.mobile">
        <p v-if="friends.length === 0">No friends to show.</p>

        <v-list>
            <v-list-item v-for="friend in friends">
                <template v-slot:prepend>
                    <v-avatar :image="friend.profilePicture || 'default_avatar.jpg'" size="small"></v-avatar>
                </template>

                <v-list-item-title>
                    {{ friend.displayName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    @{{ friend.username }}
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
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

const friends = ref([]);

onMounted(async () => {
    try {
        const response = await fetch(`/api/users/${currentUsername.value}/friends`);
        const data = await response.json();

        console.log(data.users);

        friends.value = data.users;
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped>
.search-bar {
    width: 100%;
    max-width: 32rem;
}
</style>
