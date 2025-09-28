// Authentication composable
import type { LoginCredentials, User, AuthResponse } from "~/types/books";

const API_BASE = "http://localhost:8080/api";

export const useAuth = () => {
  // Reactive state
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = ref(false);

  // Get stored token
  const getToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem("auth-token");
    }
    return null;
  };

  // Set token in localStorage
  const setToken = (token: string, expiresIn: number) => {
    if (process.client) {
      localStorage.setItem("auth-token", token);
      const expiryTime = Date.now() + expiresIn * 1000;
      localStorage.setItem("auth-token-expiry", expiryTime.toString());
    }
  };

  // Remove token from localStorage
  const removeToken = () => {
    if (process.client) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-token-expiry");
    }
  };

  // Check if token is expired
  const isTokenExpired = (): boolean => {
    if (process.client) {
      const expiry = localStorage.getItem("auth-token-expiry");
      if (!expiry) return true;
      return Date.now() > parseInt(expiry);
    }
    return true;
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      isLoading.value = true;

      const response = await $fetch<AuthResponse>(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      user.value = response.user;
      setToken(response.access_token, response.expiresIn);

      // Redirect to dashboard after successful login
      await navigateTo("/", { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(
        error.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint if it exists
      const token = getToken();
      if (token) {
        await $fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {
          // Ignore errors on logout endpoint
        });
      }
    } finally {
      user.value = null;
      removeToken();
      await navigateTo("/login");
    }
  };

  // Initialize user from token
  const initializeAuth = async (): Promise<void> => {
    const token = getToken();
    if (!token || isTokenExpired()) {
      await logout();
      return;
    }

    try {
      const response = await $fetch<{ user: User }>(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      user.value = response.user;
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      await logout();
    }
  };

  // Check authentication status
  const checkAuth = (): boolean => {
    const token = getToken();
    return !!(token && !isTokenExpired());
  };

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    login,
    logout,
    initializeAuth,
    checkAuth,
    getToken,
  };
};
