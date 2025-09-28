<template>
  <dialog :open="show" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-6">
        {{ editMode ? "Edit Book" : "Add New Book" }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div class="form-control">
          <label class="label">
            <span class="label-text"
              >Title <span class="text-error">*</span></span
            >
          </label>
          <input
            type="text"
            v-model="formData.title"
            class="input input-bordered w-full"
            placeholder="Enter book title"
            required
          />
        </div>

        <!-- Author -->
        <div class="form-control">
          <label class="label">
            <span class="label-text"
              >Author <span class="text-error">*</span></span
            >
          </label>
          <input
            type="text"
            v-model="formData.author"
            class="input input-bordered w-full"
            placeholder="Enter author name"
            required
          />
        </div>

        <!-- ISBN -->
        <div class="form-control">
          <label class="label">
            <span class="label-text"
              >ISBN <span class="text-error">*</span></span
            >
          </label>
          <input
            type="text"
            v-model="formData.isbn"
            class="input input-bordered w-full"
            placeholder="Enter ISBN (e.g., 978-3-16-148410-0)"
            required
          />
        </div>

        <!-- Two Column Layout for Year and Publisher -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Published Year -->
          <div class="form-control">
            <label class="label">
              <span class="label-text"
                >Published Year <span class="text-error">*</span></span
              >
            </label>
            <input
              type="number"
              v-model.number="formData.publishedYear"
              class="input input-bordered w-full"
              placeholder="e.g., 2023"
              min="1000"
              max="2030"
              required
            />
          </div>

          <!-- Publisher -->
          <div class="form-control">
            <label class="label">
              <span class="label-text"
                >Publisher <span class="text-error">*</span></span
              >
            </label>
            <input
              type="text"
              v-model="formData.publisher"
              class="input input-bordered w-full"
              placeholder="Enter publisher name"
              required
            />
          </div>
        </div>

        <!-- Two Column Layout for Pages and Language -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Pages -->
          <div class="form-control">
            <label class="label">
              <span class="label-text"
                >Pages <span class="text-error">*</span></span
              >
            </label>
            <input
              type="number"
              v-model.number="formData.pages"
              class="input input-bordered w-full"
              placeholder="e.g., 250"
              min="1"
              required
            />
          </div>

          <!-- Language -->
          <div class="form-control">
            <label class="label">
              <span class="label-text"
                >Language <span class="text-error">*</span></span
              >
            </label>
            <select
              v-model="formData.language"
              class="select select-bordered w-full"
              required
            >
              <option value="" disabled>Select language</option>
              <option value="English">English</option>
              <option value="Afrikaans">Afrikaans</option>
              <option value="Zulu">Zulu</option>
              <option value="Xhosa">Xhosa</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="German">German</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <!-- Two Column Layout for Price and Grade -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Price -->
          <div class="form-control">
            <label class="label">
              <span class="label-text"
                >Price (ZAR) <span class="text-error">*</span></span
              >
            </label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70"
                >R</span
              >
              <input
                type="number"
                v-model.number="formData.price"
                class="input input-bordered w-full pl-8"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <!-- Grade -->
          <div class="form-control">
            <label class="label">
              <span class="label-text"
                >Grade Level <span class="text-error">*</span></span
              >
            </label>
            <select
              v-model.number="formData.grade"
              class="select select-bordered w-full"
              required
            >
              <option value="" disabled>Select grade</option>
              <option :value="1">Grade 1</option>
              <option :value="2">Grade 2</option>
              <option :value="3">Grade 3</option>
              <option :value="4">Grade 4</option>
              <option :value="5">Grade 5</option>
              <option :value="6">Grade 6</option>
              <option :value="7">Grade 7</option>
              <option :value="8">Grade 8</option>
              <option :value="9">Grade 9</option>
              <option :value="10">Grade 10</option>
              <option :value="11">Grade 11</option>
              <option :value="12">Grade 12</option>
            </select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-action">
          <button
            type="button"
            class="btn"
            @click="closeModal"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :class="{ loading: loading }"
            :disabled="loading"
          >
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
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
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
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  price: number;
  grade: number;
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
  publishedYear: new Date().getFullYear(),
  publisher: "",
  pages: 1,
  language: "",
  price: 0,
  grade: 1,
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
        publishedYear: newBook.publishedYear || new Date().getFullYear(),
        publisher: newBook.publisher || "",
        pages: newBook.pages || 1,
        language: newBook.language || "",
        price: newBook.price || 0,
        grade: newBook.grade || 1,
      };
    } else {
      // Reset form for create mode
      formData.value = {
        title: "",
        author: "",
        isbn: "",
        publishedYear: new Date().getFullYear(),
        publisher: "",
        pages: 1,
        language: "",
        price: 0,
        grade: 1,
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
  if (!formData.value.publishedYear || formData.value.publishedYear < 1000) {
    alert("Please enter a valid published year");
    return;
  }
  if (!formData.value.publisher.trim()) {
    alert("Please enter a publisher");
    return;
  }
  if (!formData.value.pages || formData.value.pages < 1) {
    alert("Please enter a valid number of pages");
    return;
  }
  if (!formData.value.language) {
    alert("Please select a language");
    return;
  }
  if (formData.value.price < 0) {
    alert("Please enter a valid price");
    return;
  }
  if (
    !formData.value.grade ||
    formData.value.grade < 1 ||
    formData.value.grade > 12
  ) {
    alert("Please select a valid grade level");
    return;
  }

  loading.value = true;
  try {
    // Create book data object
    const bookData: BookFormData = {
      title: formData.value.title.trim(),
      author: formData.value.author.trim(),
      isbn: formData.value.isbn.trim(),
      publishedYear: formData.value.publishedYear,
      publisher: formData.value.publisher.trim(),
      pages: formData.value.pages,
      language: formData.value.language,
      price: formData.value.price,
      grade: formData.value.grade,
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
      publishedYear: new Date().getFullYear(),
      publisher: "",
      pages: 1,
      language: "",
      price: 0,
      grade: 1,
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
