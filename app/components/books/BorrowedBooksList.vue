<template>
  <div class="modern-table-container">
    <div class="table-responsive">
      <table class="table modern-table mb-0">
        <thead class="modern-thead">
          <tr>
            <th class="fw-semibold"><i class="bi bi-book me-2"></i>Book</th>
            <th class="fw-semibold">
              <i class="bi bi-person me-2"></i>Student
            </th>
            <th class="fw-semibold">
              <i class="bi bi-calendar-check me-2"></i>Borrowed
            </th>
            <th class="fw-semibold">
              <i class="bi bi-calendar-x me-2"></i>Due Date
            </th>
            <th class="fw-semibold text-center">
              <i class="bi bi-gear me-2"></i>Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in paginatedBooks" :key="book.id" class="modern-row">
            <td class="book-title">
              <div class="fw-medium text-dark">{{ book.bookTitle }}</div>
            </td>
            <td class="student-name">
              <div class="d-flex align-items-center">
                <div class="student-avatar me-2">
                  {{ book.studentName.charAt(0).toUpperCase() }}
                </div>
                <span class="fw-medium">{{ book.studentName }}</span>
              </div>
            </td>
            <td class="borrow-date">
              <span class="date-badge">{{ formatDate(book.borrowDate) }}</span>
            </td>
            <td class="due-date">
              <span :class="getDueDateClass(book.dueDate)" class="date-badge">
                {{ formatDate(book.dueDate) }}
                <i
                  v-if="isOverdue(book.dueDate)"
                  class="bi bi-exclamation-triangle ms-1"
                ></i>
                <i
                  v-else-if="isDueThisWeek(book.dueDate)"
                  class="bi bi-clock ms-1"
                ></i>
              </span>
            </td>
            <td class="text-center actions-cell">
              <div class="btn-group" role="group">
                <button
                  @click="showDetails(book)"
                  class="btn btn-sm btn-outline-primary action-btn"
                  title="View Details"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  @click="$emit('return-book', book)"
                  class="btn btn-sm btn-outline-success action-btn"
                  title="Return Book"
                >
                  <i class="bi bi-arrow-return-left"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="books.length === 0" class="empty-state">
      <div class="text-center py-5">
        <i class="bi bi-book display-1 text-muted opacity-25"></i>
        <h5 class="text-muted mt-3">No borrowed books</h5>
        <p class="text-muted">
          There are currently no active loans in the system.
        </p>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="books.length > itemsPerPage" class="pagination-container">
      <nav aria-label="Table pagination">
        <div class="d-flex justify-content-between align-items-center">
          <!-- Pagination Info -->
          <div class="pagination-info">
            <small class="text-muted">
              Showing {{ startIndex + 1 }} to {{ endIndex }} of
              {{ books.length }} entries
            </small>
          </div>

          <!-- Pagination Controls -->
          <div class="pagination-controls">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn btn-sm btn-outline-secondary me-2"
              title="Previous Page"
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <span class="pagination-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="{
                  'btn-primary': page === currentPage,
                  'btn-outline-secondary': page !== currentPage,
                }"
                class="btn btn-sm me-1"
              >
                {{ page }}
              </button>
            </span>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="btn btn-sm btn-outline-secondary ms-2"
              title="Next Page"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </nav>
    </div>

    <!-- Details Modal -->
    <div
      class="modal fade"
      id="bookDetailsModal"
      tabindex="-1"
      aria-labelledby="bookDetailsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bookDetailsModalLabel">
              Borrow Details
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body" v-if="selectedBook">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="card bg-light">
                  <div class="card-body">
                    <h6 class="card-title">Book Information</h6>
                    <div class="row mb-2">
                      <div class="col-3 text-muted small">Title:</div>
                      <div class="col-9 fw-medium">
                        {{ selectedBook.bookTitle }}
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-3 text-muted small">Student:</div>
                      <div class="col-9 fw-medium">
                        {{ selectedBook.studentName }}
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-3 text-muted small">Borrow Date:</div>
                      <div class="col-9">
                        {{ formatDate(selectedBook.borrowDate) }}
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-3 text-muted small">Due Date:</div>
                      <div
                        class="col-9"
                        :class="
                          isOverdue(selectedBook.dueDate) ? 'text-danger' : ''
                        "
                      >
                        {{ formatDate(selectedBook.dueDate) }}
                      </div>
                    </div>
                    <div v-if="selectedBook.returnDate" class="row mb-2">
                      <div class="col-3 text-muted small">Return Date:</div>
                      <div class="col-9 text-success">
                        {{ formatDate(selectedBook.returnDate) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <h6 class="fw-medium mb-3">Condition Images</h6>
                <div class="row g-3">
                  <div class="col-6">
                    <p class="text-muted small mb-2">Before Condition Images</p>
                    <div class="row g-2">
                      <div
                        v-for="(
                          image, index
                        ) in selectedBook.beforeConditionImages"
                        :key="`before-${index}`"
                        class="col-6"
                      >
                        <img
                          :src="image"
                          :alt="`Before condition ${index + 1}`"
                          class="img-fluid rounded"
                          style="aspect-ratio: 4/3; object-fit: cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="selectedBook.afterConditionImages?.length > 0"
                    class="col-6"
                  >
                    <p class="text-muted small mb-2">After Condition Images</p>
                    <div class="row g-2">
                      <div
                        v-for="(
                          image, index
                        ) in selectedBook.afterConditionImages"
                        :key="`after-${index}`"
                        class="col-6"
                      >
                        <img
                          :src="image"
                          :alt="`After condition ${index + 1}`"
                          class="img-fluid rounded"
                          style="aspect-ratio: 4/3; object-fit: cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="selectedBook.conditionNotes"
              class="mt-4 pt-3 border-top"
            >
              <h6 class="fw-medium mb-2">Condition Notes</h6>
              <p class="text-muted small">
                {{ selectedBook.conditionNotes }}
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { BorrowedBook } from "~/types/books";

