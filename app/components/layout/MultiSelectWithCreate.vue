<!-- MultiSelectWithCreate.vue - Multi-select with custom option creation -->
<template>
  <div class="form-control">
    <div class="tooltip tooltip-right" :data-tip="tooltip">
      <label class="label">
        <span class="label-text"
          >{{ label }} <span v-if="required" class="text-error">*</span></span
        >
        <span class="label-text-alt">
          {{
            selectedOptions.length > 0
              ? `${selectedOptions.length} selected`
              : "Select options"
          }}
        </span>
      </label>
    </div>

    <!-- Selected Options Display -->
    <div
      v-if="selectedOptions.length > 0"
      class="mb-3 p-3 bg-primary/10 rounded-box"
    >
      <div class="text-sm font-medium text-primary mb-2">
        Selected Conditions:
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="option in selectedOptions"
          :key="option"
          class="badge badge-primary badge-sm gap-1"
        >
          {{ option }}
          <button
            type="button"
            @click="removeOption(option)"
            class="text-primary-content/60 hover:text-primary-content"
            :title="`Remove ${option}`"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Options Grid -->
    <div
      class="grid grid-cols-1 gap-2 p-4 border border-base-300 rounded-box bg-base-50"
    >
      <div
        v-for="option in availableOptions"
        :key="option"
        class="form-control"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            class="checkbox checkbox-primary"
            :value="option"
            :checked="selectedOptions.includes(option)"
            @change="toggleOption(option)"
          />
          <span class="label-text">{{ option }}</span>
        </label>
      </div>
    </div>

    <!-- Add Custom Option -->
    <div class="mt-3">
      <div class="join w-full">
        <input
          v-model="newOption"
          type="text"
          placeholder="Add custom condition..."
          class="input input-bordered join-item flex-1"
          @keydown.enter.prevent="addCustomOption"
          maxlength="100"
        />
        <button
          type="button"
          @click="addCustomOption"
          :disabled="!newOption.trim()"
          class="btn btn-primary join-item"
          title="Add custom option"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add
        </button>
      </div>
      <div class="label">
        <span class="label-text-alt text-xs text-base-content/60">
          💡 Add any custom condition that's not listed above
        </span>
      </div>
    </div>

    <!-- Helper Text -->
    <div class="label">
      <span class="label-text-alt text-xs text-base-content/60">
        {{ helperText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  label: string;
  options: string[];
  modelValue: string[];
  required?: boolean;
  tooltip?: string;
  helperText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  tooltip: "",
  helperText: "Select all conditions that apply",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const newOption = ref("");

const selectedOptions = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const availableOptions = computed(() => {
  // Combine default options with any custom options that were previously selected
  const allOptions = [...props.options];

  // Add any selected options that aren't in the default list (custom options)
  selectedOptions.value.forEach((option) => {
    if (!allOptions.includes(option)) {
      allOptions.push(option);
    }
  });

  return allOptions;
});

const toggleOption = (option: string) => {
  const current = [...selectedOptions.value];
  const index = current.indexOf(option);

  if (index > -1) {
    current.splice(index, 1);
  } else {
    current.push(option);
  }

  selectedOptions.value = current;
};

const removeOption = (option: string) => {
  selectedOptions.value = selectedOptions.value.filter((o) => o !== option);
};

const addCustomOption = () => {
  const trimmed = newOption.value.trim();

  if (!trimmed) return;

  // Check if option already exists (case insensitive)
  const exists = availableOptions.value.some(
    (option) => option.toLowerCase() === trimmed.toLowerCase()
  );

  if (exists) {
    alert("This condition already exists");
    return;
  }

  // Add to selected options
  selectedOptions.value = [...selectedOptions.value, trimmed];

  // Clear input
  newOption.value = "";
};
</script>
