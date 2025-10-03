// Authentication composable with API integration

// Type definitions
interface LoginResponse {
  user?: {
    id: number;
    username: string;
    name: string;
    email: string;
  };
  access_token?: string;
  message?: string;
  userType: string;
}

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  access_token?: string;
  role: string;
}

export const useAuth = () => {
  // Reactive state
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = ref(false);

  const basePath: string = "http://52.188.184.166:8080/api/auth";

  // Login with API call
  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true;

    try {
      // Make API call to your backend
      const response = await $fetch<LoginResponse>(`${basePath}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          ...credentials,
        },
      });

      console.log("Login response:", response);

      // Store user in localStorage and reactive state
      if (process.client) {
        localStorage.setItem("auth-user", JSON.stringify(response));
        // Store token separately for API calls
        if (response.access_token) {
          localStorage.setItem("auth-token", response.access_token);
        }
      }

      // get user data after sucessful login
      const userResponse: any = await authenticatedFetch(`${basePath}/details`);

      // If API call is successful, store user data
      const userData: User = {
        id: userResponse.id || 1,
        username: userResponse.username || credentials.email,
        name: response.user?.name || credentials.email,
        email: response.user?.email || credentials.email,
        access_token: response.access_token || undefined,
        role: response.userType,
      };

      user.value = userData;

      console.log("Login successful, user data stored");
      return { success: true, user: userData };
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different error scenarios
      if (error.status === 401) {
        throw new Error("Invalid username or password");
      } else if (error.status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(
          "Login failed. Please check your connection and try again."
        );
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function with API call
  const logout = async () => {
    isLoading.value = true;

    try {
      // Get token for logout API call
      const token = process.client ? localStorage.getItem("auth-token") : null;

      // Call logout endpoint if token exists
      if (token) {
        try {
          await $fetch(`${basePath}/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.warn(
            "Logout API call failed, but continuing with local logout:",
            error
          );
        }
      }

      // Clear local storage and state
      if (process.client) {
        localStorage.removeItem("auth-user");
        localStorage.removeItem("auth-token");
      }
      user.value = null;

      console.log("Logout successful");
      navigateTo("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force local logout even if API fails
      if (process.client) {
        localStorage.removeItem("auth-user");
        localStorage.removeItem("auth-token");
      }
      user.value = null;
      navigateTo("/login");
    } finally {
      isLoading.value = false;
    }
  };

  // Get auth token for API calls
  const getAuthToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem("auth-token");
    }
    return null;
  };

  // Create authenticated fetch wrapper
  const authenticatedFetch = async (url: string, options: any = {}) => {
    const token = getAuthToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await $fetch(url, {
        ...options,
        headers,
      });
      return response;
    } catch (error: any) {
      // If unauthorized, logout user
      if (error.status === 401) {
        console.warn("Authentication expired, logging out");
        await logout();
      }
      throw error;
    }
  };

  // Initialize from localStorage
  const initAuth = () => {
    if (process.client) {
      const userData = localStorage.getItem("auth-user");
      if (userData) {
        try {
          user.value = JSON.parse(userData) as User;
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("auth-user");
          localStorage.removeItem("auth-token");
        }
      }
    }
  };

  // Check if user is authenticated
  const checkAuth = (): boolean => {
    // First check if user is already in memory
    if (user.value) {
      return true;
    }

    // If not, try to initialize from localStorage
    if (process.client) {
      const userData = localStorage.getItem("auth-user");
      if (userData) {
        try {
          user.value = JSON.parse(userData) as User;
          return true;
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("auth-user");
          localStorage.removeItem("auth-token");
          return false;
        }
      }
    }

    return false;
  };

  // Refresh user profile from API
  const refreshUser = async () => {
    try {
      const response = await authenticatedFetch(`${basePath}/details`);
      if (response && typeof response === "object" && "user" in response) {
        const apiResponse = response as { user: User };
        user.value = apiResponse.user;

        if (process.client) {
          localStorage.setItem("auth-user", JSON.stringify(apiResponse.user));
        }
        return apiResponse.user;
      }
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
      throw error;
    }
  };

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    login,
    logout,
    initAuth,
    checkAuth,
    getAuthToken,
    authenticatedFetch,
    refreshUser,
  };
};
