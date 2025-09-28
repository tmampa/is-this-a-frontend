<!-- CreateStudentModal.vue - Quick student creation modal -->
<template>
  <dialog :open="show" class="modal">
    <div class="modal-box">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-bold text-lg">Create New Student</h3>
          <p class="text-sm text-base-content/60 mt-1">
            👤 Add a new student to the system
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- First Names -->
        <div class="form-control">
          <label class="label">
            <span class="label-text"
              >First Names <span class="text-error">*</span></span
            >
          </label>
          <input
            type="text"
            v-model="formData.firstNames"
            class="input input-bordered w-full"
            placeholder="Enter student's first names"
            required
          />
        </div>

        <!-- Last Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text"
              >Last Name <span class="text-error">*</span></span
            >
          </label>
          <input
            type="text"
            v-model="formData.lastName"
            class="input input-bordered w-full"
            placeholder="Enter student's last name"
            required
          />
        </div>

        <!-- Student Number -->
        <div class="form-control">
          <label class="label">
            <span class="label-text"
              >Student Number <span class="text-error">*</span></span
            >
          </label>
          <input
            type="number"
            v-model.number="formData.studentNumber"
            class="input input-bordered w-full"
            placeholder="Enter unique student number"
            required
          />
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label">
            <span class="label-text"
              >Email <span class="text-error">*</span></span
            >
          </label>
          <input
            type="email"
            v-model="formData.email"
            class="input input-bordered w-full"
            placeholder="student@school.edu"
            required
          />
        </div>

        <!-- Address (Optional) -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Address</span>
            <span class="label-text-alt text-base-content/60">Optional</span>
          </label>
          <textarea
            v-model="formData.address"
            class="textarea textarea-bordered"
            placeholder="Student's address (optional)"
            rows="2"
          ></textarea>
        </div>

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
            {{ loading ? "Creating..." : "Create Student" }}
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
import { ref, watch } from "vue";
import type { Student } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";

const props = defineProps<{
  show: boolean;
  initialName?: string;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "created", student: Student): void;
}>();

const loading = ref(false);
const formData = ref({
  firstNames: props.initialName || "",
  lastName: "",
  studentNumber: 0,
  email: "",
  address: "",
});

// Reset form when modal is opened with new initial name
watch(
  () => props.initialName,
  (newName) => {
    if (newName && props.show) {
      // Split the name into first and last parts
      const nameParts = newName.split(" ");
      formData.value.firstNames = nameParts.slice(0, -1).join(" ") || newName;
      formData.value.lastName =
        nameParts.length > 1 ? nameParts[nameParts.length - 1] || "" : "";
    }
  }
);

const handleSubmit = async () => {
  loading.value = true;
  try {
    const newStudent = await LibraryAPI.createStudent({
      firstNames: formData.value.firstNames,
      lastName: formData.value.lastName,
      email: formData.value.email,
      address: formData.value.address,
      parents: [],
    });

    emit("created", newStudent);
    resetForm();
    closeModal();
  } catch (error) {
    console.error("Failed to create student:", error);
    alert("Failed to create student. Please try again.");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    firstNames: "",
    lastName: "",
    studentNumber: 0,
    email: "",
    address: "",
  };
};

const closeModal = () => {
  emit("update:show", false);
};

// Reset form when modal is closed
watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
  }
);
</script>
