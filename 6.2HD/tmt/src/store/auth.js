import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => {
        return {
            isAuthenticated: false
        }
    },
    actions: {
        authenticate() {
            this.isAuthenticated = true;
        },
        unauthenticate() {
            this.isAuthenticated = false;
        }
    }
})