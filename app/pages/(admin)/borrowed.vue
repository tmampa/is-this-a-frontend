<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5 mx-15"
    >
      <div>
        <h1 class="text-2xl font-bold text-base-content">Borrowed Books</h1>
        <p class="text-sm text-base-content/60 mt-1">
          Manage book borrowing and returns
        </p>
      </div>
      <button
        @click="showBorrowModal = true"
        class="btn btn-soft btn-primary normal-case px-6 gap-2"
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
        Borrow Book
      </button>
    </div>

    <!-- Borrowed Books List -->
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
