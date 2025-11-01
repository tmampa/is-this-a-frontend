<template>
  <div>
    <NavBar />
    <div class="main-content space-y-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <span class="ml-3 text-base-content">Loading statistics...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-error mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 class="font-bold">Error Loading Statistics</h3>
          <div class="text-xs">{{ error }}</div>
        </div>
        <div>
          <button @click="loadData()" class="btn btn-sm btn-outline">
            Retry
          </button>
        </div>
      </div>

      <!-- Page Header -->
      <div
        v-else
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="px-5">
          <h1 class="text-2xl font-bold text-base-content">
            Library Statistics
          </h1>
          <div class="bg-base-100 rounded-lg shadow-sm">
            <div class="p-6 border-b border-base-300">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                🔍 Lost Books Report
                <span class="badge badge-accent">{{ lostBooks.length }}</span>
              </h3>
            </div>
          </div>
          <p class="text-sm text-base-content/60 mt-1">
            📊 Comprehensive overview of library operations and borrowing
            analytics
          </p>
          <div class="mt-2 text-xs text-base-content/50">
            💡 Tip: Export data to Excel for detailed analysis
          </div>
        </div>
        <div class="px-5 flex gap-3">
          <div class="tooltip tooltip-left" data-tip="Refresh statistics">
            <button
              @click="loadData"
              class="btn btn-ghost normal-case px-4 gap-2"
              :disabled="isLoading"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :class="['h-4 w-4', { 'animate-spin': isLoading }]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span v-if="!isLoading">Refresh</span>
              <span v-else>Refreshing...</span>
            </button>
          </div>
          <div
            class="tooltip tooltip-left"
            data-tip="Download statistics as Excel file"
          >
            <button
              @click="exportToExcel"
              class="btn btn-success normal-case px-6 gap-2"
              :disabled="isExporting || isLoading"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span v-if="!isExporting">Export Excel</span>
              <span v-else>Exporting...</span>
            </button>
          </div>
          <div class="tooltip tooltip-left" data-tip="Print statistics report">
            <button
              @click="printReport"
              class="btn btn-outline normal-case px-6 gap-2"
              :disabled="isLoading"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Report
            </button>
          </div>
        </div>
      </div>

      <!-- Content (only show when data is loaded and no error) -->
      <template v-if="!isLoading && !error">
        <!-- Time Range Filter -->
        <div class="bg-base-100 rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">📅 Report Period</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">From Date</span>
              </label>
              <input
                type="date"
                v-model="dateRange.from"
                class="input input-bordered"
                @change="updateStatistics"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">To Date</span>
              </label>
              <input
                type="date"
                v-model="dateRange.to"
                class="input input-bordered"
                @change="updateStatistics"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Quick Select</span>
              </label>
              <select
                v-model="selectedPeriod"
                @change="applyQuickPeriod"
                class="select select-bordered"
              >
                <option value="">Custom Range</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Auto Refresh</span>
              </label>
              <button
                @click="toggleAutoRefresh"
                :class="['btn', autoRefresh ? 'btn-success' : 'btn-outline']"
              >
                {{ autoRefresh ? "ON" : "OFF" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Key Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Currently Borrowed Books -->
          <div class="stats shadow-sm bg-base-100">
            <div class="stat">
              <div class="stat-figure text-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div class="stat-title">Currently Borrowed</div>
              <div class="stat-value text-warning">
                {{ currentlyBorrowedCount }}
              </div>
              <div class="stat-desc">Books out on loan</div>
            </div>
          </div>

          <!-- Total Amount Owed -->
          <div class="stats shadow-sm bg-base-100">
            <div class="stat">
              <div class="stat-figure text-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H6a1 1 0 000 2h1m0 0h10"
                  />
                </svg>
              </div>
              <div class="stat-title">Total Amount Owed</div>
              <div class="stat-value text-error">
                R{{ totalAmountOwed.toFixed(2) }}
              </div>
              <div class="stat-desc">Outstanding fines</div>
            </div>
          </div>

          <!-- Lost Books -->
          <div class="stats shadow-sm bg-base-100">
            <div class="stat">
              <div class="stat-figure text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.464.881-6.08 2.33l-.773-.129A6 6 0 013 11.081V3a1 1 0 011-1h16a1 1 0 011 1v8.081a6 6 0 01-2.147 4.62l-.773.129A7.965 7.965 0 0112 15z"
                  />
                </svg>
              </div>
              <div class="stat-title">Lost Books</div>
              <div class="stat-value text-accent">{{ lostBooksCount }}</div>
              <div class="stat-desc">Reported missing</div>
            </div>
          </div>

          <!-- Overdue Books -->
          <div class="stats shadow-sm bg-base-100">
            <div class="stat">
              <div class="stat-figure text-orange-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="stat-title">Overdue Books</div>
              <div class="stat-value text-orange-500">{{ overdueCount }}</div>
              <div class="stat-desc">Past due date</div>
            </div>
          </div>
        </div>

        <!-- Additional Statistics Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Active Students -->
          <div class="stats shadow-sm bg-base-100">
            <div class="stat">
              <div class="stat-title">Active Students</div>
              <div class="stat-value text-info">{{ activeStudentsCount }}</div>
              <div class="stat-desc">With current loans</div>
            </div>
          </div>

          <!-- Average Loan Duration -->
          <div class="stats shadow-sm bg-base-100">
            <div class="stat">
              <div class="stat-title">Avg. Loan Duration</div>
              <div class="stat-value text-primary">
                {{ averageLoanDuration }} days
              </div>
              <div class="stat-desc">Per book</div>
            </div>
          </div>

          <!-- Collection Usage Rate -->
          <div class="stats shadow-sm bg-base-100">
            <div class="stat">
              <div class="stat-title">Usage Rate</div>
              <div class="stat-value text-success">{{ usageRate }}%</div>
              <div class="stat-desc">Books in circulation</div>
            </div>
          </div>
        </div>

        <!-- Detailed Tables Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Currently Borrowed Books Table -->
          <div class="bg-base-100 rounded-lg shadow-sm">
            <div class="p-6 border-b border-base-300">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                📚 Currently Borrowed Books
                <span class="badge badge-warning">{{
                  currentlyBorrowedBooks.length
                }}</span>
              </h3>
            </div>
            <div class="overflow-x-auto max-h-96">
              <table class="table table-zebra w-full">
                <thead class="sticky top-0 bg-base-200">
                  <tr>
                    <th>Book Title</th>
                    <th>Student</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in currentlyBorrowedBooks" :key="book.id">
                    <td class="font-medium">{{ book.bookTitle }}</td>
                    <td>{{ book.studentName }}</td>
                    <td>
                      <span
                        :class="{
                          'text-error font-semibold':
                            book.dueDate && isOverdue(book.dueDate),
                          'text-warning':
                            book.dueDate && isNearDue(book.dueDate),
                        }"
                      >
                        {{
                          book.dueDate
                            ? formatDate(book.dueDate)
                            : "No due date"
                        }}
                      </span>
                    </td>
                    <td>
                      <div
                        :class="[
                          'badge',
                          book.dueDate && isOverdue(book.dueDate)
                            ? 'badge-error'
                            : book.dueDate && isNearDue(book.dueDate)
                            ? 'badge-warning'
                            : 'badge-success',
                        ]"
                      >
                        {{
                          book.dueDate && isOverdue(book.dueDate)
                            ? "Overdue"
                            : book.dueDate && isNearDue(book.dueDate)
                            ? "Due Soon"
                            : "Active"
                        }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Students with Outstanding Fines -->
          <div class="bg-base-100 rounded-lg shadow-sm">
            <div class="p-6 border-b border-base-300">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                💰 Outstanding Fines
                <span class="badge badge-error">{{
                  studentsWithFines.length
                }}</span>
              </h3>
            </div>
            <div class="overflow-x-auto max-h-96">
              <table class="table table-zebra w-full">
                <thead class="sticky top-0 bg-base-200">
                  <tr>
                    <th>Student Name</th>
                    <th>Student #</th>
                    <th>Amount Owed</th>
                    <th>Books</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="student in studentsWithFines" :key="student.id">
                    <td class="font-medium">{{ student.fullName }}</td>
                    <td>{{ student.studentNumber }}</td>
                    <td class="text-error font-semibold">
                      R{{ (student.outstandingFines || 0).toFixed(2) }}
                    </td>
                    <td>
                      <div class="badge badge-neutral">
                        {{ student.borrowedBooks.length }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Lost Books Table -->
        <div class="bg-base-100 rounded-lg shadow-sm">
          <div class="p-6 border-b border-base-300">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              🔍 Lost Books Report
              <span class="badge badge-accent">{{ lostBooks.length }}</span>
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Last Borrower</th>
                  <th>Borrowed Date</th>
                  <th>Due Date</th>
                  <th>Days Missing</th>
                  <th>Replacement Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in lostBooks" :key="book.id">
                  <td class="font-medium">{{ book.bookTitle }}</td>
                  <td>{{ book.studentName }}</td>
                  <td>{{ formatDate(book.borrowDate) }}</td>
                  <td>
                    {{
                      book.dueDate ? formatDate(book.dueDate) : "No due date"
                    }}
                  </td>
                  <td class="text-accent font-semibold">
                    {{ book.dueDate ? daysMissing(book.dueDate) : 0 }}
                  </td>
                  <td class="text-error">
                    R{{ getBookPrice(book.bookId).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Borrowing Trends Chart Placeholder -->
          <div class="bg-base-100 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">📈 Borrowing Trends</h3>
            <div
              class="h-64 bg-base-200 rounded-lg flex items-center justify-center"
            >
              <div class="text-center text-base-content/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p>Borrowing trends chart</p>
                <p class="text-sm">Coming soon with charts library</p>
              </div>
            </div>
          </div>

          <!-- Category Distribution Chart Placeholder -->
          <div class="bg-base-100 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">📊 Popular Categories</h3>
            <div
              class="h-64 bg-base-200 rounded-lg flex items-center justify-center"
            >
              <div class="text-center text-base-content/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                <p>Category distribution chart</p>
                <p class="text-sm">Coming soon with charts library</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Items Alert -->
        <div v-if="actionItems.length > 0" class="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h3 class="font-bold">Action Items Required!</h3>
            <div class="text-xs">
              <ul class="list-disc list-inside">
                <li v-for="item in actionItems" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Book, Student, BorrowedBook } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";
import NavBar from "~/components/NavBar.vue";

// API data - fetched from backend
const books = ref<Book[]>([]);
const students = ref<Student[]>([]);
const borrowedBooks = ref<BorrowedBook[]>([]);

// Loading and error states
const isLoading = ref(false);
const error = ref<string | null>(null);

// Reactive state
const isExporting = ref(false);
const autoRefresh = ref(false);
const refreshInterval = ref<NodeJS.Timeout | null>(null);
const selectedPeriod = ref("");
const dateRange = ref({
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0], // 30 days ago
  to: new Date().toISOString().split("T")[0], // today
});

// Computed statistics
const currentlyBorrowedBooks = computed(() =>
  borrowedBooks.value.filter((book) => !book.returnDate)
);

const currentlyBorrowedCount = computed(
  () => currentlyBorrowedBooks.value.length
);

const totalAmountOwed = computed(() =>
  students.value.reduce(
    (sum, student) => sum + (student.outstandingFines || 0),
    0
  )
);

const lostBooks = computed(() =>
  borrowedBooks.value.filter(
    (book) =>
      book.returnDate &&
      book.returnConditions?.some((condition) =>
        condition.toLowerCase().includes("lost")
      )
  )
);

const lostBooksCount = computed(() => lostBooks.value.length);

const overdueCount = computed(
  () =>
    currentlyBorrowedBooks.value.filter(
      (book) => book.dueDate && isOverdue(book.dueDate)
    ).length
);

const activeStudentsCount = computed(() => {
  // Count unique students who have currently borrowed books
  const activeStudentIds = new Set(
    borrowedBooks.value
      .filter((book) => !book.returnDate)
      .map((book) => book.studentId)
  );
  return activeStudentIds.size;
});

const studentsWithFines = computed(() => {
  // Filter students with outstanding fines and add borrowed books count
  return students.value
    .filter((student) => (student.outstandingFines || 0) > 0)
    .map((student) => ({
      ...student,
      borrowedBooks: borrowedBooks.value
        .filter((book) => book.studentId === student.id && !book.returnDate)
        .map((book) => book.bookId),
    }));
});

const averageLoanDuration = computed(() => {
  const returnedBooks = borrowedBooks.value.filter((book) => book.returnDate);
  if (returnedBooks.length === 0) return 0;

  const totalDays = returnedBooks.reduce((sum, book) => {
    const borrowDate = new Date(book.borrowDate);
    const returnDate = new Date(book.returnDate!);
    const diffDays = Math.ceil(
      (returnDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + Math.max(0, diffDays); // Ensure no negative values
  }, 0);

  return Math.round(totalDays / returnedBooks.length);
});

const usageRate = computed(() => {
  if (books.value.length === 0) return 0;
  return Math.round((currentlyBorrowedCount.value / books.value.length) * 100);
});

const actionItems = computed(() => {
  const items: string[] = [];

  if (overdueCount.value > 0) {
    items.push(`${overdueCount.value} overdue books require follow-up`);
  }

  if (lostBooksCount.value > 0) {
    items.push(
      `${lostBooksCount.value} books reported as lost need investigation`
    );
  }

  if (studentsWithFines.value.length > 0) {
    items.push(
      `${studentsWithFines.value.length} students have outstanding fines`
    );
  }

  const nearDueCount = currentlyBorrowedBooks.value.filter(
    (book) => book.dueDate && isNearDue(book.dueDate)
  ).length;
  if (nearDueCount > 0) {
    items.push(`${nearDueCount} books due within 3 days`);
  }

  return items;
});

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
};

const isOverdue = (dueDate: string) => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  return !isNaN(due.getTime()) && due < new Date();
};

const isNearDue = (dueDate: string) => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;

  const today = new Date();
  const diffDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays >= 0 && diffDays <= 3;
};

const daysMissing = (dueDate: string) => {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const today = new Date();
  if (isNaN(due.getTime())) return 0; // Handle invalid dates
  return Math.max(
    0,
    Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  );
};

const getBookPrice = (bookId: string) => {
  const book = books.value.find((b) => b.id === bookId);
  return book?.price || 0;
};

// Period functions
const applyQuickPeriod = () => {
  const today = new Date();
  const period = selectedPeriod.value;

  switch (period) {
    case "today":
      dateRange.value.from = dateRange.value.to = today
        .toISOString()
        .split("T")[0];
      break;
    case "week":
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      dateRange.value.from = weekStart.toISOString().split("T")[0];
      dateRange.value.to = today.toISOString().split("T")[0];
      break;
    case "month":
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      dateRange.value.from = monthStart.toISOString().split("T")[0];
      dateRange.value.to = today.toISOString().split("T")[0];
      break;
    case "quarter":
      const quarterStart = new Date(
        today.getFullYear(),
        Math.floor(today.getMonth() / 3) * 3,
        1
      );
      dateRange.value.from = quarterStart.toISOString().split("T")[0];
      dateRange.value.to = today.toISOString().split("T")[0];
      break;
    case "year":
      const yearStart = new Date(today.getFullYear(), 0, 1);
      dateRange.value.from = yearStart.toISOString().split("T")[0];
      dateRange.value.to = today.toISOString().split("T")[0];
      break;
    case "all":
      dateRange.value.from = "2020-01-01"; // Arbitrary start date
      dateRange.value.to = today.toISOString().split("T")[0];
      break;
  }
  updateStatistics();
};

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;

  if (autoRefresh.value) {
    refreshInterval.value = setInterval(() => {
      updateStatistics();
    }, 30000); // Refresh every 30 seconds
  } else if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
};

