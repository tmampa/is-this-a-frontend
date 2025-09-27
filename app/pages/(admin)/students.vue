<template>
  <NavBar />
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      style="margin-top: 60px"
    >
      <div class="px-5">
        <h1 class="text-2xl font-bold text-base-content">
          Students Management
        </h1>
        <p class="text-sm text-base-content/60 mt-1">
          Manage student registrations and records
        </p>
      </div>
      <button
        @click="showAddModal = true"
        class="btn btn-soft btn-primary normal-case px-6 gap-2"
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <div class="stat-title">New This Month</div>
          <div class="stat-value text-info">12</div>
          <div class="stat-desc">Recent registrations</div>
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
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search students by name, ID, or email..."
            class="input input-bordered w-full"
          />
        </div>
        <div class="form-control">
          <select v-model="selectedFilter" class="select select-bordered">
            <option value="">All Students</option>
            <option value="active">Active Borrowers</option>
            <option value="inactive">No Current Borrowings</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Students List -->
    <div class="px-5 bg-base-100 rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
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
            <tr v-for="student in filteredStudents" :key="student.id">
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
                  {{ student.borrowedBooks.length }} book{{
                    student.borrowedBooks.length !== 1 ? "s" : ""
                  }}
                </span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'badge-success': student.borrowedBooks.length > 0,
                    'badge-ghost': student.borrowedBooks.length === 0,
                  }"
                >
                  {{ student.borrowedBooks.length > 0 ? "Active" : "Inactive" }}
                </span>
              </td>
              <td>
                <div class="flex gap-2">
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
                  <button
                    @click="deleteStudent(student)"
                    class="btn btn-sm btn-ghost text-error"
                    title="Delete student"
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
              </td>
            </tr>
          </tbody>
        </table>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Student } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";
import AddStudentForm from "~/components/students/CreateStudentForm.vue";

// Component state
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedStudent = ref<Student | null>(null);
const searchQuery = ref("");
const selectedFilter = ref("");
const loading = ref(false);

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
  // TODO: Implement view modal
}

function editStudent(student: Student) {
  console.log("Edit student:", student);
  selectedStudent.value = student;
  showEditModal.value = true;
}

function deleteStudent(student: Student) {
  console.log("Delete student:", student);
  // TODO: Implement delete confirmation
}

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
</script>
