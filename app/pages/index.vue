<template>
  <NavBar />

  <div class="">
    <book-card-stats />

    <div class="container">
      <div class="row justify-content-between">
        <div class="col">
          <form class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
        <div class="col text-end">
          <button @click="showBorrowModal = true" class="btn btn-primary">
            Borrow Book
          </button>
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
