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

// app.directive("blur", {
//     mounted: (el) => {
//         const input = el.querySelector(".v-field__field input");
//         input.onfocus = (ev) => {
//             console.log("Focused");
//             ev.target.blur(); 
//         }

//         input.onblur = () => console.log("blurring...");
//     }
// });

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
