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
            data-tip="Search for the student who will borrow this book"
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
            data-tip="Search for an available book to issue - only books that are not currently borrowed are shown"
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

        <!-- Book Condition Assessment -->
        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Assess the book's current condition before lending - this helps track damage and loss"
          >
            <label class="label">
              <span class="label-text"
                >Initial Book Condition <span class="text-error">*</span></span
              >
              <span class="label-text-alt">🔍 Before lending</span>
            </label>
          </div>
          <select
            v-model="formData.bookCondition"
            class="select select-bordered w-full"
            required
          >
            <option value="" disabled selected>Assess current condition</option>
            <option value="new">📗 New - Pristine condition</option>
            <option value="excellent">📘 Excellent - Minimal wear</option>
            <option value="good">📙 Good - Light wear, no damage</option>
            <option value="fair">📒 Fair - Noticeable wear</option>
            <option value="poor">📑 Poor - Significant wear</option>
            <option value="damaged">📕 Damaged - Visible damage</option>
          </select>
          <div class="label">
            <span class="label-text-alt text-xs text-base-content/60">
              💡 This will be compared with the return condition to assess
              damage
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
            {{ loading ? "Creating..." : "Borrow Book" }}
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
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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
  bookCondition: "",
  beforeConditionImages: [] as File[],
});

// Selected items for SearchableSelect components
const selectedStudent = ref<Student | null>(null);
const selectedBook = ref<Book | null>(null);

// Update handlers for SearchableSelect components
const updateSelectedStudent = (student: Student | null) => {
  selectedStudent.value = student;
  formData.value.studentId = student?.id || "";
};

const updateSelectedBook = (book: Book | null) => {
  selectedBook.value = book;
  formData.value.bookId = book?.id || "";
};

// Create handlers for new items
const showCreateStudentModal = ref(false);
const showCreateBookModal = ref(false);
const newStudentName = ref("");
const newBookTitle = ref("");

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
};

const handleBookCreated = async (book: Book) => {
  // Add the new book to the list and select it
  availableBooks.value.push(book);
  selectedBook.value = book;
  formData.value.bookId = book.id;
  showCreateBookModal.value = false;
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
