<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-base-content">Settings</h1>
      <p class="text-sm text-base-content/60 mt-1">
        Configure your library management system
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- General Settings -->
      <div class="bg-base-100 rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">General Settings</h2>
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Library Name</span>
            </label>
            <input
              type="text"
              v-model="settings.libraryName"
              class="input input-bordered"
              placeholder="Enter library name"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Default Loan Period (days)</span>
            </label>
            <input
              type="number"
              v-model="settings.defaultLoanPeriod"
              class="input input-bordered"
              placeholder="14"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Maximum Books per Student</span>
            </label>
            <input
              type="number"
              v-model="settings.maxBooksPerStudent"
              class="input input-bordered"
              placeholder="3"
            />
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-base-100 rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Notifications</h2>
        <div class="space-y-4">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Email Reminders</span>
              <input
                type="checkbox"
                v-model="settings.emailReminders"
                class="toggle toggle-primary"
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Overdue Notifications</span>
              <input
                type="checkbox"
                v-model="settings.overdueNotifications"
                class="toggle toggle-warning"
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Reminder Days Before Due</span>
            </label>
            <input
              type="number"
              v-model="settings.reminderDays"
              class="input input-bordered"
              placeholder="3"
            />
          </div>
        </div>
      </div>

      <!-- System Settings -->
      <div class="bg-base-100 rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">System</h2>
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Theme</span>
            </label>
            <select v-model="settings.theme" class="select select-bordered">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Language</span>
            </label>
            <select v-model="settings.language" class="select select-bordered">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Date Format</span>
            </label>
            <select
              v-model="settings.dateFormat"
              class="select select-bordered"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-base-100 rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Security</h2>
        <div class="space-y-4">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Two-Factor Authentication</span>
              <input
                type="checkbox"
                v-model="settings.twoFactorAuth"
                class="toggle toggle-success"
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Session Timeout (minutes)</span>
            </label>
            <input
              type="number"
              v-model="settings.sessionTimeout"
              class="input input-bordered"
              placeholder="30"
            />
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Auto-logout on Idle</span>
              <input
                type="checkbox"
                v-model="settings.autoLogout"
                class="toggle toggle-error"
              />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="bg-base-100 rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4">Data Management</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button class="btn btn-outline btn-info gap-2">
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
          Export Data
        </button>

        <button class="btn btn-outline btn-warning gap-2">
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
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Backup System
        </button>

        <button class="btn btn-outline btn-error gap-2">
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
          Clear All Data
        </button>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        @click="saveSettings"
        class="btn btn-primary px-8"
        :class="{ loading: saving }"
      >
        {{ saving ? "Saving..." : "Save Settings" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const saving = ref(false);

// Settings data
const settings = reactive({
  libraryName: "Central Library",
  defaultLoanPeriod: 14,
  maxBooksPerStudent: 3,
  emailReminders: true,
  overdueNotifications: true,
  reminderDays: 3,
  theme: "light",
  language: "en",
  dateFormat: "MM/DD/YYYY",
  twoFactorAuth: false,
  sessionTimeout: 30,
  autoLogout: true,
});

// Methods
async function saveSettings() {
  saving.value = true;
  try {
    // TODO: Implement API call to save settings
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    console.log("Settings saved:", settings);
    // Show success toast
  } catch (error) {
    console.error("Failed to save settings:", error);
    // Show error toast
  } finally {
    saving.value = false;
  }
}
</script>
