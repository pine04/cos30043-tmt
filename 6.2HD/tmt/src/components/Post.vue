<template>
    <v-card max-width="600" variant="flat">
        <v-card-title>
            <v-list-item>
                <template v-slot:prepend>
                    <v-avatar image="default_avatar.jpg"></v-avatar>
                </template>
                <v-list-item-title>
                    {{ postData.author.displayName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    @{{ postData.author.username }}
                </v-list-item-subtitle>
                <template v-slot:append>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" variant="flat" v-bind="props"></v-btn>
                        </template>

                        <v-list>
                            <v-list-item>
                                <v-list-item-title>
                                    Edit
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item>Delete</v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-list-item>
        </v-card-title>

        <v-card-text>
            <p v-for="paragraph in paragraphs" class="my-2">
                {{ paragraph }}
            </p>

            <v-dialog v-if="mediaThumbnails.length > 0" v-model="dialog" max-width="1400">
                <template v-slot:activator="{props: activatorProps}">
                    <v-row dense class="mt-2">
                        <v-col v-for="(thumbnail, index) in mediaThumbnails" :cols="layout[mediaThumbnails.length][index]['cols']">
                            <v-hover v-slot="{ isHovering, props: hoverProps }">
                                <v-img
                                    :src="thumbnail"
                                    width="100%"
                                    max-height="250"
                                    :aspect-ratio="layout[mediaThumbnails.length][index]['aspectRatio']"
                                    cover
                                    v-bind="activatorProps, hoverProps"
                                    :class="{ 'hover': isHovering, 'position-relative': true }"
                                >
                                    <v-overlay v-if="index === 3" contained :model-value="true" persistent class="justify-center align-center">
                                        <v-icon icon="mdi-plus" size="96" color="rgba(255, 255, 255, 0.5)"></v-icon>
                                    </v-overlay>
                                </v-img>
                            </v-hover>
                        </v-col>
                    </v-row>
                </template>

                <v-carousel :continuous="false">
                    <v-carousel-item
                        v-for="media in postData.media"
                        :src="media"
                        color="black"
                        draggable="false"
                    ></v-carousel-item>
                </v-carousel>
            </v-dialog>
        </v-card-text>

        <v-card-actions>
            <v-btn prepend-icon="mdi-thumb-up" :ripple="false">0</v-btn>
            <v-btn prepend-icon="mdi-thumb-down" :ripple="false">0</v-btn>
            <v-btn prepend-icon="mdi-share" :ripple="false">0</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from "vue";

const props = defineProps(["postUri"]);

const postData = ref({
    author: {
        displayName: "Pine",
        username: "pine04",
        avatar: "default_avatar.jpg"
    },
    textContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis repellendus enim impedit debitis, harum cupiditate saepe.\n\n\nDeleniti exercitationem dolores, minus ratione aliquid velit unde ab? \nAliquam nam molestias earum repudiandae rerum quis placeat praesentium rem sunt impedit maxime quo blanditiis libero vel debitis nulla officiis itaque tenetur, quod minima inventore.",
    media: [
        "test1.png",
        "test2.png",
        "test3.png",
        "test4.jpg",
        "test1.png",
        "test2.png",
        "test3.png",
        "test4.jpg"
    ]
});

onMounted(async () => {
    console.log("post called")
    try {
        const response = await fetch(props.postUri);
        const data = await response.json();
        postData.value = data.post;
    } catch (error) {
        console.log(error);
    }
});

const mediaThumbnails = computed(() => postData.value.media.slice(0, 4));
const paragraphs = computed(() => postData.value.textContent.split("\n"));

const layout = {
    1: [
        {
            cols: "12",
            aspectRatio: "1"
        }
    ],
    2: [
        {
            cols: "6",
            aspectRatio: "1"
        },
        {
            cols: "6",
            aspectRatio: "1"
        }
    ],
    3: [
        {
            cols: "6",
            aspectRatio: "1"
        },
        {
            cols: "6",
            aspectRatio: "1"
        },
        {
            cols: "12",
            aspectRatio: "2"
        }
    ],
    4: [
        {
            cols: "6",
            aspectRatio: "1"
        },
        {
            cols: "6",
            aspectRatio: "1"
        },
        {
            cols: "6",
            aspectRatio: "1"
        },
        {
            cols: "6",
            aspectRatio: "1"
        }
    ]
}

const dialog = ref(false);
</script>

<style scoped>
.hover {
    opacity: 0.8;
}
</style>