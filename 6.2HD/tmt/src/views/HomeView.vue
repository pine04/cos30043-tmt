<script setup>
import AppBar from "@/components/AppBar.vue";
import FriendListPanel from "@/components/FriendListPanel.vue";
import PostUploadForm from "@/components/PostUploadForm.vue";
</script>

<template>
    <AppBar />

    <v-main>
        <v-container>
            <PostUploadForm></PostUploadForm>
            
        </v-container>
    </v-main>
</template>