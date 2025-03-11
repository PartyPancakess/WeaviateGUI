<template>
  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="showCollectionCopyModal = true"
  >
    <n-card style="width: 200px; height: 200px" title="Copy Collection">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="unjs:db0" />
        </n-icon>
      </div>
    </n-card>
  </n-button>

  <n-modal
    v-model:show="showCollectionCopyModal"
    title="Copy Collection"
    style="width: 60%; text-align: center"
    :mask-closable="false"
    preset="dialog"
    size="huge"
    role="dialog"
  >
    <p style="display: flex; padding-bottom: 5px">
      Copy the contents of an existing collection to another. If multi-tenancy
      is enabled, same tenants will be created in the target collection, copying
      their contents. If a tenant with the same name is present, contents are
      copied to the existing tenant. If multi-tenancy is disabled, all contents
      (vectors) are copied to the target collection.
    </p>
    <n-card>
      <div style="display: flex; gap: 16px">
        <p style="font-size: medium">Source Collection:</p>
        <n-select
          v-model:value="sourceCollection"
          :options="
            collectionList.map((name) => ({
              label: name,
              value: name,
            }))
          "
          placeholder="Select a collection"
          style="width: 90%"
          filterable
        ></n-select>
      </div>
      <n-divider />
      <div style="display: flex; gap: 16px">
        <p style="font-size: medium">Target Collection:</p>
        <n-select
          v-model:value="targetCollection"
          :options="
            collectionList.map((name) => ({
              label: name,
              value: name,
            }))
          "
          placeholder="Select a collection"
          style="width: 90%"
          filterable
        ></n-select>
      </div>
      <n-divider />
      <div style="display: flex; gap: 16px">
        <n-checkbox v-model:checked="disableTenants">
          Disable Tenants After Done
        </n-checkbox>
      </div>
    </n-card>
    <n-card>
      <div v-if="!processStarted">
        <n-button type="info" :onclick="handleCopyCollection"> Copy </n-button>
      </div>
      <div v-else>
        <p style="display: flex; left: 0">Process Status</p>
        <pre>{{ copyStatus }}</pre>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="tsx">
import { useThemeVars } from "naive-ui";
import { Icon } from "@iconify/vue";
import { useMigrationService } from "../service/migration.service";
import { useVectorSearchService } from "@/views/VectorSearch/service/vector-search.service";

const themeVars = useThemeVars();
const migrationService = useMigrationService();
const vectorSearchService = useVectorSearchService();

const showCollectionCopyModal = ref<boolean>(false);
const collectionList = ref<string[]>([]);

const sourceCollection = ref<string>("");
const targetCollection = ref<string>("");

const copyStatus = ref<string>("");

const disableTenants = ref<boolean>(false);

const processStarted = ref<boolean>(false);

async function getData() {
  collectionList.value = await vectorSearchService.getCollectionNames();
}

getData();

async function handleCopyCollection() {
  processStarted.value = true;

  const processId = await migrationService.copyCollection(
    sourceCollection.value,
    targetCollection.value,
    disableTenants.value
  );

  const eventSource = migrationService.createEventSource(processId);

  eventSource.onmessage = (event) => {
    copyStatus.value = copyStatus.value + `${event.data}\n`;
  };

  eventSource.onerror = (err) => {
    if ("isTrusted" in err) {
      if (err.isTrusted !== true) {
        copyStatus.value =
          copyStatus.value + `SSE error: ${JSON.stringify(err)}`;
      }
    }
    eventSource.close();
  };
}
</script>

<style scoped></style>
