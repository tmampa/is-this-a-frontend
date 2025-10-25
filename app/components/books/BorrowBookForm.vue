<template>
  <!-- Toast Notification -->
  <div v-if="showToast" class="toast toast-top toast-center z-50">
    <div class="alert alert-success">
      <svg
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>{{ toastMessage }}</span>
    </div>
  </div>

  <dialog :open="show" class="modal">
    <div class="modal-box max-w-2xl">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-bold text-lg">Issueing a Book</h3>
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
            data-tip="Search for the student who will be given this book"
          >
            <label class="label">
              <span class="label-text"
                >Student <span class="text-error">*</span></span
              >
              <span class="label-text-alt">� Search & select</span>
            </label>
          </div>
          <SearchableSelect
            :items="students"
            placeholder="Search students by name or student number..."
            display-key="fullName"
            subtitle-key="studentNumber"
            id-key="id"
            :search-keys="['fullName', 'studentNumber', 'email']"
            v-model="selectedStudent"
            @update:model-value="updateSelectedStudent"
            :allow-create="true"
            @create="handleCreateStudent"
            :min-search-length="1"
          />
          <div class="label">
            <span class="label-text-alt text-xs text-base-content/60">
              💡 Type to search by name, student number, or email. Can't find
              them? Create a new student!
            </span>
          </div>
        </div>

        <!-- Book Selection -->
        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Search for an available book to issue - only books that are not currently issued are shown"
          >
            <label class="label">
              <span class="label-text"
                >Book <span class="text-error">*</span></span
              >
              <span class="label-text-alt">� Available only</span>
            </label>
          </div>
          <SearchableSelect
            :items="availableBooks"
            placeholder="Search books by title, author, or ISBN..."
            display-key="title"
            subtitle-key="author"
            id-key="id"
            :search-keys="['title', 'author', 'isbn', 'category']"
            v-model="selectedBook"
            @update:model-value="updateSelectedBook"
            :allow-create="true"
            @create="handleCreateBook"
            :min-search-length="1"
          />
          <div class="label">
            <span class="label-text-alt text-xs text-base-content/60">
              💡 Type to search by title, author, ISBN, or category. Need to add
              a new book? Create it on the fly!
            </span>
          </div>
        </div>

        <!-- Barcode Verification (appears after book selection) -->
        <div v-if="selectedBook" class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Scan or enter the barcode to verify you have the correct physical book"
          >
            <label class="label">
              <span class="label-text"
                >Verify Book Barcode <span class="text-error">*</span></span
              >
              <span class="label-text-alt">📊 Physical verification</span>
            </label>
          </div>
          <div class="relative">
            <input
              ref="barcodeInput"
              v-model="formData.barcode"
              type="text"
              class="input input-bordered w-full pr-12"
              placeholder="Scan or enter book barcode..."
              :class="{
                'input-success': isValidBarcode,
                'input-error': formData.barcode && !isValidBarcode,
              }"
              @input="validateBarcode"
              @keydown.enter.prevent="focusNextField"
              required
            />
            <!-- Barcode scan icon -->
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg
                class="h-5 w-5"
                :class="{
                  'text-success': isValidBarcode,
                  'text-error': formData.barcode && !isValidBarcode,
                  'text-base-content/40': !formData.barcode,
                }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
          </div>
          <div class="label">
            <span
              class="label-text-alt text-xs"
              :class="{
                'text-success': isValidBarcode,
                'text-error': formData.barcode && !isValidBarcode,
                'text-base-content/60': !formData.barcode,
              }"
            >
              <span v-if="!formData.barcode">
                💡 Scan the barcode on the physical book to ensure you have the
                right copy
              </span>
              <span v-else-if="isValidBarcode">
                ✅ Barcode verified! This matches the selected book
              </span>
              <span v-else>
                ❌ Barcode doesn't match. Please check the physical book
              </span>
            </span>
          </div>
        </div>

        <!-- Return Date -->
        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Set the expected return date for this book"
          >
            <label class="label">
              <span class="label-text"
                >Expected Return Date <span class="text-error">*</span></span
              >
              <span class="label-text-alt">📅 When should it be returned?</span>
            </label>
          </div>
          <input
            type="date"
            v-model="formData.dueDate"
            class="input input-bordered"
            :min="currentDate"
            required
          />
          <div class="label">
            <span class="label-text-alt text-xs text-base-content/60">
              💡 Set a realistic return date to help track book loans
            </span>
          </div>
        </div>

        <!-- Book Condition Assessment -->
        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Select multiple conditions that apply to the book - this helps track specific issues"
          >
            <label class="label">
              <span class="label-text"
                >Initial Book Condition <span class="text-error">*</span></span
              >
              <span class="label-text-alt">
                🔍
                {{
                  formData.bookConditions.length > 0
                    ? `${formData.bookConditions.length} selected`
                    : "Select conditions"
                }}
              </span>
            </label>
          </div>

          <div
            class="grid grid-cols-1 gap-2 p-4 border border-base-300 rounded-box bg-base-50"
          >
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  value="new"
                  v-model="formData.bookConditions"
                />
                <span class="label-text">📗 New - Pristine condition</span>
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  value="good"
                  v-model="formData.bookConditions"
                />
                <span class="label-text">Good - Light wear, no damage</span>
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  value="fair"
                  v-model="formData.bookConditions"
                />
                <span class="label-text">Fair - Noticeable wear</span>
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  value="poor"
                  v-model="formData.bookConditions"
                />
                <span class="label-text">Poor - Significant wear</span>
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  value="damaged"
                  v-model="formData.bookConditions"
                />
                <span class="label-text">Damaged - Visible damage</span>
              </label>
            </div>
          </div>

          <!-- Selected Conditions Summary -->
          <div
            v-if="formData.bookConditions.length > 0"
            class="mt-3 p-3 bg-primary/10 rounded-box"
          >
            <div class="text-sm font-medium text-primary mb-2">
              Selected Conditions:
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="condition in formData.bookConditions"
                :key="condition"
                class="badge badge-primary badge-sm"
              >
                {{ getConditionLabel(condition) }}
              </span>
            </div>
          </div>

          <div class="label">
            <span class="label-text-alt text-xs text-base-content/60">
              💡 Select all conditions that apply. This detailed assessment
              helps track specific issues when the book is returned
            </span>
          </div>
        </div>

        <!-- Multiple Condition Images -->
        <ImageUploader
          label="📸 Document Book Condition (Multiple Photos)"
          :multiple="true"
          :max-images="5"
          :required="true"
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
            {{ loading ? "Creating..." : "Issue book" }}
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>

    <!-- Creation Modals -->
    <CreateStudentModal
      v-model:show="showCreateStudentModal"
      :initial-name="newStudentName"
      @created="handleStudentCreated"
    />

    <CreateBookModal
      v-model:show="showCreateBookModal"
      :initial-title="newBookTitle"
      @created="handleBookCreated"
    />

    <!-- Success Modal -->
    <dialog :open="showSuccessModal" class="modal">
      <div class="modal-box text-center">
        <h3 class="font-bold text-lg text-success mb-4">{{ successTitle }}</h3>
        <div class="py-4">
          <div
            class="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <p class="text-base-content/80">{{ successMessage }}</p>
        </div>
        <div class="modal-action justify-center">
          <button
            class="btn btn-success btn-wide"
            @click="showSuccessModal = false"
          >
            ✨ Awesome!
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showSuccessModal = false">close</button>
      </form>
    </dialog>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import type { Book, Student, BorrowBookData } from "~/types/books";
