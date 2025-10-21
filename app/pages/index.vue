<template>
  <div>
    <NavBar />
    <book-card-stats />

    <div
      class="main-content grid grid-cols-12 gap-4 items-center mb-4 mx-5"
      style="margin-top: 60px"
    >
      <div class="col-span-6">
        <div class="relative">
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
              v-model="searchQuery"
              type="search"
              class="grow"
              placeholder="Search books and students..."
              title="Search by book title, student name, or any other details"
            />
            <button
              v-if="searchQuery.trim()"
              @click="searchQuery = ''"
              class="btn btn-ghost btn-sm btn-circle"
              title="Clear search"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </label>
        </div>
        <div class="label">
          <span class="label-text-alt text-xs text-base-content/60">
            💡 Search by book title, student name, status, dates, or condition
            notes
          </span>
          <span
            v-if="searchQuery.trim()"
            class="label-text-alt text-xs text-primary"
          >
            {{ filteredBooks.length }} of {{ borrowedBooks.length }} records
          </span>
        </div>
        <!-- Debug info -->
        <div
          v-if="searchQuery.trim()"
          class="text-xs text-base-content/40 mt-1"
        >
          Debug: Query="{{ searchQuery }}" | Books={{ borrowedBooks.length }} |
          Filtered={{ filteredBooks.length }}
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

    <!-- Search Results or Empty State -->
    <div
      v-if="searchQuery.trim() && filteredBooks.length === 0"
      class="main-content mx-5 p-8 text-center bg-base-100 rounded-box border border-base-300"
    >
      <div class="text-4xl mb-4">🔍</div>
      <h3 class="text-lg font-semibold text-base-content mb-2">
        No results found
      </h3>
      <p class="text-base-content/60 mb-4">
        No borrowed books match your search for "<span class="font-medium">{{
          searchQuery
        }}</span
        >"
      </p>
      <button @click="searchQuery = ''" class="btn btn-outline btn-sm">
        Clear search
      </button>
    </div>

    <!-- Borrowed Books Table -->
    <BorrowedBooksList
      v-else
      :books="filteredBooks"
      @return-book="handleReturnBook"
    />

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
import { ref, onMounted, computed, watch } from "vue";
import type {
  BorrowedBook,
  Book,
  Student,
  BorrowBookData,
  ReturnBookData,
} from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";

// Initialize auth will be handled by middleware or onMounted
const { checkAuth, initAuth } = useAuth();

// Component imports
import BorrowedBooksList from "~/components/books/BorrowedBooksList.vue";
import BorrowBookForm from "~/components/books/BorrowBookForm.vue";
import ReturnBookForm from "~/components/books/ReturnBookForm.vue";

// State
const showBorrowModal = ref(false);
const showReturnModal = ref(false);
const selectedBook = ref<BorrowedBook | null>(null);
const loading = ref(false);
const searchQuery = ref("");

// Data from API
const borrowedBooks = ref<BorrowedBook[]>([]);
const students = ref<Student[]>([]);
const availableBooks = ref<Book[]>([]);

// Computed property for filtered books based on search query
const filteredBooks = computed(() => {
  console.log("Computing filtered books...");
  console.log("Search query:", searchQuery.value);
  console.log("Total books:", borrowedBooks.value.length);

  if (!searchQuery.value.trim()) {
    console.log("No search query, returning all books");
    return borrowedBooks.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  console.log("Normalized query:", query);

  const filtered = borrowedBooks.value.filter((book, index) => {
    // Search primarily in book title and student name for now
    const matchesTitle =
      book.bookTitle && book.bookTitle.toLowerCase().includes(query);
    const matchesStudent =
      book.studentName && book.studentName.toLowerCase().includes(query);
    const matchesStatus =
      book.status && book.status.toLowerCase().includes(query);

    const matches = matchesTitle || matchesStudent || matchesStatus;

    if (index < 3) {
      // Log first few books for debugging
      console.log(`Book ${index}:`, {
        title: book.bookTitle,
        student: book.studentName,
        status: book.status,
        matchesTitle,
        matchesStudent,
        matchesStatus,
        matches,
      });
    }

    return matches;
  });

  console.log(
    `Filtered ${filtered.length} books from ${borrowedBooks.value.length} total`
  );
  return filtered;
});

// Debug: Log search query changes
watch(searchQuery, (newQuery, oldQuery) => {
  console.log(`Search query changed from "${oldQuery}" to "${newQuery}"`);
  console.log("Total books available:", borrowedBooks.value.length);
});

// Debug: Log filtered results
watch(filteredBooks, (newFiltered) => {
  console.log(
    `Search results: ${newFiltered.length} of ${borrowedBooks.value.length} books`
  );
  if (searchQuery.value.trim()) {
    console.log("Filtered books:", newFiltered);
  }
});

// Fetch data from API
const fetchBorrowedBooks = async () => {
  loading.value = true;
  try {
    const allRecords = await LibraryAPI.getBorrowRecords();
    // Filter out returned books (books with returnDate are already returned)
    borrowedBooks.value = allRecords.filter((book) => !book.returnDate);
    console.log("Fetched all records:", allRecords);
    console.log(
      "Currently borrowed books (no returnDate):",
      borrowedBooks.value.length
    );
    console.log("Sample book structure:", borrowedBooks.value[0]);
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
onMounted(async () => {
  // Initialize auth state first
  initAuth();

  // Check authentication
  if (!checkAuth()) {
    console.log("User not authenticated, redirecting to login");
    await navigateTo("/login");
    return;
  }

  console.log("User authenticated, loading data");
  fetchBorrowedBooks();
  fetchStudents();
  fetchBooks();
}); // Handlers
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

<style scoped>
@media (min-width: 1024px) {
  .main-content {
    margin-left: 280px !important;
  }
}
</style>
