<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">📚 Library Login</h2>

        <form @submit.prevent="handleLogin">
          <div class="form-control mb-3">
            <label class="label">
              <span class="label-text">Username</span>
            </label>
            <input
              v-model="credentials.email"
              type="text"
              placeholder="Email"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              v-model="credentials.password"
              type="password"
              placeholder="Password"
              class="input input-bordered"
              required
            />
          </div>

          <div v-if="error" class="alert alert-error mt-4">
            <span>{{ error }}</span>
          </div>

          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary w-full"
              :class="{ loading: isLoading }"
              :disabled="isLoading"
            >
              {{ isLoading ? "Signing in..." : "Sign In" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const { login, isLoading, checkAuth, initAuth } = useAuth();

const credentials = ref({
  email: "",
  password: "",
});

const error = ref("");

// Check if user is already authenticated on mount
onMounted(() => {
  initAuth();
  if (checkAuth()) {
    // User is already authenticated, redirect to index
    navigateTo("/");
  }
});

const handleLogin = async () => {
  error.value = "";
  try {
    console.log("Attempting login with credentials:", credentials.value.email);
    await login(credentials.value);
    console.log("Login function completed successfully");

    // Force page reload to index instead of navigation
    if (process.client) {
      window.location.href = "/";
    }
  } catch (err) {
    console.error("Login failed:", err);
    error.value = err.message || "Login failed";
  }
};
</script>