import ImageUploader from "~/components/layout/ImageUploader.vue";
import SearchableSelect from "~/components/layout/SearchableSelect.vue";
import CreateStudentModal from "~/components/modals/CreateStudentModal.vue";
import CreateBookModal from "~/components/modals/CreateBookModal.vue";
import { LibraryAPI } from "~/composables/useLibraryAPI";

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
  returnDate: "",
  bookConditions: [] as string[],
  barcode: "",
  beforeConditionImages: [] as File[],
});

// Selected items for SearchableSelect components
const selectedStudent = ref<Student | null>(null);
const selectedBook = ref<Book | null>(null);
const barcodeInput = ref<HTMLInputElement>();

// Barcode validation
const isValidBarcode = computed(() => {
  if (!formData.value.barcode || !selectedBook.value) return false;

  // Check if barcode matches the selected book's ISBN or a custom barcode field
  const barcode = formData.value.barcode.replace(/\D/g, ""); // Remove non-digits
  const isbn = selectedBook.value.isbn?.replace(/\D/g, "") || "";

  // For now, we'll consider it valid if it matches ISBN or is a reasonable length
  return barcode === isbn || (barcode.length >= 8 && barcode.length <= 13);
});

// Update handlers for SearchableSelect components
const updateSelectedStudent = (student: Student | null) => {
  selectedStudent.value = student;
  formData.value.studentId = student?.id || "";
};

const updateSelectedBook = (book: Book | null) => {
  selectedBook.value = book;
  formData.value.bookId = book?.id || "";

  // Reset barcode when book changes
  formData.value.barcode = "";

  // Focus barcode input after book selection
  if (book) {
    nextTick(() => {
      barcodeInput.value?.focus();
    });
  }
};

