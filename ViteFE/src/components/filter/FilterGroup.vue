<template>
  <div class="filter-group">
    <div class="filter-group-header">
      <n-space style="width: 100%">
        <n-select
          v-model:value="props.data.type"
          :options="connectionOptions"
          size="small"
          style="width: 80px; margin-top: 5px; margin-right: 5px"
        />
        <n-button
          v-if="removable"
          size="small"
          type="error"
          @click="handleRemove"
          style="position: absolute; right: 20px"
        >
          <n-icon>
            <Icon icon="hugeicons:cancel-01" />
          </n-icon>
        </n-button>
      </n-space>
    </div>

    <div style="margin-bottom: 40px"></div>
    <div
      class="filter-group-body"
      v-for="(item, index) in props.data.filters"
      :key="item.id"
    >
      <FilterItem
        class="filter-group-body-filter"
        v-if="item.def === 'filter'"
        :data="item as any"
        :properties="properties"
        @remove="removeChild(index)"
      />
      <FilterGroup
        v-else
        :data="item as any"
        :removable="true"
        :properties="properties"
        @remove="removeChild(index)"
      />
    </div>

    <div class="filter-group-footer">
      <n-popover trigger="click" placement="bottom">
        <template #trigger>
          <n-button circle size="small">
            <n-icon>
              <Icon icon="hugeicons:add-01" />
            </n-icon>
          </n-button>
        </template>
        <n-menu :options="menuOptions" @update:value="handleAddOption" />
      </n-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NSelect, NPopover, NMenu, NIcon } from "naive-ui";
import { Icon } from "@iconify/vue";

let nextId = 1;
function generateId() {
  return nextId++;
}

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
  id?: number;
  def: "filter";
  filter: Filter;
}

interface FilterGroupModel {
  id?: number;
  def: "filterGroup";
  type: "and" | "or";
  filters: (FilterGroupModel | FilterModel)[];
}

const props = defineProps<{
  data: FilterGroupModel;
  removable?: boolean;
  properties: string[];
}>();
const { removable = true } = props;
const emit = defineEmits<{
  (e: "remove"): void;
}>();

const connectionOptions = [
  { label: "and", value: "and" },
  { label: "or", value: "or" },
];

// Menu options for adding a new filter or filter group.
const menuOptions = [
  { label: "Add Filter", key: "filter" },
  { label: "Add Filter Group", key: "filterGroup" },
];

// Add a new filter or group based on the selected option.
function handleAddOption(key: string) {
  if (key === "filter") {
    props.data.filters.push({
      id: generateId(),
      def: "filter",
      filter: {
        type: "byProperty", // default filter type
        targetKey: "",
        compareMethod: "equal", // default compare method
        targetValue: "",
      },
    });
  } else if (key === "filterGroup") {
    props.data.filters.push({
      id: generateId(),
      def: "filterGroup",
      type: "and", // default connection type
      filters: [],
    });
  }
}

// Remove a child at the given index from the filters array.
function removeChild(index: number) {
  props.data.filters.splice(index, 1);
}

// Emit a remove event for this filter group (to be caught by its parent).
function handleRemove() {
  emit("remove");
}
</script>

<style scoped>
.filter-group {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.9);
  padding: 8px;
  margin-bottom: 8px;
  position: relative;
}
.filter-group-header {
  position: absolute;
  width: 100%;
}
.filter-group-body {
  margin-top: 20px;
  padding: 4px;
}
.filter-group-body-filter {
  border: 1px solid rgba(204, 204, 204, 0.5);
}
.filter-group-footer {
  border: 1px dashed #ccc;
  margin-top: 20px;
}
</style>
