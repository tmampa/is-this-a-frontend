<template>
  <dialog :open="show" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-6">Borrow a Book</h3>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Student Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Student</span>
          </label>
          <select
            v-model="formData.studentId"
            class="select select-bordered w-full"
            required
          >
            <option value="" disabled selected>Select a student</option>
            <option
              v-for="student in students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.name }}
            </option>
          </select>
        </div>

        <!-- Book Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Book</span>
          </label>
          <select
            v-model="formData.bookId"
            class="select select-bordered w-full"
            required
          >
            <option value="" disabled selected>Select a book</option>
            <option
              v-for="book in availableBooks"
              :key="book.id"
              :value="book.id"
            >
              {{ book.title }}
            </option>
          </select>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Borrow Date</span>
            </label>
            <input
              type="date"
              :value="currentDate"
              class="input input-bordered bg-base-200"
              disabled
            />
            <label class="label">
              <span class="label-text-alt text-base-content/60"
                >Automatically set to today</span
              >
            </label>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Due Date</span>
            </label>
            <input
              type="date"
              v-model="formData.dueDate"
              class="input input-bordered"
              :min="currentDate"
              required
            />
          </div>
        </div>

        <!-- Book Condition Images -->
        <ImageUploader
          label="Book Condition Images"
          :multiple="true"
          :max-images="5"
          @update:images="handleImagesUpdate"
        />

        <!-- Action Buttons -->
        <div class="modal-action">
          <button type="button" class="btn" @click="closeModal">Cancel</button>
          <button type="submit" class="btn btn-primary">Borrow Book</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Book, Student, BorrowBookData } from "~/types/books";
import ImageUploader from "~/components/layout/ImageUploader.vue";

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "submit", data: BorrowBookData): void;
}>();

// Current date
const currentDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

// Mock data - Replace with API calls
const students = ref<Student[]>([
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
]);

const availableBooks = ref<Book[]>([
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
]);

// Form state
const formData = ref({
  studentId: "",
  bookId: "",
  dueDate: "",
  beforeConditionImages: [] as File[],
});

// Handlers
const handleImagesUpdate = (images: File[]) => {
  formData.value.beforeConditionImages = images;
};

const handleSubmit = () => {
  if (formData.value.beforeConditionImages.length === 0) {
    alert("Please upload at least one condition image");
    return;
  }

  emit("submit", {
    studentId: formData.value.studentId,
    bookId: formData.value.bookId,
    borrowDate: currentDate.value,
    dueDate: formData.value.dueDate,
    beforeConditionImages: formData.value.beforeConditionImages,
  } as BorrowBookData);

  // Reset form
  formData.value = {
    studentId: "",
    bookId: "",
    dueDate: "",
    beforeConditionImages: [],
  };
};

const closeModal = () => {
  emit("update:show", false);
};
</script>
