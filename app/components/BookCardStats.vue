<template>
  <!-- Stats Cards -->
  <div class="main-content grid grid-cols-1 md:grid-cols-3 gap-6 mt-15">
    <div class="stats shadow-sm bg-base-100">
      <div class="stat">
        <div class="stat-title">Total Borrowed</div>
        <div class="stat-value text-primary">{{ borrowedBooks.length }}</div>
        <div class="stat-desc">Active borrowings</div>
      </div>
    </div>

    <div class="col-lg-4 col-md-6">
      <div class="stats-card stats-card-danger">
        <div class="card-body">
          <!-- <div class="stats-icon bg-danger">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div> -->
          <div class="stats-content">
            <h6 class="stats-label">Overdue Books</h6>
            <h2 class="stats-value" style="color: #f25c05">
              {{ borrowedBooks.filter((b) => isOverdue(b.dueDate)).length }}
            </h2>
            <p class="stats-description">Need attention</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-4 col-md-6">
      <div class="stats-card stats-card-warning">
        <div class="card-body">
          <!-- <div class="stats-icon bg-warning">
              <i class="bi bi-clock-fill"></i>
            </div> -->
          <div class="stats-content">
            <h6 class="stats-label">Due This Week</h6>
            <h2 class="stats-value" style="color: #f25c05">
              {{ borrowedBooks.filter((b) => isDueThisWeek(b.dueDate)).length }}
            </h2>
            <p class="stats-description">Coming up</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { LibraryAPI } from "~/composables/useLibraryAPI";
import type { BorrowedBook } from "~/types/books";

const borrowedBooks = ref<BorrowedBook[]>([]);

const fetchBorrowedBooks = async () => {
  try {
    borrowedBooks.value = await LibraryAPI.getBorrowRecords();
  } catch (error) {
    console.error("Failed to fetch borrowed books:", error);
  }
};

// Utils
const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

const isDueThisWeek = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const weekFromNow = new Date();
  weekFromNow.setDate(today.getDate() + 7);
  return due > today && due <= weekFromNow;
};

// Initialize data on mount
onMounted(() => {
  fetchBorrowedBooks();
});
</script>

<style scoped>
@media (min-width: 1024px) {
  .main-content {
    margin-left: 280px !important;
  }
}
</style>
