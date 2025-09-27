<template>
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-15">
    <div class="stats shadow-sm bg-base-100">
      <div class="stat">
        <div class="stat-title">Total Borrowed</div>
        <div class="stat-value text-primary">{{ borrowedBooks.length }}</div>
        <div class="stat-desc">Active borrowings</div>
      </div>
    </div>

    <div class="stats shadow-sm bg-base-100">
      <div class="stat">
        <div class="stat-title">Overdue Books</div>
        <div class="stat-value text-error">
          {{ borrowedBooks.filter((b) => isOverdue(b.dueDate)).length }}
        </div>
        <div class="stat-desc">Need attention</div>
      </div>
    </div>

    <div class="stats shadow-sm bg-base-100">
      <div class="stat">
        <div class="stat-title">Due This Week</div>
        <div class="stat-value text-warning">
          {{ borrowedBooks.filter((b) => isDueThisWeek(b.dueDate)).length }}
        </div>
        <div class="stat-desc">Coming up</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { LibraryAPI } from "~/composables/useLibraryAPI";
import type { BorrowedBook } from "~/types/books";

const loading = ref(false);
const borrowedBooks = ref<BorrowedBook[]>([]);

const fetchBorrowedBooks = async () => {
  loading.value = true;
  try {
    borrowedBooks.value = await LibraryAPI.getBorrowRecords();
  } catch (error) {
    console.error("Failed to fetch borrowed books:", error);
  } finally {
    loading.value = false;
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