const updateStatistics = async () => {
  // Fetch filtered data based on dateRange
  await loadData();
};

// Export functions
const exportToExcel = async () => {
  isExporting.value = true;

  try {
    // Create workbook data
    const workbookData = {
      "Summary Statistics": [
        ["Metric", "Value"],
        ["Currently Borrowed Books", currentlyBorrowedCount.value],
        ["Total Amount Owed", `R${totalAmountOwed.value.toFixed(2)}`],
        ["Lost Books", lostBooksCount.value],
        ["Overdue Books", overdueCount.value],
        ["Active Students", activeStudentsCount.value],
        ["Average Loan Duration", `${averageLoanDuration.value} days`],
        ["Collection Usage Rate", `${usageRate.value}%`],
      ],
      "Currently Borrowed": [
        [
          "Book Title",
          "Student Name",
          "Student Number",
          "Borrow Date",
          "Due Date",
          "Status",
        ],
        ...currentlyBorrowedBooks.value.map((book) => [
          book.bookTitle,
          book.studentName,
          book.studentNumber,
          formatDate(book.borrowDate),
          book.dueDate ? formatDate(book.dueDate) : "No due date",
          book.dueDate && isOverdue(book.dueDate)
            ? "Overdue"
            : book.dueDate && isNearDue(book.dueDate)
            ? "Due Soon"
            : "Active",
        ]),
      ],
      "Outstanding Fines": [
        ["Student Name", "Student Number", "Amount Owed", "Books Borrowed"],
        ...studentsWithFines.value.map((student) => [
          student.fullName,
          student.studentNumber,
          `R${(student.outstandingFines || 0).toFixed(2)}`,
          student.borrowedBooks.length,
        ]),
      ],
      "Lost Books": [
        [
          "Book Title",
          "Last Borrower",
          "Student Number",
          "Borrowed Date",
          "Due Date",
          "Days Missing",
          "Replacement Cost",
        ],
        ...lostBooks.value.map((book) => [
          book.bookTitle,
          book.studentName,
          book.studentNumber,
          formatDate(book.borrowDate),
          book.dueDate ? formatDate(book.dueDate) : "No due date",
          book.dueDate ? daysMissing(book.dueDate) : 0,
          `R${getBookPrice(book.bookId).toFixed(2)}`,
        ]),
      ],
    };

    // Simulate export delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real implementation, you would use a library like xlsx to create the Excel file
    console.log("Exporting data:", workbookData);

    // Create and download a simple CSV for demonstration
    const csv = createCSVFromData(workbookData["Summary Statistics"]);
    downloadCSV(
      csv,
      `library-statistics-${new Date().toISOString().split("T")[0]}.csv`
    );
  } catch (error) {
    console.error("Export failed:", error);
    alert("Export failed. Please try again.");
  } finally {
    isExporting.value = false;
  }
};

