<template>
  <div class="drawer lg:drawer-open bg-base-50 min-h-screen">
    <!-- Drawer toggle for mobile -->
    <input
      id="admin-drawer"
      type="checkbox"
      class="drawer-toggle"
      ref="drawerToggle"
    />

    <!-- Page content -->
    <div class="drawer-content flex flex-col">
      <!-- Topbar -->
      <AdminTopbar @search="handleSearch" @toggle-sidebar="toggleSidebar" />

      <!-- Main content area -->
      <main class="flex-1 bg-base-50">
        <div class="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
          <NuxtPage />
        </div>
      </main>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side z-40">
      <label
        for="admin-drawer"
        class="drawer-overlay"
        @click="closeSidebar"
      ></label>
      <AdminSidebar @navigate="closeSidebar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AdminTopbar from "~/components/layout/AdminTopbar.vue";
import AdminSidebar from "~/components/layout/AdminSidebar.vue";

const drawerToggle = ref<HTMLInputElement>();

function handleSearch(query: string) {
  // Will implement search logic here
  console.log("Search query:", query);
}

function toggleSidebar() {
  if (drawerToggle.value) {
    drawerToggle.value.checked = !drawerToggle.value.checked;
  }
}

function closeSidebar() {
  if (drawerToggle.value) {
    drawerToggle.value.checked = false;
  }
}
</script>
