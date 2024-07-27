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
                        :prepend-icon="user.status === 'Friends' ? 'mdi-check' : ''"
                        :color="user.status === 'Friends' ? 'success' : ''"
                        variant="outlined"
                        @click="() => user.status === 'Not friend' && sendFriendRequest(user.username)"
                    >
                        {{ statusToDisplayString[user.status] }}

                        <v-menu v-if="user.status === 'Request sent'" activator="parent">
                            <v-list>
                                <v-list-item @click="() => cancelFriendRequest(user.username)">
                                    <v-list-item-title>Cancel request</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <v-menu v-if="user.status === 'Friends'" activator="parent">
                            <v-list>
                                <v-list-item @click="() => unfriend(user.username)">
                                    <v-list-item-title>Unfriend</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <v-menu v-if="user.status === 'Request received'" activator="parent">
                            <v-list>
                                <v-list-item @click="() => acceptFriendRequest(user.username)">
                                    <v-list-item-title>Accept</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="() => declineFriendRequest(user.username)">
                                    <v-list-item-title>Decline</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-container>
    </v-main>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import dateFormat from 'dateformat';

import AppBar from '@/components/AppBar.vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/auth';

const { currentUsername } = storeToRefs(useAuthStore());

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

async function sendFriendRequest(recipientUsername) {
    console.log(recipientUsername);

    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ recipientUsername })
        }
        const response = await fetch(`/api/users/${currentUsername.value}/friend-requests/sent`, options);
        const data = await response.json();

        if (response.status === 201) {
            users.value.find(user => user.username === recipientUsername).status = "Request sent";
        }

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

async function cancelFriendRequest(recipientUsername) {
    console.log(recipientUsername);

    try {
        const options = {
            method: "DELETE"
        }
        const response = await fetch(`/api/users/${currentUsername.value}/friend-requests/sent/${recipientUsername}`, options);
        const data = await response.json();

        if (response.status === 200) {
            users.value.find(user => user.username === recipientUsername).status = "Not friend";
        }

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

async function acceptFriendRequest(senderUsername) {
    try {
        const options = {
            method: "POST"
        }
        const response = await fetch(`/api/users/${currentUsername.value}/friend-requests/received/${senderUsername}/accept`, options);
        const data = await response.json();

        if (response.status === 200) {
            users.value.find(user => user.username === senderUsername).status = "Friends";
        }

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

async function declineFriendRequest(senderUsername) {
    try {
        const options = {
            method: "DELETE"
        }
        const response = await fetch(`/api/users/${currentUsername.value}/friend-requests/received/${senderUsername}`, options);
        const data = await response.json();

        if (response.status === 200) {
            users.value.find(user => user.username === senderUsername).status = "Not friend";
        }

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

async function unfriend(username) {
    try {
        const options = {
            method: "DELETE"
        }
        const response = await fetch(`/api/users/${currentUsername.value}/friends/${username}`, options);
        const data = await response.json();

        if (response.status === 200) {
            users.value.find(user => user.username === username).status = "Not friend";
        }

        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const statusToDisplayString = {
    "Not friend": "Add friend",
    "Request sent": "Pending",
    "Request received": "Respond",
    "Friends": "Friends"
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