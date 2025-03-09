<template>
  <div class="filter-item">
    <n-select
      v-model:value="localFilter.type"
      :options="filterTypeOptions"
      placeholder="Filter Type"
      size="small"
      style="width: 150px"
      :menu-props="{ style: { minWidth: '150px', width: 'auto' } }"
    />
    <n-select
      v-if="localFilter.type === 'byProperty'"
      v-model:value="localFilter.targetKey"
      :options="
        properties.map((property, index) => ({
          label: property,
          value: property,
          default: index === 0,
        }))
      "
      placeholder="Target Key"
      size="small"
      style="width: 150px"
      :menu-props="{ style: { minWidth: '150px', width: 'auto' } }"
    />
    <n-select
      v-model:value="localFilter.compareMethod"
      :options="
        localFilter.type === 'byProperty'
          ? compareMethodOptionsProperty
          : localFilter.type === 'byId'
          ? compareMethodOptionsId
          : compareMethodOptionsTime
      "
      placeholder="Compare Method"
      size="small"
      style="width: 150px"
      :menu-props="{ style: { minWidth: '150px', width: 'auto' } }"
    />
    <n-input
      v-model:value="localFilter.targetValue"
      placeholder="Target Value"
      size="small"
      style="width: 150px"
    />
    <n-button
      ghost
      size="small"
      type="error"
      @click="handleRemove"
      :bordered="false"
    >
      <n-icon>
        <Icon icon="mingcute:close-circle-fill" />
      </n-icon>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { NSelect, NInput } from "naive-ui";
import { Icon } from "@iconify/vue";

interface Filter {
  type: "byProperty" | "byId" | "byCreationTime" | "byUpdateTime";
  targetKey?: string;
  compareMethod:
    | "isNull"
    | "containsAny"
    | "containsAll"
    | "equal"
    | "notEqual"
    | "lessThan"
    | "lessOrEqual"
    | "greaterThan"
    | "greaterOrEqual"
    | "like"
    | "withinGeoRange";
  targetValue: any;
}

interface FilterModel {
  def: "filter";
  filter: Filter;
}

const props = defineProps<{
  data: FilterModel;
  properties: string[];
}>();

const emit = defineEmits<{
  (e: "remove"): void;
}>();

const localFilter = reactive({
  type: props.data.filter.type || "byProperty",
  targetKey: props.data.filter.targetKey || "",
  compareMethod: props.data.filter.compareMethod || "equal",
  targetValue: props.data.filter.targetValue || "",
});

// Update the original object whenever localFilter changes.
watch(
  () => localFilter,
  (newVal) => {
    props.data.filter = { ...newVal };
  },
  { deep: true }
);

function handleRemove() {
  emit("remove");
}

// Options for the filter type select.
const filterTypeOptions = [
  { label: "byProperty", value: "byProperty" },
  { label: "byId", value: "byId" },
  { label: "byCreationTime", value: "byCreationTime" },
  { label: "byUpdateTime", value: "byUpdateTime" },
];

// Options for the compare method select.
const compareMethodOptionsProperty = [
  { label: "isNull", value: "isNull" },
  { label: "containsAny", value: "containsAny" },
  { label: "containsAll", value: "containsAll" },
  { label: "equal", value: "equal" },
  { label: "notEqual", value: "notEqual" },
  { label: "lessThan", value: "lessThan" },
  { label: "lessOrEqual", value: "lessOrEqual" },
  { label: "greaterThan", value: "greaterThan" },
  { label: "greaterOrEqual", value: "greaterOrEqual" },
  { label: "like", value: "like" },
  { label: "withinGeoRange", value: "withinGeoRange" },
];
const compareMethodOptionsId = [
  { label: "equal", value: "equal" },
  { label: "notEqual", value: "notEqual" },
  { label: "containsAny", value: "containsAny" },
];
const compareMethodOptionsTime = [
  { label: "containsAny", value: "containsAny" },
  { label: "equal", value: "equal" },
  { label: "notEqual", value: "notEqual" },
  { label: "lessThan", value: "lessThan" },
  { label: "lessOrEqual", value: "lessOrEqual" },
  { label: "greaterThan", value: "greaterThan" },
  { label: "greaterOrEqual", value: "greaterOrEqual" },
];
</script>

<style scoped>
.filter-item {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
</style>
