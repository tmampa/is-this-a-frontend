<template>
  <dialog :open="show" class="modal">
    <div class="modal-box max-w-2xl">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-bold text-lg">Borrow a Book</h3>
          <p class="text-sm text-base-content/60 mt-1">
            📚 Issue a book to a student with condition tracking
          </p>
        </div>
        <div
          class="tooltip tooltip-left"
          data-tip="Need help? Hover over labels for guidance"
        >
          <div
            class="w-6 h-6 bg-info/20 rounded-full flex items-center justify-center"
          >
            <span class="text-xs text-info">?</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Student Selection -->
        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Select the student who will borrow this book"
          >
            <label class="label">
              <span class="label-text"
                >Student <span class="text-error">*</span></span
              >
              <span class="label-text-alt">👤 Required</span>
            </label>
          </div>
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
              {{ student.fullName }}
            </option>
          </select>
          <div class="label">
            <span class="label-text-alt text-base-content/60">
              💡 Can't find the student? Add them from the Students page first
            </span>
          </div>
        </div>

        <!-- Book Selection -->
        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Choose which book to issue - only available books are shown"
          >
            <label class="label">
              <span class="label-text"
                >Book <span class="text-error">*</span></span
              >
              <span class="label-text-alt">📖 Available only</span>
            </label>
          </div>
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

        <!-- Dates
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
        </div> -->

        <!-- create select for book condition -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Book Condition</span>
          </label>
          <select
            v-model="formData.bookCondition"
            class="select select-bordered w-full"
            required
          >
            <option value="" disabled selected>Select book condition</option>
            <option value="new">New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="damaged">Damaged</option>
          </select>
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
            {{ loading ? "Creating..." : "Borrow Book" }}
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
import { ref, computed, onMounted } from "vue";
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

// API calls for real data
const students = ref<Student[]>([]);
const availableBooks = ref<Book[]>([]);
const loading = ref(false);

// Fetch students from API
const fetchStudents = async () => {
  try {
    console.log("Fetching students from API...");
    students.value = await LibraryAPI.getStudents();
    console.log("Students loaded:", students.value);
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }
};

// Fetch available books from API
const fetchBooks = async () => {
  try {
    console.log("Fetching books from API...");
    availableBooks.value = await LibraryAPI.getAvailableBooks();
    console.log("Books loaded:", availableBooks.value);
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }
};

// Load data when component mounts
onMounted(() => {
  fetchStudents();
  fetchBooks();
});

// Form state
const formData = ref({
  studentId: "",
  bookId: "",
  dueDate: "",
  bookCondition: "",
  beforeConditionImages: [] as File[],
});

// Handlers
const handleImagesUpdate = (images: File[]) => {
  formData.value.beforeConditionImages = images;
};

const handleSubmit = async () => {
  if (formData.value.beforeConditionImages.length === 0) {
    alert("Please upload at least one condition image");
    return;
  }

  loading.value = true;
  try {
    // Find the selected book to get its title
    const selectedBook = availableBooks.value.find(
      (book) => book.id === formData.value.bookId
    );
    if (!selectedBook) {
      alert("Selected book not found");
      return;
    }

    // Find the selected student to get their details
    const selectedStudent = students.value.find(
      (student) => student.id === formData.value.studentId
    );
    if (!selectedStudent) {
      alert("Selected student not found");
      return;
    }

    // Debug logging to help identify data structure issues
    console.log("Selected student:", selectedStudent);
    console.log("Student Number field:", selectedStudent.studentNumber);

    // Use student number directly
    const studentNumber = selectedStudent.studentNumber;

    if (!studentNumber || studentNumber === 0) {
      console.warn("Invalid student number:", selectedStudent.studentNumber);
      alert("Invalid student number. Please contact administrator.");
      return;
    }

    // Step 1: Create borrow record using LibraryAPI
    const recordId = await LibraryAPI.createBorrowRecord(selectedBook.title, {
      fullName: `${selectedStudent.fullName}`,
      studentNumber: studentNumber,
      emails: [], // Backend will get from existing student data
      address: "", // Backend will get from existing student data
      bookCondition: formData.value.bookCondition,
      beforeConditionImages: formData.value.beforeConditionImages,
    });

    // Step 2: Upload images using the returned recordId
    await LibraryAPI.uploadImages(
      recordId,
      formData.value.beforeConditionImages
    );

    // Emit success event
    emit("submit", {
      fullName: `${selectedStudent.fullName}`,
      studentNumber: studentNumber,
      emails: [],
      address: "",
      bookCondition: formData.value.bookCondition,
      beforeConditionImages: formData.value.beforeConditionImages,
    });

    // Reset form
    formData.value = {
      studentId: "",
      bookId: "",
      dueDate: "",
      bookCondition: "",
      beforeConditionImages: [],
    };

    // Close modal
    closeModal();
  } catch (error) {
    console.error("Failed to create borrow record:", error);
    alert("Failed to borrow book. Please try again.");
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit("update:show", false);
};
</script>
