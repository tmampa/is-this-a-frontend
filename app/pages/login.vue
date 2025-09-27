<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="avatar placeholder mb-4">
          <div class="bg-[#458C7F] text-neutral-content rounded-full w-20">
            <span class="text-3xl">📚</span>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-base-content">Library Admin</h1>
        <p class="text-base-content/70 mt-2">Sign in to manage your library</p>
      </div>

      <!-- Login Form -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-6 justify-center">Sign In</h2>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email Field -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium"
                  >Email <span class="text-error">*</span></span
                >
              </label>
              <div class="relative">
                <input
                  v-model="credentials.email"
                  type="email"
                  class="input input-bordered w-full pr-10"
                  :class="{ 'input-error': errors.email }"
                  placeholder="Enter your email"
                  required
                  :disabled="isLoading"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg
                    class="h-5 w-5 text-base-content/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
              <label v-if="errors.email" class="label">
                <span class="label-text-alt text-error">{{
                  errors.email
                }}</span>
              </label>
            </div>

            <!-- Password Field -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium"
                  >Password <span class="text-error">*</span></span
                >
              </label>
              <div class="relative">
                <input
                  v-model="credentials.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="input input-bordered w-full pr-10"
                  :class="{ 'input-error': errors.password }"
                  placeholder="Enter your password"
                  required
                  :disabled="isLoading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  :disabled="isLoading"
                >
                  <svg
                    v-if="showPassword"
                    class="h-5 w-5 text-base-content/40 hover:text-base-content/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-5 w-5 text-base-content/40 hover:text-base-content/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
              <label v-if="errors.password" class="label">
                <span class="label-text-alt text-error">{{
                  errors.password
                }}</span>
              </label>
            </div>

            <!-- Remember Me -->
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  :disabled="isLoading"
                />
                <span class="label-text">Remember me</span>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="loginError" class="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{{ loginError }}</span>
            </div>

            <!-- Login Button -->
            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn bg-[#458C7F] hover:bg-[#3a7268] border-[#458C7F] hover:border-[#3a7268] text-white"
                :class="{ loading: isLoading }"
                :disabled="isLoading || !isFormValid"
              >
                <span v-if="isLoading" class="loading loading-spinner"></span>
                {{ isLoading ? "Signing In..." : "Sign In" }}
              </button>
            </div>
          </form>

          <!-- Demo Credentials -->
          <div class="divider">Demo Credentials</div>
          <div class="bg-base-200 p-4 rounded-lg text-sm">
            <p class="font-medium mb-2">For testing purposes:</p>
            <p><strong>Email:</strong> admin@library.com</p>
            <p><strong>Password:</strong> admin123</p>
            <button
              @click="fillDemoCredentials"
              class="btn btn-outline btn-sm mt-2"
              :disabled="isLoading"
            >
              Use Demo Credentials
            </button>
          </div>

          <!-- Help Text -->
          <div class="text-center mt-4">
            <p class="text-sm text-base-content/60">
              Need help? Contact your system administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginCredentials } from "~/types/books";

// Set page layout to none (no sidebar/navbar for login)
definePageMeta({
  layout: false,
  middleware: [],
});

// Page metadata
useSeoMeta({
  title: "Login - Library Admin",
  description: "Sign in to access the library management system",
});

// Auth composable
const { login, isLoading } = useAuth();

// Form state
const credentials = ref<LoginCredentials>({
  email: "",
  password: "",
});

const showPassword = ref(false);
const rememberMe = ref(false);
const loginError = ref("");

// Form validation
const errors = ref({
  email: "",
  password: "",
});

const isFormValid = computed(() => {
  return (
    credentials.value.email.trim() !== "" &&
    credentials.value.password.trim() !== "" &&
    !errors.value.email &&
    !errors.value.password
  );
});

// Validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Real-time validation
watch(
  () => credentials.value.email,
  (newEmail) => {
    if (newEmail && !validateEmail(newEmail)) {
      errors.value.email = "Please enter a valid email address";
    } else {
      errors.value.email = "";
    }
  }
);

watch(
  () => credentials.value.password,
  (newPassword) => {
    if (newPassword && newPassword.length < 6) {
      errors.value.password = "Password must be at least 6 characters";
    } else {
      errors.value.password = "";
    }
  }
);

// Handle form submission
const handleLogin = async () => {
  loginError.value = "";

  // Validate form
  if (!validateEmail(credentials.value.email)) {
    errors.value.email = "Please enter a valid email address";
    return;
  }

  if (credentials.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
    return;
  }

  try {
    await login(credentials.value);
    // Navigation is handled in the login composable
  } catch (error: any) {
    loginError.value = error.message || "Login failed. Please try again.";
  }
};

// Fill demo credentials
const fillDemoCredentials = () => {
  credentials.value.email = "admin@library.com";
  credentials.value.password = "admin123";
};

// Check if already authenticated and redirect
onMounted(() => {
  const { checkAuth } = useAuth();
  if (checkAuth()) {
    navigateTo("/admin/books");
  }
});
</script>

<style scoped>
/* Custom focus styles for better accessibility */
.input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(69, 140, 127, 0.1);
}

.checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(69, 140, 127, 0.1);
}

/* Loading animation */
.loading {
  pointer-events: none;
}

/* Demo credentials box styling */
.bg-base-200 {
  border: 1px solid rgba(69, 140, 127, 0.1);
}
</style>
