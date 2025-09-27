<template>
  <dialog :open="show" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-6">Return Book</h3>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Book Info -->
        <div class="bg-base-200 rounded-lg p-4">
          <h4 class="font-medium mb-2">Book Information</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-base-content/60">Title</p>
              <p>{{ book.bookTitle }}</p>
            </div>
            <div>
              <p class="text-base-content/60">Student</p>
              <p>{{ book.studentName }}</p>
            </div>
            <div>
              <p class="text-base-content/60">Borrow Date</p>
              <p>{{ formatDate(book.borrowDate) }}</p>
            </div>
            <div>
              <p class="text-base-content/60">Due Date</p>
              <p :class="{ 'text-error': isOverdue(book.dueDate) }">
                {{ formatDate(book.dueDate) }}
              </p>
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
        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-medium mb-3 text-base-content/75">
              Before Condition Images
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="(image, index) in book.beforeConditionImages"
                :key="`before-${index}`"
                class="aspect-square rounded-lg overflow-hidden bg-base-200"
              >
                <img
                  :src="image"
                  alt="Before condition"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium mb-3 text-base-content/75">
              After Condition Images
            </h4>
            <div
              v-if="imagePreviews.length > 0"
              class="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div
                v-for="(image, index) in imagePreviews"
                :key="`after-${index}`"
                class="aspect-square rounded-lg overflow-hidden bg-base-200"
              >
                <img
                  :src="image"
                  alt="After condition"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div
              v-else
              class="text-center p-8 border-2 border-dashed border-base-300 rounded-lg"
            >
              <p class="text-base-content/40">
                No after condition images uploaded yet
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-action">
          <button type="button" class="btn" @click="closeModal">Cancel</button>
          <button type="submit" class="btn btn-primary">Return Book</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
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
  } as ReturnBookData);

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
