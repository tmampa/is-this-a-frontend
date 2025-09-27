<!-- CreateBookModal.vue - Quick book creation modal -->
<template>
  <dialog :open="show" class="modal">
    <div class="modal-box">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-bold text-lg">Create New Book</h3>
          <p class="text-sm text-base-content/60 mt-1">
            📚 Add a new book to the library
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
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
            placeholder="978-0-123456-78-9"
            required
          />
        </div>

        <!-- Category -->
        <div class="form-control">
          <label class="label">
            <span class="label-text"
              >Category <span class="text-error">*</span></span
            >
          </label>
          <select
            v-model="formData.category"
            class="select select-bordered w-full"
            required
          >
            <option value="" disabled>Select category</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Biography">Biography</option>
            <option value="Children">Children's Books</option>
            <option value="Reference">Reference</option>
            <option value="Textbook">Textbook</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Description (Optional) -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Description</span>
            <span class="label-text-alt text-base-content/60">Optional</span>
          </label>
          <textarea
            v-model="formData.description"
            class="textarea textarea-bordered"
            placeholder="Brief description of the book (optional)"
            rows="2"
          ></textarea>
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
            {{ loading ? "Creating..." : "Create Book" }}
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
import { ref, watch } from "vue";
import type { Book } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";

const props = defineProps<{
  show: boolean;
  initialTitle?: string;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "created", book: Book): void;
}>();

const loading = ref(false);
const formData = ref({
  title: props.initialTitle || "",
  author: "",
  isbn: "",
  category: "",
  description: "",
});

// Reset form when modal is opened with new initial title
watch(
  () => props.initialTitle,
  (newTitle) => {
    if (newTitle && props.show) {
      formData.value.title = newTitle;
    }
  }
);

const handleSubmit = async () => {
  loading.value = true;
  try {
    const newBook = await LibraryAPI.createBook({
      title: formData.value.title,
      author: formData.value.author,
      isbn: formData.value.isbn,
      category: formData.value.category,
      description: formData.value.description || undefined,
    });

    emit("created", newBook);
    resetForm();
    closeModal();
  } catch (error) {
    console.error("Failed to create book:", error);
    alert("Failed to create book. Please try again.");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
  };
};

const closeModal = () => {
  emit("update:show", false);
};

// Reset form when modal is closed
watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
  }
);
</script>
