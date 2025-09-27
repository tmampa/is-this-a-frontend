<template>
  <!-- Stats Cards -->
  <div class="container">
    <div class="row g-4 mb-5" style="margin-top: 60px">
      <div class="col-lg-4 col-md-6">
        <div
          class="card h-100 border-0 shadow-sm stats-card stats-card-primary"
          :class="{ loading }"
        >
          <div class="card-body text-center position-relative overflow-hidden">
            <div class="stats-icon-wrapper mb-3">
              <div class="stats-icon bg-gradient-primary">
                <i class="bi bi-book-fill text-white"></i>
              </div>
            </div>
            <div class="stats-content">
              <h6
                class="text-uppercase text-muted fw-semibold mb-2 tracking-wide"
              >
                Total Borrowed
              </h6>
              <h2 class="h1 fw-bold text-primary mb-2 counter">
                {{ borrowedBooks.length }}
              </h2>
              <p class="text-muted mb-0 small">Active borrowings</p>
            </div>
            <div class="stats-decoration"></div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6">
        <div
          class="card h-100 border-0 shadow-sm stats-card stats-card-danger"
          :class="{ loading }"
        >
          <div class="card-body text-center position-relative overflow-hidden">
            <div class="stats-icon-wrapper mb-3">
              <div class="stats-icon bg-gradient-danger">
                <i class="bi bi-exclamation-triangle-fill text-white"></i>
              </div>
            </div>
            <div class="stats-content">
              <h6
                class="text-uppercase text-muted fw-semibold mb-2 tracking-wide"
              >
                Overdue Books
              </h6>
              <h2 class="h1 fw-bold text-danger mb-2 counter">
                {{ borrowedBooks.filter((b) => isOverdue(b.dueDate)).length }}
              </h2>
              <p class="text-muted mb-0 small">Need attention</p>
            </div>
            <div class="stats-decoration"></div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6">
        <div
          class="card h-100 border-0 shadow-sm stats-card stats-card-warning"
          :class="{ loading }"
        >
          <div class="card-body text-center position-relative overflow-hidden">
            <div class="stats-icon-wrapper mb-3">
              <div class="stats-icon bg-gradient-warning">
                <i class="bi bi-clock-fill text-white"></i>
              </div>
            </div>
            <div class="stats-content">
              <h6
                class="text-uppercase text-muted fw-semibold mb-2 tracking-wide"
              >
                Due This Week
              </h6>
              <h2 class="h1 fw-bold text-warning mb-2 counter">
                {{
                  borrowedBooks.filter((b) => isDueThisWeek(b.dueDate)).length
                }}
              </h2>
              <p class="text-muted mb-0 small">Coming up</p>
            </div>
            <div class="stats-decoration"></div>
          </div>
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
/* Modern Card Styling */
.stats-card {
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06);
}

.stats-card:hover::before {
  opacity: 1;
}

.stats-card-primary::before {
  color: var(--bs-primary);
}

.stats-card-danger::before {
  color: var(--bs-danger);
}

.stats-card-warning::before {
  color: var(--bs-warning);
}

.card-body {
  padding: 1.75rem 1.5rem;
}

/* Icon Styling */
.stats-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stats-icon::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.stats-card:hover .stats-icon::before {
  left: 100%;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

/* Content Styling */
.stats-content {
  position: relative;
  z-index: 2;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.counter {
  background: linear-gradient(135deg, currentColor 0%, currentColor 100%);
  -webkit-background-clip: text;
  background-clip: text;
  animation: fadeInUp 0.6s ease-out;
}

/* Decorative Element */
.stats-decoration {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* Loading State */
.stats-card.loading {
  opacity: 0.8;
}

.stats-card.loading .card-body::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer 2s infinite;
  z-index: 1;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 991.98px) {
  .card-body {
    padding: 1.5rem 1.25rem;
  }
}

@media (max-width: 767.98px) {
  .card-body {
    padding: 1.25rem 1rem;
  }

  .stats-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .h1 {
    font-size: 2rem !important;
  }
}

@media (max-width: 575.98px) {
  .stats-icon {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }

  .h1 {
    font-size: 1.75rem !important;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .stats-card {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  }

  .stats-decoration {
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 70%
    );
  }
}
</style>
