<template>
  <NavBar />

  <div class="">
    <book-card-stats />

    <div
      class="grid grid-cols-12 gap-4 items-center mb-4 mx-5"
      style="margin-top: 60px"
    >
      <div class="col-span-6">
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5 opacity-70"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="search"
            class="grow"
            placeholder="Search books and students..."
            title="Search by book title, student name, or any other details"
          />
        </label>
        <div class="label">
          <span class="label-text-alt text-base-content/60">
            💡 Tip: Search by book title, student name, or borrowing details
          </span>
        </div>
      </div>

      <div class="col-span-6 text-right">
        <div
          class="tooltip tooltip-left"
          data-tip="Issue a new book to a student"
        >
          <button
            @click="showBorrowModal = true"
            class="btn btn-primary normal-case px-6 gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Issue book
          </button>
        </div>
        <div class="text-right mt-1">
          <span class="text-xs text-base-content/50">
            Click to lend a book to a student
          </span>
        </div>
      </div>
    </div>

    <BorrowedBooksList :books="borrowedBooks" @return-book="handleReturnBook" />

    <!-- Borrow Book Modal -->
    <BorrowBookForm v-model:show="showBorrowModal" @submit="handleBorrow" />

    <!-- Return Book Modal -->
    <ReturnBookForm
      v-if="selectedBook"
      v-model:show="showReturnModal"
      :book="selectedBook"
      @submit="handleReturn"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type {
  BorrowedBook,
  Book,
  Student,
  BorrowBookData,
  ReturnBookData,
} from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";

// Component imports
import BorrowedBooksList from "~/components/books/BorrowedBooksList.vue";
import BorrowBookForm from "~/components/books/BorrowBookForm.vue";
import ReturnBookForm from "~/components/books/ReturnBookForm.vue";
import NavBar from "~/components/NavBar.vue";

// State
const showBorrowModal = ref(false);
const showReturnModal = ref(false);
const selectedBook = ref<BorrowedBook | null>(null);
const loading = ref(false);

// Data from API
const borrowedBooks = ref<BorrowedBook[]>([]);
const students = ref<Student[]>([]);
const availableBooks = ref<Book[]>([]);

// Fetch data from API
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

const fetchStudents = async () => {
  try {
    students.value = await LibraryAPI.getStudents();
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }
};

const fetchBooks = async () => {
  try {
    const books = await LibraryAPI.getBooks();
    availableBooks.value = books.filter((book) => book.status === "available");
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }
};

// Initialize data on mount
onMounted(() => {
  fetchBorrowedBooks();
  fetchStudents();
  fetchBooks();
});

// Handlers
const handleBorrow = async (data: BorrowBookData) => {
  try {
    // Refresh the borrowed books list after successful borrow
    await fetchBorrowedBooks();
    showBorrowModal.value = false;
  } catch (error) {
    console.error("Failed to borrow book:", error);
  }
};

const handleReturnBook = (book: BorrowedBook) => {
  selectedBook.value = book;
  showReturnModal.value = true;
};

const handleReturn = async (data: ReturnBookData) => {
  try {
    // Use API to return book
    await LibraryAPI.returnBook(data);

    // Refresh the borrowed books list
    await fetchBorrowedBooks();

    showReturnModal.value = false;
    selectedBook.value = null;
  } catch (error) {
    console.error("Failed to return book:", error);
  }
};
</script>
