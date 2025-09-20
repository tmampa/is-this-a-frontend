<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="text-center py-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">
        Library Admin Dashboard
      </h1>
      <p class="text-base-content/60">
        Welcome to your library management system
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stats shadow-sm bg-base-100">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
              ></path>
            </svg>
          </div>
          <div class="stat-title">Total Books</div>
          <div class="stat-value text-primary">1,247</div>
          <div class="stat-desc">21% more than last month</div>
        </div>
      </div>

      <div class="stats shadow-sm bg-base-100">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-title">Students</div>
          <div class="stat-value text-secondary">356</div>
          <div class="stat-desc">↗︎ 12 new this week</div>
        </div>
      </div>

      <div class="stats shadow-sm bg-base-100">
        <div class="stat">
          <div class="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
              ></path>
              <path d="M16 8l-8 8"></path>
              <path d="M8 8l8 8"></path>
            </svg>
          </div>
          <div class="stat-title">Borrowed</div>
          <div class="stat-value text-accent">89</div>
          <div class="stat-desc">Currently checked out</div>
        </div>
      </div>

      <div class="stats shadow-sm bg-base-100">
        <div class="stat">
          <div class="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <div class="stat-title">Overdue</div>
          <div class="stat-value text-warning">7</div>
          <div class="stat-desc">Need attention</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-base-100 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          to="/admin/borrowed"
          class="btn btn-outline btn-primary justify-start gap-3 h-auto py-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
          <div class="text-left">
            <div class="font-medium">Borrow Book</div>
            <div class="text-xs opacity-60">Create new borrowing</div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/books"
          class="btn btn-outline btn-secondary justify-start gap-3 h-auto py-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
            ></path>
          </svg>
          <div class="text-left">
            <div class="font-medium">Add Book</div>
            <div class="text-xs opacity-60">Add to collection</div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/students"
          class="btn btn-outline btn-accent justify-start gap-3 h-auto py-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div class="text-left">
            <div class="font-medium">Add Student</div>
            <div class="text-xs opacity-60">Register new student</div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/admin/borrowed"
          class="btn btn-outline btn-warning justify-start gap-3 h-auto py-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 12l2 2 4-4"></path>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
          </svg>
          <div class="text-left">
            <div class="font-medium">Return Book</div>
            <div class="text-xs opacity-60">Process returns</div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-base-100 rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      <div class="space-y-3">
        <div
          class="flex items-center gap-3 p-3 hover:bg-base-50 rounded-lg transition-colors"
        >
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <div class="flex-1">
            <p class="text-sm">
              <strong>John Doe</strong> borrowed <em>The Great Gatsby</em>
            </p>
            <p class="text-xs text-base-content/60">2 hours ago</p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 p-3 hover:bg-base-50 rounded-lg transition-colors"
        >
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div class="flex-1">
            <p class="text-sm">
              <strong>Jane Smith</strong> returned <em>1984</em>
            </p>
            <p class="text-xs text-base-content/60">4 hours ago</p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 p-3 hover:bg-base-50 rounded-lg transition-colors"
        >
          <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
          <div class="flex-1">
            <p class="text-sm">
              New book <em>To Kill a Mockingbird</em> added to collection
            </p>
            <p class="text-xs text-base-content/60">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This will be the main dashboard page
</script>
