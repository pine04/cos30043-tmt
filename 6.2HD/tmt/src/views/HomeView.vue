<script setup>
import AppBar from "@/components/AppBar.vue";
import LogoutButton from "@/components/LogoutButton.vue";
import FriendListPanel from "@/components/FriendListPanel.vue";
</script>

<template>
    <AppBar />

    <FriendListPanel></FriendListPanel>

    <v-main>
        <v-container>
            <LogoutButton></LogoutButton>
        </v-container>
    </v-main>
</template>
