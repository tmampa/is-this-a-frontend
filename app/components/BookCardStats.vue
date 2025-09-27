<template>
  <!-- Stats Cards -->
  <div class="row g-4 mb-4">
    <div class="col-md-4">
      <div class="card h-100 border-primary border-opacity-25">
        <div class="card-body text-center">
          <div class="d-flex justify-content-center mb-3">
            <div class="bg-primary bg-opacity-10 p-3 rounded-circle">
              <i class="bi bi-book text-primary fs-2"></i>
            </div>
          </div>
          <h5 class="card-title text-muted mb-1">Total Borrowed</h5>
          <h2 class="text-primary fw-bold mb-2">{{ borrowedBooks.length }}</h2>
          <p class="card-text text-muted small mb-0">Active borrowings</p>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card h-100 border-danger border-opacity-25">
        <div class="card-body text-center">
          <div class="d-flex justify-content-center mb-3">
            <div class="bg-danger bg-opacity-10 p-3 rounded-circle">
              <i class="bi bi-exclamation-triangle text-danger fs-2"></i>
            </div>
          </div>
          <h5 class="card-title text-muted mb-1">Overdue Books</h5>
          <h2 class="text-danger fw-bold mb-2">
            {{ borrowedBooks.filter((b) => isOverdue(b.dueDate)).length }}
          </h2>
          <p class="card-text text-muted small mb-0">Need attention</p>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card h-100 border-warning border-opacity-25">
        <div class="card-body text-center">
          <div class="d-flex justify-content-center mb-3">
            <div class="bg-warning bg-opacity-10 p-3 rounded-circle">
              <i class="bi bi-clock text-warning fs-2"></i>
            </div>
          </div>
          <h5 class="card-title text-muted mb-1">Due This Week</h5>
          <h2 class="text-warning fw-bold mb-2">
            {{ borrowedBooks.filter((b) => isDueThisWeek(b.dueDate)).length }}
          </h2>
          <p class="card-text text-muted small mb-0">Coming up</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
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

<style scoped>
.card {
  transition: all 0.3s ease;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 2rem 1.5rem;
}

.bg-primary.bg-opacity-10 {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-danger.bg-opacity-10 {
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.bg-warning.bg-opacity-10 {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

.rounded-circle {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Loading animation */
.card.loading {
  opacity: 0.7;
}

.card.loading .card-body {
  position: relative;
  overflow: hidden;
}

.card.loading .card-body::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .card-body {
    padding: 1.5rem 1rem;
  }
  
  .rounded-circle {
    width: 3rem;
    height: 3rem;
  }
  
  .fs-2 {
    font-size: 1.5rem !important;
  }
}
</style>
