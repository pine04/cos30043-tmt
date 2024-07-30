<script setup>
import AppBar from "./components/AppBar.vue";
import { RouterView } from "vue-router";
</script>

// TODO: Make forms accessible?
<template>
    <v-app>
        <AppBar></AppBar>
        <RouterView />
    </v-app>
</template>