const props = defineProps<{
  books: BorrowedBook[];
}>();

defineEmits<{
  (e: "return-book", book: BorrowedBook): void;
}>();

// State
const selectedBook = ref<BorrowedBook | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Pagination Computed Properties
const totalPages = computed(() => {
  return Math.ceil(props.books.length / itemsPerPage.value);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage.value;
  return Math.min(end, props.books.length);
});

const paginatedBooks = computed(() => {
  return props.books.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Pagination Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Utils
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

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

const getStatusBadgeClass = (status: "borrowed" | "returned") => {
  return {
    "badge-success bg-success/20 text-success border-0": status === "returned",
    "badge-warning bg-warning/20 text-warning border-0": status === "borrowed",
  };
};

const getDueDateClass = (dueDate: string) => {
  if (isOverdue(dueDate)) {
    return "overdue-badge";
  } else if (isDueThisWeek(dueDate)) {
    return "due-soon-badge";
  }
  return "normal-badge";
};

// Handlers
const showDetails = (book: BorrowedBook) => {
  selectedBook.value = book;
  // Use data-bs-toggle approach or manual modal show
  const modalElement = document.getElementById("bookDetailsModal");
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }
};
</script>

<style scoped>
/* Modern Table Container */
.modern-table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

/* Modern Table Header */
.modern-thead {
  background: linear-gradient(135deg, #f25c05 0%, #e84d02 100%);
  color: white;
}

.modern-thead th {
  border: none;
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  position: relative;
}

.modern-thead th:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

/* Modern Table Body */
.modern-table {
  margin: 0;
}

.modern-row {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.modern-row:hover {
  background-color: rgba(242, 92, 5, 0.02);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.modern-row td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
  border: none;
}

/* Student Avatar */
.student-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f25c05 0%, #e84d02 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

/* Date Badges */
.date-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

.normal-badge {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.due-soon-badge {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.overdue-badge {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Action Buttons */
.actions-cell {
  width: 120px;
}

.action-btn {
  border-radius: 8px;
  border-width: 1.5px;
  padding: 0.375rem 0.5rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary.action-btn {
  border-color: #f25c05;
  color: #f25c05;
}

.btn-outline-primary.action-btn:hover {
  background-color: #f25c05;
  border-color: #f25c05;
}

/* Empty State */
.empty-state {
  padding: 2rem;
}

/* Pagination Styles */
.pagination-container {
  padding: 1rem 1.25rem;
  border-top: 1px solid #f3f4f6;
  background: #fafbfc;
}

.pagination-info {
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-numbers {
  display: flex;
  align-items: center;
}

.pagination-controls .btn {
  border-radius: 8px;
  font-weight: 500;
  min-width: 36px;
  transition: all 0.2s ease;
}

.pagination-controls .btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-controls .btn-primary {
  background-color: #f25c05;
  border-color: #f25c05;
}

.pagination-controls .btn-primary:hover {
  background-color: #e84d02;
  border-color: #e84d02;
}

.pagination-controls .btn:disabled {
  opacity: 0.4;
  transform: none !important;
  box-shadow: none !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-thead th,
  .modern-row td {
    padding: 0.75rem 0.5rem;
  }

  .student-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }

  .date-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .actions-cell {
    width: auto;
  }

  /* Pagination responsive */
  .pagination-container {
    padding: 0.75rem 1rem;
  }

  .pagination-container .d-flex {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .btn-group .action-btn {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .pagination-controls {
    justify-content: center;
  }

  .pagination-numbers .btn {
    min-width: 32px;
    font-size: 0.875rem;
  }
}
</style>
