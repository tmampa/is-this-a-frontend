<template>
  <div class="drawer lg:drawer-open bg-base-100">
    <!-- Drawer toggle for mobile -->
    <input id="admin-drawer" type="checkbox" class="drawer-toggle" />

    <!-- Page content -->
    <div class="drawer-content flex flex-col bg-base-100">
      <!-- Topbar -->
      <AdminTopbar @search="handleSearch" />

      <!-- Main content area -->
      <div class="flex-1 p-4 md:p-6 lg:p-8 bg-base-100">
        <!-- Router view will go here -->
        <slot />
      </div>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side">
      <label for="admin-drawer" class="drawer-overlay"></label>
      <AdminSidebar />
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminTopbar from "~/components/layout/AdminTopbar.vue";
import AdminSidebar from "~/components/layout/AdminSidebar.vue";

function handleSearch(query: string) {
  // Will implement search logic here
  console.log("Search query:", query);
}
</script>
