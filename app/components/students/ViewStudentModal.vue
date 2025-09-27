<template>
  <dialog :open="show" class="modal">
    <div class="modal-box max-w-4xl">
      <div class="flex justify-between items-start mb-6">
        <h3 class="font-bold text-lg">Student Details</h3>
        <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
          ✕
        </button>
      </div>

      <div v-if="student" class="space-y-8">
        <!-- Student Header -->
        <div class="flex items-center gap-6 p-6 bg-base-200 rounded-lg">
          <div class="avatar">
            <div
              class="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <span class="text-2xl font-bold text-primary">
                {{ getInitials(student.fullName) }}
              </span>
            </div>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-base-content">
              {{ student.fullName }}
            </h2>
            <div class="flex flex-wrap gap-4 mt-2 text-sm text-base-content/70">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  ></path>
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  ></path>
                </svg>
                {{ student.email }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                ID: {{ student.studentNumber }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div
              class="badge badge-lg"
              :class="{
                'badge-success': currentBorrowedBooks.length > 0,
                'badge-ghost': currentBorrowedBooks.length === 0,
              }"
            >
              {{
                currentBorrowedBooks.length > 0 ? "Active Borrower" : "Inactive"
              }}
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Student Details -->
          <div class="space-y-4">
            <h4
              class="font-semibold text-lg text-base-content border-b border-base-300 pb-2"
            >
              Personal Information
            </h4>

            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-base-200">
                <span class="font-medium text-base-content/70"
                  >First Names:</span
                >
                <span class="text-base-content">{{
                  student.firstNames || getFirstNames(student.fullName)
                }}</span>
              </div>

              <div class="flex justify-between py-2 border-b border-base-200">
                <span class="font-medium text-base-content/70">Last Name:</span>
                <span class="text-base-content">{{
                  student.lastName || getLastName(student.fullName)
                }}</span>
              </div>

              <div class="flex justify-between py-2 border-b border-base-200">
                <span class="font-medium text-base-content/70"
                  >Student Number:</span
                >
                <span class="font-mono text-base-content">{{
                  student.studentNumber
                }}</span>
              </div>

              <div class="flex justify-between py-2 border-b border-base-200">
                <span class="font-medium text-base-content/70">Email:</span>
                <span class="text-base-content">{{ student.email }}</span>
              </div>

              <div class="flex justify-between py-2">
                <span class="font-medium text-base-content/70">Address:</span>
                <span class="text-base-content text-right max-w-xs">
                  {{ student.address || "Not provided" }}
                </span>
              </div>
            </div>
          </div>

          <!-- Parents/Guardians -->
          <div class="space-y-4">
            <h4
              class="font-semibold text-lg text-base-content border-b border-base-300 pb-2"
            >
              Parents/Guardians
            </h4>

            <div
              v-if="student.parents && student.parents.length > 0"
              class="space-y-4"
            >
              <div
                v-for="(parent, index) in student.parents"
                :key="index"
                class="p-4 bg-base-100 rounded-lg border"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h5 class="font-medium text-base-content">
                      {{ parent.name }}
                    </h5>
                    <p class="text-sm text-base-content/70">
                      {{ parent.relationship }}
                    </p>
                    <a
                      :href="`mailto:${parent.email}`"
                      class="text-sm text-primary hover:underline"
                    >
                      {{ parent.email }}
                    </a>
                  </div>
                  <div class="badge badge-outline badge-sm">
                    {{ parent.relationship }}
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-base-content/50">
              <svg
                class="w-8 h-8 mx-auto mb-2 opacity-50"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                ></path>
              </svg>
              <p class="text-sm">No parent/guardian information available</p>
            </div>
          </div>
        </div>

        <!-- Borrowed Books Section -->
        <div class="space-y-4">
          <div
            class="flex justify-between items-center border-b border-base-300 pb-2"
          >
            <h4 class="font-semibold text-lg text-base-content">
              Borrowing History
            </h4>
            <div class="flex gap-2">
              <span class="badge badge-primary">
                {{ currentBorrowedBooks.length }} currently borrowed
              </span>
              <span class="badge badge-ghost">
                {{ returnedBooks.length }} returned
              </span>
            </div>
          </div>

          <!-- Loading State -->
          <div
            v-if="loadingHistory"
            class="flex items-center justify-center py-8"
          >
            <span class="loading loading-spinner loading-lg"></span>
          </div>

          <!-- Current Borrowed Books -->
          <div v-else-if="currentBorrowedBooks.length > 0">
            <h5
              class="font-medium text-base-content mb-3 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4 text-warning"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
                ></path>
              </svg>
              Currently Borrowed Books
            </h5>
            <div class="grid gap-3 mb-6">
              <div
                v-for="record in currentBorrowedBooks"
                :key="record.id"
                class="p-4 bg-warning/10 border border-warning/30 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <h6 class="font-medium text-base-content">
                    {{ record.bookTitle }}
                  </h6>
                  <div class="flex gap-2">
                    <span
                      v-if="getDaysOverdue(record.dueDate) > 0"
                      class="badge badge-error"
                    >
                      {{ getDaysOverdue(record.dueDate) }} days overdue
                    </span>
                    <span v-else class="badge badge-warning">Active</span>
                  </div>
                </div>
                <div class="text-sm text-base-content/70 space-y-1">
                  <div class="flex justify-between">
                    <span>Borrowed:</span>
                    <span>{{ formatDate(record.borrowDate) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Due:</span>
                    <span
                      :class="{
                        'text-error font-medium':
                          getDaysOverdue(record.dueDate) > 0,
                      }"
                    >
                      {{ formatDate(record.dueDate) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Returned Books History -->
          <div v-if="returnedBooks.length > 0">
            <h5
              class="font-medium text-base-content mb-3 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4 text-success"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Previously Returned Books
            </h5>
            <div class="grid gap-3 max-h-64 overflow-y-auto">
              <div
                v-for="record in returnedBooks"
                :key="record.id"
                class="p-4 bg-success/5 border border-success/20 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <h6 class="font-medium text-base-content">
                    {{ record.bookTitle }}
                  </h6>
                  <span class="badge badge-success">Returned</span>
                </div>
                <div
                  class="text-sm text-base-content/70 grid grid-cols-2 gap-2"
                >
                  <div>
                    <span class="font-medium">Borrowed:</span>
                    {{ formatDate(record.borrowDate) }}
                  </div>
                  <div>
                    <span class="font-medium">Returned:</span>
                    {{ formatDate(record.returnDate || "") }}
                  </div>
                </div>
                <div
                  v-if="record.conditionNotes"
                  class="mt-2 text-sm text-base-content/60"
                >
                  <span class="font-medium">Notes:</span>
                  {{ record.conditionNotes }}
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="!loadingHistory && borrowingHistory.length === 0"
            class="text-center py-8 text-base-content/50"
          >
            <svg
              class="w-12 h-12 mx-auto mb-3 opacity-50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
              ></path>
            </svg>
            <h5 class="font-medium text-base-content/70 mb-1">
              No Borrowing History
            </h5>
            <p class="text-sm">This student hasn't borrowed any books yet</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-action">
        <button type="button" class="btn btn-primary" @click="editStudent">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          Edit Student
        </button>
        <button type="button" class="btn" @click="closeModal">Close</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Student, BorrowedBook } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";

const props = defineProps<{
  show: boolean;
  student?: Student | null;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "edit", student: Student): void;
}>();

// State for borrowed books details
const borrowingHistory = ref<BorrowedBook[]>([]);
const loadingHistory = ref(false);

// Fetch borrowing history when student changes
watch(
  () => props.student,
  async (newStudent) => {
    if (newStudent && props.show) {
      await fetchBorrowingHistory();
    }
  },
  { immediate: true }
);

// Fetch borrowing history when modal opens
watch(
  () => props.show,
  async (show) => {
    if (show && props.student) {
      await fetchBorrowingHistory();
    }
  }
);

// Fetch detailed borrowing history
const fetchBorrowingHistory = async () => {
  if (!props.student) return;

  loadingHistory.value = true;
  try {
    const allRecords = await LibraryAPI.getBorrowRecords();
    // Filter records for this specific student
    borrowingHistory.value = allRecords.filter(
      (record) => record.studentId === props.student?.id
    );
  } catch (error) {
    console.error("Failed to fetch borrowing history:", error);
    borrowingHistory.value = [];
  } finally {
    loadingHistory.value = false;
  }
};

// Computed for current borrowed books
const currentBorrowedBooks = computed(() =>
  borrowingHistory.value.filter((record) => record.status === "borrowed")
);

// Computed for returned books
const returnedBooks = computed(() =>
  borrowingHistory.value.filter((record) => record.status === "returned")
);

// Helper functions
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getFirstNames(fullName: string): string {
  const parts = fullName.split(" ");
  return parts.slice(0, -1).join(" ") || parts[0] || "";
}

function getLastName(fullName: string): string {
  const parts = fullName.split(" ");
  return parts[parts.length - 1] || "";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = now.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

function editStudent() {
  if (props.student) {
    emit("edit", props.student);
  }
}

function closeModal() {
  emit("update:show", false);
}
</script>
