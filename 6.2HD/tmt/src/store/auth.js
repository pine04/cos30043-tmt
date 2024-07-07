import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    const isAuthenticated = ref(undefined);
    const currentUsername = ref("");

    function setAuthenticationState(newState) {
        isAuthenticated.value = !!newState;
    }

    async function getInitialAuthState() {
        try {
            const response = await fetch("/api/login-status");
            const data = await response.json();
            console.log(data);
            isAuthenticated.value = data.isLoggedIn;
            currentUsername.value = data.username;
        } catch (error) {
            console.log(error);
        }
    }

    async function login(usernameOrEmail, password) {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ usernameOrEmail, password })
            };
            const response = await fetch("/api/login", options);
            const data = await response.json();

            if (response.status === 200) {
                isAuthenticated.value = true;
                currentUsername.value = data.username;
            }

            return {
                status: response.status,
                data: data
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async function logout() {
        try {
            const response = await fetch("/api/logout", { method: "POST" });
    
            if (response.status === 200) {
                isAuthenticated.value = false;
                currentUsername.value = "";
            }

            const data = await response.json();

            return {
                status: response.status,
                data: data
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    return { isAuthenticated, setAuthenticationState, getInitialAuthState, currentUsername, login, logout };
});
