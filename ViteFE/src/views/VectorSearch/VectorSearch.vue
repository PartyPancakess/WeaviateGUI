<template>
  <n-card style="margin-bottom: 16px">
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between">
      <div style="display: flex; flex-direction: column; gap: 16px; flex: 1">
        <div style="margin-top: 16px">
          <div style="display: flex; gap: 16px">
            <p>Collections:</p>
            <n-select
              v-model:value="selectedCollection"
              :options="
                collectionList.map((name) => ({
                  label: name,
                  value: name,
                }))
              "
              placeholder="Select a collection"
              style="width: 20%"
              @update:value="onCollectionChange"
              filterable
            ></n-select>
          </div>
          <div
            v-if="tenantList && tenantList.length > 0"
            style="display: flex; gap: 16px; margin-top: 20px"
          >
            <p>Tenants:</p>
            <n-select
              v-model:value="selectedTenant"
              :options="
                tenantList.map((name) => ({
                  label: name,
                  value: name,
                }))
              "
              placeholder="Select a tenantList"
              style="width: 20%"
              filterable
            ></n-select>
          </div>
        </div>
        <div>
          <n-space>
            <n-radio
              :checked="checkedValue === 'nearText'"
              value="nearText"
              @change="checkedValue = 'nearText'"
            >
              Near Text
            </n-radio>
            <n-radio
              :checked="checkedValue === 'nearVector'"
              :value="`nearVector`"
              @change="checkedValue = 'nearVector'"
            >
              Near Vector
            </n-radio>
          </n-space>

          <div style="overflow: auto; margin-top: 20px">
            <n-space vertical>
              <Vectors
                :collectionName="selectedCollection"
                :tenantName="selectedTenant"
                :searchType="(checkedValue as ('nearText' | 'nearVector'| 'keyword'))"
              />
            </n-space>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="tsx">
import { useVectorSearchService } from "./service/vector-search.service";

const checkedValue = ref<"nearText" | "nearVector" | "keyword">("nearText");

const vectorSearchService = useVectorSearchService();

const collectionList = ref<string[]>([]);
const tenantList = ref<string[] | undefined>(undefined);

const selectedCollection = ref<string>("");
const selectedTenant = ref<string | undefined>(undefined);

async function getData() {
  collectionList.value = await vectorSearchService.getCollectionNames();
}

getData();

async function onCollectionChange(collection: string) {
  selectedTenant.value = undefined;
  selectedCollection.value = collection;
  tenantList.value = await vectorSearchService.getTenantNames(collection);
}
</script>

<style scoped></style>
