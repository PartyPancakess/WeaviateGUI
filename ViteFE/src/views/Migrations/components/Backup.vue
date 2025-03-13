<template>
  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="showBackupModal = true"
  >
    <n-card style="width: 200px; height: 200px" title="Backup">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="iconoir:database-backup" />
        </n-icon>
      </div>
    </n-card>
  </n-button>

  <n-modal
    v-model:show="showBackupModal"
    title="Backup"
    style="width: 60%; text-align: center"
    :mask-closable="false"
    preset="dialog"
    size="huge"
    role="dialog"
  >
    <p style="display: flex; padding-bottom: 5px">
      Backup the weaviate instance. If a collection has multi-tenancy enabled,
      the backup will include only the activated tenants. Activate the tenants
      you want to include in the backup. To activate all tenants of the selected
      collections, check below settings. Backup location should be set in the
      weaviate configurations.
    </p>
    <n-card>
      <div style="display: flex; gap: 16px; align-items: center">
        Backend:
        <n-select
          v-model:value="backendValue"
          :options="backendOptions"
          style="width: 20%"
        />
        <n-checkbox v-model:checked="customId">
          Give a custom id to the backup
        </n-checkbox>
        <n-input
          v-model:value="backupId"
          placeholder="Enter custom backup ID"
          :disabled="!customId"
          style="flex: 1"
        />
      </div>
      <n-divider />

      <div style="display: flex; gap: 16px">
        <n-checkbox v-model:checked="enableTenants">
          Enable All Tenants of the Selected Collections
        </n-checkbox>
      </div>
      <n-divider />

      <n-data-table
        remote
        :bordered="false"
        :single-line="false"
        ref="table"
        :columns="columns"
        :data="collectionList"
        :row-key="rowKey"
        v-model:checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="handleCheck"
        style="max-height: 600px; overflow-y: auto"
      />
    </n-card>
    <n-card>
      <div v-if="!processStarted">
        <n-button type="info" :onclick="handleBackup"> Start Backup </n-button>
      </div>
      <div
        v-else
        style="max-height: 300px; overflow-y: auto"
        ref="scrollContainer"
        @scroll="handleScroll"
      >
        <p style="display: flex; left: 0">Process Status</p>
        <pre style="max-width: 100%; overflow-x: auto">{{ backupStatus }}</pre>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="tsx">
import { useThemeVars } from "naive-ui";
import { Icon } from "@iconify/vue";
import { useVectorSearchService } from "@/views/VectorSearch/service/vector-search.service";
import { DataTableRowKey } from "naive-ui";
import { RowData } from "naive-ui/es/data-table/src/interface";
import { useMigrationService } from "../service/migration.service";

const themeVars = useThemeVars();
const vectorSearchService = useVectorSearchService();
const migrationService = useMigrationService();

const customId = ref<boolean>(false);
const showBackupModal = ref<boolean>(false);
const collectionList = ref<any[]>([]);
const backupStatus = ref<string>("");
const enableTenants = ref<boolean>(false);

const processStarted = ref<boolean>(false);

const columns = ref<any[]>([
  {
    type: "selection",
  },
  {
    title: "Collection",
    key: "collection",
  },
]);

const backendOptions = ref<any[]>([
  {
    label: "filesystem",
    value: "filesystem",
  },
  {
    label: "s3",
    value: "s3",
  },
  {
    label: "gcs",
    value: "gcs",
  },
  {
    label: "azure",
    value: "azure",
  },
]);

const backupId = ref<string>("");
const backendValue = ref<"filesystem" | "s3" | "gcs" | "azure">("filesystem");

const rowKey = (row: RowData) => row.collection;
const checkedRowKeys = ref<DataTableRowKey[]>([]);

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys;
}

async function getData() {
  const collections = await vectorSearchService.getCollectionNames();
  collectionList.value = collections.map((coll) => {
    return {
      collection: coll,
    };
  });
}

getData();

async function handleBackup() {
  processStarted.value = true;

  const backupID = customId.value ? backupId.value : undefined;

  const processId = await migrationService.backup(
    checkedRowKeys.value.map((key) => key as string),
    backendValue.value,
    enableTenants.value,
    backupID
  );

  const eventSource = migrationService.createEventSource(processId);

  eventSource.onmessage = (event) => {
    backupStatus.value = backupStatus.value + `${event.data}\n`;
  };

  eventSource.onerror = (err) => {
    if ("isTrusted" in err) {
      if (err.isTrusted !== true) {
        backupStatus.value =
          backupStatus.value + `SSE error: ${JSON.stringify(err)}`;
      }
    }
    eventSource.close();
  };
}

// Scroll Logic

const scrollContainer = ref<HTMLElement | null>(null);
const isScrolledToBottom = ref(true);

// Threshold in pixels
const threshold = 10;

const handleScroll = () => {
  const container = scrollContainer.value;
  if (container) {
    isScrolledToBottom.value =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - threshold;
  }
};

const scrollToBottom = () => {
  const container = scrollContainer.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

watch(backupStatus, async () => {
  await nextTick(); // Wait for the DOM to update
  if (isScrolledToBottom.value) {
    scrollToBottom();
  }
});
</script>

<style scoped></style>
