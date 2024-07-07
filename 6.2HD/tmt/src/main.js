import { createApp } from "vue";
import { createPinia } from "pinia";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import { VDateInput } from "vuetify/lib/labs/components.mjs";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const vuetify = createVuetify({
    components: {
        ...components,
        VDateInput
    },
    directives
});

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