const createCSVFromData = (data: any[][]) => {
  return data.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
};

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const printReport = () => {
  window.print();
};

// Load actual data from API
const loadData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Fetch all data from API in parallel
    const [booksData, studentsData, borrowRecordsData] = await Promise.all([
      LibraryAPI.getBooks(),
      LibraryAPI.getStudents(),
      LibraryAPI.getBorrowRecords(),
    ]);

    books.value = booksData || [];
    students.value = studentsData || [];
    borrowedBooks.value = borrowRecordsData || [];

    console.log("Loaded data:", {
      books: books.value.length,
      students: students.value.length,
      borrowedBooks: borrowedBooks.value.length,
    });

    // Debug: Log borrowed books details
    console.log("All borrowed books:", borrowedBooks.value);
    const currentlyBorrowed = borrowedBooks.value.filter(
      (book) => !book.returnDate
    );
    console.log("Currently borrowed (no return date):", currentlyBorrowed);
    console.log("Currently borrowed count:", currentlyBorrowed.length);
  } catch (err) {
    console.error("Failed to load statistics data:", err);
    error.value = "Failed to load library statistics. Please try again.";

    // Set empty arrays on error to avoid crashes
    books.value = [];
    students.value = [];
    borrowedBooks.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadData();
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>

<style>
/* Print styles */
@media print {
  .main-content {
    margin: 0 !important;
    padding: 1rem !important;
  }

  button,
  .btn {
    display: none !important;
  }

  .no-print {
    display: none !important;
  }

  .stats {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  table {
    break-inside: avoid;
    font-size: 0.8rem;
  }
}
</style>
