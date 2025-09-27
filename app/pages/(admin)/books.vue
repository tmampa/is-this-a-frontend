<template>
  <NavBar />
  <div class="container-fluid py-4">
    <!-- Page Header -->
    <div class="row align-items-center mb-4" style="margin-top: 60px">
      <div class="col">
        <div class="px-3">
          <h1 class="h2 fw-bold text-dark mb-1">Books Management</h1>
          <p class="text-muted small mb-0">
            Manage your library's book collection
          </p>
        </div>
      </div>
      <div class="col-auto">
        <button
          @click="showAddModal = true"
          class="btn btn-primary d-flex align-items-center gap-2"
        >
          <i class="bi bi-plus-lg"></i>
          Add Book
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted small text-uppercase mb-1">Total Books</div>
            <div class="h3 fw-bold text-primary mb-1">{{ books.length }}</div>
            <div class="text-muted small">In collection</div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted small text-uppercase mb-1">Available</div>
            <div class="h3 fw-bold text-success mb-1">{{ availableBooks }}</div>
            <div class="text-muted small">Ready to borrow</div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted small text-uppercase mb-1">Borrowed</div>
            <div class="h3 fw-bold text-warning mb-1">{{ borrowedBooks }}</div>
            <div class="text-muted small">Currently out</div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted small text-uppercase mb-1">Categories</div>
            <div class="h3 fw-bold text-info mb-1">{{ uniqueCategories }}</div>
            <div class="text-muted small">Different genres</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search books by title, author, or ISBN..."
                class="form-control"
              />
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="selectedCategory" class="form-select">
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
          <div class="col-md-3">
            <select v-model="selectedStatus" class="form-select">
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Books List -->
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="fw-medium">Title</th>
                <th class="fw-medium">Author</th>
                <th class="fw-medium">Category</th>
                <th class="fw-medium">ISBN</th>
                <th class="fw-medium">Status</th>
                <th class="fw-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in filteredBooks" :key="book.id">
                <td>
                  <div class="fw-medium">{{ book.title }}</div>
                  <div
                    v-if="book.description"
                    class="text-muted small text-truncate"
                    style="max-width: 300px"
                  >
                    {{ book.description }}
                  </div>
                </td>
                <td>{{ book.author }}</td>
                <td>
                  <span class="badge bg-light text-dark border">{{
                    book.category
                  }}</span>
                </td>
                <td class="font-monospace small">{{ book.isbn }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-success': book.status === 'available',
                      'bg-warning': book.status === 'borrowed',
                    }"
                  >
                    {{ book.status === "available" ? "Available" : "Borrowed" }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm" role="group">
                    <button
                      @click="editBook(book)"
                      class="btn btn-outline-primary"
                      title="Edit book"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      @click="deleteBook(book)"
                      class="btn btn-outline-danger"
                      title="Delete book"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredBooks.length === 0" class="text-center py-5">
      <div class="mb-3">
        <i class="bi bi-journal-text display-1 text-muted opacity-50"></i>
      </div>
      <h5 class="text-muted mb-2">No books found</h5>
      <p class="text-muted mb-4">
        Get started by adding your first book to the collection.
      </p>
      <button @click="showAddModal = true" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>Add Book
      </button>
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
  <div
    class="modal fade"
    :class="{ show: showDeleteModal }"
    :style="{ display: showDeleteModal ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="deleteModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-3">
            <div
              class="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle"
              style="width: 48px; height: 48px"
            >
              <i class="bi bi-exclamation-triangle text-danger fs-4"></i>
            </div>
            <div>
              <h5 class="modal-title fw-bold" id="deleteModalLabel">
                Delete Book
              </h5>
              <p class="text-muted small mb-0">This action cannot be undone</p>
            </div>
          </div>
          <button
            type="button"
            class="btn-close"
            @click="
              showDeleteModal = false;
              selectedBook = null;
            "
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="selectedBook">
          <div class="card bg-light mb-3">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div
                  class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded"
                  style="width: 48px; height: 48px"
                >
                  <i class="bi bi-book text-primary"></i>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ selectedBook.title }}</h6>
                  <p class="text-muted small mb-1">
                    by {{ selectedBook.author }}
                  </p>
                  <p class="text-muted small mb-0">
                    ISBN: {{ selectedBook.isbn }}
                  </p>
                </div>
                <span
                  class="badge"
                  :class="{
                    'bg-success': selectedBook.status === 'available',
                    'bg-warning': selectedBook.status === 'borrowed',
                  }"
                >
                  {{
                    selectedBook.status === "available"
                      ? "Available"
                      : "Borrowed"
                  }}
                </span>
              </div>
            </div>
          </div>

          <div class="alert alert-warning d-flex align-items-start gap-2">
            <i
              class="bi bi-exclamation-triangle-fill text-warning flex-shrink-0"
            ></i>
            <div class="small">
              <strong>Warning:</strong>
              <p class="mb-0 mt-1">
                Deleting this book will permanently remove it from your library
                collection.
                <span
                  v-if="selectedBook.status === 'borrowed'"
                  class="d-block mt-1 text-danger fw-medium"
                >
                  This book is currently borrowed and cannot be deleted until it
                  is returned.
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
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
            class="btn btn-danger"
            @click="handleDeleteConfirm"
            :disabled="deleteLoading || selectedBook?.status === 'borrowed'"
          >
            <span v-if="deleteLoading">
              <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Deleting...
            </span>
            <span v-else-if="selectedBook?.status === 'borrowed'">
              Cannot Delete - Currently Borrowed
            </span>
            <span v-else>Delete Book</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showDeleteModal"
    class="modal-backdrop fade show"
    @click="
      showDeleteModal = false;
      selectedBook = null;
    "
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Book } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";
import BookForm from "~/components/books/BookForm.vue";

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
