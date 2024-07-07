<script setup>
import { useAuthStore } from "@/store/auth";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import AppBar from "../components/AppBar.vue";
import LogoutButton from "../components/LogoutButton.vue";

const profile = ref(null);
const router = useRouter();

const { setAuthenticationState } = useAuthStore();

onMounted(async () => {
    try {
        const response = await fetch("/api/my-profile");

        if (response.status === 401) {
            setAuthenticationState(false);
            router.push("/login");
            return;
        }
        console.log(response);
        const data = await response.json();

        console.log(data);
        profile.value = data;
    } catch (err) {
        console.log(err);
    }
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
]
</script>

<template>
    <AppBar />

    <v-navigation-drawer location="right" permanent>
        <div class="d-flex flex-column ga-4 pt-2">
        <v-list-item v-for="user in data">
            <div class="d-flex ga-3 align-center">
                <v-avatar image="default_avatar.jpg" size="small"></v-avatar>
                <p>{{ user }}</p>
            </div>
        </v-list-item>
        </div>
    </v-navigation-drawer>

    <v-main>
        <v-container>
            <v-row class="position-relative">
                <v-col cols="3" class="bg-red position-sticky top-0">
                    <p>Profile info</p>
                    <LogoutButton></LogoutButton>
                </v-col>

                <v-col cols="9" class="bg-blue">
                    <p>Posts</p>
                    <p v-for="n in 100">
                        Post content.
                    </p>
                </v-col>
            </v-row>

        </v-container>
    </v-main>
</template>
