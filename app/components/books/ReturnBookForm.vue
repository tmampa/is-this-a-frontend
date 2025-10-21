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
              <p class="text-base-content/60">Return Date</p>
              <p :class="{ 'text-error': isOverdue(book.dueDate) }">
                {{ formatDate(book.dueDate) }}
              </p>
            </div>
            <div>
              <p class="text-base-content/60">Recorded Barcode</p>
              <p class="font-mono text-xs">
                {{ book.barcode || "Not recorded" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Barcode Verification -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Verify Book Barcode *</span>
            <span class="label-text-alt text-info">
              {{
                book.barcode
                  ? "Expected: " + book.barcode
                  : "No barcode recorded during borrowing"
              }}
            </span>
          </label>
          <input
            type="text"
            placeholder="Scan or enter the book barcode"
            class="input input-bordered"
            :class="{
              'input-success': barcodeVerified === true,
              'input-error':
                barcodeVerified === false && formData.barcodeInput.length > 0,
            }"
            v-model="formData.barcodeInput"
            @input="handleBarcodeInput"
            :disabled="!book.barcode"
            required
          />
          <label class="label">
            <span
              class="label-text-alt text-success"
              v-if="barcodeVerified === true"
            >
              ✓ Barcode verified successfully - matches the barcode scanned
              during borrowing
            </span>
            <span class="label-text-alt text-error" v-else-if="!book.barcode">
              ⚠ No barcode was recorded when this book was issued - verification
              not possible
            </span>
            <span
              class="label-text-alt text-error"
              v-else-if="
                barcodeVerified === false && formData.barcodeInput.length > 0
              "
            >
              ✗ Barcode does not match the one recorded during borrowing
            </span>
            <span class="label-text-alt text-base-content/60" v-else>
              Scan the barcode to verify this is the same book that was issued
              to {{ book.studentName }}
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
                v-for="(image, index) in book.images"
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
      // Use the barcode that was saved when the book was issued to the student
      bookISBN.value = newBook.barcode || newBook.id || "No barcode recorded";

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

  // Compare the scanned barcode with the barcode that was saved when the book was issued
  const expectedBarcode = props.book.barcode;

  if (!expectedBarcode) {
    // If no barcode was recorded during borrowing, we can't verify
    barcodeVerified.value = false;
    return;
  }

  // Exact match required - the barcode must match exactly what was scanned during borrowing
  barcodeVerified.value = input === expectedBarcode;
};

const handleSubmit = () => {
  // If no barcode was recorded during borrowing, we can still proceed but warn the user
  if (!props.book.barcode) {
    const proceed = confirm(
      "Warning: No barcode was recorded when this book was issued. " +
        "Are you sure you want to proceed with returning this book without barcode verification?"
    );
    if (!proceed) return;
  } else {
    // If barcode exists, require verification
    if (formData.value.barcodeInput.trim() === "") {
      alert("Please scan the book barcode to verify you have the correct book");
      return;
    }

    if (barcodeVerified.value !== true) {
      alert(
        "The barcode does not match the one recorded during borrowing. Please verify you have the correct book."
      );
      return;
    }
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
