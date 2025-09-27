<!-- SearchableSelect.vue - Generic searchable input component -->
<template>
  <div class="relative">
    <input
      ref="searchInput"
      type="text"
      v-model="searchQuery"
      :placeholder="placeholder"
      class="input input-bordered w-full pr-10"
      @focus="showDropdown = true"
      @blur="handleBlur"
      @keydown="handleKeydown"
      autocomplete="off"
    />

    <!-- Search icon -->
    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
      <svg
        class="h-5 w-5 text-base-content/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <!-- Loading indicator -->
    <div
      v-if="loading"
      class="absolute inset-y-0 right-8 pr-3 flex items-center"
    >
      <div class="loading loading-spinner loading-xs"></div>
    </div>

    <!-- Dropdown results -->
    <div
      v-show="
        showDropdown && (filteredItems.length > 0 || searchQuery.length > 0)
      "
      class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-box shadow-lg max-h-60 overflow-auto"
    >
      <div v-if="loading" class="p-3 text-center text-base-content/60">
        <div class="loading loading-spinner loading-sm mr-2"></div>
        Searching...
      </div>

      <div
        v-else-if="filteredItems.length === 0 && searchQuery.length > 0"
        class="p-3 text-center text-base-content/60"
      >
        No results found for "{{ searchQuery }}"
        <div v-if="allowCreate" class="mt-2">
          <button
            type="button"
            @click="handleCreate"
            class="btn btn-sm btn-outline btn-primary"
          >
            <svg
              class="w-4 h-4 mr-1"
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
            Create "{{ searchQuery }}"
          </button>
        </div>
      </div>

      <div v-else>
        <div
          v-for="(item, index) in filteredItems"
          :key="getItemId(item)"
          @mousedown="selectItem(item)"
          @mouseover="highlightedIndex = index"
          :class="[
            'p-3 cursor-pointer border-b border-base-300 last:border-b-0 hover:bg-base-200',
            { 'bg-primary/10': highlightedIndex === index },
          ]"
        >
          <div class="font-medium">{{ getItemDisplay(item) }}</div>
          <div
            v-if="getItemSubtitle(item)"
            class="text-sm text-base-content/60"
          >
            {{ getItemSubtitle(item) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from "vue";

interface Props {
  items: any[];
  placeholder?: string;
  displayKey: string;
  subtitleKey?: string;
  idKey?: string;
  searchKeys?: string[];
  modelValue?: any;
  loading?: boolean;
  allowCreate?: boolean;
  minSearchLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search...",
  idKey: "id",
  searchKeys: () => [],
  loading: false,
  allowCreate: false,
  minSearchLength: 0,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "create", query: string): void;
}>();

const searchInput = ref<HTMLInputElement>();
const searchQuery = ref("");
const showDropdown = ref(false);
const highlightedIndex = ref(-1);

const filteredItems = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < props.minSearchLength) {
    return props.items;
  }

  const query = searchQuery.value.toLowerCase();
  const searchInKeys =
    props.searchKeys.length > 0 ? props.searchKeys : [props.displayKey];

  return props.items.filter((item) => {
    return searchInKeys.some((key) => {
      const value = getNestedValue(item, key);
      return value && value.toString().toLowerCase().includes(query);
    });
  });
});

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

const getItemId = (item: any): string => {
  return getNestedValue(item, props.idKey) || item.id;
};

const getItemDisplay = (item: any): string => {
  return getNestedValue(item, props.displayKey) || "";
};

const getItemSubtitle = (item: any): string => {
  return props.subtitleKey ? getNestedValue(item, props.subtitleKey) || "" : "";
};

const selectItem = (item: any) => {
  searchQuery.value = getItemDisplay(item);
  showDropdown.value = false;
  highlightedIndex.value = -1;
  emit("update:modelValue", item);
};

const handleBlur = () => {
  // Delay hiding dropdown to allow for item selection
  setTimeout(() => {
    showDropdown.value = false;
    highlightedIndex.value = -1;
  }, 150);
};

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredItems.value.length - 1
      );
      break;
    case "ArrowUp":
      event.preventDefault();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      if (
        highlightedIndex.value >= 0 &&
        filteredItems.value[highlightedIndex.value]
      ) {
        selectItem(filteredItems.value[highlightedIndex.value]);
      }
      break;
    case "Escape":
      showDropdown.value = false;
      highlightedIndex.value = -1;
      searchInput.value?.blur();
      break;
  }
};

const handleCreate = () => {
  emit("create", searchQuery.value);
  showDropdown.value = false;
};

// Watch for changes in modelValue to update search query
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      searchQuery.value = getItemDisplay(newValue);
    } else {
      searchQuery.value = "";
    }
  },
  { immediate: true }
);

// Reset highlighted index when filtered items change
watch(filteredItems, () => {
  highlightedIndex.value = -1;
});
</script>
