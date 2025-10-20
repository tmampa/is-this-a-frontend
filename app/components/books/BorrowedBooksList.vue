<template>
  <div
    class="main-content card bg-base-100 shadow-sm mx-5"
    style="margin-top: 15px"
  >
    <div class="overflow-x-auto rounded-box">
      <table class="table table-zebra">
        <thead style="background-color: #458c7f; color: white">
          <tr>
            <th class="font-medium">Book</th>
            <th class="font-medium">Student</th>
            <th class="font-medium">Borrow date</th>
            <th class="font-medium">Expected return date</th>
            <th class="font-medium text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in paginatedBooks" :key="book.id" class="hover">
            <td>{{ book.bookTitle }}</td>
            <td>{{ book.studentName }}</td>
            <td>{{ formatDate(book.borrowDate) }}</td>
            <td>
              <span :class="isOverdue(book.returnDate) ? 'text-error' : ''">
                {{ formatDate(book.returnDate) }}
              </span>
            </td>

            <td>
              <div class="dropdown dropdown-end">
                <div
                  tabindex="0"
                  role="button"
                  class="btn btn-sm btn-ghost btn-square"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 rounded-box z-50 w-48 p-2 shadow-lg border border-base-200"
                >
                  <li>
                    <a
                      @click="showDetails(book)"
                      class="flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      View Details
                    </a>
                  </li>
                  <li>
                    <a
                      @click="$emit('return-book', book)"
                      class="flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                        />
                      </svg>
                      Return Book
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-base-200"
    >
      <div class="text-sm text-base-content/60 mb-2 sm:mb-0">
        Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, totalBooks) }} of
        {{ totalBooks }} books
        <div
          class="tooltip tooltip-top"
          data-tip="Use pagination controls to navigate through all borrowed books"
        >
          <span class="text-xs">📚 Navigate all records</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Items per page selector -->
        <div class="flex items-center gap-2 mr-4">
          <span class="text-sm text-base-content/60">Show:</span>
          <div
            class="tooltip tooltip-top"
            data-tip="Choose how many books to display per page"
          >
            <select
              v-model="itemsPerPage"
              @change="currentPage = 1"
              class="select select-sm select-bordered"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <!-- Pagination buttons -->
        <div class="join">
          <div class="tooltip tooltip-top" data-tip="Go to previous page">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="join-item btn btn-sm"
              :class="{ 'btn-disabled': currentPage === 1 }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </div>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="join-item btn btn-sm"
            :class="{ 'btn-primary': page === currentPage }"
            :title="`Go to page ${page}`"
          >
            {{ page }}
          </button>

          <div class="tooltip tooltip-top" data-tip="Go to next page">
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="join-item btn btn-sm"
              :class="{ 'btn-disabled': currentPage === totalPages }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <dialog id="book_details_modal" class="modal">
      <div class="modal-box max-w-3xl bg-base-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold">Borrow Details</h3>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>

        <div v-if="selectedBook" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title text-base">Book Information</h4>
                <div class="space-y-3">
                  <div class="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                    <span class="text-sm text-base-content/60">Title</span>
                    <span class="font-medium">{{
                      selectedBook.bookTitle
                    }}</span>
                  </div>
                  <div class="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                    <span class="text-sm text-base-content/60">Student</span>
                    <span class="font-medium">{{
                      selectedBook.studentName
                    }}</span>
                  </div>
                  <div class="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                    <span class="text-sm text-base-content/60"
                      >Borrow Date</span
                    >
                    <span>{{ formatDate(selectedBook.borrowDate) }}</span>
                  </div>
                  <div class="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                    <span class="text-sm text-base-content/60">Due Date</span>
                    <span
                      :class="
                        isOverdue(selectedBook.returnDate) ? 'text-error' : ''
                      "
                    >
                      {{ formatDate(selectedBook.returnDate) }}
                    </span>
                  </div>
                  <div
                    v-if="selectedBook.returnDate"
                    class="grid grid-cols-[100px_1fr] gap-2 items-baseline"
                  >
                    <span class="text-sm text-base-content/60"
                      >Return Date</span
                    >
                    <span class="text-success">{{
                      formatDate(selectedBook.returnDate)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium mb-2">Condition Images</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-base-content/60 mb-2">
                    Before Condition Images
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <img
                      v-for="(
                        image, index
                      ) in selectedBook.beforeConditionImages"
                      :key="`before-${index}`"
                      :src="image"
                      :alt="`Before condition ${index + 1}`"
                      class="rounded-lg w-full object-cover aspect-4/3"
                    />
                  </div>
                </div>
                <div v-if="selectedBook.afterConditionImages?.length > 0">
                  <p class="text-sm text-base-content/60 mb-2">
                    After Condition Images
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <img
                      v-for="(
                        image, index
                      ) in selectedBook.afterConditionImages"
                      :key="`after-${index}`"
                      :src="image"
                      :alt="`After condition ${index + 1}`"
                      class="rounded-lg w-full object-cover aspect-4/3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedBook.conditionNotes" class="pt-4 border-t">
            <h4 class="font-medium mb-2">Condition Notes</h4>
            <p class="text-sm text-base-content/75">
              {{ selectedBook.conditionNotes }}
            </p>
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { BorrowedBook } from "~/types/books";

const props = defineProps<{
  books: BorrowedBook[];
}>();

defineEmits<{
  (e: "return-book", book: BorrowedBook): void;
}>();

// State
const selectedBook = ref<BorrowedBook | null>(null);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Reset to first page when books data changes (e.g., when searching)
watch(
  () => props.books,
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

// Computed properties for pagination
const totalBooks = computed(() => props.books.length);
const totalPages = computed(() =>
  Math.ceil(totalBooks.value / itemsPerPage.value)
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedBooks = computed(() => {
  return props.books.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(
    1,
    currentPage.value - Math.floor(maxVisiblePages / 2)
  );
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Pagination methods
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

// Handlers
const showDetails = (book: BorrowedBook) => {
  selectedBook.value = book;
  const modal = document.getElementById(
    "book_details_modal"
  ) as HTMLDialogElement;
  modal.showModal();
};
</script>
