<script setup>
import { useAuthStore } from "@/store/auth";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import dateFormat from "dateformat";

import AppBar from "../components/AppBar.vue";
import Post from "@/components/Post.vue";

const profile = ref(null);
const myPosts = ref([]);
const router = useRouter();

const route = useRoute();

const { setAuthenticationState } = useAuthStore();

onMounted(async () => {
    console.log(route.params.username);
    try {
        const response = await fetch(`/api/users/${route.params.username}`);

        if (response.status === 401) {
            setAuthenticationState(false);
            router.push("/login");
            return;
        }
        const data = await response.json();
        profile.value = data.user;
    } catch (err) {
        console.log(err);
    }
});

onMounted(async () => {
    try {
        const response = await fetch(`/api/users/${route.params.username}/posts`);

        if (response.status === 401) {
            setAuthenticationState(false);
            router.push("/login");
            return;
        }
        const data = await response.json();
        myPosts.value = data.posts;
    } catch (err) {
        console.log(err);
    }
});
</script>

<template>
    <AppBar />

    <v-main>
        <v-container>
            <v-row class="position-relative">
                <v-col cols="3">
                    <div v-if="profile !== null">
                        <v-avatar image="default_avatar.jpg" size="96"></v-avatar>
                        <h1 class="text-right">{{ profile.displayName }}</h1>
                        <h2 class="text-right font-weight-medium">@{{ profile.username }}</h2>

                        <v-divider></v-divider>

                        <p>
                            <v-icon icon="mdi-email"></v-icon> {{ profile.email }}
                        </p>
                        <p>
                            <v-icon icon="mdi-account"></v-icon> {{ profile.gender }}
                        </p>
                        <p>
                            <v-icon icon="mdi-cake-variant"></v-icon> {{ dateFormat(profile.birthdate, "longDate") }}
                        </p>
                        <p>
                            <v-icon icon="mdi-map-marker"></v-icon> {{ profile.location }}
                        </p>
                        <p>
                            <v-icon icon="mdi-heart"></v-icon> {{ profile.relationshipStatus }}
                        </p>
                        <p>Bio:</p>
                        <p>{{ profile.bio }}</p>
                    </div>
                </v-col>

                <v-col cols="9">
                    <Post v-for="post in myPosts" :postUri="post"></Post>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>
