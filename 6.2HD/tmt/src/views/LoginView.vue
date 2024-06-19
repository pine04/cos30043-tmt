<script setup>
import { reactive } from "vue";

const formData = reactive({
    valid: true,
    username: ""
});
</script>

<template>
    <v-form v-model="valid">
        <v-text-field
            v-model="formData.username"
            variant="outlined"
            label="Username"
        ></v-text-field>

        <v-text-field
            v-model="formData.password"
            variant="outlined"
            label="Password"
            type="password"
        ></v-text-field>
    </v-form>
</template>