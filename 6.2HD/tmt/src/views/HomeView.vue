<script setup>
import AppBar from "@/components/AppBar.vue";
import LogoutButton from "@/components/LogoutButton.vue";
import FriendListPanel from "@/components/FriendListPanel.vue";
import Post from "@/components/Post.vue";
import { reactive, ref, watch } from "vue";

const dialog = ref(false);

const postContent = reactive({
    textContent: "",
    mediaFiles: []
});

watch(() => postContent.mediaFiles, (val, _) => console.log(val));

function closeDialog() {
    dialog.value = false;
}

async function post(e) {
    e.preventDefault();

    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                textContent: postContent.textContent,
                mediaFiles: postContent.mediaFiles.map(file => file.name)
            })
        }
        const response = await fetch("/api/posts", options);
        const data = await response.json();

        for (const uploadUrl of data.mediaUploadUrls) {
            const file = postContent.mediaFiles.find(file => file.name === uploadUrl.file);
            const uploadOptions = {
                method: "PUT",
                body: file
            };
            await fetch(uploadUrl.url, uploadOptions);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <AppBar />

    <FriendListPanel></FriendListPanel>

    <v-main>
        <v-container>

            <v-dialog v-model="dialog" max-width="900">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-card variant="tonal">
                        <v-card-text>
                            <p>Write something</p>
                            <v-text-field 
                                variant="outlined" 
                                hide-details 
                                density="compact"
                                v-bind="activatorProps"
                            ></v-text-field>
                        </v-card-text>
                    </v-card>
                </template>

                <v-card class="post-form" max-width="900">
                    <v-form @submit="post">
                        <v-card-text>
                            <p>What's on your mind?</p>
                            <v-textarea
                                no-resize
                                rows="15"
                                variant="outlined"
                                v-model="postContent.textContent"
                            ></v-textarea>
                            <v-file-input
                                label="Upload photos and videos"
                                chips
                                multiple
                                variant="outlined"
                                prepend-icon="mdi-camera"
                                v-model="postContent.mediaFiles"
                                accept="image/*, video/*"
                            ></v-file-input>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="button" @click="closeDialog">Cancel</v-btn>
                            <v-btn type="submit">Post</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>

            <LogoutButton></LogoutButton>

            <Post></Post>
            <v-divider></v-divider>
            <Post></Post>

            <v-carousel>
            <v-carousel-item
                src="test1.png"
            ></v-carousel-item>
            <v-carousel-item
                src="test2.png"
            ></v-carousel-item>
            <v-carousel-item
                src="test3.png"
            ></v-carousel-item>
            <v-carousel-item
                src="test4.jpg"
            ></v-carousel-item>
        </v-carousel>
        </v-container>
    </v-main>
</template>

<style scoped>
</style>