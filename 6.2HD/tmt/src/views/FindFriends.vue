<template>
    <AppBar></AppBar>

    <v-main>
        <v-container>
            <h1>Search for friends</h1>
            <v-form @submit="handleSubmit">
                <v-row align="center">
                    <v-col cols="3">
                        <v-text-field
                            label="Name"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            v-model="searchOptions.nameQuery"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field
                            label="Location"
                            prepend-inner-icon="mdi-map-marker"
                            variant="outlined"
                            hide-details
                            v-model="searchOptions.location"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-select
                            prepend-inner-icon="mdi-heart"
                            label="Relationship status"
                            :items="['', 'Single', 'Dating', 'Engaged', 'Married', 'Undisclosed']"
                            variant="outlined"
                            hide-details
                            v-model="searchOptions.relationshipStatus"
                        ></v-select>
                    </v-col>
                    <v-col cols="3">
                        <v-btn variant="outlined" type="submit">Search</v-btn>
                    </v-col>
                </v-row>                
            </v-form>

            <v-divider></v-divider>

            <p v-if="users.length === 0">No users to show.</p>

            <v-list>
                <v-list-item v-for="(user, i) in users">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-avatar image="default_avatar.jpg" size="large"></v-avatar>
                        </template>
                        <v-list-item-title>
                            {{ user.displayName }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            @{{ user.username }}
                        </v-list-item-subtitle>
                    </v-list-item>
                    <p>
                        <v-icon icon="mdi-email"></v-icon> {{ user.email }}
                    </p>
                    <p>
                        <v-icon icon="mdi-account"></v-icon> {{ user.gender }}
                    </p>
                    <p>
                        <v-icon icon="mdi-cake-variant"></v-icon> {{ dateFormat(user.birthdate, "longDate") }}
                    </p>
                    <p>
                        <v-icon icon="mdi-map-marker"></v-icon> {{ user.location }}
                    </p>
                    <p>
                        <v-icon icon="mdi-heart"></v-icon> {{ user.relationshipStatus }}
                    </p>
                    <p>Bio:</p>
                    
                    <p>{{ user.bio }}</p>

                    <v-btn
                        :prepend-icon="user.status === 'Accepted' ? 'mdi-check' : ''"
                        :color="user.status === 'Accepted' ? 'success' : ''"
                        :readonly="user.status === 'Accepted'"
                        variant="outlined"
                    >
                        {{ statusToDisplayString[user.status] }}
                    </v-btn>
                </v-list-item>
            </v-list>
            <div v-for="user in users">
                {{ user }}
            </div>
        </v-container>
    </v-main>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import dateFormat from 'dateformat';

import AppBar from '@/components/AppBar.vue';

const route = useRoute();

const searchOptions = reactive({
    nameQuery: route.query.nameQuery || "",
    location: route.query.location || "",
    relationshipStatus: route.query.relationshipStatus || ""
});

const users = ref([]);

function handleSubmit(event) {
    event.preventDefault();
    getFriends();
}

const statusToDisplayString = {
    "Not friend": "Add friend",
    "Pending": "Pending",
    "Accepted": "Friends"
};

onMounted(() => {
    getFriends();
});

async function getFriends() {
    try {
        const response = await fetch(`/api/users?nameQuery=${searchOptions.nameQuery}&location=${searchOptions.location}&relationshipStatus=${searchOptions.relationshipStatus}`);
        const data = await response.json();
        if (response.status === 200) {
            console.log(data.users);
            users.value = data.users;
        } else {
            users.value = [];
            console.log(data.message);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>