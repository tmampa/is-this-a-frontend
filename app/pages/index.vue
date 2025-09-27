<template>
  <NavBar />

  <div class="bg-light min-vh-100">
    <!-- Clean Header Section -->
    <div class="container py-4">
      <!-- Simple Stats -->
      <book-card-stats class="mb-4" />

      <!-- Clean Search and Action Bar -->
      <div class="row align-items-center mb-4">
        <div class="col-md-8">
          <input
            class="form-control"
            type="search"
            placeholder="Search borrowed books..."
            aria-label="Search"
          />
        </div>
        <div class="col-md-4 text-end">
          <button
            @click="showBorrowModal = true"
            class="btn px-4"
            style="background-color: #f25c05; color: white; border: none"
          >
            Issue book to student
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded shadow-sm p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0" style="color: #f25c05">Recently issued books</h5>
          <small class="text-muted"
            >{{ borrowedBooks.length }} active loans</small
          >
        </div>

        <BorrowedBooksList
          :books="borrowedBooks"
          @return-book="handleReturnBook"
        />
      </div>
    </div>

    <!-- Modals -->
    <BorrowBookForm v-model:show="showBorrowModal" @submit="handleBorrow" />

    <ReturnBookForm
      v-if="selectedBook"
      v-model:show="showReturnModal"
      :book="selectedBook"
      @submit="handleReturn"
    />
  </div>
</template>

<style scoped>
body,
html {
  background-color: #fafafa;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.form-control:focus {
  border-color: #f25c05;
  box-shadow: 0 0 0 0.2rem rgba(242, 92, 5, 0.25);
}
</style>

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
