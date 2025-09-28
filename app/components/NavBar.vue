<template>
  <!-- Sidebar for larger screens -->
  <div class="drawer lg:drawer-open">
    <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />

    <!-- Mobile navbar -->
    <div class="drawer-content flex flex-col">
      <div class="navbar bg-base-100 shadow-sm lg:hidden">
        <div class="navbar-start">
          <label for="drawer-toggle" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>

        <div class="navbar-center">
          <h1 class="text-lg font-semibold">Library Admin</h1>
        </div>

        <div class="navbar-end">
          <!-- User Profile Dropdown -->
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <div
                class="w-8 rounded-full bg-[#458C7F] text-white flex items-center justify-center"
              >
                <span class="text-sm font-medium">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li class="menu-title">
                <span class="text-base-content/70">{{
                  user?.name || "User"
                }}</span>
                <span class="text-xs text-base-content/50">{{
                  user?.email || ""
                }}</span>
              </li>
              <li>
                <a @click="logout" class="text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side">
      <label
        for="drawer-toggle"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div class="min-h-full w-64 bg-base-100 text-base-content flex flex-col">
        <!-- Logo/Brand -->
        <div class="flex items-center gap-3 p-6 border-b border-base-200">
          <div class="avatar placeholder">
            <div class="bg-[#458C7F] text-white rounded-lg w-10 h-10">
              <span class="text-xl">📚</span>
            </div>
          </div>
          <div>
            <h1 class="text-lg font-bold">Library Admin</h1>
            <p class="text-sm text-base-content/60">Management System</p>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4">
          <ul class="menu space-y-2">
            <!-- Dashboard -->
            <li>
              <NuxtLink
                to="/"
                class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                :class="{ 'bg-[#458C7F] text-white': $route.path === '/' }"
                active-class="bg-[#458C7F] text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </NuxtLink>
            </li>

            <!-- Books Management -->
            <li>
              <NuxtLink
                to="/books"
                class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                :class="{
                  'bg-[#458C7F] text-white': $route.path === '/books',
                }"
                active-class="bg-[#458C7F] text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Books
              </NuxtLink>
            </li>

            <!-- Students Management -->
            <li>
              <NuxtLink
                to="/students"
                class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                :class="{
                  'bg-[#458C7F] text-white': $route.path === '/students',
                }"
                active-class="bg-[#458C7F] text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Students
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- User Profile Section (Desktop) -->
        <div class="hidden lg:block p-4 border-t border-base-200">
          <div class="dropdown dropdown-top dropdown-end w-full">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost w-full justify-start p-3"
            >
              <div class="avatar placeholder">
                <div class="bg-[#458C7F] text-white rounded-full w-8 h-8">
                  <span class="text-sm font-medium">
                    {{ userInitials }}
                  </span>
                </div>
              </div>
              <div class="text-left flex-1 min-w-0">
                <p class="font-medium truncate">{{ user?.name || "User" }}</p>
                <p class="text-sm text-base-content/60 truncate">
                  {{ user?.email || "" }}
                </p>
              </div>
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content mb-2 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a @click="logout" class="text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, logout } = useAuth();

// Compute user initials for avatar
const userInitials = computed(() => {
  if (!user.value?.name) return "U";
  return user.value.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
</script>
