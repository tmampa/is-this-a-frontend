<template>
  <div
    class="modal fade"
    :class="{ show: show }"
    :style="{ display: show ? 'block' : 'none' }"
    tabindex="-1"
    aria-labelledby="returnBookModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="returnBookModalLabel">Return Book</h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Book Info -->
            <div class="card bg-light mb-4">
              <div class="card-body">
                <h6 class="card-title">Book Information</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <small class="text-muted d-block">Title</small>
                    <span class="fw-medium">{{ book.bookTitle }}</span>
                  </div>
                  <div class="col-md-6">
                    <small class="text-muted d-block">Student</small>
                    <span class="fw-medium">{{ book.studentName }}</span>
                  </div>
                  <div class="col-md-6">
                    <small class="text-muted d-block">Borrow Date</small>
                    <span>{{ formatDate(book.borrowDate) }}</span>
                  </div>
                  <div class="col-md-6">
                    <small class="text-muted d-block">Due Date</small>
                    <span :class="{ 'text-danger': isOverdue(book.dueDate) }">
                      {{ formatDate(book.dueDate) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <!-- Return Conditions -->
        <MultiSelectWithCreate
          label="Return Condition Assessment"
          :options="defaultReturnConditions"
          v-model="formData.returnConditions"
          :required="true"
          tooltip="Select all conditions that apply to the book upon return - this helps track any changes from initial lending"
          helper-text="Select existing conditions or add custom ones to accurately describe the book's current state"
        />

        <!-- Book Condition Images -->
        <ImageUploader
          label="Current Book Condition Images"
          :multiple="true"
          :max-images="5"
          @update:images="handleImagesUpdate"
        />

              <!-- Compare Images -->
              <div class="col-12">
                <div class="row g-4">
                  <!-- Before Images -->
                  <div class="col-lg-6">
                    <h6 class="text-muted mb-3">Before Condition Images</h6>
                    <div class="row g-2">
                      <div
                        v-for="(image, index) in book.beforeConditionImages"
                        :key="`before-${index}`"
                        class="col-4"
                      >
                        <div class="ratio ratio-1x1">
                          <img
                            :src="image"
                            alt="Before condition"
                            class="img-fluid rounded object-fit-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- After Images -->
                  <div class="col-lg-6">
                    <h6 class="text-muted mb-3">After Condition Images</h6>
                    <div v-if="imagePreviews.length > 0" class="row g-2">
                      <div
                        v-for="(image, index) in imagePreviews"
                        :key="`after-${index}`"
                        class="col-4"
                      >
                        <div class="ratio ratio-1x1">
                          <img
                            :src="image"
                            alt="After condition"
                            class="img-fluid rounded object-fit-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      class="text-center p-4 border border-2 border-dashed rounded"
                    >
                      <div class="text-muted">
                        <i class="bi bi-camera display-6 mb-2"></i>
                        <p class="mb-0">
                          No after condition images uploaded yet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-arrow-return-left me-2"></i>Return Book
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show" @click="closeModal"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BorrowedBook, ReturnBookData } from "~/types/books";
import ImageUploader from "~/components/layout/ImageUploader.vue";
import MultiSelectWithCreate from "~/components/layout/MultiSelectWithCreate.vue";

const props = defineProps<{
  show: boolean;
  book: BorrowedBook;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "submit", data: ReturnBookData): void;
}>();

// Default return condition options
const defaultReturnConditions = [
  "📗 Same as borrowed - No changes",
  "📘 Excellent - Minimal wear",
  "📙 Good - Light wear, no damage",
  "📚 Fair - Noticeable wear",
  "📜 Poor - Significant wear",
  "📝 Damaged - New damage present",
  "📄 Pages missing",
  "📖 Cover damaged",
  "📝 Writing/markings added",
  "💧 Water damage",
  "🍂 Stains present",
  "🔍 Binding loose/broken",
  "🔖 Lost",
  "📕 Torn pages",
];

// Form state
const formData = ref({
  returnConditions: [] as string[],
  afterConditionImages: [] as File[],
  conditionNotes: "",
});

const imagePreviews = ref<string[]>([]);

// Utils
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

// Handlers
const handleImagesUpdate = (images: File[]) => {
  formData.value.afterConditionImages = images;

  // Update previews
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  imagePreviews.value = images.map((file) => URL.createObjectURL(file));
};

const handleSubmit = () => {
  if (formData.value.afterConditionImages.length === 0) {
    alert("Please upload at least one condition image");
    return;
  }

  if (formData.value.returnConditions.length === 0) {
    alert("Please select at least one return condition");
    return;
  }

  emit("submit", {
    borrowedBookId: props.book.id,
    returnConditions: formData.value.returnConditions,
    afterConditionImages: formData.value.afterConditionImages,
    ...(formData.value.conditionNotes
      ? { conditionNotes: formData.value.conditionNotes }
      : {}),
  } as unknown as ReturnBookData);

  // Reset form
  formData.value = {
    returnConditions: [],
    afterConditionImages: [],
    conditionNotes: "",
  };

  // Clean up previews
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  imagePreviews.value = [];
};

const closeModal = () => {
  emit("update:show", false);
};
</script>
