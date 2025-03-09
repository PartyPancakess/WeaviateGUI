<template>
  <div class="filter-builder">
    <FilterGroup :data="filterGroup" :removable="false" :properties="properties" />
  </div>
</template>

<script setup lang="ts">
import { FilterGroupModel } from "@/interface/filter.interface";
import FilterGroup from "./FilterGroup.vue";

defineProps<{
  filterGroup: FilterGroupModel;
  properties: string[];
}>();
</script>

<style scoped>
.filter-builder {
  padding: 16px;
}
</style>
