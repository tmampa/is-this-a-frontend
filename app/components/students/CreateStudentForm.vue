<template>
  <dialog :open="show" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-6">Create a Student</h3>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Student Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">First names:</span>
          </label>
          <input
            type="text"
            v-model="formData.firstNames"
            class="input w-full"
            required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Last name: </span>
          </label>
          <input
            type="text"
            v-model="formData.lastName"
            class="input w-full"
            required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Email: </span>
          </label>
          <input
            type="email"
            v-model="formData.email"
            class="input w-full"
            required
          />
        </div>

        <!-- Book Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Address:</span>
          </label>

          <textarea
            class="textarea w-full"
            placeholder="Address"
            v-model="formData.address"
            required
          ></textarea>
        </div>

        <!-- Parents/Guardians -->
        <div class="form-control">
          <div class="flex justify-between items-center mb-4">
            <label class="label">
              <span class="label-text">Parents/Guardians:</span>
            </label>
            <button
              type="button"
              class="btn btn-sm btn-outline btn-primary"
              @click="addParent"
            >
              Add Parent/Guardian
            </button>
          </div>
          <div
            v-for="(parent, index) in formData.parents"
            :key="index"
            class="border p-4 rounded-lg mb-4 relative"
          >
            <button
              v-if="formData.parents.length > 1"
              type="button"
              class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
              @click="removeParent(index)"
            >
              ✕
            </button>
            <div class="form-control mb-2">
              <label class="label">
                <span class="label-text">Name:</span>
              </label>
              <input
                type="text"
                v-model="parent.name"
                class="input w-full"
                required
              />
            </div>
            <div class="form-control mb-2">
              <label class="label">
                <span class="label-text">Email:</span>
              </label>
              <input
                type="email"
                v-model="parent.email"
                class="input w-full"
                required
              />
            </div>
            <div class="form-control mb-2">
              <label class="label">
                <span class="label-text">Relationship:</span>
              </label>
              <input
                type="text"
                v-model="parent.relationship"
                class="input w-full"
                required
              />
            </div>
          </div>
          <div
            v-if="formData.parents.length === 0"
            class="text-gray-500 text-center py-8"
          >
            No parents/guardians added yet. Click "Add Parent/Guardian" to add
            one.
          </div>
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
import { ref, computed, onMounted } from "vue";
import type { Student } from "~/types/books";

// Define student creation data type
type CreateStudentData = {
  firstNames: string;
  lastName: string;
  email: string;
  address: string;
  parents: { name: string; email: string; relationship: string }[];
};

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "submit", data: CreateStudentData): void;
}>();

// API calls for real data
const students = ref<Student[]>([]);
const loading = ref(false);

// Fetch students from API (for reference/validation if needed)
const fetchStudents = async () => {
  try {
    console.log("Fetching students from API...");
    students.value = await LibraryAPI.getStudents();
    console.log("Students loaded:", students.value);
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }
};

// Load data when component mounts
onMounted(() => {
  fetchStudents();
});

// Form state
const formData = ref({
  firstNames: "",
  lastName: "",
  email: "",
  address: "",
  parents: [{ name: "", email: "", relationship: "" }] as {
    name: string;
    email: string;
    relationship: string;
  }[],
});

// Parent management functions
const addParent = () => {
  formData.value.parents.push({ name: "", email: "", relationship: "" });
};

const removeParent = (index: number) => {
  if (formData.value.parents.length > 1) {
    formData.value.parents.splice(index, 1);
  }
};

// Handlers
const handleSubmit = async () => {
  // Validate required fields
  if (!formData.value.firstNames.trim()) {
    alert("Please enter first names");
    return;
  }
  if (!formData.value.lastName.trim()) {
    alert("Please enter last name");
    return;
  }
  if (!formData.value.email.trim()) {
    alert("Please enter email");
    return;
  }
  if (!formData.value.address.trim()) {
    alert("Please enter address");
    return;
  }

  // Validate at least one parent with complete information
  const validParents = formData.value.parents.filter(
    (parent) =>
      parent.name.trim() && parent.email.trim() && parent.relationship.trim()
  );
  if (validParents.length === 0) {
    alert("Please add at least one parent/guardian with complete information");
    return;
  }

  loading.value = true;
  try {
    // Create student data object
    const studentData = {
      firstNames: formData.value.firstNames.trim(),
      lastName: formData.value.lastName.trim(),
      email: formData.value.email.trim(),
      address: formData.value.address.trim(),
      parents: validParents,
    };

    console.log("Creating student:", studentData);

    // Create student using the API
    const createdStudent = await LibraryAPI.createStudent(studentData);

    // Emit success event
    emit("submit", studentData);

    // Reset form
    formData.value = {
      firstNames: "",
      lastName: "",
      email: "",
      address: "",
      parents: [{ name: "", email: "", relationship: "" }],
    };

    // Close modal
    closeModal();
  } catch (error) {
    console.error("Failed to create student:", error);
    alert("Failed to create student. Please try again.");
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit("update:show", false);
};
</script>
