<template>
  <NavBar />
  <div class="container-fluid py-4">
    <!-- Page Header -->
    <div class="row align-items-center mb-4" style="margin-top: 60px">
      <div class="col">
        <div class="px-3">
          <h1 class="h2 fw-bold text-dark mb-1">Students Management</h1>
          <p class="text-muted small mb-0">
            Manage student registrations and records
          </p>
        </div>
      </div>
      <div class="col-auto">
        <button
          @click="showAddModal = true"
          class="btn btn-primary d-flex align-items-center gap-2"
        >
          <i class="bi bi-plus-lg"></i>
          Add Student
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted small text-uppercase mb-1">
              Total Students
            </div>
            <div class="h3 fw-bold text-primary mb-1">
              {{ students.length }}
            </div>
            <div class="text-muted small">Registered</div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted small text-uppercase mb-1">
              Active Borrowers
            </div>
            <div class="h3 fw-bold text-success mb-1">
              {{ activeBorrowers }}
            </div>
            <div class="text-muted small">With borrowed books</div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted small text-uppercase mb-1">
              New This Month
            </div>
            <div class="h3 fw-bold text-info mb-1">12</div>
            <div class="text-muted small">Recent registrations</div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="text-muted small text-uppercase mb-1">
              Total Borrowed
            </div>
            <div class="h3 fw-bold text-warning mb-1">
              {{ totalBorrowedBooks }}
            </div>
            <div class="text-muted small">Books currently out</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search students by name, ID, or email..."
                class="form-control"
              />
            </div>
          </div>
          <div class="col-md-4">
            <select v-model="selectedFilter" class="form-select">
              <option value="">All Students</option>
              <option value="active">Active Borrowers</option>
              <option value="inactive">No Current Borrowings</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Students List -->
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="fw-medium">Student</th>
                <th class="fw-medium">Student ID</th>
                <th class="fw-medium">Email</th>
                <th class="fw-medium">Borrowed Books</th>
                <th class="fw-medium">Status</th>
                <th class="fw-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.id">
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div
                      class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle"
                      style="width: 40px; height: 40px"
                    >
                      <span class="small fw-medium text-primary">
                        {{ getInitials(student.fullName) }}
                      </span>
                    </div>
                    <div>
                      <div class="fw-medium">{{ student.fullName }}</div>
                    </div>
                  </div>
                </td>
                <td class="font-monospace">{{ student.studentNumber }}</td>
                <td>{{ student.email }}</td>
                <td>
                  <span class="badge bg-light text-dark border">
                    {{ student.borrowedBooks.length }} book{{
                      student.borrowedBooks.length !== 1 ? "s" : ""
                    }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-success': student.borrowedBooks.length > 0,
                      'bg-secondary': student.borrowedBooks.length === 0,
                    }"
                  >
                    {{
                      student.borrowedBooks.length > 0 ? "Active" : "Inactive"
                    }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm" role="group">
                    <button
                      @click="viewStudent(student)"
                      class="btn btn-outline-info"
                      title="View details"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      @click="editStudent(student)"
                      class="btn btn-outline-primary"
                      title="Edit student"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      @click="deleteStudent(student)"
                      class="btn btn-outline-danger"
                      title="Delete student"
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
    <div v-if="filteredStudents.length === 0" class="text-center py-5">
      <div class="mb-3">
        <i class="bi bi-people display-1 text-muted opacity-50"></i>
      </div>
      <h5 class="text-muted mb-2">No students found</h5>
      <p class="text-muted mb-4">
        Get started by registering your first student.
      </p>
      <button @click="showAddModal = true" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>Add Student
      </button>
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
                Delete Student
              </h5>
              <p class="text-muted small mb-0">This action cannot be undone</p>
            </div>
          </div>
          <button
            type="button"
            class="btn-close"
            @click="
              showDeleteModal = false;
              selectedStudent = null;
            "
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="selectedStudent">
          <div class="card bg-light mb-3">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div
                  class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle"
                  style="width: 40px; height: 40px"
                >
                  <span class="small fw-medium text-primary">
                    {{ getInitials(selectedStudent.fullName) }}
                  </span>
                </div>
                <div>
                  <h6 class="mb-1">{{ selectedStudent.fullName }}</h6>
                  <p class="text-muted small mb-0">
                    ID: {{ selectedStudent.studentNumber }}
                  </p>
                </div>
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
                Deleting this student will permanently remove all their
                information, including borrowing history.
                <span
                  v-if="(selectedStudent?.borrowedBooks?.length || 0) > 0"
                  class="d-block mt-1 text-danger fw-medium"
                >
                  This student currently has
                  {{ selectedStudent?.borrowedBooks?.length || 0 }} borrowed
                  book(s).
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
              selectedStudent = null;
            "
            :disabled="deleteLoading"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="handleDeleteConfirm"
            :disabled="
              deleteLoading || (selectedStudent?.borrowedBooks?.length || 0) > 0
            "
          >
            <span v-if="deleteLoading">
              <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Deleting...
            </span>
            <span v-else-if="(selectedStudent?.borrowedBooks?.length || 0) > 0">
              Cannot Delete - Has Borrowed Books
            </span>
            <span v-else>Delete Student</span>
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
      selectedStudent = null;
    "
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Student } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";
import AddStudentForm from "~/components/students/CreateStudentForm.vue";
import ViewStudentModal from "~/components/students/ViewStudentModal.vue";

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

// Students data from API
const students = ref<Student[]>([]);

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

// Initialize data on mount
onMounted(() => {
  fetchStudents();
});

// Computed properties
const activeBorrowers = computed(() => {
  return students.value.filter((student) => student.borrowedBooks.length > 0)
    .length;
});

const totalBorrowedBooks = computed(() => {
  return students.value.reduce(
    (total, student) => total + student.borrowedBooks.length,
    0
  );
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

// Methods
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

  // Additional safety check - prevent deletion if student has borrowed books
  if ((selectedStudent.value?.borrowedBooks?.length || 0) > 0) {
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
