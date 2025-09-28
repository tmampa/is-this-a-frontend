<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navigation -->
    <NavBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen pt-16 lg:pt-0">
      <div class="p-4 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
// Initialize auth from localStorage
const { initAuth } = useAuth();

onMounted(() => {
  initAuth();
});
</script>
