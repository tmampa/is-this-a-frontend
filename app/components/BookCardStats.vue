<template>
  <!-- Stats Cards -->
  <div class="container-fluid">
    <div class="row g-4 mb-5" style="margin-top: 60px">
      <div class="col-lg-4 col-md-6">
        <div class="stats-card stats-card-primary">
          <div class="card-body">
            <!-- <div class="stats-icon bg-primary">
              <i class="bi bi-book-fill"></i>
            </div> -->
            <div class="stats-content">
              <h6 class="stats-label">Total Borrowed</h6>
              <h2 class="stats-value" style="color: #f25c05">
                {{ borrowedBooks.length }}
              </h2>
              <p class="stats-description">Active borrowings</p>
            </div>
          </div>
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
                {{
                  borrowedBooks.filter((b) => isDueThisWeek(b.dueDate)).length
                }}
              </h2>
              <p class="stats-description">Coming up</p>
            </div>
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
/* Minimal Modern Card Styling */
.stats-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.card-body {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Icon Styling */
.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.bg-primary {
  background-color: #3b82f6;
}

.bg-danger {
  background-color: #ef4444;
}

.bg-warning {
  background-color: #f59e0b;
}

/* Content Styling */
.stats-content {
  flex: 1;
}

.stats-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stats-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Color variations */
.text-primary {
  color: #3b82f6 !important;
}

.text-danger {
  color: #ef4444 !important;
}

.text-warning {
  color: #f59e0b !important;
}

/* Responsive Design */
@media (max-width: 767.98px) {
  .card-body {
    padding: 1.25rem;
  }

  .stats-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .stats-value {
    font-size: 1.75rem;
  }
}

@media (max-width: 575.98px) {
  .card-body {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .stats-value {
    font-size: 1.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .stats-card {
    background: #1f2937;
    border-color: #374151;
  }

  .stats-label,
  .stats-description {
    color: #9ca3af;
  }
}
</style>
