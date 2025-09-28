<template>
  <div>
    <NavBar />
    <div class="space-y-6">
      <!-- Page Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="px-5">
          <h1 class="text-2xl font-bold text-base-content">Books Management</h1>
          <p class="text-sm text-base-content/60 mt-1">
            📚 Manage your library's book collection - add, edit, and organize
            books
          </p>
          <div class="mt-2 text-xs text-base-content/50">
            💡 Tip: Use filters to find specific books quickly
          </div>
        </div>
        <div class="px-5">
          <div
            class="tooltip tooltip-left"
            data-tip="Add a new book to your library collection"
          >
            <button
              @click="showAddModal = true"
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
              Add Book
            </button>
          </div>
          <div class="text-center mt-1">
            <span class="text-xs text-base-content/50">
              Add books to your library
            </span>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stats shadow-sm bg-base-100">
          <div class="stat">
            <div class="stat-title">Total Books</div>
            <div class="stat-value text-primary">{{ books.length }}</div>
            <div class="stat-desc">In collection</div>
          </div>
        </div>
        <div class="stats shadow-sm bg-base-100">
          <div class="stat">
            <div class="stat-title">Available</div>
            <div class="stat-value text-success">{{ availableBooks }}</div>
            <div class="stat-desc">Ready to borrow</div>
          </div>
        </div>
        <div class="stats shadow-sm bg-base-100">
          <div class="stat">
            <div class="stat-title">Borrowed</div>
            <div class="stat-value text-warning">{{ borrowedBooks }}</div>
            <div class="stat-desc">Currently out</div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-base-100 rounded-lg shadow-sm px-5 mb-5">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search books by title, author, or ISBN..."
              class="input input-bordered w-full"
            />
          </div>
          <div class="form-control">
            <select v-model="selectedCategory" class="select select-bordered">
              <option value="">All Categories</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
          <div class="form-control">
            <select v-model="selectedStatus" class="select select-bordered">
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Books List -->
      <div class="bg-base-100 rounded-lg shadow-sm overflow-hidden px-5">
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead style="background-color: #458c7f; color: white">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in paginatedBooks" :key="book.id">
                <td>
                  <div class="font-medium">{{ book.title }}</div>
                  <div
                    v-if="book.description"
                    class="text-sm text-base-content/60 truncate max-w-xs"
                  >
                    {{ book.description }}
                  </div>
                </td>
                <td>{{ book.author }}</td>
                <td>
                  <span class="badge badge-outline">{{ book.category }}</span>
                </td>
                <td class="font-mono text-sm">{{ book.isbn }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'badge-success': book.status === 'available',
                      'badge-warning': book.status === 'borrowed',
                    }"
                  >
                    {{ book.status === "available" ? "Available" : "Borrowed" }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button
                      @click="editBook(book)"
                      class="btn btn-sm btn-ghost"
                      title="Edit book"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteBook(book)"
                      class="btn btn-sm btn-ghost text-error"
                      title="Delete book"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
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
            Showing {{ startIndex + 1 }} to
            {{ Math.min(endIndex, totalFilteredBooks) }} of
            {{ totalFilteredBooks }} books
          </div>

          <div class="flex items-center gap-2">
            <!-- Items per page selector -->
            <div class="flex items-center gap-2 mr-4">
              <span class="text-sm text-base-content/60">Show:</span>
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

            <!-- Pagination buttons -->
            <div class="join">
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

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                class="join-item btn btn-sm"
                :class="{ 'btn-primary': page === currentPage }"
              >
                {{ page }}
              </button>

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

      <!-- Empty State -->
      <div v-if="filteredBooks.length === 0" class="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-12 w-12 text-base-content/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-base-content/60">
          No books found
        </h3>
        <p class="mt-1 text-sm text-base-content/40">
          Get started by adding your first book to the collection.
        </p>
        <div class="mt-6">
          <button @click="showAddModal = true" class="btn btn-primary">
            Add Book
          </button>
        </div>
      </div>
    </div>

    <!-- Add Book Modal -->
    <BookForm v-model:show="showAddModal" @submit="handleAddBook" />

    <!-- Edit Book Modal -->
    <BookForm
      v-model:show="showEditModal"
      :book="selectedBook"
      @submit="handleEditBook"
    />

    <!-- Delete Confirmation Modal -->
    <dialog :open="showDeleteModal" class="modal">
      <div class="modal-box">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg text-base-content">Delete Book</h3>
            <p class="text-sm text-base-content/70 mt-1">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div v-if="selectedBook" class="mb-6">
          <div class="bg-base-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-base-content">
                  {{ selectedBook.title }}
                </p>
                <p class="text-sm text-base-content/70">
                  by {{ selectedBook.author }}
                </p>
                <p class="text-xs text-base-content/50 mt-1">
                  ISBN: {{ selectedBook.isbn }}
                </p>
              </div>
              <div
                class="badge"
                :class="{
                  'badge-success': selectedBook.status === 'available',
                  'badge-warning': selectedBook.status === 'borrowed',
                }"
              >
                {{
                  selectedBook.status === "available" ? "Available" : "Borrowed"
                }}
              </div>
            </div>
          </div>

          <div
            class="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg"
          >
            <div class="flex items-start gap-2">
              <svg
                class="w-5 h-5 text-warning mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div class="text-sm">
                <p class="font-medium text-warning">Warning:</p>
                <p class="text-base-content/70 mt-1">
                  Deleting this book will permanently remove it from your
                  library collection.
                  <span
                    v-if="selectedBook.status === 'borrowed'"
                    class="font-medium text-error block mt-1"
                  >
                    This book is currently borrowed and cannot be deleted until
                    it is returned.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button
            type="button"
            class="btn"
            @click="
              showDeleteModal = false;
              selectedBook = null;
            "
            :disabled="deleteLoading"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-error"
            @click="handleDeleteConfirm"
            :class="{ loading: deleteLoading }"
            :disabled="deleteLoading || selectedBook?.status === 'borrowed'"
          >
            <span v-if="deleteLoading">Deleting...</span>
            <span v-else-if="selectedBook?.status === 'borrowed'"
              >Cannot Delete - Currently Borrowed</span
            >
            <span v-else>Delete Book</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button
          @click="
            showDeleteModal = false;
            selectedBook = null;
          "
        >
          close
        </button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Book } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";
