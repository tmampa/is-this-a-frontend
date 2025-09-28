<template>
  <div class="p-8">
    <h1>Debug Authentication</h1>

    <div class="space-y-4">
      <div><strong>Is Authenticated:</strong> {{ isAuthenticated }}</div>

      <div><strong>User:</strong> {{ user }}</div>

      <div>
        <strong>LocalStorage (client-side):</strong> {{ localStorageData }}
      </div>

      <button @click="testLogin" class="btn btn-primary">Test Login</button>
      <button @click="testLogout" class="btn btn-secondary">Test Logout</button>
      <button @click="testNavigation" class="btn btn-accent">
        Test Navigate to Index
      </button>
      <button @click="refreshAuth" class="btn btn-info">
        Refresh Auth State
      </button>

      <div class="mt-4">
        <strong>Navigation Result:</strong> {{ navigationResult }}
      </div>

      <div class="mt-4"><strong>Current Route:</strong> {{ $route.path }}</div>
    </div>
  </div>
</template>

<script setup>
const { user, isAuthenticated, login, logout, initAuth, checkAuth } = useAuth();

const localStorageData = ref(null);
const navigationResult = ref("");

// Check localStorage on client side
onMounted(() => {
  refreshAuth();
});

const refreshAuth = () => {
  if (process.client) {
    localStorageData.value = localStorage.getItem("auth-user");
  }
  initAuth();
  const authStatus = checkAuth();
  navigationResult.value = `Auth check result: ${authStatus}`;
};

const testLogin = async () => {
  try {
    await login({ username: "admin", password: "admin123" });
    navigationResult.value = "Login successful";
    refreshAuth();
  } catch (error) {
    navigationResult.value = "Login failed: " + error.message;
  }
};

const testLogout = () => {
  logout();
  refreshAuth();
  navigationResult.value = "Logged out";
};

const testNavigation = async () => {
  try {
    // First check if authenticated
    if (checkAuth()) {
      await navigateTo("/");
      navigationResult.value = "Navigation to index attempted (authenticated)";
    } else {
      navigationResult.value = "Not authenticated, cannot navigate";
    }
  } catch (error) {
    navigationResult.value = "Navigation failed: " + error.message;
  }
};
</script>
