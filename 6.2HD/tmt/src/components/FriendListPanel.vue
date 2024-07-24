<script setup>
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

<template>
    <v-navigation-drawer location="right" :permanent="!$vuetify.display.mobile">
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