import { useAuthStore } from "@/store/auth";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
            meta: { requiresAuth: false }
        },
        {
            path: "/register",
            name: "register",
            component: () => import("../views/RegisterView.vue"),
            meta: { requiresAuth: false }
        },
        {
            path: "/",
            component: () => import("../views/ProtectedView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/profile",
            component: () => import("../views/ProfileView.vue"),
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth !== undefined) {
        const store = useAuthStore();

        if (store.isAuthenticated === undefined) {
            try {
                await store.getInitialAuthState();
            } catch (error) {
                console.log(error);
            }
        }

        if (to.meta.requiresAuth && !store.isAuthenticated) {
            return next("/login");
        }

        if (!to.meta.requiresAuth && store.isAuthenticated) {
            return next("/");
        }
    }

    next();
});

export default router;
