<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="bookFormModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bookFormModalLabel">
            {{ editMode ? "Edit Book" : "Add New Book" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row g-3">
              <!-- Title -->
              <div class="col-12">
                <label for="bookTitle" class="form-label">
                  Title <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="bookTitle"
                  v-model="formData.title"
                  class="form-control"
                  placeholder="Enter book title"
                  required
                />
              </div>

              <!-- Author -->
              <div class="col-md-6">
                <label for="bookAuthor" class="form-label">
                  Author <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="bookAuthor"
                  v-model="formData.author"
                  class="form-control"
                  placeholder="Enter author name"
                  required
                />
              </div>

              <!-- ISBN -->
              <div class="col-md-6">
                <label for="bookISBN" class="form-label">
                  ISBN <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="bookISBN"
                  v-model="formData.isbn"
                  class="form-control"
                  placeholder="Enter ISBN (e.g., 978-3-16-148410-0)"
                  required
                />
              </div>

              <!-- Category -->
              <div class="col-12">
                <label for="bookCategory" class="form-label">
                  Category <span class="text-danger">*</span>
                </label>
                <select
                  id="bookCategory"
                  v-model="formData.category"
                  class="form-select"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Educational">Educational</option>
                  <option value="Children">Children</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <!-- Description -->
              <div class="col-12">
                <label for="bookDescription" class="form-label"
                  >Description</label
                >
                <textarea
                  id="bookDescription"
                  v-model="formData.description"
                  class="form-control"
                  placeholder="Enter book description (optional)"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
              :disabled="loading"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              {{
                loading
                  ? editMode
                    ? "Updating..."
                    : "Creating..."
                  : editMode
                  ? "Update Book"
                  : "Create Book"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show" @click="closeModal"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Book } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";

// Define book form data type
type BookFormData = {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
};

const props = defineProps<{
  show: boolean;
  book?: Book | null;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "submit", data: BookFormData, isEdit: boolean): void;
}>();

const loading = ref(false);

// Check if we're in edit mode
const editMode = computed(() => !!props.book);

// Form state
const formData = ref<BookFormData>({
  title: "",
  author: "",
  isbn: "",
  category: "",
  description: "",
});

// Watch for book prop changes to populate form when editing
watch(
  () => props.book,
  (newBook) => {
    if (newBook) {
      formData.value = {
        title: newBook.title || "",
        author: newBook.author || "",
        isbn: newBook.isbn || "",
        category: newBook.category || "",
        description: newBook.description || "",
      };
    } else {
      // Reset form for create mode
      formData.value = {
        title: "",
        author: "",
        isbn: "",
        category: "",
        description: "",
      };
    }
  },
  { immediate: true }
);

// Handlers
const handleSubmit = async () => {
  // Validate required fields
  if (!formData.value.title.trim()) {
    alert("Please enter a title");
    return;
  }
  if (!formData.value.author.trim()) {
    alert("Please enter an author");
    return;
  }
  if (!formData.value.isbn.trim()) {
    alert("Please enter an ISBN");
    return;
  }
  if (!formData.value.category.trim()) {
    alert("Please select a category");
    return;
  }

  loading.value = true;
  try {
    // Create book data object
    const bookData: BookFormData = {
      title: formData.value.title.trim(),
      author: formData.value.author.trim(),
      isbn: formData.value.isbn.trim(),
      category: formData.value.category.trim(),
      description: formData.value.description?.trim() || "",
    };

    console.log(editMode.value ? "Updating book:" : "Creating book:", bookData);

    if (editMode.value && props.book) {
      // Update existing book
      await LibraryAPI.updateBook(props.book.id, bookData);
    } else {
      // Create new book
      await LibraryAPI.createBook(bookData);
    }

    // Emit success event
    emit("submit", bookData, editMode.value);

    // Reset form
    formData.value = {
      title: "",
      author: "",
      isbn: "",
      category: "",
      description: "",
    };

    // Close modal
    closeModal();
  } catch (error) {
    console.error(
      `Failed to ${editMode.value ? "update" : "create"} book:`,
      error
    );
    alert(
      `Failed to ${
        editMode.value ? "update" : "create"
      } book. Please try again.`
    );
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit("update:show", false);
};
</script>
