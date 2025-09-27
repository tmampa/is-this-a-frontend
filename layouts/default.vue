<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navigation -->
    <NavBar />

    <!-- Main Content -->
    <main class="lg:ml-64">
      <div class="p-4 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
// Initialize authentication on app load
const { initializeAuth } = useAuth();

onMounted(async () => {
  await initializeAuth();
});
</script>
