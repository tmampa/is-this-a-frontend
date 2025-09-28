<template>
  <dialog :open="show" class="modal">
    <div class="modal-box max-w-2xl">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-bold text-lg">
            {{ editMode ? "Edit Student" : "Create a Student" }}
          </h3>
          <p class="text-sm text-base-content/60 mt-1">
            {{
              editMode
                ? "👤 Update student information"
                : "🎓 Register a new student in the library system"
            }}
          </p>
        </div>
        <div
          class="tooltip tooltip-left"
          data-tip="Complete all required fields and add at least one parent/guardian"
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
            data-tip="Enter all first names (can include middle names)"
          >
            <label class="label">
              <span class="label-text"
                >First names: <span class="text-error">*</span></span
              >
              <span class="label-text-alt">👤 Include all first names</span>
            </label>
          </div>
          <input
            type="text"
            v-model="formData.firstNames"
            class="input w-full"
            placeholder="e.g., John Michael"
            required
          />
        </div>

        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Enter the student's family/last name"
          >
            <label class="label">
              <span class="label-text"
                >Last name: <span class="text-error">*</span></span
              >
              <span class="label-text-alt">👤 Family name</span>
            </label>
          </div>
          <input
            type="text"
            v-model="formData.lastName"
            class="input w-full"
            placeholder="e.g., Smith"
            required
          />
        </div>

        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Student's email address for notifications and communication"
          >
            <label class="label">
              <span class="label-text"
                >Email: <span class="text-error">*</span></span
              >
              <span class="label-text-alt">📧 For notifications</span>
            </label>
          </div>
          <input
            type="email"
            v-model="formData.email"
            class="input w-full"
            placeholder="e.g., john.smith@email.com"
            required
          />
        </div>

        <!-- Address -->
        <div class="form-control">
          <div
            class="tooltip tooltip-right"
            data-tip="Complete residential address for records and emergency contact"
          >
            <label class="label">
              <span class="label-text"
                >Address: <span class="text-error">*</span></span
              >
              <span class="label-text-alt">🏠 Full address</span>
            </label>
          </div>

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
            {{
              loading
                ? editMode
                  ? "Updating..."
                  : "Creating..."
                : editMode
                ? "Update Student"
                : "Create Student"
            }}
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
import { ref, computed, watch } from "vue";
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
  student?: Student | null;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "submit", data: CreateStudentData, isEdit: boolean): void;
}>();

// Check if we're in edit mode
const editMode = computed(() => !!props.student);

// API calls for real data
const loading = ref(false);

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

// Watch for student prop changes to populate form when editing
watch(
  () => props.student,
  (newStudent) => {
    if (newStudent) {
      // Parse the fullName into firstNames and lastName
      const nameParts = newStudent.fullName.split(" ");
      const lastName = nameParts.pop() || "";
      const firstNames = nameParts.join(" ");

      formData.value = {
        firstNames,
        lastName,
        email: newStudent.email || "",
        address: (newStudent as any).address || "",
        parents:
          (newStudent as any).parents && (newStudent as any).parents.length > 0
            ? [...(newStudent as any).parents]
            : [{ name: "", email: "", relationship: "" }],
      };
    } else {
      // Reset form for create mode
      formData.value = {
        firstNames: "",
        lastName: "",
        email: "",
        address: "",
        parents: [{ name: "", email: "", relationship: "" }],
      };
    }
  },
  { immediate: true }
);

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

    console.log(
      editMode.value ? "Updating student:" : "Creating student:",
      studentData
    );

    if (editMode.value && props.student) {
      // Update existing student
      await LibraryAPI.updateStudent(props.student.id, studentData);
    } else {
      // Create new student
      await LibraryAPI.createStudent(studentData);
    }

    // Emit success event
    emit("submit", studentData, editMode.value);

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
    console.error(
      `Failed to ${editMode.value ? "update" : "create"} student:`,
      error
    );
    alert(
      `Failed to ${
        editMode.value ? "update" : "create"
      } student. Please try again.`
    );
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit("update:show", false);
};
</script>
