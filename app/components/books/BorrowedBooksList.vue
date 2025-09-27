<template>
  <div class="card shadow-sm mx-4" style="margin-top: 15px">
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th class="fw-medium">Book</th>
              <th class="fw-medium">Student</th>
              <th class="fw-medium">Borrow date</th>
              <th class="fw-medium">Expected return date</th>
              <th class="fw-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>{{ book.bookTitle }}</td>
              <td>{{ book.studentName }}</td>
              <td>{{ formatDate(book.borrowDate) }}</td>
              <td>
                <span :class="isOverdue(book.dueDate) ? 'text-danger' : ''">
                  {{ formatDate(book.dueDate) }}
                </span>
              </td>
              <td class="text-center">
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-outline-secondary dropdown-toggle"
                    type="button"
                    :id="`dropdown-${book.id}`"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul
                    class="dropdown-menu"
                    :aria-labelledby="`dropdown-${book.id}`"
                  >
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="showDetails(book)"
                      >
                        <i class="bi bi-eye me-2"></i>View Details
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="$emit('return-book', book)"
                      >
                        <i class="bi bi-arrow-return-left me-2"></i>Return Book
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
                      <p class="text-muted small mb-2">
                        Before Condition Images
                      </p>
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
                      <p class="text-muted small mb-2">
                        After Condition Images
                      </p>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BorrowedBook } from "~/types/books";

const props = defineProps<{
  books: BorrowedBook[];
}>();

defineEmits<{
  (e: "return-book", book: BorrowedBook): void;
}>();

// State
const selectedBook = ref<BorrowedBook | null>(null);

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
