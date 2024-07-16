<script setup>
import AppBar from "@/components/AppBar.vue";
import LogoutButton from "@/components/LogoutButton.vue";
import FriendListPanel from "@/components/FriendListPanel.vue";
import { ref } from "vue";

const dialog = ref(false);

function closeDialog() {
    dialog.value = false;
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
                    <v-form>
                        <v-card-text>
                            <p>What's on your mind?</p>
                            <v-textarea no-resize rows="15" variant="outlined"></v-textarea>
                            <v-file-input
                                label="Upload photos and videos"
                                chips
                                multiple
                                variant="outlined"
                                prepend-icon="mdi-camera"
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
        </v-container>
    </v-main>
</template>

<style scoped>
</style>