import BookForm from "~/components/books/BookForm.vue";

// Check authentication on page load
const { checkAuth, initAuth } = useAuth();

// Component state
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedBook = ref<Book | null>(null);
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedStatus = ref("");
const loading = ref(false);
const deleteLoading = ref(false);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Books data from API
const books = ref<Book[]>([]);

// Fetch books from API
const fetchBooks = async () => {
  loading.value = true;
  try {
    books.value = await LibraryAPI.getBooks();
  } catch (error) {
    console.error("Failed to fetch books:", error);
  } finally {
    loading.value = false;
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

  console.log("User authenticated, loading books");
  fetchBooks();
});

// Computed properties
const categories = computed(() => {
  return [...new Set(books.value.map((book) => book.category))].sort();
});

const availableBooks = computed(() => {
  return books.value.filter((book) => book.status === "available").length;
});

const borrowedBooks = computed(() => {
  return books.value.filter((book) => book.status === "borrowed").length;
});

const uniqueCategories = computed(() => {
  return categories.value.length;
});

const filteredBooks = computed(() => {
  let filtered = books.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (book) => book.category === selectedCategory.value
    );
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((book) => book.status === selectedStatus.value);
  }

  return filtered;
});

// Pagination computed properties
const totalFilteredBooks = computed(() => filteredBooks.value.length);
const totalPages = computed(() =>
  Math.ceil(totalFilteredBooks.value / itemsPerPage.value)
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedBooks = computed(() => {
  return filteredBooks.value.slice(startIndex.value, endIndex.value);
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

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

function editBook(book: Book) {
  console.log("Edit book:", book);
  selectedBook.value = book;
  showEditModal.value = true;
}

function deleteBook(book: Book) {
  console.log("Delete book:", book);
  selectedBook.value = book;
  showDeleteModal.value = true;
}

// Handlers
const handleAddBook = async () => {
  try {
    // Refresh the books list after successful creation
    await fetchBooks();
    showAddModal.value = false;
  } catch (error) {
    console.error("Failed to add book:", error);
  }
};

const handleEditBook = async () => {
  try {
    // Refresh the books list after successful update
    await fetchBooks();
    showEditModal.value = false;
    selectedBook.value = null;
  } catch (error) {
    console.error("Failed to update book:", error);
  }
};

// Delete confirmation handler
const handleDeleteConfirm = async () => {
  if (!selectedBook.value) return;

  // Additional safety check - prevent deletion if book is borrowed
  if (selectedBook.value.status === "borrowed") {
    alert(
      "Cannot delete a book that is currently borrowed. Please wait for it to be returned first."
    );
    return;
  }

  deleteLoading.value = true;
  try {
    await LibraryAPI.deleteBook(selectedBook.value.id);

    // Refresh the books list after successful deletion
    await fetchBooks();

    // Close modal and reset
    showDeleteModal.value = false;
    selectedBook.value = null;

    // Show success message
    console.log("Book deleted successfully!");
  } catch (error) {
    console.error("Failed to delete book:", error);
    alert("Failed to delete book. Please try again.");
  } finally {
    deleteLoading.value = false;
  }
};
</script>
