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
              @update:value="onTenantChange"
              filterable
            ></n-select>
          </div>
        </div>
        <div>
          <!-- Buttons to trigger rendering with different methods -->
          <div
            style="
              margin-bottom: 16px;
              margin-top: 20px;
              display: flex;
              flex-wrap: wrap;
              gap: 16px;
            "
          >
            <n-button @click="renderChart('PCA', vectorList)"
              >Render with PCA</n-button
            >
            <n-button @click="renderChart('UMAP', vectorList)"
              >Render with UMAP</n-button
            >
          </div>
          <!-- Chart container -->
          <div
            ref="chart"
            style="
              width: 100%;
              max-width: 900px;
              height: 600px;
              border: 1px solid #ccc;
            "
          ></div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="tsx">
import { useVectorService } from "@/services/vector.service";
import { useVisualizeService } from "./service/visualize.service";

const visualizeService = useVisualizeService();
const vectorService = useVectorService();

const chart = ref<HTMLDivElement | null>(null);

const collectionList = ref<string[]>([]);
const tenantList = ref<string[] | undefined>(undefined);

const selectedCollection = ref<string>("");
const selectedTenant = ref<string | undefined>(undefined);

const vectorList = ref<number[][]>([]);

async function getData() {
  collectionList.value = await visualizeService.getCollectionNames();
}

getData();

async function onCollectionChange(collection: string) {
  selectedTenant.value = undefined;
  selectedCollection.value = collection;
  const tenants = await visualizeService.getTenantNames(collection);
  tenantList.value = tenants;
  if (tenants == null) {
    try {
      const vectors = await vectorService.getVectorList({
        collectionName: collection,
        includeVector: true,
      });
      vectorList.value = vectors.map(
        (vector) => Object.values(vector.vectors)[0]
      ) as number[][];
    } catch (error) {
      vectorList.value = [];
    }
  }
}

async function onTenantChange(tenant: string) {
  selectedTenant.value = tenant;
  tenantList.value = await visualizeService.getTenantNames(
    selectedCollection.value
  );

  try {
    const vectors = await vectorService.getVectorList({
      collectionName: selectedCollection.value,
      tenantName: tenant,
      includeVector: true,
    });
    vectorList.value = vectors.map(
      (vector) => Object.values(vector.vectors)[0]
    ) as number[][];
  } catch (error) {
    vectorList.value = [];
  }
}

async function renderChart(method: "PCA" | "UMAP", vectorList: number[][]) {
  try {
    await visualizeService.createVisuals(method, chart.value, vectorList);
  } catch (e: any) {
    console.log(e);
  }
}
</script>

<style scoped></style>