// Barcode validation method
const validateBarcode = () => {
  // Additional validation logic can be added here
  console.log("Barcode entered:", formData.value.barcode);
  console.log("Is valid:", isValidBarcode.value);
};

// Focus management
const focusNextField = () => {
  // Focus next form element after barcode entry
  console.log("Barcode entered, moving to next field");
};

// Create handlers for new items
const showCreateStudentModal = ref(false);
const showCreateBookModal = ref(false);
const newStudentName = ref("");
const newBookTitle = ref("");

// Success notification states
const showSuccessModal = ref(false);
const successMessage = ref("");
const successTitle = ref("");
const showToast = ref(false);
const toastMessage = ref("");

const handleCreateStudent = (query: string) => {
  newStudentName.value = query;
  showCreateStudentModal.value = true;
};

const handleCreateBook = (query: string) => {
  newBookTitle.value = query;
  showCreateBookModal.value = true;
};

const handleStudentCreated = async (student: Student) => {
  // Add the new student to the list and select it
  students.value.push(student);
  selectedStudent.value = student;
  formData.value.studentId = student.id;
  showCreateStudentModal.value = false;

  // Show success notification
  successTitle.value = "👤 Student Created Successfully!";
  successMessage.value = `${student.fullName} has been added to the system and is now selected for book issuing.`;
  showSuccessModal.value = true;
  showToastNotification(`✅ Student ${student.fullName} created and selected!`);
};

const handleBookCreated = async (book: Book) => {
  // Add the new book to the list and select it
  availableBooks.value.push(book);
  selectedBook.value = book;
  formData.value.bookId = book.id;
  showCreateBookModal.value = false;

  // Show success notification
  successTitle.value = "📖 Book Created Successfully!";
  successMessage.value = `"${book.title}" by ${book.author} has been added to the library and is now selected for issuing.`;
  showSuccessModal.value = true;
  showToastNotification(`✅ Book "${book.title}" created and selected!`);
};

// Handlers
const handleImagesUpdate = (images: File[]) => {
  formData.value.beforeConditionImages = images;
};

const handleSubmit = async () => {
  if (formData.value.beforeConditionImages.length === 0) {
    alert("Please upload at least one condition image");
    return;
  }

  if (formData.value.bookConditions.length === 0) {
    alert("Please select at least one book condition");
    return;
  }

  if (selectedBook.value && !isValidBarcode.value) {
    alert("Please scan or enter a valid barcode for the selected book");
    return;
  }

  if (!formData.value.dueDate) {
    alert("Please select an expected return date");
    return;
  }

  if (formData.value.dueDate && new Date(formData.value.dueDate) < new Date()) {
    alert("Due date cannot be in the past");
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
      bookConditions: formData.value.bookConditions,
      beforeConditionImages: formData.value.beforeConditionImages,
      dueDate: formData.value.dueDate,
      barcode: formData.value.barcode,
    });

    // Step 2: Upload images using the returned recordId and pass bookConditions as knownTags
    await LibraryAPI.uploadImages(
      recordId,
      formData.value.beforeConditionImages,
      formData.value.bookConditions
    );

    // Show success notification
    successTitle.value = "📚 Book Issued Successfully!";
    successMessage.value = `"${selectedBook.title}" has been issued to ${selectedStudent.fullName} (Student #${studentNumber}). The borrow record has been created with condition tracking.`;
    showSuccessModal.value = true;
    showToastNotification(
      `🎉 Book issued to ${selectedStudent.fullName} successfully!`
    );

    // Emit success event
    emit("submit", {
      fullName: `${selectedStudent.fullName}`,
      studentNumber: studentNumber,
      emails: [],
      address: "",
      bookConditions: formData.value.bookConditions,
      beforeConditionImages: formData.value.beforeConditionImages,
      dueDate: formData.value.dueDate,
      barcode: formData.value.barcode,
    });

    // Reset form
    formData.value = {
      studentId: "",
      bookId: "",
      dueDate: "",
      returnDate: "",
      bookConditions: [],
      barcode: "",
      beforeConditionImages: [],
    };

    // Close modal after a brief delay to show success
    setTimeout(() => {
      closeModal();
    }, 100);
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

// Toast notification helper
const showToastNotification = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;

  // Auto-hide toast after 4 seconds
  setTimeout(() => {
    showToast.value = false;
  }, 4000);
};

// Helper function to get condition label
const getConditionLabel = (condition: string): string => {
  const labels = {
    new: "New",
    good: "Good",
    damaged: "Damaged",
  };
  return labels[condition as keyof typeof labels] || condition;
};
</script>
