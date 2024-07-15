<script setup>
import { useAuthStore } from "@/store/auth";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import AppBar from "../components/AppBar.vue";
import LogoutButton from "../components/LogoutButton.vue";
import FriendListPanel from "@/components/FriendListPanel.vue";

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
</script>

<template>
    <AppBar />

    <FriendListPanel></FriendListPanel>

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
