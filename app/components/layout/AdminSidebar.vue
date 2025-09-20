<template>
  <aside class="w-72 h-full bg-base-100 shadow-lg">
    <!-- Header -->
    <div class="px-6 h-16 flex items-center border-b border-base-200">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-primary-content"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
            />
          </svg>
        </div>
        <h1 class="text-lg font-bold text-base-content">Library Admin</h1>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="px-3 py-4">
      <ul class="space-y-1">
        <li v-for="item in navigationItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium hover:bg-base-200"
            :class="{
              'bg-primary text-primary-content shadow-sm hover:bg-primary/90':
                isActivePath(item.path),
              'text-base-content/70 hover:text-base-content': !isActivePath(
                item.path
              ),
            }"
            @click="$emit('navigate')"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 flex-shrink-0"
              :class="{
                'opacity-100': isActivePath(item.path),
                'opacity-70': !isActivePath(item.path),
              }"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="absolute bottom-4 left-3 right-3">
      <div class="text-xs text-base-content/40 text-center py-2">
        Library Management v1.0
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const emit = defineEmits<{
  navigate: [];
}>();

const navigationItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: defineComponent({
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      `,
    }),
  },
  {
    label: "Books",
    path: "/admin/books",
    icon: defineComponent({
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
        </svg>
      `,
    }),
  },
  {
    label: "Students",
    path: "/admin/students",
    icon: defineComponent({
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      `,
    }),
  },
  {
    label: "Borrowed Books",
    path: "/admin/borrowed",
    icon: defineComponent({
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          <path d="M16 8l-8 8"></path>
          <path d="M8 8l8 8"></path>
        </svg>
      `,
    }),
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: defineComponent({
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      `,
    }),
  },
];

function isActivePath(path: string) {
  if (path === "/admin") {
    return route.path === "/admin" || route.path === "/admin/";
  }
  return route.path.startsWith(path);
}
</script>

<style scoped>
.active {
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}
</style>
