<template>
  <p
    v-if="props.searchType === undefined || props.searchType === 'keyword'"
    :style="{ fontSize: '80%' }"
  >
    Total Vector Count: {{ formData.length === 0 ? 0 : pagination.itemCount }}
  </p>
  <div v-else style="display: flex; align-items: center">
    <span style="font-size: 90%">max distance:</span>
    <n-input-number
      v-model:value="maxDistanceFilter"
      style="width: 100px; margin-left: 8px"
      :min="0"
      :max="1"
      step="0.1"
      placeholder=""
    />
  </div>

  <!-- <div v-if="loading" class="loading-screen">
    <n-spin size="large" />
  </div> -->
  <div>
    <!-- Table Controls -->
    <div style="margin-top: 1rem">
      <n-space style="width: 100%; justify-content: space-between">
        <n-space>
          <n-button type="info" @click="clearFilters">Clear Filters</n-button>

          <n-input
            v-model:value="searchQuery"
            :placeholder="`Search by ${
              props.searchType === 'nearText'
                ? 'Text'
                : props.searchType === 'nearVector'
                ? 'Vector'
                : 'Keyword'
            }`"
            style="width: 250px"
          />
          <n-button type="primary" @click="handleSearch">Search</n-button>

          <n-button
            strong
            secondary
            round
            type="info"
            @click="showFilter = true"
            >Filter</n-button
          >

          <n-button
            strong
            secondary
            round
            style="margin-left: 20px"
            :disabled="checkedRowKeys.length !== 1"
            v-on:click="updateSelectedVectorModalShow = true"
            >Update</n-button
          >

          <n-button
            strong
            secondary
            round
            type="error"
            style="margin-left: 20px"
            v-on:click="deleteSelectedVectorsModalShow = true"
            >Delete Selected</n-button
          >
          <n-button
            round
            type="error"
            style="opacity: 80%"
            v-on:click="deleteAllVectorsModalShow = true"
            >Delete All Vectors</n-button
          >
        </n-space>

        <n-button
          strong
          secondary
          round
          type="info"
          style="margin-left: auto"
          v-on:click="addVectorModalShow = true"
          >Add Vector</n-button
        >
      </n-space>
    </div>

    <n-p :style="{ fontSize: '80%' }">
      You have selected {{ checkedRowKeys.length }} row{{
        checkedRowKeys.length === 1 ? "" : "s"
      }}.
    </n-p>

    <n-data-table
      remote
      :bordered="false"
      :single-line="false"
      ref="table"
      :columns="columns"
      :data="formData"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
      v-model:checked-row-keys="checkedRowKeys"
      @update:page="handlePageChange"
      @update:checked-row-keys="handleCheck"
    />
  </div>

  <n-modal v-model:show="vectorModalShow" title="Vector">
    <n-card
      style="width: 600px; max-height: 80vh; overflow-y: auto"
      title="Vector"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-code
        :code="JSON.stringify(vectorModalContent, null, 2)"
        language="javascript"
        :style="{ fontSize: '80%' }"
      />
    </n-card>
  </n-modal>

  <n-modal v-model:show="showFilter" display-directive="show">
    <n-card
      style="width: 600px; text-align: center"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <FilterBuilder
        :filterGroup="filterGroup"
        :properties="
          vectorList.length > 0 ? properties.map((prop) => prop.name) : []
        "
      />
      <n-button
        strong
        secondary
        style="right: 10px; bottom: 0; position: absolute; margin-bottom: 5px"
        @click="applyFilter"
        >Apply Filter</n-button
      >
    </n-card>
  </n-modal>

  <n-modal v-model:show="addVectorModalShow">
    <n-card
      style="width: 600px; text-align: center"
      title="Add Vector"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="addVectorForm" label-placement="left" label-width="120px">
        <div
          v-for="(property, index) in properties.map((prop) => prop.name)"
          :key="index"
        >
          <n-form-item :label="property" :path="`properties.${property}`">
            <n-input
              v-model:value="newVector.properties[property]"
              :placeholder="`Enter ${property}`"
            />
          </n-form-item>
        </div>
        <n-divider />

        <n-form-item label="Custom ID" path="customId">
          <n-input
            v-model:value="newVector.customId"
            placeholder="Enter custom ID (optional)"
          />
        </n-form-item>
        <n-form-item label="Vectors" path="vectors">
          <n-input
            v-model:value="newVectorVectorField"
            type="textarea"
            :rows="5"
            placeholder="Enter vectors (optional)"
          />
        </n-form-item>

        <n-button type="primary" @click="addVector">Add Vector</n-button>
      </n-form>
    </n-card>
  </n-modal>

  <n-modal v-model:show="updateSelectedVectorModalShow">
    <n-card
      style="width: 600px; text-align: center"
      title="Update Vector"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="updateVectorForm" label-placement="left" label-width="120px">
        <div
          v-for="(property, index) in properties.map((prop) => prop.name)"
          :key="index"
        >
          <n-form-item :label="property" :path="`properties.${property}`">
            <n-input
              v-model:value="updateVector.properties[property]"
              :placeholder="`Enter ${property}`"
            />
          </n-form-item>
        </div>
        <n-divider />

        <n-checkbox
          v-model:checked="updateVectorEnableVectors"
          style="margin-bottom: 8px"
        >
          Update Vectors Manually
        </n-checkbox>
        <n-form-item label="Vectors" path="vectors">
          <n-input
            v-model:value="updateVectorVectorField"
            type="textarea"
            :rows="5"
            placeholder="Enter vectors (optional)"
            :disabled="!updateVectorEnableVectors"
          />
        </n-form-item>

        <n-button type="primary" @click="updateSelectedVector">Update</n-button>
      </n-form>
    </n-card>
  </n-modal>

  <n-modal
    style="width: 600px"
    v-model:show="deleteSelectedVectorsModalShow"
    :mask-closable="false"
    size="huge"
    preset="dialog"
    title="Delete Vectors"
    content="Are you sure you want to delete the selected vectors?"
    positive-text="Confirm"
    negative-text="Cancel"
    @positive-click="deleteSelectedVectors"
  />

  <n-modal
    style="width: 600px"
    v-model:show="deleteAllVectorsModalShow"
    :mask-closable="false"
    size="huge"
    preset="dialog"
    title="Delete All"
    content="Are you sure you want to delete all vectors of this Collection/Tenant?"
    positive-text="Confirm"
    negative-text="Cancel"
    @positive-click="deleteAllVectors"
  />
</template>

<script setup lang="tsx">
import { FilterGroupModel } from "@/interface/filter.interface";
import { useVectorService } from "@/services/vector.service";
import { DataTableRowKey } from "naive-ui";
import { RowData } from "naive-ui/es/data-table/src/interface";
import { ref } from "vue";
import { watch } from "vue";

const vectorService = useVectorService();

const loading = ref<boolean>(false);
const showFilter = ref<boolean>(false);

const vectorModalShow = ref<boolean>(false);
const vectorModalContent = ref<any>({});

const addVectorModalShow = ref<boolean>(false);
const updateSelectedVectorModalShow = ref<boolean>(false);
const deleteSelectedVectorsModalShow = ref<boolean>(false);
const deleteAllVectorsModalShow = ref<boolean>(false);
const props = defineProps<{
  collectionName: string;
  tenantName?: string;
  searchType?: "keyword" | "nearText" | "nearVector";
}>();

watch([() => props.collectionName], () => {
  getProperties();
});

const vectorList = ref<any[]>([]);
const formData = ref<any[]>([]);
const checkedRowKeys = ref<DataTableRowKey[]>([]);

const searchQuery = ref<string>("");

const properties = ref<{ name: string; dataType: string }[]>([]);

const newVector = ref<{
  properties: { [key: string]: any };
  customId?: string;
  vectors?: number[] | { [key: string]: number[] };
}>({ properties: {} });
const newVectorVectorField = ref<string>("");

// Update Vector Related Refs
const updateVector = ref<{
  properties: { [key: string]: any };
  vectorId?: string;
  vectors?: number[] | { [key: string]: number[] };
}>({ properties: {} });
const updateVectorVectorField = ref<string>("");
const updateVectorEnableVectors = ref<boolean>(false);

const filterGroup = ref<FilterGroupModel>({
  def: "filterGroup",
  type: "and",
  filters: [],
});

const activeFilter = ref<FilterGroupModel | undefined>(undefined);

const maxDistanceFilter = ref<number | null>(null);

const pagination = ref<{
  [key: string]: any;
}>({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 1,
  showSizePicker: true,
  pageSizes: [1, 2, 10, 20, 50, 100],
  onChange: (page: number) => {
    handlePageChange(page);
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize;
    handlePageChange(1);
  },
});

const columns = ref<any[]>([
  {
    type: "selection",
  },
  {
    title: "UUID",
    key: "uuid",
  },
  {
    title: "Properties",
    key: "properties",
    children: [],
  },
  {
    title: "Metadata",
    key: "metadata",
    children: [],
  },
  {
    title: "Vector",
    key: "vector",
    render(row: RowData) {
      return (
        <n-button size="small" onClick={() => openVectorModal(row.vector)}>
          Show
        </n-button>
      );
    },
  },
]);

const rowKey = (row: RowData) => row.uuid;

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys;
}

async function handlePageChange(currentPage: number) {
  if (!loading.value) {
    loading.value = true;
    try {
      let [vectorCount, vectors] = await Promise.all([
        vectorService.getVectorCount({
          collectionName: props.collectionName,
          tenantName: props.tenantName,
          query: searchQuery.value.length > 0 ? searchQuery.value : undefined,
          filter: activeFilter.value,
          searchType: props.searchType,
        }),
        vectorService.getVectorList({
          collectionName: props.collectionName,
          tenantName: props.tenantName,
          includeVector: true,
          query: searchQuery.value.length > 0 ? searchQuery.value : undefined,
          limit: pagination.value.pageSize,
          offset: pagination.value.pageSize * (currentPage - 1),
          filter: activeFilter.value,
          searchType: props.searchType,
          maxDistance: maxDistanceFilter.value,
        }),
      ]);

      if (vectorCount === undefined) vectorCount = vectorList.value.length;

      pagination.value.page = currentPage;
      pagination.value.pageCount = Math.ceil(
        vectorCount / pagination.value.pageSize
      );
      pagination.value.itemCount = vectorCount;

      vectorList.value = vectors;
      fillForm(vectorList.value);

      loading.value = false;
    } catch (error) {}
  }
}

async function getData() {
  if (props.collectionName.length === 0) {
    return;
  }
  loading.value = true;
  try {
    let [vectorCount, vectors] = await Promise.all([
      vectorService.getVectorCount({
        collectionName: props.collectionName,
        tenantName: props.tenantName,
        query: searchQuery.value.length > 0 ? searchQuery.value : undefined,
        filter: activeFilter.value,
        searchType: props.searchType,
      }),
      vectorService.getVectorList({
        collectionName: props.collectionName,
        tenantName: props.tenantName,
        includeVector: true,
        query: searchQuery.value.length > 0 ? searchQuery.value : undefined,
        limit: pagination.value.pageSize,
        offset: 0,
        filter: activeFilter.value,
        searchType: props.searchType,
        maxDistance: maxDistanceFilter.value,
      }),
    ]);

    if (vectorCount === undefined) vectorCount = vectorList.value.length;

    vectorList.value = vectors;
    pagination.value.itemCount = vectorCount;
    pagination.value.page = 1;
    pagination.value.pageCount = Math.ceil(
      vectorCount / pagination.value.pageSize
    );

    const propList = await getProperties();

    // Calculate the width of each property column, might change the logic later
    // Not sure if this is the best way to calculate the width of each property column, and track it
    const childWidth = ref((window.innerWidth * 0.4) / propList.length);

    window.addEventListener("resize", () => {
      childWidth.value = (window.innerWidth * 0.4) / propList.length;
    });

    // Set columns with properties
    columns.value[2].children = propList.map((property) => ({
      title: property.name,
      key: property.name,
      width: childWidth,
      render(row) {
        return (
          <div style="max-height: 200px; overflow-y: auto;">
            {row[property.name]}
          </div>
        );
      },
    }));

    // Set Metadata fields
    if (vectors.length > 0) {
      columns.value[3].children = Object.keys(vectors[0].metadata).map(
        (property) => ({
          title: property,
          key: property,
        })
      );
    }

    fillForm(vectorList.value);
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

getData();

function fillForm(data: any[]) {
  formData.value = data.map((item) => {
    const processedProperties = Object.entries(item.properties).reduce(
      (acc: Record<string, any>, [key, value]) => {
        acc[key] =
          value != null && typeof value === "object"
            ? JSON.stringify(value, null, 2)
            : String(value);
        return acc;
      },
      {}
    );

    return {
      uuid: String(item.uuid),
      vector: item.vectors,
      ...processedProperties,
      ...item.metadata,
    };
  });
}

function openVectorModal(vector: any) {
  vectorModalContent.value = vector;
  vectorModalShow.value = true;
}

async function clearFilters() {
  searchQuery.value = "";
  filterGroup.value = {
    def: "filterGroup",
    type: "and",
    filters: [],
  };
  activeFilter.value = undefined;
  maxDistanceFilter.value = 1;
  await getData();
}

async function applyFilter() {
  if (filterGroup.value.filters.length === 0) {
    activeFilter.value = undefined;
  } else {
    activeFilter.value = filterGroup.value;
  }
  await getData();
  showFilter.value = false;
}

async function handleSearch() {
  loading.value = true;
  handleCheck([]);

  try {
    let [vectorCount, vectors] = await Promise.all([
      vectorService.getVectorCount({
        collectionName: props.collectionName,
        tenantName: props.tenantName,
        query: searchQuery.value.length > 0 ? searchQuery.value : undefined,
        filter: activeFilter.value,
        searchType: props.searchType,
      }),
      vectorService.getVectorList({
        collectionName: props.collectionName,
        tenantName: props.tenantName,
        includeVector: true,
        query: searchQuery.value.length > 0 ? searchQuery.value : undefined,
        limit: pagination.value.pageSize,
        offset: 0,
        filter: activeFilter.value,
        searchType: props.searchType,
        maxDistance: maxDistanceFilter.value,
      }),
    ]);

    if (vectorCount === undefined) vectorCount = vectorList.value.length;

    vectorList.value = vectors;
    pagination.value.itemCount = vectorCount;
    pagination.value.page = 1;
    pagination.value.pageCount = Math.ceil(
      vectorCount / pagination.value.pageSize
    );

    // Set columns with properties
    if (vectors.length > 0) {
      const childWidth = ref(
        (window.innerWidth * 0.4) / Object.keys(vectors[0].properties).length
      );

      window.addEventListener("resize", () => {
        childWidth.value =
          (window.innerWidth * 0.4) / Object.keys(vectors[0].properties).length;
      });
      columns.value[2].children = Object.keys(vectors[0].properties).map(
        (property) => ({
          title: property,
          key: property,
          width: childWidth,
          render(row) {
            return (
              <div style="max-height: 200px; overflow-y: auto;">
                {row[property]}
              </div>
            );
          },
        })
      );
    }

    // Set Metadata fields
    if (vectors.length > 0) {
      columns.value[3].children = Object.keys(vectors[0].metadata).map(
        (property) => ({
          title: property,
          key: property,
        })
      );
    }

    fillForm(vectorList.value);
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

async function getProperties() {
  const data = await vectorService.getProperties(
    props.collectionName,
    props.tenantName
  );

  properties.value = data;

  return data;
}

async function addVector() {
  loading.value = true;
  if (newVectorVectorField.value.length > 0) {
    try {
      newVector.value.vectors = JSON.parse(newVectorVectorField.value);
    } catch (e) {
      console.error("Failed to parse vectors:", e);
      return;
    }
  }

  addVectorModalShow.value = false;

  await vectorService.addVector({
    collectionName: props.collectionName,
    tenantName: props.tenantName,
    data: newVector.value,
  });
  await getData();

  loading.value = false;
  newVector.value = { properties: {} };
  newVectorVectorField.value = "";
}

async function updateSelectedVector() {
  loading.value = true;
  updateVector.value.vectorId = checkedRowKeys.value.at(0)?.toString() || "";
  if (
    updateVectorEnableVectors.value &&
    updateVectorVectorField.value.length > 0
  ) {
    try {
      updateVector.value.vectors = JSON.parse(updateVectorVectorField.value);
    } catch (e) {
      console.error("Failed to parse vectors:", e);
      return;
    }
  } else {
    updateVector.value.vectors = undefined;
  }

  updateSelectedVectorModalShow.value = false;

  await vectorService.editVector({
    collectionName: props.collectionName,
    tenantName: props.tenantName,
    ...updateVector.value,
  });
  await getData();

  loading.value = false;
  updateVector.value = { properties: {} };
  updateVectorVectorField.value = "";
}

async function deleteSelectedVectors() {
  await vectorService.deleteVector({
    collectionName: props.collectionName,
    tenantName: props.tenantName,
    vectorIds: checkedRowKeys.value.map((key) => key.toString()),
  });
  deleteSelectedVectorsModalShow.value = false;
  await getData();
}

async function deleteAllVectors() {
  await vectorService.deleteVectors({
    collectionName: props.collectionName,
    tenantName: props.tenantName,
  });
  deleteAllVectorsModalShow.value = false;
  await getData();
}

//
watch(updateSelectedVectorModalShow, (show) => {
  if (show && checkedRowKeys.value.length === 1) {
    const selectedRow = formData.value.find(
      (item) => item.uuid === checkedRowKeys.value[0]
    );
    if (selectedRow) {
      // Initialize the newVector with the selected row data
      updateVector.value = {
        properties: {},
        vectorId: selectedRow.uuid || "",
        vectors: selectedRow.vector,
      };

      // Populate the form properties from the selected row
      properties.value.forEach((prop) => {
        updateVector.value.properties[prop.name] = selectedRow[prop.name] || "";
      });

      // Optionally set the vector field (formatted as JSON)
      updateVectorVectorField.value = JSON.stringify(
        selectedRow.vector,
        null,
        2
      );
    }
  }
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
