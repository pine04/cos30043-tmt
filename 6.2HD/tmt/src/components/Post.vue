<template>
    <v-card max-width="600" variant="flat">
        <v-card-title>
            <v-list-item>
                <template v-slot:prepend>
                    <v-avatar image="default_avatar.jpg"></v-avatar>
                </template>
                <v-list-item-title>
                    Author display name
                </v-list-item-title>
                <v-list-item-subtitle>
                    @AuthorUsername
                </v-list-item-subtitle>
            </v-list-item>
        </v-card-title>
        <v-card-text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis repellendus enim impedit debitis, harum cupiditate saepe. Deleniti exercitationem dolores, minus ratione aliquid velit unde ab? Aliquam nam molestias earum repudiandae rerum quis placeat praesentium rem sunt impedit maxime quo blanditiis libero vel debitis nulla officiis itaque tenetur, quod minima inventore.

            <v-spacer></v-spacer>

            <v-row dense>
                <v-col cols="6">
                    <v-hover>

                        <v-img
                        src="test1.png"
                        width="100%"
                        aspect-ratio="1"
                        cover
                        @click="show"
                        ></v-img>
                    </v-hover>
                </v-col>
                <v-col cols="6">
                    <v-hover>

                        <v-img
                        src="test2.png"
                        width="100%"
                        aspect-ratio="1"
                        cover
                        @click="show"
                        ></v-img>
                    </v-hover>
                </v-col>
                <v-col cols="6">
                    <v-hover>

                        <v-img
                        src="test3.png"
                        width="100%"
                        aspect-ratio="1"
                        cover
                        @click="show"
                        ></v-img>
                    </v-hover>
                </v-col>
                <v-col cols="6">
                    <v-hover>

                        <v-img
                        src="test4.jpg"
                        width="100%"
                        aspect-ratio="1"
                        cover
                        @click="show"
                        class="position-relative"
                        >
                        <v-overlay contained :model-value="true" persistent class="justify-center align-center">
                            <v-icon icon="mdi-plus" size="96" color="white"></v-icon>
                        </v-overlay>
                    </v-img>
                </v-hover>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn prepend-icon="mdi-thumb-up" :ripple="false">0</v-btn>
            <v-btn prepend-icon="mdi-thumb-down" :ripple="false">0</v-btn>
            <v-btn prepend-icon="mdi-share" :ripple="false">0</v-btn>
        </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog" max-width="1400">
        <template v-slot:activator="{props: activatorProps}">
            <v-btn v-bind="activatorProps">Show</v-btn>
        </template>

        <v-carousel class="carousel">
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
    </v-dialog>

    <v-overlay v-model="showImageCarousel" class="align-center justify-center">

                <v-carousel>
                    <v-carousel-item
                        src="test1.png"
                        width="1200"
                        color="black"
                    ></v-carousel-item>
                    <v-carousel-item
                        src="test2.png"
                        width="1200"
                        color="black"
                    ></v-carousel-item>
                    <v-carousel-item
                        src="test3.png"
                        width="1200"
                        color="black"
                    ></v-carousel-item>
                    <v-carousel-item
                        src="test4.jpg"
                        width="1200"
                        color="black"
                    ></v-carousel-item>
                </v-carousel>
    </v-overlay>
</template>

<script setup>
import { ref } from "vue";
const showImageCarousel = ref(false);

const dialog = ref(false);

function show() {
    showImageCarousel.value = true;
}
</script>

<style scoped>
.carousel {
    width: 1000px;
}
</style>