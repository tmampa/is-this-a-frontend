<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="createStudentModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createStudentModalLabel">
            {{ editMode ? "Edit Student" : "Create a Student" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row g-3">
              <!-- Student Information -->
              <div class="col-md-6">
                <label for="firstNames" class="form-label">First names:</label>
                <input
                  type="text"
                  id="firstNames"
                  v-model="formData.firstNames"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="lastName" class="form-label">Last name:</label>
                <input
                  type="text"
                  id="lastName"
                  v-model="formData.lastName"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-12">
                <label for="email" class="form-label">Email:</label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="form-control"
                  required
                />
              </div>

              <!-- Address -->
              <div class="col-12">
                <label for="address" class="form-label">Address:</label>
                <textarea
                  id="address"
                  class="form-control"
                  rows="3"
                  placeholder="Address"
                  v-model="formData.address"
                  required
                ></textarea>
              </div>

              <!-- Parents/Guardians -->
              <div class="col-12">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <label class="form-label mb-0">Parents/Guardians:</label>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    @click="addParent"
                  >
                    <i class="bi bi-plus-lg me-1"></i>Add Parent/Guardian
                  </button>
                </div>

                <div
                  v-for="(parent, index) in formData.parents"
                  :key="index"
                  class="border rounded p-3 mb-3 position-relative"
                >
                  <button
                    v-if="formData.parents.length > 1"
                    type="button"
                    class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                    @click="removeParent(index)"
                  >
                    <i class="bi bi-x"></i>
                  </button>

                  <div class="row g-2">
                    <div class="col-12">
                      <label
                        :for="`parentName${index}`"
                        class="form-label small"
                        >Name:</label
                      >
                      <input
                        :id="`parentName${index}`"
                        type="text"
                        v-model="parent.name"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label
                        :for="`parentEmail${index}`"
                        class="form-label small"
                        >Email:</label
                      >
                      <input
                        :id="`parentEmail${index}`"
                        type="email"
                        v-model="parent.email"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label
                        :for="`parentRelationship${index}`"
                        class="form-label small"
                        >Relationship:</label
                      >
                      <input
                        :id="`parentRelationship${index}`"
                        type="text"
                        v-model="parent.relationship"
                        class="form-control"
                        placeholder="e.g., Mother, Father, Guardian"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div
                  v-if="formData.parents.length === 0"
                  class="text-muted text-center py-4"
                >
                  No parents/guardians added yet. Click "Add Parent/Guardian" to
                  add one.
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
              :disabled="loading"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
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
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show" @click="closeModal"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Student } from "~/types/books";
import { LibraryAPI } from "~/composables/useLibraryAPI";

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
