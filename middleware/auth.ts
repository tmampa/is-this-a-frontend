import { navigateTo } from "#app";

// Authentication middleware
export default defineNuxtRouteMiddleware((to, from) => {
  const { checkAuth, initAuth } = useAuth();

  // Initialize auth from localStorage
  initAuth();

  // Skip authentication for login page
  if (to.path === "/login") {
    return;
  }

  // Check if user is authenticated
  if (!checkAuth()) {
    return navigateTo("/login");
  }
});
