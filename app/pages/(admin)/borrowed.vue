<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-base-content">Borrowed Books</h1>
        <p class="text-sm text-base-content/60 mt-1">
          Manage book borrowing and returns
        </p>
      </div>
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
        Borrow Book
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stats shadow-sm bg-base-100">
        <div class="stat">
          <div class="stat-title">Total Borrowed</div>
          <div class="stat-value text-primary">{{ borrowedBooks.length }}</div>
          <div class="stat-desc">Active borrowings</div>
        </div>
      </div>

      <div class="stats shadow-sm bg-base-100">
        <div class="stat">
          <div class="stat-title">Overdue Books</div>
          <div class="stat-value text-error">
            {{ borrowedBooks.filter((b) => isOverdue(b.dueDate)).length }}
          </div>
          <div class="stat-desc">Need attention</div>
        </div>
      </div>

      <div class="stats shadow-sm bg-base-100">
        <div class="stat">
          <div class="stat-title">Due This Week</div>
          <div class="stat-value text-warning">
            {{ borrowedBooks.filter((b) => isDueThisWeek(b.dueDate)).length }}
          </div>
          <div class="stat-desc">Coming up</div>
        </div>
      </div>
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
import { ref } from "vue";
import type {
  BorrowedBook,
  Book,
  Student,
  BorrowBookData,
  ReturnBookData,
} from "~/types/books";

// Component imports
import BorrowedBooksList from "~/components/books/BorrowedBooksList.vue";
import BorrowBookForm from "~/components/books/BorrowBookForm.vue";
import ReturnBookForm from "~/components/books/ReturnBookForm.vue";

// Mock data for testing
const students: Student[] = [
  {
    id: "1",
    name: "John Doe",
    studentId: "STU001",
    email: "john@example.com",
    borrowedBooks: [],
  },
  {
    id: "2",
    name: "Jane Smith",
    studentId: "STU002",
    email: "jane@example.com",
    borrowedBooks: [],
  },
];

const availableBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0743273565",
    category: "Fiction",
    status: "available",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0451524935",
    category: "Fiction",
    status: "available",
  },
];

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

// State
const showBorrowModal = ref(false);
const showReturnModal = ref(false);
const selectedBook = ref<BorrowedBook | null>(null);

// Mock data - Replace with actual API calls
const borrowedBooks = ref<BorrowedBook[]>([
  {
    id: "1",
    bookId: "1",
    studentId: "1",
    bookTitle: "The Great Gatsby",
    studentName: "John Doe",
    borrowDate: "2025-09-19",
    dueDate: "2025-10-03",
    status: "borrowed",
    beforeConditionImages: ["https://picsum.photos/200/300"],
    afterConditionImages: [],
  },
  {
    id: "2",
    bookId: "2",
    studentId: "2",
    bookTitle: "1984",
    studentName: "Jane Smith",
    borrowDate: "2025-09-15",
    dueDate: "2025-09-29",
    status: "borrowed",
    beforeConditionImages: ["https://picsum.photos/200/300"],
    afterConditionImages: [],
  },
]);

// Handlers
const handleBorrow = async (data: BorrowBookData) => {
  // TODO: Implement API call
  console.log("Borrow book:", data);
  showBorrowModal.value = false;

  // Mock implementation - add to list
  borrowedBooks.value.unshift({
    id: Math.random().toString(),
    bookId: data.bookId,
    studentId: data.studentId,
    bookTitle:
      availableBooks.find((b) => b.id === data.bookId)?.title || "Unknown Book",
    studentName:
      students.find((s) => s.id === data.studentId)?.name || "Unknown Student",
    borrowDate: data.borrowDate,
    dueDate: data.dueDate,
    status: "borrowed",
    beforeConditionImages: data.beforeConditionImages.map((file) =>
      URL.createObjectURL(file)
    ),
    afterConditionImages: [],
  });
};

const handleReturnBook = (book: BorrowedBook) => {
  selectedBook.value = book;
  showReturnModal.value = true;
};

const handleReturn = async (data: ReturnBookData) => {
  // TODO: Implement API call
  console.log("Return book:", data);

  // Mock implementation - update book status
  const book = borrowedBooks.value.find(
    (b: BorrowedBook) => b.id === data.borrowedBookId
  );
  if (book) {
    book.status = "returned";
    book.returnDate = data.returnDate;
    book.afterConditionImages = data.afterConditionImages.map((file) =>
      URL.createObjectURL(file)
    );
    if (data.conditionNotes) {
      book.conditionNotes = data.conditionNotes;
    }
  }

  showReturnModal.value = false;
  selectedBook.value = null;
};
</script>
