<template>
  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="showRestoreModal = true"
  >
    <n-card style="width: 200px; height: 200px" title="Restore">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="iconoir:database-restore" />
        </n-icon>
      </div>
    </n-card>
  </n-button>

  <n-modal
    v-model:show="showRestoreModal"
    title="Restore"
    style="width: 60%; text-align: center"
    :mask-closable="false"
    preset="dialog"
    size="huge"
    role="dialog"
  >
    <n-card>
      <div style="display: flex; gap: 16px; align-items: center">
        Backend:
        <n-select
          v-model:value="backendValue"
          :options="backendOptions"
          style="width: 20%"
        />
        <n-input
          v-model:value="backupId"
          placeholder="Enter backup ID"
          style="flex: 1"
        />
      </div>
    </n-card>
    <n-card>
      <div v-if="!processStarted">
        <n-button type="info" :onclick="handleRestore">
          Start Restore
        </n-button>
      </div>
      <div v-else>
        <p style="display: flex; left: 0">Process Status</p>
        <pre style="max-width: 100%; overflow-x: auto">{{ restoreStatus }}</pre>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="tsx">
import { useThemeVars } from "naive-ui";
import { Icon } from "@iconify/vue";
import { useMigrationService } from "../service/migration.service";

const themeVars = useThemeVars();
const migrationService = useMigrationService();

const showRestoreModal = ref<boolean>(false);
const restoreStatus = ref<string>("");
const processStarted = ref<boolean>(false);

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

async function handleRestore() {
  processStarted.value = true;

  const processId = await migrationService.restore(
    backendValue.value,
    backupId.value
  );

  const eventSource = migrationService.createEventSource(processId);

  eventSource.onmessage = (event) => {
    restoreStatus.value = restoreStatus.value + `${event.data}\n`;
  };

  eventSource.onerror = (err) => {
    if ("isTrusted" in err) {
      if (err.isTrusted !== true) {
        restoreStatus.value =
          restoreStatus.value + `SSE error: ${JSON.stringify(err)}`;
      }
    }
    eventSource.close();
  };
}
</script>

<style scoped></style>
