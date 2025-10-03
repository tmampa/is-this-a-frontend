<template>
  <div>
    <NavBar />
    <div class="main-content space-y-6">
      <!-- Page Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="px-5">
          <h1 class="text-2xl font-bold text-base-content">
            Students Management
          </h1>
          <p class="text-sm text-base-content/60 mt-1">
            🎓 Manage student registrations and track their borrowing activity
          </p>
          <div class="mt-2 text-xs text-base-content/50">
            💡 Tip: Students must be registered before they can borrow books
          </div>
        </div>
        <div class="px-5">
          <div
            class="tooltip tooltip-left"
            data-tip="Register a new student in the library system"
          >
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
              Add Student
            </button>
          </div>
          <div class="text-center mt-1">
            <span class="text-xs text-base-content/50">
              Register new students
            </span>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stats shadow-sm bg-base-100">
          <div class="stat">
            <div class="stat-title">Total Students</div>
            <div class="stat-value text-primary">{{ students.length }}</div>
            <div class="stat-desc">Registered</div>
          </div>
        </div>
        <div class="stats shadow-sm bg-base-100">
          <div class="stat">
            <div class="stat-title">Active Borrowers</div>
            <div class="stat-value text-success">{{ activeBorrowers }}</div>
            <div class="stat-desc">With borrowed books</div>
          </div>
        </div>
        <div class="stats shadow-sm bg-base-100">
          <div class="stat">
            <div class="stat-title">Total Borrowed</div>
            <div class="stat-value text-warning">{{ totalBorrowedBooks }}</div>
            <div class="stat-desc">Books currently out</div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-base-100 rounded-lg shadow-sm p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="form-control flex-1">
            <div
              class="tooltip tooltip-top"
              data-tip="Search by student name, ID number, or email address"
            >
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search students by name, ID, or email..."
                class="input input-bordered w-full"
                title="Search by name, student ID, or email"
              />
            </div>
            <div class="label">
              <span class="label-text-alt text-base-content/60">
                🔍 Search across all student information
              </span>
            </div>
          </div>
          <div class="form-control">
            <div
              class="tooltip tooltip-top"
              data-tip="Filter students by their borrowing activity"
            >
              <select v-model="selectedFilter" class="select select-bordered">
                <option value="">All Students</option>
                <option value="active">Active Borrowers</option>
                <option value="inactive">No Current Borrowings</option>
              </select>
            </div>
            <div class="label">
              <span class="label-text-alt text-base-content/60">
                📊 Filter by activity
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Students List -->
      <div class="px-5 bg-base-100 rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead style="background-color: #458c7f; color: white">
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Borrowed Books</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in paginatedStudents" :key="student.id">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div
                        class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-primary">
                          {{ getInitials(student.fullName) }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div class="font-medium">
                        {{ student.fullName }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="font-mono">{{ student.studentNumber }}</td>
                <td>{{ student.email }}</td>
                <td>
                  <span class="badge badge-outline">
                    {{ getCurrentBorrowedBooksCount(student.id) }} book{{
                      getCurrentBorrowedBooksCount(student.id) !== 1 ? "s" : ""
                    }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'badge-success': hasActiveBorrows(student.id),
                      'badge-ghost': !hasActiveBorrows(student.id),
                    }"
                  >
                    {{ hasActiveBorrows(student.id) ? "Active" : "Inactive" }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <div
                      class="tooltip"
                      data-tip="View student details and borrowing history"
                    >
                      <button
                        @click="viewStudent(student)"
                        class="btn btn-sm btn-ghost"
                        title="View details"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div class="tooltip" data-tip="Edit student information">
                      <button
                        @click="editStudent(student)"
                        class="btn btn-sm btn-ghost"
                        title="Edit student"
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
                    </div>
                    <div
                      class="tooltip"
                      data-tip="Delete student (only if no active borrowings)"
                    >
                      <button
                        @click="deleteStudent(student)"
                        class="btn btn-sm btn-ghost text-error"
                        title="Delete student"
                        :class="{
                          'btn-disabled': hasActiveBorrows(student.id),
                        }"
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
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div
          class="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-base-200"
        >
          <div class="text-sm text-base-content/60 mb-2 sm:mb-0">
            Showing {{ startIndex + 1 }} to
            {{ Math.min(endIndex, totalFilteredStudents) }} of
            {{ totalFilteredStudents }} students
          </div>

          <div class="flex items-center gap-2">
            <!-- Items per page selector -->
            <div class="flex items-center gap-2 mr-4">
              <span class="text-sm text-base-content/60">Show:</span>
              <select
                v-model="itemsPerPage"
                @change="currentPage = 1"
                class="select select-sm select-bordered"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <!-- Pagination buttons -->
            <div class="join">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="join-item btn btn-sm"
                :class="{ 'btn-disabled': currentPage === 1 }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                class="join-item btn btn-sm"
                :class="{ 'btn-primary': page === currentPage }"
              >
                {{ page }}
              </button>

              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="join-item btn btn-sm"
                :class="{ 'btn-disabled': currentPage === totalPages }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredStudents.length === 0" class="text-center py-12">
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-base-content/60">
          No students found
        </h3>
        <p class="mt-1 text-sm text-base-content/40">
          Get started by registering your first student.
        </p>
        <div class="mt-6">
          <button @click="showAddModal = true" class="btn btn-soft btn-primary">
            Add Student
          </button>
        </div>
      </div>
    </div>

    <!-- Add Student Modal -->
    <AddStudentForm v-model:show="showAddModal" @submit="handleAddStudent" />

    <!-- Edit Student Modal -->
    <AddStudentForm
      v-model:show="showEditModal"
      :student="selectedStudent"
      @submit="handleEditStudent"
    />

    <!-- View Student Modal -->
    <ViewStudentModal
      v-model:show="showViewModal"
      :student="selectedStudent"
      @edit="handleViewEdit"
    />

    <!-- Delete Confirmation Modal -->
    <dialog :open="showDeleteModal" class="modal">
      <div class="modal-box">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg text-base-content">Delete Student</h3>
            <p class="text-sm text-base-content/70 mt-1">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div v-if="selectedStudent" class="mb-6">
          <div class="bg-base-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-primary">
                  {{ getInitials(selectedStudent.fullName) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-base-content">
                  {{ selectedStudent.fullName }}
                </p>
                <p class="text-sm text-base-content/70">
                  ID: {{ selectedStudent.studentNumber }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg"
          >
            <div class="flex items-start gap-2">
              <svg
                class="w-5 h-5 text-warning mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div class="text-sm">
                <p class="font-medium text-warning">Warning:</p>
                <p class="text-base-content/70 mt-1">
                  Deleting this student will permanently remove all their
                  information, including borrowing history.
                  <span
                    v-if="
                      selectedStudent && hasActiveBorrows(selectedStudent.id)
                    "
                    class="font-medium text-error"
                  >
                    This student currently has
                    {{
                      selectedStudent
                        ? getCurrentBorrowedBooksCount(selectedStudent.id)
                        : 0
                    }}
                    borrowed book(s).
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button
            type="button"
            class="btn"
            @click="
              showDeleteModal = false;
              selectedStudent = null;
            "
            :disabled="deleteLoading"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-error"
            @click="handleDeleteConfirm"
            :class="{ loading: deleteLoading }"
            :disabled="
              deleteLoading ||
              !!(selectedStudent && hasActiveBorrows(selectedStudent.id))
            "
          >
            <span v-if="deleteLoading">Deleting...</span>
            <span
              v-else-if="
                selectedStudent && hasActiveBorrows(selectedStudent.id)
              "
              >Cannot Delete - Has Borrowed Books</span
            >
            <span v-else>Delete Student</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button
          @click="
            showDeleteModal = false;
            selectedStudent = null;
          "
        >
          close
        </button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Student, BorrowedBook } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";
import AddStudentForm from "~/components/students/CreateStudentForm.vue";
import ViewStudentModal from "~/components/students/ViewStudentModal.vue";

// Check authentication on page load
const { checkAuth, initAuth } = useAuth();

// Component state
const showAddModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const selectedStudent = ref<Student | null>(null);
const searchQuery = ref("");
const selectedFilter = ref("");
const loading = ref(false);
const deleteLoading = ref(false);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Students data from API
const students = ref<Student[]>([]);
const currentBorrowRecords = ref<BorrowedBook[]>([]);

// Fetch students from API
const fetchStudents = async () => {
  loading.value = true;
  try {
    students.value = await LibraryAPI.getStudents();
  } catch (error) {
    console.error("Failed to fetch students:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch current borrow records (only non-returned books)
const fetchBorrowRecords = async () => {
  try {
    const allRecords = await LibraryAPI.getBorrowRecords();
    // Filter out returned books (books with returnDate are already returned)
    currentBorrowRecords.value = allRecords.filter((book) => !book.returnDate);
  } catch (error) {
    console.error("Failed to fetch borrow records:", error);
  }
};

// Initialize data on mount
onMounted(async () => {
  // Initialize auth state first
  initAuth();

  // Check authentication
  if (!checkAuth()) {
    console.log("User not authenticated, redirecting to login");
    await navigateTo("/login");
    return;
  }

  console.log("User authenticated, loading students");
  fetchStudents();
  fetchBorrowRecords();
});

// Helper function to get current borrowed books count for a student
const getCurrentBorrowedBooksCount = (studentId: string): number => {
  return currentBorrowRecords.value.filter(
    (record) => record.studentId === studentId
  ).length;
};

// Helper function to check if student has active borrows
const hasActiveBorrows = (studentId: string): boolean => {
  return getCurrentBorrowedBooksCount(studentId) > 0;
};

// Computed properties
const activeBorrowers = computed(() => {
  // Count students who have books currently borrowed (not returned)
  const studentsWithCurrentBorrows = new Set(
    currentBorrowRecords.value.map((record) => record.studentId)
  );
  return studentsWithCurrentBorrows.size;
});

const totalBorrowedBooks = computed(() => {
  // Count only currently borrowed books (not returned)
  return currentBorrowRecords.value.length;
});

const filteredStudents = computed(() => {
  let filtered = students.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (student) =>
        student.fullName.toLowerCase().includes(query) ||
        student.studentNumber.toString().toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );
  }

  // if (selectedFilter.value === "active") {
  //   filtered = filtered.filter((student) => student.borrowedBooks.length > 0);
  // } else if (selectedFilter.value === "inactive") {
  //   filtered = filtered.filter((student) => student.borrowedBooks.length === 0);
  // }

  return filtered;
});

// Pagination computed properties
const totalFilteredStudents = computed(() => filteredStudents.value.length);
const totalPages = computed(() =>
  Math.ceil(totalFilteredStudents.value / itemsPerPage.value)
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedStudents = computed(() => {
  return filteredStudents.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(
    1,
    currentPage.value - Math.floor(maxVisiblePages / 2)
  );
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function viewStudent(student: Student) {
  console.log("View student:", student);
  selectedStudent.value = student;
  showViewModal.value = true;
}

function editStudent(student: Student) {
  console.log("Edit student:", student);
  selectedStudent.value = student;
  showEditModal.value = true;
}

function deleteStudent(student: Student) {
  console.log("Delete student:", student);
  selectedStudent.value = student;
  showDeleteModal.value = true;
}

// Delete confirmation handler
const handleDeleteConfirm = async () => {
  if (!selectedStudent.value) return;

  // Additional safety check - prevent deletion if student has active borrowed books
  if (selectedStudent.value && hasActiveBorrows(selectedStudent.value.id)) {
    alert(
      "Cannot delete student with active borrowed books. Please ensure all books are returned first."
    );
    return;
  }

  deleteLoading.value = true;
  try {
    await LibraryAPI.deleteStudent(selectedStudent.value.id);

    // Refresh the students list after successful deletion
    await fetchStudents();

    // Close modal and reset
    showDeleteModal.value = false;
    selectedStudent.value = null;

    // Show success message (you could replace this with a toast notification)
    console.log("Student deleted successfully!");
  } catch (error) {
    console.error("Failed to delete student:", error);
    alert("Failed to delete student. Please try again.");
  } finally {
    deleteLoading.value = false;
  }
};

// Handlers
const handleAddStudent = async () => {
  try {
    // Refresh the students list after successful creation
    await fetchStudents();
    showAddModal.value = false;
  } catch (error) {
    console.error("Failed to add student:", error);
  }
};

const handleEditStudent = async () => {
  try {
    // Refresh the students list after successful update
    await fetchStudents();
    showEditModal.value = false;
    selectedStudent.value = null;
  } catch (error) {
    console.error("Failed to update student:", error);
  }
};

const handleViewEdit = (student: Student) => {
  showViewModal.value = false;
  selectedStudent.value = student;
  showEditModal.value = true;
};
</script>

<style scoped>
@media (min-width: 1024px) {
  .main-content {
    margin-left: 280px !important;
    margin-top: 30px;
  }
}
</style>
