<template>
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
                                label="Upload photos"
                                chips
                                multiple
                                variant="outlined"
                                prepend-icon="mdi-camera"
                                v-model="postContent.mediaFiles"
                                accept="image/*"
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
</template>

<script setup>
import { reactive, ref, watch } from "vue";
const dialog = ref(false);

const postContent = reactive({
    textContent: "",
    mediaFiles: []
});

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