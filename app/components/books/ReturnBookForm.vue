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

        <!-- Return Date -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Return Date</span>
          </label>
          <input
            type="date"
            v-model="formData.returnDate"
            class="input input-bordered"
            required
          />
        </div>

        <!-- Book Condition Images -->
        <ImageUploader
          label="Current Book Condition Images"
          :multiple="true"
          :max-images="5"
          @update:images="handleImagesUpdate"
        />

        <!-- Condition Notes -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Condition Notes</span>
          </label>
          <textarea
            v-model="formData.conditionNotes"
            class="textarea textarea-bordered h-24"
            placeholder="Enter any notes about the book's condition..."
          ></textarea>
        </div>

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

const props = defineProps<{
  show: boolean;
  book: BorrowedBook;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "submit", data: ReturnBookData): void;
}>();

// Form state
const formData = ref({
  returnDate: new Date().toISOString().split("T")[0],
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

  emit("submit", {
    borrowedBookId: props.book.id,
    returnDate: formData.value.returnDate,
    afterConditionImages: formData.value.afterConditionImages,
    ...(formData.value.conditionNotes
      ? { conditionNotes: formData.value.conditionNotes }
      : {}),
  } as ReturnBookData);

  // Reset form
  formData.value = {
    returnDate: new Date().toISOString().split("T")[0],
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
