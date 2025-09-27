<template>
  <div class="form-control">
    <div
      class="tooltip tooltip-right"
      data-tip="Upload images to document the book's condition"
    >
      <label class="label">
        <span class="label-text">{{ label }}</span>
        <span class="label-text-alt text-base-content/60">
          {{ images.length }}/{{ maxImages }} images 📷
        </span>
      </label>
    </div>

    <!-- File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      :multiple="multiple"
      @change="handleFileSelect"
      class="file-input file-input-bordered w-full"
      :class="{ 'file-input-error': hasError }"
      title="Select image files (JPEG, PNG, WebP supported)"
    />

    <!-- Helpful guidance -->
    <div class="label">
      <span class="label-text-alt text-xs text-base-content/60">
        💡 Tip: Take clear photos showing the book's condition from different
        angles
      </span>
    </div>

    <!-- Error Message -->
    <div v-if="hasError" class="label">
      <span class="label-text-alt text-error">{{ errorMessage }}</span>
    </div>

    <!-- Image Previews -->
    <div v-if="images.length > 0" class="mt-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="relative group aspect-square rounded-lg overflow-hidden bg-base-200"
        >
          <img
            :src="image.preview"
            :alt="`Image ${index + 1}`"
            class="w-full h-full object-cover"
          />

          <!-- Remove Button -->
          <button
            type="button"
            @click="removeImage(index)"
            class="absolute top-2 right-2 btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Image Info -->
          <div
            class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2"
          >
            <p class="truncate">{{ image.file.name }}</p>
            <p>{{ formatFileSize(image.file.size) }}</p>
          </div>
        </div>

        <!-- Add More Button -->
        <div
          v-if="images.length < maxImages"
          @click="triggerFileInput"
          class="aspect-square rounded-lg border-2 border-dashed border-base-300 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-base-content/60 hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span class="text-sm">Add Image</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface ImageFile {
  file: File;
  preview: string;
}

const props = withDefaults(
  defineProps<{
    label?: string;
    multiple?: boolean;
    maxImages?: number;
    maxFileSize?: number; // in MB
    required?: boolean;
  }>(),
  {
    label: "Images",
    multiple: true,
    maxImages: 5,
    maxFileSize: 5,
    required: false,
  }
);

const emit = defineEmits<{
  (e: "update:images", images: File[]): void;
  (e: "error", error: string): void;
}>();

const fileInput = ref<HTMLInputElement>();
const images = ref<ImageFile[]>([]);
const errorMessage = ref("");

const hasError = computed(() => !!errorMessage.value);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files) return;

  errorMessage.value = "";

  // Validate file count
  if (images.value.length + files.length > props.maxImages) {
    errorMessage.value = `Maximum ${props.maxImages} images allowed`;
    return;
  }

  // Process each file
  Array.from(files).forEach((file) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      errorMessage.value = "Only image files are allowed";
      return;
    }

    // Validate file size
    if (file.size > props.maxFileSize * 1024 * 1024) {
      errorMessage.value = `File size must be less than ${props.maxFileSize}MB`;
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    images.value.push({ file, preview });
  });

  // Clear input
  if (input) {
    input.value = "";
  }

  // Emit updated files
  emitFiles();
};

const removeImage = (index: number) => {
  // Revoke object URL to prevent memory leaks
  const imageToRemove = images.value[index];
  if (imageToRemove) {
    URL.revokeObjectURL(imageToRemove.preview);
    images.value.splice(index, 1);
    emitFiles();
    errorMessage.value = "";
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const emitFiles = () => {
  const files = images.value.map((img) => img.file);
  emit("update:images", files);
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Cleanup on unmount
onUnmounted(() => {
  images.value.forEach((img) => {
    URL.revokeObjectURL(img.preview);
  });
});
</script>
