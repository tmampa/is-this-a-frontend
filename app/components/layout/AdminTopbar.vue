<template>
  <div class="navbar bg-base-100 border-b border-base-200 h-16">
    <div class="flex-none lg:hidden">
      <label for="admin-drawer" class="btn btn-ghost btn-sm px-2">
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
          ></path>
        </svg>
      </label>
    </div>

    <div class="flex-1 px-4">
      <div class="form-control flex-1 max-w-lg">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search..."
            class="input input-sm input-bordered w-full pl-10 focus:outline-none"
          />
          <button
            class="btn btn-ghost btn-sm absolute left-0 top-0 bottom-0"
            @click="handleSearch"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              src="https://api.dicebear.com/7.x/initials/svg?seed=Admin"
              alt="profile"
            />
          </div>
        </label>
        <ul
          tabindex="0"
          class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li><a @click="navigateTo('/admin/profile')">Profile</a></li>
          <li><a @click="navigateTo('/admin/settings')">Settings</a></li>
          <li><a @click="handleLogout">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const searchQuery = ref("");

const emit = defineEmits<{
  (e: "search", query: string): void;
}>();

function handleSearch() {
  emit("search", searchQuery.value);
}

function navigateTo(path: string) {
  // Will implement navigation logic here
}

function handleLogout() {
  // Will implement logout logic here
}
</script>
