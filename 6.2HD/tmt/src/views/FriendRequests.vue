<template>
    <v-main>
        <v-container>
            {{ receivedRequests }}
    
            <v-divider></v-divider>
    
            <UserCard
                v-for="user in sentRequests"
                :user="user"
            ></UserCard>
        </v-container>
    </v-main>
</template>

<script setup>
import UserCard from '@/components/UserCard.vue';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';
import { watchEffect, ref } from 'vue';

const { currentUsername } = storeToRefs(useAuthStore());

const receivedRequests = ref([]);
const sentRequests = ref([]);

watchEffect(() => {
    if (currentUsername.value) {
        getReceivedRequests(currentUsername.value);
        getSentRequests(currentUsername.value);
    } else {
        receivedRequests.value = [];
        sentRequests.value = [];
    }
});

async function getReceivedRequests(username) {
    try {
        const response = await fetch(`/api/users/${username}/friend-requests/received`);
        const data = await response.json();

        if (response.status === 200) {
            receivedRequests.value = data.requests;
        }
    } catch (error) {
        console.log(error);
    }
}

async function getSentRequests(username) {
    try {
        const response = await fetch(`/api/users/${username}/friend-requests/sent`);
        const data = await response.json();

        if (response.status === 200) {
            sentRequests.value = data.requests;
        }
    } catch (error) {
        console.log(error);
    }
}
</script>