<template>
  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="showTenantCloneModal = true"
  >
    <n-card style="width: 200px; height: 200px" title="Clone Tenant">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="fluent:bot-16-regular" />
        </n-icon>
      </div>
    </n-card>
  </n-button>

  <n-modal
    v-model:show="showTenantCloneModal"
    title="Clone Tenant"
    style="width: 60%; text-align: center"
    :mask-closable="false"
    preset="dialog"
    size="huge"
    role="dialog"
  >
    <p style="display: flex; padding-bottom: 5px">
      Create a new tenant with the contents of an existing tenant.
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
          @update:value="onCollectionChange"
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
          filterable
        ></n-select>
      </div>
      <n-divider />
      <div style="display: flex; gap: 16px">
        <p style="font-size: medium">Source Tenant:</p>
        <n-select
          v-model:value="sourceTenant"
          :options="
            tenantList.map((name) => ({
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
        <p style="font-size: medium">Target Tenant Name:</p>
        <n-input v-model:value="targetTenant" type="text" placeholder="" />
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
        <n-button type="info" :onclick="handleCloneTenant"> Clone </n-button>
      </div>
      <div
        v-else
        style="max-height: 300px; overflow-y: auto"
        ref="scrollContainer"
        @scroll="handleScroll"
      >
        <p style="display: flex; left: 0">Process Status</p>
        <pre>{{ cloneStatus }}</pre>
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

const showTenantCloneModal = ref<boolean>(false);
const collectionList = ref<string[]>([]);
const tenantList = ref<string[]>([]);

const sourceCollection = ref<string>("");
const targetCollection = ref<string>("");
const sourceTenant = ref<string>("");
const targetTenant = ref<string>("");

const cloneStatus = ref<string>("");

const disableTenants = ref<boolean>(false);

const processStarted = ref<boolean>(false);

async function getData() {
  collectionList.value = await vectorSearchService.getCollectionNames();
}

getData();

async function onCollectionChange(collection: string) {
  sourceCollection.value = collection;
  const tenants = await vectorSearchService.getTenantNames(collection);
  tenantList.value = tenants ?? [];
}

async function handleCloneTenant() {
  processStarted.value = true;

  const processId = await migrationService.cloneTenant(
    sourceCollection.value,
    targetCollection.value,
    sourceTenant.value,
    targetTenant.value,
    disableTenants.value
  );

  const eventSource = migrationService.createEventSource(processId);

  eventSource.onmessage = (event) => {
    cloneStatus.value = cloneStatus.value + `${event.data}\n`;
  };

  eventSource.onerror = (err) => {
    if ("isTrusted" in err) {
      if (err.isTrusted !== true) {
        cloneStatus.value =
          cloneStatus.value + `SSE error: ${JSON.stringify(err)}`;
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

watch(cloneStatus, async () => {
  await nextTick(); // Wait for the DOM to update
  if (isScrolledToBottom.value) {
    scrollToBottom();
  }
});
</script>

<style scoped></style>
