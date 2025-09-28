// Basic Authentication composable

export const useAuth = () => {
  // Reactive state
  const user = ref<any | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = ref(false);

  // Simple login - just check hardcoded credentials
  const login = async (credentials: { username: string; password: string }) => {
    isLoading.value = true;

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Basic hardcoded credentials check
      if (
        credentials.username === "admin" &&
        credentials.password === "admin123"
      ) {
        const userData = {
          id: 1,
          username: "admin",
          name: "Library Admin",
        };

        // Store user in localStorage and reactive state
        if (process.client) {
          localStorage.setItem("auth-user", JSON.stringify(userData));
        }
        user.value = userData;

        console.log("Login successful, user data stored");
        // Navigation will be handled by the login page
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = () => {
    if (process.client) {
      localStorage.removeItem("auth-user");
    }
    user.value = null;
    navigateTo("/login");
  };

  // Initialize from localStorage
  const initAuth = () => {
    if (process.client) {
      const userData = localStorage.getItem("auth-user");
      if (userData) {
        user.value = JSON.parse(userData);
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
          user.value = JSON.parse(userData);
          return true;
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("auth-user");
          return false;
        }
      }
    }

    return false;
  };

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    login,
    logout,
    initAuth,
    checkAuth,
  };
};
