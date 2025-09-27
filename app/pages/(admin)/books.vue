<template>
  <NavBar />
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-base-content">Books Management</h1>
        <p class="text-sm text-base-content/60 mt-1">
          Manage your library's book collection
        </p>
      </div>
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      <div class="stats shadow-sm bg-base-100">
        <div class="stat">
          <div class="stat-title">Categories</div>
          <div class="stat-value text-info">{{ uniqueCategories }}</div>
          <div class="stat-desc">Different genres</div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-base-100 rounded-lg shadow-sm p-6">
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
    <div class="bg-base-100 rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
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
            <tr v-for="book in filteredBooks" :key="book.id">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Book } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";

// Component state
const showAddModal = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedStatus = ref("");
const loading = ref(false);

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
onMounted(() => {
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

// Methods
function editBook(book: Book) {
  console.log("Edit book:", book);
  // TODO: Implement edit modal
}

function deleteBook(book: Book) {
  console.log("Delete book:", book);
  // TODO: Implement delete confirmation
}
</script>
