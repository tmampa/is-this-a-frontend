<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="borrowBookModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="borrowBookModalLabel">Borrow a Book</h5>
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
              <!-- Student Selection -->
              <div class="col-md-6">
                <label for="studentSelect" class="form-label"
                  >Student <span class="text-danger">*</span></label
                >
                <select
                  id="studentSelect"
                  v-model="formData.studentId"
                  class="form-select"
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
              </div>

              <!-- Book Selection -->
              <div class="col-md-6">
                <label for="bookSelect" class="form-label"
                  >Book <span class="text-danger">*</span></label
                >
                <select
                  id="bookSelect"
                  v-model="formData.bookId"
                  class="form-select"
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

              <!-- Book Condition -->
              <div class="col-12">
                <label for="bookCondition" class="form-label"
                  >Book Condition <span class="text-danger">*</span></label
                >
                <select
                  id="bookCondition"
                  v-model="formData.bookCondition"
                  class="form-select"
                  required
                >
                  <option value="" disabled selected>
                    Select book condition
                  </option>
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              <!-- Book Condition Images -->
              <div class="col-12">
                <ImageUploader
                  label="Book Condition Images"
                  :multiple="true"
                  :max-images="5"
                  @update:images="handleImagesUpdate"
                />
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
              {{ loading ? "Creating..." : "Borrow Book" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show" @click="closeModal"></div>
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
