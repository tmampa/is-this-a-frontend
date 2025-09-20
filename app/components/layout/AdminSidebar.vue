<template>
  <div class="w-72 h-full bg-base-100 border-r border-base-200">
    <div class="px-6 h-16 flex items-center border-b border-base-200">
      <h1 class="text-lg font-semibold tracking-wide text-base-content/90">
        Library Admin
      </h1>
    </div>

    <ul class="menu px-4 py-6 gap-2 text-base-content/75 text-sm">
      <li v-for="item in navigationItems" :key="item.path">
        <NuxtLink
          :to="item.path"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-base-200"
          :class="{
            'bg-primary/10 text-primary hover:bg-primary/15': isCurrentPath(
              item.path
            ),
          }"
        >
          <component :is="item.icon" class="opacity-75" />
          <span class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

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

function isCurrentPath(path: string) {
  return route.path === path;
}
</script>

<style scoped>
.active {
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}
</style>
