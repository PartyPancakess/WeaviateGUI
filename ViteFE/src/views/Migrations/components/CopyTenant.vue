<template>
  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="showTenantCopyModal = true"
  >
    <n-card style="width: 200px; height: 200px" title="Copy Tenant">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="fluent:bot-16-regular" />
        </n-icon>
      </div>
    </n-card>
  </n-button>

  <n-modal
    v-model:show="showTenantCopyModal"
    title="Copy Tenant"
    style="width: 60%; text-align: center"
    :mask-closable="false"
    preset="dialog"
    size="huge"
    role="dialog"
  >
    <p style="display: flex; padding-bottom: 5px">
      Copy the contents of an existing tenant to another.
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
          placeholder="Select a source collection"
          style="width: 90%"
          @update:value="onSrcCollectionChange"
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
          placeholder="Select a target collection"
          style="width: 90%"
          @update:value="onTargetCollectionChange"
          filterable
        ></n-select>
      </div>
      <n-divider />
      <div style="display: flex; gap: 16px">
        <p style="font-size: medium">Source Tenant:</p>
        <n-select
          v-model:value="sourceTenant"
          :options="
            srcTenantList.map((name) => ({
              label: name,
              value: name,
            }))
          "
          placeholder="Select a source tenant"
          style="width: 90%"
          filterable
        ></n-select>
      </div>
      <n-divider />
      <div style="display: flex; gap: 16px">
        <p style="font-size: medium">Target Tenant:</p>
        <n-select
          v-model:value="targetTenant"
          :options="
            targetTenantList.map((name) => ({
              label: name,
              value: name,
            }))
          "
          placeholder="Select a target tenant"
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
        <n-button type="info" :onclick="handleCopyTenant"> Copy </n-button>
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

const showTenantCopyModal = ref<boolean>(false);
const collectionList = ref<string[]>([]);
const srcTenantList = ref<string[]>([]);
const targetTenantList = ref<string[]>([]);

const sourceCollection = ref<string>("");
const targetCollection = ref<string>("");
const sourceTenant = ref<string>("");
const targetTenant = ref<string>("");

const copyStatus = ref<string>("");

const disableTenants = ref<boolean>(false);

const processStarted = ref<boolean>(false);

async function getData() {
  collectionList.value = await vectorSearchService.getCollectionNames();
}

getData();

async function onSrcCollectionChange(collection: string) {
  sourceCollection.value = collection;
  const tenants = await vectorSearchService.getTenantNames(collection);
  srcTenantList.value = tenants ?? [];
}

async function onTargetCollectionChange(collection: string) {
  targetCollection.value = collection;
  const tenants = await vectorSearchService.getTenantNames(collection);
  targetTenantList.value = tenants ?? [];
}

async function handleCopyTenant() {
  processStarted.value = true;

  const processId = await migrationService.copyTenant(
    sourceCollection.value,
    targetCollection.value,
    sourceTenant.value,
    targetTenant.value,
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
