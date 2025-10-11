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

        <!-- Barcode Verification -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Verify Book Barcode/ISBN *</span>
            <span class="label-text-alt text-info">
              {{ book.bookTitle ? "Expected: " + (bookISBN || "N/A") : "" }}
            </span>
          </label>
          <input
            type="text"
            placeholder="Scan or enter book barcode/ISBN"
            class="input input-bordered"
            :class="{
              'input-success': barcodeVerified === true,
              'input-error':
                barcodeVerified === false && formData.barcodeInput.length > 0,
            }"
            v-model="formData.barcodeInput"
            @input="handleBarcodeInput"
            required
          />
          <label class="label">
            <span
              class="label-text-alt text-success"
              v-if="barcodeVerified === true"
            >
              ✓ Barcode verified successfully
            </span>
            <span
              class="label-text-alt text-error"
              v-else-if="
                barcodeVerified === false && formData.barcodeInput.length > 0
              "
            >
              ✗ Barcode does not match book record
            </span>
            <span class="label-text-alt text-base-content/60" v-else>
              Please scan or manually enter the book's barcode/ISBN to verify
              you have the correct book
            </span>
          </label>
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
import { ref, watch } from "vue";
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
  "📙 Good - Light wear, no damage",
  "📄 Pages missing",
  "📝 Writing/markings added",
  "💧 Water damage",
  "🍂 Stains present",
  "🔖 Lost",
  "📕 Torn pages",
];

// Form state
const formData = ref({
  returnConditions: [] as string[],
  afterConditionImages: [] as File[],
  conditionNotes: "",
  barcodeInput: "",
});

const imagePreviews = ref<string[]>([]);
const barcodeVerified = ref<boolean | null>(null);
const bookISBN = ref<string>("");

// Watch for book changes to set expected barcode
watch(
  () => props.book,
  (newBook) => {
    if (newBook) {
      // In a real implementation, you would fetch the actual ISBN/barcode from the book details
      // For now, we'll use the book ID or title as a placeholder
      bookISBN.value = newBook.id || newBook.bookTitle;

      // Reset barcode verification when book changes
      barcodeVerified.value = null;
      formData.value.barcodeInput = "";
    }
  },
  { immediate: true }
);

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

const handleBarcodeInput = () => {
  const input = formData.value.barcodeInput.trim();

  if (input.length === 0) {
    barcodeVerified.value = null;
    return;
  }

  // For now, we'll compare against a mock ISBN/barcode
  // In a real implementation, you would fetch the book details and compare
  // For this example, let's assume we're comparing against the book title or a stored ISBN
  const expectedBarcode = bookISBN.value || props.book.bookTitle;

  // Simple verification - in real app, this would be more sophisticated
  barcodeVerified.value =
    input.toLowerCase() === expectedBarcode.toLowerCase() ||
    input === props.book.id ||
    input.includes(props.book.bookTitle.toLowerCase().replace(/\s+/g, ""));
};

const handleSubmit = () => {
  if (formData.value.barcodeInput.trim() === "") {
    alert("Please enter the book barcode/ISBN to verify the correct book");
    return;
  }

  if (barcodeVerified.value !== true) {
    alert("Please verify the barcode matches the book before returning");
    return;
  }

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
    studentNumber: props.book.studentNumber,
    bookTitle: props.book.bookTitle,
    returnConditions: formData.value.returnConditions,
    afterConditionImages: formData.value.afterConditionImages,
    ...(formData.value.conditionNotes
      ? { conditionNotes: formData.value.conditionNotes }
      : {}),
  } as unknown as ReturnBookData); // Reset form
  formData.value = {
    returnConditions: [],
    afterConditionImages: [],
    conditionNotes: "",
    barcodeInput: "",
  };

  // Clean up previews
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  imagePreviews.value = [];

  // Reset barcode verification
  barcodeVerified.value = null;
};

const closeModal = () => {
  // Reset form when closing
  formData.value = {
    returnConditions: [],
    afterConditionImages: [],
    conditionNotes: "",
    barcodeInput: "",
  };

  // Clean up previews
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  imagePreviews.value = [];

  // Reset barcode verification
  barcodeVerified.value = null;

  emit("update:show", false);
};
</script>
